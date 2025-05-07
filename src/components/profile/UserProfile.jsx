import React, { useEffect } from "react";
import { fetchUserProfile } from "../../store/user/userThunks";
import { resetUser } from "../../store/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import "./styles.scss";
import { getCookie } from "../../utils/cookies";
import { useNavigate } from "react-router";

const UserProfile = () => {
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

  if (loading) return <p>Loading user...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  if (!profile) return <p>No user data found.</p>;

  return (
    <div className="container">
      <p>{profile.name}</p>
      <p>{profile.email}</p>
    </div>
  );
};

export default UserProfile;
