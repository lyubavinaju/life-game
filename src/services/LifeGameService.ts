
export default class LifeGameService {
    constructor(private _matrix: number[][]) { }
    getMatrix() {
        return this._matrix;
    }
    nextMatrix() {
        this._matrix = this._matrix.map((row, rowInd) => this.newRow(row, rowInd));
        return this._matrix;
    }
    private newRow(row: number[], rowInd: number): number[] {
        return row.map((cell, columnInd) => this.newCell(cell, rowInd, columnInd));
    }
    private newCell(cell: number, rowInd: number, columnInd: number): number {
        const nNeighbors: number = this.getCountNeighbors(cell, rowInd, columnInd);
        return cell ? forLiveCell(nNeighbors) : forDeadCell(nNeighbors);
    }
    private getCountNeighbors(cell: number, rowInd: number, columnInd: number): number {
        const bounderMatrix: number[][] = this.getBounderMatrix(rowInd, columnInd);
        const count = bounderMatrix.flatMap(row => row).reduce((acc, cell) => acc + cell);
        return count - cell;
    }
    private getBounderMatrix(rowInd: number, columnInd: number): number[][] {
        const start = columnInd === 0 ? 0 : columnInd - 1;
        const end = columnInd === this._matrix[0].length - 1 ? columnInd + 1 : columnInd + 2;
        return [rowInd - 1, rowInd, rowInd + 1].map(ind => this._matrix[ind]? this._matrix[ind].slice(start, end) : [0]);
    }
}

function forLiveCell(nNeighbors: number): number {
    return +(nNeighbors === 2 || nNeighbors === 3);
}

function forDeadCell(nNeighbors: number): number {
    return +(nNeighbors === 3);
}
