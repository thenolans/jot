import Icon from "components/Icon";
import { ReactNode } from "react";

type Props = {
  children?: ReactNode;
  text: string;
};

export default function EmptyState({ children, text }: Props) {
  return (
    <div className="text-center space-y-6">
      <Icon className="text-gray-400" variant="fa-book" size="3x" />
      <div className="text-gray-500 text-xl">{text}</div>
      {children}
    </div>
  );
}
