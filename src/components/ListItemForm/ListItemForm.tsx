import Button from "components/Button";
import FormError from "components/FormError";
import Icon from "components/Icon";
import Input from "components/Input";
import Label from "components/Label";
import SROnly from "components/SROnly";
import { Form, Formik } from "formik";
import { ListItemFormData } from "types";
import * as Yup from "yup";

type Props = {
  submitButtonLabel?: string;
  initialData?: Partial<ListItemFormData>;
  onSubmit: (formData: ListItemFormData) => void;
  isSubmitting?: boolean;
};

const ValidationSchema = Yup.object().shape({
  title: Yup.string().required(),
});

export default function ItemForm({
  initialData,
  onSubmit,
  submitButtonLabel = "Save item",
  isSubmitting,
}: Props) {
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
      render={({ handleChange, values, errors, resetForm }) => (
        <Form className="space-y-4">
          <div>
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
