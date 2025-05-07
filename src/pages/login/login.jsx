import { useNavigate } from "react-router-dom";
import classnames from "classnames";
import { CircularProgress } from "@mui/material";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import { Formik, Form, Field } from "formik";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./styles.scss";
import { setCookie, getCookie } from "../../utils/cookies";
import { brokers } from "../../constants";

const LoginPage = () => {
  const navigate = useNavigate();
  const [focusedField, setFocusedField] = useState("");
  const [OTPError, setOTPError] = useState("");
  const [showApiResponseHandlerModal, setShowApiResponseHandlerModal] =
    useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [errorsLocal, setErrorsLocal] = useState({});
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef([]);
  const timerRef = useRef(null);
  const errorTimerRef = useRef(null);

  const baseURL = "https://468693ab-f4ad-473d-a8c1-a8463dc74ecb.mock.pstmn.io";

  const sendOtp = async (phoneNumber) => {
    try {
      const response = await axios.post(`${baseURL}/send-otp`, { phoneNumber });
      if (response.data?.status === "success") {
        setIsOtpSent(response?.data?.otpId);
        setIsLoading(false);
        return response.data;
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error sending OTP:", error);
    }
  };

  const verifyOtp = async (otpId, otpCode) => {
    try {
      const response = await axios.post(`${baseURL}/verify-otp`, {
        otpId,
        otpCode,
      });
      setShowApiResponseHandlerModal(true);
      return response.data;
    } catch (error) {
      console.error("Error verifying OTP:", error);
    }
  };

  const handleOtpChange = (e, index) => {
    if (showApiResponseHandlerModal) return;
    setOTPError("");
    const value = e.target.value?.trim();
    if (isNaN(value)) {
      inputRefs.current[index].value = "";
      return;
    }
    if (value.length === 1 && index < inputRefs.current.length - 1) {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        inputRefs.current[index + 1]?.focus();
      }, 10);
    }
    setOtpValue((preValue) => preValue + value);
  };

  const handleKeyDown = (e, index) => {
    if (showApiResponseHandlerModal) return;
    if (!e.target.value && e.key === "Backspace") {
      setOtpValue((preValue) => preValue.slice(0, -1));
      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };
  useEffect(() => {
    const userDetails = getCookie("userDetails");
    if (userDetails) {
      navigate("/dashboard");
    }
    return () => {
      setShowApiResponseHandlerModal(false);
      setOTPError("");
      clearTimeout(timerRef);
    };
  }, []);

  useEffect(() => {
    if (otpValue.length && otpValue.length === inputRefs.current.length) {
      verifyOtp(isOtpSent, otpValue);
    }
  }, [otpValue]);

  useEffect(() => {
    if (isOtpSent || OTPError) {
      inputRefs?.current[0]?.focus();
    }
    if (OTPError) {
      setOtpValue("");
      [...Array(6).fill(0)].map((_, index) => {
        if (
          inputRefs.current &&
          inputRefs.current[index] &&
          inputRefs.current[index].value
        )
          inputRefs.current[index].value = "";
        return;
      });
    }
  }, [isOtpSent, OTPError]);

  useEffect(() => {
    if (!isOtpSent && OTPError) {
      clearTimeout(errorTimerRef.current);
      errorTimerRef.current = setTimeout(() => {
        setOTPError("");
      }, 2000);
    }
    return () => {
      clearTimeout(errorTimerRef.current);
    };
  }, [isOtpSent, OTPError]);

  const handleErrorOTP = () => {
    setShowApiResponseHandlerModal(false);
    setOTPError("Internal Server Error. Please Try again later!");
    setIsOtpSent(false);
  };

  const handleSuccessOTP = () => {
    setCookie("userDetails", "Testing", 30);
    navigate("/dashboard");
  };

  const handleFailureOTP = () => {
    setShowApiResponseHandlerModal(false);
    setOTPError("Invalid OTP. Try again!");
  };

  const handleOTPStatus = (event) => {
    event.stopPropagation();
    switch (event.target.dataset.btnId) {
      case "success":
        handleSuccessOTP();
        break;
      case "failure":
        handleFailureOTP();
        break;
      case "server-error":
        handleErrorOTP();
        break;

      default:
        break;
    }
  };

  return (
    <div className="landingPageContainer">
      {showApiResponseHandlerModal ? (
        <div className="modalContainer">
          <div className="modalContent" onClick={handleOTPStatus}>
            <button data-btn-id={"success"}>Success</button>
            <button data-btn-id={"failure"}>Failure</button>
            <button data-btn-id={"server-error"}>Server Error</button>
          </div>
        </div>
      ) : null}
      <h1 className="header">
        <span className="green-color"> Welcome to TradeFlow &nbsp;</span>
      </h1>
      <Formik
        initialValues={{ phone: "" }}
        validate={(values) => {
          const errors = errorsLocal;
          if (focusedField === "phone") {
            if (
              values.phone &&
              values.phone.length === 10 &&
              !/^[6-9]\d{9}$/i.test(values.phone)
            ) {
              errors.phone = "Enter valid phone number";
            } else if (values.phone) {
              delete errors.phone;
            }
          }
          setErrorsLocal(errors);
          return errors;
        }}
        onSubmit={(values) => {
          setIsLoading(true);
          sendOtp(values.phone);
        }}
      >
        {({ values, errors, handleSubmit, setFieldValue, setFieldError }) => {
          const isBtnDisabled = values.phone?.length !== 10 || errors.phone;
          return (
            <Form className="formContainer">
              {!isOtpSent ? (
                <>
                  {OTPError ? (
                    <div className="!text-red-600 otpsubHeader">{OTPError}</div>
                  ) : null}
                  <div className="formHeader">Login to start trading</div>
                  <div className="fieldsContainer w-full">
                    <div className="relative">
                      <div class="relative w-full mb-9">
                        <Field
                          name="phone"
                          type="number"
                          id="floating_outlined"
                          value={values.phone}
                          onFocus={() => setFocusedField("phone")}
                          onChange={(e) => {
                            const { value } = e.target;
                            if (value.length <= 10) {
                              setFieldValue("phone", value);
                            }
                          }}
                          onBlur={() => {
                            if (
                              values.phone &&
                              !/^[6-9]\d{9}$/i.test(values.phone)
                            ) {
                              setFieldError(
                                "phone",
                                "Enter valid phone number"
                              );
                            }
                          }}
                          className={classnames(
                            "block px-2.5 pb-2.5 pt-4 text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 peer w-full",
                            errors.phone
                              ? "focus:border-red-600"
                              : "focus:border-blue-600"
                          )}
                          placeholder="Your Phone Number"
                        />
                        <label
                          for="floating_outlined"
                          className={classnames(
                            "absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1",
                            errors.phone
                              ? "text-red-600 top-2 -translate-y-4 scale-75"
                              : "peer-focus:text-blue-600"
                          )}
                        >
                          Your Phone Number
                        </label>
                      </div>
                      <div className="errorStyle">
                        {errors.phone && errors.phone}
                      </div>
                    </div>
                  </div>
                  <div className="fieldsContainer w-full">
                    <button
                      className={classnames(
                        "btnStyle mt-2 mb-4 w-full",
                        isBtnDisabled ? "!bg-gray-500" : ""
                      )}
                      type="button"
                      onClick={(e) => {
                        if (!isBtnDisabled) {
                          handleSubmit(e);
                        }
                      }}
                      disabled={isBtnDisabled}
                    >
                      Get OTP
                      {isLoading && (
                        <CircularProgress
                          className="btnLoader ml-1"
                          size={15}
                        />
                      )}
                    </button>
                    <div className="tncStyle">
                      By proceeding, I accept{" "}
                      <span className="text-blue-600">
                        T&Cs, Privacy Policy
                      </span>{" "}
                      and Authorize to obtain my KYC & bureau information.{" "}
                    </div>
                    <div className="item-center  mt-4">
                      <VerifiedUserOutlinedIcon className="verifiedIcon" />
                      <div className="ml-0.5 pbStyle">
                        Powered by Intel Kancharla
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <div className="formHeader">
                    Intel Kancharla has sent an OTP
                  </div>
                  <div className="otpsubHeader mb-8">
                    OTP sent to <span className="ml-0.5">{values.phone}</span>{" "}
                    (Hint: Type anything (only numbers though!))
                  </div>
                  <div class="flex space-x-2 justify-center mb-8">
                    {[...Array(6)].map((_, index) => (
                      <input
                        key={index}
                        type="text"
                        maxLength="1"
                        className="w-10 h-14 text-center border-1 border-gray-300 focus:border-blue-500 focus:outline-none rounded-md"
                        onChange={(e) => handleOtpChange(e, index)}
                        ref={(el) => (inputRefs.current[index] = el)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                      />
                    ))}
                  </div>
                  {OTPError ? (
                    <div className="!text-red-600 otpsubHeader">{OTPError}</div>
                  ) : null}
                </div>
              )}
            </Form>
          );
        }}
      </Formik>
      <div className="brokers-section">
        <div className="text">Supported Brokers</div>
        <div className="inner-content">
          {brokers.map(({ name, img }, brokerIndex) => {
            return (
              <div className="broker-box">
                <img src={img} alt={name} className="brokerImg" />
                <div>{name}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
