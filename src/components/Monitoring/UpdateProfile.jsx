import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import React from "react";
import supabase from "../iMonitorDBconfig";
import options from "../programoptions.json";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UpdateProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [showmodalupdate, setShowModalupdate] = useState(false);

  const [studfullname, setStudFullName] = useState("");
  const [studprogram, setStudProgram] = useState("");
  const [studemail, setStudemail] = useState("");
  const [ojtstart, setOjtStart] = useState("");
  const [ojtend, setOjtEnd] = useState("");
  const [studsection, setStudSection] = useState("");
  const [studremarks, setStudRemarks] = useState("");
  const [companyname, setCompanyname] = useState("");
  const [companyaddress, setCompanyaddress] = useState("");
  const [supervisorname, setSupervisorname] = useState("");
  const [supervisorcontactnumber, setSupervisorcontactnumber] = useState("");
  const [supervisorofficenumber, setSupervisorofficenumber] = useState("");
  const [designation, setDesignation] = useState("");
  const [companyemail, setCompanyemail] = useState("");

  const [formError, setFormError] = useState(null);

  useEffect(() => {
    const fetchstudinfo = async () => {
      const { data } = await supabase
        .from("StudentInformation")
        .select()
        .eq("id", id)
        .single();

      if (data) {
        //information
        setStudFullName(data.studname);
        setStudProgram(data.studprogram);
        setStudSection(data.studsection);
        setOjtStart(data.ojtstart);
        setOjtEnd(data.ojtend);
        setStudemail(data.studemail);
        setStudRemarks(data.studremarks);
        //company
        setCompanyname(data.companyname);
        setCompanyaddress(data.companyaddress);
        setSupervisorname(data.supervisorname);
        setSupervisorcontactnumber(data.supervisorcontactnumber);
        setSupervisorofficenumber(data.supervisorofficenumber);
        setDesignation(data.companydesignation);
        setCompanyemail(data.companyemail);
      }
    };
    fetchstudinfo();
  }, [id, navigate]);

  const handlesubmit = async (e) => {
    e.preventDefault();

    if (
      !studfullname ||
      !studprogram ||
      !ojtstart ||
      !ojtend ||
      !studsection ||
      !companyname ||
      !companyaddress ||
      !supervisorname ||
      !supervisorcontactnumber ||
      !supervisorofficenumber ||
      !designation ||
      !companyemail
    ) {
      setFormError("Please Fill All FIELDS CORRECTLY! 1");
      return;
    }
    var program = studprogram.toString();

    const { data, error } = await supabase
      .from("StudentInformation")
      .update({
        studname: studfullname,
        studemail: studemail,
        ojtstart: ojtstart,
        ojtend: ojtend,
        studprogram: program,
        studsection: studsection,
        studremarks: studremarks,
        companyname: companyname,
        companyaddress: companyaddress,
        supervisorname: supervisorname,
        supervisorcontactnumber: supervisorcontactnumber,
        supervisorofficenumber: supervisorofficenumber,
        companydesignation: designation,
        companyemail: companyemail,
      })
      .eq("id", id);

    if (error) {
      console.log(error);
      setFormError("Please Fill All FIELDS CORRECTLY! 2");
    }
    if (data) {
      setFormError(null);
    }
    notifycomplete();
  };
  function notifycomplete() {
    toast.success("Updated!", {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  }

  let menuRef = useRef();
  useEffect(() => {
    let handler = (event) => {
      if (!menuRef.current.contains(event.target)) {
      }
    };
    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });
  return (
    <div className="text-white">
      <div className="pl-9 pt-16 md:pr-0 pr-9">
        <header className="font-bold md:text-4xl text-3xl mb-8">
          EDIT STUDENT INFORMATION
        </header>
        {/*First line*/}
        <form
          onSubmit={handlesubmit}
          className="flex-col gap-y-[16px] grid h-[525px]  overflow-y-scroll"
        >
          <label className="font-semibold text-[25px] underline">
            STUDENT INFROMATION
          </label>
          <div className="grid md:flex grid-cols-1  gap-4 mt-5">
            <label className="font-semibold text-[19px]">NAME</label>
            <input
              type="text"
              className="rounded-md pl-2 p-1 w-[full] md:w-[93.5%] text-black"
              id="studfname"
              value={studfullname}
              placeholder="First Name"
              // onChange={(e) => setStudFullName(e.target.value)}
              disabled={true}
            ></input>
          </div>
          <div className="grid md:flex grid-cols-1  gap-4 pt-4">
            <label className="font-semibold text-[19px]">PROGRAM</label>

            <div className="" ref={menuRef}>
              <select
                className="w-full text-black rounded-md pl-2 pr-2 text-justify p-1"
                onChange={(e) => setStudProgram(e.target.value)}
                value={studprogram}
              >
                {options.map((options) => (
                  <option key={options.id} className="pt-4 text-black">
                    {options.Program}
                  </option>
                ))}
              </select>
            </div>
            <label className="font-semibold text-[19px]">SECTION</label>
            <input
              value={studsection}
              onChange={(e) => setStudSection(e.target.value)}
              type="text"
              placeholder="Enter Section"
              className="rounded-md md:w-[44.8%] w-full text-black pl-2"
            ></input>
          </div>

          <div className="grid md:flex grid-cols-1  gap-4 pt-4">
            <label className="font-semibold text-[19px]">OJT STARTING</label>
            <input
              type="date"
              value={ojtstart}
              className="rounded-md md:w-[38%] w-full text-black pl-2"
              onChange={(e) => setOjtStart(e.target.value)}
            />
            <label className="font-semibold text-[19px]">OJT END</label>
            <input
              type="date"
              value={ojtend}
              className="rounded-md md:w-[38%] w-full text-black pl-2"
              onChange={(e) => setOjtEnd(e.target.value)}
            />
          </div>
          <div className="grid md:flex grid-cols-1  gap-4 pt-4">
            <label className="font-semibold text-[19px]">O365 EMAIL</label>
            <input
              type="text"
              className="rounded-md  md:w-[90%] w-full text-black pl-2"
              value={studemail}
              onChange={(e) => setStudemail(e.target.value)}
              placeholder="Email O365"
            ></input>
          </div>

          <div className="grid md:flex grid-cols-1  gap-4 pt-4 mb-10">
            <label className="font-semibold text-[19px]">REMARKS</label>
            <textarea
              rows="4"
              className="p-1 md:w-[91.5%] w-full text-sm text-gray-900  rounded-md"
              placeholder="Write Remaks Here.."
              // value={studremarks}
              // onChange={(e) => setStudRemarks(e.target.value)}
            ></textarea>
          </div>
          <label className="font-semibold text-[25px] underline ">
            COMPANY INFROMATION
          </label>

          <div className="grid md:flex grid-cols-1  gap-4 pt-4">
            <label className="font-semibold text-[19px]">COMPANY NAME</label>
            <input
              value={companyname}
              onChange={(e) => setCompanyname(e.target.value)}
              type="text"
              className="rounded-md md:w-[34.8%] w-full text-black pl-2"
            ></input>

            <label className="font-semibold text-[19px]">COMPANY ADDRESS</label>
            <input
              value={companyaddress}
              onChange={(e) => setCompanyaddress(e.target.value)}
              type="text"
              className="rounded-md md:w-[34.8%] w-full text-black pl-2"
            ></input>
          </div>

          <div className="grid md:flex grid-cols-1  gap-4 pt-4">
            <label className="font-semibold text-[19px]">SUPERVISOR NAME</label>
            <input
              value={supervisorname}
              onChange={(e) => setSupervisorname(e.target.value)}
              type="text"
              className="rounded-md md:w-[32.6%] w-full text-black pl-2"
            ></input>

            <label className="font-semibold text-[19px]">
              SUPERVISOR CONTACT #
            </label>
            <input
              value={supervisorcontactnumber}
              onChange={(e) => setSupervisorcontactnumber(e.target.value)}
              type="text"
              className="rounded-md md:w-[32.6%] w-full text-black pl-2"
            ></input>
          </div>

          <div className="grid md:flex grid-cols-1  gap-4 pt-4 mb-3">
            <label className="font-semibold text-[19px]">OFFICE NUMBER</label>
            <input
              value={supervisorofficenumber}
              onChange={(e) => setSupervisorofficenumber(e.target.value)}
              type="text"
              className="rounded-md md:w-[37.4%] w-full text-black pl-2"
            ></input>

            <label className="font-semibold text-[19px]">OFFICE EMAIL</label>
            <input
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              type="text"
              className="rounded-md md:w-[37.4%] w-full text-black pl-2"
            ></input>
          </div>
          <div>
            <label className="font-semibold text-[19px] pr-5">
              OFFICE EMAIL
            </label>
            <input
              value={companyemail}
              onChange={(e) => setCompanyemail(e.target.value)}
              type="text"
              className="rounded-md md:w-[88.3%] w-full text-black pl-2"
            ></input>
          </div>

          {formError && (
            <p className="text-red-500 mb-1 font-bold w-[25%] text-center">
              {formError}
            </p>
          )}
          <button className="bg-[#47b8fd] w-[99.4%] h-[40px] rounded-md font-bold hover:bg-blue-400 mb-10 mt-7">
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;
