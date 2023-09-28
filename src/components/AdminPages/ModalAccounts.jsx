import React, { useState } from "react";

function ModalAccounts({ visible, beneinfo, setViewAccounts }) {
  if (!visible) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center p-4 ">
      <div
        className="bg-white h-[500px] w-[1200px] rounded-md shadow-lg shadow-black"
        data-aos="zoom-in"
        data-aos-duration="500"
      >
        <div className="text-black h-[100%] text-center p-4">
          <div className="h-[90%] overflow-y-auto">
            <div className=" grid-cols-5 justify-start  grid mb-1 bg-blue-900 bg-opacity-[60%] rounded-md p-3 w-[100%] font-bold">
              <p> Status </p>
              <p> Name </p>
              <p> Email </p>
              <p> Program </p>
              <p> Position </p>
            </div>
            {beneinfo
              .sort((a, b) => (a.status < b.status ? -1 : 1))
              .map((data) => (
                <div
                  key={data.id}
                  className=" md:grid-cols-5 grid-cols-1 justify-start  grid mb-1 bg-slate-300 rounded-md p-3 w-[100%] cursor-default"
                >
                  <div
                    className={`${
                      data.status === "active"
                        ? "text-green-500 font-semibold"
                        : "text-red-500 font-semibold"
                    } flex justify-center items-center gap-1`}
                  >
                    <div
                      className={`${
                        data.status === "active"
                          ? "bg-green-500 font-semibold h-[10px] w-[10px] rounded-full"
                          : "bg-red-500 font-semibold h-[10px] w-[10px] rounded-full"
                      }`}
                    />
                    {data.status.toUpperCase()}{" "}
                  </div>
                  <p> {data.beneName} </p>
                  <p> {data.beneEmail} </p>
                  <p>{data.filterby}</p>
                  <p>{data.position.toLowerCase()}</p>
                </div>
              ))}
          </div>

          <button
            className="mt-2 hover:text-red-500 hover:underline text-[20px]"
            onClick={() => setViewAccounts(false)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalAccounts;
