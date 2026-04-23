"use client";

import PanoramaViewer from "./PanoramaViewer";

interface PhotoViewerProps {
  photoUrl: string;
  photoType: "panorama" | "flat" | "video";
  title?: string;
}

export default function PhotoViewer({ photoUrl, photoType, title }: PhotoViewerProps) {
  if (photoType === "panorama") {
    return <PanoramaViewer imageUrl={photoUrl} title={title} />;
  }

  if (photoType === "video") {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black rounded-xl overflow-hidden" style={{ minHeight: "400px" }}>
        <video
          src={photoUrl}
          controls
          playsInline
          className="max-w-full max-h-full"
          style={{ maxHeight: "500px" }}
        />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center bg-black rounded-xl overflow-hidden" style={{ minHeight: "400px" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photoUrl}
        alt={title ?? "座席からの眺め"}
        className="max-w-full max-h-full object-contain"
        style={{ maxHeight: "500px" }}
      />
    </div>
  );
}
