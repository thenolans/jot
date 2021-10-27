import classNames from "classnames";

type Props = {
  variant: string;
  className?: string;
  spin?: boolean;
  size?: string;
};

export default function Icon({
  variant,
  className,
  spin = false,
  size,
}: Props) {
  return (
    <i
      aria-hidden="true"
      className={classNames("fa", variant, size, spin && "fa-spin", className)}
    />
  );
}
