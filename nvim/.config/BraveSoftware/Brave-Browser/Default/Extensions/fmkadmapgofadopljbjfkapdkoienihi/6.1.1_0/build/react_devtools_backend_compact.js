/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 730:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var process = __webpack_require__(169);


module.exports = LRUCache; // This will be a proper iterable 'Map' in engines that support it,
// or a fakey-fake PseudoMap in older versions.

var Map = __webpack_require__(307);

var util = __webpack_require__(82); // A linked list to keep track of recently-used-ness


var Yallist = __webpack_require__(695); // use symbols if possible, otherwise just _props


var hasSymbol = typeof Symbol === 'function' && process.env._nodeLRUCacheForceNoSymbol !== '1';
var makeSymbol;

if (hasSymbol) {
  makeSymbol = function (key) {
    return Symbol(key);
  };
} else {
  makeSymbol = function (key) {
    return '_' + key;
  };
}

var MAX = makeSymbol('max');
var LENGTH = makeSymbol('length');
var LENGTH_CALCULATOR = makeSymbol('lengthCalculator');
var ALLOW_STALE = makeSymbol('allowStale');
var MAX_AGE = makeSymbol('maxAge');
var DISPOSE = makeSymbol('dispose');
var NO_DISPOSE_ON_SET = makeSymbol('noDisposeOnSet');
var LRU_LIST = makeSymbol('lruList');
var CACHE = makeSymbol('cache');

function naiveLength() {
  return 1;
} // lruList is a yallist where the head is the youngest
// item, and the tail is the oldest.  the list contains the Hit
// objects as the entries.
// Each Hit object has a reference to its Yallist.Node.  This
// never changes.
//
// cache is a Map (or PseudoMap) that matches the keys to
// the Yallist.Node object.


function LRUCache(options) {
  if (!(this instanceof LRUCache)) {
    return new LRUCache(options);
  }

  if (typeof options === 'number') {
    options = {
      max: options
    };
  }

  if (!options) {
    options = {};
  }

  var max = this[MAX] = options.max; // Kind of weird to have a default max of Infinity, but oh well.

  if (!max || !(typeof max === 'number') || max <= 0) {
    this[MAX] = Infinity;
  }

  var lc = options.length || naiveLength;

  if (typeof lc !== 'function') {
    lc = naiveLength;
  }

  this[LENGTH_CALCULATOR] = lc;
  this[ALLOW_STALE] = options.stale || false;
  this[MAX_AGE] = options.maxAge || 0;
  this[DISPOSE] = options.dispose;
  this[NO_DISPOSE_ON_SET] = options.noDisposeOnSet || false;
  this.reset();
} // resize the cache when the max changes.


Object.defineProperty(LRUCache.prototype, 'max', {
  set: function (mL) {
    if (!mL || !(typeof mL === 'number') || mL <= 0) {
      mL = Infinity;
    }

    this[MAX] = mL;
    trim(this);
  },
  get: function () {
    return this[MAX];
  },
  enumerable: true
});
Object.defineProperty(LRUCache.prototype, 'allowStale', {
  set: function (allowStale) {
    this[ALLOW_STALE] = !!allowStale;
  },
  get: function () {
    return this[ALLOW_STALE];
  },
  enumerable: true
});
Object.defineProperty(LRUCache.prototype, 'maxAge', {
  set: function (mA) {
    if (!mA || !(typeof mA === 'number') || mA < 0) {
      mA = 0;
    }

    this[MAX_AGE] = mA;
    trim(this);
  },
  get: function () {
    return this[MAX_AGE];
  },
  enumerable: true
}); // resize the cache when the lengthCalculator changes.

Object.defineProperty(LRUCache.prototype, 'lengthCalculator', {
  set: function (lC) {
    if (typeof lC !== 'function') {
      lC = naiveLength;
    }

    if (lC !== this[LENGTH_CALCULATOR]) {
      this[LENGTH_CALCULATOR] = lC;
      this[LENGTH] = 0;
      this[LRU_LIST].forEach(function (hit) {
        hit.length = this[LENGTH_CALCULATOR](hit.value, hit.key);
        this[LENGTH] += hit.length;
      }, this);
    }

    trim(this);
  },
  get: function () {
    return this[LENGTH_CALCULATOR];
  },
  enumerable: true
});
Object.defineProperty(LRUCache.prototype, 'length', {
  get: function () {
    return this[LENGTH];
  },
  enumerable: true
});
Object.defineProperty(LRUCache.prototype, 'itemCount', {
  get: function () {
    return this[LRU_LIST].length;
  },
  enumerable: true
});

LRUCache.prototype.rforEach = function (fn, thisp) {
  thisp = thisp || this;

  for (var walker = this[LRU_LIST].tail; walker !== null;) {
    var prev = walker.prev;
    forEachStep(this, fn, walker, thisp);
    walker = prev;
  }
};

function forEachStep(self, fn, node, thisp) {
  var hit = node.value;

  if (isStale(self, hit)) {
    del(self, node);

    if (!self[ALLOW_STALE]) {
      hit = undefined;
    }
  }

  if (hit) {
    fn.call(thisp, hit.value, hit.key, self);
  }
}

LRUCache.prototype.forEach = function (fn, thisp) {
  thisp = thisp || this;

  for (var walker = this[LRU_LIST].head; walker !== null;) {
    var next = walker.next;
    forEachStep(this, fn, walker, thisp);
    walker = next;
  }
};

LRUCache.prototype.keys = function () {
  return this[LRU_LIST].toArray().map(function (k) {
    return k.key;
  }, this);
};

LRUCache.prototype.values = function () {
  return this[LRU_LIST].toArray().map(function (k) {
    return k.value;
  }, this);
};

LRUCache.prototype.reset = function () {
  if (this[DISPOSE] && this[LRU_LIST] && this[LRU_LIST].length) {
    this[LRU_LIST].forEach(function (hit) {
      this[DISPOSE](hit.key, hit.value);
    }, this);
  }

  this[CACHE] = new Map(); // hash of items by key

  this[LRU_LIST] = new Yallist(); // list of items in order of use recency

  this[LENGTH] = 0; // length of items in the list
};

LRUCache.prototype.dump = function () {
  return this[LRU_LIST].map(function (hit) {
    if (!isStale(this, hit)) {
      return {
        k: hit.key,
        v: hit.value,
        e: hit.now + (hit.maxAge || 0)
      };
    }
  }, this).toArray().filter(function (h) {
    return h;
  });
};

LRUCache.prototype.dumpLru = function () {
  return this[LRU_LIST];
};
/* istanbul ignore next */


LRUCache.prototype.inspect = function (n, opts) {
  var str = 'LRUCache {';
  var extras = false;
  var as = this[ALLOW_STALE];

  if (as) {
    str += '\n  allowStale: true';
    extras = true;
  }

  var max = this[MAX];

  if (max && max !== Infinity) {
    if (extras) {
      str += ',';
    }

    str += '\n  max: ' + util.inspect(max, opts);
    extras = true;
  }

  var maxAge = this[MAX_AGE];

  if (maxAge) {
    if (extras) {
      str += ',';
    }

    str += '\n  maxAge: ' + util.inspect(maxAge, opts);
    extras = true;
  }

  var lc = this[LENGTH_CALCULATOR];

  if (lc && lc !== naiveLength) {
    if (extras) {
      str += ',';
    }

    str += '\n  length: ' + util.inspect(this[LENGTH], opts);
    extras = true;
  }

  var didFirst = false;
  this[LRU_LIST].forEach(function (item) {
    if (didFirst) {
      str += ',\n  ';
    } else {
      if (extras) {
        str += ',\n';
      }

      didFirst = true;
      str += '\n  ';
    }

    var key = util.inspect(item.key).split('\n').join('\n  ');
    var val = {
      value: item.value
    };

    if (item.maxAge !== maxAge) {
      val.maxAge = item.maxAge;
    }

    if (lc !== naiveLength) {
      val.length = item.length;
    }

    if (isStale(this, item)) {
      val.stale = true;
    }

    val = util.inspect(val, opts).split('\n').join('\n  ');
    str += key + ' => ' + val;
  });

  if (didFirst || extras) {
    str += '\n';
  }

  str += '}';
  return str;
};

LRUCache.prototype.set = function (key, value, maxAge) {
  maxAge = maxAge || this[MAX_AGE];
  var now = maxAge ? Date.now() : 0;
  var len = this[LENGTH_CALCULATOR](value, key);

  if (this[CACHE].has(key)) {
    if (len > this[MAX]) {
      del(this, this[CACHE].get(key));
      return false;
    }

    var node = this[CACHE].get(key);
    var item = node.value; // dispose of the old one before overwriting
    // split out into 2 ifs for better coverage tracking

    if (this[DISPOSE]) {
      if (!this[NO_DISPOSE_ON_SET]) {
        this[DISPOSE](key, item.value);
      }
    }

    item.now = now;
    item.maxAge = maxAge;
    item.value = value;
    this[LENGTH] += len - item.length;
    item.length = len;
    this.get(key);
    trim(this);
    return true;
  }

  var hit = new Entry(key, value, len, now, maxAge); // oversized objects fall out of cache automatically.

  if (hit.length > this[MAX]) {
    if (this[DISPOSE]) {
      this[DISPOSE](key, value);
    }

    return false;
  }

  this[LENGTH] += hit.length;
  this[LRU_LIST].unshift(hit);
  this[CACHE].set(key, this[LRU_LIST].head);
  trim(this);
  return true;
};

LRUCache.prototype.has = function (key) {
  if (!this[CACHE].has(key)) return false;
  var hit = this[CACHE].get(key).value;

  if (isStale(this, hit)) {
    return false;
  }

  return true;
};

LRUCache.prototype.get = function (key) {
  return get(this, key, true);
};

LRUCache.prototype.peek = function (key) {
  return get(this, key, false);
};

LRUCache.prototype.pop = function () {
  var node = this[LRU_LIST].tail;
  if (!node) return null;
  del(this, node);
  return node.value;
};

LRUCache.prototype.del = function (key) {
  del(this, this[CACHE].get(key));
};

LRUCache.prototype.load = function (arr) {
  // reset the cache
  this.reset();
  var now = Date.now(); // A previous serialized cache has the most recent items first

  for (var l = arr.length - 1; l >= 0; l--) {
    var hit = arr[l];
    var expiresAt = hit.e || 0;

    if (expiresAt === 0) {
      // the item was created without expiration in a non aged cache
      this.set(hit.k, hit.v);
    } else {
      var maxAge = expiresAt - now; // dont add already expired items

      if (maxAge > 0) {
        this.set(hit.k, hit.v, maxAge);
      }
    }
  }
};

LRUCache.prototype.prune = function () {
  var self = this;
  this[CACHE].forEach(function (value, key) {
    get(self, key, false);
  });
};

function get(self, key, doUse) {
  var node = self[CACHE].get(key);

  if (node) {
    var hit = node.value;

    if (isStale(self, hit)) {
      del(self, node);
      if (!self[ALLOW_STALE]) hit = undefined;
    } else {
      if (doUse) {
        self[LRU_LIST].unshiftNode(node);
      }
    }

    if (hit) hit = hit.value;
  }

  return hit;
}

function isStale(self, hit) {
  if (!hit || !hit.maxAge && !self[MAX_AGE]) {
    return false;
  }

  var stale = false;
  var diff = Date.now() - hit.now;

  if (hit.maxAge) {
    stale = diff > hit.maxAge;
  } else {
    stale = self[MAX_AGE] && diff > self[MAX_AGE];
  }

  return stale;
}

function trim(self) {
  if (self[LENGTH] > self[MAX]) {
    for (var walker = self[LRU_LIST].tail; self[LENGTH] > self[MAX] && walker !== null;) {
      // We know that we're about to delete this one, and also
      // what the next least recently used key will be, so just
      // go ahead and set it now.
      var prev = walker.prev;
      del(self, walker);
      walker = prev;
    }
  }
}

function del(self, node) {
  if (node) {
    var hit = node.value;

    if (self[DISPOSE]) {
      self[DISPOSE](hit.key, hit.value);
    }

    self[LENGTH] -= hit.length;
    self[CACHE].delete(hit.key);
    self[LRU_LIST].removeNode(node);
  }
} // classy, since V8 prefers predictable objects.


function Entry(key, value, length, now, maxAge) {
  this.key = key;
  this.value = value;
  this.length = length;
  this.now = now;
  this.maxAge = maxAge || 0;
}

/***/ }),

/***/ 169:
/***/ ((module) => {

// shim for using process in browser
var process = module.exports = {}; // cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}

function defaultClearTimeout() {
  throw new Error('clearTimeout has not been defined');
}

(function () {
  try {
    if (typeof setTimeout === 'function') {
      cachedSetTimeout = setTimeout;
    } else {
      cachedSetTimeout = defaultSetTimout;
    }
  } catch (e) {
    cachedSetTimeout = defaultSetTimout;
  }

  try {
    if (typeof clearTimeout === 'function') {
      cachedClearTimeout = clearTimeout;
    } else {
      cachedClearTimeout = defaultClearTimeout;
    }
  } catch (e) {
    cachedClearTimeout = defaultClearTimeout;
  }
})();

function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    //normal enviroments in sane situations
    return setTimeout(fun, 0);
  } // if setTimeout wasn't available but was latter defined


  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}

function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    //normal enviroments in sane situations
    return clearTimeout(marker);
  } // if clearTimeout wasn't available but was latter defined


  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
      return cachedClearTimeout.call(null, marker);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
      // Some versions of I.E. have different rules for clearTimeout vs setTimeout
      return cachedClearTimeout.call(this, marker);
    }
  }
}

var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }

  draining = false;

  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }

  if (queue.length) {
    drainQueue();
  }
}

function drainQueue() {
  if (draining) {
    return;
  }

  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;

  while (len) {
    currentQueue = queue;
    queue = [];

    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }

    queueIndex = -1;
    len = queue.length;
  }

  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}

process.nextTick = function (fun) {
  var args = new Array(arguments.length - 1);

  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }

  queue.push(new Item(fun, args));

  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
}; // v8 likes predictible objects


function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}

Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues

process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
  return [];
};

process.binding = function (name) {
  throw new Error('process.binding is not supported');
};

process.cwd = function () {
  return '/';
};

process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};

process.umask = function () {
  return 0;
};

/***/ }),

/***/ 307:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* provided dependency */ var process = __webpack_require__(169);
if (process.env.npm_package_name === 'pseudomap' && process.env.npm_lifecycle_script === 'test') process.env.TEST_PSEUDOMAP = 'true';

if (typeof Map === 'function' && !process.env.TEST_PSEUDOMAP) {
  module.exports = Map;
} else {
  module.exports = __webpack_require__(761);
}

/***/ }),

/***/ 761:
/***/ ((module) => {

var hasOwnProperty = Object.prototype.hasOwnProperty;
module.exports = PseudoMap;

function PseudoMap(set) {
  if (!(this instanceof PseudoMap)) // whyyyyyyy
    throw new TypeError("Constructor PseudoMap requires 'new'");
  this.clear();

  if (set) {
    if (set instanceof PseudoMap || typeof Map === 'function' && set instanceof Map) set.forEach(function (value, key) {
      this.set(key, value);
    }, this);else if (Array.isArray(set)) set.forEach(function (kv) {
      this.set(kv[0], kv[1]);
    }, this);else throw new TypeError('invalid argument');
  }
}

PseudoMap.prototype.forEach = function (fn, thisp) {
  thisp = thisp || this;
  Object.keys(this._data).forEach(function (k) {
    if (k !== 'size') fn.call(thisp, this._data[k].value, this._data[k].key);
  }, this);
};

PseudoMap.prototype.has = function (k) {
  return !!find(this._data, k);
};

PseudoMap.prototype.get = function (k) {
  var res = find(this._data, k);
  return res && res.value;
};

PseudoMap.prototype.set = function (k, v) {
  set(this._data, k, v);
};

PseudoMap.prototype.delete = function (k) {
  var res = find(this._data, k);

  if (res) {
    delete this._data[res._index];
    this._data.size--;
  }
};

PseudoMap.prototype.clear = function () {
  var data = Object.create(null);
  data.size = 0;
  Object.defineProperty(this, '_data', {
    value: data,
    enumerable: false,
    configurable: true,
    writable: false
  });
};

Object.defineProperty(PseudoMap.prototype, 'size', {
  get: function () {
    return this._data.size;
  },
  set: function (n) {},
  enumerable: true,
  configurable: true
});

PseudoMap.prototype.values = PseudoMap.prototype.keys = PseudoMap.prototype.entries = function () {
  throw new Error('iterators are not implemented in this version');
}; // Either identical, or both NaN


function same(a, b) {
  return a === b || a !== a && b !== b;
}

function Entry(k, v, i) {
  this.key = k;
  this.value = v;
  this._index = i;
}

function find(data, k) {
  for (var i = 0, s = '_' + k, key = s; hasOwnProperty.call(data, key); key = s + i++) {
    if (same(data[key].key, k)) return data[key];
  }
}

function set(data, k, v) {
  for (var i = 0, s = '_' + k, key = s; hasOwnProperty.call(data, key); key = s + i++) {
    if (same(data[key].key, k)) {
      data[key].value = v;
      return;
    }
  }

  data.size++;
  data[key] = new Entry(k, v, key);
}

/***/ }),

/***/ 718:
/***/ ((module) => {

if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor;
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor;

    var TempCtor = function () {};

    TempCtor.prototype = superCtor.prototype;
    ctor.prototype = new TempCtor();
    ctor.prototype.constructor = ctor;
  };
}

/***/ }),

/***/ 715:
/***/ ((module) => {

module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object' && typeof arg.copy === 'function' && typeof arg.fill === 'function' && typeof arg.readUInt8 === 'function';
};

/***/ }),

/***/ 82:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

/* provided dependency */ var process = __webpack_require__(169);
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
var formatRegExp = /%[sdj%]/g;

exports.format = function (f) {
  if (!isString(f)) {
    var objects = [];

    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }

    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function (x) {
    if (x === '%%') return '%';
    if (i >= len) return x;

    switch (x) {
      case '%s':
        return String(args[i++]);

      case '%d':
        return Number(args[i++]);

      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }

      default:
        return x;
    }
  });

  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }

  return str;
}; // Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.


exports.deprecate = function (fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function () {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;

  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }

      warned = true;
    }

    return fn.apply(this, arguments);
  }

  return deprecated;
};

var debugs = {};
var debugEnviron;

exports.debuglog = function (set) {
  if (isUndefined(debugEnviron)) debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();

  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;

      debugs[set] = function () {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function () {};
    }
  }

  return debugs[set];
};
/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */

/* legacy: obj, showHidden, depth, colors*/


function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  }; // legacy...

  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];

  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  } // set default options


  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}

exports.inspect = inspect; // http://en.wikipedia.org/wiki/ANSI_escape_code#graphics

inspect.colors = {
  'bold': [1, 22],
  'italic': [3, 23],
  'underline': [4, 24],
  'inverse': [7, 27],
  'white': [37, 39],
  'grey': [90, 39],
  'black': [30, 39],
  'blue': [34, 39],
  'cyan': [36, 39],
  'green': [32, 39],
  'magenta': [35, 39],
  'red': [31, 39],
  'yellow': [33, 39]
}; // Don't use 'blue' not visible on cmd.exe

inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};

function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str + '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}

function stylizeNoColor(str, styleType) {
  return str;
}

function arrayToHash(array) {
  var hash = {};
  array.forEach(function (val, idx) {
    hash[val] = true;
  });
  return hash;
}

function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect && value && isFunction(value.inspect) && // Filter out the util module, it's inspect function is special
  value.inspect !== exports.inspect && // Also filter out any prototype objects using the circular check.
  !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);

    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }

    return ret;
  } // Primitive types cannot have properties


  var primitive = formatPrimitive(ctx, value);

  if (primitive) {
    return primitive;
  } // Look up the keys of the object.


  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  } // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx


  if (isError(value) && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  } // Some type of object without properties can be shortcutted.


  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }

    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }

    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }

    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '',
      array = false,
      braces = ['{', '}']; // Make Array say that they are Array

  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  } // Make functions say that they are functions


  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  } // Make RegExps say that they are RegExps


  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  } // Make dates with properties first say the date


  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  } // Make error with message first say the error


  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);
  var output;

  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function (key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();
  return reduceToSingleString(output, base, braces);
}

function formatPrimitive(ctx, value) {
  if (isUndefined(value)) return ctx.stylize('undefined', 'undefined');

  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '').replace(/'/g, "\\'").replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }

  if (isNumber(value)) return ctx.stylize('' + value, 'number');
  if (isBoolean(value)) return ctx.stylize('' + value, 'boolean'); // For some reason typeof null is "object", so special case here.

  if (isNull(value)) return ctx.stylize('null', 'null');
}

