const token = Deno.env.get('PB_TOKEN') || '';
const pbHost = Deno.env.get('PB_HOST') || 'http://localhost:8090';

export const pb = async (
  path: string,
  reqmethod?: 'POST' | 'GET' | 'DELETE' | 'PATCH' | 'PUT',
  payload?: Record<string, unknown> | null,
) => {
  const method = reqmethod || 'GET';
  const res = await fetch(pbHost + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
    ...(payload && method !== 'GET' ? { body: JSON.stringify(payload) } : {}),
  });
  if (!res.ok) throw new Error('PB Error: ' + (await res.text()));
  const data = await res.json();
  return data;
};

