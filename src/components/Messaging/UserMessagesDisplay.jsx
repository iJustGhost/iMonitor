import React, { useEffect, useState } from "react";
import DateConverter from "./DateConverter";
import profile from "../Messaging/profile.png";
import { BsCheckAll } from "react-icons/bs";
function UserMessagesDisplay({
  message,
  beneName,
  getstudname,
  studinfo,
  beneinfo,
  index,
  file,
  studID,
}) {
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

  function handleUser(Name) {
    try {
      for (let index = 0; index < file.length; index++) {
        if (file[index].name === message.message) {
          if (beneinfo.ROLE === "BENE") {
            if (Name === "Current") {
              BeneActiveFileReaderBene();
            } else {
              BeneActiveFileReaderStud();
            }
          } else {
            if (Name === "Current") {
              StudActiveFileReaderBene();
            } else {
              StudActiveFileReaderStud();
            }
          }
        }
      }
    } catch (error) {}
  }

  function BeneActiveFileReaderBene() {
    window.open(
      `https://ouraqybsyczzrrlbvenz.supabase.co/storage/v1/object/public/MessageFileUpload/${studID}_${beneinfo.id}/${beneinfo.id}/${message.message}`
    );
  }

  function BeneActiveFileReaderStud() {
    window.open(
      `https://ouraqybsyczzrrlbvenz.supabase.co/storage/v1/object/public/MessageFileUpload/${studID}_${beneinfo.id}/${studID}/${message.message}`
    );
  }

  function StudActiveFileReaderBene() {
    window.open(
      `https://ouraqybsyczzrrlbvenz.supabase.co/storage/v1/object/public/MessageFileUpload/${beneinfo.id}_${studID}/${beneinfo.id}/${message.message}`
    );
  }

  function StudActiveFileReaderStud() {
    window.open(
      `https://ouraqybsyczzrrlbvenz.supabase.co/storage/v1/object/public/MessageFileUpload/${beneinfo.id}_${studID}/${studID}/${message.message}`
    );
  }

  return (
    <div>
      {message.name === getstudname && message.contactwith === beneName && (
        <div
          onClick={() => handleUser("User")}
          className=" mb-2 flex place-content-start "
        >
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
                  <p className="text-left ">{message.message}</p>
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

      {message && (
        <div>
          {message.name === beneName && message.contactwith === getstudname && (
            <>
              <div
                onClick={() => handleUser("Current")}
                className=" mb-2 flex place-content-end"
              >
                <div className="flex flex-col">
                  <div className=" flex place-content-end">
                    <div className="flex flex-col justify-center max-w-[300px] h-auto bg-white p-2 rounded-md">
                      <div className="text-right break-words ">
                        <p className="text-right ">{message.message}</p>
                      </div>
                    </div>
                  </div>

                  <div className="place-content-end text-[9px] flex pt-1 ">
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
      )}

      {!message && "Something's wrong with the connection"}
    </div>
  );
}

export default UserMessagesDisplay;
