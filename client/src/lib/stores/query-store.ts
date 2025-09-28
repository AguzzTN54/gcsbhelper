import { writable, get, type Readable } from 'svelte/store';

type QueryKey = string | unknown[];

const serializeKey = (key: QueryKey) => {
	return typeof key === 'string' ? key : JSON.stringify(key);
};

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
}

const globalCache = new Map<string, CacheEntry<any>>();

/** Core: createQuery */
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
		queryFn
	} = options;

	const key = serializeKey(queryKey);

	// ✅ Reuse existing cache
	const existing = globalCache.get(key) as CacheEntry<T> | undefined;
	if (existing) {
		existing.lastTouched = Date.now();
		if (existing.evictionTimer) {
			clearTimeout(existing.evictionTimer);
			existing.evictionTimer = null;
		}
		return existing.store;
	}

	// ✅ Initial state
	const writableStore = writable<QueryState<T>>({
		data: (initialData as T) ?? null,
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
		options: { ...options, staleTime, cacheTime, initialData, enabled }
	};

	/** ✅ Core fetcher: only 2 updates emitted */
	const fetchData = async (force = false): Promise<void> => {
		const state = get(writableStore);
		const now = Date.now();
		const entryStaleTime = entry.options.staleTime ?? 0;

		if (!force && state.data !== null && now - state.updatedAt < entryStaleTime) {
			return;
		}
		if (entry.fetchPromise) return entry.fetchPromise;

		// 1️⃣ Update once for loading
		writableStore.set({
			data: state.data,
			error: null,
			isLoading: true,
			updatedAt: state.updatedAt,
			refetch: refetchBound,
			invalidate: invalidateBound
		});

		const p = (async () => {
			try {
				const data = await entry.queryFn();
				// 2️⃣ Update once for success
				writableStore.set({
					data,
					error: null,
					isLoading: false,
					updatedAt: Date.now(),
					refetch: refetchBound,
					invalidate: invalidateBound
				});
			} catch (err) {
				// 2️⃣ Update once for error
				writableStore.set({
					data: null,
					error: err,
					isLoading: false,
					updatedAt: Date.now(),
					refetch: refetchBound,
					invalidate: invalidateBound
				});
			} finally {
				entry.fetchPromise = null;
				entry.lastTouched = Date.now();
			}
		})();

		entry.fetchPromise = p;
		return p;
	};

	// ✅ Bound methods
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

	// ✅ Store object
	const storeObject: Readable<QueryState<T>> & {
		refetch: () => Promise<void>;
		invalidate: () => void;
		remove: () => void;
	} = {
		subscribe: writableStore.subscribe,
		refetch: refetchBound,
		invalidate: invalidateBound,
		remove: removeBound
	};

	entry.store = storeObject;
	globalCache.set(key, entry);

	// ✅ Cache eviction scheduling
	const scheduleEviction = () => {
		if (entry.evictionTimer) {
			clearTimeout(entry.evictionTimer);
		}
		const ct = entry.options.cacheTime ?? cacheTime;
		if (ct <= 0) return;
		entry.evictionTimer = setTimeout(() => {
			const e = globalCache.get(key);
			if (!e) return;
			const since = Date.now() - e.lastTouched;
			if (since >= ct) {
				globalCache.delete(key);
				if (e.evictionTimer) {
					clearTimeout(e.evictionTimer);
					e.evictionTimer = null;
				}
			}
		}, ct);
	};

	// ✅ Touch-aware subscribe
	const originalSubscribe = writableStore.subscribe;
	const subscribeWithTouch = (run: any, invalidate?: any) => {
		if (entry.evictionTimer) {
			clearTimeout(entry.evictionTimer);
			entry.evictionTimer = null;
		}
		entry.lastTouched = Date.now();
		const unsub = originalSubscribe((v) =>
			run({ ...v, refetch: refetchBound, invalidate: invalidateBound })
		);
		return () => {
			unsub();
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

	if (enabled) void fetchData(true);

	return entry.store;
};

/** ✅ Safe useQuery: returns placeholder if createQuery not yet called */
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