function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}

function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];

  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, String(i), true));
    } else {
      output.push('');
    }
  }

  keys.forEach(function (key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, key, true));
    }
  });
  return output;
}

function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || {
    value: value[key]
  };

  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }

  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }

  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }

      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function (line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function (line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }

  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }

    name = JSON.stringify('' + key);

    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}

function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function (prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] + (base === '' ? '' : base + '\n ') + ' ' + output.join(',\n  ') + ' ' + braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
} // NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.


function isArray(ar) {
  return Array.isArray(ar);
}

exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}

exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}

exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}

exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}

exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}

exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}

exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}

exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}

exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}

exports.isDate = isDate;

function isError(e) {
  return isObject(e) && (objectToString(e) === '[object Error]' || e instanceof Error);
}

exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}

exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null || typeof arg === 'boolean' || typeof arg === 'number' || typeof arg === 'string' || typeof arg === 'symbol' || // ES6 symbol
  typeof arg === 'undefined';
}

exports.isPrimitive = isPrimitive;
exports.isBuffer = __webpack_require__(715);

function objectToString(o) {
  return Object.prototype.toString.call(o);
}

function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}

var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']; // 26 Feb 16:19:34

function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()), pad(d.getMinutes()), pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
} // log is just a thin wrapper to console.log that prepends a timestamp


exports.log = function () {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};
/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */


exports.inherits = __webpack_require__(718);

exports._extend = function (origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;
  var keys = Object.keys(add);
  var i = keys.length;

  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }

  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

/***/ }),

