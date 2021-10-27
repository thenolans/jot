import Icon from "components/core/Icon";
import Logo from "components/core/Logo";

export default function AuthLoader() {
  return (
    <div className="text-center py-8 space-y-4">
      <div className="relative">
        <Icon
          className="text-primary-200"
          size="fa-5x"
          variant="fa-circle-o-notch"
          spin
        />
        <Icon
          className="text-primary-600 u-absolute-center"
          size="fa-2x"
          variant="fa-lock"
        />
      </div>
      <Logo />
    </div>
  );
}
