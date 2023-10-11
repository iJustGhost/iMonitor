import React, { useEffect, useState } from "react";
import supabase from "../iMonitorDBconfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ModalAccounts from "./ModalAccounts";
import { BounceLoader } from "react-spinners";

import { Backdrop } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

const BeneficiaryCreator = () => {
  const [beneinfo, setBeneinfo] = useState();
  const [createname, setCreateName] = useState("");
  const [createemail, setCreateEmail] = useState("");
  const [performerror, setPerformError] = useState("");

  const [position, setPosition] = useState("ALUMNI OFFICER");
  const [course, setCourse] = useState("ALL");

  const [positionupdate, setPositionUpdate] = useState();
  const [courseupdate, setCourseUpdate] = useState("BSIT");

  const [archiveid, setArchiveId] = useState("");
  const [archivename, setArchiveName] = useState("");
  const [archivestatus, setArchiveStatus] = useState("");

  const [status, setStatus] = useState();
  const [performerrorarchive, setPerformErrorArchive] = useState("");

  //Modal View accounts
  const [viewAccounts, setViewAccounts] = useState(false);

  const [loadingcreate, setLoadingCreate] = useState(false);
  const [loadingupdate, setLoadingUpdate] = useState(false);
  const [loadingarchive, setLoadingArchive] = useState(false);

  const [error, setError] = useState(null);

  const [value, setValue] = useState("");
  const onChange = (event) => {
    setValue(event.target.value);
  };

  const onSearch = (searchTerm) => {
    setValue(searchTerm);
  };

  const [value1, setValue1] = useState("");
  const onChange1 = (event) => {
    setValue1(event.target.value);
  };

  const onSearch1 = (searchTerm) => {
    setValue1(searchTerm);
  };

  useEffect(() => {
    fetchbeneinfo();

    const BeneAccount = supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "BeneAccount" },
        (payload) => {
          fetchbeneinfo();
        }
      )
      .subscribe();
  }, [archivename]);

  const fetchbeneinfo = async () => {
    const { data } = await supabase.from("BeneAccount").select();

    if (data) {
      setBeneinfo(data);
    }
  };

  //Create Account of Beneficiary
  var emailchecker = false;
  async function createaccount() {
    if (!createname || !createemail || !position || !course) {
      setPerformError("Please input all fields");
      return;
    }

    if (!isValidEmail(createemail)) {
      emailchecker = false;
      toast.warning("Invalid Email", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } else {
      emailchecker = true;
    }

    if (emailchecker) {
      var positionCHECKER;

      if (position === "ALUMNI OFFICER") {
        positionCHECKER = "ALL";
      }

      if (positionCHECKER) {
        const { data: a } = await supabase
          .from("BeneAccount")
          .insert([
            {
              beneName: createname,
              beneEmail: createemail,
              status: "active",
              position: position,
              filterby: positionCHECKER,
            },
          ])
          .single();
      } else {
        const { data: a } = await supabase
          .from("BeneAccount")
          .insert([
            {
              beneName: createname,
              beneEmail: createemail,
              status: "active",
              position: position,
              filterby: course,
            },
          ])
          .single();
      }

      setLoadingCreate(false);
      setCreateName("");
      setCreateEmail("");
      setPerformError("");
      toast.success("Account Created Successfully!", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  }

  const fetchbeneinfo1 = async () => {};

  function isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  }

  return (
    <>
      <ToastContainer limit={1} />

      <div className="h-screen overflow-y-auto  md:ml-0 ml-52 ">
        <div className=" md:grid-cols-3 grid-cols-1 gap-5 gap-y-50  md:ml-[2.5%] ml-0 md:mr-[2.5%] mr-0 mt-[10%] place-content-center flex">
          {/* Create */}
          <div className="bg-white w-[400px] h-[390px] rounded-md shadow-2xl shadow-slate-900 ">
            <p className="text-center font-bold text-[30px] bg-green-700 rounded-t-sm font-mono  text-white">
              CREATE ACCOUNT
            </p>
            {!loadingcreate ? (
              <div>
                <div className="mt-[5.8%]">
                  <p className="ml-5 font-semibold mt-4">NAME</p>
                  <input
                    type="text"
                    value={createname}
                    placeholder="Type Name Here"
                    onChange={(e) => setCreateName(e.target.value)}
                    className="bg-gray-200 w-[90%] ml-5 mb-2 pl-2 p-2 rounded-sm"
                  ></input>
                  <p className="ml-5 font-semibold mt-4">EMAIL</p>

                  <input
                    type="email"
                    value={createemail}
                    placeholder="Type Email Here"
                    onChange={(e) => setCreateEmail(e.target.value)}
                    className="bg-gray-200 w-[90%] ml-5 mb-2 pl-2 p-2 rounded-sm"
                  ></input>
                  {error && (
                    <h2 className="ml-5" style={{ color: "red" }}>
                      {error}
                    </h2>
                  )}

                  {createname && (
                    <div className="flex">
                      <select
                        value={position}
                        className="ml-5 mb-2 border-2 border-slate-400"
                        onChange={(e) => setPosition(e.target.value)}
                      >
                        <option>ALUMNI OFFICER</option>
                        <option>ADVISER </option>
                      </select>
                      {position === "ADVISER" && (
                        <select
                          value={course}
                          className="ml-5 mb-2 border-2 border-slate-400"
                          onChange={(e) => setCourse(e.target.value)}
                        >
                          <option value={"BSIT"}>BSIT</option>
                          <option value={"BSAIS"}>BSAIS</option>
                          <option value={"BSTM"}>BSTM</option>
                          <option value={"BSHM"}>BSHM</option>
                        </select>
                      )}
                    </div>
                  )}

                  {performerror && (
                    <p className="ml-[20px] text-red-600">{performerror}</p>
                  )}
                  <button
                    onClick={() => createaccount()}
                    className="bg-[#12557c] hover:bg-[#1b7fb9] text-white font-bold w-[90%] p-2 ml-5 "
                  >
                    CREATE
                  </button>
                </div>
                <a
                  onClick={() => setViewAccounts(!viewAccounts)}
                  className=" text-blue-500 hover:underline cursor-pointer flex justify-start ml-5"
                >
                  View Accounts
                </a>
              </div>
            ) : (
              <div className="">
                <Backdrop
                  sx={{
                    color: "#fff",
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                  }}
                  open
                >
                  <CircularProgress color="inherit" />
                </Backdrop>
              </div>
            )}
          </div>
        </div>
      </div>

      <ModalAccounts
        visible={viewAccounts}
        setViewAccounts={setViewAccounts}
        beneinfo={beneinfo}
      />
    </>
  );
};

export default BeneficiaryCreator;
