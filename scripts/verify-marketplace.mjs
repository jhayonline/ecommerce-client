// Run against a local Chromium started with --remote-debugging-port=9222.
// Fixtures intercept browser requests only; they never modify application data.
import assert from "node:assert/strict";
import fs from "node:fs/promises";
const origin = process.env.UI_TEST_ORIGIN || "http://localhost:8080";
const tabs = await (await fetch("http://127.0.0.1:9222/json/list")).json();
const ws = new WebSocket(tabs[0].webSocketDebuggerUrl);
await new Promise((resolve) => {
  ws.onopen = resolve;
});
let id = 0;
const pending = new Map();
ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  if (message.id) {
    pending.get(message.id)?.(message);
    pending.delete(message.id);
  }
};
const send = (method, params = {}) =>
  new Promise((resolve, reject) => {
    const key = ++id;
    pending.set(key, (message) =>
      message.error
        ? reject(new Error(JSON.stringify(message.error)))
        : resolve(message.result),
    );
    ws.send(JSON.stringify({ id: key, method, params }));
  });
const evaluate = async (expression) => {
  const result = await send("Runtime.evaluate", {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  if (result.exceptionDetails)
    throw new Error(JSON.stringify(result.exceptionDetails));
  return result.result.value;
};
const waitFor = async (expression) => {
  for (let i = 0; i < 60; i++) {
    if (await evaluate(expression)) return;
    await new Promise((r) => setTimeout(r, 100));
  }
  throw new Error(`Timed out: ${expression}`);
};
const viewport = (width, height) =>
  send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: width < 768,
  });
