import { getDiscordRawToken } from './database';
import { getEncryptionKey } from './keychain';
import { decrypt } from './crypto';
import { getSystemTimezone } from './utils';

export { makeDiscordKey, withDiscordLocalStorage } from './database';

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

/**
 * Provides HTTP headers that mimic an official Discord client request.
 *
 * This function generates headers similar to those sent by the Discord desktop app,
 * including a properly formatted X-Super-Properties value containing client information
 * and system details encoded in base64.
 *
 * @returns An object containing HTTP headers for Discord API requests
 *
 * @example
 * // Use with fetch to make authenticated Discord API requests
 * const headers = getDiscorBasedRequestHeaders();
 * // Add your authorization token
 * headers.Authorization = `${await getDiscordToken()}`;
 *
 * const response = await fetch('https://discord.com/api/v9/users/@me', {
 *   headers
 * });
 */
export function getDiscorBasedRequestHeaders() {
	const superProperties = Buffer.from(
		JSON.stringify({
			os: 'Mac OS X',
			browser: 'Discord Client',
			release_channel: 'stable',
			client_version: '0.0.340',
			os_version: '24.3.0',
			os_arch: 'arm64',
			app_arch: 'arm64',
			system_locale: 'en-US',
			has_client_mods: false,
			browser_user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) discord/0.0.340 Chrome/130.0.6723.191 Electron/33.4.0 Safari/537.36',
			browser_version: '33.4.0',
			os_sdk_version: '24',
			client_build_number: 375018,
			native_build_number: null,
			client_event_source: null,
		}),
	).toString('base64');

	return {
		Accept: '*/*',
		Origin: 'https://discord.com',
		'Accept-Language': 'en-US',
		'X-Debug-Options': 'bugReporterEnabled',
		Connection: 'keep-alive',
		Referer: 'https://discord.com/',
		'Sec-Fetch-Dest': 'empty',
		'Sec-Fetch-Mode': 'cors',
		'Sec-Fetch-Site': 'same-origin',
		'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) discord/0.0.340 Chrome/130.0.6723.191 Electron/33.4.0 Safari/537.36',
		'X-Discord-Locale': 'en-US',
		'X-Discord-Timezone': getSystemTimezone(),
		'X-Super-Properties': superProperties,
		'sec-ch-ua': 'Not?A_Brand";v="99", "Chromium";v="130"',
		'sec-ch-ua-mobile': '?0',
		'sec-ch-ua-platform': 'macOS',
	};
}
