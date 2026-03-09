import React, { useEffect, useRef } from "react";

export default function EventsFrame({ darkMode }) {

  const iframeRef = useRef(null);

  useEffect(() => {

    const iframe = iframeRef.current;
    if (!iframe) return;

    iframe.onload = () => {
      iframe.contentWindow.postMessage(
        {
          type: "theme",
          darkMode
        },
        "http://localhost:3000"
      );
    };

  }, [darkMode]);

useEffect(() => {
  const handleMessage = (event) => {
    if (event.data.type === "resize") {
      if (iframeRef.current) {
        const height = parseInt(event.data.height) || 0;
        iframeRef.current.style.height = height + "px";
        iframeRef.current.style.marginBottom = "0";
        iframeRef.current.style.padding = "0";
      }
    }
  };

  window.addEventListener("message", handleMessage);
  return () => window.removeEventListener("message", handleMessage);
}, []);


  return (
    <iframe
      ref={iframeRef}
      src="http://localhost:3000"
      style={{
        width: "100%",
        border: "none",
        display: "block"
      }}
      scrolling="no"
      title="events-app"
    />
  );
}