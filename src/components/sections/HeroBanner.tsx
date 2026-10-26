import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

export default function HeroBanner() {
  return (
    <section className="shop-intro">
      <div className="market-container">
        <div>
          <p className="eyebrow">THE PHOENIX MARKETPLACE</p>
          <h1>Find your next good thing.</h1>
          <p>Explore the everyday essentials and unexpected discoveries.</p>
        </div>
        <Link className="text-link" to="/sell">
          Have something to sell? <ArrowUpRight size={18} />
        </Link>
      </div>
    </section>
  );
}
