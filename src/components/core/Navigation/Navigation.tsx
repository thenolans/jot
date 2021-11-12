import "./Navigation.css";

import { Book, CheckSquare, Edit, User } from "components/core/Icon";
import Logo from "components/core/Logo";
import NavLink from "components/core/NavLink";
import Urls from "constants/urls";
import { Link } from "react-router-dom";

export default function Navigation() {
  return (
    <div className="c-navigation">
      <div className="flex items-center justify-between w-full md:justify-center">
        <Link to={Urls.routes["journal:list"]}>
          <Logo />
        </Link>
      </div>
      <div className="c-navigation__list">
        <NavLink icon={Book} to={Urls.routes["journal:list"]}>
          Journals
        </NavLink>
        <NavLink icon={Edit} to={Urls.routes["notes:list"]}>
          Notes
        </NavLink>
        <NavLink icon={CheckSquare} to={Urls.routes["lists:list"]}>
          Lists
        </NavLink>
      </div>
      <NavLink
        className="px-4 rounded-full md:px-8"
        icon={User}
        to={Urls.routes.account}
      >
        <span className="hidden md:block">Account</span>
      </NavLink>
    </div>
  );
}
