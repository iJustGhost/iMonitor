import React, { useState, useEffect } from "react";
import supabase from "../iMonitorDBconfig";
import CompanyConfig from "./CompanyConfig";
import { Backdrop } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

import AOS from "aos";
import "aos/dist/aos.css";

const Company = () => {
  // AOS ANIMATION
  useEffect(() => {
    AOS.init({});
  }, []);

  const [fetcherrror, setFetchError] = useState(null);
  const [companyinfos, setStudCompanyInfos] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchcompanyinfo = async () => {
      const { data, error } = await supabase.from("CompanyTable").select();

      if (error) {
        setFetchError("Could not fetch the data please check your internet");
        setStudCompanyInfos(null);
        console.log(error);
      }
      if (data) {
        setStudCompanyInfos(data);
        setFetchError(null);
      }
    };
    fetchcompanyinfo();
  }, []);
  return (
    <div className="overflow-hidden  md:p-10 p-2">
      {companyinfos === null ? (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : (
        ""
      )}
      <div
        data-aos="fade-up"
        data-aos-duration="500"
        className="md:pt-[2%] pt-[10%]"
      >
        <label className="text-[30px] font-bold text-white">
          COMPANY INFORMATION
        </label>
        <div
          className="bg-slate-100 w-[100%] mt-4 rounded-full justify-center flex
               text-black"
        >
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
              value={searchTerm}
              className="cursor-pointer w-[100%]  h-[40px] rounded-full border pl-12  focus:pl-16 focus:pr-4"
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
            />
          </div>
        </div>
        <div
          className="bg-slate-300 rounded mt-10 w-[100%] h-[50px] justify-center items-center text-[20px]  flex font-extrabold
               text-[#4D7C9A] "
        >
          <p>COMPANY</p>
        </div>
      </div>

      <div className=" bg-black  bg-opacity-[1%] mt-1 h-[380px]  overflow-y-auto overflow-x-hidden">
        {companyinfos && (
          <div className=" ">
            {companyinfos
              .filter((val) => {
                try {
                  if (searchTerm == "") {
                    return val;
                  } else if (
                    val.companyname
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                  ) {
                    return val;
                  } else if (
                    val.companyaddress
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                  ) {
                    return val;
                  }
                } catch (error) {}
              })
              .map((companyinfos) => (
                <CompanyConfig
                  key={companyinfos.id}
                  companyinfos={companyinfos}
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Company;
