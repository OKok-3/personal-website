import { PaginatedDocs } from "payload";
import { MigrateUpArgs, MigrateDownArgs } from "@payloadcms/db-sqlite";
import type { Blog } from "../payload-types";

type CalloutBlockNode = {
  type: "block";
  version: number;
  format: string;
  fields: {
    id: string;
    type: string;
    title: string;
    content:
      | string
      | {
          root: {
            children: {
              type: string;
              version: number;
            }[];
          };
        };
    blockName: string;
    blockType: "callout";
  };
};

function turnTextAreaToRichTextParagraph(content: string) {
  return {
    root: {
      children: [
        {
          children: [
            {
              detail: 0,
              format: 0,
              mode: "normal",
              style: "",
              text: content,
              type: "text",
              version: 1,
            },
          ],
          direction: null,
          format: "",
          indent: 0,
          type: "paragraph",
          version: 1,
        },
      ],
      direction: null,
      format: "",
      indent: 0,
      type: "root",
      version: 1,
    },
  };
}

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  // Get all blogs
  const blogs: PaginatedDocs<Blog> = await payload.find({
    collection: "blogs",
    depth: 0,
  });

  // Update the callout blocks textArea to richText
  for (const blog of blogs.docs) {
    let modified = false;

    for (const node of blog.content.root.children) {
      if (
        node.type === "block" &&
        (node as CalloutBlockNode).fields?.blockType === "callout" &&
        typeof (node as CalloutBlockNode).fields?.content === "string"
      ) {
        try {
          (node as CalloutBlockNode).fields.content =
            turnTextAreaToRichTextParagraph(
              (node as CalloutBlockNode).fields.content as string,
            );
          modified = true;
        } catch (error) {
          console.error(error);
        }
      }
    }

    if (modified) {
      try {
        await payload.update({
          collection: "blogs",
          id: blog.id,
          data: {
            content: blog.content,
          },
          depth: 0,
        });
      } catch (error) {
        console.error(`Failed to persist blog ${blog.id}:`, error);
      }
    }
  }
}

export async function down({}: MigrateDownArgs): Promise<void> {
  // Downward migration is not supported.
}
