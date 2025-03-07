import { spawn } from 'exec-utils';

export async function getEncryptionKey(): Promise<string> {
	const { data, error } = await spawn('security', ['find-generic-password', '-s', 'discord Safe Storage', '-a', 'discord Key', '-w']);
	if (error) {
		throw new Error(`Failed to get Discord encryption key`, {
			cause: error,
		});
	}
	const key = data.trim();
	if (!key) {
		throw new Error('Discord Safe Storage password not found');
	}
	return key;
}
