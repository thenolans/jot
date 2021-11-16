// @ts-nocheck
import classNames from "classnames";
import { components } from "react-select";

const Control = (props) => (
  <components.Control
    className="bg-primary-100 border-transparent border-2 focus-within:border-primary-700 shadow-none rounded-xl px-3 py-1"
    {...props}
  />
);

const IndicatorSeparator = () => null;

const MultiValue = (props) => (
  <components.MultiValue
    className="rounded-xl text-primary-800 bg-primary-300 px-1"
    {...props}
  />
);

const Placeholder = (props) => (
  <components.Placeholder className="text-primary-600" {...props} />
);

const DropdownIndicator = (props) => (
  <components.DropdownIndicator className="text-primary-600" {...props} />
);

const ClearIndicator = (props) => (
  <components.ClearIndicator className="text-primary-600" {...props} />
);

const Menu = (props) => (
  <components.Menu
    className="bg-primary-50 rounded-xl overflow-hidden shadow"
    {...props}
  />
);

const MenuList = (props) => <components.MenuList className="py-2" {...props} />;

const Option = (props) => (
  <components.Option
    className={classNames("text-primary-800 hover:bg-primary-100 px-4", {
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
