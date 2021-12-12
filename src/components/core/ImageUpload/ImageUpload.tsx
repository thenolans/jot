import Icon, { Trash, Upload } from "components/core/Icon";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

type FileWithPreview = File & {
  preview: string;
};

const MAX_IMAGES = 3;

export default function ImageUpload() {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const availableUploadCount = MAX_IMAGES - files.length;
  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    maxFiles: availableUploadCount,
    disabled: files.length === MAX_IMAGES,
    onDrop: (acceptedFiles: File[]) => {
      setFiles([
        ...files,
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
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    },
    [files]
  );

  function removeImage(index: number) {
    setFiles(files.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-4">
      {files && (
        <div className="flex items-center space-x-4 pt-2">
          {files.map((file, index) => (
            <div key={file.preview} className="relative">
              <button
                onClick={() => removeImage(index)}
                className="text-white bg-danger-500 rounded-full w-6 h-6 flex items-center justify-center absolute -right-3 -top-2"
                aria-label="Remove image"
              >
                <Icon size={12} icon={Trash} />
              </button>
              <img
                className="w-12 h-12 rounded-lg object-cover"
                alt=""
                src={file.preview}
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
