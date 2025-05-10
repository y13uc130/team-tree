import React from "react";
import "./tailwind.css";
import "./styles.scss";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/dashboard/Dashboard";
import LoginPage from "./pages/login/login";
import Holdings from "./pages/holdings/Holdings";
import Orderbook from "./components/orderbook/Orderbook";
import Positions from "./components/positions/Positions";

const App = () => {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />}>
            <Route path="holdings" element={<Holdings />} />
            <Route path="orderbook" element={<Orderbook />} />
            <Route path="positions" element={<Positions />} />
          </Route>
          <Route path="/" element={<LoginPage />} />
          <Route path="*" element={<h1>404 - Page Not Found</h1>} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
