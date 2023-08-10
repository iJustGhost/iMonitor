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

import { Test, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Navbar() {
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

  // Easter Egg
  const [apple, setApple] = useState(false);

  //open profile
  const [openprofile, setOpenProfile] = useState(false);

  // User Name
  const [username, setUserName] = useState();

  useEffect(() => {
    if (window.localStorage.getItem("token")) {
      checkToken();
    } else {
      GoogleAccountGetter();
    }


    remove()
    setStudentChecker(true) 
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
  }, [GoogleAccountGetter, checkToken]);

  // google account auth
  async function GoogleAccountGetter() {
    /* global google */
    try {
      google.accounts.id.initialize({
        client_id:
          "860934734518-i9sst4ljo2qheba5cfkj2db427edl1id.apps.googleusercontent.com",
        callback: handleCallbackResponse,
      });

      google.accounts.id.renderButton(document.getElementById("loginUI"), {
        theme: "outline",
        size: "large",
      });
    } catch (error) {}
  }

  // Authentication if account is active
  async function handleCallbackResponse(response) {
    var userToken = jwt_decode(response.credential);
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
      setUserName
    );
  }

  //token checker
  async function checkToken() {
    const { data: bene } = await supabase.from("BeneAccount").select();
    if (bene) {
      for (let index = 0; index < bene.length; index++) {
        if (window.localStorage.getItem("token") === bene[index].accessToken) {
          getdataUserBene(bene[index].accessToken);
          return;
        }
      }
    }

    const { data: stud } = await supabase.from("StudentInformation").select();
    if (stud) {
      for (let index = 0; index < stud.length; index++) {
        if (window.localStorage.getItem("token") === stud[index].accessToken) {
          getdataUserStud(stud[index].accessToken);
          return;
        }
      }
    }

    let { data: admin1 } = await supabase.from("AdminAccount").select();

    for (let index = 0; index < admin1.length; index++) {
      if (window.localStorage.getItem("token") === admin1[index].accessToken) {
        setAdminVerify(true);
        closelogins();
        remove();
        return;
      }
    }

    window.localStorage.removeItem("token");
    window.localStorage.removeItem("profile");
    handleSignOut();
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
    document.getElementById("loginUI").hidden = true;
    document.getElementById("loginbutton").hidden = true;
    document.getElementById("welcome").hidden = true;
  }

  function handleSignOut() {
    document.getElementById("loginUI").hidden = false;
    document.getElementById("loginbutton").hidden = false;
    document.getElementById("welcome").hidden = false;
    setUser({});
    setBeneChecker(false);
    setStudentChecker(false);
    setAdminUsername("");
    setAdminPassword("");
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("profile");
    setEmail();
    navigate("/");
    window.location.reload();
  }

  // user Authentication
  async function handleAdminLogin() {
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
  }

  // EasterEGG
  function handlechange() {
    setApple(!apple);
  }

  return (
    <>
      <div className="flex flex-col absolute">
        <header className="inset-auto w-screen top-0 bg-black h-[60px] ">
          <div className=" flex justify-between items-center bg-[#0074B7] w-[100%] h-[60px]">
            {/* HEADER BAR*/}
            {/* Logo */}
            <div className="flex mt-2 ">
              {apple ? (
                <div>
                  <img
                    src={easteregg}
                    alt="STI LOGO"
                    className="  ml-3 md:h-8 h-9 w-14 "
                  />
                </div>
              ) : (
                <div>
                  <img
                    src={stilogo}
                    alt="STI LOGO"
                    className="  ml-3 md:h-8 h-9 w-14 "
                  />
                </div>
              )}

              <h1 className="ml-2 font-bold text-white text-3xl flex ">
                <p
                  onClick={() => handlechange()}
                  className="hover:cursor-pointer"
                >
                  i
                </p>
                Monitor
              </h1>
            </div>
            {/* Login */}
            <div className="mt-2 justify-end mr-[2%]">
              <button
                id="loginbutton"
                onClick={handleLogin}
                className="bg-[#2E8BC0] hover:bg-[#3fb9ff] font-semibold p-1 mb-2 rounded-md w-[100%] "
              >
                LOGIN
              </button>

              {/* Circle Profile */}
              {benechecker && (
                <div>
                  <div className="flex">
                    <div
                      onClick={() => setOpenProfile(!openprofile)}
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
                <div className="flex">
                  <div
                    onClick={() => setOpenProfile(!openprofile)}
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
                          {" "}
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
                <div>
                  <div
                    onClick={() => setOpenProfile(!openprofile)}
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
        {benechecker && (
          <div className="relative left-0">
            <BeneNavbar email={email} />
          </div>
        )}
        {studentchecker && (
          <div className="relative left-0">
            <StudentNavbar />
          </div>
        )}
        {adminverify && <AdminPage />}

        {/* Navbar end */}
        <div
          className={`${
            openLogin ? "hidden" : "visible"
          } fixed place-content-center justify-center`}
        >
          <div className="fixed inset-0 bg-black bg-opacity-10 backdrop-blur-sm flex justify-center items-center">
            <div
              className={`bg-gray-300   md:w-[20%] w-[70%] rounded-md text-center mb-[20%]`}
            >
              <div className="w-full bg-blue-900 p-2 rounded-t-md flex justify-between">
                <p className="text-white font-bold">LOGIN</p>
                <a
                  onClick={closelogins}
                  className="text-white font-bold w-5 hover:cursor-pointer hover:text-red-600"
                >
                  X
                </a>
              </div>
              <button
                id="loginUI"
                className={`${openadmin ? "hidden" : ""} mt-10 mb-10 `}
              ></button>
              <div
                onClick={handleopenadmin}
                className="w-full bg-blue-900 hover:bg-blue-500 hover:cursor-pointer p-2 rounded-b-md flex justify-between"
              >
                <p className="text-white font-base text-sm">Login as Admin</p>
              </div>
              <div
                className={`${
                  openadmin ? "" : " hidden translate-x-0 "
                }bg-white h-[40%] md:w-[20%] w-[70%] md:-mt-0 -mt-48 absolute`}
              >
                <p
                  onClick={handleopenadmin1}
                  className="text-white font-base text-sm bg-blue-900 -mt-9 hover:bg-blue-500 p-2 bg-text-center w-full hover:cursor-pointer rounded-b-md "
                >
                  Close Login Admin
                </p>

                <div className="flex flex-col text-start">
                  <p className=" font-semibold mt-3 ml-5">Username</p>
                  <input
                    type="text"
                    onChange={(e) => setAdminUsername(e.target.value)}
                    className="bg-gray-300 mt-3 ml-5 mr-5 rounded-md p-2"
                  />
                  <p className=" font-semibold mt-3 ml-5">Password</p>
                  <input
                    type="password"
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="bg-gray-300 mt-3 ml-5 mr-5 rounded-md p-2"
                  />
                  <div
                    onClick={() => handleAdminLogin()}
                    className=" bg-blue-900 hover:bg-blue-500 hover:cursor-pointer text-center ml-5 mr-5 mt-4 p-3 rounded-md font-semibold text-white "
                  >
                    LOGIN
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="welcome" className="text-center">
          <p className="mt-[15%] font-bold text-white text-[64px] font-mono">
            WELCOME to iMonitor
          </p>
        </div>
        <main className="flex-grow md:pl-52 bg-[#3ea6e6] bg-opacity-20 h-screen abosolute ">
          {/* content here */}

          {benechecker && <BeneRoutes beneemail={email} />}
          {studentchecker && <StudentRoutes studemail={email} />}
          {adminverify && <AdminRoutes studemail={email} />}
        </main>

        <footer className="fixed w-screen bottom-0">
          <Footer />
        </footer>
      </div>

      <ToastContainer />
    </>
  );
}

export default Navbar;
