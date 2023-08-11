import React, { useEffect, useState } from "react";
import supabase from "../iMonitorDBconfig";
import { FaBell } from "react-icons/fa";

function MessagingConfig({
  studinfo,
  setGetStudName,
  message,
  setShowMessage,
  setShowContacts,
}) {
  const [lastmess, setLastMess] = useState([]);
  const [notif, setNotif] = useState(false);

  //checker if there are unread messages each name
  useEffect(() => {
    notification();
  }, [message]);

  async function notification() {
    const { data: stud } = await supabase
      .from("Messaging")
      .select()
      .eq("name", studinfo.studname);

    if (stud) {
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
  }

  function handleclickcontact() {
    setGetStudName(studinfo.studname);
    setShowMessage(true);
    setShowContacts(false);
    readmessage();
  }

  const readmessage = async () => {
    try {
      const { data: stud } = await supabase
        .from("Messaging")
        .update({ readmessage: true })
        .eq("name", studinfo.studname);
      notification();
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
        <div>{notif && <FaBell className="text-red-600" />}</div>
      </div>
    </div>
  );
}

export default MessagingConfig;
