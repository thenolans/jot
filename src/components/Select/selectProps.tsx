// @ts-nocheck
import { components } from "react-select";

const Control = (props) => (
  <components.Control
    className="bg-gray-100 border-transparent border-2 focus-within:border-primary-700 shadow-none rounded-lg px-3 py-2"
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
