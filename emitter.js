//    Title: emitter.js
//    Author: Jon Cody
//
//    This program is free software: you can redistribute it and/or modify
//    it under the terms of the GNU General Public License as published by
//    the Free Software Foundation, either version 3 of the License, or
//    (at your option) any later version.
//
//    This program is distributed in the hope that it will be useful,
//    but WITHOUT ANY WARRANTY; without even the implied warranty of
//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//    GNU General Public License for more details.
//
//    You should have received a copy of the GNU General Public License
//    along with this program.  If not, see <http://www.gnu.org/licenses/>.



(function (global) {
    'use strict';


    function emitter(object) {
        object = object && typeof object === 'object'
            ? object
            : {};
        object.events = {};
        object.addListener = function (type, listener) {
            var list = object.events[type];

            if (typeof listener === 'function') {
                if (object.events.newListener) {
                    object.emit('newListener', type, typeof listener.listener === 'function'
                        ? listener.listener
                        : listener);
                }
                if (!list) {
                    object.events[type] = [listener];
                } else {
                    object.events[type].push(listener);
                }
            }
            return object;
        };
        object.on = object.addListener;

        object.once = function (type, listener) {
            function g() {
                object.removeListener(type, g);
                listener.apply(object);
            }
            if (typeof listener === 'function') {
                g.listener = listener;
                object.on(type, g);
            }
            return object;
        };

        object.removeListener = function (type, listener) {
            var list = object.events[type],
                position = -1,
                i;

            if (typeof listener === 'function' && list) {
                for (i = list.length - 1; i >= 0; i -= 1) {
                    if (list[i] === listener || (list[i].listener && list[i].listener === listener)) {
                        position = i;
                        break;
                    }
                }
                if (position >= 0) {
                    if (list.length === 1) {
                        delete object.events[type];
                    } else {
                        list.splice(position, 1);
                    }
                    if (object.events.removeListener) {
                        object.emit('removeListener', type, listener);
                    }
                }
            }
            return object;
        };
        object.off = object.removeListener;

        object.removeAllListeners = function (type) {
            var list,
                i;

            if (!object.events.removeListener) {
                if (!type) {
                    object.events = {};
                } else {
                    delete object.events[type];
                }
            } else if (!type) {
                Object.keys(object.events).forEach(function (key) {
                    if (key !== 'removeListener') {
                        object.removeAllListeners(key);
                    }
                });
                object.removeAllListeners('removeListener');
                object.events = {};
            } else {
                list = object.events[type];
                for (i = list.length - 1; i >= 0; i -= 1) {
                    object.removeListener(type, list[i]);
                }
                delete object.events[type];
            }
            return object;
        };

        object.listeners = function (type) {
            var list = [];

            if (type) {
                if (object.events[type]) {
                    list = object.events[type];
                }
            } else {
                Object.keys(object.events).forEach(function (key) {
                    list.push(object.events[key]);
                });
            }
            return list;
        };

        object.emit = function (type) {
            var list = object.events[type],
                bool = false,
                args = [],
                length,
                i;

            if (list) {
                length = arguments.length;
                for (i = 1; i < length; i += 1) {
                    args[i - 1] = arguments[i];
                }
                length = list.length;
                for (i = 0; i < length; i += 1) {
                    list[i].apply(object, args);
                }
                bool = true;
            }
            return bool;
        };

        return object;
    }


    global.emitter = emitter;


}(window || this));
