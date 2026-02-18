import React from 'react'
import { getRandomIntMatrix } from "../utils/random";
import matrixData from "../config/matrix-config";
import LifeGameService from '../services/LifeGameService';

function Matrix() {
    const {rows, columns} = matrixData;
    const [matrix, setMatrix] = React.useState<number[][]>([]);
    React.useEffect(() => {
        const lifeGame = new LifeGameService(getRandomIntMatrix(rows, columns, 0, 1));
        setMatrix(lifeGame.getMatrix());
    }, [rows, columns]);
    function getCells(matrix: number[][]): React.ReactNode {
        return matrix.map((row, rInd) => {
            return row.map((cellValue, cInd) =>
                 <div key={`${rInd}-${cInd}`} className={`cell ${cellValue === 1 ? 'cell-alive' : 'cell-dead'}`}></div>)
        })
    }
  return (
    <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        width: '80vh',
        height: '80vh',
    }}> {getCells(matrix)}
    </div>
  )
}

export default Matrix
