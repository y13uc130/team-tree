import React, { useEffect, useState } from "react";
import classnames from "classnames";
import { fetchUserProfile } from "../../store/user/userThunks";
import { resetUser } from "../../store/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import "./styles.scss";
import { instruments } from "./data.js";
import { getCookie } from "../../utils/cookies";
import { Outlet, useLocation, useNavigate } from "react-router";
import Instruments from "../../components/instruments/Instruments";
import TradeModal from "../../components/tradeModal/TradeModal.jsx";
import { setShowTradeModal } from "../../store/trade/tradeSlice.js";

const tabs = ["dashboard", "Holdings", "Orderbook", "Positions"];

const Dashboard = () => {
  const [selectedTab, setSelectedTab] = useState(tabs[0]);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const { profile, loading, error } = useSelector((state) => state.user);
  const { showTradeModal, selectedTrade } = useSelector((state) => state.trade);

  useEffect(() => {
    const userDetails = getCookie("userDetails");
    if (!userDetails) {
      navigate("/");
    }
  }, []);

  useEffect(() => {}, [showTradeModal, selectedTrade]);

  useEffect(() => {
    const pathname = location.pathname.replace(/\/dashboard\//g, "");
    const tab = pathname.charAt(0).toUpperCase() + pathname.slice(1);
    setSelectedTab(tab);
  }, []);

  useEffect(() => {
    dispatch(fetchUserProfile("user-123"));
    return () => {
      dispatch(resetUser());
    };
  }, []);

  const handleTabPress = (event) => {
    const selectedTabVal = event.target.dataset.tabId;
    event.stopPropagation();
    if (!!selectedTabVal) {
      setSelectedTab(selectedTabVal);
      if (selectedTabVal.toLowerCase() === "dashboard") {
        navigate(`/dashboard`);
        return;
      }
      navigate(`/dashboard/${selectedTabVal?.toLowerCase()}`);
    }
  };

  const handleTradeModalClose = () => {
    dispatch(setShowTradeModal({ active: false }));
  };

  if (loading) return <p>Loading user...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  if (!profile) return <p>No user data found.</p>;

  return (
    <div className="container">
      {showTradeModal ? (
        <TradeModal
          onClose={handleTradeModalClose}
          selectedTrade={selectedTrade}
        />
      ) : null}
      <div className="navBar">
        <div className="inner">
          <div className="home-button">TradeFlow</div>
          <div className="tabs" onClick={handleTabPress}>
            {tabs.map((tab, tabIndex) => {
              return (
                <div
                  key={tabIndex}
                  data-tab-id={tab}
                  className={classnames("tab-section", {
                    active: selectedTab === tab,
                  })}
                >
                  {tab}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="dashboard-container">
        <div className="left-container">
          <Instruments instruments={instruments.items} />
        </div>
        <div className="right-container">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
