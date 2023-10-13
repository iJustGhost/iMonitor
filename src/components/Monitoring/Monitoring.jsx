import React, { useState, useEffect } from "react";
import supabase from "../iMonitorDBconfig";
import StudInfoConfig from "./StudInfoConfig";

import AOS from "aos";
import "aos/dist/aos.css";

import { Backdrop } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

import ReactPaginate from "react-paginate";

const Monitoring = ({ Data }) => {
  const [fetcherrror, setFetchError] = useState(null);
  const [studinfos, setStudInfos] = useState(null);
  const [searchstudinfos, setSearchStudInfos] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [count, setCount] = useState();


  useEffect(() => {
    fetchstudinfo();
    supabase
      .channel("table-db-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "StudentInformation",
        },
        (payload) => {
          fetchstudinfo();
        }
      )
      .subscribe();
    AOS.init({ duration: 1000 });
  }, [Data]);

  function refresh() {
    fetchstudinfo();
  }

  const fetchstudinfo = async () => {
    try {
      if (Data.filterby !== "ALL") {
        const { data, count, error } = await supabase
          .from("StudentInformation")
          .select("*", { count: "exact" })
          .eq("studcourse", Data.filterby);

        if (error) {
          setFetchError("Could not fetch the data please check your internet");
        }
        setCount(count);
        setStudInfos(data);

        const { data: search } = await supabase
          .from("StudentInformation")
          .select()
          .eq("studcourse", Data.filterby);

        setSearchStudInfos(search);
      } else {
        const { data, count, error } = await supabase
          .from("StudentInformation")
          .select("*", { count: "exact" });

        if (error) {
          setFetchError("Could not fetch the data please check your internet");
        }

        const { data: search } = await supabase
          .from("StudentInformation")
          .select();

        setSearchStudInfos(search);

        setCount(count);
        setStudInfos(data);
      }
    } catch (error) {}
  };

  const [pageNumber, setPageNumber] = useState(0);
  const userPerPage = 20;
  const pageVisited = pageNumber * userPerPage;

  const pageCount = Math.ceil(count / userPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  return (
    <div
      id="monitoring"
      className=" overflow overflow-hidden text-white md:p-10 p-2"
    >
      <div
        className="md:pt-[2%] pt-[10%]"
        data-aos="fade-up"
        data-aos-duration="500"
      >
        <header className="font-bold  text-4xl mb-2">MONITORING</header>
        <div className="flex gap-4 max-h-[50px]">
          <select className=" h-[25px] rounded-md bg-[#5885AF] ">
            <option>ALL</option>
            <option>BSIT</option>
            <option>BSAIS</option>
            <option>BSTM</option>
            <option>BSHM</option>
          </select>
          <select className=" h-[25px] rounded-md bg-[#5885AF] overflow-auto ">
            <option className="text-[15px]">S.Y. 2023-2024</option>
            <option className="text-[15px]">S.Y. 2024-2025</option>
            <option className="text-[15px]">S.Y. 2026-2027</option>
            <option className="text-[15px]">S.Y. 2027-2028</option>
            <option className="text-[15px]">S.Y. 2028-2029</option>
          </select>
        </div>
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
        <div className="bg-white w-[100%] mt-4 rounded-full text-black mb-2">
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
              className="cursor-text w-[100%] h-[40px] rounded-full border pl-12  focus:pl-16 focus:pr-4"
              onChange={(event) => {
                setSearchTerm(event.target.value);
              }}
            />
          </div>
        </div>

        <main className=" md:h-[390px] h-[500px] ">
          <div className="bg-slate-300 flex font-extrabold rounded-md text-[#41729F] ">
            <div className="flex w-full h-[50px] items-center ">
              <label className=" text-center   md:pr-[27%] pr-[13%] md:ml-5 ml-2 md:text-[16px] text-[9px] underline">
                STUDENT NAME
              </label>
              <label className=" text-center   md:mr-[38%] mr-[24%] md:text-[16px] text-[9px]  underline">
                SECTION
              </label>
              <label className=" text-cr0px]  md:mr-[7%] mr-[11%] md:text-[16px] text-[9px] underline ">
                DURATION
              </label>
              <a
                id="menu"
                data-tip="Refresh"
                className="        
                  font-semibold
                  before:content-[attr(data-tip)]
                  before:absolute
                  before:px-3 before: py-2
                  before:left/12 before: top-3
                  before:w-max before:max-w-xs
                  before:-translate-x-1/2 before:-translate-y-full
                  before:bg-gray-400 before:text-white
                  before:rounded-sm before:opacity-0
                  before:transition-all
                  hover:before:opacity-100 "
              >
                <svg
                  onClick={() => refresh()}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  className="md:h-6 h-5 md:w-6 w-5 mt-0.5 text-black hover:text-blue-500 cursor-pointer"
                  viewBox="0 0 512 512"
                >
                  <path d="M463.5 224H472c13.3 0 24-10.7 24-24V72c0-9.7-5.8-18.5-14.8-22.2s-19.3-1.7-26.2 5.2L413.4 96.6c-87.6-86.5-228.7-86.2-315.8 1c-87.5 87.5-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3c62.2-62.2 162.7-62.5 225.3-1L327 183c-6.9 6.9-8.9 17.2-5.2 26.2s12.5 14.8 22.2 14.8H463.5z" />
                </svg>
              </a>
            </div>
          </div>
          {/* STUD INFO */}
          {fetcherrror && <p>{fetcherrror}</p>}
          {searchTerm ? (
            <>
              {" "}
              {searchstudinfos && (
                <div className="overflow-y-auto bg-black bg-opacity-[1%] h-[90%] overflow-hidden">
                  {searchstudinfos
                    .filter((val) => {
                      try {
                        if (searchTerm === "") {
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
                    .sort((a, b) => (a.studprogress <= b.studprogress ? 1 : -1))
                    .map((studinfo) => (
                      <StudInfoConfig
                        key={studinfo.id}
                        studinfos={studinfo}
                        studemai={studinfo.studemail}
                      />
                    ))}
                </div>
              )}
            </>
          ) : (
            <>
              {" "}
              {studinfos && (
                <div className="overflow-y-auto bg-black bg-opacity-[1%] h-[90%] overflow-hidden">
                  {studinfos
                    .slice(pageVisited, pageVisited + userPerPage)
                    .filter((val) => {
                      try {
                        if (searchTerm === "") {
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
                    .sort((a, b) => (a.studprogress <= b.studprogress ? 1 : -1))
                    .map((studinfo) => (
                      <StudInfoConfig
                        BeneData={Data}
                        key={studinfo.id}
                        studinfos={studinfo}
                        studemai={studinfo.studemail}
                      />
                    ))}
                </div>
              )}
            </>
          )}
        </main>
        <div className="mt-[2%]">
          <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            pageCount={pageCount}
            onPageChange={changePage}
            containerClassName="flex gap-2 justify-center flex items-center"
            previousLinkClassName="bg-[#5885AF] p-1 rounded-md flex items-center"
            nextLinkClassName="bg-[#5885AF] p-1 rounded-md flex items-center"
            disabledLinkClassName="bg-[#5885AF] p-1 rounded-md"
            activeLinkClassName="bg-[#5885AF] p-1 rounded-md"
          />
        </div>
      </div>
    </div>
  );
};

export default Monitoring;
