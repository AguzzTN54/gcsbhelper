const BASE62 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

export const uuidToHex = (uuid: string): string => {
	if (!uuid) return '';
	if (!isValidUUID(uuid)) return '';
	const hex = uuid.replace(/-/g, '');
	const bytes = hexToBytes(hex);
	return encodeBase62(bytes);
};

const hexToBytes = (hex: string): Uint8Array => {
	if (hex.length % 2 !== 0) throw new Error('Invalid hex string');
	const bytes = new Uint8Array(hex.length / 2);
	for (let i = 0; i < hex.length; i += 2) {
		bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
	}
	return bytes;
};

const bytesToHex = (bytes: Uint8Array): string =>
	Array.from(bytes)
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('');

const encodeBase62 = (bytes: Uint8Array): string => {
	let num = BigInt('0x' + bytesToHex(bytes));
	const base = BigInt(BASE62.length);

	let result = '';
	while (num > 0) {
		const rem = Number(num % base);
		result = BASE62[rem] + result;
		num = num / base;
	}
	return result.padStart(22, '0');
};

export const hexToUuid = (base62: string): string => {
	if (!base62) return '';

	const base = BigInt(BASE62.length);
	let num = BigInt(0);

	for (const char of base62) {
		const value = BASE62.indexOf(char);
		if (value === -1) throw new Error(`Invalid character: ${char}`);
		num = num * base + BigInt(value);
	}

	const hex = num.toString(16).padStart(32, '0');
	const transformedUuid = [
		hex.slice(0, 8),
		hex.slice(8, 12),
		hex.slice(12, 16),
		hex.slice(16, 20),
		hex.slice(20)
	].join('-');

	if (isValidUUID(transformedUuid)) return transformedUuid;

	class ParseError extends Error {
		code: string;
		constructor(message: string) {
			super(message);
			this.code = 'PARSE_ERROR';
		}
	}
	throw new ParseError(`PARSE_ERROR: invalid ID ${base62}`);
};

export const isValidUUID = (str?: string): boolean => {
	if (!str) return false;
	return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);
};
