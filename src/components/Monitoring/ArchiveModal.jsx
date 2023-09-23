import React from "react";
import supabase from "../iMonitorDBconfig";
import { Link } from "react-router-dom";
import { RiInformationFill } from "react-icons/ri";

export default function ArchiveModal({
  visible,
  onClose,
  studinfos,
  onRefresh,
}) {
  if (!visible) return null;

  function refresh() {
    onClose();
  }

  // Archive
  const handlearchive = async () => {
    const handlearchive = async () => {
      //set status of the student
      if (studinfos.studprogress !== studinfos.studmaxprogress) {
        studinfos.status = "incomplete";
      }
      if (studinfos.studprogress === studinfos.studmaxprogress) {
        studinfos.status = "complete";
      }
      const { data, error } = await supabase.from("MasterListTable1").insert([
        {
          studname: studinfos.studname,
          studemail: studinfos.studemail,
          ojtstart: studinfos.ojtstart,
          ojtend: studinfos.ojtend,
          studprogram: studinfos.studprogram,
          status: studinfos.status,
          studsection: studinfos.studsection,
          studremarks: studinfos.studremarks,
          companyname: studinfos.companyname,
          companyaddress: studinfos.companyaddress,
          supervisorname: studinfos.supervisorname,
          supervisorcontactnumber: studinfos.supervisorcontactnumber,
          supervisorofficenumber: studinfos.supervisorofficenumber,
          companydesignation: studinfos.companydesignation,
          companyemail: studinfos.companyemail,
          studmaxprogress: studinfos.studmaxprogress,
          studprogress: studinfos.studprogress,
        },
      ]);

      if (error) {
        console.log(error);
      }
      if (data) {
        onRefresh(studinfos.id);
        console.log(data);
        handledelete();
      }
      refresh();
    };
    handlearchive();
    handledelete();
    onClose();
  };

  const handledelete = async () => {
    const handledelete = async () => {
      const { data, error } = await supabase
        .from("StudentInformation")
        .delete()
        .eq("id", studinfos.id);

      if (error) {
        console.log(error);
      }
      if (data) {
        console.log(data);
      }
    };
    handledelete();
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center p-4">
      <div
        className="bg-white  w-[400px] rounded-md grid p-4 gap-5  shadow-black shadow-2xl "
        data-aos="zoom-in"
        data-aos-duration="500"
      >
        <div className="text-black text-center md:text-base text-[12px] font-semibold">
          Confirming this will transfer the student information to the Master
          List and will be mark as Complete or Incomplete.
        </div>
        <label className="md:text-base text-[12px] opacity-80 flex gap-0.5 place-content-center items-center text-blue-500">
          <RiInformationFill className="text-blue-500 text-[25px] rounded-full bg-gray-200" />Note: Confirming
          this cannot be undo.
        </label>
        <div className="flex justify-center ">
          <button
            onClick={onClose}
            className="bg-[#0074B7] hover:bg-[#0074B7] hover:bg-opacity-80 h-10 w-20 mr-[2%] rounded-md"
          >
            Cancel
          </button>
          <Link to="/" onClick={handlearchive}>
            <button className="bg-[#0074B7] hover:bg-[#0074B7] hover:bg-opacity-80 h-10 w-20 ml-[2%] rounded-md">
              Confirm
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
