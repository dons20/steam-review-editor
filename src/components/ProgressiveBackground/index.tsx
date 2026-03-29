import React, { useState, useEffect } from "react";
import classes from "./ProgressiveBackground.module.scss";

import smallBackground from "assets/img/small_background.webp";
import backgroundWebp from "assets/img/background.webp";
import backgroundPng from "assets/img/background.png";

const ProgressiveBackground: React.FC = () => {
  const [loadedImg, setLoadedImg] = useState<string | null>(null);

  useEffect(() => {
    // Try to load the higher resolution webp first
    const img = new Image();
    img.src = backgroundWebp;

    img.onload = () => {
      setLoadedImg(backgroundWebp);
    };

    img.onerror = () => {
      // Fallback to png if webp fails to load
      const fallbackImg = new Image();
      fallbackImg.src = backgroundPng;
      fallbackImg.onload = () => {
        setLoadedImg(backgroundPng);
      };
    };
  }, []);

  return (
    <div className={classes.backgroundContainer}>
      {/* Low-res placeholder always at bottom */}
      <div
        className={classes.placeholder}
        style={{ backgroundImage: `url(${smallBackground})` }}
      />

      {/* High-res image fades in on top when loaded */}
      <div
        className={`${classes.highRes} ${loadedImg ? classes.loaded : ""}`}
        style={loadedImg ? { backgroundImage: `url(${loadedImg})` } : undefined}
      />
    </div>
  );
};

export default ProgressiveBackground;
