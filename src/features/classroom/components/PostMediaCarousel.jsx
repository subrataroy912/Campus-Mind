import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils.js";

export function PostMediaCarousel({ media = [], className = "" }) {
  const [activeImageIndex, setActiveImageIndex] = useState(null);

  const images = Array.isArray(media)
    ? media.map((item) => (typeof item === "string" ? { url: item } : item))
    : [];

  const isOpen = activeImageIndex !== null;

  // Keyboard navigation for modal lightbox
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setActiveImageIndex(null);
      } else if (e.key === "ArrowLeft") {
        setActiveImageIndex((prev) =>
          prev > 0 ? prev - 1 : images.length - 1
        );
      } else if (e.key === "ArrowRight") {
        setActiveImageIndex((prev) =>
          prev < images.length - 1 ? prev + 1 : 0
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, images.length]);

  if (images.length === 0) return null;

  return (
    <div className={cn("mt-3 overflow-hidden rounded-2xl border border-border/80", className)}>
      {/* 1 Image Layout */}
      {images.length === 1 && (
        <div
          onClick={() => setActiveImageIndex(0)}
          className="group relative max-h-[380px] w-full overflow-hidden bg-black/5 cursor-pointer"
        >
          <img
            src={images[0].url}
            alt={images[0].alt || "Post attachment"}
            className="w-full h-full max-h-[380px] object-cover transition duration-300 group-hover:scale-102"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
            <span className="rounded-full bg-black/60 p-2 text-white">
              <ZoomIn className="h-4 w-4" />
            </span>
          </div>
        </div>
      )}

      {/* 2 Images Layout */}
      {images.length === 2 && (
        <div className="grid grid-cols-2 gap-1 max-h-[300px]">
          {images.map((img, idx) => (
            <div
              key={idx}
              onClick={() => setActiveImageIndex(idx)}
              className="group relative h-56 overflow-hidden bg-black/5 cursor-pointer"
            >
              <img
                src={img.url}
                alt={img.alt || `Attachment ${idx + 1}`}
                className="w-full h-full object-cover transition duration-300 group-hover:scale-103"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      )}

      {/* 3 Images Layout */}
      {images.length === 3 && (
        <div className="grid grid-cols-3 gap-1 max-h-[320px]">
          <div
            onClick={() => setActiveImageIndex(0)}
            className="group relative col-span-2 h-64 overflow-hidden bg-black/5 cursor-pointer"
          >
            <img
              src={images[0].url}
              alt="Attachment 1"
              className="w-full h-full object-cover transition duration-300 group-hover:scale-103"
              loading="lazy"
            />
          </div>
          <div className="flex flex-col gap-1 h-64">
            {images.slice(1, 3).map((img, idx) => (
              <div
                key={idx + 1}
                onClick={() => setActiveImageIndex(idx + 1)}
                className="group relative h-1/2 overflow-hidden bg-black/5 cursor-pointer"
              >
                <img
                  src={img.url}
                  alt={`Attachment ${idx + 2}`}
                  className="w-full h-full object-cover transition duration-300 group-hover:scale-103"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4+ Images Layout */}
      {images.length >= 4 && (
        <div className="grid grid-cols-2 gap-1 max-h-[340px]">
          {images.slice(0, 4).map((img, idx) => {
            const isFourth = idx === 3;
            const extraCount = images.length - 4;

            return (
              <div
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className="group relative h-38 overflow-hidden bg-black/5 cursor-pointer"
              >
                <img
                  src={img.url}
                  alt={`Attachment ${idx + 1}`}
                  className="w-full h-full object-cover transition duration-300 group-hover:scale-103"
                  loading="lazy"
                />
                {isFourth && extraCount > 0 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 font-bold text-white text-lg">
                    +{extraCount}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox Modal */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in"
          onClick={() => setActiveImageIndex(null)}
        >
          <div
            className="relative flex h-full max-h-screen w-full max-w-5xl flex-col items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setActiveImageIndex(null)}
              className="absolute top-4 right-4 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition cursor-pointer"
              aria-label="Close image preview"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Prev Button */}
            {images.length > 1 && (
              <button
                type="button"
                onClick={() =>
                  setActiveImageIndex((prev) =>
                    prev > 0 ? prev - 1 : images.length - 1
                  )
                }
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/10 p-2.5 text-white hover:bg-white/20 transition cursor-pointer"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            )}

            {/* Main Lightbox Image */}
            <img
              src={images[activeImageIndex].url}
              alt={images[activeImageIndex].alt || "Preview attachment"}
              className="max-h-[85vh] max-w-full rounded-lg object-contain shadow-2xl"
            />

            {/* Next Button */}
            {images.length > 1 && (
              <button
                type="button"
                onClick={() =>
                  setActiveImageIndex((prev) =>
                    prev < images.length - 1 ? prev + 1 : 0
                  )
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/10 p-2.5 text-white hover:bg-white/20 transition cursor-pointer"
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            )}

            {/* Image counter indicator */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white/90">
                {activeImageIndex + 1} / {images.length}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default PostMediaCarousel;
