import { defineStore } from 'pinia';
import { StoreId } from '../enums';
import { countersInit } from './utils';
import type { Counters, CountersStore } from './types';

export const useCountersStore = defineStore(StoreId.COUNTERS, () => {
  const dbName = 'countersDatabase';
  const storeName = 'counters';
  const countersStoreId = 'countersId';
  const dbVersion = 1;

  async function getCounters(): Promise<Partial<Counters> | null> {
    try {
      const db = await openCountersDatabase();
      const transaction = db.transaction([storeName], 'readwrite');
      const countersStore = transaction.objectStore(storeName);

      const { counters } = await requestToPromise<CountersStore>(countersStore.get(countersStoreId));

      return counters;
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

      const { counters } = await requestToPromise<CountersStore>(countersStore.get(countersStoreId));

      const updatedCounters: CountersStore = {
        id: countersStoreId,
        counters: { ...counters, ...updatedData },
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

      const object = {
        id: countersStoreId,
        counters: structuredClone(countersInit),
      };

      return await requestToPromise(countersStore.add(object));
    } catch (error) {
      throw Error(`Ошибка ${error} при инициализации стора ${storeName}`);
    }
  }

  function requestToPromise<T>(request: IDBRequest<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(`Ошибка запроса к базе ${dbName}`);
    });
  }

  async function updateNumberOfHands(handCounter: number) {
    const counters = await getCounters();
    let numberOfHands: number | undefined = 0;
    console.log(counters);

    if (counters) {
      numberOfHands = counters.numberOfHands;
    }

    await updateCounters({ numberOfHands: numberOfHands ? numberOfHands + handCounter : handCounter });
  }

  return {
    openCountersDatabase,
    setInitCounters,
    getCounters,
    updateCounters,
    updateNumberOfHands,
  };
});

export * from './types';
