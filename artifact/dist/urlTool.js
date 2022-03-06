define(["require", "exports", "./state"], function (require, exports, state_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.UrlTool = void 0;
    const MODE_SIZE = 24;
    const MIN_ROWS = 5;
    const MIN_COLS = 5;
    const MAX_MINES_TO_CELLS_RATIO = 0.25;
    class UrlTool {
        constructor(encoder, pairer) {
            this.encoder = encoder;
            this.pairer = pairer;
            this.decodedHash = "";
        }
        isHashSet() {
            return window.location.hash.length > 1;
        }
        extractMode() {
            try {
                this.decodedHash = this.encoder.decode(window.location.hash.slice(1));
            }
            catch (e) {
                console.error("Invalid hash!", e);
                return null;
            }
            const binaryMode = this.decodedHash.slice(0, MODE_SIZE);
            const decimal = parseInt(binaryMode, 2);
            let decoded = this.pairer.unpair(decimal);
            const mines = decoded.b;
            if (mines < 1) {
                console.error("Invalid hash! Can't extract mode!");
                return null;
            }
            decoded = this.pairer.unpair(decoded.a);
            const rows = decoded.a;
            const cols = decoded.b;
            if (rows < MIN_ROWS ||
                cols < MIN_COLS ||
                (mines > rows * cols * MAX_MINES_TO_CELLS_RATIO)) {
                console.error("Invalid hash! Can't extract mode!");
                return null;
            }
            let mode = {
                rows,
                cols,
                mines,
            };
            return mode;
        }
        extractState(mode) {
            const stateString = this.decodedHash.slice(MODE_SIZE, mode.rows * mode.cols + MODE_SIZE);
            if (mode.rows * mode.cols != stateString.length) {
                console.error("Invalid hash! Can't extract state!");
                return null;
            }
            const state = new state_1.State(stateString.length);
            state.setData(stateString
                .split("")
                .map(bit => parseInt(bit)));
            return state;
        }
        updateHash(mode, state) {
            let encodedHash = "";
            if (mode != null && state != null) {
                const modeEncoded = this.encodeMode(mode);
                const decodedHash = modeEncoded + state;
                encodedHash = this.encoder.encode(decodedHash);
            }
            history.replaceState(undefined, undefined, `#${encodedHash}`);
        }
        encodeMode(mode) {
            let t = {
                a: mode.rows,
                b: mode.cols,
            };
            let paired = this.pairer.pair(t);
            t = {
                a: paired,
                b: mode.mines,
            };
            paired = this.pairer.pair(t);
            const binary = paired.toString(2);
            return binary.padStart(MODE_SIZE, "0");
        }
    }
    exports.UrlTool = UrlTool;
});
