"use client";

import React, { useEffect, useRef, useState, ReactNode } from 'react';

const randomColors = (count: number) => {
  return new Array(count)
    .fill(0)
    .map(() => "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'));
};

export default function TubesBackground({ 
  children, 
  className = "",
  enableClickInteraction = true 
}: { children: ReactNode, className?: string, enableClickInteraction?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tubesRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const initTubes = async () => {
      if (!canvasRef.current) return;

      try {
        const importFunc = new Function('url', 'return import(url)');
        const module = await importFunc('https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js');
        const TubesCursor = module.default;

        if (!mounted) return;

        const app = TubesCursor(canvasRef.current, {
          tubes: {
            colors: ["#f967fb", "#53bc28", "#6958d5"], 
            lights: {
              intensity: 200,
              colors: ["#83f36e", "#fe8a2e", "#ff008a", "#60aed5"] 
            }
          }
        });

        tubesRef.current = app;
        setIsLoaded(true);

      } catch (err) {
        console.error("Failed to load TubesCursor script from CDN:", err);
        if (mounted) {
          setError("Không thể tải hiệu ứng 3D. Vui lòng kiểm tra kết nối mạng.");
        }
      }
    };

    initTubes();

    return () => {
      mounted = false;
      tubesRef.current = null;
    };
  }, []);

  const handleClick = () => {
    if (!enableClickInteraction || !tubesRef.current) return;
    const newTubesColors = randomColors(3);
    const newLightsColors = randomColors(4);
    tubesRef.current.tubes.setColors(newTubesColors);
    tubesRef.current.tubes.setLightsColors(newLightsColors);
  };

  return (
    <div 
      className={`relative w-full h-full min-h-screen overflow-hidden bg-[#0A101E] ${className}`}
      onClick={handleClick}
    >
      {error && (
        <div className="absolute inset-0 flex items-center justify-center text-red-400 z-0">
          <p className="bg-red-950/50 px-4 py-2 rounded border border-red-900/50 backdrop-blur-sm">
            {error}
          </p>
        </div>
      )}

      <canvas 
        ref={canvasRef} 
        className={`fixed inset-0 w-full h-full block transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'} pointer-events-none z-0`}
        style={{ touchAction: 'none' }}
      />
      
      <div className="relative z-10 w-full flex flex-col min-h-screen">
        {children}
      </div>
    </div>
  );
}
