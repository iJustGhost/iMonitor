import React, { useEffect, useState } from "react";
import supabase from "../iMonitorDBconfig";
import UploadStudentConfig from "./UploadStudentConfig";
import StudentUploadedFileConfig from "./StudentUploadedFileConfig";
import AOS from "aos";
import "aos/dist/aos.css";

function UploadLog() {
  const [studsubmitinfo, setStudSubmitInfo] = useState([]);
  const [announceinfo, setAnnounceInfo] = useState([]);

  const [getId, setGetId] = useState("");
  const [getTitle, setGetTitle] = useState("");
  const [getMessage, setGetMessage] = useState("");
  const [getDate, setGetDate] = useState("");
  const [getAllow, setGetAllow] = useState("");
  const [getFiles, setGetFiles] = useState([]);
  const [getFileName, setGetFileName] = useState();
  const [counter, setCounter] = useState();
  const [getFileSubmit, setGetFileSubmit] = useState([]);

  //design
  const [open, setOpen] = useState(false);

  // AOS ANIMATION
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const handleGetsubmitedAnnouncement = async () => {
    const { data, error } = await supabase.from("AnnouncementTable").select();
    if (data) {
      setAnnounceInfo(data);
    }
    if (error) console.log(error);
  };

  function run() {
    handleGetsubmitedAnnouncement();
  }

  useEffect(() => {
    run();
    setOpen(true);
  }, []);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Adjust the breakpoint as needed
      setIsDesktop(window.innerWidth >= 768);

      if (window.innerWidth <= 768) {
        setOpen(false);
      }
      if (window.innerWidth >= 768) {
        setOpen(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
  }, []);

  function openannouncement() {
    if (window.innerWidth <= 768) {
      setOpen(!open);
    }
  }

  return (
    <div
      className={`flex gap-2 md:pl-5 pl-1 bg-black bg-opacity-20  h-screen md:pt-0 pt-10`}
    >
      <div
        onClick={() => openannouncement()}
        className={`${
          open
            ? " bg-slate-300 md:h-[85%] h-[75%] items-center rounded-l-md mt-5 md:ml-0  -ml-5  "
            : "w-[50px] bg-slate-300 md:h-[85%] h-[75%] rounded-l-md mt-5 md:ml-0 ml-2"
        }`}
      >
        <div
          onClick={() => setOpen(!open)}
          className={`${
            open
              ? " text-[25px] justify-center flex group"
              : "flex pl-[20px] z-10 text-[19px] text-blue-500"
          }   font-bold mt-3 mb-3   duration-100`}
        >
          {open ? (
            <div className="">Announcement</div>
          ) : (
            <div className="  text-center font-mono -ml-1 mt-10">
              <div>A</div>
              <div>N</div>
              <div>N</div>
              <div>O</div>
              <div>U</div>
              <div>N</div>
              <div>C</div>
              <div>E</div>
              <div>M</div>
              <div>E</div>
              <div>N</div>
              <div>T</div>
            </div>
          )}
        </div>

        <div>
          {announceinfo ? (
            <div className={`${open ? "" : "hidden"} duration-500`}>
              {announceinfo
                .sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
                .map((announcementinfo) => (
                  <div
                    key={announcementinfo.id}
                    className="hover:cursor-pointer p-2 rounded-md "
                  >
                    <UploadStudentConfig
                      key={announcementinfo.id}
                      announceinfo={announcementinfo}
                      setGetId={setGetId}
                      setGetTitle={setGetTitle}
                      setGetMessage={setGetMessage}
                      setGetDate={setGetDate}
                      setGetFiles={setGetFiles}
                      setGetFileName={setGetFileName}
                      setGetFileSubmit={setGetFileSubmit}
                      setCounter={setCounter}
                    />
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center mt-[70%] font-semibold text-[25px]">
              No Announcement
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col w-[100%] duration-500">
        <div className="flex-col mt-5   bg-slate-300 md:h-[38%] h-[28%] p-3 rounded-tr-md overflow-y-auto w-[98%]">
          <div className="">
            {getId ? (
              <div className=" overflow-y-auto  p-5">
                <div className="font-bold text-[25px]">
                  Announcement Title: {getTitle}
                </div>
                <div className="font-semibold text-[12px] mb-10">
                  Posted: {getDate}
                </div>
                <div className="mb-2 font-semibold"> Announcement Message:</div>
                <div className="text-justify">
                  {getMessage} Lorem ipsum, dolor sit amet consectetur
                  adipisicing elit. Reprehenderit ipsam, officiis molestias ut
                  sunt nihil id tenetur deleniti minus voluptatibus natus
                  voluptas fugit tempore eum in quis eaque. Quo neque
                  voluptatibus aperiam ratione, nemo exercitationem, sunt cumque
                  cupiditate mollitia quia voluptates! Voluptate optio repellat,
                  dolore possimus provident similique delectus animi nihil error
                  iure dolorem maxime eos quidem, quaerat aliquid quasi quos,
                  architecto deserunt nulla molestias illum. Consequatur
                  excepturi nam labore, corrupti suscipit quasi dolorem
                  blanditiis distinctio deleniti asperiores, perspiciatis ipsa
                  expedita nesciunt laboriosam! Porro aut temporibus accusamus
                  dolorum hic error ut ipsa vitae, nobis voluptatem eligendi ab
                  illo quae eveniet?
                </div>
                {getFiles && (
                  <div className="flex gap-2 mt-4">
                    <h3>Download Link:</h3>
                    <a
                      href={getFiles.publicUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {getFileName}
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center  font-bold text-[25px]">
                Announcement Information will be dispalyed here
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-300 h-[46%]  overflow-y-auto w-[98%] mt-2  rounded-br-md">
          <div className="bg-[#60A3D9] text-center p-2 font-semibold text-[20px]">
            Student Submissions
          </div>
          {getId && (
            <div className="p-2 ">
              <dev className="flex">Student Submitted: {counter} </dev>
              {getFileSubmit.map((folder, index) => (
                <StudentUploadedFileConfig
                  key={index}
                  studname={folder}
                  announcementTitle={getTitle}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UploadLog;
