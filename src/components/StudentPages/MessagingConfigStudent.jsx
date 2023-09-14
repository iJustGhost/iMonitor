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
  studName,
  read,
}) {
  const [lastmess, setLastMess] = useState([]);
  const [notif, setNotif] = useState(false);

  //checker if there are unread messages each name
  useEffect(() => {
    CheckNotification();
  }, [message]);

  useEffect(() => {
    readmessage();
  }, [read]);

  async function CheckNotification() {
    try {
      const { data: bene } = await supabase
        .from("Messaging")
        .select()
        .match({ name: beneinfo.beneName, contactwith: studName });

      if (bene) {
        for (let index = 0; index < bene.length; index++) {
          if (
            bene[index].name === beneinfo.beneName &&
            bene[index].readmessage === false &&
            bene[index].contactwith === studName
          ) {
            setNotif(true);
            await setLastMess(bene[index]);
            return;
          }
          setNotif(false);
        }
      }
    } catch (error) {}
  }

  function handleclickcontact() {
    setGetBeneName(beneinfo.beneName);
    setShowMessage(true);
    readmessage();
  }

  const readmessage = async () => {
    try {
      const { data: bene } = await supabase
        .from("Messaging")
        .update({ readmessage: true })
        .match({ name: beneinfo.beneName, contactwith: studName })
        .select();

      CheckNotification();
    } catch (error) {}
  };

  return (
    <div>
      <div
        onClick={() => handleclickcontact()}
        className="hover:bg-slate-300 flex  bg-slate-200 p-1 cursor-pointer hover:p-2 duration-500 mb-1"
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
            <FaBell className="text-[10px] -mt-1" />
          </div>
        )}
      </div>
    </div>
  );
}

export default MessagingConfig;
