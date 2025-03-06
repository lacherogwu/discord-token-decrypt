import { getDiscordRawToken } from './database';
import { getEncryptionKey } from './keychain';
import { decrypt } from './crypto';

/**
 * Retrieves and decrypts the Discord authentication token from the local Discord installation.
 *
 * This function will access the Discord LevelDB database, extract the raw encrypted token,
 * retrieve the encryption key from macOS Keychain, and decrypt the token.
 *
 * @returns A promise that resolves to the decrypted Discord token as a string
 * @throws {Error} If Discord is not installed, if the user is not logged in,
 *                 if access to the database fails, or if decryption fails
 *
 * @example
 * // Get the Discord token
 * const token = await getDiscordToken();
 * console.log(token);
 */
export async function getDiscordToken() {
	const [rawToken, key] = await Promise.all([getDiscordRawToken(), getEncryptionKey()]);
	return decrypt(rawToken, key);
}
