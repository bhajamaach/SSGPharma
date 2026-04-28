"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ProductSearch } from "@/components/marketing/product-search";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ProductItem = {
  id: string;
  slug: string;
  name: string;
  manufacturer?: string | null;
  dosage?: string | null;
  description?: string | null;
  pricePaise: number;
  priceSuffix?: string | null;
  category?: { name: string; slug: string } | null;
};

type Props = {
  products: ProductItem[];
};

export function HomepageSearchSection({ products }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const trimmedQuery = searchQuery.trim();
  const filteredProducts = useMemo(() => {
    if (!trimmedQuery) {
      return [];
    }

    const query = trimmedQuery.toLowerCase();
    return products
      .filter((product) => {
        const name = product.name.toLowerCase();
        const manufacturer = (product.manufacturer || "").toLowerCase();
        const dosage = (product.dosage || "").toLowerCase();
        const description = (product.description || "").toLowerCase();
        return name.includes(query) || manufacturer.includes(query) || dosage.includes(query) || description.includes(query);
      })
      .slice(0, 8);
  }, [products, trimmedQuery]);
  const isOpen = trimmedQuery.length > 0;

  const formatPrice = (paise: number) => {
    const rupees = paise / 100;
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(rupees);
  };

  return (
    <section className="w-full bg-muted/10 py-12 md:py-16">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        <div className="mb-8 text-center">
          <h2 className="font-[family-name:var(--font-display)] text-2xl tracking-tight text-foreground md:text-3xl">
            Find your medicine
          </h2>
          <p className="mt-2 text-muted-foreground">Search by name, composition, or manufacturer</p>
        </div>

        <div className="relative mx-auto max-w-2xl">
          <ProductSearch
            value={searchQuery}
            onFilter={setSearchQuery}
            placeholder="Search medicines by name, composition, dosage..."
          />

          {/* Search Results Dropdown */}
          {isOpen && searchQuery.trim() && (
            <div className="absolute top-full left-0 right-0 z-40 mt-2 max-h-96 overflow-y-auto rounded-2xl border border-border bg-background/95 shadow-lg backdrop-blur-sm">
              {filteredProducts.length > 0 ? (
                <div className="divide-y divide-border/50">
                  {filteredProducts.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      onClick={() => setSearchQuery("")}
                      className="flex items-start gap-4 px-4 py-3 transition-colors hover:bg-muted/80"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">{product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {[product.manufacturer, product.dosage].filter(Boolean).join(" · ") ||
                            product.category?.name ||
                            "Pharmaceutical product"}
                        </p>
                      </div>
                      <p className="font-semibold text-primary whitespace-nowrap">
                        {formatPrice(product.pricePaise)}
                        {product.priceSuffix ? ` ${product.priceSuffix}` : ""}
                      </p>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-8 text-center">
                  <p className="text-sm text-muted-foreground">No products found matching &ldquo;{searchQuery}&rdquo;</p>
                  <Link
                    href={`/products?q=${encodeURIComponent(searchQuery)}`}
                    className={cn(buttonVariants({ variant: "outline", size: "sm" }), "mt-4")}
                  >
                    View full catalog
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Browse All Link */}
        {!isOpen && (
          <div className="mt-8 text-center">
            <Link href="/products" className={cn(buttonVariants({ variant: "outline" }))}>
              Browse all products →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
