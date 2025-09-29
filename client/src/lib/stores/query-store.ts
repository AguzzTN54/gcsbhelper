// src/lib/query.ts
import { writable, get, type Readable } from 'svelte/store';

type QueryKey = string | unknown[];

const serializeKey = (key: QueryKey) => (typeof key === 'string' ? key : JSON.stringify(key));

export interface QueryState<T> {
	data: T | null;
	error: unknown | null;
	isLoading: boolean;
	updatedAt: number;
	refetch: () => Promise<void>;
	invalidate: () => void;
}

export interface QueryOptions<T = unknown> {
	staleTime?: number;
	cacheTime?: number;
	initialData?: T | null;
	enabled?: boolean;
	queryKey: QueryKey;
	maxRetries?: number;
	queryFn: () => Promise<T>;
}

interface CacheEntry<T> {
	store: Readable<QueryState<T>> & {
		refetch: () => Promise<void>;
		invalidate: () => void;
		remove: () => void;
	};
	writableStore: ReturnType<typeof writable<QueryState<T>>>;
	queryFn: () => Promise<T>;
	fetchPromise?: Promise<void> | null;
	lastTouched: number;
	evictionTimer?: ReturnType<typeof setTimeout> | null;
	options: QueryOptions<T>;
	retryCount: number;
	subscribers: number; // new: track active subscribers
}

const globalCache = new Map<string, CacheEntry<any>>();

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const createQuery = <T = unknown>(
	options: QueryOptions<T>
): Readable<QueryState<T>> & {
	refetch: () => Promise<void>;
	invalidate: () => void;
	remove: () => void;
} => {
	const {
		staleTime = 0,
		cacheTime = 1000 * 60 * 1,
		initialData = null,
		enabled = true,
		queryKey,
		queryFn,
		maxRetries = 3
	} = options;

	const key = serializeKey(queryKey);

	const existing = globalCache.get(key) as CacheEntry<T> | undefined;
	if (existing) {
		existing.lastTouched = Date.now();
		if (existing.evictionTimer) {
			clearTimeout(existing.evictionTimer);
			existing.evictionTimer = null;
		}
		return existing.store;
	}

	const writableStore = writable<QueryState<T>>({
		data: initialData ?? null,
		error: null,
		isLoading: false,
		updatedAt: initialData ? Date.now() : 0,
		refetch: async () => {},
		invalidate: () => {}
	});

	const entry: CacheEntry<T> = {
		writableStore,
		store: null as any,
		queryFn,
		fetchPromise: null,
		lastTouched: Date.now(),
		evictionTimer: null,
		retryCount: 0,
		subscribers: 0,
		options: { ...options, staleTime, cacheTime, initialData, enabled, maxRetries }
	};

	const fetchData = async (force = false): Promise<void> => {
		if (entry.fetchPromise) return entry.fetchPromise;

		const state = get(writableStore);
		const now = Date.now();
		const entryStaleTime = entry.options.staleTime ?? 0;

		if (!force && state.data !== null && now - state.updatedAt < entryStaleTime) {
			return;
		}

		entry.fetchPromise = (async () => {
			writableStore.set({
				data: state.data,
				error: null,
				isLoading: true,
				updatedAt: state.updatedAt,
				refetch: refetchBound,
				invalidate: invalidateBound
			});

			const max = entry.options.maxRetries ?? 3;
			let lastError: unknown = null;

			for (let attempt = 1; attempt <= max; attempt++) {
				try {
					const data = await entry.queryFn();
					writableStore.set({
						data,
						error: null,
						isLoading: false,
						updatedAt: Date.now(),
						refetch: refetchBound,
						invalidate: invalidateBound
					});
					entry.fetchPromise = null;
					return;
				} catch (err) {
					lastError = err;
					if (attempt < max) {
						await sleep(Math.min(1000 * 2 ** (attempt - 1), 30_000));
						continue;
					}
				}
			}

			writableStore.set({
				data: null,
				error: lastError,
				isLoading: false,
				updatedAt: Date.now(),
				refetch: refetchBound,
				invalidate: invalidateBound
			});
			entry.fetchPromise = null;
		})();
		return entry.fetchPromise;
	};

	const refetchBound = async () => fetchData(true);

	const invalidateBound = () => {
		writableStore.set({
			data: null,
			error: null,
			isLoading: false,
			updatedAt: 0,
			refetch: refetchBound,
			invalidate: invalidateBound
		});
		scheduleEviction();
	};

	const removeBound = () => {
		const e = globalCache.get(key);
		if (!e) return;
		if (e.evictionTimer) {
			clearTimeout(e.evictionTimer);
			e.evictionTimer = null;
		}
		globalCache.delete(key);
	};

	const scheduleEviction = () => {
		if (entry.evictionTimer) clearTimeout(entry.evictionTimer);
		const ct = entry.options.cacheTime ?? cacheTime;
		if (ct <= 0) return;

		entry.evictionTimer = setTimeout(() => {
			// Only delete if no active subscribers
			if (entry.subscribers === 0 && Date.now() - entry.lastTouched >= ct) {
				globalCache.delete(key);
				if (entry.evictionTimer) {
					clearTimeout(entry.evictionTimer);
					entry.evictionTimer = null;
				}
			} else {
				// reschedule if there are subscribers
				scheduleEviction();
			}
		}, ct);
	};

	// ✅ Subscriber tracking
	const originalSubscribe = writableStore.subscribe;
	const subscribeWithTouch = (run: any, invalidate?: any) => {
		entry.subscribers++;
		entry.lastTouched = Date.now();
		if (entry.evictionTimer) {
			clearTimeout(entry.evictionTimer);
			entry.evictionTimer = null;
		}

		const unsub = originalSubscribe((v) =>
			run({ ...v, refetch: refetchBound, invalidate: invalidateBound })
		);

		return () => {
			unsub();
			entry.subscribers--;
			entry.lastTouched = Date.now();
			scheduleEviction();
		};
	};

	entry.store = {
		subscribe: subscribeWithTouch,
		refetch: refetchBound,
		invalidate: invalidateBound,
		remove: removeBound
	};

	globalCache.set(key, entry);

	if (enabled) fetchData(true);

	return entry.store;
};

export const useQuery = <T = unknown>(
	queryKey: QueryKey
): Readable<QueryState<T>> & {
	refetch: () => Promise<void>;
	invalidate: () => void;
	remove: () => void;
} => {
	const key = serializeKey(queryKey);
	const entry = globalCache.get(key) as CacheEntry<T> | undefined;

	if (!entry) {
		const emptyStore = writable<QueryState<T>>({
			data: null,
			error: null,
			isLoading: false,
			updatedAt: 0,
			refetch: async () => console.log('no querystore for', key),
			invalidate: () => console.log('no querystore for', key)
		});
		return {
			subscribe: emptyStore.subscribe,
			refetch: async () => console.log('no querystore for', key),
			invalidate: () => console.log('no querystore for', key),
			remove: () => console.log('no querystore for', key)
		};
	}

	entry.lastTouched = Date.now();
	if (entry.evictionTimer) {
		clearTimeout(entry.evictionTimer);
		entry.evictionTimer = null;
	}

	return entry.store;
};
