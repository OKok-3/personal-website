import { PaginatedDocs } from "payload";
import { MigrateUpArgs, MigrateDownArgs } from "@payloadcms/db-sqlite";
import { AboutPage, Blog } from "@/payload-types";

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

function isAboutPage(obj: AboutPage | Blog): obj is AboutPage {
  return "profilePicture" in obj;
}

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  // Get all blogs
  const blogs: PaginatedDocs<Blog> = await payload.find({
    collection: "blogs",
    depth: 0,
  });

  // Get the about page
  const aboutPage: AboutPage = await payload.findGlobal({
    slug: "about-page",
    depth: 0,
  });

  // Update the callout blocks textArea to richText
  for (const obj of [...blogs.docs, aboutPage]) {
    let modified = false;

    for (const node of obj.content.root.children) {
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
        if (!isAboutPage(obj)) {
          await payload.update({
            collection: "blogs",
            id: obj.id,
            data: {
              content: obj.content,
            },
            depth: 0,
          });
        } else if (isAboutPage(obj)) {
          await payload.updateGlobal({
            slug: "about-page",
            data: {
              content: obj.content,
            },
          });
        }
      } catch (error) {
        console.error(error);
      }
    }
  }
}

export async function down({}: MigrateDownArgs): Promise<void> {
  // Downward migration is not supported.
}
