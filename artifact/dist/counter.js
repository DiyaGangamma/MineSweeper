define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Counter = void 0;
    const COUNTER_LENGTH = 3;
    const COUNTER_PAD = "00";
    class Counter {
        constructor(el) {
            this.el = el;
        }
        updateEl(value) {
            const neg = value < 0 ? "-" : "";
            this.el.innerHTML = neg + (COUNTER_PAD + Math.abs(value)).slice((COUNTER_LENGTH - neg.length) * -1);
        }
    }
    exports.Counter = Counter;
});
