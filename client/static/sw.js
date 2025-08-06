self.addEventListener('push', (event) => {
	const { url, body, icon: icn, title } = event.data?.json() ?? {};
	const cdn = 'https://imagecdn.wishsimulator.app/cb';
	const icon = icn.id && icn.slug ? `${cdn}/${icn.id}/${icn.slug}&w=200&h=200&fit=cover` : icn.href;
	event.waitUntil(
		self.registration.showNotification(title || 'Notification', {
			data: url,
			body,
			icon,
			image: cdn + '/nqzqyrt3/GC-arcade-header-diwali-9.png&w=512&h=256&fit=cover',
			badge: 'https://cdn.qwiklabs.com/X46FrQX4iLxHW5MxL8jICvgZM0evMEKscCeQO%2BazGdo%3D',
			vibrate: [200, 100, 200],
			actions: [{ action: 'Detail', title: 'Game ON!' }]
		})
	);
});

self.addEventListener('notificationclick', (event) => {
	event.notification.close();
	event.waitUntil(clients.openWindow(event.notification.data));
});
