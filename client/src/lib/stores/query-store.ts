// src/lib/query.ts
import { writable, get, type Readable } from 'svelte/store';

type QueryKey = string | unknown[];

function serializeKey(key: QueryKey) {
	return typeof key === 'string' ? key : JSON.stringify(key);
}

export type QueryState<T> = {
	data: T | null;
	error: unknown | null;
	isLoading: boolean;
	updatedAt: number; // ms timestamp
	// methods included so $q.refresh() works in Svelte templates
	refresh: () => Promise<void>;
	invalidate: () => void;
};

export type QueryOptions = {
	staleTime?: number; // ms: consider data fresh for this many ms
	cacheTime?: number; // ms: how long to keep cache after last unsubscribe
	initialData?: unknown;
	enabled?: boolean;
};

type CacheEntry<T> = {
	store: Readable<QueryState<T>> & {
		refresh: () => Promise<void>;
		invalidate: () => void;
		remove: () => void; // hard remove from cache
	};
	writableStore: ReturnType<typeof writable<QueryState<T>>>;
	fetchPromise?: Promise<void> | null;
	lastTouched: number;
	evictionTimer?: ReturnType<typeof setTimeout> | null;
};

const globalCache = new Map<string, CacheEntry<any>>();

export function createQuery<T = unknown>(
	queryKey: QueryKey,
	queryFn: () => Promise<T>,
	options?: QueryOptions
): Readable<QueryState<T>> & {
	refresh: () => Promise<void>;
	invalidate: () => void;
	remove: () => void;
} {
	const {
		staleTime = 0,
		cacheTime = 1000 * 60 * 1, // 1 minute
		initialData = null,
		enabled = true
	} = options || {};
	const key = serializeKey(queryKey);

	// If already cached, return that entry
	const existing = globalCache.get(key) as CacheEntry<T> | undefined;
	if (existing) {
		// touch to prevent eviction until later
		existing.lastTouched = Date.now();
		if (existing.evictionTimer) {
			clearTimeout(existing.evictionTimer);
			existing.evictionTimer = null;
		}
		return existing.store;
	}

	// create writable store and initial state (with placeholder methods)
	const writableStore = writable<QueryState<T>>({
		data: (initialData as T) ?? null,
		error: null,
		isLoading: false,
		updatedAt: initialData ? Date.now() : 0,
		// placeholder functions (will be replaced)
		refresh: async () => {},
		invalidate: () => {}
	});

	// internal cache entry
	const entry: CacheEntry<T> = {
		writableStore,
		store: null as unknown as CacheEntry<T>['store'], // filled below
		fetchPromise: null,
		lastTouched: Date.now(),
		evictionTimer: null
	};

	// fetcher with dedupe
	async function fetchData(force = false): Promise<void> {
		const state = get(writableStore);
		const now = Date.now();

		// if not forced and data is fresh, skip
		if (!force && state.data !== null && now - state.updatedAt < staleTime) {
			return;
		}

		// if fetch in flight, return the same promise
		if (entry.fetchPromise) return entry.fetchPromise;

		writableStore.set({ ...state, isLoading: true, error: null });

		const p = (async () => {
			try {
				const data = await queryFn();
				writableStore.set({
					data,
					error: null,
					isLoading: false,
					updatedAt: Date.now(),
					// functions will be attached after they are defined below; provide placeholders for TS
					refresh: refreshBound,
					invalidate: invalidateBound
				} as QueryState<T>);
			} catch (err) {
				writableStore.set({
					data: null,
					error: err,
					isLoading: false,
					updatedAt: Date.now(),
					refresh: refreshBound,
					invalidate: invalidateBound
				} as QueryState<T>);
			} finally {
				entry.fetchPromise = null;
				entry.lastTouched = Date.now();
			}
		})();

		entry.fetchPromise = p;
		return p;
	}

	// bound methods (declared first to reference in state)
	const refreshBound = async () => {
		return fetchData(true);
	};

	const invalidateBound = () => {
		// clear stored data but keep the store (so subscribers stay)
		writableStore.set({
			data: null,
			error: null,
			isLoading: false,
			updatedAt: 0,
			refresh: refreshBound,
			invalidate: invalidateBound
		});
		// touch to schedule eviction
		scheduleEviction();
	};

	const removeBound = () => {
		// remove from global cache and clear any timers
		const e = globalCache.get(key);
		if (!e) return;
		if (e.evictionTimer) {
			clearTimeout(e.evictionTimer);
			e.evictionTimer = null;
		}
		globalCache.delete(key);
	};

	// create a read-only store object that includes methods
	const storeObject: Readable<QueryState<T>> & {
		refresh: () => Promise<void>;
		invalidate: () => void;
		remove: () => void;
	} = {
		subscribe: writableStore.subscribe,
		refresh: refreshBound,
		invalidate: invalidateBound,
		remove: removeBound
	};

	// save into entry.store and global cache
	entry.store = storeObject as CacheEntry<T>['store'];
	globalCache.set(key, entry);

	// schedule eviction after cacheTime of inactivity
	function scheduleEviction() {
		if (entry.evictionTimer) {
			clearTimeout(entry.evictionTimer);
		}
		if (cacheTime <= 0) return;
		entry.evictionTimer = setTimeout(() => {
			// only evict if no new touch since timer was set
			const e = globalCache.get(key);
			if (!e) return;
			const since = Date.now() - e.lastTouched;
			if (since >= cacheTime) {
				globalCache.delete(key);
				if (e.evictionTimer) {
					clearTimeout(e.evictionTimer);
					e.evictionTimer = null;
				}
			}
		}, cacheTime);
	}

	// wrap subscribe to update lastTouched and cancel eviction while someone is subscribed
	const originalSubscribe = writableStore.subscribe;
	function subscribeWithTouch(run: any, invalidate?: any) {
		// cancel eviction while subscribed
		if (entry.evictionTimer) {
			clearTimeout(entry.evictionTimer);
			entry.evictionTimer = null;
		}
		entry.lastTouched = Date.now();
		const unsub = originalSubscribe((v) => {
			// ensure returned state always contains correct methods so $q.refresh() works
			run({
				...v,
				refresh: refreshBound,
				invalidate: invalidateBound
			});
		}, invalidate);

		return () => {
			unsub();
			entry.lastTouched = Date.now();
			scheduleEviction();
		};
	}

	// replace subscribe on entry.store so consumers get touch behavior
	entry.store = {
		subscribe: subscribeWithTouch,
		refresh: refreshBound,
		invalidate: invalidateBound,
		remove: removeBound
	};

	// do initial fetch if enabled
	if (enabled) {
		// initial fetch but do not force cached-data check (there's no cache yet)
		void fetchData(true);
	}

	return entry.store;
}
