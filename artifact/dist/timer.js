define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Timer = void 0;
    class Timer {
        constructor(el) {
            this.el = el;
            this.value = 0;
        }
        isStarted() {
            return this.intervaID !== undefined;
        }
        start() {
            this.intervaID = window.setInterval(() => {
                this.value++;
                this.updateEl();
            }, 1000);
        }
        stop() {
            if (this.intervaID !== undefined) {
                window.clearInterval(this.intervaID);
            }
        }
        reset() {
            this.value = 0;
            this.intervaID = undefined;
            this.updateEl();
        }
        updateEl() {
            let min = Math.floor(this.value / 60);
            let sec = this.value % 60;
            this.el.title = `${min}min ${sec}sec`;
            this.el.innerHTML = ("00" + this.value).slice(-3);
        }
    }
    exports.Timer = Timer;
});
