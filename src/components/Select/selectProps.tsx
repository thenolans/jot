// @ts-nocheck
import { components } from "react-select";

const Control = (props) => (
  <components.Control
    className="bg-primary-100 border-transparent border-2 focus-within:border-primary-700 shadow-none rounded-full px-3 py-1"
    {...props}
  />
);

const IndicatorSeparator = () => null;

const MultiValue = (props) => (
  <components.MultiValue
    className="rounded bg-primary-600 text-white px-1"
    {...props}
  />
);

const selectProps = {
  components: { Control, IndicatorSeparator, MultiValue },
};

export default selectProps;
