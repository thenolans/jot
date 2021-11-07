import FormError from "components/core/FormError";
import Input from "components/core/Input";
import Label from "components/core/Label";
import { Form, Formik } from "formik";
import { ListGroupFormData } from "types";
import * as Yup from "yup";

type Props = {
  initialData?: Partial<ListGroupFormData>;
  onSubmit: (formData: ListGroupFormData) => void;
  formId: string;
};

const ValidationSchema = Yup.object().shape({
  name: Yup.string().required(),
});

export default function GroupForm({ initialData, onSubmit, formId }: Props) {
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
        <Form className="space-y-4" id={formId}>
          <Label htmlFor="group-form--name">Title</Label>
          <Input
            id="group-form--name"
            placeholder="e.g. Produce"
            name="name"
            value={values.name}
            onChange={handleChange}
            autoFocus
          />
          {errors.name && <FormError>Enter a name</FormError>}
        </Form>
      )}
    </Formik>
  );
}
