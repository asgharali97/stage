'use client';

import * as React from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { ImageBorder } from '@/lib/store';

interface BorderControlsProps {
  border: ImageBorder;
  onBorderChange: (border: ImageBorder | Partial<ImageBorder>) => void;
}

export function BorderControls({ border, onBorderChange }: BorderControlsProps) {
  const borderStyles: Array<{ value: ImageBorder['style']; label: string }> = [
    { value: 'solid', label: 'Solid' },
    { value: 'dashed', label: 'Dashed' },
    { value: 'dotted', label: 'Dotted' },
    { value: 'double', label: 'Double' },
  ];

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Border
          </Label>
          <Button
            variant={border.enabled ? 'default' : 'outline'}
            size="sm"
            onClick={() => onBorderChange({ enabled: !border.enabled })}
            className={`text-xs transition-all rounded-lg ${
              border.enabled
                ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm'
                : 'border-border hover:border-border/80 hover:bg-accent text-foreground'
            }`}
          >
            {border.enabled ? 'Enabled' : 'Disabled'}
          </Button>
        </div>

        {border.enabled && (
          <>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label className="text-xs font-medium text-gray-700">Border Width</Label>
                <span className="text-xs text-gray-500">{border.width}px</span>
              </div>
              <Slider
                value={[border.width]}
                onValueChange={(value) => onBorderChange({ width: value[0] })}
                min={1}
                max={20}
                step={1}
              />
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-medium text-gray-700">Border Style</Label>
              <div className="grid grid-cols-2 gap-2">
                {borderStyles.map((style) => (
                  <Button
                    key={style.value}
                    variant={border.style === style.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onBorderChange({ style: style.value })}
                    className={`text-xs transition-all rounded-lg ${
                      border.style === style.value
                        ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm'
                        : 'border-border hover:border-border/80 hover:bg-accent text-foreground'
                    }`}
                  >
                    {style.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-medium text-gray-700">Border Color</Label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={border.color}
                  onChange={(e) => onBorderChange({ color: e.target.value })}
                  className="w-12 h-10 rounded-lg border border-border cursor-pointer"
                />
                <input
                  type="text"
                  value={border.color}
                  onChange={(e) => onBorderChange({ color: e.target.value })}
                  placeholder="#000000"
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 bg-white"
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

