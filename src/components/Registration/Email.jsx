import React, { useEffect, useState } from "react";
import emailjs from "emailjs-com";

function Email() {
  const [test1, setTest1] = useState("albertbaisa@gmail.com");
  const [test2, setTest2] = useState("Seeker Company");
  const [test3, setTest3] = useState("Hello World");
  const greetings = "you have been accepted in the inter view";
  const [date, setDate] = useState();

  useEffect(() => {
    generatecode()
  },[])
  
  function sendemail(e) {
    if (code) {
      emailjs.send(
        "service_i2ayjte",
        "template_x1e70ha",
        {
          email: test1,
          company: test2,
          content: test3,
          code: code,
        },
        "h-OoIjsbxe3AZOctT"
      );
    }
  }

  const [code, setCode] = useState("");
  const [code1, setCode1] = useState("");
  const [inputCode, setInputCode] = useState("");

  function send() {
    // Generate a random number between min and max (inclusive)
    generatecode();
  }

  function generatecode() {
    const min = 1000; // The minimum 4-digit number (1000)
    const max = 9999; // The maximum 4-digit number (9999)

    let a = Math.floor(Math.random() * (max - min + 1)) + min;
    setCode(a.toString());
  }

  function check() {
    console.log(code + " " + inputCode);
    if (code === inputCode) {
      console.log(true);
    } else {
      console.log("wrong pin");
    }
  }

  return (
    <div className=" h-screen ">

    </div>
  );
}

export default Email;
