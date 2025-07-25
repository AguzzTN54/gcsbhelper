import { PUBLIC_API_SERVER, PUBLIC_VAPID_KEY } from '$env/static/public';

const subscribe = async (registration: ServiceWorkerRegistration, token: string) => {
	try {
		const subscription = await registration.pushManager.subscribe({
			applicationServerKey: PUBLIC_VAPID_KEY,
			userVisibleOnly: true
		});

		await fetch(PUBLIC_API_SERVER + '/api/subscribe', {
			method: 'POST',
			body: JSON.stringify(subscription),
			headers: { 'x-subscribe-token': token }
		});

		console.log('Subscribed:', subscription);
		return subscription;
	} catch (e) {
		console.error('failed to subscribe', { cause: e });
		return null;
	}
};

export const notifyme = async (token: string): Promise<PushSubscription | null> => {
	if (!token) return null;
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
			const sub = await subscribe(registration, token);
			resolve(sub);
		});
	});
};

export const disableNotifications = async () => {
	const subscription = await getSubscription();
	if (subscription) {
		await subscription.unsubscribe();
		console.log('Unsubscribed');
	} else {
		console.log('No active subscription.');
	}
};

export const getSubscription = async () => {
	const registration = await navigator.serviceWorker.ready;
	const subscription = await registration.pushManager.getSubscription();
	return subscription;
};
