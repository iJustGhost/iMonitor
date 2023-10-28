import React, { useRef, useEffect } from "react";
import { HiDownload } from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";
import { saveAs } from "file-saver";
function ViewImage({ imgsrc, visible, onClose, name }) {
  const divRef = useRef(null);

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
    <div className="fixed inset-0  bg-black bg-opacity-30 backdrop-blur-lg flex-col justify-center  items-center z-50">
      <AiOutlineClose className="md:ml-[97.5%] ml-[90%] mt-[10px] text-white text-[35px] font-semibold" />

      <div
        ref={divRef}
        className="text-end m-20 place-content-center flex flex-col items-center"
      >
        <img
          src={imgsrc}
          className="max-h-[100%]  max-w-[100%] min-h-[500px]  min-w-[500px]"
        />
        <a
          onClick={() => saveAs(imgsrc, name)}
          download={"computer"}
          className="text-white font-semibold flex items-center hover:text-blue-500 cursor-pointer"
        >
          <HiDownload className="text-[20px] " /> Download
        </a>{" "}
      </div>
    </div>
  );
}

export default ViewImage;
