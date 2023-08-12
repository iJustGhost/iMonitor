import React, { useState, useEffect } from "react";
import supabase from "../iMonitorDBconfig";
import { FaBell } from "react-icons/fa";
import { AiFillMessage } from "react-icons/ai";
function MessagingConfig({
  beneinfo,
  setGetBeneName,
  message,
  setShowMessage,
  setShowContacts,
  readmess
}) {
  const [lastmess, setLastMess] = useState([]);
  const [notif, setNotif] = useState(false);

  //checker if there are unread messages each name
  useEffect(() => {
    readmessage1();
  }, [message, readmess]);

  async function readmessage1() {
    const { data: bene } = await supabase
      .from("Messaging")
      .select()
      .eq("name", beneinfo.beneName);

    if (bene) {
      for (let index = 0; index < bene.length; index++) {
        if (
          bene[index].name === beneinfo.beneName &&
          bene[index].readmessage === false
        ) {
          setNotif(true);
          await setLastMess(bene[index]);
          return;
        }
        setNotif(false);
      }
    }
  }

  function handleclickcontact() {
    setGetBeneName(beneinfo.beneName);
    if (window.innerWidth <= 768) {
      setShowMessage(true);
      setShowContacts(false);
    }
    readmessage();
  }

  const readmessage = async () => {
    const { data: bene } = await supabase
      .from("Messaging")
      .update({ readmessage: true })
      .eq("name", beneinfo.beneName);
    readmessage1();
  };

  return (
    <div>
      <div
        onClick={() => handleclickcontact()}
        className="hover:bg-slate-300 flex  bg-slate-200 p-1 cursor-pointer hover:p-2 duration-500 mt-1"
      >
        <div className="w-[100%]">
          <p className="text-black text-[13px] font-sans font-semibold">
            {beneinfo.beneName}
          </p>
          <p className="text-black text-[13px] font-sans font-semibold">
            Alumni Officer
          </p>
        </div>
        {notif && (
            <div className=" text-red-600 font-bold flex">
              <AiFillMessage className="text-red-600" />
              <FaBell className="text-[10px] -mt-1"/>
            </div>
          )}
      </div>
    </div>
  );
}

export default MessagingConfig;
