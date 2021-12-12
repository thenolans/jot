import Icon, { Trash, Upload } from "components/core/Icon";
import { useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { LocalImage } from "types";
import getBlobsFromLocalImages from "utils/getBlobsFromLocalImages";

type Props = {
  value: LocalImage[];
  onChange: (files: LocalImage[]) => void;
};

const MAX_IMAGES = 3;

export default function ImageUpload({ onChange, value = [] }: Props) {
  const availableUploadCount = MAX_IMAGES - value.length;
  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    maxFiles: availableUploadCount,
    disabled: value.length === MAX_IMAGES,
    onDrop: (acceptedFiles: File[]) => {
      onChange([
        ...value,
        ...acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        ),
      ]);
    },
  });

  useEffect(
    () => () => {
      getBlobsFromLocalImages(value).forEach((file) =>
        URL.revokeObjectURL(file.preview)
      );
    },
    [value]
  );

  function removeImage(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-4">
      {!!value.length && (
        <div className="flex items-center space-x-4 pt-2">
          {value.map((file, index) => (
            <div key={index} className="relative">
              <button
                onClick={() => removeImage(index)}
                className="text-white bg-danger-500 rounded-full w-6 h-6 flex items-center justify-center absolute -right-3 -top-2"
                aria-label="Remove image"
                type="button"
              >
                <Icon size={12} icon={Trash} />
              </button>
              <img
                className="w-12 h-12 rounded-lg object-cover"
                alt=""
                // @ts-expect-error
                src={file.preview || file.src}
              />
            </div>
          ))}
        </div>
      )}
      <div
        className="border border-dashed border-gray-200 text-gray-400 rounded-lg h-12 flex items-center justify-center cursor-pointer hover:border-primary-500 hover:text-primary-500"
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <div className="text-sm flex items-center justify-center space-x-2">
          <Icon icon={Upload} />
          {availableUploadCount ? (
            <span>Select up to {availableUploadCount} images</span>
          ) : (
            <span>Remove images above to select new images</span>
          )}
        </div>
      </div>
    </div>
  );
}
