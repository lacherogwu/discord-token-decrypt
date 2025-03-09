import os from 'node:os';

export const DISCORD_LEVELDB_PATH = `${os.homedir()}/Library/Application Support/discord/Local Storage/leveldb`;
export const DISCORD_TMP_PREFIX = 'discord-leveldb-';
export const DISCORD_KEY_PREFIX = '_https://discord.com\x00\x01';
export const DISCORD_TOKEN_KEY = `${DISCORD_KEY_PREFIX}token`;
