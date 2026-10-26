import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React, { useState, useEffect } from "react";
import {
  Heart,
  User,
  Menu,
  MessageSquare,
  Bell,
  LogOut,
  Store,
  Home,
  ShoppingCart,
  Grid,
  Mail,
  Plus,
  Package,
  HelpCircle,
  Settings,
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { wishlistApi, chatApi } from "@/lib/api";

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  const { user, logout } = useAuth();

  // Refs for profile menu

  // Load wishlist count
  useEffect(() => {
    const loadWishlistCount = async () => {
      if (!user) {
        setWishlistCount(0);
        return;
      }
      try {
        const response = await wishlistApi.getWishlist();
        if (response.success && response.data) {
          setWishlistCount(response.data.length);
        }
      } catch (error) {
        //
      }
    };

    loadWishlistCount();

    const handleWishlistUpdate = () => {
      loadWishlistCount();
    };

    window.addEventListener("wishlistUpdated", handleWishlistUpdate);
    return () =>
      window.removeEventListener("wishlistUpdated", handleWishlistUpdate);
  }, [user]);

  // Load unread message count
  useEffect(() => {
    const loadUnreadCount = async () => {
      if (!user) {
        setUnreadMessageCount(0);
        return;
      }
      try {
        const response = await chatApi.getTotalUnreadCount();
        if (response.success && response.data) {
          setUnreadMessageCount(response.data.total);
        }
      } catch (error) {
        //
      }
    };

    loadUnreadCount();

    const interval = setInterval(loadUnreadCount, 10000);

    const handleMessagesRead = () => {
      loadUnreadCount();
    };

    window.addEventListener("messagesRead", handleMessagesRead);

    return () => {
      clearInterval(interval);
      window.removeEventListener("messagesRead", handleMessagesRead);
    };
  }, [user]);

  // Load unread notification count
  useEffect(() => {
    const loadUnreadNotificationCount = async () => {
      if (!user) {
        setUnreadNotificationCount(0);
        return;
      }
      try {
        const response = await chatApi.getConversations();
        if (response.success && response.data) {
          const total = response.data.reduce(
            (sum, conv) => sum + conv.unread_count,
            0,
          );
          setUnreadNotificationCount(total);
        }
      } catch (error) {
        //
      }
    };

    loadUnreadNotificationCount();

    const handleMessagesRead = () => {
      loadUnreadNotificationCount();
    };

    window.addEventListener("messagesRead", handleMessagesRead);

    return () => {
      window.removeEventListener("messagesRead", handleMessagesRead);
    };
  }, [user]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigationItems = [
    { name: "Discover", path: "/", icon: <Home className="w-4 h-4" /> },
    {
      name: "Marketplace",
      path: "/shop",
      icon: <ShoppingCart className="w-4 h-4" />,
    },
    { name: "Contact", path: "/contact", icon: <Mail className="w-4 h-4" /> },
  ];

  const isActive = (path: string) => location.pathname === path;

  const profileMenuItems = [
    { name: "Notifications", icon: <Bell className="w-4 h-4" />, action: () => navigate("/notifications") },
    {
      name: "My Profile",
      icon: <User className="w-4 h-4" />,
      action: () => navigate("/profile"),
    },
    {
      name: "My Listings",
      icon: <Package className="w-4 h-4" />,
      action: () => navigate("/my-listings"),
    },
    {
      name: "Seller Dashboard",
      icon: <Store className="w-4 h-4" />,
      action: () => navigate("/seller/dashboard"),
    },
    {
      name: "My Wishlist",
      icon: <Heart className="w-4 h-4" />,
      action: () => navigate("/wishlist"),
    },
    {
      name: "Messages",
      icon: <MessageSquare className="w-4 h-4" />,
      action: () => navigate("/messaging"),
    },
    {
      name: "Settings",
      icon: <Settings className="w-4 h-4" />,
      action: () => navigate("/profile"),
    },
    {
      name: "Help Center",
      icon: <HelpCircle className="w-4 h-4" />,
      action: () => navigate("/contact"),
    },
    {
      name: "Logout",
      icon: <LogOut className="w-4 h-4" />,
      action: () => logout(),
    },
  ];

  // Add admin items conditionally
  if (user?.role === "admin") {
    profileMenuItems.unshift({
      name: "Manage Categories",
      icon: <Grid className="w-4 h-4" />,
      action: () => navigate("/admin/categories"),
    });
  }

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <header className={`market-header ${isScrolled ? "is-scrolled" : ""}`}>
        <div className="market-container header-inner">
          <Link
            to="/"
            className="brand-wordmark"
            aria-label="Phoenix Mall home"
          >
            <img src="/phoenix-logo.svg" alt="" />
            PhoeniX<span>Mall</span>
          </Link>
          <nav className="desktop-navigation" aria-label="Main navigation">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                aria-current={isActive(item.path) ? "page" : undefined}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="header-actions">
            <Link
              to="/wishlist"
              className="header-icon"
              aria-label={`Saved items${wishlistCount ? ` (${wishlistCount})` : ""}`}
            >
              <Heart size={19} />
              {wishlistCount > 0 && (
                <span className="header-count">{wishlistCount}</span>
              )}
            </Link>
            {user ? (
              <>
                <Link
                  to="/messaging"
                  className="header-icon hidden sm:flex"
                  aria-label={`Messages, ${unreadMessageCount} unread`}
                >
                  <MessageSquare size={19} />
                  {unreadMessageCount > 0 && (
                    <span className="header-count">{unreadMessageCount}</span>
                  )}
                </Link>
                <Link
                  to="/notifications"
                  className="header-icon hidden sm:flex"
                  aria-label={`Notifications, ${unreadNotificationCount} unread`}
                >
                  <Bell size={19} />
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="header-icon"
                      aria-label="Open account menu"
                    >
                      <User size={19} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-60">
                    <DropdownMenuLabel>
                      {user.first_name} {user.last_name}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {profileMenuItems.map((item) => (
                      <DropdownMenuItem
                        key={item.name}
                        onSelect={item.action}
                        className="gap-3"
                      >
                        {item.icon}
                        {item.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Link to="/login" className="header-signin">
                Sign in
              </Link>
            )}
            <Link to="/sell" className="header-sell">
              <Plus size={16} /> Sell an item
            </Link>
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <button
                  className="header-icon mobile-menu-trigger"
                  aria-label="Open navigation menu"
                >
                  <Menu size={22} />
                </button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Phoenix Mall</SheetTitle>
                  <SheetDescription>
                    Your next great find starts here.
                  </SheetDescription>
                </SheetHeader>
                <nav
                  className="mobile-navigation"
                  aria-label="Mobile navigation"
                >
                  {navigationItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      aria-current={isActive(item.path) ? "page" : undefined}
                    >
                      {item.icon}
                      {item.name}
                    </Link>
                  ))}
                  <Link to="/sell" onClick={() => setIsMobileMenuOpen(false)}>
                    <Plus size={18} />
                    Sell an item
                  </Link>
                  {!user && (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Sign in
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Create an account
                      </Link>
                    </>
                  )}
                </nav>
                {user && (
                  <div className="mobile-navigation border-t">
                    {profileMenuItems.map((item) => (
                      <button
                        key={item.name}
                        onClick={() => {
                          item.action();
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        {item.icon}
                        {item.name}
                      </button>
                    ))}
                  </div>
                )}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  );
};
export default Header;
