import Button from "components/Button";
import Input from "components/Input";
import Label from "components/Label";
import Textarea from "components/Textarea";
import { useFormik } from "formik";
import { useEffect, useRef } from "react";
import * as Yup from "yup";

export type FormData = {
  title: string;
  notes: string;
};

type Props = {
  initialData?: FormData;
  onSubmit: (formData: FormData) => void;
};

const ValidationSchema = Yup.object().shape({
  title: Yup.string().required(),
  notes: Yup.string(),
});

export default function RecipeForm({ initialData, onSubmit }: Props) {
  const { handleChange, handleSubmit, values } = useFormik({
    initialValues: {
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
    <form action="" onSubmit={handleSubmit} className="space-y-8">
      <div>
        <Label>Title</Label>
        <Input name="title" onChange={handleChange} value={values.title} />
      </div>
      <div>
        <Label>Notes</Label>
        <Textarea name="notes" onChange={handleChange} value={values.notes} />
      </div>
      <Button options={{ fluid: true }} type="submit">
        Add entry
      </Button>
    </form>
  );
}
