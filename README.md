# discord-token-decrypt

A Node.js package for retrieving and decrypting Discord token on macOS. This utility allows you to programmatically access your Discord token for automation, testing, or API integration purposes.

## Description

`discord-token-decrypt` provides a simple API to access the encrypted Discord token from the local Discord installation on macOS. It handles all the complexity of:

- Accessing the Discord LevelDB database
- Retrieving the encryption key from macOS Keychain
- Decrypting the token using Discord's encryption algorithm

## Installation

### NPM

```bash
npm i discord-token-decrypt
```

### GitHub

```bash
npm i https://github.com/lacherogwu/discord-token-decrypt
```

## Requirements

- macOS (this package is not compatible with Windows or Linux)
- Node.js 16 or higher
- Discord desktop application installed on the system
- You must be logged in to Discord on your desktop application

## Usage

```typescript
import { getDiscordToken } from 'discord-token-decrypt';

// Get the Discord token
const token = await getDiscordToken();
console.log(token);

// You can now use this token for Discord API calls
```

## API

### `getDiscordToken(): Promise<string>`

Retrieves and decrypts your Discord authentication token.

- **Returns:**
  - Promise resolving to a string containing your Discord token

## How It Works

This package works by:

1. Copying Discord's LevelDB database to a temporary location
2. Retrieving the raw encrypted token from the database
3. Getting the encryption key from macOS Keychain
4. Decrypting the token using the appropriate algorithm

## Security Notice

Your Discord token grants full access to your Discord account. Never share your token with others or include it in any public code repositories. This tool is intended for personal automation use only.

## License

MIT
