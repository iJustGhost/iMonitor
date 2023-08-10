import React from "react";
import { Routes, Route } from "react-router-dom";
import BeneficiaryCreator from "./AdminPages/BeneficiaryCreator";
const AdminRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<BeneficiaryCreator/>} />

      </Routes>
    </div>
  );
};

export default AdminRoutes;
