'use client';

import * as React from 'react';
import { ImageBorder } from '@/lib/store';
import { cn } from '@/lib/utils';

interface BorderStyleSelectorProps {
  border: ImageBorder;
  onBorderChange: (border: ImageBorder | Partial<ImageBorder>) => void;
}

type BorderStyle = {
  id: ImageBorder['style'];
  label: string;
  preview: React.ReactNode;
};

export function BorderStyleSelector({ border, onBorderChange }: BorderStyleSelectorProps) {
  const borderStyles: BorderStyle[] = [
    {
      id: 'default',
      label: 'Default',
      preview: (
        <div className="w-full h-full rounded-lg bg-white shadow-[0_4px_12px_rgba(0,0,0,0.15)]" />
      ),
    },
    {
      id: 'glass-light',
      label: 'Glass Light',
      preview: (
        <div className="w-full h-full rounded-lg bg-white relative overflow-hidden">
          <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/70 to-white/50 backdrop-blur-sm border border-gray-200/60 shadow-[0_4px_16px_rgba(0,0,0,0.1)]" />
          <div className="absolute inset-[1px] rounded-lg bg-white/60" />
        </div>
      ),
    },
    {
      id: 'glass-dark',
      label: 'Glass Dark',
      preview: (
        <div className="w-full h-full rounded-lg bg-white relative overflow-hidden">
          <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-gray-700/60 shadow-[0_4px_16px_rgba(0,0,0,0.3)]" />
          <div className="absolute inset-[1px] rounded-lg bg-white/40" />
        </div>
      ),
    },
    {
      id: 'liquid',
      label: 'Liquid',
      preview: (
        <div className="w-full h-full rounded-lg bg-white relative overflow-hidden">
          <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-blue-400/25 via-orange-300/25 to-white shadow-[0_4px_12px_rgba(0,0,0,0.15)]" />
          <div className="absolute inset-0 rounded-lg bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.9),transparent_60%)]" />
        </div>
      ),
    },
    {
      id: 'outline',
      label: 'Outline',
      preview: (
        <div className="w-full h-full rounded-lg bg-white border-2 border-gray-300 shadow-[0_4px_12px_rgba(0,0,0,0.15)]" />
      ),
    },
    {
      id: 'border',
      label: 'Border',
      preview: (
        <div className="w-full h-full rounded-lg bg-white border-[3px] border-black shadow-[0_4px_12px_rgba(0,0,0,0.15)]" />
      ),
    },
    {
      id: 'retro',
      label: 'Retro',
      preview: (
        <div className="w-full h-full rounded-lg bg-white relative shadow-[0_4px_0_rgba(0,0,0,0.15)]">
          <div className="absolute bottom-0 right-0 w-full h-full rounded-lg border-r-4 border-b-4 border-black" />
        </div>
      ),
    },
    {
      id: 'card',
      label: 'Card',
      preview: (
        <div className="w-full h-full rounded-lg relative">
          <div className="absolute bottom-[-4px] right-[-4px] w-full h-full rounded-lg bg-white shadow-[0_4px_12px_rgba(0,0,0,0.15)]" />
          <div className="absolute inset-0 rounded-lg bg-white shadow-[0_4px_12px_rgba(0,0,0,0.15)]" />
        </div>
      ),
    },
    {
      id: 'stack',
      label: 'Stack',
      preview: (
        <div className="w-full h-full rounded-lg relative">
          <div className="absolute bottom-[-6px] right-[-6px] w-full h-full rounded-lg bg-white shadow-[0_4px_8px_rgba(0,0,0,0.12)]" />
          <div className="absolute bottom-[-3px] right-[-3px] w-full h-full rounded-lg bg-white shadow-[0_2px_6px_rgba(0,0,0,0.1)]" />
          <div className="absolute inset-0 rounded-lg bg-white shadow-[0_4px_12px_rgba(0,0,0,0.15)]" />
        </div>
      ),
    },
    {
      id: 'stack2',
      label: 'Stack 2',
      preview: (
        <div className="w-full h-full rounded-lg relative">
          <div className="absolute bottom-[-5px] right-[-5px] w-full h-full rounded-lg bg-white shadow-[0_4px_8px_rgba(0,0,0,0.12)]" />
          <div className="absolute bottom-[-2px] right-[-2px] w-full h-full rounded-lg bg-white shadow-[0_2px_6px_rgba(0,0,0,0.1)]" />
          <div className="absolute inset-0 rounded-lg bg-white shadow-[0_4px_12px_rgba(0,0,0,0.15)]" />
        </div>
      ),
    },
    {
      id: 'overlay',
      label: 'Overlay',
      preview: (
        <div className="w-full h-full rounded-lg bg-gradient-to-br from-purple-400 to-blue-600 shadow-[0_4px_12px_rgba(0,0,0,0.15)]" />
      ),
    },
    {
      id: 'solid',
      label: 'Solid',
      preview: (
        <div className="w-full h-full rounded-lg bg-white border-[3px] border-gray-400 shadow-[0_4px_12px_rgba(0,0,0,0.15)]" />
      ),
    },
    {
      id: 'dashed',
      label: 'Dashed',
      preview: (
        <div className="w-full h-full rounded-lg bg-white border-[3px] border-dashed border-gray-400 shadow-[0_4px_12px_rgba(0,0,0,0.15)]" />
      ),
    },
    {
      id: 'dotted',
      label: 'Dotted',
      preview: (
        <div className="w-full h-full rounded-lg bg-white border-[3px] border-dotted border-gray-400 shadow-[0_4px_12px_rgba(0,0,0,0.15)]" />
      ),
    },
    {
      id: 'double',
      label: 'Double',
      preview: (
        <div className="w-full h-full rounded-lg bg-white border-4 border-double border-gray-400 shadow-[0_4px_12px_rgba(0,0,0,0.15)]" />
      ),
    },
  ];

  const handleStyleSelect = (styleId: ImageBorder['style']) => {
    onBorderChange({ style: styleId, enabled: true });
  };

  return (
    <div className="space-y-3">
      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Style
      </div>
      <div className="grid grid-cols-3 gap-2.5">
        {borderStyles.map((style) => {
          const isSelected = border.style === style.id && border.enabled;
          return (
            <button
              key={style.id}
              onClick={() => handleStyleSelect(style.id)}
              className={cn(
                'relative aspect-square rounded-lg p-2 transition-all cursor-pointer group',
                'hover:scale-105 active:scale-95',
                'focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-1',
                isSelected
                  ? 'ring-2 ring-primary ring-offset-2 bg-primary/5 shadow-sm'
                  : 'bg-gray-50 hover:bg-gray-100/80 border border-transparent hover:border-gray-200'
              )}
              title={style.label}
            >
              <div className="w-full h-full rounded-md overflow-hidden">{style.preview}</div>
              <div className={cn(
                'absolute -bottom-0.5 left-1/2 -translate-x-1/2 text-[9px] font-medium truncate max-w-[90%] px-1 rounded',
                isSelected ? 'text-primary font-semibold' : 'text-gray-600 group-hover:text-gray-800'
              )}>
                {style.label}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

