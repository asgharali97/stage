'use client';

import * as React from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { ImageBorder } from '@/lib/store';
import { BorderStyleSelector } from './BorderStyleSelector';

interface BorderControlsProps {
  border: ImageBorder;
  onBorderChange: (border: ImageBorder | Partial<ImageBorder>) => void;
}

export function BorderControls({ border, onBorderChange }: BorderControlsProps) {
  // Only show color/width controls for basic border styles
  const isBasicStyle = ['solid', 'dashed', 'dotted', 'double', 'outline', 'border'].includes(border.style);

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
            <BorderStyleSelector border={border} onBorderChange={onBorderChange} />

            {isBasicStyle && (
              <>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label className="text-xs font-medium text-gray-700">Border Width</Label>
                    <span className="text-xs text-gray-500 font-medium">{border.width}px</span>
                  </div>
                  <Slider
                    value={[border.width]}
                    onValueChange={(value) => onBorderChange({ width: value[0] })}
                    min={1}
                    max={20}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-xs font-medium text-gray-700">Border Color</Label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={border.color}
                      onChange={(e) => onBorderChange({ color: e.target.value })}
                      className="w-12 h-10 rounded-lg border border-gray-300 cursor-pointer hover:border-gray-400 transition-colors shadow-sm"
                      title="Pick border color"
                    />
                    <input
                      type="text"
                      value={border.color}
                      onChange={(e) => onBorderChange({ color: e.target.value })}
                      placeholder="#000000"
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-white"
                    />
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

