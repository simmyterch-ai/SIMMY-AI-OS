"use client";

import { useState } from "react";

const FALLBACK_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400'%3E%3Crect width='600' height='400' fill='%23eef3fb'/%3E%3Cpath d='M250 135h100v80H250z' fill='%23b9c8df'/%3E%3Ccircle cx='280' cy='160' r='12' fill='%23829ac2'/%3E%3Cpath d='m250 215 28-28 20 20 20-25 32 33z' fill='%23829ac2'/%3E%3Ctext x='300' y='270' text-anchor='middle' fill='%23516b96' font-family='Arial' font-size='22'%3EImage unavailable%3C/text%3E%3C/svg%3E";

type ProductImageProps = {
  src: string;
  alt: string;
  className?: string;
};

export default function ProductImage({
  src,
  alt,
  className,
}: ProductImageProps) {
  const [imageSrc, setImageSrc] = useState(src || FALLBACK_IMAGE);

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      onError={() => setImageSrc(FALLBACK_IMAGE)}
    />
  );
}
