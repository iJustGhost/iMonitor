import React from "react";
import supabase from "../iMonitorDBconfig";
import { Link } from "react-router-dom";

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
        className="bg-white h-[110px] w-[200px] rounded-md"
        data-aos="zoom-in"
        data-aos-duration="500"
      >
        <div className="text-black h-[60%] text-center pt-[10%]">
          Confirm to archive?
        </div>
        <div className="flex justify-center ">
          <button onClick={onClose} className="bg-[#0074B7] h-10 w-20 mr-[2%] rounded-md">
            Cancel
          </button>
          <Link to="/" onClick={handlearchive}>
            <button className="bg-[#0074B7]  h-10 w-20 ml-[2%] rounded-md">Accept</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
