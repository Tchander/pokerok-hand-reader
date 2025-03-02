import { defineStore } from 'pinia';
import { ref } from 'vue';
import { StoreId } from '../enums';
import { countersInit } from './utils';
import type { Counters, CountersStore } from './types';

export const useCountersStore = defineStore(StoreId.COUNTERS, () => {
  const dbName = 'countersDatabase';
  const storeName = 'counters';
  const countersStoreId = 'countersId';
  const dbVersion = 1;

  const counters = ref<Counters>(structuredClone(countersInit));

  async function getCounters(): Promise<Partial<Counters> | null> {
    try {
      const db = await openCountersDatabase();
      const transaction = db.transaction([storeName], 'readwrite');
      const countersStore = transaction.objectStore(storeName);

      const data = await requestToPromise<CountersStore>(countersStore.get(countersStoreId));

      if (!data) return null;

      return data.counters;
    } catch (error) {
      console.error('Ошибка получения чартов:', error);
      return null;
    }
  }

  async function updateCounters(updatedData: Partial<Counters>): Promise<Partial<Counters> | null> {
    try {
      const db = await openCountersDatabase();
      const transaction = db.transaction([storeName], 'readwrite');
      const countersStore = transaction.objectStore(storeName);

      const data = await requestToPromise<CountersStore>(countersStore.get(countersStoreId));

      if (!data) return null;

      const updatedCounters: CountersStore = {
        id: countersStoreId,
        counters: { ...data.counters, ...updatedData },
      };

      await requestToPromise(countersStore.put(updatedCounters));

      return updatedCounters.counters;
    } catch (error) {
      console.error(`Ошибка ${error} при обновлении стора ${storeName}`);
      return null;
    }
  }

  async function openCountersDatabase(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName, dbVersion);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(`Ошибка открытия базы ${dbName}`);

      request.onupgradeneeded = async () => {
        const db = request.result;

        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: 'id' });
          await setInitCounters();
        }
      };
    });
  }

  async function setInitCounters() {
    try {
      const db = await openCountersDatabase();
      const transaction = db.transaction([storeName], 'readwrite');
      const countersStore = transaction.objectStore(storeName);

      const object: CountersStore = {
        id: countersStoreId,
        counters: structuredClone(countersInit),
      };

      console.log(object);

      return await requestToPromise(countersStore.add(object));
    } catch (error) {
      throw Error(`${error} при инициализации стора ${storeName}`);
    }
  }

  async function setCounters() {
    const storeCounters = await getCounters();

    if (!storeCounters) return;

    const updatedCounters: Counters = {
      numberOfHands: storeCounters.numberOfHands ? storeCounters.numberOfHands + counters.value.numberOfHands : counters.value.numberOfHands,
      sawFlopTimes: storeCounters.sawFlopTimes ? storeCounters.sawFlopTimes + counters.value.sawFlopTimes : counters.value.sawFlopTimes,
      sawTurnTimes: storeCounters.sawTurnTimes ? storeCounters.sawTurnTimes + counters.value.sawTurnTimes : counters.value.sawTurnTimes,
      sawRiverTimes: storeCounters.sawRiverTimes ? storeCounters.sawRiverTimes + counters.value.sawRiverTimes : counters.value.sawRiverTimes,
      wonShowDownTimes: storeCounters.wonShowDownTimes ? storeCounters.wonShowDownTimes + counters.value.wonShowDownTimes : counters.value.wonShowDownTimes,
      sawShowDownTimes: storeCounters.sawShowDownTimes ? storeCounters.sawShowDownTimes + counters.value.sawShowDownTimes : counters.value.sawShowDownTimes,
      preFlopRaises: storeCounters.preFlopRaises ? storeCounters.preFlopRaises + counters.value.preFlopRaises : counters.value.preFlopRaises,
      preFlopThreeBets: storeCounters.preFlopThreeBets ? storeCounters.preFlopThreeBets + counters.value.preFlopThreeBets : counters.value.preFlopThreeBets,
      foldPreFlopThreeBets: storeCounters.foldPreFlopThreeBets ? storeCounters.foldPreFlopThreeBets + counters.value.foldPreFlopThreeBets : counters.value.foldPreFlopThreeBets,
      preFlopSqueeze: storeCounters.preFlopSqueeze ? storeCounters.preFlopSqueeze + counters.value.preFlopSqueeze : counters.value.preFlopSqueeze,
      putIntoPot: storeCounters.putIntoPot ? storeCounters.putIntoPot + counters.value.putIntoPot : counters.value.putIntoPot,
      numberOfSqueezeSituations: storeCounters.numberOfSqueezeSituations ? storeCounters.numberOfSqueezeSituations + counters.value.numberOfSqueezeSituations : counters.value.numberOfSqueezeSituations,
      numberOfThreeBetSituations: storeCounters.numberOfThreeBetSituations ? storeCounters.numberOfThreeBetSituations + counters.value.numberOfThreeBetSituations : counters.value.numberOfThreeBetSituations,
      numberOfFoldThreeBetsSituations: storeCounters.numberOfFoldThreeBetsSituations ? storeCounters.numberOfFoldThreeBetsSituations + counters.value.numberOfFoldThreeBetsSituations : counters.value.numberOfFoldThreeBetsSituations,
    };

    await updateCounters(updatedCounters);

    return updatedCounters;
  }

  async function resetCountersStore(): Promise<void> {
    try {
      const db = await openCountersDatabase();
      const transaction = db.transaction([storeName], 'readwrite');
      const countersStore = transaction.objectStore(storeName);

      const data = await requestToPromise<CountersStore>(countersStore.get(countersStoreId));

      if (!data) return;

      const resetCounters: CountersStore = {
        id: countersStoreId,
        counters: structuredClone(countersInit),
      };

      await requestToPromise(countersStore.put(resetCounters));

      counters.value = structuredClone(countersInit);
    } catch (error) {
      console.error(`Ошибка ${error} при обнулении стора ${storeName}`);
    }
  }

  function resetCounters() {
    counters.value = structuredClone(countersInit);
  }

  function requestToPromise<T>(request: IDBRequest<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(`Ошибка запроса к базе ${dbName}`);
    });
  }

  return {
    counters,
    openCountersDatabase,
    setInitCounters,
    getCounters,
    updateCounters,
    setCounters,
    resetCounters,
    resetCountersStore,
  };
});

export * from './types';
