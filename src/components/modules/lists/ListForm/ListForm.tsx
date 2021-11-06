import Button from "components/core/Button";
import FormError from "components/core/FormError";
import Icon from "components/core/Icon";
import Input from "components/core/Input";
import Label from "components/core/Label";
import RadioGroup from "components/core/RadioGroup";
import SROnly from "components/core/SROnly";
import { useFormik } from "formik";
import { useEffect, useRef } from "react";
import { ListFormData, ListType } from "types";
import * as Yup from "yup";

type Props = {
  initialData?: Partial<ListFormData>;
  onSubmit: (formData: ListFormData) => void;
  isSubmitting?: boolean;
  buttonLabel?: string;
  formId: string;
};

const ValidationSchema = Yup.object().shape({
  name: Yup.string().required(),
});

export default function ListForm({
  initialData,
  onSubmit,
  isSubmitting,
  buttonLabel = "Add list",
  formId,
}: Props) {
  const nameInputRef = useRef<HTMLInputElement>(null);
  const { handleChange, handleSubmit, values, setFieldValue, errors } =
    useFormik({
      initialValues: {
        name: "",
        type: ListType.ONE_TIME,
        showCompletedItems: false,
        ...initialData,
      },
      onSubmit(values) {
        onSubmit(values);
      },
      validationSchema: ValidationSchema,
      validateOnBlur: false,
      validateOnChange: false,
    });

  useEffect(() => {
    nameInputRef?.current?.focus();
  }, [nameInputRef]);

  return (
    <form id={formId} onSubmit={handleSubmit} className="space-y-16">
      <div className="space-y-8">
        <div>
          <Label htmlFor="add-list--name">Name</Label>
          <Input
            ref={nameInputRef}
            id="add-list--name"
            placeholder="e.g. Grocery list"
            name="name"
            value={values.name}
            onChange={handleChange}
          />
          {errors.name && <FormError>Enter a name</FormError>}
        </div>
        <div>
          <Label>Type</Label>
          <RadioGroup
            onChange={(type) => setFieldValue("type", type)}
            options={[
              { label: "One-time", value: ListType.ONE_TIME },
              { label: "Reusable", value: ListType.REUSABLE },
            ]}
            name="type"
            value={values.type}
          />
        </div>
        <div>
          <Label>Show completed items?</Label>
          <RadioGroup
            onChange={(showCompletedItems) =>
              setFieldValue(
                "showCompletedItems",
                showCompletedItems === "true" ? true : false
              )
            }
            options={[
              { label: "No", value: "false" },
              { label: "Yes", value: "true" },
            ]}
            name="type"
            value={values.showCompletedItems.toString()}
          />
        </div>
      </div>
    </form>
  );
}
