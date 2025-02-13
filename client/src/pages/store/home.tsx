import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import { ProductCard } from "@/components/products/product-card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function HomePage() {
  const { data: products } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const featuredProducts = products?.slice(0, 4) || [];

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="relative h-[600px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1732394656361-2283cfdd70e9')`,
          }}
        >
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative h-full container flex flex-col justify-center text-white">
            <h1 className="text-5xl font-bold mb-6 max-w-2xl">
              Discover Amazing Products for Your Lifestyle
            </h1>
            <p className="text-xl mb-8 max-w-xl">
              Shop our curated collection of high-quality products at competitive prices.
            </p>
            <Button asChild size="lg" className="w-fit">
              <Link href="/products">Shop Now</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="container">
        <h2 className="text-3xl font-bold mb-8">Shop by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: "Electronics",
              image: "https://images.unsplash.com/photo-1653389526309-f8e2e75f8aaf",
            },
            {
              name: "Fashion",
              image: "https://images.unsplash.com/photo-1653389527532-884074ac1c65",
            },
            {
              name: "Home & Living",
              image: "https://images.unsplash.com/photo-1653389523425-c1f572a4c3f0",
            },
          ].map((category) => (
            <Link key={category.name} href="/products">
              <div className="group relative h-64 cursor-pointer overflow-hidden rounded-lg">
                <img
                  src={category.image}
                  alt={category.name}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <h3 className="text-2xl font-bold text-white">{category.name}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="container">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Featured Products</h2>
          <Button variant="ghost" asChild>
            <Link href="/products" className="flex items-center">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-muted py-20">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Subscribe to our newsletter to receive updates about new products and special offers.
          </p>
          <form className="flex gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-md border"
            />
            <Button>Subscribe</Button>
          </form>
        </div>
      </section>
    </div>
  );
}
