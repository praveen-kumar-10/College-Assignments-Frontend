import React from "react";
import Sidebar from "components/sidebar/Sidebar";
import Loader from "components/ui/loader/Loader";
import { useSelector } from "react-redux";

const Layout = ({ children }) => {
  const isLoading = useSelector((state) => state?.ui?.isLoading);
  console.log("ISLOADING", isLoading);
  return (
    <div className="app">
      <Loader isLoading={isLoading} />
      <Sidebar />
      {children}
    </div>
  );
};

export default Layout;
