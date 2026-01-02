import { GlobalConfig } from "payload";

export const HomePageContent: GlobalConfig = {
  slug: "home-page",
  access: {
    read: () => true,
    update: ({ req: { user } }) => {
      return user?.role === "admin";
    },
  },
  fields: [
    {
      name: "content",
      label: "Home Page Content",
      type: "array",
      maxRows: 1,
      minRows: 1,
      required: true,
      fields: [
        {
          name: "h1",
          label: "Heading 1",
          type: "text",
          required: true,
        },
        {
          name: "h2",
          label: "Heading 2",
          type: "text",
          required: true,
        },
        {
          name: "description",
          label: "Description",
          type: "textarea",
          required: true,
        },
        {
          name: "location",
          label: "Current Location",
          type: "text",
          required: true,
        },
        {
          name: "socials",
          label: "Social Links",
          type: "array",
          minRows: 1,
          maxRows: 5,
          required: true,
          fields: [
            {
              name: "platform",
              type: "select",
              required: true,
              options: [
                { label: "Email", value: "email" },
                { label: "Github", value: "github" },
                { label: "Gitea", value: "gitea" },
                { label: "LinkedIn", value: "linkedin" },
                { label: "X", value: "twitter" },
                { label: "Phone", value: "phone" },
                { label: "Instagram", value: "instagram" },
              ],
              admin: {
                description:
                  "These are predefined values as the icons are not managed by Payload.",
              },
            },
            {
              name: "url",
              label: "URL",
              type: "text",
              required: true,
            },
          ],
        },
        {
          name: "certificationBadges",
          label: "Certification Badges",
          type: "relationship",
          relationTo: "certificationBadges",
          hasMany: true,
          required: false,
          admin: {
            description:
              "Select and order certification badges to display on the home page. Drag to reorder.",
          },
        },
      ],
    },
  ],
};
