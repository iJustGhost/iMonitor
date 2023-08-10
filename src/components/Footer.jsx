import React from "react";

const Footer = () => {
  return (
    <div className="bg-[#0074B7] py-1 h-6 w-full text-white">
      <footer className="">
        <div className="justify-between flex text-xs">
          <span className="text-white pl-4">
            © 2023{" "}
            <a href="https://sti.edu/" className="hover:underline">
              STI College
            </a>
            . All Rights Reserved.
          </span>

          <a href="#" className="mr-4 hover:underline md:pr-10 pr-16 text-white">
            About
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
