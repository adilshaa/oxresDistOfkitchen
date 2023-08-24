"use strict";
(self.webpackChunkkitchen_app = self.webpackChunkkitchen_app || []).push([
  [179],
  {
    741: (Ac, mm, Ic) => {
      var To = {};
      function ve(t) {
        return "function" == typeof t;
      }
      function xc(t) {
        const n = t((r) => {
          Error.call(r), (r.stack = new Error().stack);
        });
        return (
          (n.prototype = Object.create(Error.prototype)),
          (n.prototype.constructor = n),
          n
        );
      }
      Ic.r(To),
        Ic.d(To, {
          Decoder: () => $p,
          Encoder: () => u$,
          PacketType: () => V,
          protocol: () => l$,
        });
      const Rc = xc(
        (t) =>
          function (n) {
            t(this),
              (this.message = n
                ? `${n.length} errors occurred during unsubscription:\n${n
                    .map((r, i) => `${i + 1}) ${r.toString()}`)
                    .join("\n  ")}`
                : ""),
              (this.name = "UnsubscriptionError"),
              (this.errors = n);
          }
      );
      function pa(t, e) {
        if (t) {
          const n = t.indexOf(e);
          0 <= n && t.splice(n, 1);
        }
      }
      class Rt {
        constructor(e) {
          (this.initialTeardown = e),
            (this.closed = !1),
            (this._parentage = null),
            (this._finalizers = null);
        }
        unsubscribe() {
          let e;
          if (!this.closed) {
            this.closed = !0;
            const { _parentage: n } = this;
            if (n)
              if (((this._parentage = null), Array.isArray(n)))
                for (const o of n) o.remove(this);
              else n.remove(this);
            const { initialTeardown: r } = this;
            if (ve(r))
              try {
                r();
              } catch (o) {
                e = o instanceof Rc ? o.errors : [o];
              }
            const { _finalizers: i } = this;
            if (i) {
              this._finalizers = null;
              for (const o of i)
                try {
                  _m(o);
                } catch (s) {
                  (e = e ?? []),
                    s instanceof Rc ? (e = [...e, ...s.errors]) : e.push(s);
                }
            }
            if (e) throw new Rc(e);
          }
        }
        add(e) {
          var n;
          if (e && e !== this)
            if (this.closed) _m(e);
            else {
              if (e instanceof Rt) {
                if (e.closed || e._hasParent(this)) return;
                e._addParent(this);
              }
              (this._finalizers =
                null !== (n = this._finalizers) && void 0 !== n ? n : []).push(
                e
              );
            }
        }
        _hasParent(e) {
          const { _parentage: n } = this;
          return n === e || (Array.isArray(n) && n.includes(e));
        }
        _addParent(e) {
          const { _parentage: n } = this;
          this._parentage = Array.isArray(n) ? (n.push(e), n) : n ? [n, e] : e;
        }
        _removeParent(e) {
          const { _parentage: n } = this;
          n === e ? (this._parentage = null) : Array.isArray(n) && pa(n, e);
        }
        remove(e) {
          const { _finalizers: n } = this;
          n && pa(n, e), e instanceof Rt && e._removeParent(this);
        }
      }
      Rt.EMPTY = (() => {
        const t = new Rt();
        return (t.closed = !0), t;
      })();
      const ym = Rt.EMPTY;
      function vm(t) {
        return (
          t instanceof Rt ||
          (t && "closed" in t && ve(t.remove) && ve(t.add) && ve(t.unsubscribe))
        );
      }
      function _m(t) {
        ve(t) ? t() : t.unsubscribe();
      }
      const kr = {
          onUnhandledError: null,
          onStoppedNotification: null,
          Promise: void 0,
          useDeprecatedSynchronousErrorHandling: !1,
          useDeprecatedNextContext: !1,
        },
        ga = {
          setTimeout(t, e, ...n) {
            const { delegate: r } = ga;
            return r?.setTimeout
              ? r.setTimeout(t, e, ...n)
              : setTimeout(t, e, ...n);
          },
          clearTimeout(t) {
            const { delegate: e } = ga;
            return (e?.clearTimeout || clearTimeout)(t);
          },
          delegate: void 0,
        };
      function Cm(t) {
        ga.setTimeout(() => {
          const { onUnhandledError: e } = kr;
          if (!e) throw t;
          e(t);
        });
      }
      function ma() {}
      const sA = Nc("C", void 0, void 0);
      function Nc(t, e, n) {
        return { kind: t, value: e, error: n };
      }
      let Lr = null;
      function ya(t) {
        if (kr.useDeprecatedSynchronousErrorHandling) {
          const e = !Lr;
          if ((e && (Lr = { errorThrown: !1, error: null }), t(), e)) {
            const { errorThrown: n, error: r } = Lr;
            if (((Lr = null), n)) throw r;
          }
        } else t();
      }
      class Oc extends Rt {
        constructor(e) {
          super(),
            (this.isStopped = !1),
            e
              ? ((this.destination = e), vm(e) && e.add(this))
              : (this.destination = hA);
        }
        static create(e, n, r) {
          return new Ao(e, n, r);
        }
        next(e) {
          this.isStopped
            ? Fc(
                (function lA(t) {
                  return Nc("N", t, void 0);
                })(e),
                this
              )
            : this._next(e);
        }
        error(e) {
          this.isStopped
            ? Fc(
                (function aA(t) {
                  return Nc("E", void 0, t);
                })(e),
                this
              )
            : ((this.isStopped = !0), this._error(e));
        }
        complete() {
          this.isStopped
            ? Fc(sA, this)
            : ((this.isStopped = !0), this._complete());
        }
        unsubscribe() {
          this.closed ||
            ((this.isStopped = !0),
            super.unsubscribe(),
            (this.destination = null));
        }
        _next(e) {
          this.destination.next(e);
        }
        _error(e) {
          try {
            this.destination.error(e);
          } finally {
            this.unsubscribe();
          }
        }
        _complete() {
          try {
            this.destination.complete();
          } finally {
            this.unsubscribe();
          }
        }
      }
      const cA = Function.prototype.bind;
      function Pc(t, e) {
        return cA.call(t, e);
      }
      class dA {
        constructor(e) {
          this.partialObserver = e;
        }
        next(e) {
          const { partialObserver: n } = this;
          if (n.next)
            try {
              n.next(e);
            } catch (r) {
              va(r);
            }
        }
        error(e) {
          const { partialObserver: n } = this;
          if (n.error)
            try {
              n.error(e);
            } catch (r) {
              va(r);
            }
          else va(e);
        }
        complete() {
          const { partialObserver: e } = this;
          if (e.complete)
            try {
              e.complete();
            } catch (n) {
              va(n);
            }
        }
      }
      class Ao extends Oc {
        constructor(e, n, r) {
          let i;
          if ((super(), ve(e) || !e))
            i = {
              next: e ?? void 0,
              error: n ?? void 0,
              complete: r ?? void 0,
            };
          else {
            let o;
            this && kr.useDeprecatedNextContext
              ? ((o = Object.create(e)),
                (o.unsubscribe = () => this.unsubscribe()),
                (i = {
                  next: e.next && Pc(e.next, o),
                  error: e.error && Pc(e.error, o),
                  complete: e.complete && Pc(e.complete, o),
                }))
              : (i = e);
          }
          this.destination = new dA(i);
        }
      }
      function va(t) {
        kr.useDeprecatedSynchronousErrorHandling
          ? (function uA(t) {
              kr.useDeprecatedSynchronousErrorHandling &&
                Lr &&
                ((Lr.errorThrown = !0), (Lr.error = t));
            })(t)
          : Cm(t);
      }
      function Fc(t, e) {
        const { onStoppedNotification: n } = kr;
        n && ga.setTimeout(() => n(t, e));
      }
      const hA = {
          closed: !0,
          next: ma,
          error: function fA(t) {
            throw t;
          },
          complete: ma,
        },
        kc =
          ("function" == typeof Symbol && Symbol.observable) || "@@observable";
      function qn(t) {
        return t;
      }
      function Dm(t) {
        return 0 === t.length
          ? qn
          : 1 === t.length
          ? t[0]
          : function (n) {
              return t.reduce((r, i) => i(r), n);
            };
      }
      let pe = (() => {
        class t {
          constructor(n) {
            n && (this._subscribe = n);
          }
          lift(n) {
            const r = new t();
            return (r.source = this), (r.operator = n), r;
          }
          subscribe(n, r, i) {
            const o = (function mA(t) {
              return (
                (t && t instanceof Oc) ||
                ((function gA(t) {
                  return t && ve(t.next) && ve(t.error) && ve(t.complete);
                })(t) &&
                  vm(t))
              );
            })(n)
              ? n
              : new Ao(n, r, i);
            return (
              ya(() => {
                const { operator: s, source: a } = this;
                o.add(
                  s
                    ? s.call(o, a)
                    : a
                    ? this._subscribe(o)
                    : this._trySubscribe(o)
                );
              }),
              o
            );
          }
          _trySubscribe(n) {
            try {
              return this._subscribe(n);
            } catch (r) {
              n.error(r);
            }
          }
          forEach(n, r) {
            return new (r = wm(r))((i, o) => {
              const s = new Ao({
                next: (a) => {
                  try {
                    n(a);
                  } catch (l) {
                    o(l), s.unsubscribe();
                  }
                },
                error: o,
                complete: i,
              });
              this.subscribe(s);
            });
          }
          _subscribe(n) {
            var r;
            return null === (r = this.source) || void 0 === r
              ? void 0
              : r.subscribe(n);
          }
          [kc]() {
            return this;
          }
          pipe(...n) {
            return Dm(n)(this);
          }
          toPromise(n) {
            return new (n = wm(n))((r, i) => {
              let o;
              this.subscribe(
                (s) => (o = s),
                (s) => i(s),
                () => r(o)
              );
            });
          }
        }
        return (t.create = (e) => new t(e)), t;
      })();
      function wm(t) {
        var e;
        return null !== (e = t ?? kr.Promise) && void 0 !== e ? e : Promise;
      }
      const yA = xc(
        (t) =>
          function () {
            t(this),
              (this.name = "ObjectUnsubscribedError"),
              (this.message = "object unsubscribed");
          }
      );
      let qe = (() => {
        class t extends pe {
          constructor() {
            super(),
              (this.closed = !1),
              (this.currentObservers = null),
              (this.observers = []),
              (this.isStopped = !1),
              (this.hasError = !1),
              (this.thrownError = null);
          }
          lift(n) {
            const r = new bm(this, this);
            return (r.operator = n), r;
          }
          _throwIfClosed() {
            if (this.closed) throw new yA();
          }
          next(n) {
            ya(() => {
              if ((this._throwIfClosed(), !this.isStopped)) {
                this.currentObservers ||
                  (this.currentObservers = Array.from(this.observers));
                for (const r of this.currentObservers) r.next(n);
              }
            });
          }
          error(n) {
            ya(() => {
              if ((this._throwIfClosed(), !this.isStopped)) {
                (this.hasError = this.isStopped = !0), (this.thrownError = n);
                const { observers: r } = this;
                for (; r.length; ) r.shift().error(n);
              }
            });
          }
          complete() {
            ya(() => {
              if ((this._throwIfClosed(), !this.isStopped)) {
                this.isStopped = !0;
                const { observers: n } = this;
                for (; n.length; ) n.shift().complete();
              }
            });
          }
          unsubscribe() {
            (this.isStopped = this.closed = !0),
              (this.observers = this.currentObservers = null);
          }
          get observed() {
            var n;
            return (
              (null === (n = this.observers) || void 0 === n
                ? void 0
                : n.length) > 0
            );
          }
          _trySubscribe(n) {
            return this._throwIfClosed(), super._trySubscribe(n);
          }
          _subscribe(n) {
            return (
              this._throwIfClosed(),
              this._checkFinalizedStatuses(n),
              this._innerSubscribe(n)
            );
          }
          _innerSubscribe(n) {
            const { hasError: r, isStopped: i, observers: o } = this;
            return r || i
              ? ym
              : ((this.currentObservers = null),
                o.push(n),
                new Rt(() => {
                  (this.currentObservers = null), pa(o, n);
                }));
          }
          _checkFinalizedStatuses(n) {
            const { hasError: r, thrownError: i, isStopped: o } = this;
            r ? n.error(i) : o && n.complete();
          }
          asObservable() {
            const n = new pe();
            return (n.source = this), n;
          }
        }
        return (t.create = (e, n) => new bm(e, n)), t;
      })();
      class bm extends qe {
        constructor(e, n) {
          super(), (this.destination = e), (this.source = n);
        }
        next(e) {
          var n, r;
          null ===
            (r =
              null === (n = this.destination) || void 0 === n
                ? void 0
                : n.next) ||
            void 0 === r ||
            r.call(n, e);
        }
        error(e) {
          var n, r;
          null ===
            (r =
              null === (n = this.destination) || void 0 === n
                ? void 0
                : n.error) ||
            void 0 === r ||
            r.call(n, e);
        }
        complete() {
          var e, n;
          null ===
            (n =
              null === (e = this.destination) || void 0 === e
                ? void 0
                : e.complete) ||
            void 0 === n ||
            n.call(e);
        }
        _subscribe(e) {
          var n, r;
          return null !==
            (r =
              null === (n = this.source) || void 0 === n
                ? void 0
                : n.subscribe(e)) && void 0 !== r
            ? r
            : ym;
        }
      }
      class pt extends qe {
        constructor(e) {
          super(), (this._value = e);
        }
        get value() {
          return this.getValue();
        }
        _subscribe(e) {
          const n = super._subscribe(e);
          return !n.closed && e.next(this._value), n;
        }
        getValue() {
          const { hasError: e, thrownError: n, _value: r } = this;
          if (e) throw n;
          return this._throwIfClosed(), r;
        }
        next(e) {
          super.next((this._value = e));
        }
      }
      function Em(t) {
        return ve(t?.lift);
      }
      function be(t) {
        return (e) => {
          if (Em(e))
            return e.lift(function (n) {
              try {
                return t(n, this);
              } catch (r) {
                this.error(r);
              }
            });
          throw new TypeError("Unable to lift unknown Observable type");
        };
      }
      function ge(t, e, n, r, i) {
        return new Sm(t, e, n, r, i);
      }
      class Sm extends Oc {
        constructor(e, n, r, i, o, s) {
          super(e),
            (this.onFinalize = o),
            (this.shouldUnsubscribe = s),
            (this._next = n
              ? function (a) {
                  try {
                    n(a);
                  } catch (l) {
                    e.error(l);
                  }
                }
              : super._next),
            (this._error = i
              ? function (a) {
                  try {
                    i(a);
                  } catch (l) {
                    e.error(l);
                  } finally {
                    this.unsubscribe();
                  }
                }
              : super._error),
            (this._complete = r
              ? function () {
                  try {
                    r();
                  } catch (a) {
                    e.error(a);
                  } finally {
                    this.unsubscribe();
                  }
                }
              : super._complete);
        }
        unsubscribe() {
          var e;
          if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
            const { closed: n } = this;
            super.unsubscribe(),
              !n &&
                (null === (e = this.onFinalize) ||
                  void 0 === e ||
                  e.call(this));
          }
        }
      }
      function J(t, e) {
        return be((n, r) => {
          let i = 0;
          n.subscribe(
            ge(r, (o) => {
              r.next(t.call(e, o, i++));
            })
          );
        });
      }
      function gr(t) {
        return this instanceof gr ? ((this.v = t), this) : new gr(t);
      }
      function Im(t) {
        if (!Symbol.asyncIterator)
          throw new TypeError("Symbol.asyncIterator is not defined.");
        var n,
          e = t[Symbol.asyncIterator];
        return e
          ? e.call(t)
          : ((t = (function jc(t) {
              var e = "function" == typeof Symbol && Symbol.iterator,
                n = e && t[e],
                r = 0;
              if (n) return n.call(t);
              if (t && "number" == typeof t.length)
                return {
                  next: function () {
                    return (
                      t && r >= t.length && (t = void 0),
                      { value: t && t[r++], done: !t }
                    );
                  },
                };
              throw new TypeError(
                e
                  ? "Object is not iterable."
                  : "Symbol.iterator is not defined."
              );
            })(t)),
            (n = {}),
            r("next"),
            r("throw"),
            r("return"),
            (n[Symbol.asyncIterator] = function () {
              return this;
            }),
            n);
        function r(o) {
          n[o] =
            t[o] &&
            function (s) {
              return new Promise(function (a, l) {
                !(function i(o, s, a, l) {
                  Promise.resolve(l).then(function (u) {
                    o({ value: u, done: a });
                  }, s);
                })(a, l, (s = t[o](s)).done, s.value);
              });
            };
        }
      }
      const xm = (t) =>
        t && "number" == typeof t.length && "function" != typeof t;
      function Rm(t) {
        return ve(t?.then);
      }
      function Nm(t) {
        return ve(t[kc]);
      }
      function Om(t) {
        return Symbol.asyncIterator && ve(t?.[Symbol.asyncIterator]);
      }
      function Pm(t) {
        return new TypeError(
          `You provided ${
            null !== t && "object" == typeof t ? "an invalid object" : `'${t}'`
          } where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`
        );
      }
      const Fm = (function kA() {
        return "function" == typeof Symbol && Symbol.iterator
          ? Symbol.iterator
          : "@@iterator";
      })();
      function km(t) {
        return ve(t?.[Fm]);
      }
      function Lm(t) {
        return (function Am(t, e, n) {
          if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
          var i,
            r = n.apply(t, e || []),
            o = [];
          return (
            (i = {}),
            s("next"),
            s("throw"),
            s("return"),
            (i[Symbol.asyncIterator] = function () {
              return this;
            }),
            i
          );
          function s(f) {
            r[f] &&
              (i[f] = function (h) {
                return new Promise(function (p, g) {
                  o.push([f, h, p, g]) > 1 || a(f, h);
                });
              });
          }
          function a(f, h) {
            try {
              !(function l(f) {
                f.value instanceof gr
                  ? Promise.resolve(f.value.v).then(u, c)
                  : d(o[0][2], f);
              })(r[f](h));
            } catch (p) {
              d(o[0][3], p);
            }
          }
          function u(f) {
            a("next", f);
          }
          function c(f) {
            a("throw", f);
          }
          function d(f, h) {
            f(h), o.shift(), o.length && a(o[0][0], o[0][1]);
          }
        })(this, arguments, function* () {
          const n = t.getReader();
          try {
            for (;;) {
              const { value: r, done: i } = yield gr(n.read());
              if (i) return yield gr(void 0);
              yield yield gr(r);
            }
          } finally {
            n.releaseLock();
          }
        });
      }
      function Vm(t) {
        return ve(t?.getReader);
      }
      function ot(t) {
        if (t instanceof pe) return t;
        if (null != t) {
          if (Nm(t))
            return (function LA(t) {
              return new pe((e) => {
                const n = t[kc]();
                if (ve(n.subscribe)) return n.subscribe(e);
                throw new TypeError(
                  "Provided object does not correctly implement Symbol.observable"
                );
              });
            })(t);
          if (xm(t))
            return (function VA(t) {
              return new pe((e) => {
                for (let n = 0; n < t.length && !e.closed; n++) e.next(t[n]);
                e.complete();
              });
            })(t);
          if (Rm(t))
            return (function BA(t) {
              return new pe((e) => {
                t.then(
                  (n) => {
                    e.closed || (e.next(n), e.complete());
                  },
                  (n) => e.error(n)
                ).then(null, Cm);
              });
            })(t);
          if (Om(t)) return Bm(t);
          if (km(t))
            return (function jA(t) {
              return new pe((e) => {
                for (const n of t) if ((e.next(n), e.closed)) return;
                e.complete();
              });
            })(t);
          if (Vm(t))
            return (function HA(t) {
              return Bm(Lm(t));
            })(t);
        }
        throw Pm(t);
      }
      function Bm(t) {
        return new pe((e) => {
          (function $A(t, e) {
            var n, r, i, o;
            return (function Mm(t, e, n, r) {
              return new (n || (n = Promise))(function (o, s) {
                function a(c) {
                  try {
                    u(r.next(c));
                  } catch (d) {
                    s(d);
                  }
                }
                function l(c) {
                  try {
                    u(r.throw(c));
                  } catch (d) {
                    s(d);
                  }
                }
                function u(c) {
                  c.done
                    ? o(c.value)
                    : (function i(o) {
                        return o instanceof n
                          ? o
                          : new n(function (s) {
                              s(o);
                            });
                      })(c.value).then(a, l);
                }
                u((r = r.apply(t, e || [])).next());
              });
            })(this, void 0, void 0, function* () {
              try {
                for (n = Im(t); !(r = yield n.next()).done; )
                  if ((e.next(r.value), e.closed)) return;
              } catch (s) {
                i = { error: s };
              } finally {
                try {
                  r && !r.done && (o = n.return) && (yield o.call(n));
                } finally {
                  if (i) throw i.error;
                }
              }
              e.complete();
            });
          })(t, e).catch((n) => e.error(n));
        });
      }
      function Gn(t, e, n, r = 0, i = !1) {
        const o = e.schedule(function () {
          n(), i ? t.add(this.schedule(null, r)) : this.unsubscribe();
        }, r);
        if ((t.add(o), !i)) return o;
      }
      function Ge(t, e, n = 1 / 0) {
        return ve(e)
          ? Ge((r, i) => J((o, s) => e(r, o, i, s))(ot(t(r, i))), n)
          : ("number" == typeof e && (n = e),
            be((r, i) =>
              (function UA(t, e, n, r, i, o, s, a) {
                const l = [];
                let u = 0,
                  c = 0,
                  d = !1;
                const f = () => {
                    d && !l.length && !u && e.complete();
                  },
                  h = (g) => (u < r ? p(g) : l.push(g)),
                  p = (g) => {
                    o && e.next(g), u++;
                    let m = !1;
                    ot(n(g, c++)).subscribe(
                      ge(
                        e,
                        (_) => {
                          i?.(_), o ? h(_) : e.next(_);
                        },
                        () => {
                          m = !0;
                        },
                        void 0,
                        () => {
                          if (m)
                            try {
                              for (u--; l.length && u < r; ) {
                                const _ = l.shift();
                                s ? Gn(e, s, () => p(_)) : p(_);
                              }
                              f();
                            } catch (_) {
                              e.error(_);
                            }
                        }
                      )
                    );
                  };
                return (
                  t.subscribe(
                    ge(e, h, () => {
                      (d = !0), f();
                    })
                  ),
                  () => {
                    a?.();
                  }
                );
              })(r, i, t, n)
            ));
      }
      function vi(t = 1 / 0) {
        return Ge(qn, t);
      }
      const sn = new pe((t) => t.complete());
      function Hc(t) {
        return t[t.length - 1];
      }
      function $c(t) {
        return ve(Hc(t)) ? t.pop() : void 0;
      }
      function Io(t) {
        return (function qA(t) {
          return t && ve(t.schedule);
        })(Hc(t))
          ? t.pop()
          : void 0;
      }
      function Uc(t, e = 0) {
        return be((n, r) => {
          n.subscribe(
            ge(
              r,
              (i) => Gn(r, t, () => r.next(i), e),
              () => Gn(r, t, () => r.complete(), e),
              (i) => Gn(r, t, () => r.error(i), e)
            )
          );
        });
      }
      function jm(t, e = 0) {
        return be((n, r) => {
          r.add(t.schedule(() => n.subscribe(r), e));
        });
      }
      function Hm(t, e) {
        if (!t) throw new Error("Iterable cannot be null");
        return new pe((n) => {
          Gn(n, e, () => {
            const r = t[Symbol.asyncIterator]();
            Gn(
              n,
              e,
              () => {
                r.next().then((i) => {
                  i.done ? n.complete() : n.next(i.value);
                });
              },
              0,
              !0
            );
          });
        });
      }
      function We(t, e) {
        return e
          ? (function XA(t, e) {
              if (null != t) {
                if (Nm(t))
                  return (function WA(t, e) {
                    return ot(t).pipe(jm(e), Uc(e));
                  })(t, e);
                if (xm(t))
                  return (function QA(t, e) {
                    return new pe((n) => {
                      let r = 0;
                      return e.schedule(function () {
                        r === t.length
                          ? n.complete()
                          : (n.next(t[r++]), n.closed || this.schedule());
                      });
                    });
                  })(t, e);
                if (Rm(t))
                  return (function KA(t, e) {
                    return ot(t).pipe(jm(e), Uc(e));
                  })(t, e);
                if (Om(t)) return Hm(t, e);
                if (km(t))
                  return (function ZA(t, e) {
                    return new pe((n) => {
                      let r;
                      return (
                        Gn(n, e, () => {
                          (r = t[Fm]()),
                            Gn(
                              n,
                              e,
                              () => {
                                let i, o;
                                try {
                                  ({ value: i, done: o } = r.next());
                                } catch (s) {
                                  return void n.error(s);
                                }
                                o ? n.complete() : n.next(i);
                              },
                              0,
                              !0
                            );
                        }),
                        () => ve(r?.return) && r.return()
                      );
                    });
                  })(t, e);
                if (Vm(t))
                  return (function YA(t, e) {
                    return Hm(Lm(t), e);
                  })(t, e);
              }
              throw Pm(t);
            })(t, e)
          : ot(t);
      }
      function zc(...t) {
        const e = Io(t),
          n = (function GA(t, e) {
            return "number" == typeof Hc(t) ? t.pop() : e;
          })(t, 1 / 0),
          r = t;
        return r.length ? (1 === r.length ? ot(r[0]) : vi(n)(We(r, e))) : sn;
      }
      function B(...t) {
        return We(t, Io(t));
      }
      function $m(t = {}) {
        const {
          connector: e = () => new qe(),
          resetOnError: n = !0,
          resetOnComplete: r = !0,
          resetOnRefCountZero: i = !0,
        } = t;
        return (o) => {
          let s,
            a,
            l,
            u = 0,
            c = !1,
            d = !1;
          const f = () => {
              a?.unsubscribe(), (a = void 0);
            },
            h = () => {
              f(), (s = l = void 0), (c = d = !1);
            },
            p = () => {
              const g = s;
              h(), g?.unsubscribe();
            };
          return be((g, m) => {
            u++, !d && !c && f();
            const _ = (l = l ?? e());
            m.add(() => {
              u--, 0 === u && !d && !c && (a = qc(p, i));
            }),
              _.subscribe(m),
              !s &&
                u > 0 &&
                ((s = new Ao({
                  next: (y) => _.next(y),
                  error: (y) => {
                    (d = !0), f(), (a = qc(h, n, y)), _.error(y);
                  },
                  complete: () => {
                    (c = !0), f(), (a = qc(h, r)), _.complete();
                  },
                })),
                ot(g).subscribe(s));
          })(o);
        };
      }
      function qc(t, e, ...n) {
        if (!0 === e) return void t();
        if (!1 === e) return;
        const r = new Ao({
          next: () => {
            r.unsubscribe(), t();
          },
        });
        return ot(e(...n)).subscribe(r);
      }
      function Gt(t, e) {
        return be((n, r) => {
          let i = null,
            o = 0,
            s = !1;
          const a = () => s && !i && r.complete();
          n.subscribe(
            ge(
              r,
              (l) => {
                i?.unsubscribe();
                let u = 0;
                const c = o++;
                ot(t(l, c)).subscribe(
                  (i = ge(
                    r,
                    (d) => r.next(e ? e(l, d, c, u++) : d),
                    () => {
                      (i = null), a();
                    }
                  ))
                );
              },
              () => {
                (s = !0), a();
              }
            )
          );
        });
      }
      function Um(t, e = qn) {
        return (
          (t = t ?? JA),
          be((n, r) => {
            let i,
              o = !0;
            n.subscribe(
              ge(r, (s) => {
                const a = e(s);
                (o || !t(i, a)) && ((o = !1), (i = a), r.next(s));
              })
            );
          })
        );
      }
      function JA(t, e) {
        return t === e;
      }
      function ce(t) {
        for (let e in t) if (t[e] === ce) return e;
        throw Error("Could not find renamed property on target object.");
      }
      function _a(t, e) {
        for (const n in e)
          e.hasOwnProperty(n) && !t.hasOwnProperty(n) && (t[n] = e[n]);
      }
      function Ke(t) {
        if ("string" == typeof t) return t;
        if (Array.isArray(t)) return "[" + t.map(Ke).join(", ") + "]";
        if (null == t) return "" + t;
        if (t.overriddenName) return `${t.overriddenName}`;
        if (t.name) return `${t.name}`;
        const e = t.toString();
        if (null == e) return "" + e;
        const n = e.indexOf("\n");
        return -1 === n ? e : e.substring(0, n);
      }
      function Gc(t, e) {
        return null == t || "" === t
          ? null === e
            ? ""
            : e
          : null == e || "" === e
          ? t
          : t + " " + e;
      }
      const eI = ce({ __forward_ref__: ce });
      function _e(t) {
        return (
          (t.__forward_ref__ = _e),
          (t.toString = function () {
            return Ke(this());
          }),
          t
        );
      }
      function G(t) {
        return Wc(t) ? t() : t;
      }
      function Wc(t) {
        return (
          "function" == typeof t &&
          t.hasOwnProperty(eI) &&
          t.__forward_ref__ === _e
        );
      }
      function Kc(t) {
        return t && !!t.ɵproviders;
      }
      const zm = "https://g.co/ng/security#xss";
      class v extends Error {
        constructor(e, n) {
          super(
            (function Ca(t, e) {
              return `NG0${Math.abs(t)}${e ? ": " + e : ""}`;
            })(e, n)
          ),
            (this.code = e);
        }
      }
      function W(t) {
        return "string" == typeof t ? t : null == t ? "" : String(t);
      }
      function Da(t, e) {
        throw new v(-201, !1);
      }
      function Wt(t, e) {
        null == t &&
          (function le(t, e, n, r) {
            throw new Error(
              `ASSERTION ERROR: ${t}` +
                (null == r ? "" : ` [Expected=> ${n} ${r} ${e} <=Actual]`)
            );
          })(e, t, null, "!=");
      }
      function T(t) {
        return {
          token: t.token,
          providedIn: t.providedIn || null,
          factory: t.factory,
          value: void 0,
        };
      }
      function ke(t) {
        return { providers: t.providers || [], imports: t.imports || [] };
      }
      function wa(t) {
        return qm(t, ba) || qm(t, Wm);
      }
      function qm(t, e) {
        return t.hasOwnProperty(e) ? t[e] : null;
      }
      function Gm(t) {
        return t && (t.hasOwnProperty(Qc) || t.hasOwnProperty(lI))
          ? t[Qc]
          : null;
      }
      const ba = ce({ ɵprov: ce }),
        Qc = ce({ ɵinj: ce }),
        Wm = ce({ ngInjectableDef: ce }),
        lI = ce({ ngInjectorDef: ce });
      var k = (() => (
        ((k = k || {})[(k.Default = 0)] = "Default"),
        (k[(k.Host = 1)] = "Host"),
        (k[(k.Self = 2)] = "Self"),
        (k[(k.SkipSelf = 4)] = "SkipSelf"),
        (k[(k.Optional = 8)] = "Optional"),
        k
      ))();
      let Zc;
      function Km() {
        return Zc;
      }
      function Dt(t) {
        const e = Zc;
        return (Zc = t), e;
      }
      function Qm(t, e, n) {
        const r = wa(t);
        return r && "root" == r.providedIn
          ? void 0 === r.value
            ? (r.value = r.factory())
            : r.value
          : n & k.Optional
          ? null
          : void 0 !== e
          ? e
          : void Da(Ke(t));
      }
      const Ce = (() =>
          (typeof globalThis < "u" && globalThis) ||
          (typeof global < "u" && global) ||
          (typeof window < "u" && window) ||
          (typeof self < "u" &&
            typeof WorkerGlobalScope < "u" &&
            self instanceof WorkerGlobalScope &&
            self))(),
        xo = {},
        Yc = "__NG_DI_FLAG__",
        Ea = "ngTempTokenPath",
        cI = /\n/gm,
        Zm = "__source";
      let _i;
      function yr(t) {
        const e = _i;
        return (_i = t), e;
      }
      function hI(t, e = k.Default) {
        if (void 0 === _i) throw new v(-203, !1);
        return null === _i
          ? Qm(t, void 0, e)
          : _i.get(t, e & k.Optional ? null : void 0, e);
      }
      function D(t, e = k.Default) {
        return (Km() || hI)(G(t), e);
      }
      function E(t, e = k.Default) {
        return D(t, Sa(e));
      }
      function Sa(t) {
        return typeof t > "u" || "number" == typeof t
          ? t
          : 0 |
              (t.optional && 8) |
              (t.host && 1) |
              (t.self && 2) |
              (t.skipSelf && 4);
      }
      function Xc(t) {
        const e = [];
        for (let n = 0; n < t.length; n++) {
          const r = G(t[n]);
          if (Array.isArray(r)) {
            if (0 === r.length) throw new v(900, !1);
            let i,
              o = k.Default;
            for (let s = 0; s < r.length; s++) {
              const a = r[s],
                l = pI(a);
              "number" == typeof l
                ? -1 === l
                  ? (i = a.token)
                  : (o |= l)
                : (i = a);
            }
            e.push(D(i, o));
          } else e.push(D(r));
        }
        return e;
      }
      function Ro(t, e) {
        return (t[Yc] = e), (t.prototype[Yc] = e), t;
      }
      function pI(t) {
        return t[Yc];
      }
      function Wn(t) {
        return { toString: t }.toString();
      }
      var Dn = (() => (
          ((Dn = Dn || {})[(Dn.OnPush = 0)] = "OnPush"),
          (Dn[(Dn.Default = 1)] = "Default"),
          Dn
        ))(),
        wt = (() => {
          return (
            ((t = wt || (wt = {}))[(t.Emulated = 0)] = "Emulated"),
            (t[(t.None = 2)] = "None"),
            (t[(t.ShadowDom = 3)] = "ShadowDom"),
            wt
          );
          var t;
        })();
      const wn = {},
        oe = [],
        Ma = ce({ ɵcmp: ce }),
        Jc = ce({ ɵdir: ce }),
        ed = ce({ ɵpipe: ce }),
        Xm = ce({ ɵmod: ce }),
        Kn = ce({ ɵfac: ce }),
        No = ce({ __NG_ELEMENT_ID__: ce }),
        Jm = ce({ __NG_ENV_ID__: ce });
      function ey(t, e, n) {
        let r = t.length;
        for (;;) {
          const i = t.indexOf(e, n);
          if (-1 === i) return i;
          if (0 === i || t.charCodeAt(i - 1) <= 32) {
            const o = e.length;
            if (i + o === r || t.charCodeAt(i + o) <= 32) return i;
          }
          n = i + 1;
        }
      }
      function td(t, e, n) {
        let r = 0;
        for (; r < n.length; ) {
          const i = n[r];
          if ("number" == typeof i) {
            if (0 !== i) break;
            r++;
            const o = n[r++],
              s = n[r++],
              a = n[r++];
            t.setAttribute(e, s, a, o);
          } else {
            const o = i,
              s = n[++r];
            ny(o) ? t.setProperty(e, o, s) : t.setAttribute(e, o, s), r++;
          }
        }
        return r;
      }
      function ty(t) {
        return 3 === t || 4 === t || 6 === t;
      }
      function ny(t) {
        return 64 === t.charCodeAt(0);
      }
      function Oo(t, e) {
        if (null !== e && 0 !== e.length)
          if (null === t || 0 === t.length) t = e.slice();
          else {
            let n = -1;
            for (let r = 0; r < e.length; r++) {
              const i = e[r];
              "number" == typeof i
                ? (n = i)
                : 0 === n ||
                  ry(t, n, i, null, -1 === n || 2 === n ? e[++r] : null);
            }
          }
        return t;
      }
      function ry(t, e, n, r, i) {
        let o = 0,
          s = t.length;
        if (-1 === e) s = -1;
        else
          for (; o < t.length; ) {
            const a = t[o++];
            if ("number" == typeof a) {
              if (a === e) {
                s = -1;
                break;
              }
              if (a > e) {
                s = o - 1;
                break;
              }
            }
          }
        for (; o < t.length; ) {
          const a = t[o];
          if ("number" == typeof a) break;
          if (a === n) {
            if (null === r) return void (null !== i && (t[o + 1] = i));
            if (r === t[o + 1]) return void (t[o + 2] = i);
          }
          o++, null !== r && o++, null !== i && o++;
        }
        -1 !== s && (t.splice(s, 0, e), (o = s + 1)),
          t.splice(o++, 0, n),
          null !== r && t.splice(o++, 0, r),
          null !== i && t.splice(o++, 0, i);
      }
      const iy = "ng-template";
      function yI(t, e, n) {
        let r = 0,
          i = !0;
        for (; r < t.length; ) {
          let o = t[r++];
          if ("string" == typeof o && i) {
            const s = t[r++];
            if (n && "class" === o && -1 !== ey(s.toLowerCase(), e, 0))
              return !0;
          } else {
            if (1 === o) {
              for (; r < t.length && "string" == typeof (o = t[r++]); )
                if (o.toLowerCase() === e) return !0;
              return !1;
            }
            "number" == typeof o && (i = !1);
          }
        }
        return !1;
      }
      function oy(t) {
        return 4 === t.type && t.value !== iy;
      }
      function vI(t, e, n) {
        return e === (4 !== t.type || n ? t.value : iy);
      }
      function _I(t, e, n) {
        let r = 4;
        const i = t.attrs || [],
          o = (function wI(t) {
            for (let e = 0; e < t.length; e++) if (ty(t[e])) return e;
            return t.length;
          })(i);
        let s = !1;
        for (let a = 0; a < e.length; a++) {
          const l = e[a];
          if ("number" != typeof l) {
            if (!s)
              if (4 & r) {
                if (
                  ((r = 2 | (1 & r)),
                  ("" !== l && !vI(t, l, n)) || ("" === l && 1 === e.length))
                ) {
                  if (an(r)) return !1;
                  s = !0;
                }
              } else {
                const u = 8 & r ? l : e[++a];
                if (8 & r && null !== t.attrs) {
                  if (!yI(t.attrs, u, n)) {
                    if (an(r)) return !1;
                    s = !0;
                  }
                  continue;
                }
                const d = CI(8 & r ? "class" : l, i, oy(t), n);
                if (-1 === d) {
                  if (an(r)) return !1;
                  s = !0;
                  continue;
                }
                if ("" !== u) {
                  let f;
                  f = d > o ? "" : i[d + 1].toLowerCase();
                  const h = 8 & r ? f : null;
                  if ((h && -1 !== ey(h, u, 0)) || (2 & r && u !== f)) {
                    if (an(r)) return !1;
                    s = !0;
                  }
                }
              }
          } else {
            if (!s && !an(r) && !an(l)) return !1;
            if (s && an(l)) continue;
            (s = !1), (r = l | (1 & r));
          }
        }
        return an(r) || s;
      }
      function an(t) {
        return 0 == (1 & t);
      }
      function CI(t, e, n, r) {
        if (null === e) return -1;
        let i = 0;
        if (r || !n) {
          let o = !1;
          for (; i < e.length; ) {
            const s = e[i];
            if (s === t) return i;
            if (3 === s || 6 === s) o = !0;
            else {
              if (1 === s || 2 === s) {
                let a = e[++i];
                for (; "string" == typeof a; ) a = e[++i];
                continue;
              }
              if (4 === s) break;
              if (0 === s) {
                i += 4;
                continue;
              }
            }
            i += o ? 1 : 2;
          }
          return -1;
        }
        return (function bI(t, e) {
          let n = t.indexOf(4);
          if (n > -1)
            for (n++; n < t.length; ) {
              const r = t[n];
              if ("number" == typeof r) return -1;
              if (r === e) return n;
              n++;
            }
          return -1;
        })(e, t);
      }
      function sy(t, e, n = !1) {
        for (let r = 0; r < e.length; r++) if (_I(t, e[r], n)) return !0;
        return !1;
      }
      function ay(t, e) {
        return t ? ":not(" + e.trim() + ")" : e;
      }
      function SI(t) {
        let e = t[0],
          n = 1,
          r = 2,
          i = "",
          o = !1;
        for (; n < t.length; ) {
          let s = t[n];
          if ("string" == typeof s)
            if (2 & r) {
              const a = t[++n];
              i += "[" + s + (a.length > 0 ? '="' + a + '"' : "") + "]";
            } else 8 & r ? (i += "." + s) : 4 & r && (i += " " + s);
          else
            "" !== i && !an(s) && ((e += ay(o, i)), (i = "")),
              (r = s),
              (o = o || !an(r));
          n++;
        }
        return "" !== i && (e += ay(o, i)), e;
      }
      function Kt(t) {
        return Wn(() => {
          const e = uy(t),
            n = {
              ...e,
              decls: t.decls,
              vars: t.vars,
              template: t.template,
              consts: t.consts || null,
              ngContentSelectors: t.ngContentSelectors,
              onPush: t.changeDetection === Dn.OnPush,
              directiveDefs: null,
              pipeDefs: null,
              dependencies: (e.standalone && t.dependencies) || null,
              getStandaloneInjector: null,
              signals: t.signals ?? !1,
              data: t.data || {},
              encapsulation: t.encapsulation || wt.Emulated,
              styles: t.styles || oe,
              _: null,
              schemas: t.schemas || null,
              tView: null,
              id: "",
            };
          cy(n);
          const r = t.dependencies;
          return (
            (n.directiveDefs = Ta(r, !1)),
            (n.pipeDefs = Ta(r, !0)),
            (n.id = (function OI(t) {
              let e = 0;
              const n = [
                t.selectors,
                t.ngContentSelectors,
                t.hostVars,
                t.hostAttrs,
                t.consts,
                t.vars,
                t.decls,
                t.encapsulation,
                t.standalone,
                t.signals,
                t.exportAs,
                JSON.stringify(t.inputs),
                JSON.stringify(t.outputs),
                Object.getOwnPropertyNames(t.type.prototype),
                !!t.contentQueries,
                !!t.viewQuery,
              ].join("|");
              for (const i of n) e = (Math.imul(31, e) + i.charCodeAt(0)) << 0;
              return (e += 2147483648), "c" + e;
            })(n)),
            n
          );
        });
      }
      function II(t) {
        return se(t) || st(t);
      }
      function xI(t) {
        return null !== t;
      }
      function Qe(t) {
        return Wn(() => ({
          type: t.type,
          bootstrap: t.bootstrap || oe,
          declarations: t.declarations || oe,
          imports: t.imports || oe,
          exports: t.exports || oe,
          transitiveCompileScopes: null,
          schemas: t.schemas || null,
          id: t.id || null,
        }));
      }
      function ly(t, e) {
        if (null == t) return wn;
        const n = {};
        for (const r in t)
          if (t.hasOwnProperty(r)) {
            let i = t[r],
              o = i;
            Array.isArray(i) && ((o = i[1]), (i = i[0])),
              (n[i] = r),
              e && (e[i] = o);
          }
        return n;
      }
      function q(t) {
        return Wn(() => {
          const e = uy(t);
          return cy(e), e;
        });
      }
      function se(t) {
        return t[Ma] || null;
      }
      function st(t) {
        return t[Jc] || null;
      }
      function Et(t) {
        return t[ed] || null;
      }
      function Ot(t, e) {
        const n = t[Xm] || null;
        if (!n && !0 === e)
          throw new Error(`Type ${Ke(t)} does not have '\u0275mod' property.`);
        return n;
      }
      function uy(t) {
        const e = {};
        return {
          type: t.type,
          providersResolver: null,
          factory: null,
          hostBindings: t.hostBindings || null,
          hostVars: t.hostVars || 0,
          hostAttrs: t.hostAttrs || null,
          contentQueries: t.contentQueries || null,
          declaredInputs: e,
          inputTransforms: null,
          inputConfig: t.inputs || wn,
          exportAs: t.exportAs || null,
          standalone: !0 === t.standalone,
          signals: !0 === t.signals,
          selectors: t.selectors || oe,
          viewQuery: t.viewQuery || null,
          features: t.features || null,
          setInput: null,
          findHostDirectiveDefs: null,
          hostDirectives: null,
          inputs: ly(t.inputs, e),
          outputs: ly(t.outputs),
        };
      }
      function cy(t) {
        t.features?.forEach((e) => e(t));
      }
      function Ta(t, e) {
        if (!t) return null;
        const n = e ? Et : II;
        return () =>
          ("function" == typeof t ? t() : t).map((r) => n(r)).filter(xI);
      }
      const Ze = 0,
        I = 1,
        K = 2,
        Ae = 3,
        ln = 4,
        Po = 5,
        at = 6,
        Di = 7,
        Le = 8,
        wi = 9,
        Vr = 10,
        Q = 11,
        Fo = 12,
        dy = 13,
        bi = 14,
        Ve = 15,
        ko = 16,
        Ei = 17,
        bn = 18,
        Lo = 19,
        fy = 20,
        vr = 21,
        Qn = 22,
        Aa = 23,
        Ia = 24,
        te = 25,
        nd = 1,
        hy = 2,
        En = 7,
        Si = 9,
        lt = 11;
      function Pt(t) {
        return Array.isArray(t) && "object" == typeof t[nd];
      }
      function St(t) {
        return Array.isArray(t) && !0 === t[nd];
      }
      function rd(t) {
        return 0 != (4 & t.flags);
      }
      function Br(t) {
        return t.componentOffset > -1;
      }
      function Ra(t) {
        return 1 == (1 & t.flags);
      }
      function un(t) {
        return !!t.template;
      }
      function id(t) {
        return 0 != (512 & t[K]);
      }
      function jr(t, e) {
        return t.hasOwnProperty(Kn) ? t[Kn] : null;
      }
      const my = Symbol("SIGNAL");
      function od(t, e, n = {}) {
        return (e[my] = t), Object.assign(e, n);
      }
      function yy(t, e) {
        return (null === t || "object" != typeof t) && Object.is(t, e);
      }
      let BI =
          Ce.WeakRef ??
          class VI {
            constructor(e) {
              this.ref = e;
            }
            deref() {
              return this.ref;
            }
          },
        HI = 0,
        Sn = null,
        Na = !1;
      function tt(t) {
        const e = Sn;
        return (Sn = t), e;
      }
      class Oa {
        constructor() {
          (this.id = HI++),
            (this.ref = (function jI(t) {
              return new BI(t);
            })(this)),
            (this.producers = new Map()),
            (this.consumers = new Map()),
            (this.trackingVersion = 0),
            (this.valueVersion = 0);
        }
        consumerPollProducersForChange() {
          for (const [e, n] of this.producers) {
            const r = n.producerNode.deref();
            if (void 0 !== r && n.atTrackingVersion === this.trackingVersion) {
              if (r.producerPollStatus(n.seenValueVersion)) return !0;
            } else this.producers.delete(e), r?.consumers.delete(this.id);
          }
          return !1;
        }
        producerMayHaveChanged() {
          const e = Na;
          Na = !0;
          try {
            for (const [n, r] of this.consumers) {
              const i = r.consumerNode.deref();
              void 0 !== i && i.trackingVersion === r.atTrackingVersion
                ? i.onConsumerDependencyMayHaveChanged()
                : (this.consumers.delete(n), i?.producers.delete(this.id));
            }
          } finally {
            Na = e;
          }
        }
        producerAccessed() {
          if (Na) throw new Error("");
          if (null === Sn) return;
          let e = Sn.producers.get(this.id);
          void 0 === e
            ? ((e = {
                consumerNode: Sn.ref,
                producerNode: this.ref,
                seenValueVersion: this.valueVersion,
                atTrackingVersion: Sn.trackingVersion,
              }),
              Sn.producers.set(this.id, e),
              this.consumers.set(Sn.id, e))
            : ((e.seenValueVersion = this.valueVersion),
              (e.atTrackingVersion = Sn.trackingVersion));
        }
        get hasProducers() {
          return this.producers.size > 0;
        }
        get producerUpdatesAllowed() {
          return !1 !== Sn?.consumerAllowSignalWrites;
        }
        producerPollStatus(e) {
          return (
            this.valueVersion !== e ||
            (this.onProducerUpdateValueVersion(), this.valueVersion !== e)
          );
        }
      }
      function vy(t, e) {
        const n = new $I(t, e?.equal ?? yy);
        return od(n, n.signal.bind(n));
      }
      const sd = Symbol("UNSET"),
        ad = Symbol("COMPUTING"),
        Pa = Symbol("ERRORED");
      class $I extends Oa {
        constructor(e, n) {
          super(),
            (this.computation = e),
            (this.equal = n),
            (this.value = sd),
            (this.error = null),
            (this.stale = !0),
            (this.consumerAllowSignalWrites = !1);
        }
        onConsumerDependencyMayHaveChanged() {
          this.stale || ((this.stale = !0), this.producerMayHaveChanged());
        }
        onProducerUpdateValueVersion() {
          if (this.stale) {
            if (
              this.value !== sd &&
              this.value !== ad &&
              !this.consumerPollProducersForChange()
            )
              return void (this.stale = !1);
            this.recomputeValue();
          }
        }
        recomputeValue() {
          if (this.value === ad)
            throw new Error("Detected cycle in computations.");
          const e = this.value;
          (this.value = ad), this.trackingVersion++;
          const n = tt(this);
          let r;
          try {
            r = this.computation();
          } catch (i) {
            (r = Pa), (this.error = i);
          } finally {
            tt(n);
          }
          (this.stale = !1),
            e !== sd && e !== Pa && r !== Pa && this.equal(e, r)
              ? (this.value = e)
              : ((this.value = r), this.valueVersion++);
        }
        signal() {
          if (
            (this.onProducerUpdateValueVersion(),
            this.producerAccessed(),
            this.value === Pa)
          )
            throw this.error;
          return this.value;
        }
      }
      let _y = function UI() {
        throw new Error();
      };
      function ld() {
        _y();
      }
      class qI extends Oa {
        constructor(e, n) {
          super(),
            (this.value = e),
            (this.equal = n),
            (this.consumerAllowSignalWrites = !1);
        }
        onConsumerDependencyMayHaveChanged() {}
        onProducerUpdateValueVersion() {}
        set(e) {
          this.producerUpdatesAllowed || ld(),
            this.equal(this.value, e) ||
              ((this.value = e),
              this.valueVersion++,
              this.producerMayHaveChanged());
        }
        update(e) {
          this.producerUpdatesAllowed || ld(), this.set(e(this.value));
        }
        mutate(e) {
          this.producerUpdatesAllowed || ld(),
            e(this.value),
            this.valueVersion++,
            this.producerMayHaveChanged();
        }
        asReadonly() {
          return (
            void 0 === this.readonlySignal &&
              (this.readonlySignal = od(this, () => this.signal())),
            this.readonlySignal
          );
        }
        signal() {
          return this.producerAccessed(), this.value;
        }
      }
      const wy = () => {};
      class GI extends Oa {
        constructor(e, n, r) {
          super(),
            (this.watch = e),
            (this.schedule = n),
            (this.dirty = !1),
            (this.cleanupFn = wy),
            (this.registerOnCleanup = (i) => {
              this.cleanupFn = i;
            }),
            (this.consumerAllowSignalWrites = r);
        }
        notify() {
          this.dirty || this.schedule(this), (this.dirty = !0);
        }
        onConsumerDependencyMayHaveChanged() {
          this.notify();
        }
        onProducerUpdateValueVersion() {}
        run() {
          if (
            ((this.dirty = !1),
            0 !== this.trackingVersion &&
              !this.consumerPollProducersForChange())
          )
            return;
          const e = tt(this);
          this.trackingVersion++;
          try {
            this.cleanupFn(),
              (this.cleanupFn = wy),
              this.watch(this.registerOnCleanup);
          } finally {
            tt(e);
          }
        }
        cleanup() {
          this.cleanupFn();
        }
      }
      class WI {
        constructor(e, n, r) {
          (this.previousValue = e),
            (this.currentValue = n),
            (this.firstChange = r);
        }
        isFirstChange() {
          return this.firstChange;
        }
      }
      function Qt() {
        return by;
      }
      function by(t) {
        return t.type.prototype.ngOnChanges && (t.setInput = QI), KI;
      }
      function KI() {
        const t = Sy(this),
          e = t?.current;
        if (e) {
          const n = t.previous;
          if (n === wn) t.previous = e;
          else for (let r in e) n[r] = e[r];
          (t.current = null), this.ngOnChanges(e);
        }
      }
      function QI(t, e, n, r) {
        const i = this.declaredInputs[n],
          o =
            Sy(t) ||
            (function ZI(t, e) {
              return (t[Ey] = e);
            })(t, { previous: wn, current: null }),
          s = o.current || (o.current = {}),
          a = o.previous,
          l = a[i];
        (s[i] = new WI(l && l.currentValue, e, a === wn)), (t[r] = e);
      }
      Qt.ngInherit = !0;
      const Ey = "__ngSimpleChanges__";
      function Sy(t) {
        return t[Ey] || null;
      }
      const Mn = function (t, e, n) {};
      function we(t) {
        for (; Array.isArray(t); ) t = t[Ze];
        return t;
      }
      function ka(t, e) {
        return we(e[t]);
      }
      function Mt(t, e) {
        return we(e[t.index]);
      }
      function Ay(t, e) {
        return t.data[e];
      }
      function Ft(t, e) {
        const n = e[t];
        return Pt(n) ? n : n[Ze];
      }
      function _r(t, e) {
        return null == e ? null : t[e];
      }
      function Iy(t) {
        t[Ei] = 0;
      }
      function rx(t) {
        1024 & t[K] || ((t[K] |= 1024), Ry(t, 1));
      }
      function xy(t) {
        1024 & t[K] && ((t[K] &= -1025), Ry(t, -1));
      }
      function Ry(t, e) {
        let n = t[Ae];
        if (null === n) return;
        n[Po] += e;
        let r = n;
        for (
          n = n[Ae];
          null !== n && ((1 === e && 1 === r[Po]) || (-1 === e && 0 === r[Po]));

        )
          (n[Po] += e), (r = n), (n = n[Ae]);
      }
      function Ny(t, e) {
        if (256 == (256 & t[K])) throw new v(911, !1);
        null === t[vr] && (t[vr] = []), t[vr].push(e);
      }
      const $ = {
        lFrame: $y(null),
        bindingsEnabled: !0,
        skipHydrationRootTNode: null,
      };
      function Py() {
        return $.bindingsEnabled;
      }
      function w() {
        return $.lFrame.lView;
      }
      function ne() {
        return $.lFrame.tView;
      }
      function Tn(t) {
        return ($.lFrame.contextLView = t), t[Le];
      }
      function An(t) {
        return ($.lFrame.contextLView = null), t;
      }
      function it() {
        let t = Fy();
        for (; null !== t && 64 === t.type; ) t = t.parent;
        return t;
      }
      function Fy() {
        return $.lFrame.currentTNode;
      }
      function In(t, e) {
        const n = $.lFrame;
        (n.currentTNode = t), (n.isParent = e);
      }
      function cd() {
        return $.lFrame.isParent;
      }
      function dd() {
        $.lFrame.isParent = !1;
      }
      function Ai() {
        return $.lFrame.bindingIndex++;
      }
      function Yn(t) {
        const e = $.lFrame,
          n = e.bindingIndex;
        return (e.bindingIndex = e.bindingIndex + t), n;
      }
      function gx(t, e) {
        const n = $.lFrame;
        (n.bindingIndex = n.bindingRootIndex = t), fd(e);
      }
      function fd(t) {
        $.lFrame.currentDirectiveIndex = t;
      }
      function hd(t) {
        const e = $.lFrame.currentDirectiveIndex;
        return -1 === e ? null : t[e];
      }
      function pd(t) {
        $.lFrame.currentQueryIndex = t;
      }
      function yx(t) {
        const e = t[I];
        return 2 === e.type ? e.declTNode : 1 === e.type ? t[at] : null;
      }
      function jy(t, e, n) {
        if (n & k.SkipSelf) {
          let i = e,
            o = t;
          for (
            ;
            !((i = i.parent),
            null !== i ||
              n & k.Host ||
              ((i = yx(o)), null === i || ((o = o[bi]), 10 & i.type)));

          );
          if (null === i) return !1;
          (e = i), (t = o);
        }
        const r = ($.lFrame = Hy());
        return (r.currentTNode = e), (r.lView = t), !0;
      }
      function gd(t) {
        const e = Hy(),
          n = t[I];
        ($.lFrame = e),
          (e.currentTNode = n.firstChild),
          (e.lView = t),
          (e.tView = n),
          (e.contextLView = t),
          (e.bindingIndex = n.bindingStartIndex),
          (e.inI18n = !1);
      }
      function Hy() {
        const t = $.lFrame,
          e = null === t ? null : t.child;
        return null === e ? $y(t) : e;
      }
      function $y(t) {
        const e = {
          currentTNode: null,
          isParent: !0,
          lView: null,
          tView: null,
          selectedIndex: -1,
          contextLView: null,
          elementDepthCount: 0,
          currentNamespace: null,
          currentDirectiveIndex: -1,
          bindingRootIndex: -1,
          bindingIndex: -1,
          currentQueryIndex: 0,
          parent: t,
          child: null,
          inI18n: !1,
        };
        return null !== t && (t.child = e), e;
      }
      function Uy() {
        const t = $.lFrame;
        return (
          ($.lFrame = t.parent), (t.currentTNode = null), (t.lView = null), t
        );
      }
      const zy = Uy;
      function md() {
        const t = Uy();
        (t.isParent = !0),
          (t.tView = null),
          (t.selectedIndex = -1),
          (t.contextLView = null),
          (t.elementDepthCount = 0),
          (t.currentDirectiveIndex = -1),
          (t.currentNamespace = null),
          (t.bindingRootIndex = -1),
          (t.bindingIndex = -1),
          (t.currentQueryIndex = 0);
      }
      function mt() {
        return $.lFrame.selectedIndex;
      }
      function Hr(t) {
        $.lFrame.selectedIndex = t;
      }
      function Ie() {
        const t = $.lFrame;
        return Ay(t.tView, t.selectedIndex);
      }
      let Gy = !0;
      function La() {
        return Gy;
      }
      function Cr(t) {
        Gy = t;
      }
      function Va(t, e) {
        for (let n = e.directiveStart, r = e.directiveEnd; n < r; n++) {
          const o = t.data[n].type.prototype,
            {
              ngAfterContentInit: s,
              ngAfterContentChecked: a,
              ngAfterViewInit: l,
              ngAfterViewChecked: u,
              ngOnDestroy: c,
            } = o;
          s && (t.contentHooks ??= []).push(-n, s),
            a &&
              ((t.contentHooks ??= []).push(n, a),
              (t.contentCheckHooks ??= []).push(n, a)),
            l && (t.viewHooks ??= []).push(-n, l),
            u &&
              ((t.viewHooks ??= []).push(n, u),
              (t.viewCheckHooks ??= []).push(n, u)),
            null != c && (t.destroyHooks ??= []).push(n, c);
        }
      }
      function Ba(t, e, n) {
        Wy(t, e, 3, n);
      }
      function ja(t, e, n, r) {
        (3 & t[K]) === n && Wy(t, e, n, r);
      }
      function yd(t, e) {
        let n = t[K];
        (3 & n) === e && ((n &= 8191), (n += 1), (t[K] = n));
      }
      function Wy(t, e, n, r) {
        const o = r ?? -1,
          s = e.length - 1;
        let a = 0;
        for (let l = void 0 !== r ? 65535 & t[Ei] : 0; l < s; l++)
          if ("number" == typeof e[l + 1]) {
            if (((a = e[l]), null != r && a >= r)) break;
          } else
            e[l] < 0 && (t[Ei] += 65536),
              (a < o || -1 == o) &&
                (Sx(t, n, e, l), (t[Ei] = (4294901760 & t[Ei]) + l + 2)),
              l++;
      }
      function Ky(t, e) {
        Mn(4, t, e);
        const n = tt(null);
        try {
          e.call(t);
        } finally {
          tt(n), Mn(5, t, e);
        }
      }
      function Sx(t, e, n, r) {
        const i = n[r] < 0,
          o = n[r + 1],
          a = t[i ? -n[r] : n[r]];
        i
          ? t[K] >> 13 < t[Ei] >> 16 &&
            (3 & t[K]) === e &&
            ((t[K] += 8192), Ky(a, o))
          : Ky(a, o);
      }
      const Ii = -1;
      class jo {
        constructor(e, n, r) {
          (this.factory = e),
            (this.resolving = !1),
            (this.canSeeViewProviders = n),
            (this.injectImpl = r);
        }
      }
      function Qy(t) {
        return t !== Ii;
      }
      function Ha(t) {
        return 32767 & t;
      }
      function $a(t, e) {
        let n = (function Ix(t) {
            return t >> 16;
          })(t),
          r = e;
        for (; n > 0; ) (r = r[bi]), n--;
        return r;
      }
      let _d = !0;
      function Ua(t) {
        const e = _d;
        return (_d = t), e;
      }
      const Zy = 255,
        Yy = 5;
      let xx = 0;
      const xn = {};
      function za(t, e) {
        const n = Xy(t, e);
        if (-1 !== n) return n;
        const r = e[I];
        r.firstCreatePass &&
          ((t.injectorIndex = e.length),
          Cd(r.data, t),
          Cd(e, null),
          Cd(r.blueprint, null));
        const i = Dd(t, e),
          o = t.injectorIndex;
        if (Qy(i)) {
          const s = Ha(i),
            a = $a(i, e),
            l = a[I].data;
          for (let u = 0; u < 8; u++) e[o + u] = a[s + u] | l[s + u];
        }
        return (e[o + 8] = i), o;
      }
      function Cd(t, e) {
        t.push(0, 0, 0, 0, 0, 0, 0, 0, e);
      }
      function Xy(t, e) {
        return -1 === t.injectorIndex ||
          (t.parent && t.parent.injectorIndex === t.injectorIndex) ||
          null === e[t.injectorIndex + 8]
          ? -1
          : t.injectorIndex;
      }
      function Dd(t, e) {
        if (t.parent && -1 !== t.parent.injectorIndex)
          return t.parent.injectorIndex;
        let n = 0,
          r = null,
          i = e;
        for (; null !== i; ) {
          if (((r = ov(i)), null === r)) return Ii;
          if ((n++, (i = i[bi]), -1 !== r.injectorIndex))
            return r.injectorIndex | (n << 16);
        }
        return Ii;
      }
      function wd(t, e, n) {
        !(function Rx(t, e, n) {
          let r;
          "string" == typeof n
            ? (r = n.charCodeAt(0) || 0)
            : n.hasOwnProperty(No) && (r = n[No]),
            null == r && (r = n[No] = xx++);
          const i = r & Zy;
          e.data[t + (i >> Yy)] |= 1 << i;
        })(t, e, n);
      }
      function Jy(t, e, n) {
        if (n & k.Optional || void 0 !== t) return t;
        Da();
      }
      function ev(t, e, n, r) {
        if (
          (n & k.Optional && void 0 === r && (r = null),
          !(n & (k.Self | k.Host)))
        ) {
          const i = t[wi],
            o = Dt(void 0);
          try {
            return i ? i.get(e, r, n & k.Optional) : Qm(e, r, n & k.Optional);
          } finally {
            Dt(o);
          }
        }
        return Jy(r, 0, n);
      }
      function tv(t, e, n, r = k.Default, i) {
        if (null !== t) {
          if (2048 & e[K] && !(r & k.Self)) {
            const s = (function kx(t, e, n, r, i) {
              let o = t,
                s = e;
              for (
                ;
                null !== o && null !== s && 2048 & s[K] && !(512 & s[K]);

              ) {
                const a = nv(o, s, n, r | k.Self, xn);
                if (a !== xn) return a;
                let l = o.parent;
                if (!l) {
                  const u = s[fy];
                  if (u) {
                    const c = u.get(n, xn, r);
                    if (c !== xn) return c;
                  }
                  (l = ov(s)), (s = s[bi]);
                }
                o = l;
              }
              return i;
            })(t, e, n, r, xn);
            if (s !== xn) return s;
          }
          const o = nv(t, e, n, r, xn);
          if (o !== xn) return o;
        }
        return ev(e, n, r, i);
      }
      function nv(t, e, n, r, i) {
        const o = (function Px(t) {
          if ("string" == typeof t) return t.charCodeAt(0) || 0;
          const e = t.hasOwnProperty(No) ? t[No] : void 0;
          return "number" == typeof e ? (e >= 0 ? e & Zy : Fx) : e;
        })(n);
        if ("function" == typeof o) {
          if (!jy(e, t, r)) return r & k.Host ? Jy(i, 0, r) : ev(e, n, r, i);
          try {
            const s = o(r);
            if (null != s || r & k.Optional) return s;
            Da();
          } finally {
            zy();
          }
        } else if ("number" == typeof o) {
          let s = null,
            a = Xy(t, e),
            l = Ii,
            u = r & k.Host ? e[Ve][at] : null;
          for (
            (-1 === a || r & k.SkipSelf) &&
            ((l = -1 === a ? Dd(t, e) : e[a + 8]),
            l !== Ii && iv(r, !1)
              ? ((s = e[I]), (a = Ha(l)), (e = $a(l, e)))
              : (a = -1));
            -1 !== a;

          ) {
            const c = e[I];
            if (rv(o, a, c.data)) {
              const d = Ox(a, e, n, s, r, u);
              if (d !== xn) return d;
            }
            (l = e[a + 8]),
              l !== Ii && iv(r, e[I].data[a + 8] === u) && rv(o, a, e)
                ? ((s = c), (a = Ha(l)), (e = $a(l, e)))
                : (a = -1);
          }
        }
        return i;
      }
      function Ox(t, e, n, r, i, o) {
        const s = e[I],
          a = s.data[t + 8],
          c = (function qa(t, e, n, r, i) {
            const o = t.providerIndexes,
              s = e.data,
              a = 1048575 & o,
              l = t.directiveStart,
              c = o >> 20,
              f = i ? a + c : t.directiveEnd;
            for (let h = r ? a : a + c; h < f; h++) {
              const p = s[h];
              if ((h < l && n === p) || (h >= l && p.type === n)) return h;
            }
            if (i) {
              const h = s[l];
              if (h && un(h) && h.type === n) return l;
            }
            return null;
          })(
            a,
            s,
            n,
            null == r ? Br(a) && _d : r != s && 0 != (3 & a.type),
            i & k.Host && o === a
          );
        return null !== c ? $r(e, s, c, a) : xn;
      }
      function $r(t, e, n, r) {
        let i = t[n];
        const o = e.data;
        if (
          (function Mx(t) {
            return t instanceof jo;
          })(i)
        ) {
          const s = i;
          s.resolving &&
            (function tI(t, e) {
              const n = e ? `. Dependency path: ${e.join(" > ")} > ${t}` : "";
              throw new v(
                -200,
                `Circular dependency in DI detected for ${t}${n}`
              );
            })(
              (function ae(t) {
                return "function" == typeof t
                  ? t.name || t.toString()
                  : "object" == typeof t &&
                    null != t &&
                    "function" == typeof t.type
                  ? t.type.name || t.type.toString()
                  : W(t);
              })(o[n])
            );
          const a = Ua(s.canSeeViewProviders);
          s.resolving = !0;
          const l = s.injectImpl ? Dt(s.injectImpl) : null;
          jy(t, r, k.Default);
          try {
            (i = t[n] = s.factory(void 0, o, t, r)),
              e.firstCreatePass &&
                n >= r.directiveStart &&
                (function Ex(t, e, n) {
                  const {
                    ngOnChanges: r,
                    ngOnInit: i,
                    ngDoCheck: o,
                  } = e.type.prototype;
                  if (r) {
                    const s = by(e);
                    (n.preOrderHooks ??= []).push(t, s),
                      (n.preOrderCheckHooks ??= []).push(t, s);
                  }
                  i && (n.preOrderHooks ??= []).push(0 - t, i),
                    o &&
                      ((n.preOrderHooks ??= []).push(t, o),
                      (n.preOrderCheckHooks ??= []).push(t, o));
                })(n, o[n], e);
          } finally {
            null !== l && Dt(l), Ua(a), (s.resolving = !1), zy();
          }
        }
        return i;
      }
      function rv(t, e, n) {
        return !!(n[e + (t >> Yy)] & (1 << t));
      }
      function iv(t, e) {
        return !(t & k.Self || (t & k.Host && e));
      }
      class xi {
        constructor(e, n) {
          (this._tNode = e), (this._lView = n);
        }
        get(e, n, r) {
          return tv(this._tNode, this._lView, e, Sa(r), n);
        }
      }
      function Fx() {
        return new xi(it(), w());
      }
      function nt(t) {
        return Wn(() => {
          const e = t.prototype.constructor,
            n = e[Kn] || bd(e),
            r = Object.prototype;
          let i = Object.getPrototypeOf(t.prototype).constructor;
          for (; i && i !== r; ) {
            const o = i[Kn] || bd(i);
            if (o && o !== n) return o;
            i = Object.getPrototypeOf(i);
          }
          return (o) => new o();
        });
      }
      function bd(t) {
        return Wc(t)
          ? () => {
              const e = bd(G(t));
              return e && e();
            }
          : jr(t);
      }
      function ov(t) {
        const e = t[I],
          n = e.type;
        return 2 === n ? e.declTNode : 1 === n ? t[at] : null;
      }
      const Ni = "__parameters__";
      function Pi(t, e, n) {
        return Wn(() => {
          const r = (function Ed(t) {
            return function (...n) {
              if (t) {
                const r = t(...n);
                for (const i in r) this[i] = r[i];
              }
            };
          })(e);
          function i(...o) {
            if (this instanceof i) return r.apply(this, o), this;
            const s = new i(...o);
            return (a.annotation = s), a;
            function a(l, u, c) {
              const d = l.hasOwnProperty(Ni)
                ? l[Ni]
                : Object.defineProperty(l, Ni, { value: [] })[Ni];
              for (; d.length <= c; ) d.push(null);
              return (d[c] = d[c] || []).push(s), l;
            }
          }
          return (
            n && (i.prototype = Object.create(n.prototype)),
            (i.prototype.ngMetadataName = t),
            (i.annotationCls = i),
            i
          );
        });
      }
      function Uo(t, e) {
        t.forEach((n) => (Array.isArray(n) ? Uo(n, e) : e(n)));
      }
      function av(t, e, n) {
        e >= t.length ? t.push(n) : t.splice(e, 0, n);
      }
      function Wa(t, e) {
        return e >= t.length - 1 ? t.pop() : t.splice(e, 1)[0];
      }
      function kt(t, e, n) {
        let r = Fi(t, e);
        return (
          r >= 0
            ? (t[1 | r] = n)
            : ((r = ~r),
              (function Hx(t, e, n, r) {
                let i = t.length;
                if (i == e) t.push(n, r);
                else if (1 === i) t.push(r, t[0]), (t[0] = n);
                else {
                  for (i--, t.push(t[i - 1], t[i]); i > e; )
                    (t[i] = t[i - 2]), i--;
                  (t[e] = n), (t[e + 1] = r);
                }
              })(t, r, e, n)),
          r
        );
      }
      function Sd(t, e) {
        const n = Fi(t, e);
        if (n >= 0) return t[1 | n];
      }
      function Fi(t, e) {
        return (function lv(t, e, n) {
          let r = 0,
            i = t.length >> n;
          for (; i !== r; ) {
            const o = r + ((i - r) >> 1),
              s = t[o << n];
            if (e === s) return o << n;
            s > e ? (i = o) : (r = o + 1);
          }
          return ~(i << n);
        })(t, e, 1);
      }
      const Td = Ro(
          Pi("Inject", (t) => ({ token: t })),
          -1
        ),
        Qa = Ro(Pi("Optional"), 8),
        Za = Ro(Pi("SkipSelf"), 4);
      function el(t) {
        return 128 == (128 & t.flags);
      }
      var Tt = (() => (
        ((Tt = Tt || {})[(Tt.Important = 1)] = "Important"),
        (Tt[(Tt.DashCase = 2)] = "DashCase"),
        Tt
      ))();
      const aR = /^>|^->|<!--|-->|--!>|<!-$/g,
        lR = /(<|>)/,
        uR = "\u200b$1\u200b";
      const Nd = new Map();
      let cR = 0;
      const Pd = "__ngContext__";
      function ut(t, e) {
        Pt(e)
          ? ((t[Pd] = e[Lo]),
            (function fR(t) {
              Nd.set(t[Lo], t);
            })(e))
          : (t[Pd] = e);
      }
      let Fd;
      function kd(t, e) {
        return Fd(t, e);
      }
      function Wo(t) {
        const e = t[Ae];
        return St(e) ? e[Ae] : e;
      }
      function Av(t) {
        return xv(t[Fo]);
      }
      function Iv(t) {
        return xv(t[ln]);
      }
      function xv(t) {
        for (; null !== t && !St(t); ) t = t[ln];
        return t;
      }
      function Vi(t, e, n, r, i) {
        if (null != r) {
          let o,
            s = !1;
          St(r) ? (o = r) : Pt(r) && ((s = !0), (r = r[Ze]));
          const a = we(r);
          0 === t && null !== n
            ? null == i
              ? Fv(e, n, a)
              : Ur(e, n, a, i || null, !0)
            : 1 === t && null !== n
            ? Ur(e, n, a, i || null, !0)
            : 2 === t
            ? (function sl(t, e, n) {
                const r = il(t, e);
                r &&
                  (function RR(t, e, n, r) {
                    t.removeChild(e, n, r);
                  })(t, r, e, n);
              })(e, a, s)
            : 3 === t && e.destroyNode(a),
            null != o &&
              (function PR(t, e, n, r, i) {
                const o = n[En];
                o !== we(n) && Vi(e, t, r, o, i);
                for (let a = lt; a < n.length; a++) {
                  const l = n[a];
                  Qo(l[I], l, t, e, r, o);
                }
              })(e, t, o, n, i);
        }
      }
      function Ld(t, e) {
        return t.createComment(
          (function Cv(t) {
            return t.replace(aR, (e) => e.replace(lR, uR));
          })(e)
        );
      }
      function rl(t, e, n) {
        return t.createElement(e, n);
      }
      function Nv(t, e) {
        const n = t[Si],
          r = n.indexOf(e);
        xy(e), n.splice(r, 1);
      }
      function Vd(t, e) {
        if (t.length <= lt) return;
        const n = lt + e,
          r = t[n];
        if (r) {
          const i = r[ko];
          null !== i && i !== t && Nv(i, r), e > 0 && (t[n - 1][ln] = r[ln]);
          const o = Wa(t, lt + e);
          !(function bR(t, e) {
            Qo(t, e, e[Q], 2, null, null), (e[Ze] = null), (e[at] = null);
          })(r[I], r);
          const s = o[bn];
          null !== s && s.detachView(o[I]),
            (r[Ae] = null),
            (r[ln] = null),
            (r[K] &= -129);
        }
        return r;
      }
      function Ov(t, e) {
        if (!(256 & e[K])) {
          const n = e[Q];
          e[Aa]?.destroy(),
            e[Ia]?.destroy(),
            n.destroyNode && Qo(t, e, n, 3, null, null),
            (function MR(t) {
              let e = t[Fo];
              if (!e) return Bd(t[I], t);
              for (; e; ) {
                let n = null;
                if (Pt(e)) n = e[Fo];
                else {
                  const r = e[lt];
                  r && (n = r);
                }
                if (!n) {
                  for (; e && !e[ln] && e !== t; )
                    Pt(e) && Bd(e[I], e), (e = e[Ae]);
                  null === e && (e = t), Pt(e) && Bd(e[I], e), (n = e && e[ln]);
                }
                e = n;
              }
            })(e);
        }
      }
      function Bd(t, e) {
        if (!(256 & e[K])) {
          (e[K] &= -129),
            (e[K] |= 256),
            (function xR(t, e) {
              let n;
              if (null != t && null != (n = t.destroyHooks))
                for (let r = 0; r < n.length; r += 2) {
                  const i = e[n[r]];
                  if (!(i instanceof jo)) {
                    const o = n[r + 1];
                    if (Array.isArray(o))
                      for (let s = 0; s < o.length; s += 2) {
                        const a = i[o[s]],
                          l = o[s + 1];
                        Mn(4, a, l);
                        try {
                          l.call(a);
                        } finally {
                          Mn(5, a, l);
                        }
                      }
                    else {
                      Mn(4, i, o);
                      try {
                        o.call(i);
                      } finally {
                        Mn(5, i, o);
                      }
                    }
                  }
                }
            })(t, e),
            (function IR(t, e) {
              const n = t.cleanup,
                r = e[Di];
              if (null !== n)
                for (let o = 0; o < n.length - 1; o += 2)
                  if ("string" == typeof n[o]) {
                    const s = n[o + 3];
                    s >= 0 ? r[s]() : r[-s].unsubscribe(), (o += 2);
                  } else n[o].call(r[n[o + 1]]);
              null !== r && (e[Di] = null);
              const i = e[vr];
              if (null !== i) {
                e[vr] = null;
                for (let o = 0; o < i.length; o++) (0, i[o])();
              }
            })(t, e),
            1 === e[I].type && e[Q].destroy();
          const n = e[ko];
          if (null !== n && St(e[Ae])) {
            n !== e[Ae] && Nv(n, e);
            const r = e[bn];
            null !== r && r.detachView(t);
          }
          !(function hR(t) {
            Nd.delete(t[Lo]);
          })(e);
        }
      }
      function jd(t, e, n) {
        return (function Pv(t, e, n) {
          let r = e;
          for (; null !== r && 40 & r.type; ) r = (e = r).parent;
          if (null === r) return n[Ze];
          {
            const { componentOffset: i } = r;
            if (i > -1) {
              const { encapsulation: o } = t.data[r.directiveStart + i];
              if (o === wt.None || o === wt.Emulated) return null;
            }
            return Mt(r, n);
          }
        })(t, e.parent, n);
      }
      function Ur(t, e, n, r, i) {
        t.insertBefore(e, n, r, i);
      }
      function Fv(t, e, n) {
        t.appendChild(e, n);
      }
      function kv(t, e, n, r, i) {
        null !== r ? Ur(t, e, n, r, i) : Fv(t, e, n);
      }
      function il(t, e) {
        return t.parentNode(e);
      }
      let Hd,
        al,
        qd,
        ll,
        Bv = function Vv(t, e, n) {
          return 40 & t.type ? Mt(t, n) : null;
        };
      function ol(t, e, n, r) {
        const i = jd(t, r, e),
          o = e[Q],
          a = (function Lv(t, e, n) {
            return Bv(t, e, n);
          })(r.parent || e[at], r, e);
        if (null != i)
          if (Array.isArray(n))
            for (let l = 0; l < n.length; l++) kv(o, i, n[l], a, !1);
          else kv(o, i, n, a, !1);
        void 0 !== Hd && Hd(o, r, e, n, i);
      }
      function Ko(t, e) {
        if (null !== e) {
          const n = e.type;
          if (3 & n) return Mt(e, t);
          if (4 & n) return $d(-1, t[e.index]);
          if (8 & n) {
            const r = e.child;
            if (null !== r) return Ko(t, r);
            {
              const i = t[e.index];
              return St(i) ? $d(-1, i) : we(i);
            }
          }
          if (32 & n) return kd(e, t)() || we(t[e.index]);
          {
            const r = Hv(t, e);
            return null !== r
              ? Array.isArray(r)
                ? r[0]
                : Ko(Wo(t[Ve]), r)
              : Ko(t, e.next);
          }
        }
        return null;
      }
      function Hv(t, e) {
        return null !== e ? t[Ve][at].projection[e.projection] : null;
      }
      function $d(t, e) {
        const n = lt + t + 1;
        if (n < e.length) {
          const r = e[n],
            i = r[I].firstChild;
          if (null !== i) return Ko(r, i);
        }
        return e[En];
      }
      function Ud(t, e, n, r, i, o, s) {
        for (; null != n; ) {
          const a = r[n.index],
            l = n.type;
          if (
            (s && 0 === e && (a && ut(we(a), r), (n.flags |= 2)),
            32 != (32 & n.flags))
          )
            if (8 & l) Ud(t, e, n.child, r, i, o, !1), Vi(e, t, i, a, o);
            else if (32 & l) {
              const u = kd(n, r);
              let c;
              for (; (c = u()); ) Vi(e, t, i, c, o);
              Vi(e, t, i, a, o);
            } else 16 & l ? Uv(t, e, r, n, i, o) : Vi(e, t, i, a, o);
          n = s ? n.projectionNext : n.next;
        }
      }
      function Qo(t, e, n, r, i, o) {
        Ud(n, r, t.firstChild, e, i, o, !1);
      }
      function Uv(t, e, n, r, i, o) {
        const s = n[Ve],
          l = s[at].projection[r.projection];
        if (Array.isArray(l))
          for (let u = 0; u < l.length; u++) Vi(e, t, i, l[u], o);
        else {
          let u = l;
          const c = s[Ae];
          el(r) && (u.flags |= 128), Ud(t, e, u, c, i, o, !0);
        }
      }
      function zv(t, e, n) {
        "" === n
          ? t.removeAttribute(e, "class")
          : t.setAttribute(e, "class", n);
      }
      function qv(t, e, n) {
        const { mergedAttrs: r, classes: i, styles: o } = n;
        null !== r && td(t, e, r),
          null !== i && zv(t, e, i),
          null !== o &&
            (function kR(t, e, n) {
              t.setAttribute(e, "style", n);
            })(t, e, o);
      }
      function Bi(t) {
        return (
          (function zd() {
            if (void 0 === al && ((al = null), Ce.trustedTypes))
              try {
                al = Ce.trustedTypes.createPolicy("angular", {
                  createHTML: (t) => t,
                  createScript: (t) => t,
                  createScriptURL: (t) => t,
                });
              } catch {}
            return al;
          })()?.createHTML(t) || t
        );
      }
      function Zo() {
        if (void 0 !== qd) return qd;
        if (typeof document < "u") return document;
        throw new v(210, !1);
      }
      function Gd() {
        if (void 0 === ll && ((ll = null), Ce.trustedTypes))
          try {
            ll = Ce.trustedTypes.createPolicy("angular#unsafe-bypass", {
              createHTML: (t) => t,
              createScript: (t) => t,
              createScriptURL: (t) => t,
            });
          } catch {}
        return ll;
      }
      function Gv(t) {
        return Gd()?.createHTML(t) || t;
      }
      function Kv(t) {
        return Gd()?.createScriptURL(t) || t;
      }
      class zr {
        constructor(e) {
          this.changingThisBreaksApplicationSecurity = e;
        }
        toString() {
          return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see ${zm})`;
        }
      }
      class HR extends zr {
        getTypeName() {
          return "HTML";
        }
      }
      class $R extends zr {
        getTypeName() {
          return "Style";
        }
      }
      class UR extends zr {
        getTypeName() {
          return "Script";
        }
      }
      class zR extends zr {
        getTypeName() {
          return "URL";
        }
      }
      class qR extends zr {
        getTypeName() {
          return "ResourceURL";
        }
      }
      function Lt(t) {
        return t instanceof zr ? t.changingThisBreaksApplicationSecurity : t;
      }
      function Rn(t, e) {
        const n = (function GR(t) {
          return (t instanceof zr && t.getTypeName()) || null;
        })(t);
        if (null != n && n !== e) {
          if ("ResourceURL" === n && "URL" === e) return !0;
          throw new Error(`Required a safe ${e}, got a ${n} (see ${zm})`);
        }
        return n === e;
      }
      class XR {
        constructor(e) {
          this.inertDocumentHelper = e;
        }
        getInertBodyElement(e) {
          e = "<body><remove></remove>" + e;
          try {
            const n = new window.DOMParser().parseFromString(
              Bi(e),
              "text/html"
            ).body;
            return null === n
              ? this.inertDocumentHelper.getInertBodyElement(e)
              : (n.removeChild(n.firstChild), n);
          } catch {
            return null;
          }
        }
      }
      class JR {
        constructor(e) {
          (this.defaultDoc = e),
            (this.inertDocument =
              this.defaultDoc.implementation.createHTMLDocument(
                "sanitization-inert"
              ));
        }
        getInertBodyElement(e) {
          const n = this.inertDocument.createElement("template");
          return (n.innerHTML = Bi(e)), n;
        }
      }
      const tN = /^(?!javascript:)(?:[a-z0-9+.-]+:|[^&:\/?#]*(?:[\/?#]|$))/i;
      function ul(t) {
        return (t = String(t)).match(tN) ? t : "unsafe:" + t;
      }
      function Xn(t) {
        const e = {};
        for (const n of t.split(",")) e[n] = !0;
        return e;
      }
      function Yo(...t) {
        const e = {};
        for (const n of t)
          for (const r in n) n.hasOwnProperty(r) && (e[r] = !0);
        return e;
      }
      const Zv = Xn("area,br,col,hr,img,wbr"),
        Yv = Xn("colgroup,dd,dt,li,p,tbody,td,tfoot,th,thead,tr"),
        Xv = Xn("rp,rt"),
        Wd = Yo(
          Zv,
          Yo(
            Yv,
            Xn(
              "address,article,aside,blockquote,caption,center,del,details,dialog,dir,div,dl,figure,figcaption,footer,h1,h2,h3,h4,h5,h6,header,hgroup,hr,ins,main,map,menu,nav,ol,pre,section,summary,table,ul"
            )
          ),
          Yo(
            Xv,
            Xn(
              "a,abbr,acronym,audio,b,bdi,bdo,big,br,cite,code,del,dfn,em,font,i,img,ins,kbd,label,map,mark,picture,q,ruby,rp,rt,s,samp,small,source,span,strike,strong,sub,sup,time,track,tt,u,var,video"
            )
          ),
          Yo(Xv, Yv)
        ),
        Kd = Xn("background,cite,href,itemtype,longdesc,poster,src,xlink:href"),
        Jv = Yo(
          Kd,
          Xn(
            "abbr,accesskey,align,alt,autoplay,axis,bgcolor,border,cellpadding,cellspacing,class,clear,color,cols,colspan,compact,controls,coords,datetime,default,dir,download,face,headers,height,hidden,hreflang,hspace,ismap,itemscope,itemprop,kind,label,lang,language,loop,media,muted,nohref,nowrap,open,preload,rel,rev,role,rows,rowspan,rules,scope,scrolling,shape,size,sizes,span,srclang,srcset,start,summary,tabindex,target,title,translate,type,usemap,valign,value,vspace,width"
          ),
          Xn(
            "aria-activedescendant,aria-atomic,aria-autocomplete,aria-busy,aria-checked,aria-colcount,aria-colindex,aria-colspan,aria-controls,aria-current,aria-describedby,aria-details,aria-disabled,aria-dropeffect,aria-errormessage,aria-expanded,aria-flowto,aria-grabbed,aria-haspopup,aria-hidden,aria-invalid,aria-keyshortcuts,aria-label,aria-labelledby,aria-level,aria-live,aria-modal,aria-multiline,aria-multiselectable,aria-orientation,aria-owns,aria-placeholder,aria-posinset,aria-pressed,aria-readonly,aria-relevant,aria-required,aria-roledescription,aria-rowcount,aria-rowindex,aria-rowspan,aria-selected,aria-setsize,aria-sort,aria-valuemax,aria-valuemin,aria-valuenow,aria-valuetext"
          )
        ),
        nN = Xn("script,style,template");
      class rN {
        constructor() {
          (this.sanitizedSomething = !1), (this.buf = []);
        }
        sanitizeChildren(e) {
          let n = e.firstChild,
            r = !0;
          for (; n; )
            if (
              (n.nodeType === Node.ELEMENT_NODE
                ? (r = this.startElement(n))
                : n.nodeType === Node.TEXT_NODE
                ? this.chars(n.nodeValue)
                : (this.sanitizedSomething = !0),
              r && n.firstChild)
            )
              n = n.firstChild;
            else
              for (; n; ) {
                n.nodeType === Node.ELEMENT_NODE && this.endElement(n);
                let i = this.checkClobberedElement(n, n.nextSibling);
                if (i) {
                  n = i;
                  break;
                }
                n = this.checkClobberedElement(n, n.parentNode);
              }
          return this.buf.join("");
        }
        startElement(e) {
          const n = e.nodeName.toLowerCase();
          if (!Wd.hasOwnProperty(n))
            return (this.sanitizedSomething = !0), !nN.hasOwnProperty(n);
          this.buf.push("<"), this.buf.push(n);
          const r = e.attributes;
          for (let i = 0; i < r.length; i++) {
            const o = r.item(i),
              s = o.name,
              a = s.toLowerCase();
            if (!Jv.hasOwnProperty(a)) {
              this.sanitizedSomething = !0;
              continue;
            }
            let l = o.value;
            Kd[a] && (l = ul(l)), this.buf.push(" ", s, '="', e_(l), '"');
          }
          return this.buf.push(">"), !0;
        }
        endElement(e) {
          const n = e.nodeName.toLowerCase();
          Wd.hasOwnProperty(n) &&
            !Zv.hasOwnProperty(n) &&
            (this.buf.push("</"), this.buf.push(n), this.buf.push(">"));
        }
        chars(e) {
          this.buf.push(e_(e));
        }
        checkClobberedElement(e, n) {
          if (
            n &&
            (e.compareDocumentPosition(n) &
              Node.DOCUMENT_POSITION_CONTAINED_BY) ===
              Node.DOCUMENT_POSITION_CONTAINED_BY
          )
            throw new Error(
              `Failed to sanitize html because the element is clobbered: ${e.outerHTML}`
            );
          return n;
        }
      }
      const iN = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g,
        oN = /([^\#-~ |!])/g;
      function e_(t) {
        return t
          .replace(/&/g, "&amp;")
          .replace(iN, function (e) {
            return (
              "&#" +
              (1024 * (e.charCodeAt(0) - 55296) +
                (e.charCodeAt(1) - 56320) +
                65536) +
              ";"
            );
          })
          .replace(oN, function (e) {
            return "&#" + e.charCodeAt(0) + ";";
          })
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");
      }
      let cl;
      function t_(t, e) {
        let n = null;
        try {
          cl =
            cl ||
            (function Qv(t) {
              const e = new JR(t);
              return (function eN() {
                try {
                  return !!new window.DOMParser().parseFromString(
                    Bi(""),
                    "text/html"
                  );
                } catch {
                  return !1;
                }
              })()
                ? new XR(e)
                : e;
            })(t);
          let r = e ? String(e) : "";
          n = cl.getInertBodyElement(r);
          let i = 5,
            o = r;
          do {
            if (0 === i)
              throw new Error(
                "Failed to sanitize html because the input is unstable"
              );
            i--, (r = o), (o = n.innerHTML), (n = cl.getInertBodyElement(r));
          } while (r !== o);
          return Bi(new rN().sanitizeChildren(Qd(n) || n));
        } finally {
          if (n) {
            const r = Qd(n) || n;
            for (; r.firstChild; ) r.removeChild(r.firstChild);
          }
        }
      }
      function Qd(t) {
        return "content" in t &&
          (function sN(t) {
            return (
              t.nodeType === Node.ELEMENT_NODE && "TEMPLATE" === t.nodeName
            );
          })(t)
          ? t.content
          : null;
      }
      var me = (() => (
        ((me = me || {})[(me.NONE = 0)] = "NONE"),
        (me[(me.HTML = 1)] = "HTML"),
        (me[(me.STYLE = 2)] = "STYLE"),
        (me[(me.SCRIPT = 3)] = "SCRIPT"),
        (me[(me.URL = 4)] = "URL"),
        (me[(me.RESOURCE_URL = 5)] = "RESOURCE_URL"),
        me
      ))();
      function Zd(t) {
        const e = Xo();
        return e
          ? Gv(e.sanitize(me.HTML, t) || "")
          : Rn(t, "HTML")
          ? Gv(Lt(t))
          : t_(Zo(), W(t));
      }
      function dl(t) {
        const e = Xo();
        return e
          ? e.sanitize(me.URL, t) || ""
          : Rn(t, "URL")
          ? Lt(t)
          : ul(W(t));
      }
      function n_(t) {
        const e = Xo();
        if (e) return Kv(e.sanitize(me.RESOURCE_URL, t) || "");
        if (Rn(t, "ResourceURL")) return Kv(Lt(t));
        throw new v(904, !1);
      }
      function Xo() {
        const t = w();
        return t && t[Vr].sanitizer;
      }
      class b {
        constructor(e, n) {
          (this._desc = e),
            (this.ngMetadataName = "InjectionToken"),
            (this.ɵprov = void 0),
            "number" == typeof n
              ? (this.__NG_ELEMENT_ID__ = n)
              : void 0 !== n &&
                (this.ɵprov = T({
                  token: this,
                  providedIn: n.providedIn || "root",
                  factory: n.factory,
                }));
        }
        get multi() {
          return this;
        }
        toString() {
          return `InjectionToken ${this._desc}`;
        }
      }
      const qr = new b("ENVIRONMENT_INITIALIZER"),
        i_ = new b("INJECTOR", -1),
        o_ = new b("INJECTOR_DEF_TYPES");
      class s_ {
        get(e, n = xo) {
          if (n === xo) {
            const r = new Error(`NullInjectorError: No provider for ${Ke(e)}!`);
            throw ((r.name = "NullInjectorError"), r);
          }
          return n;
        }
      }
      function fl(t) {
        return { ɵproviders: t };
      }
      function fN(...t) {
        return { ɵproviders: a_(0, t), ɵfromNgModule: !0 };
      }
      function a_(t, ...e) {
        const n = [],
          r = new Set();
        let i;
        return (
          Uo(e, (o) => {
            const s = o;
            Yd(s, n, [], r) && ((i ||= []), i.push(s));
          }),
          void 0 !== i && l_(i, n),
          n
        );
      }
      function l_(t, e) {
        for (let n = 0; n < t.length; n++) {
          const { providers: i } = t[n];
          Xd(i, (o) => {
            e.push(o);
          });
        }
      }
      function Yd(t, e, n, r) {
        if (!(t = G(t))) return !1;
        let i = null,
          o = Gm(t);
        const s = !o && se(t);
        if (o || s) {
          if (s && !s.standalone) return !1;
          i = t;
        } else {
          const l = t.ngModule;
          if (((o = Gm(l)), !o)) return !1;
          i = l;
        }
        const a = r.has(i);
        if (s) {
          if (a) return !1;
          if ((r.add(i), s.dependencies)) {
            const l =
              "function" == typeof s.dependencies
                ? s.dependencies()
                : s.dependencies;
            for (const u of l) Yd(u, e, n, r);
          }
        } else {
          if (!o) return !1;
          {
            if (null != o.imports && !a) {
              let u;
              r.add(i);
              try {
                Uo(o.imports, (c) => {
                  Yd(c, e, n, r) && ((u ||= []), u.push(c));
                });
              } finally {
              }
              void 0 !== u && l_(u, e);
            }
            if (!a) {
              const u = jr(i) || (() => new i());
              e.push(
                { provide: i, useFactory: u, deps: oe },
                { provide: o_, useValue: i, multi: !0 },
                { provide: qr, useValue: () => D(i), multi: !0 }
              );
            }
            const l = o.providers;
            null == l ||
              a ||
              Xd(l, (c) => {
                e.push(c);
              });
          }
        }
        return i !== t && void 0 !== t.providers;
      }
      function Xd(t, e) {
        for (let n of t)
          Kc(n) && (n = n.ɵproviders), Array.isArray(n) ? Xd(n, e) : e(n);
      }
      const hN = ce({ provide: String, useValue: ce });
      function Jd(t) {
        return null !== t && "object" == typeof t && hN in t;
      }
      function Gr(t) {
        return "function" == typeof t;
      }
      const ef = new b("Set Injector scope."),
        hl = {},
        gN = {};
      let tf;
      function pl() {
        return void 0 === tf && (tf = new s_()), tf;
      }
      class Nn {}
      class nf extends Nn {
        get destroyed() {
          return this._destroyed;
        }
        constructor(e, n, r, i) {
          super(),
            (this.parent = n),
            (this.source = r),
            (this.scopes = i),
            (this.records = new Map()),
            (this._ngOnDestroyHooks = new Set()),
            (this._onDestroyHooks = []),
            (this._destroyed = !1),
            sf(e, (s) => this.processProvider(s)),
            this.records.set(i_, ji(void 0, this)),
            i.has("environment") && this.records.set(Nn, ji(void 0, this));
          const o = this.records.get(ef);
          null != o && "string" == typeof o.value && this.scopes.add(o.value),
            (this.injectorDefTypes = new Set(this.get(o_.multi, oe, k.Self)));
        }
        destroy() {
          this.assertNotDestroyed(), (this._destroyed = !0);
          try {
            for (const n of this._ngOnDestroyHooks) n.ngOnDestroy();
            const e = this._onDestroyHooks;
            this._onDestroyHooks = [];
            for (const n of e) n();
          } finally {
            this.records.clear(),
              this._ngOnDestroyHooks.clear(),
              this.injectorDefTypes.clear();
          }
        }
        onDestroy(e) {
          return (
            this.assertNotDestroyed(),
            this._onDestroyHooks.push(e),
            () => this.removeOnDestroy(e)
          );
        }
        runInContext(e) {
          this.assertNotDestroyed();
          const n = yr(this),
            r = Dt(void 0);
          try {
            return e();
          } finally {
            yr(n), Dt(r);
          }
        }
        get(e, n = xo, r = k.Default) {
          if ((this.assertNotDestroyed(), e.hasOwnProperty(Jm)))
            return e[Jm](this);
          r = Sa(r);
          const i = yr(this),
            o = Dt(void 0);
          try {
            if (!(r & k.SkipSelf)) {
              let a = this.records.get(e);
              if (void 0 === a) {
                const l =
                  (function CN(t) {
                    return (
                      "function" == typeof t ||
                      ("object" == typeof t && t instanceof b)
                    );
                  })(e) && wa(e);
                (a = l && this.injectableDefInScope(l) ? ji(rf(e), hl) : null),
                  this.records.set(e, a);
              }
              if (null != a) return this.hydrate(e, a);
            }
            return (r & k.Self ? pl() : this.parent).get(
              e,
              (n = r & k.Optional && n === xo ? null : n)
            );
          } catch (s) {
            if ("NullInjectorError" === s.name) {
              if (((s[Ea] = s[Ea] || []).unshift(Ke(e)), i)) throw s;
              return (function gI(t, e, n, r) {
                const i = t[Ea];
                throw (
                  (e[Zm] && i.unshift(e[Zm]),
                  (t.message = (function mI(t, e, n, r = null) {
                    t =
                      t && "\n" === t.charAt(0) && "\u0275" == t.charAt(1)
                        ? t.slice(2)
                        : t;
                    let i = Ke(e);
                    if (Array.isArray(e)) i = e.map(Ke).join(" -> ");
                    else if ("object" == typeof e) {
                      let o = [];
                      for (let s in e)
                        if (e.hasOwnProperty(s)) {
                          let a = e[s];
                          o.push(
                            s +
                              ":" +
                              ("string" == typeof a ? JSON.stringify(a) : Ke(a))
                          );
                        }
                      i = `{${o.join(", ")}}`;
                    }
                    return `${n}${r ? "(" + r + ")" : ""}[${i}]: ${t.replace(
                      cI,
                      "\n  "
                    )}`;
                  })("\n" + t.message, i, n, r)),
                  (t.ngTokenPath = i),
                  (t[Ea] = null),
                  t)
                );
              })(s, e, "R3InjectorError", this.source);
            }
            throw s;
          } finally {
            Dt(o), yr(i);
          }
        }
        resolveInjectorInitializers() {
          const e = yr(this),
            n = Dt(void 0);
          try {
            const r = this.get(qr.multi, oe, k.Self);
            for (const i of r) i();
          } finally {
            yr(e), Dt(n);
          }
        }
        toString() {
          const e = [],
            n = this.records;
          for (const r of n.keys()) e.push(Ke(r));
          return `R3Injector[${e.join(", ")}]`;
        }
        assertNotDestroyed() {
          if (this._destroyed) throw new v(205, !1);
        }
        processProvider(e) {
          let n = Gr((e = G(e))) ? e : G(e && e.provide);
          const r = (function yN(t) {
            return Jd(t) ? ji(void 0, t.useValue) : ji(d_(t), hl);
          })(e);
          if (Gr(e) || !0 !== e.multi) this.records.get(n);
          else {
            let i = this.records.get(n);
            i ||
              ((i = ji(void 0, hl, !0)),
              (i.factory = () => Xc(i.multi)),
              this.records.set(n, i)),
              (n = e),
              i.multi.push(e);
          }
          this.records.set(n, r);
        }
        hydrate(e, n) {
          return (
            n.value === hl && ((n.value = gN), (n.value = n.factory())),
            "object" == typeof n.value &&
              n.value &&
              (function _N(t) {
                return (
                  null !== t &&
                  "object" == typeof t &&
                  "function" == typeof t.ngOnDestroy
                );
              })(n.value) &&
              this._ngOnDestroyHooks.add(n.value),
            n.value
          );
        }
        injectableDefInScope(e) {
          if (!e.providedIn) return !1;
          const n = G(e.providedIn);
          return "string" == typeof n
            ? "any" === n || this.scopes.has(n)
            : this.injectorDefTypes.has(n);
        }
        removeOnDestroy(e) {
          const n = this._onDestroyHooks.indexOf(e);
          -1 !== n && this._onDestroyHooks.splice(n, 1);
        }
      }
      function rf(t) {
        const e = wa(t),
          n = null !== e ? e.factory : jr(t);
        if (null !== n) return n;
        if (t instanceof b) throw new v(204, !1);
        if (t instanceof Function)
          return (function mN(t) {
            const e = t.length;
            if (e > 0)
              throw (
                ((function zo(t, e) {
                  const n = [];
                  for (let r = 0; r < t; r++) n.push(e);
                  return n;
                })(e, "?"),
                new v(204, !1))
              );
            const n = (function aI(t) {
              return (t && (t[ba] || t[Wm])) || null;
            })(t);
            return null !== n ? () => n.factory(t) : () => new t();
          })(t);
        throw new v(204, !1);
      }
      function d_(t, e, n) {
        let r;
        if (Gr(t)) {
          const i = G(t);
          return jr(i) || rf(i);
        }
        if (Jd(t)) r = () => G(t.useValue);
        else if (
          (function c_(t) {
            return !(!t || !t.useFactory);
          })(t)
        )
          r = () => t.useFactory(...Xc(t.deps || []));
        else if (
          (function u_(t) {
            return !(!t || !t.useExisting);
          })(t)
        )
          r = () => D(G(t.useExisting));
        else {
          const i = G(t && (t.useClass || t.provide));
          if (
            !(function vN(t) {
              return !!t.deps;
            })(t)
          )
            return jr(i) || rf(i);
          r = () => new i(...Xc(t.deps));
        }
        return r;
      }
      function ji(t, e, n = !1) {
        return { factory: t, value: e, multi: n ? [] : void 0 };
      }
      function sf(t, e) {
        for (const n of t)
          Array.isArray(n) ? sf(n, e) : n && Kc(n) ? sf(n.ɵproviders, e) : e(n);
      }
      const gl = new b("AppId", { providedIn: "root", factory: () => DN }),
        DN = "ng",
        f_ = new b("Platform Initializer"),
        Wr = new b("Platform ID", {
          providedIn: "platform",
          factory: () => "unknown",
        }),
        h_ = new b("AnimationModuleType"),
        p_ = new b("CSP nonce", {
          providedIn: "root",
          factory: () =>
            Zo()
              .body?.querySelector("[ngCspNonce]")
              ?.getAttribute("ngCspNonce") || null,
        });
      let m_ = (t, e) => null;
      function y_(t, e) {
        return m_(t, e);
      }
      class xN {}
      class C_ {}
      class NN {
        resolveComponentFactory(e) {
          throw (function RN(t) {
            const e = Error(`No component factory found for ${Ke(t)}.`);
            return (e.ngComponent = t), e;
          })(e);
        }
      }
      let ns = (() => {
        class t {}
        return (t.NULL = new NN()), t;
      })();
      function ON() {
        return Hi(it(), w());
      }
      function Hi(t, e) {
        return new Vt(Mt(t, e));
      }
      let Vt = (() => {
        class t {
          constructor(n) {
            this.nativeElement = n;
          }
        }
        return (t.__NG_ELEMENT_ID__ = ON), t;
      })();
      class rs {}
      let Jn = (() => {
          class t {
            constructor() {
              this.destroyNode = null;
            }
          }
          return (
            (t.__NG_ELEMENT_ID__ = () =>
              (function FN() {
                const t = w(),
                  n = Ft(it().index, t);
                return (Pt(n) ? n : t)[Q];
              })()),
            t
          );
        })(),
        kN = (() => {
          class t {}
          return (
            (t.ɵprov = T({
              token: t,
              providedIn: "root",
              factory: () => null,
            })),
            t
          );
        })();
      class is {
        constructor(e) {
          (this.full = e),
            (this.major = e.split(".")[0]),
            (this.minor = e.split(".")[1]),
            (this.patch = e.split(".").slice(2).join("."));
        }
      }
      const LN = new is("16.1.1"),
        yf = {};
      function os(t) {
        for (; t; ) {
          t[K] |= 64;
          const e = Wo(t);
          if (id(t) && !e) return t;
          t = e;
        }
        return null;
      }
      function vf(t) {
        return t.ngOriginalError;
      }
      class Dr {
        constructor() {
          this._console = console;
        }
        handleError(e) {
          const n = this._findOriginalError(e);
          this._console.error("ERROR", e),
            n && this._console.error("ORIGINAL ERROR", n);
        }
        _findOriginalError(e) {
          let n = e && vf(e);
          for (; n && vf(n); ) n = vf(n);
          return n || null;
        }
      }
      const E_ = new b("", { providedIn: "root", factory: () => !1 });
      function er(t) {
        return t instanceof Function ? t() : t;
      }
      class I_ extends Oa {
        constructor() {
          super(...arguments),
            (this.consumerAllowSignalWrites = !1),
            (this._lView = null);
        }
        set lView(e) {
          this._lView = e;
        }
        onConsumerDependencyMayHaveChanged() {
          os(this._lView);
        }
        onProducerUpdateValueVersion() {}
        get hasReadASignal() {
          return this.hasProducers;
        }
        runInContext(e, n, r) {
          const i = tt(this);
          this.trackingVersion++;
          try {
            e(n, r);
          } finally {
            tt(i);
          }
        }
        destroy() {
          this.trackingVersion++;
        }
      }
      let Dl = null;
      function x_() {
        return (Dl ??= new I_()), Dl;
      }
      function R_(t, e) {
        return t[e] ?? x_();
      }
      function N_(t, e) {
        const n = x_();
        n.hasReadASignal && ((t[e] = Dl), (n.lView = t), (Dl = new I_()));
      }
      const Z = {};
      function U(t) {
        O_(ne(), w(), mt() + t, !1);
      }
      function O_(t, e, n, r) {
        if (!r)
          if (3 == (3 & e[K])) {
            const o = t.preOrderCheckHooks;
            null !== o && Ba(e, o, n);
          } else {
            const o = t.preOrderHooks;
            null !== o && ja(e, o, 0, n);
          }
        Hr(n);
      }
      function V_(t, e = null, n = null, r) {
        const i = B_(t, e, n, r);
        return i.resolveInjectorInitializers(), i;
      }
      function B_(t, e = null, n = null, r, i = new Set()) {
        const o = [n || oe, fN(t)];
        return (
          (r = r || ("object" == typeof t ? void 0 : Ke(t))),
          new nf(o, e || pl(), r || null, i)
        );
      }
      let Bt = (() => {
        class t {
          static create(n, r) {
            if (Array.isArray(n)) return V_({ name: "" }, r, n, "");
            {
              const i = n.name ?? "";
              return V_({ name: i }, n.parent, n.providers, i);
            }
          }
        }
        return (
          (t.THROW_IF_NOT_FOUND = xo),
          (t.NULL = new s_()),
          (t.ɵprov = T({ token: t, providedIn: "any", factory: () => D(i_) })),
          (t.__NG_ELEMENT_ID__ = -1),
          t
        );
      })();
      function C(t, e = k.Default) {
        const n = w();
        return null === n ? D(t, e) : tv(it(), n, G(t), e);
      }
      function wl(t, e, n, r, i, o, s, a, l, u, c) {
        const d = e.blueprint.slice();
        return (
          (d[Ze] = i),
          (d[K] = 140 | r),
          (null !== u || (t && 2048 & t[K])) && (d[K] |= 2048),
          Iy(d),
          (d[Ae] = d[bi] = t),
          (d[Le] = n),
          (d[Vr] = s || (t && t[Vr])),
          (d[Q] = a || (t && t[Q])),
          (d[wi] = l || (t && t[wi]) || null),
          (d[at] = o),
          (d[Lo] = (function dR() {
            return cR++;
          })()),
          (d[Qn] = c),
          (d[fy] = u),
          (d[Ve] = 2 == e.type ? t[Ve] : d),
          d
        );
      }
      function Ui(t, e, n, r, i) {
        let o = t.data[e];
        if (null === o)
          (o = (function _f(t, e, n, r, i) {
            const o = Fy(),
              s = cd(),
              l = (t.data[e] = (function rO(t, e, n, r, i, o) {
                let s = e ? e.injectorIndex : -1,
                  a = 0;
                return (
                  (function Ti() {
                    return null !== $.skipHydrationRootTNode;
                  })() && (a |= 128),
                  {
                    type: n,
                    index: r,
                    insertBeforeIndex: null,
                    injectorIndex: s,
                    directiveStart: -1,
                    directiveEnd: -1,
                    directiveStylingLast: -1,
                    componentOffset: -1,
                    propertyBindings: null,
                    flags: a,
                    providerIndexes: 0,
                    value: i,
                    attrs: o,
                    mergedAttrs: null,
                    localNames: null,
                    initialInputs: void 0,
                    inputs: null,
                    outputs: null,
                    tView: null,
                    next: null,
                    prev: null,
                    projectionNext: null,
                    child: null,
                    parent: e,
                    projection: null,
                    styles: null,
                    stylesWithoutHost: null,
                    residualStyles: void 0,
                    classes: null,
                    classesWithoutHost: null,
                    residualClasses: void 0,
                    classBindings: 0,
                    styleBindings: 0,
                  }
                );
              })(0, s ? o : o && o.parent, n, e, r, i));
            return (
              null === t.firstChild && (t.firstChild = l),
              null !== o &&
                (s
                  ? null == o.child && null !== l.parent && (o.child = l)
                  : null === o.next && ((o.next = l), (l.prev = o))),
              l
            );
          })(t, e, n, r, i)),
            (function px() {
              return $.lFrame.inI18n;
            })() && (o.flags |= 32);
        else if (64 & o.type) {
          (o.type = n), (o.value = r), (o.attrs = i);
          const s = (function Bo() {
            const t = $.lFrame,
              e = t.currentTNode;
            return t.isParent ? e : e.parent;
          })();
          o.injectorIndex = null === s ? -1 : s.injectorIndex;
        }
        return In(o, !0), o;
      }
      function ss(t, e, n, r) {
        if (0 === n) return -1;
        const i = e.length;
        for (let o = 0; o < n; o++)
          e.push(r), t.blueprint.push(r), t.data.push(null);
        return i;
      }
      function H_(t, e, n, r, i) {
        const o = R_(e, Aa),
          s = mt(),
          a = 2 & r;
        try {
          if (
            (Hr(-1),
            a && e.length > te && O_(t, e, te, !1),
            Mn(a ? 2 : 0, i),
            a)
          )
            o.runInContext(n, r, i);
          else {
            const u = tt(null);
            try {
              n(r, i);
            } finally {
              tt(u);
            }
          }
        } finally {
          a && null === e[Aa] && N_(e, Aa), Hr(s), Mn(a ? 3 : 1, i);
        }
      }
      function Cf(t, e, n) {
        if (rd(e)) {
          const r = tt(null);
          try {
            const o = e.directiveEnd;
            for (let s = e.directiveStart; s < o; s++) {
              const a = t.data[s];
              a.contentQueries && a.contentQueries(1, n[s], s);
            }
          } finally {
            tt(r);
          }
        }
      }
      function Df(t, e, n) {
        Py() &&
          ((function cO(t, e, n, r) {
            const i = n.directiveStart,
              o = n.directiveEnd;
            Br(n) &&
              (function yO(t, e, n) {
                const r = Mt(e, t),
                  i = $_(n);
                let s = 16;
                n.signals ? (s = 4096) : n.onPush && (s = 64);
                const a = bl(
                  t,
                  wl(
                    t,
                    i,
                    null,
                    s,
                    r,
                    e,
                    null,
                    t[Vr].rendererFactory.createRenderer(r, n),
                    null,
                    null,
                    null
                  )
                );
                t[e.index] = a;
              })(e, n, t.data[i + n.componentOffset]),
              t.firstCreatePass || za(n, e),
              ut(r, e);
            const s = n.initialInputs;
            for (let a = i; a < o; a++) {
              const l = t.data[a],
                u = $r(e, t, a, n);
              ut(u, e),
                null !== s && vO(0, a - i, u, l, 0, s),
                un(l) && (Ft(n.index, e)[Le] = $r(e, t, a, n));
            }
          })(t, e, n, Mt(n, e)),
          64 == (64 & n.flags) && W_(t, e, n));
      }
      function wf(t, e, n = Mt) {
        const r = e.localNames;
        if (null !== r) {
          let i = e.index + 1;
          for (let o = 0; o < r.length; o += 2) {
            const s = r[o + 1],
              a = -1 === s ? n(e, t) : t[s];
            t[i++] = a;
          }
        }
      }
      function $_(t) {
        const e = t.tView;
        return null === e || e.incompleteFirstPass
          ? (t.tView = bf(
              1,
              null,
              t.template,
              t.decls,
              t.vars,
              t.directiveDefs,
              t.pipeDefs,
              t.viewQuery,
              t.schemas,
              t.consts,
              t.id
            ))
          : e;
      }
      function bf(t, e, n, r, i, o, s, a, l, u, c) {
        const d = te + r,
          f = d + i,
          h = (function YN(t, e) {
            const n = [];
            for (let r = 0; r < e; r++) n.push(r < t ? null : Z);
            return n;
          })(d, f),
          p = "function" == typeof u ? u() : u;
        return (h[I] = {
          type: t,
          blueprint: h,
          template: n,
          queries: null,
          viewQuery: a,
          declTNode: e,
          data: h.slice().fill(null, d),
          bindingStartIndex: d,
          expandoStartIndex: f,
          hostBindingOpCodes: null,
          firstCreatePass: !0,
          firstUpdatePass: !0,
          staticViewQueries: !1,
          staticContentQueries: !1,
          preOrderHooks: null,
          preOrderCheckHooks: null,
          contentHooks: null,
          contentCheckHooks: null,
          viewHooks: null,
          viewCheckHooks: null,
          destroyHooks: null,
          cleanup: null,
          contentQueries: null,
          components: null,
          directiveRegistry: "function" == typeof o ? o() : o,
          pipeRegistry: "function" == typeof s ? s() : s,
          firstChild: null,
          schemas: l,
          consts: p,
          incompleteFirstPass: !1,
          ssrId: c,
        });
      }
      let U_ = (t) => null;
      function z_(t, e, n, r) {
        for (let i in t)
          if (t.hasOwnProperty(i)) {
            n = null === n ? {} : n;
            const o = t[i];
            null === r
              ? q_(n, e, i, o)
              : r.hasOwnProperty(i) && q_(n, e, r[i], o);
          }
        return n;
      }
      function q_(t, e, n, r) {
        t.hasOwnProperty(n) ? t[n].push(e, r) : (t[n] = [e, r]);
      }
      function jt(t, e, n, r, i, o, s, a) {
        const l = Mt(e, n);
        let c,
          u = e.inputs;
        !a && null != u && (c = u[r])
          ? (Af(t, n, c, r, i),
            Br(e) &&
              (function sO(t, e) {
                const n = Ft(e, t);
                16 & n[K] || (n[K] |= 64);
              })(n, e.index))
          : 3 & e.type &&
            ((r = (function oO(t) {
              return "class" === t
                ? "className"
                : "for" === t
                ? "htmlFor"
                : "formaction" === t
                ? "formAction"
                : "innerHtml" === t
                ? "innerHTML"
                : "readonly" === t
                ? "readOnly"
                : "tabindex" === t
                ? "tabIndex"
                : t;
            })(r)),
            (i = null != s ? s(i, e.value || "", r) : i),
            o.setProperty(l, r, i));
      }
      function Ef(t, e, n, r) {
        if (Py()) {
          const i = null === r ? null : { "": -1 },
            o = (function fO(t, e) {
              const n = t.directiveRegistry;
              let r = null,
                i = null;
              if (n)
                for (let o = 0; o < n.length; o++) {
                  const s = n[o];
                  if (sy(e, s.selectors, !1))
                    if ((r || (r = []), un(s)))
                      if (null !== s.findHostDirectiveDefs) {
                        const a = [];
                        (i = i || new Map()),
                          s.findHostDirectiveDefs(s, a, i),
                          r.unshift(...a, s),
                          Sf(t, e, a.length);
                      } else r.unshift(s), Sf(t, e, 0);
                    else
                      (i = i || new Map()),
                        s.findHostDirectiveDefs?.(s, r, i),
                        r.push(s);
                }
              return null === r ? null : [r, i];
            })(t, n);
          let s, a;
          null === o ? (s = a = null) : ([s, a] = o),
            null !== s && G_(t, e, n, s, i, a),
            i &&
              (function hO(t, e, n) {
                if (e) {
                  const r = (t.localNames = []);
                  for (let i = 0; i < e.length; i += 2) {
                    const o = n[e[i + 1]];
                    if (null == o) throw new v(-301, !1);
                    r.push(e[i], o);
                  }
                }
              })(n, r, i);
        }
        n.mergedAttrs = Oo(n.mergedAttrs, n.attrs);
      }
      function G_(t, e, n, r, i, o) {
        for (let u = 0; u < r.length; u++) wd(za(n, e), t, r[u].type);
        !(function gO(t, e, n) {
          (t.flags |= 1),
            (t.directiveStart = e),
            (t.directiveEnd = e + n),
            (t.providerIndexes = e);
        })(n, t.data.length, r.length);
        for (let u = 0; u < r.length; u++) {
          const c = r[u];
          c.providersResolver && c.providersResolver(c);
        }
        let s = !1,
          a = !1,
          l = ss(t, e, r.length, null);
        for (let u = 0; u < r.length; u++) {
          const c = r[u];
          (n.mergedAttrs = Oo(n.mergedAttrs, c.hostAttrs)),
            mO(t, n, e, l, c),
            pO(l, c, i),
            null !== c.contentQueries && (n.flags |= 4),
            (null !== c.hostBindings ||
              null !== c.hostAttrs ||
              0 !== c.hostVars) &&
              (n.flags |= 64);
          const d = c.type.prototype;
          !s &&
            (d.ngOnChanges || d.ngOnInit || d.ngDoCheck) &&
            ((t.preOrderHooks ??= []).push(n.index), (s = !0)),
            !a &&
              (d.ngOnChanges || d.ngDoCheck) &&
              ((t.preOrderCheckHooks ??= []).push(n.index), (a = !0)),
            l++;
        }
        !(function iO(t, e, n) {
          const i = e.directiveEnd,
            o = t.data,
            s = e.attrs,
            a = [];
          let l = null,
            u = null;
          for (let c = e.directiveStart; c < i; c++) {
            const d = o[c],
              f = n ? n.get(d) : null,
              p = f ? f.outputs : null;
            (l = z_(d.inputs, c, l, f ? f.inputs : null)),
              (u = z_(d.outputs, c, u, p));
            const g = null === l || null === s || oy(e) ? null : _O(l, c, s);
            a.push(g);
          }
          null !== l &&
            (l.hasOwnProperty("class") && (e.flags |= 8),
            l.hasOwnProperty("style") && (e.flags |= 16)),
            (e.initialInputs = a),
            (e.inputs = l),
            (e.outputs = u);
        })(t, n, o);
      }
      function W_(t, e, n) {
        const r = n.directiveStart,
          i = n.directiveEnd,
          o = n.index,
          s = (function mx() {
            return $.lFrame.currentDirectiveIndex;
          })();
        try {
          Hr(o);
          for (let a = r; a < i; a++) {
            const l = t.data[a],
              u = e[a];
            fd(a),
              (null !== l.hostBindings ||
                0 !== l.hostVars ||
                null !== l.hostAttrs) &&
                dO(l, u);
          }
        } finally {
          Hr(-1), fd(s);
        }
      }
      function dO(t, e) {
        null !== t.hostBindings && t.hostBindings(1, e);
      }
      function Sf(t, e, n) {
        (e.componentOffset = n), (t.components ??= []).push(e.index);
      }
      function pO(t, e, n) {
        if (n) {
          if (e.exportAs)
            for (let r = 0; r < e.exportAs.length; r++) n[e.exportAs[r]] = t;
          un(e) && (n[""] = t);
        }
      }
      function mO(t, e, n, r, i) {
        t.data[r] = i;
        const o = i.factory || (i.factory = jr(i.type)),
          s = new jo(o, un(i), C);
        (t.blueprint[r] = s),
          (n[r] = s),
          (function lO(t, e, n, r, i) {
            const o = i.hostBindings;
            if (o) {
              let s = t.hostBindingOpCodes;
              null === s && (s = t.hostBindingOpCodes = []);
              const a = ~e.index;
              (function uO(t) {
                let e = t.length;
                for (; e > 0; ) {
                  const n = t[--e];
                  if ("number" == typeof n && n < 0) return n;
                }
                return 0;
              })(s) != a && s.push(a),
                s.push(n, r, o);
            }
          })(t, e, r, ss(t, n, i.hostVars, Z), i);
      }
      function On(t, e, n, r, i, o) {
        const s = Mt(t, e);
        !(function Mf(t, e, n, r, i, o, s) {
          if (null == o) t.removeAttribute(e, i, n);
          else {
            const a = null == s ? W(o) : s(o, r || "", i);
            t.setAttribute(e, i, a, n);
          }
        })(e[Q], s, o, t.value, n, r, i);
      }
      function vO(t, e, n, r, i, o) {
        const s = o[e];
        if (null !== s)
          for (let a = 0; a < s.length; ) K_(r, n, s[a++], s[a++], s[a++]);
      }
      function K_(t, e, n, r, i) {
        const o = tt(null);
        try {
          const s = t.inputTransforms;
          null !== s && s.hasOwnProperty(r) && (i = s[r].call(e, i)),
            null !== t.setInput ? t.setInput(e, i, n, r) : (e[r] = i);
        } finally {
          tt(o);
        }
      }
      function _O(t, e, n) {
        let r = null,
          i = 0;
        for (; i < n.length; ) {
          const o = n[i];
          if (0 !== o)
            if (5 !== o) {
              if ("number" == typeof o) break;
              if (t.hasOwnProperty(o)) {
                null === r && (r = []);
                const s = t[o];
                for (let a = 0; a < s.length; a += 2)
                  if (s[a] === e) {
                    r.push(o, s[a + 1], n[i + 1]);
                    break;
                  }
              }
              i += 2;
            } else i += 2;
          else i += 4;
        }
        return r;
      }
      function Q_(t, e, n, r) {
        return [t, !0, !1, e, null, 0, r, n, null, null, null];
      }
      function Z_(t, e) {
        const n = t.contentQueries;
        if (null !== n)
          for (let r = 0; r < n.length; r += 2) {
            const o = n[r + 1];
            if (-1 !== o) {
              const s = t.data[o];
              pd(n[r]), s.contentQueries(2, e[o], o);
            }
          }
      }
      function bl(t, e) {
        return t[Fo] ? (t[dy][ln] = e) : (t[Fo] = e), (t[dy] = e), e;
      }
      function Tf(t, e, n) {
        pd(0);
        const r = tt(null);
        try {
          e(t, n);
        } finally {
          tt(r);
        }
      }
      function eC(t, e) {
        const n = t[wi],
          r = n ? n.get(Dr, null) : null;
        r && r.handleError(e);
      }
      function Af(t, e, n, r, i) {
        for (let o = 0; o < n.length; ) {
          const s = n[o++],
            a = n[o++];
          K_(t.data[s], e[s], r, a, i);
        }
      }
      function tr(t, e, n) {
        const r = ka(e, t);
        !(function Rv(t, e, n) {
          t.setValue(e, n);
        })(t[Q], r, n);
      }
      function CO(t, e) {
        const n = Ft(e, t),
          r = n[I];
        !(function DO(t, e) {
          for (let n = e.length; n < t.blueprint.length; n++)
            e.push(t.blueprint[n]);
        })(r, n);
        const i = n[Ze];
        null !== i && null === n[Qn] && (n[Qn] = y_(i, n[wi])), If(r, n, n[Le]);
      }
      function If(t, e, n) {
        gd(e);
        try {
          const r = t.viewQuery;
          null !== r && Tf(1, r, n);
          const i = t.template;
          null !== i && H_(t, e, i, 1, n),
            t.firstCreatePass && (t.firstCreatePass = !1),
            t.staticContentQueries && Z_(t, e),
            t.staticViewQueries && Tf(2, t.viewQuery, n);
          const o = t.components;
          null !== o &&
            (function wO(t, e) {
              for (let n = 0; n < e.length; n++) CO(t, e[n]);
            })(e, o);
        } catch (r) {
          throw (
            (t.firstCreatePass &&
              ((t.incompleteFirstPass = !0), (t.firstCreatePass = !1)),
            r)
          );
        } finally {
          (e[K] &= -5), md();
        }
      }
      let El = (() => {
        class t {}
        return (t.__NG_ELEMENT_ID__ = EO), (t.__NG_ENV_ID__ = (e) => e), t;
      })();
      class bO extends El {
        constructor(e) {
          super(), (this._lView = e);
        }
        onDestroy(e) {
          return (
            Ny(this._lView, e),
            () =>
              (function ix(t, e) {
                if (null === t[vr]) return;
                const n = t[vr].indexOf(e);
                -1 !== n && t[vr].splice(n, 1);
              })(this._lView, e)
          );
        }
      }
      function EO() {
        return new bO(w());
      }
      let tC = (() => {
        class t {
          constructor() {
            (this.all = new Set()), (this.queue = new Map());
          }
          create(n, r, i) {
            const o = typeof Zone > "u" ? null : Zone.current,
              s = new GI(
                n,
                (u) => {
                  this.all.has(u) && this.queue.set(u, o);
                },
                i
              );
            let a;
            this.all.add(s), s.notify();
            const l = () => {
              s.cleanup(), a?.(), this.all.delete(s), this.queue.delete(s);
            };
            return (a = r?.onDestroy(l)), { destroy: l };
          }
          flush() {
            if (0 !== this.queue.size)
              for (const [n, r] of this.queue)
                this.queue.delete(n), r ? r.run(() => n.run()) : n.run();
          }
          get isQueueEmpty() {
            return 0 === this.queue.size;
          }
        }
        return (
          (t.ɵprov = T({
            token: t,
            providedIn: "root",
            factory: () => new t(),
          })),
          t
        );
      })();
      function Sl(t, e, n) {
        let r = n ? t.styles : null,
          i = n ? t.classes : null,
          o = 0;
        if (null !== e)
          for (let s = 0; s < e.length; s++) {
            const a = e[s];
            "number" == typeof a
              ? (o = a)
              : 1 == o
              ? (i = Gc(i, a))
              : 2 == o && (r = Gc(r, a + ": " + e[++s] + ";"));
          }
        n ? (t.styles = r) : (t.stylesWithoutHost = r),
          n ? (t.classes = i) : (t.classesWithoutHost = i);
      }
      function as(t, e, n, r, i = !1) {
        for (; null !== n; ) {
          const o = e[n.index];
          if ((null !== o && r.push(we(o)), St(o))) {
            for (let a = lt; a < o.length; a++) {
              const l = o[a],
                u = l[I].firstChild;
              null !== u && as(l[I], l, u, r);
            }
            o[En] !== o[Ze] && r.push(o[En]);
          }
          const s = n.type;
          if (8 & s) as(t, e, n.child, r);
          else if (32 & s) {
            const a = kd(n, e);
            let l;
            for (; (l = a()); ) r.push(l);
          } else if (16 & s) {
            const a = Hv(e, n);
            if (Array.isArray(a)) r.push(...a);
            else {
              const l = Wo(e[Ve]);
              as(l[I], l, a, r, !0);
            }
          }
          n = i ? n.projectionNext : n.next;
        }
        return r;
      }
      function Ml(t, e, n, r = !0) {
        const i = e[Vr].rendererFactory;
        i.begin && i.begin();
        try {
          nC(t, e, t.template, n);
        } catch (s) {
          throw (r && eC(e, s), s);
        } finally {
          i.end && i.end(), e[Vr].effectManager?.flush();
        }
      }
      function nC(t, e, n, r) {
        const i = e[K];
        if (256 != (256 & i)) {
          e[Vr].effectManager?.flush(), gd(e);
          try {
            Iy(e),
              (function Ly(t) {
                return ($.lFrame.bindingIndex = t);
              })(t.bindingStartIndex),
              null !== n && H_(t, e, n, 2, r);
            const s = 3 == (3 & i);
            if (s) {
              const u = t.preOrderCheckHooks;
              null !== u && Ba(e, u, null);
            } else {
              const u = t.preOrderHooks;
              null !== u && ja(e, u, 0, null), yd(e, 0);
            }
            if (
              ((function TO(t) {
                for (let e = Av(t); null !== e; e = Iv(e)) {
                  if (!e[hy]) continue;
                  const n = e[Si];
                  for (let r = 0; r < n.length; r++) {
                    rx(n[r]);
                  }
                }
              })(e),
              rC(e, 2),
              null !== t.contentQueries && Z_(t, e),
              s)
            ) {
              const u = t.contentCheckHooks;
              null !== u && Ba(e, u);
            } else {
              const u = t.contentHooks;
              null !== u && ja(e, u, 1), yd(e, 1);
            }
            !(function ZN(t, e) {
              const n = t.hostBindingOpCodes;
              if (null === n) return;
              const r = R_(e, Ia);
              try {
                for (let i = 0; i < n.length; i++) {
                  const o = n[i];
                  if (o < 0) Hr(~o);
                  else {
                    const s = o,
                      a = n[++i],
                      l = n[++i];
                    gx(a, s), r.runInContext(l, 2, e[s]);
                  }
                }
              } finally {
                null === e[Ia] && N_(e, Ia), Hr(-1);
              }
            })(t, e);
            const a = t.components;
            null !== a && oC(e, a, 0);
            const l = t.viewQuery;
            if ((null !== l && Tf(2, l, r), s)) {
              const u = t.viewCheckHooks;
              null !== u && Ba(e, u);
            } else {
              const u = t.viewHooks;
              null !== u && ja(e, u, 2), yd(e, 2);
            }
            !0 === t.firstUpdatePass && (t.firstUpdatePass = !1),
              (e[K] &= -73),
              xy(e);
          } finally {
            md();
          }
        }
      }
      function rC(t, e) {
        for (let n = Av(t); null !== n; n = Iv(n))
          for (let r = lt; r < n.length; r++) iC(n[r], e);
      }
      function AO(t, e, n) {
        iC(Ft(e, t), n);
      }
      function iC(t, e) {
        if (
          !(function tx(t) {
            return 128 == (128 & t[K]);
          })(t)
        )
          return;
        const n = t[I];
        if ((80 & t[K] && 0 === e) || 1024 & t[K] || 2 === e)
          nC(n, t, n.template, t[Le]);
        else if (t[Po] > 0) {
          rC(t, 1);
          const i = t[I].components;
          null !== i && oC(t, i, 1);
        }
      }
      function oC(t, e, n) {
        for (let r = 0; r < e.length; r++) AO(t, e[r], n);
      }
      class ls {
        get rootNodes() {
          const e = this._lView,
            n = e[I];
          return as(n, e, n.firstChild, []);
        }
        constructor(e, n) {
          (this._lView = e),
            (this._cdRefInjectingView = n),
            (this._appRef = null),
            (this._attachedToViewContainer = !1);
        }
        get context() {
          return this._lView[Le];
        }
        set context(e) {
          this._lView[Le] = e;
        }
        get destroyed() {
          return 256 == (256 & this._lView[K]);
        }
        destroy() {
          if (this._appRef) this._appRef.detachView(this);
          else if (this._attachedToViewContainer) {
            const e = this._lView[Ae];
            if (St(e)) {
              const n = e[8],
                r = n ? n.indexOf(this) : -1;
              r > -1 && (Vd(e, r), Wa(n, r));
            }
            this._attachedToViewContainer = !1;
          }
          Ov(this._lView[I], this._lView);
        }
        onDestroy(e) {
          Ny(this._lView, e);
        }
        markForCheck() {
          os(this._cdRefInjectingView || this._lView);
        }
        detach() {
          this._lView[K] &= -129;
        }
        reattach() {
          this._lView[K] |= 128;
        }
        detectChanges() {
          Ml(this._lView[I], this._lView, this.context);
        }
        checkNoChanges() {}
        attachToViewContainerRef() {
          if (this._appRef) throw new v(902, !1);
          this._attachedToViewContainer = !0;
        }
        detachFromAppRef() {
          (this._appRef = null),
            (function SR(t, e) {
              Qo(t, e, e[Q], 2, null, null);
            })(this._lView[I], this._lView);
        }
        attachToAppRef(e) {
          if (this._attachedToViewContainer) throw new v(902, !1);
          this._appRef = e;
        }
      }
      class IO extends ls {
        constructor(e) {
          super(e), (this._view = e);
        }
        detectChanges() {
          const e = this._view;
          Ml(e[I], e, e[Le], !1);
        }
        checkNoChanges() {}
        get context() {
          return null;
        }
      }
      class sC extends ns {
        constructor(e) {
          super(), (this.ngModule = e);
        }
        resolveComponentFactory(e) {
          const n = se(e);
          return new us(n, this.ngModule);
        }
      }
      function aC(t) {
        const e = [];
        for (let n in t)
          t.hasOwnProperty(n) && e.push({ propName: t[n], templateName: n });
        return e;
      }
      class RO {
        constructor(e, n) {
          (this.injector = e), (this.parentInjector = n);
        }
        get(e, n, r) {
          r = Sa(r);
          const i = this.injector.get(e, yf, r);
          return i !== yf || n === yf ? i : this.parentInjector.get(e, n, r);
        }
      }
      class us extends C_ {
        get inputs() {
          return aC(this.componentDef.inputs);
        }
        get outputs() {
          return aC(this.componentDef.outputs);
        }
        constructor(e, n) {
          super(),
            (this.componentDef = e),
            (this.ngModule = n),
            (this.componentType = e.type),
            (this.selector = (function MI(t) {
              return t.map(SI).join(",");
            })(e.selectors)),
            (this.ngContentSelectors = e.ngContentSelectors
              ? e.ngContentSelectors
              : []),
            (this.isBoundToModule = !!n);
        }
        create(e, n, r, i) {
          let o = (i = i || this.ngModule) instanceof Nn ? i : i?.injector;
          o &&
            null !== this.componentDef.getStandaloneInjector &&
            (o = this.componentDef.getStandaloneInjector(o) || o);
          const s = o ? new RO(e, o) : e,
            a = s.get(rs, null);
          if (null === a) throw new v(407, !1);
          const c = {
              rendererFactory: a,
              sanitizer: s.get(kN, null),
              effectManager: s.get(tC, null),
            },
            d = a.createRenderer(null, this.componentDef),
            f = this.componentDef.selectors[0][0] || "div",
            h = r
              ? (function XN(t, e, n, r) {
                  const o = r.get(E_, !1) || n === wt.ShadowDom,
                    s = t.selectRootElement(e, o);
                  return (
                    (function JN(t) {
                      U_(t);
                    })(s),
                    s
                  );
                })(d, r, this.componentDef.encapsulation, s)
              : rl(
                  d,
                  f,
                  (function xO(t) {
                    const e = t.toLowerCase();
                    return "svg" === e ? "svg" : "math" === e ? "math" : null;
                  })(f)
                ),
            m = this.componentDef.signals
              ? 4608
              : this.componentDef.onPush
              ? 576
              : 528,
            _ = bf(0, null, null, 1, 0, null, null, null, null, null, null),
            y = wl(null, _, null, m, null, null, c, d, s, null, null);
          let M, R;
          gd(y);
          try {
            const P = this.componentDef;
            let ue,
              ze = null;
            P.findHostDirectiveDefs
              ? ((ue = []),
                (ze = new Map()),
                P.findHostDirectiveDefs(P, ue, ze),
                ue.push(P))
              : (ue = [P]);
            const _n = (function OO(t, e) {
                const n = t[I],
                  r = te;
                return (t[r] = e), Ui(n, r, 2, "#host", null);
              })(y, h),
              Cn = (function PO(t, e, n, r, i, o, s) {
                const a = i[I];
                !(function FO(t, e, n, r) {
                  for (const i of t)
                    e.mergedAttrs = Oo(e.mergedAttrs, i.hostAttrs);
                  null !== e.mergedAttrs &&
                    (Sl(e, e.mergedAttrs, !0), null !== n && qv(r, n, e));
                })(r, t, e, s);
                let l = null;
                null !== e && (l = y_(e, i[wi]));
                const u = o.rendererFactory.createRenderer(e, n);
                let c = 16;
                n.signals ? (c = 4096) : n.onPush && (c = 64);
                const d = wl(
                  i,
                  $_(n),
                  null,
                  c,
                  i[t.index],
                  t,
                  o,
                  u,
                  null,
                  null,
                  l
                );
                return (
                  a.firstCreatePass && Sf(a, t, r.length - 1),
                  bl(i, d),
                  (i[t.index] = d)
                );
              })(_n, h, P, ue, y, c, d);
            (R = Ay(_, te)),
              h &&
                (function LO(t, e, n, r) {
                  if (r) td(t, n, ["ng-version", LN.full]);
                  else {
                    const { attrs: i, classes: o } = (function TI(t) {
                      const e = [],
                        n = [];
                      let r = 1,
                        i = 2;
                      for (; r < t.length; ) {
                        let o = t[r];
                        if ("string" == typeof o)
                          2 === i
                            ? "" !== o && e.push(o, t[++r])
                            : 8 === i && n.push(o);
                        else {
                          if (!an(i)) break;
                          i = o;
                        }
                        r++;
                      }
                      return { attrs: e, classes: n };
                    })(e.selectors[0]);
                    i && td(t, n, i),
                      o && o.length > 0 && zv(t, n, o.join(" "));
                  }
                })(d, P, h, r),
              void 0 !== n &&
                (function VO(t, e, n) {
                  const r = (t.projection = []);
                  for (let i = 0; i < e.length; i++) {
                    const o = n[i];
                    r.push(null != o ? Array.from(o) : null);
                  }
                })(R, this.ngContentSelectors, n),
              (M = (function kO(t, e, n, r, i, o) {
                const s = it(),
                  a = i[I],
                  l = Mt(s, i);
                G_(a, i, s, n, null, r);
                for (let c = 0; c < n.length; c++)
                  ut($r(i, a, s.directiveStart + c, s), i);
                W_(a, i, s), l && ut(l, i);
                const u = $r(i, a, s.directiveStart + s.componentOffset, s);
                if (((t[Le] = i[Le] = u), null !== o))
                  for (const c of o) c(u, e);
                return Cf(a, s, t), u;
              })(Cn, P, ue, ze, y, [BO])),
              If(_, y, null);
          } finally {
            md();
          }
          return new NO(this.componentType, M, Hi(R, y), y, R);
        }
      }
      class NO extends xN {
        constructor(e, n, r, i, o) {
          super(),
            (this.location = r),
            (this._rootLView = i),
            (this._tNode = o),
            (this.previousInputValues = null),
            (this.instance = n),
            (this.hostView = this.changeDetectorRef = new IO(i)),
            (this.componentType = e);
        }
        setInput(e, n) {
          const r = this._tNode.inputs;
          let i;
          if (null !== r && (i = r[e])) {
            if (
              ((this.previousInputValues ??= new Map()),
              this.previousInputValues.has(e) &&
                Object.is(this.previousInputValues.get(e), n))
            )
              return;
            const o = this._rootLView;
            Af(o[I], o, i, e, n),
              this.previousInputValues.set(e, n),
              os(Ft(this._tNode.index, o));
          }
        }
        get injector() {
          return new xi(this._tNode, this._rootLView);
        }
        destroy() {
          this.hostView.destroy();
        }
        onDestroy(e) {
          this.hostView.onDestroy(e);
        }
      }
      function BO() {
        const t = it();
        Va(w()[I], t);
      }
      function de(t) {
        let e = (function lC(t) {
            return Object.getPrototypeOf(t.prototype).constructor;
          })(t.type),
          n = !0;
        const r = [t];
        for (; e; ) {
          let i;
          if (un(t)) i = e.ɵcmp || e.ɵdir;
          else {
            if (e.ɵcmp) throw new v(903, !1);
            i = e.ɵdir;
          }
          if (i) {
            if (n) {
              r.push(i);
              const s = t;
              (s.inputs = Tl(t.inputs)),
                (s.inputTransforms = Tl(t.inputTransforms)),
                (s.declaredInputs = Tl(t.declaredInputs)),
                (s.outputs = Tl(t.outputs));
              const a = i.hostBindings;
              a && UO(t, a);
              const l = i.viewQuery,
                u = i.contentQueries;
              if (
                (l && HO(t, l),
                u && $O(t, u),
                _a(t.inputs, i.inputs),
                _a(t.declaredInputs, i.declaredInputs),
                _a(t.outputs, i.outputs),
                null !== i.inputTransforms &&
                  (null === s.inputTransforms && (s.inputTransforms = {}),
                  _a(s.inputTransforms, i.inputTransforms)),
                un(i) && i.data.animation)
              ) {
                const c = t.data;
                c.animation = (c.animation || []).concat(i.data.animation);
              }
            }
            const o = i.features;
            if (o)
              for (let s = 0; s < o.length; s++) {
                const a = o[s];
                a && a.ngInherit && a(t), a === de && (n = !1);
              }
          }
          e = Object.getPrototypeOf(e);
        }
        !(function jO(t) {
          let e = 0,
            n = null;
          for (let r = t.length - 1; r >= 0; r--) {
            const i = t[r];
            (i.hostVars = e += i.hostVars),
              (i.hostAttrs = Oo(i.hostAttrs, (n = Oo(n, i.hostAttrs))));
          }
        })(r);
      }
      function Tl(t) {
        return t === wn ? {} : t === oe ? [] : t;
      }
      function HO(t, e) {
        const n = t.viewQuery;
        t.viewQuery = n
          ? (r, i) => {
              e(r, i), n(r, i);
            }
          : e;
      }
      function $O(t, e) {
        const n = t.contentQueries;
        t.contentQueries = n
          ? (r, i, o) => {
              e(r, i, o), n(r, i, o);
            }
          : e;
      }
      function UO(t, e) {
        const n = t.hostBindings;
        t.hostBindings = n
          ? (r, i) => {
              e(r, i), n(r, i);
            }
          : e;
      }
      function fC(t) {
        const e = t.inputConfig,
          n = {};
        for (const r in e)
          if (e.hasOwnProperty(r)) {
            const i = e[r];
            Array.isArray(i) && i[2] && (n[r] = i[2]);
          }
        t.inputTransforms = n;
      }
      function Al(t) {
        return (
          !!(function xf(t) {
            return (
              null !== t && ("function" == typeof t || "object" == typeof t)
            );
          })(t) &&
          (Array.isArray(t) || (!(t instanceof Map) && Symbol.iterator in t))
        );
      }
      function ct(t, e, n) {
        return !Object.is(t[e], n) && ((t[e] = n), !0);
      }
      function It(t, e, n, r) {
        const i = w();
        return ct(i, Ai(), e) && (ne(), On(Ie(), i, t, e, n, r)), It;
      }
      function Gi(t, e, n, r, i, o) {
        const a = (function Kr(t, e, n, r) {
          const i = ct(t, e, n);
          return ct(t, e + 1, r) || i;
        })(
          t,
          (function Zn() {
            return $.lFrame.bindingIndex;
          })(),
          n,
          i
        );
        return Yn(2), a ? e + W(n) + r + W(i) + o : Z;
      }
      function ye(t, e, n, r, i, o, s, a) {
        const l = w(),
          u = ne(),
          c = t + te,
          d = u.firstCreatePass
            ? (function pP(t, e, n, r, i, o, s, a, l) {
                const u = e.consts,
                  c = Ui(e, t, 4, s || null, _r(u, a));
                Ef(e, n, c, _r(u, l)), Va(e, c);
                const d = (c.tView = bf(
                  2,
                  c,
                  r,
                  i,
                  o,
                  e.directiveRegistry,
                  e.pipeRegistry,
                  null,
                  e.schemas,
                  u,
                  null
                ));
                return (
                  null !== e.queries &&
                    (e.queries.template(e, c),
                    (d.queries = e.queries.embeddedTView(c))),
                  c
                );
              })(c, u, l, e, n, r, i, o, s)
            : u.data[c];
        In(d, !1);
        const f = SC(u, l, d, t);
        La() && ol(u, l, f, d),
          ut(f, l),
          bl(l, (l[c] = Q_(f, l, f, d))),
          Ra(d) && Df(u, l, d),
          null != s && wf(l, d, a);
      }
      let SC = function MC(t, e, n, r) {
        return Cr(!0), e[Q].createComment("");
      };
      function re(t, e, n) {
        const r = w();
        return ct(r, Ai(), e) && jt(ne(), Ie(), r, t, e, r[Q], n, !1), re;
      }
      function kf(t, e, n, r, i) {
        const s = i ? "class" : "style";
        Af(t, n, e.inputs[s], s, r);
      }
      function x(t, e, n, r) {
        const i = w(),
          o = ne(),
          s = te + t,
          a = i[Q],
          l = o.firstCreatePass
            ? (function _P(t, e, n, r, i, o) {
                const s = e.consts,
                  l = Ui(e, t, 2, r, _r(s, i));
                return (
                  Ef(e, n, l, _r(s, o)),
                  null !== l.attrs && Sl(l, l.attrs, !1),
                  null !== l.mergedAttrs && Sl(l, l.mergedAttrs, !0),
                  null !== e.queries && e.queries.elementStart(e, l),
                  l
                );
              })(s, o, i, e, n, r)
            : o.data[s],
          u = TC(o, i, l, a, e, t);
        i[s] = u;
        const c = Ra(l);
        return (
          In(l, !0),
          qv(a, u, l),
          32 != (32 & l.flags) && La() && ol(o, i, u, l),
          0 ===
            (function ox() {
              return $.lFrame.elementDepthCount;
            })() && ut(u, i),
          (function sx() {
            $.lFrame.elementDepthCount++;
          })(),
          c && (Df(o, i, l), Cf(o, l, i)),
          null !== r && wf(i, l),
          x
        );
      }
      function N() {
        let t = it();
        cd() ? dd() : ((t = t.parent), In(t, !1));
        const e = t;
        (function lx(t) {
          return $.skipHydrationRootTNode === t;
        })(e) &&
          (function fx() {
            $.skipHydrationRootTNode = null;
          })(),
          (function ax() {
            $.lFrame.elementDepthCount--;
          })();
        const n = ne();
        return (
          n.firstCreatePass && (Va(n, t), rd(t) && n.queries.elementEnd(t)),
          null != e.classesWithoutHost &&
            (function Tx(t) {
              return 0 != (8 & t.flags);
            })(e) &&
            kf(n, e, w(), e.classesWithoutHost, !0),
          null != e.stylesWithoutHost &&
            (function Ax(t) {
              return 0 != (16 & t.flags);
            })(e) &&
            kf(n, e, w(), e.stylesWithoutHost, !1),
          N
        );
      }
      function Be(t, e, n, r) {
        return x(t, e, n, r), N(), Be;
      }
      let TC = (t, e, n, r, i, o) => (
        Cr(!0),
        rl(
          r,
          i,
          (function qy() {
            return $.lFrame.currentNamespace;
          })()
        )
      );
      function ps(t, e, n) {
        const r = w(),
          i = ne(),
          o = t + te,
          s = i.firstCreatePass
            ? (function wP(t, e, n, r, i) {
                const o = e.consts,
                  s = _r(o, r),
                  a = Ui(e, t, 8, "ng-container", s);
                return (
                  null !== s && Sl(a, s, !0),
                  Ef(e, n, a, _r(o, i)),
                  null !== e.queries && e.queries.elementStart(e, a),
                  a
                );
              })(o, i, r, e, n)
            : i.data[o];
        In(s, !0);
        const a = IC(i, r, s, t);
        return (
          (r[o] = a),
          La() && ol(i, r, a, s),
          ut(a, r),
          Ra(s) && (Df(i, r, s), Cf(i, s, r)),
          null != n && wf(r, s),
          ps
        );
      }
      function gs() {
        let t = it();
        const e = ne();
        return (
          cd() ? dd() : ((t = t.parent), In(t, !1)),
          e.firstCreatePass && (Va(e, t), rd(t) && e.queries.elementEnd(t)),
          gs
        );
      }
      let IC = (t, e, n, r) => (Cr(!0), Ld(e[Q], ""));
      function Qr() {
        return w();
      }
      function ms(t) {
        return !!t && "function" == typeof t.then;
      }
      function xC(t) {
        return !!t && "function" == typeof t.subscribe;
      }
      function Ee(t, e, n, r) {
        const i = w(),
          o = ne(),
          s = it();
        return (
          (function NC(t, e, n, r, i, o, s) {
            const a = Ra(r),
              u =
                t.firstCreatePass &&
                (function X_(t) {
                  return t.cleanup || (t.cleanup = []);
                })(t),
              c = e[Le],
              d = (function Y_(t) {
                return t[Di] || (t[Di] = []);
              })(e);
            let f = !0;
            if (3 & r.type || s) {
              const g = Mt(r, e),
                m = s ? s(g) : g,
                _ = d.length,
                y = s ? (R) => s(we(R[r.index])) : r.index;
              let M = null;
              if (
                (!s &&
                  a &&
                  (M = (function SP(t, e, n, r) {
                    const i = t.cleanup;
                    if (null != i)
                      for (let o = 0; o < i.length - 1; o += 2) {
                        const s = i[o];
                        if (s === n && i[o + 1] === r) {
                          const a = e[Di],
                            l = i[o + 2];
                          return a.length > l ? a[l] : null;
                        }
                        "string" == typeof s && (o += 2);
                      }
                    return null;
                  })(t, e, i, r.index)),
                null !== M)
              )
                ((M.__ngLastListenerFn__ || M).__ngNextListenerFn__ = o),
                  (M.__ngLastListenerFn__ = o),
                  (f = !1);
              else {
                o = PC(r, e, c, o, !1);
                const R = n.listen(m, i, o);
                d.push(o, R), u && u.push(i, y, _, _ + 1);
              }
            } else o = PC(r, e, c, o, !1);
            const h = r.outputs;
            let p;
            if (f && null !== h && (p = h[i])) {
              const g = p.length;
              if (g)
                for (let m = 0; m < g; m += 2) {
                  const P = e[p[m]][p[m + 1]].subscribe(o),
                    ue = d.length;
                  d.push(o, P), u && u.push(i, r.index, ue, -(ue + 1));
                }
            }
          })(o, i, i[Q], s, t, e, r),
          Ee
        );
      }
      function OC(t, e, n, r) {
        try {
          return Mn(6, e, n), !1 !== n(r);
        } catch (i) {
          return eC(t, i), !1;
        } finally {
          Mn(7, e, n);
        }
      }
      function PC(t, e, n, r, i) {
        return function o(s) {
          if (s === Function) return r;
          os(t.componentOffset > -1 ? Ft(t.index, e) : e);
          let l = OC(e, n, r, s),
            u = o.__ngNextListenerFn__;
          for (; u; ) (l = OC(e, n, u, s) && l), (u = u.__ngNextListenerFn__);
          return i && !1 === l && s.preventDefault(), l;
        };
      }
      function Se(t = 1) {
        return (function vx(t) {
          return ($.lFrame.contextLView = (function _x(t, e) {
            for (; t > 0; ) (e = e[bi]), t--;
            return e;
          })(t, $.lFrame.contextLView))[Le];
        })(t);
      }
      function Ol(t, e) {
        return (t << 17) | (e << 2);
      }
      function wr(t) {
        return (t >> 17) & 32767;
      }
      function Vf(t) {
        return 2 | t;
      }
      function Zr(t) {
        return (131068 & t) >> 2;
      }
      function Bf(t, e) {
        return (-131069 & t) | (e << 2);
      }
      function jf(t) {
        return 1 | t;
      }
      function zC(t, e, n, r, i) {
        const o = t[n + 1],
          s = null === e;
        let a = r ? wr(o) : Zr(o),
          l = !1;
        for (; 0 !== a && (!1 === l || s); ) {
          const c = t[a + 1];
          PP(t[a], e) && ((l = !0), (t[a + 1] = r ? jf(c) : Vf(c))),
            (a = r ? wr(c) : Zr(c));
        }
        l && (t[n + 1] = r ? Vf(o) : jf(o));
      }
      function PP(t, e) {
        return (
          null === t ||
          null == e ||
          (Array.isArray(t) ? t[1] : t) === e ||
          (!(!Array.isArray(t) || "string" != typeof e) && Fi(t, e) >= 0)
        );
      }
      const Xe = { textEnd: 0, key: 0, keyEnd: 0, value: 0, valueEnd: 0 };
      function qC(t) {
        return t.substring(Xe.key, Xe.keyEnd);
      }
      function GC(t, e) {
        const n = Xe.textEnd;
        return n === e
          ? -1
          : ((e = Xe.keyEnd =
              (function VP(t, e, n) {
                for (; e < n && t.charCodeAt(e) > 32; ) e++;
                return e;
              })(t, (Xe.key = e), n)),
            Ji(t, e, n));
      }
      function Ji(t, e, n) {
        for (; e < n && t.charCodeAt(e) <= 32; ) e++;
        return e;
      }
      function eo(t, e, n) {
        return cn(t, e, n, !1), eo;
      }
      function Pl(t, e) {
        return cn(t, e, null, !0), Pl;
      }
      function nr(t) {
        !(function dn(t, e, n, r) {
          const i = ne(),
            o = Yn(2);
          i.firstUpdatePass && XC(i, null, o, r);
          const s = w();
          if (n !== Z && ct(s, o, n)) {
            const a = i.data[mt()];
            if (nD(a, r) && !YC(i, o)) {
              let l = r ? a.classesWithoutHost : a.stylesWithoutHost;
              null !== l && (n = Gc(l, n || "")), kf(i, a, s, n, r);
            } else
              !(function KP(t, e, n, r, i, o, s, a) {
                i === Z && (i = oe);
                let l = 0,
                  u = 0,
                  c = 0 < i.length ? i[0] : null,
                  d = 0 < o.length ? o[0] : null;
                for (; null !== c || null !== d; ) {
                  const f = l < i.length ? i[l + 1] : void 0,
                    h = u < o.length ? o[u + 1] : void 0;
                  let g,
                    p = null;
                  c === d
                    ? ((l += 2), (u += 2), f !== h && ((p = d), (g = h)))
                    : null === d || (null !== c && c < d)
                    ? ((l += 2), (p = c))
                    : ((u += 2), (p = d), (g = h)),
                    null !== p && eD(t, e, n, r, p, g, s, a),
                    (c = l < i.length ? i[l] : null),
                    (d = u < o.length ? o[u] : null);
                }
              })(
                i,
                a,
                s,
                s[Q],
                s[o + 1],
                (s[o + 1] = (function GP(t, e, n) {
                  if (null == n || "" === n) return oe;
                  const r = [],
                    i = Lt(n);
                  if (Array.isArray(i))
                    for (let o = 0; o < i.length; o++) t(r, i[o], !0);
                  else if ("object" == typeof i)
                    for (const o in i) i.hasOwnProperty(o) && t(r, o, i[o]);
                  else "string" == typeof i && e(r, i);
                  return r;
                })(t, e, n)),
                r,
                o
              );
          }
        })(WP, kn, t, !0);
      }
      function kn(t, e) {
        for (
          let n = (function kP(t) {
            return (
              (function KC(t) {
                (Xe.key = 0),
                  (Xe.keyEnd = 0),
                  (Xe.value = 0),
                  (Xe.valueEnd = 0),
                  (Xe.textEnd = t.length);
              })(t),
              GC(t, Ji(t, 0, Xe.textEnd))
            );
          })(e);
          n >= 0;
          n = GC(e, n)
        )
          kt(t, qC(e), !0);
      }
      function cn(t, e, n, r) {
        const i = w(),
          o = ne(),
          s = Yn(2);
        o.firstUpdatePass && XC(o, t, s, r),
          e !== Z &&
            ct(i, s, e) &&
            eD(
              o,
              o.data[mt()],
              i,
              i[Q],
              t,
              (i[s + 1] = (function QP(t, e) {
                return (
                  null == t ||
                    "" === t ||
                    ("string" == typeof e
                      ? (t += e)
                      : "object" == typeof t && (t = Ke(Lt(t)))),
                  t
                );
              })(e, n)),
              r,
              s
            );
      }
      function YC(t, e) {
        return e >= t.expandoStartIndex;
      }
      function XC(t, e, n, r) {
        const i = t.data;
        if (null === i[n + 1]) {
          const o = i[mt()],
            s = YC(t, n);
          nD(o, r) && null === e && !s && (e = !1),
            (e = (function $P(t, e, n, r) {
              const i = hd(t);
              let o = r ? e.residualClasses : e.residualStyles;
              if (null === i)
                0 === (r ? e.classBindings : e.styleBindings) &&
                  ((n = ys((n = Hf(null, t, e, n, r)), e.attrs, r)),
                  (o = null));
              else {
                const s = e.directiveStylingLast;
                if (-1 === s || t[s] !== i)
                  if (((n = Hf(i, t, e, n, r)), null === o)) {
                    let l = (function UP(t, e, n) {
                      const r = n ? e.classBindings : e.styleBindings;
                      if (0 !== Zr(r)) return t[wr(r)];
                    })(t, e, r);
                    void 0 !== l &&
                      Array.isArray(l) &&
                      ((l = Hf(null, t, e, l[1], r)),
                      (l = ys(l, e.attrs, r)),
                      (function zP(t, e, n, r) {
                        t[wr(n ? e.classBindings : e.styleBindings)] = r;
                      })(t, e, r, l));
                  } else
                    o = (function qP(t, e, n) {
                      let r;
                      const i = e.directiveEnd;
                      for (let o = 1 + e.directiveStylingLast; o < i; o++)
                        r = ys(r, t[o].hostAttrs, n);
                      return ys(r, e.attrs, n);
                    })(t, e, r);
              }
              return (
                void 0 !== o &&
                  (r ? (e.residualClasses = o) : (e.residualStyles = o)),
                n
              );
            })(i, o, e, r)),
            (function NP(t, e, n, r, i, o) {
              let s = o ? e.classBindings : e.styleBindings,
                a = wr(s),
                l = Zr(s);
              t[r] = n;
              let c,
                u = !1;
              if (
                (Array.isArray(n)
                  ? ((c = n[1]), (null === c || Fi(n, c) > 0) && (u = !0))
                  : (c = n),
                i)
              )
                if (0 !== l) {
                  const f = wr(t[a + 1]);
                  (t[r + 1] = Ol(f, a)),
                    0 !== f && (t[f + 1] = Bf(t[f + 1], r)),
                    (t[a + 1] = (function xP(t, e) {
                      return (131071 & t) | (e << 17);
                    })(t[a + 1], r));
                } else
                  (t[r + 1] = Ol(a, 0)),
                    0 !== a && (t[a + 1] = Bf(t[a + 1], r)),
                    (a = r);
              else
                (t[r + 1] = Ol(l, 0)),
                  0 === a ? (a = r) : (t[l + 1] = Bf(t[l + 1], r)),
                  (l = r);
              u && (t[r + 1] = Vf(t[r + 1])),
                zC(t, c, r, !0),
                zC(t, c, r, !1),
                (function OP(t, e, n, r, i) {
                  const o = i ? t.residualClasses : t.residualStyles;
                  null != o &&
                    "string" == typeof e &&
                    Fi(o, e) >= 0 &&
                    (n[r + 1] = jf(n[r + 1]));
                })(e, c, t, r, o),
                (s = Ol(a, l)),
                o ? (e.classBindings = s) : (e.styleBindings = s);
            })(i, o, e, n, s, r);
        }
      }
      function Hf(t, e, n, r, i) {
        let o = null;
        const s = n.directiveEnd;
        let a = n.directiveStylingLast;
        for (
          -1 === a ? (a = n.directiveStart) : a++;
          a < s && ((o = e[a]), (r = ys(r, o.hostAttrs, i)), o !== t);

        )
          a++;
        return null !== t && (n.directiveStylingLast = a), r;
      }
      function ys(t, e, n) {
        const r = n ? 1 : 2;
        let i = -1;
        if (null !== e)
          for (let o = 0; o < e.length; o++) {
            const s = e[o];
            "number" == typeof s
              ? (i = s)
              : i === r &&
                (Array.isArray(t) || (t = void 0 === t ? [] : ["", t]),
                kt(t, s, !!n || e[++o]));
          }
        return void 0 === t ? null : t;
      }
      function WP(t, e, n) {
        const r = String(e);
        "" !== r && !r.includes(" ") && kt(t, r, n);
      }
      function eD(t, e, n, r, i, o, s, a) {
        if (!(3 & e.type)) return;
        const l = t.data,
          u = l[a + 1],
          c = (function RP(t) {
            return 1 == (1 & t);
          })(u)
            ? tD(l, e, n, i, Zr(u), s)
            : void 0;
        Fl(c) ||
          (Fl(o) ||
            ((function IP(t) {
              return 2 == (2 & t);
            })(u) &&
              (o = tD(l, null, n, i, a, s))),
          (function FR(t, e, n, r, i) {
            if (e) i ? t.addClass(n, r) : t.removeClass(n, r);
            else {
              let o = -1 === r.indexOf("-") ? void 0 : Tt.DashCase;
              null == i
                ? t.removeStyle(n, r, o)
                : ("string" == typeof i &&
                    i.endsWith("!important") &&
                    ((i = i.slice(0, -10)), (o |= Tt.Important)),
                  t.setStyle(n, r, i, o));
            }
          })(r, s, ka(mt(), n), i, o));
      }
      function tD(t, e, n, r, i, o) {
        const s = null === e;
        let a;
        for (; i > 0; ) {
          const l = t[i],
            u = Array.isArray(l),
            c = u ? l[1] : l,
            d = null === c;
          let f = n[i + 1];
          f === Z && (f = d ? oe : void 0);
          let h = d ? Sd(f, r) : c === r ? f : void 0;
          if ((u && !Fl(h) && (h = Sd(l, r)), Fl(h) && ((a = h), s))) return a;
          const p = t[i + 1];
          i = s ? wr(p) : Zr(p);
        }
        if (null !== e) {
          let l = o ? e.residualClasses : e.residualStyles;
          null != l && (a = Sd(l, r));
        }
        return a;
      }
      function Fl(t) {
        return void 0 !== t;
      }
      function nD(t, e) {
        return 0 != (t.flags & (e ? 8 : 16));
      }
      function z(t, e = "") {
        const n = w(),
          r = ne(),
          i = t + te,
          o = r.firstCreatePass ? Ui(r, i, 1, e, null) : r.data[i],
          s = rD(r, n, o, e, t);
        (n[i] = s), La() && ol(r, n, s, o), In(o, !1);
      }
      let rD = (t, e, n, r, i) => (
        Cr(!0),
        (function nl(t, e) {
          return t.createText(e);
        })(e[Q], r)
      );
      function rr(t) {
        return Ht("", t, ""), rr;
      }
      function Ht(t, e, n) {
        const r = w(),
          i = (function qi(t, e, n, r) {
            return ct(t, Ai(), n) ? e + W(n) + r : Z;
          })(r, t, e, n);
        return i !== Z && tr(r, mt(), i), Ht;
      }
      function kl(t, e, n, r, i) {
        const o = w(),
          s = Gi(o, t, e, n, r, i);
        return s !== Z && tr(o, mt(), s), kl;
      }
      function $f(t, e, n) {
        const r = w();
        if (ct(r, Ai(), e)) {
          const o = ne(),
            s = Ie();
          jt(
            o,
            s,
            r,
            t,
            e,
            (function J_(t, e, n) {
              return (
                (null === t || un(t)) &&
                  (n = (function XI(t) {
                    for (; Array.isArray(t); ) {
                      if ("object" == typeof t[nd]) return t;
                      t = t[Ze];
                    }
                    return null;
                  })(n[e.index])),
                n[Q]
              );
            })(hd(o.data), s, r),
            n,
            !0
          );
        }
        return $f;
      }
      const no = "en-US";
      let bD = no;
      function qf(t, e, n, r, i) {
        if (((t = G(t)), Array.isArray(t)))
          for (let o = 0; o < t.length; o++) qf(t[o], e, n, r, i);
        else {
          const o = ne(),
            s = w();
          let a = Gr(t) ? t : G(t.provide),
            l = d_(t);
          const u = it(),
            c = 1048575 & u.providerIndexes,
            d = u.directiveStart,
            f = u.providerIndexes >> 20;
          if (Gr(t) || !t.multi) {
            const h = new jo(l, i, C),
              p = Wf(a, e, i ? c : c + f, d);
            -1 === p
              ? (wd(za(u, s), o, a),
                Gf(o, t, e.length),
                e.push(a),
                u.directiveStart++,
                u.directiveEnd++,
                i && (u.providerIndexes += 1048576),
                n.push(h),
                s.push(h))
              : ((n[p] = h), (s[p] = h));
          } else {
            const h = Wf(a, e, c + f, d),
              p = Wf(a, e, c, c + f),
              m = p >= 0 && n[p];
            if ((i && !m) || (!i && !(h >= 0 && n[h]))) {
              wd(za(u, s), o, a);
              const _ = (function gF(t, e, n, r, i) {
                const o = new jo(t, n, C);
                return (
                  (o.multi = []),
                  (o.index = e),
                  (o.componentProviders = 0),
                  KD(o, i, r && !n),
                  o
                );
              })(i ? pF : hF, n.length, i, r, l);
              !i && m && (n[p].providerFactory = _),
                Gf(o, t, e.length, 0),
                e.push(a),
                u.directiveStart++,
                u.directiveEnd++,
                i && (u.providerIndexes += 1048576),
                n.push(_),
                s.push(_);
            } else Gf(o, t, h > -1 ? h : p, KD(n[i ? p : h], l, !i && r));
            !i && r && m && n[p].componentProviders++;
          }
        }
      }
      function Gf(t, e, n, r) {
        const i = Gr(e),
          o = (function pN(t) {
            return !!t.useClass;
          })(e);
        if (i || o) {
          const l = (o ? G(e.useClass) : e).prototype.ngOnDestroy;
          if (l) {
            const u = t.destroyHooks || (t.destroyHooks = []);
            if (!i && e.multi) {
              const c = u.indexOf(n);
              -1 === c ? u.push(n, [r, l]) : u[c + 1].push(r, l);
            } else u.push(n, l);
          }
        }
      }
      function KD(t, e, n) {
        return n && t.componentProviders++, t.multi.push(e) - 1;
      }
      function Wf(t, e, n, r) {
        for (let i = n; i < r; i++) if (e[i] === t) return i;
        return -1;
      }
      function hF(t, e, n, r) {
        return Kf(this.multi, []);
      }
      function pF(t, e, n, r) {
        const i = this.multi;
        let o;
        if (this.providerFactory) {
          const s = this.providerFactory.componentProviders,
            a = $r(n, n[I], this.providerFactory.index, r);
          (o = a.slice(0, s)), Kf(i, o);
          for (let l = s; l < a.length; l++) o.push(a[l]);
        } else (o = []), Kf(i, o);
        return o;
      }
      function Kf(t, e) {
        for (let n = 0; n < t.length; n++) e.push((0, t[n])());
        return e;
      }
      function Me(t, e = []) {
        return (n) => {
          n.providersResolver = (r, i) =>
            (function fF(t, e, n) {
              const r = ne();
              if (r.firstCreatePass) {
                const i = un(t);
                qf(n, r.data, r.blueprint, i, !0),
                  qf(e, r.data, r.blueprint, i, !1);
              }
            })(r, i ? i(t) : t, e);
        };
      }
      class ro {}
      class QD {}
      class Qf extends ro {
        constructor(e, n, r) {
          super(),
            (this._parent = n),
            (this._bootstrapComponents = []),
            (this.destroyCbs = []),
            (this.componentFactoryResolver = new sC(this));
          const i = Ot(e);
          (this._bootstrapComponents = er(i.bootstrap)),
            (this._r3Injector = B_(
              e,
              n,
              [
                { provide: ro, useValue: this },
                { provide: ns, useValue: this.componentFactoryResolver },
                ...r,
              ],
              Ke(e),
              new Set(["environment"])
            )),
            this._r3Injector.resolveInjectorInitializers(),
            (this.instance = this._r3Injector.get(e));
        }
        get injector() {
          return this._r3Injector;
        }
        destroy() {
          const e = this._r3Injector;
          !e.destroyed && e.destroy(),
            this.destroyCbs.forEach((n) => n()),
            (this.destroyCbs = null);
        }
        onDestroy(e) {
          this.destroyCbs.push(e);
        }
      }
      class Zf extends QD {
        constructor(e) {
          super(), (this.moduleType = e);
        }
        create(e) {
          return new Qf(this.moduleType, e, []);
        }
      }
      class ZD extends ro {
        constructor(e) {
          super(),
            (this.componentFactoryResolver = new sC(this)),
            (this.instance = null);
          const n = new nf(
            [
              ...e.providers,
              { provide: ro, useValue: this },
              { provide: ns, useValue: this.componentFactoryResolver },
            ],
            e.parent || pl(),
            e.debugName,
            new Set(["environment"])
          );
          (this.injector = n),
            e.runEnvironmentInitializers && n.resolveInjectorInitializers();
        }
        destroy() {
          this.injector.destroy();
        }
        onDestroy(e) {
          this.injector.onDestroy(e);
        }
      }
      function Yf(t, e, n = null) {
        return new ZD({
          providers: t,
          parent: e,
          debugName: n,
          runEnvironmentInitializers: !0,
        }).injector;
      }
      let vF = (() => {
        class t {
          constructor(n) {
            (this._injector = n), (this.cachedInjectors = new Map());
          }
          getOrCreateStandaloneInjector(n) {
            if (!n.standalone) return null;
            if (!this.cachedInjectors.has(n.id)) {
              const r = a_(0, n.type),
                i =
                  r.length > 0
                    ? Yf([r], this._injector, `Standalone[${n.type.name}]`)
                    : null;
              this.cachedInjectors.set(n.id, i);
            }
            return this.cachedInjectors.get(n.id);
          }
          ngOnDestroy() {
            try {
              for (const n of this.cachedInjectors.values())
                null !== n && n.destroy();
            } finally {
              this.cachedInjectors.clear();
            }
          }
        }
        return (
          (t.ɵprov = T({
            token: t,
            providedIn: "environment",
            factory: () => new t(D(Nn)),
          })),
          t
        );
      })();
      function Hl(t) {
        t.getStandaloneInjector = (e) =>
          e.get(vF).getOrCreateStandaloneInjector(t);
      }
      function Jf(t) {
        return (e) => {
          setTimeout(t, void 0, e);
        };
      }
      const Oe = class zF extends qe {
        constructor(e = !1) {
          super(), (this.__isAsync = e);
        }
        emit(e) {
          super.next(e);
        }
        subscribe(e, n, r) {
          let i = e,
            o = n || (() => null),
            s = r;
          if (e && "object" == typeof e) {
            const l = e;
            (i = l.next?.bind(l)),
              (o = l.error?.bind(l)),
              (s = l.complete?.bind(l));
          }
          this.__isAsync && ((o = Jf(o)), i && (i = Jf(i)), s && (s = Jf(s)));
          const a = super.subscribe({ next: i, error: o, complete: s });
          return e instanceof Rt && e.add(a), a;
        }
      };
      let ir = (() => {
        class t {}
        return (t.__NG_ELEMENT_ID__ = KF), t;
      })();
      const GF = ir,
        WF = class extends GF {
          constructor(e, n, r) {
            super(),
              (this._declarationLView = e),
              (this._declarationTContainer = n),
              (this.elementRef = r);
          }
          get ssrId() {
            return this._declarationTContainer.tView?.ssrId || null;
          }
          createEmbeddedView(e, n) {
            return this.createEmbeddedViewImpl(e, n, null);
          }
          createEmbeddedViewImpl(e, n, r) {
            const s = this._declarationTContainer.tView,
              a = wl(
                this._declarationLView,
                s,
                e,
                4096 & this._declarationLView[K] ? 4096 : 16,
                null,
                s.declTNode,
                null,
                null,
                null,
                n || null,
                r || null
              );
            a[ko] = this._declarationLView[this._declarationTContainer.index];
            const u = this._declarationLView[bn];
            return (
              null !== u && (a[bn] = u.createEmbeddedView(s)),
              If(s, a, e),
              new ls(a)
            );
          }
        };
      function KF() {
        return (function $l(t, e) {
          return 4 & t.type ? new WF(e, t, Hi(t, e)) : null;
        })(it(), w());
      }
      let fn = (() => {
        class t {}
        return (t.__NG_ELEMENT_ID__ = tk), t;
      })();
      function tk() {
        return (function hw(t, e) {
          let n;
          const r = e[t.index];
          return (
            St(r)
              ? (n = r)
              : ((n = Q_(r, e, null, t)), (e[t.index] = n), bl(e, n)),
            pw(n, e, t, r),
            new dw(n, t, e)
          );
        })(it(), w());
      }
      const nk = fn,
        dw = class extends nk {
          constructor(e, n, r) {
            super(),
              (this._lContainer = e),
              (this._hostTNode = n),
              (this._hostLView = r);
          }
          get element() {
            return Hi(this._hostTNode, this._hostLView);
          }
          get injector() {
            return new xi(this._hostTNode, this._hostLView);
          }
          get parentInjector() {
            const e = Dd(this._hostTNode, this._hostLView);
            if (Qy(e)) {
              const n = $a(e, this._hostLView),
                r = Ha(e);
              return new xi(n[I].data[r + 8], n);
            }
            return new xi(null, this._hostLView);
          }
          clear() {
            for (; this.length > 0; ) this.remove(this.length - 1);
          }
          get(e) {
            const n = fw(this._lContainer);
            return (null !== n && n[e]) || null;
          }
          get length() {
            return this._lContainer.length - lt;
          }
          createEmbeddedView(e, n, r) {
            let i, o;
            "number" == typeof r
              ? (i = r)
              : null != r && ((i = r.index), (o = r.injector));
            const a = e.createEmbeddedViewImpl(n || {}, o, null);
            return this.insertImpl(a, i, false), a;
          }
          createComponent(e, n, r, i, o) {
            const s =
              e &&
              !(function $o(t) {
                return "function" == typeof t;
              })(e);
            let a;
            if (s) a = n;
            else {
              const g = n || {};
              (a = g.index),
                (r = g.injector),
                (i = g.projectableNodes),
                (o = g.environmentInjector || g.ngModuleRef);
            }
            const l = s ? e : new us(se(e)),
              u = r || this.parentInjector;
            if (!o && null == l.ngModule) {
              const m = (s ? u : this.parentInjector).get(Nn, null);
              m && (o = m);
            }
            se(l.componentType ?? {});
            const h = l.create(u, i, null, o);
            return this.insertImpl(h.hostView, a, false), h;
          }
          insert(e, n) {
            return this.insertImpl(e, n, !1);
          }
          insertImpl(e, n, r) {
            const i = e._lView,
              o = i[I];
            if (
              (function nx(t) {
                return St(t[Ae]);
              })(i)
            ) {
              const l = this.indexOf(e);
              if (-1 !== l) this.detach(l);
              else {
                const u = i[Ae],
                  c = new dw(u, u[at], u[Ae]);
                c.detach(c.indexOf(e));
              }
            }
            const s = this._adjustIndex(n),
              a = this._lContainer;
            if (
              ((function TR(t, e, n, r) {
                const i = lt + r,
                  o = n.length;
                r > 0 && (n[i - 1][ln] = e),
                  r < o - lt
                    ? ((e[ln] = n[i]), av(n, lt + r, e))
                    : (n.push(e), (e[ln] = null)),
                  (e[Ae] = n);
                const s = e[ko];
                null !== s &&
                  n !== s &&
                  (function AR(t, e) {
                    const n = t[Si];
                    e[Ve] !== e[Ae][Ae][Ve] && (t[hy] = !0),
                      null === n ? (t[Si] = [e]) : n.push(e);
                  })(s, e);
                const a = e[bn];
                null !== a && a.insertView(t), (e[K] |= 128);
              })(o, i, a, s),
              !r)
            ) {
              const l = $d(s, a),
                u = i[Q],
                c = il(u, a[En]);
              null !== c &&
                (function ER(t, e, n, r, i, o) {
                  (r[Ze] = i), (r[at] = e), Qo(t, r, n, 1, i, o);
                })(o, a[at], u, i, c, l);
            }
            return e.attachToViewContainerRef(), av(nh(a), s, e), e;
          }
          move(e, n) {
            return this.insert(e, n);
          }
          indexOf(e) {
            const n = fw(this._lContainer);
            return null !== n ? n.indexOf(e) : -1;
          }
          remove(e) {
            const n = this._adjustIndex(e, -1),
              r = Vd(this._lContainer, n);
            r && (Wa(nh(this._lContainer), n), Ov(r[I], r));
          }
          detach(e) {
            const n = this._adjustIndex(e, -1),
              r = Vd(this._lContainer, n);
            return r && null != Wa(nh(this._lContainer), n) ? new ls(r) : null;
          }
          _adjustIndex(e, n = 0) {
            return e ?? this.length + n;
          }
        };
      function fw(t) {
        return t[8];
      }
      function nh(t) {
        return t[8] || (t[8] = []);
      }
      let pw = function gw(t, e, n, r) {
        if (t[En]) return;
        let i;
        (i =
          8 & n.type
            ? we(r)
            : (function rk(t, e) {
                const n = t[Q],
                  r = n.createComment(""),
                  i = Mt(e, t);
                return (
                  Ur(
                    n,
                    il(n, i),
                    r,
                    (function NR(t, e) {
                      return t.nextSibling(e);
                    })(n, i),
                    !1
                  ),
                  r
                );
              })(e, n)),
          (t[En] = i);
      };
      const hh = new b("Application Initializer");
      let ph = (() => {
          class t {
            constructor() {
              (this.initialized = !1),
                (this.done = !1),
                (this.donePromise = new Promise((n, r) => {
                  (this.resolve = n), (this.reject = r);
                })),
                (this.appInits = E(hh, { optional: !0 }) ?? []);
            }
            runInitializers() {
              if (this.initialized) return;
              const n = [];
              for (const i of this.appInits) {
                const o = i();
                if (ms(o)) n.push(o);
                else if (xC(o)) {
                  const s = new Promise((a, l) => {
                    o.subscribe({ complete: a, error: l });
                  });
                  n.push(s);
                }
              }
              const r = () => {
                (this.done = !0), this.resolve();
              };
              Promise.all(n)
                .then(() => {
                  r();
                })
                .catch((i) => {
                  this.reject(i);
                }),
                0 === n.length && r(),
                (this.initialized = !0);
            }
          }
          return (
            (t.ɵfac = function (n) {
              return new (n || t)();
            }),
            (t.ɵprov = T({ token: t, factory: t.ɵfac, providedIn: "root" })),
            t
          );
        })(),
        jw = (() => {
          class t {
            log(n) {
              console.log(n);
            }
            warn(n) {
              console.warn(n);
            }
          }
          return (
            (t.ɵfac = function (n) {
              return new (n || t)();
            }),
            (t.ɵprov = T({
              token: t,
              factory: t.ɵfac,
              providedIn: "platform",
            })),
            t
          );
        })();
      const or = new b("LocaleId", {
        providedIn: "root",
        factory: () =>
          E(or, k.Optional | k.SkipSelf) ||
          (function Pk() {
            return (typeof $localize < "u" && $localize.locale) || no;
          })(),
      });
      let zl = (() => {
        class t {
          constructor() {
            (this.taskId = 0),
              (this.pendingTasks = new Set()),
              (this.hasPendingTasks = new pt(!1));
          }
          add() {
            this.hasPendingTasks.next(!0);
            const n = this.taskId++;
            return this.pendingTasks.add(n), n;
          }
          remove(n) {
            this.pendingTasks.delete(n),
              0 === this.pendingTasks.size && this.hasPendingTasks.next(!1);
          }
          ngOnDestroy() {
            this.pendingTasks.clear(), this.hasPendingTasks.next(!1);
          }
        }
        return (
          (t.ɵfac = function (n) {
            return new (n || t)();
          }),
          (t.ɵprov = T({ token: t, factory: t.ɵfac, providedIn: "root" })),
          t
        );
      })();
      class kk {
        constructor(e, n) {
          (this.ngModuleFactory = e), (this.componentFactories = n);
        }
      }
      let Hw = (() => {
        class t {
          compileModuleSync(n) {
            return new Zf(n);
          }
          compileModuleAsync(n) {
            return Promise.resolve(this.compileModuleSync(n));
          }
          compileModuleAndAllComponentsSync(n) {
            const r = this.compileModuleSync(n),
              o = er(Ot(n).declarations).reduce((s, a) => {
                const l = se(a);
                return l && s.push(new us(l)), s;
              }, []);
            return new kk(r, o);
          }
          compileModuleAndAllComponentsAsync(n) {
            return Promise.resolve(this.compileModuleAndAllComponentsSync(n));
          }
          clearCache() {}
          clearCacheFor(n) {}
          getModuleId(n) {}
        }
        return (
          (t.ɵfac = function (n) {
            return new (n || t)();
          }),
          (t.ɵprov = T({ token: t, factory: t.ɵfac, providedIn: "root" })),
          t
        );
      })();
      const Bk = (() => Promise.resolve(0))();
      function gh(t) {
        typeof Zone > "u"
          ? Bk.then(() => {
              t && t.apply(null, null);
            })
          : Zone.current.scheduleMicroTask("scheduleMicrotask", t);
      }
      function zw(...t) {}
      class he {
        constructor({
          enableLongStackTrace: e = !1,
          shouldCoalesceEventChangeDetection: n = !1,
          shouldCoalesceRunChangeDetection: r = !1,
        }) {
          if (
            ((this.hasPendingMacrotasks = !1),
            (this.hasPendingMicrotasks = !1),
            (this.isStable = !0),
            (this.onUnstable = new Oe(!1)),
            (this.onMicrotaskEmpty = new Oe(!1)),
            (this.onStable = new Oe(!1)),
            (this.onError = new Oe(!1)),
            typeof Zone > "u")
          )
            throw new v(908, !1);
          Zone.assertZonePatched();
          const i = this;
          (i._nesting = 0),
            (i._outer = i._inner = Zone.current),
            Zone.TaskTrackingZoneSpec &&
              (i._inner = i._inner.fork(new Zone.TaskTrackingZoneSpec())),
            e &&
              Zone.longStackTraceZoneSpec &&
              (i._inner = i._inner.fork(Zone.longStackTraceZoneSpec)),
            (i.shouldCoalesceEventChangeDetection = !r && n),
            (i.shouldCoalesceRunChangeDetection = r),
            (i.lastRequestAnimationFrameId = -1),
            (i.nativeRequestAnimationFrame = (function jk() {
              let t = Ce.requestAnimationFrame,
                e = Ce.cancelAnimationFrame;
              if (typeof Zone < "u" && t && e) {
                const n = t[Zone.__symbol__("OriginalDelegate")];
                n && (t = n);
                const r = e[Zone.__symbol__("OriginalDelegate")];
                r && (e = r);
              }
              return {
                nativeRequestAnimationFrame: t,
                nativeCancelAnimationFrame: e,
              };
            })().nativeRequestAnimationFrame),
            (function Uk(t) {
              const e = () => {
                !(function $k(t) {
                  t.isCheckStableRunning ||
                    -1 !== t.lastRequestAnimationFrameId ||
                    ((t.lastRequestAnimationFrameId =
                      t.nativeRequestAnimationFrame.call(Ce, () => {
                        t.fakeTopEventTask ||
                          (t.fakeTopEventTask = Zone.root.scheduleEventTask(
                            "fakeTopEventTask",
                            () => {
                              (t.lastRequestAnimationFrameId = -1),
                                yh(t),
                                (t.isCheckStableRunning = !0),
                                mh(t),
                                (t.isCheckStableRunning = !1);
                            },
                            void 0,
                            () => {},
                            () => {}
                          )),
                          t.fakeTopEventTask.invoke();
                      })),
                    yh(t));
                })(t);
              };
              t._inner = t._inner.fork({
                name: "angular",
                properties: { isAngularZone: !0 },
                onInvokeTask: (n, r, i, o, s, a) => {
                  try {
                    return qw(t), n.invokeTask(i, o, s, a);
                  } finally {
                    ((t.shouldCoalesceEventChangeDetection &&
                      "eventTask" === o.type) ||
                      t.shouldCoalesceRunChangeDetection) &&
                      e(),
                      Gw(t);
                  }
                },
                onInvoke: (n, r, i, o, s, a, l) => {
                  try {
                    return qw(t), n.invoke(i, o, s, a, l);
                  } finally {
                    t.shouldCoalesceRunChangeDetection && e(), Gw(t);
                  }
                },
                onHasTask: (n, r, i, o) => {
                  n.hasTask(i, o),
                    r === i &&
                      ("microTask" == o.change
                        ? ((t._hasPendingMicrotasks = o.microTask),
                          yh(t),
                          mh(t))
                        : "macroTask" == o.change &&
                          (t.hasPendingMacrotasks = o.macroTask));
                },
                onHandleError: (n, r, i, o) => (
                  n.handleError(i, o),
                  t.runOutsideAngular(() => t.onError.emit(o)),
                  !1
                ),
              });
            })(i);
        }
        static isInAngularZone() {
          return typeof Zone < "u" && !0 === Zone.current.get("isAngularZone");
        }
        static assertInAngularZone() {
          if (!he.isInAngularZone()) throw new v(909, !1);
        }
        static assertNotInAngularZone() {
          if (he.isInAngularZone()) throw new v(909, !1);
        }
        run(e, n, r) {
          return this._inner.run(e, n, r);
        }
        runTask(e, n, r, i) {
          const o = this._inner,
            s = o.scheduleEventTask("NgZoneEvent: " + i, e, Hk, zw, zw);
          try {
            return o.runTask(s, n, r);
          } finally {
            o.cancelTask(s);
          }
        }
        runGuarded(e, n, r) {
          return this._inner.runGuarded(e, n, r);
        }
        runOutsideAngular(e) {
          return this._outer.run(e);
        }
      }
      const Hk = {};
      function mh(t) {
        if (0 == t._nesting && !t.hasPendingMicrotasks && !t.isStable)
          try {
            t._nesting++, t.onMicrotaskEmpty.emit(null);
          } finally {
            if ((t._nesting--, !t.hasPendingMicrotasks))
              try {
                t.runOutsideAngular(() => t.onStable.emit(null));
              } finally {
                t.isStable = !0;
              }
          }
      }
      function yh(t) {
        t.hasPendingMicrotasks = !!(
          t._hasPendingMicrotasks ||
          ((t.shouldCoalesceEventChangeDetection ||
            t.shouldCoalesceRunChangeDetection) &&
            -1 !== t.lastRequestAnimationFrameId)
        );
      }
      function qw(t) {
        t._nesting++,
          t.isStable && ((t.isStable = !1), t.onUnstable.emit(null));
      }
      function Gw(t) {
        t._nesting--, mh(t);
      }
      class zk {
        constructor() {
          (this.hasPendingMicrotasks = !1),
            (this.hasPendingMacrotasks = !1),
            (this.isStable = !0),
            (this.onUnstable = new Oe()),
            (this.onMicrotaskEmpty = new Oe()),
            (this.onStable = new Oe()),
            (this.onError = new Oe());
        }
        run(e, n, r) {
          return e.apply(n, r);
        }
        runGuarded(e, n, r) {
          return e.apply(n, r);
        }
        runOutsideAngular(e) {
          return e();
        }
        runTask(e, n, r, i) {
          return e.apply(n, r);
        }
      }
      const Ww = new b("", { providedIn: "root", factory: Kw });
      function Kw() {
        const t = E(he);
        let e = !0;
        return zc(
          new pe((i) => {
            (e =
              t.isStable && !t.hasPendingMacrotasks && !t.hasPendingMicrotasks),
              t.runOutsideAngular(() => {
                i.next(e), i.complete();
              });
          }),
          new pe((i) => {
            let o;
            t.runOutsideAngular(() => {
              o = t.onStable.subscribe(() => {
                he.assertNotInAngularZone(),
                  gh(() => {
                    !e &&
                      !t.hasPendingMacrotasks &&
                      !t.hasPendingMicrotasks &&
                      ((e = !0), i.next(!0));
                  });
              });
            });
            const s = t.onUnstable.subscribe(() => {
              he.assertInAngularZone(),
                e &&
                  ((e = !1),
                  t.runOutsideAngular(() => {
                    i.next(!1);
                  }));
            });
            return () => {
              o.unsubscribe(), s.unsubscribe();
            };
          }).pipe($m())
        );
      }
      const Qw = new b(""),
        ql = new b("");
      let Ch,
        vh = (() => {
          class t {
            constructor(n, r, i) {
              (this._ngZone = n),
                (this.registry = r),
                (this._pendingCount = 0),
                (this._isZoneStable = !0),
                (this._didWork = !1),
                (this._callbacks = []),
                (this.taskTrackingZone = null),
                Ch ||
                  ((function qk(t) {
                    Ch = t;
                  })(i),
                  i.addToWindow(r)),
                this._watchAngularEvents(),
                n.run(() => {
                  this.taskTrackingZone =
                    typeof Zone > "u"
                      ? null
                      : Zone.current.get("TaskTrackingZone");
                });
            }
            _watchAngularEvents() {
              this._ngZone.onUnstable.subscribe({
                next: () => {
                  (this._didWork = !0), (this._isZoneStable = !1);
                },
              }),
                this._ngZone.runOutsideAngular(() => {
                  this._ngZone.onStable.subscribe({
                    next: () => {
                      he.assertNotInAngularZone(),
                        gh(() => {
                          (this._isZoneStable = !0),
                            this._runCallbacksIfReady();
                        });
                    },
                  });
                });
            }
            increasePendingRequestCount() {
              return (
                (this._pendingCount += 1),
                (this._didWork = !0),
                this._pendingCount
              );
            }
            decreasePendingRequestCount() {
              if (((this._pendingCount -= 1), this._pendingCount < 0))
                throw new Error("pending async requests below zero");
              return this._runCallbacksIfReady(), this._pendingCount;
            }
            isStable() {
              return (
                this._isZoneStable &&
                0 === this._pendingCount &&
                !this._ngZone.hasPendingMacrotasks
              );
            }
            _runCallbacksIfReady() {
              if (this.isStable())
                gh(() => {
                  for (; 0 !== this._callbacks.length; ) {
                    let n = this._callbacks.pop();
                    clearTimeout(n.timeoutId), n.doneCb(this._didWork);
                  }
                  this._didWork = !1;
                });
              else {
                let n = this.getPendingTasks();
                (this._callbacks = this._callbacks.filter(
                  (r) =>
                    !r.updateCb ||
                    !r.updateCb(n) ||
                    (clearTimeout(r.timeoutId), !1)
                )),
                  (this._didWork = !0);
              }
            }
            getPendingTasks() {
              return this.taskTrackingZone
                ? this.taskTrackingZone.macroTasks.map((n) => ({
                    source: n.source,
                    creationLocation: n.creationLocation,
                    data: n.data,
                  }))
                : [];
            }
            addCallback(n, r, i) {
              let o = -1;
              r &&
                r > 0 &&
                (o = setTimeout(() => {
                  (this._callbacks = this._callbacks.filter(
                    (s) => s.timeoutId !== o
                  )),
                    n(this._didWork, this.getPendingTasks());
                }, r)),
                this._callbacks.push({ doneCb: n, timeoutId: o, updateCb: i });
            }
            whenStable(n, r, i) {
              if (i && !this.taskTrackingZone)
                throw new Error(
                  'Task tracking zone is required when passing an update callback to whenStable(). Is "zone.js/plugins/task-tracking" loaded?'
                );
              this.addCallback(n, r, i), this._runCallbacksIfReady();
            }
            getPendingRequestCount() {
              return this._pendingCount;
            }
            registerApplication(n) {
              this.registry.registerApplication(n, this);
            }
            unregisterApplication(n) {
              this.registry.unregisterApplication(n);
            }
            findProviders(n, r, i) {
              return [];
            }
          }
          return (
            (t.ɵfac = function (n) {
              return new (n || t)(D(he), D(_h), D(ql));
            }),
            (t.ɵprov = T({ token: t, factory: t.ɵfac })),
            t
          );
        })(),
        _h = (() => {
          class t {
            constructor() {
              this._applications = new Map();
            }
            registerApplication(n, r) {
              this._applications.set(n, r);
            }
            unregisterApplication(n) {
              this._applications.delete(n);
            }
            unregisterAllApplications() {
              this._applications.clear();
            }
            getTestability(n) {
              return this._applications.get(n) || null;
            }
            getAllTestabilities() {
              return Array.from(this._applications.values());
            }
            getAllRootElements() {
              return Array.from(this._applications.keys());
            }
            findTestabilityInTree(n, r = !0) {
              return Ch?.findTestabilityInTree(this, n, r) ?? null;
            }
          }
          return (
            (t.ɵfac = function (n) {
              return new (n || t)();
            }),
            (t.ɵprov = T({
              token: t,
              factory: t.ɵfac,
              providedIn: "platform",
            })),
            t
          );
        })(),
        br = null;
      const Zw = new b("AllowMultipleToken"),
        Dh = new b("PlatformDestroyListeners"),
        wh = new b("appBootstrapListener");
      class Xw {
        constructor(e, n) {
          (this.name = e), (this.token = n);
        }
      }
      function eb(t, e, n = []) {
        const r = `Platform: ${e}`,
          i = new b(r);
        return (o = []) => {
          let s = bh();
          if (!s || s.injector.get(Zw, !1)) {
            const a = [...n, ...o, { provide: i, useValue: !0 }];
            t
              ? t(a)
              : (function Kk(t) {
                  if (br && !br.get(Zw, !1)) throw new v(400, !1);
                  (function Yw() {
                    !(function zI(t) {
                      _y = t;
                    })(() => {
                      throw new v(600, !1);
                    });
                  })(),
                    (br = t);
                  const e = t.get(nb);
                  (function Jw(t) {
                    t.get(f_, null)?.forEach((n) => n());
                  })(t);
                })(
                  (function tb(t = [], e) {
                    return Bt.create({
                      name: e,
                      providers: [
                        { provide: ef, useValue: "platform" },
                        { provide: Dh, useValue: new Set([() => (br = null)]) },
                        ...t,
                      ],
                    });
                  })(a, r)
                );
          }
          return (function Zk(t) {
            const e = bh();
            if (!e) throw new v(401, !1);
            return e;
          })();
        };
      }
      function bh() {
        return br?.get(nb) ?? null;
      }
      let nb = (() => {
        class t {
          constructor(n) {
            (this._injector = n),
              (this._modules = []),
              (this._destroyListeners = []),
              (this._destroyed = !1);
          }
          bootstrapModuleFactory(n, r) {
            const i = (function Yk(t = "zone.js", e) {
              return "noop" === t ? new zk() : "zone.js" === t ? new he(e) : t;
            })(
              r?.ngZone,
              (function rb(t) {
                return {
                  enableLongStackTrace: !1,
                  shouldCoalesceEventChangeDetection: t?.eventCoalescing ?? !1,
                  shouldCoalesceRunChangeDetection: t?.runCoalescing ?? !1,
                };
              })({
                eventCoalescing: r?.ngZoneEventCoalescing,
                runCoalescing: r?.ngZoneRunCoalescing,
              })
            );
            return i.run(() => {
              const o = (function yF(t, e, n) {
                  return new Qf(t, e, n);
                })(
                  n.moduleType,
                  this.injector,
                  (function lb(t) {
                    return [
                      { provide: he, useFactory: t },
                      {
                        provide: qr,
                        multi: !0,
                        useFactory: () => {
                          const e = E(Jk, { optional: !0 });
                          return () => e.initialize();
                        },
                      },
                      { provide: ab, useFactory: Xk },
                      { provide: Ww, useFactory: Kw },
                    ];
                  })(() => i)
                ),
                s = o.injector.get(Dr, null);
              return (
                i.runOutsideAngular(() => {
                  const a = i.onError.subscribe({
                    next: (l) => {
                      s.handleError(l);
                    },
                  });
                  o.onDestroy(() => {
                    Gl(this._modules, o), a.unsubscribe();
                  });
                }),
                (function ib(t, e, n) {
                  try {
                    const r = n();
                    return ms(r)
                      ? r.catch((i) => {
                          throw (
                            (e.runOutsideAngular(() => t.handleError(i)), i)
                          );
                        })
                      : r;
                  } catch (r) {
                    throw (e.runOutsideAngular(() => t.handleError(r)), r);
                  }
                })(s, i, () => {
                  const a = o.injector.get(ph);
                  return (
                    a.runInitializers(),
                    a.donePromise.then(
                      () => (
                        (function ED(t) {
                          Wt(t, "Expected localeId to be defined"),
                            "string" == typeof t &&
                              (bD = t.toLowerCase().replace(/_/g, "-"));
                        })(o.injector.get(or, no) || no),
                        this._moduleDoBootstrap(o),
                        o
                      )
                    )
                  );
                })
              );
            });
          }
          bootstrapModule(n, r = []) {
            const i = ob({}, r);
            return (function Gk(t, e, n) {
              const r = new Zf(n);
              return Promise.resolve(r);
            })(0, 0, n).then((o) => this.bootstrapModuleFactory(o, i));
          }
          _moduleDoBootstrap(n) {
            const r = n.injector.get(sr);
            if (n._bootstrapComponents.length > 0)
              n._bootstrapComponents.forEach((i) => r.bootstrap(i));
            else {
              if (!n.instance.ngDoBootstrap) throw new v(-403, !1);
              n.instance.ngDoBootstrap(r);
            }
            this._modules.push(n);
          }
          onDestroy(n) {
            this._destroyListeners.push(n);
          }
          get injector() {
            return this._injector;
          }
          destroy() {
            if (this._destroyed) throw new v(404, !1);
            this._modules.slice().forEach((r) => r.destroy()),
              this._destroyListeners.forEach((r) => r());
            const n = this._injector.get(Dh, null);
            n && (n.forEach((r) => r()), n.clear()), (this._destroyed = !0);
          }
          get destroyed() {
            return this._destroyed;
          }
        }
        return (
          (t.ɵfac = function (n) {
            return new (n || t)(D(Bt));
          }),
          (t.ɵprov = T({ token: t, factory: t.ɵfac, providedIn: "platform" })),
          t
        );
      })();
      function ob(t, e) {
        return Array.isArray(e) ? e.reduce(ob, t) : { ...t, ...e };
      }
      let sr = (() => {
        class t {
          constructor() {
            (this._bootstrapListeners = []),
              (this._runningTick = !1),
              (this._destroyed = !1),
              (this._destroyListeners = []),
              (this._views = []),
              (this.internalErrorHandler = E(ab)),
              (this.zoneIsStable = E(Ww)),
              (this.componentTypes = []),
              (this.components = []),
              (this.isStable = E(zl).hasPendingTasks.pipe(
                Gt((n) => (n ? B(!1) : this.zoneIsStable)),
                Um(),
                $m()
              )),
              (this._injector = E(Nn));
          }
          get destroyed() {
            return this._destroyed;
          }
          get injector() {
            return this._injector;
          }
          bootstrap(n, r) {
            const i = n instanceof C_;
            if (!this._injector.get(ph).done)
              throw (
                (!i &&
                  (function Ci(t) {
                    const e = se(t) || st(t) || Et(t);
                    return null !== e && e.standalone;
                  })(n),
                new v(405, !1))
              );
            let s;
            (s = i ? n : this._injector.get(ns).resolveComponentFactory(n)),
              this.componentTypes.push(s.componentType);
            const a = (function Wk(t) {
                return t.isBoundToModule;
              })(s)
                ? void 0
                : this._injector.get(ro),
              u = s.create(Bt.NULL, [], r || s.selector, a),
              c = u.location.nativeElement,
              d = u.injector.get(Qw, null);
            return (
              d?.registerApplication(c),
              u.onDestroy(() => {
                this.detachView(u.hostView),
                  Gl(this.components, u),
                  d?.unregisterApplication(c);
              }),
              this._loadComponent(u),
              u
            );
          }
          tick() {
            if (this._runningTick) throw new v(101, !1);
            try {
              this._runningTick = !0;
              for (let n of this._views) n.detectChanges();
            } catch (n) {
              this.internalErrorHandler(n);
            } finally {
              this._runningTick = !1;
            }
          }
          attachView(n) {
            const r = n;
            this._views.push(r), r.attachToAppRef(this);
          }
          detachView(n) {
            const r = n;
            Gl(this._views, r), r.detachFromAppRef();
          }
          _loadComponent(n) {
            this.attachView(n.hostView), this.tick(), this.components.push(n);
            const r = this._injector.get(wh, []);
            r.push(...this._bootstrapListeners), r.forEach((i) => i(n));
          }
          ngOnDestroy() {
            if (!this._destroyed)
              try {
                this._destroyListeners.forEach((n) => n()),
                  this._views.slice().forEach((n) => n.destroy());
              } finally {
                (this._destroyed = !0),
                  (this._views = []),
                  (this._bootstrapListeners = []),
                  (this._destroyListeners = []);
              }
          }
          onDestroy(n) {
            return (
              this._destroyListeners.push(n),
              () => Gl(this._destroyListeners, n)
            );
          }
          destroy() {
            if (this._destroyed) throw new v(406, !1);
            const n = this._injector;
            n.destroy && !n.destroyed && n.destroy();
          }
          get viewCount() {
            return this._views.length;
          }
          warnIfDestroyed() {}
        }
        return (
          (t.ɵfac = function (n) {
            return new (n || t)();
          }),
          (t.ɵprov = T({ token: t, factory: t.ɵfac, providedIn: "root" })),
          t
        );
      })();
      function Gl(t, e) {
        const n = t.indexOf(e);
        n > -1 && t.splice(n, 1);
      }
      const ab = new b("", {
        providedIn: "root",
        factory: () => E(Dr).handleError.bind(void 0),
      });
      function Xk() {
        const t = E(he),
          e = E(Dr);
        return (n) => t.runOutsideAngular(() => e.handleError(n));
      }
      let Jk = (() => {
        class t {
          constructor() {
            (this.zone = E(he)), (this.applicationRef = E(sr));
          }
          initialize() {
            this._onMicrotaskEmptySubscription ||
              (this._onMicrotaskEmptySubscription =
                this.zone.onMicrotaskEmpty.subscribe({
                  next: () => {
                    this.zone.run(() => {
                      this.applicationRef.tick();
                    });
                  },
                }));
          }
          ngOnDestroy() {
            this._onMicrotaskEmptySubscription?.unsubscribe();
          }
        }
        return (
          (t.ɵfac = function (n) {
            return new (n || t)();
          }),
          (t.ɵprov = T({ token: t, factory: t.ɵfac, providedIn: "root" })),
          t
        );
      })();
      let Wl = (() => {
        class t {}
        return (t.__NG_ELEMENT_ID__ = nL), t;
      })();
      function nL(t) {
        return (function rL(t, e, n) {
          if (Br(t) && !n) {
            const r = Ft(t.index, e);
            return new ls(r, r);
          }
          return 47 & t.type ? new ls(e[Ve], e) : null;
        })(it(), w(), 16 == (16 & t));
      }
      class fb {
        constructor() {}
        supports(e) {
          return Al(e);
        }
        create(e) {
          return new uL(e);
        }
      }
      const lL = (t, e) => e;
      class uL {
        constructor(e) {
          (this.length = 0),
            (this._linkedRecords = null),
            (this._unlinkedRecords = null),
            (this._previousItHead = null),
            (this._itHead = null),
            (this._itTail = null),
            (this._additionsHead = null),
            (this._additionsTail = null),
            (this._movesHead = null),
            (this._movesTail = null),
            (this._removalsHead = null),
            (this._removalsTail = null),
            (this._identityChangesHead = null),
            (this._identityChangesTail = null),
            (this._trackByFn = e || lL);
        }
        forEachItem(e) {
          let n;
          for (n = this._itHead; null !== n; n = n._next) e(n);
        }
        forEachOperation(e) {
          let n = this._itHead,
            r = this._removalsHead,
            i = 0,
            o = null;
          for (; n || r; ) {
            const s = !r || (n && n.currentIndex < pb(r, i, o)) ? n : r,
              a = pb(s, i, o),
              l = s.currentIndex;
            if (s === r) i--, (r = r._nextRemoved);
            else if (((n = n._next), null == s.previousIndex)) i++;
            else {
              o || (o = []);
              const u = a - i,
                c = l - i;
              if (u != c) {
                for (let f = 0; f < u; f++) {
                  const h = f < o.length ? o[f] : (o[f] = 0),
                    p = h + f;
                  c <= p && p < u && (o[f] = h + 1);
                }
                o[s.previousIndex] = c - u;
              }
            }
            a !== l && e(s, a, l);
          }
        }
        forEachPreviousItem(e) {
          let n;
          for (n = this._previousItHead; null !== n; n = n._nextPrevious) e(n);
        }
        forEachAddedItem(e) {
          let n;
          for (n = this._additionsHead; null !== n; n = n._nextAdded) e(n);
        }
        forEachMovedItem(e) {
          let n;
          for (n = this._movesHead; null !== n; n = n._nextMoved) e(n);
        }
        forEachRemovedItem(e) {
          let n;
          for (n = this._removalsHead; null !== n; n = n._nextRemoved) e(n);
        }
        forEachIdentityChange(e) {
          let n;
          for (
            n = this._identityChangesHead;
            null !== n;
            n = n._nextIdentityChange
          )
            e(n);
        }
        diff(e) {
          if ((null == e && (e = []), !Al(e))) throw new v(900, !1);
          return this.check(e) ? this : null;
        }
        onDestroy() {}
        check(e) {
          this._reset();
          let i,
            o,
            s,
            n = this._itHead,
            r = !1;
          if (Array.isArray(e)) {
            this.length = e.length;
            for (let a = 0; a < this.length; a++)
              (o = e[a]),
                (s = this._trackByFn(a, o)),
                null !== n && Object.is(n.trackById, s)
                  ? (r && (n = this._verifyReinsertion(n, o, s, a)),
                    Object.is(n.item, o) || this._addIdentityChange(n, o))
                  : ((n = this._mismatch(n, o, s, a)), (r = !0)),
                (n = n._next);
          } else
            (i = 0),
              (function ZO(t, e) {
                if (Array.isArray(t))
                  for (let n = 0; n < t.length; n++) e(t[n]);
                else {
                  const n = t[Symbol.iterator]();
                  let r;
                  for (; !(r = n.next()).done; ) e(r.value);
                }
              })(e, (a) => {
                (s = this._trackByFn(i, a)),
                  null !== n && Object.is(n.trackById, s)
                    ? (r && (n = this._verifyReinsertion(n, a, s, i)),
                      Object.is(n.item, a) || this._addIdentityChange(n, a))
                    : ((n = this._mismatch(n, a, s, i)), (r = !0)),
                  (n = n._next),
                  i++;
              }),
              (this.length = i);
          return this._truncate(n), (this.collection = e), this.isDirty;
        }
        get isDirty() {
          return (
            null !== this._additionsHead ||
            null !== this._movesHead ||
            null !== this._removalsHead ||
            null !== this._identityChangesHead
          );
        }
        _reset() {
          if (this.isDirty) {
            let e;
            for (
              e = this._previousItHead = this._itHead;
              null !== e;
              e = e._next
            )
              e._nextPrevious = e._next;
            for (e = this._additionsHead; null !== e; e = e._nextAdded)
              e.previousIndex = e.currentIndex;
            for (
              this._additionsHead = this._additionsTail = null,
                e = this._movesHead;
              null !== e;
              e = e._nextMoved
            )
              e.previousIndex = e.currentIndex;
            (this._movesHead = this._movesTail = null),
              (this._removalsHead = this._removalsTail = null),
              (this._identityChangesHead = this._identityChangesTail = null);
          }
        }
        _mismatch(e, n, r, i) {
          let o;
          return (
            null === e ? (o = this._itTail) : ((o = e._prev), this._remove(e)),
            null !==
            (e =
              null === this._unlinkedRecords
                ? null
                : this._unlinkedRecords.get(r, null))
              ? (Object.is(e.item, n) || this._addIdentityChange(e, n),
                this._reinsertAfter(e, o, i))
              : null !==
                (e =
                  null === this._linkedRecords
                    ? null
                    : this._linkedRecords.get(r, i))
              ? (Object.is(e.item, n) || this._addIdentityChange(e, n),
                this._moveAfter(e, o, i))
              : (e = this._addAfter(new cL(n, r), o, i)),
            e
          );
        }
        _verifyReinsertion(e, n, r, i) {
          let o =
            null === this._unlinkedRecords
              ? null
              : this._unlinkedRecords.get(r, null);
          return (
            null !== o
              ? (e = this._reinsertAfter(o, e._prev, i))
              : e.currentIndex != i &&
                ((e.currentIndex = i), this._addToMoves(e, i)),
            e
          );
        }
        _truncate(e) {
          for (; null !== e; ) {
            const n = e._next;
            this._addToRemovals(this._unlink(e)), (e = n);
          }
          null !== this._unlinkedRecords && this._unlinkedRecords.clear(),
            null !== this._additionsTail &&
              (this._additionsTail._nextAdded = null),
            null !== this._movesTail && (this._movesTail._nextMoved = null),
            null !== this._itTail && (this._itTail._next = null),
            null !== this._removalsTail &&
              (this._removalsTail._nextRemoved = null),
            null !== this._identityChangesTail &&
              (this._identityChangesTail._nextIdentityChange = null);
        }
        _reinsertAfter(e, n, r) {
          null !== this._unlinkedRecords && this._unlinkedRecords.remove(e);
          const i = e._prevRemoved,
            o = e._nextRemoved;
          return (
            null === i ? (this._removalsHead = o) : (i._nextRemoved = o),
            null === o ? (this._removalsTail = i) : (o._prevRemoved = i),
            this._insertAfter(e, n, r),
            this._addToMoves(e, r),
            e
          );
        }
        _moveAfter(e, n, r) {
          return (
            this._unlink(e),
            this._insertAfter(e, n, r),
            this._addToMoves(e, r),
            e
          );
        }
        _addAfter(e, n, r) {
          return (
            this._insertAfter(e, n, r),
            (this._additionsTail =
              null === this._additionsTail
                ? (this._additionsHead = e)
                : (this._additionsTail._nextAdded = e)),
            e
          );
        }
        _insertAfter(e, n, r) {
          const i = null === n ? this._itHead : n._next;
          return (
            (e._next = i),
            (e._prev = n),
            null === i ? (this._itTail = e) : (i._prev = e),
            null === n ? (this._itHead = e) : (n._next = e),
            null === this._linkedRecords && (this._linkedRecords = new hb()),
            this._linkedRecords.put(e),
            (e.currentIndex = r),
            e
          );
        }
        _remove(e) {
          return this._addToRemovals(this._unlink(e));
        }
        _unlink(e) {
          null !== this._linkedRecords && this._linkedRecords.remove(e);
          const n = e._prev,
            r = e._next;
          return (
            null === n ? (this._itHead = r) : (n._next = r),
            null === r ? (this._itTail = n) : (r._prev = n),
            e
          );
        }
        _addToMoves(e, n) {
          return (
            e.previousIndex === n ||
              (this._movesTail =
                null === this._movesTail
                  ? (this._movesHead = e)
                  : (this._movesTail._nextMoved = e)),
            e
          );
        }
        _addToRemovals(e) {
          return (
            null === this._unlinkedRecords &&
              (this._unlinkedRecords = new hb()),
            this._unlinkedRecords.put(e),
            (e.currentIndex = null),
            (e._nextRemoved = null),
            null === this._removalsTail
              ? ((this._removalsTail = this._removalsHead = e),
                (e._prevRemoved = null))
              : ((e._prevRemoved = this._removalsTail),
                (this._removalsTail = this._removalsTail._nextRemoved = e)),
            e
          );
        }
        _addIdentityChange(e, n) {
          return (
            (e.item = n),
            (this._identityChangesTail =
              null === this._identityChangesTail
                ? (this._identityChangesHead = e)
                : (this._identityChangesTail._nextIdentityChange = e)),
            e
          );
        }
      }
      class cL {
        constructor(e, n) {
          (this.item = e),
            (this.trackById = n),
            (this.currentIndex = null),
            (this.previousIndex = null),
            (this._nextPrevious = null),
            (this._prev = null),
            (this._next = null),
            (this._prevDup = null),
            (this._nextDup = null),
            (this._prevRemoved = null),
            (this._nextRemoved = null),
            (this._nextAdded = null),
            (this._nextMoved = null),
            (this._nextIdentityChange = null);
        }
      }
      class dL {
        constructor() {
          (this._head = null), (this._tail = null);
        }
        add(e) {
          null === this._head
            ? ((this._head = this._tail = e),
              (e._nextDup = null),
              (e._prevDup = null))
            : ((this._tail._nextDup = e),
              (e._prevDup = this._tail),
              (e._nextDup = null),
              (this._tail = e));
        }
        get(e, n) {
          let r;
          for (r = this._head; null !== r; r = r._nextDup)
            if (
              (null === n || n <= r.currentIndex) &&
              Object.is(r.trackById, e)
            )
              return r;
          return null;
        }
        remove(e) {
          const n = e._prevDup,
            r = e._nextDup;
          return (
            null === n ? (this._head = r) : (n._nextDup = r),
            null === r ? (this._tail = n) : (r._prevDup = n),
            null === this._head
          );
        }
      }
      class hb {
        constructor() {
          this.map = new Map();
        }
        put(e) {
          const n = e.trackById;
          let r = this.map.get(n);
          r || ((r = new dL()), this.map.set(n, r)), r.add(e);
        }
        get(e, n) {
          const i = this.map.get(e);
          return i ? i.get(e, n) : null;
        }
        remove(e) {
          const n = e.trackById;
          return this.map.get(n).remove(e) && this.map.delete(n), e;
        }
        get isEmpty() {
          return 0 === this.map.size;
        }
        clear() {
          this.map.clear();
        }
      }
      function pb(t, e, n) {
        const r = t.previousIndex;
        if (null === r) return r;
        let i = 0;
        return n && r < n.length && (i = n[r]), r + e + i;
      }
      function mb() {
        return new Zl([new fb()]);
      }
      let Zl = (() => {
        class t {
          constructor(n) {
            this.factories = n;
          }
          static create(n, r) {
            if (null != r) {
              const i = r.factories.slice();
              n = n.concat(i);
            }
            return new t(n);
          }
          static extend(n) {
            return {
              provide: t,
              useFactory: (r) => t.create(n, r || mb()),
              deps: [[t, new Za(), new Qa()]],
            };
          }
          find(n) {
            const r = this.factories.find((i) => i.supports(n));
            if (null != r) return r;
            throw new v(901, !1);
          }
        }
        return (t.ɵprov = T({ token: t, providedIn: "root", factory: mb })), t;
      })();
      const mL = eb(null, "core", []);
      let yL = (() => {
        class t {
          constructor(n) {}
        }
        return (
          (t.ɵfac = function (n) {
            return new (n || t)(D(sr));
          }),
          (t.ɵmod = Qe({ type: t })),
          (t.ɵinj = ke({})),
          t
        );
      })();
      function so(t) {
        return "boolean" == typeof t ? t : null != t && "false" !== t;
      }
      let xh = null;
      function Er() {
        return xh;
      }
      class IL {}
      const Je = new b("DocumentToken");
      let Rh = (() => {
        class t {
          historyGo(n) {
            throw new Error("Not implemented");
          }
        }
        return (
          (t.ɵfac = function (n) {
            return new (n || t)();
          }),
          (t.ɵprov = T({
            token: t,
            factory: function () {
              return E(RL);
            },
            providedIn: "platform",
          })),
          t
        );
      })();
      const xL = new b("Location Initialized");
      let RL = (() => {
        class t extends Rh {
          constructor() {
            super(),
              (this._doc = E(Je)),
              (this._location = window.location),
              (this._history = window.history);
          }
          getBaseHrefFromDOM() {
            return Er().getBaseHref(this._doc);
          }
          onPopState(n) {
            const r = Er().getGlobalEventTarget(this._doc, "window");
            return (
              r.addEventListener("popstate", n, !1),
              () => r.removeEventListener("popstate", n)
            );
          }
          onHashChange(n) {
            const r = Er().getGlobalEventTarget(this._doc, "window");
            return (
              r.addEventListener("hashchange", n, !1),
              () => r.removeEventListener("hashchange", n)
            );
          }
          get href() {
            return this._location.href;
          }
          get protocol() {
            return this._location.protocol;
          }
          get hostname() {
            return this._location.hostname;
          }
          get port() {
            return this._location.port;
          }
          get pathname() {
            return this._location.pathname;
          }
          get search() {
            return this._location.search;
          }
          get hash() {
            return this._location.hash;
          }
          set pathname(n) {
            this._location.pathname = n;
          }
          pushState(n, r, i) {
            this._history.pushState(n, r, i);
          }
          replaceState(n, r, i) {
            this._history.replaceState(n, r, i);
          }
          forward() {
            this._history.forward();
          }
          back() {
            this._history.back();
          }
          historyGo(n = 0) {
            this._history.go(n);
          }
          getState() {
            return this._history.state;
          }
        }
        return (
          (t.ɵfac = function (n) {
            return new (n || t)();
          }),
          (t.ɵprov = T({
            token: t,
            factory: function () {
              return new t();
            },
            providedIn: "platform",
          })),
          t
        );
      })();
      function Nh(t, e) {
        if (0 == t.length) return e;
        if (0 == e.length) return t;
        let n = 0;
        return (
          t.endsWith("/") && n++,
          e.startsWith("/") && n++,
          2 == n ? t + e.substring(1) : 1 == n ? t + e : t + "/" + e
        );
      }
      function Eb(t) {
        const e = t.match(/#|\?|$/),
          n = (e && e.index) || t.length;
        return t.slice(0, n - ("/" === t[n - 1] ? 1 : 0)) + t.slice(n);
      }
      function ar(t) {
        return t && "?" !== t[0] ? "?" + t : t;
      }
      let Jr = (() => {
        class t {
          historyGo(n) {
            throw new Error("Not implemented");
          }
        }
        return (
          (t.ɵfac = function (n) {
            return new (n || t)();
          }),
          (t.ɵprov = T({
            token: t,
            factory: function () {
              return E(Mb);
            },
            providedIn: "root",
          })),
          t
        );
      })();
      const Sb = new b("appBaseHref");
      let Mb = (() => {
          class t extends Jr {
            constructor(n, r) {
              super(),
                (this._platformLocation = n),
                (this._removeListenerFns = []),
                (this._baseHref =
                  r ??
                  this._platformLocation.getBaseHrefFromDOM() ??
                  E(Je).location?.origin ??
                  "");
            }
            ngOnDestroy() {
              for (; this._removeListenerFns.length; )
                this._removeListenerFns.pop()();
            }
            onPopState(n) {
              this._removeListenerFns.push(
                this._platformLocation.onPopState(n),
                this._platformLocation.onHashChange(n)
              );
            }
            getBaseHref() {
              return this._baseHref;
            }
            prepareExternalUrl(n) {
              return Nh(this._baseHref, n);
            }
            path(n = !1) {
              const r =
                  this._platformLocation.pathname +
                  ar(this._platformLocation.search),
                i = this._platformLocation.hash;
              return i && n ? `${r}${i}` : r;
            }
            pushState(n, r, i, o) {
              const s = this.prepareExternalUrl(i + ar(o));
              this._platformLocation.pushState(n, r, s);
            }
            replaceState(n, r, i, o) {
              const s = this.prepareExternalUrl(i + ar(o));
              this._platformLocation.replaceState(n, r, s);
            }
            forward() {
              this._platformLocation.forward();
            }
            back() {
              this._platformLocation.back();
            }
            getState() {
              return this._platformLocation.getState();
            }
            historyGo(n = 0) {
              this._platformLocation.historyGo?.(n);
            }
          }
          return (
            (t.ɵfac = function (n) {
              return new (n || t)(D(Rh), D(Sb, 8));
            }),
            (t.ɵprov = T({ token: t, factory: t.ɵfac, providedIn: "root" })),
            t
          );
        })(),
        NL = (() => {
          class t extends Jr {
            constructor(n, r) {
              super(),
                (this._platformLocation = n),
                (this._baseHref = ""),
                (this._removeListenerFns = []),
                null != r && (this._baseHref = r);
            }
            ngOnDestroy() {
              for (; this._removeListenerFns.length; )
                this._removeListenerFns.pop()();
            }
            onPopState(n) {
              this._removeListenerFns.push(
                this._platformLocation.onPopState(n),
                this._platformLocation.onHashChange(n)
              );
            }
            getBaseHref() {
              return this._baseHref;
            }
            path(n = !1) {
              let r = this._platformLocation.hash;
              return null == r && (r = "#"), r.length > 0 ? r.substring(1) : r;
            }
            prepareExternalUrl(n) {
              const r = Nh(this._baseHref, n);
              return r.length > 0 ? "#" + r : r;
            }
            pushState(n, r, i, o) {
              let s = this.prepareExternalUrl(i + ar(o));
              0 == s.length && (s = this._platformLocation.pathname),
                this._platformLocation.pushState(n, r, s);
            }
            replaceState(n, r, i, o) {
              let s = this.prepareExternalUrl(i + ar(o));
              0 == s.length && (s = this._platformLocation.pathname),
                this._platformLocation.replaceState(n, r, s);
            }
            forward() {
              this._platformLocation.forward();
            }
            back() {
              this._platformLocation.back();
            }
            getState() {
              return this._platformLocation.getState();
            }
            historyGo(n = 0) {
              this._platformLocation.historyGo?.(n);
            }
          }
          return (
            (t.ɵfac = function (n) {
              return new (n || t)(D(Rh), D(Sb, 8));
            }),
            (t.ɵprov = T({ token: t, factory: t.ɵfac })),
            t
          );
        })(),
        Oh = (() => {
          class t {
            constructor(n) {
              (this._subject = new Oe()),
                (this._urlChangeListeners = []),
                (this._urlChangeSubscription = null),
                (this._locationStrategy = n);
              const r = this._locationStrategy.getBaseHref();
              (this._basePath = (function FL(t) {
                if (new RegExp("^(https?:)?//").test(t)) {
                  const [, n] = t.split(/\/\/[^\/]+/);
                  return n;
                }
                return t;
              })(Eb(Tb(r)))),
                this._locationStrategy.onPopState((i) => {
                  this._subject.emit({
                    url: this.path(!0),
                    pop: !0,
                    state: i.state,
                    type: i.type,
                  });
                });
            }
            ngOnDestroy() {
              this._urlChangeSubscription?.unsubscribe(),
                (this._urlChangeListeners = []);
            }
            path(n = !1) {
              return this.normalize(this._locationStrategy.path(n));
            }
            getState() {
              return this._locationStrategy.getState();
            }
            isCurrentPathEqualTo(n, r = "") {
              return this.path() == this.normalize(n + ar(r));
            }
            normalize(n) {
              return t.stripTrailingSlash(
                (function PL(t, e) {
                  if (!t || !e.startsWith(t)) return e;
                  const n = e.substring(t.length);
                  return "" === n || ["/", ";", "?", "#"].includes(n[0])
                    ? n
                    : e;
                })(this._basePath, Tb(n))
              );
            }
            prepareExternalUrl(n) {
              return (
                n && "/" !== n[0] && (n = "/" + n),
                this._locationStrategy.prepareExternalUrl(n)
              );
            }
            go(n, r = "", i = null) {
              this._locationStrategy.pushState(i, "", n, r),
                this._notifyUrlChangeListeners(
                  this.prepareExternalUrl(n + ar(r)),
                  i
                );
            }
            replaceState(n, r = "", i = null) {
              this._locationStrategy.replaceState(i, "", n, r),
                this._notifyUrlChangeListeners(
                  this.prepareExternalUrl(n + ar(r)),
                  i
                );
            }
            forward() {
              this._locationStrategy.forward();
            }
            back() {
              this._locationStrategy.back();
            }
            historyGo(n = 0) {
              this._locationStrategy.historyGo?.(n);
            }
            onUrlChange(n) {
              return (
                this._urlChangeListeners.push(n),
                this._urlChangeSubscription ||
                  (this._urlChangeSubscription = this.subscribe((r) => {
                    this._notifyUrlChangeListeners(r.url, r.state);
                  })),
                () => {
                  const r = this._urlChangeListeners.indexOf(n);
                  this._urlChangeListeners.splice(r, 1),
                    0 === this._urlChangeListeners.length &&
                      (this._urlChangeSubscription?.unsubscribe(),
                      (this._urlChangeSubscription = null));
                }
              );
            }
            _notifyUrlChangeListeners(n = "", r) {
              this._urlChangeListeners.forEach((i) => i(n, r));
            }
            subscribe(n, r, i) {
              return this._subject.subscribe({
                next: n,
                error: r,
                complete: i,
              });
            }
          }
          return (
            (t.normalizeQueryParams = ar),
            (t.joinWithSlash = Nh),
            (t.stripTrailingSlash = Eb),
            (t.ɵfac = function (n) {
              return new (n || t)(D(Jr));
            }),
            (t.ɵprov = T({
              token: t,
              factory: function () {
                return (function OL() {
                  return new Oh(D(Jr));
                })();
              },
              providedIn: "root",
            })),
            t
          );
        })();
      function Tb(t) {
        return t.replace(/\/index.html$/, "");
      }
      function kb(t, e) {
        e = encodeURIComponent(e);
        for (const n of t.split(";")) {
          const r = n.indexOf("="),
            [i, o] = -1 == r ? [n, ""] : [n.slice(0, r), n.slice(r + 1)];
          if (i.trim() === e) return decodeURIComponent(o);
        }
        return null;
      }
      class CV {
        constructor(e, n, r, i) {
          (this.$implicit = e),
            (this.ngForOf = n),
            (this.index = r),
            (this.count = i);
        }
        get first() {
          return 0 === this.index;
        }
        get last() {
          return this.index === this.count - 1;
        }
        get even() {
          return this.index % 2 == 0;
        }
        get odd() {
          return !this.even;
        }
      }
      let zh = (() => {
        class t {
          set ngForOf(n) {
            (this._ngForOf = n), (this._ngForOfDirty = !0);
          }
          set ngForTrackBy(n) {
            this._trackByFn = n;
          }
          get ngForTrackBy() {
            return this._trackByFn;
          }
          constructor(n, r, i) {
            (this._viewContainer = n),
              (this._template = r),
              (this._differs = i),
              (this._ngForOf = null),
              (this._ngForOfDirty = !0),
              (this._differ = null);
          }
          set ngForTemplate(n) {
            n && (this._template = n);
          }
          ngDoCheck() {
            if (this._ngForOfDirty) {
              this._ngForOfDirty = !1;
              const n = this._ngForOf;
              !this._differ &&
                n &&
                (this._differ = this._differs
                  .find(n)
                  .create(this.ngForTrackBy));
            }
            if (this._differ) {
              const n = this._differ.diff(this._ngForOf);
              n && this._applyChanges(n);
            }
          }
          _applyChanges(n) {
            const r = this._viewContainer;
            n.forEachOperation((i, o, s) => {
              if (null == i.previousIndex)
                r.createEmbeddedView(
                  this._template,
                  new CV(i.item, this._ngForOf, -1, -1),
                  null === s ? void 0 : s
                );
              else if (null == s) r.remove(null === o ? void 0 : o);
              else if (null !== o) {
                const a = r.get(o);
                r.move(a, s), Bb(a, i);
              }
            });
            for (let i = 0, o = r.length; i < o; i++) {
              const a = r.get(i).context;
              (a.index = i), (a.count = o), (a.ngForOf = this._ngForOf);
            }
            n.forEachIdentityChange((i) => {
              Bb(r.get(i.currentIndex), i);
            });
          }
          static ngTemplateContextGuard(n, r) {
            return !0;
          }
        }
        return (
          (t.ɵfac = function (n) {
            return new (n || t)(C(fn), C(ir), C(Zl));
          }),
          (t.ɵdir = q({
            type: t,
            selectors: [["", "ngFor", "", "ngForOf", ""]],
            inputs: {
              ngForOf: "ngForOf",
              ngForTrackBy: "ngForTrackBy",
              ngForTemplate: "ngForTemplate",
            },
            standalone: !0,
          })),
          t
        );
      })();
      function Bb(t, e) {
        t.context.$implicit = e.item;
      }
      let ao = (() => {
        class t {
          constructor(n, r) {
            (this._viewContainer = n),
              (this._context = new DV()),
              (this._thenTemplateRef = null),
              (this._elseTemplateRef = null),
              (this._thenViewRef = null),
              (this._elseViewRef = null),
              (this._thenTemplateRef = r);
          }
          set ngIf(n) {
            (this._context.$implicit = this._context.ngIf = n),
              this._updateView();
          }
          set ngIfThen(n) {
            jb("ngIfThen", n),
              (this._thenTemplateRef = n),
              (this._thenViewRef = null),
              this._updateView();
          }
          set ngIfElse(n) {
            jb("ngIfElse", n),
              (this._elseTemplateRef = n),
              (this._elseViewRef = null),
              this._updateView();
          }
          _updateView() {
            this._context.$implicit
              ? this._thenViewRef ||
                (this._viewContainer.clear(),
                (this._elseViewRef = null),
                this._thenTemplateRef &&
                  (this._thenViewRef = this._viewContainer.createEmbeddedView(
                    this._thenTemplateRef,
                    this._context
                  )))
              : this._elseViewRef ||
                (this._viewContainer.clear(),
                (this._thenViewRef = null),
                this._elseTemplateRef &&
                  (this._elseViewRef = this._viewContainer.createEmbeddedView(
                    this._elseTemplateRef,
                    this._context
                  )));
          }
          static ngTemplateContextGuard(n, r) {
            return !0;
          }
        }
        return (
          (t.ɵfac = function (n) {
            return new (n || t)(C(fn), C(ir));
          }),
          (t.ɵdir = q({
            type: t,
            selectors: [["", "ngIf", ""]],
            inputs: {
              ngIf: "ngIf",
              ngIfThen: "ngIfThen",
              ngIfElse: "ngIfElse",
            },
            standalone: !0,
          })),
          t
        );
      })();
      class DV {
        constructor() {
          (this.$implicit = null), (this.ngIf = null);
        }
      }
      function jb(t, e) {
        if (e && !e.createEmbeddedView)
          throw new Error(
            `${t} must be a TemplateRef, but received '${Ke(e)}'.`
          );
      }
      let GV = (() => {
        class t {}
        return (
          (t.ɵfac = function (n) {
            return new (n || t)();
          }),
          (t.ɵmod = Qe({ type: t })),
          (t.ɵinj = ke({})),
          t
        );
      })();
      function zb(t) {
        return "server" === t;
      }
      let ZV = (() => {
        class t {}
        return (
          (t.ɵprov = T({
            token: t,
            providedIn: "root",
            factory: () => new YV(D(Je), window),
          })),
          t
        );
      })();
      class YV {
        constructor(e, n) {
          (this.document = e), (this.window = n), (this.offset = () => [0, 0]);
        }
        setOffset(e) {
          this.offset = Array.isArray(e) ? () => e : e;
        }
        getScrollPosition() {
          return this.supportsScrolling()
            ? [this.window.pageXOffset, this.window.pageYOffset]
            : [0, 0];
        }
        scrollToPosition(e) {
          this.supportsScrolling() && this.window.scrollTo(e[0], e[1]);
        }
        scrollToAnchor(e) {
          if (!this.supportsScrolling()) return;
          const n = (function XV(t, e) {
            const n = t.getElementById(e) || t.getElementsByName(e)[0];
            if (n) return n;
            if (
              "function" == typeof t.createTreeWalker &&
              t.body &&
              "function" == typeof t.body.attachShadow
            ) {
              const r = t.createTreeWalker(t.body, NodeFilter.SHOW_ELEMENT);
              let i = r.currentNode;
              for (; i; ) {
                const o = i.shadowRoot;
                if (o) {
                  const s =
                    o.getElementById(e) || o.querySelector(`[name="${e}"]`);
                  if (s) return s;
                }
                i = r.nextNode();
              }
            }
            return null;
          })(this.document, e);
          n && (this.scrollToElement(n), n.focus());
        }
        setHistoryScrollRestoration(e) {
          if (this.supportScrollRestoration()) {
            const n = this.window.history;
            n && n.scrollRestoration && (n.scrollRestoration = e);
          }
        }
        scrollToElement(e) {
          const n = e.getBoundingClientRect(),
            r = n.left + this.window.pageXOffset,
            i = n.top + this.window.pageYOffset,
            o = this.offset();
          this.window.scrollTo(r - o[0], i - o[1]);
        }
        supportScrollRestoration() {
          try {
            if (!this.supportsScrolling()) return !1;
            const e =
              qb(this.window.history) ||
              qb(Object.getPrototypeOf(this.window.history));
            return !(!e || (!e.writable && !e.set));
          } catch {
            return !1;
          }
        }
        supportsScrolling() {
          try {
            return (
              !!this.window &&
              !!this.window.scrollTo &&
              "pageXOffset" in this.window
            );
          } catch {
            return !1;
          }
        }
      }
      function qb(t) {
        return Object.getOwnPropertyDescriptor(t, "scrollRestoration");
      }
      class Gb {}
      class D2 extends IL {
        constructor() {
          super(...arguments), (this.supportsDOMEvents = !0);
        }
      }
      class Yh extends D2 {
        static makeCurrent() {
          !(function AL(t) {
            xh || (xh = t);
          })(new Yh());
        }
        onAndCancel(e, n, r) {
          return (
            e.addEventListener(n, r),
            () => {
              e.removeEventListener(n, r);
            }
          );
        }
        dispatchEvent(e, n) {
          e.dispatchEvent(n);
        }
        remove(e) {
          e.parentNode && e.parentNode.removeChild(e);
        }
        createElement(e, n) {
          return (n = n || this.getDefaultDocument()).createElement(e);
        }
        createHtmlDocument() {
          return document.implementation.createHTMLDocument("fakeTitle");
        }
        getDefaultDocument() {
          return document;
        }
        isElementNode(e) {
          return e.nodeType === Node.ELEMENT_NODE;
        }
        isShadowRoot(e) {
          return e instanceof DocumentFragment;
        }
        getGlobalEventTarget(e, n) {
          return "window" === n
            ? window
            : "document" === n
            ? e
            : "body" === n
            ? e.body
            : null;
        }
        getBaseHref(e) {
          const n = (function w2() {
            return (
              (xs = xs || document.querySelector("base")),
              xs ? xs.getAttribute("href") : null
            );
          })();
          return null == n
            ? null
            : (function b2(t) {
                (uu = uu || document.createElement("a")),
                  uu.setAttribute("href", t);
                const e = uu.pathname;
                return "/" === e.charAt(0) ? e : `/${e}`;
              })(n);
        }
        resetBaseElement() {
          xs = null;
        }
        getUserAgent() {
          return window.navigator.userAgent;
        }
        getCookie(e) {
          return kb(document.cookie, e);
        }
      }
      let uu,
        xs = null,
        S2 = (() => {
          class t {
            build() {
              return new XMLHttpRequest();
            }
          }
          return (
            (t.ɵfac = function (n) {
              return new (n || t)();
            }),
            (t.ɵprov = T({ token: t, factory: t.ɵfac })),
            t
          );
        })();
      const Xh = new b("EventManagerPlugins");
      let Yb = (() => {
        class t {
          constructor(n, r) {
            (this._zone = r),
              (this._eventNameToPlugin = new Map()),
              n.forEach((i) => {
                i.manager = this;
              }),
              (this._plugins = n.slice().reverse());
          }
          addEventListener(n, r, i) {
            return this._findPluginFor(r).addEventListener(n, r, i);
          }
          getZone() {
            return this._zone;
          }
          _findPluginFor(n) {
            let r = this._eventNameToPlugin.get(n);
            if (r) return r;
            if (((r = this._plugins.find((o) => o.supports(n))), !r))
              throw new v(5101, !1);
            return this._eventNameToPlugin.set(n, r), r;
          }
        }
        return (
          (t.ɵfac = function (n) {
            return new (n || t)(D(Xh), D(he));
          }),
          (t.ɵprov = T({ token: t, factory: t.ɵfac })),
          t
        );
      })();
      class Xb {
        constructor(e) {
          this._doc = e;
        }
      }
      const Jh = "ng-app-id";
      let Jb = (() => {
        class t {
          constructor(n, r, i, o = {}) {
            (this.doc = n),
              (this.appId = r),
              (this.nonce = i),
              (this.platformId = o),
              (this.styleRef = new Map()),
              (this.hostNodes = new Set()),
              (this.styleNodesInDOM = this.collectServerRenderedStyles()),
              (this.platformIsServer = zb(o)),
              this.resetHostNodes();
          }
          addStyles(n) {
            for (const r of n)
              1 === this.changeUsageCount(r, 1) && this.onStyleAdded(r);
          }
          removeStyles(n) {
            for (const r of n)
              this.changeUsageCount(r, -1) <= 0 && this.onStyleRemoved(r);
          }
          ngOnDestroy() {
            const n = this.styleNodesInDOM;
            n && (n.forEach((r) => r.remove()), n.clear());
            for (const r of this.getAllStyles()) this.onStyleRemoved(r);
            this.resetHostNodes();
          }
          addHost(n) {
            this.hostNodes.add(n);
            for (const r of this.getAllStyles()) this.addStyleToHost(n, r);
          }
          removeHost(n) {
            this.hostNodes.delete(n);
          }
          getAllStyles() {
            return this.styleRef.keys();
          }
          onStyleAdded(n) {
            for (const r of this.hostNodes) this.addStyleToHost(r, n);
          }
          onStyleRemoved(n) {
            const r = this.styleRef;
            r.get(n)?.elements?.forEach((i) => i.remove()), r.delete(n);
          }
          collectServerRenderedStyles() {
            const n = this.doc.head?.querySelectorAll(
              `style[${Jh}="${this.appId}"]`
            );
            if (n?.length) {
              const r = new Map();
              return (
                n.forEach((i) => {
                  null != i.textContent && r.set(i.textContent, i);
                }),
                r
              );
            }
            return null;
          }
          changeUsageCount(n, r) {
            const i = this.styleRef;
            if (i.has(n)) {
              const o = i.get(n);
              return (o.usage += r), o.usage;
            }
            return i.set(n, { usage: r, elements: [] }), r;
          }
          getStyleElement(n, r) {
            const i = this.styleNodesInDOM,
              o = i?.get(r);
            if (o?.parentNode === n)
              return i.delete(r), o.removeAttribute(Jh), o;
            {
              const s = this.doc.createElement("style");
              return (
                this.nonce && s.setAttribute("nonce", this.nonce),
                (s.textContent = r),
                this.platformIsServer && s.setAttribute(Jh, this.appId),
                s
              );
            }
          }
          addStyleToHost(n, r) {
            const i = this.getStyleElement(n, r);
            n.appendChild(i);
            const o = this.styleRef,
              s = o.get(r)?.elements;
            s ? s.push(i) : o.set(r, { elements: [i], usage: 1 });
          }
          resetHostNodes() {
            const n = this.hostNodes;
            n.clear(), n.add(this.doc.head);
          }
        }
        return (
          (t.ɵfac = function (n) {
            return new (n || t)(D(Je), D(gl), D(p_, 8), D(Wr));
          }),
          (t.ɵprov = T({ token: t, factory: t.ɵfac })),
          t
        );
      })();
      const ep = {
          svg: "http://www.w3.org/2000/svg",
          xhtml: "http://www.w3.org/1999/xhtml",
          xlink: "http://www.w3.org/1999/xlink",
          xml: "http://www.w3.org/XML/1998/namespace",
          xmlns: "http://www.w3.org/2000/xmlns/",
          math: "http://www.w3.org/1998/MathML/",
        },
        tp = /%COMP%/g,
        I2 = new b("RemoveStylesOnCompDestory", {
          providedIn: "root",
          factory: () => !1,
        });
      function tE(t, e) {
        return e.map((n) => n.replace(tp, t));
      }
      let np = (() => {
        class t {
          constructor(n, r, i, o, s, a, l, u = null) {
            (this.eventManager = n),
              (this.sharedStylesHost = r),
              (this.appId = i),
              (this.removeStylesOnCompDestory = o),
              (this.doc = s),
              (this.platformId = a),
              (this.ngZone = l),
              (this.nonce = u),
              (this.rendererByCompId = new Map()),
              (this.platformIsServer = zb(a)),
              (this.defaultRenderer = new rp(n, s, l, this.platformIsServer));
          }
          createRenderer(n, r) {
            if (!n || !r) return this.defaultRenderer;
            this.platformIsServer &&
              r.encapsulation === wt.ShadowDom &&
              (r = { ...r, encapsulation: wt.Emulated });
            const i = this.getOrCreateRenderer(n, r);
            return (
              i instanceof rE
                ? i.applyToHost(n)
                : i instanceof ip && i.applyStyles(),
              i
            );
          }
          getOrCreateRenderer(n, r) {
            const i = this.rendererByCompId;
            let o = i.get(r.id);
            if (!o) {
              const s = this.doc,
                a = this.ngZone,
                l = this.eventManager,
                u = this.sharedStylesHost,
                c = this.removeStylesOnCompDestory,
                d = this.platformIsServer;
              switch (r.encapsulation) {
                case wt.Emulated:
                  o = new rE(l, u, r, this.appId, c, s, a, d);
                  break;
                case wt.ShadowDom:
                  return new O2(l, u, n, r, s, a, this.nonce, d);
                default:
                  o = new ip(l, u, r, c, s, a, d);
              }
              (o.onDestroy = () => i.delete(r.id)), i.set(r.id, o);
            }
            return o;
          }
          ngOnDestroy() {
            this.rendererByCompId.clear();
          }
        }
        return (
          (t.ɵfac = function (n) {
            return new (n || t)(
              D(Yb),
              D(Jb),
              D(gl),
              D(I2),
              D(Je),
              D(Wr),
              D(he),
              D(p_)
            );
          }),
          (t.ɵprov = T({ token: t, factory: t.ɵfac })),
          t
        );
      })();
      class rp {
        constructor(e, n, r, i) {
          (this.eventManager = e),
            (this.doc = n),
            (this.ngZone = r),
            (this.platformIsServer = i),
            (this.data = Object.create(null)),
            (this.destroyNode = null);
        }
        destroy() {}
        createElement(e, n) {
          return n
            ? this.doc.createElementNS(ep[n] || n, e)
            : this.doc.createElement(e);
        }
        createComment(e) {
          return this.doc.createComment(e);
        }
        createText(e) {
          return this.doc.createTextNode(e);
        }
        appendChild(e, n) {
          (nE(e) ? e.content : e).appendChild(n);
        }
        insertBefore(e, n, r) {
          e && (nE(e) ? e.content : e).insertBefore(n, r);
        }
        removeChild(e, n) {
          e && e.removeChild(n);
        }
        selectRootElement(e, n) {
          let r = "string" == typeof e ? this.doc.querySelector(e) : e;
          if (!r) throw new v(5104, !1);
          return n || (r.textContent = ""), r;
        }
        parentNode(e) {
          return e.parentNode;
        }
        nextSibling(e) {
          return e.nextSibling;
        }
        setAttribute(e, n, r, i) {
          if (i) {
            n = i + ":" + n;
            const o = ep[i];
            o ? e.setAttributeNS(o, n, r) : e.setAttribute(n, r);
          } else e.setAttribute(n, r);
        }
        removeAttribute(e, n, r) {
          if (r) {
            const i = ep[r];
            i ? e.removeAttributeNS(i, n) : e.removeAttribute(`${r}:${n}`);
          } else e.removeAttribute(n);
        }
        addClass(e, n) {
          e.classList.add(n);
        }
        removeClass(e, n) {
          e.classList.remove(n);
        }
        setStyle(e, n, r, i) {
          i & (Tt.DashCase | Tt.Important)
            ? e.style.setProperty(n, r, i & Tt.Important ? "important" : "")
            : (e.style[n] = r);
        }
        removeStyle(e, n, r) {
          r & Tt.DashCase ? e.style.removeProperty(n) : (e.style[n] = "");
        }
        setProperty(e, n, r) {
          e[n] = r;
        }
        setValue(e, n) {
          e.nodeValue = n;
        }
        listen(e, n, r) {
          if (
            "string" == typeof e &&
            !(e = Er().getGlobalEventTarget(this.doc, e))
          )
            throw new Error(`Unsupported event target ${e} for event ${n}`);
          return this.eventManager.addEventListener(
            e,
            n,
            this.decoratePreventDefault(r)
          );
        }
        decoratePreventDefault(e) {
          return (n) => {
            if ("__ngUnwrap__" === n) return e;
            !1 ===
              (this.platformIsServer
                ? this.ngZone.runGuarded(() => e(n))
                : e(n)) && n.preventDefault();
          };
        }
      }
      function nE(t) {
        return "TEMPLATE" === t.tagName && void 0 !== t.content;
      }
      class O2 extends rp {
        constructor(e, n, r, i, o, s, a, l) {
          super(e, o, s, l),
            (this.sharedStylesHost = n),
            (this.hostEl = r),
            (this.shadowRoot = r.attachShadow({ mode: "open" })),
            this.sharedStylesHost.addHost(this.shadowRoot);
          const u = tE(i.id, i.styles);
          for (const c of u) {
            const d = document.createElement("style");
            a && d.setAttribute("nonce", a),
              (d.textContent = c),
              this.shadowRoot.appendChild(d);
          }
        }
        nodeOrShadowRoot(e) {
          return e === this.hostEl ? this.shadowRoot : e;
        }
        appendChild(e, n) {
          return super.appendChild(this.nodeOrShadowRoot(e), n);
        }
        insertBefore(e, n, r) {
          return super.insertBefore(this.nodeOrShadowRoot(e), n, r);
        }
        removeChild(e, n) {
          return super.removeChild(this.nodeOrShadowRoot(e), n);
        }
        parentNode(e) {
          return this.nodeOrShadowRoot(
            super.parentNode(this.nodeOrShadowRoot(e))
          );
        }
        destroy() {
          this.sharedStylesHost.removeHost(this.shadowRoot);
        }
      }
      class ip extends rp {
        constructor(e, n, r, i, o, s, a, l) {
          super(e, o, s, a),
            (this.sharedStylesHost = n),
            (this.removeStylesOnCompDestory = i),
            (this.rendererUsageCount = 0),
            (this.styles = l ? tE(l, r.styles) : r.styles);
        }
        applyStyles() {
          this.sharedStylesHost.addStyles(this.styles),
            this.rendererUsageCount++;
        }
        destroy() {
          this.removeStylesOnCompDestory &&
            (this.sharedStylesHost.removeStyles(this.styles),
            this.rendererUsageCount--,
            0 === this.rendererUsageCount && this.onDestroy?.());
        }
      }
      class rE extends ip {
        constructor(e, n, r, i, o, s, a, l) {
          const u = i + "-" + r.id;
          super(e, n, r, o, s, a, l, u),
            (this.contentAttr = (function x2(t) {
              return "_ngcontent-%COMP%".replace(tp, t);
            })(u)),
            (this.hostAttr = (function R2(t) {
              return "_nghost-%COMP%".replace(tp, t);
            })(u));
        }
        applyToHost(e) {
          this.applyStyles(), this.setAttribute(e, this.hostAttr, "");
        }
        createElement(e, n) {
          const r = super.createElement(e, n);
          return super.setAttribute(r, this.contentAttr, ""), r;
        }
      }
      let P2 = (() => {
        class t extends Xb {
          constructor(n) {
            super(n);
          }
          supports(n) {
            return !0;
          }
          addEventListener(n, r, i) {
            return (
              n.addEventListener(r, i, !1),
              () => this.removeEventListener(n, r, i)
            );
          }
          removeEventListener(n, r, i) {
            return n.removeEventListener(r, i);
          }
        }
        return (
          (t.ɵfac = function (n) {
            return new (n || t)(D(Je));
          }),
          (t.ɵprov = T({ token: t, factory: t.ɵfac })),
          t
        );
      })();
      const iE = ["alt", "control", "meta", "shift"],
        F2 = {
          "\b": "Backspace",
          "\t": "Tab",
          "\x7f": "Delete",
          "\x1b": "Escape",
          Del: "Delete",
          Esc: "Escape",
          Left: "ArrowLeft",
          Right: "ArrowRight",
          Up: "ArrowUp",
          Down: "ArrowDown",
          Menu: "ContextMenu",
          Scroll: "ScrollLock",
          Win: "OS",
        },
        k2 = {
          alt: (t) => t.altKey,
          control: (t) => t.ctrlKey,
          meta: (t) => t.metaKey,
          shift: (t) => t.shiftKey,
        };
      let L2 = (() => {
        class t extends Xb {
          constructor(n) {
            super(n);
          }
          supports(n) {
            return null != t.parseEventName(n);
          }
          addEventListener(n, r, i) {
            const o = t.parseEventName(r),
              s = t.eventCallback(o.fullKey, i, this.manager.getZone());
            return this.manager
              .getZone()
              .runOutsideAngular(() => Er().onAndCancel(n, o.domEventName, s));
          }
          static parseEventName(n) {
            const r = n.toLowerCase().split("."),
              i = r.shift();
            if (0 === r.length || ("keydown" !== i && "keyup" !== i))
              return null;
            const o = t._normalizeKey(r.pop());
            let s = "",
              a = r.indexOf("code");
            if (
              (a > -1 && (r.splice(a, 1), (s = "code.")),
              iE.forEach((u) => {
                const c = r.indexOf(u);
                c > -1 && (r.splice(c, 1), (s += u + "."));
              }),
              (s += o),
              0 != r.length || 0 === o.length)
            )
              return null;
            const l = {};
            return (l.domEventName = i), (l.fullKey = s), l;
          }
          static matchEventFullKeyCode(n, r) {
            let i = F2[n.key] || n.key,
              o = "";
            return (
              r.indexOf("code.") > -1 && ((i = n.code), (o = "code.")),
              !(null == i || !i) &&
                ((i = i.toLowerCase()),
                " " === i ? (i = "space") : "." === i && (i = "dot"),
                iE.forEach((s) => {
                  s !== i && (0, k2[s])(n) && (o += s + ".");
                }),
                (o += i),
                o === r)
            );
          }
          static eventCallback(n, r, i) {
            return (o) => {
              t.matchEventFullKeyCode(o, n) && i.runGuarded(() => r(o));
            };
          }
          static _normalizeKey(n) {
            return "esc" === n ? "escape" : n;
          }
        }
        return (
          (t.ɵfac = function (n) {
            return new (n || t)(D(Je));
          }),
          (t.ɵprov = T({ token: t, factory: t.ɵfac })),
          t
        );
      })();
      const H2 = eb(mL, "browser", [
          { provide: Wr, useValue: "browser" },
          {
            provide: f_,
            useValue: function V2() {
              Yh.makeCurrent();
            },
            multi: !0,
          },
          {
            provide: Je,
            useFactory: function j2() {
              return (
                (function jR(t) {
                  qd = t;
                })(document),
                document
              );
            },
            deps: [],
          },
        ]),
        $2 = new b(""),
        aE = [
          {
            provide: ql,
            useClass: class E2 {
              addToWindow(e) {
                (Ce.getAngularTestability = (r, i = !0) => {
                  const o = e.findTestabilityInTree(r, i);
                  if (null == o) throw new v(5103, !1);
                  return o;
                }),
                  (Ce.getAllAngularTestabilities = () =>
                    e.getAllTestabilities()),
                  (Ce.getAllAngularRootElements = () => e.getAllRootElements()),
                  Ce.frameworkStabilizers || (Ce.frameworkStabilizers = []),
                  Ce.frameworkStabilizers.push((r) => {
                    const i = Ce.getAllAngularTestabilities();
                    let o = i.length,
                      s = !1;
                    const a = function (l) {
                      (s = s || l), o--, 0 == o && r(s);
                    };
                    i.forEach(function (l) {
                      l.whenStable(a);
                    });
                  });
              }
              findTestabilityInTree(e, n, r) {
                return null == n
                  ? null
                  : e.getTestability(n) ??
                      (r
                        ? Er().isShadowRoot(n)
                          ? this.findTestabilityInTree(e, n.host, !0)
                          : this.findTestabilityInTree(e, n.parentElement, !0)
                        : null);
              }
            },
            deps: [],
          },
          { provide: Qw, useClass: vh, deps: [he, _h, ql] },
          { provide: vh, useClass: vh, deps: [he, _h, ql] },
        ],
        lE = [
          { provide: ef, useValue: "root" },
          {
            provide: Dr,
            useFactory: function B2() {
              return new Dr();
            },
            deps: [],
          },
          { provide: Xh, useClass: P2, multi: !0, deps: [Je, he, Wr] },
          { provide: Xh, useClass: L2, multi: !0, deps: [Je] },
          np,
          Jb,
          Yb,
          { provide: rs, useExisting: np },
          { provide: Gb, useClass: S2, deps: [] },
          [],
        ];
      let uE = (() => {
          class t {
            constructor(n) {}
            static withServerTransition(n) {
              return {
                ngModule: t,
                providers: [{ provide: gl, useValue: n.appId }],
              };
            }
          }
          return (
            (t.ɵfac = function (n) {
              return new (n || t)(D($2, 12));
            }),
            (t.ɵmod = Qe({ type: t })),
            (t.ɵinj = ke({ providers: [...lE, ...aE], imports: [GV, yL] })),
            t
          );
        })(),
        cE = (() => {
          class t {
            constructor(n) {
              this._doc = n;
            }
            getTitle() {
              return this._doc.title;
            }
            setTitle(n) {
              this._doc.title = n || "";
            }
          }
          return (
            (t.ɵfac = function (n) {
              return new (n || t)(D(Je));
            }),
            (t.ɵprov = T({
              token: t,
              factory: function (n) {
                let r = null;
                return (
                  (r = n
                    ? new n()
                    : (function z2() {
                        return new cE(D(Je));
                      })()),
                  r
                );
              },
              providedIn: "root",
            })),
            t
          );
        })();
      typeof window < "u" && window;
      let hE = (() => {
          class t {}
          return (
            (t.ɵfac = function (n) {
              return new (n || t)();
            }),
            (t.ɵprov = T({
              token: t,
              factory: function (n) {
                let r = null;
                return (r = n ? new (n || t)() : D(pE)), r;
              },
              providedIn: "root",
            })),
            t
          );
        })(),
        pE = (() => {
          class t extends hE {
            constructor(n) {
              super(), (this._doc = n);
            }
            sanitize(n, r) {
              if (null == r) return null;
              switch (n) {
                case me.NONE:
                  return r;
                case me.HTML:
                  return Rn(r, "HTML")
                    ? Lt(r)
                    : t_(this._doc, String(r)).toString();
                case me.STYLE:
                  return Rn(r, "Style") ? Lt(r) : r;
                case me.SCRIPT:
                  if (Rn(r, "Script")) return Lt(r);
                  throw new v(5200, !1);
                case me.URL:
                  return Rn(r, "URL") ? Lt(r) : ul(String(r));
                case me.RESOURCE_URL:
                  if (Rn(r, "ResourceURL")) return Lt(r);
                  throw new v(5201, !1);
                default:
                  throw new v(5202, !1);
              }
            }
            bypassSecurityTrustHtml(n) {
              return (function WR(t) {
                return new HR(t);
              })(n);
            }
            bypassSecurityTrustStyle(n) {
              return (function KR(t) {
                return new $R(t);
              })(n);
            }
            bypassSecurityTrustScript(n) {
              return (function QR(t) {
                return new UR(t);
              })(n);
            }
            bypassSecurityTrustUrl(n) {
              return (function ZR(t) {
                return new zR(t);
              })(n);
            }
            bypassSecurityTrustResourceUrl(n) {
              return (function YR(t) {
                return new qR(t);
              })(n);
            }
          }
          return (
            (t.ɵfac = function (n) {
              return new (n || t)(D(Je));
            }),
            (t.ɵprov = T({
              token: t,
              factory: function (n) {
                let r = null;
                return (
                  (r = n
                    ? new n()
                    : (function K2(t) {
                        return new pE(t.get(Je));
                      })(D(Bt))),
                  r
                );
              },
              providedIn: "root",
            })),
            t
          );
        })();
      const { isArray: Z2 } = Array,
        { getPrototypeOf: Y2, prototype: X2, keys: J2 } = Object;
      function mE(t) {
        if (1 === t.length) {
          const e = t[0];
          if (Z2(e)) return { args: e, keys: null };
          if (
            (function eB(t) {
              return t && "object" == typeof t && Y2(t) === X2;
            })(e)
          ) {
            const n = J2(e);
            return { args: n.map((r) => e[r]), keys: n };
          }
        }
        return { args: t, keys: null };
      }
      const { isArray: tB } = Array;
      function yE(t) {
        return J((e) =>
          (function nB(t, e) {
            return tB(e) ? t(...e) : t(e);
          })(t, e)
        );
      }
      function vE(t, e) {
        return t.reduce((n, r, i) => ((n[r] = e[i]), n), {});
      }
      function sp(...t) {
        const e = Io(t),
          n = $c(t),
          { args: r, keys: i } = mE(t);
        if (0 === r.length) return We([], e);
        const o = new pe(
          (function rB(t, e, n = qn) {
            return (r) => {
              _E(
                e,
                () => {
                  const { length: i } = t,
                    o = new Array(i);
                  let s = i,
                    a = i;
                  for (let l = 0; l < i; l++)
                    _E(
                      e,
                      () => {
                        const u = We(t[l], e);
                        let c = !1;
                        u.subscribe(
                          ge(
                            r,
                            (d) => {
                              (o[l] = d),
                                c || ((c = !0), a--),
                                a || r.next(n(o.slice()));
                            },
                            () => {
                              --s || r.complete();
                            }
                          )
                        );
                      },
                      r
                    );
                },
                r
              );
            };
          })(r, e, i ? (s) => vE(i, s) : qn)
        );
        return n ? o.pipe(yE(n)) : o;
      }
      function _E(t, e, n) {
        t ? Gn(n, t, e) : e();
      }
      const cu = xc(
        (t) =>
          function () {
            t(this),
              (this.name = "EmptyError"),
              (this.message = "no elements in sequence");
          }
      );
      function ap(...t) {
        return (function iB() {
          return vi(1);
        })()(We(t, Io(t)));
      }
      function CE(t) {
        return new pe((e) => {
          ot(t()).subscribe(e);
        });
      }
      function lo(t, e) {
        const n = ve(t) ? t : () => t,
          r = (i) => i.error(n());
        return new pe(e ? (i) => e.schedule(r, 0, i) : r);
      }
      function lp() {
        return be((t, e) => {
          let n = null;
          t._refCount++;
          const r = ge(e, void 0, void 0, void 0, () => {
            if (!t || t._refCount <= 0 || 0 < --t._refCount)
              return void (n = null);
            const i = t._connection,
              o = n;
            (n = null),
              i && (!o || i === o) && i.unsubscribe(),
              e.unsubscribe();
          });
          t.subscribe(r), r.closed || (n = t.connect());
        });
      }
      class DE extends pe {
        constructor(e, n) {
          super(),
            (this.source = e),
            (this.subjectFactory = n),
            (this._subject = null),
            (this._refCount = 0),
            (this._connection = null),
            Em(e) && (this.lift = e.lift);
        }
        _subscribe(e) {
          return this.getSubject().subscribe(e);
        }
        getSubject() {
          const e = this._subject;
          return (
            (!e || e.isStopped) && (this._subject = this.subjectFactory()),
            this._subject
          );
        }
        _teardown() {
          this._refCount = 0;
          const { _connection: e } = this;
          (this._subject = this._connection = null), e?.unsubscribe();
        }
        connect() {
          let e = this._connection;
          if (!e) {
            e = this._connection = new Rt();
            const n = this.getSubject();
            e.add(
              this.source.subscribe(
                ge(
                  n,
                  void 0,
                  () => {
                    this._teardown(), n.complete();
                  },
                  (r) => {
                    this._teardown(), n.error(r);
                  },
                  () => this._teardown()
                )
              )
            ),
              e.closed && ((this._connection = null), (e = Rt.EMPTY));
          }
          return e;
        }
        refCount() {
          return lp()(this);
        }
      }
      function ei(t) {
        return t <= 0
          ? () => sn
          : be((e, n) => {
              let r = 0;
              e.subscribe(
                ge(n, (i) => {
                  ++r <= t && (n.next(i), t <= r && n.complete());
                })
              );
            });
      }
      function en(t, e) {
        return be((n, r) => {
          let i = 0;
          n.subscribe(ge(r, (o) => t.call(e, o, i++) && r.next(o)));
        });
      }
      function du(t) {
        return be((e, n) => {
          let r = !1;
          e.subscribe(
            ge(
              n,
              (i) => {
                (r = !0), n.next(i);
              },
              () => {
                r || n.next(t), n.complete();
              }
            )
          );
        });
      }
      function wE(t = sB) {
        return be((e, n) => {
          let r = !1;
          e.subscribe(
            ge(
              n,
              (i) => {
                (r = !0), n.next(i);
              },
              () => (r ? n.complete() : n.error(t()))
            )
          );
        });
      }
      function sB() {
        return new cu();
      }
      function ti(t, e) {
        const n = arguments.length >= 2;
        return (r) =>
          r.pipe(
            t ? en((i, o) => t(i, o, r)) : qn,
            ei(1),
            n ? du(e) : wE(() => new cu())
          );
      }
      function uo(t, e) {
        return ve(e) ? Ge(t, e, 1) : Ge(t, 1);
      }
      function _t(t, e, n) {
        const r = ve(t) || e || n ? { next: t, error: e, complete: n } : t;
        return r
          ? be((i, o) => {
              var s;
              null === (s = r.subscribe) || void 0 === s || s.call(r);
              let a = !0;
              i.subscribe(
                ge(
                  o,
                  (l) => {
                    var u;
                    null === (u = r.next) || void 0 === u || u.call(r, l),
                      o.next(l);
                  },
                  () => {
                    var l;
                    (a = !1),
                      null === (l = r.complete) || void 0 === l || l.call(r),
                      o.complete();
                  },
                  (l) => {
                    var u;
                    (a = !1),
                      null === (u = r.error) || void 0 === u || u.call(r, l),
                      o.error(l);
                  },
                  () => {
                    var l, u;
                    a &&
                      (null === (l = r.unsubscribe) ||
                        void 0 === l ||
                        l.call(r)),
                      null === (u = r.finalize) || void 0 === u || u.call(r);
                  }
                )
              );
            })
          : qn;
      }
      function Mr(t) {
        return be((e, n) => {
          let o,
            r = null,
            i = !1;
          (r = e.subscribe(
            ge(n, void 0, void 0, (s) => {
              (o = ot(t(s, Mr(t)(e)))),
                r ? (r.unsubscribe(), (r = null), o.subscribe(n)) : (i = !0);
            })
          )),
            i && (r.unsubscribe(), (r = null), o.subscribe(n));
        });
      }
      function bE(t, e) {
        return be(
          (function aB(t, e, n, r, i) {
            return (o, s) => {
              let a = n,
                l = e,
                u = 0;
              o.subscribe(
                ge(
                  s,
                  (c) => {
                    const d = u++;
                    (l = a ? t(l, c, d) : ((a = !0), c)), r && s.next(l);
                  },
                  i &&
                    (() => {
                      a && s.next(l), s.complete();
                    })
                )
              );
            };
          })(t, e, arguments.length >= 2, !0)
        );
      }
      function up(t) {
        return t <= 0
          ? () => sn
          : be((e, n) => {
              let r = [];
              e.subscribe(
                ge(
                  n,
                  (i) => {
                    r.push(i), t < r.length && r.shift();
                  },
                  () => {
                    for (const i of r) n.next(i);
                    n.complete();
                  },
                  void 0,
                  () => {
                    r = null;
                  }
                )
              );
            });
      }
      function Rs(t) {
        return be((e, n) => {
          try {
            e.subscribe(n);
          } finally {
            n.add(t);
          }
        });
      }
      const Y = "primary",
        Ns = Symbol("RouteTitle");
      class cB {
        constructor(e) {
          this.params = e || {};
        }
        has(e) {
          return Object.prototype.hasOwnProperty.call(this.params, e);
        }
        get(e) {
          if (this.has(e)) {
            const n = this.params[e];
            return Array.isArray(n) ? n[0] : n;
          }
          return null;
        }
        getAll(e) {
          if (this.has(e)) {
            const n = this.params[e];
            return Array.isArray(n) ? n : [n];
          }
          return [];
        }
        get keys() {
          return Object.keys(this.params);
        }
      }
      function co(t) {
        return new cB(t);
      }
      function dB(t, e, n) {
        const r = n.path.split("/");
        if (
          r.length > t.length ||
          ("full" === n.pathMatch && (e.hasChildren() || r.length < t.length))
        )
          return null;
        const i = {};
        for (let o = 0; o < r.length; o++) {
          const s = r[o],
            a = t[o];
          if (s.startsWith(":")) i[s.substring(1)] = a;
          else if (s !== a.path) return null;
        }
        return { consumed: t.slice(0, r.length), posParams: i };
      }
      function Ln(t, e) {
        const n = t ? Object.keys(t) : void 0,
          r = e ? Object.keys(e) : void 0;
        if (!n || !r || n.length != r.length) return !1;
        let i;
        for (let o = 0; o < n.length; o++)
          if (((i = n[o]), !EE(t[i], e[i]))) return !1;
        return !0;
      }
      function EE(t, e) {
        if (Array.isArray(t) && Array.isArray(e)) {
          if (t.length !== e.length) return !1;
          const n = [...t].sort(),
            r = [...e].sort();
          return n.every((i, o) => r[o] === i);
        }
        return t === e;
      }
      function SE(t) {
        return t.length > 0 ? t[t.length - 1] : null;
      }
      function Tr(t) {
        return (function Q2(t) {
          return !!t && (t instanceof pe || (ve(t.lift) && ve(t.subscribe)));
        })(t)
          ? t
          : ms(t)
          ? We(Promise.resolve(t))
          : B(t);
      }
      const hB = {
          exact: function AE(t, e, n) {
            if (
              !ni(t.segments, e.segments) ||
              !fu(t.segments, e.segments, n) ||
              t.numberOfChildren !== e.numberOfChildren
            )
              return !1;
            for (const r in e.children)
              if (!t.children[r] || !AE(t.children[r], e.children[r], n))
                return !1;
            return !0;
          },
          subset: IE,
        },
        ME = {
          exact: function pB(t, e) {
            return Ln(t, e);
          },
          subset: function gB(t, e) {
            return (
              Object.keys(e).length <= Object.keys(t).length &&
              Object.keys(e).every((n) => EE(t[n], e[n]))
            );
          },
          ignored: () => !0,
        };
      function TE(t, e, n) {
        return (
          hB[n.paths](t.root, e.root, n.matrixParams) &&
          ME[n.queryParams](t.queryParams, e.queryParams) &&
          !("exact" === n.fragment && t.fragment !== e.fragment)
        );
      }
      function IE(t, e, n) {
        return xE(t, e, e.segments, n);
      }
      function xE(t, e, n, r) {
        if (t.segments.length > n.length) {
          const i = t.segments.slice(0, n.length);
          return !(!ni(i, n) || e.hasChildren() || !fu(i, n, r));
        }
        if (t.segments.length === n.length) {
          if (!ni(t.segments, n) || !fu(t.segments, n, r)) return !1;
          for (const i in e.children)
            if (!t.children[i] || !IE(t.children[i], e.children[i], r))
              return !1;
          return !0;
        }
        {
          const i = n.slice(0, t.segments.length),
            o = n.slice(t.segments.length);
          return (
            !!(ni(t.segments, i) && fu(t.segments, i, r) && t.children[Y]) &&
            xE(t.children[Y], e, o, r)
          );
        }
      }
      function fu(t, e, n) {
        return e.every((r, i) => ME[n](t[i].parameters, r.parameters));
      }
      class fo {
        constructor(e = new fe([], {}), n = {}, r = null) {
          (this.root = e), (this.queryParams = n), (this.fragment = r);
        }
        get queryParamMap() {
          return (
            this._queryParamMap || (this._queryParamMap = co(this.queryParams)),
            this._queryParamMap
          );
        }
        toString() {
          return vB.serialize(this);
        }
      }
      class fe {
        constructor(e, n) {
          (this.segments = e),
            (this.children = n),
            (this.parent = null),
            Object.values(n).forEach((r) => (r.parent = this));
        }
        hasChildren() {
          return this.numberOfChildren > 0;
        }
        get numberOfChildren() {
          return Object.keys(this.children).length;
        }
        toString() {
          return hu(this);
        }
      }
      class Os {
        constructor(e, n) {
          (this.path = e), (this.parameters = n);
        }
        get parameterMap() {
          return (
            this._parameterMap || (this._parameterMap = co(this.parameters)),
            this._parameterMap
          );
        }
        toString() {
          return OE(this);
        }
      }
      function ni(t, e) {
        return t.length === e.length && t.every((n, r) => n.path === e[r].path);
      }
      let Ps = (() => {
        class t {}
        return (
          (t.ɵfac = function (n) {
            return new (n || t)();
          }),
          (t.ɵprov = T({
            token: t,
            factory: function () {
              return new cp();
            },
            providedIn: "root",
          })),
          t
        );
      })();
      class cp {
        parse(e) {
          const n = new IB(e);
          return new fo(
            n.parseRootSegment(),
            n.parseQueryParams(),
            n.parseFragment()
          );
        }
        serialize(e) {
          const n = `/${Fs(e.root, !0)}`,
            r = (function DB(t) {
              const e = Object.keys(t)
                .map((n) => {
                  const r = t[n];
                  return Array.isArray(r)
                    ? r.map((i) => `${pu(n)}=${pu(i)}`).join("&")
                    : `${pu(n)}=${pu(r)}`;
                })
                .filter((n) => !!n);
              return e.length ? `?${e.join("&")}` : "";
            })(e.queryParams);
          return `${n}${r}${
            "string" == typeof e.fragment
              ? `#${(function _B(t) {
                  return encodeURI(t);
                })(e.fragment)}`
              : ""
          }`;
        }
      }
      const vB = new cp();
      function hu(t) {
        return t.segments.map((e) => OE(e)).join("/");
      }
      function Fs(t, e) {
        if (!t.hasChildren()) return hu(t);
        if (e) {
          const n = t.children[Y] ? Fs(t.children[Y], !1) : "",
            r = [];
          return (
            Object.entries(t.children).forEach(([i, o]) => {
              i !== Y && r.push(`${i}:${Fs(o, !1)}`);
            }),
            r.length > 0 ? `${n}(${r.join("//")})` : n
          );
        }
        {
          const n = (function yB(t, e) {
            let n = [];
            return (
              Object.entries(t.children).forEach(([r, i]) => {
                r === Y && (n = n.concat(e(i, r)));
              }),
              Object.entries(t.children).forEach(([r, i]) => {
                r !== Y && (n = n.concat(e(i, r)));
              }),
              n
            );
          })(t, (r, i) =>
            i === Y ? [Fs(t.children[Y], !1)] : [`${i}:${Fs(r, !1)}`]
          );
          return 1 === Object.keys(t.children).length && null != t.children[Y]
            ? `${hu(t)}/${n[0]}`
            : `${hu(t)}/(${n.join("//")})`;
        }
      }
      function RE(t) {
        return encodeURIComponent(t)
          .replace(/%40/g, "@")
          .replace(/%3A/gi, ":")
          .replace(/%24/g, "$")
          .replace(/%2C/gi, ",");
      }
      function pu(t) {
        return RE(t).replace(/%3B/gi, ";");
      }
      function dp(t) {
        return RE(t)
          .replace(/\(/g, "%28")
          .replace(/\)/g, "%29")
          .replace(/%26/gi, "&");
      }
      function gu(t) {
        return decodeURIComponent(t);
      }
      function NE(t) {
        return gu(t.replace(/\+/g, "%20"));
      }
      function OE(t) {
        return `${dp(t.path)}${(function CB(t) {
          return Object.keys(t)
            .map((e) => `;${dp(e)}=${dp(t[e])}`)
            .join("");
        })(t.parameters)}`;
      }
      const wB = /^[^\/()?;#]+/;
      function fp(t) {
        const e = t.match(wB);
        return e ? e[0] : "";
      }
      const bB = /^[^\/()?;=#]+/,
        SB = /^[^=?&#]+/,
        TB = /^[^&#]+/;
      class IB {
        constructor(e) {
          (this.url = e), (this.remaining = e);
        }
        parseRootSegment() {
          return (
            this.consumeOptional("/"),
            "" === this.remaining ||
            this.peekStartsWith("?") ||
            this.peekStartsWith("#")
              ? new fe([], {})
              : new fe([], this.parseChildren())
          );
        }
        parseQueryParams() {
          const e = {};
          if (this.consumeOptional("?"))
            do {
              this.parseQueryParam(e);
            } while (this.consumeOptional("&"));
          return e;
        }
        parseFragment() {
          return this.consumeOptional("#")
            ? decodeURIComponent(this.remaining)
            : null;
        }
        parseChildren() {
          if ("" === this.remaining) return {};
          this.consumeOptional("/");
          const e = [];
          for (
            this.peekStartsWith("(") || e.push(this.parseSegment());
            this.peekStartsWith("/") &&
            !this.peekStartsWith("//") &&
            !this.peekStartsWith("/(");

          )
            this.capture("/"), e.push(this.parseSegment());
          let n = {};
          this.peekStartsWith("/(") &&
            (this.capture("/"), (n = this.parseParens(!0)));
          let r = {};
          return (
            this.peekStartsWith("(") && (r = this.parseParens(!1)),
            (e.length > 0 || Object.keys(n).length > 0) &&
              (r[Y] = new fe(e, n)),
            r
          );
        }
        parseSegment() {
          const e = fp(this.remaining);
          if ("" === e && this.peekStartsWith(";")) throw new v(4009, !1);
          return this.capture(e), new Os(gu(e), this.parseMatrixParams());
        }
        parseMatrixParams() {
          const e = {};
          for (; this.consumeOptional(";"); ) this.parseParam(e);
          return e;
        }
        parseParam(e) {
          const n = (function EB(t) {
            const e = t.match(bB);
            return e ? e[0] : "";
          })(this.remaining);
          if (!n) return;
          this.capture(n);
          let r = "";
          if (this.consumeOptional("=")) {
            const i = fp(this.remaining);
            i && ((r = i), this.capture(r));
          }
          e[gu(n)] = gu(r);
        }
        parseQueryParam(e) {
          const n = (function MB(t) {
            const e = t.match(SB);
            return e ? e[0] : "";
          })(this.remaining);
          if (!n) return;
          this.capture(n);
          let r = "";
          if (this.consumeOptional("=")) {
            const s = (function AB(t) {
              const e = t.match(TB);
              return e ? e[0] : "";
            })(this.remaining);
            s && ((r = s), this.capture(r));
          }
          const i = NE(n),
            o = NE(r);
          if (e.hasOwnProperty(i)) {
            let s = e[i];
            Array.isArray(s) || ((s = [s]), (e[i] = s)), s.push(o);
          } else e[i] = o;
        }
        parseParens(e) {
          const n = {};
          for (
            this.capture("(");
            !this.consumeOptional(")") && this.remaining.length > 0;

          ) {
            const r = fp(this.remaining),
              i = this.remaining[r.length];
            if ("/" !== i && ")" !== i && ";" !== i) throw new v(4010, !1);
            let o;
            r.indexOf(":") > -1
              ? ((o = r.slice(0, r.indexOf(":"))),
                this.capture(o),
                this.capture(":"))
              : e && (o = Y);
            const s = this.parseChildren();
            (n[o] = 1 === Object.keys(s).length ? s[Y] : new fe([], s)),
              this.consumeOptional("//");
          }
          return n;
        }
        peekStartsWith(e) {
          return this.remaining.startsWith(e);
        }
        consumeOptional(e) {
          return (
            !!this.peekStartsWith(e) &&
            ((this.remaining = this.remaining.substring(e.length)), !0)
          );
        }
        capture(e) {
          if (!this.consumeOptional(e)) throw new v(4011, !1);
        }
      }
      function PE(t) {
        return t.segments.length > 0 ? new fe([], { [Y]: t }) : t;
      }
      function FE(t) {
        const e = {};
        for (const r of Object.keys(t.children)) {
          const o = FE(t.children[r]);
          if (r === Y && 0 === o.segments.length && o.hasChildren())
            for (const [s, a] of Object.entries(o.children)) e[s] = a;
          else (o.segments.length > 0 || o.hasChildren()) && (e[r] = o);
        }
        return (function xB(t) {
          if (1 === t.numberOfChildren && t.children[Y]) {
            const e = t.children[Y];
            return new fe(t.segments.concat(e.segments), e.children);
          }
          return t;
        })(new fe(t.segments, e));
      }
      function ri(t) {
        return t instanceof fo;
      }
      function kE(t) {
        let e;
        const i = PE(
          (function n(o) {
            const s = {};
            for (const l of o.children) {
              const u = n(l);
              s[l.outlet] = u;
            }
            const a = new fe(o.url, s);
            return o === t && (e = a), a;
          })(t.root)
        );
        return e ?? i;
      }
      function LE(t, e, n, r) {
        let i = t;
        for (; i.parent; ) i = i.parent;
        if (0 === e.length) return hp(i, i, i, n, r);
        const o = (function NB(t) {
          if ("string" == typeof t[0] && 1 === t.length && "/" === t[0])
            return new BE(!0, 0, t);
          let e = 0,
            n = !1;
          const r = t.reduce((i, o, s) => {
            if ("object" == typeof o && null != o) {
              if (o.outlets) {
                const a = {};
                return (
                  Object.entries(o.outlets).forEach(([l, u]) => {
                    a[l] = "string" == typeof u ? u.split("/") : u;
                  }),
                  [...i, { outlets: a }]
                );
              }
              if (o.segmentPath) return [...i, o.segmentPath];
            }
            return "string" != typeof o
              ? [...i, o]
              : 0 === s
              ? (o.split("/").forEach((a, l) => {
                  (0 == l && "." === a) ||
                    (0 == l && "" === a
                      ? (n = !0)
                      : ".." === a
                      ? e++
                      : "" != a && i.push(a));
                }),
                i)
              : [...i, o];
          }, []);
          return new BE(n, e, r);
        })(e);
        if (o.toRoot()) return hp(i, i, new fe([], {}), n, r);
        const s = (function OB(t, e, n) {
            if (t.isAbsolute) return new yu(e, !0, 0);
            if (!n) return new yu(e, !1, NaN);
            if (null === n.parent) return new yu(n, !0, 0);
            const r = mu(t.commands[0]) ? 0 : 1;
            return (function PB(t, e, n) {
              let r = t,
                i = e,
                o = n;
              for (; o > i; ) {
                if (((o -= i), (r = r.parent), !r)) throw new v(4005, !1);
                i = r.segments.length;
              }
              return new yu(r, !1, i - o);
            })(n, n.segments.length - 1 + r, t.numberOfDoubleDots);
          })(o, i, t),
          a = s.processChildren
            ? Ls(s.segmentGroup, s.index, o.commands)
            : jE(s.segmentGroup, s.index, o.commands);
        return hp(i, s.segmentGroup, a, n, r);
      }
      function mu(t) {
        return (
          "object" == typeof t && null != t && !t.outlets && !t.segmentPath
        );
      }
      function ks(t) {
        return "object" == typeof t && null != t && t.outlets;
      }
      function hp(t, e, n, r, i) {
        let s,
          o = {};
        r &&
          Object.entries(r).forEach(([l, u]) => {
            o[l] = Array.isArray(u) ? u.map((c) => `${c}`) : `${u}`;
          }),
          (s = t === e ? n : VE(t, e, n));
        const a = PE(FE(s));
        return new fo(a, o, i);
      }
      function VE(t, e, n) {
        const r = {};
        return (
          Object.entries(t.children).forEach(([i, o]) => {
            r[i] = o === e ? n : VE(o, e, n);
          }),
          new fe(t.segments, r)
        );
      }
      class BE {
        constructor(e, n, r) {
          if (
            ((this.isAbsolute = e),
            (this.numberOfDoubleDots = n),
            (this.commands = r),
            e && r.length > 0 && mu(r[0]))
          )
            throw new v(4003, !1);
          const i = r.find(ks);
          if (i && i !== SE(r)) throw new v(4004, !1);
        }
        toRoot() {
          return (
            this.isAbsolute &&
            1 === this.commands.length &&
            "/" == this.commands[0]
          );
        }
      }
      class yu {
        constructor(e, n, r) {
          (this.segmentGroup = e), (this.processChildren = n), (this.index = r);
        }
      }
      function jE(t, e, n) {
        if (
          (t || (t = new fe([], {})),
          0 === t.segments.length && t.hasChildren())
        )
          return Ls(t, e, n);
        const r = (function kB(t, e, n) {
            let r = 0,
              i = e;
            const o = { match: !1, pathIndex: 0, commandIndex: 0 };
            for (; i < t.segments.length; ) {
              if (r >= n.length) return o;
              const s = t.segments[i],
                a = n[r];
              if (ks(a)) break;
              const l = `${a}`,
                u = r < n.length - 1 ? n[r + 1] : null;
              if (i > 0 && void 0 === l) break;
              if (l && u && "object" == typeof u && void 0 === u.outlets) {
                if (!$E(l, u, s)) return o;
                r += 2;
              } else {
                if (!$E(l, {}, s)) return o;
                r++;
              }
              i++;
            }
            return { match: !0, pathIndex: i, commandIndex: r };
          })(t, e, n),
          i = n.slice(r.commandIndex);
        if (r.match && r.pathIndex < t.segments.length) {
          const o = new fe(t.segments.slice(0, r.pathIndex), {});
          return (
            (o.children[Y] = new fe(t.segments.slice(r.pathIndex), t.children)),
            Ls(o, 0, i)
          );
        }
        return r.match && 0 === i.length
          ? new fe(t.segments, {})
          : r.match && !t.hasChildren()
          ? pp(t, e, n)
          : r.match
          ? Ls(t, 0, i)
          : pp(t, e, n);
      }
      function Ls(t, e, n) {
        if (0 === n.length) return new fe(t.segments, {});
        {
          const r = (function FB(t) {
              return ks(t[0]) ? t[0].outlets : { [Y]: t };
            })(n),
            i = {};
          if (
            !r[Y] &&
            t.children[Y] &&
            1 === t.numberOfChildren &&
            0 === t.children[Y].segments.length
          ) {
            const o = Ls(t.children[Y], e, n);
            return new fe(t.segments, o.children);
          }
          return (
            Object.entries(r).forEach(([o, s]) => {
              "string" == typeof s && (s = [s]),
                null !== s && (i[o] = jE(t.children[o], e, s));
            }),
            Object.entries(t.children).forEach(([o, s]) => {
              void 0 === r[o] && (i[o] = s);
            }),
            new fe(t.segments, i)
          );
        }
      }
      function pp(t, e, n) {
        const r = t.segments.slice(0, e);
        let i = 0;
        for (; i < n.length; ) {
          const o = n[i];
          if (ks(o)) {
            const l = LB(o.outlets);
            return new fe(r, l);
          }
          if (0 === i && mu(n[0])) {
            r.push(new Os(t.segments[e].path, HE(n[0]))), i++;
            continue;
          }
          const s = ks(o) ? o.outlets[Y] : `${o}`,
            a = i < n.length - 1 ? n[i + 1] : null;
          s && a && mu(a)
            ? (r.push(new Os(s, HE(a))), (i += 2))
            : (r.push(new Os(s, {})), i++);
        }
        return new fe(r, {});
      }
      function LB(t) {
        const e = {};
        return (
          Object.entries(t).forEach(([n, r]) => {
            "string" == typeof r && (r = [r]),
              null !== r && (e[n] = pp(new fe([], {}), 0, r));
          }),
          e
        );
      }
      function HE(t) {
        const e = {};
        return Object.entries(t).forEach(([n, r]) => (e[n] = `${r}`)), e;
      }
      function $E(t, e, n) {
        return t == n.path && Ln(e, n.parameters);
      }
      const Vs = "imperative";
      class Vn {
        constructor(e, n) {
          (this.id = e), (this.url = n);
        }
      }
      class gp extends Vn {
        constructor(e, n, r = "imperative", i = null) {
          super(e, n),
            (this.type = 0),
            (this.navigationTrigger = r),
            (this.restoredState = i);
        }
        toString() {
          return `NavigationStart(id: ${this.id}, url: '${this.url}')`;
        }
      }
      class ii extends Vn {
        constructor(e, n, r) {
          super(e, n), (this.urlAfterRedirects = r), (this.type = 1);
        }
        toString() {
          return `NavigationEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}')`;
        }
      }
      class vu extends Vn {
        constructor(e, n, r, i) {
          super(e, n), (this.reason = r), (this.code = i), (this.type = 2);
        }
        toString() {
          return `NavigationCancel(id: ${this.id}, url: '${this.url}')`;
        }
      }
      class Bs extends Vn {
        constructor(e, n, r, i) {
          super(e, n), (this.reason = r), (this.code = i), (this.type = 16);
        }
      }
      class mp extends Vn {
        constructor(e, n, r, i) {
          super(e, n), (this.error = r), (this.target = i), (this.type = 3);
        }
        toString() {
          return `NavigationError(id: ${this.id}, url: '${this.url}', error: ${this.error})`;
        }
      }
      class VB extends Vn {
        constructor(e, n, r, i) {
          super(e, n),
            (this.urlAfterRedirects = r),
            (this.state = i),
            (this.type = 4);
        }
        toString() {
          return `RoutesRecognized(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class BB extends Vn {
        constructor(e, n, r, i) {
          super(e, n),
            (this.urlAfterRedirects = r),
            (this.state = i),
            (this.type = 7);
        }
        toString() {
          return `GuardsCheckStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class jB extends Vn {
        constructor(e, n, r, i, o) {
          super(e, n),
            (this.urlAfterRedirects = r),
            (this.state = i),
            (this.shouldActivate = o),
            (this.type = 8);
        }
        toString() {
          return `GuardsCheckEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state}, shouldActivate: ${this.shouldActivate})`;
        }
      }
      class HB extends Vn {
        constructor(e, n, r, i) {
          super(e, n),
            (this.urlAfterRedirects = r),
            (this.state = i),
            (this.type = 5);
        }
        toString() {
          return `ResolveStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class $B extends Vn {
        constructor(e, n, r, i) {
          super(e, n),
            (this.urlAfterRedirects = r),
            (this.state = i),
            (this.type = 6);
        }
        toString() {
          return `ResolveEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class UB {
        constructor(e) {
          (this.route = e), (this.type = 9);
        }
        toString() {
          return `RouteConfigLoadStart(path: ${this.route.path})`;
        }
      }
      class zB {
        constructor(e) {
          (this.route = e), (this.type = 10);
        }
        toString() {
          return `RouteConfigLoadEnd(path: ${this.route.path})`;
        }
      }
      class qB {
        constructor(e) {
          (this.snapshot = e), (this.type = 11);
        }
        toString() {
          return `ChildActivationStart(path: '${
            (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
          }')`;
        }
      }
      class GB {
        constructor(e) {
          (this.snapshot = e), (this.type = 12);
        }
        toString() {
          return `ChildActivationEnd(path: '${
            (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
          }')`;
        }
      }
      class WB {
        constructor(e) {
          (this.snapshot = e), (this.type = 13);
        }
        toString() {
          return `ActivationStart(path: '${
            (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
          }')`;
        }
      }
      class KB {
        constructor(e) {
          (this.snapshot = e), (this.type = 14);
        }
        toString() {
          return `ActivationEnd(path: '${
            (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
          }')`;
        }
      }
      class UE {
        constructor(e, n, r) {
          (this.routerEvent = e),
            (this.position = n),
            (this.anchor = r),
            (this.type = 15);
        }
        toString() {
          return `Scroll(anchor: '${this.anchor}', position: '${
            this.position ? `${this.position[0]}, ${this.position[1]}` : null
          }')`;
        }
      }
      class QB {
        constructor() {
          (this.outlet = null),
            (this.route = null),
            (this.injector = null),
            (this.children = new js()),
            (this.attachRef = null);
        }
      }
      let js = (() => {
        class t {
          constructor() {
            this.contexts = new Map();
          }
          onChildOutletCreated(n, r) {
            const i = this.getOrCreateContext(n);
            (i.outlet = r), this.contexts.set(n, i);
          }
          onChildOutletDestroyed(n) {
            const r = this.getContext(n);
            r && ((r.outlet = null), (r.attachRef = null));
          }
          onOutletDeactivated() {
            const n = this.contexts;
            return (this.contexts = new Map()), n;
          }
          onOutletReAttached(n) {
            this.contexts = n;
          }
          getOrCreateContext(n) {
            let r = this.getContext(n);
            return r || ((r = new QB()), this.contexts.set(n, r)), r;
          }
          getContext(n) {
            return this.contexts.get(n) || null;
          }
        }
        return (
          (t.ɵfac = function (n) {
            return new (n || t)();
          }),
          (t.ɵprov = T({ token: t, factory: t.ɵfac, providedIn: "root" })),
          t
        );
      })();
      class zE {
        constructor(e) {
          this._root = e;
        }
        get root() {
          return this._root.value;
        }
        parent(e) {
          const n = this.pathFromRoot(e);
          return n.length > 1 ? n[n.length - 2] : null;
        }
        children(e) {
          const n = yp(e, this._root);
          return n ? n.children.map((r) => r.value) : [];
        }
        firstChild(e) {
          const n = yp(e, this._root);
          return n && n.children.length > 0 ? n.children[0].value : null;
        }
        siblings(e) {
          const n = vp(e, this._root);
          return n.length < 2
            ? []
            : n[n.length - 2].children
                .map((i) => i.value)
                .filter((i) => i !== e);
        }
        pathFromRoot(e) {
          return vp(e, this._root).map((n) => n.value);
        }
      }
      function yp(t, e) {
        if (t === e.value) return e;
        for (const n of e.children) {
          const r = yp(t, n);
          if (r) return r;
        }
        return null;
      }
      function vp(t, e) {
        if (t === e.value) return [e];
        for (const n of e.children) {
          const r = vp(t, n);
          if (r.length) return r.unshift(e), r;
        }
        return [];
      }
      class ur {
        constructor(e, n) {
          (this.value = e), (this.children = n);
        }
        toString() {
          return `TreeNode(${this.value})`;
        }
      }
      function ho(t) {
        const e = {};
        return t && t.children.forEach((n) => (e[n.value.outlet] = n)), e;
      }
      class qE extends zE {
        constructor(e, n) {
          super(e), (this.snapshot = n), _p(this, e);
        }
        toString() {
          return this.snapshot.toString();
        }
      }
      function GE(t, e) {
        const n = (function ZB(t, e) {
            const s = new _u([], {}, {}, "", {}, Y, e, null, {});
            return new KE("", new ur(s, []));
          })(0, e),
          r = new pt([new Os("", {})]),
          i = new pt({}),
          o = new pt({}),
          s = new pt({}),
          a = new pt(""),
          l = new oi(r, i, s, a, o, Y, e, n.root);
        return (l.snapshot = n.root), new qE(new ur(l, []), n);
      }
      class oi {
        constructor(e, n, r, i, o, s, a, l) {
          (this.urlSubject = e),
            (this.paramsSubject = n),
            (this.queryParamsSubject = r),
            (this.fragmentSubject = i),
            (this.dataSubject = o),
            (this.outlet = s),
            (this.component = a),
            (this._futureSnapshot = l),
            (this.title = this.dataSubject?.pipe(J((u) => u[Ns])) ?? B(void 0)),
            (this.url = e),
            (this.params = n),
            (this.queryParams = r),
            (this.fragment = i),
            (this.data = o);
        }
        get routeConfig() {
          return this._futureSnapshot.routeConfig;
        }
        get root() {
          return this._routerState.root;
        }
        get parent() {
          return this._routerState.parent(this);
        }
        get firstChild() {
          return this._routerState.firstChild(this);
        }
        get children() {
          return this._routerState.children(this);
        }
        get pathFromRoot() {
          return this._routerState.pathFromRoot(this);
        }
        get paramMap() {
          return (
            this._paramMap ||
              (this._paramMap = this.params.pipe(J((e) => co(e)))),
            this._paramMap
          );
        }
        get queryParamMap() {
          return (
            this._queryParamMap ||
              (this._queryParamMap = this.queryParams.pipe(J((e) => co(e)))),
            this._queryParamMap
          );
        }
        toString() {
          return this.snapshot
            ? this.snapshot.toString()
            : `Future(${this._futureSnapshot})`;
        }
      }
      function WE(t, e = "emptyOnly") {
        const n = t.pathFromRoot;
        let r = 0;
        if ("always" !== e)
          for (r = n.length - 1; r >= 1; ) {
            const i = n[r],
              o = n[r - 1];
            if (i.routeConfig && "" === i.routeConfig.path) r--;
            else {
              if (o.component) break;
              r--;
            }
          }
        return (function YB(t) {
          return t.reduce(
            (e, n) => ({
              params: { ...e.params, ...n.params },
              data: { ...e.data, ...n.data },
              resolve: {
                ...n.data,
                ...e.resolve,
                ...n.routeConfig?.data,
                ...n._resolvedData,
              },
            }),
            { params: {}, data: {}, resolve: {} }
          );
        })(n.slice(r));
      }
      class _u {
        get title() {
          return this.data?.[Ns];
        }
        constructor(e, n, r, i, o, s, a, l, u) {
          (this.url = e),
            (this.params = n),
            (this.queryParams = r),
            (this.fragment = i),
            (this.data = o),
            (this.outlet = s),
            (this.component = a),
            (this.routeConfig = l),
            (this._resolve = u);
        }
        get root() {
          return this._routerState.root;
        }
        get parent() {
          return this._routerState.parent(this);
        }
        get firstChild() {
          return this._routerState.firstChild(this);
        }
        get children() {
          return this._routerState.children(this);
        }
        get pathFromRoot() {
          return this._routerState.pathFromRoot(this);
        }
        get paramMap() {
          return (
            this._paramMap || (this._paramMap = co(this.params)), this._paramMap
          );
        }
        get queryParamMap() {
          return (
            this._queryParamMap || (this._queryParamMap = co(this.queryParams)),
            this._queryParamMap
          );
        }
        toString() {
          return `Route(url:'${this.url
            .map((r) => r.toString())
            .join("/")}', path:'${
            this.routeConfig ? this.routeConfig.path : ""
          }')`;
        }
      }
      class KE extends zE {
        constructor(e, n) {
          super(n), (this.url = e), _p(this, n);
        }
        toString() {
          return QE(this._root);
        }
      }
      function _p(t, e) {
        (e.value._routerState = t), e.children.forEach((n) => _p(t, n));
      }
      function QE(t) {
        const e =
          t.children.length > 0 ? ` { ${t.children.map(QE).join(", ")} } ` : "";
        return `${t.value}${e}`;
      }
      function Cp(t) {
        if (t.snapshot) {
          const e = t.snapshot,
            n = t._futureSnapshot;
          (t.snapshot = n),
            Ln(e.queryParams, n.queryParams) ||
              t.queryParamsSubject.next(n.queryParams),
            e.fragment !== n.fragment && t.fragmentSubject.next(n.fragment),
            Ln(e.params, n.params) || t.paramsSubject.next(n.params),
            (function fB(t, e) {
              if (t.length !== e.length) return !1;
              for (let n = 0; n < t.length; ++n) if (!Ln(t[n], e[n])) return !1;
              return !0;
            })(e.url, n.url) || t.urlSubject.next(n.url),
            Ln(e.data, n.data) || t.dataSubject.next(n.data);
        } else
          (t.snapshot = t._futureSnapshot),
            t.dataSubject.next(t._futureSnapshot.data);
      }
      function Dp(t, e) {
        const n =
          Ln(t.params, e.params) &&
          (function mB(t, e) {
            return (
              ni(t, e) && t.every((n, r) => Ln(n.parameters, e[r].parameters))
            );
          })(t.url, e.url);
        return (
          n &&
          !(!t.parent != !e.parent) &&
          (!t.parent || Dp(t.parent, e.parent))
        );
      }
      let Cu = (() => {
        class t {
          constructor() {
            (this.activated = null),
              (this._activatedRoute = null),
              (this.name = Y),
              (this.activateEvents = new Oe()),
              (this.deactivateEvents = new Oe()),
              (this.attachEvents = new Oe()),
              (this.detachEvents = new Oe()),
              (this.parentContexts = E(js)),
              (this.location = E(fn)),
              (this.changeDetector = E(Wl)),
              (this.environmentInjector = E(Nn)),
              (this.inputBinder = E(Du, { optional: !0 })),
              (this.supportsBindingToComponentInputs = !0);
          }
          get activatedComponentRef() {
            return this.activated;
          }
          ngOnChanges(n) {
            if (n.name) {
              const { firstChange: r, previousValue: i } = n.name;
              if (r) return;
              this.isTrackedInParentContexts(i) &&
                (this.deactivate(),
                this.parentContexts.onChildOutletDestroyed(i)),
                this.initializeOutletWithName();
            }
          }
          ngOnDestroy() {
            this.isTrackedInParentContexts(this.name) &&
              this.parentContexts.onChildOutletDestroyed(this.name),
              this.inputBinder?.unsubscribeFromRouteData(this);
          }
          isTrackedInParentContexts(n) {
            return this.parentContexts.getContext(n)?.outlet === this;
          }
          ngOnInit() {
            this.initializeOutletWithName();
          }
          initializeOutletWithName() {
            if (
              (this.parentContexts.onChildOutletCreated(this.name, this),
              this.activated)
            )
              return;
            const n = this.parentContexts.getContext(this.name);
            n?.route &&
              (n.attachRef
                ? this.attach(n.attachRef, n.route)
                : this.activateWith(n.route, n.injector));
          }
          get isActivated() {
            return !!this.activated;
          }
          get component() {
            if (!this.activated) throw new v(4012, !1);
            return this.activated.instance;
          }
          get activatedRoute() {
            if (!this.activated) throw new v(4012, !1);
            return this._activatedRoute;
          }
          get activatedRouteData() {
            return this._activatedRoute
              ? this._activatedRoute.snapshot.data
              : {};
          }
          detach() {
            if (!this.activated) throw new v(4012, !1);
            this.location.detach();
            const n = this.activated;
            return (
              (this.activated = null),
              (this._activatedRoute = null),
              this.detachEvents.emit(n.instance),
              n
            );
          }
          attach(n, r) {
            (this.activated = n),
              (this._activatedRoute = r),
              this.location.insert(n.hostView),
              this.inputBinder?.bindActivatedRouteToOutletComponent(this),
              this.attachEvents.emit(n.instance);
          }
          deactivate() {
            if (this.activated) {
              const n = this.component;
              this.activated.destroy(),
                (this.activated = null),
                (this._activatedRoute = null),
                this.deactivateEvents.emit(n);
            }
          }
          activateWith(n, r) {
            if (this.isActivated) throw new v(4013, !1);
            this._activatedRoute = n;
            const i = this.location,
              s = n.snapshot.component,
              a = this.parentContexts.getOrCreateContext(this.name).children,
              l = new XB(n, a, i.injector);
            (this.activated = i.createComponent(s, {
              index: i.length,
              injector: l,
              environmentInjector: r ?? this.environmentInjector,
            })),
              this.changeDetector.markForCheck(),
              this.inputBinder?.bindActivatedRouteToOutletComponent(this),
              this.activateEvents.emit(this.activated.instance);
          }
        }
        return (
          (t.ɵfac = function (n) {
            return new (n || t)();
          }),
          (t.ɵdir = q({
            type: t,
            selectors: [["router-outlet"]],
            inputs: { name: "name" },
            outputs: {
              activateEvents: "activate",
              deactivateEvents: "deactivate",
              attachEvents: "attach",
              detachEvents: "detach",
            },
            exportAs: ["outlet"],
            standalone: !0,
            features: [Qt],
          })),
          t
        );
      })();
      class XB {
        constructor(e, n, r) {
          (this.route = e), (this.childContexts = n), (this.parent = r);
        }
        get(e, n) {
          return e === oi
            ? this.route
            : e === js
            ? this.childContexts
            : this.parent.get(e, n);
        }
      }
      const Du = new b("");
      let ZE = (() => {
        class t {
          constructor() {
            this.outletDataSubscriptions = new Map();
          }
          bindActivatedRouteToOutletComponent(n) {
            this.unsubscribeFromRouteData(n), this.subscribeToRouteData(n);
          }
          unsubscribeFromRouteData(n) {
            this.outletDataSubscriptions.get(n)?.unsubscribe(),
              this.outletDataSubscriptions.delete(n);
          }
          subscribeToRouteData(n) {
            const { activatedRoute: r } = n,
              i = sp([r.queryParams, r.params, r.data])
                .pipe(
                  Gt(
                    ([o, s, a], l) => (
                      (a = { ...o, ...s, ...a }),
                      0 === l ? B(a) : Promise.resolve(a)
                    )
                  )
                )
                .subscribe((o) => {
                  if (
                    !n.isActivated ||
                    !n.activatedComponentRef ||
                    n.activatedRoute !== r ||
                    null === r.component
                  )
                    return void this.unsubscribeFromRouteData(n);
                  const s = (function TL(t) {
                    const e = se(t);
                    if (!e) return null;
                    const n = new us(e);
                    return {
                      get selector() {
                        return n.selector;
                      },
                      get type() {
                        return n.componentType;
                      },
                      get inputs() {
                        return n.inputs;
                      },
                      get outputs() {
                        return n.outputs;
                      },
                      get ngContentSelectors() {
                        return n.ngContentSelectors;
                      },
                      get isStandalone() {
                        return e.standalone;
                      },
                      get isSignal() {
                        return e.signals;
                      },
                    };
                  })(r.component);
                  if (s)
                    for (const { templateName: a } of s.inputs)
                      n.activatedComponentRef.setInput(a, o[a]);
                  else this.unsubscribeFromRouteData(n);
                });
            this.outletDataSubscriptions.set(n, i);
          }
        }
        return (
          (t.ɵfac = function (n) {
            return new (n || t)();
          }),
          (t.ɵprov = T({ token: t, factory: t.ɵfac })),
          t
        );
      })();
      function Hs(t, e, n) {
        if (n && t.shouldReuseRoute(e.value, n.value.snapshot)) {
          const r = n.value;
          r._futureSnapshot = e.value;
          const i = (function ej(t, e, n) {
            return e.children.map((r) => {
              for (const i of n.children)
                if (t.shouldReuseRoute(r.value, i.value.snapshot))
                  return Hs(t, r, i);
              return Hs(t, r);
            });
          })(t, e, n);
          return new ur(r, i);
        }
        {
          if (t.shouldAttach(e.value)) {
            const o = t.retrieve(e.value);
            if (null !== o) {
              const s = o.route;
              return (
                (s.value._futureSnapshot = e.value),
                (s.children = e.children.map((a) => Hs(t, a))),
                s
              );
            }
          }
          const r = (function tj(t) {
              return new oi(
                new pt(t.url),
                new pt(t.params),
                new pt(t.queryParams),
                new pt(t.fragment),
                new pt(t.data),
                t.outlet,
                t.component,
                t
              );
            })(e.value),
            i = e.children.map((o) => Hs(t, o));
          return new ur(r, i);
        }
      }
      const wp = "ngNavigationCancelingError";
      function YE(t, e) {
        const { redirectTo: n, navigationBehaviorOptions: r } = ri(e)
            ? { redirectTo: e, navigationBehaviorOptions: void 0 }
            : e,
          i = XE(!1, 0, e);
        return (i.url = n), (i.navigationBehaviorOptions = r), i;
      }
      function XE(t, e, n) {
        const r = new Error("NavigationCancelingError: " + (t || ""));
        return (r[wp] = !0), (r.cancellationCode = e), n && (r.url = n), r;
      }
      function JE(t) {
        return e0(t) && ri(t.url);
      }
      function e0(t) {
        return t && t[wp];
      }
      let t0 = (() => {
        class t {}
        return (
          (t.ɵfac = function (n) {
            return new (n || t)();
          }),
          (t.ɵcmp = Kt({
            type: t,
            selectors: [["ng-component"]],
            standalone: !0,
            features: [Hl],
            decls: 1,
            vars: 0,
            template: function (n, r) {
              1 & n && Be(0, "router-outlet");
            },
            dependencies: [Cu],
            encapsulation: 2,
          })),
          t
        );
      })();
      function bp(t) {
        const e = t.children && t.children.map(bp),
          n = e ? { ...t, children: e } : { ...t };
        return (
          !n.component &&
            !n.loadComponent &&
            (e || n.loadChildren) &&
            n.outlet &&
            n.outlet !== Y &&
            (n.component = t0),
          n
        );
      }
      function mn(t) {
        return t.outlet || Y;
      }
      function $s(t) {
        if (!t) return null;
        if (t.routeConfig?._injector) return t.routeConfig._injector;
        for (let e = t.parent; e; e = e.parent) {
          const n = e.routeConfig;
          if (n?._loadedInjector) return n._loadedInjector;
          if (n?._injector) return n._injector;
        }
        return null;
      }
      class lj {
        constructor(e, n, r, i, o) {
          (this.routeReuseStrategy = e),
            (this.futureState = n),
            (this.currState = r),
            (this.forwardEvent = i),
            (this.inputBindingEnabled = o);
        }
        activate(e) {
          const n = this.futureState._root,
            r = this.currState ? this.currState._root : null;
          this.deactivateChildRoutes(n, r, e),
            Cp(this.futureState.root),
            this.activateChildRoutes(n, r, e);
        }
        deactivateChildRoutes(e, n, r) {
          const i = ho(n);
          e.children.forEach((o) => {
            const s = o.value.outlet;
            this.deactivateRoutes(o, i[s], r), delete i[s];
          }),
            Object.values(i).forEach((o) => {
              this.deactivateRouteAndItsChildren(o, r);
            });
        }
        deactivateRoutes(e, n, r) {
          const i = e.value,
            o = n ? n.value : null;
          if (i === o)
            if (i.component) {
              const s = r.getContext(i.outlet);
              s && this.deactivateChildRoutes(e, n, s.children);
            } else this.deactivateChildRoutes(e, n, r);
          else o && this.deactivateRouteAndItsChildren(n, r);
        }
        deactivateRouteAndItsChildren(e, n) {
          e.value.component &&
          this.routeReuseStrategy.shouldDetach(e.value.snapshot)
            ? this.detachAndStoreRouteSubtree(e, n)
            : this.deactivateRouteAndOutlet(e, n);
        }
        detachAndStoreRouteSubtree(e, n) {
          const r = n.getContext(e.value.outlet),
            i = r && e.value.component ? r.children : n,
            o = ho(e);
          for (const s of Object.keys(o))
            this.deactivateRouteAndItsChildren(o[s], i);
          if (r && r.outlet) {
            const s = r.outlet.detach(),
              a = r.children.onOutletDeactivated();
            this.routeReuseStrategy.store(e.value.snapshot, {
              componentRef: s,
              route: e,
              contexts: a,
            });
          }
        }
        deactivateRouteAndOutlet(e, n) {
          const r = n.getContext(e.value.outlet),
            i = r && e.value.component ? r.children : n,
            o = ho(e);
          for (const s of Object.keys(o))
            this.deactivateRouteAndItsChildren(o[s], i);
          r &&
            (r.outlet &&
              (r.outlet.deactivate(), r.children.onOutletDeactivated()),
            (r.attachRef = null),
            (r.route = null));
        }
        activateChildRoutes(e, n, r) {
          const i = ho(n);
          e.children.forEach((o) => {
            this.activateRoutes(o, i[o.value.outlet], r),
              this.forwardEvent(new KB(o.value.snapshot));
          }),
            e.children.length && this.forwardEvent(new GB(e.value.snapshot));
        }
        activateRoutes(e, n, r) {
          const i = e.value,
            o = n ? n.value : null;
          if ((Cp(i), i === o))
            if (i.component) {
              const s = r.getOrCreateContext(i.outlet);
              this.activateChildRoutes(e, n, s.children);
            } else this.activateChildRoutes(e, n, r);
          else if (i.component) {
            const s = r.getOrCreateContext(i.outlet);
            if (this.routeReuseStrategy.shouldAttach(i.snapshot)) {
              const a = this.routeReuseStrategy.retrieve(i.snapshot);
              this.routeReuseStrategy.store(i.snapshot, null),
                s.children.onOutletReAttached(a.contexts),
                (s.attachRef = a.componentRef),
                (s.route = a.route.value),
                s.outlet && s.outlet.attach(a.componentRef, a.route.value),
                Cp(a.route.value),
                this.activateChildRoutes(e, null, s.children);
            } else {
              const a = $s(i.snapshot);
              (s.attachRef = null),
                (s.route = i),
                (s.injector = a),
                s.outlet && s.outlet.activateWith(i, s.injector),
                this.activateChildRoutes(e, null, s.children);
            }
          } else this.activateChildRoutes(e, null, r);
        }
      }
      class n0 {
        constructor(e) {
          (this.path = e), (this.route = this.path[this.path.length - 1]);
        }
      }
      class wu {
        constructor(e, n) {
          (this.component = e), (this.route = n);
        }
      }
      function uj(t, e, n) {
        const r = t._root;
        return Us(r, e ? e._root : null, n, [r.value]);
      }
      function po(t, e) {
        const n = Symbol(),
          r = e.get(t, n);
        return r === n
          ? "function" != typeof t ||
            (function sI(t) {
              return null !== wa(t);
            })(t)
            ? e.get(t)
            : t
          : r;
      }
      function Us(
        t,
        e,
        n,
        r,
        i = { canDeactivateChecks: [], canActivateChecks: [] }
      ) {
        const o = ho(e);
        return (
          t.children.forEach((s) => {
            (function dj(
              t,
              e,
              n,
              r,
              i = { canDeactivateChecks: [], canActivateChecks: [] }
            ) {
              const o = t.value,
                s = e ? e.value : null,
                a = n ? n.getContext(t.value.outlet) : null;
              if (s && o.routeConfig === s.routeConfig) {
                const l = (function fj(t, e, n) {
                  if ("function" == typeof n) return n(t, e);
                  switch (n) {
                    case "pathParamsChange":
                      return !ni(t.url, e.url);
                    case "pathParamsOrQueryParamsChange":
                      return (
                        !ni(t.url, e.url) || !Ln(t.queryParams, e.queryParams)
                      );
                    case "always":
                      return !0;
                    case "paramsOrQueryParamsChange":
                      return !Dp(t, e) || !Ln(t.queryParams, e.queryParams);
                    default:
                      return !Dp(t, e);
                  }
                })(s, o, o.routeConfig.runGuardsAndResolvers);
                l
                  ? i.canActivateChecks.push(new n0(r))
                  : ((o.data = s.data), (o._resolvedData = s._resolvedData)),
                  Us(t, e, o.component ? (a ? a.children : null) : n, r, i),
                  l &&
                    a &&
                    a.outlet &&
                    a.outlet.isActivated &&
                    i.canDeactivateChecks.push(new wu(a.outlet.component, s));
              } else
                s && zs(e, a, i),
                  i.canActivateChecks.push(new n0(r)),
                  Us(t, null, o.component ? (a ? a.children : null) : n, r, i);
            })(s, o[s.value.outlet], n, r.concat([s.value]), i),
              delete o[s.value.outlet];
          }),
          Object.entries(o).forEach(([s, a]) => zs(a, n.getContext(s), i)),
          i
        );
      }
      function zs(t, e, n) {
        const r = ho(t),
          i = t.value;
        Object.entries(r).forEach(([o, s]) => {
          zs(s, i.component ? (e ? e.children.getContext(o) : null) : e, n);
        }),
          n.canDeactivateChecks.push(
            new wu(
              i.component && e && e.outlet && e.outlet.isActivated
                ? e.outlet.component
                : null,
              i
            )
          );
      }
      function qs(t) {
        return "function" == typeof t;
      }
      function r0(t) {
        return t instanceof cu || "EmptyError" === t?.name;
      }
      const bu = Symbol("INITIAL_VALUE");
      function go() {
        return Gt((t) =>
          sp(
            t.map((e) =>
              e.pipe(
                ei(1),
                (function oB(...t) {
                  const e = Io(t);
                  return be((n, r) => {
                    (e ? ap(t, n, e) : ap(t, n)).subscribe(r);
                  });
                })(bu)
              )
            )
          ).pipe(
            J((e) => {
              for (const n of e)
                if (!0 !== n) {
                  if (n === bu) return bu;
                  if (!1 === n || n instanceof fo) return n;
                }
              return !0;
            }),
            en((e) => e !== bu),
            ei(1)
          )
        );
      }
      function o0(t) {
        return (function pA(...t) {
          return Dm(t);
        })(
          _t((e) => {
            if (ri(e)) throw YE(0, e);
          }),
          J((e) => !0 === e)
        );
      }
      class Eu {
        constructor(e) {
          this.segmentGroup = e || null;
        }
      }
      class s0 {
        constructor(e) {
          this.urlTree = e;
        }
      }
      function mo(t) {
        return lo(new Eu(t));
      }
      function a0(t) {
        return lo(new s0(t));
      }
      class Nj {
        constructor(e, n) {
          (this.urlSerializer = e), (this.urlTree = n);
        }
        noMatchError(e) {
          return new v(4002, !1);
        }
        lineralizeSegments(e, n) {
          let r = [],
            i = n.root;
          for (;;) {
            if (((r = r.concat(i.segments)), 0 === i.numberOfChildren))
              return B(r);
            if (i.numberOfChildren > 1 || !i.children[Y])
              return lo(new v(4e3, !1));
            i = i.children[Y];
          }
        }
        applyRedirectCommands(e, n, r) {
          return this.applyRedirectCreateUrlTree(
            n,
            this.urlSerializer.parse(n),
            e,
            r
          );
        }
        applyRedirectCreateUrlTree(e, n, r, i) {
          const o = this.createSegmentGroup(e, n.root, r, i);
          return new fo(
            o,
            this.createQueryParams(n.queryParams, this.urlTree.queryParams),
            n.fragment
          );
        }
        createQueryParams(e, n) {
          const r = {};
          return (
            Object.entries(e).forEach(([i, o]) => {
              if ("string" == typeof o && o.startsWith(":")) {
                const a = o.substring(1);
                r[i] = n[a];
              } else r[i] = o;
            }),
            r
          );
        }
        createSegmentGroup(e, n, r, i) {
          const o = this.createSegments(e, n.segments, r, i);
          let s = {};
          return (
            Object.entries(n.children).forEach(([a, l]) => {
              s[a] = this.createSegmentGroup(e, l, r, i);
            }),
            new fe(o, s)
          );
        }
        createSegments(e, n, r, i) {
          return n.map((o) =>
            o.path.startsWith(":")
              ? this.findPosParam(e, o, i)
              : this.findOrReturn(o, r)
          );
        }
        findPosParam(e, n, r) {
          const i = r[n.path.substring(1)];
          if (!i) throw new v(4001, !1);
          return i;
        }
        findOrReturn(e, n) {
          let r = 0;
          for (const i of n) {
            if (i.path === e.path) return n.splice(r), i;
            r++;
          }
          return e;
        }
      }
      const Ep = {
        matched: !1,
        consumedSegments: [],
        remainingSegments: [],
        parameters: {},
        positionalParamSegments: {},
      };
      function Oj(t, e, n, r, i) {
        const o = Sp(t, e, n);
        return o.matched
          ? ((r = (function nj(t, e) {
              return (
                t.providers &&
                  !t._injector &&
                  (t._injector = Yf(t.providers, e, `Route: ${t.path}`)),
                t._injector ?? e
              );
            })(e, r)),
            (function Ij(t, e, n, r) {
              const i = e.canMatch;
              return i && 0 !== i.length
                ? B(
                    i.map((s) => {
                      const a = po(s, t);
                      return Tr(
                        (function vj(t) {
                          return t && qs(t.canMatch);
                        })(a)
                          ? a.canMatch(e, n)
                          : t.runInContext(() => a(e, n))
                      );
                    })
                  ).pipe(go(), o0())
                : B(!0);
            })(r, e, n).pipe(J((s) => (!0 === s ? o : { ...Ep }))))
          : B(o);
      }
      function Sp(t, e, n) {
        if ("" === e.path)
          return "full" === e.pathMatch && (t.hasChildren() || n.length > 0)
            ? { ...Ep }
            : {
                matched: !0,
                consumedSegments: [],
                remainingSegments: n,
                parameters: {},
                positionalParamSegments: {},
              };
        const i = (e.matcher || dB)(n, t, e);
        if (!i) return { ...Ep };
        const o = {};
        Object.entries(i.posParams ?? {}).forEach(([a, l]) => {
          o[a] = l.path;
        });
        const s =
          i.consumed.length > 0
            ? { ...o, ...i.consumed[i.consumed.length - 1].parameters }
            : o;
        return {
          matched: !0,
          consumedSegments: i.consumed,
          remainingSegments: n.slice(i.consumed.length),
          parameters: s,
          positionalParamSegments: i.posParams ?? {},
        };
      }
      function l0(t, e, n, r) {
        return n.length > 0 &&
          (function kj(t, e, n) {
            return n.some((r) => Su(t, e, r) && mn(r) !== Y);
          })(t, n, r)
          ? {
              segmentGroup: new fe(e, Fj(r, new fe(n, t.children))),
              slicedSegments: [],
            }
          : 0 === n.length &&
            (function Lj(t, e, n) {
              return n.some((r) => Su(t, e, r));
            })(t, n, r)
          ? {
              segmentGroup: new fe(t.segments, Pj(t, 0, n, r, t.children)),
              slicedSegments: n,
            }
          : { segmentGroup: new fe(t.segments, t.children), slicedSegments: n };
      }
      function Pj(t, e, n, r, i) {
        const o = {};
        for (const s of r)
          if (Su(t, n, s) && !i[mn(s)]) {
            const a = new fe([], {});
            o[mn(s)] = a;
          }
        return { ...i, ...o };
      }
      function Fj(t, e) {
        const n = {};
        n[Y] = e;
        for (const r of t)
          if ("" === r.path && mn(r) !== Y) {
            const i = new fe([], {});
            n[mn(r)] = i;
          }
        return n;
      }
      function Su(t, e, n) {
        return (
          (!(t.hasChildren() || e.length > 0) || "full" !== n.pathMatch) &&
          "" === n.path
        );
      }
      class Hj {
        constructor(e, n, r, i, o, s, a) {
          (this.injector = e),
            (this.configLoader = n),
            (this.rootComponentType = r),
            (this.config = i),
            (this.urlTree = o),
            (this.paramsInheritanceStrategy = s),
            (this.urlSerializer = a),
            (this.allowRedirects = !0),
            (this.applyRedirects = new Nj(this.urlSerializer, this.urlTree));
        }
        noMatchError(e) {
          return new v(4002, !1);
        }
        recognize() {
          const e = l0(this.urlTree.root, [], [], this.config).segmentGroup;
          return this.processSegmentGroup(
            this.injector,
            this.config,
            e,
            Y
          ).pipe(
            Mr((n) => {
              if (n instanceof s0)
                return (
                  (this.allowRedirects = !1),
                  (this.urlTree = n.urlTree),
                  this.match(n.urlTree)
                );
              throw n instanceof Eu ? this.noMatchError(n) : n;
            }),
            J((n) => {
              const r = new _u(
                  [],
                  Object.freeze({}),
                  Object.freeze({ ...this.urlTree.queryParams }),
                  this.urlTree.fragment,
                  {},
                  Y,
                  this.rootComponentType,
                  null,
                  {}
                ),
                i = new ur(r, n),
                o = new KE("", i),
                s = (function RB(t, e, n = null, r = null) {
                  return LE(kE(t), e, n, r);
                })(r, [], this.urlTree.queryParams, this.urlTree.fragment);
              return (
                (s.queryParams = this.urlTree.queryParams),
                (o.url = this.urlSerializer.serialize(s)),
                this.inheritParamsAndData(o._root),
                { state: o, tree: s }
              );
            })
          );
        }
        match(e) {
          return this.processSegmentGroup(
            this.injector,
            this.config,
            e.root,
            Y
          ).pipe(
            Mr((r) => {
              throw r instanceof Eu ? this.noMatchError(r) : r;
            })
          );
        }
        inheritParamsAndData(e) {
          const n = e.value,
            r = WE(n, this.paramsInheritanceStrategy);
          (n.params = Object.freeze(r.params)),
            (n.data = Object.freeze(r.data)),
            e.children.forEach((i) => this.inheritParamsAndData(i));
        }
        processSegmentGroup(e, n, r, i) {
          return 0 === r.segments.length && r.hasChildren()
            ? this.processChildren(e, n, r)
            : this.processSegment(e, n, r, r.segments, i, !0);
        }
        processChildren(e, n, r) {
          const i = [];
          for (const o of Object.keys(r.children))
            "primary" === o ? i.unshift(o) : i.push(o);
          return We(i).pipe(
            uo((o) => {
              const s = r.children[o],
                a = (function sj(t, e) {
                  const n = t.filter((r) => mn(r) === e);
                  return n.push(...t.filter((r) => mn(r) !== e)), n;
                })(n, o);
              return this.processSegmentGroup(e, a, s, o);
            }),
            bE((o, s) => (o.push(...s), o)),
            du(null),
            (function lB(t, e) {
              const n = arguments.length >= 2;
              return (r) =>
                r.pipe(
                  t ? en((i, o) => t(i, o, r)) : qn,
                  up(1),
                  n ? du(e) : wE(() => new cu())
                );
            })(),
            Ge((o) => {
              if (null === o) return mo(r);
              const s = u0(o);
              return (
                (function $j(t) {
                  t.sort((e, n) =>
                    e.value.outlet === Y
                      ? -1
                      : n.value.outlet === Y
                      ? 1
                      : e.value.outlet.localeCompare(n.value.outlet)
                  );
                })(s),
                B(s)
              );
            })
          );
        }
        processSegment(e, n, r, i, o, s) {
          return We(n).pipe(
            uo((a) =>
              this.processSegmentAgainstRoute(
                a._injector ?? e,
                n,
                a,
                r,
                i,
                o,
                s
              ).pipe(
                Mr((l) => {
                  if (l instanceof Eu) return B(null);
                  throw l;
                })
              )
            ),
            ti((a) => !!a),
            Mr((a) => {
              if (r0(a))
                return (function Bj(t, e, n) {
                  return 0 === e.length && !t.children[n];
                })(r, i, o)
                  ? B([])
                  : mo(r);
              throw a;
            })
          );
        }
        processSegmentAgainstRoute(e, n, r, i, o, s, a) {
          return (function Vj(t, e, n, r) {
            return (
              !!(mn(t) === r || (r !== Y && Su(e, n, t))) &&
              ("**" === t.path || Sp(e, t, n).matched)
            );
          })(r, i, o, s)
            ? void 0 === r.redirectTo
              ? this.matchSegmentAgainstRoute(e, i, r, o, s, a)
              : a && this.allowRedirects
              ? this.expandSegmentAgainstRouteUsingRedirect(e, i, n, r, o, s)
              : mo(i)
            : mo(i);
        }
        expandSegmentAgainstRouteUsingRedirect(e, n, r, i, o, s) {
          return "**" === i.path
            ? this.expandWildCardWithParamsAgainstRouteUsingRedirect(e, r, i, s)
            : this.expandRegularSegmentAgainstRouteUsingRedirect(
                e,
                n,
                r,
                i,
                o,
                s
              );
        }
        expandWildCardWithParamsAgainstRouteUsingRedirect(e, n, r, i) {
          const o = this.applyRedirects.applyRedirectCommands(
            [],
            r.redirectTo,
            {}
          );
          return r.redirectTo.startsWith("/")
            ? a0(o)
            : this.applyRedirects.lineralizeSegments(r, o).pipe(
                Ge((s) => {
                  const a = new fe(s, {});
                  return this.processSegment(e, n, a, s, i, !1);
                })
              );
        }
        expandRegularSegmentAgainstRouteUsingRedirect(e, n, r, i, o, s) {
          const {
            matched: a,
            consumedSegments: l,
            remainingSegments: u,
            positionalParamSegments: c,
          } = Sp(n, i, o);
          if (!a) return mo(n);
          const d = this.applyRedirects.applyRedirectCommands(
            l,
            i.redirectTo,
            c
          );
          return i.redirectTo.startsWith("/")
            ? a0(d)
            : this.applyRedirects
                .lineralizeSegments(i, d)
                .pipe(
                  Ge((f) => this.processSegment(e, r, n, f.concat(u), s, !1))
                );
        }
        matchSegmentAgainstRoute(e, n, r, i, o, s) {
          let a;
          if ("**" === r.path) {
            const l = i.length > 0 ? SE(i).parameters : {};
            (a = B({
              snapshot: new _u(
                i,
                l,
                Object.freeze({ ...this.urlTree.queryParams }),
                this.urlTree.fragment,
                c0(r),
                mn(r),
                r.component ?? r._loadedComponent ?? null,
                r,
                d0(r)
              ),
              consumedSegments: [],
              remainingSegments: [],
            })),
              (n.children = {});
          } else
            a = Oj(n, r, i, e).pipe(
              J(
                ({
                  matched: l,
                  consumedSegments: u,
                  remainingSegments: c,
                  parameters: d,
                }) =>
                  l
                    ? {
                        snapshot: new _u(
                          u,
                          d,
                          Object.freeze({ ...this.urlTree.queryParams }),
                          this.urlTree.fragment,
                          c0(r),
                          mn(r),
                          r.component ?? r._loadedComponent ?? null,
                          r,
                          d0(r)
                        ),
                        consumedSegments: u,
                        remainingSegments: c,
                      }
                    : null
              )
            );
          return a.pipe(
            Gt((l) =>
              null === l
                ? mo(n)
                : this.getChildConfig((e = r._injector ?? e), r, i).pipe(
                    Gt(({ routes: u }) => {
                      const c = r._loadedInjector ?? e,
                        {
                          snapshot: d,
                          consumedSegments: f,
                          remainingSegments: h,
                        } = l,
                        { segmentGroup: p, slicedSegments: g } = l0(n, f, h, u);
                      if (0 === g.length && p.hasChildren())
                        return this.processChildren(c, u, p).pipe(
                          J((_) => (null === _ ? null : [new ur(d, _)]))
                        );
                      if (0 === u.length && 0 === g.length)
                        return B([new ur(d, [])]);
                      const m = mn(r) === o;
                      return this.processSegment(
                        c,
                        u,
                        p,
                        g,
                        m ? Y : o,
                        !0
                      ).pipe(J((_) => [new ur(d, _)]));
                    })
                  )
            )
          );
        }
        getChildConfig(e, n, r) {
          return n.children
            ? B({ routes: n.children, injector: e })
            : n.loadChildren
            ? void 0 !== n._loadedRoutes
              ? B({ routes: n._loadedRoutes, injector: n._loadedInjector })
              : (function Aj(t, e, n, r) {
                  const i = e.canLoad;
                  return void 0 === i || 0 === i.length
                    ? B(!0)
                    : B(
                        i.map((s) => {
                          const a = po(s, t);
                          return Tr(
                            (function pj(t) {
                              return t && qs(t.canLoad);
                            })(a)
                              ? a.canLoad(e, n)
                              : t.runInContext(() => a(e, n))
                          );
                        })
                      ).pipe(go(), o0());
                })(e, n, r).pipe(
                  Ge((i) =>
                    i
                      ? this.configLoader.loadChildren(e, n).pipe(
                          _t((o) => {
                            (n._loadedRoutes = o.routes),
                              (n._loadedInjector = o.injector);
                          })
                        )
                      : (function Rj(t) {
                          return lo(XE(!1, 3));
                        })()
                  )
                )
            : B({ routes: [], injector: e });
        }
      }
      function Uj(t) {
        const e = t.value.routeConfig;
        return e && "" === e.path;
      }
      function u0(t) {
        const e = [],
          n = new Set();
        for (const r of t) {
          if (!Uj(r)) {
            e.push(r);
            continue;
          }
          const i = e.find((o) => r.value.routeConfig === o.value.routeConfig);
          void 0 !== i ? (i.children.push(...r.children), n.add(i)) : e.push(r);
        }
        for (const r of n) {
          const i = u0(r.children);
          e.push(new ur(r.value, i));
        }
        return e.filter((r) => !n.has(r));
      }
      function c0(t) {
        return t.data || {};
      }
      function d0(t) {
        return t.resolve || {};
      }
      function f0(t) {
        return "string" == typeof t.title || null === t.title;
      }
      function Mp(t) {
        return Gt((e) => {
          const n = t(e);
          return n ? We(n).pipe(J(() => e)) : B(e);
        });
      }
      const yo = new b("ROUTES");
      let Tp = (() => {
        class t {
          constructor() {
            (this.componentLoaders = new WeakMap()),
              (this.childrenLoaders = new WeakMap()),
              (this.compiler = E(Hw));
          }
          loadComponent(n) {
            if (this.componentLoaders.get(n))
              return this.componentLoaders.get(n);
            if (n._loadedComponent) return B(n._loadedComponent);
            this.onLoadStartListener && this.onLoadStartListener(n);
            const r = Tr(n.loadComponent()).pipe(
                J(h0),
                _t((o) => {
                  this.onLoadEndListener && this.onLoadEndListener(n),
                    (n._loadedComponent = o);
                }),
                Rs(() => {
                  this.componentLoaders.delete(n);
                })
              ),
              i = new DE(r, () => new qe()).pipe(lp());
            return this.componentLoaders.set(n, i), i;
          }
          loadChildren(n, r) {
            if (this.childrenLoaders.get(r)) return this.childrenLoaders.get(r);
            if (r._loadedRoutes)
              return B({
                routes: r._loadedRoutes,
                injector: r._loadedInjector,
              });
            this.onLoadStartListener && this.onLoadStartListener(r);
            const o = this.loadModuleFactoryOrRoutes(r.loadChildren).pipe(
                J((a) => {
                  this.onLoadEndListener && this.onLoadEndListener(r);
                  let l, u;
                  return (
                    Array.isArray(a)
                      ? (u = a)
                      : ((l = a.create(n).injector),
                        (u = l.get(yo, [], k.Self | k.Optional).flat())),
                    { routes: u.map(bp), injector: l }
                  );
                }),
                Rs(() => {
                  this.childrenLoaders.delete(r);
                })
              ),
              s = new DE(o, () => new qe()).pipe(lp());
            return this.childrenLoaders.set(r, s), s;
          }
          loadModuleFactoryOrRoutes(n) {
            return Tr(n()).pipe(
              J(h0),
              Ge((r) =>
                r instanceof QD || Array.isArray(r)
                  ? B(r)
                  : We(this.compiler.compileModuleAsync(r))
              )
            );
          }
        }
        return (
          (t.ɵfac = function (n) {
            return new (n || t)();
          }),
          (t.ɵprov = T({ token: t, factory: t.ɵfac, providedIn: "root" })),
          t
        );
      })();
      function h0(t) {
        return (function Zj(t) {
          return t && "object" == typeof t && "default" in t;
        })(t)
          ? t.default
          : t;
      }
      let Mu = (() => {
        class t {
          get hasRequestedNavigation() {
            return 0 !== this.navigationId;
          }
          constructor() {
            (this.currentNavigation = null),
              (this.lastSuccessfulNavigation = null),
              (this.events = new qe()),
              (this.configLoader = E(Tp)),
              (this.environmentInjector = E(Nn)),
              (this.urlSerializer = E(Ps)),
              (this.rootContexts = E(js)),
              (this.inputBindingEnabled = null !== E(Du, { optional: !0 })),
              (this.navigationId = 0),
              (this.afterPreactivation = () => B(void 0)),
              (this.rootComponentType = null),
              (this.configLoader.onLoadEndListener = (i) =>
                this.events.next(new zB(i))),
              (this.configLoader.onLoadStartListener = (i) =>
                this.events.next(new UB(i)));
          }
          complete() {
            this.transitions?.complete();
          }
          handleNavigationRequest(n) {
            const r = ++this.navigationId;
            this.transitions?.next({ ...this.transitions.value, ...n, id: r });
          }
          setupNavigations(n) {
            return (
              (this.transitions = new pt({
                id: 0,
                currentUrlTree: n.currentUrlTree,
                currentRawUrl: n.currentUrlTree,
                extractedUrl: n.urlHandlingStrategy.extract(n.currentUrlTree),
                urlAfterRedirects: n.urlHandlingStrategy.extract(
                  n.currentUrlTree
                ),
                rawUrl: n.currentUrlTree,
                extras: {},
                resolve: null,
                reject: null,
                promise: Promise.resolve(!0),
                source: Vs,
                restoredState: null,
                currentSnapshot: n.routerState.snapshot,
                targetSnapshot: null,
                currentRouterState: n.routerState,
                targetRouterState: null,
                guards: { canActivateChecks: [], canDeactivateChecks: [] },
                guardsResult: null,
              })),
              this.transitions.pipe(
                en((r) => 0 !== r.id),
                J((r) => ({
                  ...r,
                  extractedUrl: n.urlHandlingStrategy.extract(r.rawUrl),
                })),
                Gt((r) => {
                  let i = !1,
                    o = !1;
                  return B(r).pipe(
                    _t((s) => {
                      this.currentNavigation = {
                        id: s.id,
                        initialUrl: s.rawUrl,
                        extractedUrl: s.extractedUrl,
                        trigger: s.source,
                        extras: s.extras,
                        previousNavigation: this.lastSuccessfulNavigation
                          ? {
                              ...this.lastSuccessfulNavigation,
                              previousNavigation: null,
                            }
                          : null,
                      };
                    }),
                    Gt((s) => {
                      const a = n.browserUrlTree.toString(),
                        l =
                          !n.navigated ||
                          s.extractedUrl.toString() !== a ||
                          a !== n.currentUrlTree.toString();
                      if (
                        !l &&
                        "reload" !==
                          (s.extras.onSameUrlNavigation ??
                            n.onSameUrlNavigation)
                      ) {
                        const c = "";
                        return (
                          this.events.next(
                            new Bs(s.id, n.serializeUrl(r.rawUrl), c, 0)
                          ),
                          (n.rawUrlTree = s.rawUrl),
                          s.resolve(null),
                          sn
                        );
                      }
                      if (n.urlHandlingStrategy.shouldProcessUrl(s.rawUrl))
                        return (
                          p0(s.source) && (n.browserUrlTree = s.extractedUrl),
                          B(s).pipe(
                            Gt((c) => {
                              const d = this.transitions?.getValue();
                              return (
                                this.events.next(
                                  new gp(
                                    c.id,
                                    this.urlSerializer.serialize(
                                      c.extractedUrl
                                    ),
                                    c.source,
                                    c.restoredState
                                  )
                                ),
                                d !== this.transitions?.getValue()
                                  ? sn
                                  : Promise.resolve(c)
                              );
                            }),
                            (function zj(t, e, n, r, i, o) {
                              return Ge((s) =>
                                (function jj(
                                  t,
                                  e,
                                  n,
                                  r,
                                  i,
                                  o,
                                  s = "emptyOnly"
                                ) {
                                  return new Hj(
                                    t,
                                    e,
                                    n,
                                    r,
                                    i,
                                    s,
                                    o
                                  ).recognize();
                                })(t, e, n, r, s.extractedUrl, i, o).pipe(
                                  J(({ state: a, tree: l }) => ({
                                    ...s,
                                    targetSnapshot: a,
                                    urlAfterRedirects: l,
                                  }))
                                )
                              );
                            })(
                              this.environmentInjector,
                              this.configLoader,
                              this.rootComponentType,
                              n.config,
                              this.urlSerializer,
                              n.paramsInheritanceStrategy
                            ),
                            _t((c) => {
                              if (
                                ((r.targetSnapshot = c.targetSnapshot),
                                (r.urlAfterRedirects = c.urlAfterRedirects),
                                (this.currentNavigation = {
                                  ...this.currentNavigation,
                                  finalUrl: c.urlAfterRedirects,
                                }),
                                "eager" === n.urlUpdateStrategy)
                              ) {
                                if (!c.extras.skipLocationChange) {
                                  const f = n.urlHandlingStrategy.merge(
                                    c.urlAfterRedirects,
                                    c.rawUrl
                                  );
                                  n.setBrowserUrl(f, c);
                                }
                                n.browserUrlTree = c.urlAfterRedirects;
                              }
                              const d = new VB(
                                c.id,
                                this.urlSerializer.serialize(c.extractedUrl),
                                this.urlSerializer.serialize(
                                  c.urlAfterRedirects
                                ),
                                c.targetSnapshot
                              );
                              this.events.next(d);
                            })
                          )
                        );
                      if (
                        l &&
                        n.urlHandlingStrategy.shouldProcessUrl(n.rawUrlTree)
                      ) {
                        const {
                            id: c,
                            extractedUrl: d,
                            source: f,
                            restoredState: h,
                            extras: p,
                          } = s,
                          g = new gp(c, this.urlSerializer.serialize(d), f, h);
                        this.events.next(g);
                        const m = GE(0, this.rootComponentType).snapshot;
                        return B(
                          (r = {
                            ...s,
                            targetSnapshot: m,
                            urlAfterRedirects: d,
                            extras: {
                              ...p,
                              skipLocationChange: !1,
                              replaceUrl: !1,
                            },
                          })
                        );
                      }
                      {
                        const c = "";
                        return (
                          this.events.next(
                            new Bs(s.id, n.serializeUrl(r.extractedUrl), c, 1)
                          ),
                          (n.rawUrlTree = s.rawUrl),
                          s.resolve(null),
                          sn
                        );
                      }
                    }),
                    _t((s) => {
                      const a = new BB(
                        s.id,
                        this.urlSerializer.serialize(s.extractedUrl),
                        this.urlSerializer.serialize(s.urlAfterRedirects),
                        s.targetSnapshot
                      );
                      this.events.next(a);
                    }),
                    J(
                      (s) =>
                        (r = {
                          ...s,
                          guards: uj(
                            s.targetSnapshot,
                            s.currentSnapshot,
                            this.rootContexts
                          ),
                        })
                    ),
                    (function Cj(t, e) {
                      return Ge((n) => {
                        const {
                          targetSnapshot: r,
                          currentSnapshot: i,
                          guards: {
                            canActivateChecks: o,
                            canDeactivateChecks: s,
                          },
                        } = n;
                        return 0 === s.length && 0 === o.length
                          ? B({ ...n, guardsResult: !0 })
                          : (function Dj(t, e, n, r) {
                              return We(t).pipe(
                                Ge((i) =>
                                  (function Tj(t, e, n, r, i) {
                                    const o =
                                      e && e.routeConfig
                                        ? e.routeConfig.canDeactivate
                                        : null;
                                    return o && 0 !== o.length
                                      ? B(
                                          o.map((a) => {
                                            const l = $s(e) ?? i,
                                              u = po(a, l);
                                            return Tr(
                                              (function yj(t) {
                                                return t && qs(t.canDeactivate);
                                              })(u)
                                                ? u.canDeactivate(t, e, n, r)
                                                : l.runInContext(() =>
                                                    u(t, e, n, r)
                                                  )
                                            ).pipe(ti());
                                          })
                                        ).pipe(go())
                                      : B(!0);
                                  })(i.component, i.route, n, e, r)
                                ),
                                ti((i) => !0 !== i, !0)
                              );
                            })(s, r, i, t).pipe(
                              Ge((a) =>
                                a &&
                                (function hj(t) {
                                  return "boolean" == typeof t;
                                })(a)
                                  ? (function wj(t, e, n, r) {
                                      return We(e).pipe(
                                        uo((i) =>
                                          ap(
                                            (function Ej(t, e) {
                                              return (
                                                null !== t && e && e(new qB(t)),
                                                B(!0)
                                              );
                                            })(i.route.parent, r),
                                            (function bj(t, e) {
                                              return (
                                                null !== t && e && e(new WB(t)),
                                                B(!0)
                                              );
                                            })(i.route, r),
                                            (function Mj(t, e, n) {
                                              const r = e[e.length - 1],
                                                o = e
                                                  .slice(0, e.length - 1)
                                                  .reverse()
                                                  .map((s) =>
                                                    (function cj(t) {
                                                      const e = t.routeConfig
                                                        ? t.routeConfig
                                                            .canActivateChild
                                                        : null;
                                                      return e && 0 !== e.length
                                                        ? { node: t, guards: e }
                                                        : null;
                                                    })(s)
                                                  )
                                                  .filter((s) => null !== s)
                                                  .map((s) =>
                                                    CE(() =>
                                                      B(
                                                        s.guards.map((l) => {
                                                          const u =
                                                              $s(s.node) ?? n,
                                                            c = po(l, u);
                                                          return Tr(
                                                            (function mj(t) {
                                                              return (
                                                                t &&
                                                                qs(
                                                                  t.canActivateChild
                                                                )
                                                              );
                                                            })(c)
                                                              ? c.canActivateChild(
                                                                  r,
                                                                  t
                                                                )
                                                              : u.runInContext(
                                                                  () => c(r, t)
                                                                )
                                                          ).pipe(ti());
                                                        })
                                                      ).pipe(go())
                                                    )
                                                  );
                                              return B(o).pipe(go());
                                            })(t, i.path, n),
                                            (function Sj(t, e, n) {
                                              const r = e.routeConfig
                                                ? e.routeConfig.canActivate
                                                : null;
                                              if (!r || 0 === r.length)
                                                return B(!0);
                                              const i = r.map((o) =>
                                                CE(() => {
                                                  const s = $s(e) ?? n,
                                                    a = po(o, s);
                                                  return Tr(
                                                    (function gj(t) {
                                                      return (
                                                        t && qs(t.canActivate)
                                                      );
                                                    })(a)
                                                      ? a.canActivate(e, t)
                                                      : s.runInContext(() =>
                                                          a(e, t)
                                                        )
                                                  ).pipe(ti());
                                                })
                                              );
                                              return B(i).pipe(go());
                                            })(t, i.route, n)
                                          )
                                        ),
                                        ti((i) => !0 !== i, !0)
                                      );
                                    })(r, o, t, e)
                                  : B(a)
                              ),
                              J((a) => ({ ...n, guardsResult: a }))
                            );
                      });
                    })(this.environmentInjector, (s) => this.events.next(s)),
                    _t((s) => {
                      if (
                        ((r.guardsResult = s.guardsResult), ri(s.guardsResult))
                      )
                        throw YE(0, s.guardsResult);
                      const a = new jB(
                        s.id,
                        this.urlSerializer.serialize(s.extractedUrl),
                        this.urlSerializer.serialize(s.urlAfterRedirects),
                        s.targetSnapshot,
                        !!s.guardsResult
                      );
                      this.events.next(a);
                    }),
                    en(
                      (s) =>
                        !!s.guardsResult ||
                        (n.restoreHistory(s),
                        this.cancelNavigationTransition(s, "", 3),
                        !1)
                    ),
                    Mp((s) => {
                      if (s.guards.canActivateChecks.length)
                        return B(s).pipe(
                          _t((a) => {
                            const l = new HB(
                              a.id,
                              this.urlSerializer.serialize(a.extractedUrl),
                              this.urlSerializer.serialize(a.urlAfterRedirects),
                              a.targetSnapshot
                            );
                            this.events.next(l);
                          }),
                          Gt((a) => {
                            let l = !1;
                            return B(a).pipe(
                              (function qj(t, e) {
                                return Ge((n) => {
                                  const {
                                    targetSnapshot: r,
                                    guards: { canActivateChecks: i },
                                  } = n;
                                  if (!i.length) return B(n);
                                  let o = 0;
                                  return We(i).pipe(
                                    uo((s) =>
                                      (function Gj(t, e, n, r) {
                                        const i = t.routeConfig,
                                          o = t._resolve;
                                        return (
                                          void 0 !== i?.title &&
                                            !f0(i) &&
                                            (o[Ns] = i.title),
                                          (function Wj(t, e, n, r) {
                                            const i = (function Kj(t) {
                                              return [
                                                ...Object.keys(t),
                                                ...Object.getOwnPropertySymbols(
                                                  t
                                                ),
                                              ];
                                            })(t);
                                            if (0 === i.length) return B({});
                                            const o = {};
                                            return We(i).pipe(
                                              Ge((s) =>
                                                (function Qj(t, e, n, r) {
                                                  const i = $s(e) ?? r,
                                                    o = po(t, i);
                                                  return Tr(
                                                    o.resolve
                                                      ? o.resolve(e, n)
                                                      : i.runInContext(() =>
                                                          o(e, n)
                                                        )
                                                  );
                                                })(t[s], e, n, r).pipe(
                                                  ti(),
                                                  _t((a) => {
                                                    o[s] = a;
                                                  })
                                                )
                                              ),
                                              up(1),
                                              (function uB(t) {
                                                return J(() => t);
                                              })(o),
                                              Mr((s) => (r0(s) ? sn : lo(s)))
                                            );
                                          })(o, t, e, r).pipe(
                                            J(
                                              (s) => (
                                                (t._resolvedData = s),
                                                (t.data = WE(t, n).resolve),
                                                i &&
                                                  f0(i) &&
                                                  (t.data[Ns] = i.title),
                                                null
                                              )
                                            )
                                          )
                                        );
                                      })(s.route, r, t, e)
                                    ),
                                    _t(() => o++),
                                    up(1),
                                    Ge((s) => (o === i.length ? B(n) : sn))
                                  );
                                });
                              })(
                                n.paramsInheritanceStrategy,
                                this.environmentInjector
                              ),
                              _t({
                                next: () => (l = !0),
                                complete: () => {
                                  l ||
                                    (n.restoreHistory(a),
                                    this.cancelNavigationTransition(a, "", 2));
                                },
                              })
                            );
                          }),
                          _t((a) => {
                            const l = new $B(
                              a.id,
                              this.urlSerializer.serialize(a.extractedUrl),
                              this.urlSerializer.serialize(a.urlAfterRedirects),
                              a.targetSnapshot
                            );
                            this.events.next(l);
                          })
                        );
                    }),
                    Mp((s) => {
                      const a = (l) => {
                        const u = [];
                        l.routeConfig?.loadComponent &&
                          !l.routeConfig._loadedComponent &&
                          u.push(
                            this.configLoader.loadComponent(l.routeConfig).pipe(
                              _t((c) => {
                                l.component = c;
                              }),
                              J(() => {})
                            )
                          );
                        for (const c of l.children) u.push(...a(c));
                        return u;
                      };
                      return sp(a(s.targetSnapshot.root)).pipe(du(), ei(1));
                    }),
                    Mp(() => this.afterPreactivation()),
                    J((s) => {
                      const a = (function JB(t, e, n) {
                        const r = Hs(t, e._root, n ? n._root : void 0);
                        return new qE(r, e);
                      })(
                        n.routeReuseStrategy,
                        s.targetSnapshot,
                        s.currentRouterState
                      );
                      return (r = { ...s, targetRouterState: a });
                    }),
                    _t((s) => {
                      (n.currentUrlTree = s.urlAfterRedirects),
                        (n.rawUrlTree = n.urlHandlingStrategy.merge(
                          s.urlAfterRedirects,
                          s.rawUrl
                        )),
                        (n.routerState = s.targetRouterState),
                        "deferred" === n.urlUpdateStrategy &&
                          (s.extras.skipLocationChange ||
                            n.setBrowserUrl(n.rawUrlTree, s),
                          (n.browserUrlTree = s.urlAfterRedirects));
                    }),
                    ((t, e, n, r) =>
                      J(
                        (i) => (
                          new lj(
                            e,
                            i.targetRouterState,
                            i.currentRouterState,
                            n,
                            r
                          ).activate(t),
                          i
                        )
                      ))(
                      this.rootContexts,
                      n.routeReuseStrategy,
                      (s) => this.events.next(s),
                      this.inputBindingEnabled
                    ),
                    ei(1),
                    _t({
                      next: (s) => {
                        (i = !0),
                          (this.lastSuccessfulNavigation =
                            this.currentNavigation),
                          (n.navigated = !0),
                          this.events.next(
                            new ii(
                              s.id,
                              this.urlSerializer.serialize(s.extractedUrl),
                              this.urlSerializer.serialize(n.currentUrlTree)
                            )
                          ),
                          n.titleStrategy?.updateTitle(
                            s.targetRouterState.snapshot
                          ),
                          s.resolve(!0);
                      },
                      complete: () => {
                        i = !0;
                      },
                    }),
                    Rs(() => {
                      i || o || this.cancelNavigationTransition(r, "", 1),
                        this.currentNavigation?.id === r.id &&
                          (this.currentNavigation = null);
                    }),
                    Mr((s) => {
                      if (((o = !0), e0(s))) {
                        JE(s) || ((n.navigated = !0), n.restoreHistory(r, !0));
                        const a = new vu(
                          r.id,
                          this.urlSerializer.serialize(r.extractedUrl),
                          s.message,
                          s.cancellationCode
                        );
                        if ((this.events.next(a), JE(s))) {
                          const l = n.urlHandlingStrategy.merge(
                              s.url,
                              n.rawUrlTree
                            ),
                            u = {
                              skipLocationChange: r.extras.skipLocationChange,
                              replaceUrl:
                                "eager" === n.urlUpdateStrategy || p0(r.source),
                            };
                          n.scheduleNavigation(l, Vs, null, u, {
                            resolve: r.resolve,
                            reject: r.reject,
                            promise: r.promise,
                          });
                        } else r.resolve(!1);
                      } else {
                        n.restoreHistory(r, !0);
                        const a = new mp(
                          r.id,
                          this.urlSerializer.serialize(r.extractedUrl),
                          s,
                          r.targetSnapshot ?? void 0
                        );
                        this.events.next(a);
                        try {
                          r.resolve(n.errorHandler(s));
                        } catch (l) {
                          r.reject(l);
                        }
                      }
                      return sn;
                    })
                  );
                })
              )
            );
          }
          cancelNavigationTransition(n, r, i) {
            const o = new vu(
              n.id,
              this.urlSerializer.serialize(n.extractedUrl),
              r,
              i
            );
            this.events.next(o), n.resolve(!1);
          }
        }
        return (
          (t.ɵfac = function (n) {
            return new (n || t)();
          }),
          (t.ɵprov = T({ token: t, factory: t.ɵfac, providedIn: "root" })),
          t
        );
      })();
      function p0(t) {
        return t !== Vs;
      }
      let g0 = (() => {
          class t {
            buildTitle(n) {
              let r,
                i = n.root;
              for (; void 0 !== i; )
                (r = this.getResolvedTitleForRoute(i) ?? r),
                  (i = i.children.find((o) => o.outlet === Y));
              return r;
            }
            getResolvedTitleForRoute(n) {
              return n.data[Ns];
            }
          }
          return (
            (t.ɵfac = function (n) {
              return new (n || t)();
            }),
            (t.ɵprov = T({
              token: t,
              factory: function () {
                return E(Yj);
              },
              providedIn: "root",
            })),
            t
          );
        })(),
        Yj = (() => {
          class t extends g0 {
            constructor(n) {
              super(), (this.title = n);
            }
            updateTitle(n) {
              const r = this.buildTitle(n);
              void 0 !== r && this.title.setTitle(r);
            }
          }
          return (
            (t.ɵfac = function (n) {
              return new (n || t)(D(cE));
            }),
            (t.ɵprov = T({ token: t, factory: t.ɵfac, providedIn: "root" })),
            t
          );
        })(),
        Xj = (() => {
          class t {}
          return (
            (t.ɵfac = function (n) {
              return new (n || t)();
            }),
            (t.ɵprov = T({
              token: t,
              factory: function () {
                return E(eH);
              },
              providedIn: "root",
            })),
            t
          );
        })();
      class Jj {
        shouldDetach(e) {
          return !1;
        }
        store(e, n) {}
        shouldAttach(e) {
          return !1;
        }
        retrieve(e) {
          return null;
        }
        shouldReuseRoute(e, n) {
          return e.routeConfig === n.routeConfig;
        }
      }
      let eH = (() => {
        class t extends Jj {}
        return (
          (t.ɵfac = (function () {
            let e;
            return function (r) {
              return (e || (e = nt(t)))(r || t);
            };
          })()),
          (t.ɵprov = T({ token: t, factory: t.ɵfac, providedIn: "root" })),
          t
        );
      })();
      const Tu = new b("", { providedIn: "root", factory: () => ({}) });
      let tH = (() => {
          class t {}
          return (
            (t.ɵfac = function (n) {
              return new (n || t)();
            }),
            (t.ɵprov = T({
              token: t,
              factory: function () {
                return E(nH);
              },
              providedIn: "root",
            })),
            t
          );
        })(),
        nH = (() => {
          class t {
            shouldProcessUrl(n) {
              return !0;
            }
            extract(n) {
              return n;
            }
            merge(n, r) {
              return n;
            }
          }
          return (
            (t.ɵfac = function (n) {
              return new (n || t)();
            }),
            (t.ɵprov = T({ token: t, factory: t.ɵfac, providedIn: "root" })),
            t
          );
        })();
      var $t = (() => (
        (($t = $t || {})[($t.COMPLETE = 0)] = "COMPLETE"),
        ($t[($t.FAILED = 1)] = "FAILED"),
        ($t[($t.REDIRECTING = 2)] = "REDIRECTING"),
        $t
      ))();
      function m0(t, e) {
        t.events
          .pipe(
            en(
              (n) =>
                n instanceof ii ||
                n instanceof vu ||
                n instanceof mp ||
                n instanceof Bs
            ),
            J((n) =>
              n instanceof ii || n instanceof Bs
                ? $t.COMPLETE
                : n instanceof vu && (0 === n.code || 1 === n.code)
                ? $t.REDIRECTING
                : $t.FAILED
            ),
            en((n) => n !== $t.REDIRECTING),
            ei(1)
          )
          .subscribe(() => {
            e();
          });
      }
      function rH(t) {
        throw t;
      }
      function iH(t, e, n) {
        return e.parse("/");
      }
      const oH = {
          paths: "exact",
          fragment: "ignored",
          matrixParams: "ignored",
          queryParams: "exact",
        },
        sH = {
          paths: "subset",
          fragment: "ignored",
          matrixParams: "ignored",
          queryParams: "subset",
        };
      let dt = (() => {
          class t {
            get navigationId() {
              return this.navigationTransitions.navigationId;
            }
            get browserPageId() {
              if ("computed" === this.canceledNavigationResolution)
                return this.location.getState()?.ɵrouterPageId;
            }
            get events() {
              return this.navigationTransitions.events;
            }
            constructor() {
              (this.disposed = !1),
                (this.currentPageId = 0),
                (this.console = E(jw)),
                (this.isNgZoneEnabled = !1),
                (this.options = E(Tu, { optional: !0 }) || {}),
                (this.pendingTasks = E(zl)),
                (this.errorHandler = this.options.errorHandler || rH),
                (this.malformedUriErrorHandler =
                  this.options.malformedUriErrorHandler || iH),
                (this.navigated = !1),
                (this.lastSuccessfulId = -1),
                (this.urlHandlingStrategy = E(tH)),
                (this.routeReuseStrategy = E(Xj)),
                (this.titleStrategy = E(g0)),
                (this.onSameUrlNavigation =
                  this.options.onSameUrlNavigation || "ignore"),
                (this.paramsInheritanceStrategy =
                  this.options.paramsInheritanceStrategy || "emptyOnly"),
                (this.urlUpdateStrategy =
                  this.options.urlUpdateStrategy || "deferred"),
                (this.canceledNavigationResolution =
                  this.options.canceledNavigationResolution || "replace"),
                (this.config = E(yo, { optional: !0 })?.flat() ?? []),
                (this.navigationTransitions = E(Mu)),
                (this.urlSerializer = E(Ps)),
                (this.location = E(Oh)),
                (this.componentInputBindingEnabled = !!E(Du, { optional: !0 })),
                (this.isNgZoneEnabled =
                  E(he) instanceof he && he.isInAngularZone()),
                this.resetConfig(this.config),
                (this.currentUrlTree = new fo()),
                (this.rawUrlTree = this.currentUrlTree),
                (this.browserUrlTree = this.currentUrlTree),
                (this.routerState = GE(0, null)),
                this.navigationTransitions.setupNavigations(this).subscribe(
                  (n) => {
                    (this.lastSuccessfulId = n.id),
                      (this.currentPageId = this.browserPageId ?? 0);
                  },
                  (n) => {
                    this.console.warn(`Unhandled Navigation Error: ${n}`);
                  }
                );
            }
            resetRootComponentType(n) {
              (this.routerState.root.component = n),
                (this.navigationTransitions.rootComponentType = n);
            }
            initialNavigation() {
              if (
                (this.setUpLocationChangeListener(),
                !this.navigationTransitions.hasRequestedNavigation)
              ) {
                const n = this.location.getState();
                this.navigateToSyncWithBrowser(this.location.path(!0), Vs, n);
              }
            }
            setUpLocationChangeListener() {
              this.locationSubscription ||
                (this.locationSubscription = this.location.subscribe((n) => {
                  const r = "popstate" === n.type ? "popstate" : "hashchange";
                  "popstate" === r &&
                    setTimeout(() => {
                      this.navigateToSyncWithBrowser(n.url, r, n.state);
                    }, 0);
                }));
            }
            navigateToSyncWithBrowser(n, r, i) {
              const o = { replaceUrl: !0 },
                s = i?.navigationId ? i : null;
              if (i) {
                const l = { ...i };
                delete l.navigationId,
                  delete l.ɵrouterPageId,
                  0 !== Object.keys(l).length && (o.state = l);
              }
              const a = this.parseUrl(n);
              this.scheduleNavigation(a, r, s, o);
            }
            get url() {
              return this.serializeUrl(this.currentUrlTree);
            }
            getCurrentNavigation() {
              return this.navigationTransitions.currentNavigation;
            }
            get lastSuccessfulNavigation() {
              return this.navigationTransitions.lastSuccessfulNavigation;
            }
            resetConfig(n) {
              (this.config = n.map(bp)),
                (this.navigated = !1),
                (this.lastSuccessfulId = -1);
            }
            ngOnDestroy() {
              this.dispose();
            }
            dispose() {
              this.navigationTransitions.complete(),
                this.locationSubscription &&
                  (this.locationSubscription.unsubscribe(),
                  (this.locationSubscription = void 0)),
                (this.disposed = !0);
            }
            createUrlTree(n, r = {}) {
              const {
                  relativeTo: i,
                  queryParams: o,
                  fragment: s,
                  queryParamsHandling: a,
                  preserveFragment: l,
                } = r,
                u = l ? this.currentUrlTree.fragment : s;
              let d,
                c = null;
              switch (a) {
                case "merge":
                  c = { ...this.currentUrlTree.queryParams, ...o };
                  break;
                case "preserve":
                  c = this.currentUrlTree.queryParams;
                  break;
                default:
                  c = o || null;
              }
              null !== c && (c = this.removeEmptyProps(c));
              try {
                d = kE(i ? i.snapshot : this.routerState.snapshot.root);
              } catch {
                ("string" != typeof n[0] || !n[0].startsWith("/")) && (n = []),
                  (d = this.currentUrlTree.root);
              }
              return LE(d, n, c, u ?? null);
            }
            navigateByUrl(n, r = { skipLocationChange: !1 }) {
              const i = ri(n) ? n : this.parseUrl(n),
                o = this.urlHandlingStrategy.merge(i, this.rawUrlTree);
              return this.scheduleNavigation(o, Vs, null, r);
            }
            navigate(n, r = { skipLocationChange: !1 }) {
              return (
                (function aH(t) {
                  for (let e = 0; e < t.length; e++)
                    if (null == t[e]) throw new v(4008, !1);
                })(n),
                this.navigateByUrl(this.createUrlTree(n, r), r)
              );
            }
            serializeUrl(n) {
              return this.urlSerializer.serialize(n);
            }
            parseUrl(n) {
              let r;
              try {
                r = this.urlSerializer.parse(n);
              } catch (i) {
                r = this.malformedUriErrorHandler(i, this.urlSerializer, n);
              }
              return r;
            }
            isActive(n, r) {
              let i;
              if (
                ((i = !0 === r ? { ...oH } : !1 === r ? { ...sH } : r), ri(n))
              )
                return TE(this.currentUrlTree, n, i);
              const o = this.parseUrl(n);
              return TE(this.currentUrlTree, o, i);
            }
            removeEmptyProps(n) {
              return Object.keys(n).reduce((r, i) => {
                const o = n[i];
                return null != o && (r[i] = o), r;
              }, {});
            }
            scheduleNavigation(n, r, i, o, s) {
              if (this.disposed) return Promise.resolve(!1);
              let a, l, u;
              s
                ? ((a = s.resolve), (l = s.reject), (u = s.promise))
                : (u = new Promise((d, f) => {
                    (a = d), (l = f);
                  }));
              const c = this.pendingTasks.add();
              return (
                m0(this, () => {
                  Promise.resolve().then(() => this.pendingTasks.remove(c));
                }),
                this.navigationTransitions.handleNavigationRequest({
                  source: r,
                  restoredState: i,
                  currentUrlTree: this.currentUrlTree,
                  currentRawUrl: this.currentUrlTree,
                  rawUrl: n,
                  extras: o,
                  resolve: a,
                  reject: l,
                  promise: u,
                  currentSnapshot: this.routerState.snapshot,
                  currentRouterState: this.routerState,
                }),
                u.catch((d) => Promise.reject(d))
              );
            }
            setBrowserUrl(n, r) {
              const i = this.urlSerializer.serialize(n);
              if (
                this.location.isCurrentPathEqualTo(i) ||
                r.extras.replaceUrl
              ) {
                const s = {
                  ...r.extras.state,
                  ...this.generateNgRouterState(r.id, this.browserPageId),
                };
                this.location.replaceState(i, "", s);
              } else {
                const o = {
                  ...r.extras.state,
                  ...this.generateNgRouterState(
                    r.id,
                    (this.browserPageId ?? 0) + 1
                  ),
                };
                this.location.go(i, "", o);
              }
            }
            restoreHistory(n, r = !1) {
              if ("computed" === this.canceledNavigationResolution) {
                const o =
                  this.currentPageId -
                  (this.browserPageId ?? this.currentPageId);
                0 !== o
                  ? this.location.historyGo(o)
                  : this.currentUrlTree ===
                      this.getCurrentNavigation()?.finalUrl &&
                    0 === o &&
                    (this.resetState(n),
                    (this.browserUrlTree = n.currentUrlTree),
                    this.resetUrlToCurrentUrlTree());
              } else
                "replace" === this.canceledNavigationResolution &&
                  (r && this.resetState(n), this.resetUrlToCurrentUrlTree());
            }
            resetState(n) {
              (this.routerState = n.currentRouterState),
                (this.currentUrlTree = n.currentUrlTree),
                (this.rawUrlTree = this.urlHandlingStrategy.merge(
                  this.currentUrlTree,
                  n.rawUrl
                ));
            }
            resetUrlToCurrentUrlTree() {
              this.location.replaceState(
                this.urlSerializer.serialize(this.rawUrlTree),
                "",
                this.generateNgRouterState(
                  this.lastSuccessfulId,
                  this.currentPageId
                )
              );
            }
            generateNgRouterState(n, r) {
              return "computed" === this.canceledNavigationResolution
                ? { navigationId: n, ɵrouterPageId: r }
                : { navigationId: n };
            }
          }
          return (
            (t.ɵfac = function (n) {
              return new (n || t)();
            }),
            (t.ɵprov = T({ token: t, factory: t.ɵfac, providedIn: "root" })),
            t
          );
        })(),
        Au = (() => {
          class t {
            constructor(n, r, i, o, s, a) {
              (this.router = n),
                (this.route = r),
                (this.tabIndexAttribute = i),
                (this.renderer = o),
                (this.el = s),
                (this.locationStrategy = a),
                (this.href = null),
                (this.commands = null),
                (this.onChanges = new qe()),
                (this.preserveFragment = !1),
                (this.skipLocationChange = !1),
                (this.replaceUrl = !1);
              const l = s.nativeElement.tagName?.toLowerCase();
              (this.isAnchorElement = "a" === l || "area" === l),
                this.isAnchorElement
                  ? (this.subscription = n.events.subscribe((u) => {
                      u instanceof ii && this.updateHref();
                    }))
                  : this.setTabIndexIfNotOnNativeEl("0");
            }
            setTabIndexIfNotOnNativeEl(n) {
              null != this.tabIndexAttribute ||
                this.isAnchorElement ||
                this.applyAttributeValue("tabindex", n);
            }
            ngOnChanges(n) {
              this.isAnchorElement && this.updateHref(),
                this.onChanges.next(this);
            }
            set routerLink(n) {
              null != n
                ? ((this.commands = Array.isArray(n) ? n : [n]),
                  this.setTabIndexIfNotOnNativeEl("0"))
                : ((this.commands = null),
                  this.setTabIndexIfNotOnNativeEl(null));
            }
            onClick(n, r, i, o, s) {
              return (
                !!(
                  null === this.urlTree ||
                  (this.isAnchorElement &&
                    (0 !== n ||
                      r ||
                      i ||
                      o ||
                      s ||
                      ("string" == typeof this.target &&
                        "_self" != this.target)))
                ) ||
                (this.router.navigateByUrl(this.urlTree, {
                  skipLocationChange: this.skipLocationChange,
                  replaceUrl: this.replaceUrl,
                  state: this.state,
                }),
                !this.isAnchorElement)
              );
            }
            ngOnDestroy() {
              this.subscription?.unsubscribe();
            }
            updateHref() {
              this.href =
                null !== this.urlTree && this.locationStrategy
                  ? this.locationStrategy?.prepareExternalUrl(
                      this.router.serializeUrl(this.urlTree)
                    )
                  : null;
              const n =
                null === this.href
                  ? null
                  : (function r_(t, e, n) {
                      return (function dN(t, e) {
                        return ("src" === e &&
                          ("embed" === t ||
                            "frame" === t ||
                            "iframe" === t ||
                            "media" === t ||
                            "script" === t)) ||
                          ("href" === e && ("base" === t || "link" === t))
                          ? n_
                          : dl;
                      })(
                        e,
                        n
                      )(t);
                    })(
                      this.href,
                      this.el.nativeElement.tagName.toLowerCase(),
                      "href"
                    );
              this.applyAttributeValue("href", n);
            }
            applyAttributeValue(n, r) {
              const i = this.renderer,
                o = this.el.nativeElement;
              null !== r ? i.setAttribute(o, n, r) : i.removeAttribute(o, n);
            }
            get urlTree() {
              return null === this.commands
                ? null
                : this.router.createUrlTree(this.commands, {
                    relativeTo:
                      void 0 !== this.relativeTo ? this.relativeTo : this.route,
                    queryParams: this.queryParams,
                    fragment: this.fragment,
                    queryParamsHandling: this.queryParamsHandling,
                    preserveFragment: this.preserveFragment,
                  });
            }
          }
          return (
            (t.ɵfac = function (n) {
              return new (n || t)(
                C(dt),
                C(oi),
                (function Ga(t) {
                  return (function Nx(t, e) {
                    if ("class" === e) return t.classes;
                    if ("style" === e) return t.styles;
                    const n = t.attrs;
                    if (n) {
                      const r = n.length;
                      let i = 0;
                      for (; i < r; ) {
                        const o = n[i];
                        if (ty(o)) break;
                        if (0 === o) i += 2;
                        else if ("number" == typeof o)
                          for (i++; i < r && "string" == typeof n[i]; ) i++;
                        else {
                          if (o === e) return n[i + 1];
                          i += 2;
                        }
                      }
                    }
                    return null;
                  })(it(), t);
                })("tabindex"),
                C(Jn),
                C(Vt),
                C(Jr)
              );
            }),
            (t.ɵdir = q({
              type: t,
              selectors: [["", "routerLink", ""]],
              hostVars: 1,
              hostBindings: function (n, r) {
                1 & n &&
                  Ee("click", function (o) {
                    return r.onClick(
                      o.button,
                      o.ctrlKey,
                      o.shiftKey,
                      o.altKey,
                      o.metaKey
                    );
                  }),
                  2 & n && It("target", r.target);
              },
              inputs: {
                target: "target",
                queryParams: "queryParams",
                fragment: "fragment",
                queryParamsHandling: "queryParamsHandling",
                state: "state",
                relativeTo: "relativeTo",
                preserveFragment: ["preserveFragment", "preserveFragment", so],
                skipLocationChange: [
                  "skipLocationChange",
                  "skipLocationChange",
                  so,
                ],
                replaceUrl: ["replaceUrl", "replaceUrl", so],
                routerLink: "routerLink",
              },
              standalone: !0,
              features: [fC, Qt],
            })),
            t
          );
        })();
      class y0 {}
      let cH = (() => {
        class t {
          constructor(n, r, i, o, s) {
            (this.router = n),
              (this.injector = i),
              (this.preloadingStrategy = o),
              (this.loader = s);
          }
          setUpPreloading() {
            this.subscription = this.router.events
              .pipe(
                en((n) => n instanceof ii),
                uo(() => this.preload())
              )
              .subscribe(() => {});
          }
          preload() {
            return this.processRoutes(this.injector, this.router.config);
          }
          ngOnDestroy() {
            this.subscription && this.subscription.unsubscribe();
          }
          processRoutes(n, r) {
            const i = [];
            for (const o of r) {
              o.providers &&
                !o._injector &&
                (o._injector = Yf(o.providers, n, `Route: ${o.path}`));
              const s = o._injector ?? n,
                a = o._loadedInjector ?? s;
              ((o.loadChildren && !o._loadedRoutes && void 0 === o.canLoad) ||
                (o.loadComponent && !o._loadedComponent)) &&
                i.push(this.preloadConfig(s, o)),
                (o.children || o._loadedRoutes) &&
                  i.push(this.processRoutes(a, o.children ?? o._loadedRoutes));
            }
            return We(i).pipe(vi());
          }
          preloadConfig(n, r) {
            return this.preloadingStrategy.preload(r, () => {
              let i;
              i =
                r.loadChildren && void 0 === r.canLoad
                  ? this.loader.loadChildren(n, r)
                  : B(null);
              const o = i.pipe(
                Ge((s) =>
                  null === s
                    ? B(void 0)
                    : ((r._loadedRoutes = s.routes),
                      (r._loadedInjector = s.injector),
                      this.processRoutes(s.injector ?? n, s.routes))
                )
              );
              return r.loadComponent && !r._loadedComponent
                ? We([o, this.loader.loadComponent(r)]).pipe(vi())
                : o;
            });
          }
        }
        return (
          (t.ɵfac = function (n) {
            return new (n || t)(D(dt), D(Hw), D(Nn), D(y0), D(Tp));
          }),
          (t.ɵprov = T({ token: t, factory: t.ɵfac, providedIn: "root" })),
          t
        );
      })();
      const Ap = new b("");
      let v0 = (() => {
        class t {
          constructor(n, r, i, o, s = {}) {
            (this.urlSerializer = n),
              (this.transitions = r),
              (this.viewportScroller = i),
              (this.zone = o),
              (this.options = s),
              (this.lastId = 0),
              (this.lastSource = "imperative"),
              (this.restoredId = 0),
              (this.store = {}),
              (s.scrollPositionRestoration =
                s.scrollPositionRestoration || "disabled"),
              (s.anchorScrolling = s.anchorScrolling || "disabled");
          }
          init() {
            "disabled" !== this.options.scrollPositionRestoration &&
              this.viewportScroller.setHistoryScrollRestoration("manual"),
              (this.routerEventsSubscription = this.createScrollEvents()),
              (this.scrollEventsSubscription = this.consumeScrollEvents());
          }
          createScrollEvents() {
            return this.transitions.events.subscribe((n) => {
              n instanceof gp
                ? ((this.store[this.lastId] =
                    this.viewportScroller.getScrollPosition()),
                  (this.lastSource = n.navigationTrigger),
                  (this.restoredId = n.restoredState
                    ? n.restoredState.navigationId
                    : 0))
                : n instanceof ii
                ? ((this.lastId = n.id),
                  this.scheduleScrollEvent(
                    n,
                    this.urlSerializer.parse(n.urlAfterRedirects).fragment
                  ))
                : n instanceof Bs &&
                  0 === n.code &&
                  ((this.lastSource = void 0),
                  (this.restoredId = 0),
                  this.scheduleScrollEvent(
                    n,
                    this.urlSerializer.parse(n.url).fragment
                  ));
            });
          }
          consumeScrollEvents() {
            return this.transitions.events.subscribe((n) => {
              n instanceof UE &&
                (n.position
                  ? "top" === this.options.scrollPositionRestoration
                    ? this.viewportScroller.scrollToPosition([0, 0])
                    : "enabled" === this.options.scrollPositionRestoration &&
                      this.viewportScroller.scrollToPosition(n.position)
                  : n.anchor && "enabled" === this.options.anchorScrolling
                  ? this.viewportScroller.scrollToAnchor(n.anchor)
                  : "disabled" !== this.options.scrollPositionRestoration &&
                    this.viewportScroller.scrollToPosition([0, 0]));
            });
          }
          scheduleScrollEvent(n, r) {
            this.zone.runOutsideAngular(() => {
              setTimeout(() => {
                this.zone.run(() => {
                  this.transitions.events.next(
                    new UE(
                      n,
                      "popstate" === this.lastSource
                        ? this.store[this.restoredId]
                        : null,
                      r
                    )
                  );
                });
              }, 0);
            });
          }
          ngOnDestroy() {
            this.routerEventsSubscription?.unsubscribe(),
              this.scrollEventsSubscription?.unsubscribe();
          }
        }
        return (
          (t.ɵfac = function (n) {
            !(function j_() {
              throw new Error("invalid");
            })();
          }),
          (t.ɵprov = T({ token: t, factory: t.ɵfac })),
          t
        );
      })();
      function cr(t, e) {
        return { ɵkind: t, ɵproviders: e };
      }
      function C0() {
        const t = E(Bt);
        return (e) => {
          const n = t.get(sr);
          if (e !== n.components[0]) return;
          const r = t.get(dt),
            i = t.get(D0);
          1 === t.get(Ip) && r.initialNavigation(),
            t.get(w0, null, k.Optional)?.setUpPreloading(),
            t.get(Ap, null, k.Optional)?.init(),
            r.resetRootComponentType(n.componentTypes[0]),
            i.closed || (i.next(), i.complete(), i.unsubscribe());
        };
      }
      const D0 = new b("", { factory: () => new qe() }),
        Ip = new b("", { providedIn: "root", factory: () => 1 }),
        w0 = new b("");
      function pH(t) {
        return cr(0, [
          { provide: w0, useExisting: cH },
          { provide: y0, useExisting: t },
        ]);
      }
      const b0 = new b("ROUTER_FORROOT_GUARD"),
        mH = [
          Oh,
          { provide: Ps, useClass: cp },
          dt,
          js,
          {
            provide: oi,
            useFactory: function _0(t) {
              return t.routerState.root;
            },
            deps: [dt],
          },
          Tp,
          [],
        ];
      function yH() {
        return new Xw("Router", dt);
      }
      let xp = (() => {
        class t {
          constructor(n) {}
          static forRoot(n, r) {
            return {
              ngModule: t,
              providers: [
                mH,
                [],
                { provide: yo, multi: !0, useValue: n },
                {
                  provide: b0,
                  useFactory: DH,
                  deps: [[dt, new Qa(), new Za()]],
                },
                { provide: Tu, useValue: r || {} },
                r?.useHash
                  ? { provide: Jr, useClass: NL }
                  : { provide: Jr, useClass: Mb },
                {
                  provide: Ap,
                  useFactory: () => {
                    const t = E(ZV),
                      e = E(he),
                      n = E(Tu),
                      r = E(Mu),
                      i = E(Ps);
                    return (
                      n.scrollOffset && t.setOffset(n.scrollOffset),
                      new v0(i, r, t, e, n)
                    );
                  },
                },
                r?.preloadingStrategy
                  ? pH(r.preloadingStrategy).ɵproviders
                  : [],
                { provide: Xw, multi: !0, useFactory: yH },
                r?.initialNavigation ? wH(r) : [],
                r?.bindToComponentInputs
                  ? cr(8, [ZE, { provide: Du, useExisting: ZE }]).ɵproviders
                  : [],
                [
                  { provide: E0, useFactory: C0 },
                  { provide: wh, multi: !0, useExisting: E0 },
                ],
              ],
            };
          }
          static forChild(n) {
            return {
              ngModule: t,
              providers: [{ provide: yo, multi: !0, useValue: n }],
            };
          }
        }
        return (
          (t.ɵfac = function (n) {
            return new (n || t)(D(b0, 8));
          }),
          (t.ɵmod = Qe({ type: t })),
          (t.ɵinj = ke({})),
          t
        );
      })();
      function DH(t) {
        return "guarded";
      }
      function wH(t) {
        return [
          "disabled" === t.initialNavigation
            ? cr(3, [
                {
                  provide: hh,
                  multi: !0,
                  useFactory: () => {
                    const e = E(dt);
                    return () => {
                      e.setUpLocationChangeListener();
                    };
                  },
                },
                { provide: Ip, useValue: 2 },
              ]).ɵproviders
            : [],
          "enabledBlocking" === t.initialNavigation
            ? cr(2, [
                { provide: Ip, useValue: 0 },
                {
                  provide: hh,
                  multi: !0,
                  deps: [Bt],
                  useFactory: (e) => {
                    const n = e.get(xL, Promise.resolve());
                    return () =>
                      n.then(
                        () =>
                          new Promise((r) => {
                            const i = e.get(dt),
                              o = e.get(D0);
                            m0(i, () => {
                              r(!0);
                            }),
                              (e.get(Mu).afterPreactivation = () => (
                                r(!0), o.closed ? B(void 0) : o
                              )),
                              i.initialNavigation();
                          })
                      );
                  },
                },
              ]).ɵproviders
            : [],
        ];
      }
      const E0 = new b(""),
        Bn = Object.create(null);
      (Bn.open = "0"),
        (Bn.close = "1"),
        (Bn.ping = "2"),
        (Bn.pong = "3"),
        (Bn.message = "4"),
        (Bn.upgrade = "5"),
        (Bn.noop = "6");
      const Iu = Object.create(null);
      Object.keys(Bn).forEach((t) => {
        Iu[Bn[t]] = t;
      });
      const EH = { type: "error", data: "parser error" },
        S0 =
          "function" == typeof Blob ||
          (typeof Blob < "u" &&
            "[object BlobConstructor]" ===
              Object.prototype.toString.call(Blob)),
        M0 = "function" == typeof ArrayBuffer,
        T0 = (t) =>
          "function" == typeof ArrayBuffer.isView
            ? ArrayBuffer.isView(t)
            : t && t.buffer instanceof ArrayBuffer,
        Rp = ({ type: t, data: e }, n, r) =>
          S0 && e instanceof Blob
            ? n
              ? r(e)
              : A0(e, r)
            : M0 && (e instanceof ArrayBuffer || T0(e))
            ? n
              ? r(e)
              : A0(new Blob([e]), r)
            : r(Bn[t] + (e || "")),
        A0 = (t, e) => {
          const n = new FileReader();
          return (
            (n.onload = function () {
              const r = n.result.split(",")[1];
              e("b" + (r || ""));
            }),
            n.readAsDataURL(t)
          );
        };
      function I0(t) {
        return t instanceof Uint8Array
          ? t
          : t instanceof ArrayBuffer
          ? new Uint8Array(t)
          : new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
      }
      let Np;
      function SH(t, e) {
        return S0 && t.data instanceof Blob
          ? t.data.arrayBuffer().then(I0).then(e)
          : M0 && (t.data instanceof ArrayBuffer || T0(t.data))
          ? e(I0(t.data))
          : void Rp(t, !1, (n) => {
              Np || (Np = new TextEncoder()), e(Np.encode(n));
            });
      }
      const Gs = typeof Uint8Array > "u" ? [] : new Uint8Array(256);
      for (let t = 0; t < 64; t++)
        Gs[
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charCodeAt(
            t
          )
        ] = t;
      const TH = "function" == typeof ArrayBuffer,
        Op = (t, e) => {
          if ("string" != typeof t) return { type: "message", data: x0(t, e) };
          const n = t.charAt(0);
          return "b" === n
            ? { type: "message", data: AH(t.substring(1), e) }
            : Iu[n]
            ? t.length > 1
              ? { type: Iu[n], data: t.substring(1) }
              : { type: Iu[n] }
            : EH;
        },
        AH = (t, e) => {
          if (TH) {
            const n = ((t) => {
              let r,
                o,
                s,
                a,
                l,
                e = 0.75 * t.length,
                n = t.length,
                i = 0;
              "=" === t[t.length - 1] && (e--, "=" === t[t.length - 2] && e--);
              const u = new ArrayBuffer(e),
                c = new Uint8Array(u);
              for (r = 0; r < n; r += 4)
                (o = Gs[t.charCodeAt(r)]),
                  (s = Gs[t.charCodeAt(r + 1)]),
                  (a = Gs[t.charCodeAt(r + 2)]),
                  (l = Gs[t.charCodeAt(r + 3)]),
                  (c[i++] = (o << 2) | (s >> 4)),
                  (c[i++] = ((15 & s) << 4) | (a >> 2)),
                  (c[i++] = ((3 & a) << 6) | (63 & l));
              return u;
            })(t);
            return x0(n, e);
          }
          return { base64: !0, data: t };
        },
        x0 = (t, e) =>
          "blob" === e
            ? t instanceof Blob
              ? t
              : new Blob([t])
            : t instanceof ArrayBuffer
            ? t
            : t.buffer,
        R0 = String.fromCharCode(30);
      let Pp;
      function $e(t) {
        if (t)
          return (function NH(t) {
            for (var e in $e.prototype) t[e] = $e.prototype[e];
            return t;
          })(t);
      }
      ($e.prototype.on = $e.prototype.addEventListener =
        function (t, e) {
          return (
            (this._callbacks = this._callbacks || {}),
            (this._callbacks["$" + t] = this._callbacks["$" + t] || []).push(e),
            this
          );
        }),
        ($e.prototype.once = function (t, e) {
          function n() {
            this.off(t, n), e.apply(this, arguments);
          }
          return (n.fn = e), this.on(t, n), this;
        }),
        ($e.prototype.off =
          $e.prototype.removeListener =
          $e.prototype.removeAllListeners =
          $e.prototype.removeEventListener =
            function (t, e) {
              if (
                ((this._callbacks = this._callbacks || {}),
                0 == arguments.length)
              )
                return (this._callbacks = {}), this;
              var n = this._callbacks["$" + t];
              if (!n) return this;
              if (1 == arguments.length)
                return delete this._callbacks["$" + t], this;
              for (var r, i = 0; i < n.length; i++)
                if ((r = n[i]) === e || r.fn === e) {
                  n.splice(i, 1);
                  break;
                }
              return 0 === n.length && delete this._callbacks["$" + t], this;
            }),
        ($e.prototype.emitReserved = $e.prototype.emit =
          function (t) {
            this._callbacks = this._callbacks || {};
            for (
              var e = new Array(arguments.length - 1),
                n = this._callbacks["$" + t],
                r = 1;
              r < arguments.length;
              r++
            )
              e[r - 1] = arguments[r];
            if (n) {
              r = 0;
              for (var i = (n = n.slice(0)).length; r < i; ++r)
                n[r].apply(this, e);
            }
            return this;
          }),
        ($e.prototype.listeners = function (t) {
          return (
            (this._callbacks = this._callbacks || {}),
            this._callbacks["$" + t] || []
          );
        }),
        ($e.prototype.hasListeners = function (t) {
          return !!this.listeners(t).length;
        });
      const tn =
        typeof self < "u"
          ? self
          : typeof window < "u"
          ? window
          : Function("return this")();
      function O0(t, ...e) {
        return e.reduce(
          (n, r) => (t.hasOwnProperty(r) && (n[r] = t[r]), n),
          {}
        );
      }
      const OH = tn.setTimeout,
        PH = tn.clearTimeout;
      function xu(t, e) {
        e.useNativeTimers
          ? ((t.setTimeoutFn = OH.bind(tn)), (t.clearTimeoutFn = PH.bind(tn)))
          : ((t.setTimeoutFn = tn.setTimeout.bind(tn)),
            (t.clearTimeoutFn = tn.clearTimeout.bind(tn)));
      }
      function kH(t) {
        return "string" == typeof t
          ? (function LH(t) {
              let e = 0,
                n = 0;
              for (let r = 0, i = t.length; r < i; r++)
                (e = t.charCodeAt(r)),
                  e < 128
                    ? (n += 1)
                    : e < 2048
                    ? (n += 2)
                    : e < 55296 || e >= 57344
                    ? (n += 3)
                    : (r++, (n += 4));
              return n;
            })(t)
          : Math.ceil(1.33 * (t.byteLength || t.size));
      }
      class jH extends Error {
        constructor(e, n, r) {
          super(e),
            (this.description = n),
            (this.context = r),
            (this.type = "TransportError");
        }
      }
      class Fp extends $e {
        constructor(e) {
          super(),
            (this.writable = !1),
            xu(this, e),
            (this.opts = e),
            (this.query = e.query),
            (this.socket = e.socket);
        }
        onError(e, n, r) {
          return super.emitReserved("error", new jH(e, n, r)), this;
        }
        open() {
          return (this.readyState = "opening"), this.doOpen(), this;
        }
        close() {
          return (
            ("opening" === this.readyState || "open" === this.readyState) &&
              (this.doClose(), this.onClose()),
            this
          );
        }
        send(e) {
          "open" === this.readyState && this.write(e);
        }
        onOpen() {
          (this.readyState = "open"),
            (this.writable = !0),
            super.emitReserved("open");
        }
        onData(e) {
          const n = Op(e, this.socket.binaryType);
          this.onPacket(n);
        }
        onPacket(e) {
          super.emitReserved("packet", e);
        }
        onClose(e) {
          (this.readyState = "closed"), super.emitReserved("close", e);
        }
        pause(e) {}
        createUri(e, n = {}) {
          return (
            e +
            "://" +
            this._hostname() +
            this._port() +
            this.opts.path +
            this._query(n)
          );
        }
        _hostname() {
          const e = this.opts.hostname;
          return -1 === e.indexOf(":") ? e : "[" + e + "]";
        }
        _port() {
          return this.opts.port &&
            ((this.opts.secure && +(443 !== this.opts.port)) ||
              (!this.opts.secure && 80 !== Number(this.opts.port)))
            ? ":" + this.opts.port
            : "";
        }
        _query(e) {
          const n = (function VH(t) {
            let e = "";
            for (let n in t)
              t.hasOwnProperty(n) &&
                (e.length && (e += "&"),
                (e += encodeURIComponent(n) + "=" + encodeURIComponent(t[n])));
            return e;
          })(e);
          return n.length ? "?" + n : "";
        }
      }
      const P0 =
          "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_".split(
            ""
          ),
        Ru = 64,
        F0 = {};
      let L0,
        k0 = 0,
        Ar = 0;
      function V0(t) {
        let e = "";
        do {
          (e = P0[t % Ru] + e), (t = Math.floor(t / Ru));
        } while (t > 0);
        return e;
      }
      function B0() {
        const t = V0(+new Date());
        return t !== L0 ? ((k0 = 0), (L0 = t)) : t + "." + V0(k0++);
      }
      for (; Ar < Ru; Ar++) F0[P0[Ar]] = Ar;
      let j0 = !1;
      try {
        j0 =
          typeof XMLHttpRequest < "u" &&
          "withCredentials" in new XMLHttpRequest();
      } catch {}
      const HH = j0;
      function H0(t) {
        const e = t.xdomain;
        try {
          if (typeof XMLHttpRequest < "u" && (!e || HH))
            return new XMLHttpRequest();
        } catch {}
        if (!e)
          try {
            return new tn[["Active"].concat("Object").join("X")](
              "Microsoft.XMLHTTP"
            );
          } catch {}
      }
      function $H() {}
      const UH = null != new H0({ xdomain: !1 }).responseType;
      let Nu = (() => {
        class t extends $e {
          constructor(n, r) {
            super(),
              xu(this, r),
              (this.opts = r),
              (this.method = r.method || "GET"),
              (this.uri = n),
              (this.data = void 0 !== r.data ? r.data : null),
              this.create();
          }
          create() {
            var n;
            const r = O0(
              this.opts,
              "agent",
              "pfx",
              "key",
              "passphrase",
              "cert",
              "ca",
              "ciphers",
              "rejectUnauthorized",
              "autoUnref"
            );
            r.xdomain = !!this.opts.xd;
            const i = (this.xhr = new H0(r));
            try {
              i.open(this.method, this.uri, !0);
              try {
                if (this.opts.extraHeaders) {
                  i.setDisableHeaderCheck && i.setDisableHeaderCheck(!0);
                  for (let o in this.opts.extraHeaders)
                    this.opts.extraHeaders.hasOwnProperty(o) &&
                      i.setRequestHeader(o, this.opts.extraHeaders[o]);
                }
              } catch {}
              if ("POST" === this.method)
                try {
                  i.setRequestHeader(
                    "Content-type",
                    "text/plain;charset=UTF-8"
                  );
                } catch {}
              try {
                i.setRequestHeader("Accept", "*/*");
              } catch {}
              null === (n = this.opts.cookieJar) ||
                void 0 === n ||
                n.addCookies(i),
                "withCredentials" in i &&
                  (i.withCredentials = this.opts.withCredentials),
                this.opts.requestTimeout &&
                  (i.timeout = this.opts.requestTimeout),
                (i.onreadystatechange = () => {
                  var o;
                  3 === i.readyState &&
                    (null === (o = this.opts.cookieJar) ||
                      void 0 === o ||
                      o.parseCookies(i)),
                    4 === i.readyState &&
                      (200 === i.status || 1223 === i.status
                        ? this.onLoad()
                        : this.setTimeoutFn(() => {
                            this.onError(
                              "number" == typeof i.status ? i.status : 0
                            );
                          }, 0));
                }),
                i.send(this.data);
            } catch (o) {
              return void this.setTimeoutFn(() => {
                this.onError(o);
              }, 0);
            }
            typeof document < "u" &&
              ((this.index = t.requestsCount++),
              (t.requests[this.index] = this));
          }
          onError(n) {
            this.emitReserved("error", n, this.xhr), this.cleanup(!0);
          }
          cleanup(n) {
            if (!(typeof this.xhr > "u" || null === this.xhr)) {
              if (((this.xhr.onreadystatechange = $H), n))
                try {
                  this.xhr.abort();
                } catch {}
              typeof document < "u" && delete t.requests[this.index],
                (this.xhr = null);
            }
          }
          onLoad() {
            const n = this.xhr.responseText;
            null !== n &&
              (this.emitReserved("data", n),
              this.emitReserved("success"),
              this.cleanup());
          }
          abort() {
            this.cleanup();
          }
        }
        return (t.requestsCount = 0), (t.requests = {}), t;
      })();
      function $0() {
        for (let t in Nu.requests)
          Nu.requests.hasOwnProperty(t) && Nu.requests[t].abort();
      }
      typeof document < "u" &&
        ("function" == typeof attachEvent
          ? attachEvent("onunload", $0)
          : "function" == typeof addEventListener &&
            addEventListener(
              "onpagehide" in tn ? "pagehide" : "unload",
              $0,
              !1
            ));
      const kp =
          "function" == typeof Promise && "function" == typeof Promise.resolve
            ? (e) => Promise.resolve().then(e)
            : (e, n) => n(e, 0),
        Ou = tn.WebSocket || tn.MozWebSocket,
        U0 =
          typeof navigator < "u" &&
          "string" == typeof navigator.product &&
          "reactnative" === navigator.product.toLowerCase();
      function WH(t, e) {
        return (
          "message" === t.type &&
          "string" != typeof t.data &&
          e[0] >= 48 &&
          e[0] <= 54
        );
      }
      const QH = {
          websocket: class GH extends Fp {
            constructor(e) {
              super(e), (this.supportsBinary = !e.forceBase64);
            }
            get name() {
              return "websocket";
            }
            doOpen() {
              if (!this.check()) return;
              const e = this.uri(),
                n = this.opts.protocols,
                r = U0
                  ? {}
                  : O0(
                      this.opts,
                      "agent",
                      "perMessageDeflate",
                      "pfx",
                      "key",
                      "passphrase",
                      "cert",
                      "ca",
                      "ciphers",
                      "rejectUnauthorized",
                      "localAddress",
                      "protocolVersion",
                      "origin",
                      "maxPayload",
                      "family",
                      "checkServerIdentity"
                    );
              this.opts.extraHeaders && (r.headers = this.opts.extraHeaders);
              try {
                this.ws = U0 ? new Ou(e, n, r) : n ? new Ou(e, n) : new Ou(e);
              } catch (i) {
                return this.emitReserved("error", i);
              }
              (this.ws.binaryType = this.socket.binaryType || "arraybuffer"),
                this.addEventListeners();
            }
            addEventListeners() {
              (this.ws.onopen = () => {
                this.opts.autoUnref && this.ws._socket.unref(), this.onOpen();
              }),
                (this.ws.onclose = (e) =>
                  this.onClose({
                    description: "websocket connection closed",
                    context: e,
                  })),
                (this.ws.onmessage = (e) => this.onData(e.data)),
                (this.ws.onerror = (e) => this.onError("websocket error", e));
            }
            write(e) {
              this.writable = !1;
              for (let n = 0; n < e.length; n++) {
                const i = n === e.length - 1;
                Rp(e[n], this.supportsBinary, (o) => {
                  try {
                    this.ws.send(o);
                  } catch {}
                  i &&
                    kp(() => {
                      (this.writable = !0), this.emitReserved("drain");
                    }, this.setTimeoutFn);
                });
              }
            }
            doClose() {
              typeof this.ws < "u" && (this.ws.close(), (this.ws = null));
            }
            uri() {
              const e = this.opts.secure ? "wss" : "ws",
                n = this.query || {};
              return (
                this.opts.timestampRequests &&
                  (n[this.opts.timestampParam] = B0()),
                this.supportsBinary || (n.b64 = 1),
                this.createUri(e, n)
              );
            }
            check() {
              return !!Ou;
            }
          },
          webtransport: class KH extends Fp {
            get name() {
              return "webtransport";
            }
            doOpen() {
              "function" == typeof WebTransport &&
                ((this.transport = new WebTransport(
                  this.createUri("https"),
                  this.opts.transportOptions[this.name]
                )),
                this.transport.closed
                  .then(() => {
                    this.onClose();
                  })
                  .catch((e) => {
                    this.onError("webtransport error", e);
                  }),
                this.transport.ready.then(() => {
                  this.transport.createBidirectionalStream().then((e) => {
                    const n = e.readable.getReader();
                    let r;
                    this.writer = e.writable.getWriter();
                    const i = () => {
                      n.read()
                        .then(({ done: s, value: a }) => {
                          s ||
                            (r || 1 !== a.byteLength || 54 !== a[0]
                              ? (this.onPacket(
                                  (function RH(t, e, n) {
                                    return (
                                      Pp || (Pp = new TextDecoder()),
                                      Op(
                                        e || t[0] < 48 || t[0] > 54
                                          ? t
                                          : Pp.decode(t),
                                        n
                                      )
                                    );
                                  })(a, r, "arraybuffer")
                                ),
                                (r = !1))
                              : (r = !0),
                            i());
                        })
                        .catch((s) => {});
                    };
                    i();
                    const o = this.query.sid
                      ? `0{"sid":"${this.query.sid}"}`
                      : "0";
                    this.writer
                      .write(new TextEncoder().encode(o))
                      .then(() => this.onOpen());
                  });
                }));
            }
            write(e) {
              this.writable = !1;
              for (let n = 0; n < e.length; n++) {
                const r = e[n],
                  i = n === e.length - 1;
                SH(r, (o) => {
                  WH(r, o) && this.writer.write(Uint8Array.of(54)),
                    this.writer.write(o).then(() => {
                      i &&
                        kp(() => {
                          (this.writable = !0), this.emitReserved("drain");
                        }, this.setTimeoutFn);
                    });
                });
              }
            }
            doClose() {
              var e;
              null === (e = this.transport) || void 0 === e || e.close();
            }
          },
          polling: class zH extends Fp {
            constructor(e) {
              if ((super(e), (this.polling = !1), typeof location < "u")) {
                const r = "https:" === location.protocol;
                let i = location.port;
                i || (i = r ? "443" : "80"),
                  (this.xd =
                    (typeof location < "u" &&
                      e.hostname !== location.hostname) ||
                    i !== e.port);
              }
              (this.supportsBinary = UH && !(e && e.forceBase64)),
                this.opts.withCredentials && (this.cookieJar = void 0);
            }
            get name() {
              return "polling";
            }
            doOpen() {
              this.poll();
            }
            pause(e) {
              this.readyState = "pausing";
              const n = () => {
                (this.readyState = "paused"), e();
              };
              if (this.polling || !this.writable) {
                let r = 0;
                this.polling &&
                  (r++,
                  this.once("pollComplete", function () {
                    --r || n();
                  })),
                  this.writable ||
                    (r++,
                    this.once("drain", function () {
                      --r || n();
                    }));
              } else n();
            }
            poll() {
              (this.polling = !0), this.doPoll(), this.emitReserved("poll");
            }
            onData(e) {
              ((t, e) => {
                const n = t.split(R0),
                  r = [];
                for (let i = 0; i < n.length; i++) {
                  const o = Op(n[i], e);
                  if ((r.push(o), "error" === o.type)) break;
                }
                return r;
              })(e, this.socket.binaryType).forEach((r) => {
                if (
                  ("opening" === this.readyState &&
                    "open" === r.type &&
                    this.onOpen(),
                  "close" === r.type)
                )
                  return (
                    this.onClose({
                      description: "transport closed by the server",
                    }),
                    !1
                  );
                this.onPacket(r);
              }),
                "closed" !== this.readyState &&
                  ((this.polling = !1),
                  this.emitReserved("pollComplete"),
                  "open" === this.readyState && this.poll());
            }
            doClose() {
              const e = () => {
                this.write([{ type: "close" }]);
              };
              "open" === this.readyState ? e() : this.once("open", e);
            }
            write(e) {
              (this.writable = !1),
                ((t, e) => {
                  const n = t.length,
                    r = new Array(n);
                  let i = 0;
                  t.forEach((o, s) => {
                    Rp(o, !1, (a) => {
                      (r[s] = a), ++i === n && e(r.join(R0));
                    });
                  });
                })(e, (n) => {
                  this.doWrite(n, () => {
                    (this.writable = !0), this.emitReserved("drain");
                  });
                });
            }
            uri() {
              const e = this.opts.secure ? "https" : "http",
                n = this.query || {};
              return (
                !1 !== this.opts.timestampRequests &&
                  (n[this.opts.timestampParam] = B0()),
                !this.supportsBinary && !n.sid && (n.b64 = 1),
                this.createUri(e, n)
              );
            }
            request(e = {}) {
              return (
                Object.assign(
                  e,
                  { xd: this.xd, cookieJar: this.cookieJar },
                  this.opts
                ),
                new Nu(this.uri(), e)
              );
            }
            doWrite(e, n) {
              const r = this.request({ method: "POST", data: e });
              r.on("success", n),
                r.on("error", (i, o) => {
                  this.onError("xhr post error", i, o);
                });
            }
            doPoll() {
              const e = this.request();
              e.on("data", this.onData.bind(this)),
                e.on("error", (n, r) => {
                  this.onError("xhr poll error", n, r);
                }),
                (this.pollXhr = e);
            }
          },
        },
        ZH =
          /^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,
        YH = [
          "source",
          "protocol",
          "authority",
          "userInfo",
          "user",
          "password",
          "host",
          "port",
          "relative",
          "path",
          "directory",
          "file",
          "query",
          "anchor",
        ];
      function Vp(t) {
        const e = t,
          n = t.indexOf("["),
          r = t.indexOf("]");
        -1 != n &&
          -1 != r &&
          (t =
            t.substring(0, n) +
            t.substring(n, r).replace(/:/g, ";") +
            t.substring(r, t.length));
        let i = ZH.exec(t || ""),
          o = {},
          s = 14;
        for (; s--; ) o[YH[s]] = i[s] || "";
        return (
          -1 != n &&
            -1 != r &&
            ((o.source = e),
            (o.host = o.host
              .substring(1, o.host.length - 1)
              .replace(/;/g, ":")),
            (o.authority = o.authority
              .replace("[", "")
              .replace("]", "")
              .replace(/;/g, ":")),
            (o.ipv6uri = !0)),
          (o.pathNames = (function XH(t, e) {
            const r = e.replace(/\/{2,9}/g, "/").split("/");
            return (
              ("/" == e.slice(0, 1) || 0 === e.length) && r.splice(0, 1),
              "/" == e.slice(-1) && r.splice(r.length - 1, 1),
              r
            );
          })(0, o.path)),
          (o.queryKey = (function JH(t, e) {
            const n = {};
            return (
              e.replace(/(?:^|&)([^&=]*)=?([^&]*)/g, function (r, i, o) {
                i && (n[i] = o);
              }),
              n
            );
          })(0, o.query)),
          o
        );
      }
      let z0 = (() => {
        class t extends $e {
          constructor(n, r = {}) {
            super(),
              (this.writeBuffer = []),
              n && "object" == typeof n && ((r = n), (n = null)),
              n
                ? ((n = Vp(n)),
                  (r.hostname = n.host),
                  (r.secure = "https" === n.protocol || "wss" === n.protocol),
                  (r.port = n.port),
                  n.query && (r.query = n.query))
                : r.host && (r.hostname = Vp(r.host).host),
              xu(this, r),
              (this.secure =
                null != r.secure
                  ? r.secure
                  : typeof location < "u" && "https:" === location.protocol),
              r.hostname && !r.port && (r.port = this.secure ? "443" : "80"),
              (this.hostname =
                r.hostname ||
                (typeof location < "u" ? location.hostname : "localhost")),
              (this.port =
                r.port ||
                (typeof location < "u" && location.port
                  ? location.port
                  : this.secure
                  ? "443"
                  : "80")),
              (this.transports = r.transports || [
                "polling",
                "websocket",
                "webtransport",
              ]),
              (this.writeBuffer = []),
              (this.prevBufferLen = 0),
              (this.opts = Object.assign(
                {
                  path: "/engine.io",
                  agent: !1,
                  withCredentials: !1,
                  upgrade: !0,
                  timestampParam: "t",
                  rememberUpgrade: !1,
                  addTrailingSlash: !0,
                  rejectUnauthorized: !0,
                  perMessageDeflate: { threshold: 1024 },
                  transportOptions: {},
                  closeOnBeforeunload: !1,
                },
                r
              )),
              (this.opts.path =
                this.opts.path.replace(/\/$/, "") +
                (this.opts.addTrailingSlash ? "/" : "")),
              "string" == typeof this.opts.query &&
                (this.opts.query = (function BH(t) {
                  let e = {},
                    n = t.split("&");
                  for (let r = 0, i = n.length; r < i; r++) {
                    let o = n[r].split("=");
                    e[decodeURIComponent(o[0])] = decodeURIComponent(o[1]);
                  }
                  return e;
                })(this.opts.query)),
              (this.id = null),
              (this.upgrades = null),
              (this.pingInterval = null),
              (this.pingTimeout = null),
              (this.pingTimeoutTimer = null),
              "function" == typeof addEventListener &&
                (this.opts.closeOnBeforeunload &&
                  ((this.beforeunloadEventListener = () => {
                    this.transport &&
                      (this.transport.removeAllListeners(),
                      this.transport.close());
                  }),
                  addEventListener(
                    "beforeunload",
                    this.beforeunloadEventListener,
                    !1
                  )),
                "localhost" !== this.hostname &&
                  ((this.offlineEventListener = () => {
                    this.onClose("transport close", {
                      description: "network connection lost",
                    });
                  }),
                  addEventListener("offline", this.offlineEventListener, !1))),
              this.open();
          }
          createTransport(n) {
            const r = Object.assign({}, this.opts.query);
            (r.EIO = 4), (r.transport = n), this.id && (r.sid = this.id);
            const i = Object.assign(
              {},
              this.opts,
              {
                query: r,
                socket: this,
                hostname: this.hostname,
                secure: this.secure,
                port: this.port,
              },
              this.opts.transportOptions[n]
            );
            return new QH[n](i);
          }
          open() {
            let n;
            if (
              this.opts.rememberUpgrade &&
              t.priorWebsocketSuccess &&
              -1 !== this.transports.indexOf("websocket")
            )
              n = "websocket";
            else {
              if (0 === this.transports.length)
                return void this.setTimeoutFn(() => {
                  this.emitReserved("error", "No transports available");
                }, 0);
              n = this.transports[0];
            }
            this.readyState = "opening";
            try {
              n = this.createTransport(n);
            } catch {
              return this.transports.shift(), void this.open();
            }
            n.open(), this.setTransport(n);
          }
          setTransport(n) {
            this.transport && this.transport.removeAllListeners(),
              (this.transport = n),
              n
                .on("drain", this.onDrain.bind(this))
                .on("packet", this.onPacket.bind(this))
                .on("error", this.onError.bind(this))
                .on("close", (r) => this.onClose("transport close", r));
          }
          probe(n) {
            let r = this.createTransport(n),
              i = !1;
            t.priorWebsocketSuccess = !1;
            const o = () => {
              i ||
                (r.send([{ type: "ping", data: "probe" }]),
                r.once("packet", (f) => {
                  if (!i)
                    if ("pong" === f.type && "probe" === f.data) {
                      if (
                        ((this.upgrading = !0),
                        this.emitReserved("upgrading", r),
                        !r)
                      )
                        return;
                      (t.priorWebsocketSuccess = "websocket" === r.name),
                        this.transport.pause(() => {
                          i ||
                            ("closed" !== this.readyState &&
                              (d(),
                              this.setTransport(r),
                              r.send([{ type: "upgrade" }]),
                              this.emitReserved("upgrade", r),
                              (r = null),
                              (this.upgrading = !1),
                              this.flush()));
                        });
                    } else {
                      const h = new Error("probe error");
                      (h.transport = r.name),
                        this.emitReserved("upgradeError", h);
                    }
                }));
            };
            function s() {
              i || ((i = !0), d(), r.close(), (r = null));
            }
            const a = (f) => {
              const h = new Error("probe error: " + f);
              (h.transport = r.name), s(), this.emitReserved("upgradeError", h);
            };
            function l() {
              a("transport closed");
            }
            function u() {
              a("socket closed");
            }
            function c(f) {
              r && f.name !== r.name && s();
            }
            const d = () => {
              r.removeListener("open", o),
                r.removeListener("error", a),
                r.removeListener("close", l),
                this.off("close", u),
                this.off("upgrading", c);
            };
            r.once("open", o),
              r.once("error", a),
              r.once("close", l),
              this.once("close", u),
              this.once("upgrading", c),
              -1 !== this.upgrades.indexOf("webtransport") &&
              "webtransport" !== n
                ? this.setTimeoutFn(() => {
                    i || r.open();
                  }, 200)
                : r.open();
          }
          onOpen() {
            if (
              ((this.readyState = "open"),
              (t.priorWebsocketSuccess = "websocket" === this.transport.name),
              this.emitReserved("open"),
              this.flush(),
              "open" === this.readyState && this.opts.upgrade)
            ) {
              let n = 0;
              const r = this.upgrades.length;
              for (; n < r; n++) this.probe(this.upgrades[n]);
            }
          }
          onPacket(n) {
            if (
              "opening" === this.readyState ||
              "open" === this.readyState ||
              "closing" === this.readyState
            )
              switch (
                (this.emitReserved("packet", n),
                this.emitReserved("heartbeat"),
                n.type)
              ) {
                case "open":
                  this.onHandshake(JSON.parse(n.data));
                  break;
                case "ping":
                  this.resetPingTimeout(),
                    this.sendPacket("pong"),
                    this.emitReserved("ping"),
                    this.emitReserved("pong");
                  break;
                case "error":
                  const r = new Error("server error");
                  (r.code = n.data), this.onError(r);
                  break;
                case "message":
                  this.emitReserved("data", n.data),
                    this.emitReserved("message", n.data);
              }
          }
          onHandshake(n) {
            this.emitReserved("handshake", n),
              (this.id = n.sid),
              (this.transport.query.sid = n.sid),
              (this.upgrades = this.filterUpgrades(n.upgrades)),
              (this.pingInterval = n.pingInterval),
              (this.pingTimeout = n.pingTimeout),
              (this.maxPayload = n.maxPayload),
              this.onOpen(),
              "closed" !== this.readyState && this.resetPingTimeout();
          }
          resetPingTimeout() {
            this.clearTimeoutFn(this.pingTimeoutTimer),
              (this.pingTimeoutTimer = this.setTimeoutFn(() => {
                this.onClose("ping timeout");
              }, this.pingInterval + this.pingTimeout)),
              this.opts.autoUnref && this.pingTimeoutTimer.unref();
          }
          onDrain() {
            this.writeBuffer.splice(0, this.prevBufferLen),
              (this.prevBufferLen = 0),
              0 === this.writeBuffer.length
                ? this.emitReserved("drain")
                : this.flush();
          }
          flush() {
            if (
              "closed" !== this.readyState &&
              this.transport.writable &&
              !this.upgrading &&
              this.writeBuffer.length
            ) {
              const n = this.getWritablePackets();
              this.transport.send(n),
                (this.prevBufferLen = n.length),
                this.emitReserved("flush");
            }
          }
          getWritablePackets() {
            if (
              !(
                this.maxPayload &&
                "polling" === this.transport.name &&
                this.writeBuffer.length > 1
              )
            )
              return this.writeBuffer;
            let r = 1;
            for (let i = 0; i < this.writeBuffer.length; i++) {
              const o = this.writeBuffer[i].data;
              if ((o && (r += kH(o)), i > 0 && r > this.maxPayload))
                return this.writeBuffer.slice(0, i);
              r += 2;
            }
            return this.writeBuffer;
          }
          write(n, r, i) {
            return this.sendPacket("message", n, r, i), this;
          }
          send(n, r, i) {
            return this.sendPacket("message", n, r, i), this;
          }
          sendPacket(n, r, i, o) {
            if (
              ("function" == typeof r && ((o = r), (r = void 0)),
              "function" == typeof i && ((o = i), (i = null)),
              "closing" === this.readyState || "closed" === this.readyState)
            )
              return;
            (i = i || {}).compress = !1 !== i.compress;
            const s = { type: n, data: r, options: i };
            this.emitReserved("packetCreate", s),
              this.writeBuffer.push(s),
              o && this.once("flush", o),
              this.flush();
          }
          close() {
            const n = () => {
                this.onClose("forced close"), this.transport.close();
              },
              r = () => {
                this.off("upgrade", r), this.off("upgradeError", r), n();
              },
              i = () => {
                this.once("upgrade", r), this.once("upgradeError", r);
              };
            return (
              ("opening" === this.readyState || "open" === this.readyState) &&
                ((this.readyState = "closing"),
                this.writeBuffer.length
                  ? this.once("drain", () => {
                      this.upgrading ? i() : n();
                    })
                  : this.upgrading
                  ? i()
                  : n()),
              this
            );
          }
          onError(n) {
            (t.priorWebsocketSuccess = !1),
              this.emitReserved("error", n),
              this.onClose("transport error", n);
          }
          onClose(n, r) {
            ("opening" === this.readyState ||
              "open" === this.readyState ||
              "closing" === this.readyState) &&
              (this.clearTimeoutFn(this.pingTimeoutTimer),
              this.transport.removeAllListeners("close"),
              this.transport.close(),
              this.transport.removeAllListeners(),
              "function" == typeof removeEventListener &&
                (removeEventListener(
                  "beforeunload",
                  this.beforeunloadEventListener,
                  !1
                ),
                removeEventListener("offline", this.offlineEventListener, !1)),
              (this.readyState = "closed"),
              (this.id = null),
              this.emitReserved("close", n, r),
              (this.writeBuffer = []),
              (this.prevBufferLen = 0));
          }
          filterUpgrades(n) {
            const r = [];
            let i = 0;
            const o = n.length;
            for (; i < o; i++) ~this.transports.indexOf(n[i]) && r.push(n[i]);
            return r;
          }
        }
        return (t.protocol = 4), t;
      })();
      const t$ = "function" == typeof ArrayBuffer,
        n$ = (t) =>
          "function" == typeof ArrayBuffer.isView
            ? ArrayBuffer.isView(t)
            : t.buffer instanceof ArrayBuffer,
        q0 = Object.prototype.toString,
        r$ =
          "function" == typeof Blob ||
          (typeof Blob < "u" && "[object BlobConstructor]" === q0.call(Blob)),
        i$ =
          "function" == typeof File ||
          (typeof File < "u" && "[object FileConstructor]" === q0.call(File));
      function Bp(t) {
        return (
          (t$ && (t instanceof ArrayBuffer || n$(t))) ||
          (r$ && t instanceof Blob) ||
          (i$ && t instanceof File)
        );
      }
      function Pu(t, e) {
        if (!t || "object" != typeof t) return !1;
        if (Array.isArray(t)) {
          for (let n = 0, r = t.length; n < r; n++) if (Pu(t[n])) return !0;
          return !1;
        }
        if (Bp(t)) return !0;
        if (t.toJSON && "function" == typeof t.toJSON && 1 === arguments.length)
          return Pu(t.toJSON(), !0);
        for (const n in t)
          if (Object.prototype.hasOwnProperty.call(t, n) && Pu(t[n])) return !0;
        return !1;
      }
      function o$(t) {
        const e = [],
          r = t;
        return (
          (r.data = jp(t.data, e)),
          (r.attachments = e.length),
          { packet: r, buffers: e }
        );
      }
      function jp(t, e) {
        if (!t) return t;
        if (Bp(t)) {
          const n = { _placeholder: !0, num: e.length };
          return e.push(t), n;
        }
        if (Array.isArray(t)) {
          const n = new Array(t.length);
          for (let r = 0; r < t.length; r++) n[r] = jp(t[r], e);
          return n;
        }
        if ("object" == typeof t && !(t instanceof Date)) {
          const n = {};
          for (const r in t)
            Object.prototype.hasOwnProperty.call(t, r) && (n[r] = jp(t[r], e));
          return n;
        }
        return t;
      }
      function s$(t, e) {
        return (t.data = Hp(t.data, e)), delete t.attachments, t;
      }
      function Hp(t, e) {
        if (!t) return t;
        if (t && !0 === t._placeholder) {
          if ("number" == typeof t.num && t.num >= 0 && t.num < e.length)
            return e[t.num];
          throw new Error("illegal attachments");
        }
        if (Array.isArray(t))
          for (let n = 0; n < t.length; n++) t[n] = Hp(t[n], e);
        else if ("object" == typeof t)
          for (const n in t)
            Object.prototype.hasOwnProperty.call(t, n) && (t[n] = Hp(t[n], e));
        return t;
      }
      const a$ = [
          "connect",
          "connect_error",
          "disconnect",
          "disconnecting",
          "newListener",
          "removeListener",
        ],
        l$ = 5;
      var V = (() => (
        ((V = V || {})[(V.CONNECT = 0)] = "CONNECT"),
        (V[(V.DISCONNECT = 1)] = "DISCONNECT"),
        (V[(V.EVENT = 2)] = "EVENT"),
        (V[(V.ACK = 3)] = "ACK"),
        (V[(V.CONNECT_ERROR = 4)] = "CONNECT_ERROR"),
        (V[(V.BINARY_EVENT = 5)] = "BINARY_EVENT"),
        (V[(V.BINARY_ACK = 6)] = "BINARY_ACK"),
        V
      ))();
      class u$ {
        constructor(e) {
          this.replacer = e;
        }
        encode(e) {
          return (e.type !== V.EVENT && e.type !== V.ACK) || !Pu(e)
            ? [this.encodeAsString(e)]
            : this.encodeAsBinary({
                type: e.type === V.EVENT ? V.BINARY_EVENT : V.BINARY_ACK,
                nsp: e.nsp,
                data: e.data,
                id: e.id,
              });
        }
        encodeAsString(e) {
          let n = "" + e.type;
          return (
            (e.type === V.BINARY_EVENT || e.type === V.BINARY_ACK) &&
              (n += e.attachments + "-"),
            e.nsp && "/" !== e.nsp && (n += e.nsp + ","),
            null != e.id && (n += e.id),
            null != e.data && (n += JSON.stringify(e.data, this.replacer)),
            n
          );
        }
        encodeAsBinary(e) {
          const n = o$(e),
            r = this.encodeAsString(n.packet),
            i = n.buffers;
          return i.unshift(r), i;
        }
      }
      function G0(t) {
        return "[object Object]" === Object.prototype.toString.call(t);
      }
      class $p extends $e {
        constructor(e) {
          super(), (this.reviver = e);
        }
        add(e) {
          let n;
          if ("string" == typeof e) {
            if (this.reconstructor)
              throw new Error(
                "got plaintext data when reconstructing a packet"
              );
            n = this.decodeString(e);
            const r = n.type === V.BINARY_EVENT;
            r || n.type === V.BINARY_ACK
              ? ((n.type = r ? V.EVENT : V.ACK),
                (this.reconstructor = new c$(n)),
                0 === n.attachments && super.emitReserved("decoded", n))
              : super.emitReserved("decoded", n);
          } else {
            if (!Bp(e) && !e.base64) throw new Error("Unknown type: " + e);
            if (!this.reconstructor)
              throw new Error(
                "got binary data when not reconstructing a packet"
              );
            (n = this.reconstructor.takeBinaryData(e)),
              n &&
                ((this.reconstructor = null), super.emitReserved("decoded", n));
          }
        }
        decodeString(e) {
          let n = 0;
          const r = { type: Number(e.charAt(0)) };
          if (void 0 === V[r.type])
            throw new Error("unknown packet type " + r.type);
          if (r.type === V.BINARY_EVENT || r.type === V.BINARY_ACK) {
            const o = n + 1;
            for (; "-" !== e.charAt(++n) && n != e.length; );
            const s = e.substring(o, n);
            if (s != Number(s) || "-" !== e.charAt(n))
              throw new Error("Illegal attachments");
            r.attachments = Number(s);
          }
          if ("/" === e.charAt(n + 1)) {
            const o = n + 1;
            for (; ++n && "," !== e.charAt(n) && n !== e.length; );
            r.nsp = e.substring(o, n);
          } else r.nsp = "/";
          const i = e.charAt(n + 1);
          if ("" !== i && Number(i) == i) {
            const o = n + 1;
            for (; ++n; ) {
              const s = e.charAt(n);
              if (null == s || Number(s) != s) {
                --n;
                break;
              }
              if (n === e.length) break;
            }
            r.id = Number(e.substring(o, n + 1));
          }
          if (e.charAt(++n)) {
            const o = this.tryParse(e.substr(n));
            if (!$p.isPayloadValid(r.type, o))
              throw new Error("invalid payload");
            r.data = o;
          }
          return r;
        }
        tryParse(e) {
          try {
            return JSON.parse(e, this.reviver);
          } catch {
            return !1;
          }
        }
        static isPayloadValid(e, n) {
          switch (e) {
            case V.CONNECT:
              return G0(n);
            case V.DISCONNECT:
              return void 0 === n;
            case V.CONNECT_ERROR:
              return "string" == typeof n || G0(n);
            case V.EVENT:
            case V.BINARY_EVENT:
              return (
                Array.isArray(n) &&
                ("number" == typeof n[0] ||
                  ("string" == typeof n[0] && -1 === a$.indexOf(n[0])))
              );
            case V.ACK:
            case V.BINARY_ACK:
              return Array.isArray(n);
          }
        }
        destroy() {
          this.reconstructor &&
            (this.reconstructor.finishedReconstruction(),
            (this.reconstructor = null));
        }
      }
      class c$ {
        constructor(e) {
          (this.packet = e), (this.buffers = []), (this.reconPack = e);
        }
        takeBinaryData(e) {
          if (
            (this.buffers.push(e),
            this.buffers.length === this.reconPack.attachments)
          ) {
            const n = s$(this.reconPack, this.buffers);
            return this.finishedReconstruction(), n;
          }
          return null;
        }
        finishedReconstruction() {
          (this.reconPack = null), (this.buffers = []);
        }
      }
      function yn(t, e, n) {
        return (
          t.on(e, n),
          function () {
            t.off(e, n);
          }
        );
      }
      const d$ = Object.freeze({
        connect: 1,
        connect_error: 1,
        disconnect: 1,
        disconnecting: 1,
        newListener: 1,
        removeListener: 1,
      });
      class W0 extends $e {
        constructor(e, n, r) {
          super(),
            (this.connected = !1),
            (this.recovered = !1),
            (this.receiveBuffer = []),
            (this.sendBuffer = []),
            (this._queue = []),
            (this._queueSeq = 0),
            (this.ids = 0),
            (this.acks = {}),
            (this.flags = {}),
            (this.io = e),
            (this.nsp = n),
            r && r.auth && (this.auth = r.auth),
            (this._opts = Object.assign({}, r)),
            this.io._autoConnect && this.open();
        }
        get disconnected() {
          return !this.connected;
        }
        subEvents() {
          if (this.subs) return;
          const e = this.io;
          this.subs = [
            yn(e, "open", this.onopen.bind(this)),
            yn(e, "packet", this.onpacket.bind(this)),
            yn(e, "error", this.onerror.bind(this)),
            yn(e, "close", this.onclose.bind(this)),
          ];
        }
        get active() {
          return !!this.subs;
        }
        connect() {
          return (
            this.connected ||
              (this.subEvents(),
              this.io._reconnecting || this.io.open(),
              "open" === this.io._readyState && this.onopen()),
            this
          );
        }
        open() {
          return this.connect();
        }
        send(...e) {
          return e.unshift("message"), this.emit.apply(this, e), this;
        }
        emit(e, ...n) {
          if (d$.hasOwnProperty(e))
            throw new Error('"' + e.toString() + '" is a reserved event name');
          if (
            (n.unshift(e),
            this._opts.retries && !this.flags.fromQueue && !this.flags.volatile)
          )
            return this._addToQueue(n), this;
          const r = { type: V.EVENT, data: n, options: {} };
          if (
            ((r.options.compress = !1 !== this.flags.compress),
            "function" == typeof n[n.length - 1])
          ) {
            const s = this.ids++,
              a = n.pop();
            this._registerAckCallback(s, a), (r.id = s);
          }
          return (
            (this.flags.volatile &&
              (!(
                this.io.engine &&
                this.io.engine.transport &&
                this.io.engine.transport.writable
              ) ||
                !this.connected)) ||
              (this.connected
                ? (this.notifyOutgoingListeners(r), this.packet(r))
                : this.sendBuffer.push(r)),
            (this.flags = {}),
            this
          );
        }
        _registerAckCallback(e, n) {
          var r;
          const i =
            null !== (r = this.flags.timeout) && void 0 !== r
              ? r
              : this._opts.ackTimeout;
          if (void 0 === i) return void (this.acks[e] = n);
          const o = this.io.setTimeoutFn(() => {
            delete this.acks[e];
            for (let s = 0; s < this.sendBuffer.length; s++)
              this.sendBuffer[s].id === e && this.sendBuffer.splice(s, 1);
            n.call(this, new Error("operation has timed out"));
          }, i);
          this.acks[e] = (...s) => {
            this.io.clearTimeoutFn(o), n.apply(this, [null, ...s]);
          };
        }
        emitWithAck(e, ...n) {
          const r =
            void 0 !== this.flags.timeout || void 0 !== this._opts.ackTimeout;
          return new Promise((i, o) => {
            n.push((s, a) => (r ? (s ? o(s) : i(a)) : i(s))),
              this.emit(e, ...n);
          });
        }
        _addToQueue(e) {
          let n;
          "function" == typeof e[e.length - 1] && (n = e.pop());
          const r = {
            id: this._queueSeq++,
            tryCount: 0,
            pending: !1,
            args: e,
            flags: Object.assign({ fromQueue: !0 }, this.flags),
          };
          e.push((i, ...o) =>
            r !== this._queue[0]
              ? void 0
              : (null !== i
                  ? r.tryCount > this._opts.retries &&
                    (this._queue.shift(), n && n(i))
                  : (this._queue.shift(), n && n(null, ...o)),
                (r.pending = !1),
                this._drainQueue())
          ),
            this._queue.push(r),
            this._drainQueue();
        }
        _drainQueue(e = !1) {
          if (!this.connected || 0 === this._queue.length) return;
          const n = this._queue[0];
          (n.pending && !e) ||
            ((n.pending = !0),
            n.tryCount++,
            (this.flags = n.flags),
            this.emit.apply(this, n.args));
        }
        packet(e) {
          (e.nsp = this.nsp), this.io._packet(e);
        }
        onopen() {
          "function" == typeof this.auth
            ? this.auth((e) => {
                this._sendConnectPacket(e);
              })
            : this._sendConnectPacket(this.auth);
        }
        _sendConnectPacket(e) {
          this.packet({
            type: V.CONNECT,
            data: this._pid
              ? Object.assign({ pid: this._pid, offset: this._lastOffset }, e)
              : e,
          });
        }
        onerror(e) {
          this.connected || this.emitReserved("connect_error", e);
        }
        onclose(e, n) {
          (this.connected = !1),
            delete this.id,
            this.emitReserved("disconnect", e, n);
        }
        onpacket(e) {
          if (e.nsp === this.nsp)
            switch (e.type) {
              case V.CONNECT:
                e.data && e.data.sid
                  ? this.onconnect(e.data.sid, e.data.pid)
                  : this.emitReserved(
                      "connect_error",
                      new Error(
                        "It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"
                      )
                    );
                break;
              case V.EVENT:
              case V.BINARY_EVENT:
                this.onevent(e);
                break;
              case V.ACK:
              case V.BINARY_ACK:
                this.onack(e);
                break;
              case V.DISCONNECT:
                this.ondisconnect();
                break;
              case V.CONNECT_ERROR:
                this.destroy();
                const r = new Error(e.data.message);
                (r.data = e.data.data), this.emitReserved("connect_error", r);
            }
        }
        onevent(e) {
          const n = e.data || [];
          null != e.id && n.push(this.ack(e.id)),
            this.connected
              ? this.emitEvent(n)
              : this.receiveBuffer.push(Object.freeze(n));
        }
        emitEvent(e) {
          if (this._anyListeners && this._anyListeners.length) {
            const n = this._anyListeners.slice();
            for (const r of n) r.apply(this, e);
          }
          super.emit.apply(this, e),
            this._pid &&
              e.length &&
              "string" == typeof e[e.length - 1] &&
              (this._lastOffset = e[e.length - 1]);
        }
        ack(e) {
          const n = this;
          let r = !1;
          return function (...i) {
            r || ((r = !0), n.packet({ type: V.ACK, id: e, data: i }));
          };
        }
        onack(e) {
          const n = this.acks[e.id];
          "function" == typeof n &&
            (n.apply(this, e.data), delete this.acks[e.id]);
        }
        onconnect(e, n) {
          (this.id = e),
            (this.recovered = n && this._pid === n),
            (this._pid = n),
            (this.connected = !0),
            this.emitBuffered(),
            this.emitReserved("connect"),
            this._drainQueue(!0);
        }
        emitBuffered() {
          this.receiveBuffer.forEach((e) => this.emitEvent(e)),
            (this.receiveBuffer = []),
            this.sendBuffer.forEach((e) => {
              this.notifyOutgoingListeners(e), this.packet(e);
            }),
            (this.sendBuffer = []);
        }
        ondisconnect() {
          this.destroy(), this.onclose("io server disconnect");
        }
        destroy() {
          this.subs && (this.subs.forEach((e) => e()), (this.subs = void 0)),
            this.io._destroy(this);
        }
        disconnect() {
          return (
            this.connected && this.packet({ type: V.DISCONNECT }),
            this.destroy(),
            this.connected && this.onclose("io client disconnect"),
            this
          );
        }
        close() {
          return this.disconnect();
        }
        compress(e) {
          return (this.flags.compress = e), this;
        }
        get volatile() {
          return (this.flags.volatile = !0), this;
        }
        timeout(e) {
          return (this.flags.timeout = e), this;
        }
        onAny(e) {
          return (
            (this._anyListeners = this._anyListeners || []),
            this._anyListeners.push(e),
            this
          );
        }
        prependAny(e) {
          return (
            (this._anyListeners = this._anyListeners || []),
            this._anyListeners.unshift(e),
            this
          );
        }
        offAny(e) {
          if (!this._anyListeners) return this;
          if (e) {
            const n = this._anyListeners;
            for (let r = 0; r < n.length; r++)
              if (e === n[r]) return n.splice(r, 1), this;
          } else this._anyListeners = [];
          return this;
        }
        listenersAny() {
          return this._anyListeners || [];
        }
        onAnyOutgoing(e) {
          return (
            (this._anyOutgoingListeners = this._anyOutgoingListeners || []),
            this._anyOutgoingListeners.push(e),
            this
          );
        }
        prependAnyOutgoing(e) {
          return (
            (this._anyOutgoingListeners = this._anyOutgoingListeners || []),
            this._anyOutgoingListeners.unshift(e),
            this
          );
        }
        offAnyOutgoing(e) {
          if (!this._anyOutgoingListeners) return this;
          if (e) {
            const n = this._anyOutgoingListeners;
            for (let r = 0; r < n.length; r++)
              if (e === n[r]) return n.splice(r, 1), this;
          } else this._anyOutgoingListeners = [];
          return this;
        }
        listenersAnyOutgoing() {
          return this._anyOutgoingListeners || [];
        }
        notifyOutgoingListeners(e) {
          if (this._anyOutgoingListeners && this._anyOutgoingListeners.length) {
            const n = this._anyOutgoingListeners.slice();
            for (const r of n) r.apply(this, e.data);
          }
        }
      }
      function _o(t) {
        (this.ms = (t = t || {}).min || 100),
          (this.max = t.max || 1e4),
          (this.factor = t.factor || 2),
          (this.jitter = t.jitter > 0 && t.jitter <= 1 ? t.jitter : 0),
          (this.attempts = 0);
      }
      (_o.prototype.duration = function () {
        var t = this.ms * Math.pow(this.factor, this.attempts++);
        if (this.jitter) {
          var e = Math.random(),
            n = Math.floor(e * this.jitter * t);
          t = 1 & Math.floor(10 * e) ? t + n : t - n;
        }
        return 0 | Math.min(t, this.max);
      }),
        (_o.prototype.reset = function () {
          this.attempts = 0;
        }),
        (_o.prototype.setMin = function (t) {
          this.ms = t;
        }),
        (_o.prototype.setMax = function (t) {
          this.max = t;
        }),
        (_o.prototype.setJitter = function (t) {
          this.jitter = t;
        });
      class Up extends $e {
        constructor(e, n) {
          var r;
          super(),
            (this.nsps = {}),
            (this.subs = []),
            e && "object" == typeof e && ((n = e), (e = void 0)),
            ((n = n || {}).path = n.path || "/socket.io"),
            (this.opts = n),
            xu(this, n),
            this.reconnection(!1 !== n.reconnection),
            this.reconnectionAttempts(n.reconnectionAttempts || 1 / 0),
            this.reconnectionDelay(n.reconnectionDelay || 1e3),
            this.reconnectionDelayMax(n.reconnectionDelayMax || 5e3),
            this.randomizationFactor(
              null !== (r = n.randomizationFactor) && void 0 !== r ? r : 0.5
            ),
            (this.backoff = new _o({
              min: this.reconnectionDelay(),
              max: this.reconnectionDelayMax(),
              jitter: this.randomizationFactor(),
            })),
            this.timeout(null == n.timeout ? 2e4 : n.timeout),
            (this._readyState = "closed"),
            (this.uri = e);
          const i = n.parser || To;
          (this.encoder = new i.Encoder()),
            (this.decoder = new i.Decoder()),
            (this._autoConnect = !1 !== n.autoConnect),
            this._autoConnect && this.open();
        }
        reconnection(e) {
          return arguments.length
            ? ((this._reconnection = !!e), this)
            : this._reconnection;
        }
        reconnectionAttempts(e) {
          return void 0 === e
            ? this._reconnectionAttempts
            : ((this._reconnectionAttempts = e), this);
        }
        reconnectionDelay(e) {
          var n;
          return void 0 === e
            ? this._reconnectionDelay
            : ((this._reconnectionDelay = e),
              null === (n = this.backoff) || void 0 === n || n.setMin(e),
              this);
        }
        randomizationFactor(e) {
          var n;
          return void 0 === e
            ? this._randomizationFactor
            : ((this._randomizationFactor = e),
              null === (n = this.backoff) || void 0 === n || n.setJitter(e),
              this);
        }
        reconnectionDelayMax(e) {
          var n;
          return void 0 === e
            ? this._reconnectionDelayMax
            : ((this._reconnectionDelayMax = e),
              null === (n = this.backoff) || void 0 === n || n.setMax(e),
              this);
        }
        timeout(e) {
          return arguments.length ? ((this._timeout = e), this) : this._timeout;
        }
        maybeReconnectOnOpen() {
          !this._reconnecting &&
            this._reconnection &&
            0 === this.backoff.attempts &&
            this.reconnect();
        }
        open(e) {
          if (~this._readyState.indexOf("open")) return this;
          this.engine = new z0(this.uri, this.opts);
          const n = this.engine,
            r = this;
          (this._readyState = "opening"), (this.skipReconnect = !1);
          const i = yn(n, "open", function () {
              r.onopen(), e && e();
            }),
            o = (a) => {
              this.cleanup(),
                (this._readyState = "closed"),
                this.emitReserved("error", a),
                e ? e(a) : this.maybeReconnectOnOpen();
            },
            s = yn(n, "error", o);
          if (!1 !== this._timeout) {
            const l = this.setTimeoutFn(() => {
              i(), o(new Error("timeout")), n.close();
            }, this._timeout);
            this.opts.autoUnref && l.unref(),
              this.subs.push(() => {
                this.clearTimeoutFn(l);
              });
          }
          return this.subs.push(i), this.subs.push(s), this;
        }
        connect(e) {
          return this.open(e);
        }
        onopen() {
          this.cleanup(),
            (this._readyState = "open"),
            this.emitReserved("open");
          const e = this.engine;
          this.subs.push(
            yn(e, "ping", this.onping.bind(this)),
            yn(e, "data", this.ondata.bind(this)),
            yn(e, "error", this.onerror.bind(this)),
            yn(e, "close", this.onclose.bind(this)),
            yn(this.decoder, "decoded", this.ondecoded.bind(this))
          );
        }
        onping() {
          this.emitReserved("ping");
        }
        ondata(e) {
          try {
            this.decoder.add(e);
          } catch (n) {
            this.onclose("parse error", n);
          }
        }
        ondecoded(e) {
          kp(() => {
            this.emitReserved("packet", e);
          }, this.setTimeoutFn);
        }
        onerror(e) {
          this.emitReserved("error", e);
        }
        socket(e, n) {
          let r = this.nsps[e];
          return (
            r
              ? this._autoConnect && !r.active && r.connect()
              : ((r = new W0(this, e, n)), (this.nsps[e] = r)),
            r
          );
        }
        _destroy(e) {
          const n = Object.keys(this.nsps);
          for (const r of n) if (this.nsps[r].active) return;
          this._close();
        }
        _packet(e) {
          const n = this.encoder.encode(e);
          for (let r = 0; r < n.length; r++) this.engine.write(n[r], e.options);
        }
        cleanup() {
          this.subs.forEach((e) => e()),
            (this.subs.length = 0),
            this.decoder.destroy();
        }
        _close() {
          (this.skipReconnect = !0),
            (this._reconnecting = !1),
            this.onclose("forced close"),
            this.engine && this.engine.close();
        }
        disconnect() {
          return this._close();
        }
        onclose(e, n) {
          this.cleanup(),
            this.backoff.reset(),
            (this._readyState = "closed"),
            this.emitReserved("close", e, n),
            this._reconnection && !this.skipReconnect && this.reconnect();
        }
        reconnect() {
          if (this._reconnecting || this.skipReconnect) return this;
          const e = this;
          if (this.backoff.attempts >= this._reconnectionAttempts)
            this.backoff.reset(),
              this.emitReserved("reconnect_failed"),
              (this._reconnecting = !1);
          else {
            const n = this.backoff.duration();
            this._reconnecting = !0;
            const r = this.setTimeoutFn(() => {
              e.skipReconnect ||
                (this.emitReserved("reconnect_attempt", e.backoff.attempts),
                !e.skipReconnect &&
                  e.open((i) => {
                    i
                      ? ((e._reconnecting = !1),
                        e.reconnect(),
                        this.emitReserved("reconnect_error", i))
                      : e.onreconnect();
                  }));
            }, n);
            this.opts.autoUnref && r.unref(),
              this.subs.push(() => {
                this.clearTimeoutFn(r);
              });
          }
        }
        onreconnect() {
          const e = this.backoff.attempts;
          (this._reconnecting = !1),
            this.backoff.reset(),
            this.emitReserved("reconnect", e);
        }
      }
      const Ws = {};
      function Co(t, e) {
        "object" == typeof t && ((e = t), (t = void 0));
        const n = (function e$(t, e = "", n) {
            let r = t;
            (n = n || (typeof location < "u" && location)),
              null == t && (t = n.protocol + "//" + n.host),
              "string" == typeof t &&
                ("/" === t.charAt(0) &&
                  (t = "/" === t.charAt(1) ? n.protocol + t : n.host + t),
                /^(https?|wss?):\/\//.test(t) ||
                  (t = typeof n < "u" ? n.protocol + "//" + t : "https://" + t),
                (r = Vp(t))),
              r.port ||
                (/^(http|ws)$/.test(r.protocol)
                  ? (r.port = "80")
                  : /^(http|ws)s$/.test(r.protocol) && (r.port = "443")),
              (r.path = r.path || "/");
            const o = -1 !== r.host.indexOf(":") ? "[" + r.host + "]" : r.host;
            return (
              (r.id = r.protocol + "://" + o + ":" + r.port + e),
              (r.href =
                r.protocol +
                "://" +
                o +
                (n && n.port === r.port ? "" : ":" + r.port)),
              r
            );
          })(t, (e = e || {}).path || "/socket.io"),
          r = n.source,
          i = n.id;
        let l;
        return (
          e.forceNew ||
          e["force new connection"] ||
          !1 === e.multiplex ||
          (Ws[i] && n.path in Ws[i].nsps)
            ? (l = new Up(r, e))
            : (Ws[i] || (Ws[i] = new Up(r, e)), (l = Ws[i])),
          n.query && !e.query && (e.query = n.queryKey),
          l.socket(n.path, e)
        );
      }
      Object.assign(Co, { Manager: Up, Socket: W0, io: Co, connect: Co });
      class Fu {}
      class ku {}
      class jn {
        constructor(e) {
          (this.normalizedNames = new Map()),
            (this.lazyUpdate = null),
            e
              ? "string" == typeof e
                ? (this.lazyInit = () => {
                    (this.headers = new Map()),
                      e.split("\n").forEach((n) => {
                        const r = n.indexOf(":");
                        if (r > 0) {
                          const i = n.slice(0, r),
                            o = i.toLowerCase(),
                            s = n.slice(r + 1).trim();
                          this.maybeSetNormalizedName(i, o),
                            this.headers.has(o)
                              ? this.headers.get(o).push(s)
                              : this.headers.set(o, [s]);
                        }
                      });
                  })
                : typeof Headers < "u" && e instanceof Headers
                ? ((this.headers = new Map()),
                  e.forEach((n, r) => {
                    this.setHeaderEntries(r, n);
                  }))
                : (this.lazyInit = () => {
                    (this.headers = new Map()),
                      Object.entries(e).forEach(([n, r]) => {
                        this.setHeaderEntries(n, r);
                      });
                  })
              : (this.headers = new Map());
        }
        has(e) {
          return this.init(), this.headers.has(e.toLowerCase());
        }
        get(e) {
          this.init();
          const n = this.headers.get(e.toLowerCase());
          return n && n.length > 0 ? n[0] : null;
        }
        keys() {
          return this.init(), Array.from(this.normalizedNames.values());
        }
        getAll(e) {
          return this.init(), this.headers.get(e.toLowerCase()) || null;
        }
        append(e, n) {
          return this.clone({ name: e, value: n, op: "a" });
        }
        set(e, n) {
          return this.clone({ name: e, value: n, op: "s" });
        }
        delete(e, n) {
          return this.clone({ name: e, value: n, op: "d" });
        }
        maybeSetNormalizedName(e, n) {
          this.normalizedNames.has(n) || this.normalizedNames.set(n, e);
        }
        init() {
          this.lazyInit &&
            (this.lazyInit instanceof jn
              ? this.copyFrom(this.lazyInit)
              : this.lazyInit(),
            (this.lazyInit = null),
            this.lazyUpdate &&
              (this.lazyUpdate.forEach((e) => this.applyUpdate(e)),
              (this.lazyUpdate = null)));
        }
        copyFrom(e) {
          e.init(),
            Array.from(e.headers.keys()).forEach((n) => {
              this.headers.set(n, e.headers.get(n)),
                this.normalizedNames.set(n, e.normalizedNames.get(n));
            });
        }
        clone(e) {
          const n = new jn();
          return (
            (n.lazyInit =
              this.lazyInit && this.lazyInit instanceof jn
                ? this.lazyInit
                : this),
            (n.lazyUpdate = (this.lazyUpdate || []).concat([e])),
            n
          );
        }
        applyUpdate(e) {
          const n = e.name.toLowerCase();
          switch (e.op) {
            case "a":
            case "s":
              let r = e.value;
              if (("string" == typeof r && (r = [r]), 0 === r.length)) return;
              this.maybeSetNormalizedName(e.name, n);
              const i = ("a" === e.op ? this.headers.get(n) : void 0) || [];
              i.push(...r), this.headers.set(n, i);
              break;
            case "d":
              const o = e.value;
              if (o) {
                let s = this.headers.get(n);
                if (!s) return;
                (s = s.filter((a) => -1 === o.indexOf(a))),
                  0 === s.length
                    ? (this.headers.delete(n), this.normalizedNames.delete(n))
                    : this.headers.set(n, s);
              } else this.headers.delete(n), this.normalizedNames.delete(n);
          }
        }
        setHeaderEntries(e, n) {
          const r = (Array.isArray(n) ? n : [n]).map((o) => o.toString()),
            i = e.toLowerCase();
          this.headers.set(i, r), this.maybeSetNormalizedName(e, i);
        }
        forEach(e) {
          this.init(),
            Array.from(this.normalizedNames.keys()).forEach((n) =>
              e(this.normalizedNames.get(n), this.headers.get(n))
            );
        }
      }
      class f$ {
        encodeKey(e) {
          return K0(e);
        }
        encodeValue(e) {
          return K0(e);
        }
        decodeKey(e) {
          return decodeURIComponent(e);
        }
        decodeValue(e) {
          return decodeURIComponent(e);
        }
      }
      const p$ = /%(\d[a-f0-9])/gi,
        g$ = {
          40: "@",
          "3A": ":",
          24: "$",
          "2C": ",",
          "3B": ";",
          "3D": "=",
          "3F": "?",
          "2F": "/",
        };
      function K0(t) {
        return encodeURIComponent(t).replace(p$, (e, n) => g$[n] ?? e);
      }
      function Lu(t) {
        return `${t}`;
      }
      class Ir {
        constructor(e = {}) {
          if (
            ((this.updates = null),
            (this.cloneFrom = null),
            (this.encoder = e.encoder || new f$()),
            e.fromString)
          ) {
            if (e.fromObject)
              throw new Error("Cannot specify both fromString and fromObject.");
            this.map = (function h$(t, e) {
              const n = new Map();
              return (
                t.length > 0 &&
                  t
                    .replace(/^\?/, "")
                    .split("&")
                    .forEach((i) => {
                      const o = i.indexOf("="),
                        [s, a] =
                          -1 == o
                            ? [e.decodeKey(i), ""]
                            : [
                                e.decodeKey(i.slice(0, o)),
                                e.decodeValue(i.slice(o + 1)),
                              ],
                        l = n.get(s) || [];
                      l.push(a), n.set(s, l);
                    }),
                n
              );
            })(e.fromString, this.encoder);
          } else
            e.fromObject
              ? ((this.map = new Map()),
                Object.keys(e.fromObject).forEach((n) => {
                  const r = e.fromObject[n],
                    i = Array.isArray(r) ? r.map(Lu) : [Lu(r)];
                  this.map.set(n, i);
                }))
              : (this.map = null);
        }
        has(e) {
          return this.init(), this.map.has(e);
        }
        get(e) {
          this.init();
          const n = this.map.get(e);
          return n ? n[0] : null;
        }
        getAll(e) {
          return this.init(), this.map.get(e) || null;
        }
        keys() {
          return this.init(), Array.from(this.map.keys());
        }
        append(e, n) {
          return this.clone({ param: e, value: n, op: "a" });
        }
        appendAll(e) {
          const n = [];
          return (
            Object.keys(e).forEach((r) => {
              const i = e[r];
              Array.isArray(i)
                ? i.forEach((o) => {
                    n.push({ param: r, value: o, op: "a" });
                  })
                : n.push({ param: r, value: i, op: "a" });
            }),
            this.clone(n)
          );
        }
        set(e, n) {
          return this.clone({ param: e, value: n, op: "s" });
        }
        delete(e, n) {
          return this.clone({ param: e, value: n, op: "d" });
        }
        toString() {
          return (
            this.init(),
            this.keys()
              .map((e) => {
                const n = this.encoder.encodeKey(e);
                return this.map
                  .get(e)
                  .map((r) => n + "=" + this.encoder.encodeValue(r))
                  .join("&");
              })
              .filter((e) => "" !== e)
              .join("&")
          );
        }
        clone(e) {
          const n = new Ir({ encoder: this.encoder });
          return (
            (n.cloneFrom = this.cloneFrom || this),
            (n.updates = (this.updates || []).concat(e)),
            n
          );
        }
        init() {
          null === this.map && (this.map = new Map()),
            null !== this.cloneFrom &&
              (this.cloneFrom.init(),
              this.cloneFrom
                .keys()
                .forEach((e) => this.map.set(e, this.cloneFrom.map.get(e))),
              this.updates.forEach((e) => {
                switch (e.op) {
                  case "a":
                  case "s":
                    const n =
                      ("a" === e.op ? this.map.get(e.param) : void 0) || [];
                    n.push(Lu(e.value)), this.map.set(e.param, n);
                    break;
                  case "d":
                    if (void 0 === e.value) {
                      this.map.delete(e.param);
                      break;
                    }
                    {
                      let r = this.map.get(e.param) || [];
                      const i = r.indexOf(Lu(e.value));
                      -1 !== i && r.splice(i, 1),
                        r.length > 0
                          ? this.map.set(e.param, r)
                          : this.map.delete(e.param);
                    }
                }
              }),
              (this.cloneFrom = this.updates = null));
        }
      }
      class m$ {
        constructor() {
          this.map = new Map();
        }
        set(e, n) {
          return this.map.set(e, n), this;
        }
        get(e) {
          return (
            this.map.has(e) || this.map.set(e, e.defaultValue()),
            this.map.get(e)
          );
        }
        delete(e) {
          return this.map.delete(e), this;
        }
        has(e) {
          return this.map.has(e);
        }
        keys() {
          return this.map.keys();
        }
      }
      function Q0(t) {
        return typeof ArrayBuffer < "u" && t instanceof ArrayBuffer;
      }
      function Z0(t) {
        return typeof Blob < "u" && t instanceof Blob;
      }
      function Y0(t) {
        return typeof FormData < "u" && t instanceof FormData;
      }
      class Ks {
        constructor(e, n, r, i) {
          let o;
          if (
            ((this.url = n),
            (this.body = null),
            (this.reportProgress = !1),
            (this.withCredentials = !1),
            (this.responseType = "json"),
            (this.method = e.toUpperCase()),
            (function y$(t) {
              switch (t) {
                case "DELETE":
                case "GET":
                case "HEAD":
                case "OPTIONS":
                case "JSONP":
                  return !1;
                default:
                  return !0;
              }
            })(this.method) || i
              ? ((this.body = void 0 !== r ? r : null), (o = i))
              : (o = r),
            o &&
              ((this.reportProgress = !!o.reportProgress),
              (this.withCredentials = !!o.withCredentials),
              o.responseType && (this.responseType = o.responseType),
              o.headers && (this.headers = o.headers),
              o.context && (this.context = o.context),
              o.params && (this.params = o.params)),
            this.headers || (this.headers = new jn()),
            this.context || (this.context = new m$()),
            this.params)
          ) {
            const s = this.params.toString();
            if (0 === s.length) this.urlWithParams = n;
            else {
              const a = n.indexOf("?");
              this.urlWithParams =
                n + (-1 === a ? "?" : a < n.length - 1 ? "&" : "") + s;
            }
          } else (this.params = new Ir()), (this.urlWithParams = n);
        }
        serializeBody() {
          return null === this.body
            ? null
            : Q0(this.body) ||
              Z0(this.body) ||
              Y0(this.body) ||
              (function v$(t) {
                return (
                  typeof URLSearchParams < "u" && t instanceof URLSearchParams
                );
              })(this.body) ||
              "string" == typeof this.body
            ? this.body
            : this.body instanceof Ir
            ? this.body.toString()
            : "object" == typeof this.body ||
              "boolean" == typeof this.body ||
              Array.isArray(this.body)
            ? JSON.stringify(this.body)
            : this.body.toString();
        }
        detectContentTypeHeader() {
          return null === this.body || Y0(this.body)
            ? null
            : Z0(this.body)
            ? this.body.type || null
            : Q0(this.body)
            ? null
            : "string" == typeof this.body
            ? "text/plain"
            : this.body instanceof Ir
            ? "application/x-www-form-urlencoded;charset=UTF-8"
            : "object" == typeof this.body ||
              "number" == typeof this.body ||
              "boolean" == typeof this.body
            ? "application/json"
            : null;
        }
        clone(e = {}) {
          const n = e.method || this.method,
            r = e.url || this.url,
            i = e.responseType || this.responseType,
            o = void 0 !== e.body ? e.body : this.body,
            s =
              void 0 !== e.withCredentials
                ? e.withCredentials
                : this.withCredentials,
            a =
              void 0 !== e.reportProgress
                ? e.reportProgress
                : this.reportProgress;
          let l = e.headers || this.headers,
            u = e.params || this.params;
          const c = e.context ?? this.context;
          return (
            void 0 !== e.setHeaders &&
              (l = Object.keys(e.setHeaders).reduce(
                (d, f) => d.set(f, e.setHeaders[f]),
                l
              )),
            e.setParams &&
              (u = Object.keys(e.setParams).reduce(
                (d, f) => d.set(f, e.setParams[f]),
                u
              )),
            new Ks(n, r, o, {
              params: u,
              headers: l,
              context: c,
              reportProgress: a,
              responseType: i,
              withCredentials: s,
            })
          );
        }
      }
      var Ue = (() => (
        ((Ue = Ue || {})[(Ue.Sent = 0)] = "Sent"),
        (Ue[(Ue.UploadProgress = 1)] = "UploadProgress"),
        (Ue[(Ue.ResponseHeader = 2)] = "ResponseHeader"),
        (Ue[(Ue.DownloadProgress = 3)] = "DownloadProgress"),
        (Ue[(Ue.Response = 4)] = "Response"),
        (Ue[(Ue.User = 5)] = "User"),
        Ue
      ))();
      class zp {
        constructor(e, n = 200, r = "OK") {
          (this.headers = e.headers || new jn()),
            (this.status = void 0 !== e.status ? e.status : n),
            (this.statusText = e.statusText || r),
            (this.url = e.url || null),
            (this.ok = this.status >= 200 && this.status < 300);
        }
      }
      class qp extends zp {
        constructor(e = {}) {
          super(e), (this.type = Ue.ResponseHeader);
        }
        clone(e = {}) {
          return new qp({
            headers: e.headers || this.headers,
            status: void 0 !== e.status ? e.status : this.status,
            statusText: e.statusText || this.statusText,
            url: e.url || this.url || void 0,
          });
        }
      }
      class Do extends zp {
        constructor(e = {}) {
          super(e),
            (this.type = Ue.Response),
            (this.body = void 0 !== e.body ? e.body : null);
        }
        clone(e = {}) {
          return new Do({
            body: void 0 !== e.body ? e.body : this.body,
            headers: e.headers || this.headers,
            status: void 0 !== e.status ? e.status : this.status,
            statusText: e.statusText || this.statusText,
            url: e.url || this.url || void 0,
          });
        }
      }
      class X0 extends zp {
        constructor(e) {
          super(e, 0, "Unknown Error"),
            (this.name = "HttpErrorResponse"),
            (this.ok = !1),
            (this.message =
              this.status >= 200 && this.status < 300
                ? `Http failure during parsing for ${e.url || "(unknown url)"}`
                : `Http failure response for ${e.url || "(unknown url)"}: ${
                    e.status
                  } ${e.statusText}`),
            (this.error = e.error || null);
        }
      }
      function Gp(t, e) {
        return {
          body: e,
          headers: t.headers,
          context: t.context,
          observe: t.observe,
          params: t.params,
          reportProgress: t.reportProgress,
          responseType: t.responseType,
          withCredentials: t.withCredentials,
        };
      }
      let Wp = (() => {
        class t {
          constructor(n) {
            this.handler = n;
          }
          request(n, r, i = {}) {
            let o;
            if (n instanceof Ks) o = n;
            else {
              let l, u;
              (l = i.headers instanceof jn ? i.headers : new jn(i.headers)),
                i.params &&
                  (u =
                    i.params instanceof Ir
                      ? i.params
                      : new Ir({ fromObject: i.params })),
                (o = new Ks(n, r, void 0 !== i.body ? i.body : null, {
                  headers: l,
                  context: i.context,
                  params: u,
                  reportProgress: i.reportProgress,
                  responseType: i.responseType || "json",
                  withCredentials: i.withCredentials,
                }));
            }
            const s = B(o).pipe(uo((l) => this.handler.handle(l)));
            if (n instanceof Ks || "events" === i.observe) return s;
            const a = s.pipe(en((l) => l instanceof Do));
            switch (i.observe || "body") {
              case "body":
                switch (o.responseType) {
                  case "arraybuffer":
                    return a.pipe(
                      J((l) => {
                        if (null !== l.body && !(l.body instanceof ArrayBuffer))
                          throw new Error("Response is not an ArrayBuffer.");
                        return l.body;
                      })
                    );
                  case "blob":
                    return a.pipe(
                      J((l) => {
                        if (null !== l.body && !(l.body instanceof Blob))
                          throw new Error("Response is not a Blob.");
                        return l.body;
                      })
                    );
                  case "text":
                    return a.pipe(
                      J((l) => {
                        if (null !== l.body && "string" != typeof l.body)
                          throw new Error("Response is not a string.");
                        return l.body;
                      })
                    );
                  default:
                    return a.pipe(J((l) => l.body));
                }
              case "response":
                return a;
              default:
                throw new Error(
                  `Unreachable: unhandled observe type ${i.observe}}`
                );
            }
          }
          delete(n, r = {}) {
            return this.request("DELETE", n, r);
          }
          get(n, r = {}) {
            return this.request("GET", n, r);
          }
          head(n, r = {}) {
            return this.request("HEAD", n, r);
          }
          jsonp(n, r) {
            return this.request("JSONP", n, {
              params: new Ir().append(r, "JSONP_CALLBACK"),
              observe: "body",
              responseType: "json",
            });
          }
          options(n, r = {}) {
            return this.request("OPTIONS", n, r);
          }
          patch(n, r, i = {}) {
            return this.request("PATCH", n, Gp(i, r));
          }
          post(n, r, i = {}) {
            return this.request("POST", n, Gp(i, r));
          }
          put(n, r, i = {}) {
            return this.request("PUT", n, Gp(i, r));
          }
        }
        return (
          (t.ɵfac = function (n) {
            return new (n || t)(D(Fu));
          }),
          (t.ɵprov = T({ token: t, factory: t.ɵfac })),
          t
        );
      })();
      function tS(t, e) {
        return e(t);
      }
      function C$(t, e) {
        return (n, r) => e.intercept(n, { handle: (i) => t(i, r) });
      }
      const nS = new b(""),
        Qs = new b(""),
        rS = new b("");
      function w$() {
        let t = null;
        return (e, n) => {
          null === t &&
            (t = (E(nS, { optional: !0 }) ?? []).reduceRight(C$, tS));
          const r = E(zl),
            i = r.add();
          return t(e, n).pipe(Rs(() => r.remove(i)));
        };
      }
      let iS = (() => {
        class t extends Fu {
          constructor(n, r) {
            super(),
              (this.backend = n),
              (this.injector = r),
              (this.chain = null),
              (this.pendingTasks = E(zl));
          }
          handle(n) {
            if (null === this.chain) {
              const i = Array.from(
                new Set([
                  ...this.injector.get(Qs),
                  ...this.injector.get(rS, []),
                ])
              );
              this.chain = i.reduceRight(
                (o, s) =>
                  (function D$(t, e, n) {
                    return (r, i) => n.runInContext(() => e(r, (o) => t(o, i)));
                  })(o, s, this.injector),
                tS
              );
            }
            const r = this.pendingTasks.add();
            return this.chain(n, (i) => this.backend.handle(i)).pipe(
              Rs(() => this.pendingTasks.remove(r))
            );
          }
        }
        return (
          (t.ɵfac = function (n) {
            return new (n || t)(D(ku), D(Nn));
          }),
          (t.ɵprov = T({ token: t, factory: t.ɵfac })),
          t
        );
      })();
      const M$ = /^\)\]\}',?\n/;
      let sS = (() => {
        class t {
          constructor(n) {
            this.xhrFactory = n;
          }
          handle(n) {
            if ("JSONP" === n.method) throw new v(-2800, !1);
            const r = this.xhrFactory;
            return (r.ɵloadImpl ? We(r.ɵloadImpl()) : B(null)).pipe(
              Gt(
                () =>
                  new pe((o) => {
                    const s = r.build();
                    if (
                      (s.open(n.method, n.urlWithParams),
                      n.withCredentials && (s.withCredentials = !0),
                      n.headers.forEach((g, m) =>
                        s.setRequestHeader(g, m.join(","))
                      ),
                      n.headers.has("Accept") ||
                        s.setRequestHeader(
                          "Accept",
                          "application/json, text/plain, */*"
                        ),
                      !n.headers.has("Content-Type"))
                    ) {
                      const g = n.detectContentTypeHeader();
                      null !== g && s.setRequestHeader("Content-Type", g);
                    }
                    if (n.responseType) {
                      const g = n.responseType.toLowerCase();
                      s.responseType = "json" !== g ? g : "text";
                    }
                    const a = n.serializeBody();
                    let l = null;
                    const u = () => {
                        if (null !== l) return l;
                        const g = s.statusText || "OK",
                          m = new jn(s.getAllResponseHeaders()),
                          _ =
                            (function T$(t) {
                              return "responseURL" in t && t.responseURL
                                ? t.responseURL
                                : /^X-Request-URL:/m.test(
                                    t.getAllResponseHeaders()
                                  )
                                ? t.getResponseHeader("X-Request-URL")
                                : null;
                            })(s) || n.url;
                        return (
                          (l = new qp({
                            headers: m,
                            status: s.status,
                            statusText: g,
                            url: _,
                          })),
                          l
                        );
                      },
                      c = () => {
                        let {
                            headers: g,
                            status: m,
                            statusText: _,
                            url: y,
                          } = u(),
                          M = null;
                        204 !== m &&
                          (M =
                            typeof s.response > "u"
                              ? s.responseText
                              : s.response),
                          0 === m && (m = M ? 200 : 0);
                        let R = m >= 200 && m < 300;
                        if ("json" === n.responseType && "string" == typeof M) {
                          const P = M;
                          M = M.replace(M$, "");
                          try {
                            M = "" !== M ? JSON.parse(M) : null;
                          } catch (ue) {
                            (M = P),
                              R && ((R = !1), (M = { error: ue, text: M }));
                          }
                        }
                        R
                          ? (o.next(
                              new Do({
                                body: M,
                                headers: g,
                                status: m,
                                statusText: _,
                                url: y || void 0,
                              })
                            ),
                            o.complete())
                          : o.error(
                              new X0({
                                error: M,
                                headers: g,
                                status: m,
                                statusText: _,
                                url: y || void 0,
                              })
                            );
                      },
                      d = (g) => {
                        const { url: m } = u(),
                          _ = new X0({
                            error: g,
                            status: s.status || 0,
                            statusText: s.statusText || "Unknown Error",
                            url: m || void 0,
                          });
                        o.error(_);
                      };
                    let f = !1;
                    const h = (g) => {
                        f || (o.next(u()), (f = !0));
                        let m = { type: Ue.DownloadProgress, loaded: g.loaded };
                        g.lengthComputable && (m.total = g.total),
                          "text" === n.responseType &&
                            s.responseText &&
                            (m.partialText = s.responseText),
                          o.next(m);
                      },
                      p = (g) => {
                        let m = { type: Ue.UploadProgress, loaded: g.loaded };
                        g.lengthComputable && (m.total = g.total), o.next(m);
                      };
                    return (
                      s.addEventListener("load", c),
                      s.addEventListener("error", d),
                      s.addEventListener("timeout", d),
                      s.addEventListener("abort", d),
                      n.reportProgress &&
                        (s.addEventListener("progress", h),
                        null !== a &&
                          s.upload &&
                          s.upload.addEventListener("progress", p)),
                      s.send(a),
                      o.next({ type: Ue.Sent }),
                      () => {
                        s.removeEventListener("error", d),
                          s.removeEventListener("abort", d),
                          s.removeEventListener("load", c),
                          s.removeEventListener("timeout", d),
                          n.reportProgress &&
                            (s.removeEventListener("progress", h),
                            null !== a &&
                              s.upload &&
                              s.upload.removeEventListener("progress", p)),
                          s.readyState !== s.DONE && s.abort();
                      }
                    );
                  })
              )
            );
          }
        }
        return (
          (t.ɵfac = function (n) {
            return new (n || t)(D(Gb));
          }),
          (t.ɵprov = T({ token: t, factory: t.ɵfac })),
          t
        );
      })();
      const Kp = new b("XSRF_ENABLED"),
        aS = new b("XSRF_COOKIE_NAME", {
          providedIn: "root",
          factory: () => "XSRF-TOKEN",
        }),
        lS = new b("XSRF_HEADER_NAME", {
          providedIn: "root",
          factory: () => "X-XSRF-TOKEN",
        });
      class uS {}
      let x$ = (() => {
        class t {
          constructor(n, r, i) {
            (this.doc = n),
              (this.platform = r),
              (this.cookieName = i),
              (this.lastCookieString = ""),
              (this.lastToken = null),
              (this.parseCount = 0);
          }
          getToken() {
            if ("server" === this.platform) return null;
            const n = this.doc.cookie || "";
            return (
              n !== this.lastCookieString &&
                (this.parseCount++,
                (this.lastToken = kb(n, this.cookieName)),
                (this.lastCookieString = n)),
              this.lastToken
            );
          }
        }
        return (
          (t.ɵfac = function (n) {
            return new (n || t)(D(Je), D(Wr), D(aS));
          }),
          (t.ɵprov = T({ token: t, factory: t.ɵfac })),
          t
        );
      })();
      function R$(t, e) {
        const n = t.url.toLowerCase();
        if (
          !E(Kp) ||
          "GET" === t.method ||
          "HEAD" === t.method ||
          n.startsWith("http://") ||
          n.startsWith("https://")
        )
          return e(t);
        const r = E(uS).getToken(),
          i = E(lS);
        return (
          null != r &&
            !t.headers.has(i) &&
            (t = t.clone({ headers: t.headers.set(i, r) })),
          e(t)
        );
      }
      var Te = (() => (
        ((Te = Te || {})[(Te.Interceptors = 0)] = "Interceptors"),
        (Te[(Te.LegacyInterceptors = 1)] = "LegacyInterceptors"),
        (Te[(Te.CustomXsrfConfiguration = 2)] = "CustomXsrfConfiguration"),
        (Te[(Te.NoXsrfProtection = 3)] = "NoXsrfProtection"),
        (Te[(Te.JsonpSupport = 4)] = "JsonpSupport"),
        (Te[(Te.RequestsMadeViaParent = 5)] = "RequestsMadeViaParent"),
        (Te[(Te.Fetch = 6)] = "Fetch"),
        Te
      ))();
      function si(t, e) {
        return { ɵkind: t, ɵproviders: e };
      }
      function N$(...t) {
        const e = [
          Wp,
          sS,
          iS,
          { provide: Fu, useExisting: iS },
          { provide: ku, useExisting: sS },
          { provide: Qs, useValue: R$, multi: !0 },
          { provide: Kp, useValue: !0 },
          { provide: uS, useClass: x$ },
        ];
        for (const n of t) e.push(...n.ɵproviders);
        return fl(e);
      }
      const cS = new b("LEGACY_INTERCEPTOR_FN");
      let P$ = (() => {
          class t {}
          return (
            (t.ɵfac = function (n) {
              return new (n || t)();
            }),
            (t.ɵmod = Qe({ type: t })),
            (t.ɵinj = ke({
              providers: [
                N$(
                  si(Te.LegacyInterceptors, [
                    { provide: cS, useFactory: w$ },
                    { provide: Qs, useExisting: cS, multi: !0 },
                  ])
                ),
              ],
            })),
            t
          );
        })(),
        ai = (() => {
          class t {
            constructor(n) {
              (this.http = n),
                (this.url = "http://localhost:5000/"),
                (this.backoRouter = "kitchen/");
            }
            fetchFoodsData() {
              return this.http.get(`${this.url}${this.backoRouter}fetchFoods`, {
                withCredentials: !0,
              });
            }
            listFoods(n, r) {
              console.log(r, n);
            }
            staffLogin(n) {
              return this.http.post(
                `${this.url}${this.backoRouter}loginStaff`,
                n,
                { withCredentials: !0 }
              );
            }
            verifyStaff() {
              return this.http.get(
                `${this.url}${this.backoRouter}verfiyStaff`,
                { withCredentials: !0 }
              );
            }
            logoutStaff() {
              return this.http.get(
                `${this.url}${this.backoRouter}logoutStaff`,
                { withCredentials: !0 }
              );
            }
            fetchOrders() {
              return this.http.get(
                `${this.url}${this.backoRouter}fetchOrders`,
                { withCredentials: !0 }
              );
            }
            updateStock(n, r) {
              return (
                console.log(n, r),
                this.http.post(
                  `${this.url}${this.backoRouter}updateStock/${n}`,
                  { key: r },
                  { withCredentials: !0 }
                )
              );
            }
            Foodiready(n) {
              return this.http.get(
                `${this.url}${this.backoRouter}readyFood/${n}`
              );
            }
            listCategory() {
              return this.http.get(
                `${this.url}${this.backoRouter}listCategory`
              );
            }
          }
          return (
            (t.ɵfac = function (n) {
              return new (n || t)(D(Wp));
            }),
            (t.ɵprov = T({ token: t, factory: t.ɵfac, providedIn: "root" })),
            t
          );
        })(),
        Qp = (() => {
          class t {
            constructor() {
              (this.resId = localStorage.getItem("resId")),
                (this.socket = Co("http://localhost:5000"));
            }
            listen(n) {
              return new pe((r) => {
                this.socket.on(n, (i) => {
                  r.next(i);
                });
              });
            }
            emit(n, r) {
              this.socket.emit(n, { data: r, resId: this.resId });
            }
          }
          return (
            (t.ɵfac = function (n) {
              return new (n || t)();
            }),
            (t.ɵprov = T({ token: t, factory: t.ɵfac, providedIn: "root" })),
            t
          );
        })();
      function j$(t, e) {
        if (1 & t) {
          const n = Qr();
          x(0, "div", 5)(1, "button", 6),
            Ee("click", function () {
              const o = Tn(n).$implicit;
              return An(Se().filterFood(o._id));
            }),
            z(2),
            N()();
        }
        if (2 & t) {
          const n = e.$implicit;
          U(2), rr(n.name);
        }
      }
      function H$(t, e) {
        if (1 & t) {
          const n = Qr();
          x(0, "section", 9)(1, "div", 10),
            Be(2, "img", 11),
            N(),
            x(3, "div", 12)(4, "h2"),
            z(5),
            N(),
            x(6, "p"),
            z(7),
            N(),
            x(8, "div", 13),
            z(9),
            N()(),
            x(10, "div", 14)(11, "div", 15)(12, "button", 6),
            Ee("click", function () {
              const o = Tn(n).$implicit;
              return An(Se(2).updateStock(o._id, 1));
            }),
            z(13, "+"),
            N()(),
            x(14, "div", 16)(15, "button", 17),
            Ee("click", function () {
              const o = Tn(n).$implicit;
              return An(Se(2).updateStock(o._id, 0));
            }),
            z(16, " - "),
            N()()()();
        }
        if (2 & t) {
          const n = e.$implicit;
          U(2),
            re("src", "http://localhost:5000/foods-images/" + n.image, dl),
            U(3),
            rr(n.name),
            U(2),
            rr(n.stock),
            U(2),
            Ht("\u20b9 ", n.price, "");
        }
      }
      function $$(t, e) {
        if (
          (1 & t && (x(0, "div", 7), ye(1, H$, 17, 4, "section", 8), N()),
          2 & t)
        ) {
          const n = e.ngIf;
          U(1), re("ngForOf", n);
        }
      }
      let U$ = (() => {
          class t {
            constructor(n, r, i) {
              (this.http = n),
                (this.kitchenService = r),
                (this._kitchenSocketService = i),
                (this.socket = Co("http://localhost:5000"));
            }
            ngOnInit() {
              this.loadFood(), this.lsitCategories();
            }
            updateStock(n, r) {
              this.kitchenService.updateStock(n, r).subscribe(
                (i) => {
                  this._kitchenSocketService.emit("listFoodsToKitchen", {}),
                    this._kitchenSocketService.emit("listFoodsandChange", {
                      id: n,
                    });
                },
                (i) => console.log(i)
              );
            }
            loadFood() {
              this._kitchenSocketService.emit("listFoodsToKitchen", {}),
                this._kitchenSocketService
                  .listen("showFoodsinKithen")
                  .subscribe(
                    (n) => {
                      this.foodsData$ = n.foodData;
                    },
                    (n) => console.log(n.error)
                  );
            }
            lsitCategories() {
              this.kitchenService.listCategory().subscribe((n) => {
                console.log(n), (this.categories = n);
              });
            }
            filterFood(n) {
              console.log(n),
                this._kitchenSocketService.emit("filterFoodsToKitchen", n),
                this._kitchenSocketService
                  .listen("FilteredFoods")
                  .subscribe((r) => {
                    this.foodsData$ = r;
                  });
            }
          }
          return (
            (t.ɵfac = function (n) {
              return new (n || t)(C(Wp), C(ai), C(Qp));
            }),
            (t.ɵcmp = Kt({
              type: t,
              selectors: [["app-list-foods"]],
              decls: 5,
              vars: 2,
              consts: [
                [1, "container"],
                [1, "foods__Section"],
                [1, "Category_section"],
                ["class", "categories", 4, "ngFor", "ngForOf"],
                ["class", "foods_container grid", 4, "ngIf"],
                [1, "categories"],
                [3, "click"],
                [1, "foods_container", "grid"],
                ["class", "card", 4, "ngFor", "ngForOf"],
                [1, "card"],
                [1, "product-image"],
                [
                  "alt",
                  "OFF-white Red Edition",
                  "draggable",
                  "false",
                  3,
                  "src",
                ],
                [1, "product-info"],
                [1, "price"],
                [1, "btn"],
                [1, "type-btn"],
                [1, "add-btn"],
                ["type", "button", 3, "click"],
              ],
              template: function (n, r) {
                1 & n &&
                  (x(0, "div", 0)(1, "div", 1)(2, "div", 2),
                  ye(3, j$, 3, 1, "div", 3),
                  N(),
                  ye(4, $$, 2, 1, "div", 4),
                  N()()),
                  2 & n &&
                    (U(3),
                    re("ngForOf", r.categories),
                    U(1),
                    re("ngIf", r.foodsData$));
              },
              dependencies: [zh, ao],
              styles: [
                '@import"https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap";[_ngcontent-%COMP%]:root{--dark-color-lighten: #f2f5ff;--red-card: #a62121;--blue-card: #4bb7e6;--btn: #141414;--btn-hover: #3a3a3a;--text: #fbf7f7;--main-color: rgb(255, 149, 0)}button[_ngcontent-%COMP%]{font-family:Montserrat,sans-serif;display:inline-block;border:none;outline:none;border-radius:.2rem;color:var(--text);cursor:pointer}a[_ngcontent-%COMP%]{text-decoration:none}img[_ngcontent-%COMP%]{max-width:100%;height:100%;-webkit-user-select:none;user-select:none}.container[_ngcontent-%COMP%]{max-width:1080px;display:flex;flex-direction:row;align-items:center;justify-content:space-evenly}.grid[_ngcontent-%COMP%]{display:grid}.foods__Section[_ngcontent-%COMP%]{width:100%;margin-top:2rem}.foods_container[_ngcontent-%COMP%]{display:grid;row-gap:20px;transition:.5s}.order_section[_ngcontent-%COMP%]{width:40%;display:block;justify-content:center;align-items:center}@media screen and (max-width: 320px){.container[_ngcontent-%COMP%]{margin-left:.2rem;margin-right:.2rem}.foods_container[_ngcontent-%COMP%]{grid-template-columns:200px}.order_section[_ngcontent-%COMP%]{display:none}}@media screen and (min-width: 320px){.container[_ngcontent-%COMP%]{justify-content:center}.foods_container[_ngcontent-%COMP%]{grid-template-columns:repeat(1,200px);justify-content:center;align-items:center;column-gap:1rem}}@media screen and (max-width: 1264px){.order_section[_ngcontent-%COMP%]{display:none}}@media screen and (min-width: 560px){.container[_ngcontent-%COMP%]{justify-content:center}.foods_container[_ngcontent-%COMP%]{grid-template-columns:repeat(2,200px);justify-content:center;align-items:center;column-gap:1rem}}@media screen and (min-width: 720px){.container[_ngcontent-%COMP%]{padding:1rem 0;width:100%;gap:3rem}.foods_container[_ngcontent-%COMP%]{grid-template-columns:repeat(3,200px);justify-content:center;align-items:center;column-gap:1rem}}@media screen and (min-width: 860px){.container[_ngcontent-%COMP%]{padding:1rem 0;width:100%;gap:3rem}.foods_container[_ngcontent-%COMP%]{grid-template-columns:repeat(3,200px);justify-content:center;align-items:center;column-gap:.5rem}}@media screen and (min-width: 960px){.container[_ngcontent-%COMP%]{padding:1rem 0;width:100%;gap:3rem}.foods_container[_ngcontent-%COMP%]{grid-template-columns:repeat(5,200px);justify-content:center;align-items:center;column-gap:.5rem}}.card[_ngcontent-%COMP%]{position:relative;width:170px;height:auto;box-shadow:-1px 15px 30px -12px #202020;border-radius:.9rem;background-color:var(--red-card);color:var(--text);cursor:pointer}.card-blue[_ngcontent-%COMP%]{background:var(--blue-card)}.product-image[_ngcontent-%COMP%]{margin-top:2rem;height:100px;width:100%;display:flex;justify-content:center;align-items:center;transform:translateY(-1rem);transition:.5s}.product-image[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{border-radius:15rem;position:relative;height:100px;width:100px;display:block;margin:auto}.product-info[_ngcontent-%COMP%]{text-align:center}.card[_ngcontent-%COMP%]:hover   .product-image[_ngcontent-%COMP%]{transform:translateY(-5px)}.product-info[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%]{font-size:20px;font-weight:600}.product-info[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{margin:.4rem;font-size:.8rem;font-weight:600}.price[_ngcontent-%COMP%]{padding:2px;font-size:1rem;font-weight:600;color:orange}.btn[_ngcontent-%COMP%]{display:flex;align-items:center;margin-top:.4rem}.buy-btn[_ngcontent-%COMP%]{background-color:var(--btn);padding:.3rem 2.5rem;font-weight:600;font-size:1rem;transition:.3s ease}.buy-btn[_ngcontent-%COMP%]:hover{background-color:var(--btn-hover)}.btn[_ngcontent-%COMP%]{display:flex;flex-direction:row;justify-content:space-around;color:#fff}.type-btn[_ngcontent-%COMP%], .add-btn[_ngcontent-%COMP%]{height:100%;width:100%}.type-btn[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{background-color:#ff9500;height:32px;width:4.5rem;border-radius:10px 1px;transition:.2s}.add-btn[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{background-color:#f70404;height:32px;width:4.5rem;border-radius:10px 1px;transition:.2s}.type-btn[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:hover{background-color:#de8509;height:32px;width:4.5rem;border-radius:1px 10px;transform:rotate(-10deg)}.add-btn[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:hover{background-color:#bf0808;height:32px;width:4.5rem;border-radius:1px 10px;transform:rotate(10deg)}.Category_section[_ngcontent-%COMP%]{max-width:600px;width:auto;height:60px;overflow-x:auto;display:flex;flex-direction:row;align-items:center;margin:0rem 1.5rem}.categories[_ngcontent-%COMP%]{width:100px;height:40px;display:flex;justify-content:center;align-items:center;background-color:orange;border-radius:5px;transition:.5s;margin-left:5px}.categories[_ngcontent-%COMP%]:hover{transform:translateY(-5px)}.categories[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{color:#fff;display:flex;justify-content:center;align-items:center;background-color:orange}',
              ],
            })),
            t
          );
        })(),
        z$ = (() => {
          class t {
            constructor(n, r) {
              (this.kitchenService = n), (this.router = r);
            }
            ngOnInit() {}
            logoutStaff() {
              this.kitchenService.logoutStaff().subscribe((n) => {
                localStorage.removeItem("token"),
                  localStorage.removeItem("resId"),
                  (location.href = "http://localhost:2200/kitchenLogin");
              });
            }
          }
          return (
            (t.ɵfac = function (n) {
              return new (n || t)(C(ai), C(dt));
            }),
            (t.ɵcmp = Kt({
              type: t,
              selectors: [["app-sidebar"]],
              decls: 23,
              vars: 0,
              consts: [
                [1, "sidebar-container"],
                [1, "sidebar"],
                [1, "sidebar__logo"],
                [1, "sidebar__menu"],
                [1, "sidebar__item"],
                [1, "sidebar_design"],
                ["routerLink", "foods", 1, "sidebar__link", "active-link"],
                [1, "bx", "bx-home-alt", "sidebar__icon"],
                [1, "sidebar__name"],
                ["routerLink", "orders", 1, "sidebar__link"],
                [1, "bx", "bx-user", "sidebar__icon"],
                ["type", "button", 1, "sidebar__link", 3, "click"],
                [1, "bx", "bx-message-square-detail", "sidebar__icon"],
              ],
              template: function (n, r) {
                1 & n &&
                  (x(0, "div", 0)(1, "div", 1)(2, "div", 2),
                  z(3, "Marlon"),
                  N(),
                  x(4, "ul", 3)(5, "li", 4)(6, "div", 5)(7, "a", 6),
                  Be(8, "i", 7),
                  x(9, "span", 8),
                  z(10, "Foods"),
                  N()()()(),
                  x(11, "li", 4)(12, "div", 5)(13, "a", 9),
                  Be(14, "i", 10),
                  x(15, "span", 8),
                  z(16, "Orders"),
                  N()()()(),
                  x(17, "li", 4)(18, "div", 5)(19, "a", 11),
                  Ee("click", function () {
                    return r.logoutStaff();
                  }),
                  Be(20, "i", 12),
                  x(21, "span", 8),
                  z(22, "Logout"),
                  N()()()()()()());
              },
              dependencies: [Au],
              styles: [
                ".sidebar-container[_ngcontent-%COMP%]{height:100%;overflow-y:auto}ul[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{list-style:none}.sidebar[_ngcontent-%COMP%]{position:fixed;bottom:0;left:0;width:240px;height:100vh;background-color:#fff;z-index:1;transition:.4s;display:flex;flex-direction:column;align-items:center}.sidebar__logo[_ngcontent-%COMP%]{margin-top:1rem;color:var(--title-color);font-weight:600;font-size:1.25rem}.sidebar__menu[_ngcontent-%COMP%]{width:100%;margin-top:2rem;display:flex;flex-direction:column;align-items:center}.sidebar_design[_ngcontent-%COMP%]{background-color:#fff;box-shadow:0 0 11px orange;height:46px;width:177px;border-radius:20px}.sidebar_design[_ngcontent-%COMP%]:hover{background-color:#fff;transition:.4s;box-shadow:0 0 11px #ff8000;height:46px;width:177px;border-radius:20px}.sidebar__item[_ngcontent-%COMP%]{margin-bottom:1rem;display:flex;align-items:center}.sidebar__link[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:center;color:var(--title-color);font-weight:600;text-decoration:none}.sidebar__icon[_ngcontent-%COMP%]{font-size:1.5rem;margin-right:8px;margin-top:9px;color:orange}.sidebar__name[_ngcontent-%COMP%]{font-size:.75rem;margin-top:9px;display:flex;align-items:center;color:orange}.sidebar__img[_ngcontent-%COMP%]{margin-top:auto;margin-bottom:1rem}.sidebar__img[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:32px;border-radius:50%}.active-link[_ngcontent-%COMP%]{color:var(--first-color)}.scroll-sidebar[_ngcontent-%COMP%]{box-shadow:0 1px 12px hsla(var(--hue),var(--sat),15%,.15)}@media screen and (max-width: 767px){.sidebar[_ngcontent-%COMP%]{position:fixed;bottom:0;left:0;background-color:#fff;box-shadow:0 -1px 12px hsla(var(--hue),var(--sat),15%,.15);width:100%;height:4rem;padding:0 1rem;display:grid;align-content:center;border-radius:1.25rem 1.25rem 0 0;transition:.4s}.sidebar__logo[_ngcontent-%COMP%]{display:none}.sidebar__menu[_ngcontent-%COMP%]{flex-direction:row;justify-content:space-around;width:calc(100% - 80px)}.sidebar_design[_ngcontent-%COMP%]{background-color:#fff;box-shadow:none;height:60px;width:24px}.sidebar_design[_ngcontent-%COMP%]:hover{background-color:#fff;transition:.4s;box-shadow:none;height:60px;width:24px}.sidebar__item[_ngcontent-%COMP%]{margin-bottom:0;text-align:center}.sidebar__link[_ngcontent-%COMP%]{flex-direction:column;align-items:center;text-align:center}.sidebar__icon[_ngcontent-%COMP%]{margin-right:0}.sidebar__name[_ngcontent-%COMP%]{font-size:.628rem;text-align:center}.sidebar__img[_ngcontent-%COMP%]{margin-top:0;margin-bottom:0}.sidebar__img[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:24px}}@media screen and (min-width: 576px){.sidebar__item[_ngcontent-%COMP%]{justify-content:center;column-gap:3rem}}",
              ],
            })),
            t
          );
        })(),
        q$ = (() => {
          class t {
            constructor(n, r) {
              (this.router = n), (this.kitchenService = r);
            }
            ngOnInit() {
              this.kitchenService.verifyStaff().subscribe(
                (r) => {},
                (r) => {
                  console.log(r.error.message),
                    localStorage.removeItem("kitchen-staffs"),
                    this.router.navigate(["/kitchenLogin"]);
                }
              ),
                localStorage.getItem("kitchen-staffs") ||
                  this.router.navigate(["/diningLogin"]);
            }
          }
          return (
            (t.ɵfac = function (n) {
              return new (n || t)(C(dt), C(ai));
            }),
            (t.ɵcmp = Kt({
              type: t,
              selectors: [["app-dashboard"]],
              decls: 7,
              vars: 0,
              consts: [
                [1, "container-fluid", "w-100"],
                [1, "row"],
                [1, "col-md-2"],
                [1, "col-md-10"],
                [1, "foem-sign"],
              ],
              template: function (n, r) {
                1 & n &&
                  (x(0, "div", 0)(1, "div", 1)(2, "div", 2),
                  Be(3, "app-sidebar"),
                  N(),
                  x(4, "div", 3)(5, "main", 4),
                  Be(6, "router-outlet"),
                  N()()()());
              },
              dependencies: [Cu, z$],
            })),
            t
          );
        })(),
        dS = (() => {
          class t {
            constructor(n, r) {
              (this._renderer = n),
                (this._elementRef = r),
                (this.onChange = (i) => {}),
                (this.onTouched = () => {});
            }
            setProperty(n, r) {
              this._renderer.setProperty(this._elementRef.nativeElement, n, r);
            }
            registerOnTouched(n) {
              this.onTouched = n;
            }
            registerOnChange(n) {
              this.onChange = n;
            }
            setDisabledState(n) {
              this.setProperty("disabled", n);
            }
          }
          return (
            (t.ɵfac = function (n) {
              return new (n || t)(C(Jn), C(Vt));
            }),
            (t.ɵdir = q({ type: t })),
            t
          );
        })(),
        li = (() => {
          class t extends dS {}
          return (
            (t.ɵfac = (function () {
              let e;
              return function (r) {
                return (e || (e = nt(t)))(r || t);
              };
            })()),
            (t.ɵdir = q({ type: t, features: [de] })),
            t
          );
        })();
      const Hn = new b("NgValueAccessor"),
        K$ = { provide: Hn, useExisting: _e(() => Bu), multi: !0 },
        Z$ = new b("CompositionEventMode");
      let Bu = (() => {
        class t extends dS {
          constructor(n, r, i) {
            super(n, r),
              (this._compositionMode = i),
              (this._composing = !1),
              null == this._compositionMode &&
                (this._compositionMode = !(function Q$() {
                  const t = Er() ? Er().getUserAgent() : "";
                  return /android (\d+)/.test(t.toLowerCase());
                })());
          }
          writeValue(n) {
            this.setProperty("value", n ?? "");
          }
          _handleInput(n) {
            (!this._compositionMode ||
              (this._compositionMode && !this._composing)) &&
              this.onChange(n);
          }
          _compositionStart() {
            this._composing = !0;
          }
          _compositionEnd(n) {
            (this._composing = !1), this._compositionMode && this.onChange(n);
          }
        }
        return (
          (t.ɵfac = function (n) {
            return new (n || t)(C(Jn), C(Vt), C(Z$, 8));
          }),
          (t.ɵdir = q({
            type: t,
            selectors: [
              ["input", "formControlName", "", 3, "type", "checkbox"],
              ["textarea", "formControlName", ""],
              ["input", "formControl", "", 3, "type", "checkbox"],
              ["textarea", "formControl", ""],
              ["input", "ngModel", "", 3, "type", "checkbox"],
              ["textarea", "ngModel", ""],
              ["", "ngDefaultControl", ""],
            ],
            hostBindings: function (n, r) {
              1 & n &&
                Ee("input", function (o) {
                  return r._handleInput(o.target.value);
                })("blur", function () {
                  return r.onTouched();
                })("compositionstart", function () {
                  return r._compositionStart();
                })("compositionend", function (o) {
                  return r._compositionEnd(o.target.value);
                });
            },
            features: [Me([K$]), de],
          })),
          t
        );
      })();
      function xr(t) {
        return (
          null == t ||
          (("string" == typeof t || Array.isArray(t)) && 0 === t.length)
        );
      }
      function hS(t) {
        return null != t && "number" == typeof t.length;
      }
      const ft = new b("NgValidators"),
        Rr = new b("NgAsyncValidators"),
        Y$ =
          /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      class ju {
        static min(e) {
          return (function pS(t) {
            return (e) => {
              if (xr(e.value) || xr(t)) return null;
              const n = parseFloat(e.value);
              return !isNaN(n) && n < t
                ? { min: { min: t, actual: e.value } }
                : null;
            };
          })(e);
        }
        static max(e) {
          return (function gS(t) {
            return (e) => {
              if (xr(e.value) || xr(t)) return null;
              const n = parseFloat(e.value);
              return !isNaN(n) && n > t
                ? { max: { max: t, actual: e.value } }
                : null;
            };
          })(e);
        }
        static required(e) {
          return (function mS(t) {
            return xr(t.value) ? { required: !0 } : null;
          })(e);
        }
        static requiredTrue(e) {
          return (function yS(t) {
            return !0 === t.value ? null : { required: !0 };
          })(e);
        }
        static email(e) {
          return (function vS(t) {
            return xr(t.value) || Y$.test(t.value) ? null : { email: !0 };
          })(e);
        }
        static minLength(e) {
          return (function _S(t) {
            return (e) =>
              xr(e.value) || !hS(e.value)
                ? null
                : e.value.length < t
                ? {
                    minlength: {
                      requiredLength: t,
                      actualLength: e.value.length,
                    },
                  }
                : null;
          })(e);
        }
        static maxLength(e) {
          return (function CS(t) {
            return (e) =>
              hS(e.value) && e.value.length > t
                ? {
                    maxlength: {
                      requiredLength: t,
                      actualLength: e.value.length,
                    },
                  }
                : null;
          })(e);
        }
        static pattern(e) {
          return (function DS(t) {
            if (!t) return Hu;
            let e, n;
            return (
              "string" == typeof t
                ? ((n = ""),
                  "^" !== t.charAt(0) && (n += "^"),
                  (n += t),
                  "$" !== t.charAt(t.length - 1) && (n += "$"),
                  (e = new RegExp(n)))
                : ((n = t.toString()), (e = t)),
              (r) => {
                if (xr(r.value)) return null;
                const i = r.value;
                return e.test(i)
                  ? null
                  : { pattern: { requiredPattern: n, actualValue: i } };
              }
            );
          })(e);
        }
        static nullValidator(e) {
          return null;
        }
        static compose(e) {
          return TS(e);
        }
        static composeAsync(e) {
          return AS(e);
        }
      }
      function Hu(t) {
        return null;
      }
      function wS(t) {
        return null != t;
      }
      function bS(t) {
        return ms(t) ? We(t) : t;
      }
      function ES(t) {
        let e = {};
        return (
          t.forEach((n) => {
            e = null != n ? { ...e, ...n } : e;
          }),
          0 === Object.keys(e).length ? null : e
        );
      }
      function SS(t, e) {
        return e.map((n) => n(t));
      }
      function MS(t) {
        return t.map((e) =>
          (function X$(t) {
            return !t.validate;
          })(e)
            ? e
            : (n) => e.validate(n)
        );
      }
      function TS(t) {
        if (!t) return null;
        const e = t.filter(wS);
        return 0 == e.length
          ? null
          : function (n) {
              return ES(SS(n, e));
            };
      }
      function Zp(t) {
        return null != t ? TS(MS(t)) : null;
      }
      function AS(t) {
        if (!t) return null;
        const e = t.filter(wS);
        return 0 == e.length
          ? null
          : function (n) {
              return (function G$(...t) {
                const e = $c(t),
                  { args: n, keys: r } = mE(t),
                  i = new pe((o) => {
                    const { length: s } = n;
                    if (!s) return void o.complete();
                    const a = new Array(s);
                    let l = s,
                      u = s;
                    for (let c = 0; c < s; c++) {
                      let d = !1;
                      ot(n[c]).subscribe(
                        ge(
                          o,
                          (f) => {
                            d || ((d = !0), u--), (a[c] = f);
                          },
                          () => l--,
                          void 0,
                          () => {
                            (!l || !d) &&
                              (u || o.next(r ? vE(r, a) : a), o.complete());
                          }
                        )
                      );
                    }
                  });
                return e ? i.pipe(yE(e)) : i;
              })(SS(n, e).map(bS)).pipe(J(ES));
            };
      }
      function Yp(t) {
        return null != t ? AS(MS(t)) : null;
      }
      function IS(t, e) {
        return null === t ? [e] : Array.isArray(t) ? [...t, e] : [t, e];
      }
      function xS(t) {
        return t._rawValidators;
      }
      function RS(t) {
        return t._rawAsyncValidators;
      }
      function Xp(t) {
        return t ? (Array.isArray(t) ? t : [t]) : [];
      }
      function $u(t, e) {
        return Array.isArray(t) ? t.includes(e) : t === e;
      }
      function NS(t, e) {
        const n = Xp(e);
        return (
          Xp(t).forEach((i) => {
            $u(n, i) || n.push(i);
          }),
          n
        );
      }
      function OS(t, e) {
        return Xp(e).filter((n) => !$u(t, n));
      }
      class PS {
        constructor() {
          (this._rawValidators = []),
            (this._rawAsyncValidators = []),
            (this._onDestroyCallbacks = []);
        }
        get value() {
          return this.control ? this.control.value : null;
        }
        get valid() {
          return this.control ? this.control.valid : null;
        }
        get invalid() {
          return this.control ? this.control.invalid : null;
        }
        get pending() {
          return this.control ? this.control.pending : null;
        }
        get disabled() {
          return this.control ? this.control.disabled : null;
        }
        get enabled() {
          return this.control ? this.control.enabled : null;
        }
        get errors() {
          return this.control ? this.control.errors : null;
        }
        get pristine() {
          return this.control ? this.control.pristine : null;
        }
        get dirty() {
          return this.control ? this.control.dirty : null;
        }
        get touched() {
          return this.control ? this.control.touched : null;
        }
        get status() {
          return this.control ? this.control.status : null;
        }
        get untouched() {
          return this.control ? this.control.untouched : null;
        }
        get statusChanges() {
          return this.control ? this.control.statusChanges : null;
        }
        get valueChanges() {
          return this.control ? this.control.valueChanges : null;
        }
        get path() {
          return null;
        }
        _setValidators(e) {
          (this._rawValidators = e || []),
            (this._composedValidatorFn = Zp(this._rawValidators));
        }
        _setAsyncValidators(e) {
          (this._rawAsyncValidators = e || []),
            (this._composedAsyncValidatorFn = Yp(this._rawAsyncValidators));
        }
        get validator() {
          return this._composedValidatorFn || null;
        }
        get asyncValidator() {
          return this._composedAsyncValidatorFn || null;
        }
        _registerOnDestroy(e) {
          this._onDestroyCallbacks.push(e);
        }
        _invokeOnDestroyCallbacks() {
          this._onDestroyCallbacks.forEach((e) => e()),
            (this._onDestroyCallbacks = []);
        }
        reset(e = void 0) {
          this.control && this.control.reset(e);
        }
        hasError(e, n) {
          return !!this.control && this.control.hasError(e, n);
        }
        getError(e, n) {
          return this.control ? this.control.getError(e, n) : null;
        }
      }
      class Ct extends PS {
        get formDirective() {
          return null;
        }
        get path() {
          return null;
        }
      }
      class Nr extends PS {
        constructor() {
          super(...arguments),
            (this._parent = null),
            (this.name = null),
            (this.valueAccessor = null);
        }
      }
      class FS {
        constructor(e) {
          this._cd = e;
        }
        get isTouched() {
          return !!this._cd?.control?.touched;
        }
        get isUntouched() {
          return !!this._cd?.control?.untouched;
        }
        get isPristine() {
          return !!this._cd?.control?.pristine;
        }
        get isDirty() {
          return !!this._cd?.control?.dirty;
        }
        get isValid() {
          return !!this._cd?.control?.valid;
        }
        get isInvalid() {
          return !!this._cd?.control?.invalid;
        }
        get isPending() {
          return !!this._cd?.control?.pending;
        }
        get isSubmitted() {
          return !!this._cd?.submitted;
        }
      }
      let kS = (() => {
          class t extends FS {
            constructor(n) {
              super(n);
            }
          }
          return (
            (t.ɵfac = function (n) {
              return new (n || t)(C(Nr, 2));
            }),
            (t.ɵdir = q({
              type: t,
              selectors: [
                ["", "formControlName", ""],
                ["", "ngModel", ""],
                ["", "formControl", ""],
              ],
              hostVars: 14,
              hostBindings: function (n, r) {
                2 & n &&
                  Pl("ng-untouched", r.isUntouched)("ng-touched", r.isTouched)(
                    "ng-pristine",
                    r.isPristine
                  )("ng-dirty", r.isDirty)("ng-valid", r.isValid)(
                    "ng-invalid",
                    r.isInvalid
                  )("ng-pending", r.isPending);
              },
              features: [de],
            })),
            t
          );
        })(),
        LS = (() => {
          class t extends FS {
            constructor(n) {
              super(n);
            }
          }
          return (
            (t.ɵfac = function (n) {
              return new (n || t)(C(Ct, 10));
            }),
            (t.ɵdir = q({
              type: t,
              selectors: [
                ["", "formGroupName", ""],
                ["", "formArrayName", ""],
                ["", "ngModelGroup", ""],
                ["", "formGroup", ""],
                ["form", 3, "ngNoForm", ""],
                ["", "ngForm", ""],
              ],
              hostVars: 16,
              hostBindings: function (n, r) {
                2 & n &&
                  Pl("ng-untouched", r.isUntouched)("ng-touched", r.isTouched)(
                    "ng-pristine",
                    r.isPristine
                  )("ng-dirty", r.isDirty)("ng-valid", r.isValid)(
                    "ng-invalid",
                    r.isInvalid
                  )("ng-pending", r.isPending)("ng-submitted", r.isSubmitted);
              },
              features: [de],
            })),
            t
          );
        })();
      const Zs = "VALID",
        zu = "INVALID",
        wo = "PENDING",
        Ys = "DISABLED";
      function tg(t) {
        return (qu(t) ? t.validators : t) || null;
      }
      function ng(t, e) {
        return (qu(e) ? e.asyncValidators : t) || null;
      }
      function qu(t) {
        return null != t && !Array.isArray(t) && "object" == typeof t;
      }
      function BS(t, e, n) {
        const r = t.controls;
        if (!(e ? Object.keys(r) : r).length) throw new v(1e3, "");
        if (!r[n]) throw new v(1001, "");
      }
      function jS(t, e, n) {
        t._forEachChild((r, i) => {
          if (void 0 === n[i]) throw new v(1002, "");
        });
      }
      class Gu {
        constructor(e, n) {
          (this._pendingDirty = !1),
            (this._hasOwnPendingAsyncValidator = !1),
            (this._pendingTouched = !1),
            (this._onCollectionChange = () => {}),
            (this._parent = null),
            (this.pristine = !0),
            (this.touched = !1),
            (this._onDisabledChange = []),
            this._assignValidators(e),
            this._assignAsyncValidators(n);
        }
        get validator() {
          return this._composedValidatorFn;
        }
        set validator(e) {
          this._rawValidators = this._composedValidatorFn = e;
        }
        get asyncValidator() {
          return this._composedAsyncValidatorFn;
        }
        set asyncValidator(e) {
          this._rawAsyncValidators = this._composedAsyncValidatorFn = e;
        }
        get parent() {
          return this._parent;
        }
        get valid() {
          return this.status === Zs;
        }
        get invalid() {
          return this.status === zu;
        }
        get pending() {
          return this.status == wo;
        }
        get disabled() {
          return this.status === Ys;
        }
        get enabled() {
          return this.status !== Ys;
        }
        get dirty() {
          return !this.pristine;
        }
        get untouched() {
          return !this.touched;
        }
        get updateOn() {
          return this._updateOn
            ? this._updateOn
            : this.parent
            ? this.parent.updateOn
            : "change";
        }
        setValidators(e) {
          this._assignValidators(e);
        }
        setAsyncValidators(e) {
          this._assignAsyncValidators(e);
        }
        addValidators(e) {
          this.setValidators(NS(e, this._rawValidators));
        }
        addAsyncValidators(e) {
          this.setAsyncValidators(NS(e, this._rawAsyncValidators));
        }
        removeValidators(e) {
          this.setValidators(OS(e, this._rawValidators));
        }
        removeAsyncValidators(e) {
          this.setAsyncValidators(OS(e, this._rawAsyncValidators));
        }
        hasValidator(e) {
          return $u(this._rawValidators, e);
        }
        hasAsyncValidator(e) {
          return $u(this._rawAsyncValidators, e);
        }
        clearValidators() {
          this.validator = null;
        }
        clearAsyncValidators() {
          this.asyncValidator = null;
        }
        markAsTouched(e = {}) {
          (this.touched = !0),
            this._parent && !e.onlySelf && this._parent.markAsTouched(e);
        }
        markAllAsTouched() {
          this.markAsTouched({ onlySelf: !0 }),
            this._forEachChild((e) => e.markAllAsTouched());
        }
        markAsUntouched(e = {}) {
          (this.touched = !1),
            (this._pendingTouched = !1),
            this._forEachChild((n) => {
              n.markAsUntouched({ onlySelf: !0 });
            }),
            this._parent && !e.onlySelf && this._parent._updateTouched(e);
        }
        markAsDirty(e = {}) {
          (this.pristine = !1),
            this._parent && !e.onlySelf && this._parent.markAsDirty(e);
        }
        markAsPristine(e = {}) {
          (this.pristine = !0),
            (this._pendingDirty = !1),
            this._forEachChild((n) => {
              n.markAsPristine({ onlySelf: !0 });
            }),
            this._parent && !e.onlySelf && this._parent._updatePristine(e);
        }
        markAsPending(e = {}) {
          (this.status = wo),
            !1 !== e.emitEvent && this.statusChanges.emit(this.status),
            this._parent && !e.onlySelf && this._parent.markAsPending(e);
        }
        disable(e = {}) {
          const n = this._parentMarkedDirty(e.onlySelf);
          (this.status = Ys),
            (this.errors = null),
            this._forEachChild((r) => {
              r.disable({ ...e, onlySelf: !0 });
            }),
            this._updateValue(),
            !1 !== e.emitEvent &&
              (this.valueChanges.emit(this.value),
              this.statusChanges.emit(this.status)),
            this._updateAncestors({ ...e, skipPristineCheck: n }),
            this._onDisabledChange.forEach((r) => r(!0));
        }
        enable(e = {}) {
          const n = this._parentMarkedDirty(e.onlySelf);
          (this.status = Zs),
            this._forEachChild((r) => {
              r.enable({ ...e, onlySelf: !0 });
            }),
            this.updateValueAndValidity({
              onlySelf: !0,
              emitEvent: e.emitEvent,
            }),
            this._updateAncestors({ ...e, skipPristineCheck: n }),
            this._onDisabledChange.forEach((r) => r(!1));
        }
        _updateAncestors(e) {
          this._parent &&
            !e.onlySelf &&
            (this._parent.updateValueAndValidity(e),
            e.skipPristineCheck || this._parent._updatePristine(),
            this._parent._updateTouched());
        }
        setParent(e) {
          this._parent = e;
        }
        getRawValue() {
          return this.value;
        }
        updateValueAndValidity(e = {}) {
          this._setInitialStatus(),
            this._updateValue(),
            this.enabled &&
              (this._cancelExistingSubscription(),
              (this.errors = this._runValidator()),
              (this.status = this._calculateStatus()),
              (this.status === Zs || this.status === wo) &&
                this._runAsyncValidator(e.emitEvent)),
            !1 !== e.emitEvent &&
              (this.valueChanges.emit(this.value),
              this.statusChanges.emit(this.status)),
            this._parent &&
              !e.onlySelf &&
              this._parent.updateValueAndValidity(e);
        }
        _updateTreeValidity(e = { emitEvent: !0 }) {
          this._forEachChild((n) => n._updateTreeValidity(e)),
            this.updateValueAndValidity({
              onlySelf: !0,
              emitEvent: e.emitEvent,
            });
        }
        _setInitialStatus() {
          this.status = this._allControlsDisabled() ? Ys : Zs;
        }
        _runValidator() {
          return this.validator ? this.validator(this) : null;
        }
        _runAsyncValidator(e) {
          if (this.asyncValidator) {
            (this.status = wo), (this._hasOwnPendingAsyncValidator = !0);
            const n = bS(this.asyncValidator(this));
            this._asyncValidationSubscription = n.subscribe((r) => {
              (this._hasOwnPendingAsyncValidator = !1),
                this.setErrors(r, { emitEvent: e });
            });
          }
        }
        _cancelExistingSubscription() {
          this._asyncValidationSubscription &&
            (this._asyncValidationSubscription.unsubscribe(),
            (this._hasOwnPendingAsyncValidator = !1));
        }
        setErrors(e, n = {}) {
          (this.errors = e), this._updateControlsErrors(!1 !== n.emitEvent);
        }
        get(e) {
          let n = e;
          return null == n ||
            (Array.isArray(n) || (n = n.split(".")), 0 === n.length)
            ? null
            : n.reduce((r, i) => r && r._find(i), this);
        }
        getError(e, n) {
          const r = n ? this.get(n) : this;
          return r && r.errors ? r.errors[e] : null;
        }
        hasError(e, n) {
          return !!this.getError(e, n);
        }
        get root() {
          let e = this;
          for (; e._parent; ) e = e._parent;
          return e;
        }
        _updateControlsErrors(e) {
          (this.status = this._calculateStatus()),
            e && this.statusChanges.emit(this.status),
            this._parent && this._parent._updateControlsErrors(e);
        }
        _initObservables() {
          (this.valueChanges = new Oe()), (this.statusChanges = new Oe());
        }
        _calculateStatus() {
          return this._allControlsDisabled()
            ? Ys
            : this.errors
            ? zu
            : this._hasOwnPendingAsyncValidator ||
              this._anyControlsHaveStatus(wo)
            ? wo
            : this._anyControlsHaveStatus(zu)
            ? zu
            : Zs;
        }
        _anyControlsHaveStatus(e) {
          return this._anyControls((n) => n.status === e);
        }
        _anyControlsDirty() {
          return this._anyControls((e) => e.dirty);
        }
        _anyControlsTouched() {
          return this._anyControls((e) => e.touched);
        }
        _updatePristine(e = {}) {
          (this.pristine = !this._anyControlsDirty()),
            this._parent && !e.onlySelf && this._parent._updatePristine(e);
        }
        _updateTouched(e = {}) {
          (this.touched = this._anyControlsTouched()),
            this._parent && !e.onlySelf && this._parent._updateTouched(e);
        }
        _registerOnCollectionChange(e) {
          this._onCollectionChange = e;
        }
        _setUpdateStrategy(e) {
          qu(e) && null != e.updateOn && (this._updateOn = e.updateOn);
        }
        _parentMarkedDirty(e) {
          return (
            !e &&
            !(!this._parent || !this._parent.dirty) &&
            !this._parent._anyControlsDirty()
          );
        }
        _find(e) {
          return null;
        }
        _assignValidators(e) {
          (this._rawValidators = Array.isArray(e) ? e.slice() : e),
            (this._composedValidatorFn = (function nU(t) {
              return Array.isArray(t) ? Zp(t) : t || null;
            })(this._rawValidators));
        }
        _assignAsyncValidators(e) {
          (this._rawAsyncValidators = Array.isArray(e) ? e.slice() : e),
            (this._composedAsyncValidatorFn = (function rU(t) {
              return Array.isArray(t) ? Yp(t) : t || null;
            })(this._rawAsyncValidators));
        }
      }
      class Xs extends Gu {
        constructor(e, n, r) {
          super(tg(n), ng(r, n)),
            (this.controls = e),
            this._initObservables(),
            this._setUpdateStrategy(n),
            this._setUpControls(),
            this.updateValueAndValidity({
              onlySelf: !0,
              emitEvent: !!this.asyncValidator,
            });
        }
        registerControl(e, n) {
          return this.controls[e]
            ? this.controls[e]
            : ((this.controls[e] = n),
              n.setParent(this),
              n._registerOnCollectionChange(this._onCollectionChange),
              n);
        }
        addControl(e, n, r = {}) {
          this.registerControl(e, n),
            this.updateValueAndValidity({ emitEvent: r.emitEvent }),
            this._onCollectionChange();
        }
        removeControl(e, n = {}) {
          this.controls[e] &&
            this.controls[e]._registerOnCollectionChange(() => {}),
            delete this.controls[e],
            this.updateValueAndValidity({ emitEvent: n.emitEvent }),
            this._onCollectionChange();
        }
        setControl(e, n, r = {}) {
          this.controls[e] &&
            this.controls[e]._registerOnCollectionChange(() => {}),
            delete this.controls[e],
            n && this.registerControl(e, n),
            this.updateValueAndValidity({ emitEvent: r.emitEvent }),
            this._onCollectionChange();
        }
        contains(e) {
          return this.controls.hasOwnProperty(e) && this.controls[e].enabled;
        }
        setValue(e, n = {}) {
          jS(this, 0, e),
            Object.keys(e).forEach((r) => {
              BS(this, !0, r),
                this.controls[r].setValue(e[r], {
                  onlySelf: !0,
                  emitEvent: n.emitEvent,
                });
            }),
            this.updateValueAndValidity(n);
        }
        patchValue(e, n = {}) {
          null != e &&
            (Object.keys(e).forEach((r) => {
              const i = this.controls[r];
              i && i.patchValue(e[r], { onlySelf: !0, emitEvent: n.emitEvent });
            }),
            this.updateValueAndValidity(n));
        }
        reset(e = {}, n = {}) {
          this._forEachChild((r, i) => {
            r.reset(e[i], { onlySelf: !0, emitEvent: n.emitEvent });
          }),
            this._updatePristine(n),
            this._updateTouched(n),
            this.updateValueAndValidity(n);
        }
        getRawValue() {
          return this._reduceChildren(
            {},
            (e, n, r) => ((e[r] = n.getRawValue()), e)
          );
        }
        _syncPendingControls() {
          let e = this._reduceChildren(
            !1,
            (n, r) => !!r._syncPendingControls() || n
          );
          return e && this.updateValueAndValidity({ onlySelf: !0 }), e;
        }
        _forEachChild(e) {
          Object.keys(this.controls).forEach((n) => {
            const r = this.controls[n];
            r && e(r, n);
          });
        }
        _setUpControls() {
          this._forEachChild((e) => {
            e.setParent(this),
              e._registerOnCollectionChange(this._onCollectionChange);
          });
        }
        _updateValue() {
          this.value = this._reduceValue();
        }
        _anyControls(e) {
          for (const [n, r] of Object.entries(this.controls))
            if (this.contains(n) && e(r)) return !0;
          return !1;
        }
        _reduceValue() {
          return this._reduceChildren(
            {},
            (n, r, i) => ((r.enabled || this.disabled) && (n[i] = r.value), n)
          );
        }
        _reduceChildren(e, n) {
          let r = e;
          return (
            this._forEachChild((i, o) => {
              r = n(r, i, o);
            }),
            r
          );
        }
        _allControlsDisabled() {
          for (const e of Object.keys(this.controls))
            if (this.controls[e].enabled) return !1;
          return Object.keys(this.controls).length > 0 || this.disabled;
        }
        _find(e) {
          return this.controls.hasOwnProperty(e) ? this.controls[e] : null;
        }
      }
      class HS extends Xs {}
      const bo = new b("CallSetDisabledState", {
          providedIn: "root",
          factory: () => Wu,
        }),
        Wu = "always";
      function Js(t, e, n = Wu) {
        rg(t, e),
          e.valueAccessor.writeValue(t.value),
          (t.disabled || "always" === n) &&
            e.valueAccessor.setDisabledState?.(t.disabled),
          (function oU(t, e) {
            e.valueAccessor.registerOnChange((n) => {
              (t._pendingValue = n),
                (t._pendingChange = !0),
                (t._pendingDirty = !0),
                "change" === t.updateOn && $S(t, e);
            });
          })(t, e),
          (function aU(t, e) {
            const n = (r, i) => {
              e.valueAccessor.writeValue(r), i && e.viewToModelUpdate(r);
            };
            t.registerOnChange(n),
              e._registerOnDestroy(() => {
                t._unregisterOnChange(n);
              });
          })(t, e),
          (function sU(t, e) {
            e.valueAccessor.registerOnTouched(() => {
              (t._pendingTouched = !0),
                "blur" === t.updateOn && t._pendingChange && $S(t, e),
                "submit" !== t.updateOn && t.markAsTouched();
            });
          })(t, e),
          (function iU(t, e) {
            if (e.valueAccessor.setDisabledState) {
              const n = (r) => {
                e.valueAccessor.setDisabledState(r);
              };
              t.registerOnDisabledChange(n),
                e._registerOnDestroy(() => {
                  t._unregisterOnDisabledChange(n);
                });
            }
          })(t, e);
      }
      function Qu(t, e, n = !0) {
        const r = () => {};
        e.valueAccessor &&
          (e.valueAccessor.registerOnChange(r),
          e.valueAccessor.registerOnTouched(r)),
          Yu(t, e),
          t &&
            (e._invokeOnDestroyCallbacks(),
            t._registerOnCollectionChange(() => {}));
      }
      function Zu(t, e) {
        t.forEach((n) => {
          n.registerOnValidatorChange && n.registerOnValidatorChange(e);
        });
      }
      function rg(t, e) {
        const n = xS(t);
        null !== e.validator
          ? t.setValidators(IS(n, e.validator))
          : "function" == typeof n && t.setValidators([n]);
        const r = RS(t);
        null !== e.asyncValidator
          ? t.setAsyncValidators(IS(r, e.asyncValidator))
          : "function" == typeof r && t.setAsyncValidators([r]);
        const i = () => t.updateValueAndValidity();
        Zu(e._rawValidators, i), Zu(e._rawAsyncValidators, i);
      }
      function Yu(t, e) {
        let n = !1;
        if (null !== t) {
          if (null !== e.validator) {
            const i = xS(t);
            if (Array.isArray(i) && i.length > 0) {
              const o = i.filter((s) => s !== e.validator);
              o.length !== i.length && ((n = !0), t.setValidators(o));
            }
          }
          if (null !== e.asyncValidator) {
            const i = RS(t);
            if (Array.isArray(i) && i.length > 0) {
              const o = i.filter((s) => s !== e.asyncValidator);
              o.length !== i.length && ((n = !0), t.setAsyncValidators(o));
            }
          }
        }
        const r = () => {};
        return Zu(e._rawValidators, r), Zu(e._rawAsyncValidators, r), n;
      }
      function $S(t, e) {
        t._pendingDirty && t.markAsDirty(),
          t.setValue(t._pendingValue, { emitModelToViewChange: !1 }),
          e.viewToModelUpdate(t._pendingValue),
          (t._pendingChange = !1);
      }
      function qS(t, e) {
        const n = t.indexOf(e);
        n > -1 && t.splice(n, 1);
      }
      function GS(t) {
        return (
          "object" == typeof t &&
          null !== t &&
          2 === Object.keys(t).length &&
          "value" in t &&
          "disabled" in t
        );
      }
      const ui = class extends Gu {
        constructor(e = null, n, r) {
          super(tg(n), ng(r, n)),
            (this.defaultValue = null),
            (this._onChange = []),
            (this._pendingChange = !1),
            this._applyFormState(e),
            this._setUpdateStrategy(n),
            this._initObservables(),
            this.updateValueAndValidity({
              onlySelf: !0,
              emitEvent: !!this.asyncValidator,
            }),
            qu(n) &&
              (n.nonNullable || n.initialValueIsDefault) &&
              (this.defaultValue = GS(e) ? e.value : e);
        }
        setValue(e, n = {}) {
          (this.value = this._pendingValue = e),
            this._onChange.length &&
              !1 !== n.emitModelToViewChange &&
              this._onChange.forEach((r) =>
                r(this.value, !1 !== n.emitViewToModelChange)
              ),
            this.updateValueAndValidity(n);
        }
        patchValue(e, n = {}) {
          this.setValue(e, n);
        }
        reset(e = this.defaultValue, n = {}) {
          this._applyFormState(e),
            this.markAsPristine(n),
            this.markAsUntouched(n),
            this.setValue(this.value, n),
            (this._pendingChange = !1);
        }
        _updateValue() {}
        _anyControls(e) {
          return !1;
        }
        _allControlsDisabled() {
          return this.disabled;
        }
        registerOnChange(e) {
          this._onChange.push(e);
        }
        _unregisterOnChange(e) {
          qS(this._onChange, e);
        }
        registerOnDisabledChange(e) {
          this._onDisabledChange.push(e);
        }
        _unregisterOnDisabledChange(e) {
          qS(this._onDisabledChange, e);
        }
        _forEachChild(e) {}
        _syncPendingControls() {
          return !(
            "submit" !== this.updateOn ||
            (this._pendingDirty && this.markAsDirty(),
            this._pendingTouched && this.markAsTouched(),
            !this._pendingChange) ||
            (this.setValue(this._pendingValue, {
              onlySelf: !0,
              emitModelToViewChange: !1,
            }),
            0)
          );
        }
        _applyFormState(e) {
          GS(e)
            ? ((this.value = this._pendingValue = e.value),
              e.disabled
                ? this.disable({ onlySelf: !0, emitEvent: !1 })
                : this.enable({ onlySelf: !0, emitEvent: !1 }))
            : (this.value = this._pendingValue = e);
        }
      };
      let YS = (() => {
          class t {}
          return (
            (t.ɵfac = function (n) {
              return new (n || t)();
            }),
            (t.ɵdir = q({
              type: t,
              selectors: [
                ["form", 3, "ngNoForm", "", 3, "ngNativeValidate", ""],
              ],
              hostAttrs: ["novalidate", ""],
            })),
            t
          );
        })(),
        JS = (() => {
          class t {}
          return (
            (t.ɵfac = function (n) {
              return new (n || t)();
            }),
            (t.ɵmod = Qe({ type: t })),
            (t.ɵinj = ke({})),
            t
          );
        })();
      const lg = new b("NgModelWithFormControlWarning"),
        DU = { provide: Ct, useExisting: _e(() => Xu) };
      let Xu = (() => {
        class t extends Ct {
          constructor(n, r, i) {
            super(),
              (this.callSetDisabledState = i),
              (this.submitted = !1),
              (this._onCollectionChange = () => this._updateDomValue()),
              (this.directives = []),
              (this.form = null),
              (this.ngSubmit = new Oe()),
              this._setValidators(n),
              this._setAsyncValidators(r);
          }
          ngOnChanges(n) {
            this._checkFormPresent(),
              n.hasOwnProperty("form") &&
                (this._updateValidators(),
                this._updateDomValue(),
                this._updateRegistrations(),
                (this._oldForm = this.form));
          }
          ngOnDestroy() {
            this.form &&
              (Yu(this.form, this),
              this.form._onCollectionChange === this._onCollectionChange &&
                this.form._registerOnCollectionChange(() => {}));
          }
          get formDirective() {
            return this;
          }
          get control() {
            return this.form;
          }
          get path() {
            return [];
          }
          addControl(n) {
            const r = this.form.get(n.path);
            return (
              Js(r, n, this.callSetDisabledState),
              r.updateValueAndValidity({ emitEvent: !1 }),
              this.directives.push(n),
              r
            );
          }
          getControl(n) {
            return this.form.get(n.path);
          }
          removeControl(n) {
            Qu(n.control || null, n, !1),
              (function dU(t, e) {
                const n = t.indexOf(e);
                n > -1 && t.splice(n, 1);
              })(this.directives, n);
          }
          addFormGroup(n) {
            this._setUpFormContainer(n);
          }
          removeFormGroup(n) {
            this._cleanUpFormContainer(n);
          }
          getFormGroup(n) {
            return this.form.get(n.path);
          }
          addFormArray(n) {
            this._setUpFormContainer(n);
          }
          removeFormArray(n) {
            this._cleanUpFormContainer(n);
          }
          getFormArray(n) {
            return this.form.get(n.path);
          }
          updateModel(n, r) {
            this.form.get(n.path).setValue(r);
          }
          onSubmit(n) {
            return (
              (this.submitted = !0),
              (function zS(t, e) {
                t._syncPendingControls(),
                  e.forEach((n) => {
                    const r = n.control;
                    "submit" === r.updateOn &&
                      r._pendingChange &&
                      (n.viewToModelUpdate(r._pendingValue),
                      (r._pendingChange = !1));
                  });
              })(this.form, this.directives),
              this.ngSubmit.emit(n),
              "dialog" === n?.target?.method
            );
          }
          onReset() {
            this.resetForm();
          }
          resetForm(n = void 0) {
            this.form.reset(n), (this.submitted = !1);
          }
          _updateDomValue() {
            this.directives.forEach((n) => {
              const r = n.control,
                i = this.form.get(n.path);
              r !== i &&
                (Qu(r || null, n),
                ((t) => t instanceof ui)(i) &&
                  (Js(i, n, this.callSetDisabledState), (n.control = i)));
            }),
              this.form._updateTreeValidity({ emitEvent: !1 });
          }
          _setUpFormContainer(n) {
            const r = this.form.get(n.path);
            (function US(t, e) {
              rg(t, e);
            })(r, n),
              r.updateValueAndValidity({ emitEvent: !1 });
          }
          _cleanUpFormContainer(n) {
            if (this.form) {
              const r = this.form.get(n.path);
              r &&
                (function lU(t, e) {
                  return Yu(t, e);
                })(r, n) &&
                r.updateValueAndValidity({ emitEvent: !1 });
            }
          }
          _updateRegistrations() {
            this.form._registerOnCollectionChange(this._onCollectionChange),
              this._oldForm &&
                this._oldForm._registerOnCollectionChange(() => {});
          }
          _updateValidators() {
            rg(this.form, this), this._oldForm && Yu(this._oldForm, this);
          }
          _checkFormPresent() {}
        }
        return (
          (t.ɵfac = function (n) {
            return new (n || t)(C(ft, 10), C(Rr, 10), C(bo, 8));
          }),
          (t.ɵdir = q({
            type: t,
            selectors: [["", "formGroup", ""]],
            hostBindings: function (n, r) {
              1 & n &&
                Ee("submit", function (o) {
                  return r.onSubmit(o);
                })("reset", function () {
                  return r.onReset();
                });
            },
            inputs: { form: ["formGroup", "form"] },
            outputs: { ngSubmit: "ngSubmit" },
            exportAs: ["ngForm"],
            features: [Me([DU]), de, Qt],
          })),
          t
        );
      })();
      const EU = { provide: Nr, useExisting: _e(() => dg) };
      let dg = (() => {
          class t extends Nr {
            set isDisabled(n) {}
            constructor(n, r, i, o, s) {
              super(),
                (this._ngModelWarningConfig = s),
                (this._added = !1),
                (this.name = null),
                (this.update = new Oe()),
                (this._ngModelWarningSent = !1),
                (this._parent = n),
                this._setValidators(r),
                this._setAsyncValidators(i),
                (this.valueAccessor = (function sg(t, e) {
                  if (!e) return null;
                  let n, r, i;
                  return (
                    Array.isArray(e),
                    e.forEach((o) => {
                      o.constructor === Bu
                        ? (n = o)
                        : (function cU(t) {
                            return Object.getPrototypeOf(t.constructor) === li;
                          })(o)
                        ? (r = o)
                        : (i = o);
                    }),
                    i || r || n || null
                  );
                })(0, o));
            }
            ngOnChanges(n) {
              this._added || this._setUpControl(),
                (function og(t, e) {
                  if (!t.hasOwnProperty("model")) return !1;
                  const n = t.model;
                  return !!n.isFirstChange() || !Object.is(e, n.currentValue);
                })(n, this.viewModel) &&
                  ((this.viewModel = this.model),
                  this.formDirective.updateModel(this, this.model));
            }
            ngOnDestroy() {
              this.formDirective && this.formDirective.removeControl(this);
            }
            viewToModelUpdate(n) {
              (this.viewModel = n), this.update.emit(n);
            }
            get path() {
              return (function Ku(t, e) {
                return [...e.path, t];
              })(
                null == this.name ? this.name : this.name.toString(),
                this._parent
              );
            }
            get formDirective() {
              return this._parent ? this._parent.formDirective : null;
            }
            _checkParentType() {}
            _setUpControl() {
              this._checkParentType(),
                (this.control = this.formDirective.addControl(this)),
                (this._added = !0);
            }
          }
          return (
            (t._ngModelWarningSentOnce = !1),
            (t.ɵfac = function (n) {
              return new (n || t)(
                C(Ct, 13),
                C(ft, 10),
                C(Rr, 10),
                C(Hn, 10),
                C(lg, 8)
              );
            }),
            (t.ɵdir = q({
              type: t,
              selectors: [["", "formControlName", ""]],
              inputs: {
                name: ["formControlName", "name"],
                isDisabled: ["disabled", "isDisabled"],
                model: ["ngModel", "model"],
              },
              outputs: { update: "ngModelChange" },
              features: [Me([EU]), de, Qt],
            })),
            t
          );
        })(),
        BU = (() => {
          class t {}
          return (
            (t.ɵfac = function (n) {
              return new (n || t)();
            }),
            (t.ɵmod = Qe({ type: t })),
            (t.ɵinj = ke({ imports: [JS] })),
            t
          );
        })();
      class gM extends Gu {
        constructor(e, n, r) {
          super(tg(n), ng(r, n)),
            (this.controls = e),
            this._initObservables(),
            this._setUpdateStrategy(n),
            this._setUpControls(),
            this.updateValueAndValidity({
              onlySelf: !0,
              emitEvent: !!this.asyncValidator,
            });
        }
        at(e) {
          return this.controls[this._adjustIndex(e)];
        }
        push(e, n = {}) {
          this.controls.push(e),
            this._registerControl(e),
            this.updateValueAndValidity({ emitEvent: n.emitEvent }),
            this._onCollectionChange();
        }
        insert(e, n, r = {}) {
          this.controls.splice(e, 0, n),
            this._registerControl(n),
            this.updateValueAndValidity({ emitEvent: r.emitEvent });
        }
        removeAt(e, n = {}) {
          let r = this._adjustIndex(e);
          r < 0 && (r = 0),
            this.controls[r] &&
              this.controls[r]._registerOnCollectionChange(() => {}),
            this.controls.splice(r, 1),
            this.updateValueAndValidity({ emitEvent: n.emitEvent });
        }
        setControl(e, n, r = {}) {
          let i = this._adjustIndex(e);
          i < 0 && (i = 0),
            this.controls[i] &&
              this.controls[i]._registerOnCollectionChange(() => {}),
            this.controls.splice(i, 1),
            n && (this.controls.splice(i, 0, n), this._registerControl(n)),
            this.updateValueAndValidity({ emitEvent: r.emitEvent }),
            this._onCollectionChange();
        }
        get length() {
          return this.controls.length;
        }
        setValue(e, n = {}) {
          jS(this, 0, e),
            e.forEach((r, i) => {
              BS(this, !1, i),
                this.at(i).setValue(r, {
                  onlySelf: !0,
                  emitEvent: n.emitEvent,
                });
            }),
            this.updateValueAndValidity(n);
        }
        patchValue(e, n = {}) {
          null != e &&
            (e.forEach((r, i) => {
              this.at(i) &&
                this.at(i).patchValue(r, {
                  onlySelf: !0,
                  emitEvent: n.emitEvent,
                });
            }),
            this.updateValueAndValidity(n));
        }
        reset(e = [], n = {}) {
          this._forEachChild((r, i) => {
            r.reset(e[i], { onlySelf: !0, emitEvent: n.emitEvent });
          }),
            this._updatePristine(n),
            this._updateTouched(n),
            this.updateValueAndValidity(n);
        }
        getRawValue() {
          return this.controls.map((e) => e.getRawValue());
        }
        clear(e = {}) {
          this.controls.length < 1 ||
            (this._forEachChild((n) => n._registerOnCollectionChange(() => {})),
            this.controls.splice(0),
            this.updateValueAndValidity({ emitEvent: e.emitEvent }));
        }
        _adjustIndex(e) {
          return e < 0 ? e + this.length : e;
        }
        _syncPendingControls() {
          let e = this.controls.reduce(
            (n, r) => !!r._syncPendingControls() || n,
            !1
          );
          return e && this.updateValueAndValidity({ onlySelf: !0 }), e;
        }
        _forEachChild(e) {
          this.controls.forEach((n, r) => {
            e(n, r);
          });
        }
        _updateValue() {
          this.value = this.controls
            .filter((e) => e.enabled || this.disabled)
            .map((e) => e.value);
        }
        _anyControls(e) {
          return this.controls.some((n) => n.enabled && e(n));
        }
        _setUpControls() {
          this._forEachChild((e) => this._registerControl(e));
        }
        _allControlsDisabled() {
          for (const e of this.controls) if (e.enabled) return !1;
          return this.controls.length > 0 || this.disabled;
        }
        _registerControl(e) {
          e.setParent(this),
            e._registerOnCollectionChange(this._onCollectionChange);
        }
        _find(e) {
          return this.at(e) ?? null;
        }
      }
      function mM(t) {
        return (
          !!t &&
          (void 0 !== t.asyncValidators ||
            void 0 !== t.validators ||
            void 0 !== t.updateOn)
        );
      }
      let jU = (() => {
          class t {
            constructor() {
              this.useNonNullable = !1;
            }
            get nonNullable() {
              const n = new t();
              return (n.useNonNullable = !0), n;
            }
            group(n, r = null) {
              const i = this._reduceControls(n);
              let o = {};
              return (
                mM(r)
                  ? (o = r)
                  : null !== r &&
                    ((o.validators = r.validator),
                    (o.asyncValidators = r.asyncValidator)),
                new Xs(i, o)
              );
            }
            record(n, r = null) {
              const i = this._reduceControls(n);
              return new HS(i, r);
            }
            control(n, r, i) {
              let o = {};
              return this.useNonNullable
                ? (mM(r)
                    ? (o = r)
                    : ((o.validators = r), (o.asyncValidators = i)),
                  new ui(n, { ...o, nonNullable: !0 }))
                : new ui(n, r, i);
            }
            array(n, r, i) {
              const o = n.map((s) => this._createControl(s));
              return new gM(o, r, i);
            }
            _reduceControls(n) {
              const r = {};
              return (
                Object.keys(n).forEach((i) => {
                  r[i] = this._createControl(n[i]);
                }),
                r
              );
            }
            _createControl(n) {
              return n instanceof ui || n instanceof Gu
                ? n
                : Array.isArray(n)
                ? this.control(
                    n[0],
                    n.length > 1 ? n[1] : null,
                    n.length > 2 ? n[2] : null
                  )
                : this.control(n);
            }
          }
          return (
            (t.ɵfac = function (n) {
              return new (n || t)();
            }),
            (t.ɵprov = T({ token: t, factory: t.ɵfac, providedIn: "root" })),
            t
          );
        })(),
        HU = (() => {
          class t {
            static withConfig(n) {
              return {
                ngModule: t,
                providers: [
                  {
                    provide: lg,
                    useValue: n.warnOnNgModelWithFormControl ?? "always",
                  },
                  { provide: bo, useValue: n.callSetDisabledState ?? Wu },
                ],
              };
            }
          }
          return (
            (t.ɵfac = function (n) {
              return new (n || t)();
            }),
            (t.ɵmod = Qe({ type: t })),
            (t.ɵinj = ke({ imports: [BU] })),
            t
          );
        })();
      function ta(t) {
        return (ta =
          "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
            ? function (e) {
                return typeof e;
              }
            : function (e) {
                return e &&
                  "function" == typeof Symbol &&
                  e.constructor === Symbol &&
                  e !== Symbol.prototype
                  ? "symbol"
                  : typeof e;
              })(t);
      }
      function S(t, e, n) {
        return (
          (e = (function UU(t) {
            var e = (function $U(t, e) {
              if ("object" !== ta(t) || null === t) return t;
              var n = t[Symbol.toPrimitive];
              if (void 0 !== n) {
                var r = n.call(t, e || "default");
                if ("object" !== ta(r)) return r;
                throw new TypeError(
                  "@@toPrimitive must return a primitive value."
                );
              }
              return ("string" === e ? String : Number)(t);
            })(t, "string");
            return "symbol" === ta(e) ? e : String(e);
          })(e)) in t
            ? Object.defineProperty(t, e, {
                value: n,
                enumerable: !0,
                configurable: !0,
                writable: !0,
              })
            : (t[e] = n),
          t
        );
      }
      class yM {}
      class zU {}
      const dr = "*";
      function gg(t, e) {
        return { type: 7, name: t, definitions: e, options: {} };
      }
      function Ju(t, e = null) {
        return { type: 4, styles: e, timings: t };
      }
      function vM(t, e = null) {
        return { type: 2, steps: t, options: e };
      }
      function vn(t) {
        return { type: 6, styles: t, offset: null };
      }
      function di(t, e, n) {
        return { type: 0, name: t, styles: e, options: n };
      }
      function ec(t, e, n = null) {
        return { type: 1, expr: t, animation: e, options: n };
      }
      function _M(t) {
        Promise.resolve().then(t);
      }
      class na {
        constructor(e = 0, n = 0) {
          (this._onDoneFns = []),
            (this._onStartFns = []),
            (this._onDestroyFns = []),
            (this._originalOnDoneFns = []),
            (this._originalOnStartFns = []),
            (this._started = !1),
            (this._destroyed = !1),
            (this._finished = !1),
            (this._position = 0),
            (this.parentPlayer = null),
            (this.totalTime = e + n);
        }
        _onFinish() {
          this._finished ||
            ((this._finished = !0),
            this._onDoneFns.forEach((e) => e()),
            (this._onDoneFns = []));
        }
        onStart(e) {
          this._originalOnStartFns.push(e), this._onStartFns.push(e);
        }
        onDone(e) {
          this._originalOnDoneFns.push(e), this._onDoneFns.push(e);
        }
        onDestroy(e) {
          this._onDestroyFns.push(e);
        }
        hasStarted() {
          return this._started;
        }
        init() {}
        play() {
          this.hasStarted() || (this._onStart(), this.triggerMicrotask()),
            (this._started = !0);
        }
        triggerMicrotask() {
          _M(() => this._onFinish());
        }
        _onStart() {
          this._onStartFns.forEach((e) => e()), (this._onStartFns = []);
        }
        pause() {}
        restart() {}
        finish() {
          this._onFinish();
        }
        destroy() {
          this._destroyed ||
            ((this._destroyed = !0),
            this.hasStarted() || this._onStart(),
            this.finish(),
            this._onDestroyFns.forEach((e) => e()),
            (this._onDestroyFns = []));
        }
        reset() {
          (this._started = !1),
            (this._finished = !1),
            (this._onStartFns = this._originalOnStartFns),
            (this._onDoneFns = this._originalOnDoneFns);
        }
        setPosition(e) {
          this._position = this.totalTime ? e * this.totalTime : 1;
        }
        getPosition() {
          return this.totalTime ? this._position / this.totalTime : 1;
        }
        triggerCallback(e) {
          const n = "start" == e ? this._onStartFns : this._onDoneFns;
          n.forEach((r) => r()), (n.length = 0);
        }
      }
      class CM {
        constructor(e) {
          (this._onDoneFns = []),
            (this._onStartFns = []),
            (this._finished = !1),
            (this._started = !1),
            (this._destroyed = !1),
            (this._onDestroyFns = []),
            (this.parentPlayer = null),
            (this.totalTime = 0),
            (this.players = e);
          let n = 0,
            r = 0,
            i = 0;
          const o = this.players.length;
          0 == o
            ? _M(() => this._onFinish())
            : this.players.forEach((s) => {
                s.onDone(() => {
                  ++n == o && this._onFinish();
                }),
                  s.onDestroy(() => {
                    ++r == o && this._onDestroy();
                  }),
                  s.onStart(() => {
                    ++i == o && this._onStart();
                  });
              }),
            (this.totalTime = this.players.reduce(
              (s, a) => Math.max(s, a.totalTime),
              0
            ));
        }
        _onFinish() {
          this._finished ||
            ((this._finished = !0),
            this._onDoneFns.forEach((e) => e()),
            (this._onDoneFns = []));
        }
        init() {
          this.players.forEach((e) => e.init());
        }
        onStart(e) {
          this._onStartFns.push(e);
        }
        _onStart() {
          this.hasStarted() ||
            ((this._started = !0),
            this._onStartFns.forEach((e) => e()),
            (this._onStartFns = []));
        }
        onDone(e) {
          this._onDoneFns.push(e);
        }
        onDestroy(e) {
          this._onDestroyFns.push(e);
        }
        hasStarted() {
          return this._started;
        }
        play() {
          this.parentPlayer || this.init(),
            this._onStart(),
            this.players.forEach((e) => e.play());
        }
        pause() {
          this.players.forEach((e) => e.pause());
        }
        restart() {
          this.players.forEach((e) => e.restart());
        }
        finish() {
          this._onFinish(), this.players.forEach((e) => e.finish());
        }
        destroy() {
          this._onDestroy();
        }
        _onDestroy() {
          this._destroyed ||
            ((this._destroyed = !0),
            this._onFinish(),
            this.players.forEach((e) => e.destroy()),
            this._onDestroyFns.forEach((e) => e()),
            (this._onDestroyFns = []));
        }
        reset() {
          this.players.forEach((e) => e.reset()),
            (this._destroyed = !1),
            (this._finished = !1),
            (this._started = !1);
        }
        setPosition(e) {
          const n = e * this.totalTime;
          this.players.forEach((r) => {
            const i = r.totalTime ? Math.min(1, n / r.totalTime) : 1;
            r.setPosition(i);
          });
        }
        getPosition() {
          const e = this.players.reduce(
            (n, r) => (null === n || r.totalTime > n.totalTime ? r : n),
            null
          );
          return null != e ? e.getPosition() : 0;
        }
        beforeDestroy() {
          this.players.forEach((e) => {
            e.beforeDestroy && e.beforeDestroy();
          });
        }
        triggerCallback(e) {
          const n = "start" == e ? this._onStartFns : this._onDoneFns;
          n.forEach((r) => r()), (n.length = 0);
        }
      }
      const DM = ["toast-component", ""];
      function qU(t, e) {
        if (1 & t) {
          const n = Qr();
          x(0, "button", 5),
            Ee("click", function () {
              return Tn(n), An(Se().remove());
            }),
            x(1, "span", 6),
            z(2, "\xd7"),
            N()();
        }
      }
      function GU(t, e) {
        if ((1 & t && (ps(0), z(1), gs()), 2 & t)) {
          const n = Se(2);
          U(1), Ht("[", n.duplicatesCount + 1, "]");
        }
      }
      function WU(t, e) {
        if (
          (1 & t &&
            (x(0, "div"), z(1), ye(2, GU, 2, 1, "ng-container", 4), N()),
          2 & t)
        ) {
          const n = Se();
          nr(n.options.titleClass),
            It("aria-label", n.title),
            U(1),
            Ht(" ", n.title, " "),
            U(1),
            re("ngIf", n.duplicatesCount);
        }
      }
      function KU(t, e) {
        if ((1 & t && Be(0, "div", 7), 2 & t)) {
          const n = Se();
          nr(n.options.messageClass), re("innerHTML", n.message, Zd);
        }
      }
      function QU(t, e) {
        if ((1 & t && (x(0, "div", 8), z(1), N()), 2 & t)) {
          const n = Se();
          nr(n.options.messageClass),
            It("aria-label", n.message),
            U(1),
            Ht(" ", n.message, " ");
        }
      }
      function ZU(t, e) {
        if ((1 & t && (x(0, "div"), Be(1, "div", 9), N()), 2 & t)) {
          const n = Se();
          U(1), eo("width", n.width + "%");
        }
      }
      class r3 {
        constructor(e, n) {
          S(this, "_attachedHost", void 0),
            S(this, "component", void 0),
            S(this, "viewContainerRef", void 0),
            S(this, "injector", void 0),
            (this.component = e),
            (this.injector = n);
        }
        attach(e, n) {
          return (this._attachedHost = e), e.attach(this, n);
        }
        detach() {
          const e = this._attachedHost;
          if (e) return (this._attachedHost = void 0), e.detach();
        }
        get isAttached() {
          return null != this._attachedHost;
        }
        setAttachedHost(e) {
          this._attachedHost = e;
        }
      }
      class i3 {
        constructor() {
          S(this, "_attachedPortal", void 0), S(this, "_disposeFn", void 0);
        }
        attach(e, n) {
          return (this._attachedPortal = e), this.attachComponentPortal(e, n);
        }
        detach() {
          this._attachedPortal && this._attachedPortal.setAttachedHost(),
            (this._attachedPortal = void 0),
            this._disposeFn && (this._disposeFn(), (this._disposeFn = void 0));
        }
        setDisposeFn(e) {
          this._disposeFn = e;
        }
      }
      class o3 {
        constructor(e) {
          S(this, "_overlayRef", void 0),
            S(this, "componentInstance", void 0),
            S(this, "duplicatesCount", 0),
            S(this, "_afterClosed", new qe()),
            S(this, "_activate", new qe()),
            S(this, "_manualClose", new qe()),
            S(this, "_resetTimeout", new qe()),
            S(this, "_countDuplicate", new qe()),
            (this._overlayRef = e);
        }
        manualClose() {
          this._manualClose.next(), this._manualClose.complete();
        }
        manualClosed() {
          return this._manualClose.asObservable();
        }
        timeoutReset() {
          return this._resetTimeout.asObservable();
        }
        countDuplicate() {
          return this._countDuplicate.asObservable();
        }
        close() {
          this._overlayRef.detach(),
            this._afterClosed.next(),
            this._manualClose.next(),
            this._afterClosed.complete(),
            this._manualClose.complete(),
            this._activate.complete(),
            this._resetTimeout.complete(),
            this._countDuplicate.complete();
        }
        afterClosed() {
          return this._afterClosed.asObservable();
        }
        isInactive() {
          return this._activate.isStopped;
        }
        activate() {
          this._activate.next(), this._activate.complete();
        }
        afterActivate() {
          return this._activate.asObservable();
        }
        onDuplicate(e, n) {
          e && this._resetTimeout.next(),
            n && this._countDuplicate.next(++this.duplicatesCount);
        }
      }
      class tc {
        constructor(e, n, r, i, o, s) {
          S(this, "toastId", void 0),
            S(this, "config", void 0),
            S(this, "message", void 0),
            S(this, "title", void 0),
            S(this, "toastType", void 0),
            S(this, "toastRef", void 0),
            S(this, "_onTap", new qe()),
            S(this, "_onAction", new qe()),
            (this.toastId = e),
            (this.config = n),
            (this.message = r),
            (this.title = i),
            (this.toastType = o),
            (this.toastRef = s),
            this.toastRef.afterClosed().subscribe(() => {
              this._onAction.complete(), this._onTap.complete();
            });
        }
        triggerTap() {
          this._onTap.next(),
            this.config.tapToDismiss && this._onTap.complete();
        }
        onTap() {
          return this._onTap.asObservable();
        }
        triggerAction(e) {
          this._onAction.next(e);
        }
        onAction() {
          return this._onAction.asObservable();
        }
      }
      const bM = new b("ToastConfig");
      class s3 extends i3 {
        constructor(e, n, r) {
          super(),
            S(this, "_hostDomElement", void 0),
            S(this, "_componentFactoryResolver", void 0),
            S(this, "_appRef", void 0),
            (this._hostDomElement = e),
            (this._componentFactoryResolver = n),
            (this._appRef = r);
        }
        attachComponentPortal(e, n) {
          const r = this._componentFactoryResolver.resolveComponentFactory(
            e.component
          );
          let i;
          return (
            (i = r.create(e.injector)),
            this._appRef.attachView(i.hostView),
            this.setDisposeFn(() => {
              this._appRef.detachView(i.hostView), i.destroy();
            }),
            n
              ? this._hostDomElement.insertBefore(
                  this._getComponentRootNode(i),
                  this._hostDomElement.firstChild
                )
              : this._hostDomElement.appendChild(this._getComponentRootNode(i)),
            i
          );
        }
        _getComponentRootNode(e) {
          return e.hostView.rootNodes[0];
        }
      }
      let a3 = (() => {
        class t {
          constructor() {
            S(this, "_document", E(Je)), S(this, "_containerElement", void 0);
          }
          ngOnDestroy() {
            this._containerElement &&
              this._containerElement.parentNode &&
              this._containerElement.parentNode.removeChild(
                this._containerElement
              );
          }
          getContainerElement() {
            return (
              this._containerElement || this._createContainer(),
              this._containerElement
            );
          }
          _createContainer() {
            const n = this._document.createElement("div");
            n.classList.add("overlay-container"),
              n.setAttribute("aria-live", "polite"),
              this._document.body.appendChild(n),
              (this._containerElement = n);
          }
        }
        return (
          S(t, "\u0275fac", function (n) {
            return new (n || t)();
          }),
          S(
            t,
            "\u0275prov",
            T({ token: t, factory: t.ɵfac, providedIn: "root" })
          ),
          t
        );
      })();
      class l3 {
        constructor(e) {
          S(this, "_portalHost", void 0), (this._portalHost = e);
        }
        attach(e, n = !0) {
          return this._portalHost.attach(e, n);
        }
        detach() {
          return this._portalHost.detach();
        }
      }
      let u3 = (() => {
          class t {
            constructor() {
              S(this, "_overlayContainer", E(a3)),
                S(this, "_componentFactoryResolver", E(ns)),
                S(this, "_appRef", E(sr)),
                S(this, "_document", E(Je)),
                S(this, "_paneElements", new Map());
            }
            create(n, r) {
              return this._createOverlayRef(this.getPaneElement(n, r));
            }
            getPaneElement(n = "", r) {
              return (
                this._paneElements.get(r) || this._paneElements.set(r, {}),
                this._paneElements.get(r)[n] ||
                  (this._paneElements.get(r)[n] = this._createPaneElement(
                    n,
                    r
                  )),
                this._paneElements.get(r)[n]
              );
            }
            _createPaneElement(n, r) {
              const i = this._document.createElement("div");
              return (
                (i.id = "toast-container"),
                i.classList.add(n),
                i.classList.add("toast-container"),
                r
                  ? r.getContainerElement().appendChild(i)
                  : this._overlayContainer.getContainerElement().appendChild(i),
                i
              );
            }
            _createPortalHost(n) {
              return new s3(n, this._componentFactoryResolver, this._appRef);
            }
            _createOverlayRef(n) {
              return new l3(this._createPortalHost(n));
            }
          }
          return (
            S(t, "\u0275fac", function (n) {
              return new (n || t)();
            }),
            S(
              t,
              "\u0275prov",
              T({ token: t, factory: t.ɵfac, providedIn: "root" })
            ),
            t
          );
        })(),
        nc = (() => {
          class t {
            constructor(n, r, i, o, s) {
              S(this, "overlay", void 0),
                S(this, "_injector", void 0),
                S(this, "sanitizer", void 0),
                S(this, "ngZone", void 0),
                S(this, "toastrConfig", void 0),
                S(this, "currentlyActive", 0),
                S(this, "toasts", []),
                S(this, "overlayContainer", void 0),
                S(this, "previousToastMessage", void 0),
                S(this, "index", 0),
                (this.overlay = r),
                (this._injector = i),
                (this.sanitizer = o),
                (this.ngZone = s),
                (this.toastrConfig = { ...n.default, ...n.config }),
                n.config.iconClasses &&
                  (this.toastrConfig.iconClasses = {
                    ...n.default.iconClasses,
                    ...n.config.iconClasses,
                  });
            }
            show(n, r, i = {}, o = "") {
              return this._preBuildNotification(o, n, r, this.applyConfig(i));
            }
            success(n, r, i = {}) {
              return this._preBuildNotification(
                this.toastrConfig.iconClasses.success || "",
                n,
                r,
                this.applyConfig(i)
              );
            }
            error(n, r, i = {}) {
              return this._preBuildNotification(
                this.toastrConfig.iconClasses.error || "",
                n,
                r,
                this.applyConfig(i)
              );
            }
            info(n, r, i = {}) {
              return this._preBuildNotification(
                this.toastrConfig.iconClasses.info || "",
                n,
                r,
                this.applyConfig(i)
              );
            }
            warning(n, r, i = {}) {
              return this._preBuildNotification(
                this.toastrConfig.iconClasses.warning || "",
                n,
                r,
                this.applyConfig(i)
              );
            }
            clear(n) {
              for (const r of this.toasts)
                if (void 0 !== n) {
                  if (r.toastId === n) return void r.toastRef.manualClose();
                } else r.toastRef.manualClose();
            }
            remove(n) {
              const r = this._findToast(n);
              if (
                !r ||
                (r.activeToast.toastRef.close(),
                this.toasts.splice(r.index, 1),
                (this.currentlyActive = this.currentlyActive - 1),
                !this.toastrConfig.maxOpened || !this.toasts.length)
              )
                return !1;
              if (
                this.currentlyActive < this.toastrConfig.maxOpened &&
                this.toasts[this.currentlyActive]
              ) {
                const i = this.toasts[this.currentlyActive].toastRef;
                i.isInactive() ||
                  ((this.currentlyActive = this.currentlyActive + 1),
                  i.activate());
              }
              return !0;
            }
            findDuplicate(n = "", r = "", i, o) {
              const { includeTitleDuplicates: s } = this.toastrConfig;
              for (const a of this.toasts)
                if ((!s || (s && a.title === n)) && a.message === r)
                  return a.toastRef.onDuplicate(i, o), a;
              return null;
            }
            applyConfig(n = {}) {
              return { ...this.toastrConfig, ...n };
            }
            _findToast(n) {
              for (let r = 0; r < this.toasts.length; r++)
                if (this.toasts[r].toastId === n)
                  return { index: r, activeToast: this.toasts[r] };
              return null;
            }
            _preBuildNotification(n, r, i, o) {
              return o.onActivateTick
                ? this.ngZone.run(() => this._buildNotification(n, r, i, o))
                : this._buildNotification(n, r, i, o);
            }
            _buildNotification(n, r, i, o) {
              if (!o.toastComponent) throw new Error("toastComponent required");
              const s = this.findDuplicate(
                i,
                r,
                this.toastrConfig.resetTimeoutOnDuplicate && o.timeOut > 0,
                this.toastrConfig.countDuplicates
              );
              if (
                ((this.toastrConfig.includeTitleDuplicates && i) || r) &&
                this.toastrConfig.preventDuplicates &&
                null !== s
              )
                return s;
              this.previousToastMessage = r;
              let a = !1;
              this.toastrConfig.maxOpened &&
                this.currentlyActive >= this.toastrConfig.maxOpened &&
                ((a = !0),
                this.toastrConfig.autoDismiss &&
                  this.clear(this.toasts[0].toastId));
              const l = this.overlay.create(
                o.positionClass,
                this.overlayContainer
              );
              this.index = this.index + 1;
              let u = r;
              r && o.enableHtml && (u = this.sanitizer.sanitize(me.HTML, r));
              const c = new o3(l),
                d = new tc(this.index, o, u, i, n, c),
                h = Bt.create({
                  providers: [{ provide: tc, useValue: d }],
                  parent: this._injector,
                }),
                p = new r3(o.toastComponent, h),
                g = l.attach(p, o.newestOnTop);
              c.componentInstance = g.instance;
              const m = {
                toastId: this.index,
                title: i || "",
                message: r || "",
                toastRef: c,
                onShown: c.afterActivate(),
                onHidden: c.afterClosed(),
                onTap: d.onTap(),
                onAction: d.onAction(),
                portal: g,
              };
              return (
                a ||
                  ((this.currentlyActive = this.currentlyActive + 1),
                  setTimeout(() => {
                    m.toastRef.activate();
                  })),
                this.toasts.push(m),
                m
              );
            }
          }
          return (
            S(t, "\u0275fac", function (n) {
              return new (n || t)(D(bM), D(u3), D(Bt), D(hE), D(he));
            }),
            S(
              t,
              "\u0275prov",
              T({ token: t, factory: t.ɵfac, providedIn: "root" })
            ),
            t
          );
        })();
      const c3 = {
          maxOpened: 0,
          autoDismiss: !1,
          newestOnTop: !0,
          preventDuplicates: !1,
          countDuplicates: !1,
          resetTimeoutOnDuplicate: !1,
          includeTitleDuplicates: !1,
          iconClasses: {
            error: "toast-error",
            info: "toast-info",
            success: "toast-success",
            warning: "toast-warning",
          },
          closeButton: !1,
          disableTimeOut: !1,
          timeOut: 5e3,
          extendedTimeOut: 1e3,
          enableHtml: !1,
          progressBar: !1,
          toastClass: "ngx-toastr",
          positionClass: "toast-top-right",
          titleClass: "toast-title",
          messageClass: "toast-message",
          easing: "ease-in",
          easeTime: 300,
          tapToDismiss: !0,
          onActivateTick: !1,
          progressAnimation: "decreasing",
          toastComponent: (() => {
            class t {
              get displayStyle() {
                if ("inactive" === this.state.value) return "none";
              }
              constructor(n, r, i) {
                S(this, "toastrService", void 0),
                  S(this, "toastPackage", void 0),
                  S(this, "ngZone", void 0),
                  S(this, "message", void 0),
                  S(this, "title", void 0),
                  S(this, "options", void 0),
                  S(this, "duplicatesCount", void 0),
                  S(this, "originalTimeout", void 0),
                  S(this, "width", -1),
                  S(this, "toastClasses", ""),
                  S(this, "state", void 0),
                  S(this, "timeout", void 0),
                  S(this, "intervalId", void 0),
                  S(this, "hideTime", void 0),
                  S(this, "sub", void 0),
                  S(this, "sub1", void 0),
                  S(this, "sub2", void 0),
                  S(this, "sub3", void 0),
                  (this.toastrService = n),
                  (this.toastPackage = r),
                  (this.ngZone = i),
                  (this.message = r.message),
                  (this.title = r.title),
                  (this.options = r.config),
                  (this.originalTimeout = r.config.timeOut),
                  (this.toastClasses = `${r.toastType} ${r.config.toastClass}`),
                  (this.sub = r.toastRef.afterActivate().subscribe(() => {
                    this.activateToast();
                  })),
                  (this.sub1 = r.toastRef.manualClosed().subscribe(() => {
                    this.remove();
                  })),
                  (this.sub2 = r.toastRef.timeoutReset().subscribe(() => {
                    this.resetTimeout();
                  })),
                  (this.sub3 = r.toastRef.countDuplicate().subscribe((o) => {
                    this.duplicatesCount = o;
                  })),
                  (this.state = {
                    value: "inactive",
                    params: {
                      easeTime: this.toastPackage.config.easeTime,
                      easing: "ease-in",
                    },
                  });
              }
              ngOnDestroy() {
                this.sub.unsubscribe(),
                  this.sub1.unsubscribe(),
                  this.sub2.unsubscribe(),
                  this.sub3.unsubscribe(),
                  clearInterval(this.intervalId),
                  clearTimeout(this.timeout);
              }
              activateToast() {
                (this.state = { ...this.state, value: "active" }),
                  !0 !== this.options.disableTimeOut &&
                    "timeOut" !== this.options.disableTimeOut &&
                    this.options.timeOut &&
                    (this.outsideTimeout(
                      () => this.remove(),
                      this.options.timeOut
                    ),
                    (this.hideTime =
                      new Date().getTime() + this.options.timeOut),
                    this.options.progressBar &&
                      this.outsideInterval(() => this.updateProgress(), 10));
              }
              updateProgress() {
                if (
                  0 === this.width ||
                  100 === this.width ||
                  !this.options.timeOut
                )
                  return;
                const n = new Date().getTime();
                (this.width =
                  ((this.hideTime - n) / this.options.timeOut) * 100),
                  "increasing" === this.options.progressAnimation &&
                    (this.width = 100 - this.width),
                  this.width <= 0 && (this.width = 0),
                  this.width >= 100 && (this.width = 100);
              }
              resetTimeout() {
                clearTimeout(this.timeout),
                  clearInterval(this.intervalId),
                  (this.state = { ...this.state, value: "active" }),
                  this.outsideTimeout(
                    () => this.remove(),
                    this.originalTimeout
                  ),
                  (this.options.timeOut = this.originalTimeout),
                  (this.hideTime =
                    new Date().getTime() + (this.options.timeOut || 0)),
                  (this.width = -1),
                  this.options.progressBar &&
                    this.outsideInterval(() => this.updateProgress(), 10);
              }
              remove() {
                "removed" !== this.state.value &&
                  (clearTimeout(this.timeout),
                  (this.state = { ...this.state, value: "removed" }),
                  this.outsideTimeout(
                    () => this.toastrService.remove(this.toastPackage.toastId),
                    +this.toastPackage.config.easeTime
                  ));
              }
              tapToast() {
                "removed" !== this.state.value &&
                  (this.toastPackage.triggerTap(),
                  this.options.tapToDismiss && this.remove());
              }
              stickAround() {
                "removed" !== this.state.value &&
                  "extendedTimeOut" !== this.options.disableTimeOut &&
                  (clearTimeout(this.timeout),
                  (this.options.timeOut = 0),
                  (this.hideTime = 0),
                  clearInterval(this.intervalId),
                  (this.width = 0));
              }
              delayedHideToast() {
                !0 === this.options.disableTimeOut ||
                  "extendedTimeOut" === this.options.disableTimeOut ||
                  0 === this.options.extendedTimeOut ||
                  "removed" === this.state.value ||
                  (this.outsideTimeout(
                    () => this.remove(),
                    this.options.extendedTimeOut
                  ),
                  (this.options.timeOut = this.options.extendedTimeOut),
                  (this.hideTime =
                    new Date().getTime() + (this.options.timeOut || 0)),
                  (this.width = -1),
                  this.options.progressBar &&
                    this.outsideInterval(() => this.updateProgress(), 10));
              }
              outsideTimeout(n, r) {
                this.ngZone
                  ? this.ngZone.runOutsideAngular(
                      () =>
                        (this.timeout = setTimeout(
                          () => this.runInsideAngular(n),
                          r
                        ))
                    )
                  : (this.timeout = setTimeout(() => n(), r));
              }
              outsideInterval(n, r) {
                this.ngZone
                  ? this.ngZone.runOutsideAngular(
                      () =>
                        (this.intervalId = setInterval(
                          () => this.runInsideAngular(n),
                          r
                        ))
                    )
                  : (this.intervalId = setInterval(() => n(), r));
              }
              runInsideAngular(n) {
                this.ngZone ? this.ngZone.run(() => n()) : n();
              }
            }
            return (
              S(t, "\u0275fac", function (n) {
                return new (n || t)(C(nc), C(tc), C(he));
              }),
              S(
                t,
                "\u0275cmp",
                Kt({
                  type: t,
                  selectors: [["", "toast-component", ""]],
                  hostVars: 5,
                  hostBindings: function (n, r) {
                    1 & n &&
                      Ee("click", function () {
                        return r.tapToast();
                      })("mouseenter", function () {
                        return r.stickAround();
                      })("mouseleave", function () {
                        return r.delayedHideToast();
                      }),
                      2 & n &&
                        ($f("@flyInOut", r.state),
                        nr(r.toastClasses),
                        eo("display", r.displayStyle));
                  },
                  standalone: !0,
                  features: [Hl],
                  attrs: DM,
                  decls: 5,
                  vars: 5,
                  consts: [
                    [
                      "type",
                      "button",
                      "class",
                      "toast-close-button",
                      "aria-label",
                      "Close",
                      3,
                      "click",
                      4,
                      "ngIf",
                    ],
                    [3, "class", 4, "ngIf"],
                    ["role", "alert", 3, "class", "innerHTML", 4, "ngIf"],
                    ["role", "alert", 3, "class", 4, "ngIf"],
                    [4, "ngIf"],
                    [
                      "type",
                      "button",
                      "aria-label",
                      "Close",
                      1,
                      "toast-close-button",
                      3,
                      "click",
                    ],
                    ["aria-hidden", "true"],
                    ["role", "alert", 3, "innerHTML"],
                    ["role", "alert"],
                    [1, "toast-progress"],
                  ],
                  template: function (n, r) {
                    1 & n &&
                      (ye(0, qU, 3, 0, "button", 0),
                      ye(1, WU, 3, 5, "div", 1),
                      ye(2, KU, 1, 3, "div", 2),
                      ye(3, QU, 2, 4, "div", 3),
                      ye(4, ZU, 2, 2, "div", 4)),
                      2 & n &&
                        (re("ngIf", r.options.closeButton),
                        U(1),
                        re("ngIf", r.title),
                        U(1),
                        re("ngIf", r.message && r.options.enableHtml),
                        U(1),
                        re("ngIf", r.message && !r.options.enableHtml),
                        U(1),
                        re("ngIf", r.options.progressBar));
                  },
                  dependencies: [ao],
                  encapsulation: 2,
                  data: {
                    animation: [
                      gg("flyInOut", [
                        di("inactive", vn({ opacity: 0 })),
                        di("active", vn({ opacity: 1 })),
                        di("removed", vn({ opacity: 0 })),
                        ec(
                          "inactive => active",
                          Ju("{{ easeTime }}ms {{ easing }}")
                        ),
                        ec(
                          "active => removed",
                          Ju("{{ easeTime }}ms {{ easing }}")
                        ),
                      ]),
                    ],
                  },
                })
              ),
              t
            );
          })(),
        },
        d3 = (t = {}) =>
          fl([{ provide: bM, useValue: { default: c3, config: t } }]);
      let f3 = (() => {
        class t {
          static forRoot(n = {}) {
            return { ngModule: t, providers: [d3(n)] };
          }
        }
        return (
          S(t, "\u0275fac", function (n) {
            return new (n || t)();
          }),
          S(t, "\u0275mod", Qe({ type: t })),
          S(t, "\u0275inj", ke({})),
          t
        );
      })();
      function h3(t, e) {
        1 & t && (x(0, "label", 23), z(1, "Email is requried"), N());
      }
      function p3(t, e) {
        1 & t &&
          (x(0, "label", 23), z(1, "Email should be proper formate"), N());
      }
      function g3(t, e) {
        if (
          (1 & t &&
            (x(0, "div", 21),
            ye(1, h3, 2, 0, "label", 22),
            ye(2, p3, 2, 0, "label", 22),
            N()),
          2 & t)
        ) {
          const n = Se();
          U(1),
            re("ngIf", n.submitted && n.form.controls.email.errors.required),
            U(1),
            re("ngIf", n.submitted && n.form.controls.email.errors.email);
        }
      }
      function m3(t, e) {
        1 & t && (x(0, "label", 23), z(1, "Password is requried"), N());
      }
      function y3(t, e) {
        1 & t && (x(0, "label", 23), z(1, "Password min more than 4 "), N());
      }
      function v3(t, e) {
        if (
          (1 & t &&
            (x(0, "div", 21),
            ye(1, m3, 2, 0, "label", 22),
            ye(2, y3, 2, 0, "label", 22),
            N()),
          2 & t)
        ) {
          const n = Se();
          U(1),
            re("ngIf", n.submitted && n.form.controls.password.errors.required),
            U(1),
            re(
              "ngIf",
              n.submitted && n.form.controls.password.errors.minlength
            );
        }
      }
      let _3 = (() => {
        class t {
          constructor(n, r, i, o) {
            (this.formBuilder = n),
              (this.kitchenService = r),
              (this.tostr = i),
              (this.router = o),
              (this.submitted = !1);
          }
          ngOnInit() {
            this.form = this.formBuilder.group({
              email: new ui("", [ju.required, ju.email]),
              password: new ui("", [ju.required, ju.minLength(4)]),
            });
          }
          KitchenLogin() {
            if (((this.submitted = !0), this.form.invalid)) return;
            let n = this.form.getRawValue();
            this.kitchenService.staffLogin(n).subscribe(
              (r) => {
                this.router.navigate(["/"]),
                  localStorage.setItem("kitchen-staffs", " true_and_verifyed"),
                  localStorage.setItem("token", r.token),
                  localStorage.setItem("resId", r.resId);
              },
              (r) => {
                this.tostr.error(r.error.message),
                  console.log(r.error.message),
                  this.router.navigate(["/kitchenLogin"]);
              }
            );
          }
        }
        return (
          (t.ɵfac = function (n) {
            return new (n || t)(C(jU), C(ai), C(nc), C(dt));
          }),
          (t.ɵcmp = Kt({
            type: t,
            selectors: [["app-kitchen-login"]],
            decls: 32,
            vars: 3,
            consts: [
              [1, "container", "mx-auto", "mt-5"],
              [1, "card", "card0"],
              [1, "d-flex", "flex-lg-row", "flex-column-reverse"],
              [1, "card", "card2"],
              [1, "my-auto", "mx-md-5", "px-md-5", "right"],
              [1, "text-white"],
              [1, "card", "card1"],
              [1, "row", "justify-content-center", "my-auto"],
              [1, "col-md-8", "col-10"],
              [1, "row", "justify-content-center", "px-3", "mb-3"],
              ["id", "logo", "src", "https://i.imgur.com/PSXxjNY.png"],
              [1, "mb-5", "text-center", "heading"],
              [1, "msg-info"],
              [3, "formGroup", "submit"],
              [1, "form-group"],
              [1, "form-control-label", "text-muted"],
              [
                "formControlName",
                "email",
                "type",
                "text",
                "id",
                "email",
                "name",
                "email",
                "placeholder",
                "Phone no or email id",
                1,
                "form-control",
              ],
              ["class", "text-danger emailerror", 4, "ngIf"],
              [
                "formControlName",
                "password",
                "type",
                "password",
                "placeholder",
                "Password",
                1,
                "form-control",
              ],
              [1, "row", "justify-content-center", "my-3", "px-3"],
              ["type", "submit", 1, "btn-block", "btn-color"],
              [1, "text-danger", "emailerror"],
              ["class", "form-control-label text-danger", 4, "ngIf"],
              [1, "form-control-label", "text-danger"],
            ],
            template: function (n, r) {
              1 & n &&
                (x(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(
                  4,
                  "div",
                  4
                )(5, "h3", 5),
                z(6, "We are more than just a company"),
                N(),
                x(7, "small", 5),
                z(
                  8,
                  "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
                ),
                N()()(),
                x(9, "div", 6)(10, "div", 7)(11, "div", 8)(12, "div", 9),
                Be(13, "img", 10),
                N(),
                x(14, "h3", 11),
                z(15, "Welcome To Turfyo"),
                N(),
                x(16, "h6", 12),
                z(17, "Please login to your account"),
                N(),
                x(18, "form", 13),
                Ee("submit", function () {
                  return r.KitchenLogin();
                }),
                x(19, "div", 14)(20, "label", 15),
                z(21, "Email"),
                N(),
                Be(22, "input", 16),
                ye(23, g3, 3, 2, "div", 17),
                x(24, "div", 14)(25, "label", 15),
                z(26, "Password"),
                N(),
                Be(27, "input", 18),
                ye(28, v3, 3, 2, "div", 17),
                N(),
                x(29, "div", 19)(30, "button", 20),
                z(31, " Login to Turfyo "),
                N()()()()()()()()()()),
                2 & n &&
                  (U(18),
                  re("formGroup", r.form),
                  U(5),
                  re("ngIf", r.form.controls.email.errors),
                  U(5),
                  re("ngIf", r.form.controls.password.errors));
            },
            dependencies: [ao, YS, Bu, kS, LS, Xu, dg],
            styles: [
              ".form-outline[_ngcontent-%COMP%]   .form-control[_ngcontent-%COMP%]{border:solid .2px rgb(243,110,8);border-radius:20px;box-shadow:none}.custom-toast[_ngcontent-%COMP%]{width:20px;height:20px}body[_ngcontent-%COMP%]{color:#000;overflow-x:hidden;height:100%;background-image:linear-gradient(to right,#D500F9,#FFD54F);background-repeat:no-repeat}input[_ngcontent-%COMP%], textarea[_ngcontent-%COMP%]{background-color:#f3e5f5;border-radius:50px!important;padding:12px 15px!important;width:100%;box-sizing:border-box;border:none!important;border:1px solid #F3E5F5!important;font-size:16px!important;color:#000!important;font-weight:400}input[_ngcontent-%COMP%]:focus, textarea[_ngcontent-%COMP%]:focus{box-shadow:none!important;border:1px solid #f98715ec!important;outline-width:0;font-weight:400}button[_ngcontent-%COMP%]:focus{box-shadow:none!important;outline-width:0}.card[_ngcontent-%COMP%]{border-radius:0;border:none}.card1[_ngcontent-%COMP%]{width:50%;padding:40px 30px 10px}.card2[_ngcontent-%COMP%]{width:50%;border-radius:25px;background-image:linear-gradient(to right,#f5c118,#f98715ec)}#logo[_ngcontent-%COMP%]{width:70px;height:60px}.heading[_ngcontent-%COMP%]{margin-bottom:60px!important;font-weight:700;color:#f57b18}[_ngcontent-%COMP%]::placeholder{color:#f98715ec!important;opacity:1}[_ngcontent-%COMP%]:-ms-input-placeholder{color:#f98715ec!important}[_ngcontent-%COMP%]::-ms-input-placeholder{color:#f98715ec!important}.form-control-label[_ngcontent-%COMP%]{font-size:12px;margin-left:15px}.msg-info[_ngcontent-%COMP%]{padding-left:15px;margin-bottom:30px}.btn-color[_ngcontent-%COMP%]{border-radius:50px;color:#fff;background-image:linear-gradient(to right,#f5c118,#f98715ec);padding:15px;cursor:pointer;border:none!important;margin-top:40px}.btn-color[_ngcontent-%COMP%]:hover{color:#fff;background-image:linear-gradient(to right,#f98715ec,#FFD54F)}.btn-white[_ngcontent-%COMP%]{border-radius:50px;color:#d500f9;background-color:#fff;padding:8px 40px;cursor:pointer;border:2px solid #D500F9!important}.btn-white[_ngcontent-%COMP%]:hover{color:#fff;background-image:linear-gradient(to right,#FFD54F,#D500F9)}a[_ngcontent-%COMP%], a[_ngcontent-%COMP%]:hover{color:#000}.bottom[_ngcontent-%COMP%]{width:100%;margin-top:50px!important}.sm-text[_ngcontent-%COMP%]{font-size:15px}@media screen and (max-width: 992px){.card1[_ngcontent-%COMP%]{width:100%;padding:40px 30px 10px}.card2[_ngcontent-%COMP%]{width:100%}.right[_ngcontent-%COMP%]{margin-top:100px!important;margin-bottom:100px!important}}@media screen and (max-width: 768px){.container[_ngcontent-%COMP%]{padding:10px!important}.card2[_ngcontent-%COMP%]{padding:50px}.right[_ngcontent-%COMP%]{margin-top:50px!important;margin-bottom:50px!important}}@media screen and (max-width:450px){.container[_ngcontent-%COMP%]{width:100%}.card2[_ngcontent-%COMP%]{padding:50px}.right[_ngcontent-%COMP%]{margin-top:50px!important;margin-bottom:50px!important}}.fixed-div[_ngcontent-%COMP%]{position:fixed;top:0;left:0}",
            ],
          })),
          t
        );
      })();
      const C3 = gg("fadeOut", [
          di("visible", vn({ opacity: 1 })),
          di("hidden", vn({ opacity: 0 })),
          ec("visible => hidden", [
            vn({ transform: "scale(0)" }),
            Ju("300ms ease-out"),
          ]),
        ]),
        D3 = gg("fadeIn", [
          di("visible", vn({ opacity: 1 })),
          di("hidden", vn({ opacity: 0 })),
          ec("hidden => visible", [
            vn({ transform: "scale(0)" }),
            Ju("300ms ease-in"),
          ]),
        ]);
      let EM = (() => {
        class t {
          constructor(n) {
            this.tostr = n;
          }
          ngOnInit() {}
          NewOrderNotify(n) {
            this.audio(),
              this.tostr.warning(n, "New Order", {
                timeOut: 1500,
                progressBar: !0,
                positionClass: "toast-top-right",
                tapToDismiss: !1,
              });
          }
          handleNewOrderNotification(n) {
            "granted" === Notification.permission
              ? new Notification("New Order", {
                  body: n,
                  icon: "../../../../assets/images/20230617_002438.png",
                  badge: "../../../../assets/images/20230617_002438.png",
                  image: "../../../../assets/images/order_notify_imge.jpeg",
                  vibrate: [200, 100, 200],
                })
              : "denied" !== Notification.permission &&
                Notification.requestPermission().then((r) => {
                  "granted" === r && new Notification("New Order");
                });
          }
          normalErrorNotification(n) {
            this.tostr.error(n, "Error", {
              timeOut: 1500,
              progressBar: !0,
              positionClass: "toast-top-center",
              tapToDismiss: !1,
            });
          }
          normalWarninigNotification(n) {
            this.tostr.warning(n, "Warninig", {
              timeOut: 1500,
              progressBar: !0,
              positionClass: "toast-top-center",
              tapToDismiss: !1,
            });
          }
          audio() {
            const n = new Audio();
            (n.src =
              "/../../../../assets/audios/mixkit-alert-quick-chime-766.wav"),
              n.load(),
              n.play();
          }
          requestNotificationPermission() {
            "Notification" in window && Notification.requestPermission();
          }
          showNotification(n, r) {
            "Notification" in window &&
              "granted" === Notification.permission &&
              new Notification(n, r);
          }
        }
        return (
          (t.ɵfac = function (n) {
            return new (n || t)(C(nc));
          }),
          (t.ɵcmp = Kt({
            type: t,
            selectors: [["app-kitchen-notify"]],
            decls: 2,
            vars: 0,
            template: function (n, r) {
              1 & n && (x(0, "p"), z(1, "kitchen-notify works!"), N());
            },
          })),
          (t.ɵprov = T({ token: t, factory: t.ɵfac, providedIn: "root" })),
          t
        );
      })();
      function w3(t, e) {
        if (1 & t) {
          const n = Qr();
          x(0, "div", 6),
            Ee("click", function () {
              const o = Tn(n).$implicit;
              return An(Se().takeCurrentOrder(o._id));
            })("click", function () {
              return Tn(n), An(Se().openDiv());
            }),
            x(1, "div", 7)(2, "div", 8)(3, "h4"),
            z(4),
            N()(),
            x(5, "div", 9)(6, "section", 10)(7, "span"),
            z(8),
            N()()()(),
            Be(9, "div", 11),
            x(10, "div", 12)(11, "div", 13),
            z(12, "pending"),
            N(),
            x(13, "div", 14),
            z(14),
            N()()();
        }
        if (2 & t) {
          const n = e.$implicit;
          U(4),
            rr(n.resId.name),
            U(4),
            kl("", n.tableId.table_Name, "-", n.tableId.table_No, ""),
            U(6),
            kl(
              " ",
              n.foods.length,
              " ",
              1 == n.foods.length ? "Food" : "foods",
              ""
            );
        }
      }
      function b3(t, e) {
        1 & t && (x(0, "div", 25), Be(1, "img", 26), N());
      }
      function E3(t, e) {
        if (
          (1 & t &&
            (x(0, "div", 27)(1, "div", 28),
            Be(2, "img", 29),
            N(),
            x(3, "div", 30),
            z(4),
            N(),
            x(5, "div", 31),
            z(6, "full"),
            N(),
            x(7, "div", 32),
            z(8),
            N(),
            x(9, "div", 33),
            z(10, "X"),
            N(),
            x(11, "div", 32),
            z(12),
            N(),
            x(13, "div", 34),
            z(14),
            N()()),
          2 & t)
        ) {
          const n = e.$implicit;
          U(2),
            re(
              "src",
              "http://localhost:5000/foods-images/" + n.food_id.image,
              dl
            ),
            U(2),
            rr(n.food_id.name),
            U(4),
            rr(n.food_quantity),
            U(4),
            rr(n.food_id.price),
            U(2),
            Ht("\u20b9 ", n.food_totalprice, "");
        }
      }
      function S3(t, e) {
        if (
          (1 & t &&
            (x(0, "div", 35)(1, "div", 36)(2, "span"),
            z(3, " Food Count :"),
            N(),
            z(4),
            N(),
            x(5, "div", 37)(6, "span"),
            z(7, "Total : "),
            N(),
            z(8),
            N()()),
          2 & t)
        ) {
          const n = Se(2);
          U(4),
            Ht(" ", n.total_Foods_Count, " "),
            U(4),
            Ht("\u20b9", n.total_amount, " ");
        }
      }
      function M3(t, e) {
        if (1 & t) {
          const n = Qr();
          x(0, "div")(1, "section", 15)(2, "div", 16)(3, "h3"),
            z(4, "Current Order"),
            N(),
            x(5, "button", 17),
            Ee("click", function () {
              return Tn(n), An(Se().closeDiv());
            }),
            z(6, "close"),
            N()(),
            ye(7, b3, 2, 0, "div", 18),
            x(8, "div", 19),
            ye(9, E3, 15, 5, "div", 20),
            N()(),
            x(10, "div", 21),
            ye(11, S3, 9, 2, "div", 22),
            x(12, "div", 23)(13, "button", 24),
            Ee("click", function () {
              Tn(n);
              const i = Se();
              return An(i.foodIsReady(i.orderDetails._id));
            }),
            z(14, "Ready"),
            N()()()();
        }
        if (2 & t) {
          const n = Se();
          re("@fadeOut", n.closeState)("@fadeIn", n.openState),
            U(9),
            re("ngForOf", n.allFoods),
            U(2),
            re("ngIf", n.total_Foods_Count);
        }
      }
      const T3 = [
        {
          path: "",
          component: q$,
          children: [
            { path: "", pathMatch: "full", redirectTo: "foods" },
            { path: "foods", component: U$ },
            {
              path: "orders",
              component: (() => {
                class t {
                  constructor(n, r, i, o, s) {
                    (this._kitchenService = n),
                      (this.route = r),
                      (this.router = i),
                      (this.notifications = o),
                      (this._KitchenSocketService = s),
                      (this.socket = Co("http://localhost:5000")),
                      (this.resId = localStorage.getItem("resId")),
                      (this.CloseDiv = !0),
                      (this.openDIv = !0),
                      (this.openState = "hidden"),
                      (this.closeState = "visible");
                  }
                  ngOnInit() {
                    this.loadOrders(), this.NewOrders();
                  }
                  closeDiv() {
                    (this.closeState = "hidden"),
                      (this.openState = "hidden"),
                      setTimeout(() => {
                        (this.CloseDiv = !0), (this.openDIv = !1);
                      }, 300);
                  }
                  openDiv() {
                    (this.closeState = "visible"),
                      (this.openState = "visible"),
                      setTimeout(() => {
                        (this.openDIv = !0), (this.CloseDiv = !1);
                      }, 300);
                  }
                  loadOrders() {
                    this._KitchenSocketService.emit(
                      "loadOrderskitchenside",
                      {}
                    ),
                      this._KitchenSocketService
                        .listen("listOrdersKitchen")
                        .subscribe(
                          (n) => {
                            this.Orders = n;
                          },
                          (n) => {
                            console.error("An error occurred:", n);
                          }
                        );
                  }
                  NewOrders() {
                    this._KitchenSocketService
                      .listen("pushNewOrder")
                      .subscribe((n) => {
                        console.log(n),
                          this.notifications.handleNewOrderNotification(
                            "New Orders"
                          ),
                          this.Orders.push(n);
                      });
                  }
                  takeCurrentOrder(n) {
                    (this.orderDetails = this.Orders.find((r) => r._id == n)),
                      console.log(this.orderDetails),
                      (this.allFoods = this.orderDetails.foods),
                      (this.total_Foods_Count = this.orderDetails.foods.length),
                      (this.total_amount = this.orderDetails.total_price);
                  }
                  foodIsReady(n) {
                    console.log(n),
                      this._kitchenService.Foodiready(n).subscribe(
                        (r) => {
                          this._KitchenSocketService.emit("foodIsReady", {
                            id: n,
                          }),
                            console.log(r),
                            this.loadOrders(),
                            this.closeDiv();
                        },
                        (r) => console.log(r)
                      );
                  }
                }
                return (
                  (t.ɵfac = function (n) {
                    return new (n || t)(C(ai), C(oi), C(dt), C(EM), C(Qp));
                  }),
                  (t.ɵcmp = Kt({
                    type: t,
                    selectors: [["app-kitchen-orders"]],
                    decls: 6,
                    vars: 2,
                    consts: [
                      [1, "container"],
                      [1, "col-md-8"],
                      [1, "orders"],
                      [
                        "class",
                        "order-card",
                        3,
                        "click",
                        4,
                        "ngFor",
                        "ngForOf",
                      ],
                      [1, "col-md-4"],
                      [4, "ngIf"],
                      [1, "order-card", 3, "click"],
                      [1, "order-table"],
                      [1, "order-id"],
                      [1, "table"],
                      [1, "card-free-table", "custom-style-false"],
                      [1, "order-clear"],
                      [1, "order-status"],
                      [1, "status"],
                      [1, "foods"],
                      [1, "cart-card"],
                      [1, "cart-header"],
                      [1, "btn", "btn-warning", 3, "click"],
                      ["class", "empty_img", 4, "ngIf"],
                      [1, "empty_cheaker"],
                      ["class", "cart-info", 4, "ngFor", "ngForOf"],
                      [1, "proceed__btn"],
                      ["class", "total-amount", 4, "ngIf"],
                      [1, "Ready__btn"],
                      [3, "click"],
                      [1, "empty_img"],
                      [
                        "src",
                        "../../../../../assets/farmers-food-design-image-file.jpg",
                        "alt",
                        "",
                      ],
                      [1, "cart-info"],
                      [1, "items-img"],
                      ["alt", "", 3, "src"],
                      [1, "items-name"],
                      [1, "items-type"],
                      [1, "items-price"],
                      [1, "items-x"],
                      [1, "items-total-price"],
                      [1, "total-amount"],
                      [1, "food__Count"],
                      [1, "total__cash"],
                    ],
                    template: function (n, r) {
                      1 & n &&
                        (x(0, "div", 0)(1, "div", 1)(2, "div", 2),
                        ye(3, w3, 15, 5, "div", 3),
                        N()(),
                        x(4, "div", 4),
                        ye(5, M3, 15, 4, "div", 5),
                        N()()),
                        2 & n &&
                          (U(3),
                          re("ngForOf", r.Orders),
                          U(2),
                          re("ngIf", r.openDIv || r.CloseDiv));
                    },
                    dependencies: [zh, ao],
                    styles: [
                      ".container[_ngcontent-%COMP%]{margin:0rem 0px;width:100%;display:flex;flex-direction:row}.grid[_ngcontent-%COMP%]{display:grid}.orders[_ngcontent-%COMP%]{padding:1.6rem 0rem;display:grid;grid-template-rows:repeat(4,91px);width:100%;height:600px;justify-content:space-around;overflow-y:auto}.order-card[_ngcontent-%COMP%]{width:636px;height:77px;background-color:#fff;border:solid 1px orange;box-shadow:1px 2px 18px #fdfafa;border-radius:25px;display:flex;flex-direction:row;transition:width .5s ease}.order-table[_ngcontent-%COMP%]{justify-content:space-around;align-items:center;display:flex;flex-direction:row;text-align:center}.order-id[_ngcontent-%COMP%]{padding:1rem}.order-id[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%]{font-size:20px;font-weight:600}.table1[_ngcontent-%COMP%]{display:flex;justify-content:center}.card-free-table.custom-style-true[_ngcontent-%COMP%]{position:relative;margin:1rem;width:81px;height:47px;box-shadow:10px 15px 30px -12px #30e50c,10px 15px 30px -12px #30e50c inset;border:solid rgba(44,171,15,.899) 10px;border-radius:.9rem;background-color:var(--red-card);color:#2fff0084;cursor:pointer;box-shadow:0 0 20px 10px #2fff0084;animation:shadows_ture 2s infinite}.card-free-table.custom-style-false[_ngcontent-%COMP%]{position:relative;margin:1rem;width:81px;height:47px;box-shadow:10px 15px 30px -12px #ff9100b9,10px 15px 30px -12px #ff9100b9 inset;border:solid rgba(255,145,0,.725) 10px;border-radius:.9rem;background-color:var(--red-card);color:#ff9100a2;cursor:pointer}.order-clear[_ngcontent-%COMP%]{width:70%}.order-status[_ngcontent-%COMP%]{width:40%;padding-right:10px;padding-top:13px;display:flex;flex-direction:column;column-gap:10px;align-items:center}.status[_ngcontent-%COMP%]{font-size:large;font-weight:600;color:#800400}.ready__status[_ngcontent-%COMP%]{font-size:large;font-weight:600;color:#0aa00a}.time[_ngcontent-%COMP%]{font-size:large;font-weight:600;color:#000}.foods[_ngcontent-%COMP%]{font-size:13px;font-weight:600;color:#000}@media screen and (max-width: 550px){.container[_ngcontent-%COMP%]{margin:.6rem 0rem;justify-content:center;width:100%;height:auto;display:flex;flex-direction:row}.order-card[_ngcontent-%COMP%]{width:321px;height:5rem;background-color:#fff;box-shadow:1px 2px 8px #4c4c4c;border-radius:24px;display:flex;flex-direction:row}.order-table[_ngcontent-%COMP%]{width:30%;justify-content:center;align-items:center;display:flex;flex-direction:column;text-align:center}.order-id[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%]{font-size:12px;font-weight:600}.table1[_ngcontent-%COMP%]{max-width:96%;background-color:transparent}.card-free-table.custom-style-true[_ngcontent-%COMP%]{position:relative;margin:0px 1rem;width:160px;height:100px;box-shadow:10px 15px 30px -12px #30e50c,10px 15px 30px -12px #30e50c inset;border:solid rgba(44,171,15,.899) 10px;border-radius:.9rem;background-color:var(--red-card);color:#2fff0084;cursor:pointer;box-shadow:0 0 20px 10px #2fff0084;animation:shadows_ture 2s infinite}.card-free-table.custom-style-false[_ngcontent-%COMP%]{position:relative;margin:0px 0rem;width:60px;height:40px;box-shadow:10px 15px 30px -12px #ff9100b9,10px 15px 30px -12px #ff9100b9 inset;border:solid rgba(255,145,0,.725) 4px;border-radius:.7rem;background-color:var(--red-card);color:#ff9100a2;cursor:pointer}.order-clear[_ngcontent-%COMP%]{width:70%}.order-status[_ngcontent-%COMP%]{width:30%;padding-right:20px;display:flex;flex-direction:column;justify-content:space-evenly;align-items:center}.status[_ngcontent-%COMP%]{font-size:11px;font-weight:500;color:green}.time[_ngcontent-%COMP%], .foods[_ngcontent-%COMP%]{font-size:10px;font-weight:500;color:#000}}@media only screen and (max-width: 680px) and (min-width: 551px){.container[_ngcontent-%COMP%]{margin:3rem;justify-content:center;width:100%;height:auto;display:flex;flex-direction:row}.order-card[_ngcontent-%COMP%]{width:447px;height:6rem;background-color:#fff;box-shadow:1px 2px 8px #4c4c4c;border-radius:25px;display:flex;flex-direction:row}.order-table[_ngcontent-%COMP%]{width:30%;justify-content:center;align-items:center;display:flex;flex-direction:column;text-align:center}.order-id[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%]{font-size:14px;font-weight:600}.table1[_ngcontent-%COMP%]{max-width:96%;background-color:transparent}.card-free-table.custom-style-true[_ngcontent-%COMP%]{position:relative;margin:0px 1rem;width:160px;height:100px;box-shadow:10px 15px 30px -12px #30e50c,10px 15px 30px -12px #30e50c inset;border:solid rgba(44,171,15,.899) 10px;border-radius:.9rem;background-color:var(--red-card);color:#2fff0084;cursor:pointer;box-shadow:0 0 20px 10px #2fff0084;animation:shadows_ture 2s infinite}.card-free-table.custom-style-false[_ngcontent-%COMP%]{position:relative;margin:0px 0rem;width:70px;height:50px;box-shadow:10px 15px 30px -12px #ff9100b9,10px 15px 30px -12px #ff9100b9 inset;border:solid rgba(255,145,0,.725) 6px;border-radius:.7rem;background-color:var(--red-card);color:#ff9100a2;cursor:pointer}.order-clear[_ngcontent-%COMP%]{width:70%}.order-status[_ngcontent-%COMP%]{width:30%;padding-right:20px;display:flex;flex-direction:column;justify-content:space-evenly;align-items:center}.status[_ngcontent-%COMP%]{font-size:15px;font-weight:600;color:green}.time[_ngcontent-%COMP%], .foods[_ngcontent-%COMP%]{font-size:13px;font-weight:600;color:#000}}.cart-card[_ngcontent-%COMP%]{position:relative;width:350px;height:32rem!important;box-shadow:1px 0 10px #9f9d9d;border-radius:.9rem .9rem 0rem 0rem;background-color:var(--red-card);color:var(--text);cursor:pointer;justify-content:center;align-items:center;overflow:hidden;overflow-y:auto}.cart-header[_ngcontent-%COMP%]{justify-content:space-around;align-items:center;display:flex;flex-direction:row;text-align:center;font-weight:600;font-size:medium}.cart-header[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{padding:10px;justify-content:left;text-align:left;font-weight:500;font-size:20px;font-weight:600;color:#3a3a3a}select[_ngcontent-%COMP%]{background-color:#f3f3f3;border:solid #ff8800 2px;color:#f80;border-radius:25px}option[_ngcontent-%COMP%]{background-color:#fff;color:#fff;border:solid #ff8800 2px;color:#f80}.cart-info[_ngcontent-%COMP%]{width:100%;height:70px;background-color:#fff;border-radius:25px;display:flex;flex-direction:row;align-items:center;justify-content:space-around}.items-img[_ngcontent-%COMP%]{border-image-outset:0cap;overflow:hidden}.items-img[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{height:60px;width:60px;border-radius:50px;transition:.1s}.items-img[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]:hover{transform:scale3d(50);height:70px;width:70px;border-radius:50px}.items-name[_ngcontent-%COMP%], .items-type[_ngcontent-%COMP%]{font-size:small;font-weight:400;color:#4d4d4d}.items-price[_ngcontent-%COMP%]{color:#353434}.cart_menu[_ngcontent-%COMP%]{justify-content:center}.cart_items[_ngcontent-%COMP%]{display:flex;flex-direction:row;justify-content:space-around}.items-x[_ngcontent-%COMP%]{font-size:small}.items-total-price[_ngcontent-%COMP%]{font-size:small;font-weight:400;color:#f80}.proceed__btn[_ngcontent-%COMP%]{position:relative;width:351px;height:50px;box-shadow:1px 2px 10px 1px #9f9d9d;border-radius:0rem 0rem .9rem .9rem;background-color:var(--red-card);color:var(--text);cursor:pointer;display:flex;justify-content:space-around;flex-direction:row;align-items:center}.total-amount[_ngcontent-%COMP%]{font-size:small;font-weight:400;color:#202020;display:flex;justify-content:center;flex-direction:column}.Ready__btn[_ngcontent-%COMP%]{width:100px;height:40px;background-color:#f80;display:flex;align-items:center;justify-content:center;border-radius:5px}.Ready__btn[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{outline:none;border:none;background-color:#f80;color:#fff}",
                    ],
                    data: { animation: [C3, D3] },
                  })),
                  t
                );
              })(),
            },
          ],
        },
        { path: "kitchenLogin", component: _3 },
      ];
      let A3 = (() => {
        class t {}
        return (
          (t.ɵfac = function (n) {
            return new (n || t)();
          }),
          (t.ɵmod = Qe({ type: t })),
          (t.ɵinj = ke({ imports: [xp.forRoot(T3), xp] })),
          t
        );
      })();
      class I3 extends Rt {
        constructor(e, n) {
          super();
        }
        schedule(e, n = 0) {
          return this;
        }
      }
      const rc = {
        setInterval(t, e, ...n) {
          const { delegate: r } = rc;
          return r?.setInterval
            ? r.setInterval(t, e, ...n)
            : setInterval(t, e, ...n);
        },
        clearInterval(t) {
          const { delegate: e } = rc;
          return (e?.clearInterval || clearInterval)(t);
        },
        delegate: void 0,
      };
      class x3 extends I3 {
        constructor(e, n) {
          super(e, n),
            (this.scheduler = e),
            (this.work = n),
            (this.pending = !1);
        }
        schedule(e, n = 0) {
          var r;
          if (this.closed) return this;
          this.state = e;
          const i = this.id,
            o = this.scheduler;
          return (
            null != i && (this.id = this.recycleAsyncId(o, i, n)),
            (this.pending = !0),
            (this.delay = n),
            (this.id =
              null !== (r = this.id) && void 0 !== r
                ? r
                : this.requestAsyncId(o, this.id, n)),
            this
          );
        }
        requestAsyncId(e, n, r = 0) {
          return rc.setInterval(e.flush.bind(e, this), r);
        }
        recycleAsyncId(e, n, r = 0) {
          if (null != r && this.delay === r && !1 === this.pending) return n;
          null != n && rc.clearInterval(n);
        }
        execute(e, n) {
          if (this.closed) return new Error("executing a cancelled action");
          this.pending = !1;
          const r = this._execute(e, n);
          if (r) return r;
          !1 === this.pending &&
            null != this.id &&
            (this.id = this.recycleAsyncId(this.scheduler, this.id, null));
        }
        _execute(e, n) {
          let i,
            r = !1;
          try {
            this.work(e);
          } catch (o) {
            (r = !0),
              (i = o || new Error("Scheduled action threw falsy error"));
          }
          if (r) return this.unsubscribe(), i;
        }
        unsubscribe() {
          if (!this.closed) {
            const { id: e, scheduler: n } = this,
              { actions: r } = n;
            (this.work = this.state = this.scheduler = null),
              (this.pending = !1),
              pa(r, this),
              null != e && (this.id = this.recycleAsyncId(n, e, null)),
              (this.delay = null),
              super.unsubscribe();
          }
        }
      }
      const SM = { now: () => (SM.delegate || Date).now(), delegate: void 0 };
      class ra {
        constructor(e, n = ra.now) {
          (this.schedulerActionCtor = e), (this.now = n);
        }
        schedule(e, n = 0, r) {
          return new this.schedulerActionCtor(this, e).schedule(r, n);
        }
      }
      ra.now = SM.now;
      class N3 extends ra {
        constructor(e, n = ra.now) {
          super(e, n), (this.actions = []), (this._active = !1);
        }
        flush(e) {
          const { actions: n } = this;
          if (this._active) return void n.push(e);
          let r;
          this._active = !0;
          do {
            if ((r = e.execute(e.state, e.delay))) break;
          } while ((e = n.shift()));
          if (((this._active = !1), r)) {
            for (; (e = n.shift()); ) e.unsubscribe();
            throw r;
          }
        }
      }
      const P3 = new (class O3 extends N3 {})(
        class R3 extends x3 {
          constructor(e, n) {
            super(e, n), (this.scheduler = e), (this.work = n);
          }
          schedule(e, n = 0) {
            return n > 0
              ? super.schedule(e, n)
              : ((this.delay = n),
                (this.state = e),
                this.scheduler.flush(this),
                this);
          }
          execute(e, n) {
            return n > 0 || this.closed
              ? super.execute(e, n)
              : this._execute(e, n);
          }
          requestAsyncId(e, n, r = 0) {
            return (null != r && r > 0) || (null == r && this.delay > 0)
              ? super.requestAsyncId(e, n, r)
              : (e.flush(this), 0);
          }
        }
      );
      class B3 extends Error {
        constructor(e, n) {
          super(
            (function j3(t, e) {
              return `NG0${Math.abs(t)}${e ? ": " + e : ""}`;
            })(e, n)
          ),
            (this.code = e);
        }
      }
      function RM(t, e) {
        const n = !e?.manualCleanup;
        n &&
          !e?.injector &&
          (function P_(t) {
            if (
              !Km() &&
              !(function fI() {
                return _i;
              })()
            )
              throw new v(-203, !1);
          })();
        const r = n ? e?.injector?.get(El) ?? E(El) : null;
        let i;
        i = (function Cy(t, e) {
          const n = new qI(t, e?.equal ?? yy);
          return od(n, n.signal.bind(n), {
            set: n.set.bind(n),
            update: n.update.bind(n),
            mutate: n.mutate.bind(n),
            asReadonly: n.asReadonly.bind(n),
          });
        })(e?.requireSync ? { kind: 0 } : { kind: 1, value: e?.initialValue });
        const o = t.subscribe({
          next: (s) => i.set({ kind: 1, value: s }),
          error: (s) => i.set({ kind: 2, error: s }),
        });
        return (
          r?.onDestroy(o.unsubscribe.bind(o)),
          vy(() => {
            const s = i();
            switch (s.kind) {
              case 1:
                return s.value;
              case 2:
                throw s.error;
              case 0:
                throw new B3(
                  601,
                  "`toSignal()` called with `requireSync` but `Observable` did not emit synchronously."
                );
            }
          })
        );
      }
      const ia = {};
      function ac(t, e) {
        if (((ia[t] = (ia[t] || 0) + 1), "function" == typeof e))
          return Dg(t, (...r) => ({ ...e(...r), type: t }));
        switch (e ? e._as : "empty") {
          case "empty":
            return Dg(t, () => ({ type: t }));
          case "props":
            return Dg(t, (r) => ({ ...r, type: t }));
          default:
            throw new Error("Unexpected config.");
        }
      }
      function Dg(t, e) {
        return Object.defineProperty(e, "type", { value: t, writable: !1 });
      }
      const OM = "@ngrx/store/init";
      let fi = (() => {
        class t extends pt {
          constructor() {
            super({ type: OM });
          }
          next(n) {
            if ("function" == typeof n)
              throw new TypeError(
                "\n        Dispatch expected an object, instead it received a function.\n        If you're using the createAction function, make sure to invoke the function\n        before dispatching the action. For example, someAction should be someAction()."
              );
            if (typeof n > "u") throw new TypeError("Actions must be objects");
            if (typeof n.type > "u")
              throw new TypeError("Actions must have a type property");
            super.next(n);
          }
          complete() {}
          ngOnDestroy() {
            super.complete();
          }
        }
        return (
          (t.ɵfac = function (n) {
            return new (n || t)();
          }),
          (t.ɵprov = T({ token: t, factory: t.ɵfac })),
          t
        );
      })();
      const Z3 = [fi],
        bg = new b("@ngrx/store Internal Root Guard"),
        PM = new b("@ngrx/store Internal Initial State"),
        Eg = new b("@ngrx/store Initial State"),
        FM = new b("@ngrx/store Reducer Factory"),
        kM = new b("@ngrx/store Internal Reducer Factory Provider"),
        LM = new b("@ngrx/store Initial Reducers"),
        Sg = new b("@ngrx/store Internal Initial Reducers"),
        VM = new b("@ngrx/store Store Features"),
        BM = new b("@ngrx/store Internal Store Reducers"),
        Mg = new b("@ngrx/store Internal Feature Reducers"),
        jM = new b("@ngrx/store Internal Feature Configs"),
        Tg = new b("@ngrx/store Internal Store Features"),
        HM = new b("@ngrx/store Internal Feature Reducers Token"),
        Ag = new b("@ngrx/store Feature Reducers"),
        $M = new b("@ngrx/store User Provided Meta Reducers"),
        lc = new b("@ngrx/store Meta Reducers"),
        UM = new b("@ngrx/store Internal Resolved Meta Reducers"),
        zM = new b("@ngrx/store User Runtime Checks Config"),
        qM = new b("@ngrx/store Internal User Runtime Checks Config"),
        oa = new b("@ngrx/store Internal Runtime Checks"),
        sa = new b("@ngrx/store Check if Action types are unique");
      function xg(t, e = {}) {
        const n = Object.keys(t),
          r = {};
        for (let o = 0; o < n.length; o++) {
          const s = n[o];
          "function" == typeof t[s] && (r[s] = t[s]);
        }
        const i = Object.keys(r);
        return function (s, a) {
          s = void 0 === s ? e : s;
          let l = !1;
          const u = {};
          for (let c = 0; c < i.length; c++) {
            const d = i[c],
              h = s[d],
              p = (0, r[d])(h, a);
            (u[d] = p), (l = l || p !== h);
          }
          return l ? u : s;
        };
      }
      function WM(...t) {
        return function (e) {
          if (0 === t.length) return e;
          const n = t[t.length - 1];
          return t.slice(0, -1).reduceRight((i, o) => o(i), n(e));
        };
      }
      function KM(t, e) {
        return (
          Array.isArray(e) && e.length > 0 && (t = WM.apply(null, [...e, t])),
          (n, r) => {
            const i = t(n);
            return (o, s) => i((o = void 0 === o ? r : o), s);
          }
        );
      }
      new b("@ngrx/store Root Store Provider"),
        new b("@ngrx/store Feature State Provider");
      class uc extends pe {}
      class QM extends fi {}
      let aa = (() => {
        class t extends pt {
          get currentReducers() {
            return this.reducers;
          }
          constructor(n, r, i, o) {
            super(o(i, r)),
              (this.dispatcher = n),
              (this.initialState = r),
              (this.reducers = i),
              (this.reducerFactory = o);
          }
          addFeature(n) {
            this.addFeatures([n]);
          }
          addFeatures(n) {
            const r = n.reduce(
              (
                i,
                {
                  reducers: o,
                  reducerFactory: s,
                  metaReducers: a,
                  initialState: l,
                  key: u,
                }
              ) => {
                const c =
                  "function" == typeof o
                    ? (function X3(t) {
                        const e =
                          Array.isArray(t) && t.length > 0
                            ? WM(...t)
                            : (n) => n;
                        return (n, r) => (
                          (n = e(n)), (i, o) => n((i = void 0 === i ? r : i), o)
                        );
                      })(a)(o, l)
                    : KM(s, a)(o, l);
                return (i[u] = c), i;
              },
              {}
            );
            this.addReducers(r);
          }
          removeFeature(n) {
            this.removeFeatures([n]);
          }
          removeFeatures(n) {
            this.removeReducers(n.map((r) => r.key));
          }
          addReducer(n, r) {
            this.addReducers({ [n]: r });
          }
          addReducers(n) {
            (this.reducers = { ...this.reducers, ...n }),
              this.updateReducers(Object.keys(n));
          }
          removeReducer(n) {
            this.removeReducers([n]);
          }
          removeReducers(n) {
            n.forEach((r) => {
              this.reducers = (function Y3(t, e) {
                return Object.keys(t)
                  .filter((n) => n !== e)
                  .reduce((n, r) => Object.assign(n, { [r]: t[r] }), {});
              })(this.reducers, r);
            }),
              this.updateReducers(n);
          }
          updateReducers(n) {
            this.next(this.reducerFactory(this.reducers, this.initialState)),
              this.dispatcher.next({
                type: "@ngrx/store/update-reducers",
                features: n,
              });
          }
          ngOnDestroy() {
            this.complete();
          }
        }
        return (
          (t.ɵfac = function (n) {
            return new (n || t)(D(QM), D(Eg), D(LM), D(FM));
          }),
          (t.ɵprov = T({ token: t, factory: t.ɵfac })),
          t
        );
      })();
      const ez = [
        aa,
        { provide: uc, useExisting: aa },
        { provide: QM, useExisting: fi },
      ];
      let la = (() => {
        class t extends qe {
          ngOnDestroy() {
            this.complete();
          }
        }
        return (
          (t.ɵfac = (function () {
            let e;
            return function (r) {
              return (e || (e = nt(t)))(r || t);
            };
          })()),
          (t.ɵprov = T({ token: t, factory: t.ɵfac })),
          t
        );
      })();
      const tz = [la];
      class ZM extends pe {}
      let YM = (() => {
        class t extends pt {
          constructor(n, r, i, o) {
            super(o);
            const a = n.pipe(Uc(P3)).pipe(
                (function F3(...t) {
                  const e = $c(t);
                  return be((n, r) => {
                    const i = t.length,
                      o = new Array(i);
                    let s = t.map(() => !1),
                      a = !1;
                    for (let l = 0; l < i; l++)
                      ot(t[l]).subscribe(
                        ge(
                          r,
                          (u) => {
                            (o[l] = u),
                              !a &&
                                !s[l] &&
                                ((s[l] = !0), (a = s.every(qn)) && (s = null));
                          },
                          ma
                        )
                      );
                    n.subscribe(
                      ge(r, (l) => {
                        if (a) {
                          const u = [l, ...o];
                          r.next(e ? e(...u) : u);
                        }
                      })
                    );
                  });
                })(r)
              ),
              u = a.pipe(bE(nz, { state: o }));
            (this.stateSubscription = u.subscribe(({ state: c, action: d }) => {
              this.next(c), i.next(d);
            })),
              (this.state = RM(this, { manualCleanup: !0, requireSync: !0 }));
          }
          ngOnDestroy() {
            this.stateSubscription.unsubscribe(), this.complete();
          }
        }
        return (
          (t.INIT = OM),
          (t.ɵfac = function (n) {
            return new (n || t)(D(fi), D(uc), D(la), D(Eg));
          }),
          (t.ɵprov = T({ token: t, factory: t.ɵfac })),
          t
        );
      })();
      function nz(t = { state: void 0 }, [e, n]) {
        const { state: r } = t;
        return { state: n(r, e), action: e };
      }
      const rz = [YM, { provide: ZM, useExisting: YM }];
      let So = (() => {
        class t extends pe {
          constructor(n, r, i) {
            super(),
              (this.actionsObserver = r),
              (this.reducerManager = i),
              (this.source = n),
              (this.state = n.state);
          }
          select(n, ...r) {
            return oz.call(null, n, ...r)(this);
          }
          selectSignal(n, r) {
            return vy(() => n(this.state()), {
              equal: r?.equal || ((i, o) => i === o),
            });
          }
          lift(n) {
            const r = new t(this, this.actionsObserver, this.reducerManager);
            return (r.operator = n), r;
          }
          dispatch(n) {
            this.actionsObserver.next(n);
          }
          next(n) {
            this.actionsObserver.next(n);
          }
          error(n) {
            this.actionsObserver.error(n);
          }
          complete() {
            this.actionsObserver.complete();
          }
          addReducer(n, r) {
            this.reducerManager.addReducer(n, r);
          }
          removeReducer(n) {
            this.reducerManager.removeReducer(n);
          }
        }
        return (
          (t.ɵfac = function (n) {
            return new (n || t)(D(ZM), D(fi), D(aa));
          }),
          (t.ɵprov = T({ token: t, factory: t.ɵfac })),
          t
        );
      })();
      const iz = [So];
      function oz(t, e, ...n) {
        return function (i) {
          let o;
          if ("string" == typeof t) {
            const s = [e, ...n].filter(Boolean);
            o = i.pipe(
              (function k3(...t) {
                const e = t.length;
                if (0 === e)
                  throw new Error("list of properties cannot be empty.");
                return J((n) => {
                  let r = n;
                  for (let i = 0; i < e; i++) {
                    const o = r?.[t[i]];
                    if (!(typeof o < "u")) return;
                    r = o;
                  }
                  return r;
                });
              })(t, ...s)
            );
          } else {
            if ("function" != typeof t)
              throw new TypeError(
                `Unexpected type '${typeof t}' in select operator, expected 'string' or 'function'`
              );
            o = i.pipe(J((s) => t(s, e)));
          }
          return o.pipe(Um());
        };
      }
      const Rg = "https://ngrx.io/guide/store/configuration/runtime-checks";
      function XM(t) {
        return void 0 === t;
      }
      function JM(t) {
        return null === t;
      }
      function eT(t) {
        return Array.isArray(t);
      }
      function tT(t) {
        return "object" == typeof t && null !== t;
      }
      function Ng(t) {
        return "function" == typeof t;
      }
      function Dz(t) {
        return t instanceof b ? E(t) : t;
      }
      function wz(t, e) {
        return e.map((n, r) => {
          if (t[r] instanceof b) {
            const i = E(t[r]);
            return {
              key: n.key,
              reducerFactory: i.reducerFactory ? i.reducerFactory : xg,
              metaReducers: i.metaReducers ? i.metaReducers : [],
              initialState: i.initialState,
            };
          }
          return n;
        });
      }
      function bz(t) {
        return t.map((e) => (e instanceof b ? E(e) : e));
      }
      function Fg(t) {
        return "function" == typeof t ? t() : t;
      }
      function Ez(t, e) {
        return t.concat(e);
      }
      function Sz() {
        if (E(So, { optional: !0, skipSelf: !0 }))
          throw new TypeError(
            "The root Store has been provided more than once. Feature modules should provide feature states instead."
          );
        return "guarded";
      }
      function kg(t) {
        Object.freeze(t);
        const e = Ng(t);
        return (
          Object.getOwnPropertyNames(t).forEach((n) => {
            if (
              !n.startsWith("\u0275") &&
              (function dz(t, e) {
                return Object.prototype.hasOwnProperty.call(t, e);
              })(t, n) &&
              (!e || ("caller" !== n && "callee" !== n && "arguments" !== n))
            ) {
              const r = t[n];
              (tT(r) || Ng(r)) && !Object.isFrozen(r) && kg(r);
            }
          }),
          t
        );
      }
      function Lg(t, e = []) {
        return (XM(t) || JM(t)) && 0 === e.length
          ? { path: ["root"], value: t }
          : Object.keys(t).reduce((r, i) => {
              if (r) return r;
              const o = t[i];
              return (function cz(t) {
                return Ng(t) && t.hasOwnProperty("\u0275cmp");
              })(o)
                ? r
                : !(
                    XM(o) ||
                    JM(o) ||
                    (function lz(t) {
                      return "number" == typeof t;
                    })(o) ||
                    (function az(t) {
                      return "boolean" == typeof t;
                    })(o) ||
                    (function sz(t) {
                      return "string" == typeof t;
                    })(o) ||
                    eT(o)
                  ) &&
                    ((function nT(t) {
                      if (
                        !(function uz(t) {
                          return tT(t) && !eT(t);
                        })(t)
                      )
                        return !1;
                      const e = Object.getPrototypeOf(t);
                      return e === Object.prototype || null === e;
                    })(o)
                      ? Lg(o, [...e, i])
                      : { path: [...e, i], value: o });
            }, !1);
      }
      function oT(t, e) {
        if (!1 === t) return;
        const n = t.path.join("."),
          r = new Error(
            `Detected unserializable ${e} at "${n}". ${Rg}#strict${e}serializability`
          );
        throw ((r.value = t.value), (r.unserializablePath = n), r);
      }
      function Iz(t) {
        return {
          strictStateSerializability: !1,
          strictActionSerializability: !1,
          strictStateImmutability: !1,
          strictActionImmutability: !1,
          strictActionWithinNgZone: !1,
          strictActionTypeUniqueness: !1,
        };
      }
      function xz({
        strictActionSerializability: t,
        strictStateSerializability: e,
      }) {
        return (n) =>
          t || e
            ? (function Tz(t, e) {
                return function (n, r) {
                  e.action(r) && oT(Lg(r), "action");
                  const i = t(n, r);
                  return e.state() && oT(Lg(i), "state"), i;
                };
              })(n, { action: (r) => t && !Vg(r), state: () => e })
            : n;
      }
      function Rz({ strictActionImmutability: t, strictStateImmutability: e }) {
        return (n) =>
          t || e
            ? (function Mz(t, e) {
                return function (n, r) {
                  const i = e.action(r) ? kg(r) : r,
                    o = t(n, i);
                  return e.state() ? kg(o) : o;
                };
              })(n, { action: (r) => t && !Vg(r), state: () => e })
            : n;
      }
      function Vg(t) {
        return t.type.startsWith("@ngrx");
      }
      function Nz({ strictActionWithinNgZone: t }) {
        return (e) =>
          t
            ? (function Az(t, e) {
                return function (n, r) {
                  if (e.action(r) && !he.isInAngularZone())
                    throw new Error(
                      `Action '${r.type}' running outside NgZone. ${Rg}#strictactionwithinngzone`
                    );
                  return t(n, r);
                };
              })(e, { action: (n) => t && !Vg(n) })
            : e;
      }
      function Oz(t) {
        return [
          { provide: qM, useValue: t },
          { provide: zM, useFactory: Pz, deps: [qM] },
          { provide: oa, deps: [zM], useFactory: Iz },
          { provide: lc, multi: !0, deps: [oa], useFactory: Rz },
          { provide: lc, multi: !0, deps: [oa], useFactory: xz },
          { provide: lc, multi: !0, deps: [oa], useFactory: Nz },
        ];
      }
      function sT() {
        return [{ provide: sa, multi: !0, deps: [oa], useFactory: Fz }];
      }
      function Pz(t) {
        return t;
      }
      function Fz(t) {
        if (!t.strictActionTypeUniqueness) return;
        const e = Object.entries(ia)
          .filter(([, n]) => n > 1)
          .map(([n]) => n);
        if (e.length)
          throw new Error(
            `Action types are registered more than once, ${e
              .map((n) => `"${n}"`)
              .join(", ")}. ${Rg}#strictactiontypeuniqueness`
          );
      }
      function aT(t = {}, e = {}) {
        return [
          { provide: bg, useFactory: Sz },
          { provide: PM, useValue: e.initialState },
          { provide: Eg, useFactory: Fg, deps: [PM] },
          { provide: Sg, useValue: t },
          { provide: BM, useExisting: t instanceof b ? t : Sg },
          { provide: LM, deps: [Sg, [new Td(BM)]], useFactory: Dz },
          { provide: $M, useValue: e.metaReducers ? e.metaReducers : [] },
          { provide: UM, deps: [lc, $M], useFactory: Ez },
          { provide: kM, useValue: e.reducerFactory ? e.reducerFactory : xg },
          { provide: FM, deps: [kM, UM], useFactory: KM },
          Z3,
          ez,
          tz,
          rz,
          iz,
          Oz(e.runtimeChecks),
          sT(),
        ];
      }
      function lT(t, e, n = {}) {
        return [
          { provide: jM, multi: !0, useValue: t instanceof Object ? {} : n },
          {
            provide: VM,
            multi: !0,
            useValue: {
              key: t instanceof Object ? t.name : t,
              reducerFactory:
                n instanceof b || !n.reducerFactory ? xg : n.reducerFactory,
              metaReducers:
                n instanceof b || !n.metaReducers ? [] : n.metaReducers,
              initialState:
                n instanceof b || !n.initialState ? void 0 : n.initialState,
            },
          },
          { provide: Tg, deps: [jM, VM], useFactory: wz },
          {
            provide: Mg,
            multi: !0,
            useValue: t instanceof Object ? t.reducer : e,
          },
          { provide: HM, multi: !0, useExisting: e instanceof b ? e : Mg },
          { provide: Ag, multi: !0, deps: [Mg, [new Td(HM)]], useFactory: bz },
          sT(),
        ];
      }
      let cc = (() => {
          class t {
            constructor(n, r, i, o, s, a) {}
          }
          return (
            (t.ɵfac = function (n) {
              return new (n || t)(
                D(fi),
                D(uc),
                D(la),
                D(So),
                D(bg, 8),
                D(sa, 8)
              );
            }),
            (t.ɵmod = Qe({ type: t })),
            (t.ɵinj = ke({})),
            t
          );
        })(),
        Bg = (() => {
          class t {
            constructor(n, r, i, o, s) {
              (this.features = n),
                (this.featureReducers = r),
                (this.reducerManager = i);
              const a = n.map((l, u) => {
                const d = r.shift()[u];
                return { ...l, reducers: d, initialState: Fg(l.initialState) };
              });
              i.addFeatures(a);
            }
            ngOnDestroy() {
              this.reducerManager.removeFeatures(this.features);
            }
          }
          return (
            (t.ɵfac = function (n) {
              return new (n || t)(D(Tg), D(Ag), D(aa), D(cc), D(sa, 8));
            }),
            (t.ɵmod = Qe({ type: t })),
            (t.ɵinj = ke({})),
            t
          );
        })(),
        jz = (() => {
          class t {
            static forRoot(n, r) {
              return { ngModule: cc, providers: [...aT(n, r)] };
            }
            static forFeature(n, r, i = {}) {
              return { ngModule: Bg, providers: [...lT(n, r, i)] };
            }
          }
          return (
            (t.ɵfac = function (n) {
              return new (n || t)();
            }),
            (t.ɵmod = Qe({ type: t })),
            (t.ɵinj = ke({})),
            t
          );
        })();
      class fr {
        constructor(e, n, r) {
          (this.kind = e),
            (this.value = n),
            (this.error = r),
            (this.hasValue = "N" === e);
        }
        observe(e) {
          return uT(this, e);
        }
        do(e, n, r) {
          const { kind: i, value: o, error: s } = this;
          return "N" === i ? e?.(o) : "E" === i ? n?.(s) : r?.();
        }
        accept(e, n, r) {
          var i;
          return ve(null === (i = e) || void 0 === i ? void 0 : i.next)
            ? this.observe(e)
            : this.do(e, n, r);
        }
        toObservable() {
          const { kind: e, value: n, error: r } = this,
            i = "N" === e ? B(n) : "E" === e ? lo(() => r) : "C" === e ? sn : 0;
          if (!i) throw new TypeError(`Unexpected notification kind ${e}`);
          return i;
        }
        static createNext(e) {
          return new fr("N", e);
        }
        static createError(e) {
          return new fr("E", void 0, e);
        }
        static createComplete() {
          return fr.completeNotification;
        }
      }
      function uT(t, e) {
        var n, r, i;
        const { kind: o, value: s, error: a } = t;
        if ("string" != typeof o)
          throw new TypeError('Invalid notification, missing "kind"');
        "N" === o
          ? null === (n = e.next) || void 0 === n || n.call(e, s)
          : "E" === o
          ? null === (r = e.error) || void 0 === r || r.call(e, a)
          : null === (i = e.complete) || void 0 === i || i.call(e);
      }
      function cT(t, e, n, r) {
        return be((i, o) => {
          let s;
          e && "function" != typeof e
            ? ({ duration: n, element: s, connector: r } = e)
            : (s = e);
          const a = new Map(),
            l = (p) => {
              a.forEach(p), p(o);
            },
            u = (p) => l((g) => g.error(p));
          let c = 0,
            d = !1;
          const f = new Sm(
            o,
            (p) => {
              try {
                const g = t(p);
                let m = a.get(g);
                if (!m) {
                  a.set(g, (m = r ? r() : new qe()));
                  const _ = (function h(p, g) {
                    const m = new pe((_) => {
                      c++;
                      const y = g.subscribe(_);
                      return () => {
                        y.unsubscribe(), 0 == --c && d && f.unsubscribe();
                      };
                    });
                    return (m.key = p), m;
                  })(g, m);
                  if ((o.next(_), n)) {
                    const y = ge(
                      m,
                      () => {
                        m.complete(), y?.unsubscribe();
                      },
                      void 0,
                      void 0,
                      () => a.delete(g)
                    );
                    f.add(ot(n(_)).subscribe(y));
                  }
                }
                m.next(s ? s(p) : p);
              } catch (g) {
                u(g);
              }
            },
            () => l((p) => p.complete()),
            u,
            () => a.clear(),
            () => ((d = !0), 0 === c)
          );
          i.subscribe(f);
        });
      }
      function dT(t, e) {
        return e
          ? (n) =>
              n.pipe(dT((r, i) => ot(t(r, i)).pipe(J((o, s) => e(r, o, i, s)))))
          : be((n, r) => {
              let i = 0,
                o = null,
                s = !1;
              n.subscribe(
                ge(
                  r,
                  (a) => {
                    o ||
                      ((o = ge(r, void 0, () => {
                        (o = null), s && r.complete();
                      })),
                      ot(t(a, i++)).subscribe(o));
                  },
                  () => {
                    (s = !0), !o && r.complete();
                  }
                )
              );
            });
      }
      fr.completeNotification = new fr("C");
      const Gz = { dispatch: !0, functional: !1, useEffectsErrorHandler: !0 },
        dc = "__@ngrx/effects_create__";
      function hT(t) {
        return Object.getPrototypeOf(t);
      }
      function jg(t) {
        return "function" == typeof t;
      }
      function Hg(t) {
        return t.filter(jg);
      }
      function Yz(t, e, n) {
        const r = hT(t).constructor.name,
          i = (function fT(t) {
            return (function Kz(t) {
              return Object.getOwnPropertyNames(t)
                .filter(
                  (r) =>
                    !(!t[r] || !t[r].hasOwnProperty(dc)) &&
                    t[r][dc].hasOwnProperty("dispatch")
                )
                .map((r) => ({ propertyName: r, ...t[r][dc] }));
            })(t);
          })(t).map(
            ({ propertyName: o, dispatch: s, useEffectsErrorHandler: a }) => {
              const l = "function" == typeof t[o] ? t[o]() : t[o],
                u = a ? n(l, e) : l;
              return !1 === s
                ? u.pipe(
                    (function Uz() {
                      return be((t, e) => {
                        t.subscribe(ge(e, ma));
                      });
                    })()
                  )
                : u
                    .pipe(
                      (function zz() {
                        return be((t, e) => {
                          t.subscribe(
                            ge(
                              e,
                              (n) => {
                                e.next(fr.createNext(n));
                              },
                              () => {
                                e.next(fr.createComplete()), e.complete();
                              },
                              (n) => {
                                e.next(fr.createError(n)), e.complete();
                              }
                            )
                          );
                        });
                      })()
                    )
                    .pipe(
                      J((d) => ({
                        effect: t[o],
                        notification: d,
                        propertyName: o,
                        sourceName: r,
                        sourceInstance: t,
                      }))
                    );
            }
          );
        return zc(...i);
      }
      function pT(t, e, n = 10) {
        return t.pipe(
          Mr((r) => (e && e.handleError(r), n <= 1 ? t : pT(t, e, n - 1)))
        );
      }
      let Jz = (() => {
        class t extends pe {
          constructor(n) {
            super(), n && (this.source = n);
          }
          lift(n) {
            const r = new t();
            return (r.source = this), (r.operator = n), r;
          }
        }
        return (
          (t.ɵfac = function (n) {
            return new (n || t)(D(la));
          }),
          (t.ɵprov = T({ token: t, factory: t.ɵfac, providedIn: "root" })),
          t
        );
      })();
      const gT = new b("@ngrx/effects Internal Root Guard"),
        fc = new b("@ngrx/effects User Provided Effects"),
        $g = new b("@ngrx/effects Internal Root Effects"),
        mT = new b("@ngrx/effects Internal Root Effects Instances"),
        yT = new b("@ngrx/effects Internal Feature Effects"),
        vT = new b("@ngrx/effects Internal Feature Effects Instance Groups"),
        t4 = new b("@ngrx/effects Effects Error Handler", {
          providedIn: "root",
          factory: () => pT,
        }),
        _T = "@ngrx/effects/init";
      ac(_T);
      function f4(t) {
        return Ug(t, "ngrxOnInitEffects");
      }
      function Ug(t, e) {
        return t && e in t && "function" == typeof t[e];
      }
      let zg = (() => {
        class t extends qe {
          constructor(n, r) {
            super(), (this.errorHandler = n), (this.effectsErrorHandler = r);
          }
          addEffects(n) {
            this.next(n);
          }
          toActions() {
            return this.pipe(
              cT((n) =>
                (function Qz(t) {
                  return (
                    "Object" !== t.constructor.name &&
                    "Function" !== t.constructor.name
                  );
                })(n)
                  ? hT(n)
                  : n
              ),
              Ge((n) => n.pipe(cT(h4))),
              Ge((n) => {
                const r = n.pipe(
                  dT((o) =>
                    (function p4(t, e) {
                      return (n) => {
                        const r = Yz(n, t, e);
                        return (function c4(t) {
                          return Ug(t, "ngrxOnRunEffects");
                        })(n)
                          ? n.ngrxOnRunEffects(r)
                          : r;
                      };
                    })(
                      this.errorHandler,
                      this.effectsErrorHandler
                    )(o)
                  ),
                  J(
                    (o) => (
                      (function r4(t, e) {
                        if ("N" === t.notification.kind) {
                          const n = t.notification.value;
                          !(function i4(t) {
                            return (
                              "function" != typeof t &&
                              t &&
                              t.type &&
                              "string" == typeof t.type
                            );
                          })(n) &&
                            e.handleError(
                              new Error(
                                `Effect ${(function o4({
                                  propertyName: t,
                                  sourceInstance: e,
                                  sourceName: n,
                                }) {
                                  const r = "function" == typeof e[t];
                                  return `"${n}.${String(t)}${r ? "()" : ""}"`;
                                })(
                                  t
                                )} dispatched an invalid action: ${(function s4(
                                  t
                                ) {
                                  try {
                                    return JSON.stringify(t);
                                  } catch {
                                    return t;
                                  }
                                })(n)}`
                              )
                            );
                        }
                      })(o, this.errorHandler),
                      o.notification
                    )
                  ),
                  en((o) => "N" === o.kind && null != o.value),
                  (function qz() {
                    return be((t, e) => {
                      t.subscribe(ge(e, (n) => uT(n, e)));
                    });
                  })()
                );
                return zc(
                  r,
                  n.pipe(
                    ei(1),
                    en(f4),
                    J((o) => o.ngrxOnInitEffects())
                  )
                );
              })
            );
          }
        }
        return (
          (t.ɵfac = function (n) {
            return new (n || t)(D(Dr), D(t4));
          }),
          (t.ɵprov = T({ token: t, factory: t.ɵfac, providedIn: "root" })),
          t
        );
      })();
      function h4(t) {
        return (function l4(t) {
          return Ug(t, "ngrxOnIdentifyEffects");
        })(t)
          ? t.ngrxOnIdentifyEffects()
          : "";
      }
      let qg = (() => {
          class t {
            get isStarted() {
              return !!this.effectsSubscription;
            }
            constructor(n, r) {
              (this.effectSources = n),
                (this.store = r),
                (this.effectsSubscription = null);
            }
            start() {
              this.effectsSubscription ||
                (this.effectsSubscription = this.effectSources
                  .toActions()
                  .subscribe(this.store));
            }
            ngOnDestroy() {
              this.effectsSubscription &&
                (this.effectsSubscription.unsubscribe(),
                (this.effectsSubscription = null));
            }
          }
          return (
            (t.ɵfac = function (n) {
              return new (n || t)(D(zg), D(So));
            }),
            (t.ɵprov = T({ token: t, factory: t.ɵfac, providedIn: "root" })),
            t
          );
        })(),
        CT = (() => {
          class t {
            constructor(n, r, i, o, s, a, l) {
              (this.sources = n), r.start();
              for (const u of o) n.addEffects(u);
              i.dispatch({ type: _T });
            }
            addEffects(n) {
              this.sources.addEffects(n);
            }
          }
          return (
            (t.ɵfac = function (n) {
              return new (n || t)(
                D(zg),
                D(qg),
                D(So),
                D(mT),
                D(cc, 8),
                D(Bg, 8),
                D(gT, 8)
              );
            }),
            (t.ɵmod = Qe({ type: t })),
            (t.ɵinj = ke({})),
            t
          );
        })(),
        g4 = (() => {
          class t {
            constructor(n, r, i, o) {
              const s = r.flat();
              for (const a of s) n.addEffects(a);
            }
          }
          return (
            (t.ɵfac = function (n) {
              return new (n || t)(D(CT), D(vT), D(cc, 8), D(Bg, 8));
            }),
            (t.ɵmod = Qe({ type: t })),
            (t.ɵinj = ke({})),
            t
          );
        })(),
        m4 = (() => {
          class t {
            static forFeature(...n) {
              const r = n.flat(),
                i = Hg(r);
              return {
                ngModule: g4,
                providers: [
                  i,
                  { provide: yT, multi: !0, useValue: r },
                  { provide: fc, multi: !0, useValue: [] },
                  { provide: vT, multi: !0, useFactory: DT, deps: [yT, fc] },
                ],
              };
            }
            static forRoot(...n) {
              const r = n.flat(),
                i = Hg(r);
              return {
                ngModule: CT,
                providers: [
                  i,
                  { provide: $g, useValue: [r] },
                  { provide: gT, useFactory: y4 },
                  { provide: fc, multi: !0, useValue: [] },
                  { provide: mT, useFactory: DT, deps: [$g, fc] },
                ],
              };
            }
          }
          return (
            (t.ɵfac = function (n) {
              return new (n || t)();
            }),
            (t.ɵmod = Qe({ type: t })),
            (t.ɵinj = ke({})),
            t
          );
        })();
      function DT(t, e) {
        const n = [];
        for (const r of t) n.push(...r);
        for (const r of e) n.push(...r);
        return n.map((r) =>
          (function Zz(t) {
            return t instanceof b || jg(t);
          })(r)
            ? E(r)
            : r
        );
      }
      function y4() {
        const t = E(qg, { optional: !0, skipSelf: !0 }),
          e = E($g, { self: !0 });
        if ((1 !== e.length || 0 !== e[0].length) && t)
          throw new TypeError(
            "EffectsModule.forRoot() called twice. Feature modules should use EffectsModule.forFeature() instead."
          );
        return "guarded";
      }
      let v4 = (() => {
          class t {
            constructor() {
              this.authonticated = "";
            }
          }
          return (
            (t.ɵfac = function (n) {
              return new (n || t)();
            }),
            (t.ɵcmp = Kt({
              type: t,
              selectors: [["app-navbar"]],
              decls: 0,
              vars: 0,
              template: function (n, r) {},
              styles: [
                '@import"https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap";[_ngcontent-%COMP%]:root{--header-height: 3rem;--hue: 174;--sat: 63%;--first-color: hsl(var(--hue), var(--sat), 40%);--first-color-alt: hsl(var(--hue), var(--sat), 36%);--title-color: hsl(var(--hue), 12%, 15%);--text-color: hsl(var(--hue), 8%, 35%);--body-color: hsl(var(--hue), 100%, 99%);--container-color: #FFF;--body-font: "Open Sans", sans-serif;--h1-font-size: 1.5rem;--normal-font-size: .938rem;--tiny-font-size: .625rem;--z-tooltip: 10;--z-fixed: 100}@media screen and (min-width: 968px){[_ngcontent-%COMP%]:root{--h1-font-size: 2.25rem;--normal-font-size: 1rem}}*[_ngcontent-%COMP%]{box-sizing:border-box;padding:0;margin:0}html[_ngcontent-%COMP%]{scroll-behavior:smooth}body[_ngcontent-%COMP%]{margin:var(--header-height) 0 0 0;font-family:var(--body-font);font-size:var(--normal-font-size);background-color:var(--body-color);color:var(--text-color)}ul[_ngcontent-%COMP%]{list-style:none}a[_ngcontent-%COMP%]{text-decoration:none}img[_ngcontent-%COMP%]{max-width:100%;height:auto}.section[_ngcontent-%COMP%]{padding:4.5rem 0 2rem}.section__title[_ngcontent-%COMP%]{font-size:var(--h1-font-size);color:var(--title-color);text-align:center;margin-bottom:1.5rem}.section__height[_ngcontent-%COMP%]{height:100vh}.container[_ngcontent-%COMP%]{max-width:968px;margin-left:1rem;margin-right:1rem}.header[_ngcontent-%COMP%]{position:fixed;top:0;left:0;width:100%;background-color:#fff;z-index:1;transition:.4s}.nav[_ngcontent-%COMP%]{height:var(--header-height);display:flex;justify-content:space-between;align-items:center}.nav__img[_ngcontent-%COMP%]{width:32px;border-radius:50%}.nav__logo[_ngcontent-%COMP%]{color:var(--title-color);font-weight:600}@media screen and (max-width: 767px){.nav__menu[_ngcontent-%COMP%]{position:fixed;bottom:0;left:0;background-color:#fff;box-shadow:0 -1px 12px hsla(var(--hue),var(--sat),15%,.15);width:100%;height:4rem;padding:0 1rem;display:grid;align-content:center;border-radius:1.25rem 1.25rem 0 0;transition:.4s}}.nav__list[_ngcontent-%COMP%], .nav__link[_ngcontent-%COMP%]{display:flex}.nav__link[_ngcontent-%COMP%]{flex-direction:column;align-items:center;row-gap:4px;color:var(--title-color);font-weight:600}.nav__list[_ngcontent-%COMP%]{justify-content:space-around}.nav__name[_ngcontent-%COMP%]{font-size:var(--tiny-font-size)}.nav__icon[_ngcontent-%COMP%]{font-size:1.5rem}.active-link[_ngcontent-%COMP%]{position:relative;color:var(--first-color);transition:.3s}.scroll-header[_ngcontent-%COMP%]{box-shadow:0 1px 12px hsla(var(--hue),var(--sat),15%,.15)}@media screen and (max-width: 320px){.nav__name[_ngcontent-%COMP%]{display:none}}@media screen and (min-width: 576px){.nav__list[_ngcontent-%COMP%]{justify-content:center;column-gap:3rem}}@media screen and (min-width: 767px){body[_ngcontent-%COMP%]{margin:0}.section[_ngcontent-%COMP%]{padding:7rem 0 2rem}.nav[_ngcontent-%COMP%]{height:calc(var(--header-height) + 1.5rem)}.nav__img[_ngcontent-%COMP%], .nav__icon[_ngcontent-%COMP%]{display:none}.nav__name[_ngcontent-%COMP%]{font-size:var(--normal-font-size)}.nav__link[_ngcontent-%COMP%]:hover{color:var(--first-color)}.active-link[_ngcontent-%COMP%]:before{content:"";position:absolute;bottom:-.75rem;width:4px;height:4px;background-color:var(--first-color);border-radius:50%}}@media screen and (min-width: 1024px){.container[_ngcontent-%COMP%]{margin-left:auto;margin-right:auto}}',
              ],
            })),
            t
          );
        })(),
        _4 = (() => {
          class t {
            constructor() {
              this.title = "kitchen-app";
            }
          }
          return (
            (t.ɵfac = function (n) {
              return new (n || t)();
            }),
            (t.ɵcmp = Kt({
              type: t,
              selectors: [["app-root"]],
              decls: 2,
              vars: 0,
              template: function (n, r) {
                1 & n && Be(0, "app-navbar")(1, "router-outlet");
              },
              dependencies: [Cu, v4],
              styles: ["*[_ngcontent-%COMP%]{margin:0;padding:0}"],
            })),
            t
          );
        })();
      const C4 = ac("[API Fetch foods]API FOOD"),
        wT = ac("[API recive Fetched foods]API FOOD", {
          _as: "props",
          _p: void 0,
        }),
        D4 = (function $z(t, ...e) {
          const n = new Map();
          for (const r of e)
            for (const i of r.types) {
              const o = n.get(i);
              n.set(i, o ? (a, l) => r.reducer(o(a, l), l) : r.reducer);
            }
          return function (r = t, i) {
            const o = n.get(i.type);
            return o ? o(r, i) : r;
          };
        })(
          [],
          (function Hz(...t) {
            return { reducer: t.pop(), types: t.map((r) => r.type) };
          })(wT, (t, { foodsData: e }) => [...e])
        ),
        w4 = (t, e) => D4(t, e);
      let b4 = (() => {
        class t {
          constructor(n, r) {
            (this.actions$ = n),
              (this.resService = r),
              (this.projectAllFoods$ = (function Wz(t, e = {}) {
                const n = e.functional ? t : t(),
                  r = { ...Gz, ...e };
                return Object.defineProperty(n, dc, { value: r }), n;
              })(() =>
                this.actions$.pipe(
                  (function e4(...t) {
                    return en((e) =>
                      t.some((n) =>
                        "string" == typeof n ? n === e.type : n.type === e.type
                      )
                    );
                  })(C4),
                  Gt(() =>
                    this.resService
                      .fetchFoodsData()
                      .pipe(J((i) => wT({ foodsData: i })))
                  )
                )
              ));
          }
        }
        return (
          (t.ɵfac = function (n) {
            return new (n || t)(D(Jz), D(ai));
          }),
          (t.ɵprov = T({ token: t, factory: t.ɵfac })),
          t
        );
      })();
      function bT(t) {
        return new v(3e3, !1);
      }
      function Or(t) {
        switch (t.length) {
          case 0:
            return new na();
          case 1:
            return t[0];
          default:
            return new CM(t);
        }
      }
      function ET(t, e, n = new Map(), r = new Map()) {
        const i = [],
          o = [];
        let s = -1,
          a = null;
        if (
          (e.forEach((l) => {
            const u = l.get("offset"),
              c = u == s,
              d = (c && a) || new Map();
            l.forEach((f, h) => {
              let p = h,
                g = f;
              if ("offset" !== h)
                switch (((p = t.normalizePropertyName(p, i)), g)) {
                  case "!":
                    g = n.get(h);
                    break;
                  case dr:
                    g = r.get(h);
                    break;
                  default:
                    g = t.normalizeStyleValue(h, p, g, i);
                }
              d.set(p, g);
            }),
              c || o.push(d),
              (a = d),
              (s = u);
          }),
          i.length)
        )
          throw (function G4(t) {
            return new v(3502, !1);
          })();
        return o;
      }
      function Gg(t, e, n, r) {
        switch (e) {
          case "start":
            t.onStart(() => r(n && Wg(n, "start", t)));
            break;
          case "done":
            t.onDone(() => r(n && Wg(n, "done", t)));
            break;
          case "destroy":
            t.onDestroy(() => r(n && Wg(n, "destroy", t)));
        }
      }
      function Wg(t, e, n) {
        const o = Kg(
            t.element,
            t.triggerName,
            t.fromState,
            t.toState,
            e || t.phaseName,
            n.totalTime ?? t.totalTime,
            !!n.disabled
          ),
          s = t._data;
        return null != s && (o._data = s), o;
      }
      function Kg(t, e, n, r, i = "", o = 0, s) {
        return {
          element: t,
          triggerName: e,
          fromState: n,
          toState: r,
          phaseName: i,
          totalTime: o,
          disabled: !!s,
        };
      }
      function Ut(t, e, n) {
        let r = t.get(e);
        return r || t.set(e, (r = n)), r;
      }
      function ST(t) {
        const e = t.indexOf(":");
        return [t.substring(1, e), t.slice(e + 1)];
      }
      const i5 = (() =>
        typeof document > "u" ? null : document.documentElement)();
      function Qg(t) {
        const e = t.parentNode || t.host || null;
        return e === i5 ? null : e;
      }
      let hi = null,
        MT = !1;
      function TT(t, e) {
        for (; e; ) {
          if (e === t) return !0;
          e = Qg(e);
        }
        return !1;
      }
      function AT(t, e, n) {
        if (n) return Array.from(t.querySelectorAll(e));
        const r = t.querySelector(e);
        return r ? [r] : [];
      }
      let IT = (() => {
          class t {
            validateStyleProperty(n) {
              return (function s5(t) {
                hi ||
                  ((hi =
                    (function a5() {
                      return typeof document < "u" ? document.body : null;
                    })() || {}),
                  (MT = !!hi.style && "WebkitAppearance" in hi.style));
                let e = !0;
                return (
                  hi.style &&
                    !(function o5(t) {
                      return "ebkit" == t.substring(1, 6);
                    })(t) &&
                    ((e = t in hi.style),
                    !e &&
                      MT &&
                      (e =
                        "Webkit" + t.charAt(0).toUpperCase() + t.slice(1) in
                        hi.style)),
                  e
                );
              })(n);
            }
            matchesElement(n, r) {
              return !1;
            }
            containsElement(n, r) {
              return TT(n, r);
            }
            getParentElement(n) {
              return Qg(n);
            }
            query(n, r, i) {
              return AT(n, r, i);
            }
            computeStyle(n, r, i) {
              return i || "";
            }
            animate(n, r, i, o, s, a = [], l) {
              return new na(i, o);
            }
          }
          return (
            (t.ɵfac = function (n) {
              return new (n || t)();
            }),
            (t.ɵprov = T({ token: t, factory: t.ɵfac })),
            t
          );
        })(),
        Zg = (() => {
          class t {}
          return (t.NOOP = new IT()), t;
        })();
      const l5 = 1e3,
        Yg = "ng-enter",
        hc = "ng-leave",
        pc = "ng-trigger",
        gc = ".ng-trigger",
        RT = "ng-animating",
        Xg = ".ng-animating";
      function hr(t) {
        if ("number" == typeof t) return t;
        const e = t.match(/^(-?[\.\d]+)(m?s)/);
        return !e || e.length < 2 ? 0 : Jg(parseFloat(e[1]), e[2]);
      }
      function Jg(t, e) {
        return "s" === e ? t * l5 : t;
      }
      function mc(t, e, n) {
        return t.hasOwnProperty("duration")
          ? t
          : (function c5(t, e, n) {
              let i,
                o = 0,
                s = "";
              if ("string" == typeof t) {
                const a = t.match(
                  /^(-?[\.\d]+)(m?s)(?:\s+(-?[\.\d]+)(m?s))?(?:\s+([-a-z]+(?:\(.+?\))?))?$/i
                );
                if (null === a)
                  return e.push(bT()), { duration: 0, delay: 0, easing: "" };
                i = Jg(parseFloat(a[1]), a[2]);
                const l = a[3];
                null != l && (o = Jg(parseFloat(l), a[4]));
                const u = a[5];
                u && (s = u);
              } else i = t;
              if (!n) {
                let a = !1,
                  l = e.length;
                i < 0 &&
                  (e.push(
                    (function E4() {
                      return new v(3100, !1);
                    })()
                  ),
                  (a = !0)),
                  o < 0 &&
                    (e.push(
                      (function S4() {
                        return new v(3101, !1);
                      })()
                    ),
                    (a = !0)),
                  a && e.splice(l, 0, bT());
              }
              return { duration: i, delay: o, easing: s };
            })(t, e, n);
      }
      function ua(t, e = {}) {
        return (
          Object.keys(t).forEach((n) => {
            e[n] = t[n];
          }),
          e
        );
      }
      function NT(t) {
        const e = new Map();
        return (
          Object.keys(t).forEach((n) => {
            e.set(n, t[n]);
          }),
          e
        );
      }
      function Pr(t, e = new Map(), n) {
        if (n) for (let [r, i] of n) e.set(r, i);
        for (let [r, i] of t) e.set(r, i);
        return e;
      }
      function Un(t, e, n) {
        e.forEach((r, i) => {
          const o = tm(i);
          n && !n.has(i) && n.set(i, t.style[o]), (t.style[o] = r);
        });
      }
      function pi(t, e) {
        e.forEach((n, r) => {
          const i = tm(r);
          t.style[i] = "";
        });
      }
      function ca(t) {
        return Array.isArray(t) ? (1 == t.length ? t[0] : vM(t)) : t;
      }
      const em = new RegExp("{{\\s*(.+?)\\s*}}", "g");
      function PT(t) {
        let e = [];
        if ("string" == typeof t) {
          let n;
          for (; (n = em.exec(t)); ) e.push(n[1]);
          em.lastIndex = 0;
        }
        return e;
      }
      function da(t, e, n) {
        const r = t.toString(),
          i = r.replace(em, (o, s) => {
            let a = e[s];
            return (
              null == a &&
                (n.push(
                  (function T4(t) {
                    return new v(3003, !1);
                  })()
                ),
                (a = "")),
              a.toString()
            );
          });
        return i == r ? t : i;
      }
      function yc(t) {
        const e = [];
        let n = t.next();
        for (; !n.done; ) e.push(n.value), (n = t.next());
        return e;
      }
      const h5 = /-+([a-z0-9])/g;
      function tm(t) {
        return t.replace(h5, (...e) => e[1].toUpperCase());
      }
      function zt(t, e, n) {
        switch (e.type) {
          case 7:
            return t.visitTrigger(e, n);
          case 0:
            return t.visitState(e, n);
          case 1:
            return t.visitTransition(e, n);
          case 2:
            return t.visitSequence(e, n);
          case 3:
            return t.visitGroup(e, n);
          case 4:
            return t.visitAnimate(e, n);
          case 5:
            return t.visitKeyframes(e, n);
          case 6:
            return t.visitStyle(e, n);
          case 8:
            return t.visitReference(e, n);
          case 9:
            return t.visitAnimateChild(e, n);
          case 10:
            return t.visitAnimateRef(e, n);
          case 11:
            return t.visitQuery(e, n);
          case 12:
            return t.visitStagger(e, n);
          default:
            throw (function A4(t) {
              return new v(3004, !1);
            })();
        }
      }
      function FT(t, e) {
        return window.getComputedStyle(t)[e];
      }
      const vc = "*";
      function m5(t, e) {
        const n = [];
        return (
          "string" == typeof t
            ? t.split(/\s*,\s*/).forEach((r) =>
                (function y5(t, e, n) {
                  if (":" == t[0]) {
                    const l = (function v5(t, e) {
                      switch (t) {
                        case ":enter":
                          return "void => *";
                        case ":leave":
                          return "* => void";
                        case ":increment":
                          return (n, r) => parseFloat(r) > parseFloat(n);
                        case ":decrement":
                          return (n, r) => parseFloat(r) < parseFloat(n);
                        default:
                          return (
                            e.push(
                              (function $4(t) {
                                return new v(3016, !1);
                              })()
                            ),
                            "* => *"
                          );
                      }
                    })(t, n);
                    if ("function" == typeof l) return void e.push(l);
                    t = l;
                  }
                  const r = t.match(/^(\*|[-\w]+)\s*(<?[=-]>)\s*(\*|[-\w]+)$/);
                  if (null == r || r.length < 4)
                    return (
                      n.push(
                        (function H4(t) {
                          return new v(3015, !1);
                        })()
                      ),
                      e
                    );
                  const i = r[1],
                    o = r[2],
                    s = r[3];
                  e.push(kT(i, s));
                  "<" == o[0] && !(i == vc && s == vc) && e.push(kT(s, i));
                })(r, n, e)
              )
            : n.push(t),
          n
        );
      }
      const _c = new Set(["true", "1"]),
        Cc = new Set(["false", "0"]);
      function kT(t, e) {
        const n = _c.has(t) || Cc.has(t),
          r = _c.has(e) || Cc.has(e);
        return (i, o) => {
          let s = t == vc || t == i,
            a = e == vc || e == o;
          return (
            !s && n && "boolean" == typeof i && (s = i ? _c.has(t) : Cc.has(t)),
            !a && r && "boolean" == typeof o && (a = o ? _c.has(e) : Cc.has(e)),
            s && a
          );
        };
      }
      const _5 = new RegExp("s*:selfs*,?", "g");
      function nm(t, e, n, r) {
        return new C5(t).build(e, n, r);
      }
      class C5 {
        constructor(e) {
          this._driver = e;
        }
        build(e, n, r) {
          const i = new b5(n);
          return this._resetContextStyleTimingState(i), zt(this, ca(e), i);
        }
        _resetContextStyleTimingState(e) {
          (e.currentQuerySelector = ""),
            (e.collectedStyles = new Map()),
            e.collectedStyles.set("", new Map()),
            (e.currentTime = 0);
        }
        visitTrigger(e, n) {
          let r = (n.queryCount = 0),
            i = (n.depCount = 0);
          const o = [],
            s = [];
          return (
            "@" == e.name.charAt(0) &&
              n.errors.push(
                (function x4() {
                  return new v(3006, !1);
                })()
              ),
            e.definitions.forEach((a) => {
              if ((this._resetContextStyleTimingState(n), 0 == a.type)) {
                const l = a,
                  u = l.name;
                u
                  .toString()
                  .split(/\s*,\s*/)
                  .forEach((c) => {
                    (l.name = c), o.push(this.visitState(l, n));
                  }),
                  (l.name = u);
              } else if (1 == a.type) {
                const l = this.visitTransition(a, n);
                (r += l.queryCount), (i += l.depCount), s.push(l);
              } else
                n.errors.push(
                  (function R4() {
                    return new v(3007, !1);
                  })()
                );
            }),
            {
              type: 7,
              name: e.name,
              states: o,
              transitions: s,
              queryCount: r,
              depCount: i,
              options: null,
            }
          );
        }
        visitState(e, n) {
          const r = this.visitStyle(e.styles, n),
            i = (e.options && e.options.params) || null;
          if (r.containsDynamicStyles) {
            const o = new Set(),
              s = i || {};
            r.styles.forEach((a) => {
              a instanceof Map &&
                a.forEach((l) => {
                  PT(l).forEach((u) => {
                    s.hasOwnProperty(u) || o.add(u);
                  });
                });
            }),
              o.size &&
                (yc(o.values()),
                n.errors.push(
                  (function N4(t, e) {
                    return new v(3008, !1);
                  })()
                ));
          }
          return {
            type: 0,
            name: e.name,
            style: r,
            options: i ? { params: i } : null,
          };
        }
        visitTransition(e, n) {
          (n.queryCount = 0), (n.depCount = 0);
          const r = zt(this, ca(e.animation), n);
          return {
            type: 1,
            matchers: m5(e.expr, n.errors),
            animation: r,
            queryCount: n.queryCount,
            depCount: n.depCount,
            options: gi(e.options),
          };
        }
        visitSequence(e, n) {
          return {
            type: 2,
            steps: e.steps.map((r) => zt(this, r, n)),
            options: gi(e.options),
          };
        }
        visitGroup(e, n) {
          const r = n.currentTime;
          let i = 0;
          const o = e.steps.map((s) => {
            n.currentTime = r;
            const a = zt(this, s, n);
            return (i = Math.max(i, n.currentTime)), a;
          });
          return (
            (n.currentTime = i), { type: 3, steps: o, options: gi(e.options) }
          );
        }
        visitAnimate(e, n) {
          const r = (function S5(t, e) {
            if (t.hasOwnProperty("duration")) return t;
            if ("number" == typeof t) return rm(mc(t, e).duration, 0, "");
            const n = t;
            if (
              n
                .split(/\s+/)
                .some((o) => "{" == o.charAt(0) && "{" == o.charAt(1))
            ) {
              const o = rm(0, 0, "");
              return (o.dynamic = !0), (o.strValue = n), o;
            }
            const i = mc(n, e);
            return rm(i.duration, i.delay, i.easing);
          })(e.timings, n.errors);
          n.currentAnimateTimings = r;
          let i,
            o = e.styles ? e.styles : vn({});
          if (5 == o.type) i = this.visitKeyframes(o, n);
          else {
            let s = e.styles,
              a = !1;
            if (!s) {
              a = !0;
              const u = {};
              r.easing && (u.easing = r.easing), (s = vn(u));
            }
            n.currentTime += r.duration + r.delay;
            const l = this.visitStyle(s, n);
            (l.isEmptyStep = a), (i = l);
          }
          return (
            (n.currentAnimateTimings = null),
            { type: 4, timings: r, style: i, options: null }
          );
        }
        visitStyle(e, n) {
          const r = this._makeStyleAst(e, n);
          return this._validateStyleAst(r, n), r;
        }
        _makeStyleAst(e, n) {
          const r = [],
            i = Array.isArray(e.styles) ? e.styles : [e.styles];
          for (let a of i)
            "string" == typeof a
              ? a === dr
                ? r.push(a)
                : n.errors.push(new v(3002, !1))
              : r.push(NT(a));
          let o = !1,
            s = null;
          return (
            r.forEach((a) => {
              if (
                a instanceof Map &&
                (a.has("easing") && ((s = a.get("easing")), a.delete("easing")),
                !o)
              )
                for (let l of a.values())
                  if (l.toString().indexOf("{{") >= 0) {
                    o = !0;
                    break;
                  }
            }),
            {
              type: 6,
              styles: r,
              easing: s,
              offset: e.offset,
              containsDynamicStyles: o,
              options: null,
            }
          );
        }
        _validateStyleAst(e, n) {
          const r = n.currentAnimateTimings;
          let i = n.currentTime,
            o = n.currentTime;
          r && o > 0 && (o -= r.duration + r.delay),
            e.styles.forEach((s) => {
              "string" != typeof s &&
                s.forEach((a, l) => {
                  const u = n.collectedStyles.get(n.currentQuerySelector),
                    c = u.get(l);
                  let d = !0;
                  c &&
                    (o != i &&
                      o >= c.startTime &&
                      i <= c.endTime &&
                      (n.errors.push(
                        (function P4(t, e, n, r, i) {
                          return new v(3010, !1);
                        })()
                      ),
                      (d = !1)),
                    (o = c.startTime)),
                    d && u.set(l, { startTime: o, endTime: i }),
                    n.options &&
                      (function f5(t, e, n) {
                        const r = e.params || {},
                          i = PT(t);
                        i.length &&
                          i.forEach((o) => {
                            r.hasOwnProperty(o) ||
                              n.push(
                                (function M4(t) {
                                  return new v(3001, !1);
                                })()
                              );
                          });
                      })(a, n.options, n.errors);
                });
            });
        }
        visitKeyframes(e, n) {
          const r = { type: 5, styles: [], options: null };
          if (!n.currentAnimateTimings)
            return (
              n.errors.push(
                (function F4() {
                  return new v(3011, !1);
                })()
              ),
              r
            );
          let o = 0;
          const s = [];
          let a = !1,
            l = !1,
            u = 0;
          const c = e.steps.map((_) => {
            const y = this._makeStyleAst(_, n);
            let M =
                null != y.offset
                  ? y.offset
                  : (function E5(t) {
                      if ("string" == typeof t) return null;
                      let e = null;
                      if (Array.isArray(t))
                        t.forEach((n) => {
                          if (n instanceof Map && n.has("offset")) {
                            const r = n;
                            (e = parseFloat(r.get("offset"))),
                              r.delete("offset");
                          }
                        });
                      else if (t instanceof Map && t.has("offset")) {
                        const n = t;
                        (e = parseFloat(n.get("offset"))), n.delete("offset");
                      }
                      return e;
                    })(y.styles),
              R = 0;
            return (
              null != M && (o++, (R = y.offset = M)),
              (l = l || R < 0 || R > 1),
              (a = a || R < u),
              (u = R),
              s.push(R),
              y
            );
          });
          l &&
            n.errors.push(
              (function k4() {
                return new v(3012, !1);
              })()
            ),
            a &&
              n.errors.push(
                (function L4() {
                  return new v(3200, !1);
                })()
              );
          const d = e.steps.length;
          let f = 0;
          o > 0 && o < d
            ? n.errors.push(
                (function V4() {
                  return new v(3202, !1);
                })()
              )
            : 0 == o && (f = 1 / (d - 1));
          const h = d - 1,
            p = n.currentTime,
            g = n.currentAnimateTimings,
            m = g.duration;
          return (
            c.forEach((_, y) => {
              const M = f > 0 ? (y == h ? 1 : f * y) : s[y],
                R = M * m;
              (n.currentTime = p + g.delay + R),
                (g.duration = R),
                this._validateStyleAst(_, n),
                (_.offset = M),
                r.styles.push(_);
            }),
            r
          );
        }
        visitReference(e, n) {
          return {
            type: 8,
            animation: zt(this, ca(e.animation), n),
            options: gi(e.options),
          };
        }
        visitAnimateChild(e, n) {
          return n.depCount++, { type: 9, options: gi(e.options) };
        }
        visitAnimateRef(e, n) {
          return {
            type: 10,
            animation: this.visitReference(e.animation, n),
            options: gi(e.options),
          };
        }
        visitQuery(e, n) {
          const r = n.currentQuerySelector,
            i = e.options || {};
          n.queryCount++, (n.currentQuery = e);
          const [o, s] = (function D5(t) {
            const e = !!t.split(/\s*,\s*/).find((n) => ":self" == n);
            return (
              e && (t = t.replace(_5, "")),
              (t = t
                .replace(/@\*/g, gc)
                .replace(/@\w+/g, (n) => gc + "-" + n.slice(1))
                .replace(/:animating/g, Xg)),
              [t, e]
            );
          })(e.selector);
          (n.currentQuerySelector = r.length ? r + " " + o : o),
            Ut(n.collectedStyles, n.currentQuerySelector, new Map());
          const a = zt(this, ca(e.animation), n);
          return (
            (n.currentQuery = null),
            (n.currentQuerySelector = r),
            {
              type: 11,
              selector: o,
              limit: i.limit || 0,
              optional: !!i.optional,
              includeSelf: s,
              animation: a,
              originalSelector: e.selector,
              options: gi(e.options),
            }
          );
        }
        visitStagger(e, n) {
          n.currentQuery ||
            n.errors.push(
              (function B4() {
                return new v(3013, !1);
              })()
            );
          const r =
            "full" === e.timings
              ? { duration: 0, delay: 0, easing: "full" }
              : mc(e.timings, n.errors, !0);
          return {
            type: 12,
            animation: zt(this, ca(e.animation), n),
            timings: r,
            options: null,
          };
        }
      }
      class b5 {
        constructor(e) {
          (this.errors = e),
            (this.queryCount = 0),
            (this.depCount = 0),
            (this.currentTransition = null),
            (this.currentQuery = null),
            (this.currentQuerySelector = null),
            (this.currentAnimateTimings = null),
            (this.currentTime = 0),
            (this.collectedStyles = new Map()),
            (this.options = null),
            (this.unsupportedCSSPropertiesFound = new Set());
        }
      }
      function gi(t) {
        return (
          t
            ? (t = ua(t)).params &&
              (t.params = (function w5(t) {
                return t ? ua(t) : null;
              })(t.params))
            : (t = {}),
          t
        );
      }
      function rm(t, e, n) {
        return { duration: t, delay: e, easing: n };
      }
      function im(t, e, n, r, i, o, s = null, a = !1) {
        return {
          type: 1,
          element: t,
          keyframes: e,
          preStyleProps: n,
          postStyleProps: r,
          duration: i,
          delay: o,
          totalTime: i + o,
          easing: s,
          subTimeline: a,
        };
      }
      class Dc {
        constructor() {
          this._map = new Map();
        }
        get(e) {
          return this._map.get(e) || [];
        }
        append(e, n) {
          let r = this._map.get(e);
          r || this._map.set(e, (r = [])), r.push(...n);
        }
        has(e) {
          return this._map.has(e);
        }
        clear() {
          this._map.clear();
        }
      }
      const A5 = new RegExp(":enter", "g"),
        x5 = new RegExp(":leave", "g");
      function om(t, e, n, r, i, o = new Map(), s = new Map(), a, l, u = []) {
        return new R5().buildKeyframes(t, e, n, r, i, o, s, a, l, u);
      }
      class R5 {
        buildKeyframes(e, n, r, i, o, s, a, l, u, c = []) {
          u = u || new Dc();
          const d = new sm(e, n, u, i, o, c, []);
          d.options = l;
          const f = l.delay ? hr(l.delay) : 0;
          d.currentTimeline.delayNextStep(f),
            d.currentTimeline.setStyles([s], null, d.errors, l),
            zt(this, r, d);
          const h = d.timelines.filter((p) => p.containsAnimation());
          if (h.length && a.size) {
            let p;
            for (let g = h.length - 1; g >= 0; g--) {
              const m = h[g];
              if (m.element === n) {
                p = m;
                break;
              }
            }
            p &&
              !p.allowOnlyTimelineStyles() &&
              p.setStyles([a], null, d.errors, l);
          }
          return h.length
            ? h.map((p) => p.buildKeyframes())
            : [im(n, [], [], [], 0, f, "", !1)];
        }
        visitTrigger(e, n) {}
        visitState(e, n) {}
        visitTransition(e, n) {}
        visitAnimateChild(e, n) {
          const r = n.subInstructions.get(n.element);
          if (r) {
            const i = n.createSubContext(e.options),
              o = n.currentTimeline.currentTime,
              s = this._visitSubInstructions(r, i, i.options);
            o != s && n.transformIntoNewTimeline(s);
          }
          n.previousNode = e;
        }
        visitAnimateRef(e, n) {
          const r = n.createSubContext(e.options);
          r.transformIntoNewTimeline(),
            this._applyAnimationRefDelays(
              [e.options, e.animation.options],
              n,
              r
            ),
            this.visitReference(e.animation, r),
            n.transformIntoNewTimeline(r.currentTimeline.currentTime),
            (n.previousNode = e);
        }
        _applyAnimationRefDelays(e, n, r) {
          for (const i of e) {
            const o = i?.delay;
            if (o) {
              const s =
                "number" == typeof o ? o : hr(da(o, i?.params ?? {}, n.errors));
              r.delayNextStep(s);
            }
          }
        }
        _visitSubInstructions(e, n, r) {
          let o = n.currentTimeline.currentTime;
          const s = null != r.duration ? hr(r.duration) : null,
            a = null != r.delay ? hr(r.delay) : null;
          return (
            0 !== s &&
              e.forEach((l) => {
                const u = n.appendInstructionToTimeline(l, s, a);
                o = Math.max(o, u.duration + u.delay);
              }),
            o
          );
        }
        visitReference(e, n) {
          n.updateOptions(e.options, !0),
            zt(this, e.animation, n),
            (n.previousNode = e);
        }
        visitSequence(e, n) {
          const r = n.subContextCount;
          let i = n;
          const o = e.options;
          if (
            o &&
            (o.params || o.delay) &&
            ((i = n.createSubContext(o)),
            i.transformIntoNewTimeline(),
            null != o.delay)
          ) {
            6 == i.previousNode.type &&
              (i.currentTimeline.snapshotCurrentStyles(),
              (i.previousNode = wc));
            const s = hr(o.delay);
            i.delayNextStep(s);
          }
          e.steps.length &&
            (e.steps.forEach((s) => zt(this, s, i)),
            i.currentTimeline.applyStylesToKeyframe(),
            i.subContextCount > r && i.transformIntoNewTimeline()),
            (n.previousNode = e);
        }
        visitGroup(e, n) {
          const r = [];
          let i = n.currentTimeline.currentTime;
          const o = e.options && e.options.delay ? hr(e.options.delay) : 0;
          e.steps.forEach((s) => {
            const a = n.createSubContext(e.options);
            o && a.delayNextStep(o),
              zt(this, s, a),
              (i = Math.max(i, a.currentTimeline.currentTime)),
              r.push(a.currentTimeline);
          }),
            r.forEach((s) => n.currentTimeline.mergeTimelineCollectedStyles(s)),
            n.transformIntoNewTimeline(i),
            (n.previousNode = e);
        }
        _visitTiming(e, n) {
          if (e.dynamic) {
            const r = e.strValue;
            return mc(n.params ? da(r, n.params, n.errors) : r, n.errors);
          }
          return { duration: e.duration, delay: e.delay, easing: e.easing };
        }
        visitAnimate(e, n) {
          const r = (n.currentAnimateTimings = this._visitTiming(e.timings, n)),
            i = n.currentTimeline;
          r.delay && (n.incrementTime(r.delay), i.snapshotCurrentStyles());
          const o = e.style;
          5 == o.type
            ? this.visitKeyframes(o, n)
            : (n.incrementTime(r.duration),
              this.visitStyle(o, n),
              i.applyStylesToKeyframe()),
            (n.currentAnimateTimings = null),
            (n.previousNode = e);
        }
        visitStyle(e, n) {
          const r = n.currentTimeline,
            i = n.currentAnimateTimings;
          !i && r.hasCurrentStyleProperties() && r.forwardFrame();
          const o = (i && i.easing) || e.easing;
          e.isEmptyStep
            ? r.applyEmptyStep(o)
            : r.setStyles(e.styles, o, n.errors, n.options),
            (n.previousNode = e);
        }
        visitKeyframes(e, n) {
          const r = n.currentAnimateTimings,
            i = n.currentTimeline.duration,
            o = r.duration,
            a = n.createSubContext().currentTimeline;
          (a.easing = r.easing),
            e.styles.forEach((l) => {
              a.forwardTime((l.offset || 0) * o),
                a.setStyles(l.styles, l.easing, n.errors, n.options),
                a.applyStylesToKeyframe();
            }),
            n.currentTimeline.mergeTimelineCollectedStyles(a),
            n.transformIntoNewTimeline(i + o),
            (n.previousNode = e);
        }
        visitQuery(e, n) {
          const r = n.currentTimeline.currentTime,
            i = e.options || {},
            o = i.delay ? hr(i.delay) : 0;
          o &&
            (6 === n.previousNode.type ||
              (0 == r && n.currentTimeline.hasCurrentStyleProperties())) &&
            (n.currentTimeline.snapshotCurrentStyles(), (n.previousNode = wc));
          let s = r;
          const a = n.invokeQuery(
            e.selector,
            e.originalSelector,
            e.limit,
            e.includeSelf,
            !!i.optional,
            n.errors
          );
          n.currentQueryTotal = a.length;
          let l = null;
          a.forEach((u, c) => {
            n.currentQueryIndex = c;
            const d = n.createSubContext(e.options, u);
            o && d.delayNextStep(o),
              u === n.element && (l = d.currentTimeline),
              zt(this, e.animation, d),
              d.currentTimeline.applyStylesToKeyframe(),
              (s = Math.max(s, d.currentTimeline.currentTime));
          }),
            (n.currentQueryIndex = 0),
            (n.currentQueryTotal = 0),
            n.transformIntoNewTimeline(s),
            l &&
              (n.currentTimeline.mergeTimelineCollectedStyles(l),
              n.currentTimeline.snapshotCurrentStyles()),
            (n.previousNode = e);
        }
        visitStagger(e, n) {
          const r = n.parentContext,
            i = n.currentTimeline,
            o = e.timings,
            s = Math.abs(o.duration),
            a = s * (n.currentQueryTotal - 1);
          let l = s * n.currentQueryIndex;
          switch (o.duration < 0 ? "reverse" : o.easing) {
            case "reverse":
              l = a - l;
              break;
            case "full":
              l = r.currentStaggerTime;
          }
          const c = n.currentTimeline;
          l && c.delayNextStep(l);
          const d = c.currentTime;
          zt(this, e.animation, n),
            (n.previousNode = e),
            (r.currentStaggerTime =
              i.currentTime - d + (i.startTime - r.currentTimeline.startTime));
        }
      }
      const wc = {};
      class sm {
        constructor(e, n, r, i, o, s, a, l) {
          (this._driver = e),
            (this.element = n),
            (this.subInstructions = r),
            (this._enterClassName = i),
            (this._leaveClassName = o),
            (this.errors = s),
            (this.timelines = a),
            (this.parentContext = null),
            (this.currentAnimateTimings = null),
            (this.previousNode = wc),
            (this.subContextCount = 0),
            (this.options = {}),
            (this.currentQueryIndex = 0),
            (this.currentQueryTotal = 0),
            (this.currentStaggerTime = 0),
            (this.currentTimeline = l || new bc(this._driver, n, 0)),
            a.push(this.currentTimeline);
        }
        get params() {
          return this.options.params;
        }
        updateOptions(e, n) {
          if (!e) return;
          const r = e;
          let i = this.options;
          null != r.duration && (i.duration = hr(r.duration)),
            null != r.delay && (i.delay = hr(r.delay));
          const o = r.params;
          if (o) {
            let s = i.params;
            s || (s = this.options.params = {}),
              Object.keys(o).forEach((a) => {
                (!n || !s.hasOwnProperty(a)) &&
                  (s[a] = da(o[a], s, this.errors));
              });
          }
        }
        _copyOptions() {
          const e = {};
          if (this.options) {
            const n = this.options.params;
            if (n) {
              const r = (e.params = {});
              Object.keys(n).forEach((i) => {
                r[i] = n[i];
              });
            }
          }
          return e;
        }
        createSubContext(e = null, n, r) {
          const i = n || this.element,
            o = new sm(
              this._driver,
              i,
              this.subInstructions,
              this._enterClassName,
              this._leaveClassName,
              this.errors,
              this.timelines,
              this.currentTimeline.fork(i, r || 0)
            );
          return (
            (o.previousNode = this.previousNode),
            (o.currentAnimateTimings = this.currentAnimateTimings),
            (o.options = this._copyOptions()),
            o.updateOptions(e),
            (o.currentQueryIndex = this.currentQueryIndex),
            (o.currentQueryTotal = this.currentQueryTotal),
            (o.parentContext = this),
            this.subContextCount++,
            o
          );
        }
        transformIntoNewTimeline(e) {
          return (
            (this.previousNode = wc),
            (this.currentTimeline = this.currentTimeline.fork(this.element, e)),
            this.timelines.push(this.currentTimeline),
            this.currentTimeline
          );
        }
        appendInstructionToTimeline(e, n, r) {
          const i = {
              duration: n ?? e.duration,
              delay: this.currentTimeline.currentTime + (r ?? 0) + e.delay,
              easing: "",
            },
            o = new N5(
              this._driver,
              e.element,
              e.keyframes,
              e.preStyleProps,
              e.postStyleProps,
              i,
              e.stretchStartingKeyframe
            );
          return this.timelines.push(o), i;
        }
        incrementTime(e) {
          this.currentTimeline.forwardTime(this.currentTimeline.duration + e);
        }
        delayNextStep(e) {
          e > 0 && this.currentTimeline.delayNextStep(e);
        }
        invokeQuery(e, n, r, i, o, s) {
          let a = [];
          if ((i && a.push(this.element), e.length > 0)) {
            e = (e = e.replace(A5, "." + this._enterClassName)).replace(
              x5,
              "." + this._leaveClassName
            );
            let u = this._driver.query(this.element, e, 1 != r);
            0 !== r &&
              (u = r < 0 ? u.slice(u.length + r, u.length) : u.slice(0, r)),
              a.push(...u);
          }
          return (
            !o &&
              0 == a.length &&
              s.push(
                (function j4(t) {
                  return new v(3014, !1);
                })()
              ),
            a
          );
        }
      }
      class bc {
        constructor(e, n, r, i) {
          (this._driver = e),
            (this.element = n),
            (this.startTime = r),
            (this._elementTimelineStylesLookup = i),
            (this.duration = 0),
            (this.easing = null),
            (this._previousKeyframe = new Map()),
            (this._currentKeyframe = new Map()),
            (this._keyframes = new Map()),
            (this._styleSummary = new Map()),
            (this._localTimelineStyles = new Map()),
            (this._pendingStyles = new Map()),
            (this._backFill = new Map()),
            (this._currentEmptyStepKeyframe = null),
            this._elementTimelineStylesLookup ||
              (this._elementTimelineStylesLookup = new Map()),
            (this._globalTimelineStyles =
              this._elementTimelineStylesLookup.get(n)),
            this._globalTimelineStyles ||
              ((this._globalTimelineStyles = this._localTimelineStyles),
              this._elementTimelineStylesLookup.set(
                n,
                this._localTimelineStyles
              )),
            this._loadKeyframe();
        }
        containsAnimation() {
          switch (this._keyframes.size) {
            case 0:
              return !1;
            case 1:
              return this.hasCurrentStyleProperties();
            default:
              return !0;
          }
        }
        hasCurrentStyleProperties() {
          return this._currentKeyframe.size > 0;
        }
        get currentTime() {
          return this.startTime + this.duration;
        }
        delayNextStep(e) {
          const n = 1 === this._keyframes.size && this._pendingStyles.size;
          this.duration || n
            ? (this.forwardTime(this.currentTime + e),
              n && this.snapshotCurrentStyles())
            : (this.startTime += e);
        }
        fork(e, n) {
          return (
            this.applyStylesToKeyframe(),
            new bc(
              this._driver,
              e,
              n || this.currentTime,
              this._elementTimelineStylesLookup
            )
          );
        }
        _loadKeyframe() {
          this._currentKeyframe &&
            (this._previousKeyframe = this._currentKeyframe),
            (this._currentKeyframe = this._keyframes.get(this.duration)),
            this._currentKeyframe ||
              ((this._currentKeyframe = new Map()),
              this._keyframes.set(this.duration, this._currentKeyframe));
        }
        forwardFrame() {
          (this.duration += 1), this._loadKeyframe();
        }
        forwardTime(e) {
          this.applyStylesToKeyframe(),
            (this.duration = e),
            this._loadKeyframe();
        }
        _updateStyle(e, n) {
          this._localTimelineStyles.set(e, n),
            this._globalTimelineStyles.set(e, n),
            this._styleSummary.set(e, { time: this.currentTime, value: n });
        }
        allowOnlyTimelineStyles() {
          return this._currentEmptyStepKeyframe !== this._currentKeyframe;
        }
        applyEmptyStep(e) {
          e && this._previousKeyframe.set("easing", e);
          for (let [n, r] of this._globalTimelineStyles)
            this._backFill.set(n, r || dr), this._currentKeyframe.set(n, dr);
          this._currentEmptyStepKeyframe = this._currentKeyframe;
        }
        setStyles(e, n, r, i) {
          n && this._previousKeyframe.set("easing", n);
          const o = (i && i.params) || {},
            s = (function O5(t, e) {
              const n = new Map();
              let r;
              return (
                t.forEach((i) => {
                  if ("*" === i) {
                    r = r || e.keys();
                    for (let o of r) n.set(o, dr);
                  } else Pr(i, n);
                }),
                n
              );
            })(e, this._globalTimelineStyles);
          for (let [a, l] of s) {
            const u = da(l, o, r);
            this._pendingStyles.set(a, u),
              this._localTimelineStyles.has(a) ||
                this._backFill.set(a, this._globalTimelineStyles.get(a) ?? dr),
              this._updateStyle(a, u);
          }
        }
        applyStylesToKeyframe() {
          0 != this._pendingStyles.size &&
            (this._pendingStyles.forEach((e, n) => {
              this._currentKeyframe.set(n, e);
            }),
            this._pendingStyles.clear(),
            this._localTimelineStyles.forEach((e, n) => {
              this._currentKeyframe.has(n) || this._currentKeyframe.set(n, e);
            }));
        }
        snapshotCurrentStyles() {
          for (let [e, n] of this._localTimelineStyles)
            this._pendingStyles.set(e, n), this._updateStyle(e, n);
        }
        getFinalKeyframe() {
          return this._keyframes.get(this.duration);
        }
        get properties() {
          const e = [];
          for (let n in this._currentKeyframe) e.push(n);
          return e;
        }
        mergeTimelineCollectedStyles(e) {
          e._styleSummary.forEach((n, r) => {
            const i = this._styleSummary.get(r);
            (!i || n.time > i.time) && this._updateStyle(r, n.value);
          });
        }
        buildKeyframes() {
          this.applyStylesToKeyframe();
          const e = new Set(),
            n = new Set(),
            r = 1 === this._keyframes.size && 0 === this.duration;
          let i = [];
          this._keyframes.forEach((a, l) => {
            const u = Pr(a, new Map(), this._backFill);
            u.forEach((c, d) => {
              "!" === c ? e.add(d) : c === dr && n.add(d);
            }),
              r || u.set("offset", l / this.duration),
              i.push(u);
          });
          const o = e.size ? yc(e.values()) : [],
            s = n.size ? yc(n.values()) : [];
          if (r) {
            const a = i[0],
              l = new Map(a);
            a.set("offset", 0), l.set("offset", 1), (i = [a, l]);
          }
          return im(
            this.element,
            i,
            o,
            s,
            this.duration,
            this.startTime,
            this.easing,
            !1
          );
        }
      }
      class N5 extends bc {
        constructor(e, n, r, i, o, s, a = !1) {
          super(e, n, s.delay),
            (this.keyframes = r),
            (this.preStyleProps = i),
            (this.postStyleProps = o),
            (this._stretchStartingKeyframe = a),
            (this.timings = {
              duration: s.duration,
              delay: s.delay,
              easing: s.easing,
            });
        }
        containsAnimation() {
          return this.keyframes.length > 1;
        }
        buildKeyframes() {
          let e = this.keyframes,
            { delay: n, duration: r, easing: i } = this.timings;
          if (this._stretchStartingKeyframe && n) {
            const o = [],
              s = r + n,
              a = n / s,
              l = Pr(e[0]);
            l.set("offset", 0), o.push(l);
            const u = Pr(e[0]);
            u.set("offset", BT(a)), o.push(u);
            const c = e.length - 1;
            for (let d = 1; d <= c; d++) {
              let f = Pr(e[d]);
              const h = f.get("offset");
              f.set("offset", BT((n + h * r) / s)), o.push(f);
            }
            (r = s), (n = 0), (i = ""), (e = o);
          }
          return im(
            this.element,
            e,
            this.preStyleProps,
            this.postStyleProps,
            r,
            n,
            i,
            !0
          );
        }
      }
      function BT(t, e = 3) {
        const n = Math.pow(10, e - 1);
        return Math.round(t * n) / n;
      }
      class am {}
      const P5 = new Set([
        "width",
        "height",
        "minWidth",
        "minHeight",
        "maxWidth",
        "maxHeight",
        "left",
        "top",
        "bottom",
        "right",
        "fontSize",
        "outlineWidth",
        "outlineOffset",
        "paddingTop",
        "paddingLeft",
        "paddingBottom",
        "paddingRight",
        "marginTop",
        "marginLeft",
        "marginBottom",
        "marginRight",
        "borderRadius",
        "borderWidth",
        "borderTopWidth",
        "borderLeftWidth",
        "borderRightWidth",
        "borderBottomWidth",
        "textIndent",
        "perspective",
      ]);
      class F5 extends am {
        normalizePropertyName(e, n) {
          return tm(e);
        }
        normalizeStyleValue(e, n, r, i) {
          let o = "";
          const s = r.toString().trim();
          if (P5.has(n) && 0 !== r && "0" !== r)
            if ("number" == typeof r) o = "px";
            else {
              const a = r.match(/^[+-]?[\d\.]+([a-z]*)$/);
              a &&
                0 == a[1].length &&
                i.push(
                  (function I4(t, e) {
                    return new v(3005, !1);
                  })()
                );
            }
          return s + o;
        }
      }
      function jT(t, e, n, r, i, o, s, a, l, u, c, d, f) {
        return {
          type: 0,
          element: t,
          triggerName: e,
          isRemovalTransition: i,
          fromState: n,
          fromStyles: o,
          toState: r,
          toStyles: s,
          timelines: a,
          queriedElements: l,
          preStyleProps: u,
          postStyleProps: c,
          totalTime: d,
          errors: f,
        };
      }
      const lm = {};
      class HT {
        constructor(e, n, r) {
          (this._triggerName = e), (this.ast = n), (this._stateStyles = r);
        }
        match(e, n, r, i) {
          return (function k5(t, e, n, r, i) {
            return t.some((o) => o(e, n, r, i));
          })(this.ast.matchers, e, n, r, i);
        }
        buildStyles(e, n, r) {
          let i = this._stateStyles.get("*");
          return (
            void 0 !== e && (i = this._stateStyles.get(e?.toString()) || i),
            i ? i.buildStyles(n, r) : new Map()
          );
        }
        build(e, n, r, i, o, s, a, l, u, c) {
          const d = [],
            f = (this.ast.options && this.ast.options.params) || lm,
            p = this.buildStyles(r, (a && a.params) || lm, d),
            g = (l && l.params) || lm,
            m = this.buildStyles(i, g, d),
            _ = new Set(),
            y = new Map(),
            M = new Map(),
            R = "void" === i,
            P = { params: L5(g, f), delay: this.ast.options?.delay },
            ue = c ? [] : om(e, n, this.ast.animation, o, s, p, m, P, u, d);
          let ze = 0;
          if (
            (ue.forEach((Cn) => {
              ze = Math.max(Cn.duration + Cn.delay, ze);
            }),
            d.length)
          )
            return jT(n, this._triggerName, r, i, R, p, m, [], [], y, M, ze, d);
          ue.forEach((Cn) => {
            const pr = Cn.element,
              nA = Ut(y, pr, new Set());
            Cn.preStyleProps.forEach((mi) => nA.add(mi));
            const ha = Ut(M, pr, new Set());
            Cn.postStyleProps.forEach((mi) => ha.add(mi)),
              pr !== n && _.add(pr);
          });
          const _n = yc(_.values());
          return jT(n, this._triggerName, r, i, R, p, m, ue, _n, y, M, ze);
        }
      }
      function L5(t, e) {
        const n = ua(e);
        for (const r in t) t.hasOwnProperty(r) && null != t[r] && (n[r] = t[r]);
        return n;
      }
      class V5 {
        constructor(e, n, r) {
          (this.styles = e), (this.defaultParams = n), (this.normalizer = r);
        }
        buildStyles(e, n) {
          const r = new Map(),
            i = ua(this.defaultParams);
          return (
            Object.keys(e).forEach((o) => {
              const s = e[o];
              null !== s && (i[o] = s);
            }),
            this.styles.styles.forEach((o) => {
              "string" != typeof o &&
                o.forEach((s, a) => {
                  s && (s = da(s, i, n));
                  const l = this.normalizer.normalizePropertyName(a, n);
                  (s = this.normalizer.normalizeStyleValue(a, l, s, n)),
                    r.set(a, s);
                });
            }),
            r
          );
        }
      }
      class j5 {
        constructor(e, n, r) {
          (this.name = e),
            (this.ast = n),
            (this._normalizer = r),
            (this.transitionFactories = []),
            (this.states = new Map()),
            n.states.forEach((i) => {
              this.states.set(
                i.name,
                new V5(i.style, (i.options && i.options.params) || {}, r)
              );
            }),
            $T(this.states, "true", "1"),
            $T(this.states, "false", "0"),
            n.transitions.forEach((i) => {
              this.transitionFactories.push(new HT(e, i, this.states));
            }),
            (this.fallbackTransition = (function H5(t, e, n) {
              return new HT(
                t,
                {
                  type: 1,
                  animation: { type: 2, steps: [], options: null },
                  matchers: [(s, a) => !0],
                  options: null,
                  queryCount: 0,
                  depCount: 0,
                },
                e
              );
            })(e, this.states));
        }
        get containsQueries() {
          return this.ast.queryCount > 0;
        }
        matchTransition(e, n, r, i) {
          return (
            this.transitionFactories.find((s) => s.match(e, n, r, i)) || null
          );
        }
        matchStyles(e, n, r) {
          return this.fallbackTransition.buildStyles(e, n, r);
        }
      }
      function $T(t, e, n) {
        t.has(e)
          ? t.has(n) || t.set(n, t.get(e))
          : t.has(n) && t.set(e, t.get(n));
      }
      const $5 = new Dc();
      class U5 {
        constructor(e, n, r) {
          (this.bodyNode = e),
            (this._driver = n),
            (this._normalizer = r),
            (this._animations = new Map()),
            (this._playersById = new Map()),
            (this.players = []);
        }
        register(e, n) {
          const r = [],
            o = nm(this._driver, n, r, []);
          if (r.length)
            throw (function W4(t) {
              return new v(3503, !1);
            })();
          this._animations.set(e, o);
        }
        _buildPlayer(e, n, r) {
          const i = e.element,
            o = ET(this._normalizer, e.keyframes, n, r);
          return this._driver.animate(
            i,
            o,
            e.duration,
            e.delay,
            e.easing,
            [],
            !0
          );
        }
        create(e, n, r = {}) {
          const i = [],
            o = this._animations.get(e);
          let s;
          const a = new Map();
          if (
            (o
              ? ((s = om(
                  this._driver,
                  n,
                  o,
                  Yg,
                  hc,
                  new Map(),
                  new Map(),
                  r,
                  $5,
                  i
                )),
                s.forEach((c) => {
                  const d = Ut(a, c.element, new Map());
                  c.postStyleProps.forEach((f) => d.set(f, null));
                }))
              : (i.push(
                  (function K4() {
                    return new v(3300, !1);
                  })()
                ),
                (s = [])),
            i.length)
          )
            throw (function Q4(t) {
              return new v(3504, !1);
            })();
          a.forEach((c, d) => {
            c.forEach((f, h) => {
              c.set(h, this._driver.computeStyle(d, h, dr));
            });
          });
          const u = Or(
            s.map((c) => {
              const d = a.get(c.element);
              return this._buildPlayer(c, new Map(), d);
            })
          );
          return (
            this._playersById.set(e, u),
            u.onDestroy(() => this.destroy(e)),
            this.players.push(u),
            u
          );
        }
        destroy(e) {
          const n = this._getPlayer(e);
          n.destroy(), this._playersById.delete(e);
          const r = this.players.indexOf(n);
          r >= 0 && this.players.splice(r, 1);
        }
        _getPlayer(e) {
          const n = this._playersById.get(e);
          if (!n)
            throw (function Z4(t) {
              return new v(3301, !1);
            })();
          return n;
        }
        listen(e, n, r, i) {
          const o = Kg(n, "", "", "");
          return Gg(this._getPlayer(e), r, o, i), () => {};
        }
        command(e, n, r, i) {
          if ("register" == r) return void this.register(e, i[0]);
          if ("create" == r) return void this.create(e, n, i[0] || {});
          const o = this._getPlayer(e);
          switch (r) {
            case "play":
              o.play();
              break;
            case "pause":
              o.pause();
              break;
            case "reset":
              o.reset();
              break;
            case "restart":
              o.restart();
              break;
            case "finish":
              o.finish();
              break;
            case "init":
              o.init();
              break;
            case "setPosition":
              o.setPosition(parseFloat(i[0]));
              break;
            case "destroy":
              this.destroy(e);
          }
        }
      }
      const UT = "ng-animate-queued",
        um = "ng-animate-disabled",
        K5 = [],
        zT = {
          namespaceId: "",
          setForRemoval: !1,
          setForMove: !1,
          hasAnimation: !1,
          removedBeforeQueried: !1,
        },
        Q5 = {
          namespaceId: "",
          setForMove: !1,
          setForRemoval: !1,
          hasAnimation: !1,
          removedBeforeQueried: !0,
        },
        nn = "__ng_removed";
      class cm {
        get params() {
          return this.options.params;
        }
        constructor(e, n = "") {
          this.namespaceId = n;
          const r = e && e.hasOwnProperty("value");
          if (
            ((this.value = (function J5(t) {
              return t ?? null;
            })(r ? e.value : e)),
            r)
          ) {
            const o = ua(e);
            delete o.value, (this.options = o);
          } else this.options = {};
          this.options.params || (this.options.params = {});
        }
        absorbOptions(e) {
          const n = e.params;
          if (n) {
            const r = this.options.params;
            Object.keys(n).forEach((i) => {
              null == r[i] && (r[i] = n[i]);
            });
          }
        }
      }
      const fa = "void",
        dm = new cm(fa);
      class Z5 {
        constructor(e, n, r) {
          (this.id = e),
            (this.hostElement = n),
            (this._engine = r),
            (this.players = []),
            (this._triggers = new Map()),
            (this._queue = []),
            (this._elementListeners = new Map()),
            (this._hostClassName = "ng-tns-" + e),
            rn(n, this._hostClassName);
        }
        listen(e, n, r, i) {
          if (!this._triggers.has(n))
            throw (function Y4(t, e) {
              return new v(3302, !1);
            })();
          if (null == r || 0 == r.length)
            throw (function X4(t) {
              return new v(3303, !1);
            })();
          if (
            !(function e8(t) {
              return "start" == t || "done" == t;
            })(r)
          )
            throw (function J4(t, e) {
              return new v(3400, !1);
            })();
          const o = Ut(this._elementListeners, e, []),
            s = { name: n, phase: r, callback: i };
          o.push(s);
          const a = Ut(this._engine.statesByElement, e, new Map());
          return (
            a.has(n) || (rn(e, pc), rn(e, pc + "-" + n), a.set(n, dm)),
            () => {
              this._engine.afterFlush(() => {
                const l = o.indexOf(s);
                l >= 0 && o.splice(l, 1), this._triggers.has(n) || a.delete(n);
              });
            }
          );
        }
        register(e, n) {
          return !this._triggers.has(e) && (this._triggers.set(e, n), !0);
        }
        _getTrigger(e) {
          const n = this._triggers.get(e);
          if (!n)
            throw (function e5(t) {
              return new v(3401, !1);
            })();
          return n;
        }
        trigger(e, n, r, i = !0) {
          const o = this._getTrigger(n),
            s = new fm(this.id, n, e);
          let a = this._engine.statesByElement.get(e);
          a ||
            (rn(e, pc),
            rn(e, pc + "-" + n),
            this._engine.statesByElement.set(e, (a = new Map())));
          let l = a.get(n);
          const u = new cm(r, this.id);
          if (
            (!(r && r.hasOwnProperty("value")) &&
              l &&
              u.absorbOptions(l.options),
            a.set(n, u),
            l || (l = dm),
            u.value !== fa && l.value === u.value)
          ) {
            if (
              !(function r8(t, e) {
                const n = Object.keys(t),
                  r = Object.keys(e);
                if (n.length != r.length) return !1;
                for (let i = 0; i < n.length; i++) {
                  const o = n[i];
                  if (!e.hasOwnProperty(o) || t[o] !== e[o]) return !1;
                }
                return !0;
              })(l.params, u.params)
            ) {
              const g = [],
                m = o.matchStyles(l.value, l.params, g),
                _ = o.matchStyles(u.value, u.params, g);
              g.length
                ? this._engine.reportError(g)
                : this._engine.afterFlush(() => {
                    pi(e, m), Un(e, _);
                  });
            }
            return;
          }
          const f = Ut(this._engine.playersByElement, e, []);
          f.forEach((g) => {
            g.namespaceId == this.id &&
              g.triggerName == n &&
              g.queued &&
              g.destroy();
          });
          let h = o.matchTransition(l.value, u.value, e, u.params),
            p = !1;
          if (!h) {
            if (!i) return;
            (h = o.fallbackTransition), (p = !0);
          }
          return (
            this._engine.totalQueuedPlayers++,
            this._queue.push({
              element: e,
              triggerName: n,
              transition: h,
              fromState: l,
              toState: u,
              player: s,
              isFallbackTransition: p,
            }),
            p ||
              (rn(e, UT),
              s.onStart(() => {
                Mo(e, UT);
              })),
            s.onDone(() => {
              let g = this.players.indexOf(s);
              g >= 0 && this.players.splice(g, 1);
              const m = this._engine.playersByElement.get(e);
              if (m) {
                let _ = m.indexOf(s);
                _ >= 0 && m.splice(_, 1);
              }
            }),
            this.players.push(s),
            f.push(s),
            s
          );
        }
        deregister(e) {
          this._triggers.delete(e),
            this._engine.statesByElement.forEach((n) => n.delete(e)),
            this._elementListeners.forEach((n, r) => {
              this._elementListeners.set(
                r,
                n.filter((i) => i.name != e)
              );
            });
        }
        clearElementCache(e) {
          this._engine.statesByElement.delete(e),
            this._elementListeners.delete(e);
          const n = this._engine.playersByElement.get(e);
          n &&
            (n.forEach((r) => r.destroy()),
            this._engine.playersByElement.delete(e));
        }
        _signalRemovalForInnerTriggers(e, n) {
          const r = this._engine.driver.query(e, gc, !0);
          r.forEach((i) => {
            if (i[nn]) return;
            const o = this._engine.fetchNamespacesByElement(i);
            o.size
              ? o.forEach((s) => s.triggerLeaveAnimation(i, n, !1, !0))
              : this.clearElementCache(i);
          }),
            this._engine.afterFlushAnimationsDone(() =>
              r.forEach((i) => this.clearElementCache(i))
            );
        }
        triggerLeaveAnimation(e, n, r, i) {
          const o = this._engine.statesByElement.get(e),
            s = new Map();
          if (o) {
            const a = [];
            if (
              (o.forEach((l, u) => {
                if ((s.set(u, l.value), this._triggers.has(u))) {
                  const c = this.trigger(e, u, fa, i);
                  c && a.push(c);
                }
              }),
              a.length)
            )
              return (
                this._engine.markElementAsRemoved(this.id, e, !0, n, s),
                r && Or(a).onDone(() => this._engine.processLeaveNode(e)),
                !0
              );
          }
          return !1;
        }
        prepareLeaveAnimationListeners(e) {
          const n = this._elementListeners.get(e),
            r = this._engine.statesByElement.get(e);
          if (n && r) {
            const i = new Set();
            n.forEach((o) => {
              const s = o.name;
              if (i.has(s)) return;
              i.add(s);
              const l = this._triggers.get(s).fallbackTransition,
                u = r.get(s) || dm,
                c = new cm(fa),
                d = new fm(this.id, s, e);
              this._engine.totalQueuedPlayers++,
                this._queue.push({
                  element: e,
                  triggerName: s,
                  transition: l,
                  fromState: u,
                  toState: c,
                  player: d,
                  isFallbackTransition: !0,
                });
            });
          }
        }
        removeNode(e, n) {
          const r = this._engine;
          if (
            (e.childElementCount && this._signalRemovalForInnerTriggers(e, n),
            this.triggerLeaveAnimation(e, n, !0))
          )
            return;
          let i = !1;
          if (r.totalAnimations) {
            const o = r.players.length ? r.playersByQueriedElement.get(e) : [];
            if (o && o.length) i = !0;
            else {
              let s = e;
              for (; (s = s.parentNode); )
                if (r.statesByElement.get(s)) {
                  i = !0;
                  break;
                }
            }
          }
          if ((this.prepareLeaveAnimationListeners(e), i))
            r.markElementAsRemoved(this.id, e, !1, n);
          else {
            const o = e[nn];
            (!o || o === zT) &&
              (r.afterFlush(() => this.clearElementCache(e)),
              r.destroyInnerAnimations(e),
              r._onRemovalComplete(e, n));
          }
        }
        insertNode(e, n) {
          rn(e, this._hostClassName);
        }
        drainQueuedTransitions(e) {
          const n = [];
          return (
            this._queue.forEach((r) => {
              const i = r.player;
              if (i.destroyed) return;
              const o = r.element,
                s = this._elementListeners.get(o);
              s &&
                s.forEach((a) => {
                  if (a.name == r.triggerName) {
                    const l = Kg(
                      o,
                      r.triggerName,
                      r.fromState.value,
                      r.toState.value
                    );
                    (l._data = e), Gg(r.player, a.phase, l, a.callback);
                  }
                }),
                i.markedForDestroy
                  ? this._engine.afterFlush(() => {
                      i.destroy();
                    })
                  : n.push(r);
            }),
            (this._queue = []),
            n.sort((r, i) => {
              const o = r.transition.ast.depCount,
                s = i.transition.ast.depCount;
              return 0 == o || 0 == s
                ? o - s
                : this._engine.driver.containsElement(r.element, i.element)
                ? 1
                : -1;
            })
          );
        }
        destroy(e) {
          this.players.forEach((n) => n.destroy()),
            this._signalRemovalForInnerTriggers(this.hostElement, e);
        }
        elementContainsData(e) {
          let n = !1;
          return (
            this._elementListeners.has(e) && (n = !0),
            (n = !!this._queue.find((r) => r.element === e) || n),
            n
          );
        }
      }
      class Y5 {
        _onRemovalComplete(e, n) {
          this.onRemovalComplete(e, n);
        }
        constructor(e, n, r) {
          (this.bodyNode = e),
            (this.driver = n),
            (this._normalizer = r),
            (this.players = []),
            (this.newHostElements = new Map()),
            (this.playersByElement = new Map()),
            (this.playersByQueriedElement = new Map()),
            (this.statesByElement = new Map()),
            (this.disabledNodes = new Set()),
            (this.totalAnimations = 0),
            (this.totalQueuedPlayers = 0),
            (this._namespaceLookup = {}),
            (this._namespaceList = []),
            (this._flushFns = []),
            (this._whenQuietFns = []),
            (this.namespacesByHostElement = new Map()),
            (this.collectedEnterElements = []),
            (this.collectedLeaveElements = []),
            (this.onRemovalComplete = (i, o) => {});
        }
        get queuedPlayers() {
          const e = [];
          return (
            this._namespaceList.forEach((n) => {
              n.players.forEach((r) => {
                r.queued && e.push(r);
              });
            }),
            e
          );
        }
        createNamespace(e, n) {
          const r = new Z5(e, n, this);
          return (
            this.bodyNode && this.driver.containsElement(this.bodyNode, n)
              ? this._balanceNamespaceList(r, n)
              : (this.newHostElements.set(n, r), this.collectEnterElement(n)),
            (this._namespaceLookup[e] = r)
          );
        }
        _balanceNamespaceList(e, n) {
          const r = this._namespaceList,
            i = this.namespacesByHostElement;
          if (r.length - 1 >= 0) {
            let s = !1,
              a = this.driver.getParentElement(n);
            for (; a; ) {
              const l = i.get(a);
              if (l) {
                const u = r.indexOf(l);
                r.splice(u + 1, 0, e), (s = !0);
                break;
              }
              a = this.driver.getParentElement(a);
            }
            s || r.unshift(e);
          } else r.push(e);
          return i.set(n, e), e;
        }
        register(e, n) {
          let r = this._namespaceLookup[e];
          return r || (r = this.createNamespace(e, n)), r;
        }
        registerTrigger(e, n, r) {
          let i = this._namespaceLookup[e];
          i && i.register(n, r) && this.totalAnimations++;
        }
        destroy(e, n) {
          if (!e) return;
          const r = this._fetchNamespace(e);
          this.afterFlush(() => {
            this.namespacesByHostElement.delete(r.hostElement),
              delete this._namespaceLookup[e];
            const i = this._namespaceList.indexOf(r);
            i >= 0 && this._namespaceList.splice(i, 1);
          }),
            this.afterFlushAnimationsDone(() => r.destroy(n));
        }
        _fetchNamespace(e) {
          return this._namespaceLookup[e];
        }
        fetchNamespacesByElement(e) {
          const n = new Set(),
            r = this.statesByElement.get(e);
          if (r)
            for (let i of r.values())
              if (i.namespaceId) {
                const o = this._fetchNamespace(i.namespaceId);
                o && n.add(o);
              }
          return n;
        }
        trigger(e, n, r, i) {
          if (Ec(n)) {
            const o = this._fetchNamespace(e);
            if (o) return o.trigger(n, r, i), !0;
          }
          return !1;
        }
        insertNode(e, n, r, i) {
          if (!Ec(n)) return;
          const o = n[nn];
          if (o && o.setForRemoval) {
            (o.setForRemoval = !1), (o.setForMove = !0);
            const s = this.collectedLeaveElements.indexOf(n);
            s >= 0 && this.collectedLeaveElements.splice(s, 1);
          }
          if (e) {
            const s = this._fetchNamespace(e);
            s && s.insertNode(n, r);
          }
          i && this.collectEnterElement(n);
        }
        collectEnterElement(e) {
          this.collectedEnterElements.push(e);
        }
        markElementAsDisabled(e, n) {
          n
            ? this.disabledNodes.has(e) ||
              (this.disabledNodes.add(e), rn(e, um))
            : this.disabledNodes.has(e) &&
              (this.disabledNodes.delete(e), Mo(e, um));
        }
        removeNode(e, n, r) {
          if (Ec(n)) {
            const i = e ? this._fetchNamespace(e) : null;
            i ? i.removeNode(n, r) : this.markElementAsRemoved(e, n, !1, r);
            const o = this.namespacesByHostElement.get(n);
            o && o.id !== e && o.removeNode(n, r);
          } else this._onRemovalComplete(n, r);
        }
        markElementAsRemoved(e, n, r, i, o) {
          this.collectedLeaveElements.push(n),
            (n[nn] = {
              namespaceId: e,
              setForRemoval: i,
              hasAnimation: r,
              removedBeforeQueried: !1,
              previousTriggersValues: o,
            });
        }
        listen(e, n, r, i, o) {
          return Ec(n) ? this._fetchNamespace(e).listen(n, r, i, o) : () => {};
        }
        _buildInstruction(e, n, r, i, o) {
          return e.transition.build(
            this.driver,
            e.element,
            e.fromState.value,
            e.toState.value,
            r,
            i,
            e.fromState.options,
            e.toState.options,
            n,
            o
          );
        }
        destroyInnerAnimations(e) {
          let n = this.driver.query(e, gc, !0);
          n.forEach((r) => this.destroyActiveAnimationsForElement(r)),
            0 != this.playersByQueriedElement.size &&
              ((n = this.driver.query(e, Xg, !0)),
              n.forEach((r) => this.finishActiveQueriedAnimationOnElement(r)));
        }
        destroyActiveAnimationsForElement(e) {
          const n = this.playersByElement.get(e);
          n &&
            n.forEach((r) => {
              r.queued ? (r.markedForDestroy = !0) : r.destroy();
            });
        }
        finishActiveQueriedAnimationOnElement(e) {
          const n = this.playersByQueriedElement.get(e);
          n && n.forEach((r) => r.finish());
        }
        whenRenderingDone() {
          return new Promise((e) => {
            if (this.players.length) return Or(this.players).onDone(() => e());
            e();
          });
        }
        processLeaveNode(e) {
          const n = e[nn];
          if (n && n.setForRemoval) {
            if (((e[nn] = zT), n.namespaceId)) {
              this.destroyInnerAnimations(e);
              const r = this._fetchNamespace(n.namespaceId);
              r && r.clearElementCache(e);
            }
            this._onRemovalComplete(e, n.setForRemoval);
          }
          e.classList?.contains(um) && this.markElementAsDisabled(e, !1),
            this.driver.query(e, ".ng-animate-disabled", !0).forEach((r) => {
              this.markElementAsDisabled(r, !1);
            });
        }
        flush(e = -1) {
          let n = [];
          if (
            (this.newHostElements.size &&
              (this.newHostElements.forEach((r, i) =>
                this._balanceNamespaceList(r, i)
              ),
              this.newHostElements.clear()),
            this.totalAnimations && this.collectedEnterElements.length)
          )
            for (let r = 0; r < this.collectedEnterElements.length; r++)
              rn(this.collectedEnterElements[r], "ng-star-inserted");
          if (
            this._namespaceList.length &&
            (this.totalQueuedPlayers || this.collectedLeaveElements.length)
          ) {
            const r = [];
            try {
              n = this._flushAnimations(r, e);
            } finally {
              for (let i = 0; i < r.length; i++) r[i]();
            }
          } else
            for (let r = 0; r < this.collectedLeaveElements.length; r++)
              this.processLeaveNode(this.collectedLeaveElements[r]);
          if (
            ((this.totalQueuedPlayers = 0),
            (this.collectedEnterElements.length = 0),
            (this.collectedLeaveElements.length = 0),
            this._flushFns.forEach((r) => r()),
            (this._flushFns = []),
            this._whenQuietFns.length)
          ) {
            const r = this._whenQuietFns;
            (this._whenQuietFns = []),
              n.length
                ? Or(n).onDone(() => {
                    r.forEach((i) => i());
                  })
                : r.forEach((i) => i());
          }
        }
        reportError(e) {
          throw (function t5(t) {
            return new v(3402, !1);
          })();
        }
        _flushAnimations(e, n) {
          const r = new Dc(),
            i = [],
            o = new Map(),
            s = [],
            a = new Map(),
            l = new Map(),
            u = new Map(),
            c = new Set();
          this.disabledNodes.forEach((O) => {
            c.add(O);
            const F = this.driver.query(O, ".ng-animate-queued", !0);
            for (let H = 0; H < F.length; H++) c.add(F[H]);
          });
          const d = this.bodyNode,
            f = Array.from(this.statesByElement.keys()),
            h = WT(f, this.collectedEnterElements),
            p = new Map();
          let g = 0;
          h.forEach((O, F) => {
            const H = Yg + g++;
            p.set(F, H), O.forEach((ie) => rn(ie, H));
          });
          const m = [],
            _ = new Set(),
            y = new Set();
          for (let O = 0; O < this.collectedLeaveElements.length; O++) {
            const F = this.collectedLeaveElements[O],
              H = F[nn];
            H &&
              H.setForRemoval &&
              (m.push(F),
              _.add(F),
              H.hasAnimation
                ? this.driver
                    .query(F, ".ng-star-inserted", !0)
                    .forEach((ie) => _.add(ie))
                : y.add(F));
          }
          const M = new Map(),
            R = WT(f, Array.from(_));
          R.forEach((O, F) => {
            const H = hc + g++;
            M.set(F, H), O.forEach((ie) => rn(ie, H));
          }),
            e.push(() => {
              h.forEach((O, F) => {
                const H = p.get(F);
                O.forEach((ie) => Mo(ie, H));
              }),
                R.forEach((O, F) => {
                  const H = M.get(F);
                  O.forEach((ie) => Mo(ie, H));
                }),
                m.forEach((O) => {
                  this.processLeaveNode(O);
                });
            });
          const P = [],
            ue = [];
          for (let O = this._namespaceList.length - 1; O >= 0; O--)
            this._namespaceList[O].drainQueuedTransitions(n).forEach((H) => {
              const ie = H.player,
                rt = H.element;
              if ((P.push(ie), this.collectedEnterElements.length)) {
                const ht = rt[nn];
                if (ht && ht.setForMove) {
                  if (
                    ht.previousTriggersValues &&
                    ht.previousTriggersValues.has(H.triggerName)
                  ) {
                    const yi = ht.previousTriggersValues.get(H.triggerName),
                      on = this.statesByElement.get(H.element);
                    if (on && on.has(H.triggerName)) {
                      const Tc = on.get(H.triggerName);
                      (Tc.value = yi), on.set(H.triggerName, Tc);
                    }
                  }
                  return void ie.destroy();
                }
              }
              const zn = !d || !this.driver.containsElement(d, rt),
                qt = M.get(rt),
                Fr = p.get(rt),
                Re = this._buildInstruction(H, r, Fr, qt, zn);
              if (Re.errors && Re.errors.length) return void ue.push(Re);
              if (zn)
                return (
                  ie.onStart(() => pi(rt, Re.fromStyles)),
                  ie.onDestroy(() => Un(rt, Re.toStyles)),
                  void i.push(ie)
                );
              if (H.isFallbackTransition)
                return (
                  ie.onStart(() => pi(rt, Re.fromStyles)),
                  ie.onDestroy(() => Un(rt, Re.toStyles)),
                  void i.push(ie)
                );
              const oA = [];
              Re.timelines.forEach((ht) => {
                (ht.stretchStartingKeyframe = !0),
                  this.disabledNodes.has(ht.element) || oA.push(ht);
              }),
                (Re.timelines = oA),
                r.append(rt, Re.timelines),
                s.push({ instruction: Re, player: ie, element: rt }),
                Re.queriedElements.forEach((ht) => Ut(a, ht, []).push(ie)),
                Re.preStyleProps.forEach((ht, yi) => {
                  if (ht.size) {
                    let on = l.get(yi);
                    on || l.set(yi, (on = new Set())),
                      ht.forEach((Tc, gm) => on.add(gm));
                  }
                }),
                Re.postStyleProps.forEach((ht, yi) => {
                  let on = u.get(yi);
                  on || u.set(yi, (on = new Set())),
                    ht.forEach((Tc, gm) => on.add(gm));
                });
            });
          if (ue.length) {
            const O = [];
            ue.forEach((F) => {
              O.push(
                (function n5(t, e) {
                  return new v(3505, !1);
                })()
              );
            }),
              P.forEach((F) => F.destroy()),
              this.reportError(O);
          }
          const ze = new Map(),
            _n = new Map();
          s.forEach((O) => {
            const F = O.element;
            r.has(F) &&
              (_n.set(F, F),
              this._beforeAnimationBuild(
                O.player.namespaceId,
                O.instruction,
                ze
              ));
          }),
            i.forEach((O) => {
              const F = O.element;
              this._getPreviousPlayers(
                F,
                !1,
                O.namespaceId,
                O.triggerName,
                null
              ).forEach((ie) => {
                Ut(ze, F, []).push(ie), ie.destroy();
              });
            });
          const Cn = m.filter((O) => QT(O, l, u)),
            pr = new Map();
          GT(pr, this.driver, y, u, dr).forEach((O) => {
            QT(O, l, u) && Cn.push(O);
          });
          const ha = new Map();
          h.forEach((O, F) => {
            GT(ha, this.driver, new Set(O), l, "!");
          }),
            Cn.forEach((O) => {
              const F = pr.get(O),
                H = ha.get(O);
              pr.set(
                O,
                new Map([...(F?.entries() ?? []), ...(H?.entries() ?? [])])
              );
            });
          const mi = [],
            rA = [],
            iA = {};
          s.forEach((O) => {
            const { element: F, player: H, instruction: ie } = O;
            if (r.has(F)) {
              if (c.has(F))
                return (
                  H.onDestroy(() => Un(F, ie.toStyles)),
                  (H.disabled = !0),
                  H.overrideTotalTime(ie.totalTime),
                  void i.push(H)
                );
              let rt = iA;
              if (_n.size > 1) {
                let qt = F;
                const Fr = [];
                for (; (qt = qt.parentNode); ) {
                  const Re = _n.get(qt);
                  if (Re) {
                    rt = Re;
                    break;
                  }
                  Fr.push(qt);
                }
                Fr.forEach((Re) => _n.set(Re, rt));
              }
              const zn = this._buildAnimation(H.namespaceId, ie, ze, o, ha, pr);
              if ((H.setRealPlayer(zn), rt === iA)) mi.push(H);
              else {
                const qt = this.playersByElement.get(rt);
                qt && qt.length && (H.parentPlayer = Or(qt)), i.push(H);
              }
            } else
              pi(F, ie.fromStyles),
                H.onDestroy(() => Un(F, ie.toStyles)),
                rA.push(H),
                c.has(F) && i.push(H);
          }),
            rA.forEach((O) => {
              const F = o.get(O.element);
              if (F && F.length) {
                const H = Or(F);
                O.setRealPlayer(H);
              }
            }),
            i.forEach((O) => {
              O.parentPlayer ? O.syncPlayerEvents(O.parentPlayer) : O.destroy();
            });
          for (let O = 0; O < m.length; O++) {
            const F = m[O],
              H = F[nn];
            if ((Mo(F, hc), H && H.hasAnimation)) continue;
            let ie = [];
            if (a.size) {
              let zn = a.get(F);
              zn && zn.length && ie.push(...zn);
              let qt = this.driver.query(F, Xg, !0);
              for (let Fr = 0; Fr < qt.length; Fr++) {
                let Re = a.get(qt[Fr]);
                Re && Re.length && ie.push(...Re);
              }
            }
            const rt = ie.filter((zn) => !zn.destroyed);
            rt.length ? t8(this, F, rt) : this.processLeaveNode(F);
          }
          return (
            (m.length = 0),
            mi.forEach((O) => {
              this.players.push(O),
                O.onDone(() => {
                  O.destroy();
                  const F = this.players.indexOf(O);
                  this.players.splice(F, 1);
                }),
                O.play();
            }),
            mi
          );
        }
        elementContainsData(e, n) {
          let r = !1;
          const i = n[nn];
          return (
            i && i.setForRemoval && (r = !0),
            this.playersByElement.has(n) && (r = !0),
            this.playersByQueriedElement.has(n) && (r = !0),
            this.statesByElement.has(n) && (r = !0),
            this._fetchNamespace(e).elementContainsData(n) || r
          );
        }
        afterFlush(e) {
          this._flushFns.push(e);
        }
        afterFlushAnimationsDone(e) {
          this._whenQuietFns.push(e);
        }
        _getPreviousPlayers(e, n, r, i, o) {
          let s = [];
          if (n) {
            const a = this.playersByQueriedElement.get(e);
            a && (s = a);
          } else {
            const a = this.playersByElement.get(e);
            if (a) {
              const l = !o || o == fa;
              a.forEach((u) => {
                u.queued || (!l && u.triggerName != i) || s.push(u);
              });
            }
          }
          return (
            (r || i) &&
              (s = s.filter(
                (a) => !((r && r != a.namespaceId) || (i && i != a.triggerName))
              )),
            s
          );
        }
        _beforeAnimationBuild(e, n, r) {
          const o = n.element,
            s = n.isRemovalTransition ? void 0 : e,
            a = n.isRemovalTransition ? void 0 : n.triggerName;
          for (const l of n.timelines) {
            const u = l.element,
              c = u !== o,
              d = Ut(r, u, []);
            this._getPreviousPlayers(u, c, s, a, n.toState).forEach((h) => {
              const p = h.getRealPlayer();
              p.beforeDestroy && p.beforeDestroy(), h.destroy(), d.push(h);
            });
          }
          pi(o, n.fromStyles);
        }
        _buildAnimation(e, n, r, i, o, s) {
          const a = n.triggerName,
            l = n.element,
            u = [],
            c = new Set(),
            d = new Set(),
            f = n.timelines.map((p) => {
              const g = p.element;
              c.add(g);
              const m = g[nn];
              if (m && m.removedBeforeQueried)
                return new na(p.duration, p.delay);
              const _ = g !== l,
                y = (function n8(t) {
                  const e = [];
                  return KT(t, e), e;
                })((r.get(g) || K5).map((ze) => ze.getRealPlayer())).filter(
                  (ze) => !!ze.element && ze.element === g
                ),
                M = o.get(g),
                R = s.get(g),
                P = ET(this._normalizer, p.keyframes, M, R),
                ue = this._buildPlayer(p, P, y);
              if ((p.subTimeline && i && d.add(g), _)) {
                const ze = new fm(e, a, g);
                ze.setRealPlayer(ue), u.push(ze);
              }
              return ue;
            });
          u.forEach((p) => {
            Ut(this.playersByQueriedElement, p.element, []).push(p),
              p.onDone(() =>
                (function X5(t, e, n) {
                  let r = t.get(e);
                  if (r) {
                    if (r.length) {
                      const i = r.indexOf(n);
                      r.splice(i, 1);
                    }
                    0 == r.length && t.delete(e);
                  }
                  return r;
                })(this.playersByQueriedElement, p.element, p)
              );
          }),
            c.forEach((p) => rn(p, RT));
          const h = Or(f);
          return (
            h.onDestroy(() => {
              c.forEach((p) => Mo(p, RT)), Un(l, n.toStyles);
            }),
            d.forEach((p) => {
              Ut(i, p, []).push(h);
            }),
            h
          );
        }
        _buildPlayer(e, n, r) {
          return n.length > 0
            ? this.driver.animate(
                e.element,
                n,
                e.duration,
                e.delay,
                e.easing,
                r
              )
            : new na(e.duration, e.delay);
        }
      }
      class fm {
        constructor(e, n, r) {
          (this.namespaceId = e),
            (this.triggerName = n),
            (this.element = r),
            (this._player = new na()),
            (this._containsRealPlayer = !1),
            (this._queuedCallbacks = new Map()),
            (this.destroyed = !1),
            (this.parentPlayer = null),
            (this.markedForDestroy = !1),
            (this.disabled = !1),
            (this.queued = !0),
            (this.totalTime = 0);
        }
        setRealPlayer(e) {
          this._containsRealPlayer ||
            ((this._player = e),
            this._queuedCallbacks.forEach((n, r) => {
              n.forEach((i) => Gg(e, r, void 0, i));
            }),
            this._queuedCallbacks.clear(),
            (this._containsRealPlayer = !0),
            this.overrideTotalTime(e.totalTime),
            (this.queued = !1));
        }
        getRealPlayer() {
          return this._player;
        }
        overrideTotalTime(e) {
          this.totalTime = e;
        }
        syncPlayerEvents(e) {
          const n = this._player;
          n.triggerCallback && e.onStart(() => n.triggerCallback("start")),
            e.onDone(() => this.finish()),
            e.onDestroy(() => this.destroy());
        }
        _queueEvent(e, n) {
          Ut(this._queuedCallbacks, e, []).push(n);
        }
        onDone(e) {
          this.queued && this._queueEvent("done", e), this._player.onDone(e);
        }
        onStart(e) {
          this.queued && this._queueEvent("start", e), this._player.onStart(e);
        }
        onDestroy(e) {
          this.queued && this._queueEvent("destroy", e),
            this._player.onDestroy(e);
        }
        init() {
          this._player.init();
        }
        hasStarted() {
          return !this.queued && this._player.hasStarted();
        }
        play() {
          !this.queued && this._player.play();
        }
        pause() {
          !this.queued && this._player.pause();
        }
        restart() {
          !this.queued && this._player.restart();
        }
        finish() {
          this._player.finish();
        }
        destroy() {
          (this.destroyed = !0), this._player.destroy();
        }
        reset() {
          !this.queued && this._player.reset();
        }
        setPosition(e) {
          this.queued || this._player.setPosition(e);
        }
        getPosition() {
          return this.queued ? 0 : this._player.getPosition();
        }
        triggerCallback(e) {
          const n = this._player;
          n.triggerCallback && n.triggerCallback(e);
        }
      }
      function Ec(t) {
        return t && 1 === t.nodeType;
      }
      function qT(t, e) {
        const n = t.style.display;
        return (t.style.display = e ?? "none"), n;
      }
      function GT(t, e, n, r, i) {
        const o = [];
        n.forEach((l) => o.push(qT(l)));
        const s = [];
        r.forEach((l, u) => {
          const c = new Map();
          l.forEach((d) => {
            const f = e.computeStyle(u, d, i);
            c.set(d, f), (!f || 0 == f.length) && ((u[nn] = Q5), s.push(u));
          }),
            t.set(u, c);
        });
        let a = 0;
        return n.forEach((l) => qT(l, o[a++])), s;
      }
      function WT(t, e) {
        const n = new Map();
        if ((t.forEach((a) => n.set(a, [])), 0 == e.length)) return n;
        const i = new Set(e),
          o = new Map();
        function s(a) {
          if (!a) return 1;
          let l = o.get(a);
          if (l) return l;
          const u = a.parentNode;
          return (l = n.has(u) ? u : i.has(u) ? 1 : s(u)), o.set(a, l), l;
        }
        return (
          e.forEach((a) => {
            const l = s(a);
            1 !== l && n.get(l).push(a);
          }),
          n
        );
      }
      function rn(t, e) {
        t.classList?.add(e);
      }
      function Mo(t, e) {
        t.classList?.remove(e);
      }
      function t8(t, e, n) {
        Or(n).onDone(() => t.processLeaveNode(e));
      }
      function KT(t, e) {
        for (let n = 0; n < t.length; n++) {
          const r = t[n];
          r instanceof CM ? KT(r.players, e) : e.push(r);
        }
      }
      function QT(t, e, n) {
        const r = n.get(t);
        if (!r) return !1;
        let i = e.get(t);
        return i ? r.forEach((o) => i.add(o)) : e.set(t, r), n.delete(t), !0;
      }
      class Sc {
        constructor(e, n, r) {
          (this.bodyNode = e),
            (this._driver = n),
            (this._normalizer = r),
            (this._triggerCache = {}),
            (this.onRemovalComplete = (i, o) => {}),
            (this._transitionEngine = new Y5(e, n, r)),
            (this._timelineEngine = new U5(e, n, r)),
            (this._transitionEngine.onRemovalComplete = (i, o) =>
              this.onRemovalComplete(i, o));
        }
        registerTrigger(e, n, r, i, o) {
          const s = e + "-" + i;
          let a = this._triggerCache[s];
          if (!a) {
            const l = [],
              c = nm(this._driver, o, l, []);
            if (l.length)
              throw (function q4(t, e) {
                return new v(3404, !1);
              })();
            (a = (function B5(t, e, n) {
              return new j5(t, e, n);
            })(i, c, this._normalizer)),
              (this._triggerCache[s] = a);
          }
          this._transitionEngine.registerTrigger(n, i, a);
        }
        register(e, n) {
          this._transitionEngine.register(e, n);
        }
        destroy(e, n) {
          this._transitionEngine.destroy(e, n);
        }
        onInsert(e, n, r, i) {
          this._transitionEngine.insertNode(e, n, r, i);
        }
        onRemove(e, n, r) {
          this._transitionEngine.removeNode(e, n, r);
        }
        disableAnimations(e, n) {
          this._transitionEngine.markElementAsDisabled(e, n);
        }
        process(e, n, r, i) {
          if ("@" == r.charAt(0)) {
            const [o, s] = ST(r);
            this._timelineEngine.command(o, n, s, i);
          } else this._transitionEngine.trigger(e, n, r, i);
        }
        listen(e, n, r, i, o) {
          if ("@" == r.charAt(0)) {
            const [s, a] = ST(r);
            return this._timelineEngine.listen(s, n, a, o);
          }
          return this._transitionEngine.listen(e, n, r, i, o);
        }
        flush(e = -1) {
          this._transitionEngine.flush(e);
        }
        get players() {
          return this._transitionEngine.players.concat(
            this._timelineEngine.players
          );
        }
        whenRenderingDone() {
          return this._transitionEngine.whenRenderingDone();
        }
      }
      let o8 = (() => {
        class t {
          constructor(n, r, i) {
            (this._element = n),
              (this._startStyles = r),
              (this._endStyles = i),
              (this._state = 0);
            let o = t.initialStylesByElement.get(n);
            o || t.initialStylesByElement.set(n, (o = new Map())),
              (this._initialStyles = o);
          }
          start() {
            this._state < 1 &&
              (this._startStyles &&
                Un(this._element, this._startStyles, this._initialStyles),
              (this._state = 1));
          }
          finish() {
            this.start(),
              this._state < 2 &&
                (Un(this._element, this._initialStyles),
                this._endStyles &&
                  (Un(this._element, this._endStyles),
                  (this._endStyles = null)),
                (this._state = 1));
          }
          destroy() {
            this.finish(),
              this._state < 3 &&
                (t.initialStylesByElement.delete(this._element),
                this._startStyles &&
                  (pi(this._element, this._startStyles),
                  (this._endStyles = null)),
                this._endStyles &&
                  (pi(this._element, this._endStyles),
                  (this._endStyles = null)),
                Un(this._element, this._initialStyles),
                (this._state = 3));
          }
        }
        return (t.initialStylesByElement = new WeakMap()), t;
      })();
      function hm(t) {
        let e = null;
        return (
          t.forEach((n, r) => {
            (function s8(t) {
              return "display" === t || "position" === t;
            })(r) && ((e = e || new Map()), e.set(r, n));
          }),
          e
        );
      }
      class ZT {
        constructor(e, n, r, i) {
          (this.element = e),
            (this.keyframes = n),
            (this.options = r),
            (this._specialStyles = i),
            (this._onDoneFns = []),
            (this._onStartFns = []),
            (this._onDestroyFns = []),
            (this._initialized = !1),
            (this._finished = !1),
            (this._started = !1),
            (this._destroyed = !1),
            (this._originalOnDoneFns = []),
            (this._originalOnStartFns = []),
            (this.time = 0),
            (this.parentPlayer = null),
            (this.currentSnapshot = new Map()),
            (this._duration = r.duration),
            (this._delay = r.delay || 0),
            (this.time = this._duration + this._delay);
        }
        _onFinish() {
          this._finished ||
            ((this._finished = !0),
            this._onDoneFns.forEach((e) => e()),
            (this._onDoneFns = []));
        }
        init() {
          this._buildPlayer(), this._preparePlayerBeforeStart();
        }
        _buildPlayer() {
          if (this._initialized) return;
          this._initialized = !0;
          const e = this.keyframes;
          (this.domPlayer = this._triggerWebAnimation(
            this.element,
            e,
            this.options
          )),
            (this._finalKeyframe = e.length ? e[e.length - 1] : new Map()),
            this.domPlayer.addEventListener("finish", () => this._onFinish());
        }
        _preparePlayerBeforeStart() {
          this._delay ? this._resetDomPlayerState() : this.domPlayer.pause();
        }
        _convertKeyframesToObject(e) {
          const n = [];
          return (
            e.forEach((r) => {
              n.push(Object.fromEntries(r));
            }),
            n
          );
        }
        _triggerWebAnimation(e, n, r) {
          return e.animate(this._convertKeyframesToObject(n), r);
        }
        onStart(e) {
          this._originalOnStartFns.push(e), this._onStartFns.push(e);
        }
        onDone(e) {
          this._originalOnDoneFns.push(e), this._onDoneFns.push(e);
        }
        onDestroy(e) {
          this._onDestroyFns.push(e);
        }
        play() {
          this._buildPlayer(),
            this.hasStarted() ||
              (this._onStartFns.forEach((e) => e()),
              (this._onStartFns = []),
              (this._started = !0),
              this._specialStyles && this._specialStyles.start()),
            this.domPlayer.play();
        }
        pause() {
          this.init(), this.domPlayer.pause();
        }
        finish() {
          this.init(),
            this._specialStyles && this._specialStyles.finish(),
            this._onFinish(),
            this.domPlayer.finish();
        }
        reset() {
          this._resetDomPlayerState(),
            (this._destroyed = !1),
            (this._finished = !1),
            (this._started = !1),
            (this._onStartFns = this._originalOnStartFns),
            (this._onDoneFns = this._originalOnDoneFns);
        }
        _resetDomPlayerState() {
          this.domPlayer && this.domPlayer.cancel();
        }
        restart() {
          this.reset(), this.play();
        }
        hasStarted() {
          return this._started;
        }
        destroy() {
          this._destroyed ||
            ((this._destroyed = !0),
            this._resetDomPlayerState(),
            this._onFinish(),
            this._specialStyles && this._specialStyles.destroy(),
            this._onDestroyFns.forEach((e) => e()),
            (this._onDestroyFns = []));
        }
        setPosition(e) {
          void 0 === this.domPlayer && this.init(),
            (this.domPlayer.currentTime = e * this.time);
        }
        getPosition() {
          return this.domPlayer.currentTime / this.time;
        }
        get totalTime() {
          return this._delay + this._duration;
        }
        beforeDestroy() {
          const e = new Map();
          this.hasStarted() &&
            this._finalKeyframe.forEach((r, i) => {
              "offset" !== i &&
                e.set(i, this._finished ? r : FT(this.element, i));
            }),
            (this.currentSnapshot = e);
        }
        triggerCallback(e) {
          const n = "start" === e ? this._onStartFns : this._onDoneFns;
          n.forEach((r) => r()), (n.length = 0);
        }
      }
      class a8 {
        validateStyleProperty(e) {
          return !0;
        }
        validateAnimatableStyleProperty(e) {
          return !0;
        }
        matchesElement(e, n) {
          return !1;
        }
        containsElement(e, n) {
          return TT(e, n);
        }
        getParentElement(e) {
          return Qg(e);
        }
        query(e, n, r) {
          return AT(e, n, r);
        }
        computeStyle(e, n, r) {
          return window.getComputedStyle(e)[n];
        }
        animate(e, n, r, i, o, s = []) {
          const l = {
            duration: r,
            delay: i,
            fill: 0 == i ? "both" : "forwards",
          };
          o && (l.easing = o);
          const u = new Map(),
            c = s.filter((h) => h instanceof ZT);
          (function p5(t, e) {
            return 0 === t || 0 === e;
          })(r, i) &&
            c.forEach((h) => {
              h.currentSnapshot.forEach((p, g) => u.set(g, p));
            });
          let d = (function d5(t) {
            return t.length
              ? t[0] instanceof Map
                ? t
                : t.map((e) => NT(e))
              : [];
          })(n).map((h) => Pr(h));
          d = (function g5(t, e, n) {
            if (n.size && e.length) {
              let r = e[0],
                i = [];
              if (
                (n.forEach((o, s) => {
                  r.has(s) || i.push(s), r.set(s, o);
                }),
                i.length)
              )
                for (let o = 1; o < e.length; o++) {
                  let s = e[o];
                  i.forEach((a) => s.set(a, FT(t, a)));
                }
            }
            return e;
          })(e, d, u);
          const f = (function i8(t, e) {
            let n = null,
              r = null;
            return (
              Array.isArray(e) && e.length
                ? ((n = hm(e[0])), e.length > 1 && (r = hm(e[e.length - 1])))
                : e instanceof Map && (n = hm(e)),
              n || r ? new o8(t, n, r) : null
            );
          })(e, d);
          return new ZT(e, d, l, f);
        }
      }
      let l8 = (() => {
        class t extends yM {
          constructor(n, r) {
            super(),
              (this._nextAnimationId = 0),
              (this._renderer = n.createRenderer(r.body, {
                id: "0",
                encapsulation: wt.None,
                styles: [],
                data: { animation: [] },
              }));
          }
          build(n) {
            const r = this._nextAnimationId.toString();
            this._nextAnimationId++;
            const i = Array.isArray(n) ? vM(n) : n;
            return (
              YT(this._renderer, null, r, "register", [i]),
              new u8(r, this._renderer)
            );
          }
        }
        return (
          (t.ɵfac = function (n) {
            return new (n || t)(D(rs), D(Je));
          }),
          (t.ɵprov = T({ token: t, factory: t.ɵfac })),
          t
        );
      })();
      class u8 extends zU {
        constructor(e, n) {
          super(), (this._id = e), (this._renderer = n);
        }
        create(e, n) {
          return new c8(this._id, e, n || {}, this._renderer);
        }
      }
      class c8 {
        constructor(e, n, r, i) {
          (this.id = e),
            (this.element = n),
            (this._renderer = i),
            (this.parentPlayer = null),
            (this._started = !1),
            (this.totalTime = 0),
            this._command("create", r);
        }
        _listen(e, n) {
          return this._renderer.listen(this.element, `@@${this.id}:${e}`, n);
        }
        _command(e, ...n) {
          return YT(this._renderer, this.element, this.id, e, n);
        }
        onDone(e) {
          this._listen("done", e);
        }
        onStart(e) {
          this._listen("start", e);
        }
        onDestroy(e) {
          this._listen("destroy", e);
        }
        init() {
          this._command("init");
        }
        hasStarted() {
          return this._started;
        }
        play() {
          this._command("play"), (this._started = !0);
        }
        pause() {
          this._command("pause");
        }
        restart() {
          this._command("restart");
        }
        finish() {
          this._command("finish");
        }
        destroy() {
          this._command("destroy");
        }
        reset() {
          this._command("reset"), (this._started = !1);
        }
        setPosition(e) {
          this._command("setPosition", e);
        }
        getPosition() {
          return this._renderer.engine.players[+this.id]?.getPosition() ?? 0;
        }
      }
      function YT(t, e, n, r, i) {
        return t.setProperty(e, `@@${n}:${r}`, i);
      }
      const XT = "@.disabled";
      let d8 = (() => {
        class t {
          constructor(n, r, i) {
            (this.delegate = n),
              (this.engine = r),
              (this._zone = i),
              (this._currentId = 0),
              (this._microtaskId = 1),
              (this._animationCallbacksBuffer = []),
              (this._rendererCache = new Map()),
              (this._cdRecurDepth = 0),
              (this.promise = Promise.resolve(0)),
              (r.onRemovalComplete = (o, s) => {
                const a = s?.parentNode(o);
                a && s.removeChild(a, o);
              });
          }
          createRenderer(n, r) {
            const o = this.delegate.createRenderer(n, r);
            if (!(n && r && r.data && r.data.animation)) {
              let c = this._rendererCache.get(o);
              return (
                c ||
                  ((c = new JT("", o, this.engine, () =>
                    this._rendererCache.delete(o)
                  )),
                  this._rendererCache.set(o, c)),
                c
              );
            }
            const s = r.id,
              a = r.id + "-" + this._currentId;
            this._currentId++, this.engine.register(a, n);
            const l = (c) => {
              Array.isArray(c)
                ? c.forEach(l)
                : this.engine.registerTrigger(s, a, n, c.name, c);
            };
            return r.data.animation.forEach(l), new f8(this, a, o, this.engine);
          }
          begin() {
            this._cdRecurDepth++, this.delegate.begin && this.delegate.begin();
          }
          _scheduleCountTask() {
            this.promise.then(() => {
              this._microtaskId++;
            });
          }
          scheduleListenerCallback(n, r, i) {
            n >= 0 && n < this._microtaskId
              ? this._zone.run(() => r(i))
              : (0 == this._animationCallbacksBuffer.length &&
                  Promise.resolve(null).then(() => {
                    this._zone.run(() => {
                      this._animationCallbacksBuffer.forEach((o) => {
                        const [s, a] = o;
                        s(a);
                      }),
                        (this._animationCallbacksBuffer = []);
                    });
                  }),
                this._animationCallbacksBuffer.push([r, i]));
          }
          end() {
            this._cdRecurDepth--,
              0 == this._cdRecurDepth &&
                this._zone.runOutsideAngular(() => {
                  this._scheduleCountTask(),
                    this.engine.flush(this._microtaskId);
                }),
              this.delegate.end && this.delegate.end();
          }
          whenRenderingDone() {
            return this.engine.whenRenderingDone();
          }
        }
        return (
          (t.ɵfac = function (n) {
            return new (n || t)(D(rs), D(Sc), D(he));
          }),
          (t.ɵprov = T({ token: t, factory: t.ɵfac })),
          t
        );
      })();
      class JT {
        constructor(e, n, r, i) {
          (this.namespaceId = e),
            (this.delegate = n),
            (this.engine = r),
            (this._onDestroy = i),
            (this.destroyNode = this.delegate.destroyNode
              ? (o) => n.destroyNode(o)
              : null);
        }
        get data() {
          return this.delegate.data;
        }
        destroy() {
          this.engine.destroy(this.namespaceId, this.delegate),
            this.delegate.destroy(),
            this._onDestroy?.();
        }
        createElement(e, n) {
          return this.delegate.createElement(e, n);
        }
        createComment(e) {
          return this.delegate.createComment(e);
        }
        createText(e) {
          return this.delegate.createText(e);
        }
        appendChild(e, n) {
          this.delegate.appendChild(e, n),
            this.engine.onInsert(this.namespaceId, n, e, !1);
        }
        insertBefore(e, n, r, i = !0) {
          this.delegate.insertBefore(e, n, r),
            this.engine.onInsert(this.namespaceId, n, e, i);
        }
        removeChild(e, n, r) {
          this.engine.onRemove(this.namespaceId, n, this.delegate);
        }
        selectRootElement(e, n) {
          return this.delegate.selectRootElement(e, n);
        }
        parentNode(e) {
          return this.delegate.parentNode(e);
        }
        nextSibling(e) {
          return this.delegate.nextSibling(e);
        }
        setAttribute(e, n, r, i) {
          this.delegate.setAttribute(e, n, r, i);
        }
        removeAttribute(e, n, r) {
          this.delegate.removeAttribute(e, n, r);
        }
        addClass(e, n) {
          this.delegate.addClass(e, n);
        }
        removeClass(e, n) {
          this.delegate.removeClass(e, n);
        }
        setStyle(e, n, r, i) {
          this.delegate.setStyle(e, n, r, i);
        }
        removeStyle(e, n, r) {
          this.delegate.removeStyle(e, n, r);
        }
        setProperty(e, n, r) {
          "@" == n.charAt(0) && n == XT
            ? this.disableAnimations(e, !!r)
            : this.delegate.setProperty(e, n, r);
        }
        setValue(e, n) {
          this.delegate.setValue(e, n);
        }
        listen(e, n, r) {
          return this.delegate.listen(e, n, r);
        }
        disableAnimations(e, n) {
          this.engine.disableAnimations(e, n);
        }
      }
      class f8 extends JT {
        constructor(e, n, r, i, o) {
          super(n, r, i, o), (this.factory = e), (this.namespaceId = n);
        }
        setProperty(e, n, r) {
          "@" == n.charAt(0)
            ? "." == n.charAt(1) && n == XT
              ? this.disableAnimations(e, (r = void 0 === r || !!r))
              : this.engine.process(this.namespaceId, e, n.slice(1), r)
            : this.delegate.setProperty(e, n, r);
        }
        listen(e, n, r) {
          if ("@" == n.charAt(0)) {
            const i = (function h8(t) {
              switch (t) {
                case "body":
                  return document.body;
                case "document":
                  return document;
                case "window":
                  return window;
                default:
                  return t;
              }
            })(e);
            let o = n.slice(1),
              s = "";
            return (
              "@" != o.charAt(0) &&
                ([o, s] = (function p8(t) {
                  const e = t.indexOf(".");
                  return [t.substring(0, e), t.slice(e + 1)];
                })(o)),
              this.engine.listen(this.namespaceId, i, o, s, (a) => {
                this.factory.scheduleListenerCallback(a._data || -1, r, a);
              })
            );
          }
          return this.delegate.listen(e, n, r);
        }
      }
      const eA = [
          { provide: yM, useClass: l8 },
          {
            provide: am,
            useFactory: function m8() {
              return new F5();
            },
          },
          {
            provide: Sc,
            useClass: (() => {
              class t extends Sc {
                constructor(n, r, i, o) {
                  super(n.body, r, i);
                }
                ngOnDestroy() {
                  this.flush();
                }
              }
              return (
                (t.ɵfac = function (n) {
                  return new (n || t)(D(Je), D(Zg), D(am), D(sr));
                }),
                (t.ɵprov = T({ token: t, factory: t.ɵfac })),
                t
              );
            })(),
          },
          {
            provide: rs,
            useFactory: function y8(t, e, n) {
              return new d8(t, e, n);
            },
            deps: [np, Sc, he],
          },
        ],
        pm = [
          { provide: Zg, useFactory: () => new a8() },
          { provide: h_, useValue: "BrowserAnimations" },
          ...eA,
        ],
        tA = [
          { provide: Zg, useClass: IT },
          { provide: h_, useValue: "NoopAnimations" },
          ...eA,
        ];
      let v8 = (() => {
          class t {
            static withConfig(n) {
              return { ngModule: t, providers: n.disableAnimations ? tA : pm };
            }
          }
          return (
            (t.ɵfac = function (n) {
              return new (n || t)();
            }),
            (t.ɵmod = Qe({ type: t })),
            (t.ɵinj = ke({ providers: pm, imports: [uE] })),
            t
          );
        })(),
        _8 = (() => {
          class t {
            constructor() {}
            intercept(n, r) {
              let i = localStorage.getItem("token");
              const o = n.clone({
                setHeaders: { Authorization: `Bearer ${i}` },
              });
              return r.handle(o);
            }
          }
          return (
            (t.ɵfac = function (n) {
              return new (n || t)();
            }),
            (t.ɵprov = T({ token: t, factory: t.ɵfac })),
            t
          );
        })(),
        C8 = (() => {
          class t {}
          return (
            (t.ɵfac = function (n) {
              return new (n || t)();
            }),
            (t.ɵmod = Qe({ type: t, bootstrap: [_4] })),
            (t.ɵinj = ke({
              providers: [ai, EM, Qp, { provide: nS, useClass: _8, multi: !0 }],
              imports: [
                uE,
                A3,
                P$,
                xp,
                v8,
                HU,
                f3.forRoot({
                  positionClass: "toast-top-center",
                  preventDuplicates: !0,
                }),
                jz.forRoot({ foodsData: w4 }),
                m4.forRoot([b4]),
              ],
            })),
            t
          );
        })();
      H2()
        .bootstrapModule(C8)
        .catch((t) => console.error(t));
    },
  },
  (Ac) => {
    Ac((Ac.s = 741));
  },
]);
