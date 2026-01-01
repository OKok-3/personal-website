import type { CollectionConfig } from "payload";

export const CertificationBadges: CollectionConfig = {
  slug: "certificationBadges",
  admin: {
    useAsTitle: "filename",
    description: "Certification badges (e.g., AWS CCP, AZ-900) displayed on the home page",
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => {
      return user?.role === "admin";
    },
    update: ({ req: { user } }) => {
      return user?.role === "admin";
    },
    delete: ({ req: { user } }) => {
      return user?.role === "admin";
    },
  },
  upload: {
    staticDir: "public/certificationBadges",
    crop: false,
    focalPoint: true,
    mimeTypes: ["image/png"],
    imageSizes: [
      {
        name: "badge",
        width: 256,
        height: 256,
        position: "centre",
        fit: "contain",
        formatOptions: {
          format: "png",
        },
      },
    ],
    adminThumbnail: "badge",
    formatOptions: {
      format: "png",
    },
  },
  fields: [
    {
      name: "certificationName",
      label: "Certification Name",
      type: "text",
      required: true,
      admin: {
        description: "Name of the certification (e.g., AWS Certified Cloud Practitioner)",
      },
    },
    {
      name: "issuer",
      label: "Issuing Organization",
      type: "text",
      required: true,
      admin: {
        description: "Organization that issued the certification (e.g., Amazon Web Services)",
      },
    },
    {
      name: "credentialUrl",
      label: "Credential URL",
      type: "text",
      required: false,
      admin: {
        description: "Optional link to verify the certification",
      },
    },
    {
      name: "alt",
      type: "text",
      required: true,
      admin: {
        description: "Alternative text for accessibility",
      },
    },
  ],
};

