// storage-adapter-import-placeholder
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { payloadCloudPlugin } from "@payloadcms/payload-cloud";
import {
  lexicalEditor,
  FixedToolbarFeature,
  BoldFeature,
  ItalicFeature,
  UnderlineFeature,
  InlineToolbarFeature,
  OrderedListFeature,
  UnorderedListFeature,
  HeadingFeature,
  ParagraphFeature,
  StrikethroughFeature,
  SubscriptFeature,
  SuperscriptFeature,
  ChecklistFeature,
  LinkFeature,
  BlockquoteFeature,
  UploadFeature,
  TextStateFeature,
  BlocksFeature,
  defaultColors,
} from "@payloadcms/richtext-lexical";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import sharp from "sharp";

import { Users } from "./collections/Users";
import { TechStackIcons } from "./collections/TechStackIcons";
import { Media } from "./collections/Media";
import { Projects } from "./collections/Projects";
import { Tags } from "./collections/Tags";
import { Nav } from "./globals/Nav";
import { LandingPageContent } from "./globals/LandingPageContent";
import { Blogs } from "./collections/Blogs";
import { CodeBlock } from "./blocks/CodeBlock";
import { Callout } from "./blocks/Callout";
const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, TechStackIcons, Media, Blogs, Projects, Tags],
  globals: [Nav, LandingPageContent],
  editor: lexicalEditor({
    features: ({}) => [
      FixedToolbarFeature(),
      InlineToolbarFeature(),
      OrderedListFeature(),
      UnorderedListFeature(),
      BoldFeature(),
      ItalicFeature(),
      UnderlineFeature(),
      HeadingFeature(),
      ParagraphFeature(),
      StrikethroughFeature(),
      SubscriptFeature(),
      SuperscriptFeature(),
      ChecklistFeature(),
      LinkFeature(),
      BlockquoteFeature(),
      UploadFeature(),
      TextStateFeature({
        state: {
          color: {
            ...defaultColors.text,
            ...defaultColors.background,
          },
        },
      }),
      BlocksFeature({
        blocks: [CodeBlock, Callout],
      }),
    ],
  }),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || "",
    },
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],
});
