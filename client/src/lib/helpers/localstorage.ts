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

	getByID(profileid: string, type = 'arcade') {
		const accounts = this.getAll(type);
		const selected = accounts.find(({ profileid: id }) => profileid === id);
		return selected;
	},

	put({ profileid, name }: { profileid: string; name: string }, type: string = 'arcade') {
		const accounts = this.getAll(type);
		const isIndexed = accounts.findIndex(({ profileid: id }) => profileid === id);

		if (isIndexed > -1) accounts[isIndexed].name = name;
		else accounts.push({ profileid, name });
		storageLocal.set(type, accounts);
	},

	delete(profileid: string, type = 'arcade') {
		const accounts = this.getAll(type);
		const removed = accounts.filter(({ profileid: id }) => profileid !== id);
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
