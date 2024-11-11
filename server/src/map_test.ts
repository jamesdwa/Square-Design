import * as assert from 'assert';
import { createMutableMap, MutableMap } from './map';

// TODO (5e): copy over your mutable map tests from HW7
//            add tests for the function that gets all the keys in the map

describe('MutableMap', function() {
    let map: MutableMap<string, number>;

    beforeEach(() => map = createMutableMap<string, number>());

    describe('hasKey', function() {

        // base case, 0 recursive calls
        it('should return false for a key', function() {
            assert.strictEqual(map.hasKey('a'), false);
            assert.strictEqual(map.hasKey('b'), false);
        });

        // base case, 0 recursive calls
        it('returns true for a key', function() {
            map.setValue('a', 1);
            assert.strictEqual(map.hasKey('a'), true);
            assert.strictEqual(map.hasKey('b'), false);
        });

        // 1 recursive calls
        it('returns true or false for keys in the map', function() {
            map.setValue('a', 1);
            map.setValue('b', 2);
            assert.strictEqual(map.hasKey('a'), true);
            assert.strictEqual(map.hasKey('b'), true);
            assert.strictEqual(map.hasKey('c'), false);
        });
        
        // 2+ recursive calls
        it('returns true or false for keys in the map', function() {
            map.setValue('a', 1);
            map.setValue('b', 2);
            map.setValue('c', 3);
            map.setValue('d', 4);
            assert.strictEqual(map.hasKey('a'), true);
            assert.strictEqual(map.hasKey('b'), true);
            assert.strictEqual(map.hasKey('c'), true);
            assert.strictEqual(map.hasKey('d'), true);
            assert.strictEqual(map.hasKey('e'), false);
        });
    });

    describe('getValue', function() {

        // base case, 0 recursive calls
        it('returns undefined for a key', function() {
            assert.strictEqual(map.getValue('a'), undefined);
            assert.strictEqual(map.getValue('b'), undefined);
        });

        // base case, 0 recursive calls
        it('returns the value for a key', function() {
            map.setValue('a', 1);
            assert.strictEqual(map.getValue('a'), 1);
            assert.strictEqual(map.getValue('b'), undefined);
        });

        // 1 recursive call
        it('should return the value for keys', function() {
            map.setValue('a', 1);
            map.setValue('b', 2);
            assert.strictEqual(map.getValue('a'), 1);
            assert.strictEqual(map.getValue('b'), 2);
            assert.strictEqual(map.getValue('c'), undefined);
        });

        // 2+ recursive calls
        it('returns the value for keys', function() {
            map.setValue('a', 1);
            map.setValue('b', 2);
            map.setValue('c', 3);
            map.setValue('d', 4);
            assert.strictEqual(map.getValue('a'), 1);
            assert.strictEqual(map.getValue('b'), 2);
            assert.strictEqual(map.getValue('c'), 3);
            assert.strictEqual(map.getValue('d'), 4);
            assert.strictEqual(map.getValue('e'), undefined);
        });
    });

    describe('setValue', function() {

        // 0 recursive calls
        it('adds a new key-value pair', function() {
            assert.strictEqual(map.setValue('a', 1), false);
            assert.strictEqual(map.getValue('a'), 1);
        });

        // 0 recursive calls
        it('replaces the value of the current key', function() {
            map.setValue('a', 1);
            assert.strictEqual(map.setValue('a', 2), true);
            assert.strictEqual(map.getValue('a'), 2);
        });

        // 1 recursive calls
        it('adds/update key-value pairs', function() {
            map.setValue('a', 1);
            map.setValue('b', 2);
            assert.strictEqual(map.setValue('a', 3), true);
            assert.strictEqual(map.setValue('b', 4), true);
            assert.strictEqual(map.setValue('c', 5), false);
            assert.strictEqual(map.getValue('a'), 3);
            assert.strictEqual(map.getValue('b'), 4);
            assert.strictEqual(map.getValue('c'), 5);
        });

        // 2+ recursive calls
        it('adds/update key-value pairs', function() {
            map.setValue('a', 1);
            map.setValue('b', 2);
            map.setValue('c', 3);
            map.setValue('d', 4);
            assert.strictEqual(map.setValue('a', 5), true);
            assert.strictEqual(map.setValue('b', 6), true);
            assert.strictEqual(map.setValue('c', 7), true);
            assert.strictEqual(map.setValue('d', 8), true);
            assert.strictEqual(map.setValue('e', 9), false);
            assert.strictEqual(map.getValue('a'), 5);
            assert.strictEqual(map.getValue('b'), 6);
            assert.strictEqual(map.getValue('c'), 7);
            assert.strictEqual(map.getValue('d'), 8);
            assert.strictEqual(map.getValue('e'), 9);
        });
    });

    describe('clear', function() {
        
        // 0 recursive calls
        it('removes all key-value pairs', function() {
            map.clear();
            assert.strictEqual(map.hasKey('a'), false);
            assert.strictEqual(map.hasKey('b'), false);
        });

        // 1 recursive calls
        it('removes all key-value pairs', function() {
            map.setValue('a', 1);
            map.clear();
            assert.strictEqual(map.hasKey('a'), false);
        });

        // 2+ recursive calls
        it('removes all key-value pairs', function() {
            map.setValue('a', 1);
            map.setValue('b', 2);
            map.setValue('c', 3);
            map.clear();
            assert.strictEqual(map.hasKey('a'), false);
            assert.strictEqual(map.hasKey('b'), false);
            assert.strictEqual(map.hasKey('c'), false);
        });
    });

    describe('getKeys', function() {
        it('empty array for an empty map', function() {
            assert.deepStrictEqual(map.getKeys(), []);
        });

        it('array with one key-value pair', function() {
            map.setValue('a', 1);
            assert.deepStrictEqual(map.getKeys(), ['a']);
        });

        it('array with multiple key-value pairs', function() {
            map.setValue('a', 1);
            map.setValue('b', 2);
            map.setValue('c', 3);
            assert.deepStrictEqual(map.getKeys(), ['a', 'b', 'c']);
        });

        it('updated array with the correct keys', function() {
            map.setValue('a', 1);
            map.setValue('b', 2);
            map.setValue('c', 3);
            map.setValue('a', 4);
            map.setValue('d', 5);
            assert.deepStrictEqual(map.getKeys(), ['a', 'b', 'c', 'd']);
        });
        
        it('empty array after clear method', function() {
            map.setValue('a', 1);
            map.setValue('b', 2);
            map.clear();
            assert.deepStrictEqual(map.getKeys(), []);
        });
    });
});