/***/ 695:
/***/ ((module) => {

module.exports = Yallist;
Yallist.Node = Node;
Yallist.create = Yallist;

function Yallist(list) {
  var self = this;

  if (!(self instanceof Yallist)) {
    self = new Yallist();
  }

  self.tail = null;
  self.head = null;
  self.length = 0;

  if (list && typeof list.forEach === 'function') {
    list.forEach(function (item) {
      self.push(item);
    });
  } else if (arguments.length > 0) {
    for (var i = 0, l = arguments.length; i < l; i++) {
      self.push(arguments[i]);
    }
  }

  return self;
}

Yallist.prototype.removeNode = function (node) {
  if (node.list !== this) {
    throw new Error('removing node which does not belong to this list');
  }

  var next = node.next;
  var prev = node.prev;

  if (next) {
    next.prev = prev;
  }

  if (prev) {
    prev.next = next;
  }

  if (node === this.head) {
    this.head = next;
  }

  if (node === this.tail) {
    this.tail = prev;
  }

  node.list.length--;
  node.next = null;
  node.prev = null;
  node.list = null;
};

Yallist.prototype.unshiftNode = function (node) {
  if (node === this.head) {
    return;
  }

  if (node.list) {
    node.list.removeNode(node);
  }

  var head = this.head;
  node.list = this;
  node.next = head;

  if (head) {
    head.prev = node;
  }

  this.head = node;

  if (!this.tail) {
    this.tail = node;
  }

  this.length++;
};

Yallist.prototype.pushNode = function (node) {
  if (node === this.tail) {
    return;
  }

  if (node.list) {
    node.list.removeNode(node);
  }

  var tail = this.tail;
  node.list = this;
  node.prev = tail;

  if (tail) {
    tail.next = node;
  }

  this.tail = node;

  if (!this.head) {
    this.head = node;
  }

  this.length++;
};

Yallist.prototype.push = function () {
  for (var i = 0, l = arguments.length; i < l; i++) {
    push(this, arguments[i]);
  }

  return this.length;
};

Yallist.prototype.unshift = function () {
  for (var i = 0, l = arguments.length; i < l; i++) {
    unshift(this, arguments[i]);
  }

  return this.length;
};

Yallist.prototype.pop = function () {
  if (!this.tail) {
    return undefined;
  }

  var res = this.tail.value;
  this.tail = this.tail.prev;

  if (this.tail) {
    this.tail.next = null;
  } else {
    this.head = null;
  }

  this.length--;
  return res;
};

Yallist.prototype.shift = function () {
  if (!this.head) {
    return undefined;
  }

  var res = this.head.value;
  this.head = this.head.next;

  if (this.head) {
    this.head.prev = null;
  } else {
    this.tail = null;
  }

  this.length--;
  return res;
};

Yallist.prototype.forEach = function (fn, thisp) {
  thisp = thisp || this;

  for (var walker = this.head, i = 0; walker !== null; i++) {
    fn.call(thisp, walker.value, i, this);
    walker = walker.next;
  }
};

Yallist.prototype.forEachReverse = function (fn, thisp) {
  thisp = thisp || this;

  for (var walker = this.tail, i = this.length - 1; walker !== null; i--) {
    fn.call(thisp, walker.value, i, this);
    walker = walker.prev;
  }
};

Yallist.prototype.get = function (n) {
  for (var i = 0, walker = this.head; walker !== null && i < n; i++) {
    // abort out of the list early if we hit a cycle
    walker = walker.next;
  }

  if (i === n && walker !== null) {
    return walker.value;
  }
};

Yallist.prototype.getReverse = function (n) {
  for (var i = 0, walker = this.tail; walker !== null && i < n; i++) {
    // abort out of the list early if we hit a cycle
    walker = walker.prev;
  }

  if (i === n && walker !== null) {
    return walker.value;
  }
};

Yallist.prototype.map = function (fn, thisp) {
  thisp = thisp || this;
  var res = new Yallist();

  for (var walker = this.head; walker !== null;) {
    res.push(fn.call(thisp, walker.value, this));
    walker = walker.next;
  }

  return res;
};

Yallist.prototype.mapReverse = function (fn, thisp) {
  thisp = thisp || this;
  var res = new Yallist();

  for (var walker = this.tail; walker !== null;) {
    res.push(fn.call(thisp, walker.value, this));
    walker = walker.prev;
  }

  return res;
};

Yallist.prototype.reduce = function (fn, initial) {
  var acc;
  var walker = this.head;

  if (arguments.length > 1) {
    acc = initial;
  } else if (this.head) {
    walker = this.head.next;
    acc = this.head.value;
  } else {
    throw new TypeError('Reduce of empty list with no initial value');
  }

  for (var i = 0; walker !== null; i++) {
    acc = fn(acc, walker.value, i);
    walker = walker.next;
  }

  return acc;
};

Yallist.prototype.reduceReverse = function (fn, initial) {
  var acc;
  var walker = this.tail;

  if (arguments.length > 1) {
    acc = initial;
  } else if (this.tail) {
    walker = this.tail.prev;
    acc = this.tail.value;
  } else {
    throw new TypeError('Reduce of empty list with no initial value');
  }

  for (var i = this.length - 1; walker !== null; i--) {
    acc = fn(acc, walker.value, i);
    walker = walker.prev;
  }

  return acc;
};

Yallist.prototype.toArray = function () {
  var arr = new Array(this.length);

  for (var i = 0, walker = this.head; walker !== null; i++) {
    arr[i] = walker.value;
    walker = walker.next;
  }

  return arr;
};

Yallist.prototype.toArrayReverse = function () {
  var arr = new Array(this.length);

  for (var i = 0, walker = this.tail; walker !== null; i++) {
    arr[i] = walker.value;
    walker = walker.prev;
  }

  return arr;
};

Yallist.prototype.slice = function (from, to) {
  to = to || this.length;

  if (to < 0) {
    to += this.length;
  }

  from = from || 0;

  if (from < 0) {
    from += this.length;
  }

  var ret = new Yallist();

  if (to < from || to < 0) {
    return ret;
  }

  if (from < 0) {
    from = 0;
  }

  if (to > this.length) {
    to = this.length;
  }

  for (var i = 0, walker = this.head; walker !== null && i < from; i++) {
    walker = walker.next;
  }

  for (; walker !== null && i < to; i++, walker = walker.next) {
    ret.push(walker.value);
  }

  return ret;
};

Yallist.prototype.sliceReverse = function (from, to) {
  to = to || this.length;

  if (to < 0) {
    to += this.length;
  }

  from = from || 0;

  if (from < 0) {
    from += this.length;
  }

  var ret = new Yallist();

  if (to < from || to < 0) {
    return ret;
  }

  if (from < 0) {
    from = 0;
  }

  if (to > this.length) {
    to = this.length;
  }

  for (var i = this.length, walker = this.tail; walker !== null && i > to; i--) {
    walker = walker.prev;
  }

  for (; walker !== null && i > from; i--, walker = walker.prev) {
    ret.push(walker.value);
  }

  return ret;
};

Yallist.prototype.reverse = function () {
  var head = this.head;
  var tail = this.tail;

  for (var walker = head; walker !== null; walker = walker.prev) {
    var p = walker.prev;
    walker.prev = walker.next;
    walker.next = p;
  }

  this.head = tail;
  this.tail = head;
  return this;
};

function push(self, item) {
  self.tail = new Node(item, self.tail, null, self);

  if (!self.head) {
    self.head = self.tail;
  }

  self.length++;
}

function unshift(self, item) {
  self.head = new Node(item, null, self.head, self);

  if (!self.tail) {
    self.tail = self.head;
  }

  self.length++;
}

function Node(value, prev, next, list) {
  if (!(this instanceof Node)) {
    return new Node(value, prev, next, list);
  }

  this.list = list;
  this.value = value;

  if (prev) {
    prev.next = this;
    this.prev = prev;
  } else {
    this.prev = null;
  }

  if (next) {
    next.prev = this;
    this.next = next;
  } else {
    this.next = null;
  }
}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";

;// CONCATENATED MODULE: ../react-devtools-shared/src/events.js
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
class EventEmitter {
  constructor() {
    _defineProperty(this, "listenersMap", new Map());
  }

  addListener(event, listener) {
    const listeners = this.listenersMap.get(event);

    if (listeners === undefined) {
      this.listenersMap.set(event, [listener]);
    } else {
      const index = listeners.indexOf(listener);

      if (index < 0) {
        listeners.push(listener);
      }
    }
  }

  emit(event, ...args) {
    const listeners = this.listenersMap.get(event);

    if (listeners !== undefined) {
      if (listeners.length === 1) {
        // No need to clone or try/catch
        const listener = listeners[0];
        listener.apply(null, args);
      } else {
        let didThrow = false;
        let caughtError = null;
        const clonedListeners = Array.from(listeners);

        for (let i = 0; i < clonedListeners.length; i++) {
          const listener = clonedListeners[i];

          try {
            listener.apply(null, args);
          } catch (error) {
            if (caughtError === null) {
              didThrow = true;
              caughtError = error;
            }
          }
        }

        if (didThrow) {
          throw caughtError;
        }
      }
    }
  }

  removeAllListeners() {
    this.listenersMap.clear();
  }

  removeListener(event, listener) {
    const listeners = this.listenersMap.get(event);

    if (listeners !== undefined) {
      const index = listeners.indexOf(listener);

      if (index >= 0) {
        listeners.splice(index, 1);
      }
    }
  }

}
;// CONCATENATED MODULE: ../react-devtools-shared/src/constants.js
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
const CHROME_WEBSTORE_EXTENSION_ID = 'fmkadmapgofadopljbjfkapdkoienihi';
const INTERNAL_EXTENSION_ID = 'dnjnjgbfilfphmojnmhliehogmojhclc';
const LOCAL_EXTENSION_ID = 'ikiahnapldjmdmpkmfhjdjilojjhgcbf'; // Flip this flag to true to enable verbose console debug logging.

const __DEBUG__ = false; // Flip this flag to true to enable performance.mark() and performance.measure() timings.

const __PERFORMANCE_PROFILE__ = false;
const constants_TREE_OPERATION_ADD = 1;
const constants_TREE_OPERATION_REMOVE = 2;
const constants_TREE_OPERATION_REORDER_CHILDREN = 3;
const constants_TREE_OPERATION_UPDATE_TREE_BASE_DURATION = 4;
const constants_TREE_OPERATION_UPDATE_ERRORS_OR_WARNINGS = 5;
const constants_TREE_OPERATION_REMOVE_ROOT = 6;
const constants_TREE_OPERATION_SET_SUBTREE_MODE = 7;
const PROFILING_FLAG_BASIC_SUPPORT = 0b01;
const PROFILING_FLAG_TIMELINE_SUPPORT = 0b10;
const LOCAL_STORAGE_DEFAULT_TAB_KEY = 'React::DevTools::defaultTab';
const constants_LOCAL_STORAGE_COMPONENT_FILTER_PREFERENCES_KEY = 'React::DevTools::componentFilters';
const SESSION_STORAGE_LAST_SELECTION_KEY = 'React::DevTools::lastSelection';
const constants_LOCAL_STORAGE_OPEN_IN_EDITOR_URL = 'React::DevTools::openInEditorUrl';
const LOCAL_STORAGE_OPEN_IN_EDITOR_URL_PRESET = 'React::DevTools::openInEditorUrlPreset';
const LOCAL_STORAGE_PARSE_HOOK_NAMES_KEY = 'React::DevTools::parseHookNames';
const constants_SESSION_STORAGE_RECORD_CHANGE_DESCRIPTIONS_KEY = 'React::DevTools::recordChangeDescriptions';
const constants_SESSION_STORAGE_RECORD_TIMELINE_KEY = 'React::DevTools::recordTimeline';
const constants_SESSION_STORAGE_RELOAD_AND_PROFILE_KEY = 'React::DevTools::reloadAndProfile';
const LOCAL_STORAGE_BROWSER_THEME = 'React::DevTools::theme';
const LOCAL_STORAGE_TRACE_UPDATES_ENABLED_KEY = 'React::DevTools::traceUpdatesEnabled';
const LOCAL_STORAGE_SUPPORTS_PROFILING_KEY = 'React::DevTools::supportsProfiling';
const PROFILER_EXPORT_VERSION = 5;
const FIREFOX_CONSOLE_DIMMING_COLOR = 'color: rgba(124, 124, 124, 0.75)';
const ANSI_STYLE_DIMMING_TEMPLATE = '\x1b[2;38;2;124;124;124m%s\x1b[0m';
const ANSI_STYLE_DIMMING_TEMPLATE_WITH_COMPONENT_STACK = '\x1b[2;38;2;124;124;124m%s %o\x1b[0m';
// EXTERNAL MODULE: ../../node_modules/lru-cache/index.js
var lru_cache = __webpack_require__(730);
var lru_cache_default = /*#__PURE__*/__webpack_require__.n(lru_cache);
;// CONCATENATED MODULE: ../shared/ReactFeatureFlags.js
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
// -----------------------------------------------------------------------------
// Land or remove (zero effort)
//
// Flags that can likely be deleted or landed without consequences
// -----------------------------------------------------------------------------
// None
// -----------------------------------------------------------------------------
// Killswitch
//
// Flags that exist solely to turn off a change in case it causes a regression
// when it rolls out to prod. We should remove these as soon as possible.
// -----------------------------------------------------------------------------
const enableHydrationLaneScheduling = true; // -----------------------------------------------------------------------------
// Land or remove (moderate effort)
//
// Flags that can be probably deleted or landed, but might require extra effort
// like migrating internal callers or performance testing.
// -----------------------------------------------------------------------------
// TODO: Finish rolling out in www

const favorSafetyOverHydrationPerf = true; // Need to remove didTimeout argument from Scheduler before landing

const disableSchedulerTimeoutInWorkLoop = false; // TODO: Land at Meta before removing.

const disableDefaultPropsExceptForClasses = true; // -----------------------------------------------------------------------------
// Slated for removal in the future (significant effort)
//
// These are experiments that didn't work out, and never shipped, but we can't
// delete from the codebase until we migrate internal callers.
// -----------------------------------------------------------------------------
// Add a callback property to suspense to notify which promises are currently
// in the update queue. This allows reporting and tracing of what is causing
// the user to see a loading state.
//
// Also allows hydration callbacks to fire when a dehydrated boundary gets
// hydrated or deleted.
//
// This will eventually be replaced by the Transition Tracing proposal.

const enableSuspenseCallback = false; // Experimental Scope support.

const enableScopeAPI = false; // Experimental Create Event Handle API.

const enableCreateEventHandleAPI = false; // Support legacy Primer support on internal FB www

const enableLegacyFBSupport = false; // -----------------------------------------------------------------------------
// Ongoing experiments
//
// These are features that we're either actively exploring or are reasonably
// likely to include in an upcoming release.
// -----------------------------------------------------------------------------
// Yield to the browser event loop and not just the scheduler event loop before passive effects.
// Fix gated tests that fail with this flag enabled before turning it back on.

const enableYieldingBeforePassive = false; // Experiment to intentionally yield less to block high framerate animations.

const enableThrottledScheduling = false;
const enableLegacyCache = (/* unused pure expression or super */ null && (true));
const enableAsyncIterableChildren = (/* unused pure expression or super */ null && (true));
const enableTaint = (/* unused pure expression or super */ null && (true));
const enablePostpone = (/* unused pure expression or super */ null && (true));
const enableHalt = (/* unused pure expression or super */ null && (true));
const enableViewTransition = (/* unused pure expression or super */ null && (true));
/**
 * Switches the Fabric API from doing layout in commit work instead of complete work.
 */

const enableFabricCompleteRootInCommitPhase = false;
/**
 * Switches Fiber creation to a simple object instead of a constructor.
 */

const enableObjectFiber = false;
const enableTransitionTracing = false; // FB-only usage. The new API has different semantics.

const enableLegacyHidden = false; // Enables unstable_avoidThisFallback feature in Fiber

const enableSuspenseAvoidThisFallback = false;
const enableCPUSuspense = (/* unused pure expression or super */ null && (true)); // Test this at Meta before enabling.

const enableNoCloningMemoCache = false;
const enableUseEffectEventHook = (/* unused pure expression or super */ null && (true)); // Test in www before enabling in open source.
// Enables DOM-server to stream its instruction set as data-attributes
// (handled with an MutationObserver) instead of inline-scripts

const enableFizzExternalRuntime = (/* unused pure expression or super */ null && (true));
const alwaysThrottleRetries = true;
const passChildrenWhenCloningPersistedNodes = false;
/**
 * Enables a new Fiber flag used in persisted mode to reduce the number
 * of cloned host components.
 */

const enablePersistedModeClonedFlag = false;
const enableOwnerStacks = (/* unused pure expression or super */ null && (true));
const enableShallowPropDiffing = false;
const enableSiblingPrerendering = true;
/**
 * Enables an expiration time for retry lanes to avoid starvation.
 */

const enableRetryLaneExpiration = false;
const retryLaneExpirationMs = 5000;
const syncLaneExpirationMs = 250;
const transitionLaneExpirationMs = 5000;
/**
 * Enables a new error detection for infinite render loops from updates caused
 * by setState or similar outside of the component owning the state.
 */

const enableInfiniteRenderLoopDetection = false;
/**
 * Experimental new hook for better managing resources in effects.
 */

const enableUseResourceEffectHook = false;
const enableFastAddPropertiesInDiffing = true; // -----------------------------------------------------------------------------
// Ready for next major.
//
// Alias __NEXT_MAJOR__ to __EXPERIMENTAL__ for easier skimming.
// -----------------------------------------------------------------------------
// TODO: Anything that's set to `true` in this section should either be cleaned
// up (if it's on everywhere, including Meta and RN builds) or moved to a
// different section of this file.
// const __NEXT_MAJOR__ = __EXPERIMENTAL__;
// Renames the internal symbol for elements since they have changed signature/constructor

const renameElementSymbol = true;
/**
 * Enables a fix to run insertion effect cleanup on hidden subtrees.
 */

const enableHiddenSubtreeInsertionEffectCleanup = false;
/**
 * Removes legacy style context defined using static `contextTypes` and consumed with static `childContextTypes`.
 */

const disableLegacyContext = true;
/**
 * Removes legacy style context just from function components.
 */

const disableLegacyContextForFunctionComponents = true; // Enable the moveBefore() alternative to insertBefore(). This preserves states of moves.

const enableMoveBefore = false; // Disabled caching behavior of `react/cache` in client runtimes.

const disableClientCache = true; // Warn on any usage of ReactTestRenderer

const enableReactTestRendererWarning = true; // Disables legacy mode
// This allows us to land breaking changes to remove legacy mode APIs in experimental builds
// before removing them in stable in the next Major

const disableLegacyMode = true; // Make <Context> equivalent to <Context.Provider> instead of <Context.Consumer>

const ReactFeatureFlags_enableRenderableContext = true; // -----------------------------------------------------------------------------
// Chopping Block
//
// Planned feature deprecations and breaking changes. Sorted roughly in order of
// when we plan to enable them.
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// React DOM Chopping Block
//
// Similar to main Chopping Block but only flags related to React DOM. These are
// grouped because we will likely batch all of them into a single major release.
// -----------------------------------------------------------------------------
// Disable support for comment nodes as React DOM containers. Already disabled
// in open source, but www codebase still relies on it. Need to remove.

const disableCommentsAsDOMContainers = true;
const enableTrustedTypesIntegration = false; // Prevent the value and checked attributes from syncing with their related
// DOM properties

const disableInputAttributeSyncing = false; // Disables children for <textarea> elements

const disableTextareaChildren = false; // -----------------------------------------------------------------------------
// Debugging and DevTools
// -----------------------------------------------------------------------------
// Gather advanced timing metrics for Profiler subtrees.

const enableProfilerTimer = (/* unused pure expression or super */ null && (false)); // Adds performance.measure() marks using Chrome extensions to allow formatted
// Component rendering tracks to show up in the Performance tab.
// This flag will be used for both Server Component and Client Component tracks.
// All calls should also be gated on enableProfilerTimer.

const enableComponentPerformanceTrack = true; // Adds user timing marks for e.g. state updates, suspense, and work loop stuff,
// for an experimental timeline tool.

const enableSchedulingProfiler = !enableComponentPerformanceTrack && false; // Record durations for commit and passive effects phases.

const enableProfilerCommitHooks = (/* unused pure expression or super */ null && (false)); // Phase param passed to onRender callback differentiates between an "update" and a "cascading-update".

const enableProfilerNestedUpdatePhase = (/* unused pure expression or super */ null && (false));
const enableAsyncDebugInfo = (/* unused pure expression or super */ null && (true)); // Track which Fiber(s) schedule render work.

const enableUpdaterTracking = (/* unused pure expression or super */ null && (false)); // Internal only.

const enableDO_NOT_USE_disableStrictPassiveEffect = false;
const enableRemoveConsolePatches = true;
;// CONCATENATED MODULE: ../shared/ReactSymbols.js
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
 // ATTENTION
// When adding new symbols to this file,
// Please consider also adding to 'react-devtools-shared/src/backend/ReactSymbols'
// The Symbol used to tag the ReactElement-like types.

const ReactSymbols_REACT_LEGACY_ELEMENT_TYPE = Symbol.for('react.element');
const ReactSymbols_REACT_ELEMENT_TYPE = renameElementSymbol ? Symbol.for('react.transitional.element') : ReactSymbols_REACT_LEGACY_ELEMENT_TYPE;
const ReactSymbols_REACT_PORTAL_TYPE = Symbol.for('react.portal');
const ReactSymbols_REACT_FRAGMENT_TYPE = Symbol.for('react.fragment');
const ReactSymbols_REACT_STRICT_MODE_TYPE = Symbol.for('react.strict_mode');
const ReactSymbols_REACT_PROFILER_TYPE = Symbol.for('react.profiler');
const ReactSymbols_REACT_PROVIDER_TYPE = Symbol.for('react.provider'); // TODO: Delete with enableRenderableContext

const ReactSymbols_REACT_CONSUMER_TYPE = Symbol.for('react.consumer');
const ReactSymbols_REACT_CONTEXT_TYPE = Symbol.for('react.context');
const ReactSymbols_REACT_FORWARD_REF_TYPE = Symbol.for('react.forward_ref');
const ReactSymbols_REACT_SUSPENSE_TYPE = Symbol.for('react.suspense');
const ReactSymbols_REACT_SUSPENSE_LIST_TYPE = Symbol.for('react.suspense_list');
const ReactSymbols_REACT_MEMO_TYPE = Symbol.for('react.memo');
const ReactSymbols_REACT_LAZY_TYPE = Symbol.for('react.lazy');
const REACT_SCOPE_TYPE = Symbol.for('react.scope');
const REACT_OFFSCREEN_TYPE = Symbol.for('react.offscreen');
const REACT_LEGACY_HIDDEN_TYPE = Symbol.for('react.legacy_hidden');
const ReactSymbols_REACT_TRACING_MARKER_TYPE = Symbol.for('react.tracing_marker');
const REACT_MEMO_CACHE_SENTINEL = Symbol.for('react.memo_cache_sentinel');
const REACT_POSTPONE_TYPE = Symbol.for('react.postpone');
const ReactSymbols_REACT_VIEW_TRANSITION_TYPE = Symbol.for('react.view_transition');
const MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
const FAUX_ITERATOR_SYMBOL = '@@iterator';
function getIteratorFn(maybeIterable) {
  if (maybeIterable === null || typeof maybeIterable !== 'object') {
    return null;
  }

  const maybeIterator = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL];

  if (typeof maybeIterator === 'function') {
    return maybeIterator;
  }

  return null;
}
const ASYNC_ITERATOR = Symbol.asyncIterator;
;// CONCATENATED MODULE: ../react-devtools-shared/src/isArray.js
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
const isArray_isArray = Array.isArray;
/* harmony default export */ const src_isArray = (isArray_isArray);
;// CONCATENATED MODULE: ../react-devtools-shared/src/utils.js
/* provided dependency */ var process = __webpack_require__(169);
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */









 // $FlowFixMe[method-unbinding]

const utils_hasOwnProperty = Object.prototype.hasOwnProperty;
const cachedDisplayNames = new WeakMap(); // On large trees, encoding takes significant time.
// Try to reuse the already encoded strings.

const encodedStringCache = new (lru_cache_default())({
  max: 1000
});
function alphaSortKeys(a, b) {
  if (a.toString() > b.toString()) {
    return 1;
  } else if (b.toString() > a.toString()) {
    return -1;
  } else {
    return 0;
  }
}
function utils_getAllEnumerableKeys(obj) {
  const keys = new Set();
  let current = obj;

  while (current != null) {
    const currentKeys = [...Object.keys(current), ...Object.getOwnPropertySymbols(current)];
    const descriptors = Object.getOwnPropertyDescriptors(current);
    currentKeys.forEach(key => {
      // $FlowFixMe[incompatible-type]: key can be a Symbol https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor
      if (descriptors[key].enumerable) {
        keys.add(key);
      }
    });
    current = Object.getPrototypeOf(current);
  }

  return keys;
} // Mirror https://github.com/facebook/react/blob/7c21bf72ace77094fd1910cc350a548287ef8350/packages/shared/getComponentName.js#L27-L37

function getWrappedDisplayName(outerType, innerType, wrapperName, fallbackName) {
  const displayName = outerType?.displayName;
  return displayName || `${wrapperName}(${getDisplayName(innerType, fallbackName)})`;
}
function getDisplayName(type, fallbackName = 'Anonymous') {
  const nameFromCache = cachedDisplayNames.get(type);

  if (nameFromCache != null) {
    return nameFromCache;
  }

  let displayName = fallbackName; // The displayName property is not guaranteed to be a string.
  // It's only safe to use for our purposes if it's a string.
  // github.com/facebook/react-devtools/issues/803

  if (typeof type.displayName === 'string') {
    displayName = type.displayName;
  } else if (typeof type.name === 'string' && type.name !== '') {
    displayName = type.name;
  }

  cachedDisplayNames.set(type, displayName);
  return displayName;
}
let uidCounter = 0;
function getUID() {
  return ++uidCounter;
}
function utfDecodeStringWithRanges(array, left, right) {
  let string = '';

  for (let i = left; i <= right; i++) {
    string += String.fromCodePoint(array[i]);
  }

  return string;
}

function surrogatePairToCodePoint(charCode1, charCode2) {
  return ((charCode1 & 0x3ff) << 10) + (charCode2 & 0x3ff) + 0x10000;
} // Credit for this encoding approach goes to Tim Down:
// https://stackoverflow.com/questions/4877326/how-can-i-tell-if-a-string-contains-multibyte-characters-in-javascript


function utfEncodeString(string) {
  const cached = encodedStringCache.get(string);

  if (cached !== undefined) {
    return cached;
  }

  const encoded = [];
  let i = 0;
  let charCode;

  while (i < string.length) {
    charCode = string.charCodeAt(i); // Handle multibyte unicode characters (like emoji).

    if ((charCode & 0xf800) === 0xd800) {
      encoded.push(surrogatePairToCodePoint(charCode, string.charCodeAt(++i)));
    } else {
      encoded.push(charCode);
    }

    ++i;
  }

  encodedStringCache.set(string, encoded);
  return encoded;
}
function printOperationsArray(operations) {
  // The first two values are always rendererID and rootID
  const rendererID = operations[0];
  const rootID = operations[1];
  const logs = [`operations for renderer:${rendererID} and root:${rootID}`];
  let i = 2; // Reassemble the string table.

  const stringTable = [null // ID = 0 corresponds to the null string.
  ];
  const stringTableSize = operations[i++];
  const stringTableEnd = i + stringTableSize;

  while (i < stringTableEnd) {
    const nextLength = operations[i++];
    const nextString = utfDecodeStringWithRanges(operations, i, i + nextLength - 1);
    stringTable.push(nextString);
    i += nextLength;
  }

  while (i < operations.length) {
    const operation = operations[i];

    switch (operation) {
      case TREE_OPERATION_ADD:
        {
          const id = operations[i + 1];
          const type = operations[i + 2];
          i += 3;

          if (type === ElementTypeRoot) {
            logs.push(`Add new root node ${id}`);
            i++; // isStrictModeCompliant

            i++; // supportsProfiling

            i++; // supportsStrictMode

            i++; // hasOwnerMetadata
          } else {
            const parentID = operations[i];
            i++;
            i++; // ownerID

            const displayNameStringID = operations[i];
            const displayName = stringTable[displayNameStringID];
            i++;
            i++; // key

            logs.push(`Add node ${id} (${displayName || 'null'}) as child of ${parentID}`);
          }

          break;
        }

      case TREE_OPERATION_REMOVE:
        {
          const removeLength = operations[i + 1];
          i += 2;

          for (let removeIndex = 0; removeIndex < removeLength; removeIndex++) {
            const id = operations[i];
            i += 1;
            logs.push(`Remove node ${id}`);
          }

          break;
        }

      case TREE_OPERATION_REMOVE_ROOT:
        {
          i += 1;
          logs.push(`Remove root ${rootID}`);
          break;
        }

      case TREE_OPERATION_SET_SUBTREE_MODE:
        {
          const id = operations[i + 1];
          const mode = operations[i + 1];
          i += 3;
          logs.push(`Mode ${mode} set for subtree with root ${id}`);
          break;
        }

      case TREE_OPERATION_REORDER_CHILDREN:
        {
          const id = operations[i + 1];
          const numChildren = operations[i + 2];
          i += 3;
          const children = operations.slice(i, i + numChildren);
          i += numChildren;
          logs.push(`Re-order node ${id} children ${children.join(',')}`);
          break;
        }

      case TREE_OPERATION_UPDATE_TREE_BASE_DURATION:
        // Base duration updates are only sent while profiling is in progress.
        // We can ignore them at this point.
        // The profiler UI uses them lazily in order to generate the tree.
        i += 3;
        break;

      case TREE_OPERATION_UPDATE_ERRORS_OR_WARNINGS:
        const id = operations[i + 1];
        const numErrors = operations[i + 2];
        const numWarnings = operations[i + 3];
        i += 4;
        logs.push(`Node ${id} has ${numErrors} errors and ${numWarnings} warnings`);
        break;

      default:
        throw Error(`Unsupported Bridge operation "${operation}"`);
    }
  }

  console.log(logs.join('\n  '));
}
function getDefaultComponentFilters() {
  return [{
    type: ComponentFilterElementType,
    value: ElementTypeHostComponent,
    isEnabled: true
  }];
}
function getSavedComponentFilters() {
  try {
    const raw = localStorageGetItem(LOCAL_STORAGE_COMPONENT_FILTER_PREFERENCES_KEY);

    if (raw != null) {
      const parsedFilters = JSON.parse(raw);
      return filterOutLocationComponentFilters(parsedFilters);
    }
  } catch (error) {}

  return getDefaultComponentFilters();
}
function setSavedComponentFilters(componentFilters) {
  localStorageSetItem(LOCAL_STORAGE_COMPONENT_FILTER_PREFERENCES_KEY, JSON.stringify(filterOutLocationComponentFilters(componentFilters)));
} // Following __debugSource removal from Fiber, the new approach for finding the source location
// of a component, represented by the Fiber, is based on lazily generating and parsing component stack frames
// To find the original location, React DevTools will perform symbolication, source maps are required for that.
// In order to start filtering Fibers, we need to find location for all of them, which can't be done lazily.
// Eager symbolication can become quite expensive for large applications.

function filterOutLocationComponentFilters(componentFilters) {
  // This is just an additional check to preserve the previous state
  // Filters can be stored on the backend side or in user land (in a window object)
  if (!Array.isArray(componentFilters)) {
    return componentFilters;
  }

  return componentFilters.filter(f => f.type !== ComponentFilterLocation);
}
function getDefaultOpenInEditorURL() {
  return typeof process.env.EDITOR_URL === 'string' ? process.env.EDITOR_URL : '';
}
function getOpenInEditorURL() {
  try {
    const raw = localStorageGetItem(LOCAL_STORAGE_OPEN_IN_EDITOR_URL);

    if (raw != null) {
      return JSON.parse(raw);
    }
  } catch (error) {}

  return getDefaultOpenInEditorURL();
}
function parseElementDisplayNameFromBackend(displayName, type) {
  if (displayName === null) {
    return {
      formattedDisplayName: null,
      hocDisplayNames: null,
      compiledWithForget: false
    };
  }

  if (displayName.startsWith('Forget(')) {
    const displayNameWithoutForgetWrapper = displayName.slice(7, displayName.length - 1);
    const {
      formattedDisplayName,
      hocDisplayNames
    } = parseElementDisplayNameFromBackend(displayNameWithoutForgetWrapper, type);
    return {
      formattedDisplayName,
      hocDisplayNames,
      compiledWithForget: true
    };
  }

  let hocDisplayNames = null;

  switch (type) {
    case ElementTypeClass:
    case ElementTypeForwardRef:
    case ElementTypeFunction:
    case ElementTypeMemo:
    case ElementTypeVirtual:
      if (displayName.indexOf('(') >= 0) {
        const matches = displayName.match(/[^()]+/g);

        if (matches != null) {
          // $FlowFixMe[incompatible-type]
          displayName = matches.pop();
          hocDisplayNames = matches;
        }
      }

      break;

    default:
      break;
  }

  return {
    // $FlowFixMe[incompatible-return]
    formattedDisplayName: displayName,
    hocDisplayNames,
    compiledWithForget: false
  };
} // Pulled from react-compat
// https://github.com/developit/preact-compat/blob/7c5de00e7c85e2ffd011bf3af02899b63f699d3a/src/index.js#L349

function shallowDiffers(prev, next) {
  for (const attribute in prev) {
    if (!(attribute in next)) {
      return true;
    }
  }

  for (const attribute in next) {
    if (prev[attribute] !== next[attribute]) {
      return true;
    }
  }

  return false;
}
function utils_getInObject(object, path) {
  return path.reduce((reduced, attr) => {
    if (reduced) {
      if (utils_hasOwnProperty.call(reduced, attr)) {
        return reduced[attr];
      }

      if (typeof reduced[Symbol.iterator] === 'function') {
        // Convert iterable to array and return array[index]
        //
        // TRICKY
        // Don't use [...spread] syntax for this purpose.
        // This project uses @babel/plugin-transform-spread in "loose" mode which only works with Array values.
        // Other types (e.g. typed arrays, Sets) will not spread correctly.
        return Array.from(reduced)[attr];
      }
    }

    return null;
  }, object);
}
function deletePathInObject(object, path) {
  const length = path.length;
  const last = path[length - 1];

  if (object != null) {
    const parent = utils_getInObject(object, path.slice(0, length - 1));

    if (parent) {
      if (isArray(parent)) {
        parent.splice(last, 1);
      } else {
        delete parent[last];
      }
    }
  }
}
function renamePathInObject(object, oldPath, newPath) {
  const length = oldPath.length;

  if (object != null) {
    const parent = utils_getInObject(object, oldPath.slice(0, length - 1));

    if (parent) {
      const lastOld = oldPath[length - 1];
      const lastNew = newPath[length - 1];
      parent[lastNew] = parent[lastOld];

      if (isArray(parent)) {
        parent.splice(lastOld, 1);
      } else {
        delete parent[lastOld];
      }
    }
  }
}
function utils_setInObject(object, path, value) {
  const length = path.length;
  const last = path[length - 1];

  if (object != null) {
    const parent = utils_getInObject(object, path.slice(0, length - 1));

    if (parent) {
      parent[last] = value;
    }
  }
}

/**
 * Get a enhanced/artificial type string based on the object instance
 */
function utils_getDataType(data) {
  if (data === null) {
    return 'null';
  } else if (data === undefined) {
    return 'undefined';
  }

  if (typeof HTMLElement !== 'undefined' && data instanceof HTMLElement) {
    return 'html_element';
  }

  const type = typeof data;

  switch (type) {
    case 'bigint':
      return 'bigint';

    case 'boolean':
      return 'boolean';

    case 'function':
      return 'function';

    case 'number':
      if (Number.isNaN(data)) {
        return 'nan';
      } else if (!Number.isFinite(data)) {
        return 'infinity';
      } else {
        return 'number';
      }

    case 'object':
      if (data.$$typeof === REACT_ELEMENT_TYPE || data.$$typeof === REACT_LEGACY_ELEMENT_TYPE) {
        return 'react_element';
      }

      if (isArray(data)) {
        return 'array';
      } else if (ArrayBuffer.isView(data)) {
        return utils_hasOwnProperty.call(data.constructor, 'BYTES_PER_ELEMENT') ? 'typed_array' : 'data_view';
      } else if (data.constructor && data.constructor.name === 'ArrayBuffer') {
        // HACK This ArrayBuffer check is gross; is there a better way?
        // We could try to create a new DataView with the value.
        // If it doesn't error, we know it's an ArrayBuffer,
        // but this seems kind of awkward and expensive.
        return 'array_buffer';
      } else if (typeof data[Symbol.iterator] === 'function') {
        const iterator = data[Symbol.iterator]();

        if (!iterator) {// Proxies might break assumptoins about iterators.
          // See github.com/facebook/react/issues/21654
        } else {
          return iterator === data ? 'opaque_iterator' : 'iterator';
        }
      } else if (data.constructor && data.constructor.name === 'RegExp') {
        return 'regexp';
      } else {
        // $FlowFixMe[method-unbinding]
        const toStringValue = Object.prototype.toString.call(data);

        if (toStringValue === '[object Date]') {
          return 'date';
        } else if (toStringValue === '[object HTMLAllCollection]') {
          return 'html_all_collection';
        }
      }

      if (!isPlainObject(data)) {
        return 'class_instance';
      }

      return 'object';

    case 'string':
      return 'string';

    case 'symbol':
      return 'symbol';

    case 'undefined':
      if ( // $FlowFixMe[method-unbinding]
      Object.prototype.toString.call(data) === '[object HTMLAllCollection]') {
        return 'html_all_collection';
      }

      return 'undefined';

    default:
      return 'unknown';
  }
} // Fork of packages/react-is/src/ReactIs.js:30, but with legacy element type
// Which has been changed in https://github.com/facebook/react/pull/28813

function typeOfWithLegacyElementSymbol(object) {
  if (typeof object === 'object' && object !== null) {
    const $$typeof = object.$$typeof;

    switch ($$typeof) {
      case REACT_ELEMENT_TYPE:
      case REACT_LEGACY_ELEMENT_TYPE:
        const type = object.type;

        switch (type) {
          case REACT_FRAGMENT_TYPE:
          case REACT_PROFILER_TYPE:
          case REACT_STRICT_MODE_TYPE:
          case REACT_SUSPENSE_TYPE:
          case REACT_SUSPENSE_LIST_TYPE:
          case REACT_VIEW_TRANSITION_TYPE:
            return type;

          default:
            const $$typeofType = type && type.$$typeof;

            switch ($$typeofType) {
              case REACT_CONTEXT_TYPE:
              case REACT_FORWARD_REF_TYPE:
              case REACT_LAZY_TYPE:
              case REACT_MEMO_TYPE:
                return $$typeofType;

              case REACT_CONSUMER_TYPE:
                if (enableRenderableContext) {
                  return $$typeofType;
                }

              // Fall through

              case REACT_PROVIDER_TYPE:
                if (!enableRenderableContext) {
                  return $$typeofType;
                }

              // Fall through

              default:
                return $$typeof;
            }

        }

      case REACT_PORTAL_TYPE:
        return $$typeof;
    }
  }

  return undefined;
}

function utils_getDisplayNameForReactElement(element) {
  const elementType = typeOfWithLegacyElementSymbol(element);

  switch (elementType) {
    case REACT_CONSUMER_TYPE:
      return 'ContextConsumer';

    case REACT_PROVIDER_TYPE:
      return 'ContextProvider';

    case REACT_CONTEXT_TYPE:
      return 'Context';

    case REACT_FORWARD_REF_TYPE:
      return 'ForwardRef';

    case REACT_FRAGMENT_TYPE:
      return 'Fragment';

    case REACT_LAZY_TYPE:
      return 'Lazy';

    case REACT_MEMO_TYPE:
      return 'Memo';

    case REACT_PORTAL_TYPE:
      return 'Portal';

    case REACT_PROFILER_TYPE:
      return 'Profiler';

    case REACT_STRICT_MODE_TYPE:
      return 'StrictMode';

    case REACT_SUSPENSE_TYPE:
      return 'Suspense';

    case REACT_SUSPENSE_LIST_TYPE:
      return 'SuspenseList';

    case REACT_VIEW_TRANSITION_TYPE:
      return 'ViewTransition';

    case REACT_TRACING_MARKER_TYPE:
      return 'TracingMarker';

    default:
      const {
        type
      } = element;

      if (typeof type === 'string') {
        return type;
      } else if (typeof type === 'function') {
        return getDisplayName(type, 'Anonymous');
      } else if (type != null) {
        return 'NotImplementedInDevtools';
      } else {
        return 'Element';
      }

  }
}
const MAX_PREVIEW_STRING_LENGTH = 50;

function truncateForDisplay(string, length = MAX_PREVIEW_STRING_LENGTH) {
  if (string.length > length) {
    return string.slice(0, length) + '…';
  } else {
    return string;
  }
} // Attempts to mimic Chrome's inline preview for values.
// For example, the following value...
//   {
//      foo: 123,
//      bar: "abc",
//      baz: [true, false],
//      qux: { ab: 1, cd: 2 }
//   };
//
// Would show a preview of...
//   {foo: 123, bar: "abc", baz: Array(2), qux: {…}}
//
// And the following value...
//   [
//     123,
//     "abc",
//     [true, false],
//     { foo: 123, bar: "abc" }
//   ];
//
// Would show a preview of...
//   [123, "abc", Array(2), {…}]


function utils_formatDataForPreview(data, showFormattedValue) {
  if (data != null && utils_hasOwnProperty.call(data, meta.type)) {
    return showFormattedValue ? data[meta.preview_long] : data[meta.preview_short];
  }

  const type = utils_getDataType(data);

  switch (type) {
    case 'html_element':
      return `<${truncateForDisplay(data.tagName.toLowerCase())} />`;

    case 'function':
      if (typeof data.name === 'function' || data.name === '') {
        return '() => {}';
      }

      return `${truncateForDisplay(data.name)}() {}`;

    case 'string':
      return `"${data}"`;

    case 'bigint':
      return truncateForDisplay(data.toString() + 'n');

    case 'regexp':
      return truncateForDisplay(data.toString());

    case 'symbol':
      return truncateForDisplay(data.toString());

    case 'react_element':
      return `<${truncateForDisplay(utils_getDisplayNameForReactElement(data) || 'Unknown')} />`;

    case 'array_buffer':
      return `ArrayBuffer(${data.byteLength})`;

    case 'data_view':
      return `DataView(${data.buffer.byteLength})`;

    case 'array':
      if (showFormattedValue) {
        let formatted = '';

        for (let i = 0; i < data.length; i++) {
          if (i > 0) {
            formatted += ', ';
          }

          formatted += utils_formatDataForPreview(data[i], false);

          if (formatted.length > MAX_PREVIEW_STRING_LENGTH) {
            // Prevent doing a lot of unnecessary iteration...
            break;
          }
        }

        return `[${truncateForDisplay(formatted)}]`;
      } else {
        const length = utils_hasOwnProperty.call(data, meta.size) ? data[meta.size] : data.length;
        return `Array(${length})`;
      }

    case 'typed_array':
      const shortName = `${data.constructor.name}(${data.length})`;

      if (showFormattedValue) {
        let formatted = '';

        for (let i = 0; i < data.length; i++) {
          if (i > 0) {
            formatted += ', ';
          }

          formatted += data[i];

          if (formatted.length > MAX_PREVIEW_STRING_LENGTH) {
            // Prevent doing a lot of unnecessary iteration...
            break;
          }
        }

        return `${shortName} [${truncateForDisplay(formatted)}]`;
      } else {
        return shortName;
      }

    case 'iterator':
      const name = data.constructor.name;

      if (showFormattedValue) {
        // TRICKY
        // Don't use [...spread] syntax for this purpose.
        // This project uses @babel/plugin-transform-spread in "loose" mode which only works with Array values.
        // Other types (e.g. typed arrays, Sets) will not spread correctly.
        const array = Array.from(data);
        let formatted = '';

        for (let i = 0; i < array.length; i++) {
          const entryOrEntries = array[i];

          if (i > 0) {
            formatted += ', ';
          } // TRICKY
          // Browsers display Maps and Sets differently.
          // To mimic their behavior, detect if we've been given an entries tuple.
          //   Map(2) {"abc" => 123, "def" => 123}
          //   Set(2) {"abc", 123}


          if (isArray(entryOrEntries)) {
            const key = utils_formatDataForPreview(entryOrEntries[0], true);
            const value = utils_formatDataForPreview(entryOrEntries[1], false);
            formatted += `${key} => ${value}`;
          } else {
            formatted += utils_formatDataForPreview(entryOrEntries, false);
          }

          if (formatted.length > MAX_PREVIEW_STRING_LENGTH) {
            // Prevent doing a lot of unnecessary iteration...
            break;
          }
        }

        return `${name}(${data.size}) {${truncateForDisplay(formatted)}}`;
      } else {
        return `${name}(${data.size})`;
      }

    case 'opaque_iterator':
      {
        return data[Symbol.toStringTag];
      }

    case 'date':
      return data.toString();

    case 'class_instance':
      return data.constructor.name;

    case 'object':
      if (showFormattedValue) {
        const keys = Array.from(utils_getAllEnumerableKeys(data)).sort(alphaSortKeys);
        let formatted = '';

        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];

          if (i > 0) {
            formatted += ', ';
          }

          formatted += `${key.toString()}: ${utils_formatDataForPreview(data[key], false)}`;

          if (formatted.length > MAX_PREVIEW_STRING_LENGTH) {
            // Prevent doing a lot of unnecessary iteration...
            break;
          }
        }

        return `{${truncateForDisplay(formatted)}}`;
      } else {
        return '{…}';
      }

    case 'boolean':
    case 'number':
    case 'infinity':
    case 'nan':
    case 'null':
    case 'undefined':
      return data;

    default:
      try {
        return truncateForDisplay(String(data));
      } catch (error) {
        return 'unserializable';
      }

  }
} // Basically checking that the object only has Object in its prototype chain

