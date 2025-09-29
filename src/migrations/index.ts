import * as migration_20250926_194546_initial from "./20250926_194546_initial";
import * as migration_20250927_191734_remove_sub_menu_item from "./20250927_191734_remove_sub_menu_item";
import * as migration_20250929_140037_callout_block_textArea_to_richText from "./20250929_140037_callout_block_textArea_to_richText";

export const migrations = [
  {
    up: migration_20250926_194546_initial.up,
    down: migration_20250926_194546_initial.down,
    name: "20250926_194546_initial",
  },
  {
    up: migration_20250927_191734_remove_sub_menu_item.up,
    down: migration_20250927_191734_remove_sub_menu_item.down,
    name: "20250927_191734_remove_sub_menu_item",
  },
  {
    up: migration_20250929_140037_callout_block_textArea_to_richText.up,
    down: migration_20250929_140037_callout_block_textArea_to_richText.down,
    name: "20250929_140037_callout_block_textArea_to_richText",
  },
];
