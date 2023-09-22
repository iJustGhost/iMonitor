import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
//Picture
import stilogo from "./images/STILOGO4.png";
import easteregg from "./images/EasterEgg.png";
import profileDisplay from "./images/profile.png";
//Components
import jwt_decode from "jwt-decode";
import supabase from "./iMonitorDBconfig";
import Footer from "./Footer";
import BeneNavbar from "./BeneNavbar";
import BeneRoutes from "./BeneRoutes";
import StudentNavbar from "./StudentNavbar";
import StudentRoutes from "./StudentRoutes";
import AdminRoutes from "./AdminRoutes";
import AdminPage from "./AdminNavbar";
import Auth from "./Auth";
import { v4 as uuidv4 } from "uuid";
// Design Animation
import AOS from "aos";
import "aos/dist/aos.css";

import moment from "moment";

import { FcGoogle } from "react-icons/fc";
import { AiOutlineClose, AiOutlineGoogle } from "react-icons/ai";

import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

import { Test, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import iMonitorLogo from "../components/images/iMonitor.png";

function Navbar() {
  try {
  } catch (error) {}
  // AOS ANIMATION
  useEffect(() => {
    AOS.init();
  }, []);

  // Checker
  const [studentchecker, setStudentChecker] = useState(false);
  const [benechecker, setBeneChecker] = useState(false);

  //Header
  var [email, setEmail] = useState();
  const [profileheader, setProfileHeader] = useState();

  // Currently Logged In holder
  const [user, setUser] = useState({});

  // Login modal design
  const [openLogin, setOpenLogin] = useState(true);
  const handleLogin = () => setOpenLogin(false);
  const [openadmin, setOpenAdmin] = useState(false);
  const handleopenadmin = () => setOpenAdmin(true);
  const handleopenadmin1 = () => setOpenAdmin(false);

  // Admin checker
  const [adminusername, setAdminUsername] = useState();
  const [adminpassword, setAdminPassword] = useState();
  const [adminverify, setAdminVerify] = useState(false);

  // Nav
  const navigate = useNavigate();

  // Change LOGO
  const [apple, setApple] = useState(false);

  //open profile
  const [openprofile, setOpenProfile] = useState(false);

  // User Name
  const [username, setUserName] = useState();

  // Bene Data Holder
  const [dataBene, setDataBene] = useState();

  // Stud Data Holder
  const [dataStud, setDataStud] = useState([]);

  useEffect(() => {
    if (window.localStorage.getItem("token")) {
      checkToken();
      return;
    }

    supabase
      .channel("public-db-changes")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "StudentInformation",
        },
        (payload) => {
          checkToken();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "BeneAccount",
        },
        (payload) => {
          checkToken();
        }
      )
      .subscribe();
  }, [window.localStorage.getItem("token")]);

  const login = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        const data = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${response.access_token}`,
            },
          }
        );

        handleCallbackResponse(data.data);
      } catch (error) {}
    },
  });

  // Authentication if account is active
  async function handleCallbackResponse(response) {
    var userToken = response;
    setUser(userToken);
    setEmail(userToken.email);
    const generatedToken = uuidv4();
    Auth(
      generatedToken,
      userToken,
      setBeneChecker,
      setStudentChecker,
      remove,
      setProfileHeader,
      setUserName,
      greetings,
      studInfoGetter,
      beneInfoGetter
    );
  }

  async function greetings(check) {
    if (!check) {
      toast.error("Your account is not registered", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "light",
      });
    } else {
      activity();
    }
  }

  async function activity() {
    toast.success(`Welcome to iMonitor`, {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
      theme: "light",
    });
  }

  async function beneInfoGetter() {
    try {
      const { data: beneInfo } = await supabase
        .from("BeneAccount")
        .select()
        .eq("accessToken", window.localStorage.getItem("token"))
        .single();

      setDataBene(beneInfo);

      return;
    } catch (error) {}
  }

  async function studInfoGetter() {
    try {
      const { data: beneInfo } = await supabase
        .from("StudentInformation")
        .select()
        .eq("accessToken", window.localStorage.getItem("token"))
        .single();

      setDataStud(beneInfo);

      return;
    } catch (error) {}
  }

  //token checker
  async function checkToken() {
    try {
      const { data: bene } = await supabase.from("BeneAccount").select();
      if (bene) {
        for (let index = 0; index < bene.length; index++) {
          if (
            window.localStorage.getItem("token") === bene[index].accessToken
          ) {
            getdataUserBene(bene[index].accessToken);
            beneInfoGetter();
            return;
          }
        }
      }

      const { data: stud } = await supabase.from("StudentInformation").select();
      if (stud) {
        for (let index = 0; index < stud.length; index++) {
          if (
            window.localStorage.getItem("token") === stud[index].accessToken
          ) {
            getdataUserStud(stud[index].accessToken);

            return;
          }
        }
      }

      let { data: admin1 } = await supabase.from("AdminAccount").select();

      for (let index = 0; index < admin1.length; index++) {
        if (
          window.localStorage.getItem("token") === admin1[index].accessToken
        ) {
          setAdminVerify(true);
          closelogins();
          remove();
          return;
        }
      }

      window.localStorage.removeItem("token");
      window.localStorage.removeItem("profile");
      handleSignOut();
    } catch (error) {}
  }

  //data  getter if true
  async function getdataUserBene(token) {
    const { data: bene } = await supabase
      .from("BeneAccount")
      .select()
      .eq("accessToken", token)
      .single();
    if (bene) {
      setBeneChecker(true);
      setEmail(bene.beneEmail);
      setProfileHeader(window.localStorage.getItem("profile"));
      remove();
    }
  }

  //data  getter if true
  async function getdataUserStud(token) {
    const { data: stud } = await supabase
      .from("StudentInformation")
      .select()
      .eq("accessToken", token)
      .single();
    if (stud) {
      setStudentChecker(true);
      setEmail(stud.studemail);
      setProfileHeader(window.localStorage.getItem("profile"));
      remove();
    }
  }

  function closelogins() {
    setOpenLogin(true);
    setOpenAdmin(false);
  }

  function remove() {
    setOpenLogin(true);

    document.getElementById("loginbutton").hidden = true;
    document.getElementById("welcome").hidden = true;
  }

  async function handleSignOut() {
    try {
      var date = moment().format("LLL");
      const { data: studinfo } = await supabase
        .from("StudentInformation")
        .select()
        .eq("accessToken", window.localStorage.getItem("token"))
        .single();
   
        const { data: insertactlog } = await supabase
        .from("ActivityLog")
        .insert([{ name: studinfo.studname, button: "Sign Out", time: date }]);

      setUser({});
      setBeneChecker(false);
      setStudentChecker(false);
      setAdminUsername("");
      setAdminPassword("");
      document.getElementById("loginbutton").hidden = false;
      document.getElementById("welcome").hidden = false;
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("profile");
      setEmail();
      navigate("/");
      window.location.reload();
    } catch (error) {
      setUser({});
      setBeneChecker(false);
      setStudentChecker(false);
      setAdminUsername("");
      setAdminPassword("");
      document.getElementById("loginbutton").hidden = false;
      document.getElementById("welcome").hidden = false;
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("profile");
      setEmail();
      navigate("/");
      window.location.reload();
    }
  }

  // user Authentication
  async function handleAdminLogin() {
    try {
      const generatedToken = uuidv4();
      const fetchadmindata = async () => {
        let { data: admin } = await supabase.from("AdminAccount").select();

        if (admin) {
          for (let index = 0; index < admin.length; index++) {
            if (
              adminusername === admin[index].username &&
              adminpassword === admin[index].password
            ) {
              const { data } = await supabase
                .from("AdminAccount")
                .update({ accessToken: generatedToken })
                .eq("username", adminusername)
                .select();

              window.localStorage.setItem("token", generatedToken);
              setAdminVerify(true);
              closelogins();
              setAdminUsername("");
              setAdminPassword("");
              remove();
              break;
            }
          }
        }
      };
      fetchadmindata();
    } catch (error) {}
  }

  const divRef = useRef(null);

  const toggleDiv = () => {
    setOpenProfile(true);
  };

  const handleClickOutside = (event) => {
    if (divRef.current && !divRef.current.contains(event.target)) {
      setOpenProfile(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // EasterEGG
  function handlechange() {
    setApple(!apple);
  }

  return (
    <>
      <div className="flex flex-col absolute">
        {/* Navbar */}
        <header className="inset-auto w-screen top-0 bg-black h-[60px]">
          <div className=" flex justify-between items-center bg-[#274472] w-[100%] h-[60px] p-4">
            {/* Logo */}
            <div className="flex ">
              {apple ? (
                <div className="md:mt-0.5 mt-0">
                  <img
                    src={iMonitorLogo}
                    alt="IMONITOR LOGO"
                    className="   md:h-8 h-9 w-14 "
                  />
                </div>
              ) : (
                <div className="md:mt-0.5 mt-0">
                  <img
                    src={stilogo}
                    alt="STI LOGO"
                    className="   md:h-8 h-9 w-14 "
                  />
                </div>
              )}

              <h1 className="ml-2 font-bold text-white text-3xl flex cursor-default">
                <p onClick={() => handlechange()} className="hover:cursor-help">
                  i
                </p>
                Monitor
              </h1>
            </div>
            {/* Login */}
            <div className=" justify-end">
              <button
                id="loginbutton"
                onClick={handleLogin}
                className="text-white bg-[#5885AF] hover:bg-[#41729F] font-medium p-1 rounded-md w-[100%] mr-2 ml-2 "
              >
                LOGIN
              </button>

              {/* Circle Profile */}
              {benechecker && (
                <div>
                  <div ref={divRef} className="flex">
                    <div
                      onClick={() => toggleDiv()}
                      className="cursor-pointer w-[100%]"
                    >
                      <img
                        className="md:h-10 md:w-10 h-8 w-8 rounded-full text-sm hover:ring-2 hover:ring-white"
                        src={profileheader}
                      />
                      <div
                        className={`${
                          openprofile
                            ? "w-[120px] h-[50px] absolute  bg-white p-2 right-[1.5%] rounded-md mt-1.5 shadow-2xl"
                            : "hidden"
                        }`}
                      >
                        <div
                          onClick={(e) => handleSignOut(e)}
                          className=" p-1 rounded hover:bg-slate-300 hover:shadow-xl"
                        >
                          Sign Out
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {studentchecker && (
                <div ref={divRef} className="flex">
                  <div
                    onClick={() => toggleDiv()}
                    className="cursor-pointer w-[100%]"
                  >
                    <img
                      className="md:h-10 md:w-10 h-8 w-8 rounded-full text-sm hover:ring-2 hover:ring-white"
                      src={profileheader}
                    />
                    <div
                      className={`${
                        openprofile
                          ? "w-[120px] h-[90px] absolute  bg-white p-2 right-[1.5%] rounded-md mt-1.5 shadow-2xl"
                          : "hidden"
                      }`}
                    >
                      <Link to="/profile">
                        <p className=" p-1 rounded hover:bg-slate-300 hover:shadow-xl">
                          View Profile
                        </p>
                      </Link>
                      <div
                        onClick={(e) => handleSignOut(e)}
                        className=" p-1 rounded hover:bg-slate-300 hover:shadow-xl"
                      >
                        Sign Out
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {adminverify && (
                <div ref={divRef}>
                  <div
                    onClick={() => toggleDiv()}
                    className="cursor-pointer w-[100%]"
                  >
                    <img
                      className="md:h-10 md:w-10 h-8 w-8 rounded-full text-sm hover:ring-2 hover:ring-white"
                      src={profileDisplay}
                    />
                    <div
                      className={`${
                        openprofile
                          ? "w-[120px] h-[50px] absolute  bg-white p-2 right-[1.5%] rounded-md mt-1.5 shadow-2xl"
                          : "hidden"
                      }`}
                    >
                      <div
                        onClick={(e) => handleSignOut(e)}
                        className=" p-1 rounded hover:bg-slate-300 hover:shadow-xl"
                      >
                        Sign Out
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>
        {/* Navbar end */}

        {/* Login UI */}
        <div
          className={`${
            openLogin ? "hidden" : "visible"
          } fixed place-content-center justify-center`}
        >
          <div className="fixed inset-0 bg-black bg-opacity-10 backdrop-blur-sm flex justify-center items-center">
            <div
              className={`bg-gray-300   md:w-[20%] w-[70%] rounded-md text-center mb-[20%]`}
            >
              <div className="w-full bg-[#274472] p-2 rounded-t-md flex justify-between">
                <p className="text-white font-bold">LOGIN</p>
                <a
                  onClick={closelogins}
                  className="text-white font-bold text-[20px] w-5 hover:cursor-pointer hover:text-red-600"
                >
                  <AiOutlineClose />
                </a>
              </div>
              <div
                className={`${
                  openadmin
                    ? "hidden duration-300"
                    : "mt-10 mb-10 flex place-content-center duration-300"
                }`}
              >
                <div>
                  <button
                    onClick={login}
                    className={`flex bg-[#274472] p-2 rounded-md text-white font-sans font-semibold hover:bg-opacity-60 hover:text-slate-300`}
                  >
                    <FcGoogle className="text-[25px] mr-1" />
                    SIGN IN USING GOOGLE
                  </button>
                </div>
              </div>

              <div
                onClick={handleopenadmin}
                className="w-full bg-[#274472] hover:bg-slate-400 cursor-pointer first-letter:hover:cursor-pointer p-2 rounded-b-md flex justify-between"
              >
                <p className="text-white font-base text-sm">Login as Admin</p>
              </div>
              <div
                className={`${
                  openadmin ? "" : " hidden translate-x-0 duration-300"
                }bg-slate-200 h-[40%] md:w-[20%] w-[70%] md:-mt-0 -mt-48 absolute`}
              >
                <p
                  onClick={handleopenadmin1}
                  className="text-white font-base text-sm bg-[#274472] -mt-9 hover:bg-slate-400 p-2 bg-text-center w-full hover:cursor-pointer "
                >
                  Close Login Admin
                </p>

                <div className="flex flex-col text-start">
                  <p className=" font-semibold mt-3 ml-5">Username</p>
                  <input
                    type="text"
                    onChange={(e) => setAdminUsername(e.target.value)}
                    className="bg-gray-400 mt-3 ml-5 mr-5 rounded-md p-2"
                  />
                  <p className=" font-semibold mt-3 ml-5">Password</p>
                  <input
                    type="password"
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="bg-gray-400 mt-3 ml-5 mr-5 rounded-md p-2"
                  />
                  <div
                    onClick={() => handleAdminLogin()}
                    className=" bg-[#274472] hover:bg-blue-500 hover:cursor-pointer text-center ml-5 mr-5 mt-4 p-3 rounded-md font-semibold text-white "
                  >
                    LOGIN
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Login UI End*/}

        {/* Main Div */}

        <div id="welcome">
          <div className=" place-content-center flex font-bold cursor-default text-white text-[64px] font-mono text-center  md:mt-[15%] mt-[50%] ">
            WELCOME to iMonitor
          </div>
        </div>

        <div>
          {benechecker && (
            <div className="relative left-0">
              <BeneNavbar email={email} dataBene={dataBene} />
            </div>
          )}
          {studentchecker && (
            <div className="relative left-0">
              <StudentNavbar email={email} />
            </div>
          )}
          {/* {adminverify && <AdminPage />} */}
          <main className="flex-grow md:pl-52 bg-[#3ea6e6] bg-opacity-20 h-screen  ">
            {/* content here */}
            {benechecker && <BeneRoutes beneemail={email} data={dataBene} />}
            {studentchecker && <StudentRoutes studemail={email} />}
            {adminverify && (
              <main className="flex-grow -ml-52 h-screen  ">
                <AdminRoutes studemail={email} />
              </main>
            )}
          </main>
        </div>
        {/* Main Div End*/}

        {/* Footer */}
        <footer className="fixed w-screen bottom-0">
          <Footer />
        </footer>
        {/* Footer End*/}
      </div>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        limit={1}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default Navbar;
