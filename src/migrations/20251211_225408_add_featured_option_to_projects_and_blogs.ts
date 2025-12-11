import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`blogs\` ADD \`featured\` integer DEFAULT false NOT NULL;`)
  await db.run(sql`ALTER TABLE \`projects\` ADD \`featured\` integer DEFAULT false NOT NULL;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`blogs\` DROP COLUMN \`featured\`;`)
  await db.run(sql`ALTER TABLE \`projects\` DROP COLUMN \`featured\`;`)
}
