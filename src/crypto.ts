import crypto from 'node:crypto';

const AESCBC_SALT = 'saltysalt';
const AESCBC_IV = ' '.repeat(16);
const AESCBC_ITERATIONS_MACOS = 1003;
const AESCBC_LENGTH = 16;
const V10_PREFIX = 'v10';
const DISCORD_TOKEN_PREFIX = 'dQw4w9WgXcQ:';

export function decrypt(encryptedValue: string, password: string): string {
	if (!encryptedValue.startsWith(DISCORD_TOKEN_PREFIX)) {
		throw new Error(`Invalid token`);
	}

	const key = crypto.pbkdf2Sync(password, Buffer.from(AESCBC_SALT), AESCBC_ITERATIONS_MACOS, AESCBC_LENGTH, 'sha1');

	encryptedValue = encryptedValue.replace(DISCORD_TOKEN_PREFIX, '');
	const tokenBytes = Buffer.from(encryptedValue, 'base64');

	const prefix = tokenBytes.subarray(0, V10_PREFIX.length).toString();
	if (prefix !== V10_PREFIX) {
		throw new Error(`Invalid prefix: expected "${V10_PREFIX}" but got "${prefix}"`);
	}

	const ciphertext = tokenBytes.subarray(V10_PREFIX.length);
	const decipher = crypto.createDecipheriv('aes-128-cbc', key, Buffer.from(AESCBC_IV));
	decipher.setAutoPadding(false);

	const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);

	return decrypted.toString().trim();
}
