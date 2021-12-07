import Loader from "components/core/Loader";

export default function ContentLoader({ label }: { label: string }) {
  return (
    <div className="text-center space-y-4 text-primary-600">
      <Loader size={48} />
      <div>{label}</div>
    </div>
  );
}
