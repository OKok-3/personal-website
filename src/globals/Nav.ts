import { Field, GlobalConfig } from "payload";

const commonFields: Array<Field> = [
  {
    name: "label",
    type: "text",
    required: true,
    admin: {
      description: "The text that will be displayed for the menu item",
    },
  },
  {
    name: "path",
    type: "text",
    required: true,
    admin: {
      description: "The path that is relative to root (e.g., '/blogs')",
    },
  },
  {
    name: "openInNewTab",
    type: "checkbox",
    required: true,
    defaultValue: false,
    admin: {
      description:
        "Whether the menu item should open in a new tab. Defaults to false",
    },
  },
  {
    name: "acl",
    label: "Access Control Level",
    type: "select",
    required: true,
    defaultValue: "3",
    options: [
      { label: "Admin", value: "0" },
      { label: "Recruiters", value: "1" },
      { label: "Registered User", value: "2" },
      { label: "Public", value: "3" },
    ],
    admin: {
      description:
        "The access control level for the menu item. Select the highest appropriate level (e.g., if set to Recruiters, then only admin and recruiter will be able to view",
    },
  },
];

export const Nav: GlobalConfig = {
  slug: "nav",
  label: "Navigation Menu Options",
  admin: {},
  access: {
    read: () => true,
    update: ({ req: { user } }) => {
      return user?.role === "admin";
    },
  },
  fields: [
    {
      name: "items",
      label: "Menu Item",
      labels: { singular: "Menu Item", plural: "Menu Items" },
      type: "array",
      required: true,
      minRows: 1,
      maxRows: 5,
      fields: [
        ...commonFields,
        {
          name: "subItems",
          label: "Sub Items",
          type: "array",
          minRows: 0,
          maxRows: 5,
          admin: {
            description: "Any applicable sub-level menu items",
          },
          fields: [...commonFields],
        },
      ],
    },
  ],
};
