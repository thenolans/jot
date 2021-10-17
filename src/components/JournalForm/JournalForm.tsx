import Button from "components/Button";
import FormError from "components/FormError";
import Icon from "components/Icon";
import Input from "components/Input";
import Label from "components/Label";
import SROnly from "components/SROnly";
import { Form, Formik } from "formik";
import { JournalFormData } from "types";
import * as Yup from "yup";

type Props = {
  submitButtonLabel: string;
  initialData?: Partial<JournalFormData>;
  onSubmit: (formData: JournalFormData) => void;
  isSubmitting?: boolean;
};

const ValidationSchema = Yup.object().shape({
  name: Yup.string().required(),
});

export default function ItemForm({
  initialData,
  onSubmit,
  submitButtonLabel,
  isSubmitting,
}: Props) {
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
      render={({ handleChange, values, errors, resetForm }) => (
        <Form className="space-y-4">
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
          <div className="text-right">
            <Button type="submit">
              {isSubmitting ? (
                <>
                  <Icon variant="fa-circle-o-notch" spin />
                  <SROnly>Submitting...</SROnly>
                </>
              ) : (
                submitButtonLabel
              )}
            </Button>
          </div>
        </Form>
      )}
    />
  );
}
