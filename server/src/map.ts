// TODO (Q5): 
//  a) Copy over your mutable map interface from HW7
//  b) Add a function that gets all the keys from the map
//  c) Create a class that implements the interface with a TS Map as its field
//  d) Implement a factory function that creates a new instance of the class

/**
 * Interface for a mutable map that allows checking, getting, and setting key-value pairs.
 * @template K - Type of keys in the map.
 * @template V - Type of values in the map.
 */
export interface MutableMap<K, V> {
    /**
     * Checks if there is a value associated with the given key.
     * @param key The key to check.
     * @returns True if the key exists in the map and false if not.
     */
    hasKey: (key: K) => boolean;
  
    /**
     * Gets the value correlated with the given key.
     * @param key The key to get the value for.
     * @throws Error if there is no such key.
     * @returns The value associated with the key.
     */
    getValue: (key: K) => V | undefined;

    /**
     * Sets a value for a given key in the map and will replace the current value if the pair
     * with the given key already exists.
     * @param key The key to set the value for.
     * @param value The value to set.
     * @returns True if a value was replaced, false otherwise.
     */
    setValue: (key: K, value: V) => boolean;

    /**
     * Clears all pairs from the map.
     * @modifies obj - The map object.
     * @effects obj - The map object is cleared of all key-value pairs.
     */
    clear: () => void;

    /**
     * Returns an array of all keys in the map.
     * @returns An array of keys.
     */
    getKeys: () => Array<string>;
}

/**
 * This class is a TypeScript's built-in Map-based implementation of the TypeMutableMap interface.
 * @template K - The type of keys in the map.
 * @template V - The type of values in the map.
 * @class
 */
class TypeMutableMap<K, V> implements MutableMap<K, V> {
    private map: Map<K, V>;

    /**
     * Creates an instance of TypeMutableMap with no key-value pairs.
     * @constructor
     */
    constructor() {
        this.map = new Map<K, V>();
    }

    /**
     * Abstraction Function:
     * AF(map) = a mutable map with key-value pairs stored in a TypeScript Map object.
     */

    /**
     * Determines if a given key has an associated value in the map.
     * @param key - The key to check for in the map.
     * @returns Returns true if the key exists, false otherwise.
     */
    hasKey = (key: K): boolean => {
        return this.map.has(key);
    }

    /**
     * Retrieves the value associated with a given key.
     * @param key - The key whose associated value is to be retrieved.
     * @returns Returns the value associated with the key, or undefined if the key does not exist.
     */
    getValue = (key: K): V | undefined => {
        return this.map.get(key);
    }

    /**
     * Assigns a value to a given key in the map. If the key already exists, the current value is replaced.
     * @param key - The key for which the value is to be set.
     * @param value - The value to be set for the key.
     * @returns Returns true if a value was replaced, false if a new key-value pair was added.
     */
    setValue = (key: K, value: V): boolean => {
        const keyExists = this.hasKey(key);
        this.map.set(key, value);
        return keyExists;
    }

    /**
     * Removes all key-value pairs from the map.
     */
    clear = (): void => {
        this.map.clear();
    }

    /**
     * Retrieves all the keys from the map.
     * @returns Returns an array containing all keys in the map.
     */
    getKeys = (): Array<string> => {
        return Array.from(this.map.keys()).map(key => String(key));
    }
}

/**
 * Creates a new instance of a MutableMap.
 * @template K - The type of keys in the map.
 * @template V - The type of values in the map.
 * @returns Returns a new instance of MutableMap.
 */
export const createMutableMap = <K, V>(): MutableMap<K, V> => {
    return new TypeMutableMap<K, V>();
};