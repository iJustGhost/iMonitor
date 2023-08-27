import Registration from "../components/Registration/Registration";
import Monitoring from "../components/Monitoring/Monitoring";
import Company from "../components/Company/Company";
import MasterList from "../components/MasterList/MasterList";
import Message from "./Messaging/Message";
import CreateAnnouncement from "./Announcement/CreateAnnouncement";
import UpdateProfile from "./Monitoring/UpdateProfile";
import UploadLog from "./Announcement/UploadLog";
import ActivityLog from "../components/Announcement/ActivityLog";
import { Routes, Route } from "react-router-dom";


function BeneRoutes({beneemail}) {
  return (
    <div>
      <Routes>
        <Route path="/registration" element={<Registration />} />
        <Route path="/" element={<Monitoring />} />
        <Route path="/masterlist" element={<MasterList />} />
        <Route path="/company" element={<Company />} />
        <Route path="/message" element={<Message beneemail={beneemail} />} />
        <Route path="/createannouncement" element={<CreateAnnouncement />} />
        <Route path="/uploadlog1" element={<UploadLog />} />
        <Route path="/activitylog" element={<ActivityLog />} />
        <Route path="/:id" element={<UpdateProfile />} />
      </Routes>
    </div>
  );
}

export default BeneRoutes;
