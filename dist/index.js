// src/database.ts
import { Level } from "level";

// src/constants.ts
import os from "node:os";
var DISCORD_LEVELDB_PATH = `${os.homedir()}/Library/Application Support/discord/Local Storage/leveldb`;
var DISCORD_LEVELSDB_TEMP_PATH = `${os.tmpdir()}/discord-leveldb-5b8a3726-f19a-4ab8-8097-d09bf04b6cf8`;
var DISCORD_TOKEN_KEY = "_https://discord.com\0token";

// src/database.ts
import fs from "node:fs/promises";
async function getDiscordRawToken() {
  await copyFolder(DISCORD_LEVELDB_PATH, DISCORD_LEVELSDB_TEMP_PATH);
  const db = new Level(DISCORD_LEVELSDB_TEMP_PATH);
  await db.open();
  try {
    const token = await db.get(DISCORD_TOKEN_KEY);
    if (!token) throw new Error("Token not found");
    return token.replace(/"/g, "").slice(1);
  } finally {
    await db.close();
  }
}
async function copyFolder(fromPath, toPath) {
  await fs.mkdir(toPath, { recursive: true });
  const files = await fs.readdir(fromPath);
  for (const file of files) {
    const from = `${fromPath}/${file}`;
    const to = `${toPath}/${file}`;
    const stats = await fs.stat(from);
    if (stats.isDirectory()) {
      await copyFolder(from, to);
    } else {
      await fs.copyFile(from, to);
    }
  }
}

// src/keychain.ts
import { spawn } from "exec-utils";
async function getEncryptionKey() {
  const { data, error } = await spawn("security", ["find-generic-password", "-s", "discord Safe Storage", "-a", "discord Key", "-w"]);
  if (error) {
    throw new Error(`Failed to get Discord encryption key`, {
      cause: error
    });
  }
  const key = data.trim();
  if (!key) {
    throw new Error("Discord Safe Storage password not found");
  }
  return key;
}

// src/crypto.ts
import crypto from "node:crypto";
var AESCBC_SALT = "saltysalt";
var AESCBC_IV = " ".repeat(16);
var AESCBC_ITERATIONS_MACOS = 1003;
var AESCBC_LENGTH = 16;
var V10_PREFIX = "v10";
var DISCORD_TOKEN_PREFIX = "dQw4w9WgXcQ:";
function decrypt(encryptedValue, password) {
  if (!encryptedValue.startsWith(DISCORD_TOKEN_PREFIX)) {
    throw new Error(`Invalid token`);
  }
  const key = crypto.pbkdf2Sync(password, Buffer.from(AESCBC_SALT), AESCBC_ITERATIONS_MACOS, AESCBC_LENGTH, "sha1");
  encryptedValue = encryptedValue.replace(DISCORD_TOKEN_PREFIX, "");
  const tokenBytes = Buffer.from(encryptedValue, "base64");
  const prefix = tokenBytes.subarray(0, V10_PREFIX.length).toString();
  if (prefix !== V10_PREFIX) {
    throw new Error(`Invalid prefix: expected "${V10_PREFIX}" but got "${prefix}"`);
  }
  const ciphertext = tokenBytes.subarray(V10_PREFIX.length);
  const decipher = crypto.createDecipheriv("aes-128-cbc", key, Buffer.from(AESCBC_IV));
  decipher.setAutoPadding(false);
  const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return decrypted.toString().trim();
}

// src/utils.ts
function getSystemTimezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

// src/index.ts
async function getDiscordToken() {
  const [rawToken, key] = await Promise.all([getDiscordRawToken(), getEncryptionKey()]);
  return decrypt(rawToken, key);
}
function getDiscorBasedRequestHeaders() {
  const superProperties = Buffer.from(
    JSON.stringify({
      os: "Mac OS X",
      browser: "Discord Client",
      release_channel: "stable",
      client_version: "0.0.340",
      os_version: "24.3.0",
      os_arch: "arm64",
      app_arch: "arm64",
      system_locale: "en-US",
      has_client_mods: false,
      browser_user_agent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) discord/0.0.340 Chrome/130.0.6723.191 Electron/33.4.0 Safari/537.36",
      browser_version: "33.4.0",
      os_sdk_version: "24",
      client_build_number: 375018,
      native_build_number: null,
      client_event_source: null
    })
  ).toString("base64");
  return {
    Accept: "*/*",
    Origin: "https://discord.com",
    "Accept-Language": "en-US",
    "X-Debug-Options": "bugReporterEnabled",
    Connection: "keep-alive",
    Referer: "https://discord.com/",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) discord/0.0.340 Chrome/130.0.6723.191 Electron/33.4.0 Safari/537.36",
    "X-Discord-Locale": "en-US",
    "X-Discord-Timezone": getSystemTimezone(),
    "X-Super-Properties": superProperties,
    "sec-ch-ua": 'Not?A_Brand";v="99", "Chromium";v="130"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "macOS"
  };
}
export {
  getDiscorBasedRequestHeaders,
  getDiscordToken
};
