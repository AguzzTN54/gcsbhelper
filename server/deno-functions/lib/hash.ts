const SECRET_KEY = Deno.env.get('SUPER_SECRET') ?? 'super-secret';

const toUint8 = (str: string): Uint8Array => {
  return new TextEncoder().encode(str);
};

const base64urlEncode = (bytes: ArrayBuffer): string => {
  return btoa(String.fromCharCode(...new Uint8Array(bytes)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

export const createToken = async (): Promise<string> => {
  const expires = Date.now() + 60_000 * 5; // valid for 5 minute
  const payload = `${expires}`;

  const key = await crypto.subtle.importKey('raw', toUint8(SECRET_KEY), { name: 'HMAC', hash: 'SHA-256' }, false, [
    'sign',
  ]);

  const sig = await crypto.subtle.sign('HMAC', key, toUint8(payload));
  return `${payload}.${base64urlEncode(sig)}`;
};

export const verifyToken = async (token: string): Promise<boolean> => {
  const [payload, sigB64] = token.split('.');
  if (!payload || !sigB64) return false;
  if (Date.now() > parseInt(payload)) return false;

  const key = await crypto.subtle.importKey('raw', toUint8(SECRET_KEY), { name: 'HMAC', hash: 'SHA-256' }, false, [
    'verify',
  ]);

  const sigBytes = Uint8Array.from(atob(sigB64.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0));
  return await crypto.subtle.verify('HMAC', key, sigBytes, toUint8(payload));
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

