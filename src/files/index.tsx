"use client";

import { useState, useCallback, forwardRef, useImperativeHandle } from "react";
import { LuUpload as UploadIcon, LuX as RemoveIcon } from "react-icons/lu";
import { FaFilePdf as PdfIcon, FaFileAlt as FileIcon } from "react-icons/fa"; // Icons for file types

interface FileUploaderProps {
  maxFiles?: number; // Optional prop to set the maximum number of files
  className?: string;
  acceptedFileTypes?: string[]; // New prop to specify accepted media types
  maxFileSize?: number; // New prop to specify the maximum file size in bytes
}

const FileUploader = forwardRef(
  (
    {
      maxFiles,
      className = "",
      acceptedFileTypes = ["image/png", "image/jpeg", "image/webp"],
      maxFileSize = 10 * 1024 * 1024, // Default to 10MB
    }: FileUploaderProps,
    ref,
  ) => {
    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<(string | null)[]>([]); // For previewing files
    const [errorMessage, setErrorMessage] = useState<string | null>(null); // Error state

    // Handle file selection with validation
    const handleFileUpload = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        setErrorMessage(null); // Clear any previous errors

        if (event.target.files) {
          const uploadedFiles = Array.from(event.target.files);
          const newFiles: File[] = [];
          const newPreviews: (string | null)[] = [];

          // Calculate how many more files can be added
          const remainingSlots = maxFiles
            ? maxFiles - files.length
            : uploadedFiles.length;

          if (remainingSlots <= 0) {
            setErrorMessage(`You have reached the maximum number of files.`);
            return;
          }

          // Limit the number of files to the remaining slots
          const filesToProcess = uploadedFiles.slice(0, remainingSlots);

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
            newFiles.push(file);

            // Create previews for images, null for non-images
            if (file.type.startsWith("image/")) {
              newPreviews.push(URL.createObjectURL(file));
            } else {
              newPreviews.push(null);
            }
          });

          // Append valid files to existing state
          setFiles((prevFiles) => [...prevFiles, ...newFiles]);
          setPreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
        }
      },
      [files.length, maxFiles, acceptedFileTypes, maxFileSize],
    );

    // Handle removing a file
    const handleRemoveFile = useCallback((fileIndex: number) => {
      setPreviews((prevPreviews) =>
        prevPreviews.filter((_, index) => index !== fileIndex),
      );
      setFiles((prevFiles) =>
        prevFiles.filter((_, index) => index !== fileIndex),
      );
    }, []);

    // Function to get files, exposed via ref
    const getFiles = useCallback(async () => {
      if (files.length === 0) return;

      const formData = new FormData();
      files.forEach((file) => {
        formData.append(`files`, file);
      });
      return formData;
    }, [files]);

    // Expose the getFiles function to be called externally via ref
    useImperativeHandle(ref, () => ({
      getFiles,
    }));

    // Determine if the upload button should be disabled
    const isUploadDisabled = maxFiles ? files.length >= maxFiles : false;

    return (
      <div className={`${className} overflow-hidden h-full flex flex-col`}>
        <div className="flex-1 flex flex-wrap gap-2">
          {/* Render uploaded files */}
          {files.map((file, index) => (
            <div
              key={index}
              className="relative group flex-1 min-w-[100px] max-w-[calc(33%-8px)]"
            >
              <div className="relative w-full h-full rounded-md overflow-hidden flex items-center justify-center bg-gray-100">
                {previews[index] ? (
                  <img
                    alt={file.name}
                    src={previews[index]!}
                    className="object-cover"
                  />
                ) : (
                  // Show an icon based on the file type
                  <div className="text-gray-500">
                    {file.type === "application/pdf" ? (
                      <PdfIcon className="h-12 w-12" />
                    ) : (
                      <FileIcon className="h-12 w-12" />
                    )}
                  </div>
                )}
              </div>

              {/* Remove Button */}
              <button
                className="absolute top-1 right-1 bg-gray-800 bg-opacity-50 p-1 rounded-full text-white opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                onClick={() => handleRemoveFile(index)}
                type="button"
              >
                <RemoveIcon className="h-4 w-4" />
              </button>
            </div>
          ))}

          {/* Upload Button */}
          {!isUploadDisabled && (
            <label
              className={`relative flex-1 min-w-[100px] max-w-[calc(33%-8px)] flex items-center justify-center rounded-md border border-dashed ${
                isUploadDisabled
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer"
              }`}
            >
              <UploadIcon className="h-6 w-6 text-muted-foreground" />
              <span className="sr-only">Upload</span>
              <input
                type="file"
                accept={acceptedFileTypes.join(",")}
                multiple
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleFileUpload}
                disabled={isUploadDisabled}
              />
            </label>
          )}
        </div>

        {/* Display error message if any */}
        {errorMessage && (
          <p className="text-red-500 mt-2 text-sm">{errorMessage}</p>
        )}
      </div>
    );
  },
);

export default FileUploader;
