ScriptKit.Class.extend('ScriptKit.IEnumerable', {});
ScriptKit.Class.extend('ScriptKit.IEnumerator', {});

ScriptKit.Class.extend('ScriptKit.Dictionary', {
    $extend: [ScriptKit.IEnumerable],

    init: function (obj) {
        if (Object.prototype.toString.call(obj) === '[object Object]') {
            this.entries = obj;
            this.count = ScriptKit.getPropertyNames(this.entries).length;
        }
        else if (ScriptKit.is(obj, ScriptKit.Dictionary)) {
            this.entries = {};
            this.count = 0;
            for (var key in obj) {
                this.entries[key] = obj[key];
                this.count++;
            }
        }
        else {
            this.entries = {};
            this.count = 0;
        }
    },

    getKeys: function () {
        return ScriptKit.getPropertyNames(this.entries, false);
    },

    getValues: function () {
        var keys = this.getKeys(),
            result = [];

        for (var i = 0; i < keys.length; i++) {
            result.push(this.entries[keys[i]]);
        }

        return result;
    },

    clear: function () {
        this.entries = {};
        this.count = 0;
    },

    containsKey: function (key) {
        return ScriptKit.isDefined(this.entries[key]);
    },

    containsValue: function (value) {
        var keys = this.getKeys();
        for (var i = 0; i < keys.length; i++) {
            if (value === this.entries[keys[i]]) {
                return true;
            }
        }
        return false;
    },

    get: function (key) {
        if (!this.containsKey(key)) {
            throw new Error("Key not found: " + key);
        }
        return this.entries[key];
    },

    add: function (key, value) {
        if (!this.containsKey(key)) {
            this.count++;
        }
        this.entries[key] = value;
    },

    remove: function (key) {
        if (this.containsKey(key)) {
            this.count--;
        }
        delete this.entries[key];
    },

    getCount: function () {
        return this.count;
    },

    getEnumerator: function () {
        return new ScriptKit.DictionaryEnumerator(this.entries);
    }
});

ScriptKit.Class.extend('ScriptKit.ICollection', {
    $extend: [ScriptKit.IEnumerable]
});

ScriptKit.Class.extend('ScriptKit.List', {
    $extend: [ScriptKit.ICollection],
    init: function (obj) {
        if (Object.prototype.toString.call(obj) === '[object Array]') {
            this.items = obj;
        }
        else if (ScriptKit.is(obj, ScriptKit.IEnumerable)) {
            this.items = ScriptKit.toArray(obj);
        }
        else {
            this.items = [];
        }
    },

    checkIndex: function (index) {
        if (index < 0 || index > (this.items.length - 1)) {
            throw new Error("Index out of range");
        }
    },

    getCount: function () {
        return this.items.length;
    },

    get: function (index) {
        this.checkIndex(index);
        return this.items[index];
    },

    set: function (index, value) {
        this.checkIndex(index);
        this.items[index] = value;
    },

    add: function (value) {
        this.items.push(value);
    },

    addRange: function (items) {
        var array = ScriptKit.toArray(items),
            i,
            len;
        for (i = 0, len = array.length; i < len; ++i) {
            this.items.push(array[i]);
        }
    },

    clear: function () {
        this.items = [];
    },

    indexOf: function (item, startIndex) {
        var i;

        if (!ScriptKit.isDefined(startIndex)) {
            startIndex = 0;
        }

        if (startIndex != 0) {
            this.checkIndex(index);
        }

        for (i = startIndex; i < this.items.length; i++) {
            if (item === this.items[i]) {
                return i;
            }
        }
        return -1;
    },

    contains: function (item) {
        return this.indexOf(item) > -1;
    },

    getEnumerator: function () {
        return new ScriptKit.ArrayEnumerator(this.items);
    },

    getRange: function (index, count) {
        if (!ScriptKit.isDefined(index)) {
            index = 0;
        }

        if (!ScriptKit.isDefined(count)) {
            count = this.items.length;
        }

        if (index != 0) {
            this.checkIndex(index);
        }

        this.checkIndex(index + count - 1);

        var result = [],
            i;

        for (i = index; i < count; i++) {
            result.push(this.items[i]);
        }

        return result;
    },

    insert: function (index, item) {
        if (index != 0) {
            this.checkIndex(index);
        }


        if (ScriptKit.isArray(item)) {
            for (var i = 0; i < item.length; i++) {
                this.insert(index++, item[i]);
            }
        }
        else {
            this.items.splice(index, 0, item);
        }
    },

    join: function (delimeter) {
        return this.items.join(delimeter);
    },

    lastIndexOf: function (item, fromIndex) {
        if (!ScriptKit.isDefined(fromIndex)) {
            fromIndex = this.items.length - 1;
        }

        if (fromIndex != 0) {
            this.checkIndex(fromIndex);
        }

        for (var i = fromIndex; i >= 0; i--) {
            if (item === this.items[i]) {
                return i;
            }
        }
        return -1;
    },

    remove: function (item) {
        var index = this.indexOf(item);
        this.checkIndex(index);
        this.items.splice(index, 1);
    },

    removeAt: function (index) {
        this.checkIndex(index);
        this.items.splice(index, 1);
    },

    removeRange: function (index, count) {
        this.checkIndex(index);
        this.items.splice(index, count);
    },

    reverse: function () {
        this.items.reverse();
    },

    slice: function (start, end) {
        this.items.slice(start, end);
    },

    sort: function (comparison) {
        this.items.sort(comparison);
    },

    splice: function (start, count, items) {
        this.items.splice(start, count, items);
    },

    unshift: function () {
        this.items.unshift();
    },

    toArray: function () {
        return ScriptKit.toArray(this);
    }
});


ScriptKit.Class.extend("ScriptKit.ArrayEnumerator", {
    init: function (array) {
        this.array = array;
        this.index = 0;
    },

    hasNext : function () {
	    return this.index < this.array.length;
	},

    next : function() {
        return this.array[this.index++];
    }
});

ScriptKit.Class.extend("ScriptKit.DictionaryEnumerator", {
    init: function (entries) {
        this.entries = entries;
        this.keys = ScriptKit.getPropertyNames(this.entries, false);
        this.index = 0;
    },

    hasNext: function () {
        return this.index < this.keys.length;
    },

    next: function () {
        var index = this.index++,
            key = this.keys[index];
        return {
            key: key,
            value: this.entries[key]
        };
    }
});