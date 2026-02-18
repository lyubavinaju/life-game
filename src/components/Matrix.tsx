import React from 'react'
import { getRandomIntMatrix } from "../utils/random";
import matrixData from "../config/matrix-config";
import LifeGameService from '../services/LifeGameService';

function Matrix() {
    const { rows, columns, ticInterval } = matrixData;
    const [matrix, setMatrix] = React.useState<number[][]>([]);
    const lifeGame = React.useRef<LifeGameService>(null);

    React.useEffect(() => {
        lifeGame.current = new LifeGameService(getRandomIntMatrix(rows, columns, 0, 1));
        setMatrix(lifeGame.current.getMatrix());
    }, [rows, columns]);

    React.useEffect(() => {
        function tic() {
            setMatrix(lifeGame.current!.nextMatrix());
        }
        const intervalId = setInterval(tic, ticInterval);
        return () => clearInterval(intervalId);
    }, [ticInterval]);
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
