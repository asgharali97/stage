import { useImageStore } from '@/lib/store';

interface ImageRenderComponentProps {
  imageUrl: string;
}

export const ImageRenderComponent = ({
  imageUrl,
}: ImageRenderComponentProps) => {
  const { borderRadius, imageOpacity, imageBorder, imageShadow, imageScale } = useImageStore();

  // Build shadow style
  const shadowStyle = imageShadow.enabled
    ? `${imageShadow.offsetX}px ${imageShadow.offsetY}px ${imageShadow.blur}px ${imageShadow.spread}px ${imageShadow.color}`
    : 'none';

  // Default shadow for styles that need it
  const defaultShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';

  // Build border styles based on border type
  const getBorderStyles = () => {
    const baseStyles: React.CSSProperties = {
      borderRadius: `${borderRadius}px`,
      opacity: imageOpacity,
      transform: `scale(${imageScale / 100})`,
      transformOrigin: 'center',
      boxShadow: shadowStyle !== 'none' ? shadowStyle : undefined,
    };

    if (!imageBorder.enabled) {
      return baseStyles;
    }

    switch (imageBorder.style) {
      case 'default':
        return {
          ...baseStyles,
          boxShadow: shadowStyle !== 'none' ? shadowStyle : defaultShadow,
        };

      case 'glass-light':
        return {
          ...baseStyles,
          border: '1px solid rgba(229, 231, 235, 0.6)',
          boxShadow: shadowStyle !== 'none' ? shadowStyle : '0 4px 16px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
          background: 'linear-gradient(to bottom right, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.5))',
          backdropFilter: 'blur(12px) saturate(180%)',
          WebkitBackdropFilter: 'blur(12px) saturate(180%)',
        };

      case 'glass-dark':
        return {
          ...baseStyles,
          border: '1px solid rgba(55, 65, 81, 0.6)',
          boxShadow: shadowStyle !== 'none' ? shadowStyle : '0 4px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          background: 'linear-gradient(to bottom right, rgba(31, 41, 55, 0.4), rgba(17, 24, 39, 0.4))',
          backdropFilter: 'blur(12px) saturate(180%)',
          WebkitBackdropFilter: 'blur(12px) saturate(180%)',
        };

      case 'outline':
        return {
          ...baseStyles,
          border: `${imageBorder.width || 2}px solid ${imageBorder.color || '#e5e7eb'}`,
          boxShadow: shadowStyle !== 'none' ? shadowStyle : defaultShadow,
        };

      case 'border':
        return {
          ...baseStyles,
          border: `${imageBorder.width || 2}px solid ${imageBorder.color || '#000000'}`,
          boxShadow: shadowStyle !== 'none' ? shadowStyle : defaultShadow,
        };

      case 'retro':
        return {
          ...baseStyles,
          borderRight: `${Math.max(imageBorder.width || 4, 3)}px solid ${imageBorder.color || '#000000'}`,
          borderBottom: `${Math.max(imageBorder.width || 4, 3)}px solid ${imageBorder.color || '#000000'}`,
          borderTop: 'none',
          borderLeft: 'none',
          boxShadow: shadowStyle !== 'none' ? shadowStyle : '0 4px 0 rgba(0, 0, 0, 0.15)',
        };

      case 'solid':
      case 'dashed':
      case 'dotted':
      case 'double':
        return {
          ...baseStyles,
          border: `${imageBorder.width || 2}px ${imageBorder.style} ${imageBorder.color || '#000000'}`,
          boxShadow: shadowStyle !== 'none' ? shadowStyle : defaultShadow,
        };

      case 'liquid':
      case 'overlay':
      case 'card':
      case 'stack':
      case 'stack2':
        // These styles are handled by wrapper divs, just return base styles
        return baseStyles;

      default:
        return baseStyles;
    }
  };

  // For card, stack, liquid, and overlay styles, we need a wrapper
  const borderStyles = getBorderStyles();
  const needsWrapper = ['card', 'stack', 'stack2', 'liquid', 'overlay'].includes(imageBorder.style) && imageBorder.enabled;

  if (needsWrapper) {
    const borderRadiusValue = `${borderRadius}px`;
    
    return (
      <div 
        className="relative flex items-center justify-center" 
        style={{ 
          width: '100%', 
          height: '100%',
          borderRadius: borderRadiusValue,
        }}
      >
        {/* Stack layers */}
        {imageBorder.style === 'stack' && (
          <>
            <div
              className="absolute rounded-lg bg-white"
              style={{
                bottom: '-6px',
                right: '-6px',
                width: '100%',
                height: '100%',
                borderRadius: borderRadiusValue,
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.12)',
                zIndex: 1,
              }}
            />
            <div
              className="absolute rounded-lg bg-white"
              style={{
                bottom: '-3px',
                right: '-3px',
                width: '100%',
                height: '100%',
                borderRadius: borderRadiusValue,
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                zIndex: 2,
              }}
            />
          </>
        )}
        {imageBorder.style === 'stack2' && (
          <>
            <div
              className="absolute rounded-lg bg-white"
              style={{
                bottom: '-5px',
                right: '-5px',
                width: '100%',
                height: '100%',
                borderRadius: borderRadiusValue,
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.12)',
                zIndex: 1,
              }}
            />
            <div
              className="absolute rounded-lg bg-white"
              style={{
                bottom: '-2px',
                right: '-2px',
                width: '100%',
                height: '100%',
                borderRadius: borderRadiusValue,
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                zIndex: 2,
              }}
            />
          </>
        )}
        {imageBorder.style === 'card' && (
          <div
            className="absolute rounded-lg bg-white"
            style={{
              bottom: '-4px',
              right: '-4px',
              width: '100%',
              height: '100%',
              borderRadius: borderRadiusValue,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              zIndex: 1,
            }}
          />
        )}
        {/* Background wrapper for liquid and overlay */}
        {(imageBorder.style === 'liquid' || imageBorder.style === 'overlay') && (
          <div
            className="absolute inset-0 rounded-lg"
            style={{
              borderRadius: borderRadiusValue,
              background: imageBorder.style === 'liquid'
                ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.25) 0%, rgba(251, 146, 60, 0.25) 50%, rgba(255, 255, 255, 0.95) 100%)'
                : 'linear-gradient(135deg, rgba(168, 85, 247, 0.9) 0%, rgba(37, 99, 235, 0.9) 100%)',
              backgroundImage: imageBorder.style === 'liquid'
                ? 'radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.9), transparent 60%)'
                : undefined,
              boxShadow: shadowStyle !== 'none' ? shadowStyle : defaultShadow,
              padding: '6px',
              zIndex: 1,
            }}
          />
        )}
        {/* Main image */}
        <img
          src={imageUrl}
          alt="Uploaded image"
          className="max-w-full max-h-full object-contain relative"
          style={{
            ...borderStyles,
            zIndex: 10,
            position: 'relative',
          }}
        />
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt="Uploaded image"
      className="max-w-full max-h-full object-contain"
      style={borderStyles}
    />
  );
};

