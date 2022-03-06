define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PeterPairer = void 0;
    class PeterPairer {
        pair(t) {
            const shell = Math.max(t.a, t.b);
            const step = Math.min(t.a, t.b);
            let flag = 1;
            if (step == t.b) {
                flag = 0;
            }
            return shell * shell + step * 2 + flag;
        }
        unpair(x) {
            const shell = Math.floor(Math.sqrt(x));
            const remainder = x - shell * shell;
            const step = Math.floor(remainder / 2);
            let a, b;
            if (remainder % 2 == 0) {
                a = shell;
                b = step;
            }
            else {
                a = step;
                b = shell;
            }
            const result = {
                a,
                b,
            };
            return result;
        }
    }
    exports.PeterPairer = PeterPairer;
});
