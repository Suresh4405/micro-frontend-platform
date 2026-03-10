import React, { useEffect, useRef } from "react";

export default function PricingFrame({ darkMode }) {
  const iframeRef = useRef(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleLoad = () => {
      iframe.contentWindow.postMessage(
        {
          type: "theme",
          darkMode
        },
        "https://micro-frontend-pricing.vercel.app/"
      );
    };

    iframe.addEventListener("load", handleLoad);
    return () => iframe.removeEventListener("load", handleLoad);
  }, [darkMode]);

  return (
    <iframe
      ref={iframeRef}
      src="https://micro-frontend-pricing.vercel.app/"
      style={{
        width: "100%",
        height: "1000px",
        border: "none"
      }}
      scrolling="no"
      title="pricing-app"
    />
  );
}