const capture = async (name) => {
  const result = await send("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: true,
  });
  await fs.writeFile(
    `/tmp/phoenix-${name}.png`,
    Buffer.from(result.data, "base64"),
  );
};
await send("Page.enable");
await send("Runtime.enable");
const fixture = `(() => {
 const nativeFetch = window.fetch.bind(window);
 window.fixtureMode = 'success'; window.fixtureCalls = 0; window.fixtureUrls = [];
 const categories = ['Mobile Devices','Computing & Electronics','Fashion & Style','Home & Living','Mobility','Jewelry','Real Estate'].map((name,i)=>({id:String(i),name,slug:name.toLowerCase().replaceAll(' ','-'),level:1,is_active:true,display_order:i}));
 const products = ['Wireless headphones for everyday listening','Red sneakers, ready for your next adventure','A simple wooden stool for your space','A second pair of headphones'].map((title,i)=>({pid:'fixture-'+i,title,price:[850,320,450,620][i],condition:i%2?'New':'Used',location:['Accra, Greater Accra','Kumasi, Ashanti'][i%2],status:'active',average_rating:0}));
 window.fetch = async (input, options) => {
 const url = String(input); if (!url.includes('/api/')) return nativeFetch(input,options);
 window.fixtureCalls++; window.fixtureUrls.push(url);
 if(window.fixtureMode==='failure') return new Response(JSON.stringify({error:'Fixture unavailable'}),{status:503});
 let data=[];
 if(url.includes('/categories/')) data=window.fixtureMode==='empty'?[]:categories;
 else if(url.includes('/products/list')) data={items:window.fixtureMode==='empty'?[]:products,total:window.fixtureMode==='empty'?0:4,page:1,per_page:20,total_pages:1};
 else if(url.includes('/images')) {const n=Number(url.match(/fixture-(\\d)/)?.[1]||0);data=[{is_primary:true,image_url:location.origin+'/images/'+['headphones.jpg','sneakers.jpg','chair.jpg','headphones.jpg'][n]}];}
 else if(url.includes('/price-range')) data={min:0,max:10000};
 return new Response(JSON.stringify(data),{status:200,headers:{'Content-Type':'application/json'}});
 };
})();`;
const injected = await send("Page.addScriptToEvaluateOnNewDocument", {
  source: fixture,
});
try {
  await viewport(1440, 1000);
  await send("Page.navigate", { url: origin });
  await waitFor('document.querySelectorAll(".listing-card").length===4');
  assert.equal(
    await evaluate("document.documentElement.scrollWidth > innerWidth"),
    false,
  );
  assert.equal(
    await evaluate('document.querySelectorAll(".category-tile").length'),
    7,
  );
  assert.equal(
    await evaluate(
      'document.querySelectorAll(".listing-image a button").length',
    ),
    0,
  );
  await capture("populated-desktop");
  // Exercise real input events, clear, focus restoration, and committed URL search.
  await evaluate('document.querySelector("#market-search").focus()');
  await send("Input.insertText", { text: "headphones" });
  await waitFor('Boolean(document.querySelector(".search-clear"))');
  await evaluate('document.querySelector(".search-clear").click()');
  assert.equal(await evaluate("document.activeElement.id"), "market-search");
  assert.equal(
    await evaluate('document.querySelector("#market-search").value'),
    "",
  );
  await send("Input.insertText", { text: "red sneakers" });
  await evaluate('document.querySelector(".hero-search").requestSubmit()');
  await waitFor('location.pathname==="/shop"');
  assert.equal(
    await evaluate('new URLSearchParams(location.search).get("search")'),
    "red sneakers",
  );
  await waitFor('document.querySelectorAll(".listing-card").length===4');
  await capture("shop-desktop");
  // Footer navigation on the already-mounted shop must update the request filter.
  await evaluate(
    'window.fixtureUrls=[]; document.querySelectorAll(".footer-main > div")[1].querySelectorAll("a")[1].click()',
  );
  await waitFor(
    'window.fixtureUrls.some(url => url.includes("/products/list") && new URL(url).searchParams.get("category")==="smartphones")',
  );
  await evaluate(
    'document.querySelectorAll(".footer-main > div")[1].querySelectorAll("a")[2].click()',
  );
  await waitFor(
    'window.fixtureUrls.some(url => url.includes("/products/list") && new URL(url).searchParams.get("category")==="furniture")',
  );

  await send("Page.navigate", { url: origin });
  await waitFor('document.querySelectorAll(".listing-card").length===4');
  await evaluate('document.querySelector(".listing-save").click()');
  await waitFor('document.body.innerText.includes("Login Required")');
  await viewport(390, 844);
  await capture("populated-mobile");
  await evaluate('document.querySelector(".mobile-menu-trigger").click()');
  await waitFor('Boolean(document.querySelector("[role=dialog]"))');
  assert.equal(
    await evaluate(
      'document.querySelector("[role=dialog]").contains(document.activeElement)',
    ),
    true,
  );
  await send("Input.dispatchKeyEvent", {
    type: "keyDown",
    key: "Escape",
    code: "Escape",
    windowsVirtualKeyCode: 27,
  });
  await send("Input.dispatchKeyEvent", {
    type: "keyUp",
    key: "Escape",
    code: "Escape",
    windowsVirtualKeyCode: 27,
  });
  await waitFor('!document.querySelector("[role=dialog]")');
  assert.equal(
    await evaluate('document.activeElement.getAttribute("aria-label")'),
    "Open navigation menu",
  );
  for (const width of [320, 390, 768, 1024, 1440]) {
    await viewport(width, 900);
    assert.equal(
      await evaluate("document.documentElement.scrollWidth > innerWidth"),
      false,
      `Overflow at ${width}`,
    );
  }
  await send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value: "reduce" }],
  });
  assert.equal(
    await evaluate("getComputedStyle(document.documentElement).scrollBehavior"),
    "auto",
  );
  // Switch fixture state and remount to prove empty and failure states.
  await evaluate(
    'window.fixtureMode="empty"; document.querySelector(".desktop-navigation a:nth-child(2)").click()',
  );
  await waitFor('location.pathname==="/shop"');
  await evaluate('document.querySelector(".brand-wordmark").click()');
  await waitFor('document.body.innerText.includes("No finds here just yet.")');
  await evaluate(
    'window.fixtureMode="failure"; document.querySelector(".desktop-navigation a:nth-child(2)").click()',
  );
  await waitFor('location.pathname==="/shop"');
  await evaluate('document.querySelector(".brand-wordmark").click()');
  await waitFor(
    'document.body.innerText.includes("We couldn’t load the latest finds.")',
  );
  const before = await evaluate("window.fixtureCalls");
  await evaluate(
    'window.fixtureMode="success"; document.querySelector(".fresh-section .market-button").click()',
  );
  await waitFor('document.querySelectorAll(".listing-card").length===4');
  assert.ok((await evaluate("window.fixtureCalls")) > before);
  console.log(
    "PASS: populated, empty, failure/retry, search/clear, guest save, menu focus/Escape, reduced motion, and five responsive widths. Browser-only fixtures; live backend unverified.",
  );
} finally {
  await send("Page.removeScriptToEvaluateOnNewDocument", {
    identifier: injected.identifier,
  });
  await send("Emulation.setEmulatedMedia", { features: [] });
  ws.close();
}
