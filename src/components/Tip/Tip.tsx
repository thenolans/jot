type Props = {
  title: string;
  description: string;
};

export default function Tip({ title, description }: Props) {
  return (
    <div className="bg-primary-100 rounded-3xl p-8 space-y-4">
      <div className="text-2xl font-semibold text-primary-700">{title}</div>
      <div className="text-lg text-primary-900 max-w-xl">{description}</div>
    </div>
  );
}
