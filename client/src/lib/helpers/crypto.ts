import { PUBLIC_SUPER_SECRET } from '$env/static/public';

// ========================================== STATIC CIPHERTEXT =============================================
const shift = +!+[] + +!+[] + +!+[] + +!+[] + +!+[]; // 5

// This Function is used to create the SECRET_KEY
// const simpleEncrypt = (str: string) => {
// 	const shifted = Array.from(str)
// 		.map((ch) => String.fromCharCode(ch.charCodeAt(0) + shift))
// 		.join('');
// 	return btoa(shifted.split('').reverse().join(''));
// };

const simpleDecrypt = (encoded: string) => {
	const reversed = atob(encoded).split('').reverse().join('');
	return Array.from(reversed)
		.map((ch) => String.fromCharCode(ch.charCodeAt(0) - shift))
		.join('');
};

const token = simpleDecrypt(PUBLIC_SUPER_SECRET);
const toUint8 = (str: string) => new TextEncoder().encode(str);
const base64urlEncode = (bytes: ArrayBuffer): string => {
	return btoa(String.fromCharCode(...new Uint8Array(bytes)))
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/=+$/, '');
};

export const createToken = async (): Promise<string> => {
	const expires = Date.now() + 10_000 * 1; // valid 10 seconds
	const payload = `${expires}`;

	const key = await crypto.subtle.importKey(
		'raw',
		toUint8(token),
		{ name: 'HMAC', hash: 'SHA-256' },
		false,
		['sign']
	);

	const sig = await crypto.subtle.sign('HMAC', key, toUint8(payload));
	return `${payload}.${base64urlEncode(sig)}`;
};

export const sha256 = async (content: string): Promise<string> => {
	const encoder = new TextEncoder();
	const data = encoder.encode(content);
	const hashBuffer = await crypto.subtle.digest('SHA-256', data);

	// Convert buffer to hex string
	return Array.from(new Uint8Array(hashBuffer))
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('');
};

export const shortShaId = async (content: string): Promise<string> => {
	const fullHash = await sha256(content);
	const bigintVal = BigInt('0x' + fullHash);
	const base36 = bigintVal.toString(36);
	return base36.slice(0, 15).padEnd(15, '0');
};

// ============================================= DYNAMIC CIPHERTEXT ============================================
const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const toBase62 = (bytes: Uint8Array<ArrayBuffer>) => {
	let value = BigInt('0x' + [...bytes].map((b) => b.toString(16).padStart(2, '0')).join(''));
	let output = '';
	while (value > 0n) {
		output = alphabet[Number(value % 62n)] + output;
		value /= 62n;
	}
	return output || '0';
};

const fromBase62 = (str: any) => {
	let value = 0n;
	for (const char of str) {
		value = value * 62n + BigInt(alphabet.indexOf(char));
	}
	let hex = value.toString(16);
	if (hex.length % 2) hex = '0' + hex;
	const matches = hex.match(/.{2}/g);
	return Uint8Array.from((matches ?? []).map((byte) => parseInt(byte, 16)));
};

const importAesKey = async (key: string) => {
	const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(key));
	return crypto.subtle.importKey(
		'raw',
		hash, // now 32 bytes
		{ name: 'AES-GCM' },
		false,
		['encrypt', 'decrypt']
	);
};

export const encryptBase62 = async (text: string) => {
	const enc = new TextEncoder().encode(text);
	const cryptoKey = await importAesKey(token);

	const iv = crypto.getRandomValues(new Uint8Array(12));
	const cipher = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, cryptoKey, enc);

	const result = new Uint8Array(iv.byteLength + cipher.byteLength);
	result.set(iv, 0);
	result.set(new Uint8Array(cipher), iv.byteLength);

	return toBase62(result);
};

export const decryptBase62 = async (encoded: string) => {
	const data = fromBase62(encoded);
	const iv = data.slice(0, 12);
	const cipher = data.slice(12);
	const cryptoKey = await importAesKey(token);

	const plainBuffer = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, cryptoKey, cipher);
	return new TextDecoder().decode(plainBuffer);
};
