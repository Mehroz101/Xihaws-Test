import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
  api_key: process.env.CLOUDINARY_API_KEY || "",
  api_secret: process.env.CLOUDINARY_API_SECRET || "",
});

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
}

export class CloudinaryService {
  /**
   * Upload image to Cloudinary
   * @param file - The file buffer or base64 string
   * @param folder - Optional folder name in Cloudinary
   * @returns Promise<CloudinaryUploadResult>
   */
  static async uploadImage(
    file: Buffer | string,
    folder: string = "smart-links"
  ): Promise<CloudinaryUploadResult> {
    try {
      const uploadOptions = {
        folder,
        resource_type: "image" as const,
        transformation: [
          { width: 800, height: 600, crop: "fill", quality: "auto" },
          { fetch_format: "auto" },
        ],
      };

      let uploadResult;
      if (Buffer.isBuffer(file)) {
        uploadResult = await cloudinary.uploader.upload(
          `data:image/jpeg;base64,${file.toString("base64")}`,
          uploadOptions
        );
      } else {
        uploadResult = await cloudinary.uploader.upload(file, uploadOptions);
      }

      return {
        public_id: uploadResult.public_id,
        secure_url: uploadResult.secure_url,
        width: uploadResult.width,
        height: uploadResult.height,
        format: uploadResult.format,
        resource_type: uploadResult.resource_type,
      };
    } catch (error: any) {
      let message = "Unknown Cloudinary error";
      if (error.response) {
        // Cloudinary sends detailed error response here
        message =
          error.response.data?.error?.message ||
          JSON.stringify(error.response.data);
      } else if (error.message) {
        message = error.message;
      } else {
        try {
          message = JSON.stringify(error);
        } catch {
          message = String(error);
        }
      }

      throw new Error(`Cloudinary upload failed: ${message}`);
    }
  }

  /**
   * Delete image from Cloudinary
   * @param publicId - The public ID of the image to delete
   * @returns Promise<boolean>
   */
  static async deleteImage(publicId: string): Promise<boolean> {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result.result === "ok";
    } catch (error) {
      throw new Error(`Cloudinary delete failed: ${error}`);
    }
  }

  /**
   * Extract public ID from Cloudinary URL
   * @param url - The Cloudinary URL
   * @returns string | null
   */
  static extractPublicId(url: string): string | null {
    const match = url.match(/\/v\d+\/(.+)\.(jpg|jpeg|png|gif|webp)$/);
    return match && match[1] ? match[1] : null;
  }

  /**
   * Generate optimized image URL with transformations
   * @param publicId - The public ID of the image
   * @param transformations - Optional transformations
   * @returns string
   */
  static getOptimizedUrl(
    publicId: string,
    transformations: Record<string, any> = {}
  ): string {
    return cloudinary.url(publicId, {
      ...transformations,
      quality: "auto",
      fetch_format: "auto",
    });
  }
}
