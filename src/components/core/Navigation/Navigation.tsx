import "./Navigation.css";

import classNames from "classnames";
import Logo from "components/core/Logo";
import NavLink from "components/core/NavLink";
import SROnly from "components/core/SROnly";
import Urls from "constants/urls";
import { useState } from "react";

export default function Navigation() {
  const [navIsExpanded, setNavIsExpanded] = useState(false);

  return (
    <div className="c-navigation">
      <div className="flex items-center justify-between w-full md:justify-center">
        <Logo />
        <button
          onClick={() => setNavIsExpanded(!navIsExpanded)}
          type="button"
          className="c-navigation__mobile"
        >
          <i className="fa fa-bars" />
          <SROnly>Toggle navigation</SROnly>
        </button>
      </div>
      <div
        className={classNames("text-center space-y-4 my-8 md:my-0", {
          "hidden md:block": !navIsExpanded,
        })}
      >
        <NavLink to={Urls.routes["journal:list"]}>Journals</NavLink>
        <NavLink to={Urls.routes["notes:list"]}>Notes</NavLink>
        <NavLink to={Urls.routes["lists:list"]}>Lists</NavLink>
      </div>
      <div className="hidden md:block">Account</div>
    </div>
  );
}
