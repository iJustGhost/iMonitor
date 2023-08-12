import React, { useEffect, useState } from "react";
import supabase from "../iMonitorDBconfig";
import { FaBell } from "react-icons/fa";
import { AiFillMessage } from "react-icons/ai";
function MessagingConfig({
  studinfo,
  setGetStudName,
  message,
  setShowMessage,
  setShowContacts,
  readmess,

}) {
  const [lastmess, setLastMess] = useState([]);
  const [notif, setNotif] = useState(false);
  const [counter, setCounter] = useState(0);

  //checker if there are unread messages each name
  useEffect(() => {
    notification();
  }, [message, readmess]);

  async function notification() {
    const { data: stud } = await supabase
      .from("Messaging")
      .select("*")
      .eq("name", studinfo.studname);

    for (let index = 0; index < stud.length; index++) {
      if (
        stud[index].name === studinfo.studname &&
        stud[index].readmessage === false
      ) {
        setNotif(true);

        await setLastMess(stud[index]);
        return;
      }
      setNotif(false);
    }
  }

  function handleclickcontact() {
    setGetStudName(studinfo.studname);
    if (window.innerWidth <= 768) {
      setShowMessage(true);
      setShowContacts(false);
    }

    readmessage();
  }

  const readmessage = async () => {
    try {
      const { data: stud } = await supabase
        .from("Messaging")
        .update({ readmessage: true })
        .eq("name", studinfo.studname);

        const { data: havemess } = await supabase
        .from("BeneAccount")
        .update({ haveMessage: true })
        .eq("studname",studinfo.studname);
      notification();
      setCounter(0);
    } catch (error) {}
  };

  return (
    <div>
      <div
        onClick={() => handleclickcontact()}
        className="hover:bg-slate-300  flex bg-slate-200 p-1 cursor-pointer hover:p-2 duration-500 mb-1"
      >
        <div className="w-[100%]">
          <p className="text-black text-[13px] font-sans font-semibold">
            {studinfo.studname}
          </p>
          <p className="text-black text-[13px] font-sans font-semibold">
            {studinfo.studsection}
          </p>
        </div>
        <div className="flex">
          {notif && (
            <div className=" text-red-600 font-bold flex">
              <AiFillMessage className="text-red-600" />
              <FaBell className="text-[10px] -mt-1"/>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MessagingConfig;
