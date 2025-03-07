export function getSystemTimezone() {
	return Intl.DateTimeFormat().resolvedOptions().timeZone;
}
