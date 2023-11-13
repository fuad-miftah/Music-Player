import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/sidebar.tsx";

const Shared = () => {
  const location = useLocation();
  const { pathname } = location;
  const routesToHideHeaderFooter = ["/login", "/signup"];
  const shouldHideHeaderFooter = routesToHideHeaderFooter.includes(pathname);

  return (
    <>
      {!shouldHideHeaderFooter && <Sidebar />}
      <Outlet />
    </>
  );
};

export default Shared;