const isPlainObject = object => {
  const objectPrototype = Object.getPrototypeOf(object);
  if (!objectPrototype) return true;
  const objectParentPrototype = Object.getPrototypeOf(objectPrototype);
  return !objectParentPrototype;
};
function backendToFrontendSerializedElementMapper(element) {
  const {
    formattedDisplayName,
    hocDisplayNames,
    compiledWithForget
  } = parseElementDisplayNameFromBackend(element.displayName, element.type);
  return { ...element,
    displayName: formattedDisplayName,
    hocDisplayNames,
    compiledWithForget
  };
} // Chrome normalizes urls like webpack-internals:// but new URL don't, so cannot use new URL here.

function normalizeUrl(url) {
  return url.replace('/./', '/');
}
function getIsReloadAndProfileSupported() {
  // Notify the frontend if the backend supports the Storage API (e.g. localStorage).
  // If not, features like reload-and-profile will not work correctly and must be disabled.
  let isBackendStorageAPISupported = false;

  try {
    localStorage.getItem('test');
    isBackendStorageAPISupported = true;
  } catch (error) {}

  return isBackendStorageAPISupported && isSynchronousXHRSupported();
} // Expected to be used only by browser extension and react-devtools-inline

function getIfReloadedAndProfiling() {
  return sessionStorageGetItem(SESSION_STORAGE_RELOAD_AND_PROFILE_KEY) === 'true';
}
function getProfilingSettings() {
  return {
    recordChangeDescriptions: sessionStorageGetItem(SESSION_STORAGE_RECORD_CHANGE_DESCRIPTIONS_KEY) === 'true',
    recordTimeline: sessionStorageGetItem(SESSION_STORAGE_RECORD_TIMELINE_KEY) === 'true'
  };
}
function onReloadAndProfile(recordChangeDescriptions, recordTimeline) {
  sessionStorageSetItem(SESSION_STORAGE_RELOAD_AND_PROFILE_KEY, 'true');
  sessionStorageSetItem(SESSION_STORAGE_RECORD_CHANGE_DESCRIPTIONS_KEY, recordChangeDescriptions ? 'true' : 'false');
  sessionStorageSetItem(SESSION_STORAGE_RECORD_TIMELINE_KEY, recordTimeline ? 'true' : 'false');
}
function onReloadAndProfileFlagsReset() {
  sessionStorageRemoveItem(SESSION_STORAGE_RELOAD_AND_PROFILE_KEY);
  sessionStorageRemoveItem(SESSION_STORAGE_RECORD_CHANGE_DESCRIPTIONS_KEY);
  sessionStorageRemoveItem(SESSION_STORAGE_RECORD_TIMELINE_KEY);
}
;// CONCATENATED MODULE: ../react-devtools-shared/src/hydration.js
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

const hydration_meta = {
  inspectable: Symbol('inspectable'),
  inspected: Symbol('inspected'),
  name: Symbol('name'),
  preview_long: Symbol('preview_long'),
  preview_short: Symbol('preview_short'),
  readonly: Symbol('readonly'),
  size: Symbol('size'),
  type: Symbol('type'),
  unserializable: Symbol('unserializable')
};
// This threshold determines the depth at which the bridge "dehydrates" nested data.
// Dehydration means that we don't serialize the data for e.g. postMessage or stringify,
// unless the frontend explicitly requests it (e.g. a user clicks to expand a props object).
//
// Reducing this threshold will improve the speed of initial component inspection,
// but may decrease the responsiveness of expanding objects/arrays to inspect further.
const LEVEL_THRESHOLD = 2;
/**
 * Generate the dehydrated metadata for complex object instances
 */

function createDehydrated(type, inspectable, data, cleaned, path) {
  cleaned.push(path);
  const dehydrated = {
    inspectable,
    type,
    preview_long: formatDataForPreview(data, true),
    preview_short: formatDataForPreview(data, false),
    name: typeof data.constructor !== 'function' || typeof data.constructor.name !== 'string' || data.constructor.name === 'Object' ? '' : data.constructor.name
  };

  if (type === 'array' || type === 'typed_array') {
    dehydrated.size = data.length;
  } else if (type === 'object') {
    dehydrated.size = Object.keys(data).length;
  }

  if (type === 'iterator' || type === 'typed_array') {
    dehydrated.readonly = true;
  }

  return dehydrated;
}
/**
 * Strip out complex data (instances, functions, and data nested > LEVEL_THRESHOLD levels deep).
 * The paths of the stripped out objects are appended to the `cleaned` list.
 * On the other side of the barrier, the cleaned list is used to "re-hydrate" the cleaned representation into
 * an object with symbols as attributes, so that a sanitized object can be distinguished from a normal object.
 *
 * Input: {"some": {"attr": fn()}, "other": AnInstance}
 * Output: {
 *   "some": {
 *     "attr": {"name": the fn.name, type: "function"}
 *   },
 *   "other": {
 *     "name": "AnInstance",
 *     "type": "object",
 *   },
 * }
 * and cleaned = [["some", "attr"], ["other"]]
 */


function hydration_dehydrate(data, cleaned, unserializable, path, isPathAllowed, level = 0) {
  const type = getDataType(data);
  let isPathAllowedCheck;

  switch (type) {
    case 'html_element':
      cleaned.push(path);
      return {
        inspectable: false,
        preview_short: formatDataForPreview(data, false),
        preview_long: formatDataForPreview(data, true),
        name: data.tagName,
        type
      };

    case 'function':
      cleaned.push(path);
      return {
        inspectable: false,
        preview_short: formatDataForPreview(data, false),
        preview_long: formatDataForPreview(data, true),
        name: typeof data.name === 'function' || !data.name ? 'function' : data.name,
        type
      };

    case 'string':
      isPathAllowedCheck = isPathAllowed(path);

      if (isPathAllowedCheck) {
        return data;
      } else {
        return data.length <= 500 ? data : data.slice(0, 500) + '...';
      }

    case 'bigint':
      cleaned.push(path);
      return {
        inspectable: false,
        preview_short: formatDataForPreview(data, false),
        preview_long: formatDataForPreview(data, true),
        name: data.toString(),
        type
      };

    case 'symbol':
      cleaned.push(path);
      return {
        inspectable: false,
        preview_short: formatDataForPreview(data, false),
        preview_long: formatDataForPreview(data, true),
        name: data.toString(),
        type
      };
    // React Elements aren't very inspector-friendly,
    // and often contain private fields or circular references.

    case 'react_element':
      cleaned.push(path);
      return {
        inspectable: false,
        preview_short: formatDataForPreview(data, false),
        preview_long: formatDataForPreview(data, true),
        name: getDisplayNameForReactElement(data) || 'Unknown',
        type
      };
    // ArrayBuffers error if you try to inspect them.

    case 'array_buffer':
    case 'data_view':
      cleaned.push(path);
      return {
        inspectable: false,
        preview_short: formatDataForPreview(data, false),
        preview_long: formatDataForPreview(data, true),
        name: type === 'data_view' ? 'DataView' : 'ArrayBuffer',
        size: data.byteLength,
        type
      };

    case 'array':
      isPathAllowedCheck = isPathAllowed(path);

      if (level >= LEVEL_THRESHOLD && !isPathAllowedCheck) {
        return createDehydrated(type, true, data, cleaned, path);
      }

      const arr = [];

      for (let i = 0; i < data.length; i++) {
        arr[i] = dehydrateKey(data, i, cleaned, unserializable, path.concat([i]), isPathAllowed, isPathAllowedCheck ? 1 : level + 1);
      }

      return arr;

    case 'html_all_collection':
    case 'typed_array':
    case 'iterator':
      isPathAllowedCheck = isPathAllowed(path);

      if (level >= LEVEL_THRESHOLD && !isPathAllowedCheck) {
        return createDehydrated(type, true, data, cleaned, path);
      } else {
        const unserializableValue = {
          unserializable: true,
          type: type,
          readonly: true,
          size: type === 'typed_array' ? data.length : undefined,
          preview_short: formatDataForPreview(data, false),
          preview_long: formatDataForPreview(data, true),
          name: typeof data.constructor !== 'function' || typeof data.constructor.name !== 'string' || data.constructor.name === 'Object' ? '' : data.constructor.name
        }; // TRICKY
        // Don't use [...spread] syntax for this purpose.
        // This project uses @babel/plugin-transform-spread in "loose" mode which only works with Array values.
        // Other types (e.g. typed arrays, Sets) will not spread correctly.

        Array.from(data).forEach((item, i) => unserializableValue[i] = hydration_dehydrate(item, cleaned, unserializable, path.concat([i]), isPathAllowed, isPathAllowedCheck ? 1 : level + 1));
        unserializable.push(path);
        return unserializableValue;
      }

    case 'opaque_iterator':
      cleaned.push(path);
      return {
        inspectable: false,
        preview_short: formatDataForPreview(data, false),
        preview_long: formatDataForPreview(data, true),
        name: data[Symbol.toStringTag],
        type
      };

    case 'date':
      cleaned.push(path);
      return {
        inspectable: false,
        preview_short: formatDataForPreview(data, false),
        preview_long: formatDataForPreview(data, true),
        name: data.toString(),
        type
      };

    case 'regexp':
      cleaned.push(path);
      return {
        inspectable: false,
        preview_short: formatDataForPreview(data, false),
        preview_long: formatDataForPreview(data, true),
        name: data.toString(),
        type
      };

    case 'object':
      isPathAllowedCheck = isPathAllowed(path);

      if (level >= LEVEL_THRESHOLD && !isPathAllowedCheck) {
        return createDehydrated(type, true, data, cleaned, path);
      } else {
        const object = {};
        getAllEnumerableKeys(data).forEach(key => {
          const name = key.toString();
          object[name] = dehydrateKey(data, key, cleaned, unserializable, path.concat([name]), isPathAllowed, isPathAllowedCheck ? 1 : level + 1);
        });
        return object;
      }

    case 'class_instance':
      isPathAllowedCheck = isPathAllowed(path);

      if (level >= LEVEL_THRESHOLD && !isPathAllowedCheck) {
        return createDehydrated(type, true, data, cleaned, path);
      }

      const value = {
        unserializable: true,
        type,
        readonly: true,
        preview_short: formatDataForPreview(data, false),
        preview_long: formatDataForPreview(data, true),
        name: typeof data.constructor !== 'function' || typeof data.constructor.name !== 'string' ? '' : data.constructor.name
      };
      getAllEnumerableKeys(data).forEach(key => {
        const keyAsString = key.toString();
        value[keyAsString] = hydration_dehydrate(data[key], cleaned, unserializable, path.concat([keyAsString]), isPathAllowed, isPathAllowedCheck ? 1 : level + 1);
      });
      unserializable.push(path);
      return value;

    case 'infinity':
    case 'nan':
    case 'undefined':
      // Some values are lossy when sent through a WebSocket.
      // We dehydrate+rehydrate them to preserve their type.
      cleaned.push(path);
      return {
        type
      };

    default:
      return data;
  }
}

function dehydrateKey(parent, key, cleaned, unserializable, path, isPathAllowed, level = 0) {
  try {
    return hydration_dehydrate(parent[key], cleaned, unserializable, path, isPathAllowed, level);
  } catch (error) {
    let preview = '';

    if (typeof error === 'object' && error !== null && typeof error.stack === 'string') {
      preview = error.stack;
    } else if (typeof error === 'string') {
      preview = error;
    }

    cleaned.push(path);
    return {
      inspectable: false,
      preview_short: '[Exception]',
      preview_long: preview ? '[Exception: ' + preview + ']' : '[Exception]',
      name: preview,
      type: 'unknown'
    };
  }
}

function fillInPath(object, data, path, value) {
  const target = getInObject(object, path);

  if (target != null) {
    if (!target[hydration_meta.unserializable]) {
      delete target[hydration_meta.inspectable];
      delete target[hydration_meta.inspected];
      delete target[hydration_meta.name];
      delete target[hydration_meta.preview_long];
      delete target[hydration_meta.preview_short];
      delete target[hydration_meta.readonly];
      delete target[hydration_meta.size];
      delete target[hydration_meta.type];
    }
  }

  if (value !== null && data.unserializable.length > 0) {
    const unserializablePath = data.unserializable[0];
    let isMatch = unserializablePath.length === path.length;

    for (let i = 0; i < path.length; i++) {
      if (path[i] !== unserializablePath[i]) {
        isMatch = false;
        break;
      }
    }

    if (isMatch) {
      upgradeUnserializable(value, value);
    }
  }

  setInObject(object, path, value);
}
function hydrate(object, cleaned, unserializable) {
  cleaned.forEach(path => {
    const length = path.length;
    const last = path[length - 1];
    const parent = getInObject(object, path.slice(0, length - 1));

    if (!parent || !parent.hasOwnProperty(last)) {
      return;
    }

    const value = parent[last];

    if (!value) {
      return;
    } else if (value.type === 'infinity') {
      parent[last] = Infinity;
    } else if (value.type === 'nan') {
      parent[last] = NaN;
    } else if (value.type === 'undefined') {
      parent[last] = undefined;
    } else {
      // Replace the string keys with Symbols so they're non-enumerable.
      const replaced = {};
      replaced[hydration_meta.inspectable] = !!value.inspectable;
      replaced[hydration_meta.inspected] = false;
      replaced[hydration_meta.name] = value.name;
      replaced[hydration_meta.preview_long] = value.preview_long;
      replaced[hydration_meta.preview_short] = value.preview_short;
      replaced[hydration_meta.size] = value.size;
      replaced[hydration_meta.readonly] = !!value.readonly;
      replaced[hydration_meta.type] = value.type;
      parent[last] = replaced;
    }
  });
  unserializable.forEach(path => {
    const length = path.length;
    const last = path[length - 1];
    const parent = getInObject(object, path.slice(0, length - 1));

    if (!parent || !parent.hasOwnProperty(last)) {
      return;
    }

    const node = parent[last];
    const replacement = { ...node
    };
    upgradeUnserializable(replacement, node);
    parent[last] = replacement;
  });
  return object;
}

