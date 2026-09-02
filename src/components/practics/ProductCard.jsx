import React from 'react';
import { Star, ShieldCheck, Truck, ShoppingCart } from 'lucide-react';

export default function ProductCard({ product }) {
  const {
    title,
    description,
    category,
    price,
    discountPercentage,
    rating,
    stock,
    tags,
    brand,
    availabilityStatus,
    warrantyInformation,
    shippingInformation,
    thumbnail,
    reviews,
  } = product;

  // Calculate original price before discount
  const originalPrice = (price / (1 - discountPercentage / 100)).toFixed(2);

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-text-heading dark:bg-text-heading">

      {/* Product Image & Badges */}
      <div className="relative aspect-square w-full overflow-hidden bg-canvas dark:bg-text-heading">
        <img
          src={thumbnail || "/images/om-image.png"}
          alt={title}
          className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />

        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-surface shadow-sm">
            {Math.round(discountPercentage)}% OFF
          </span>
        )}

        {/* Availability Badge */}
        <span
          className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-xs font-medium backdrop-blur-md ${
            stock <= 5
              ? 'bg-secondary/90 text-surface'
              : 'bg-success/90 text-surface'
          }`}
        >
          {availabilityStatus}
        </span>
      </div>

      {/* Product Details */}
      <div className="flex flex-1 flex-col p-5">

        {/* Category & Rating Row */}
        <div className="flex items-center justify-between gap-2 text-xs font-medium text-text-muted dark:text-text-muted">
          <span className="uppercase tracking-wider text-primary dark:text-primary">
            {category} {brand ? `• ${brand}` : ''}
          </span>
          <div className="flex items-center gap-1 rounded-md bg-canvas px-1.5 py-0.5 text-secondary-hover dark:bg-secondary-hover/40 dark:text-secondary">
            <Star className="h-3.5 w-3.5 fill-secondary stroke-secondary" />
            <span className="font-semibold">{rating.toFixed(1)}</span>
            <span className="text-text-muted dark:text-text-muted">
              ({reviews?.length || 0})
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="mt-2 line-clamp-1 text-lg font-bold text-text-heading title-font dark:text-surface" title={title}>
          {title}
        </h3>

        {/* Description */}
        <p className="mt-1 line-clamp-2 text-sm text-text-main dark:text-text-muted">
          {description}
        </p>

        {/* Tags */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {tags?.map((tag, idx) => (
            <span
              key={idx}
              className="rounded-md bg-canvas px-2 py-0.5 text-xs text-text-main dark:bg-text-heading dark:text-border"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Spacer to push pricing & buttons to bottom */}
        <div className="flex-1" />

        {/* Value Props / Shipping & Warranty */}
        <div className="my-3 space-y-1 border-t border-border pt-3 text-xs text-text-muted dark:border-text-heading dark:text-text-muted">
          <div className="flex items-center gap-1.5">
            <Truck className="h-3.5 w-3.5 text-text-muted" />
            <span>{shippingInformation}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-text-muted" />
            <span>{warrantyInformation}</span>
          </div>
        </div>

        {/* Pricing & Action Button */}
        <div className="flex items-center justify-between border-t border-border pt-3 dark:border-text-heading">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-text-heading dark:text-surface">
                ${price.toFixed(2)}
              </span>
              {discountPercentage > 0 && (
                <span className="text-xs text-text-muted line-through">
                  ${originalPrice}
                </span>
              )}
            </div>
            <span className="text-[10px] text-text-muted">Stock: {stock} left</span>
          </div>

          <button
            type="button"
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-surface shadow-sm transition hover:bg-primary-hover active:scale-95 focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2 dark:focus:ring-offset-text-heading"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Add</span>
          </button>
        </div>

      </div>
    </div>
  );
}
