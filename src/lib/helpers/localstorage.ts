export const storageLocal = {
	getData() {
		const data = localStorage.getItem('GCSB_Helper');
		if (!data) return { data: {} };
		const parsed = JSON.parse(data);
		return parsed;
	},

	get(key: string) {
		const { data } = this.getData();
		return data[key] || {};
	},

	set(key: string, value: unknown) {
		const { data } = this.getData();
		data[key] = value;
		localStorage.setItem('GCSB_Helper', JSON.stringify({ data }));
	}
};

export const accounts = {
	getAll(type = 'arcade') {
		const items = storageLocal.get(type);
		return Array.isArray(items) ? items : [];
	},

	getByID(profileID: string, type = 'arcade') {
		const accounts = this.getAll(type);
		const selected = accounts.find(({ profileID: id }) => profileID === id);
		return selected;
	},

	put({ profileID, name }: { profileID: string; name: string }, type: string = 'arcade') {
		const accounts = this.getAll(type);
		const isIndexed = accounts.findIndex(({ profileID: id }) => profileID === id);

		if (isIndexed > -1) accounts[isIndexed].name = name;
		else accounts.push({ profileID, name });
		storageLocal.set(type, accounts);
	},

	delete(profileID: string, type = 'arcade') {
		const accounts = this.getAll(type);
		const removed = accounts.filter(({ profileID: id }) => profileID !== id);
		storageLocal.set(type, removed);
	}
};

export const localConfig = {
	get(key: string) {
		const config = storageLocal.get('config');
		const isValue = config[key] !== null;
		return isValue ? config[key] : null;
	},
	set(key: string, value: unknown) {
		const config = storageLocal.get('config');
		config[key] = value;
		storageLocal.set('config', config);
	}
};
