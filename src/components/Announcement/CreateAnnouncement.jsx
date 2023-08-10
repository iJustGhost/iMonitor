import React, { useState, useEffect, useRef } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import supabase from "../iMonitorDBconfig";
import moment from "moment";
import { BsCheckCircleFill } from "react-icons/bs";
import { AiOutlineCheck } from "react-icons/ai";
import Datepicker from "react-tailwindcss-datepicker";
import "react-datepicker/dist/react-datepicker.module.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function CreateAnnouncement() {
  // AOS ANIMATION
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const [isSelected, setSelected] = useState(false);
  const [alert, setAlert] = useState("");
  const [title, setTitle] = useState("");
  const [endDate, setendDate] = useState("");
  const [allow, setAllow] = useState(false);
  const [message, setMessage] = useState("");

  const [date, setDate] = useState("");

  const [performerror, setPerformError] = useState("");
  var currDate = moment().format("LLL");
  let [uuid, setUuid] = useState();

  const [isEmpty, setIsEmpty] = useState(false);
  let [file, setFile] = useState([]);
  const [filename, setFileName] = useState();

  const handleFileInputChange = (event) => {
    const files = event.target.files;
    const datafile = event.target.files[0];
    if (files.length > 0) {
      setIsEmpty(true);
      setFile(datafile);
      setFileName(datafile.name);
    } else {
      setIsEmpty(false);
    }
  };

  function handlePostAnnouncement() {
    if (!title || !endDate || !message) {
      setPerformError("Please fill all fields");
      return;
    }
    var a = false;
    const postdata = async () => {
      if (isEmpty === false) {
        const { data, error } = await supabase
          .from("AnnouncementTable")
          .insert([
            {
              announcementTitle: title,
              announcementAllow: allow,
              announcementStartDate: currDate,
              announcementEndDate: endDate,
              announcementMessage: message,
            },
          ]);
        if (data) {
          console.log(data);
          a = true;
        }
        if (error) {
          console.log(error);
        }
      } else {
        const { data, error } = await supabase
          .from("AnnouncementTable")
          .insert([
            {
              announcementTitle: title,
              announcementAllow: allow,
              announcementStartDate: currDate,
              announcementEndDate: endDate,
              announcementMessage: message,
            },
          ]);
        if (data) {
          console.log(data);
          a = true;
        }
        if (error) {
          console.log(error);
        }

        const { data1, error1 } = await supabase.storage
          .from("AnnouncementAttachmentFiles")
          .upload(title + "/" + filename, file);

        if (data1) {
          console.log("Uploaded File");
          //
        }
        if (error1) {
          console.log(error1);
        }
      }
    };
    // window.location.reload();
    postdata();
    clear();
  }

  function clear() {
    setIsEmpty(false);
    handlealert();
    setAllow(false);
    setMessage("");
    setTitle("");
    setendDate("");
    setPerformError("");
    setFile([]);
  }

  function handlealert() {
    toast.success('Announcement Posted!', {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      });
  }

  return (
    <>
      <ToastContainer />
      <div className="md:pl-10 pl-2 md:pt-10 pt-0 md:pr-0 pr-2 h-screen  w-[100%] text-white overflow-hidden ">
        <div
          className="flex-col md:h-[100%] h-[82%] md:mt-0 mt-14 overflow-y-auto"
          data-aos="fade-left"
        >
          <label className="text-[30px] font-bold">CREATE ANNOUNCEMENT</label>
          <div className="mt-14">
            <label className="pr-5 text-[20px] font-semibold ">
              TITLE OF ANNOUNCEMENT:
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              type="text"
              className="rounded-md p-2 md:w-[75%] w-[100%] text-black"
            />
          </div>
          <div className="pt-6">
            <label className="pr-5 text-[20px] font-semibold ">
              ANNOUNCEMENT DURATION:
            </label>
            <input
              value={endDate}
              onChange={(e) => setendDate(e.target.value)}
              type="date"
              className="rounded-md p-2 md:w-[73.5%] w-full text-black hover:cursor-pointer"
            />
          </div>
          <div className="flex pt-6 ">
            <label className="pr-5 text-[20px] font-semibold ">
              ALLOW DROPBOX:
            </label>

            <input
              type="checkbox"
              value={allow}
              onClick={() => setAllow(!allow)}
              className="w-6 h-6 mt-1 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div className="flex pt-6 ">
            <label className="pr-5 text-[20px] font-semibold ">
              ADD ATTACHMENT:
            </label>

            <input type="file" onChange={handleFileInputChange} />
            {isEmpty && (
              <div className="">
                <AiOutlineCheck size={25} style={{ fill: "black" }} />
              </div>
            )}
          </div>

          <div className="pt-6">
            <label className="pr-5 text-[20px] font-semibold ">MESSSAGE:</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows="10"
              className="mt-3  p-1 md:w-[97%] w-full text-sm text-gray-900  rounded-md resize-none"
              placeholder="Write Remaks Here.."
            ></textarea>
          </div>
          <div>
            {performerror && (
              <div className="text-red-600 font-semibold">{performerror}</div>
            )}
            <button
              onClick={() => handlePostAnnouncement()}
              className="md:w-[97%] w-[100%] h-[35px] mb-[100px] bg-[#47b8fd]  rounded-md hover:bg-[#3282b5]"
            >
              SEND
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateAnnouncement;
