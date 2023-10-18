import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import supabase from "../iMonitorDBconfig";

import { AiOutlineClose } from "react-icons/ai";
import StudentUploadedImage from "./StudentUploadedImage";

export default function ViewProfileModal({
  visible,
  onClose,
  studinfos,
  studemail,
  beneData,
}) {
  var remarks = "";
  const [files, setFiles] = useState([]);
  const [date, setDate] = useState();

  const [viewPicture, setViewPicture] = useState(false);

  useEffect(() => {
    // Call the function to fetch files from a specific folder
    fetchFilesInFolder(studemail);
    supabase
      .channel("Get_Data_In_StudentAttendance")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "StudentUploadedImages",
        },
        (payload) => {
          fetchFilesInFolder(studemail);
        }
      )
      .subscribe();
  }, [studinfos]);

  const fetchFilesInFolder = async (folderName) => {
    try {
      // Fetch files from the specific folder
      const { data, error } = await supabase.storage
        .from("StudentUploadedImages")
        .list(folderName + "/", { sortBy: { column: "name", order: "asc" } });

      if (error) {
        console.error("Error fetching files:", error);
      } else {
        // Update the state with the list of files in the folder
        setFiles(data);
      }
    } catch (error) {
      console.error("Error fetching files:", error.message);
    }
  };

  if (!visible) return null;

  if (studinfos.studremarks === null) {
    remarks = "NONE";
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
      <div
        className="bg-[#dddede] h-[75%] mt-10 md:w-[70%]  rounded-xl shadow-black shadow-2xl "
        data-aos="zoom-in"
        data-aos-duration="500"
      >
        <div className="flex justify-end  ">
          <button
            onClick={onClose}
            className="  w-[10%] h-[30px] justify-center items-center flex rounded-tr-md font-bold text-black text-[20px] hover:bg-red-400 bg-red-600 group:"
          >
            <AiOutlineClose className="" />
          </button>
        </div>
        <div className="bg-[#dddede] rounded-xl  m-[1%] h-[90%]">
          <form className="p-2 z-50 grid overflow-y-auto h-[100%]  bg-[#dddede] rounded-xl ">
            <div className="flex-col text-black">
              <div className="flex">
                <span className="font-bold md:text-xl text-lg mb-3">
                  STUDENT INFORMATION
                </span>
              </div>
              <Link
                to={"/" + studinfos.id}
                className={`${
                  beneData.filterby !== "ALL"
                    ? "hidden"
                    : " mb-7 pt-[0.5%] text-center text-blue-500 hover:underline hover:text-red-500 font-semibold"
                }`}
              >
                EDIT
              </Link>
              <div className="grid md:grid-cols-2 grid-cols-1 gap-x-10  mb-3">
                <label className=" mt-4 md:text-lg text-base font-semibold">
                  FULLNAME: {studinfos.studname}
                </label>
                <label className=" mt-4 md:text-lg text-base font-semibold">
                  PROGRAM: {studinfos.studprogram}
                </label>
                <label className=" mt-4 md:text-lg text-base font-semibold">
                  EMAIL: {studinfos.studemail}
                </label>
                <label className=" mt-4 md:text-lg text-base font-semibold">
                  SECTION: {studinfos.studsection}
                </label>
                <label className=" mt-4 md:text-lg text-base font-semibold">
                  OJT START: {studinfos.ojtstart}
                </label>
                <label className=" mt-4 md:text-lg text-base font-semibold">
                  OJT END: {studinfos.ojtend}
                </label>
              </div>
              <label className=" pt-6 md:text-lg text-base font-semibold">
                REMARKS: <p className="text-base">{remarks}</p>
              </label>
              <p className="font-bold md:text-xl text-lg mt-7">
                COMPANY INFROMATION
              </p>
              <div className="grid md:grid-cols-2 grid-cols-1 gap-x-5">
                <label className=" mt-4 md:text-lg text-base font-semibold">
                  COMPANY NAME: {studinfos.companyname}
                </label>
                <label className=" mt-4 md:text-lg text-base font-semibold">
                  COMPANY ADDRESS: {studinfos.companyaddress}
                </label>
                <label className=" mt-4 md:text-lg text-base font-semibold">
                  SUPERVISOR NAME: {studinfos.supervisorname}
                </label>
                <label className=" mt-4 md:text-lg text-base font-semibold">
                  SUPERVISOR CONTACT #: {studinfos.supervisorcontactnumber}
                </label>
                <label className=" mt-4 md:text-lg text-base font-semibold">
                  SUPERVISOR OFFICER #: {studinfos.supervisorofficenumber}
                </label>
                <label className=" mt-4 md:text-lg text-base font-semibold">
                  COMPANY DESIGNATION: {studinfos.companydesignation}
                </label>
                <label className=" mt-4 md:text-lg text-base font-semibold">
                  COMPANY EMAIL: {studinfos.companyemail}
                </label>
              </div>

              <div className="mt-10">
                <p className="font-bold md:text-lg text-base">
                  Uploaded image in attendance
                </p>
                <div className="h-[300px]  bg-slate-400  mr-[1%] rounded-md overflow-y-auto">
                  <div className="p-2 grid grid-cols-2">
                    {files
                      .sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
                      .map((file) => (
                        <StudentUploadedImage
                          key={file.id}
                          file={file}
                          studemail={studemail}
                        />
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
