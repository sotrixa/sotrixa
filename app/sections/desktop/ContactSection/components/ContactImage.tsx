import React from "react";

interface ContactImageProps {
  imageRef: React.RefObject<HTMLDivElement | null>;
  animationsCreated: boolean;
}

export function ContactImage({
  imageRef,
  animationsCreated,
}: ContactImageProps) {
  return (
    <div
      className="flex items-center justify-center w-full h-full overflow-hidden"
      ref={imageRef}
      style={{ opacity: animationsCreated ? undefined : 1 }}
    >
      <div
        className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-50"
        style={{ maxWidth: "clamp(8rem, 35vw, 35rem)" }}
      >
        <video
          src="/video/Contact-page-video.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover block m-0 p-0 border-0 outline-none bg-[#fbfbfb]"
        />
      </div>
    </div>
  );
}
