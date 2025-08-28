import { GlobalConfig } from "payload";

export const LandingPageContent: GlobalConfig = {
  slug: "landing-page",
  fields: [
    {
      name: "content",
      label: "Landing Page Content",
      type: "array",
      maxRows: 1,
      minRows: 1,
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
          maxRows: 3,
          fields: [
            {
              name: "platform",
              label: "Platform",
              type: "text",
              required: true,
            },
            {
              name: "icon",
              label: "Icon",
              type: "relationship",
              relationTo: "icons",
              required: true,
              filterOptions: () => {
                return {
                  type: { equals: "logo" },
                };
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
      ],
    },
  ],
};
