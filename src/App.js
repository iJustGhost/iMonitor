import React, { useEffect, useState } from "react";
import DefaultNavBar from "./components/MainNavBar";
import Registration from "./components/Registration/Registration";
import Monitoring from "./components/Monitoring/Monitoring";
import MasterList from "./components/MasterList/MasterList";
import Company from "./components/Company/Company";
import Message from "./components/Messaging/Message";

function App() {
  return (
    <div className="App">
      <div className="bg-cover bg-center">
        <div className=" flex-col">
          <header className="fixed top-0"><DefaultNavBar /></header>
        </div>
      </div>
    </div>
  );
}

export default App;
