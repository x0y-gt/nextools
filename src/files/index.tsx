"use client";

import { useState, useCallback, forwardRef, useImperativeHandle } from "react";
import { LuUpload as UploadIcon, LuX as RemoveIcon } from "react-icons/lu";
import { FaFilePdf as PdfIcon, FaFileAlt as FileIcon } from "react-icons/fa"; // Icons for file types

interface FileUploaderProps {
  maxFiles?: number; // Optional prop to set the maximum number of files
  className?: string;
  acceptedFileTypes?: string[]; // New prop to specify accepted media types
  maxFileSize?: number; // New prop to specify the maximum file size in bytes
  defaultFiles?: string[]; // Array of default file URLs
}

type FileItem = {
  id?: string;
  file?: File;
  preview: string | null;
  isDefault?: boolean;
};

const FileUploader = forwardRef(
  (
    {
      maxFiles,
      className = "",
      acceptedFileTypes = ["image/png", "image/jpeg", "image/webp"],
      maxFileSize = 10 * 1024 * 1024, // Default to 10MB
      defaultFiles = [],
    }: FileUploaderProps,
    ref,
  ) => {
    const [fileItems, setFileItems] = useState<FileItem[]>(
      (defaultFiles || []).map((url) => ({
        id: url,
        preview: url,
        isDefault: true,
      })),
    );
    const [deletedDefaultFiles, setDeletedDefaultFiles] = useState<string[]>(
      [],
    );
    const [errorMessage, setErrorMessage] = useState<string | null>(null); // Error state

    // Handle file selection with validation
    const handleFileUpload = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        setErrorMessage(null); // Clear any previous errors

        if (event.target.files) {
          const uploadedFiles = Array.from(event.target.files);
          const remainingSlots = maxFiles
            ? maxFiles - fileItems.length
            : uploadedFiles.length;

          if (remainingSlots <= 0) {
            setErrorMessage(`You have reached the maximum number of files.`);
            return;
          }

          const filesToProcess = uploadedFiles.slice(0, remainingSlots);
          const newFileItems: FileItem[] = [];

          filesToProcess.forEach((file) => {
            // Validate file type
            if (!acceptedFileTypes.includes(file.type)) {
              setErrorMessage(
                `Invalid file type: ${file.name}. Accepted types are: ${acceptedFileTypes.join(
                  ", ",
                )}.`,
              );
              return;
            }

            // Validate file size
            if (file.size > maxFileSize) {
              setErrorMessage(
                `File too large: ${file.name}. Maximum allowed size is ${(
                  maxFileSize /
                  (1024 * 1024)
                ).toFixed(2)}MB.`,
              );
              return;
            }

            // If valid, push to arrays for preview and upload
            newFileItems.push({
              file,
              preview: file.type.startsWith("image/")
                ? URL.createObjectURL(file)
                : null,
              isDefault: false,
            });
          });

          // Append valid files to existing state
          setFileItems((prevItems) => [...prevItems, ...newFileItems]);
        }
      },
      [fileItems.length, maxFiles, acceptedFileTypes, maxFileSize],
    );

    // Handle removing a file
    const handleRemoveFile = useCallback(
      (index: number) => {
        // Get the item to remove
        const itemToRemove = fileItems[index];

        // Remove the item from fileItems
        setFileItems((prevItems) => prevItems.filter((_, i) => i !== index));

        // If it's a default file, add its ID to the deleted list
        if (itemToRemove.isDefault && itemToRemove.id) {
          setDeletedDefaultFiles((prevDeleted) => [
            ...prevDeleted,
            itemToRemove.id!,
          ]);
        }
      },
      [fileItems],
    );

    // Function to get files, exposed via ref
    const getFiles = useCallback(async () => {
      const newFiles = fileItems.filter((item) => !item.isDefault && item.file);
      if (newFiles.length === 0) return null;

      const formData = new FormData();
      newFiles.forEach((item) => {
        formData.append("files", item.file!);
      });
      return formData;
    }, [fileItems]);

    // Expose the getFiles function to be called externally via ref
    useImperativeHandle(ref, () => ({
      getFiles,
      getDeletedFiles: () => deletedDefaultFiles,
    }));

    // Determine if the upload button should be disabled
    const isUploadDisabled = maxFiles ? fileItems.length >= maxFiles : false;

    return (
      <div
        className={`grid grid-cols-1 gap-2 md:grid-cols-2 lg:gap-4 lg:grid-cols-3 xl:grid-cols-4 ${className}`}
      >
        {/* Render uploaded files */}
        {fileItems.map((item, index) => (
          <div
            key={index}
            className="flex relative aspect-square max-h-[180px] md:max-h-full overflow-hidden border border-gray-100"
          >
            <div className="relative flex items-center bg-gray-100">
              {item.preview ? (
                <img
                  alt={`File ${index + 1}`}
                  src={item.preview}
                  className="object-cover"
                />
              ) : item.file?.type === "application/pdf" ? (
                <PdfIcon className="h-12 w-12 text-gray-500" />
              ) : (
                <FileIcon className="h-12 w-12 text-gray-500" />
              )}
            </div>
            <button
              className="absolute top-2 right-2"
              onClick={() => handleRemoveFile(index)}
              type="button"
            >
              <RemoveIcon className="h-6 w-6" />
            </button>
          </div>
        ))}

        {/* Upload Button */}
        {!isUploadDisabled && (
          <label className="relative max-h-[180px] md:max-h-full md:w-full aspect-square bg-gray-50 flex items-center justify-center rounded-md border border-dashed">
            <UploadIcon className="h-6 w-6 text-muted-foreground" />
            <span className="sr-only">Upload</span>
            <input
              type="file"
              accept={acceptedFileTypes.join(",")}
              multiple
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleFileUpload}
            />
          </label>
        )}

        {/* Display error message if any */}
        {errorMessage && (
          <p className="text-red-500 mt-2 text-sm">{errorMessage}</p>
        )}
      </div>
    );
  },
);

export default FileUploader;
