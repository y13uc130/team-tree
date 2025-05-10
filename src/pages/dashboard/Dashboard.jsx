import React, { useCallback, useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";
import classnames from "classnames";
import { fetchUserProfile } from "../../store/user/userThunks";
import { resetUser } from "../../store/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import "./styles.scss";
import { getCookie } from "../../utils/cookies";
import { Outlet, useLocation, useNavigate } from "react-router";
import Instruments from "../../components/instruments/Instruments";
import TradeModal from "../../components/tradeModal/TradeModal.jsx";
import { setShowTradeModal } from "../../store/trade/tradeSlice.js";
import { useOnClickOutside } from "../../hooks/useClickOutside.js";

const tabs = ["Holdings", "Orderbook", "Positions"];

const Dashboard = () => {
  const draggableCTARef = useRef(null);
  const [selectedTab, setSelectedTab] = useState(tabs[0]);
  const [showBuySell, setShowBuySell] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const { profile, loading, error } = useSelector((state) => state.user);
  const { instruments = [] } = useSelector((state) => state.instruments);
  const { showTradeModal, selectedTrade } = useSelector((state) => state.trade);

  useOnClickOutside({
    refs: [draggableCTARef],
    handler: () => {
      setShowBuySell(false);
    },
    enabled: true,
    detectEscape: true,
  });

  useEffect(() => {
    const userDetails = getCookie("userDetails");
    if (!userDetails) {
      navigate("/");
    }
  }, []);

  useEffect(() => {}, [showTradeModal, selectedTrade]);

  useEffect(() => {
    const pathname = location.pathname.replace(
      /^\/dashboard\/?|\/dashboard$/g,
      ""
    );
    if (!pathname) {
      navigate(`/dashboard/${selectedTab?.toLowerCase()}`);
    } else {
      const tab = pathname.charAt(0).toUpperCase() + pathname.slice(1);
      setSelectedTab(tab);
    }
  }, []);

  useEffect(() => {
    dispatch(fetchUserProfile("user-123"));
    return () => {
      dispatch(resetUser());
    };
  }, []);

  const handleTabPress = useCallback((event) => {
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
  }, []);

  const handleTradeModalClose = () => {
    dispatch(setShowTradeModal({ active: false }));
  };

  const handleDashboardClick = useCallback(() => {
    navigate(`/dashboard`);
    setSelectedTab("");
  }, []);

  const handleDraggableCTAClick = () => {
    setShowBuySell(!showBuySell);
  };
  const handleBuySellClick = useCallback(
    (btnId) => {
      setShowBuySell(false);
      if (!instruments.length) return;
      const firstInstrument = instruments?.[0];
      dispatch(
        setShowTradeModal({
          active: true,
          data: {
            symbol: firstInstrument?.tradingsymbol,
            info: firstInstrument,
            btnId,
          },
        })
      );
    },
    [instruments]
  );

  const Tabs = () => {
    return (
      <>
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
      </>
    );
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
          isOpen={showTradeModal}
        />
      ) : null}
      <div className="navBar">
        <div className="inner">
          <div onClick={handleDashboardClick} className="home-button">
            TradeFlow
          </div>
          <div className="tabs" onClick={handleTabPress}>
            <Tabs />
          </div>
        </div>
      </div>
      <div className="bottom-navbar">
        <div className="inner">
          <div className="tabs" onClick={handleTabPress}>
            <Tabs />
          </div>
        </div>
      </div>
      <div className="dashboard-container">
        <div className={classnames("left-container", selectedTab && "desktop")}>
          <Instruments />
        </div>
        <div className="right-container">
          <Outlet />
        </div>
        <Draggable nodeRef={draggableCTARef}>
          <div
            onClick={handleDraggableCTAClick}
            ref={draggableCTARef}
            className="draggable-fab"
          >
            <div>Buy/Sell</div>
            {showBuySell ? (
              <>
                <div className="buy-sell">
                  <button
                    onClick={() => handleBuySellClick("buy")}
                    className="buy"
                  >
                    B
                  </button>
                  <button
                    onClick={() => handleBuySellClick("sell")}
                    className="sell"
                  >
                    S
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </Draggable>
      </div>
    </div>
  );
};

export default Dashboard;
