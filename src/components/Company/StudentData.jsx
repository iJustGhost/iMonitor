import React, { useState } from "react";
import ViewStudData from "./ViewStudData";

function StudentData({ studinfo }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div
        onClick={() => setOpen(!open)}
        className="grid grid-cols-2 cursor-pointer hover:bg-[#5885AF] hover:bg-opacity-[70%]  hover:text-white p-1 rounded-md"
      >
        <p>{studinfo.studname}</p>
        <p>{studinfo.studsection}</p>
      </div>

      <ViewStudData
        onClose={setOpen}
        visible={open}
        studinfos={studinfo}
        studname={studinfo.studname}
        studemail={studinfo.studemail}
      />
    </>
  );
}

export default StudentData;
