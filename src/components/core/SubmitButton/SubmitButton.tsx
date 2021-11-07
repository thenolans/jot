import Button from "components/core/Button";
import Loader from "components/core/Loader";
import SROnly from "components/core/SROnly";
import { ComponentProps } from "react";

type Props = {
  isSubmitting?: boolean;
  formId: string;
  children: string;
} & Omit<ComponentProps<typeof Button>, "className" | "children">;

export default function SubmitButton({
  isSubmitting,
  formId,
  children,
  ...props
}: Props) {
  return (
    <Button disabled={isSubmitting} type="submit" form={formId} {...props}>
      {isSubmitting ? (
        <>
          <Loader />
          <SROnly>Submitting...</SROnly>
        </>
      ) : (
        children
      )}
    </Button>
  );
}
