import { GlobalConfig } from "payload";

export const AboutPageContent: GlobalConfig = {
  slug: "about-page",
  access: {
    read: () => true,
    update: ({ req: { user } }) => {
      return user?.role === "0";
    },
  },
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
      name: "shortIntroduction",
      type: "richText",
      required: true,
      admin: {
        description: "Short introduction for the about page",
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
