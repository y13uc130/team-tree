import "./tailwind.css";
import "./styles.scss";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import EmployeeDashboard from "./pages/employeeDashboard/EmployeeDashboard";

const App = () => {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path="*" element={<EmployeeDashboard />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
