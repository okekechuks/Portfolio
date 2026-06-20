type UploadImageOptions = {
  file: File;
  folder: "profile" | "projects";
};

type UploadDocumentOptions = {
  file: File;
  folder: "resumes";
};

function isLikelyManagedResource(resource: string): boolean {
  return resource.startsWith("/api/uploads/file?") || resource.includes("/storage/v1/object/public/portfolio-files/");
}

function toDeletePayload(resource: string): { path: string } | null {
  if (!resource || resource.startsWith("data:")) return null;

  try {
    const url = new URL(resource, window.location.origin);

    if (url.pathname === "/api/uploads/file") {
      const path = url.searchParams.get("path");
      return path ? { path } : null;
    }

    const marker = "/storage/v1/object/public/portfolio-files/";
    const index = url.pathname.indexOf(marker);
    if (index >= 0) {
      const path = url.pathname.slice(index + marker.length);
      return path ? { path: decodeURIComponent(path) } : null;
    }
  } catch {
    return null;
  }

  return null;
}

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

  async deleteUploadedResource(resource: string): Promise<boolean> {
    if (!resource || !isLikelyManagedResource(resource)) return false;

    const payload = toDeletePayload(resource);
    if (!payload) return false;

    const response = await fetch("/api/uploads/file", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "same-origin",
    });

    return response.ok;
  },
};
