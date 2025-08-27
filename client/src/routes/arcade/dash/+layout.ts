import { goto } from '$app/navigation';
import { isValidUUID } from '$lib/helpers/uuid';
import { localAccounts } from '$lib/helpers/localstorage';

export const ssr = false;
export const csr = true;

export const load = async () => {
	const activeUser = localAccounts.getActive();
	const isvalidId = isValidUUID(activeUser?.uuid || '');
	if (!isvalidId) return goto('/arcade');
	return activeUser;
};
