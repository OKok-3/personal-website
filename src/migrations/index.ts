import * as migration_20250926_194546_initial from './20250926_194546_initial';

export const migrations = [
  {
    up: migration_20250926_194546_initial.up,
    down: migration_20250926_194546_initial.down,
    name: '20250926_194546_initial'
  },
];
