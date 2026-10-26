import { Link } from "react-router-dom";
import { ArrowUpRight, MapPin } from "lucide-react";

export default function Footer() {
  return <footer className="market-footer"><div className="market-container">
    <div className="footer-main"><div className="footer-brand"><Link to="/" className="brand-wordmark"><img src="/phoenix-logo.svg" alt="" />PhoeniX<span>Mall</span></Link><p>Good things find their people.<br />Ghana’s marketplace for what’s next.</p><span className="footer-location"><MapPin size={14} /> Made for connections across Ghana.</span></div>
    <div><h2>Explore</h2><Link to="/shop">The marketplace</Link><Link to="/shop?category=smartphones">Phones & electronics</Link><Link to="/shop?category=furniture">Home & living</Link><Link to="/wishlist">Your saved finds</Link></div>
    <div><h2>Make it yours</h2><Link to="/sell">Start selling <ArrowUpRight size={13} /></Link><Link to="/my-listings">Your listings</Link><Link to="/register">Join Phoenix Mall</Link><Link to="/contact">Get in touch</Link></div>
    <div><h2>Let’s talk</h2><a href="mailto:team@phoenixmall.com">team@phoenixmall.com</a><a href="tel:+233532423078">+233 53 242 3078</a><p>Accra, Ghana</p></div></div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} Phoenix Mall.</span><span>A world of possibilities, closer to home.</span><a href="#top">Back to top ↑</a></div>
  </div></footer>;
}
