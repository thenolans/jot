import FormError from "components/core/FormError";
import Input from "components/core/Input";
import Label from "components/core/Label";
import RadioGroup from "components/core/RadioGroup";
import { Form, Formik } from "formik";
import { useEffect, useRef } from "react";
import { ListFormData, ListType } from "types";
import * as Yup from "yup";

type Props = {
  initialData?: Partial<ListFormData>;
  onSubmit: (formData: ListFormData) => void;
  formId: string;
};

const ValidationSchema = Yup.object().shape({
  name: Yup.string().required(),
});

export default function ListForm({ initialData, onSubmit, formId }: Props) {
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    nameInputRef?.current?.focus();
  }, [nameInputRef]);

  return (
    <Formik
      initialValues={{
        name: "",
        type: ListType.ONE_TIME,
        showCompletedItems: false,
        ...initialData,
      }}
      validationSchema={ValidationSchema}
      validateOnBlur={false}
      validateOnChange={false}
      onSubmit={onSubmit}
    >
      {({ handleChange, handleSubmit, values, setFieldValue, errors }) => (
        <Form className="space-y-4" id={formId}>
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
        </Form>
      )}
    </Formik>
  );
}
