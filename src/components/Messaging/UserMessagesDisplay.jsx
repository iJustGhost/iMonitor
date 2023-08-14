import React from "react";
import DateConverter from "./DateConverter";
import profile from "../Messaging/profile.png";
function UserMessagesDisplay({ message,beneName, getstudname }) {
  return (
    <div>
      {message.name === getstudname && message.contactwith === beneName && (
        <div className="w-[100%] mb-2 flex place-content-start ">
          <div className="p-2 rounded-md max-w-[80%] h-auto bg-white flex">
            <img
              className="md:h-10 md:w-10 h-8 w-8 rounded-full"
              src={profile}
            />
            <div className=" text-left break-words">
              <p className="ml-0.5">{message.message}</p>
              <div className="text-left text-[10px] pt-1">
                <DateConverter date={message.created_at} />
              </div>
            </div>
          </div>
        </div>
      )}

      {message.name === beneName && message.contactwith === getstudname && (
        <>
          <div className="w-[100%] mb-2 flex place-content-end">
            <div className="p-2 rounded-md max-w-[80%] h-auto bg-slate-200">
              <div className="text-right break-words">
                <p className=""> {message.message}</p>
              </div>
              <div className="text-right text-[10px] pt-2">
                <DateConverter date={message.created_at} />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default UserMessagesDisplay;
