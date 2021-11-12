import "./Icon.css";

import classNames from "classnames";
import { ReactElement, SVGAttributes } from "react";

type Props = {
  icon: ReactElement;
  className?: string;
  spin?: boolean;
  size?: number;
} & SVGAttributes<SVGElement>;

export default function Icon({
  icon,
  className,
  spin,
  size = 24,
  ...props
}: Props) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
      className={classNames("inline-block", { "icon--spin": spin }, className)}
      {...props}
    >
      {icon}
    </svg>
  );
}
