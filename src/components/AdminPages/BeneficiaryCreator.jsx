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
  const [beneinfo1, setBeneinfo1] = useState();
  const [createname, setCreateName] = useState("");
  const [createemail, setCreateEmail] = useState("");
  const [performerror, setPerformError] = useState("");

  const [oldname, setOldName] = useState("");
  const [updatename, setupdatename] = useState("");
  const [updateemail, setupdateemail] = useState("");
  const [updateid, setupdateid] = useState("");
  const [performerrorupdate, setPerformErrorUpdate] = useState("");

  const [archiveid, setArchiveId] = useState("");
  const [archivename, setArchiveName] = useState("");
  const [archivestatus, setArchiveStatus] = useState("");

  const [status, setStatus] = useState();
  const [performerrorarchive, setPerformErrorArchive] = useState("");

  const [position, setPosition] = useState("ALUMNI OFFICER");
  const [course, setCourse] = useState("BSIT");

  const [positionupdate, setPositionUpdate] = useState();
  const [courseupdate, setCourseUpdate] = useState("BSIT");

  //Modal View accounts
  const [viewAccounts, setViewAccounts] = useState(false);

  const [loadingcreate, setLoadingCreate] = useState(false);
  const [loadingupdate, setLoadingUpdate] = useState(false);
  const [loadingarchive, setLoadingArchive] = useState(false);

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
      setBeneinfo1(data);
    }
  };

  //Create Account of Beneficiary

  async function createaccount() {
    if (!createname || !createemail || !position || !course) {
      setPerformError("Please input all fields");
      return;
    }

    setLoadingCreate(true);

    if (position === "ALUMNI OFFICER") {
      setCourse("ALL");
    }

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

  // UPDATE Function

  async function updateaccount() {
    if (updatename === "" || updateemail === "") {
      setPerformErrorUpdate("Please input all fields");
      return;
    }

    var run = false
    console.log(oldname)
    for (let index = 0; index < beneinfo.length; index++) {
      if (beneinfo[index].beneName === oldname) {
        run = true;
      }
    }

    if (run === true) {
      if (oldname !== updatename) {
        const { data: beneName } = await supabase
          .from("Messaging")
          .update({ name: updatename })
          .eq("name", oldname);

        const { data: beneContactWith } = await supabase
          .from("Messaging")
          .update({ contactwith: updatename })
          .eq("contactwith", oldname);
      }

      var courseupdate1;
      if (positionupdate !== "ADVISER") {
        courseupdate1 = "ALL";
        const { data } = await supabase
          .from("BeneAccount")
          .update({
            beneName: updatename,
            beneEmail: updateemail,
            filterby: courseupdate1,
            position: positionupdate,
          })
          .eq("id", updateid);
      } else {
        const { data } = await supabase
          .from("BeneAccount")
          .update({
            beneName: updatename,
            beneEmail: updateemail,
            filterby: courseupdate,
            position: positionupdate,
          })
          .eq("id", updateid);
      }

      setupdateemail("");
      setupdatename("");
      setValue("");
      setPerformErrorUpdate();
      toast.success("Account Updated Successfully!", {
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
      toast.warning("Account Not Detected", {
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

  // ARCHIVE Function
  async function archiveaccount() {
    if (!archivename) {
      setPerformErrorArchive("Please input the name or search for it");
      return;
    }
    if (status === null) {
      setStatus(archivestatus);
    }

    var run = false;
    for (let index = 0; index < beneinfo.length; index++) {
      if (beneinfo[index].beneName === archivename) {
        run = true;
      }
    }

    if (run === true) {
      const { data: archive } = await supabase
        .from("BeneAccount")
        .update({ status: archivestatus })
        .eq("beneName", archivename);

      setArchiveName("");
      setArchiveStatus("");
      setValue1("");

      toast.success("Account Archive Successfully!", {
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
      toast.warning("Account Archive Not Successful!", {
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

  return (
    <>
      <ToastContainer limit={1} />

      <div className="h-screen overflow-y-auto  md:ml-0 ml-52 ">
        <div className="grid md:grid-cols-3 grid-cols-1 gap-5 gap-y-50  md:ml-[2.5%] ml-0 md:mr-[2.5%] mr-0 mt-[10%] place-content-center">
          {/* Create */}
          <div className="bg-white  h-[390px] rounded-sm flex flex-col ">
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
                    type="text"
                    value={createemail}
                    placeholder="Type Email Here"
                    onChange={(e) => setCreateEmail(e.target.value)}
                    className="bg-gray-200 w-[90%] ml-5 mb-2 pl-2 p-2 rounded-sm"
                  ></input>

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
          {/* Update */}
          <div className="bg-white h-[390px] rounded-md">
            <p className="text-center font-bold text-[30px] bg-amber-700 rounded-t-sm font-mono text-white">
              UPDATE ACCOUNT
            </p>

            <div className="mt-[7%] flex w-full   text-black ">
              <div className="ml-5 font-semibold mb-2 mt-2">SEARCH</div>
              <div className="flex flex-col w-[100%] relative">
                <input
                  type="text"
                  placeholder="Search name here.."
                  value={value}
                  onChange={onChange}
                  className="bg-gray-200 w-[93%] ml-1 mb-2 pl-2 p-2 rounded-sm"
                />
                <div className=" text-black">
                  {beneinfo && (
                    <div
                      className={`${
                        value &&
                        `${
                          value === updatename
                            ? ""
                            : " bg-slate-300 w-fit max-h-28 overflow-y-auto overflow-x-hidden absolute ml-1 "
                        }`
                      }`}
                    >
                      {beneinfo
                        .filter((item) => {
                          try {
                            const searchTerm = value.toLowerCase();
                            const benename = item.beneName.toLowerCase();
                            const beneemail = item.beneEmail.toLowerCase();

                            return (
                              searchTerm &&
                              benename.includes(searchTerm) &&
                              benename !== searchTerm
                            );
                          } catch (error) {}
                        })

                        .map((beneinfo) => (
                          <div className="w-[300px]" key={beneinfo.id}>
                            <div
                              onClick={() =>
                                onSearch(beneinfo.beneName) ||
                                setupdateemail(beneinfo.beneEmail) ||
                                setupdatename(beneinfo.beneName) ||
                                setupdateid(beneinfo.id) ||
                                setOldName(beneinfo.beneName) ||
                                setPositionUpdate(beneinfo.position) ||
                                setCourseUpdate(beneinfo.filterby)
                              }
                              className="p-1 hover:bg-blue-400 m-1 flex-col gap-1 hover:cursor-pointer"
                            >
                              <div>{beneinfo.beneName}</div>
                              <div className="text-blue-700">
                                {beneinfo.beneEmail}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <p className="underline ml-4 mr-4 w-[91%] h-[1px] bg-black mb-3 mt-3"></p>
            {updatename && (
              <div>
                <p className="ml-5 font-semibold mt-4">
                  NAME
                  <input
                    type="text"
                    value={updatename}
                    onChange={(e) => setupdatename(e.target.value)}
                    placeholder="Update name here"
                    className="bg-gray-200 w-[80%] ml-5 mb-2 pl-2 p-1 rounded-sm"
                  ></input>
                </p>

                <p className="ml-5 font-semibold mt-4">
                  EMAIL
                  <input
                    type="text"
                    value={updateemail}
                    onChange={(e) => setupdateemail(e.target.value)}
                    placeholder="Update email here"
                    className="bg-gray-200 w-[80%] ml-5 mb-2 pl-2 p-1 rounded-sm"
                  ></input>
                </p>
                {updatename && (
                  <div className="flex">
                    <select
                      className="ml-5 mb-2 border-2 border-slate-400"
                      value={positionupdate}
                      onChange={(e) => setPositionUpdate(e.target.value)}
                    >
                      <option>ALUMNI OFFICER</option>
                      <option>ADVISER </option>
                    </select>
                    {positionupdate === "ADVISER" && (
                      <select
                        className="ml-5 mb-2 border-2 border-slate-400"
                        value={courseupdate}
                        onChange={(e) => setCourseUpdate(e.target.value)}
                      >
                        <option value={"BSIT"}>BSIT</option>
                        <option value={"BSAIS"}>BSAIS</option>
                        <option value={"BSTM"}>BSTM</option>
                        <option value={"BSHM"}>BSHM</option>
                      </select>
                    )}
                  </div>
                )}

                {performerrorupdate && (
                  <p className="ml-[20px] text-red-600">{performerrorupdate}</p>
                )}
                <button
                  onClick={() => updateaccount()}
                  className="bg-[#12557c] hover:bg-[#1b7fb9] text-white font-bold w-[90.5%] p-2 ml-5 "
                >
                  UPDATE
                </button>
              </div>
            )}
          </div>
          {/* Archive */}
          <div className="bg-white  h-[390px] rounded-md mb-[40%]">
            <p className="text-center font-bold text-[30px] bg-[#0074B7] rounded-t-sm font-mono text-white">
              ARCHIVE ACCOUNT
            </p>
            <div className="mt-[7%] flex w-full   text-black ">
              <div className="ml-5 font-semibold mb-2 mt-2">SEARCH</div>
              <div className=" flex-col w-[100%] relative">
                <input
                  type="text"
                  placeholder="Search name here.."
                  value={value1}
                  onChange={onChange1}
                  className="bg-gray-200 w-[93%] ml-2 mb-2 pl-2 p-2 rounded-sm "
                />
                <div
                  className={`${
                    value1 &&
                    `${
                      value1 === archivename
                        ? ""
                        : "bg-slate-300 w-fit max-h-28 overflow-y-auto overflow-x-hidden absolute ml-2  "
                    }`
                  }`}
                >
                  {beneinfo1 && (
                    <div className="">
                      {beneinfo1
                        .filter((item1) => {
                          const searchTerm1 = value1.toLowerCase();
                          const benename1 = item1.beneName.toLowerCase();
                          const beneemail = item1.beneEmail.toLowerCase();

                          return (
                            searchTerm1 &&
                            benename1.includes(searchTerm1) &&
                            benename1 !== searchTerm1
                          );
                        })
                        .map((beneinfo1) => (
                          <div className="w-[300px]" key={beneinfo1.id}>
                            <div
                              onClick={() =>
                                onSearch1(beneinfo1.beneName) ||
                                setArchiveId(beneinfo1.id) ||
                                setArchiveName(beneinfo1.beneName) ||
                                setArchiveStatus(beneinfo1.status) ||
                                setStatus(beneinfo1.status)
                              }
                              className="hover:bg-blue-400 m-1 flex gap-1 hover:cursor-pointer text-black"
                            >
                              <div>{beneinfo1.beneName}</div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <p className="underline ml-4 mr-4 w-[91%] h-[1px] bg-black mb-3 mt-3"></p>
            {archivename && (
              <div>
                {" "}
                <p className="ml-5 font-semibold mt-4">
                  NAME
                  <input
                    type="text"
                    value={archivename}
                    onChange={(e) => setArchiveName(e.target.value)}
                    placeholder="Update name here"
                    className="bg-gray-200 w-[80%] ml-5 mb-2 pl-2 p-1 rounded-sm"
                  ></input>
                </p>
                <p className="ml-5 font-semibold mt-4">
                  STATUS
                  <select
                    value={archivestatus}
                    className="ml-5 w-[78%] bg-gray-200 p-1"
                    onChange={(e) => setArchiveStatus(e.target.value)}
                  >
                    <option>--Change status here--</option>
                    <option>active</option>
                    <option>deactive</option>
                  </select>
                </p>
                {archivestatus && (
                  <div
                    className={`${
                      status === "active"
                        ? "ml-5 text-[14px] text-green-600 mt-2"
                        : "ml-5 text-[14px] text-red-600 mt-2"
                    }`}
                  >
                    The current status of this account is {status}
                  </div>
                )}
                {performerrorarchive && (
                  <p className="ml-[20px] text-red-600 mt-2">
                    {performerrorarchive}
                  </p>
                )}
                <button
                  onClick={() => archiveaccount()}
                  className="bg-[#12557c] hover:bg-[#1b7fb9] text-white font-bold w-[90.5%] p-2 ml-5 mt-2"
                >
                  ARCHIVE
                </button>
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
