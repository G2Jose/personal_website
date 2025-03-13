#!/bin/bash

./scripts/sync-from-obsidian.sh

fswatch -o '/Users/georgejose/Library/Mobile Documents/iCloud~md~obsidian/Documents/george/2. Areas/content' |
  xargs -n1 sh scripts/sync-from-obsidian.sh
