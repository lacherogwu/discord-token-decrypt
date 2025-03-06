import { Level } from 'level';
import { DISCORD_LEVELDB_PATH, DISCORD_LEVELSDB_TEMP_PATH, DISCORD_TOKEN_KEY } from './constants';
import fs from 'node:fs/promises';

export async function getDiscordRawToken() {
	// TODO: maybe implement folder caching instead of copied every time using hash
	await copyFolder(DISCORD_LEVELDB_PATH, DISCORD_LEVELSDB_TEMP_PATH);

	const db = new Level(DISCORD_LEVELSDB_TEMP_PATH);
	await db.open();

	try {
		const token = await db.get(DISCORD_TOKEN_KEY);
		if (!token) throw new Error('Token not found');
		return token.replace(/"/g, '').slice(1);
	} finally {
		await db.close();
	}
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
