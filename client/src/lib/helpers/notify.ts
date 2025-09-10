import { PUBLIC_API_SERVER, PUBLIC_VAPID_KEY } from '$env/static/public';
import { createToken } from '$lib/helpers/crypto';

const subscribe = async (registration: ServiceWorkerRegistration) => {
	try {
		const subscription = await registration.pushManager.subscribe({
			applicationServerKey: PUBLIC_VAPID_KEY,
			userVisibleOnly: true
		});

		const token = await createToken();
		const url = new URL(PUBLIC_API_SERVER);
		url.pathname = '/internal/subscribe';
		await fetch(url, {
			method: 'POST',
			body: JSON.stringify(subscription),
			headers: { 'x-arcade-token': token }
		});

		console.log('Subscribed:', subscription);
		return subscription;
	} catch (e) {
		console.error('failed to subscribe', { cause: e });
		return null;
	}
};

export const notifyme = async (): Promise<PushSubscription | null> => {
	return new Promise(async (resolve) => {
		if (!('serviceWorker' in navigator)) {
			console.error('Service workers are not supported.');
			return;
		}

		const permission = await Notification.requestPermission();
		if (permission !== 'granted') {
			console.error('Notification permission not granted.');
			resolve(null);
		}

		navigator.serviceWorker.ready.then(async () => {
			const registration = await navigator.serviceWorker.getRegistration();
			if (!registration) return;
			const sub = await subscribe(registration);
			resolve(sub);
		});
	});
};

export const disableNotifications = async () => {
	const subscription = await getSubscription();
	if (!subscription) {
		console.log('No active subscription.');
		return;
	}

	const token = await createToken();
	const url = new URL(PUBLIC_API_SERVER);
	url.pathname = '/internal/subscribe';

	try {
		await fetch(url, {
			method: 'POST',
			body: JSON.stringify(subscription),
			headers: { 'x-arcade-token': token }
		});
		await subscription.unsubscribe();
		console.log('Unsubscribed');
	} catch (e) {
		console.error(e);
	}
};

export const getSubscription = async () => {
	const registration = await navigator.serviceWorker.ready;
	const subscription = await registration.pushManager.getSubscription();
	return subscription;
};
