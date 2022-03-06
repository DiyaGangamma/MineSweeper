define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CantorPairer = void 0;
    /**
     * Implemetns Cantor pairing and inverted pairing functions
     * https://en.wikipedia.org/wiki/Pairing_function#Cantor_pairing_function
     * https://en.wikipedia.org/wiki/Pairing_function#Inverting_the_Cantor_pairing_function
     */
    class CantorPairer {
        pair(t) {
            return (t.a + t.b) * (t.a + t.b + 1) / 2 + t.b;
        }
        unpair(x) {
            const w = Math.floor((Math.sqrt((8 * x) + 1) - 1) / 2);
            const t = (w * w + w) / 2;
            const b = x - t;
            const a = w - b;
            const result = {
                a,
                b,
            };
            return result;
        }
    }
    exports.CantorPairer = CantorPairer;
});
