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
  beneName,
  read,
}) {
  const [benemessage, setBeneMessage] = useState([]);
  const [notif, setNotif] = useState(false);

  //Listener for new messages in supabase
  useEffect(() => {
    CheckNotification();
  }, [message]);

  useEffect(() => {
    readmessage();
  }, [read]);

  //Notification Checker
  async function CheckNotification() {
    try {
      const { data: bene } = await supabase
        .from("Messaging")
        .select()
        .eq("name", studinfo.studname);

      if (bene) {
        for (let index = 0; index < bene.length; index++) {
          if (
            bene[index].name === studinfo.studname &&
            bene[index].readmessage === false &&
            bene[index].contactwith === beneName
          ) {
            setNotif(true);
            await setBeneMessage(bene[index]);
            return;
          }
          setNotif(false);
        }
      }
    } catch (error) {}
  }

  function handleclickcontact() {
    setGetStudName(studinfo.studname);
    setShowMessage(true);
    readmessage();
  }

  // Mark the message as read
  const readmessage = async (name) => {
    try {
      const { data: stud } = await supabase
        .from("Messaging")
        .update({ readmessage: true })
        .match({ name: studinfo.studname, contactwith: beneName })
        .select();

      CheckNotification();
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
              <FaBell className="text-[10px] -mt-1" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MessagingConfig;
