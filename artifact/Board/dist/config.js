define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BOARD_CONFIG = exports.MODE_NAME = exports.FIRST_CLICK = void 0;
    var FIRST_CLICK;
    (function (FIRST_CLICK) {
        FIRST_CLICK[FIRST_CLICK["GuaranteedCell"] = 0] = "GuaranteedCell";
        FIRST_CLICK[FIRST_CLICK["GuaranteedCascade"] = 1] = "GuaranteedCascade";
    })(FIRST_CLICK = exports.FIRST_CLICK || (exports.FIRST_CLICK = {}));
    var MODE_NAME;
    (function (MODE_NAME) {
        MODE_NAME["Beginner"] = "beginner";
        MODE_NAME["Intermediate"] = "intermediate";
        MODE_NAME["Expert"] = "expert";
    })(MODE_NAME = exports.MODE_NAME || (exports.MODE_NAME = {}));
    exports.BOARD_CONFIG = {
        beginner: {
            rows: 9,
            cols: 9,
            mines: 10,
        },
        intermediate: {
            rows: 16,
            cols: 16,
            mines: 40,
        },
        expert: {
            rows: 16,
            cols: 30,
            mines: 99,
        }
    };
});
