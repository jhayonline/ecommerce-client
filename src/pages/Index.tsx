import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowRight, MapPin, MessageCircle, Plus, ShoppingBag } from "lucide-react";
import Header from "@/components/layout/Header";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import HeroSection from "@/components/sections/HeroSection";
import CategoriesSection from "@/components/sections/CategoriesSection";
import ProductGrid from "@/components/sections/ProductGrid";
import Footer from "@/components/layout/Footer";
import { productsApi, imagesApi } from "@/lib/api";
import { getAssetUrl } from "@/lib/api/config";

export default function Index() {
  const [viewMode, setViewMode] = useState("3");
  const { data: products = [], isPending, isError, refetch } = useQuery({
    queryKey: ["homepage-listings"],
    retry: false,
    queryFn: async () => {
      const response = await productsApi.getProducts({ limit: 8, sort: "newest" });
      if (!response.success) throw new Error("Listings unavailable");
      return Promise.all(response.data.map(async product => {
        let primaryImage: string | undefined;
        try {
          const images = await imagesApi.getImages(product.pid);
          primaryImage = getAssetUrl(images.data.find(image => image.is_primary)?.image_url || images.data[0]?.image_url);
        } catch { /* A listing remains usable without its photo. */ }
        return { ...product, primaryImage, rating: product.average_rating || 0 };
      }));
    },
  });
  return <div className="marketplace-page">
    <Header />
    <main id="main-content">
      <HeroSection />
      <div className="market-benefits"><div className="market-container benefits-inner"><span><MapPin /> <strong>Find it close to home</strong><span>Discover sellers across Ghana</span></span><span><MessageCircle /><strong>Talk to the seller</strong><span>Ask questions. Make a connection.</span></span><span><ShoppingBag /><strong>Give it a new beginning</strong><span>Buy, sell, and discover something good</span></span></div></div>
      <CategoriesSection />
      <section className="market-container market-section fresh-section" aria-labelledby="listings-title">
        <div className="section-heading"><div><p className="eyebrow">JUST LANDED</p><h2 id="listings-title">Fresh finds. Yours next?</h2></div><Link className="text-link" to="/shop">Browse all listings <ArrowUpRight size={18} /></Link></div>
        {isError ? <div className="market-state"><ShoppingBag size={30} /><h3>We couldn’t load the latest finds.</h3><p>Check your connection, then give it another try.</p><button className="market-button" onClick={() => refetch()}>Try again <ArrowRight size={16} /></button></div> : <ProductGrid products={products} viewMode={viewMode} onViewModeChange={setViewMode} loading={isPending} />}
      </section>
      <section className="market-container market-section"><div className="seller-invitation"><div><p className="eyebrow">MAKE ROOM FOR WHAT’S NEXT</p><h2>Someone’s next great find<br />could be yours to sell.</h2><p>From the things you’ve outgrown to the things you create.<br className="hidden sm:block" /> Find their next home on Phoenix Mall.</p><Link to="/sell" className="market-button">Start selling <Plus size={18} /></Link></div><div className="seller-art" aria-hidden="true"><span>pre-loved.</span><span>re-discovered.</span><span>possibilities.</span><ArrowUpRight /></div></div></section>
    </main>
    <Footer /><MobileBottomNav />
  </div>;
}
