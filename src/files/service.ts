import { S3 } from "aws-sdk";

interface UploadConfig {
  bucket: string;
  accessKeyId: string;
  secretAccessKey: string;
  endpoint: string;
  acl?: string;
}

interface FileUploadParams {
  key: string;
  file: Blob | File;
  contentType?: string;
}

interface UploadService {
  uploadFile: (params: FileUploadParams) => Promise<string>;
  uploadFiles: (files: FileUploadParams[]) => Promise<string[]>;
}

export const createUploadService = (config: UploadConfig): UploadService => {
  const s3 = new S3({
    endpoint: new S3.Endpoint(config.endpoint),
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
  });

  const blobToBuffer = async (blob: Blob): Promise<Buffer> => {
    const arrayBuffer = await blob.arrayBuffer();
    return Buffer.from(arrayBuffer);
  };

  const uploadFile = async ({
    key,
    file,
    contentType,
  }: FileUploadParams): Promise<string> => {
    const buffer = await blobToBuffer(file);
    const params: S3.PutObjectRequest = {
      Bucket: config.bucket,
      Key: key,
      Body: buffer,
      ACL: config.acl || "public-read",
      ContentType: contentType || file.type,
    };
    const data = await s3.upload(params).promise();
    return data.Location;
  };

  const uploadFiles = async (files: FileUploadParams[]): Promise<string[]> => {
    const uploadPromises = files.map((fileParams) => uploadFile(fileParams));
    const uploadedUrls = await Promise.all(uploadPromises);
    return uploadedUrls;
  };

  return {
    uploadFile,
    uploadFiles,
  };
};
