import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import supabase from "../iMonitorDBconfig";
import DateConverter from "../Monitoring/DateConverter";
import { AiOutlineClose } from "react-icons/ai";
export default function ViewProfileModal({
  visible,
  onClose,
  studinfos,
  studemail,
}) {
  var remarks = "";
  const [files, setFiles] = useState([]);
  const [date, setDate] = useState();

  useEffect(() => {
    // Call the function to fetch files from a specific folder

    fetchFilesInFolder(studemail);
  }, []);

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

  const filetype = "png";
  const files1 = "http://example.com/image.png";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
      <div
        className="bg-[#dddede] h-[75%] mt-10 md:w-[70%]  rounded-xl"
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
        <div className="bg-[#dddede] rounded-xl  m-[1%] ">
          <form className="pl-4 z-50 grid overflow-y-auto md:h-[500px] h-[490px] bg-[#dddede] rounded-xl ">
            <div className="flex-col text-black">
              <div className="flex">
                <span className="font-bold md:text-xl text-lg mb-3">
                  STUDENT INFORMATION
                </span>
              </div>
              <Link
                to={"/" + studinfos.id}
                className=" mb-7 pt-[0.5%] text-center text-blue-500 hover:underline hover:text-red-500 font-semibold"
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
                        <div key={file.id} className="p-2">
                          <div className="w-[100%] h-[100%]">
                            <div className="flex bg-slate-300 p-1 rounded-t-md">
                              Uploaded: <DateConverter date={file.created_at} />{" "}
                            </div>
                            <div className="p-1 bg-slate-200 rounded-b-md w-[100%] ">
                              <center>
                     
                                <img
                                  src={`https://ouraqybsyczzrrlbvenz.supabase.co/storage/v1/object/public/StudentUploadedImages/${studemail}/${file.name}`}
                                  className=" w-[50%] h-[300px]"
                                />
                              </center>
                            </div>
                          </div>
                        </div>
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
