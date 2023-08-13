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
  //notifcation
  const [notif, setNotif] = useState(false);

  // Mobile Identifier
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  const [showContact, setShowContacts] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  // seen shower
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Adjust the breakpoint as needed
      setIsDesktop(window.innerWidth >= 768);

      if (window.innerWidth <= 768) {
        setShowMessage(false);
        setShowContacts(true);
      }
      if (window.innerWidth >= 768) {
        setShowMessage(true);
        setShowContacts(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    handlecontacts();
    handlebeneinfo();
  }, []);

  //get contacts in bene
  const handlecontacts = async () => {
    const { data, error } = await supabase.from("BeneAccount").select();
    if (data) setBeneInfo(data);
  };

  //get information of the current logged in
  const handlebeneinfo = async () => {
    const { data, error } = await supabase
      .from("StudentInformation")
      .select()
      .eq("studemail", studemail)
      .single();
    if (data) {
      setStudName(data.studname);
    }
  };

  // Function for Sending message
  async function handlesendmessage() {
    const { data: messforbene } = await supabase.from("Messaging").insert([
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

    setMessage("");
    setHaveMessage(true);
  }

  //Identifier if there is a message
  function handlemessage(e) {
    if (e.target.value.length >= 0) {
      setMessage(e.target.value);
      setHaveMessage(false);
    }
    if (e.target.value.length <= 1) {
      setHaveMessage(true);
    }
  }
  //studentmessage
  const fetchmessage = async () => {
    const { data: stud } = await supabase
      .from("Messaging")
      .select()
      .eq("name", studName);

    const { data: bene } = await supabase
      .from("Messaging")
      .select()
      .eq("name", getbeneName);

    await setReceivedMessages(stud.concat(bene));

    const lastmess = stud[stud.length - 1];
    lastmessage(lastmess);
  };

  // last message checker if seened set to true
  function lastmessage(lastmess) {
    if (lastmess.contactwith === getbeneName && lastmess.readmessage === true) {
      setSeen(true);
    } else {
      setSeen(false);
    }
  }

  useEffect(() => {
    const StudentInformation = supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "BeneAccount" },
        (payload) => {
          handlecontacts();
        }
      )
      .subscribe();
  }, []);

  useEffect(() => {
    fetchmessage();
    supabase
      .channel("table-db-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "Messaging",
        },
        (payload) => {
          fetchmessage();
          setNotif(true);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "Messaging",
        },
        (payload) => {
          fetchmessage();
          setNotif(true);
        }
      )

      .subscribe();
  }, [getbeneName]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView();
  }, [receivedmessages]);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      if (message.split("\n")[message.split("\n").length - 1].length > 0) {
        handlesendmessage();
      } else {
        console.log(false);
      }
    }
  };

  function openmessage() {
    setShowMessage(!showMessage);
    if (showContact === false) {
      setShowContacts(true);
    } else {
      setShowContacts(false);
    }
  }
  const [readmess, setreadmess] = useState();

  const readmessage = async () => {
    try {
      const { data: stud } = await supabase
        .from("Messaging")
        .update({ readmessage: true })
        .eq("name", getbeneName);
      setreadmess(!readmess);
    } catch (error) {}
  };

  return (
    <>
      <div className="w-[100%] h-screen pt-[10%] md:p-5 p-1 flex justify-center bg-[#90bbdf] bg-opacity-40  ">
        <div className="  h-[87%] w-[100%] md:p-5 p-0 flex gap-3 rounded-md ">
          {/* List of Contacts */}
          {showContact && (
            <div className="md:w-[250px] w-[100%] md:h-[100%] h-[90%]  bg-white rounded-l-md">
              <p className="font-bold text-[25px] h-[51px] text-center pt-1 text-white rounded-tl-md bg-[#145DA0] flex items-center justify-center ">
                <IoMdContacts className="text-[25px] text-white mr-0.5  mt-1" />{" "}
                Contacts
              </p>

              {beneinfo && (
                <div className="h-[93%]   rounded-bl-md overflow-y-auto scroll-smooth">
                  {beneinfo
                    .sort((a, b) => (a.last_Modif > b.last_Modif ? -1 : 1))
                    .sort((a, b) => (a.last_Modif > b.last_Modif ? -1 : 1))
                    .map((beneinfo) => (
                      <MessagingConfigStudent
                        key={beneinfo.id}
                        beneinfo={beneinfo}
                        setGetBeneName={setGetBeneName}
                        message={receivedmessages}
                        notif={notif}
                        setShowMessage={setShowMessage}
                        setShowContacts={setShowContacts}
                        readmess={readmess}
                      />
                    ))}
                </div>
              )}
            </div>
          )}

          {/* End */}

          {showMessage && (
            <div className="w-[100%] md:h-[100%] h-[90%] bg-[#145DA0] rounded-r-md ">
              {getbeneName && (
                <div className="w-[100%] justify-center flex-col ">
                  <div className=" p-2 flex">
                    {isMobile && (
                      <div
                        onClick={() => openmessage()}
                        className=" pt-1 group"
                      >
                        <MdArrowBackIos className="text-[25px] text-white group-hover:text-slate-400 " />
                      </div>
                    )}
                    <img
                      className="md:h-10 md:w-10 h-8 w-8 rounded-full"
                      src={profile}
                    />
                    <p className="p-1 mt-1 pl-[1%] text-[15px] w-[100%] font-semibold text-white">
                      {getbeneName}
                    </p>
                  </div>

                  {/* Message will be displayed here */}
                  <div className="h-screen">
                    <div className="md:h-[54%] h-[53.5%] ">
                      {receivedmessages ? (
                        <div className="h-[100%] w-[100%] bg-slate-300 p-3 overflow-y-auto">
                          {receivedmessages
                            .sort((a, b) =>
                              a.created_at < b.created_at ? -1 : 1
                            )
                            .map((message) => (
                              <div key={message.id}>
                                {message.name === getbeneName &&
                                  message.contactwith === studName && (
                                    // left side
                                    <div className="w-[100%] mb-2 flex place-content-start ">
                                      <div className="p-2 rounded-md max-w-[80%] h-auto bg-white flex">
                                        <img
                                          className="md:h-10 md:w-10 h-8 w-8 rounded-full"
                                          src={profile}
                                        />
                                        <div className=" text-left break-words">
                                          <p className="ml-0.5">
                                            {message.message}
                                          </p>
                                          <div className="text-left text-[10px] pt-1">
                                            <DateConverter
                                              date={message.created_at}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                {message.name === studName &&
                                  message.contactwith === getbeneName && (
                                    // right side
                                    <div className="w-[100%] mb-2 flex place-content-end">
                                      <div className="p-2 rounded-md max-w-[80%] h-auto bg-slate-200">
                                        <div className="text-right break-words">
                                          <p className=""> {message.message}</p>
                                        </div>
                                        <div className="text-right text-[10px] pt-2">
                                          <DateConverter
                                            date={message.created_at}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  )}
                              </div>
                            ))}
                          {seen && (
                            <div className="text-right text-[10px]">
                              Seen by {getbeneName}
                            </div>
                          )}
                          <div ref={messageEndRef} />
                        </div>
                      ) : (
                        <div>No Messages Found</div>
                      )}
                      <div className="flex w-[100%] h-[45%]">
                        <textarea
                          onKeyDown={handleKeyDown}
                          value={message}
                          onChange={handlemessage}
                          onClick={() => readmessage()}
                          rows="5"
                          className="mt-2 ml-3 p-1 w-[95%]  h-[50%] text-sm text-gray-900  rounded-md resize-none"
                          placeholder="Write Remaks Here.."
                        />
                        <button
                          onClick={() => handlesendmessage()}
                          disabled={havemessage}
                          className={`${
                            havemessage
                              ? " bg-[#60A3D9] group md:h-[30%] md:w-[5.5%] h-[22%] w-[52px] rounded-full text-center justify-center items-center mr-[2%] ml-[2%] md:mt-[3%] mt-[10%] flex pr-0.5 pt-0.5 "
                              : "bg-[#60A3D9] group md:h-[30%] md:w-[5.5%] h-[22%] w-[52px] rounded-full text-center justify-center items-center mr-[2%] ml-[2%] md:mt-[3%] mt-[10%] flex pr-0.5 pt-0.5 hover:ring-2 hover:ring-white"
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
                      </div>
                    </div>
                  </div>
                  {/* End */}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MessageStudent;
