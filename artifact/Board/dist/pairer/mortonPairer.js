define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MortonPairer = void 0;
    /**
     * Implements Morton order function (Z-Order curve)
     * https://en.wikipedia.org/wiki/Z-order_curve
     */
    class MortonPairer {
        pair(t) {
            let x = t.a;
            let y = t.b;
            let p = 0;
            let i = 0;
            while (x || y) {
                p |= (x & 1) << i;
                x >>= 1;
                p |= (y & 1) << (i + 1);
                y >>= 1;
                i += 2;
            }
            return p;
        }
        unpair(x) {
            let a = 0;
            let b = 0;
            let i = 0;
            while (x) {
                a |= (x & 1) << i;
                x >>= 1;
                b |= (x & 1) << i;
                x >>= 1;
                i++;
            }
            const result = {
                a,
                b,
            };
            return result;
        }
    }
    exports.MortonPairer = MortonPairer;
});
