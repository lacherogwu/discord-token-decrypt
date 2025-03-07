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
 * Retrieves the headers required to make authenticated requests to Discord's API.
 *
 * This function will retrieve the Discord token, generate the super properties, and return
 * the headers required to make authenticated requests to Discord's API.
 *
 * @returns A promise that resolves to an object containing the required headers
 * @throws {Error} If the Discord token cannot be retrieved
 *
 * @example
 * // Get the Discord request headers
 * const headers = await getDiscordRequestHeaders();
 * console.log(headers);
 */
declare function getDiscordRequestHeaders(): Promise<{
    Accept: string;
    Origin: string;
    'Accept-Language': string;
    Authorization: string;
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
}>;

export { getDiscordRequestHeaders, getDiscordToken };
