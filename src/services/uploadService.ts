type UploadImageOptions = {
  file: File;
  folder: "profile" | "projects";
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
};
