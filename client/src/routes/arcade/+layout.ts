import { goto } from '$app/navigation';
import { isValidUUID } from '$lib/helpers/uuid';
import { localAccounts } from '$lib/helpers/localstorage';

export const ssr = false;
export const csr = true;
export const load = async ({ url }) => {
	if (url.pathname !== '/arcade') return;

	const newForm = url.searchParams.get('new');
	const isNew = typeof newForm === 'string';
	if (isNew) return; // Load Form to submit new acoount

	const { uuid } = localAccounts.getActive() || {};
	const isvalidId = isValidUUID(uuid || '');
	if (!isvalidId) return;

	// Redirect to dashboard if has valid profileid
	goto('/arcade/dash');
};
