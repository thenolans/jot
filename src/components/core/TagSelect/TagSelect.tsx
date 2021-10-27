import { selectProps } from "components/core/Select";
import useTags from "hooks/useTags";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";

type Props = {
  creatable?: boolean;
  inputId: string;
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
};

export default function TagSelect({
  creatable = false,
  inputId,
  onChange,
  placeholder,
  value,
}: Props) {
  const { addTag, tags } = useTags();

  const sharedProps = {
    inputId,
    options: tags.map((tag) => ({ label: tag.name, value: tag._id })),
    value: tags
      .filter((tag) => value.includes(tag._id))
      .map((tag) => ({
        label: tag.name,
        value: tag._id,
      })),
    placeholder,
    ...selectProps,
  };

  if (creatable) {
    return (
      <CreatableSelect
        {...sharedProps}
        isMulti
        onChange={(selectedOptions) => {
          onChange(selectedOptions.map((o) => o.value));
        }}
        onCreateOption={async (newTag: string) => {
          const tag = await addTag(newTag);
          onChange([...value, tag._id]);
        }}
      />
    );
  }

  return (
    <Select
      isMulti
      onChange={(selectedOptions) => {
        onChange(selectedOptions.map((o) => o.value));
      }}
      {...sharedProps}
    />
  );
}
