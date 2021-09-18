import Button from "components/Button";
import DatePicker from "components/DatePicker";
import Input from "components/Input";
import Label from "components/Label";
import Textarea from "components/Textarea";
import { useFormik } from "formik";
import { useEffect, useRef } from "react";
import * as Yup from "yup";

export type FormData = {
  date: Date;
  title: string;
  notes: string;
};

type Props = {
  formId: string;
  initialData?: FormData;
  onSubmit: (formData: FormData) => void;
};

const ValidationSchema = Yup.object().shape({
  title: Yup.string().required(),
  notes: Yup.string(),
});

export default function RecipeForm({ formId, initialData, onSubmit }: Props) {
  const { handleChange, handleSubmit, values, setFieldValue } = useFormik({
    initialValues: {
      date: new Date(),
      title: "",
      notes: "",
      ...initialData,
    },
    onSubmit(values) {
      onSubmit(values);
    },
    validationSchema: ValidationSchema,
  });
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    nameInputRef?.current?.focus();
  }, [nameInputRef]);

  return (
    <form id={formId} onSubmit={handleSubmit} className="space-y-8">
      <div>
        <Label>Title</Label>
        <Input name="title" onChange={handleChange} value={values.title} />
      </div>
      <div>
        <Label>Notes</Label>
        <Textarea name="notes" onChange={handleChange} value={values.notes} />
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
