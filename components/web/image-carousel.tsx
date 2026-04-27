"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ManagedImage } from "@/components/web/managed-image";
import { cn } from "@/lib/utils";

type ImageCarouselProps = {
  images: string[];
  alt: string;
  sizes?: string;
};

export function ImageCarousel({ images, alt, sizes = "(max-width: 1024px) 100vw, 42vw" }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const handleCarouselKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goToPrevious();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      goToNext();
    }
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Swipe detection
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0]?.clientX ?? null);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const endX = e.changedTouches[0]?.clientX ?? null;
    handleSwipe(endX);
  };

  const handleSwipe = (touchEnd: number | null) => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      goToNext();
    }
    if (isRightSwipe) {
      goToPrevious();
    }
  };

  // If no images, render fallback
  if (!images || images.length === 0) {
    return (
      <div className="relative min-h-96 w-full rounded-[2rem] border border-border/70 bg-accent/10 shadow-sm flex items-center justify-center">
        <p className="text-muted-foreground">No image available</p>
      </div>
    );
  }

  // Single image - no carousel controls
  if (images.length === 1) {
    return (
      <div className="relative min-h-96 w-full rounded-[2rem] border border-border/70 bg-accent/10 shadow-sm overflow-hidden flex items-center justify-center">
        <ManagedImage
          src={images[0]}
          alt={alt}
          fill
          priority
          sizes={sizes}
          className="object-contain"
        />
      </div>
    );
  }

  // Multiple images - carousel with controls
  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div
        className="group relative min-h-96 w-full overflow-hidden rounded-[1.5rem] border border-border/70 bg-accent/10 shadow-sm flex items-center justify-center"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onKeyDown={handleCarouselKeyDown}
        tabIndex={0}
        role="region"
        aria-label={`${alt} image carousel`}
      >
        <ManagedImage
          src={images[currentIndex]}
          alt={`${alt} - image ${currentIndex + 1}`}
          fill
          priority
          sizes={sizes}
          className="object-contain transition-opacity duration-300"
        />

        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            {/* Left Button */}
            <button
              onClick={goToPrevious}
              className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-border/60 bg-background/85 p-1.5 text-foreground transition-all hover:bg-background hover:border-border focus:outline-none focus:ring-2 focus:ring-primary/50 active:scale-95 backdrop-blur-sm"
              aria-label="Previous image"
              title="Previous image (← arrow key)"
            >
              <ChevronLeft className="size-4" />
            </button>

            {/* Right Button */}
            <button
              onClick={goToNext}
              className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-border/60 bg-background/85 p-1.5 text-foreground transition-all hover:bg-background hover:border-border focus:outline-none focus:ring-2 focus:ring-primary/50 active:scale-95 backdrop-blur-sm"
              aria-label="Next image"
              title="Next image (→ arrow key)"
            >
              <ChevronRight className="size-4" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto pb-2 sm:justify-center">
          {images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "relative min-h-[4.5rem] min-w-[4.5rem] overflow-hidden rounded-lg border shadow-sm transition-all",
                currentIndex === index
                  ? "border-primary ring-1 ring-primary/30 shadow-md"
                  : "border-border/60 hover:border-border opacity-70 hover:opacity-100"
              )}
              aria-label={`View image ${index + 1}`}
              aria-current={currentIndex === index}
            >
              <ManagedImage
                src={image}
                alt={`${alt} thumbnail ${index + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Image Counter */}
      {images.length > 1 && (
        <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">{currentIndex + 1}</span>
          <span>/</span>
          <span>{images.length}</span>
        </div>
      )}
    </div>
  );
}
