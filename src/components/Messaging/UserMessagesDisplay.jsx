import React, { useEffect, useState } from "react";
import DateConverter from "./DateConverter";
import profile from "../Messaging/profile.png";
import { BsCheckAll } from "react-icons/bs";
function UserMessagesDisplay({ message, beneName, getstudname }) {
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    seenChecker();
  }, [message]);

  function seenChecker() {
    if (
      message.name === beneName &&
      message.contactwith === getstudname &&
      message.readmessage === true
    ) {
      setSeen(true);
    }
  }

  return (
    <div>
      {message.name === getstudname && message.contactwith === beneName && (
        <div className=" mb-2 flex place-content-start ">
          <div className="flex flex-col">
            <div className=" h-auto  flex">
              <div className="bg-white h-[40px] w-[40px] rounded-full flex justify-center items-center">
                <img
                  src={profile}
                  className="  h-[38.5px] justify-center rounded-full"
                />
              </div>

              <div className="flex flex-col justify-center max-w-[300px] h-auto bg-white p-2 rounded-md  ml-1">
                <div className="text-left break-words ">
                  <p className="text-left "> {message.message}</p>
                </div>
              </div>
            </div>

            <div className="text-right text-[9px] flex pt-1 ml-10">
              <DateConverter date={message.created_at} />
              {seen && (
                <BsCheckAll className="text-[15px] ml-1 text-green-600" />
              )}
            </div>
          </div>
        </div>
      )}

      {message.name === beneName && message.contactwith === getstudname && (
        <>
          <div className=" mb-2 flex place-content-end">
            <div className="">
              <div className="text-right break-words  bg-slate-200  rounded-md  max-w-[300px] p-2 h-auto">
                <p className="text-right "> {message.message}</p>
              </div>
              <div className="place-content-end  text-[9px] flex pt-2">
                <DateConverter date={message.created_at} />
                {seen && (
                  <BsCheckAll className="text-[15px] ml-1 text-green-600" />
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default UserMessagesDisplay;
