import "./NavLink.css";

import Icon from "components/core/Icon";
import { ReactElement } from "react";
import { NavLink as RRNavLink, NavLinkProps } from "react-router-dom";

type Props = Omit<NavLinkProps, "activeClassName"> & {
  icon: ReactElement;
};

export default function NavLink({ icon, children, ...props }: Props) {
  return (
    <RRNavLink className="c-nav-link" {...props}>
      <Icon icon={icon} />
      <span>{children}</span>
    </RRNavLink>
  );
}
