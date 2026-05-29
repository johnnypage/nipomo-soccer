declare global {
  interface Window {
    cloudinary: {
      createUploadWidget(
        options: CloudinaryWidgetOptions,
        callback: (error: unknown, result: CloudinaryUploadResult) => void
      ): CloudinaryWidget;
    };
  }

  interface CloudinaryWidgetOptions {
    cloudName: string;
    uploadPreset: string;
    sources?: string[];
    resourceType?: string;
    clientAllowedFormats?: string[];
    maxVideoFileSize?: number;
    multiple?: boolean;
    maxFiles?: number;
    folder?: string;
    tags?: string[];
    singleUploadAutoClose?: boolean;
    showUploadMoreButton?: boolean;
  }

  interface CloudinaryUploadResult {
    event: string;
    info: {
      public_id: string;
      secure_url: string;
      thumbnail_url: string;
      resource_type: string;
      bytes: number;
      format: string;
      eager?: Array<{ secure_url: string }>;
    };
  }

  interface CloudinaryWidget {
    open(): void;
    close(): void;
    destroy(): void;
    isShowing(): boolean;
  }
}

export {};
