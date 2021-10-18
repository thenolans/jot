import "./Navigation.css";

import Logo from "components/Logo";
import NavLink from "components/NavLink";
import Urls from "constants/urls";

export default function Navigation() {
  return (
    <div className="c-navigation">
      <Logo />
      <div className="text-center space-y-4 hidden md:block">
        <NavLink to={Urls.routes["journal:list"]}>Journals</NavLink>
        <NavLink to={Urls.routes["notes:list"]}>Notes</NavLink>
        <NavLink to={Urls.routes["lists:list"]}>Lists</NavLink>
      </div>
      <div className="hidden md:block">Account</div>
    </div>
  );
}
