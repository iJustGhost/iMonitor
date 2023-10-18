import React, { useRef, useEffect } from "react";

function ViewImage({ imgsrc, visible, onClose }) {
  const divRef = useRef(null);

  const toggleDiv = () => {
    onClose(false);
  };

  const handleClickOutside = (event) => {
    if (divRef.current && !divRef.current.contains(event.target)) {
      onClose(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!visible) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-lg flex justify-center items-center z-50">
      <img ref={divRef} src={imgsrc} className="h-[100%]"></img>
    </div>
  );
}

export default ViewImage;
