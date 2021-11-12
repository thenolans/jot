import "./Navigation.css";

import classNames from "classnames";
import Icon, {
  Bars,
  Book,
  CheckSquare,
  Edit,
  User,
} from "components/core/Icon";
import Logo from "components/core/Logo";
import NavLink from "components/core/NavLink";
import Urls from "constants/urls";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Navigation() {
  const [navIsExpanded, setNavIsExpanded] = useState(false);

  return (
    <div className="c-navigation">
      <div className="flex items-center justify-between w-full md:justify-center">
        <Link to={Urls.routes["journal:list"]}>
          <Logo />
        </Link>
        <button
          onClick={() => setNavIsExpanded(!navIsExpanded)}
          type="button"
          className="c-navigation__mobile"
          aria-label="Toggle navigation"
        >
          <Icon icon={Bars} />
        </button>
      </div>
      <div
        className={classNames("text-center space-y-4 my-8 md:my-0", {
          "hidden md:block": !navIsExpanded,
        })}
      >
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
      <div className={!navIsExpanded ? "hidden md:block" : undefined}>
        <NavLink icon={User} to={Urls.routes.account}>
          Account
        </NavLink>
      </div>
    </div>
  );
}
