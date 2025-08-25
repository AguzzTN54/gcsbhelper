import { goto } from '$app/navigation';
import { isValidUUID } from '$lib/helpers/uuid';
import lstorage, { localAccounts } from '$lib/helpers/localstorage';

export const ssr = false;
export const csr = true;

export const load = async () => {
	const { uuid, facilitator } = lstorage.get('active') || {};
	const isvalidId = isValidUUID(uuid || '');
	if (!uuid || !isvalidId) return goto('/arcade');
	const activeUser = localAccounts.getByID(uuid);
	if (!activeUser) return goto('/arcade?new');
	if (activeUser.facilitator !== facilitator) {
		lstorage.set('active', { uuid, program: 'arcade', facilitator: activeUser.facilitator });
	}
	return activeUser;
};
