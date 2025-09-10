import { GlobalConfig } from "payload";

export const AboutPageContent: GlobalConfig = {
  slug: "about-page",
  fields: [
    {
      name: "profilePicture",
      type: "upload",
      relationTo: "media",
      required: false,
      admin: {
        description: "Profile picture for the about page",
      },
    },
    {
      name: "quickFacts",
      type: "richText",
      required: true,
      admin: {
        description: "Quick facts for the about page",
      },
    },
    {
      name: "content",
      type: "richText",
      required: true,
      admin: {
        description: "Content for the about page",
      },
    },
  ],
};
