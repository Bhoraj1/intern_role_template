import { FiImage, FiX } from "react-icons/fi";

const UploadImage = ({ image, onUpload, onRemove }) => {
  const id = `image-upload-${Math.random().toString(36).substring(2, 9)}`;

  let previewSrc = "";
  if (image instanceof File) {
    previewSrc = URL.createObjectURL(image);
  } else if (typeof image === "string" && image.trim() !== "") {
    previewSrc = image;
  }

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg h-48 relative">
      <input
        type="file"
        onChange={onUpload}
        accept="image/*"
        className="hidden"
        id={id}
      />

      {previewSrc ? (
        <>
          <img
            src={previewSrc}
            alt="Preview"
            className="w-full h-full object-cover rounded-lg"
          />
          <button
            onClick={onRemove}
            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
          >
            <FiX size={14} />
          </button>
        </>
      ) : (
        <label
          htmlFor={id}
          className="cursor-pointer w-full h-full flex flex-col items-center justify-center text-gray-400 hover:text-gray-600"
        >
          <FiImage className="text-3xl mb-2" />
          <span className="text-sm">Click to upload</span>
        </label>
      )}
    </div>
  );
};

export default UploadImage;
