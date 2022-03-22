define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SzudzikPairer = void 0;
    class SzudzikPairer {
        pair(t) {
            if (t.a > t.b) {
                return t.a * t.a + t.b;
            }
            else {
                return t.b * t.b + t.b + t.a;
            }
        }
        unpair(x) {
            const shell = Math.floor(Math.sqrt(x));
            let a, b;
            if (x - shell * shell < shell) {
                a = shell;
                b = x - shell * shell;
            }
            else {
                a = x - shell * shell - shell;
                b = shell;
            }
            const result = {
                a,
                b,
            };
            return result;
        }
    }
    exports.SzudzikPairer = SzudzikPairer;
});
