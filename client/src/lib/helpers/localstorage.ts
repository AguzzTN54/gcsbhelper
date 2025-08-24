import { browser } from '$app/environment';

interface LocalAccountItem {
	uuid: string;
	name: string;
	facilitator: App.FacilitatorRegion;
	avatar: string;
}
interface LStorageData {
	active?: { program?: App.GCPProgram; uuid?: string; facilitator: App.FacilitatorRegion };
	accounts?: Partial<Record<App.GCPProgram, LocalAccountItem[]>>;
}

const getData = (): LStorageData => {
	try {
		const data = localStorage.getItem('gcsbTracker');
		if (!data) return {};
		return JSON.parse(data);
	} catch {
		return {};
	}
};

const lstorage = {
	get<K extends keyof LStorageData>(key: K): LStorageData[K] {
		const data = getData();
		return data[key];
	},

	set<K extends keyof LStorageData>(key: K, value: LStorageData[K]): void {
		if (!browser) return;
		const data = getData();
		data[key] = value;
		localStorage.setItem('gcsbTracker', JSON.stringify(data));
	}
};

export default lstorage;

export const localAccounts = {
	getAll(program: App.GCPProgram = 'arcade'): LocalAccountItem[] {
		const allAccounts = lstorage.get('accounts');
		const accounts = allAccounts?.[program] || [];
		return accounts;
	},

	getByID(uuid: string, program: App.GCPProgram = 'arcade'): LocalAccountItem | undefined {
		const accounts = localAccounts.getAll(program);
		const selected = accounts.find(({ uuid: id }) => uuid === id);
		return selected;
	},

	put(data: LocalAccountItem, program: App.GCPProgram = 'arcade') {
		const { uuid, name } = data || {};
		const allAccounts = lstorage.get('accounts');
		const accounts = allAccounts?.[program] || [];
		const isIndexed = accounts.findIndex(({ uuid: id }) => uuid === id);

		if (isIndexed > -1) accounts[isIndexed].name = name;
		else accounts.push(data);
		const toStore = allAccounts || {};
		toStore[program] = accounts;
		lstorage.set('accounts', toStore);
	},

	delete(uuid: string, program: App.GCPProgram = 'arcade') {
		const allAccounts = lstorage.get('accounts');
		const accounts = allAccounts?.[program] || [];
		const removed = accounts.filter(({ uuid: id }) => uuid !== id);
		const toStore = allAccounts || {};
		toStore[program] = removed;
		lstorage.set('accounts', toStore);
	}
};
