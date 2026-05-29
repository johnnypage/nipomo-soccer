import { useRef, useCallback } from "react";

interface UseCloudinaryOptions {
  onSuccess: (info: CloudinaryUploadResult["info"]) => void;
  onError?: (error: unknown) => void;
}

export function useCloudinaryUpload({ onSuccess, onError }: UseCloudinaryOptions) {
  const widgetRef = useRef<CloudinaryWidget | null>(null);

  const openWidget = useCallback(() => {
    // Guard against script not loaded yet
    if (!window.cloudinary) {
      onError?.(new Error("Upload widget not loaded. Please refresh the page."));
      return;
    }

    if (!widgetRef.current) {
      widgetRef.current = window.cloudinary.createUploadWidget(
        {
          cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
          uploadPreset: "nsc_challenge",
          sources: ["local", "camera"],
          resourceType: "video",
          clientAllowedFormats: ["mp4", "mov", "webm"],
          maxVideoFileSize: 52428800, // 50MB in bytes per SUB-06
          multiple: false,
          maxFiles: 1,
          folder: "challenge-submissions",
          tags: ["summer-challenge"],
          singleUploadAutoClose: true,
          showUploadMoreButton: false,
        },
        (error: unknown, result: CloudinaryUploadResult) => {
          if (error) {
            onError?.(error);
            return;
          }
          if (result?.event === "success") {
            onSuccess(result.info);
          }
        }
      );
    }
    widgetRef.current.open();
  }, [onSuccess, onError]);

  return { openWidget };
}
