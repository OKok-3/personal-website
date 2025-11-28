import * as migration_20250926_194546_initial from './20250926_194546_initial';
import * as migration_20250927_191734_remove_sub_menu_item from './20250927_191734_remove_sub_menu_item';
import * as migration_20250929_140037_callout_block_textArea_to_richText from './20250929_140037_callout_block_textArea_to_richText';
import * as migration_20251103_025002 from './20251103_025002';
import * as migration_20251127_220942_add_project_showcase_link from './20251127_220942_add_project_showcase_link';

export const migrations = [
  {
    up: migration_20250926_194546_initial.up,
    down: migration_20250926_194546_initial.down,
    name: '20250926_194546_initial',
  },
  {
    up: migration_20250927_191734_remove_sub_menu_item.up,
    down: migration_20250927_191734_remove_sub_menu_item.down,
    name: '20250927_191734_remove_sub_menu_item',
  },
  {
    up: migration_20250929_140037_callout_block_textArea_to_richText.up,
    down: migration_20250929_140037_callout_block_textArea_to_richText.down,
    name: '20250929_140037_callout_block_textArea_to_richText',
  },
  {
    up: migration_20251103_025002.up,
    down: migration_20251103_025002.down,
    name: '20251103_025002',
  },
  {
    up: migration_20251127_220942_add_project_showcase_link.up,
    down: migration_20251127_220942_add_project_showcase_link.down,
    name: '20251127_220942_add_project_showcase_link'
  },
];
