import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import supabase from "./iMonitorDBconfig";
import AOS from "aos";
import "aos/dist/aos.css";
import { IoMdNotifications } from "react-icons/io";

function Navbar({ email }) {
  // AOS ANIMATION
  useEffect(() => {
    AOS.init();
  }, []);

  const [open, setOpen] = useState(true);
  const [drop, dropopen] = useState(true);
  const [notif, setNotif] = useState(false);
  const [message, setMessage] = useState();

  useEffect(() => {
    checkmessage();

    const Messaging = supabase
      .channel("custom-filter-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Messaging",
        },
        (payload) => {
          checkmessage();
        }
      )
      .subscribe();
  }, [message]);

  async function checkmessage() {
    const { data: studdata } = await supabase
      .from("StudentInformation")
      .select()
      .eq("studemail", email)
      .single();

    const { data: studMess } = await supabase.from("Messaging").select();
    for (let index = 0; index < studMess.length; index++) {
      if (
        studMess[index].contactwith === studdata.studname &&
        studMess[index].readmessage === false
      ) {
        setNotif(true);
        return;
      } else {
        setNotif(false);
      }
    }
    setMessage(studMess);
  }

  function handlemessagebutton() {
    setOpen(!open);
    checkmessage();
  }

  return (
    <div className="flex flex-col relative z-99 ">
      {/* SIDE BAR */}
      <div
        // ref={menuRef}
        className={`${
          open
            ? "transition-transform -translate-x-full duration-300"
            : "transition-transform translate-x-0 duration-500"
        } absolute flex w-52 h-screen  bg-[#3ea6e6] transition-transform  -translate-x-full md:translate-x-0`}
      >
        <div
          className="pl-[208px] pt-[10px] absolute"
          onClick={() => setOpen(!open)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className={`${
              open ? "rotate-0 duration-300" : " rotate-180 duration-300"
            } w-7 h-7 hover:text-white  text-[#60A3D9] hover:cursor-pointer md:hidden visible`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5"
            />
          </svg>
        </div>
        <aside className={"relative"}>
          <div className="px-3 py-4 ">
            {/*Attendance*/}
            <Link
              to="/"
              onClick={() => setOpen(!open)}
              className={
                "flex items-center p-2 rounded-lg text-white hover:bg-blue-700 transform hover:translate-x-2 hover:shadow-md"
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
              <span className="ml-3">Attendance</span>
            </Link>

            {/*Announcement*/}
            <Link
              to="/announcementstudent"
              onClick={() => setOpen(!open)}
              className="flex items-center p-2 rounded-lg text-white hover:bg-blue-700 transform hover:translate-x-2 hover:shadow-md"
            >
              <svg
                aria-hidden="true"
                className="w-6 h-6 text-gray-500 transition duration-75 dark:text-white dark:group-hover:text-white"
                fill="currentColor"
                viewBox="0 0 576 512"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M64 0C28.7 0 0 28.7 0 64V352c0 35.3 28.7 64 64 64H240l-10.7 32H160c-17.7 0-32 14.3-32 32s14.3 32 32 32H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H346.7L336 416H512c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H64zM512 64V288H64V64H512z" />
              </svg>
              <span className="ml-3">Announcement</span>
            </Link>
            {/*Message*/}
            <Link
              to="/messagestudent"
              onClick={() => setOpen(!open)}
              className="flex items-center p-2 rounded-lg text-white hover:bg-blue-700 transform hover:translate-x-2 hover:shadow-md"
            >
              <svg
                aria-hidden="true"
                className="w-6 h-6 text-gray-500 transition duration-75 dark:text-white dark:group-hover:text-white"
                fill="currentColor"
                viewBox="0 0 512 512"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M64 0C28.7 0 0 28.7 0 64V352c0 35.3 28.7 64 64 64h96v80c0 6.1 3.4 11.6 8.8 14.3s11.9 2.1 16.8-1.5L309.3 416H448c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H64z" />
              </svg>
              <span className="ml-3 flex">
                Message{" "}
                {notif ? (
                  <IoMdNotifications className="text-red-600 ml-2 text-[20px]" />
                ) : (
                  ""
                )}
              </span>
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Navbar;
