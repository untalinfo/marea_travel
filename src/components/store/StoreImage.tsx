"use client";

import { PRODUCT_FALLBACK_SRC } from "@/lib/brand-assets";
import Image, { type ImageProps } from "next/image";
import { useEffect, useState } from "react";

interface StoreImageProps extends Omit<ImageProps, "src" | "onError"> {
  src?: string | null;
  fallbackSrc?: string;
}

function isUnconfiguredExternalUrl(src: string): boolean {
  if (!/^https?:\/\//i.test(src)) return false;
  try {
    const { hostname } = new URL(src);
    const lowerHost = hostname.toLowerCase();
    return lowerHost !== "images.unsplash.com" && !lowerHost.endsWith(".supabase.co");
  } catch {
    return true;
  }
}

export function StoreImage({
  src,
  fallbackSrc = PRODUCT_FALLBACK_SRC,
  alt,
  unoptimized,
  ...rest
}: StoreImageProps) {
  const normalizedSrc = src && src.trim().length > 0 ? src : fallbackSrc;
  const [currentSrc, setCurrentSrc] = useState(normalizedSrc);

  useEffect(() => {
    setCurrentSrc(normalizedSrc);
  }, [normalizedSrc]);

  const isSvg = currentSrc.toLowerCase().includes(".svg");
  const shouldBypassOptimizer = isSvg || isUnconfiguredExternalUrl(currentSrc);

  return (
    <Image
      {...rest}
      src={currentSrc}
      alt={alt}
      unoptimized={unoptimized ?? shouldBypassOptimizer}
      onError={() => {
        if (currentSrc !== fallbackSrc) {
          setCurrentSrc(fallbackSrc);
        }
      }}
    />
  );
}
