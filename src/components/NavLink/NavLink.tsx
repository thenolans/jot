import "./NavLink.css";

import { NavLink as RRNavLink, NavLinkProps } from "react-router-dom";

type Props = Omit<NavLinkProps, "className" | "activeClassName">;

export default function NavLink(props: Props) {
  return <RRNavLink className="c-nav-link" {...props} />;
}
