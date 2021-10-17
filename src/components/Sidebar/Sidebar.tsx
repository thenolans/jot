import "./Sidebar.css";

import Logo from "components/Logo";
import NavLink from "components/NavLink";
import Urls from "constants/urls";

export default function Sidebar() {
  return (
    <div className="c-sidebar">
      <Logo />
      <div className="text-center space-y-4">
        <NavLink to={Urls.routes["journal:list"]}>Journals</NavLink>
        <NavLink to={Urls.routes["notes:list"]}>Notes</NavLink>
        <NavLink to={Urls.routes["lists:list"]}>Lists</NavLink>
      </div>
      <div>Account</div>
    </div>
  );
}
