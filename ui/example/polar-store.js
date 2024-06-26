var Z = Object.defineProperty,
    D = Object.defineProperties
var Q = Object.getOwnPropertyDescriptors
var C = Object.getOwnPropertySymbols
var V = Object.prototype.hasOwnProperty,
    Y = Object.prototype.propertyIsEnumerable
var y = (e, t, i) =>
        t in e
            ? Z(e, t, {
                  enumerable: !0,
                  configurable: !0,
                  writable: !0,
                  value: i
              })
            : (e[t] = i),
    o = (e, t) => {
        for (var i in t || (t = {})) V.call(t, i) && y(e, i, t[i])
        if (C) for (var i of C(t)) Y.call(t, i) && y(e, i, t[i])
        return e
    },
    q = (e, t) => D(e, Q(t))
var r = (e, t, i) => (y(e, typeof t != 'symbol' ? t + '' : t, i), i),
    F = (e, t, i) => {
        if (!t.has(e)) throw TypeError('Cannot ' + i)
    }
var A = (e, t, i) => (
        F(e, t, 'read from private field'), i ? i.call(e) : t.get(e)
    ),
    E = (e, t, i) => {
        if (t.has(e))
            throw TypeError('Cannot add the same private member more than once')
        t instanceof WeakSet ? t.add(e) : t.set(e, i)
    }
function L(e, t) {
    let i = b(t),
        n = e
    for (let s of i) {
        if (n === void 0) break
        n = n[s]
    }
    return n
}
function M(e, t, i) {
    return _(e != null ? e : {}, b(t), i)
}
function _(e, t, i) {
    let n = t[0]
    z(e, n, t[1])
    let s = Array.isArray(e) ? [...e] : o({}, e)
    if (t.length === 1)
        return (
            i === void 0
                ? Array.isArray(e)
                    ? s.splice(n, 1)
                    : delete s[n]
                : (s[n] = i),
            s
        )
    let l = _(e[n], t.slice(1), i)
    return (e[n] = l), e
}
var S = /(.*)\[(\d+)\]/
function b(e) {
    return e.split('.').flatMap((t) => (S.test(t) ? t.match(S).slice(1) : [t]))
}
function z(e, t, i) {
    if (t in e) return
    let n = parseInt(i != null ? i : '')
    Number.isNaN(n) ? (e[t] = {}) : (e[t] = Array(n + 1).fill(void 0))
}
var d = class {
    constructor() {
        r(this, 'queue', [])
        r(this, 'isEmpty', () => this.queue.length === 0)
        r(this, 'empty', () => {
            this.queue.length = 0
        })
        r(this, 'add', (t) => {
            if (typeof t.listener != 'function')
                throw new Error('object must have a listener function')
            if (typeof t.level != 'number')
                throw new Error('object must have a level number')
            this.queue.push(t)
        })
        r(this, 'emit', () => {
            for (let t = 0; t < this.queue.length; t += 1) {
                let i = this.queue[t]
                this.isListenerTheLowestInTheRestOfTheQueue(t, i)
                    ? i.listener(i.value, i.changedKey)
                    : this.queue.push(i)
            }
        })
        r(this, 'isListenerTheLowestInTheRestOfTheQueue', (t, i) => {
            let n = !0
            for (let s = t; s < this.queue.length && n; s += 1)
                i.level > this.queue[s].level && (n = !1)
            return n
        })
    }
}
var p = new d(),
    v,
    T,
    h = class {
        constructor(t, i) {
            r(this, 'listeners', [])
            r(this, 'level', 0)
            r(this, 'numberOfListeners', 0)
            r(this, 'value', null)
            r(
                this,
                'get',
                () => (
                    this.numberOfListeners || this.listen(() => {})(),
                    this.value
                )
            )
            r(this, 'set', (t) => {
                this.value !== t && ((this.value = t), this.notify())
            })
            E(this, v, (t, i) => {
                let n = { listener: t, level: i || this.level, id: Symbol() }
                return (this.numberOfListeners = this.listeners.push(n)), n.id
            })
            E(this, T, (t) => () => {
                let i = this.listeners.findIndex((n) => n.id === t)
                ~i &&
                    (this.listeners.splice(i, 1),
                    !--this.numberOfListeners && this.off && this.off())
            })
            r(this, 'listen', (t, i) => {
                let n = A(this, v).call(this, t, i)
                return A(this, T).call(this, n)
            })
            r(this, 'subscribe', (t, i) => {
                let n = this.listen(t, i)
                return t(this.value), n
            })
            r(this, 'notify', (t) => {
                let i = p.isEmpty()
                for (let n = 0; n < this.listeners.length; n += 1)
                    p.add({
                        listener: this.listeners[n].listener,
                        level: this.listeners[n].level,
                        value: this.value,
                        changedKey: t
                    })
                i && (p.emit(), p.empty())
            })
            r(this, 'off', () => {})
            ;(this.level = i || 0), (this.value = t)
        }
    }
