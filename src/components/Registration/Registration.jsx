import React, { useState, useRef, useEffect } from "react";
import RegisSuccessModal from "./RegisSuccessModal";
import options from "../programoptions.json";
import supabase from "../iMonitorDBconfig";

import AOS from "aos";
import "aos/dist/aos.css";

function Registration() {
  useEffect(() => {
    fetchcompanyinfo();
    AOS.init();
  }, []);

  //MODAL VAR
  const [showmodalregis, setShowModalRegis] = useState(false);
  const handleclosemodalregis = () => setShowModalRegis(false);

  //STUD INFO VAR
  const [studfname, setStudFName] = useState("");
  const [studlname, setStudLName] = useState("");
  const [studmname, setStudMName] = useState("");
  const [studprogram, setStudProgram] = useState("");
  const [studemail, setStudemail] = useState("");
  const [ojtstart, setOjtStart] = useState("");
  const [ojtend, setOjtEnd] = useState("");
  const [studsection, setStudSection] = useState("");
  const [studremarks, setStudRemarks] = useState("");

  // //Company name var
  const [value, setValue] = useState("");
  const [companyinfos, setStudCompanyInfos] = useState("");

  const [companyaddress, setCompanyaddress] = useState("");
  const [supervisorname, setSupervisorname] = useState("");
  const [supervisorcontactnumber, setSupervisorcontactnumber] = useState("");
  const [supervisorofficenumber, setSupervisorofficenumber] = useState("");
  const [designation, setDesignation] = useState("");
  const [companyemail, setCompanyemail] = useState("");

  //ERROR VAR
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  //Close Company Search
  const [comsearch, setComSearch] = useState("");

  function clearfield() {
    //information
    setStudFName("");
    setStudLName("");
    setStudMName("");
    setStudProgram("");
    setStudSection("");
    setOjtStart("");
    setOjtEnd("");
    setStudemail("");
    setStudRemarks("");
    //company
    setValue("");
    setCompanyaddress("");
    setSupervisorname("");
    setSupervisorcontactnumber("");
    setSupervisorofficenumber("");
    setDesignation("");
    setCompanyemail("");
  }

  const FilterCompany = async () => {
    let a;
    let b;
    var c;
    const { data, error } = await supabase.from("CompanyTable").select();

    for (let index = 0; index < data.length; index++) {
      if (value === data[index].companyname) {
        a = data[index].id;
        b = parseInt(data[index].companyOJT) + 1;
        c = data[index].companyname;

        const { data1, error } = await supabase
          .from("CompanyTable")
          .update({ companyOJT: b })
          .eq("id", a);
        console.log(a + " | " + b);
        break;
      }
    }

    if (c !== value) {
      const { data1, error } = await supabase.from("CompanyTable").insert({
        companyname: value,
        companyaddress: companyaddress,
        supervisorname: supervisorname,
        supervisorcontactnumber: supervisorcontactnumber,
        supervisorofficenumber: supervisorofficenumber,
        companydesignation: designation,
        companyemail: companyemail,
        companyOJT: 1,
      });
    }
  };

  // INSERT FUNCTION
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !studfname ||
      !studlname ||
      !studprogram ||
      !ojtstart ||
      !ojtend ||
      !studsection ||
      !value ||
      !companyaddress ||
      !supervisorname ||
      !supervisorcontactnumber ||
      !supervisorofficenumber ||
      !designation ||
      !companyemail
    ) {
      setFormError("Please Fill All FIELDS CORRECTLY!");
      return;
    }

    if (studmname === null) {
      studmname = "";
    }

    if (studremarks === null) {
      studremarks = null;
    }

    var studfullname = studfname + " " + studmname + " " + studlname;
    var program = studprogram.toString();
    let studmaxduration;
    let studprogress = 0;

    if (program === "(BSIT)Bachelor of Science in Information Technology") {
      studmaxduration = 486;
    }
    if (
      program === "(BSAIS)Bachelor of Science in Accounting Information Systems"
    ) {
      studmaxduration = 600;
    }
    if (program === "(BSHM)Bachelor of Science in Hospitality Management") {
      studmaxduration = 600;
    }
    if (program === "(BSTM)Bachelor of Science in Tourism Management") {
      studmaxduration = 600;
    }
    FilterCompany();

    const { data, error } = await supabase.from("StudentInformation").insert([
      {
        studname: studfullname,
        studprogram: program,
        studemail: studemail,
        ojtstart: ojtstart,
        ojtend: ojtend,
        studsection: studsection,
        studremarks: studremarks,
        companyname: value,
        companyaddress: companyaddress,
        supervisorname: supervisorname,
        supervisorcontactnumber: supervisorcontactnumber,
        supervisorofficenumber: supervisorofficenumber,
        companydesignation: designation,
        companyemail: companyemail,
        studmaxprogress: studmaxduration,
        studprogress: studprogress,
      },
    ]);

    if (error) {
      console.log(error);
      setFormSuccess(null);
    }
    if (data) {
      console.log(data);
      setFormError(null);
    }
    setShowModalRegis(true);
    clearfield();
  };

  const [isOpen, setIsOpen] = useState(false);

  let menuRef = useRef();
  useEffect(() => {
    let handler = (event) => {
      if (!menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });

  const fetchcompanyinfo = async () => {
    const { data, error } = await supabase.from("CompanyTable").select();
    if (error) {
      console.log(error);
    }
    if (data) {
      setStudCompanyInfos(data);
    }
  };

  //filter comapanyname
  const onChange = (event) => {
    setValue(event.target.value);
  };

  const onSearch = (searchTerm) => {
    setValue(searchTerm);
  };

  return (
    <div className="overflow-hidden md:mt-[0%] mt-[5%]">
      <div
        className="pt-8 md:p-5 p-1 text-white "
        data-aos="fade-down"
        data-aos-duration="1000"
      >
        <header className="font-bold md:text-4xl text-3xl mb-4 pl-1">
          REGISTRATION
        </header>
        {/*First line*/}
        <form
          onSubmit={handleSubmit}
          className="grid  w-[100%] bg-black bg-opacity-[1%] p-1 overflow-y-auto  md:h-[540px] h-[700px]"
          data-aos="fade-down"
          data-aos-duration="1000"
        >
          {/* Line 1 */}
          <div className="w-[100%] md:flex grid  gap-1 h-fit">
            <label className="font-semibold text-[20px] md:w-[10%] w-[100%]">
              FULL NAME:
            </label>
            <div className=" md:flex flex-grow grid gap-y-5 gap-2 w-fill">
              <input
                type="text"
                className="rounded-md p-1 w-[100%]  text-black"
                placeholder="First Name"
                id="studfname"
                value={studfname}
                onChange={(e) => setStudFName(e.target.value)}
              ></input>
              <input
                type="text"
                className="rounded-md p-1 w-[100%]] text-black"
                placeholder="Last Name"
                id="studlname"
                value={studlname}
                onChange={(e) => setStudLName(e.target.value)}
              ></input>
              <input
                type="text"
                className="rounded-md p-1 w-[100%]  text-black"
                placeholder="M.I"
                id="studmname"
                value={studmname}
                onChange={(e) => setStudMName(e.target.value)}
              ></input>
            </div>
          </div>
          {/* Line 2 */}
          <div className="grid md:flex grid-cols-1  gap-4 pt-4 w-[100%]">
            <label className="font-semibold text-[19px]">PROGRAM</label>

            <div className="w-[100%]" ref={menuRef}>
              <select
                value={studprogram}
                className="w-full text-black rounded-md pl-2 text-justify p-1"
                onChange={(e) => setStudProgram(e.target.value)}
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
              className="rounded-md w-[100%] text-black pl-2"
            ></input>
          </div>
          {/* Line 3 */}
          <div className="grid md:flex grid-cols-1  gap-4 pt-4 w-[100%]">
            <label className="font-semibold text-[19px] w-[26%]">
              OJT STARTING
            </label>
            <input
              value={ojtstart}
              type="date"
              className="rounded-md md:w-[100%] min-w-[395px] h-[32px] text-black pl-2"
              onChange={(e) => setOjtStart(e.target.value)}
            />
            <label className="font-semibold text-[19px] w-[20%]">OJT END</label>
            <input
              value={ojtend}
              type="date"
              className="rounded-md md:w-[100%] min-w-[395px] text-black pl-2"
              onChange={(e) => setOjtEnd(e.target.value)}
            />
          </div>
          {/* Line 4 */}
          <div className="grid md:flex grid-cols-1 w-[100%]  gap-4 pt-4">
            <label className="font-semibold text-[19px] w-[10%]">
              O365 EMAIL
            </label>
            <input
              type="text"
              className="rounded-md p-1 w-[100%]  text-black"
              value={studemail}
              onChange={(e) => setStudemail(e.target.value)}
              placeholder="Email O365"
            ></input>
          </div>
          {/* Line 5 */}
          <div className="grid md:flex grid-cols-1  gap-4 pt-4 mb-10">
            <label className="font-semibold text-[19px] w-[6%]">REMARKS</label>
            <textarea
              rows="4"
              className="p-1 w-[100%] text-sm text-gray-900  rounded-md"
              placeholder="Write Remaks Here.."
              value={studremarks}
              onChange={(e) => setStudRemarks(e.target.value)}
            ></textarea>
          </div>
          {/* Line 6  */}
          <label className="font-semibold text-[25px] underline ">
            COMPANY INFROMATION
          </label>
          {/* Line 7 */}
          <div className="grid md:flex grid-cols-1  gap-4 pt-4">
            <label className="font-semibold text-[19px] w-[100%] md:w-[16%]">
              COMPANY NAME
            </label>

            <div className=" w-[100%] text-black ">
              <input
                value={value}
                onChange={onChange}
                type="text"
                className="rounded-md w-[100%] h-[32px] md:h-7 text-black pl-2"
              />

              {companyinfos && (
                <div className="  overflow-auto w-[100%]  rounded-md ">
                  {companyinfos
                    .filter((item) => {
                      const searchTerm = value.toLowerCase();
                      const companyname = item.companyname.toLowerCase();

                      return (
                        searchTerm &&
                        companyname.includes(searchTerm) &&
                        companyname !== searchTerm
                      );
                    })

                    .map((companyinfos) => (
                      <div
                        className=" w-[100%] p-1 bg-slate-200 "
                        key={companyinfos.id}
                      >
                        <p
                          onClick={() =>
                            onSearch(companyinfos.companyname) ||
                            setCompanyaddress(companyinfos.companyaddress) ||
                            setSupervisorname(companyinfos.supervisorname) ||
                            setSupervisorcontactnumber(
                              companyinfos.supervisorcontactnumber
                            ) ||
                            setSupervisorofficenumber(
                              companyinfos.supervisorofficenumber
                            ) ||
                            setDesignation(companyinfos.companydesignation) ||
                            setCompanyemail(companyinfos.companyemail)
                          }
                          className="hover:bg-blue-400  rounded-md w-[100%]"
                        >
                          {companyinfos.companyname}
                        </p>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
          {/* Line 8 */}

          <div className="grid md:flex grid-cols-1 w-[100%] gap-4 pt-4">
            <label className="font-semibold text-[19px] w-[45%] ">
              SUPERVISOR NAME
            </label>
            <input
              value={supervisorname}
              onChange={(e) => setSupervisorname(e.target.value)}
              type="text"
              className="rounded-md w-[100%] h-[32px]  text-black pl-2"
            ></input>

            <label className="font-semibold text-[19px]  w-[55%]">
              SUPERVISOR CONTACT #
            </label>
            <input
              value={supervisorcontactnumber}
              onChange={(e) => setSupervisorcontactnumber(e.target.value)}
              type="text"
              className="rounded-md w-[100%] h-[32px] text-black pl-2"
            ></input>
          </div>
          {/* Line 9 */}
          <div className="grid md:flex grid-cols-1 w-[100%] gap-4 pt-4 mb-3">
            <label className="font-semibold text-[19px] w-[35%]">
              OFFICE NUMBER
            </label>
            <input
              value={supervisorofficenumber}
              onChange={(e) => setSupervisorofficenumber(e.target.value)}
              type="text"
              className="rounded-md w-[100%] text-black pl-2 h-[32px]"
            ></input>

            <label className="font-semibold text-[19px] w-[30%]">
              OFFICE EMAIL
            </label>
            <input
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              type="text"
              className="rounded-md w-[100%] text-black pl-2 h-[32px]"
            ></input>
          </div>
          {/* Line 10 */}

          <div className="w-[100%] md:flex grid">
            <label className="font-semibold text-[19px] pr-5 w-[100%] md:w-[13%] mb-3 ">
              OFFICE EMAIL
            </label>
            <input
              value={companyemail}
              onChange={(e) => setCompanyemail(e.target.value)}
              type="text"
              className="rounded-md w-[100%]  h-[32px] text-black pl-2"
            ></input>
          </div>

          {formError && (
            <p className="text-red-500 mb-1 font-bold w-[25%] text-center">
              {formError}
            </p>
          )}
          {formSuccess && (
            <p className="text-green-500 mb-1 font-bold w-[25%] text-center">
              {formSuccess}
            </p>
          )}
          <button className=" bg-[#145DA0] w-[99.9%] h-[40px] rounded-md font-bold hover:bg-blue-400 mb-10 mt-2">
            REGISTER
          </button>
        </form>
      </div>
      <RegisSuccessModal
        onClose={handleclosemodalregis}
        visible={showmodalregis}
      />
    </div>
  );
}

export default Registration;
