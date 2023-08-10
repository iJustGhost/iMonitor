import React, { useEffect, useState } from "react";
import supabase from "../iMonitorDBconfig";
import AnnouncementConfig from "./AnnouncementConfig";
import "react-datepicker/dist/react-datepicker.module.css";
import { ToastContainer, toast } from "react-toastify";

function AnnouncementStudent({ studemail }) {
  const [announcementinfo, setAnnouncementInfo] = useState([]);
  const [announcementinfoState, setAnnouncementInfoState] = useState(false);
  const [title, setTitle] = useState("");
  const [studname1, setStudName1] = useState();

  const [getId, setGetId] = useState("");
  const [getTitle, setGetTitle] = useState("");
  const [getMessage, setGetMessage] = useState("");
  const [getDate, setGetDate] = useState("");
  const [getAllow, setGetAllow] = useState("");
  const [getFiles, setGetFiles] = useState([]);
  const [getFileName, setGetFileName] = useState();

  useEffect(() => {
    const interval = setInterval(() => {
      handlefetchinfo();
    }, 1000 * 10);
    handlefetchinfo();
    fetchstudinfo();

    return () => {
      clearInterval(interval);
    };
  }, []);

  const [isEmpty, setIsEmpty] = useState(false);
  let [file, setFile] = useState([]);
  const [filename, setFileName] = useState();

  const handleFileInputChange = (event) => {
    const files = event.target.files;
    const datafile = event.target.files[0];
    if (files.length > 0) {
      setFile(datafile);
      setFileName(datafile.name);
    } else {
    }
  };

  const fetchstudinfo = async () => {
    try {
      const { data, error } = await supabase
        .from("StudentInformation")
        .select()
        .eq("studemail", studemail)
        .single();

      if (data) {
        setStudName1(data.studname);
      }
      if (error) {
      }
    } catch (error) {}
  };

  const handleUploadSubmitAnnouncement = async () => {
    try {
      if (file.length === 0) {
        nofile();
        return;
      }
      let random = Math.floor(Math.random() * 100) + 1;
      setIsEmpty(true);
      const { data1 } = await supabase.storage
        .from("StudentAnnouncementSubmit")
        .upload(getTitle + "/" + studname1 + "/" + random + filename, file);
      notifyuploaded();
      setFile([]);
    } catch (error) {}
  };

  function notifyuploaded() {
    toast.info("File has been submitted!", {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    setTimeout(() => {
      setIsEmpty(false);
    }, 1000);
  }
  function nofile() {
    toast.warn("No File Detected!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  }

  function handlefetchinfo() {
    try {
      const fetchannouncement = async () => {
        const { data, error } = await supabase
          .from("AnnouncementTable")
          .select();

        if (data) {
          setAnnouncementInfo(data);
          setTitle(data.announcementTitle);
          if (data < 1) {
            setAnnouncementInfoState(false);
            return;
          }
          setAnnouncementInfoState(true);
        }
      };

      fetchannouncement();
    } catch (error) {}
  }

  return (
    <>
      <ToastContainer />
      <div className=" flex items-center h-screen flex-col">
        <div className="font-bold text-[30px] text-center h-[10%] text-white">
          Announcements
        </div>
        <div className="bg-gray-400 w-[90%] md:h-[75%] h-[60%]  gap-1 flex rounded-md">
          <div className="bg-white  w-[100%] h-[100%]  rounded-md">
            <div className="overflow-y-scroll  rounded-md">
              {announcementinfoState ? (
                <div>
                  {announcementinfo
                    .sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
                    .map((announcementinfo) => (
                      <div
                        key={announcementinfo.id}
                        className="hover:cursor-pointer p-2 rounded-md "
                      >
                        <AnnouncementConfig
                          announcementinfo={announcementinfo}
                          setGetId={setGetId}
                          setGetTitle={setGetTitle}
                          setGetDate={setGetDate}
                          setGetMessage={setGetMessage}
                          setGetAllow={setGetAllow}
                          setGetFiles={setGetFiles}
                          setGetFileName={setGetFileName}
                          studemail={studemail}
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
          <div className="bg-gray-300  rounded-r-md h-[100%]">
            {getId ? (
              <div id="announcement" className="pl-[2%] pt-3 pr-[2%] h-[100%]">
                <div className="font-bold text-[20px]  overflow-x-auto md:h-20 h-[10%] ">
                  {getTitle}
                </div>
                <div className="font-mediumtext-[15px] mb-10">
                  Posted in {getDate}
                </div>
                <div className="p-2 font-sans font-medium text-[15px]  h-[73%] mb-10 text-start overflow-y-auto ">
                  {getMessage}
                  <div>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Iste quia sunt, tenetur amet sit nemo molestias nisi
                    repudiandae consectetur aut voluptates odio pariatur
                    veritatis blanditiis odit ullam iure perferendis ad, ducimus
                    incidunt. Delectus voluptatum, porro reiciendis illum
                    ducimus saepe harum illo sunt quod! Ea, enim. Totam
                    voluptates iusto illum sunt eos soluta labore odio vel.
                    Minima optio eligendi porro in illum libero ipsam recusandae
                    expedita doloribus iusto quae illo a fugiat voluptatem alias
                    ut dolorum sint, magnam vero sit doloremque qui eum
                    provident laboriosam? Dignissimos assumenda nemo tenetur
                    natus voluptas vitae rerum reprehenderit pariatur deleniti
                    laudantium alias vel molestias quibusdam esse sit ad,
                    repudiandae distinctio voluptatem, neque deserunt explicabo.
                    Aliquam aspernatur, similique tempore at, doloremque id
                    facilis qui nostrum nulla commodi veniam in vel blanditiis
                    voluptates debitis hic odio molestias accusamus? Minima
                    veniam ipsa dolorem eius consequatur deserunt provident
                    autem. In eaque, eum eligendi voluptate ad quod vero modi
                    voluptates.
                  </div>
                  {getFiles && (
                    <div className="flex gap-2 mt-4">
                      <h3>Download Link:</h3>
                      <a
                        href={getFiles.publicUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        {getFileName}
                      </a>
                    </div>
                  )}
                  {getAllow === "true" ? (
                    <div>
                      <div className="font-semibold mt-[5%] ">
                        Upload file here
                      </div>
                      <input
                        type="file"
                        onChange={handleFileInputChange}
                        className=" w-[200px] overflow-x-auto "
                      />

                      <button
                        disabled={isEmpty}
                        onClick={handleUploadSubmitAnnouncement}
                        className={`${
                          isEmpty
                            ? "bg-gray-400 w-[100px] rounded-md p-1 text-black mt-2 "
                            : " mt-2 w-[100px] rounded-md p-1 bg-blue-500 hover:bg-blue-700 text-white font-semibold"
                        }`}
                      >
                        Submit
                      </button>
                    </div>
                  ) : (
                    <div></div>
                  )}
                </div>
              </div>
            ) : (
              <div className="justify-center items-center flex h-full font-semibold font-sans text-[30px]">
                Announcement will be displayed here
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default AnnouncementStudent;
