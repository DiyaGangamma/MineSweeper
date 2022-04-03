define(["require", "exports", "./board", "./timer", "./counter", "./config", "./urlTool", "./util/pub-sub", "./util/session"], function (require, exports, board_1, timer_1, counter_1, config_1, urlTool_1, pub_sub_1, session_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Game = void 0;
    class Game {
        constructor(config) {
            this.config = config;
            this.counter = new counter_1.Counter(document.getElementById("mines-counter"));
            this.timer = new timer_1.Timer(document.getElementById("timer"));
            this.resetBtn = document.getElementById("reset");
            this.resetBtn.addEventListener("click", this.reset.bind(this));
            this.replayBtn = document.getElementById("replay");
            this.replayBtn.addEventListener("click", this.replay.bind(this));
            window.addEventListener("hashchange", this.handleHashChange.bind(this));
            this.urlTool = new urlTool_1.UrlTool(this.config.encoder, this.config.modePairer);
            pub_sub_1.PubSub.subscribe(pub_sub_1.EVENT_CELL_REVEALED, this.start.bind(this));
            pub_sub_1.PubSub.subscribe(pub_sub_1.EVENT_CELL_FLAGGED, this.incrementFlags.bind(this));
            pub_sub_1.PubSub.subscribe(pub_sub_1.EVENT_CELL_UNFLAGGED, this.decrementFlags.bind(this));
            pub_sub_1.PubSub.subscribe(pub_sub_1.EVENT_GAME_OVER, this.gameOver.bind(this));
            pub_sub_1.PubSub.subscribe(pub_sub_1.EVENT_SAFE_AREA_CREATED, this.updateUrlHash.bind(this));
            this.initialize();
        }
        getConfig() {
            return this.config;
        }
        reset() {
            if (confirm("This action is irreversible. Do you really want to RESET?") == true) {
                if (session_1.Session.get("debug")) {
                    console.debug('======= RESET =======');
                }
                this.updateUrlHash(true);
                this.timer.stop();
                this.isReset = true;
                this.isReplay = false;
                this.resetBtn.innerHTML = "RESET";
                this.initialize();
            }         
        }
        replay() {
            if (confirm("This action is irreversible. Do you really want to REPLAY?") == true) {
                if (session_1.Session.get("debug")) {
                    console.debug('======= REPLAY =======');
                }
                this.timer.stop();
                this.isReset = false;
                this.isReplay = true;
                this.initialize();
            }   
        }
        handleHashChange() {
            if (session_1.Session.get("debug")) {
                console.debug('======= HASH CHANGED =======');
            }
            this.timer.stop();
            this.isReset = false;
            this.isReplay = false;
            this.initialize();
        }
        initialize() {
            session_1.Session.clear();
            session_1.Session.set("debug", this.config.debug);
            session_1.Session.set("firstClick", this.config.firstClick);
            this.isOver = false;
            this.timer.reset();
            if (this.board != null) { // Microsoft Edge Mobile doesn't support optional chaining yet
                this.board.unsubscribe();
            }
            this.generateScenario();
            const boardEl = document.getElementById("board");
            boardEl.style.setProperty("--rows", this.board.getMode().rows.toString());
            boardEl.style.setProperty("--cols", this.board.getMode().cols.toString());
            this.board.draw(boardEl);
            this.setFlags(0);
        }
        generateScenario() {
            let mode;
            let state;
            if (this.isReset) {
                mode = this.board.getMode();
                state = null;
                session_1.Session.set("applyFirstClickRule", true);
            }
            else if (this.isReplay) {
                // Same as if started by a URL with a hash, but here we avoid decoding and unpairing
                mode = this.board.getMode();
                state = this.board.getState();
            }
            else if (this.urlTool.isHashSet()) {
                var e = sessionStorage.getItem("mode");

                if (e == "Beginner") {
                    mode = {
                        rows: 9,
                        cols: 9,
                        mines: 10,
                    };
                }
                else if (e == "Intermediate") {
                    mode = {
                        rows: 16,
                        cols: 16,
                        mines: 40,
                    };
                }
                else if (e == "Expert") {
                    mode = {
                        rows: 16,
                        cols: 30,
                        mines: 99,
                    }
                }


                //mode = this.urlTool.extractMode();
                // Optional chaining workaround
                if (mode == null && this.board != null) {
                    mode = {
                        rows: 9,
                        cols: 9,
                        mines: 10,
                    };//this.board.getMode();
                }
                else if (mode == null) {
                    mode = config_1.BOARD_CONFIG[this.config.mode];
                }
                state = this.urlTool.extractState(mode);
                if (state == null) {
                    console.warn("Could not extract mode or state from hash. Falling back to defaults.");
                }
            }
            else {
                mode = config_1.BOARD_CONFIG[this.config.mode];
                state = null;
                session_1.Session.set("applyFirstClickRule", true);
            }
            if (session_1.Session.get("debug")) {
                console.debug(mode);
            }
            this.board = new board_1.Board(mode, state);
            this.updateUrlHash();
        }
        start() {
            if (!this.timer.isStarted()) {
                this.timer.start();
                session_1.Session.set("gameStarted", true);
            }
        }
        isStarted() {
            return this.timer.isStarted();
        }
        gameOver(win = false) {
            this.timer.stop();
            this.isOver = true;
            this.board.deactivateCells();
            this.board.revealMines(win);
            if (win) {
                this.resetBtn.innerHTML = "WIN!";
            }
        }
        checkIsOver() {
            return this.isOver;
        }
        setFlags(value) {
            this.flagsCounter = value;
            this.counter.updateEl(this.board.getMines() - this.flagsCounter);
        }
        incrementFlags(value) {
            this.setFlags(++this.flagsCounter);
        }
        decrementFlags() {
            this.setFlags(--this.flagsCounter);
        }
        updateUrlHash(empty = false) {
            if (empty) {
                this.urlTool.updateHash(null, null);
            }
            else {
                this.urlTool.updateHash(this.board.getMode(), this.board.getState());
            }
        }
    }
    exports.Game = Game;
});
