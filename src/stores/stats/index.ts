import { defineStore } from 'pinia';
import { StoreId } from '../enums';
import { statsInit } from './utils';
import type { Stats, StatsStore } from './types';
import type { Counters } from '../counters';

export const useStatsStore = defineStore(StoreId.STATS, () => {
  const dbName = 'statsDatabase';
  const storeName = 'stats';
  const statsStoreId = 'statsId';
  const dbVersion = 1;

  async function getStats(): Promise<Stats | null> {
    try {
      const db = await openStatsDatabase();
      const transaction = db.transaction([storeName], 'readwrite');
      const statsStore = transaction.objectStore(storeName);

      const data = await requestToPromise<StatsStore>(statsStore.get(statsStoreId));

      if (!data) return null;

      return data.stats;
    } catch (error) {
      console.error('Ошибка получения чартов:', error);
      return null;
    }
  }

  async function updateStats(updatedData: Partial<Stats>): Promise<Partial<Stats> | null> {
    try {
      const db = await openStatsDatabase();
      const transaction = db.transaction([storeName], 'readwrite');
      const statsStore = transaction.objectStore(storeName);

      const data = await requestToPromise<StatsStore>(statsStore.get(statsStoreId));

      if (!data) return null

      const updatedStats: StatsStore = {
        id: statsStoreId,
        stats: { ...data.stats, ...updatedData },
      };

      await requestToPromise(statsStore.put(updatedStats));

      return updatedStats.stats;
    } catch (error) {
      console.error(`Ошибка ${error} при обновлении стора ${storeName}`);
      return null;
    }
  }

  async function openStatsDatabase(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName, dbVersion);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(`Ошибка открытия базы ${dbName}`);

      request.onupgradeneeded = async () => {
        const db = request.result;

        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: 'id' });
          await setInitStats();
        }
      };
    });
  }

  async function setInitStats() {
    try {
      const db = await openStatsDatabase();
      const transaction = db.transaction([storeName], 'readwrite');
      const statsStore = transaction.objectStore(storeName);

      const object: StatsStore = {
        id: statsStoreId,
        stats: structuredClone(statsInit),
      };

      return await requestToPromise(statsStore.add(object));
    } catch (error) {
      throw Error(`Ошибка ${error} при инициализации стора ${storeName}`);
    }
  }

  async function setStats(updatedCounters?: Counters) {
    if (!updatedCounters) return;

    const storeStats = await getStats();

    if (!storeStats) return;

    const updatedStats: Stats = {
      numberOfHands: updatedCounters.numberOfHands,
      vpip: updatedCounters.numberOfHands ? updatedCounters.putIntoPot / updatedCounters.numberOfHands * 100 : 0,
      pfr: updatedCounters.numberOfHands ? updatedCounters.preFlopRaises / updatedCounters.numberOfHands * 100 : 0,
      threeBet: updatedCounters.numberOfThreeBetSituations ? updatedCounters.preFlopThreeBets / updatedCounters.numberOfThreeBetSituations * 100 : 0,
      wtsd: updatedCounters.sawFlopTimes ? updatedCounters.sawShowDownTimes / updatedCounters.sawFlopTimes * 100 : 0,
      wmsd: updatedCounters.sawShowDownTimes ? updatedCounters.wonShowDownTimes / updatedCounters.sawShowDownTimes * 100 : 0,
      wwsf: updatedCounters.sawFlopTimes ? updatedCounters.wonShowDownTimes / updatedCounters.sawFlopTimes * 100 : 0,
      foldThreeBetAfterRaising: updatedCounters.numberOfFoldThreeBetsSituations ? updatedCounters.foldPreFlopThreeBets / updatedCounters.numberOfFoldThreeBetsSituations * 100 : 0,
      preFlopSqueeze: updatedCounters.numberOfSqueezeSituations ? updatedCounters.preFlopSqueeze / updatedCounters.numberOfSqueezeSituations * 100 : 0,
    };

    await updateStats(updatedStats);
  }

  function requestToPromise<T>(request: IDBRequest<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(`Ошибка запроса к базе ${dbName}`);
    });
  }

  return {
    openStatsDatabase,
    setInitStats,
    getStats,
    updateStats,
    setStats,
  };
});

export * from './types';