;(v = new WeakMap()), (T = new WeakMap())
var k = (e, t) => new h(e, t)
function B(e = {}) {
    let t = new h(e)
    return (
        (t.setKey = (i, n) => {
            L(t.value, i) !== n && ((t.value = M(t.value, i, n)), t.notify(i))
        }),
        t
    )
}
var X = (e = {}) => {
    let t = new h(e)
    return (
        (t.setKey = function (i, n) {
            typeof n > 'u'
                ? i in t.value &&
                  ((t.value = o({}, t.value)), delete t.value[i], t.notify(i))
                : t.value[i] !== n &&
                  ((t.value = q(o({}, t.value), { [i]: n })), t.notify(i))
        }),
        t
    )
}
var P = class {
        constructor() {
            r(this, 'taskCount', 0)
            r(this, 'initialize', () => {
                this.taskCount = 0
            })
            r(this, 'add', () => {
                this.taskCount = this.taskCount + 1
            })
            r(this, 'isZero', () => this.taskCount < 1)
            r(this, 'subtract', () =>
                this.taskCount <= 1
                    ? ((this.taskCount = 0), { isZero: !0 })
                    : ((this.taskCount = this.taskCount - 1), { isZero: !1 })
            )
        }
    },
    R = class {
        constructor() {
            r(this, 'resolvers', [])
            r(
                this,
                'makePausedPromise',
                () =>
                    new Promise((t) => {
                        this.resolvers.push(t)
                    })
            )
            r(this, 'makeCompletedPromise', () => Promise.resolve())
            r(this, 'resolveAllPausedPromises', () => {
                let t = this.resolvers
                ;(this.resolvers = []), t.forEach((i) => i())
            })
        }
    },
    O = new P(),
    U = new R()
function N() {
    return (
        O.add(),
        () => {
            O.subtract().isZero && U.resolveAllPausedPromises()
        }
    )
}
function G(e) {
    let t = N()
    return e().finally(t)
}
function H() {
    return O.isZero() ? U.makeCompletedPromise() : U.makePausedPromise()
}
function J() {
    O.initialize()
}
function W(e, t, i) {
    let n = new Set([...t, void 0])
    return e.listen((s, l) => {
        n.has(l) && i(s, l)
    })
}
var K = 1e3,
    g = (e, t, i, n) => (
        (e.events = e.events || {}),
        e.events[i + 10] ||
            (e.events[i + 10] = n((s) => {
                e.events[i].reduceRight(
                    (l, u) => (u(l), l),
                    o({ shared: {} }, s)
                )
            })),
        (e.events[i] = e.events[i] || []),
        e.events[i].push(t),
        () => {
            let s = e.events[i],
                l = s.indexOf(t)
            s.splice(l, 1),
                s.length ||
                    (delete e.events[i],
                    e.events[i + 10](),
                    delete e.events[i + 10])
        }
    ),
    I = (e, t) =>
        g(
            e,
            (n) => {
                let s = t(n)
                s && e.events[6].push(s)
            },
            5,
            (n) => {
                let s = e.listen
                e.listen = (...u) => (
                    !e.numberOfListeners && !e.active && ((e.active = !0), n()),
                    s(...u)
                )
                let l = e.off
                return (
                    (e.events[6] = []),
                    (e.off = () => {
                        l(),
                            setTimeout(() => {
                                if (e.active && !e.numberOfListeners) {
                                    e.active = !1
                                    for (let u of e.events[6]) u()
                                    e.events[6] = []
                                }
                            }, K)
                    }),
                    () => {
                        ;(e.listen = s), (e.off = l)
                    }
                )
            }
        ),
    $ = (e, t) =>
        g(e, t, 3, (i) => {
            let n = e.notify
            return (
                (e.notify = (s) => {
                    let l
                    if (
                        (i({
                            abort: () => {
                                l = !0
                            },
                            changed: s
                        }),
                        !l)
                    )
                        return n(s)
                }),
                () => {
                    e.notify = n
                }
            )
        })
var m = Symbol(),
    c = Symbol(),
    j = 0,
    ee = (e, t, i, n) => {
        let s = ++j,
            l = o({}, e)
        ;(l.set = (...f) => {
            ;(e[m] = t), (e[c] = s), e.set(...f), delete e[m], delete e[c]
        }),
            e.setKey &&
                (l.setKey = (...f) => {
                    ;(e[m] = t),
                        (e[c] = s),
                        e.setKey(...f),
                        delete e[m],
                        delete e[c]
                })
        let u, a
        if (e.action) {
            let f = e.action(s, t, n)
            ;(u = f[0]), (a = f[1])
        }
        let x = i(l, ...n)
        if (x instanceof Promise) {
            let f = N()
            return x
                .catch((w) => {
                    throw (u && u(w), w)
                })
                .finally(() => {
                    f(), a && a()
                })
        }
        return a && a(), x
    },
    te =
        (e, t, i) =>
        (...n) =>
            ee(e, t, i, n)
var ie = (e, t) => {
    Array.isArray(e) || (e = [e])
    let i,
        n = () => {
            let l = e.map((u) => u.get())
            ;(i === void 0 || l.some((u, a) => u !== i[a])) &&
                ((i = l), s.set(t(...l)))
        },
        s = k(void 0, Math.max(...e.map((l) => l.level)) + 1)
    return (
        I(s, () => {
            let l = e.map((u) => u.listen(n, s.level))
            return (
                n(),
                () => {
                    for (let u of l) u()
                }
            )
        }),
        s
    )
}
export {
    te as action,
    c as actionId,
    H as allTasks,
    k as atom,
    B as atomDeep,
    X as atomMap,
    J as cleanTasks,
    ie as computed,
    L as getPath,
    m as lastAction,
    W as listenKeys,
    g as on,
    I as onMount,
    $ as onNotify,
    M as setPath,
    N as startTask,
    G as task
}
