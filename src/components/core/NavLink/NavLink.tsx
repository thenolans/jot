import "./NavLink.css";

import classNames from "classnames";
import Icon from "components/core/Icon";
import { ReactElement } from "react";
import { NavLink as RRNavLink, NavLinkProps } from "react-router-dom";

type Props = Omit<NavLinkProps, "activeClassName"> & {
  icon: ReactElement;
};

export default function NavLink({
  className,
  icon,
  children,
  ...props
}: Props) {
  return (
    <RRNavLink className={classNames("c-nav-link", className)} {...props}>
      <Icon icon={icon} />
      <span>{children}</span>
    </RRNavLink>
  );
}