function upgradeUnserializable(destination, source) {
  Object.defineProperties(destination, {
    // $FlowFixMe[invalid-computed-prop]
    [hydration_meta.inspected]: {
      configurable: true,
      enumerable: false,
      value: !!source.inspected
    },
    // $FlowFixMe[invalid-computed-prop]
    [hydration_meta.name]: {
      configurable: true,
      enumerable: false,
      value: source.name
    },
    // $FlowFixMe[invalid-computed-prop]
    [hydration_meta.preview_long]: {
      configurable: true,
      enumerable: false,
      value: source.preview_long
    },
    // $FlowFixMe[invalid-computed-prop]
    [hydration_meta.preview_short]: {
      configurable: true,
      enumerable: false,
      value: source.preview_short
    },
    // $FlowFixMe[invalid-computed-prop]
    [hydration_meta.size]: {
      configurable: true,
      enumerable: false,
      value: source.size
    },
    // $FlowFixMe[invalid-computed-prop]
    [hydration_meta.readonly]: {
      configurable: true,
      enumerable: false,
      value: !!source.readonly
    },
    // $FlowFixMe[invalid-computed-prop]
    [hydration_meta.type]: {
      configurable: true,
      enumerable: false,
      value: source.type
    },
    // $FlowFixMe[invalid-computed-prop]
    [hydration_meta.unserializable]: {
      configurable: true,
      enumerable: false,
      value: !!source.unserializable
    }
  });
  delete destination.inspected;
  delete destination.name;
  delete destination.preview_long;
  delete destination.preview_short;
  delete destination.size;
  delete destination.readonly;
  delete destination.type;
  delete destination.unserializable;
}
;// CONCATENATED MODULE: ../shared/isArray.js
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
const isArrayImpl = Array.isArray;

function shared_isArray_isArray(a) {
  return isArrayImpl(a);
}

/* harmony default export */ const shared_isArray = ((/* unused pure expression or super */ null && (shared_isArray_isArray)));
;// CONCATENATED MODULE: ../react-devtools-shared/src/backend/utils/index.js
/**
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */




 // TODO: update this to the first React version that has a corresponding DevTools backend

const FIRST_DEVTOOLS_BACKEND_LOCKSTEP_VER = '999.9.9';
function hasAssignedBackend(version) {
  if (version == null || version === '') {
    return false;
  }

  return gte(version, FIRST_DEVTOOLS_BACKEND_LOCKSTEP_VER);
}
function cleanForBridge(data, isPathAllowed, path = []) {
  if (data !== null) {
    const cleanedPaths = [];
    const unserializablePaths = [];
    const cleanedData = dehydrate(data, cleanedPaths, unserializablePaths, path, isPathAllowed);
    return {
      data: cleanedData,
      cleaned: cleanedPaths,
      unserializable: unserializablePaths
    };
  } else {
    return null;
  }
}
function copyWithDelete(obj, path, index = 0) {
  const key = path[index];
  const updated = isArray(obj) ? obj.slice() : { ...obj
  };

  if (index + 1 === path.length) {
    if (isArray(updated)) {
      updated.splice(key, 1);
    } else {
      delete updated[key];
    }
  } else {
    // $FlowFixMe[incompatible-use] number or string is fine here
    updated[key] = copyWithDelete(obj[key], path, index + 1);
  }

  return updated;
} // This function expects paths to be the same except for the final value.
// e.g. ['path', 'to', 'foo'] and ['path', 'to', 'bar']

function copyWithRename(obj, oldPath, newPath, index = 0) {
  const oldKey = oldPath[index];
  const updated = isArray(obj) ? obj.slice() : { ...obj
  };

  if (index + 1 === oldPath.length) {
    const newKey = newPath[index]; // $FlowFixMe[incompatible-use] number or string is fine here

    updated[newKey] = updated[oldKey];

    if (isArray(updated)) {
      updated.splice(oldKey, 1);
    } else {
      delete updated[oldKey];
    }
  } else {
    // $FlowFixMe[incompatible-use] number or string is fine here
    updated[oldKey] = copyWithRename(obj[oldKey], oldPath, newPath, index + 1);
  }

  return updated;
}
function copyWithSet(obj, path, value, index = 0) {
  if (index >= path.length) {
    return value;
  }

  const key = path[index];
  const updated = isArray(obj) ? obj.slice() : { ...obj
  }; // $FlowFixMe[incompatible-use] number or string is fine here

  updated[key] = copyWithSet(obj[key], path, value, index + 1);
  return updated;
}
function getEffectDurations(root) {
  // Profiling durations are only available for certain builds.
  // If available, they'll be stored on the HostRoot.
  let effectDuration = null;
  let passiveEffectDuration = null;
  const hostRoot = root.current;

  if (hostRoot != null) {
    const stateNode = hostRoot.stateNode;

    if (stateNode != null) {
      effectDuration = stateNode.effectDuration != null ? stateNode.effectDuration : null;
      passiveEffectDuration = stateNode.passiveEffectDuration != null ? stateNode.passiveEffectDuration : null;
    }
  }

  return {
    effectDuration,
    passiveEffectDuration
  };
}
function serializeToString(data) {
  if (data === undefined) {
    return 'undefined';
  }

  if (typeof data === 'function') {
    return data.toString();
  }

  const cache = new Set(); // Use a custom replacer function to protect against circular references.

  return JSON.stringify(data, (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (cache.has(value)) {
        return;
      }

      cache.add(value);
    }

    if (typeof value === 'bigint') {
      return value.toString() + 'n';
    }

    return value;
  }, 2);
}

function safeToString(val) {
  try {
    return String(val);
  } catch (err) {
    if (typeof val === 'object') {
      // An object with no prototype and no `[Symbol.toPrimitive]()`, `toString()`, and `valueOf()` methods would throw.
      // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String#string_coercion
      return '[object Object]';
    }

    throw err;
  }
} // based on https://github.com/tmpfs/format-util/blob/0e62d430efb0a1c51448709abd3e2406c14d8401/format.js#L1
// based on https://developer.mozilla.org/en-US/docs/Web/API/console#Using_string_substitutions
// Implements s, d, i and f placeholders


function formatConsoleArgumentsToSingleString(maybeMessage, ...inputArgs) {
  const args = inputArgs.slice();
  let formatted = safeToString(maybeMessage); // If the first argument is a string, check for substitutions.

  if (typeof maybeMessage === 'string') {
    if (args.length) {
      const REGEXP = /(%?)(%([jds]))/g; // $FlowFixMe[incompatible-call]

      formatted = formatted.replace(REGEXP, (match, escaped, ptn, flag) => {
        let arg = args.shift();

        switch (flag) {
          case 's':
            // $FlowFixMe[unsafe-addition]
            arg += '';
            break;

          case 'd':
          case 'i':
            arg = parseInt(arg, 10).toString();
            break;

          case 'f':
            arg = parseFloat(arg).toString();
            break;
        }

        if (!escaped) {
          return arg;
        }

        args.unshift(arg);
        return match;
      });
    }
  } // Arguments that remain after formatting.


  if (args.length) {
    for (let i = 0; i < args.length; i++) {
      formatted += ' ' + safeToString(args[i]);
    }
  } // Update escaped %% values.


  formatted = formatted.replace(/%{2,2}/g, '%');
  return String(formatted);
}
function utils_isSynchronousXHRSupported() {
  return !!(window.document && window.document.featurePolicy && window.document.featurePolicy.allowsFeature('sync-xhr'));
}
function gt(a = '', b = '') {
  return compareVersions(a, b) === 1;
}
function gte(a = '', b = '') {
  return compareVersions(a, b) > -1;
}
const isReactNativeEnvironment = () => {
  // We've been relying on this for such a long time
  // We should probably define the client for DevTools on the backend side and share it with the frontend
  return window.document == null;
};

function extractLocation(url) {
  if (url.indexOf(':') === -1) {
    return null;
  } // remove any parentheses from start and end


  const withoutParentheses = url.replace(/^\(+/, '').replace(/\)+$/, '');
  const locationParts = /(at )?(.+?)(?::(\d+))?(?::(\d+))?$/.exec(withoutParentheses);

  if (locationParts == null) {
    return null;
  }

  const [,, sourceURL, line, column] = locationParts;
  return {
    sourceURL,
    line,
    column
  };
}

const CHROME_STACK_REGEXP = /^\s*at .*(\S+:\d+|\(native\))/m;

function parseSourceFromChromeStack(stack) {
  const frames = stack.split('\n'); // eslint-disable-next-line no-for-of-loops/no-for-of-loops

  for (const frame of frames) {
    const sanitizedFrame = frame.trim();
    const locationInParenthesesMatch = sanitizedFrame.match(/ (\(.+\)$)/);
    const possibleLocation = locationInParenthesesMatch ? locationInParenthesesMatch[1] : sanitizedFrame;
    const location = extractLocation(possibleLocation); // Continue the search until at least sourceURL is found

    if (location == null) {
      continue;
    }

    const {
      sourceURL,
      line = '1',
      column = '1'
    } = location;
    return {
      sourceURL,
      line: parseInt(line, 10),
      column: parseInt(column, 10)
    };
  }

  return null;
}

function parseSourceFromFirefoxStack(stack) {
  const frames = stack.split('\n'); // eslint-disable-next-line no-for-of-loops/no-for-of-loops

  for (const frame of frames) {
    const sanitizedFrame = frame.trim();
    const frameWithoutFunctionName = sanitizedFrame.replace(/((.*".+"[^@]*)?[^@]*)(?:@)/, '');
    const location = extractLocation(frameWithoutFunctionName); // Continue the search until at least sourceURL is found

    if (location == null) {
      continue;
    }

    const {
      sourceURL,
      line = '1',
      column = '1'
    } = location;
    return {
      sourceURL,
      line: parseInt(line, 10),
      column: parseInt(column, 10)
    };
  }

  return null;
}

function parseSourceFromComponentStack(componentStack) {
  if (componentStack.match(CHROME_STACK_REGEXP)) {
    return parseSourceFromChromeStack(componentStack);
  }

  return parseSourceFromFirefoxStack(componentStack);
} // 0.123456789 => 0.123
// Expects high-resolution timestamp in milliseconds, like from performance.now()
// Mainly used for optimizing the size of serialized profiling payload

function formatDurationToMicrosecondsGranularity(duration) {
  return Math.round(duration * 1000) / 1000;
}
;// CONCATENATED MODULE: ../react-devtools-shared/src/backend/views/utils.js
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
// Get the window object for the document that a node belongs to,
// or return null if it cannot be found (node not attached to DOM,
// etc).
function getOwnerWindow(node) {
  if (!node.ownerDocument) {
    return null;
  }

  return node.ownerDocument.defaultView;
} // Get the iframe containing a node, or return null if it cannot
// be found (node not within iframe, etc).

function getOwnerIframe(node) {
  const nodeWindow = getOwnerWindow(node);

  if (nodeWindow) {
    return nodeWindow.frameElement;
  }

  return null;
} // Get a bounding client rect for a node, with an
// offset added to compensate for its border.

function getBoundingClientRectWithBorderOffset(node) {
  const dimensions = getElementDimensions(node);
  return mergeRectOffsets([node.getBoundingClientRect(), {
    top: dimensions.borderTop,
    left: dimensions.borderLeft,
    bottom: dimensions.borderBottom,
    right: dimensions.borderRight,
    // This width and height won't get used by mergeRectOffsets (since this
    // is not the first rect in the array), but we set them so that this
    // object type checks as a ClientRect.
    width: 0,
    height: 0
  }]);
} // Add together the top, left, bottom, and right properties of
// each ClientRect, but keep the width and height of the first one.

function mergeRectOffsets(rects) {
  return rects.reduce((previousRect, rect) => {
    if (previousRect == null) {
      return rect;
    }

    return {
      top: previousRect.top + rect.top,
      left: previousRect.left + rect.left,
      width: previousRect.width,
      height: previousRect.height,
      bottom: previousRect.bottom + rect.bottom,
      right: previousRect.right + rect.right
    };
  });
} // Calculate a boundingClientRect for a node relative to boundaryWindow,
// taking into account any offsets caused by intermediate iframes.

function getNestedBoundingClientRect(node, boundaryWindow) {
  const ownerIframe = getOwnerIframe(node);

  if (ownerIframe && ownerIframe !== boundaryWindow) {
    const rects = [node.getBoundingClientRect()];
    let currentIframe = ownerIframe;
    let onlyOneMore = false;

    while (currentIframe) {
      const rect = getBoundingClientRectWithBorderOffset(currentIframe);
      rects.push(rect);
      currentIframe = getOwnerIframe(currentIframe);

      if (onlyOneMore) {
        break;
      } // We don't want to calculate iframe offsets upwards beyond
      // the iframe containing the boundaryWindow, but we
      // need to calculate the offset relative to the boundaryWindow.


      if (currentIframe && getOwnerWindow(currentIframe) === boundaryWindow) {
        onlyOneMore = true;
      }
    }

    return mergeRectOffsets(rects);
  } else {
    return node.getBoundingClientRect();
  }
}
function getElementDimensions(domElement) {
  const calculatedStyle = window.getComputedStyle(domElement);
  return {
    borderLeft: parseInt(calculatedStyle.borderLeftWidth, 10),
    borderRight: parseInt(calculatedStyle.borderRightWidth, 10),
    borderTop: parseInt(calculatedStyle.borderTopWidth, 10),
    borderBottom: parseInt(calculatedStyle.borderBottomWidth, 10),
    marginLeft: parseInt(calculatedStyle.marginLeft, 10),
    marginRight: parseInt(calculatedStyle.marginRight, 10),
    marginTop: parseInt(calculatedStyle.marginTop, 10),
    marginBottom: parseInt(calculatedStyle.marginBottom, 10),
    paddingLeft: parseInt(calculatedStyle.paddingLeft, 10),
    paddingRight: parseInt(calculatedStyle.paddingRight, 10),
    paddingTop: parseInt(calculatedStyle.paddingTop, 10),
    paddingBottom: parseInt(calculatedStyle.paddingBottom, 10)
  };
}
function extractHOCNames(displayName) {
  if (!displayName) return {
    baseComponentName: '',
    hocNames: []
  };
  const hocRegex = /([A-Z][a-zA-Z0-9]*?)\((.*)\)/g;
  const hocNames = [];
  let baseComponentName = displayName;
  let match;

  while ((match = hocRegex.exec(baseComponentName)) != null) {
    if (Array.isArray(match)) {
      const [, hocName, inner] = match;
      hocNames.push(hocName);
      baseComponentName = inner;
    }
  }

  return {
    baseComponentName,
    hocNames
  };
}
;// CONCATENATED MODULE: ../react-devtools-shared/src/backend/views/Highlighter/Overlay.js
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

const Overlay_assign = Object.assign; // Note that the Overlay components are not affected by the active Theme,
// because they highlight elements in the main Chrome window (outside of devtools).
// The colors below were chosen to roughly match those used by Chrome devtools.

class OverlayRect {
  constructor(doc, container) {
    this.node = doc.createElement('div');
    this.border = doc.createElement('div');
    this.padding = doc.createElement('div');
    this.content = doc.createElement('div');
    this.border.style.borderColor = overlayStyles.border;
    this.padding.style.borderColor = overlayStyles.padding;
    this.content.style.backgroundColor = overlayStyles.background;
    Overlay_assign(this.node.style, {
      borderColor: overlayStyles.margin,
      pointerEvents: 'none',
      position: 'fixed'
    });
    this.node.style.zIndex = '10000000';
    this.node.appendChild(this.border);
    this.border.appendChild(this.padding);
    this.padding.appendChild(this.content);
    container.appendChild(this.node);
  }

  remove() {
    if (this.node.parentNode) {
      this.node.parentNode.removeChild(this.node);
    }
  }

  update(box, dims) {
    boxWrap(dims, 'margin', this.node);
    boxWrap(dims, 'border', this.border);
    boxWrap(dims, 'padding', this.padding);
    Overlay_assign(this.content.style, {
      height: box.height - dims.borderTop - dims.borderBottom - dims.paddingTop - dims.paddingBottom + 'px',
      width: box.width - dims.borderLeft - dims.borderRight - dims.paddingLeft - dims.paddingRight + 'px'
    });
    Overlay_assign(this.node.style, {
      top: box.top - dims.marginTop + 'px',
      left: box.left - dims.marginLeft + 'px'
    });
  }

}

class OverlayTip {
  constructor(doc, container) {
    this.tip = doc.createElement('div');
    Overlay_assign(this.tip.style, {
      display: 'flex',
      flexFlow: 'row nowrap',
      backgroundColor: '#333740',
      borderRadius: '2px',
      fontFamily: '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace',
      fontWeight: 'bold',
      padding: '3px 5px',
      pointerEvents: 'none',
      position: 'fixed',
      fontSize: '12px',
      whiteSpace: 'nowrap'
    });
    this.nameSpan = doc.createElement('span');
    this.tip.appendChild(this.nameSpan);
    Overlay_assign(this.nameSpan.style, {
      color: '#ee78e6',
      borderRight: '1px solid #aaaaaa',
      paddingRight: '0.5rem',
      marginRight: '0.5rem'
    });
    this.dimSpan = doc.createElement('span');
    this.tip.appendChild(this.dimSpan);
    Overlay_assign(this.dimSpan.style, {
      color: '#d7d7d7'
    });
    this.tip.style.zIndex = '10000000';
    container.appendChild(this.tip);
  }

  remove() {
    if (this.tip.parentNode) {
      this.tip.parentNode.removeChild(this.tip);
    }
  }

  updateText(name, width, height) {
    this.nameSpan.textContent = name;
    this.dimSpan.textContent = Math.round(width) + 'px × ' + Math.round(height) + 'px';
  }

  updatePosition(dims, bounds) {
    const tipRect = this.tip.getBoundingClientRect();
    const tipPos = findTipPos(dims, bounds, {
      width: tipRect.width,
      height: tipRect.height
    });
    Overlay_assign(this.tip.style, tipPos.style);
  }

}

class Overlay {
  constructor(agent) {
    // Find the root window, because overlays are positioned relative to it.
    const currentWindow = window.__REACT_DEVTOOLS_TARGET_WINDOW__ || window;
    this.window = currentWindow; // When opened in shells/dev, the tooltip should be bound by the app iframe, not by the topmost window.

    const tipBoundsWindow = window.__REACT_DEVTOOLS_TARGET_WINDOW__ || window;
    this.tipBoundsWindow = tipBoundsWindow;
    const doc = currentWindow.document;
    this.container = doc.createElement('div');
    this.container.style.zIndex = '10000000';
    this.tip = new OverlayTip(doc, this.container);
    this.rects = [];
    this.agent = agent;
    doc.body.appendChild(this.container);
  }

