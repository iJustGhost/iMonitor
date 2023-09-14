import { useState } from "react";
import React from "react";
import { Link } from "react-router-dom";

function AdminPage() {
  const [open, setOpen] = useState(true);
  return (
    <div>
      <div
        className={`${
          open
            ? "transition-transform -translate-x-full duration-1000"
            : "transition-transform translate-x-0 duration-1000"
        } absolute flex w-52 h-screen bg-[#5885AF] transition-transform  -translate-x-full md:translate-x-0`}
      >
        <div className="px-3 py-4 ">
          {/*REGISTRATION BUTTON*/}

          <Link
           to = '/'
            className={
              "flex items-center p-2 rounded-lg text-white transform hover:bg-blue-400 hover:cursor-pointer"
            }
          >
            <svg
              aria-hidden="true"
              className="w-6 h-6 text-gray-500 transition duration-75 dark:text-white dark:group-hover:text-white"
              fill="currentColor"
              viewBox="0 0 576 512"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm80 256h64c44.2 0 80 35.8 80 80c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16c0-44.2 35.8-80 80-80zm-32-96a64 64 0 1 1 128 0 64 64 0 1 1 -128 0zm256-32H496c8.8 0 16 7.2 16 16s-7.2 16-16 16H368c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64H496c8.8 0 16 7.2 16 16s-7.2 16-16 16H368c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64H496c8.8 0 16 7.2 16 16s-7.2 16-16 16H368c-8.8 0-16-7.2-16-16s7.2-16 16-16z" />
            </svg>
            <span className="ml-3">Admin</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
