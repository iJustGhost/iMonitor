import React, { useEffect, useState } from "react";
import supabase from "../iMonitorDBconfig";
import AdminConfig from "./AdminConfig";
import { ToastContainer, toast } from "react-toastify";

function AdminAccounts() {
  const [AdminData, setAdminData] = useState();

  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [confirmpassword, setConfirmPassword] = useState();

  useEffect(() => {
    FetchAdminData();
    const AdminAccount = supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "AdminAccount" },
        (payload) => {
          FetchAdminData();
        }
      )
      .subscribe();
  }, [AdminData]);

  async function FetchAdminData() {
    const { data: adminData } = await supabase.from("AdminAccount").select("*");
    setAdminData(adminData);
  }

  async function CreateAdminAccount() {
    if (!username || !password || !confirmpassword) {
      toast.warn("Please fill all the inputs", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }
    if (password !== confirmpassword) {
      toast.warn("Password doesn't match", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }

    const { data: create } = await supabase
      .from("AdminAccount")
      .insert([
        { username: username, password: confirmpassword, status: "active" },
      ]);

    toast.success("Created Successfully!", {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

    setUsername("");
    setPassword("");
    setConfirmPassword("");
  }

  return (
    <>
      <div className=" w-[100%] h-screen ">
        <div className=" w-[100%] h-[90%] gap-2 gap-y-10 grid grid-cols-1 md:grid-cols-2 md:p-10 p-1 place-content-center items-center overflow-auto">
          <div className="w-[100%]  h-[100%]  bg-[#94b8d8]  rounded-md">
            <div className="bg-[#5885AF] flex justify-center font-bold  text-[25px] p-1  rounded-t-md mb-2">
              CREATE ADMIN ACCOUNT
            </div>
            <div className="p-2 h-[75.5%] pt-[1%] ">
              <div className="flex-col gap-2 mb-2">
                <label className="text-[18px] font-semibold">UserName: </label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter UserName"
                  className="bg-slate-200 w-[100%] p-1 rounded-md"
                ></input>
              </div>

              <div className="flex-col gap-2 mb-2 ">
                <label className="text-[18px] font-semibold">Password: </label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  className="bg-slate-200 w-[100%] p-1 rounded-md"
                ></input>
              </div>
              <div className="flex-col gap-2 mb-2">
                <label className="text-[18px] font-semibold">
                  Confirm Password:
                </label>
                <input
                  value={confirmpassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-Enter Password"
                  className="bg-slate-200 w-[100%] p-1 rounded-md"
                ></input>
              </div>
            </div>
            <button
              onClick={() => CreateAdminAccount()}
              className="bg-[#5885AF] hover:bg-[#5885afa8] hover:text-white w-[100%] p-2 bottom-0 rounded-b-md font-semibold"
            >
              CREATE
            </button>
          </div>
          <div className="w-[100%] h-[100%] bg-[#94b8d8] rounded-md flex-col ">
            <div className=" bg-[#5885AF] flex justify-center font-bold  text-[25px] p-1  rounded-t-md mb-2">
              CREATED ADMIN ACCOUNT'S
            </div>
            <div className="grid grid-cols-4 p-1 font-semibold text-[17px] ">
              <label className="cursor-pointer flex items-center justify-center">
                UserName
              </label>
              <label className="cursor-pointer flex items-center justify-center">
                {" "}
                Created Date
              </label>
              <label className="cursor-pointer flex items-center justify-center">
                Status
              </label>
              <label className="cursor-pointer flex items-center justify-center">
                Edit Status
              </label>
            </div>
            {AdminData ? (
              <div className="h-[295px] overflow-auto">
                {AdminData.sort((a, b) => (a.status <= b.status ? -1 : 1)).map(
                  (admin) => (
                    <AdminConfig key={admin.data} admin={admin} />
                  )
                )}
              </div>
            ) : (
              <div className="flex place-content-center items-center h-[50%] font-bold underline">
                There is something wrong with the connection
              </div>
            )}
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={1000}
        limit={1}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default AdminAccounts;
