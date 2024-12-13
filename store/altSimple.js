/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Path Utils
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
function getPath(obj, path) {
    let allKeys = getAllKeysFromPath(path);
    let res = obj;
    for (let key of allKeys) {
        if (res === undefined) {
            break;
        }
        res = res[key];
    }
    return res;
}

function setPath(obj, path, value) {
    return setByKey(obj != null ? obj : {}, getAllKeysFromPath(path), value);
}

function setByKey(obj, splittedKeys, value) {
    let key = splittedKeys[0];
    ensureKey(obj, key, splittedKeys[1]);
    let copy = Array.isArray(obj) ? [...obj] : { ...obj };
    if (splittedKeys.length === 1) {
        if (value === undefined) {
            if (Array.isArray(obj)) {
                copy.splice(key, 1);
            } else {
                delete copy[key];
            }
        } else {
            copy[key] = value;
        }
        return copy;
    }
    let newVal = setByKey(obj[key], splittedKeys.slice(1), value);
    obj[key] = newVal;
    return obj;
}

const ARRAY_INDEX = /(.*)\[(\d+)\]/;

function getAllKeysFromPath(path) {
    return path.split('.').flatMap((key) => {
        if (ARRAY_INDEX.test(key)) {
            let res = key.match(ARRAY_INDEX);
            return res.slice(1);
        }
        return [key];
    });
}

function ensureKey(obj, key, nextKey) {
    if (key in obj) {
        return;
    }
    let nextKeyAsInt = parseInt(
        nextKey !== null && nextKey !== undefined ? nextKey : ''
    );
    if (Number.isNaN(nextKeyAsInt)) {
        obj[key] = {};
    } else {
        obj[key] = Array(nextKeyAsInt + 1).fill(undefined);
    }
}

/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Listener Queue
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
class ListenerQueue {
    queue = [];
    isEmpty = () => {
        return this.queue.length === 0;
    };

    empty = () => {
        this.queue.length = 0;
    };

    add = (props) => {
        if (typeof props.listener !== 'function')
            throw new Error('object must have a listener function');
        if (typeof props.level !== 'number')
            throw new Error('object must have a level number');
        this.queue.push(props);
    };

    emit = () => {
        for (let i = 0; i < this.queue.length; i += 1) {
            const currentListener = this.queue[i];
            const currentIsLowest = this.isListenerTheLowestInTheRestOfTheQueue(
                i,
                currentListener
            );

            if (!currentIsLowest) {
                // add the curent to the end of array, this will cause a duplicate
                // example, if [1,2,3], and we are 2,
                // this will will push to the end, and be [1,2,3,2]
                this.queue.push(currentListener);
            } else {
                currentListener.listener(
                    currentListener.value,
                    currentListener.changedKey
                );
            }
        }
    };

    isListenerTheLowestInTheRestOfTheQueue = (
        startingIndex,
        currentListener
    ) => {
        let isLowest = true;
        for (let i = startingIndex; i < this.queue.length; i += 1) {
            if (!isLowest) break;
            if (currentListener.level > this.queue[i].level) isLowest = false;
        }
        return isLowest;
    };
}

/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Atoms
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
const globalListenerQueue = new ListenerQueue();

class Atom {
    listeners = [];
    level = 0;
    numberOfListeners = 0;
    value = null;

    constructor(initialValue, level) {
        this.level = level || 0;
        this.value = initialValue;
    }

    /**
     * Getter Setters
     */
    get = () => {
        if (!this.numberOfListeners) {
            this.listen(() => {})();
        }
        return this.value;
    };

    set = (data) => {
        if (this.value === data) return;
        this.value = data;
        this.notify();
    };

    /**
     * Listeners
     */
    #addListener = (listener, listenerLevel) => {
        const item = {
            listener,
            level: listenerLevel || this.level,
            id: Symbol(),
        };
        this.numberOfListeners = this.listeners.push(item);
        return item.id;
    };

    #makeRemoveListener = (id) => {
        return () => {
            let index = this.listeners.findIndex((x) => x.id === id);
            if (~index) {
                this.listeners.splice(index, 1);
                if (!--this.numberOfListeners && this.off) {
                    this.off();
                }
            }
        };
    };

    listen = (listener, listenerLevel) => {
        const id = this.#addListener(listener, listenerLevel);
        return this.#makeRemoveListener(id);
    };

    subscribe = (listener, listenerLevel) => {
        let unsubscribe = this.listen(listener, listenerLevel);
        listener(this.value);
        return unsubscribe;
    };

    /**
     * Notify
     */
    notify = (changedKey) => {
        let runListenerQueue = globalListenerQueue.isEmpty();

        for (let i = 0; i < this.listeners.length; i += 1) {
            globalListenerQueue.add({
                listener: this.listeners[i].listener,
                level: this.listeners[i].level,
                value: this.value,
                changedKey,
            });
        }

        if (runListenerQueue) {
            globalListenerQueue.emit();
            globalListenerQueue.empty();
        }
    };

    off = () => {};
}

/**
 * Atoms
 */
export let atom = (initialValue, level) => {
    return new Atom(initialValue, level);
};

export function atomDeep(initial = {}) {
    let $deepMap = new Atom(initial);
    $deepMap.setKey = (key, value) => {
        if (getPath($deepMap.value, key) !== value) {
            $deepMap.value = setPath($deepMap.value, key, value);
            $deepMap.notify(key);
        }
    };
    return $deepMap;
}

export let atomMap = (value = {}) => {
    let map = new Atom(value);

    map.setKey = function (key, newValue) {
        if (typeof newValue === 'undefined') {
            if (key in map.value) {
                map.value = { ...map.value };
                delete map.value[key];
                map.notify(key);
            }
        } else if (map.value[key] !== newValue) {
            map.value = {
                ...map.value,
                [key]: newValue,
            };
            map.notify(key);
        }
    };

    return map;
};

/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Add ListenKeys
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
export function listenKeys($store, keys, listener) {
    let keysSet = new Set([...keys, undefined]);
    return $store.listen((value, changed) => {
        if (keysSet.has(changed)) {
            listener(value, changed);
        }
    });
}
