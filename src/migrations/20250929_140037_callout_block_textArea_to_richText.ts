import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-sqlite";

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

function parseJSONIfNeeded(value: unknown): unknown {
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

export async function up({ db }: MigrateUpArgs): Promise<void> {
  /**
   * Important: This migration must NOT use Payload Local API reads (e.g. payload.find),
   * because Payload queries are generated from the *current* schema. If the schema
   * has since gained new columns (e.g. `blogs.featured`), older migrations will fail
   * against a fresh DB that hasn't applied later migrations yet.
   */

  const { rows: blogs } = await db.run(
    sql`SELECT id, content FROM blogs ORDER BY created_at DESC;`,
  );

  for (const blog of blogs) {
    const row = blog as unknown as Record<string, unknown>;
    const id = Number(row.id);
    const content = parseJSONIfNeeded(row.content) as {
      root?: { children?: unknown };
      [k: string]: unknown;
    };

    if (!content?.root || !Array.isArray(content.root.children)) continue;

    let modified = false;

    for (const node of content.root.children) {
      if (
        node &&
        typeof node === "object" &&
        (node as { type?: unknown }).type === "block" &&
        (node as CalloutBlockNode).fields?.blockType === "callout" &&
        typeof (node as CalloutBlockNode).fields?.content === "string"
      ) {
        (node as CalloutBlockNode).fields.content =
          turnTextAreaToRichTextParagraph(
            (node as CalloutBlockNode).fields.content as string,
          );
        modified = true;
      }
    }

    if (modified) {
      await db.run(
        sql`UPDATE blogs SET content = ${JSON.stringify(content)} WHERE id = ${id};`,
      );
    }
  }

  const { rows: aboutPages } = await db.run(
    sql`SELECT id, content FROM about_page LIMIT 1;`,
  );

  const about = aboutPages[0] as unknown as undefined | Record<string, unknown>;
  if (!about) return;

  const aboutID = Number(about.id);
  const aboutContent = parseJSONIfNeeded(about.content) as {
    root?: { children?: unknown };
    [k: string]: unknown;
  };

  if (!aboutContent?.root || !Array.isArray(aboutContent.root.children)) return;

  let modifiedAbout = false;
  for (const node of aboutContent.root.children) {
    if (
      node &&
      typeof node === "object" &&
      (node as { type?: unknown }).type === "block" &&
      (node as CalloutBlockNode).fields?.blockType === "callout" &&
      typeof (node as CalloutBlockNode).fields?.content === "string"
    ) {
      (node as CalloutBlockNode).fields.content =
        turnTextAreaToRichTextParagraph(
          (node as CalloutBlockNode).fields.content as string,
        );
      modifiedAbout = true;
    }
  }

  if (modifiedAbout) {
    await db.run(
      sql`UPDATE about_page SET content = ${JSON.stringify(aboutContent)} WHERE id = ${aboutID};`,
    );
  }
}

export async function down({}: MigrateDownArgs): Promise<void> {
  // Downward migration is not supported.
}
