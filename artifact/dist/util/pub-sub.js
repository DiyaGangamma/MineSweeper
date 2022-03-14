
define(["require", "exports", "./session"], function (require, exports, session_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PubSub = exports.EVENT_SAFE_AREA_CREATED = exports.EVENT_GAME_OVER = exports.EVENT_CELL_UNFLAGGED = exports.EVENT_CELL_FLAGGED = exports.EVENT_CELL_REVEALED = exports.EVENT_CELL_CLICKED = void 0;
    exports.EVENT_CELL_CLICKED = "cellClicked";
    exports.EVENT_CELL_REVEALED = "cellRevealed";
    exports.EVENT_CELL_FLAGGED = "cellFlagged";
    exports.EVENT_CELL_UNFLAGGED = "cellUnflagged";
    exports.EVENT_GAME_OVER = "gameOver";
    exports.EVENT_SAFE_AREA_CREATED = "safeAreaCreated";
    class PubSub {
        constructor() { }
        static subscribe(eventName, func) {
            PubSub.events[eventName] = PubSub.events[eventName] || [];
            PubSub.events[eventName].push(func);
        }
        static unsubscribe(eventName, func) {
            if (PubSub.events[eventName]) {
                PubSub.events[eventName] = PubSub.events[eventName].filter((f) => f != func);
            }
        }
        static publish(eventName, data) {
            if (PubSub.events[eventName]) {
                if (session_1.Session.get("debug")) {
                    console.debug(`EVENT: ${eventName}`);
                }
                PubSub.events[eventName].forEach((f) => f(data));
            }
        }
    }
    exports.PubSub = PubSub;
    PubSub.events = {};
});
