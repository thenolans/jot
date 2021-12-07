import classNames from "classnames";

type Props = {
  theme?: "light" | "dark";
};

export default function Logo({ theme }: Props) {
  return (
    <h1
      className={classNames(
        "font-display text-4xl md:text-6xl -ml-4",
        theme === "dark" ? "text-primary-500" : "text-white"
      )}
    >
      Jot
    </h1>
  );
}
