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
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900">
      
      {/* Product Image & Badges */}
      <div className="relative aspect-square w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
        <img
          src={thumbnail || "https://placehold.co/400"}
          alt={title}
          className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />

        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-rose-500 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
            {Math.round(discountPercentage)}% OFF
          </span>
        )}

        {/* Availability Badge */}
        <span
          className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-xs font-medium backdrop-blur-md ${
            stock <= 5
              ? 'bg-amber-500/90 text-white'
              : 'bg-emerald-500/90 text-white'
          }`}
        >
          {availabilityStatus}
        </span>
      </div>

      {/* Product Details */}
      <div className="flex flex-1 flex-col p-5">
        
        {/* Category & Rating Row */}
        <div className="flex items-center justify-between gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
          <span className="uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            {category} {brand ? `• ${brand}` : ''}
          </span>
          <div className="flex items-center gap-1 rounded-md bg-amber-50 px-1.5 py-0.5 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
            <Star className="h-3.5 w-3.5 fill-amber-400 stroke-amber-400" />
            <span className="font-semibold">{rating.toFixed(1)}</span>
            <span className="text-gray-400 dark:text-gray-500">
              ({reviews?.length || 0})
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="mt-2 line-clamp-1 text-lg font-bold text-gray-900 title-font dark:text-white" title={title}>
          {title}
        </h3>

        {/* Description */}
        <p className="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
          {description}
        </p>

        {/* Tags */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {tags?.map((tag, idx) => (
            <span
              key={idx}
              className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Spacer to push pricing & buttons to bottom */}
        <div className="flex-1" />

        {/* Value Props / Shipping & Warranty */}
        <div className="my-3 space-y-1 border-t border-gray-100 pt-3 text-xs text-gray-500 dark:border-gray-800 dark:text-gray-400">
          <div className="flex items-center gap-1.5">
            <Truck className="h-3.5 w-3.5 text-gray-400" />
            <span>{shippingInformation}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-gray-400" />
            <span>{warrantyInformation}</span>
          </div>
        </div>

        {/* Pricing & Action Button */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-800">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                ${price.toFixed(2)}
              </span>
              {discountPercentage > 0 && (
                <span className="text-xs text-gray-400 line-through">
                  ${originalPrice}
                </span>
              )}
            </div>
            <span className="text-[10px] text-gray-400">Stock: {stock} left</span>
          </div>

          <button
            type="button"
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Add</span>
          </button>
        </div>

      </div>
    </div>
  );
}