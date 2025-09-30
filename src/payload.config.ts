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
  IndentFeature,
} from "@payloadcms/richtext-lexical";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import sharp from "sharp";

import { Users } from "./collections/Users";
import { CoverImages } from "./collections/CoverImages";
import { Projects } from "./collections/Projects";
import { Tags } from "./collections/Tags";
import { Media } from "./collections/Media";
import { Nav } from "./globals/Nav";
import { HomePageContent } from "./globals/HomePageContent";
import { AboutPageContent } from "./globals/AboutPageContent";
import { Blogs } from "./collections/Blogs";
import { CodeBlock } from "./blocks/CodeBlock";
import { Callout } from "./blocks/Callout";
import { HorizontalLine } from "./blocks/HorizontalLine";
const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, CoverImages, Blogs, Projects, Tags, Media],
  globals: [Nav, HomePageContent, AboutPageContent],
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
      IndentFeature(),
      TextStateFeature({
        state: {
          color: {
            ...defaultColors.text,
            ...defaultColors.background,
          },
        },
      }),
      BlocksFeature({
        blocks: [CodeBlock, Callout, HorizontalLine],
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
