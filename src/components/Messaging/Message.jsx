import React, { useEffect, useState, useRef } from "react";
import profile from "../Messaging/profile.png";
import supabase from "../iMonitorDBconfig";
import MessagingConfig from "./MessagingConfig";
import DateConverter from "./DateConverter";
import moment from "moment";
// Icons
import { BsFillSendFill } from "react-icons/bs";
import { IoMdContacts, IoMdThumbsUp } from "react-icons/io";
import { MdArrowBackIos } from "react-icons/md";
import { AiFillCheckCircle } from "react-icons/ai";

import { GrAttachment } from "react-icons/gr";
import { FadeLoader } from "react-spinners";
import UserMessagesDisplay from "./UserMessagesDisplay";

import { Backdrop } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

const Message = ({ beneemail }) => {
  // student information
  const [studinfo, setStudInfo] = useState([]);
  const [getstudname, setGetStudName] = useState("");
  // bene information
  const [beneName, setBeneName] = useState([]);
  // message
  const [message, setMessage] = useState("");
  const [havemessage, setHaveMessage] = useState(true);
  // fetching message
  const [receivedmessages, setReceivedMessages] = useState([]);

  //end of the message
  const messageEndRef = useRef(null);

  // Mobile Identifier
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  const [showContact, setShowContacts] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  // seen shower
  const [seen, setSeen] = useState(false);

  // delivered
  const [delivered, setDelivered] = useState(false);

  // set readmessage
  const [read, setRead] = useState(false);

  // Send File and File holder
  const [fileholder, setFileHolder] = useState("");
  const [fileholdername, setFileHolderName] = useState();
  const [showUpload, setShowUpload] = useState(false);

  // Resize Depending on the width of the screen
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsDesktop(window.innerWidth >= 768);

      if (window.innerWidth <= 768 && showMessage === true) {
        setShowMessage(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
  }, [receivedmessages]);

  // Runs once
  useEffect(() => {
    DataGetter();

    const StudentInformation = supabase
      .channel("custom-update-channel")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "StudentInformation" },
        (payload) => {
          DataGetter();
        }
      )
      .subscribe();
  }, []);

  // Listener & Getter in Messaging
  useEffect(() => {
    MessageGetter();
    const Messaging = supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "Messaging" },
        (payload) => {
          MessageGetter();
        }
      )
      .subscribe();
  }, [getstudname]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView();
  }, [receivedmessages]);

  // Data Getter In SupaBase
  async function DataGetter() {
    const { data: studinfo } = await supabase
      .from("StudentInformation")
      .select();
    setStudInfo(studinfo);

    const { data: beneinfo } = await supabase
      .from("BeneAccount")
      .select()
      .eq("beneEmail", beneemail)
      .single();
    if (beneinfo) {
      setBeneName(beneinfo.beneName);
    }
  }

  // Message Getter In SupaBase
  const MessageGetter = async () => {
    try {
      const { data: bene } = await supabase
        .from("Messaging")
        .select()
        .eq("name", beneName);

      const { data: stud } = await supabase
        .from("Messaging")
        .select()
        .eq("name", getstudname);

      await setReceivedMessages(bene.concat(stud));
    } catch (error) {}
  };

  // Message Opener
  function openmessage() {
    setShowMessage(!showMessage);
    if (showContact === false) {
      setShowContacts(true);
    } else {
      setShowContacts(false);
    }
  }

  // Check if textbox is not empty
  function handlemessage(e) {
    if (e.target.value.length >= 0) {
      setMessage(e.target.value);
      setHaveMessage(false);
    }
    if (e.target.value.length <= 1) {
      setHaveMessage(true);
    }
  }

  // Allows user to press enter when sending
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      if (message.split("\n")[message.split("\n").length - 1].length > 0) {
        handlesendmessage();
      }
    }
  };

  // Sending Message
  async function handlesendmessage() {
    const { data, error } = await supabase.from("Messaging").insert([
      {
        name: beneName,
        message: message,
        contactwith: getstudname,
        readmessage: false,
      },
    ]);

    const { data: modif } = await supabase
      .from("BeneAccount")
      .update({ last_Modif: moment().format("MMMM Do YYYY, h:mm:ss a") })
      .eq("beneName", beneName);

    setSeen(false);
    setMessage("");
    setHaveMessage(true);
  }

  // Sending Message LIKE
  async function handlesendmessageLIKE() {
    const { data, error } = await supabase.from("Messaging").insert([
      {
        name: beneName,
        message: "👍🏻",
        contactwith: getstudname,
        readmessage: false,
      },
    ]);

    const { data: modif } = await supabase
      .from("BeneAccount")
      .update({ last_Modif: moment().format("MMMM Do YYYY, h:mm:ss a") })
      .eq("beneName", beneName);

    setSeen(false);
    setMessage("");
    setHaveMessage(true);
    setRead(!read);
  }

  const hiddenFileInput = useRef(null);

  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };
  const handleChange = (event) => {
    const fileUploaded = event.target.files[0];
    setFileHolder(fileUploaded);

    if (fileUploaded) {
      setShowUpload(true);
    }
  };

  function removeImage() {
    setFileHolder();
    setShowUpload(false);
  }

  return (
    <>
      <div className="w-[100%] h-screen md:pt-[2%] pt-[12%] md:p-5 p-1 flex justify-center   ">
        {studinfo === null ? (
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        ) : (
          ""
        )}
        <div className="  h-[87%] w-[100%] md:p-5 p-0 flex md:gap-3 gap-1 rounded-md bg-[#90bbdf] bg-opacity-40">
          <div
            className={`${
              window.innerWidth <= 768
                ? `  ${
                    showMessage
                      ? "hidden"
                      : "md:w-[250px] w-[100%] md:h-[100%] h-[90%] md:flex-col bg-white rounded-l-md"
                  }`
                : ""
            }
            md:w-[250px] w-[100%] md:h-[100%] h-[90%] md:flex-col bg-white rounded-l-md `}
          >
            <p className="font-bold text-[25px] h-[51px] text-center pt-1 text-white rounded-tl-md bg-[#274472] flex items-center justify-center ">
              <IoMdContacts className="text-[25px] text-white mr-0.5  mt-1" />
              Contacts
            </p>
            {studinfo ? (
              <div className="h-[93%] rounded-bl-md overflow-y-auto scroll-smooth">
                {studinfo
                  .sort((a, b) => (a.last_Modif > b.last_Modif ? -1 : 1))
                  .sort((a, b) => (a.last_Modif > b.last_Modif ? -1 : 1))
                  .map((studinfo) => (
                    <MessagingConfig
                      key={studinfo.id}
                      studinfo={studinfo}
                      setGetStudName={setGetStudName}
                      setShowMessage={setShowMessage}
                      setSeen={setSeen}
                      message={receivedmessages}
                      beneName={beneName}
                      read={read}
                    />
                  ))}
              </div>
            ) : (
              <div className=" mt-[50%] place-content-center flex justify-center">
                <FadeLoader
                  color="#3658d6"
                  className="justify-center text-center"
                />
              </div>
            )}
          </div>
          <div
            className={`${
              window.innerWidth <= 768
                ? `${
                    showMessage
                      ? " w-[100%] md:h-[100%] h-[90%] bg-[#274472] rounded-r-md"
                      : "hidden"
                  }`
                : "w-[100%] md:h-[100%] h-[90%] bg-[#274472] rounded-r-md"
            }`}
          >
            {getstudname && (
              <>
                <div className=" p-2 flex">
                  {/* Header Design */}

                  {isMobile && (
                    <div onClick={() => openmessage()} className=" pt-1 group">
                      <MdArrowBackIos className="text-[25px] text-white group-hover:text-slate-400 " />
                    </div>
                  )}
                  <img
                    className="md:h-10 md:w-10 h-8 w-8 rounded-full"
                    src={profile}
                  />
                  <p className="truncate p-1 pl-[1%] mt-0.5 text-[15px] w-[100%] font-semibold text-white">
                    {getstudname}
                  </p>
                </div>
                {/* Message Container Design */}
                {receivedmessages ? (
                  <div
                    className={`${
                      showUpload ? "md:h-[62%] h-[64%] " : "md:h-[78%] h-[80%] "
                    }w-[100%] bg-[#bfd7eddc] p-3 overflow-y-auto`}
                  >
                    {receivedmessages
                      .sort((a, b) => (a.created_at < b.created_at ? -1 : 1))
                      .map((message) => (
                        <UserMessagesDisplay
                          key={message.id}
                          message={message}
                          getstudname={getstudname}
                          beneName={beneName}
                        />
                      ))}
                    <div ref={messageEndRef} />
                    {delivered && (
                      <div className="text-[10px] text-blue-700 flex justify-end">
                        Delivered
                        <AiFillCheckCircle className="mt-0.5 ml-0.5" />
                      </div>
                    )}
                    {seen && (
                      <div className=" flex justify-end text-[10px]">
                        Seen by {getstudname}
                      </div>
                    )}
                  </div>
                ) : (
                  <div>No Messages Found</div>
                )}

                <div className="flex flex-col w-[100%] h-[45%]">
                  <input
                    type="file"
                    onChange={handleChange}
                    ref={hiddenFileInput}
                    style={{ display: "none" }} // Make the file input element invisible
                  />
                  <div className="flex w-[100%] h-[100%]">
                    <button
                      className="button-upload ml-1 mt-4 hover:bg-slate-300 bg-white p-2 rounded-full h-fit items-center justify-center "
                      onClick={handleClick}
                    >
                      <GrAttachment className="" />
                    </button>
                    <div
                      className={`${
                        showUpload ? "visible flex items" : "hidden"
                      }`}
                    >
                      <div className="flex w-[120px] h-[150px] mr-[7%]">
                        {/* Displaying images will be in a .map for it will render each image with its 
                        specific remove button for the user to specfically remove a file */}
                        {fileholder && (
                          <img
                            src={URL.createObjectURL(fileholder)}
                            className="mt-1 ml-2"
                          ></img>
                        )}

                        <a
                          onClick={() => removeImage()}
                          className="-ml-4 -mt-2 rounded-full bg-slate-600 h-[20px] w-[20px] p-4 justify-center flex items-center hover:bg-red-400 cursor-pointer text-white hover:text-black"
                        >
                          X
                        </a>
                      </div>
                      <button className="bg-[#60A3D9] mt-[30%] h-[20px] p-4 flex text-slate-200 hover:bg-blue-500 hover:text-black hover:shadow-lg font-semibold justify-center items-center rounded-sm">
                        SEND
                      </button>

                      {/* Continue if the showUpload is true display the images 
                      that the user selected make sure the logic will be able 
                      to handle multiple number of files for it will be displayed,
                      after that the user will be able to remove the images that is clicked  */}
                    </div>
                    <div
                      className={`${
                        showUpload
                          ? "hidden"
                          : "visible w-[100%] h-auto justify-center flex"
                      }`}
                    >
                      <textarea
                        onKeyDown={handleKeyDown}
                        value={message}
                        onChange={handlemessage}
                        onClick={() => setRead(!read)}
                        rows="3"
                        className="mt-2 ml-1 p-1 w-[100%]  h-[20%] text-sm text-gray-900  rounded-md resize-none"
                        placeholder="Write Remaks Here.."
                      />
                      {message === "" ? (
                        <button
                          onClick={() => handlesendmessageLIKE()}
                          className={`bg-[#60A3D9] group md:mt-2 mt-3 md:h-[21%] md:w-[6%] h-[18%] w-[70px] rounded-full text-center justify-center items-center mr-[2%] ml-[2%] flex pr-0.5 `}
                        >
                          <IoMdThumbsUp
                            className={` text-[#274472] group-hover:text-white md:text-[30px] text-[25px]`}
                          />
                        </button>
                      ) : (
                        <button
                          onClick={() => handlesendmessage()}
                          disabled={havemessage}
                          className={`${
                            havemessage
                              ? " bg-[#60A3D9] group md:mt-2 mt-3 md:h-[21%] md:w-[6%] h-[18%] w-[70px] rounded-full text-center justify-center items-center mr-[2%] ml-[2%] flex pr-0.5 pt-0.5 "
                              : "bg-[#60A3D9] group md:mt-2 mt-3 md:h-[21%] md:w-[6%] h-[18%] w-[70px] rounded-full text-center justify-center items-center mr-[2%] ml-[2%] flex pr-0.5 pt-0.5 hover:ring-2 hover:ring-white"
                          }`}
                        >
                          <BsFillSendFill
                            className={`${
                              havemessage
                                ? " text-[#274472] md:text-[30px] text-[20px]"
                                : " text-[#274472] group-hover:text-white md:text-[30px] text-[20px]"
                            }  `}
                          />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Message;
