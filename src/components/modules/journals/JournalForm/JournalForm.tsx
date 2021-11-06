import FormError from "components/core/FormError";
import Input from "components/core/Input";
import Label from "components/core/Label";
import { Form, Formik } from "formik";
import { JournalFormData } from "types";
import * as Yup from "yup";

type Props = {
  formId: string;
  submitButtonLabel: string;
  initialData?: Partial<JournalFormData>;
  onSubmit: (formData: JournalFormData) => void;
  isSubmitting?: boolean;
};

const ValidationSchema = Yup.object().shape({
  name: Yup.string().required(),
});

export default function ItemForm({ initialData, onSubmit, formId }: Props) {
  return (
    <Formik
      initialValues={{
        name: "",
        ...initialData,
      }}
      validationSchema={ValidationSchema}
      validateOnBlur={false}
      validateOnChange={false}
      onSubmit={onSubmit}
    >
      {({ handleChange, values, errors, resetForm }) => (
        <Form id={formId} className="space-y-4">
          <div>
            <Label htmlFor="journal-form--name">Name</Label>
            <Input
              id="journal-form--name"
              placeholder="e.g. Switzerland Trip"
              name="name"
              value={values.name}
              onChange={handleChange}
              autoFocus
            />
            {errors.name && <FormError>Enter a name</FormError>}
          </div>
        </Form>
      )}
    </Formik>
  );
}
