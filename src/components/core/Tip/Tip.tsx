import { ReactNode } from "react";

type Props = {
  title: string;
  description: string;
  action?: ReactNode;
};

export default function Tip({ action, title, description }: Props) {
  return (
    <div className="bg-primary-100 rounded-3xl p-6 lg:p-8">
      <div className="text-lg lg:text-2xl font-semibold text-primary-700 mb-4">
        {title}
      </div>
      <div className="lg:text-lg text-primary-900 max-w-xl">{description}</div>
      {action && <div className="mt-8">{action}</div>}
    </div>
  );
}
