"use client";

import { useEffect, useRef } from "react";

interface PanoramaViewerProps {
  imageUrl: string;
  title?: string;
}

export default function PanoramaViewer({ imageUrl, title }: PanoramaViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<ReturnType<typeof window.pannellum.viewer> | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const initViewer = () => {
      if (!window.pannellum || !containerRef.current) return;
      if (viewerRef.current) {
        viewerRef.current.destroy();
      }
      viewerRef.current = window.pannellum.viewer(containerRef.current, {
        type: "equirectangular",
        panorama: imageUrl,
        autoLoad: true,
        autoRotate: -2,
        showControls: true,
        compass: false,
        title: title ?? "",
        hfov: 100,
      });
    };

    if (window.pannellum) {
      initViewer();
    } else {
      const script = document.getElementById("pannellum-script");
      if (script) {
        script.addEventListener("load", initViewer);
      }
    }

    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, [imageUrl, title]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full rounded-xl overflow-hidden"
      style={{ minHeight: "400px" }}
    />
  );
}
