import React, { useEffect, useState, useRef } from "react";
import profile from "../images/profile.png";
import supabase from "../iMonitorDBconfig";
import MessagingConfigStudent from "./MessagingConfigStudent";
import DateConverter from "../StudentPages/DateConverter";
import MessagingConfig from "./MessagingConfigStudent";
import moment from "moment";
// Icons
import { MdArrowBackIos } from "react-icons/md";
import { BsFillSendFill } from "react-icons/bs";
import { IoMdContacts } from "react-icons/io";
import { AiFillCheckCircle } from "react-icons/ai";
import { GrAttachment } from "react-icons/gr";
import UserMessagesDisplay from "../Messaging/UserMessagesDisplay";

const MessageStudent = ({ studemail }) => {
  // bene information
  const [beneinfo, setBeneInfo] = useState([]);
  const [getbeneName, setGetBeneName] = useState("");
  // stud information
  const [studName, setStudName] = useState([]);
  // message
  const [message, setMessage] = useState("");
  const [havemessage, setHaveMessage] = useState(true);
  // fetching messagers
  const [receivedmessages, setReceivedMessages] = useState();
  //end of the message
  const messageEndRef = useRef(null);

  // Mobile Identifier
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  const [showContact, setShowContacts] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  // seen shower
  const [seen, setSeen] = useState(false);

  //delivered
  const [delivered, setDelivered] = useState(false);

  // set readmessage
  const [read, setRead] = useState(false);

  // Resize
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

    const BeneAccount = supabase
      .channel("custom-update-channel")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "BeneAccount" },
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
  }, [getbeneName]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView();
  }, [receivedmessages]);

  // Data Getter In SupaBase
  async function DataGetter() {
    const { data: beneInfo } = await supabase.from("BeneAccount").select();
    if (beneInfo) setBeneInfo(beneInfo);

    const { data: studInfo } = await supabase
      .from("StudentInformation")
      .select()
      .eq("studemail", studemail)
      .single();
    if (studInfo) {
      setStudName(studInfo.studname);
    }
  }

  // Message Getter In SupaBase
  const MessageGetter = async () => {
    try {
      const { data: bene } = await supabase
        .from("Messaging")
        .select()
        .eq("name", studName);

      const { data: stud } = await supabase
        .from("Messaging")
        .select()
        .eq("name", getbeneName);

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
        name: studName,
        message: message,
        contactwith: getbeneName,
        readmessage: false,
      },
    ]);

    const { data: modif } = await supabase
      .from("StudentInformation")
      .update({ last_Modif: moment().format("MMMM Do YYYY, h:mm:ss a") })
      .eq("studname", studName);

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
  }

  const hiddenFileInput = useRef(null);

  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };
  const handleChange = (event) => {
    const fileUploaded = event.target.files[0];
  };

  return (
    <>
      <div className="w-[100%] h-screen md:pt-[2%] pt-[12%] md:p-5 p-1 flex justify-center bg-[#90bbdf] bg-opacity-40  ">
        <div className="  h-[87%] w-[100%] md:p-5 p-0 flex md:gap-3 gap-1 rounded-md ">
          <div
            className={`${
              window.innerWidth <= 768
                ? `  ${
                    showMessage
                      ? "hidden"
                      : "md:w-[250px] w-[100%] md:h-[100%] h-[90%] md:flex-col bg-white rounded-l-md"
                  }`
                : "md:w-[250px] w-[100%] md:h-[100%] h-[90%] md:flex-col bg-white rounded-l-md "
            }`}
          >
            <p className="font-bold text-[25px] h-[51px] text-center pt-1 text-white rounded-tl-md bg-[#145DA0] flex items-center justify-center ">
              <IoMdContacts className="text-[25px] text-white mr-0.5  mt-1" />
              Contacts
            </p>
            {beneinfo && (
              <div className="h-[93%] rounded-bl-md overflow-y-auto scroll-smooth">
                {beneinfo
                  .sort((a, b) => (a.last_Modif > b.last_Modif ? -1 : 1))
                  .sort((a, b) => (a.last_Modif > b.last_Modif ? -1 : 1))
                  .map((beneinfo) => (
                    <MessagingConfig
                      key={beneinfo.id}
                      beneinfo={beneinfo}
                      setGetBeneName={setGetBeneName}
                      setShowMessage={setShowMessage}
                      setShowContacts={setShowContacts}
                      message={receivedmessages}
                      studName={studName}
                      read={read}
                    />
                  ))}
              </div>
            )}
          </div>
          <div
            className={` ${
              window.innerWidth <= 768
                ? `  ${
                    showMessage
                      ? "w-[100%] md:h-[100%] h-[90%] bg-[#145DA0] rounded-r-md"
                      : "hidden"
                  }`
                : "w-[100%] md:h-[100%] h-[90%] bg-[#145DA0] rounded-r-md"
            }`}
          >
            {getbeneName && (
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
                    {getbeneName}
                  </p>
                </div>
                {/* Message Container Design */}
                {receivedmessages ? (
                  <div className="md:h-[78%] h-[80%] w-[100%] bg-slate-300 p-3 overflow-y-auto">
                    {receivedmessages
                      .sort((a, b) => (a.created_at < b.created_at ? -1 : 1))
                      .map((message) => (
                        <UserMessagesDisplay
                          key={message.id}
                          message={message}
                          getstudname={getbeneName}
                          beneName={studName}
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
                        Seen by {getbeneName}
                      </div>
                    )}
                  </div>
                ) : (
                  <div>No Messages Found</div>
                )}
                <div className="flex flex-col w-[100%] h-[45%] ">
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
                    <div className="w-[100%] h-auto justify-center">
                      <textarea
                        onKeyDown={handleKeyDown}
                        value={message}
                        onChange={handlemessage}
                        onClick={() => setRead(!read)}
                        rows="3"
                        className="mt-2 ml-1 p-1 w-[100%]  h-[20%] text-sm text-gray-900  rounded-md resize-none"
                        placeholder="Write Remaks Here.."
                      />
                    </div>

                    {message === "" ? (
                      <button
                        onClick={() => handlesendmessageLIKE()}
                        className={`bg-[#60A3D9] group md:mt-2 mt-3 md:h-[21%] md:w-[6%] h-[18%] w-[70px] rounded-full text-center justify-center items-center mr-[2%] ml-[2%] flex pr-0.5 `}
                      >
                        <IoMdThumbsUp
                          className={` text-blue-900 group-hover:text-white md:text-[30px] text-[25px]`}
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
                              ? " text-blue-900 md:text-[30px] text-[20px]"
                              : " text-blue-900 group-hover:text-white md:text-[30px] text-[20px]"
                          }  `}
                        />
                      </button>
                    )}
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

export default MessageStudent;
