export function getRandomIntNumber(min: number, max: number): number {
    return min + Math.floor(Math.random() * (max + 1 - min));
}

export function getRandomIntMatrix(rows : number, columns: number, min: number, max: number): number[][] {
    return Array.from({length :rows}, () => Array.from({length: columns},
        () => getRandomIntNumber(min, max)
    ));
}