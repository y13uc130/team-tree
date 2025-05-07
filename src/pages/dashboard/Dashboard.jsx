import React, { useEffect } from "react";
import { fetchUserProfile } from "../../store/user/userThunks";
import { resetUser } from "../../store/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import "./styles.scss";
import { getCookie } from "../../utils/cookies";
import { Outlet, useNavigate } from "react-router";

const tabs = ["Holdings", "Orderbook", "Positions"];

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { profile, loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    const userDetails = getCookie("userDetails");
    if (!userDetails) {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    dispatch(fetchUserProfile("user-123")).then((res) => {
      console.log("res", res);
    });

    return () => {
      dispatch(resetUser());
    };
  }, []);

  const handleTabPress = (event) => {
    event.stopPropagation();
    navigate(`/dashboard/${event.target.dataset.tabId?.toLowerCase()}`);
  };

  if (loading) return <p>Loading user...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  if (!profile) return <p>No user data found.</p>;

  return (
    <div className="container">
      <div className="navBar">
        <div className="home-button">Home</div>
        <div className="tabs" onClick={handleTabPress}>
          {tabs.map((tab, tabIndex) => {
            return (
              <div data-tab-id={tab} className="tab-section">
                {tab}
              </div>
            );
          })}
        </div>
      </div>
      <div className="dashboard-container">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
