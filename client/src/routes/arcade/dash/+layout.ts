import { goto } from '$app/navigation';
import { isValidUUID } from '$lib/helpers/uuid';
import lstorage from '$lib/helpers/localstorage';

export const ssr = false;
export const csr = true;
export const load = async () => {
	const { uuid, facilitator } = lstorage.get('active') || {};
	const isvalidId = isValidUUID(uuid || '');
	if (!uuid || !isvalidId) return goto('/arcade');
	return { uuid, facilitator };
};
