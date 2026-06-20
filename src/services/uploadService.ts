type UploadImageOptions = {
  file: File;
  folder: "profile" | "projects";
};

type UploadDocumentOptions = {
  file: File;
  folder: "resumes";
};

export const uploadService = {
  async uploadImage({ file, folder }: UploadImageOptions): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const response = await fetch("/api/uploads/image", {
      method: "POST",
      body: formData,
      credentials: "same-origin",
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || "Image upload failed");
    }

    return data.url as string;
  },

  async uploadDocument({ file, folder }: UploadDocumentOptions): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const response = await fetch("/api/uploads/image", {
      method: "POST",
      body: formData,
      credentials: "same-origin",
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || "Document upload failed");
    }

    return data.url as string;
  },
};
