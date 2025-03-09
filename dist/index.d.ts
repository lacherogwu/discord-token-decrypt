import { Level } from 'level';

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
declare function makeDiscordKey(key: string): string;
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
declare function withDiscordLocalStorage<T = unknown>(cb: (db: Level) => Promise<T>): Promise<T>;

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
declare function getDiscordToken(): Promise<string>;
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
declare function getDiscorBasedRequestHeaders(): {
    Accept: string;
    Origin: string;
    'Accept-Language': string;
    'X-Debug-Options': string;
    Connection: string;
    Referer: string;
    'Sec-Fetch-Dest': string;
    'Sec-Fetch-Mode': string;
    'Sec-Fetch-Site': string;
    'User-Agent': string;
    'X-Discord-Locale': string;
    'X-Discord-Timezone': string;
    'X-Super-Properties': string;
    'sec-ch-ua': string;
    'sec-ch-ua-mobile': string;
    'sec-ch-ua-platform': string;
};

export { getDiscorBasedRequestHeaders, getDiscordToken, makeDiscordKey, withDiscordLocalStorage };
