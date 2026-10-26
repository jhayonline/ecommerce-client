import React, { useState, useEffect, useCallback } from "react";
import {
  Heart,
  MapPin,
  Star,
  Grid,
  List,
  Loader2,
  ShoppingBag,
  ArrowUpRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { favoritesApi } from "@/lib/api";
import type { ProductResponseData } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

interface ProductWithDetails extends ProductResponseData {
  primaryImage?: string;
  rating?: number;
  reviews?: number;
  originalPrice?: number;
  discount?: number;
  seller?: string;
  recommended_price?: number;
}

interface ProductGridProps {
  products: ProductWithDetails[];
  viewMode: string;
  onViewModeChange: (mode: string) => void;
  loading?: boolean;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  viewMode,
  onViewModeChange,
  loading,
}) => {
  const [likedProducts, setLikedProducts] = useState<Set<string>>(new Set());
  const [pendingLikes, setPendingLikes] = useState<Set<string>>(new Set());
  const pendingRef = React.useRef(new Set<string>());
  const { toast } = useToast();
  const { user } = useAuth();

  const checkFavorites = useCallback(async () => {
    try {
      const checks = await Promise.all(
        products.map(async (product) => {
          try {
            const response = await favoritesApi.check(product.pid);
            return { pid: product.pid, favorited: response.data.favorited };
          } catch {
            return { pid: product.pid, favorited: false };
          }
        }),
      );
      const favoritedSet = new Set(
        checks.filter((c) => c.favorited).map((c) => c.pid),
      );
      setLikedProducts(favoritedSet);
    } catch (error) {
      console.error("Failed to check favorites:", error);
    }
  }, [products]);

  useEffect(() => {
    if (user && products.length > 0) {
      checkFavorites();
    }
  }, [user, products, checkFavorites]);

  const toggleLike = async (pid: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (pendingRef.current.has(pid)) return;

    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to add items to wishlist",
        variant: "destructive",
      });
      return;
    }

    pendingRef.current.add(pid);
    setPendingLikes(new Set(pendingRef.current));
    try {
      if (likedProducts.has(pid)) {
        await favoritesApi.remove(pid);
        setLikedProducts((prev) => {
          const newSet = new Set(prev);
          newSet.delete(pid);
          return newSet;
        });
        toast({
          title: "Removed",
          description: "Item removed from wishlist",
        });
        window.dispatchEvent(new Event("wishlistUpdated"));
      } else {
        await favoritesApi.add(pid);
        setLikedProducts((prev) => new Set([...prev, pid]));
        toast({
          title: "Added",
          description: "Item added to wishlist",
        });
        window.dispatchEvent(new Event("wishlistUpdated"));
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      pendingRef.current.delete(pid);
      setPendingLikes(new Set(pendingRef.current));
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "GHS",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading)
    return (
      <div className="market-state min-h-[340px]" role="status">
        <Loader2 className="animate-spin" size={25} />
        <p>Finding the latest listings…</p>
      </div>
    );
  if (products.length === 0)
    return (
      <div className="market-state">
        <ShoppingBag size={28} />
        <h3>No finds here just yet.</h3>
        <p>
          Try another search or category, or give something of yours a new home.
        </p>
        <Link className="text-link" to="/sell">
          List an item <ArrowUpRight size={16} />
        </Link>
      </div>
    );
  const gridClass =
    viewMode === "1"
      ? "listing-list"
      : viewMode === "2"
        ? "listing-grid listing-grid-three"
        : viewMode === "4"
          ? "listing-grid listing-grid-five"
          : "listing-grid";
  return (
    <div className="min-w-0 flex-1">
      <div className="listing-toolbar">
        <p>
          {products.length} {products.length === 1 ? "listing" : "listings"} to
          explore
        </p>
        <div role="group" aria-label="Listing layout">
          {["1", "2", "3", "4"].map((mode, index) => (
            <button
              key={mode}
              onClick={() => onViewModeChange(mode)}
              aria-label={
                [
                  "List view",
                  "Comfortable grid",
                  "Standard grid",
                  "Compact grid",
                ][index]
              }
              aria-pressed={viewMode === mode}
            >
              {mode === "1" ? (
                <List size={16} />
              ) : (
                <Grid size={mode === "4" ? 12 : 16} />
              )}
            </button>
          ))}
        </div>
      </div>
      <div className={gridClass}>
        {products.map((product) => (
          <article className="listing-card" key={product.pid}>
            <div className="listing-image">
              <Link
                to={`/product/${product.pid}`}
                tabIndex={-1}
                aria-hidden="true"
              >
                <img
                  src={product.primaryImage || "/images/item-placeholder.svg"}
                  alt=""
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = "/images/item-placeholder.svg";
                  }}
                />
              </Link>
              <button
                className={`listing-save ${likedProducts.has(product.pid) ? "is-saved" : ""}`}
                aria-label={`${likedProducts.has(product.pid) ? "Remove" : "Save"} ${product.title}${likedProducts.has(product.pid) ? " from saved items" : ""}`}
                aria-pressed={likedProducts.has(product.pid)}
                disabled={pendingLikes.has(product.pid)}
                onClick={(event) => toggleLike(product.pid, event)}
              >
                <Heart
                  size={17}
                  fill={
                    likedProducts.has(product.pid) ? "currentColor" : "none"
                  }
                />
              </button>
              {product.status && product.status.toLowerCase() !== "active" && (
                <span className="listing-status">
                  {product.status === "sold" ? "Sold" : "Inactive"}
                </span>
              )}
            </div>
            <div className="listing-info">
              <div className="listing-meta">
                <span>{product.condition || "Listed item"}</span>
                {(product.rating ?? 0) > 0 && (
                  <span className="listing-rating">
                    <Star size={11} fill="currentColor" />
                    {product.rating?.toFixed(1)}
                  </span>
                )}
              </div>
              <h3>
                <Link to={`/product/${product.pid}`}>{product.title}</Link>
              </h3>
              <p className="listing-price">{formatCurrency(product.price)}</p>
              <div className="listing-location">
                <MapPin size={12} />
                <span>{product.location || "Location not specified"}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
export default ProductGrid;
