define(["require", "exports", "./util/pub-sub", "./util/session"], function (require, exports, pub_sub_1, session_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Cell = void 0;
    var CellState;
    (function (CellState) {
        CellState["Default"] = "default";
        CellState["Flagged"] = "flagged";
        CellState["Questioned"] = "questioned";
        CellState["Revealed"] = "revealed";
        CellState["RevealedMine"] = "revealedMine";
        CellState["Explo\u0430ded"] = "exploaded";
        CellState["WronglyFlagged"] = "wronglyFlagged";
    })(CellState || (CellState = {}));
    const VALUE_DEFAULT = -2;
    const VALUE_MINE = -1;
    class Cell {
        constructor(row, col) {
            this.row = row;
            this.col = col;
            this.value = VALUE_DEFAULT;
            this.createHTMLElement();
            this.setState(CellState.Default);
        }
        setValue(value) {
            this.value = value;
            this.el.classList.add(`cell-value-${this.value.toString()}`);
        }
        createHTMLElement() {
            this.el = document.createElement("div");
            this.el.classList.add("cell");
            this.el.addEventListener("click", this);
            this.el.addEventListener("contextmenu", this);
        }
        getRow() {
            return this.row;
        }
        getCol() {
            return this.col;
        }
        getElement() {
            return this.el;
        }
        setState(state) {
            this.el.classList.remove(`state-${this.state}`);
            this.el.classList.add(`state-${state}`);
            this.state = state;
        }
        setMine() {
            this.value = VALUE_MINE;
            if (session_1.Session.get("debug") === true) {
                this.el.classList.add("debug-mine");
            }
        }
        unsetMine() {
            this.value = VALUE_DEFAULT;
            this.el.classList.remove("debug-mine");
        }
        isMine() {
            return this.value == VALUE_MINE;
        }
        isFlagged() {
            return this.state === CellState.Flagged;
        }
        setWronglyFlagged() {
            this.setState(CellState.WronglyFlagged);
        }
        reveal() {
            if (this.state !== CellState.Default)
                return;
            pub_sub_1.PubSub.publish(pub_sub_1.EVENT_CELL_CLICKED, this);
            if (this.isMine()) {
                this.explode();
                return;
            }
            this.setState(CellState.Revealed);
            pub_sub_1.PubSub.publish(pub_sub_1.EVENT_CELL_REVEALED, this);
        }
        explode() {
            this.setState(CellState.Exploаded);
            pub_sub_1.PubSub.publish(pub_sub_1.EVENT_GAME_OVER);
        }
        revealMine() {
            // Leave flags
            if (this.state === CellState.Flagged)
                return;
            // Reveal not exploaded mines
            if (this.state !== CellState.Exploаded) {
                this.setState(CellState.RevealedMine);
            }
        }
        revealFlag() {
            if (this.state === CellState.Default) {
                this.mark();
            }
            else if (this.state === CellState.Questioned) {
                // :)
                this.mark();
                this.mark();
            }
        }
        mark() {
            if (this.state == CellState.Revealed)
                return;
            switch (this.state) {
                case CellState.Default:
                    this.setState(CellState.Flagged);
                    pub_sub_1.PubSub.publish(pub_sub_1.EVENT_CELL_FLAGGED);
                    break;
                case CellState.Flagged:
                    this.setState(CellState.Questioned);
                    pub_sub_1.PubSub.publish(pub_sub_1.EVENT_CELL_UNFLAGGED);
                    break;
                case CellState.Questioned:
                    this.setState(CellState.Default);
                    break;
            }
        }
        handleEvent(e) {
            switch (e.type) {
                case "click":
                    this.reveal();
                    break;
                case "contextmenu":
                    e.preventDefault();
                    this.mark();
                    break;
            }
        }
    }
    exports.Cell = Cell;
});
