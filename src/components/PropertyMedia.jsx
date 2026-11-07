import React from "react";
import { apiAssetUrl } from "../lib/format.js";

const isVideoAsset = (url) => /\.(mp4|webm|mov|m4v)(?:[?#].*)?$/i.test(url || "");

export function PropertyMedia({ imageUrl, videoUrl, alt = "", className = "" }) {
  const imageIsVideo = isVideoAsset(imageUrl);
  const video = videoUrl || (imageIsVideo ? imageUrl : "");
  const image = imageIsVideo ? "" : imageUrl;

  if (video) {
    return (
      <video
        className={className}
        src={apiAssetUrl(video)}
        poster={image ? apiAssetUrl(image) : undefined}
        muted
        autoPlay
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        onError={(event) => {
          event.currentTarget.hidden = true;
          event.currentTarget.parentElement?.classList.add("has-image-error");
        }}
      />
    );
  }

  if (image) {
    return (
      <img
        className={className}
        src={apiAssetUrl(image)}
        alt={alt}
        loading="lazy"
        onError={(event) => {
          event.currentTarget.hidden = true;
          event.currentTarget.parentElement?.classList.add("has-image-error");
        }}
      />
    );
  }

  return null;
}