  remove() {
    this.tip.remove();
    this.rects.forEach(rect => {
      rect.remove();
    });
    this.rects.length = 0;

    if (this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
  }

  inspect(nodes, name) {
    // We can't get the size of text nodes or comment nodes. React as of v15
    // heavily uses comment nodes to delimit text.
    const elements = nodes.filter(node => node.nodeType === Node.ELEMENT_NODE);

    while (this.rects.length > elements.length) {
      const rect = this.rects.pop(); // $FlowFixMe[incompatible-use]

      rect.remove();
    }

    if (elements.length === 0) {
      return;
    }

    while (this.rects.length < elements.length) {
      this.rects.push(new OverlayRect(this.window.document, this.container));
    }

    const outerBox = {
      top: Number.POSITIVE_INFINITY,
      right: Number.NEGATIVE_INFINITY,
      bottom: Number.NEGATIVE_INFINITY,
      left: Number.POSITIVE_INFINITY
    };
    elements.forEach((element, index) => {
      const box = getNestedBoundingClientRect(element, this.window);
      const dims = getElementDimensions(element);
      outerBox.top = Math.min(outerBox.top, box.top - dims.marginTop);
      outerBox.right = Math.max(outerBox.right, box.left + box.width + dims.marginRight);
      outerBox.bottom = Math.max(outerBox.bottom, box.top + box.height + dims.marginBottom);
      outerBox.left = Math.min(outerBox.left, box.left - dims.marginLeft);
      const rect = this.rects[index];
      rect.update(box, dims);
    });

    if (!name) {
      name = elements[0].nodeName.toLowerCase();
      const node = elements[0];
      const ownerName = this.agent.getComponentNameForHostInstance(node);

      if (ownerName) {
        name += ' (in ' + ownerName + ')';
      }
    }

    this.tip.updateText(name, outerBox.right - outerBox.left, outerBox.bottom - outerBox.top);
    const tipBounds = getNestedBoundingClientRect(this.tipBoundsWindow.document.documentElement, this.window);
    this.tip.updatePosition({
      top: outerBox.top,
      left: outerBox.left,
      height: outerBox.bottom - outerBox.top,
      width: outerBox.right - outerBox.left
    }, {
      top: tipBounds.top + this.tipBoundsWindow.scrollY,
      left: tipBounds.left + this.tipBoundsWindow.scrollX,
      height: this.tipBoundsWindow.innerHeight,
      width: this.tipBoundsWindow.innerWidth
    });
  }

}

function findTipPos(dims, bounds, tipSize) {
  const tipHeight = Math.max(tipSize.height, 20);
  const tipWidth = Math.max(tipSize.width, 60);
  const margin = 5;
  let top;

  if (dims.top + dims.height + tipHeight <= bounds.top + bounds.height) {
    if (dims.top + dims.height < bounds.top + 0) {
      top = bounds.top + margin;
    } else {
      top = dims.top + dims.height + margin;
    }
  } else if (dims.top - tipHeight <= bounds.top + bounds.height) {
    if (dims.top - tipHeight - margin < bounds.top + margin) {
      top = bounds.top + margin;
    } else {
      top = dims.top - tipHeight - margin;
    }
  } else {
    top = bounds.top + bounds.height - tipHeight - margin;
  }

  let left = dims.left + margin;

  if (dims.left < bounds.left) {
    left = bounds.left + margin;
  }

  if (dims.left + tipWidth > bounds.left + bounds.width) {
    left = bounds.left + bounds.width - tipWidth - margin;
  }

  top += 'px';
  left += 'px';
  return {
    style: {
      top,
      left
    }
  };
}

function boxWrap(dims, what, node) {
  Overlay_assign(node.style, {
    borderTopWidth: dims[what + 'Top'] + 'px',
    borderLeftWidth: dims[what + 'Left'] + 'px',
    borderRightWidth: dims[what + 'Right'] + 'px',
    borderBottomWidth: dims[what + 'Bottom'] + 'px',
    borderStyle: 'solid'
  });
}

const overlayStyles = {
  background: 'rgba(120, 170, 210, 0.7)',
  padding: 'rgba(77, 200, 0, 0.3)',
  margin: 'rgba(255, 155, 0, 0.3)',
  border: 'rgba(255, 200, 50, 0.3)'
};
;// CONCATENATED MODULE: ../react-devtools-shared/src/backend/views/Highlighter/Highlighter.js
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */


const SHOW_DURATION = 2000;
let timeoutID = null;
let overlay = null;

function hideOverlayNative(agent) {
  agent.emit('hideNativeHighlight');
}

function hideOverlayWeb() {
  timeoutID = null;

  if (overlay !== null) {
    overlay.remove();
    overlay = null;
  }
}

function hideOverlay(agent) {
  return isReactNativeEnvironment() ? hideOverlayNative(agent) : hideOverlayWeb();
}

function showOverlayNative(elements, agent) {
  agent.emit('showNativeHighlight', elements);
}

function showOverlayWeb(elements, componentName, agent, hideAfterTimeout) {
  if (timeoutID !== null) {
    clearTimeout(timeoutID);
  }

  if (overlay === null) {
    overlay = new Overlay(agent);
  }

  overlay.inspect(elements, componentName);

  if (hideAfterTimeout) {
    timeoutID = setTimeout(() => hideOverlay(agent), SHOW_DURATION);
  }
}

function showOverlay(elements, componentName, agent, hideAfterTimeout) {
  return isReactNativeEnvironment() ? showOverlayNative(elements, agent) : showOverlayWeb(elements, componentName, agent, hideAfterTimeout);
}
;// CONCATENATED MODULE: ../react-devtools-shared/src/backend/views/Highlighter/index.js
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */


// This plug-in provides in-page highlighting of the selected element.
// It is used by the browser extension and the standalone DevTools shell (when connected to a browser).
// It is not currently the mechanism used to highlight React Native views.
// That is done by the React Native Inspector component.
let iframesListeningTo = new Set();
function setupHighlighter(bridge, agent) {
  bridge.addListener('clearHostInstanceHighlight', clearHostInstanceHighlight);
  bridge.addListener('highlightHostInstance', highlightHostInstance);
  bridge.addListener('shutdown', stopInspectingHost);
  bridge.addListener('startInspectingHost', startInspectingHost);
  bridge.addListener('stopInspectingHost', stopInspectingHost);

  function startInspectingHost() {
    registerListenersOnWindow(window);
  }

  function registerListenersOnWindow(window) {
    // This plug-in may run in non-DOM environments (e.g. React Native).
    if (window && typeof window.addEventListener === 'function') {
      window.addEventListener('click', onClick, true);
      window.addEventListener('mousedown', onMouseEvent, true);
      window.addEventListener('mouseover', onMouseEvent, true);
      window.addEventListener('mouseup', onMouseEvent, true);
      window.addEventListener('pointerdown', onPointerDown, true);
      window.addEventListener('pointermove', onPointerMove, true);
      window.addEventListener('pointerup', onPointerUp, true);
    } else {
      agent.emit('startInspectingNative');
    }
  }

  function stopInspectingHost() {
    hideOverlay(agent);
    removeListenersOnWindow(window);
    iframesListeningTo.forEach(function (frame) {
      try {
        removeListenersOnWindow(frame.contentWindow);
      } catch (error) {// This can error when the iframe is on a cross-origin.
      }
    });
    iframesListeningTo = new Set();
  }

  function removeListenersOnWindow(window) {
    // This plug-in may run in non-DOM environments (e.g. React Native).
    if (window && typeof window.removeEventListener === 'function') {
      window.removeEventListener('click', onClick, true);
      window.removeEventListener('mousedown', onMouseEvent, true);
      window.removeEventListener('mouseover', onMouseEvent, true);
      window.removeEventListener('mouseup', onMouseEvent, true);
      window.removeEventListener('pointerdown', onPointerDown, true);
      window.removeEventListener('pointermove', onPointerMove, true);
      window.removeEventListener('pointerup', onPointerUp, true);
    } else {
      agent.emit('stopInspectingNative');
    }
  }

  function clearHostInstanceHighlight() {
    hideOverlay(agent);
  }

  function highlightHostInstance({
    displayName,
    hideAfterTimeout,
    id,
    openBuiltinElementsPanel,
    rendererID,
    scrollIntoView
  }) {
    const renderer = agent.rendererInterfaces[rendererID];

    if (renderer == null) {
      console.warn(`Invalid renderer id "${rendererID}" for element "${id}"`);
      hideOverlay(agent);
      return;
    } // In some cases fiber may already be unmounted


    if (!renderer.hasElementWithId(id)) {
      hideOverlay(agent);
      return;
    }

    const nodes = renderer.findHostInstancesForElementID(id);

    if (nodes != null && nodes[0] != null) {
      const node = nodes[0]; // $FlowFixMe[method-unbinding]

      if (scrollIntoView && typeof node.scrollIntoView === 'function') {
        // If the node isn't visible show it before highlighting it.
        // We may want to reconsider this; it might be a little disruptive.
        node.scrollIntoView({
          block: 'nearest',
          inline: 'nearest'
        });
      }

      showOverlay(nodes, displayName, agent, hideAfterTimeout);

      if (openBuiltinElementsPanel) {
        window.__REACT_DEVTOOLS_GLOBAL_HOOK__.$0 = node;
        bridge.send('syncSelectionToBuiltinElementsPanel');
      }
    } else {
      hideOverlay(agent);
    }
  }

  function onClick(event) {
    event.preventDefault();
    event.stopPropagation();
    stopInspectingHost();
    bridge.send('stopInspectingHost', true);
  }

  function onMouseEvent(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  function onPointerDown(event) {
    event.preventDefault();
    event.stopPropagation();
    selectElementForNode(getEventTarget(event));
  }

  let lastHoveredNode = null;

  function onPointerMove(event) {
    event.preventDefault();
    event.stopPropagation();
    const target = getEventTarget(event);
    if (lastHoveredNode === target) return;
    lastHoveredNode = target;

    if (target.tagName === 'IFRAME') {
      const iframe = target;

      try {
        if (!iframesListeningTo.has(iframe)) {
          const window = iframe.contentWindow;
          registerListenersOnWindow(window);
          iframesListeningTo.add(iframe);
        }
      } catch (error) {// This can error when the iframe is on a cross-origin.
      }
    } // Don't pass the name explicitly.
    // It will be inferred from DOM tag and Fiber owner.


    showOverlay([target], null, agent, false);
    selectElementForNode(target);
  }

  function onPointerUp(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  const selectElementForNode = node => {
    const id = agent.getIDForHostInstance(node);

    if (id !== null) {
      bridge.send('selectElement', id);
    }
  };

  function getEventTarget(event) {
    if (event.composed) {
      return event.composedPath()[0];
    }

    return event.target;
  }
}
;// CONCATENATED MODULE: ../react-devtools-shared/src/backend/views/TraceUpdates/canvas.js
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
 // Note these colors are in sync with DevTools Profiler chart colors.

const COLORS = ['#37afa9', '#63b19e', '#80b393', '#97b488', '#abb67d', '#beb771', '#cfb965', '#dfba57', '#efbb49', '#febc38'];
let canvas = null;

function drawNative(nodeToData, agent) {
  const nodesToDraw = [];
  iterateNodes(nodeToData, ({
    color,
    node
  }) => {
    nodesToDraw.push({
      node,
      color
    });
  });
  agent.emit('drawTraceUpdates', nodesToDraw);
  const mergedNodes = groupAndSortNodes(nodeToData);
  agent.emit('drawGroupedTraceUpdatesWithNames', mergedNodes);
}

function drawWeb(nodeToData) {
  if (canvas === null) {
    initialize();
  }

  const dpr = window.devicePixelRatio || 1;
  const canvasFlow = canvas;
  canvasFlow.width = window.innerWidth * dpr;
  canvasFlow.height = window.innerHeight * dpr;
  canvasFlow.style.width = `${window.innerWidth}px`;
  canvasFlow.style.height = `${window.innerHeight}px`;
  const context = canvasFlow.getContext('2d');
  context.scale(dpr, dpr);
  context.clearRect(0, 0, canvasFlow.width / dpr, canvasFlow.height / dpr);
  const mergedNodes = groupAndSortNodes(nodeToData);
  mergedNodes.forEach(group => {
    drawGroupBorders(context, group);
    drawGroupLabel(context, group);
  });
}

function groupAndSortNodes(nodeToData) {
  const positionGroups = new Map();
  iterateNodes(nodeToData, ({
    rect,
    color,
    displayName,
    count
  }) => {
    if (!rect) return;
    const key = `${rect.left},${rect.top}`;
    if (!positionGroups.has(key)) positionGroups.set(key, []);
    positionGroups.get(key)?.push({
      rect,
      color,
      displayName,
      count
    });
  });
  return Array.from(positionGroups.values()).sort((groupA, groupB) => {
    const maxCountA = Math.max(...groupA.map(item => item.count));
    const maxCountB = Math.max(...groupB.map(item => item.count));
    return maxCountA - maxCountB;
  });
}

function drawGroupBorders(context, group) {
  group.forEach(({
    color,
    rect
  }) => {
    context.beginPath();
    context.strokeStyle = color;
    context.rect(rect.left, rect.top, rect.width - 1, rect.height - 1);
    context.stroke();
  });
}

function drawGroupLabel(context, group) {
  const mergedName = group.map(({
    displayName,
    count
  }) => displayName ? `${displayName}${count > 1 ? ` x${count}` : ''}` : '').filter(Boolean).join(', ');

  if (mergedName) {
    drawLabel(context, group[0].rect, mergedName, group[0].color);
  }
}

function draw(nodeToData, agent) {
  return isReactNativeEnvironment() ? drawNative(nodeToData, agent) : drawWeb(nodeToData);
}

function iterateNodes(nodeToData, execute) {
  nodeToData.forEach((data, node) => {
    const colorIndex = Math.min(COLORS.length - 1, data.count - 1);
    const color = COLORS[colorIndex];
    execute({
      color,
      node,
      count: data.count,
      displayName: data.displayName,
      expirationTime: data.expirationTime,
      lastMeasuredAt: data.lastMeasuredAt,
      rect: data.rect
    });
  });
}

function drawLabel(context, rect, text, color) {
  const {
    left,
    top
  } = rect;
  context.font = '10px monospace';
  context.textBaseline = 'middle';
  context.textAlign = 'center';
  const padding = 2;
  const textHeight = 14;
  const metrics = context.measureText(text);
  const backgroundWidth = metrics.width + padding * 2;
  const backgroundHeight = textHeight;
  const labelX = left;
  const labelY = top - backgroundHeight;
  context.fillStyle = color;
  context.fillRect(labelX, labelY, backgroundWidth, backgroundHeight);
  context.fillStyle = '#000000';
  context.fillText(text, labelX + backgroundWidth / 2, labelY + backgroundHeight / 2);
}

function destroyNative(agent) {
  agent.emit('disableTraceUpdates');
}

function destroyWeb() {
  if (canvas !== null) {
    if (canvas.parentNode != null) {
      canvas.parentNode.removeChild(canvas);
    }

    canvas = null;
  }
}

function destroy(agent) {
  return isReactNativeEnvironment() ? destroyNative(agent) : destroyWeb();
}

function initialize() {
  canvas = window.document.createElement('canvas');
  canvas.style.cssText = `
    xx-background-color: red;
    xx-opacity: 0.5;
    bottom: 0;
    left: 0;
    pointer-events: none;
    position: fixed;
    right: 0;
    top: 0;
    z-index: 1000000000;
  `;
  const root = window.document.documentElement;
  root.insertBefore(canvas, root.firstChild);
}
;// CONCATENATED MODULE: ../react-devtools-shared/src/backend/views/TraceUpdates/index.js
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */



// How long the rect should be shown for?
const DISPLAY_DURATION = 250; // What's the longest we are willing to show the overlay for?
// This can be important if we're getting a flurry of events (e.g. scroll update).

const MAX_DISPLAY_DURATION = 3000; // How long should a rect be considered valid for?

const REMEASUREMENT_AFTER_DURATION = 250; // Markers for different types of HOCs

const HOC_MARKERS = new Map([['Forget', '✨'], ['Memo', '🧠']]); // Some environments (e.g. React Native / Hermes) don't support the performance API yet.

const getCurrentTime = // $FlowFixMe[method-unbinding]
typeof performance === 'object' && typeof performance.now === 'function' ? () => performance.now() : () => Date.now();
const nodeToData = new Map();
let agent = null;
let drawAnimationFrameID = null;
let isEnabled = false;
let redrawTimeoutID = null;
function TraceUpdates_initialize(injectedAgent) {
  agent = injectedAgent;
  agent.addListener('traceUpdates', traceUpdates);
}
function toggleEnabled(value) {
  isEnabled = value;

  if (!isEnabled) {
    nodeToData.clear();

    if (drawAnimationFrameID !== null) {
      cancelAnimationFrame(drawAnimationFrameID);
      drawAnimationFrameID = null;
    }

    if (redrawTimeoutID !== null) {
      clearTimeout(redrawTimeoutID);
      redrawTimeoutID = null;
    }

    destroy(agent);
  }
}

function traceUpdates(nodes) {
  if (!isEnabled) return;
  nodes.forEach(node => {
    const data = nodeToData.get(node);
    const now = getCurrentTime();
    let lastMeasuredAt = data != null ? data.lastMeasuredAt : 0;
    let rect = data != null ? data.rect : null;

    if (rect === null || lastMeasuredAt + REMEASUREMENT_AFTER_DURATION < now) {
      lastMeasuredAt = now;
      rect = measureNode(node);
    }

    let displayName = agent.getComponentNameForHostInstance(node);

    if (displayName) {
      const {
        baseComponentName,
        hocNames
      } = extractHOCNames(displayName);
      const markers = hocNames.map(hoc => HOC_MARKERS.get(hoc) || '').join('');
      const enhancedDisplayName = markers ? `${markers}${baseComponentName}` : baseComponentName;
      displayName = enhancedDisplayName;
    }

    nodeToData.set(node, {
      count: data != null ? data.count + 1 : 1,
      expirationTime: data != null ? Math.min(now + MAX_DISPLAY_DURATION, data.expirationTime + DISPLAY_DURATION) : now + DISPLAY_DURATION,
      lastMeasuredAt,
      rect,
      displayName
    });
  });

  if (redrawTimeoutID !== null) {
    clearTimeout(redrawTimeoutID);
    redrawTimeoutID = null;
  }

  if (drawAnimationFrameID === null) {
    drawAnimationFrameID = requestAnimationFrame(prepareToDraw);
  }
}

function prepareToDraw() {
  drawAnimationFrameID = null;
  redrawTimeoutID = null;
  const now = getCurrentTime();
  let earliestExpiration = Number.MAX_VALUE; // Remove any items that have already expired.

  nodeToData.forEach((data, node) => {
    if (data.expirationTime < now) {
      nodeToData.delete(node);
    } else {
      earliestExpiration = Math.min(earliestExpiration, data.expirationTime);
    }
  });
  draw(nodeToData, agent);

  if (earliestExpiration !== Number.MAX_VALUE) {
    redrawTimeoutID = setTimeout(prepareToDraw, earliestExpiration - now);
  }
}

function measureNode(node) {
  if (!node || typeof node.getBoundingClientRect !== 'function') {
    return null;
  }

  const currentWindow = window.__REACT_DEVTOOLS_TARGET_WINDOW__ || window;
  return getNestedBoundingClientRect(node, currentWindow);
}
;// CONCATENATED MODULE: ../react-devtools-shared/src/bridge.js
function bridge_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

// Bump protocol version whenever a backwards breaking change is made
// in the messages sent between BackendBridge and FrontendBridge.
// This mapping is embedded in both frontend and backend builds.
//
// The backend protocol will always be the latest entry in the BRIDGE_PROTOCOL array.
//
// When an older frontend connects to a newer backend,
// the backend can send the minNpmVersion and the frontend can display an NPM upgrade prompt.
//
// When a newer frontend connects with an older protocol version,
// the frontend can use the embedded minNpmVersion/maxNpmVersion values to display a downgrade prompt.
const BRIDGE_PROTOCOL = [// This version technically never existed,
// but a backwards breaking change was added in 4.11,
// so the safest guess to downgrade the frontend would be to version 4.10.
{
  version: 0,
  minNpmVersion: '"<4.11.0"',
  maxNpmVersion: '"<4.11.0"'
}, // Versions 4.11.x – 4.12.x contained the backwards breaking change,
// but we didn't add the "fix" of checking the protocol version until 4.13,
// so we don't recommend downgrading to 4.11 or 4.12.
{
  version: 1,
  minNpmVersion: '4.13.0',
  maxNpmVersion: '4.21.0'
}, // Version 2 adds a StrictMode-enabled and supports-StrictMode bits to add-root operation.
{
  version: 2,
  minNpmVersion: '4.22.0',
  maxNpmVersion: null
}];
const currentBridgeProtocol = BRIDGE_PROTOCOL[BRIDGE_PROTOCOL.length - 1];

class Bridge extends EventEmitter {
  constructor(wall) {
    super();

    bridge_defineProperty(this, "_isShutdown", false);

    bridge_defineProperty(this, "_messageQueue", []);

    bridge_defineProperty(this, "_scheduledFlush", false);

    bridge_defineProperty(this, "_wallUnlisten", null);

    bridge_defineProperty(this, "_flush", () => {
      // This method is used after the bridge is marked as destroyed in shutdown sequence,
      // so we do not bail out if the bridge marked as destroyed.
      // It is a private method that the bridge ensures is only called at the right times.
      try {
        if (this._messageQueue.length) {
          for (let i = 0; i < this._messageQueue.length; i += 2) {
            this._wall.send(this._messageQueue[i], ...this._messageQueue[i + 1]);
          }

          this._messageQueue.length = 0;
        }
      } finally {
        // We set this at the end in case new messages are added synchronously above.
        // They're already handled so they shouldn't queue more flushes.
        this._scheduledFlush = false;
      }
    });

    bridge_defineProperty(this, "overrideValueAtPath", ({
      id,
      path,
      rendererID,
      type,
      value
    }) => {
      switch (type) {
        case 'context':
          this.send('overrideContext', {
            id,
            path,
            rendererID,
            wasForwarded: true,
            value
          });
          break;

        case 'hooks':
          this.send('overrideHookState', {
            id,
            path,
            rendererID,
            wasForwarded: true,
            value
          });
          break;

        case 'props':
          this.send('overrideProps', {
            id,
            path,
            rendererID,
            wasForwarded: true,
            value
          });
          break;

        case 'state':
          this.send('overrideState', {
            id,
            path,
            rendererID,
            wasForwarded: true,
            value
          });
          break;
      }
    });

    this._wall = wall;
    this._wallUnlisten = wall.listen(message => {
      if (message && message.event) {
        this.emit(message.event, message.payload);
      }
    }) || null; // Temporarily support older standalone front-ends sending commands to newer embedded backends.
    // We do this because React Native embeds the React DevTools backend,
    // but cannot control which version of the frontend users use.

    this.addListener('overrideValueAtPath', this.overrideValueAtPath);
  } // Listening directly to the wall isn't advised.
  // It can be used to listen for legacy (v3) messages (since they use a different format).


  get wall() {
    return this._wall;
  }

  send(event, ...payload) {
    if (this._isShutdown) {
      console.warn(`Cannot send message "${event}" through a Bridge that has been shutdown.`);
      return;
    } // When we receive a message:
    // - we add it to our queue of messages to be sent
    // - if there hasn't been a message recently, we set a timer for 0 ms in
    //   the future, allowing all messages created in the same tick to be sent
    //   together
    // - if there *has* been a message flushed in the last BATCH_DURATION ms
    //   (or we're waiting for our setTimeout-0 to fire), then _timeoutID will
    //   be set, and we'll simply add to the queue and wait for that


    this._messageQueue.push(event, payload);

    if (!this._scheduledFlush) {
      this._scheduledFlush = true; // $FlowFixMe

      if (typeof devtoolsJestTestScheduler === 'function') {
        // This exists just for our own jest tests.
        // They're written in such a way that we can neither mock queueMicrotask
        // because then we break React DOM and we can't not mock it because then
        // we can't synchronously flush it. So they need to be rewritten.
        // $FlowFixMe
        devtoolsJestTestScheduler(this._flush); // eslint-disable-line no-undef
      } else {
        queueMicrotask(this._flush);
      }
    }
  }

  shutdown() {
    if (this._isShutdown) {
      console.warn('Bridge was already shutdown.');
      return;
    } // Queue the shutdown outgoing message for subscribers.


    this.emit('shutdown');
    this.send('shutdown'); // Mark this bridge as destroyed, i.e. disable its public API.

    this._isShutdown = true; // Disable the API inherited from EventEmitter that can add more listeners and send more messages.
    // $FlowFixMe[cannot-write] This property is not writable.

    this.addListener = function () {}; // $FlowFixMe[cannot-write] This property is not writable.


    this.emit = function () {}; // NOTE: There's also EventEmitter API like `on` and `prependListener` that we didn't add to our Flow type of EventEmitter.
    // Unsubscribe this bridge incoming message listeners to be sure, and so they don't have to do that.


    this.removeAllListeners(); // Stop accepting and emitting incoming messages from the wall.

    const wallUnlisten = this._wallUnlisten;

    if (wallUnlisten) {
      wallUnlisten();
    } // Synchronously flush all queued outgoing messages.
    // At this step the subscribers' code may run in this call stack.


    do {
      this._flush();
    } while (this._messageQueue.length);
  }

}

/* harmony default export */ const bridge = (Bridge);
;// CONCATENATED MODULE: ../react-devtools-shared/src/storage.js
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
function storage_localStorageGetItem(key) {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    return null;
  }
}
function localStorageRemoveItem(key) {
  try {
    localStorage.removeItem(key);
  } catch (error) {}
}
function storage_localStorageSetItem(key, value) {
  try {
    return localStorage.setItem(key, value);
  } catch (error) {}
}
function storage_sessionStorageGetItem(key) {
  try {
    return sessionStorage.getItem(key);
  } catch (error) {
    return null;
  }
}
function storage_sessionStorageRemoveItem(key) {
  try {
    sessionStorage.removeItem(key);
  } catch (error) {}
}
function storage_sessionStorageSetItem(key, value) {
  try {
    return sessionStorage.setItem(key, value);
  } catch (error) {}
}
;// CONCATENATED MODULE: ../react-devtools-shared/src/backend/agent.js
function agent_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */








const debug = (methodName, ...args) => {
  if (__DEBUG__) {
    console.log(`%cAgent %c${methodName}`, 'color: purple; font-weight: bold;', 'font-weight: bold;', ...args);
  }
};

class Agent extends EventEmitter {
  constructor(bridge, isProfiling = false, onReloadAndProfile) {
    super();

    agent_defineProperty(this, "_isProfiling", false);

    agent_defineProperty(this, "_rendererInterfaces", {});

    agent_defineProperty(this, "_persistedSelection", null);

    agent_defineProperty(this, "_persistedSelectionMatch", null);

    agent_defineProperty(this, "_traceUpdatesEnabled", false);

    agent_defineProperty(this, "clearErrorsAndWarnings", ({
      rendererID
    }) => {
      const renderer = this._rendererInterfaces[rendererID];

      if (renderer == null) {
        console.warn(`Invalid renderer id "${rendererID}"`);
      } else {
        renderer.clearErrorsAndWarnings();
      }
    });

    agent_defineProperty(this, "clearErrorsForElementID", ({
      id,
      rendererID
    }) => {
      const renderer = this._rendererInterfaces[rendererID];

      if (renderer == null) {
        console.warn(`Invalid renderer id "${rendererID}"`);
      } else {
        renderer.clearErrorsForElementID(id);
      }
    });

    agent_defineProperty(this, "clearWarningsForElementID", ({
      id,
      rendererID
    }) => {
      const renderer = this._rendererInterfaces[rendererID];

      if (renderer == null) {
        console.warn(`Invalid renderer id "${rendererID}"`);
      } else {
        renderer.clearWarningsForElementID(id);
      }
    });

    agent_defineProperty(this, "copyElementPath", ({
      id,
      path,
      rendererID
    }) => {
      const renderer = this._rendererInterfaces[rendererID];

      if (renderer == null) {
        console.warn(`Invalid renderer id "${rendererID}" for element "${id}"`);
      } else {
        const value = renderer.getSerializedElementValueByPath(id, path);

        if (value != null) {
          this._bridge.send('saveToClipboard', value);
        } else {
          console.warn(`Unable to obtain serialized value for element "${id}"`);
        }
      }
    });

    agent_defineProperty(this, "deletePath", ({
      hookID,
      id,
      path,
      rendererID,
      type
    }) => {
      const renderer = this._rendererInterfaces[rendererID];

      if (renderer == null) {
        console.warn(`Invalid renderer id "${rendererID}" for element "${id}"`);
      } else {
        renderer.deletePath(type, id, hookID, path);
      }
    });

    agent_defineProperty(this, "getBackendVersion", () => {
      const version = "6.1.1-44c3d3d665";

      if (version) {
        this._bridge.send('backendVersion', version);
      }
    });

    agent_defineProperty(this, "getBridgeProtocol", () => {
      this._bridge.send('bridgeProtocol', currentBridgeProtocol);
    });

    agent_defineProperty(this, "getProfilingData", ({
      rendererID
    }) => {
      const renderer = this._rendererInterfaces[rendererID];

      if (renderer == null) {
        console.warn(`Invalid renderer id "${rendererID}"`);
      }

      this._bridge.send('profilingData', renderer.getProfilingData());
    });

    agent_defineProperty(this, "getProfilingStatus", () => {
      this._bridge.send('profilingStatus', this._isProfiling);
    });

    agent_defineProperty(this, "getOwnersList", ({
      id,
      rendererID
    }) => {
      const renderer = this._rendererInterfaces[rendererID];

      if (renderer == null) {
        console.warn(`Invalid renderer id "${rendererID}" for element "${id}"`);
      } else {
        const owners = renderer.getOwnersList(id);

        this._bridge.send('ownersList', {
          id,
          owners
        });
      }
    });

    agent_defineProperty(this, "inspectElement", ({
      forceFullData,
      id,
      path,
      rendererID,
      requestID
    }) => {
      const renderer = this._rendererInterfaces[rendererID];

      if (renderer == null) {
        console.warn(`Invalid renderer id "${rendererID}" for element "${id}"`);
      } else {
        this._bridge.send('inspectedElement', renderer.inspectElement(requestID, id, path, forceFullData)); // When user selects an element, stop trying to restore the selection,
        // and instead remember the current selection for the next reload.


        if (this._persistedSelectionMatch === null || this._persistedSelectionMatch.id !== id) {
          this._persistedSelection = null;
          this._persistedSelectionMatch = null;
          renderer.setTrackedPath(null); // Throttle persisting the selection.

          this._lastSelectedElementID = id;
          this._lastSelectedRendererID = rendererID;

          if (!this._persistSelectionTimerScheduled) {
            this._persistSelectionTimerScheduled = true;
            setTimeout(this._persistSelection, 1000);
          }
        } // TODO: If there was a way to change the selected DOM element
        // in built-in Elements tab without forcing a switch to it, we'd do it here.
        // For now, it doesn't seem like there is a way to do that:
        // https://github.com/bvaughn/react-devtools-experimental/issues/102
        // (Setting $0 doesn't work, and calling inspect() switches the tab.)

      }
    });

    agent_defineProperty(this, "logElementToConsole", ({
      id,
      rendererID
    }) => {
      const renderer = this._rendererInterfaces[rendererID];

      if (renderer == null) {
        console.warn(`Invalid renderer id "${rendererID}" for element "${id}"`);
      } else {
        renderer.logElementToConsole(id);
      }
    });

    agent_defineProperty(this, "overrideError", ({
      id,
      rendererID,
      forceError
    }) => {
      const renderer = this._rendererInterfaces[rendererID];

      if (renderer == null) {
        console.warn(`Invalid renderer id "${rendererID}" for element "${id}"`);
      } else {
        renderer.overrideError(id, forceError);
      }
    });

    agent_defineProperty(this, "overrideSuspense", ({
      id,
      rendererID,
      forceFallback
    }) => {
      const renderer = this._rendererInterfaces[rendererID];

      if (renderer == null) {
        console.warn(`Invalid renderer id "${rendererID}" for element "${id}"`);
      } else {
        renderer.overrideSuspense(id, forceFallback);
      }
    });

    agent_defineProperty(this, "overrideValueAtPath", ({
      hookID,
      id,
      path,
      rendererID,
      type,
      value
    }) => {
      const renderer = this._rendererInterfaces[rendererID];

      if (renderer == null) {
        console.warn(`Invalid renderer id "${rendererID}" for element "${id}"`);
      } else {
        renderer.overrideValueAtPath(type, id, hookID, path, value);
      }
    });

    agent_defineProperty(this, "overrideContext", ({
      id,
      path,
      rendererID,
      wasForwarded,
      value
    }) => {
      // Don't forward a message that's already been forwarded by the front-end Bridge.
      // We only need to process the override command once!
      if (!wasForwarded) {
        this.overrideValueAtPath({
          id,
          path,
          rendererID,
          type: 'context',
          value
        });
      }
    });

    agent_defineProperty(this, "overrideHookState", ({
      id,
      hookID,
      path,
      rendererID,
      wasForwarded,
      value
    }) => {
      // Don't forward a message that's already been forwarded by the front-end Bridge.
      // We only need to process the override command once!
      if (!wasForwarded) {
        this.overrideValueAtPath({
          id,
          path,
          rendererID,
          type: 'hooks',
          value
        });
      }
    });

    agent_defineProperty(this, "overrideProps", ({
      id,
      path,
      rendererID,
      wasForwarded,
      value
    }) => {
      // Don't forward a message that's already been forwarded by the front-end Bridge.
      // We only need to process the override command once!
      if (!wasForwarded) {
        this.overrideValueAtPath({
          id,
          path,
          rendererID,
          type: 'props',
          value
        });
      }
    });

    agent_defineProperty(this, "overrideState", ({
      id,
      path,
      rendererID,
      wasForwarded,
      value
    }) => {
      // Don't forward a message that's already been forwarded by the front-end Bridge.
      // We only need to process the override command once!
      if (!wasForwarded) {
        this.overrideValueAtPath({
          id,
          path,
          rendererID,
          type: 'state',
          value
        });
      }
    });

    agent_defineProperty(this, "onReloadAndProfileSupportedByHost", () => {
      this._bridge.send('isReloadAndProfileSupportedByBackend', true);
    });

    agent_defineProperty(this, "reloadAndProfile", ({
      recordChangeDescriptions,
      recordTimeline
    }) => {
      if (typeof this._onReloadAndProfile === 'function') {
        this._onReloadAndProfile(recordChangeDescriptions, recordTimeline);
      } // This code path should only be hit if the shell has explicitly told the Store that it supports profiling.
      // In that case, the shell must also listen for this specific message to know when it needs to reload the app.
      // The agent can't do this in a way that is renderer agnostic.


      this._bridge.send('reloadAppForProfiling');
    });

    agent_defineProperty(this, "renamePath", ({
      hookID,
      id,
      newPath,
      oldPath,
      rendererID,
      type
    }) => {
      const renderer = this._rendererInterfaces[rendererID];

      if (renderer == null) {
        console.warn(`Invalid renderer id "${rendererID}" for element "${id}"`);
      } else {
        renderer.renamePath(type, id, hookID, oldPath, newPath);
      }
    });

    agent_defineProperty(this, "setTraceUpdatesEnabled", traceUpdatesEnabled => {
      this._traceUpdatesEnabled = traceUpdatesEnabled;
      toggleEnabled(traceUpdatesEnabled);

      for (const rendererID in this._rendererInterfaces) {
        const renderer = this._rendererInterfaces[rendererID];
        renderer.setTraceUpdatesEnabled(traceUpdatesEnabled);
      }
    });

    agent_defineProperty(this, "syncSelectionFromBuiltinElementsPanel", () => {
      const target = window.__REACT_DEVTOOLS_GLOBAL_HOOK__.$0;

      if (target == null) {
        return;
      }

      this.selectNode(target);
    });

    agent_defineProperty(this, "shutdown", () => {
      // Clean up the overlay if visible, and associated events.
      this.emit('shutdown');

      this._bridge.removeAllListeners();

      this.removeAllListeners();
    });

    agent_defineProperty(this, "startProfiling", ({
      recordChangeDescriptions,
      recordTimeline
    }) => {
      this._isProfiling = true;

      for (const rendererID in this._rendererInterfaces) {
        const renderer = this._rendererInterfaces[rendererID];
        renderer.startProfiling(recordChangeDescriptions, recordTimeline);
      }

      this._bridge.send('profilingStatus', this._isProfiling);
    });

    agent_defineProperty(this, "stopProfiling", () => {
      this._isProfiling = false;

      for (const rendererID in this._rendererInterfaces) {
        const renderer = this._rendererInterfaces[rendererID];
        renderer.stopProfiling();
      }

      this._bridge.send('profilingStatus', this._isProfiling);
    });

    agent_defineProperty(this, "stopInspectingNative", selected => {
      this._bridge.send('stopInspectingHost', selected);
    });

    agent_defineProperty(this, "storeAsGlobal", ({
      count,
      id,
      path,
      rendererID
    }) => {
      const renderer = this._rendererInterfaces[rendererID];

      if (renderer == null) {
        console.warn(`Invalid renderer id "${rendererID}" for element "${id}"`);
      } else {
        renderer.storeAsGlobal(id, path, count);
      }
    });

    agent_defineProperty(this, "updateHookSettings", settings => {
      // Propagate the settings, so Backend can subscribe to it and modify hook
      this.emit('updateHookSettings', settings);
    });

    agent_defineProperty(this, "getHookSettings", () => {
      this.emit('getHookSettings');
    });

    agent_defineProperty(this, "onHookSettings", settings => {
      this._bridge.send('hookSettings', settings);
    });

    agent_defineProperty(this, "updateComponentFilters", componentFilters => {
      for (const rendererIDString in this._rendererInterfaces) {
        const rendererID = +rendererIDString;
        const renderer = this._rendererInterfaces[rendererID];

        if (this._lastSelectedRendererID === rendererID) {
          // Changing component filters will unmount and remount the DevTools tree.
          // Track the last selection's path so we can restore the selection.
          const path = renderer.getPathForElement(this._lastSelectedElementID);

          if (path !== null) {
            renderer.setTrackedPath(path);
            this._persistedSelection = {
              rendererID,
              path
            };
          }
        }

        renderer.updateComponentFilters(componentFilters);
      }
    });

    agent_defineProperty(this, "getEnvironmentNames", () => {
      let accumulatedNames = null;

      for (const rendererID in this._rendererInterfaces) {
        const renderer = this._rendererInterfaces[+rendererID];
        const names = renderer.getEnvironmentNames();

        if (accumulatedNames === null) {
          accumulatedNames = names;
        } else {
          for (let i = 0; i < names.length; i++) {
            if (accumulatedNames.indexOf(names[i]) === -1) {
              accumulatedNames.push(names[i]);
            }
          }
        }
      }

      this._bridge.send('environmentNames', accumulatedNames || []);
    });

    agent_defineProperty(this, "onTraceUpdates", nodes => {
      this.emit('traceUpdates', nodes);
    });

    agent_defineProperty(this, "onFastRefreshScheduled", () => {
      if (__DEBUG__) {
        debug('onFastRefreshScheduled');
      }

      this._bridge.send('fastRefreshScheduled');
    });

    agent_defineProperty(this, "onHookOperations", operations => {
      if (__DEBUG__) {
        debug('onHookOperations', `(${operations.length}) [${operations.join(', ')}]`);
      } // TODO:
      // The chrome.runtime does not currently support transferables; it forces JSON serialization.
      // See bug https://bugs.chromium.org/p/chromium/issues/detail?id=927134
      //
      // Regarding transferables, the postMessage doc states:
      // If the ownership of an object is transferred, it becomes unusable (neutered)
      // in the context it was sent from and becomes available only to the worker it was sent to.
      //
      // Even though Chrome is eventually JSON serializing the array buffer,
      // using the transferable approach also sometimes causes it to throw:
      //   DOMException: Failed to execute 'postMessage' on 'Window': ArrayBuffer at index 0 is already neutered.
      //
      // See bug https://github.com/bvaughn/react-devtools-experimental/issues/25
      //
      // The Store has a fallback in place that parses the message as JSON if the type isn't an array.
      // For now the simplest fix seems to be to not transfer the array.
      // This will negatively impact performance on Firefox so it's unfortunate,
      // but until we're able to fix the Chrome error mentioned above, it seems necessary.
      //
      // this._bridge.send('operations', operations, [operations.buffer]);


      this._bridge.send('operations', operations);

      if (this._persistedSelection !== null) {
        const rendererID = operations[0];

        if (this._persistedSelection.rendererID === rendererID) {
          // Check if we can select a deeper match for the persisted selection.
          const renderer = this._rendererInterfaces[rendererID];

          if (renderer == null) {
            console.warn(`Invalid renderer id "${rendererID}"`);
          } else {
            const prevMatch = this._persistedSelectionMatch;
            const nextMatch = renderer.getBestMatchForTrackedPath();
            this._persistedSelectionMatch = nextMatch;
            const prevMatchID = prevMatch !== null ? prevMatch.id : null;
            const nextMatchID = nextMatch !== null ? nextMatch.id : null;

            if (prevMatchID !== nextMatchID) {
              if (nextMatchID !== null) {
                // We moved forward, unlocking a deeper node.
                this._bridge.send('selectElement', nextMatchID);
              }
            }

            if (nextMatch !== null && nextMatch.isFullMatch) {
              // We've just unlocked the innermost selected node.
              // There's no point tracking it further.
              this._persistedSelection = null;
              this._persistedSelectionMatch = null;
              renderer.setTrackedPath(null);
            }
          }
        }
      }
    });

    agent_defineProperty(this, "getIfHasUnsupportedRendererVersion", () => {
      this.emit('getIfHasUnsupportedRendererVersion');
    });

    agent_defineProperty(this, "_persistSelectionTimerScheduled", false);

    agent_defineProperty(this, "_lastSelectedRendererID", -1);

    agent_defineProperty(this, "_lastSelectedElementID", -1);

    agent_defineProperty(this, "_persistSelection", () => {
      this._persistSelectionTimerScheduled = false;
      const rendererID = this._lastSelectedRendererID;
      const id = this._lastSelectedElementID; // This is throttled, so both renderer and selected ID
      // might not be available by the time we read them.
      // This is why we need the defensive checks here.

      const renderer = this._rendererInterfaces[rendererID];
      const path = renderer != null ? renderer.getPathForElement(id) : null;

      if (path !== null) {
        storage_sessionStorageSetItem(SESSION_STORAGE_LAST_SELECTION_KEY, JSON.stringify({
          rendererID,
          path
        }));
      } else {
        storage_sessionStorageRemoveItem(SESSION_STORAGE_LAST_SELECTION_KEY);
      }
    });

    this._isProfiling = isProfiling;
    this._onReloadAndProfile = onReloadAndProfile;
    const persistedSelectionString = storage_sessionStorageGetItem(SESSION_STORAGE_LAST_SELECTION_KEY);

    if (persistedSelectionString != null) {
      this._persistedSelection = JSON.parse(persistedSelectionString);
    }

    this._bridge = bridge;
    bridge.addListener('clearErrorsAndWarnings', this.clearErrorsAndWarnings);
    bridge.addListener('clearErrorsForElementID', this.clearErrorsForElementID);
    bridge.addListener('clearWarningsForElementID', this.clearWarningsForElementID);
    bridge.addListener('copyElementPath', this.copyElementPath);
    bridge.addListener('deletePath', this.deletePath);
    bridge.addListener('getBackendVersion', this.getBackendVersion);
    bridge.addListener('getBridgeProtocol', this.getBridgeProtocol);
    bridge.addListener('getProfilingData', this.getProfilingData);
    bridge.addListener('getProfilingStatus', this.getProfilingStatus);
    bridge.addListener('getOwnersList', this.getOwnersList);
    bridge.addListener('inspectElement', this.inspectElement);
    bridge.addListener('logElementToConsole', this.logElementToConsole);
    bridge.addListener('overrideError', this.overrideError);
    bridge.addListener('overrideSuspense', this.overrideSuspense);
    bridge.addListener('overrideValueAtPath', this.overrideValueAtPath);
    bridge.addListener('reloadAndProfile', this.reloadAndProfile);
    bridge.addListener('renamePath', this.renamePath);
    bridge.addListener('setTraceUpdatesEnabled', this.setTraceUpdatesEnabled);
    bridge.addListener('startProfiling', this.startProfiling);
    bridge.addListener('stopProfiling', this.stopProfiling);
    bridge.addListener('storeAsGlobal', this.storeAsGlobal);
    bridge.addListener('syncSelectionFromBuiltinElementsPanel', this.syncSelectionFromBuiltinElementsPanel);
    bridge.addListener('shutdown', this.shutdown);
    bridge.addListener('updateHookSettings', this.updateHookSettings);
    bridge.addListener('getHookSettings', this.getHookSettings);
    bridge.addListener('updateComponentFilters', this.updateComponentFilters);
    bridge.addListener('getEnvironmentNames', this.getEnvironmentNames);
    bridge.addListener('getIfHasUnsupportedRendererVersion', this.getIfHasUnsupportedRendererVersion); // Temporarily support older standalone front-ends sending commands to newer embedded backends.
    // We do this because React Native embeds the React DevTools backend,
    // but cannot control which version of the frontend users use.

    bridge.addListener('overrideContext', this.overrideContext);
    bridge.addListener('overrideHookState', this.overrideHookState);
    bridge.addListener('overrideProps', this.overrideProps);
    bridge.addListener('overrideState', this.overrideState);
    setupHighlighter(bridge, this);
    TraceUpdates_initialize(this); // By this time, Store should already be initialized and intercept events

    bridge.send('backendInitialized');

    if (this._isProfiling) {
      bridge.send('profilingStatus', true);
    }
  }

  get rendererInterfaces() {
    return this._rendererInterfaces;
  }

  getInstanceAndStyle({
    id,
    rendererID
  }) {
    const renderer = this._rendererInterfaces[rendererID];

    if (renderer == null) {
      console.warn(`Invalid renderer id "${rendererID}"`);
      return null;
    }

    return renderer.getInstanceAndStyle(id);
  }

  getIDForHostInstance(target) {
    if (isReactNativeEnvironment() || typeof target.nodeType !== 'number') {
      // In React Native or non-DOM we simply pick any renderer that has a match.
      for (const rendererID in this._rendererInterfaces) {
        const renderer = this._rendererInterfaces[rendererID];

        try {
          const match = renderer.getElementIDForHostInstance(target);

          if (match != null) {
            return match;
          }
        } catch (error) {// Some old React versions might throw if they can't find a match.
          // If so we should ignore it...
        }
      }

      return null;
    } else {
      // In the DOM we use a smarter mechanism to find the deepest a DOM node
      // that is registered if there isn't an exact match.
      let bestMatch = null;
      let bestRenderer = null; // Find the nearest ancestor which is mounted by a React.

      for (const rendererID in this._rendererInterfaces) {
        const renderer = this._rendererInterfaces[rendererID];
        const nearestNode = renderer.getNearestMountedDOMNode(target);

        if (nearestNode !== null) {
          if (nearestNode === target) {
            // Exact match we can exit early.
            bestMatch = nearestNode;
            bestRenderer = renderer;
            break;
          }

          if (bestMatch === null || bestMatch.contains(nearestNode)) {
            // If this is the first match or the previous match contains the new match,
            // so the new match is a deeper and therefore better match.
            bestMatch = nearestNode;
            bestRenderer = renderer;
          }
        }
      }

      if (bestRenderer != null && bestMatch != null) {
        try {
          return bestRenderer.getElementIDForHostInstance(bestMatch);
        } catch (error) {// Some old React versions might throw if they can't find a match.
          // If so we should ignore it...
        }
      }

      return null;
    }
  }

  getComponentNameForHostInstance(target) {
    // We duplicate this code from getIDForHostInstance to avoid an object allocation.
    if (isReactNativeEnvironment() || typeof target.nodeType !== 'number') {
      // In React Native or non-DOM we simply pick any renderer that has a match.
      for (const rendererID in this._rendererInterfaces) {
        const renderer = this._rendererInterfaces[rendererID];

        try {
          const id = renderer.getElementIDForHostInstance(target);

          if (id) {
            return renderer.getDisplayNameForElementID(id);
          }
        } catch (error) {// Some old React versions might throw if they can't find a match.
          // If so we should ignore it...
        }
      }

      return null;
    } else {
      // In the DOM we use a smarter mechanism to find the deepest a DOM node
      // that is registered if there isn't an exact match.
      let bestMatch = null;
      let bestRenderer = null; // Find the nearest ancestor which is mounted by a React.

      for (const rendererID in this._rendererInterfaces) {
        const renderer = this._rendererInterfaces[rendererID];
        const nearestNode = renderer.getNearestMountedDOMNode(target);

        if (nearestNode !== null) {
          if (nearestNode === target) {
            // Exact match we can exit early.
            bestMatch = nearestNode;
            bestRenderer = renderer;
            break;
          }

          if (bestMatch === null || bestMatch.contains(nearestNode)) {
            // If this is the first match or the previous match contains the new match,
            // so the new match is a deeper and therefore better match.
            bestMatch = nearestNode;
            bestRenderer = renderer;
          }
        }
      }

      if (bestRenderer != null && bestMatch != null) {
        try {
          const id = bestRenderer.getElementIDForHostInstance(bestMatch);

          if (id) {
            return bestRenderer.getDisplayNameForElementID(id);
          }
        } catch (error) {// Some old React versions might throw if they can't find a match.
          // If so we should ignore it...
        }
      }

      return null;
    }
  }

  selectNode(target) {
    const id = this.getIDForHostInstance(target);

    if (id !== null) {
      this._bridge.send('selectElement', id);
    }
  }

  registerRendererInterface(rendererID, rendererInterface) {
    this._rendererInterfaces[rendererID] = rendererInterface;
    rendererInterface.setTraceUpdatesEnabled(this._traceUpdatesEnabled); // When the renderer is attached, we need to tell it whether
    // we remember the previous selection that we'd like to restore.
    // It'll start tracking mounts for matches to the last selection path.

    const selection = this._persistedSelection;

    if (selection !== null && selection.rendererID === rendererID) {
      rendererInterface.setTrackedPath(selection.path);
    }
  }

  onUnsupportedRenderer() {
    this._bridge.send('unsupportedRendererVersion');
  }

}
;// CONCATENATED MODULE: ../react-devtools-shared/src/backend/index.js
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

function initBackend(hook, agent, global, isReloadAndProfileSupported) {
  if (hook == null) {
    // DevTools didn't get injected into this page (maybe b'c of the contentType).
    return () => {};
  }

  function registerRendererInterface(id, rendererInterface) {
    agent.registerRendererInterface(id, rendererInterface); // Now that the Store and the renderer interface are connected,
    // it's time to flush the pending operation codes to the frontend.

    rendererInterface.flushInitialOperations();
  }

  const subs = [hook.sub('renderer-attached', ({
    id,
    rendererInterface
  }) => {
    registerRendererInterface(id, rendererInterface);
  }), hook.sub('unsupported-renderer-version', () => {
    agent.onUnsupportedRenderer();
  }), hook.sub('fastRefreshScheduled', agent.onFastRefreshScheduled), hook.sub('operations', agent.onHookOperations), hook.sub('traceUpdates', agent.onTraceUpdates), hook.sub('settingsInitialized', agent.onHookSettings) // TODO Add additional subscriptions required for profiling mode
  ];
  agent.addListener('getIfHasUnsupportedRendererVersion', () => {
    if (hook.hasUnsupportedRendererAttached) {
      agent.onUnsupportedRenderer();
    }
  });
  hook.rendererInterfaces.forEach((rendererInterface, id) => {
    registerRendererInterface(id, rendererInterface);
  });
  hook.emit('react-devtools', agent);
  hook.reactDevtoolsAgent = agent;

  const onAgentShutdown = () => {
    subs.forEach(fn => fn());
    hook.rendererInterfaces.forEach(rendererInterface => {
      rendererInterface.cleanup();
    });
    hook.reactDevtoolsAgent = null;
  }; // Agent's event listeners are cleaned up by Agent in `shutdown` implementation.


  agent.addListener('shutdown', onAgentShutdown);
  agent.addListener('updateHookSettings', settings => {
    hook.settings = settings;
  });
  agent.addListener('getHookSettings', () => {
    if (hook.settings != null) {
      agent.onHookSettings(hook.settings);
    }
  });

  if (isReloadAndProfileSupported) {
    agent.onReloadAndProfileSupportedByHost();
  }

  return () => {
    subs.forEach(fn => fn());
  };
}
;// CONCATENATED MODULE: ../react-devtools-shared/src/backend/NativeStyleEditor/resolveBoxStyle.js
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

/**
 * This mirrors react-native/Libraries/Inspector/resolveBoxStyle.js (but without RTL support).
 *
 * Resolve a style property into it's component parts, e.g.
 *
 * resolveBoxStyle('margin', {margin: 5, marginBottom: 10})
 * -> {top: 5, left: 5, right: 5, bottom: 10}
 */
function resolveBoxStyle(prefix, style) {
  let hasParts = false;
  const result = {
    bottom: 0,
    left: 0,
    right: 0,
    top: 0
  };
  const styleForAll = style[prefix];

  if (styleForAll != null) {
    // eslint-disable-next-line no-for-of-loops/no-for-of-loops
    for (const key of Object.keys(result)) {
      result[key] = styleForAll;
    }

    hasParts = true;
  }

  const styleForHorizontal = style[prefix + 'Horizontal'];

  if (styleForHorizontal != null) {
    result.left = styleForHorizontal;
    result.right = styleForHorizontal;
    hasParts = true;
  } else {
    const styleForLeft = style[prefix + 'Left'];

    if (styleForLeft != null) {
      result.left = styleForLeft;
      hasParts = true;
    }

    const styleForRight = style[prefix + 'Right'];

    if (styleForRight != null) {
      result.right = styleForRight;
      hasParts = true;
    }

    const styleForEnd = style[prefix + 'End'];

    if (styleForEnd != null) {
      // TODO RTL support
      result.right = styleForEnd;
      hasParts = true;
    }

    const styleForStart = style[prefix + 'Start'];

    if (styleForStart != null) {
      // TODO RTL support
      result.left = styleForStart;
      hasParts = true;
    }
  }

  const styleForVertical = style[prefix + 'Vertical'];

  if (styleForVertical != null) {
    result.bottom = styleForVertical;
    result.top = styleForVertical;
    hasParts = true;
  } else {
    const styleForBottom = style[prefix + 'Bottom'];

    if (styleForBottom != null) {
      result.bottom = styleForBottom;
      hasParts = true;
    }

    const styleForTop = style[prefix + 'Top'];

    if (styleForTop != null) {
      result.top = styleForTop;
      hasParts = true;
    }
  }

  return hasParts ? result : null;
}
;// CONCATENATED MODULE: ../react-devtools-shared/src/backend/NativeStyleEditor/setupNativeStyleEditor.js
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */



function setupNativeStyleEditor(bridge, agent, resolveNativeStyle, validAttributes) {
  bridge.addListener('NativeStyleEditor_measure', ({
    id,
    rendererID
  }) => {
    measureStyle(agent, bridge, resolveNativeStyle, id, rendererID);
  });
  bridge.addListener('NativeStyleEditor_renameAttribute', ({
    id,
    rendererID,
    oldName,
    newName,
    value
  }) => {
    renameStyle(agent, id, rendererID, oldName, newName, value);
    setTimeout(() => measureStyle(agent, bridge, resolveNativeStyle, id, rendererID));
  });
  bridge.addListener('NativeStyleEditor_setValue', ({
    id,
    rendererID,
    name,
    value
  }) => {
    setStyle(agent, id, rendererID, name, value);
    setTimeout(() => measureStyle(agent, bridge, resolveNativeStyle, id, rendererID));
  });
  bridge.send('isNativeStyleEditorSupported', {
    isSupported: true,
    validAttributes
  });
}
const EMPTY_BOX_STYLE = {
  top: 0,
  left: 0,
  right: 0,
  bottom: 0
};
const componentIDToStyleOverrides = new Map();

function measureStyle(agent, bridge, resolveNativeStyle, id, rendererID) {
  const data = agent.getInstanceAndStyle({
    id,
    rendererID
  });

  if (!data || !data.style) {
    bridge.send('NativeStyleEditor_styleAndLayout', {
      id,
      layout: null,
      style: null
    });
    return;
  }

  const {
    instance,
    style
  } = data;
  let resolvedStyle = resolveNativeStyle(style); // If it's a host component we edited before, amend styles.

  const styleOverrides = componentIDToStyleOverrides.get(id);

  if (styleOverrides != null) {
    resolvedStyle = Object.assign({}, resolvedStyle, styleOverrides);
  }

  if (!instance || typeof instance.measure !== 'function') {
    bridge.send('NativeStyleEditor_styleAndLayout', {
      id,
      layout: null,
      style: resolvedStyle || null
    });
    return;
  }

  instance.measure((x, y, width, height, left, top) => {
    // RN Android sometimes returns undefined here. Don't send measurements in this case.
    // https://github.com/jhen0409/react-native-debugger/issues/84#issuecomment-304611817
    if (typeof x !== 'number') {
      bridge.send('NativeStyleEditor_styleAndLayout', {
        id,
        layout: null,
        style: resolvedStyle || null
      });
      return;
    }

    const margin = resolvedStyle != null && resolveBoxStyle('margin', resolvedStyle) || EMPTY_BOX_STYLE;
    const padding = resolvedStyle != null && resolveBoxStyle('padding', resolvedStyle) || EMPTY_BOX_STYLE;
    bridge.send('NativeStyleEditor_styleAndLayout', {
      id,
      layout: {
        x,
        y,
        width,
        height,
        left,
        top,
        margin,
        padding
      },
      style: resolvedStyle || null
    });
  });
}

function shallowClone(object) {
  const cloned = {};

  for (const n in object) {
    cloned[n] = object[n];
  }

  return cloned;
}

function renameStyle(agent, id, rendererID, oldName, newName, value) {
  const data = agent.getInstanceAndStyle({
    id,
    rendererID
  });

  if (!data || !data.style) {
    return;
  }

  const {
    instance,
    style
  } = data;
  const newStyle = newName ? {
    [oldName]: undefined,
    [newName]: value
  } : {
    [oldName]: undefined
  };
  let customStyle; // TODO It would be nice if the renderer interface abstracted this away somehow.

  if (instance !== null && typeof instance.setNativeProps === 'function') {
    // In the case of a host component, we need to use setNativeProps().
    // Remember to "correct" resolved styles when we read them next time.
    const styleOverrides = componentIDToStyleOverrides.get(id);

    if (!styleOverrides) {
      componentIDToStyleOverrides.set(id, newStyle);
    } else {
      Object.assign(styleOverrides, newStyle);
    } // TODO Fabric does not support setNativeProps; chat with Sebastian or Eli


    instance.setNativeProps({
      style: newStyle
    });
  } else if (src_isArray(style)) {
    const lastIndex = style.length - 1;

    if (typeof style[lastIndex] === 'object' && !src_isArray(style[lastIndex])) {
      customStyle = shallowClone(style[lastIndex]);
      delete customStyle[oldName];

      if (newName) {
        customStyle[newName] = value;
      } else {
        customStyle[oldName] = undefined;
      }

      agent.overrideValueAtPath({
        type: 'props',
        id,
        rendererID,
        path: ['style', lastIndex],
        value: customStyle
      });
    } else {
      agent.overrideValueAtPath({
        type: 'props',
        id,
        rendererID,
        path: ['style'],
        value: style.concat([newStyle])
      });
    }
  } else if (typeof style === 'object') {
    customStyle = shallowClone(style);
    delete customStyle[oldName];

    if (newName) {
      customStyle[newName] = value;
    } else {
      customStyle[oldName] = undefined;
    }

    agent.overrideValueAtPath({
      type: 'props',
      id,
      rendererID,
      path: ['style'],
      value: customStyle
    });
  } else {
    agent.overrideValueAtPath({
      type: 'props',
      id,
      rendererID,
      path: ['style'],
      value: [style, newStyle]
    });
  }

  agent.emit('hideNativeHighlight');
}

function setStyle(agent, id, rendererID, name, value) {
  const data = agent.getInstanceAndStyle({
    id,
    rendererID
  });

  if (!data || !data.style) {
    return;
  }

  const {
    instance,
    style
  } = data;
  const newStyle = {
    [name]: value
  }; // TODO It would be nice if the renderer interface abstracted this away somehow.

  if (instance !== null && typeof instance.setNativeProps === 'function') {
    // In the case of a host component, we need to use setNativeProps().
    // Remember to "correct" resolved styles when we read them next time.
    const styleOverrides = componentIDToStyleOverrides.get(id);

    if (!styleOverrides) {
      componentIDToStyleOverrides.set(id, newStyle);
    } else {
      Object.assign(styleOverrides, newStyle);
    } // TODO Fabric does not support setNativeProps; chat with Sebastian or Eli


    instance.setNativeProps({
      style: newStyle
    });
  } else if (src_isArray(style)) {
    const lastLength = style.length - 1;

    if (typeof style[lastLength] === 'object' && !src_isArray(style[lastLength])) {
      agent.overrideValueAtPath({
        type: 'props',
        id,
        rendererID,
        path: ['style', lastLength, name],
        value
      });
    } else {
      agent.overrideValueAtPath({
        type: 'props',
        id,
        rendererID,
        path: ['style'],
        value: style.concat([newStyle])
      });
    }
  } else {
    agent.overrideValueAtPath({
      type: 'props',
      id,
      rendererID,
      path: ['style'],
      value: [style, newStyle]
    });
  }

  agent.emit('hideNativeHighlight');
}
;// CONCATENATED MODULE: ./src/utils.js
/* global chrome */
function getBrowserTheme() {
  if (true) {
    // chrome.devtools.panels added in Chrome 18.
    // chrome.devtools.panels.themeName added in Chrome 54.
    return chrome.devtools.panels.themeName === 'dark' ? 'dark' : 'light';
  } else {}
}
const COMPACT_VERSION_NAME = 'compact';
const EXTENSION_CONTAINED_VERSIONS = [COMPACT_VERSION_NAME];
;// CONCATENATED MODULE: ./src/backend.js
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */





setup(window.__REACT_DEVTOOLS_GLOBAL_HOOK__);

function setup(hook) {
  if (hook == null) {
    return;
  }

  hook.backends.set(COMPACT_VERSION_NAME, {
    Agent: Agent,
    Bridge: bridge,
    initBackend: initBackend,
    setupNativeStyleEditor: setupNativeStyleEditor
  });
  hook.emit('devtools-backend-installed', COMPACT_VERSION_NAME);
}
})();

/******/ })()
;
//# sourceMappingURL=react_devtools_backend_compact.js.map