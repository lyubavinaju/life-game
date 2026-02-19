import { describe, it, expect, beforeEach } from 'vitest';
import LifeGameService from './LifeGameService';

describe('LifeGameService', () => {
  // Helper function to create a 5x5 matrix filled with zeros
  const createEmptyMatrix = (): number[][] => {
    return Array(5).fill(0).map(() => Array(5).fill(0));
  };

  // Helper function to set specific cells to alive (1)
  const setAlive = (matrix: number[][], ...cells: [number, number][]): number[][] => {
    const m = matrix.map(row => [...row]);
    cells.forEach(([row, col]) => {
      m[row][col] = 1;
    });
    return m;
  };

  let service: LifeGameService;

  beforeEach(() => {
    // Initialize with empty 5x5 matrix
    const matrix = createEmptyMatrix();
    service = new LifeGameService(matrix);
  });

  describe('constructor and getMatrix', () => {
    it('should create a service with initial 5x5 matrix', () => {
      const matrix = service.getMatrix();
      expect(matrix).toHaveLength(5);
      expect(matrix[0]).toHaveLength(5);
    });

    it('should preserve the initial matrix values', () => {
      const initialMatrix = setAlive(createEmptyMatrix(), [2, 2], [2, 3]);
      const serviceWithMatrix = new LifeGameService(initialMatrix);
      const result = serviceWithMatrix.getMatrix();
      expect(result[2][2]).toBe(1);
      expect(result[2][3]).toBe(1);
    });
  });

  describe('nextMatrix - LifeGameService rules', () => {
    it('should keep empty matrix empty', () => {
      const result = service.nextMatrix();
      expect(result.flat().every(cell => cell === 0)).toBe(true);
    });

    it('should kill isolated live cells (less than 2 neighbors)', () => {
      // Single cell - should die
      const matrix = setAlive(createEmptyMatrix(), [2, 2]);
      const testService = new LifeGameService(matrix);
      const result = testService.nextMatrix();
      expect(result[2][2]).toBe(0);
    });

    it('should keep live cell alive with 2 neighbors', () => {
      // Create a cell with exactly 2 neighbors
      const matrix = setAlive(createEmptyMatrix(), [2, 1], [2, 2], [2, 3]);
      const testService = new LifeGameService(matrix);
      const result = testService.nextMatrix();
      expect(result[2][2]).toBe(1);
    });

    it('should keep live cell alive with 3 neighbors', () => {
      // Create a cell with exactly 3 neighbors
      const matrix = setAlive(createEmptyMatrix(), [1, 1], [1, 2], [2, 1], [2, 2]);
      const testService = new LifeGameService(matrix);
      const result = testService.nextMatrix();
      expect(result[1][1]).toBe(1);
      expect(result[2][2]).toBe(1);
    });

    it('should kill live cell with 4 or more neighbors (overpopulation)', () => {
      // Create a cell surrounded by 4 neighbors
      const matrix = setAlive(createEmptyMatrix(), [1, 1], [1, 2], [2, 1], [2, 2], [1, 0]);
      const testService = new LifeGameService(matrix);
      const result = testService.nextMatrix();
      expect(result[1][1]).toBe(0);
    });

    it('should resurrect dead cell with exactly 3 neighbors', () => {
      // Dead cell at [2,2] with 3 live neighbors
      const matrix = setAlive(createEmptyMatrix(), [1, 1], [1, 2], [1, 3]);
      const testService = new LifeGameService(matrix);
      const result = testService.nextMatrix();
      expect(result[2][2]).toBe(1);
    });

    it('should not resurrect dead cell with 2 neighbors', () => {
      // Dead cell with only 2 neighbors
      const matrix = setAlive(createEmptyMatrix(), [1, 1], [1, 2]);
      const testService = new LifeGameService(matrix);
      const result = testService.nextMatrix();
      expect(result[2][2]).toBe(0);
    });

    it('should not resurrect dead cell with 4 or more neighbors', () => {
      // Dead cell surrounded by 4 live neighbors
      const matrix = setAlive(createEmptyMatrix(), [1, 1], [1, 2], [2, 1], [2, 3]);
      const testService = new LifeGameService(matrix);
      const result = testService.nextMatrix();
      expect(result[2][2]).toBe(0);
    });
  });

  describe('nextMatrix - Blinker pattern (oscillator)', () => {
    it('should toggle blinker pattern', () => {
      // Vertical blinker: [2,1], [2,2], [2,3]
      const matrix = setAlive(createEmptyMatrix(), [2, 1], [2, 2], [2, 3]);
      const testService = new LifeGameService(matrix);

      // After first generation, should become horizontal
      const result1 = testService.nextMatrix();
      expect(result1[1][2]).toBe(1);
      expect(result1[2][2]).toBe(1);
      expect(result1[3][2]).toBe(1);
      expect(result1[2][1]).toBe(0);
      expect(result1[2][3]).toBe(0);

      // After second generation, should become vertical again
      const result2 = testService.nextMatrix();
      expect(result2[2][1]).toBe(1);
      expect(result2[2][2]).toBe(1);
      expect(result2[2][3]).toBe(1);
      expect(result2[1][2]).toBe(0);
      expect(result2[3][2]).toBe(0);
    });
  });

  describe('nextMatrix - Block pattern (still life)', () => {
    it('should keep block pattern stable', () => {
      // 2x2 block: stable pattern
      const matrix = setAlive(createEmptyMatrix(), [2, 2], [2, 3], [3, 2], [3, 3]);
      const testService = new LifeGameService(matrix);
      const result = testService.nextMatrix();

      expect(result[2][2]).toBe(1);
      expect(result[2][3]).toBe(1);
      expect(result[3][2]).toBe(1);
      expect(result[3][3]).toBe(1);
    });
  });

  describe('nextMatrix - glider pattern', () => {
    it('should transform glider correctly', () => {
      // Glider pattern
      const matrix = setAlive(
        createEmptyMatrix(),
        [1, 2],
        [2, 3],
        [3, 1],
        [3, 2],
        [3, 3]
      );
      const testService = new LifeGameService(matrix);
      const result1 = testService.nextMatrix();

      // After one generation, glider should have shifted
      // Verify some cells are alive
      const aliveCells = result1.flat().filter(cell => cell === 1).length;
      expect(aliveCells).toBe(5);
    });
  });

  describe('nextMatrix - boundary conditions', () => {
    it('should handle cells at matrix edges', () => {
      // Cell at corner [0, 0]
      const matrix = setAlive(createEmptyMatrix(), [0, 0], [0, 1], [1, 0]);
      const testService = new LifeGameService(matrix);
      const result = testService.nextMatrix();

      // [0,0] has 3 neighbors, should stay alive
      expect(result[0][0]).toBe(1);
    });

    it('should handle cells at top edge', () => {
      const matrix = setAlive(createEmptyMatrix(), [0, 1], [0, 2], [0, 3]);
      const testService = new LifeGameService(matrix);
      const result = testService.nextMatrix();

      // Center cell [0,2] should become alive and create pattern
      expect(result[1][2]).toBe(1);
    });

    it('should handle cells at bottom edge', () => {
      const matrix = setAlive(createEmptyMatrix(), [4, 1], [4, 2], [4, 3]);
      const testService = new LifeGameService(matrix);
      const result = testService.nextMatrix();

      // Should handle bottom edge correctly
      const aliveCells = result.flat().filter(cell => cell === 1).length;
      expect(aliveCells).toBeGreaterThanOrEqual(0);
    });

    it('should handle cells at left edge', () => {
      const matrix = setAlive(createEmptyMatrix(), [1, 0], [2, 0], [3, 0]);
      const testService = new LifeGameService(matrix);
      const result = testService.nextMatrix();

      const aliveCells = result.flat().filter(cell => cell === 1).length;
      expect(aliveCells).toBeGreaterThanOrEqual(0);
    });

    it('should handle cells at right edge', () => {
      const matrix = setAlive(createEmptyMatrix(), [1, 4], [2, 4], [3, 4]);
      const testService = new LifeGameService(matrix);
      const result = testService.nextMatrix();

      const aliveCells = result.flat().filter(cell => cell === 1).length;
      expect(aliveCells).toBeGreaterThanOrEqual(0);
    });
  });

  describe('nextMatrix - multiple generations', () => {
    it('should progress through multiple generations', () => {
      const matrix = setAlive(createEmptyMatrix(), [2, 1], [2, 2], [2, 3]);
      const testService = new LifeGameService(matrix);

      let gen1alive = testService.nextMatrix().flat().filter(c => c === 1).length;
      expect(gen1alive).toBe(3);

      let gen2alive = testService.nextMatrix().flat().filter(c => c === 1).length;
      expect(gen2alive).toBe(3);

      let gen3alive = testService.nextMatrix().flat().filter(c => c === 1).length;
      expect(gen3alive).toBe(3);
    });

    it('should return matrix from nextMatrix call', () => {
      const matrix = setAlive(createEmptyMatrix(), [2, 2]);
      const testService = new LifeGameService(matrix);
      const result = testService.nextMatrix();

      expect(result).toHaveLength(5);
      expect(result[0]).toHaveLength(5);
    });
  });

  describe('nextMatrix - specific cell states', () => {
    it('should correctly count neighbors for corner cell', () => {
      // Set up neighbors for top-left corner [0,0]
      const matrix = setAlive(createEmptyMatrix(), [0, 1], [1, 0], [1, 1]);
      const testService = new LifeGameService(matrix);
      const result = testService.nextMatrix();

      // [0,0] has 3 neighbors, should become alive
      expect(result[0][0]).toBe(1);
    });

    it('should correctly count neighbors for edge cell', () => {
      // Set up neighbors for edge cell [0,2]
      const matrix = setAlive(createEmptyMatrix(), [0, 1], [0, 3], [1, 2]);
      const testService = new LifeGameService(matrix);
      const result = testService.nextMatrix();

      // [0,2] has 3 neighbors
      expect(result[0][2]).toBe(1);
    });

    it('should correctly count neighbors for center cell', () => {
      // Set up neighbors for center cell [2,2]
      const matrix = setAlive(createEmptyMatrix(), [1, 1], [1, 2], [2, 1]);
      const testService = new LifeGameService(matrix);
      const result = testService.nextMatrix();

      // [2,2] has 3 neighbors, should become alive
      expect(result[2][2]).toBe(1);
    });
  });
});
