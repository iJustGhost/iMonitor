import React, { useEffect, useState } from "react";
import supabase from "../iMonitorDBconfig";
import UploadLog from "./UploadLog";

function UploadStudentConfig({
  announceinfo,
  setGetId,
  setGetTitle,
  setGetMessage,
  setGetDate,
  setGetFiles,
  setGetFileName,
  RunStudentSubmission,
  setGetFileSubmit,
  setCounter,
}) {
  function handlePassDataToUploadLogProps() {
    setGetId(announceinfo.id);
    setGetMessage(announceinfo.announcementMessage);
    setGetTitle(announceinfo.announcementTitle);
    setGetDate(announceinfo.announcementStartDate);
    fetchSpecificFile();
    handleGetDataFromStorageStudentSubmit();
  }
  const fetchSpecificFile = async () => {
    try {
      var state = false;
      var FileName;
      const { data, error } = await supabase.storage
        .from("AnnouncementAttachmentFiles")
        .list(announceinfo.announcementTitle);

      if (error) {
        console.error("Error fetching file list:", error);
      } else {
        for (let index = 0; index < data.length; index++) {
          FileName = data[index].name;
          setGetFileName(FileName);
          state = true;
        }
        if (state) {
          const { data } = supabase.storage
            .from("AnnouncementAttachmentFiles")
            .getPublicUrl(`${announceinfo.announcementTitle}/${FileName}`, {
              download: true,
            });
          setGetFiles(data);
        } else {
          setGetFiles(null);
        }
      }
    } catch (error) {
      console.error("No File");
      return;
    }
  };
  const [folderCount, setFolderCount] = useState(0);
  const [dataCount, setDataCount] = useState(0);
  const handleGetDataFromStorageStudentSubmit = async () => {
    const { data, error } = await supabase.storage
      .from("StudentAnnouncementSubmit")
      .list(announceinfo.announcementTitle + "/");

    if (data) {
    }
    const folderNames = Array.from(
      new Set(data.map((file) => file.name.split("/")[0]))
    );
    setGetFileSubmit(folderNames);

    const folderNames1 = data
      .map((file) => file.name.split("/")[0])
      .filter((name, index, arr) => arr.indexOf(name) === index);

    setFolderCount(folderNames1.length);

    const { count } = await supabase
      .from("StudentInformation")
      .select("*", { count: "exact" });

    setDataCount(count);
    setCounter(`${folderCount} / ${dataCount}`);
  };
  useEffect(() => {
    handleGetDataFromStorageStudentSubmit();
  }, [folderCount, dataCount]);

  return (
    <div  className="hover:cursor-pointer p-2 rounded-md">
      <div
        onClick={() => handlePassDataToUploadLogProps()}
        className="bg-gray-100 p-3 text-start rounded-md hover:bg-gray-400 hover:cursor-pointer
        hover:translate-x-3  w-[230px]  h-[100px] text-[15px] overflow-hidden duration-500 hover:shadow-lg"
      >
        <p className="truncate">{announceinfo.announcementTitle}</p>
        <p>{announceinfo.announcementStartDate}</p>
        <div className="flex text-[14px]">
          Student Submissions:
          <p className="text-blue-600 ml-2">
            {dataCount === 0 ? "-/-" : `${folderCount}/${dataCount}`}
          </p>
        </div>
      </div>
    </div>
  );
}

export default UploadStudentConfig;
