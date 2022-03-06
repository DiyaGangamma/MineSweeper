define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.State = void 0;
    class State {
        constructor(size) {
            this.size = size;
            this.data = [];
            for (let i = 0; i < size; i++) {
                this.data[i] = 0;
            }
        }
        setData(data) {
            this.data = data;
        }
        isHighBit(index) {
            if (index >= this.size) {
                throw "Index out of bounds!";
            }
            return this.data[index] == 1;
        }
        setBit(index) {
            if (index >= this.size) {
                throw "Index out of bounds!";
            }
            this.data[index] = 1;
        }
        unsetBit(index) {
            if (index >= this.size) {
                throw "Index out of bounds!";
            }
            this.data[index] = 0;
        }
        toString() {
            return this.data.join("");
        }
    }
    exports.State = State;
});
