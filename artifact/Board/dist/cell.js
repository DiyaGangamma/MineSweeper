
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
        CellState["RevealedMine1"] = "revealedMine1";
        CellState["RevealedMine2"] = "revealedMine2";
        CellState["RevealedMine3"] = "revealedMine3";
        CellState["Explo\u0430ded1"] = "exploaded1";
        CellState["Explo\u0430ded2"] = "exploaded2";
        CellState["Explo\u0430ded3"] = "exploaded3";
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
            if (document.getElementById("soundOnOFF").textContent == "ON") {
                var bite = new Audio();
                bite.src = "assets/bite.mp3";
                bite.play();
            }
            pub_sub_1.PubSub.publish(pub_sub_1.EVENT_CELL_REVEALED, this);
        }
        explode() {
            if (document.getElementById("soundOnOFF").textContent == "ON") {
                var boop = new Audio();
                boop.src = "assets/boop.mp3";
                boop.play();
                boop.pause();
            }
            // this.setState(CellState.Exploаded1);
            var mineTypeSelect = document.getElementById("mine");
            var selectedText = mineTypeSelect.options[mineTypeSelect.selectedIndex].text;
            if (selectedText == "Modern"){
                this.setState(CellState.Exploаded2);
            } else if (selectedText == "Happy"){
                this.setState(CellState.Exploаded3);
            } else {
                this.setState(CellState.Exploаded1);
            }
            pub_sub_1.PubSub.publish(pub_sub_1.EVENT_GAME_OVER);
        }
        revealMine() {
            // Leave flags
            if (this.state === CellState.Flagged)
                return;
            // Reveal not exploaded mines
            if (this.state !== CellState.Exploаded) {

                var mineTypeSelect = document.getElementById("mine");
                var selectedText = mineTypeSelect.options[mineTypeSelect.selectedIndex].text;
                if (selectedText == "Modern"){
                    this.setState(CellState.RevealedMine2);
                } else if (selectedText == "Happy"){
                    this.setState(CellState.RevealedMine3);
                } else {
                    this.setState(CellState.RevealedMine1);
                }
                if (document.getElementById("soundOnOFF").textContent == "ON") {
                    var plunger = new Audio();
                    plunger.src = "assets/plunger.mp3";
                    plunger.play();
                }
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
