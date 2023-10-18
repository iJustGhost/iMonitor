import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import ViewProfileMasterModal from "./ViewProfileMasterModal";

import AOS from "aos";
import "aos/dist/aos.css";

const MasterListTableConfig = ({ studinfos, sy, course }) => {
  // AOS ANIMATION
  useEffect(() => {
    DateCreated();
    AOS.init();
  }, [sy]);

  const [showmodalprofile, setShowModalProfile] = useState(false);

  const [DateHolderSY, SetDateHolderSY] = useState();
  const [StudCreateDate, SetStudCreateDate] = useState();

  function DateCreated() {
    if (sy === "S.Y. 2023-2024") {
      SetDateHolderSY(new Date("1-1-2023").getFullYear());
      SetStudCreateDate(new Date(studinfos.created_at).getFullYear());
    }
    if (sy === "S.Y. 2024-2025") {
      SetDateHolderSY(new Date("1-1-2025").getFullYear());
      SetStudCreateDate(new Date(studinfos.created_at).getFullYear());
    }
    if (sy === "S.Y. 2025-2026") {
      SetDateHolderSY(new Date("1-1-2026").getFullYear());
      SetStudCreateDate(new Date(studinfos.created_at).getFullYear());
    }
    if (sy === "S.Y. 2026-2027") {
      SetDateHolderSY(new Date("1-1-2027").getFullYear());
      SetStudCreateDate(new Date(studinfos.created_at).getFullYear());
    }
    if (sy === "S.Y. 2027-2028") {
      SetDateHolderSY(new Date("1-1-2028").getFullYear());
      SetStudCreateDate(new Date(studinfos.created_at).getFullYear());
    }
  }

  return (
    <div
      className={`${
        course !== "ALL" && `${studinfos.filterby !== course && "hidden"}`
      }`}
    >
      <div
        data-aos="fade-down"
        data-aos-duration="500"
        className="grid grid-cols bg-slate-200 rounded-md mt-[0.5%] hover:p-1 hover:translate-x-2 duration-100 hover:shadow-lg "
      >
        <div className={`${StudCreateDate !== DateHolderSY && "hidden"} `}>
          <div className="md:h-[50px] h-[70px]  text-black flex  pt-2  font-medium rounded">
            <div
              data-tip="ViewProfile"
              className="p-5 -mt-1 md:w-[30%] w-[32%] hover:underline hover:text-blue-600
            before:content-[attr(data-tip)]
            before:absolute
            before:px-3 before: py-2
            before:left/12 before: top-3
            before:w-max before:max-w-xs
            before:-translate-x-1/2 before:-translate-y-full
            before:bg-gray-400 before:text-white
            before:rounded-sm before:opacity-0
            before:transition-all
            hover:before:opacity-100 
            hover:cursor-pointer

            md:text-[16px] text-[10px]
          "
              onClick={() => setShowModalProfile(true)}
            >
              {studinfos.studname}
            </div>
            <div className="w-[46%] ml-[15%] mt-1 md:text-[16px] text-[10px]">
              {studinfos.studsection}
            </div>

            <div className="grid md:grid-cols-2 mt-1.5 w-[25%] md:mr-5 mr-2">
              <p className="md:text-[16px] text-[10px] text-center">
                {studinfos.studprogress}hrs/
                {studinfos.studmaxprogress}hrs
              </p>

              <div className=" w-[100%] bg-gray-400 rounded-md md:h-6 h-5  md:-mt-0 -mt-4 rounded-r text-center">
                <div
                  className={`${
                    studinfos.status === "complete"
                      ? "bg-green-500"
                      : "bg-gray-500"
                  } rounded-l rounded-r md:h-6 h-5 md:text-[16px] text-[10px]  md:pt-[0%] pt-[3%]`}
                  style={{
                    width: `${100}%`,
                  }}
                >
                  {" "}
                  {studinfos.status == "complete" ? "COMPLETE" : "INCOMPLETE"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ViewProfileMasterModal
        onClose={setShowModalProfile}
        visible={showmodalprofile}
        studinfos={studinfos}
        studname={studinfos.studname}
        studemail={studinfos.studemail}
      />
    </div>
  );
};

export default MasterListTableConfig;
