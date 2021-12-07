import { ReactNode } from "react";
import { Tooltip, TooltipProps } from "react-tippy";

type Props = Omit<TooltipProps, "theme" | "position"> & {
  children: ReactNode;
};

export default function TooltipComponent({ children, ...props }: Props) {
  return (
    <Tooltip arrow theme="dark" position="top" {...props}>
      {children}
    </Tooltip>
  );
}
