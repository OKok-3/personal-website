import type { Block } from "payload";

const calloutTypes = {
  info: "info",
  warning: "warning",
  error: "error",
  success: "success",
};

export const Callout: Block = {
  slug: "callout",
  interfaceName: "Callout",
  fields: [
    {
      name: "type",
      type: "select",
      required: true,
      options: Object.entries(calloutTypes).map(([key, value]) => ({
        label: key,
        value,
      })),
      defaultValue: "info",
    },
    {
      name: "title",
      type: "text",
      required: false,
    },
    {
      name: "content",
      type: "textarea",
      required: true,
    },
  ],
};
