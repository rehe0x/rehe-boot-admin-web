// SimpleIndexedDB.ts

export default class IndexedDB {
  private static instances: Map<string, IndexedDB> = new Map();
  private dbName: string;
  private storeName: string;
  private db: IDBDatabase | null = null;

  private constructor(dbName: string, storeName: string) {
      this.dbName = dbName;
      this.storeName = storeName;
    //   this.init();
  }

  public static async getInstance(dbName: string, storeName: string) {
      const key = `${dbName}-${storeName}`;
      if (!IndexedDB.instances.has(key)) {
        const i = new IndexedDB(dbName, storeName)
        await i.init()
        IndexedDB.instances.set(key, i);
      }
      return IndexedDB.instances.get(key)!;
  }

  private async init(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        const request = indexedDB.open(this.dbName);
        request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(this.storeName)) {
                db.createObjectStore(this.storeName, { keyPath: 'id', autoIncrement: true });
            }
        };
  
        request.onsuccess = () => {
            this.db = request.result;
            resolve();
        };
  
        request.onerror = (event: Event) => {
            console.error('Database error:', (event.target as IDBOpenDBRequest).error);
            reject()
        };
    });
  }

  public async put(data: any): Promise<void> {
      if (!this.db) {
          throw new Error('Database not initialized');
      }

      const transaction = this.db.transaction(this.storeName, 'readwrite');
      const store = transaction.objectStore(this.storeName);
      return new Promise<void>((resolve, reject) => {
          const request = store.put(data);
          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
      });
  }

  public async add(data: any): Promise<any> {
      if (!this.db) {
          throw new Error('Database not initialized');
      }

      const transaction = this.db.transaction(this.storeName, 'readwrite');
      const store = transaction.objectStore(this.storeName);
      return new Promise<any>((resolve, reject) => {
          const request = store.add(data);
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
      });
  }

  public async get(key: IDBValidKey): Promise<any> {
      if (!this.db) {
          throw new Error('Database not initialized');
      }

      const transaction = this.db.transaction(this.storeName);
      const store = transaction.objectStore(this.storeName);
      return new Promise<any>((resolve, reject) => {
          const request = store.get(key);
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
      });
  }

  public async getAll(): Promise<any> {
    if (!this.db) {
        throw new Error('Database not initialized');
    }
    const transaction = this.db.transaction(this.storeName);
    const store = transaction.objectStore(this.storeName);
    return new Promise<any>((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

  public async delete(key: IDBValidKey): Promise<void> {
      if (!this.db) {
          throw new Error('Database not initialized');
      }

      const transaction = this.db.transaction(this.storeName, 'readwrite');
      const store = transaction.objectStore(this.storeName);
      return new Promise<void>((resolve, reject) => {
          const request = store.delete(key);
          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
      });
  }

  public async clear(): Promise<void> {
      if (!this.db) {
          throw new Error('Database not initialized');
      }

      const transaction = this.db.transaction(this.storeName, 'readwrite');
      const store = transaction.objectStore(this.storeName);
      return new Promise<void>((resolve, reject) => {
          const request = store.clear();
          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
      });
  }
}