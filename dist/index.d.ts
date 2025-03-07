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

export { getDiscorBasedRequestHeaders, getDiscordToken };
