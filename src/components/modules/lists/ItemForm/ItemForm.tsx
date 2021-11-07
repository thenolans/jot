import FormError from "components/core/FormError";
import Input from "components/core/Input";
import Label from "components/core/Label";
import { Form, Formik } from "formik";
import { ListItemFormData } from "types";
import * as Yup from "yup";

type Props = {
  initialData?: Partial<ListItemFormData>;
  onSubmit: (formData: ListItemFormData) => void;
  formId: string;
};

const ValidationSchema = Yup.object().shape({
  title: Yup.string().required(),
});

export default function ItemForm({ initialData, onSubmit, formId }: Props) {
  return (
    <Formik
      initialValues={{
        title: "",
        ...initialData,
      }}
      validationSchema={ValidationSchema}
      validateOnBlur={false}
      validateOnChange={false}
      onSubmit={onSubmit}
    >
      {({ handleChange, values, errors, resetForm }) => (
        <Form className="space-y-4" id={formId}>
          <Label htmlFor="item-form--title">Title</Label>
          <Input
            id="item-form--title"
            placeholder="e.g. Lettuce"
            name="title"
            value={values.title}
            onChange={handleChange}
            autoFocus
          />
          {errors.title && <FormError>Enter a title</FormError>}
        </Form>
      )}
    </Formik>
  );
}
