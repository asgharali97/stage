export interface ShadowProps {
  shadowColor?: string;
  shadowBlur?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
  shadowOpacity?: number;
}

export interface ShadowConfig {
  enabled: boolean;
  elevation: number;
  side: 'bottom' | 'right' | 'bottom-right';
  softness: number;
  color: string;
  intensity: number;
}

export function getShadowProps(shadow: ShadowConfig): ShadowProps | Record<string, never> {
  if (!shadow.enabled) return {};

  const { elevation, side, softness, color, intensity } = shadow;
  const diag = elevation * 0.707;
  const offset =
    side === 'bottom'
      ? { x: 0, y: elevation }
      : side === 'right'
      ? { x: elevation, y: 0 }
      : side === 'bottom-right'
      ? { x: diag, y: diag }
      : { x: 0, y: 0 };

  const colorMatch = color.match(/rgba?\(([^)]+)\)/)
  let shadowColor = color
  
  if (colorMatch) {
    const parts = colorMatch[1].split(',').map(s => s.trim())
    if (parts.length === 4) {
      shadowColor = `rgba(${parts[0]}, ${parts[1]}, ${parts[2]}, 1)`
    } else if (parts.length === 3) {
      shadowColor = `rgb(${parts[0]}, ${parts[1]}, ${parts[2]})`
    }
  }

  return {
    shadowColor,
    shadowBlur: softness,
    shadowOffsetX: offset.x,
    shadowOffsetY: offset.y,
    shadowOpacity: Math.min(1, Math.max(0, intensity)),
  };
}

