import React, { useState, useEffect } from "react";
import supabase from "../iMonitorDBconfig";
import MasterListTableConfig from "./MasterListTableConfig";

import AOS from "aos";
import "aos/dist/aos.css";

import { Backdrop } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

const MasterList = () => {
  // AOS ANIMATION
  useEffect(() => {
    AOS.init();
  }, []);

  function refresh() {
    const fetchstudinfo = async () => {
      const { data, error } = await supabase.from("MasterListTable1").select();

      if (error) {
        setFetchError("Could not fetch the data please check your internet");
        setStudInfos(null);
        console.log(error);
      }
      if (data) {
        setStudInfos(data);
        setFetchError(null);
      }
    };
    fetchstudinfo();
  }

  const [fetcherrror, setFetchError] = useState(null);
  const [studinfos, setStudInfos] = useState(null);
  const [loading, setLoading] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchstudinfo = async () => {
      const { data, error } = await supabase.from("MasterListTable1").select();

      if (error) {
        setFetchError("Could not fetch the data please check your internet");
        setStudInfos(null);
        console.log(error);
      }

      if (data) {
        setStudInfos(data);
        setFetchError(null);
      }
    };
    fetchstudinfo();
  }, []);

  return (
    <div id="monitoring" className="overflow-hidden md:p-10 p-2">
      <div
        className=" text-white md:pt-[2%] pt-[10%]"
        data-aos="fade-up"
        data-aos-duration="500"
      >
        <header className="font-bold text-4xl">MASTER LIST</header>
        {studinfos === null ? (
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        ) : (
          ""
        )}

        <div className="bg-white w-[100%] mt-4 rounded-full text-black">
          <div id="searchbar" className="flex w-[100%] ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              className="h-[18px] w-10 mt-2.5 ml-2"
            >
              <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
            </svg>
            <input
              type="search"
              placeholder="Search"
              className="cursor-pointer w-[100%]  h-[40px] rounded-full border pl-12     focus:pl-16 focus:pr-4"
              onChange={(event) => {
                setSearchTerm(event.target.value);
              }}
            />
          </div>
        </div>

        <main className="md:h-[480px] h-[600px] mt-[1%] w-[100%]">
          <div className="bg-slate-300  rounded w-[100%] flex font-extrabold text-[#4D7C9A]">
            <div className="flex w-full h-[50px] items-center ">
              <label className=" text-center   md:pr-[27%] pr-[20%] md:ml-5 ml-2 md:text-[16px] text-[9px] underline">
                STUDENT NAME
              </label>
              <label className=" text-center   md:pr-[41%] pr-[29%] md:text-[16px] text-[9px]  underline">
                SECTION
              </label>

              <label className=" text-cr0px]   md:text-[16px] text-[9px] underline ">
                DURATION
              </label>
            </div>
          </div>
          {/* STUD INFO */}
          {fetcherrror && <p>{fetcherrror}</p>}
          {studinfos && (
            <div className="overflow-auto overflow-x-hidden h-[85%]">
              {studinfos
                .filter((val) => {
                  try {
                    if (searchTerm == "") {
                      return val;
                    } else if (
                      val.studname
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    ) {
                      return val;
                    } else if (
                      val.studsection
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    ) {
                      return val;
                    }
                  } catch (error) {}
                })
                .map((studinfo) => (
                  <MasterListTableConfig
                    key={studinfo.id}
                    studinfos={studinfo}
                  />
                ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MasterList;
