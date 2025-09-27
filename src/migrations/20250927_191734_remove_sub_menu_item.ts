import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-sqlite";

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`nav_items_sub_items\`;`);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`nav_items_sub_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	\`path\` text NOT NULL,
  	\`open_in_new_tab\` integer DEFAULT false NOT NULL,
  	\`acl\` text DEFAULT '3' NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`nav_items\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`CREATE INDEX \`nav_items_sub_items_order_idx\` ON \`nav_items_sub_items\` (\`_order\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`nav_items_sub_items_parent_id_idx\` ON \`nav_items_sub_items\` (\`_parent_id\`);`,
  );
}
