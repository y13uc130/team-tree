/**
 * Requirements:
 * 1. Login screen with mobile dummy otp option (with an icon besides that -> when click it,
 *    it shows 200/400/500 option to choose and show its behaviour)
 *    and icons below showing all supported brokers.
 * 2. Add Main screen with nav bar containing (holdings, orderbook, positions) with main section with list of stock symbols
 * 3. on click of each stock, show tickertape graph (optional) with buy/sell buttons
 * 4. on main screen, one draggable FAB (Floating action button) to be there when clicked, top one to be chosen from symbols.
 * 5. optional - make it draggable to each symbol with a button fitting placeholder, when we place there, it should open buy/sell for that stock
 * 6. upon clicking holding/orderbook/positions - show history, existing stocks in holding/positions and unrealised/realised P&L.
 * 7. Mock API responses in code to simulate real data for point 6.
 * 8. ErrorBoundary
 * 9. Unit test coverage => (to be explored)
 *
 */

import React from "react";
import "./tailwind.css";
import "./styles.scss";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/dashboard/Dashboard";
import LoginPage from "./pages/login/login";
import Holdings from "./pages/holdings/Holdings";

const App = () => {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />}>
            <Route path="holdings" element={<Holdings />} />
            <Route path="orderbook" element={<div>orderbook</div>} />
            <Route path="positions" element={<div>positions</div>} />
          </Route>
          <Route path="/" element={<LoginPage />} />
          <Route path="*" element={<h1>404 - Page Not Found</h1>} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
