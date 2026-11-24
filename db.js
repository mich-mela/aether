/**
 * AETHER_DATABASE — Core IndexedDB Service Module
 * Handles initialization, upgrades, CRUD, indexed queries, search, and error resilience.
 */

import { DB_NAME, DB_VERSION, STORE_DEFINITIONS } from './schema.js';

let dbPromise = null;

export function isIndexedDbAvailable() {
  return typeof window !== 'undefined' && 'indexedDB' in window && window.indexedDB !== null;
}

export function initDatabase() {
  if (!isIndexedDbAvailable()) {
    return Promise.reject(
      new Error('IndexedDB is unavailable in this browser mode (e.g., restricted private browsing). Local accounts and progress cannot be saved.')
    );
  }

  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      for (const def of STORE_DEFINITIONS) {
        let store;
        if (!db.objectStoreNames.contains(def.name)) {
          store = db.createObjectStore(def.name, def.options);
        } else {
          store = event.target.transaction.objectStore(def.name);
        }
        for (const idx of def.indexes || []) {
          if (!store.indexNames.contains(idx.name)) {
            store.createIndex(idx.name, idx.keyPath, idx.options);
          }
        }
      }
    };

    request.onsuccess = () => {
      const db = request.result;
      db.onversionchange = () => {
        db.close();
        dbPromise = null;
      };
      resolve(db);
    };

    request.onerror = () => {
      dbPromise = null;
      reject(new Error(`Failed to open ${DB_NAME}: ${request.error?.message || 'Unknown IndexedDB error'}`));
    };

    request.onblocked = () => {
      reject(new Error(`${DB_NAME} upgrade is blocked by another open tab. Please close other AETHER tabs and reload.`));
    };
  });

  return dbPromise;
}

async function runTransaction(storeName, mode, operation) {
  const db = await initDatabase();
  return new Promise((resolve, reject) => {
    let tx;
    try {
      tx = db.transaction(storeName, mode);
    } catch (err) {
      reject(new Error(`Transaction failed on "${storeName}": ${err.message}`));
      return;
    }

    const store = tx.objectStore(storeName);
    let resultValue;

    tx.oncomplete = () => resolve(resultValue);
    tx.onerror = () => reject(new Error(`IndexedDB error on "${storeName}": ${tx.error?.message || 'Transaction error'}`));
    tx.onabort = () => reject(new Error(`IndexedDB transaction aborted on "${storeName}": ${tx.error?.message || 'Aborted'}`));

    try {
      const req = operation(store);
      if (req && typeof req === 'object' && 'onsuccess' in req) {
        req.onsuccess = () => {
          resultValue = req.result;
        };
      } else {
        resultValue = req;
      }
    } catch (err) {
      tx.abort();
      reject(err);
    }
  });
}

export function createRecord(storeName, record) {
  return runTransaction(storeName, 'readwrite', (store) => store.add(record));
}

export function putRecord(storeName, record) {
  return runTransaction(storeName, 'readwrite', (store) => store.put(record));
}

export function getRecord(storeName, key) {
  return runTransaction(storeName, 'readonly', (store) => store.get(key));
}

export function getAllRecords(storeName) {
  return runTransaction(storeName, 'readonly', (store) => store.getAll());
}

export function getRecordsByIndex(storeName, indexName, value) {
  return runTransaction(storeName, 'readonly', (store) => store.index(indexName).getAll(value));
}

export function getSingleByIndex(storeName, indexName, value) {
  return runTransaction(storeName, 'readonly', (store) => store.index(indexName).get(value));
}

export function deleteRecord(storeName, key) {
  return runTransaction(storeName, 'readwrite', (store) => store.delete(key));
}

export function clearStore(storeName) {
  return runTransaction(storeName, 'readwrite', (store) => store.clear());
}

export async function searchRecords(storeName, predicate) {
  const all = await getAllRecords(storeName);
  return all.filter(predicate);
}

export async function deleteByIndex(storeName, indexName, value) {
  const matches = await getRecordsByIndex(storeName, indexName, value);
  if (!matches.length) return 0;
  const db = await initDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const keyPath = store.keyPath;
    for (const item of matches) {
      store.delete(item[keyPath]);
    }
    tx.oncomplete = () => resolve(matches.length);
    tx.onerror = () => reject(tx.error || new Error('Batch delete failed'));
  });
}

export async function clearEntireDatabase() {
  const db = await initDatabase();
  const names = Array.from(db.objectStoreNames);
  return new Promise((resolve, reject) => {
    const tx = db.transaction(names, 'readwrite');
    for (const name of names) {
      tx.objectStore(name).clear();
    }
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error || new Error('Failed to clear database'));
  });
}
