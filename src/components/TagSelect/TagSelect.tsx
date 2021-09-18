import { selectProps } from "components/Select";
import useTags from "hooks/useTags";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";

type Props = {
  creatable?: boolean;
  inputId: string;
  value: string[];
  onChange: (tags: string[]) => void;
};

export default function TagSelect({
  creatable = false,
  inputId,
  onChange,
  value,
}: Props) {
  const { addTag, tags } = useTags();

  const sharedProps = {
    isMutli: true,
    inputId,
    options: tags.map((tag) => ({ label: tag.name, value: tag._id })),
    value: tags
      .filter((tag) => value.includes(tag._id))
      .map((tag) => ({
        label: tag.name,
        value: tag._id,
      })),
    // @ts-expect-error
    onChange: (selectedOptions) => {
      // @ts-expect-error
      onChange(selectedOptions.map((o) => o.value));
    },
    ...selectProps,
  };

  if (creatable) {
    return (
      <CreatableSelect
        {...sharedProps}
        onCreateOption={(newTag: string) => addTag(newTag)}
      />
    );
  }

  return <Select {...sharedProps} />;
}
