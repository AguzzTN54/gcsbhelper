import pocketbase from 'npm:pocketbase';
const token = Deno.env.get('PB_TOKEN') || '';
const pbHost = Deno.env.get('PB_HOST') || 'http://localhost:8090';

const pbClient = new pocketbase(pbHost);
pbClient.authStore.save(token);
export default pbClient;

export const getAccountToken = async () => {
  try {
    const managerId = Deno.env.get('MANAGER_ID') || '';
    if (!managerId) throw new Error('PB Error: Manager ID not Found');

    // Impersonate as Manager
    const acc = await pbClient.collection('manager').impersonate(managerId, 3600);
    if (!acc.authStore.token) throw new Error('Failed to get token for your Manager ID');
    return acc.authStore.token;
  } catch (e) {
    console.error(e);
    return '';
  }
};
