import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import supabase from "../iMonitorDBconfig";

export default function ViewProfileMasterModal({
  visible,
  onClose,
  studinfos,
  
}) {
  if (!visible) return null;

  var remarks;

  if(studinfos.studremarks === null)
  {
    remarks = "None"
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-[#dddede] h-[75%] mt-10 md:w-[70%]  rounded-xl" data-aos="zoom-in" data-aos-duration="500">
        <div className="flex justify-end ">
          <button
            onClick={onClose}
            className="bg-red-600 w-[10%] h-[30px] rounded-br-none rounded-tr-md    font-bold hover:bg-red-400"
          >
            X
          </button>
        </div>
        <div className="text-black rounded-xl m-[1%]">
          <form className=" pl-4 z-50 h-[500px] bg-[#dddede] rounded-xl overflow-y-scroll ">
            <div className="flex-col text-black ">
              <span className="font-bold md:text-xl text-lg mb-3">
                STUDENT INFORMATION
              </span>

              <div className="grid md:grid-cols-2 grid-cols-1 gap-x-10">
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
              <div className="mt-3 flex">
                <label className="md:text-lg text-base font-semibold">
                  REMARKS: <p className="text-base">{remarks}</p>
                </label>
               
              </div>
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
                <label className=" mt-4 md:text-lg text-base font-semibold  mb-[20px]">
                  COMPANY EMAIL: {studinfos.companyemail}
                </label>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
