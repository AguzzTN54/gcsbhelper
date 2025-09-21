import { browser } from '$app/environment';

interface LocalAccountItem {
	uuid: string;
	name: string;
	avatar: string;
	facilitator?: App.FacilitatorRegion;
	active?: boolean;
}
interface LStorageData {
	accounts?: Partial<Record<App.GCPProgram, LocalAccountItem[]>>;
	arcadeTourComplete?: boolean;
	arcadeUnlistedBadgeTour?: boolean;
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

	_removeActive(program: App.GCPProgram = 'arcade') {
		const allAccounts = lstorage.get('accounts');
		const accounts = allAccounts?.[program] || [];
		const active = accounts.findIndex((a) => a.active);
		if (active < 0) return { allAccounts, accounts };
		delete accounts[active].active;
		return { allAccounts, accounts };
	},

	put(data: LocalAccountItem, program: App.GCPProgram = 'arcade') {
		const { uuid, name, facilitator } = data || {};
		const { accounts, allAccounts } = localAccounts._removeActive(program);
		const isIndexed = accounts.findIndex(({ uuid: id }) => uuid === id);

		if (isIndexed > -1) {
			accounts[isIndexed].name = name;
			accounts[isIndexed].facilitator = facilitator;
			accounts[isIndexed].active = true;
		} else accounts.push({ ...data, active: true });
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
	},

	getActive(program: App.GCPProgram = 'arcade'): LocalAccountItem | undefined {
		const allAccounts = lstorage.get('accounts');
		const accounts = allAccounts?.[program] || [];
		const active = accounts.find((a) => a.active);
		return active;
	}
};
