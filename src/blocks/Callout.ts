import type { Block } from "payload";
import {
  lexicalEditor,
  FixedToolbarFeature,
  BoldFeature,
  ItalicFeature,
  UnderlineFeature,
  InlineToolbarFeature,
  OrderedListFeature,
  UnorderedListFeature,
  ParagraphFeature,
  StrikethroughFeature,
  SubscriptFeature,
  SuperscriptFeature,
  ChecklistFeature,
  LinkFeature,
  BlockquoteFeature,
  UploadFeature,
  TextStateFeature,
  defaultColors,
  IndentFeature,
} from "@payloadcms/richtext-lexical";

const calloutTypes = {
  Info: "info",
  Warning: "warning",
  Error: "error",
  Success: "success",
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
      type: "richText",
      editor: lexicalEditor({
        features: ({}) => [
          FixedToolbarFeature(),
          InlineToolbarFeature(),
          OrderedListFeature(),
          UnorderedListFeature(),
          BoldFeature(),
          ItalicFeature(),
          UnderlineFeature(),
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
        ],
      }),
      required: true,
    },
  ],
};
