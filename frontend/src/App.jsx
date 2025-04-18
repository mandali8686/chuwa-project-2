import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./features/hr/Login";
import HiringManagement from "./features/hr/HiringManagement";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/hr/hiring" element={<HiringManagement />} />
      </Routes>
    </Router>
  );
}

export default App;
