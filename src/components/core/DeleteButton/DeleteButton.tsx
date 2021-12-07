import Button from "components/core/Button";
import Icon, { Trash } from "components/core/Icon";
import { ComponentProps } from "react";

type Props = {
  children: string;
} & Omit<ComponentProps<typeof Button>, "children" | "theme">;

export default function DeleteButton({ children, ...props }: Props) {
  return (
    <Button theme="link-danger" {...props}>
      <Icon icon={Trash} />
      <span>{children}</span>
    </Button>
  );
}
