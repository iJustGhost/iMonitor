import React, { useEffect, useState } from "react";
import DateConverter from "./DateConverter";
import profile from "../Messaging/profile.png";
import { BsCheckAll, BsFillFileEarmarkTextFill } from "react-icons/bs";

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
  const [imagebroken, setImageBroken] = useState();
  const [userImage, setUserImage] = useState();
  const [currentUserImage, setCurrentUserImage] = useState();
  useEffect(() => {
    seenChecker();
    userChecker();
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

  function userChecker() {
    if (beneinfo.ROLE === "BENE") {
      setUserImage(
        `https://ouraqybsyczzrrlbvenz.supabase.co/storage/v1/object/public/MessageFileUpload/${studID}_${beneinfo.id}/${beneinfo.id}/${message.message}`
      );
      setCurrentUserImage(
        `https://ouraqybsyczzrrlbvenz.supabase.co/storage/v1/object/public/MessageFileUpload/${studID}_${beneinfo.id}/${studID}/${message.message}`
      );
    } else {
      setUserImage(
        `https://ouraqybsyczzrrlbvenz.supabase.co/storage/v1/object/public/MessageFileUpload/${beneinfo.id}_${studID}/${beneinfo.id}/${message.message}`
      );
      setCurrentUserImage(
        `https://ouraqybsyczzrrlbvenz.supabase.co/storage/v1/object/public/MessageFileUpload/${beneinfo.id}_${studID}/${studID}/${message.message}`
      );
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

  const a =
    "https://ouraqybsyczzrrlbvenz.supabase.co/storage/v1/object/public/MessageFileUpload/" +
    beneinfo.id +
    "_" +
    studID +
    "/" +
    studID +
    "/" +
    message.message;

  function brokenimage() {
    setImageBroken(message.message);
  }

  const messageSorter = () => {
    const fileExtenstion = message.message.split(".").pop().toLowerCase();
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp"];
    const documentExtenstions = ["docx", "pdf", "ods", "pptx", "xlsx"];

    if (imageExtensions.includes(fileExtenstion)) {
      return (
        // Image returned if src is true else returns as message
        <div className="flex flex-col justify-center max-w-[300px] max-h-[300px] bg-white p-2 ml-2 rounded-md">
          <div className="text-right break-words ">
            <div
              onClick={() => handleUser("Current")}
              className="text-right grid "
            >
              {message.name === getstudname &&
              message.contactwith === beneName ? (
                <div className="flex gap-2">
                  {imagebroken ? (
                    <div className="cursor-default"> {imagebroken}</div>
                  ) : (
                    <>
                      <img
                        className="max-w-[270px] max-h-[250px] min-h-[150px] min-w-[180px]"
                        onError={brokenimage}
                        src={currentUserImage}
                      ></img>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex gap-2">
                  {imagebroken ? (
                    <div className="cursor-default">{imagebroken}</div>
                  ) : (
                    <>
                      <img
                        className="max-w-[270px] max-h-[250px] min-h-[150px] min-w-[180px]"
                        onError={brokenimage}
                        src={userImage}
                      ></img>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    } else if (documentExtenstions.includes(fileExtenstion)) {
      return (
        // File is returned
        <div className="flex flex-col justify-center max-w-[300px] h-auto bg-blue-900 text-white font-semibold  p-3 ml-2 rounded-md ">
          <div className="text-right break-words  flex items-center gap-2 ">
            <BsFillFileEarmarkTextFill className="text-[15px]" />
            <p
              onClick={() => handleUser("Current")}
              className="text-right cursor-default truncate"
            >
              {message.message}
            </p>
          </div>
        </div>
      );
    } else {
      // if fileExtenstion doesnt includes imageExtensions and documentExtenstions returns text message
      return (
        <div className="flex flex-col justify-center max-w-[300px] h-auto bg-white p-2 ml-2 rounded-md cursor-default">
          <div className="text-right break-words cursor-default ">
            <div
              onClick={() => handleUser("Current")}
              className="text-right cursor-default"
            >
              {message.message}
            </div>
          </div>
        </div>
      );
    }
  };

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

              {messageSorter()}
            </div>

            <div className="text-right text-[9px] flex pt-1 ml-10 cursor-default">
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
              <div className=" mb-2 flex place-content-end">
                <div className="flex flex-col">
                  <div className=" flex place-content-end">
                    {messageSorter()}
                  </div>

                  <div className="place-content-end text-[9px] flex pt-1  cursor-default">
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
