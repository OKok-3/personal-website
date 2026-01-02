import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`certification_badges\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`certification_name\` text NOT NULL,
  	\`issuer\` text NOT NULL,
  	\`issue_date\` text NOT NULL,
  	\`expiration_date\` text,
  	\`is_proctored\` integer DEFAULT false,
  	\`credential_url\` text,
  	\`alt\` text NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`url\` text,
  	\`thumbnail_u_r_l\` text,
  	\`filename\` text,
  	\`mime_type\` text,
  	\`filesize\` numeric,
  	\`width\` numeric,
  	\`height\` numeric,
  	\`focal_x\` numeric,
  	\`focal_y\` numeric,
  	\`sizes_badge_url\` text,
  	\`sizes_badge_width\` numeric,
  	\`sizes_badge_height\` numeric,
  	\`sizes_badge_mime_type\` text,
  	\`sizes_badge_filesize\` numeric,
  	\`sizes_badge_filename\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`certification_badges_updated_at_idx\` ON \`certification_badges\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`certification_badges_created_at_idx\` ON \`certification_badges\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`certification_badges_filename_idx\` ON \`certification_badges\` (\`filename\`);`)
  await db.run(sql`CREATE INDEX \`certification_badges_sizes_badge_sizes_badge_filename_idx\` ON \`certification_badges\` (\`sizes_badge_filename\`);`)
  await db.run(sql`CREATE TABLE \`home_page_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`certification_badges_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`home_page\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`certification_badges_id\`) REFERENCES \`certification_badges\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`home_page_rels_order_idx\` ON \`home_page_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`home_page_rels_parent_idx\` ON \`home_page_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`home_page_rels_path_idx\` ON \`home_page_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`home_page_rels_certification_badges_id_idx\` ON \`home_page_rels\` (\`certification_badges_id\`);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`certification_badges_id\` integer REFERENCES certification_badges(id);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_certification_badges_id_idx\` ON \`payload_locked_documents_rels\` (\`certification_badges_id\`);`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`certification_badges\`;`)
  await db.run(sql`DROP TABLE \`home_page_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	\`cover_images_id\` integer,
  	\`blogs_id\` integer,
  	\`projects_id\` integer,
  	\`tags_id\` integer,
  	\`media_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`cover_images_id\`) REFERENCES \`cover_images\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`blogs_id\`) REFERENCES \`blogs\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`projects_id\`) REFERENCES \`projects\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`tags_id\`) REFERENCES \`tags\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "users_id", "cover_images_id", "blogs_id", "projects_id", "tags_id", "media_id") SELECT "id", "order", "parent_id", "path", "users_id", "cover_images_id", "blogs_id", "projects_id", "tags_id", "media_id" FROM \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_cover_images_id_idx\` ON \`payload_locked_documents_rels\` (\`cover_images_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_blogs_id_idx\` ON \`payload_locked_documents_rels\` (\`blogs_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_projects_id_idx\` ON \`payload_locked_documents_rels\` (\`projects_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_tags_id_idx\` ON \`payload_locked_documents_rels\` (\`tags_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
}
