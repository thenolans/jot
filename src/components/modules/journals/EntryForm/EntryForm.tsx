import DatePicker from "components/core/DatePicker";
import FormError from "components/core/FormError";
import Input from "components/core/Input";
import Label from "components/core/Label";
import TagSelect from "components/core/TagSelect";
import Textarea from "components/core/Textarea";
import { useFormik } from "formik";
import { useEffect, useRef } from "react";
import { EntryFormData } from "types";
import * as Yup from "yup";

type Props = {
  formId: string;
  initialData?: Partial<EntryFormData>;
  onSubmit: (formData: EntryFormData) => void;
};

const ValidationSchema = Yup.object().shape({
  title: Yup.string().required(),
  notes: Yup.string(),
});

export default function EntryForm({ formId, initialData, onSubmit }: Props) {
  const { errors, handleChange, handleSubmit, values, setFieldValue } =
    useFormik({
      initialValues: {
        date: new Date(),
        title: "",
        notes: "",
        tags: [],
        ...initialData,
      },
      onSubmit(values) {
        onSubmit(values);
      },
      validationSchema: ValidationSchema,
      validateOnBlur: false,
      validateOnChange: false,
    });
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    nameInputRef?.current?.focus();
  }, [nameInputRef]);

  return (
    <form id={formId} onSubmit={handleSubmit} className="space-y-8">
      <div>
        <Label htmlFor="create-entry--title">Title</Label>
        <Input
          id="create-entry--title"
          name="title"
          onChange={handleChange}
          value={values.title}
        />
        {errors.title && <FormError>Please enter a title</FormError>}
      </div>
      <div>
        <Label htmlFor="create-entry--tags">Tags</Label>
        <TagSelect
          creatable
          inputId="create-entry--tags"
          value={values.tags}
          onChange={(tags) => setFieldValue("tags", tags)}
        />
      </div>
      <div>
        <Label htmlFor="create-entry--notes">Notes</Label>
        <Textarea
          id="create-entry--notes"
          name="notes"
          onChange={handleChange}
          value={values.notes || ""}
        />
      </div>
      <div>
        <Label>Date</Label>
        <DatePicker
          value={values.date}
          onChange={(date) => setFieldValue("date", date)}
        />
      </div>
    </form>
  );
}
