import Icon, { CircleNotch } from "components/core/Icon";
import { ComponentProps } from "react";

export default function Loader(
  props: Omit<ComponentProps<typeof Icon>, "icon" | "spin">
) {
  return <Icon icon={CircleNotch} spin {...props} />;
}
