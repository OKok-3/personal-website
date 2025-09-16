import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    useAsTitle: "name",
  },
  auth: true,
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "role",
      type: "select",
      required: true,
      defaultValue: "user",
      options: [
        { label: "Admin", value: "admin" },
        { label: "User", value: "user" },
        { label: "Recruiter", value: "recruiter" },
      ],
    },
  ],
};
