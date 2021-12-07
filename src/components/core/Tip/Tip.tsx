import { ReactNode } from "react";

type Props = {
  title: string;
  description: string;
  action?: ReactNode;
};

export default function Tip({ action, title, description }: Props) {
  return (
    <div className="bg-primary-100 rounded-xl p-6 lg:p-8 text-primary-600">
      <div className="text-lg lg:text-2xl font-semibold mb-4">{title}</div>
      <div className="lg:text-lg max-w-xl">{description}</div>
      {action && <div className="mt-8">{action}</div>}
    </div>
  );
}
