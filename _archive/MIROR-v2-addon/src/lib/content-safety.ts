export type PublishCheck = {
  key: string;
  label: string;
  ok: boolean;
  detail: string;
};

export type ProjectForPublish = {
  title?: string;
  location?: string;
  status?: "verified-public" | "client-supplied-pending";
  client?: string;
  permissionToPublish?: boolean;
  sourceDocument?: string;
  role?: string;
};

export function checkProjectForPublish(project: ProjectForPublish): PublishCheck[] {
  return [
    {
      key: "title",
      label: "Project title",
      ok: Boolean(project.title?.trim()),
      detail: "A project title is required.",
    },
    {
      key: "source",
      label: "Evidence source",
      ok: project.status === "verified-public" ? Boolean(project.sourceDocument) : true,
      detail: "Publicly asserted facts need a source document or approved source.",
    },
    {
      key: "permission",
      label: "Publication permission",
      ok: project.status === "client-supplied-pending" ? project.permissionToPublish === true : true,
      detail: "Client-supplied projects must be explicitly cleared before publication.",
    },
    {
      key: "role",
      label: "Miror role",
      ok: Boolean(project.role?.trim()),
      detail: "Describe Miror's actual role without inflating the prime-contractor relationship.",
    },
  ];
}

export function assertProjectPublishable(project: ProjectForPublish): void {
  const failed = checkProjectForPublish(project).filter((check) => !check.ok);
  if (failed.length) {
    throw new Error(`Project cannot be published: ${failed.map((item) => item.label).join(", ")}`);
  }
}
