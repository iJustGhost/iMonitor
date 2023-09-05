import React, { useState, useRef, useEffect } from "react";

export default function ViewProfileModal({
  visible,
  onClose,
  companyinfos,
  number,
}) {
  let menuRef = useRef();

  if (!visible) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
      <div
        ref={menuRef}
        className="bg-[#dddede] h-[75%] mt-10 md:w-[70%]  rounded-xl"
        data-aos="zoom-in"
        data-aos-duration="500"
      >
        <div className="flex  justify-end">
          <button
            onClick={onClose}
            className="  w-[10%] h-[30px] rounded-tr-md   font-bold hover:bg-red-400 bg-red-600"
          >
            X
          </button>
        </div>
        <div className="bg-[#dddede] rounded-xl m-[1%]">
          <label className=" pl-4 mt-2 md:text-lg text-base font-semibold text-blue-500">
            NUMBER OF STUDENT CURRENTLY IN OJT: {number}
          </label>
          <form className="pl-4  gap-x-10  grid md:grid-cols-2 grid-cols-1 overflow-y-auto h-[450px] pt-10 bg-[#dddede] rounded-xl ">
            <label className=" mt-2 md:text-lg text-base font-semibold">
              COMPANY NAME: {companyinfos.companyname}
            </label>
            <label className=" mt-2 md:text-lg text-base font-semibold">
              COMPANY ADDRESS: {companyinfos.companyaddress}
            </label>
            <label className=" mt-2 md:text-lg text-base font-semibold">
              SUPERVISOR NAME: {companyinfos.supervisorname}
            </label>
            <label className=" mt-2 md:text-lg text-base font-semibold">
              SUPERVISOR CONTACT #: {companyinfos.supervisorcontactnumber}
            </label>
            <label className=" mt-2 md:text-lg text-base font-semibold">
              SUPERVISOR OFFICER #: {companyinfos.supervisorofficenumber}
            </label>
            <label className=" mt-2 md:text-lg text-base font-semibold">
              COMPANY DESIGNATION: {companyinfos.companydesignation}
            </label>
            <label className=" mt-2 md:text-lg text-base font-semibold  mb-[20px]">
              COMPANY EMAIL: {companyinfos.companyemail}
            </label>
            <iframe
              src={`https://docs.google.com/viewer?url=${encodeURIComponent(
                'URL HERE'
              )}&embedded=true`}
              title="Document Viewer"
              style={{ width: "100%", height: "600px", border: "none" }}
            />
          </form>
        </div>
      </div>
    </div>
  );
}
