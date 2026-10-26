import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, Loader2, Shapes } from "lucide-react";
import { categoriesApi } from "@/lib/api";

// Map category names to their working shop slugs
const getCategorySlug = (categoryName: string): string => {
  const slugMap: Record<string, string> = {
    "Mobile Devices": "smartphones",
    "Computing & Electronics": "laptops",
    "Fashion & Style": "men", // Will show men's fashion, women's fashion is separate
    "Home & Living": "furniture",
    Mobility: "cars",
    "Real Estate": "real-estate",
    Jewelry: "jewelry",
    "Beauty & Personal Care": "skincare",
    "Baby & Kids": "baby+food+%26+nutrition",
    Services: "home+services",
    "Food & Agriculture": "preserved+food",
    Games: "video+games",
    "Pets & Animals": "dogs",
  };
  return (
    slugMap[categoryName] || categoryName.toLowerCase().replace(/\s+/g, "-")
  );
};

// Get image for category
const getCategoryImage = (categoryName: string) => {
  const name = categoryName.toLowerCase();
  const images: Record<string, string> = {
    mobility:
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=400&fit=crop&crop=center",
    "real estate":
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=400&fit=crop&crop=center",
    "mobile devices":
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center",
    "computing & electronics":
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop&crop=center",
    games:
      "https://images.unsplash.com/photo-1556438064-2d7646166914?w=400&h=400&fit=crop&crop=center",
    "home & living":
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&crop=center",
    "fashion & style":
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop&crop=center",
    jewelry:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&crop=center",
    "beauty & personal care":
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop&crop=center",
    "baby & kids":
      "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=400&fit=crop&crop=center",
    services:
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&h=400&fit=crop&crop=center",
    "food & agriculture":
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop&crop=center",
    "pets & animals":
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=400&fit=crop&crop=center",
  };

  for (const [key, url] of Object.entries(images)) {
    if (name.includes(key) || key.includes(name)) {
      return url;
    }
  }
  return "https://placehold.co/400x400/e2e8f0/94a3b8?text=Category";
};

export default function CategoriesSection() {
  const {
    data: categories = [],
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["homepage-categories"],
    queryFn: async () => {
      const response = await categoriesApi.getAllCategories();
      if (!response.success) throw new Error("Categories unavailable");
      return response.data
        .filter((category) => category.level === 1 && category.is_active)
        .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
    },
    retry: false,
  });
  return (
    <section
      className="market-section market-container"
      id="categories"
      aria-labelledby="categories-title"
    >
      <div className="section-heading">
        <div>
          <p className="eyebrow">A PLACE FOR EVERY INTEREST</p>
          <h2 id="categories-title">What are you into?</h2>
        </div>
        <Link className="text-link" to="/shop">
          Explore the marketplace <ArrowUpRight size={18} />
        </Link>
      </div>
      {isPending ? (
        <div className="market-state" role="status">
          <Loader2 className="animate-spin" /> Loading categories…
        </div>
      ) : isError ? (
        <div className="market-state">
          <Shapes />
          <p>Categories couldn’t load.</p>
          <button className="text-link" onClick={() => refetch()}>
            Try again <ArrowUpRight size={16} />
          </button>
        </div>
      ) : categories.length === 0 ? (
        <div className="market-state">
          <Shapes />
          <p>New categories are on their way.</p>
          <Link className="text-link" to="/shop">
            Browse all listings <ArrowUpRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="category-grid">
          {categories.map((category) => (
            <Link
              className="category-tile"
              key={category.id}
              to={`/shop?category=${getCategorySlug(category.name)}`}
            >
              <div className="category-photo">
                <img
                  src={getCategoryImage(category.name)}
                  alt=""
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = "/images/item-placeholder.svg";
                  }}
                />
                <span>
                  <ArrowUpRight size={18} />
                </span>
              </div>
              <h3>{category.name}</h3>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
