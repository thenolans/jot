import Button from "components/core/Button";
import FormError from "components/core/FormError";
import Icon from "components/core/Icon";
import Input from "components/core/Input";
import Label from "components/core/Label";
import SROnly from "components/core/SROnly";
import { Form, Formik } from "formik";
import { ListGroupFormData } from "types";
import * as Yup from "yup";

type Props = {
  submitButtonLabel?: string;
  initialData?: Partial<ListGroupFormData>;
  onSubmit: (formData: ListGroupFormData) => void;
  isSubmitting?: boolean;
};

const ValidationSchema = Yup.object().shape({
  name: Yup.string().required(),
});

export default function GroupForm({
  initialData,
  onSubmit,
  submitButtonLabel = "Save group",
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
    >
      {({ handleChange, values, errors, resetForm }) => (
        <Form className="space-y-4">
          <div>
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
    </Formik>
  );
}
