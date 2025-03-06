import { spawn } from 'node:child_process';

export async function getEncryptionKey(): Promise<string> {
	// TODO: exports exec-utils
	return new Promise((resolve, reject) => {
		const securityProcess = spawn('security', ['find-generic-password', '-s', 'discord Safe Storage', '-a', 'discord Key', '-w']);

		let password = '';
		let errorOutput = '';

		securityProcess.stdout.on('data', data => {
			password += data.toString();
		});

		securityProcess.stderr.on('data', data => {
			errorOutput += data.toString();
		});

		securityProcess.on('close', code => {
			if (code === 0) {
				const trimmedPassword = password.trim();
				if (trimmedPassword) {
					resolve(trimmedPassword);
				} else {
					reject(new Error('Discord Safe Storage password not found'));
				}
			} else {
				reject(new Error(`Failed to get password: ${errorOutput}`));
			}
		});

		securityProcess.on('error', err => {
			reject(new Error(`Failed to spawn security process: ${err.message}`));
		});
	});
}
