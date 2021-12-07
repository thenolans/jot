import Icon, { CircleNotch, Lock } from "components/core/Icon";
import Logo from "components/core/Logo";

export default function AuthLoader() {
  return (
    <div className="text-center py-8 space-y-4">
      <div className="relative">
        <Icon className="text-primary-200" size={128} icon={CircleNotch} spin />
        <Icon
          className="text-primary-500 u-absolute-center"
          size={48}
          icon={Lock}
        />
      </div>
      <Logo theme="dark" />
    </div>
  );
}
