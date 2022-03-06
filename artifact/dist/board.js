define(["require", "exports", "./cell", "./config", "./state", "./util/pub-sub", "./util/session"], function (require, exports, cell_1, config_1, state_1, pub_sub_1, session_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Board = void 0;
    class Board {
        constructor(mode, state) {
            this.mode = mode;
            this.state = state;
            this.revealedCounter = 0;
            this.eventSubscribers = [
                { event: pub_sub_1.EVENT_CELL_CLICKED, subscriber: this.secureSafeArea.bind(this) },
                { event: pub_sub_1.EVENT_CELL_REVEALED, subscriber: this.calculateCellValue.bind(this) },
                { event: pub_sub_1.EVENT_CELL_REVEALED, subscriber: this.incrementRevealed.bind(this) },
            ];
            this.initGrid();
            this.plantMines();
            this.subscribe();
        }
        subscribe() {
            this.eventSubscribers.forEach((es) => pub_sub_1.PubSub.subscribe(es.event, es.subscriber));
        }
        unsubscribe() {
            this.eventSubscribers.forEach((es) => pub_sub_1.PubSub.unsubscribe(es.event, es.subscriber));
        }
        getMode() {
            return this.mode;
        }
        getState() {
            if (this.state) {
                return this.state;
            }
            const state = new state_1.State(this.mode.rows * this.mode.cols);
            for (let row = 0; row < this.mode.rows; row++) {
                for (let col = 0; col < this.mode.cols; col++) {
                    if (this.grid[row][col].isMine()) {
                        state.setBit(row * this.mode.cols + col);
                    }
                }
            }
            return state;
        }
        getMines() {
            return this.mode.mines;
        }
        initGrid() {
            this.grid = [];
            for (let i = 0; i < this.mode.rows; i++) {
                this.grid[i] = [];
                for (let j = 0; j < this.mode.cols; j++) {
                    this.grid[i][j] = new cell_1.Cell(i, j);
                }
            }
        }
        plantMines() {
            if (this.state == undefined) {
                this.plantMinesRandomly();
            }
            else {
                this.plantMinesFromState();
            }
        }
        plantMinesFromState() {
            for (let i = 0; i < this.mode.rows * this.mode.cols; i++) {
                if (this.state.isHighBit(i)) {
                    const row = Math.floor(i / this.mode.cols);
                    const col = i % this.mode.cols;
                    this.grid[row][col].setMine();
                }
            }
        }
        plantMinesRandomly() {
            let count = 0;
            while (count < this.mode.mines) {
                const row = this.random(0, this.mode.rows);
                const col = this.random(0, this.mode.cols);
                if (!this.grid[row][col].isMine()) {
                    this.grid[row][col].setMine();
                    count++;
                }
            }
        }
        /**
         * Replants a mine to a new randomly-generated row and column.
         * The new position should not be lying in the safe area
         * defined by a center cell and a radius (distance).
         * The distance is defined by the configuration for first click.
         *
         * @param centerRow Center row of the safe area
         * @param centerCol Center column of the safe area
         */
        replantMine(centerRow, centerCol) {
            const randomRow = this.random(0, this.mode.rows);
            const randomCol = this.random(0, this.mode.cols);
            const distance = session_1.Session.get("firstClick");
            const outOfSafeArea = (randomRow > centerRow + distance || randomRow < centerRow - distance) &&
                (randomCol > centerCol + distance || randomCol < centerCol - distance);
            if (outOfSafeArea && !this.grid[randomRow][randomCol].isMine()) {
                this.grid[randomRow][randomCol].setMine();
                return;
            }
            this.replantMine(centerRow, centerCol);
        }
        random(from, to) {
            return Math.floor(Math.random() * to) + from;
        }
        draw(boardEl) {
            // Remove existing cells (on reset/replay)
            boardEl.textContent = "";
            this.grid.forEach(row => {
                row.forEach(cell => boardEl.append(cell.getElement()));
            });
        }
        secureSafeArea(cell) {
            if (!session_1.Session.get("gameStarted", false) && session_1.Session.get("applyFirstClickRule")) {
                this.makeSafeArea(cell);
            }
        }
        makeSafeArea(centerCell) {
            if (centerCell.isMine()) {
                centerCell.unsetMine();
                this.replantMine(centerCell.getRow(), centerCell.getCol());
            }
            if (session_1.Session.get("firstClick") === config_1.FIRST_CLICK.GuaranteedCascade) {
                const adjacentCells = this.getAdjacentCells(centerCell.getRow(), centerCell.getCol());
                for (const adj of adjacentCells) {
                    if (adj.isMine()) {
                        adj.unsetMine();
                        this.replantMine(centerCell.getRow(), centerCell.getCol());
                    }
                }
            }
            pub_sub_1.PubSub.publish(pub_sub_1.EVENT_SAFE_AREA_CREATED);
        }
        calculateCellValue(cell) {
            const adjacentCells = this.getAdjacentCells(cell.getRow(), cell.getCol());
            let value = 0;
            for (let adj of adjacentCells) {
                if (adj.isMine()) {
                    value++;
                }
            }
            cell.setValue(value);
            if (value == 0) {
                this.revealCellAdjacentCells(adjacentCells);
            }
        }
        revealCellAdjacentCells(adjacentCells) {
            adjacentCells.forEach(adj => adj.reveal());
        }
        getAdjacentCells(row, col) {
            const adj = [];
            for (let i = Math.max(row - 1, 0); i <= Math.min(row + 1, this.mode.rows - 1); i++) {
                for (let j = Math.max(col - 1, 0); j <= Math.min(col + 1, this.mode.cols - 1); j++) {
                    // Skip current cell
                    if (i == row && j == col)
                        continue;
                    adj.push(this.grid[i][j]);
                }
            }
            return adj;
        }
        revealMines(win) {
            for (let i = 0; i < this.mode.rows; i++) {
                for (let j = 0; j < this.mode.cols; j++) {
                    const cell = this.grid[i][j];
                    if (cell.isMine()) {
                        if (win) {
                            cell.revealFlag();
                        }
                        else {
                            cell.revealMine();
                        }
                    }
                    else {
                        if (cell.isFlagged()) {
                            cell.setWronglyFlagged();
                        }
                    }
                }
            }
        }
        deactivateCells() {
            for (let i = 0; i < this.mode.rows; i++) {
                for (let j = 0; j < this.mode.cols; j++) {
                    const cell = this.grid[i][j];
                    cell.getElement().removeEventListener("click", cell);
                    cell.getElement().removeEventListener("contextmenu", cell);
                    cell.getElement().addEventListener("contextmenu", e => e.preventDefault());
                }
            }
        }
        incrementRevealed() {
            this.revealedCounter++;
            this.checkForWin();
        }
        checkForWin() {
            if (this.revealedCounter === this.mode.rows * this.mode.cols - this.mode.mines) {
                pub_sub_1.PubSub.publish(pub_sub_1.EVENT_GAME_OVER, true);
            }
        }
    }
    exports.Board = Board;
});
