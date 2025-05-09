import { instruments } from "../pages/dashboard/data";

export const getUserProfile = (userId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          id: userId,
          name: "Kancharla Intel",
          email: "tejaintel07@gmail.com",
          role: "user",
        },
      });
    }, 1000);
  });
};

export const getInstruments = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: instruments,
      });
    }, 1000);
  });
};
