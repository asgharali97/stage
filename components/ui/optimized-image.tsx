"use client";

import { CldImage } from 'next-cloudinary';
import Image from 'next/image';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  sizes?: string;
  quality?: number | 'auto';
  crop?: 'fill' | 'fit' | 'scale' | 'crop';
  gravity?: 'auto' | 'center' | 'face';
  [key: string]: any;
}

/**
 * OptimizedImage component that uses Cloudinary when available,
 * falls back to Next.js Image component otherwise.
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill,
  className,
  priority,
  sizes,
  quality = 'auto',
  crop,
  gravity = 'auto',
  ...props
}: OptimizedImageProps) {
  // Access environment variables (NEXT_PUBLIC_ vars are available in client components)
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  // Use Cloudinary if configured, otherwise fallback to Next.js Image
  if (cloudName) {
    if (fill) {
      return (
        <CldImage
          src={src}
          alt={alt}
          fill
          className={className}
          priority={priority}
          sizes={sizes}
          quality={quality}
          crop={crop}
          gravity={gravity}
          {...props}
        />
      );
    }

    return (
      <CldImage
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        priority={priority}
        sizes={sizes}
        quality={quality}
        crop={crop}
        gravity={gravity}
        {...props}
      />
    );
  }

  // Fallback to Next.js Image component
  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className={className}
        priority={priority}
        sizes={sizes}
        {...props}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      sizes={sizes}
      {...props}
    />
  );
}

