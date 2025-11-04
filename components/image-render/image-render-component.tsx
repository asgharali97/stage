import { useImageStore } from '@/lib/store';

interface ImageRenderComponentProps {
  imageUrl: string;
}

export const ImageRenderComponent = ({
  imageUrl,
}: ImageRenderComponentProps) => {
  const { borderRadius, imageOpacity, imageBorder, imageShadow, imageScale } = useImageStore();

  // Build border style
  const borderStyle = imageBorder.enabled
    ? `${imageBorder.width}px ${imageBorder.style} ${imageBorder.color}`
    : 'none';

  // Build shadow style
  const shadowStyle = imageShadow.enabled
    ? `${imageShadow.offsetX}px ${imageShadow.offsetY}px ${imageShadow.blur}px ${imageShadow.spread}px ${imageShadow.color}`
    : 'none';

  return (
    <img
      src={imageUrl}
      alt="Uploaded image"
      className="max-w-full max-h-full object-contain"
      style={{ 
        borderRadius: `${borderRadius}px`, 
        opacity: imageOpacity,
        transform: `scale(${imageScale / 100})`,
        transformOrigin: 'center',
        border: borderStyle,
        boxShadow: shadowStyle,
      }}
    />
  );
};

