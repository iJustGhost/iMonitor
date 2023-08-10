import React, { useEffect, useState } from "react";
import moment from "moment";
import supabase from "../iMonitorDBconfig";

const AttendanceSelectImageModal = ({
  visible,
  attendanceinfo,
  onClose,
  uuid,
}) => {
  const [file, setFile] = useState([]);
  const [id, setID] = useState(attendanceinfo.id);
  const [performerror, setPerformError] = useState("");

  let IN;

  const [isEmpty, setIsEmpty] = useState(false);

  const handleFileInputChange = (event) => {
    const files = event.target.files;
    const datafile = event.target.files[0];
    if (files.length > 0) {
      setIsEmpty(true);
      setFile(datafile);
      console.log(file);
    } else {
      setIsEmpty(false);
    }
  };

  const Run = async () => {
    if (isEmpty === false) {
      console.log("walang laman");
    } else {
      console.log(" laman");
      const { data, error } = await supabase.storage
        .from("StudentUploadedImages")
        .upload(attendanceinfo.studemail + "/" + uuid, file);

      if (data) {
        console.log("data");
      }
      if (error) {
        console.log(error);
      }
      timein();
    }
  };

  function clear() {
    onClose();
    setFile(null);
  }

  // apply this to onlick IN Button
  function timein() {
    const timeStringIN = moment().format("H:M"); // input string
    const arr = timeStringIN.split(":"); // splitting the string by colon
    const secondsIN = arr[0] * 3600 + arr[1] * 60; // converting //store this in datebase
    IN = secondsIN;

    const attendance = async () => {
      const { data, error } = await supabase
        .from("AttendanceTable")
        .update({ studin: IN })
        .eq("id", attendanceinfo.id);

      if (data) {
        console.log(data);
      }
      if (error) {
        console.log(error);
      }
      onClose();
    };
    attendance();
    window.location.reload();
  }
  if (!visible) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
      <div
        className="bg-[#dddede] h-[30%] mt-10 md:w-[30%] rounded-xl flex flex-col p-2"
        data-aos="zoom-in"
        data-aos-duration="500"
      >
        <button
          onClick={() => clear()}
          className="bg-red-600 w-14 rounded-tl-md"
        >
          X
        </button>
        <div className="justify-center items-center flex flex-col mt-3">
          <p className="font-semibold text-lg mb-4">
            Upload your image here to verify
          </p>
          <input type="file" onChange={handleFileInputChange}></input>
          {isEmpty && <p>File selected.</p>}
          <button
            onClick={() => Run()}
            className="w-[80%] rounded-md hover:bg-blue-300 hover:text-slate-900  mt-5 bg-blue-500 text-white font-semibold"
          >
            UPLOAD
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceSelectImageModal;
