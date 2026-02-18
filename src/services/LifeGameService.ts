
export default class LifeGameService {
    constructor(private _matrix: number[][]) { }
    getMatrix() {
        return this._matrix;
    }
    nextMatrix() {
        const nextMatrix = Array.from({ length: this._matrix.length },
            () => Array.from({ length: this._matrix[0].length }, () => 0));
        for (let rowId = 0; rowId < this._matrix.length; rowId++) {
            for (let columnId = 0; columnId < this._matrix[0].length; columnId++) {
                const countAlive = this.countNeighborAlive(rowId, columnId);
                if (this.isAlive(rowId, columnId) && (countAlive === 2 || countAlive === 3)
                    || !this.isAlive(rowId, columnId) && countAlive === 3) {
                    nextMatrix[rowId][columnId] = 1;
                } else {
                    nextMatrix[rowId][columnId] = 0;
                }
            }
        }
        this._matrix = nextMatrix;
        return this._matrix;
    }

    private isAlive(rowId: number, columnId: number): boolean {
        return this._matrix[rowId][columnId] === 1;
    }

    private countNeighborAlive(rowId: number, columnId: number): number {
        let countAlive = 0;
        for (let rowStep = -1; rowStep <= 1; rowStep++) {
            for (let columnStep = -1; columnStep <= 1; columnStep++) {
                const neighborRowId = rowId + rowStep;
                const neighborColumnId = columnId + columnStep;
                if ((neighborRowId === rowId && neighborColumnId === columnId)
                    || (neighborRowId < 0 || neighborRowId >= this._matrix.length)
                    || (neighborColumnId < 0 || neighborColumnId >= this._matrix[0].length)
                ) {
                    continue;
                }
                if (this.isAlive(neighborRowId, neighborColumnId)) {
                    countAlive++;
                }
            }
        }
        return countAlive;
    }
}