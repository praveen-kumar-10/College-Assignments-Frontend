import axios from "axios";
import { toast } from "react-toastify";

export const baseURL = "http://localhost:8000/api";

const API = axios.create({
  baseURL,
  headers: {},
});

API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const status = error?.response ? error?.response?.status : null;

    if (error?.response?.data?.success === "0") {
      toast.error(error?.response?.data?.message);
    }

    if (error?.response?.data?.success === "3") {
      localStorage.clear();

      window.location.href = "/login";

      Promise.reject(
        (error?.response && error?.response) || "Something went wrong"
      );
    }


    if (status === 500) {
      // localStorage.clear();
      // store.dispatch({type: "USER_LOGOUT"})
      // store.dispatch(apiSlice.util.resetApiState());
      // store.dispatch(authSlice.util.resetApiState());
      window.location.href = "/access-denied";
    }

    // Promise.reject(
    //   (error?.response && error?.response) || "Something went wrong"
    // );

    return error?.response ? error?.response : "Something went wrong";
  }
);

export default API;
