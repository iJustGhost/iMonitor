import React, { useEffect, useState } from "react";
import supabase from "../iMonitorDBconfig";

function ActivityLog() {
  const [ActivityLog, setActivityLog] = useState([]);
  const [test, setTest] = useState("This is a test");
  useEffect(() => {
    fetchactivitylog();
    supabase
      .channel("table-db-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "ActivityLog",
        },
        (payload) => {
          fetchactivitylog();
        }
      )
      .subscribe();
  }, []);

  const fetchactivitylog = async () => {
    const { data, error } = await supabase.from("ActivityLog").select();
    setActivityLog(data);
  };

  return (
    <div className="bg-black bg-opacity-20 md:pt-[1%] pt-[7%]  h-screen md:text-base text-[14px] p-5">
      <p className="font-bold text-[30px] font-sans mb-4 mt-4 text-white">ACTIVITY LOG</p>
      <div className=" h-[82%] w-[100%]  overflow-hidden  grid">
        <div className="bg-slate-300 bg-opacity-60 w-[99.9%] rounded-md  overflow-y-hidden h-[100%] p-5">
          <div className="grid grid-cols-3 mb-3  w-fill bg-slate-300 p-2 rounded-md text-[#4D7C9A]">
            <p className="font-bold ">NAME</p>
            <p className="font-bold ">Announcement Clicked</p>
            <p className="font-bold ">Time Clicked</p>
          </div>

          {ActivityLog && (
            <div className="overflow-y-auto overflow-hidden w-[100%] md:h-[87%] h-[75%]">
              {ActivityLog.sort((a, b) => (a.time < b.created_at ? 1 : -1)).map(
                (log) => (
                  <div
                    key={log.id}
                    className="  grid grid-cols-3 mb-3 w-[100%] bg-slate-200 p-2 rounded-md hover:translate-x-4 hover:shadow-xl duration-100 hover:p-4"
                  >
                    <p className="font-semibold font-sans cursor-default">
                      {log.name}
                    </p>
                    <p className="font-semibold font-sans cursor-default">
                      {log.button}
                    </p>
                    <p className="font-semibold font-sans cursor-default">
                      {log.time}
                    </p>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ActivityLog;
