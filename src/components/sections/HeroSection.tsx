import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Search, X, MapPin } from "lucide-react";

export default function HeroSection() {
  const [query, setQuery] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  return (
    <section className="market-hero" aria-labelledby="hero-title">
      <div className="market-container hero-layout">
        <div className="hero-copy">
          <p className="eyebrow"><span className="brand-dot" /> YOUR WORLD. YOUR MARKETPLACE.</p>
          <h1 id="hero-title">Good finds.<br />Great <span>possibilities.</span></h1>
          <p className="hero-description">A fresh find. A new beginning. Discover what’s next from sellers across Ghana.</p>
          <form className="hero-search" role="search" noValidate onSubmit={(event) => { event.preventDefault(); navigate(query.trim() ? `/shop?search=${encodeURIComponent(query.trim())}` : "/shop"); }}>
            <Search size={21} aria-hidden="true" />
            <label className="sr-only" htmlFor="market-search">Search the marketplace</label>
            <input id="market-search" ref={input} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="What are you looking for?" type="search" />
            {query && <button type="button" className="search-clear" aria-label="Clear search" onClick={() => { setQuery(""); input.current?.focus(); }}><X size={17} /></button>}
            <button className="search-submit" type="submit"><span>Search</span><ArrowRight size={18} /></button>
          </form>
          <div className="hero-popular"><span>Explore</span>{[["Phones", "smartphones"], ["Fashion", "men"], ["Furniture", "furniture"]].map(([name, slug]) => <Link key={slug} to={`/shop?category=${slug}`}>{name}<ArrowUpRight size={12} /></Link>)}</div>
          <p className="hero-local"><MapPin size={15} /> From Accra to everywhere in Ghana.</p>
        </div>
        <div className="hero-editorial" aria-label="Explore marketplace categories">
          <Link to="/shop?category=laptops" className="editorial-card editorial-main">
            <img src="/images/headphones.jpg" alt="Over-ear headphones illustrating electronics" fetchPriority="high" />
            <span className="editorial-tag">EVERYDAY, UPGRADED</span>
            <div className="editorial-caption"><div><small>TECH & ELECTRONICS</small><strong>Find your frequency.</strong></div><span className="editorial-arrow"><ArrowUpRight size={23} /></span></div>
          </Link>
          <Link to="/shop?category=men" className="editorial-card editorial-style"><img src="/images/sneakers.jpg" alt="Red sneakers illustrating fashion" /><div className="editorial-caption"><div><small>FASHION & STYLE</small><strong>Make your move.</strong></div><ArrowUpRight size={21} /></div></Link>
          <Link to="/shop?category=furniture" className="editorial-card editorial-home"><img src="/images/chair.jpg" alt="Modern chair illustrating home and living" /><div className="editorial-caption"><div><small>HOME & LIVING</small><strong>A space that’s you.</strong></div><ArrowUpRight size={21} /></div></Link>
          <div className="editorial-note"><span className="brand-dot" /> A little inspiration. A lot to discover.</div>
        </div>
      </div>
    </section>
  );
}
