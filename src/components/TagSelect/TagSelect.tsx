import { selectProps } from "components/Select";
import useTags from "hooks/useTags";
import CreatableSelect from "react-select/creatable";
import {
  getOptionLabel as getOptionLabelType,
  getOptionValue as getOptionValueType,
} from "react-select/src/builtins";
import { Tag } from "types";

type Props = {
  inputId: string;
  value: string[];
  onChange: (tags: string[]) => void;
};

const getOptionValue: getOptionValueType<Tag> = ({ _id }) => String(_id);
const getOptionLabel: getOptionLabelType<Tag> = ({ name }) => name;

export default function TagSelect({ inputId, onChange, value }: Props) {
  const { addTag, tags } = useTags();

  return (
    <CreatableSelect
      isMulti
      inputId={inputId}
      {...selectProps}
      options={tags}
      getOptionLabel={getOptionLabel}
      getOptionValue={getOptionValue}
      onCreateOption={(newTag: string) => addTag(newTag)}
      value={tags.filter((tag) => value.includes(tag._id))}
      onChange={(selectedOptions) =>
        onChange(selectedOptions.map((o) => o._id))
      }
    />
  );
}
