import React, { useEffect, useState } from "react";
import supabase from "../iMonitorDBconfig";
import moment from "moment";
import AOS, { refresh } from "aos";
import "aos/dist/aos.css";
import { GiDiploma } from "react-icons/gi";
import AttendanceConfig from "./AttendanceConfig";

const Attendance = ({ studemail }) => {
  // CONDITIONAL VARIABLES
  var starter = false;
  var a = false;
  const [ojtfinished, setojtfinished] = useState(false);
  const [ojtnotstarted, setojtnotstarted] = useState(false);
  // DATA VARIABLES
  const [studinfo, setStudinfo] = useState();
  const [attendanceinfo, setAttendanceinfo] = useState();
  const [studprog, setStudProg] = useState("");
  const [studmaxprog, setStudMaxProg] = useState("");
  // var currDateFull = moment().format("l");
  var currDateFull = moment().format("l");
  var currTimeFull = moment().format("LTS");
  // Data Insert Sucecess
  const [dataInsert, setDataInsert] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1000 });
    DataRefresh();
    fetchstudinfo();
  }, []);

  // STUDENT INFORMATION TABLE
  const fetchstudinfo = async () => {
    let { data, error } = await supabase
      .from("StudentInformation")
      .select()
      .eq("studemail", studemail)
      .single();

    if (data) {
      setStudProg(data.studprogress);
      setStudMaxProg(data.studmaxprogress);

      var currentD = new Date(currDateFull);
      var end = new Date(data.ojtend);
      var start = new Date(data.ojtstart);

      if (start < currentD) {
        if (end <= currentD) {
          //OJT IS FINISHED
          setojtfinished(true);
          a = false;
          console.log("OJT IS FINISHED");
        } else {
          //OJT STARTED
          console.log("OJT STARTED");
          FetchAttendanceInfo();
          starter = true;
        }
      } else {
        // OJT HAVENT STARTED YET
        console.log("OJT HAVENT STARTED YET");
        setojtnotstarted(true);
      }
    }
  };

  const DataInsertInAttendance = async () => {
    let { data1, error } = await supabase
      .from("AttendanceTable")
      .insert({ studemail: studemail, studDate: currDateFull });

    setDataInsert(true);
  };

  function DataRefresh() {
    const FetchAttendanceRefresh = async () => {
      let { data, error } = await supabase
        .from("AttendanceTable")
        .select()
        .eq("studemail", studemail);

      setAttendanceinfo(data);
    };
    FetchAttendanceRefresh();
  }

  // DATA in attendance Table
  const FetchAttendanceInfo = async () => {
    let { data, error } = await supabase
      .from("AttendanceTable")
      .select()
      .eq("studemail", studemail);

    for (let index = 0; index < data.length; index++) {
      if (currDateFull === data[index].studDate) {
        a = true;
      }
    }

    if (a === true) {
      setAttendanceinfo(data);
    } else {
      DataInsertInAttendance();
      setAttendanceinfo(data);
    }
  };

  return (
    <>
      <div className="">
        <div
          className="md:pt-[5%] pt-[10%]"
          data-aos="fade-down"
          data-aos-duration="1000"
        >
          <p className="font-bold text-white text-4xl flex md:ml-[30%] ml-[5%] mt-5 mb-5">
            ATTENDANCE
          </p>
          <div className=" md:ml-[30%] ml-5 mr-5">
            {/* <p className="p-5 bg-gray-300 md:w-[500px] rounded-t-md mt-3 text-center font-semibold text-[25px]">Christine Fe G Erjas</p> */}
            <div className="md:w-[500px] w-full h-[450px] rounded-t-md bg-gray-300 rounded-b-md">
              <div className="w-full bg-[#2E8BC0] rounded-t-md p-2 flex-col md:gap-10 gap-1">
                <div className="mt-3 mb-3 flex">
                  <p className="md:text-[15px] text-[12px] text-center font-semibold mt-1.5 mr-2">
                    OJT DURATION:
                  </p>

                  <div className=" w-[70%] bg-gray-400 rounded-md  md:h-10 h-7 rounded-r ">
                    <div
                      className=" md:h-10 h-7 w-[1%] bg-[#78D0F4] rounded-l rounded-r "
                      style={{
                        width: `${(studprog / studmaxprog) * 100}%`,
                      }}
                    >
                      <div
                        className={`${
                          studprog > 0
                            ? "md:pl-[135px] pl-[80px]"
                            : "pl-[130px]"
                        } whitespace-nowrap z-0 md:text-[20px] text-[15px] font-mono md:pt-1 pt-0.5  font-semibold mr-3 `}
                      >
                        {studprog} / {studmaxprog}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/*  Attendance */}
              {ojtfinished && (
                <div className="">
                  <p className="font-bold text-[25px] text-center mt-[22%]">
                    YOUR OJT IS FINISHED
                  </p>
                  <GiDiploma className="text-8xl ml-[40%] text-center" />
                </div>
              )}
              {ojtnotstarted && (
                <div className="justify-center flex flex-col">
                  <p className="font-bold text-[25px] justify-center text-center mt-[20%]">
                    YOUR OJT HAVEN'T STARTED YET
                  </p>
                  <p
                    data-tip="Your Attendance will be shown when the OJT starts"
                    className="hover:text-blue-600 hover:cursor-help text-blue-900 font-semibold underline justify-center text-center

                    before:text-sm
                    before:content-[attr(data-tip)]
                    before:absolute
                    before:px-3 before: py-2
                    before:left/1 before: top-3
                    before:w-max before:max-w-xs
                    before:-translate-x-1/3 before:-translate-y-full
                  before:bg-gray-200 before:text-black
                  before:border-black
                    before:border-2
                    before:rounded-md before:opacity-0
                    before:transition-all
                    hover:before:opacity-100"
                  >
                    Learn More
                  </p>
                </div>
              )}
              {attendanceinfo && (
                <div className=" ml-1 mr-1 pt-3 h-[355px] rounded-md overflow-y-auto">
                  {attendanceinfo
                    .sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
                    .map((attendanceinfo) => (
                      <AttendanceConfig
                        key={attendanceinfo.id}
                        attendanceinfo={attendanceinfo}
                      />
                    ))}
                </div>
              )}

              {/* Attendance */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Attendance;
