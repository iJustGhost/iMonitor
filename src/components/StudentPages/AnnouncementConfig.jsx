import React, { useState, useEffect } from "react";
import moment from "moment";
import supabase from "../iMonitorDBconfig";

const AnnouncementConfig = ({
  announcementinfo,
  setGetId,
  setGetMessage,
  setGetTitle,
  setGetDate,
  setGetEndDate,
  setGetAllow,
  setGetFiles,
  setGetFileName,
  studemail,
}) => {
  const [Files, setFiles] = useState([]);
  const [state, setState] = useState(false);
  var date = moment(new Date()).format("ll");
  var announceDate = moment(
    new Date(announcementinfo.announcementEndDate)
  ).format("ll");

  function DateByDay(a) {
    const today = new Date(a);
    const date = today.getDate();
    return `${date}`;
  }

  function handleclick() {
    try {
      setGetId(announcementinfo.id);
      setGetMessage(announcementinfo.announcementMessage);
      setGetTitle(announcementinfo.announcementTitle);
      setGetDate(announcementinfo.announcementStartDate);
      setGetEndDate(announcementinfo.announcementEndDate);
      setGetAllow(announcementinfo.announcementAllow);
      fetchSpecificFile();
      logclick();
    } catch (error) {}
  }
  const fetchSpecificFile = async () => {
    try {
      var state = false;
      var FileName;
      const { data, error } = await supabase.storage
        .from("AnnouncementAttachmentFiles")
        .list(announcementinfo.announcementTitle);

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
            .getPublicUrl(`${announcementinfo.announcementTitle}/${FileName}`, {
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

  const logclick = async () => {
    try {
      var date = moment().format("LLL");

      const { data: studdata } = await supabase
        .from("StudentInformation")
        .select()
        .eq("studemail", studemail)
        .single();

      var name = studdata.studname;
      var button = announcementinfo.announcementTitle;
      const { data: actlog } = await supabase
        .from("ActivityLog")
        .insert([{ name: name, button: button, time: date }]);
    } catch (error) {}
  };

  return (
    <>
      <div
        className={`${
          DateByDay(date) >= DateByDay(announceDate) ? "hidden" : ""
        }`}
      >
        <div
          onClick={() => handleclick()}
          className={`${state ? "bg-black" : "bg-gray-200"}
       h-20 bg-gray-200 p-1 hover:bg-gray-300 rounded-md hover:shadow-md hover:shadow-black hover:translate-x-1 duration-300`}
        >
          <p className="font-bold md:text-[20px] text-[10px] line-clamp-1">
            {announcementinfo.announcementTitle}
          </p>
          <p className="md:text-[15px] text-[10px]">
            {announcementinfo.announcementStartDate}
          </p>
        </div>
      </div>
    </>
  );
};

export default AnnouncementConfig;
