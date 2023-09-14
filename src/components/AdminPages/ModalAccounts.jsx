import React from "react";

function ModalAccounts({ visible, beneinfo, setViewAccounts }) {
  if (!visible) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center p-4">
      <div
        className="bg-white h-[500px] w-[700px] rounded-md"
        data-aos="zoom-in"
        data-aos-duration="500"
      >
        <div className="text-black h-[100%] text-center p-4">
          <div className="h-[90%] overflow-y-auto">
            <div className=" grid-cols-3 grid font-bold">
              <p> Name </p>
              <p> Email </p>
              <p> Status </p>
            </div>
            {beneinfo.map((data) => (
              <div
                key={data.id}
                className=" grid-cols-3 grid mb-1 bg-slate-300 rounded-md p-2 "
              >
                <p> {data.beneName} </p>
                <p> {data.beneEmail} </p>
                <p
                  className={`${
                    data.status === "active"
                      ? "text-green-500 font-semibold"
                      : "text-red-500 font-semibold"
                  }`}
                >
                  {data.status}{" "}
                </p>
              </div>
            ))}
          </div>

          <button
            className="mt-2 hover:text-red-500 hover:underline"
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
