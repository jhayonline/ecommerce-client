import { useEffect, useState } from "react";
import { Heart, Plus, MessageCircle, ShoppingBag, User } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { chatApi } from "@/lib/api/chat";

export default function MobileBottomNav() {
  const { user } = useAuth();
  const [unread, setUnread] = useState(0);
  useEffect(() => {
    let active = true;
    const update = async () => {
      if (!user) {
        setUnread(0);
        return;
      }
      try {
        const response = await chatApi.getTotalUnreadCount();
        if (active) setUnread(response.data.total);
      } catch {
        /* Messaging remains reachable if the badge cannot load. */
      }
    };
    void update();
    window.addEventListener("messagesRead", update);
    return () => {
      active = false;
      window.removeEventListener("messagesRead", update);
    };
  }, [user]);
  const tabs = [
    { name: "Explore", path: "/shop", icon: ShoppingBag },
    { name: "Saved", path: "/wishlist", icon: Heart },
    { name: "Sell", path: "/sell", icon: Plus },
    { name: "Messages", path: "/messaging", icon: MessageCircle },
    { name: "Account", path: user ? "/profile" : "/login", icon: User },
  ];
  return (
    <nav className="mobile-bottom-nav" aria-label="Quick navigation">
      {tabs.map(({ name, path, icon: Icon }) => (
        <NavLink
          key={path}
          to={path}
          className={({ isActive }) =>
            `${isActive ? "is-active" : ""} ${name === "Sell" ? "sell-tab" : ""}`
          }
        >
          <span>
            <Icon size={20} />
            {name === "Messages" && unread > 0 && (
              <small aria-label={`${unread} unread messages`}>
                {unread > 99 ? "99+" : unread}
              </small>
            )}
          </span>
          {name}
        </NavLink>
      ))}
    </nav>
  );
}
