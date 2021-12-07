// @ts-nocheck
import classNames from "classnames";
import { components } from "react-select";

const Control = (props) => (
  <components.Control
    className="bg-white border border-gray-200 focus-within:border-primary-500 shadow-none rounded-xl px-3 py-1"
    {...props}
  />
);

const IndicatorSeparator = () => null;

const MultiValue = (props) => (
  <components.MultiValue
    className="rounded-lg text-primary-500 bg-primary-100 px-1"
    {...props}
  />
);

const Placeholder = (props) => (
  <components.Placeholder className="text-gray-400" {...props} />
);

const DropdownIndicator = (props) => (
  <components.DropdownIndicator className="text-gray-400" {...props} />
);

const ClearIndicator = (props) => (
  <components.ClearIndicator className="text-gray-400" {...props} />
);

const Menu = (props) => (
  <components.Menu
    className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-none"
    {...props}
  />
);

const MenuList = (props) => <components.MenuList className="py-2" {...props} />;

const Option = (props) => (
  <components.Option
    className={classNames("text-primary-500 hover:bg-primary-100 px-4", {
      "bg-primary-100": props.isFocused,
    })}
    {...props}
  />
);

const selectProps = {
  components: {
    Control,
    IndicatorSeparator,
    MultiValue,
    Placeholder,
    DropdownIndicator,
    MenuList,
    Menu,
    Option,
    ClearIndicator,
  },
};

export default selectProps;
