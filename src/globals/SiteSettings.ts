import { GlobalConfig } from "payload";

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  label: "Site Settings",
  access: {
    read: () => true,
    update: ({ req: { user } }) => {
      return user?.role === "admin";
    },
  },
  fields: [
    {
      name: "maintenanceBanner",
      label: "Maintenance Banner",
      type: "group",
      fields: [
        {
          name: "enabled",
          label: "Show Banner",
          type: "checkbox",
          defaultValue: false,
          admin: {
            description:
              "Enable this to show a maintenance banner at the top of the website",
          },
        },
        {
          name: "bannerMessage",
          label: "Banner Message",
          type: "text",
          admin: {
            description:
              "Short message displayed in the banner at the top of the website",
            condition: (_, siblingData) => siblingData?.enabled,
          },
        },
        {
          name: "modalMessage",
          label: "Modal Message",
          type: "textarea",
          admin: {
            description:
              "Longer explanation shown in the modal when users click on Gitea or project links",
            condition: (_, siblingData) => siblingData?.enabled,
          },
        },
        {
          name: "interceptExternalLinks",
          label: "Intercept External Links",
          type: "checkbox",
          defaultValue: true,
          admin: {
            description:
              "When enabled, clicking Gitea links and project links will show a modal instead of navigating directly",
            condition: (_, siblingData) => siblingData?.enabled,
          },
        },
      ],
    },
  ],
};

