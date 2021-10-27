import Button from "components/core/Button";
import FormError from "components/core/FormError";
import Icon from "components/core/Icon";
import Input from "components/core/Input";
import Label from "components/core/Label";
import SROnly from "components/core/SROnly";
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
