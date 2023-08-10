import React, { useState } from "react";
import supabase from "./iMonitorDBconfig";

export default async function Auth(
  token,
  user,
  beneChecker,
  studChecker,
  remove,
  profile,
  setUserName,
) {
  async function passTokenBene() {
    const { data: update } = await supabase
      .from("BeneAccount")
      .update({ accessToken: token })
      .eq("beneEmail", user.email)
      .select();

    window.localStorage.setItem("token", token);
    window.localStorage.setItem("profile", user.picture);
    profile(window.localStorage.getItem("profile"));
  }

  async function passTokenStud() {
    const { data: update } = await supabase
      .from("StudentInformation")
      .update({ accessToken: token })
      .eq("studemail", user.email)
      .select();

    window.localStorage.setItem("token", token);
    window.localStorage.setItem("profile", user.picture);
    profile(window.localStorage.getItem("profile"));
  }

  const { data: bene } = await supabase.from("BeneAccount").select();

  if (bene) {
    for (let index = 0; index < bene.length; index++) {
      if (user.email === bene[index].beneEmail) {
        if (bene[index].status === "active") {
          if (
            window.localStorage.getItem("token") === bene[index].accessToken
          ) {
            beneChecker(true);
            remove();
            profile(user.picture);
            finalchecking(true);
            setUserName(bene[index].beneName)
            break;
          } else {
            passTokenBene();
            beneChecker(true);
            remove();
            finalchecking(true);
            setUserName(bene[index].beneName)
            break;
          }
        } else {
          alert("Your account is deactivated");
        }
      }
    }
  }

  const { data: stud } = await supabase.from("StudentInformation").select();
  if (stud) {
    for (let index = 0; index < stud.length; index++) {
      if (user.email === stud[index].studemail) {
        if (window.localStorage.getItem("token") === stud[index].accessToken) {
          studChecker(true);
          remove();
          profile(user.picture);
          finalchecking(true);
          break;
        } else {
          passTokenStud();
          studChecker(true);
          remove();
          finalchecking(true);
          break;
        }
      }
    }
  }

  async function finalchecking(check) {
    if (check) {
      console.log("Registered");
    } else {
      console.log("Not Registered");
    }
  }
}
