const token = Deno.env.get('PB_TOKEN') || '';
const pbHost = Deno.env.get('PB_HOST') || 'http://localhost:8090';

export const pb = async (
  path: string,
  reqmethod?: 'POST' | 'GET' | 'DELETE' | 'PATCH' | 'PUT',
  payload?: Record<string, unknown> | null,
) => {
  const method = reqmethod || 'GET';
  const url = pbHost + path.replace(pbHost, '');
  const res = await fetch(url, {
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

export const getAccountToken = async () => {
  try {
    // Get Manager Account
    // const managerURL = new URL(pbHost + '/api/collections/manager/records');
    // managerURL.searchParams.append('filter', `email="gcsb@ekraf.dev"`);
    // const { items = [] } = (await pb(managerURL.href)) || {};
    // const managerId = items?.[0]?.id || '';

    const managerId = Deno.env.get('MANAGER_ID') || '';
    if (!managerId) throw new Error('PB Error: Manager ID not Found');

    // Impersonate as Manager
    const imURL = new URL(pbHost + '/api/collections/manager/impersonate/' + managerId);
    const account = await pb(imURL.href, 'POST', { duration: 3600 }); //1hour
    if (!account.token) throw new Error('Failed to get token for your Manager ID');
    return account.token;
  } catch (e) {
    console.error(e);
    return '';
  }
};
