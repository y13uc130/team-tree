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
import "./styles.scss";
import UserProfile from "./components/profile/UserProfile";

const App = () => {
  return (
    <div className="app">
      <h1>Multi Stock Broker Platform</h1>
      <div className="profile-container">
        <UserProfile />
      </div>
    </div>
  );
};

export default App;
