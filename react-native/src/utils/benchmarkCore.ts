/**
 * CPU Benchmark Core Logic
 * Contains various CPU-intensive algorithms for benchmarking
 */

// Prime number calculation using Sieve of Eratosthenes
export function sieveOfEratosthenes(limit: number): number[] {
  const sieve = new Array(limit + 1).fill(true);
  sieve[0] = sieve[1] = false;

  for (let i = 2; i * i <= limit; i++) {
    if (sieve[i]) {
      for (let j = i * i; j <= limit; j += i) {
        sieve[j] = false;
      }
    }
  }

  const primes: number[] = [];
  for (let i = 2; i <= limit; i++) {
    if (sieve[i]) primes.push(i);
  }
  return primes;
}

// Matrix multiplication (NxN matrices)
export function matrixMultiply(size: number): number[][] {
  const A: number[][] = [];
  const B: number[][] = [];
  const C: number[][] = [];

  // Initialize matrices with random values
  for (let i = 0; i < size; i++) {
    A[i] = [];
    B[i] = [];
    C[i] = [];
    for (let j = 0; j < size; j++) {
      A[i][j] = Math.random() * 100;
      B[i][j] = Math.random() * 100;
      C[i][j] = 0;
    }
  }

  // Multiply matrices
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      for (let k = 0; k < size; k++) {
        C[i][j] += A[i][k] * B[k][j];
      }
    }
  }

  return C;
}

// Fibonacci calculation (recursive with memoization for some, iterative for stress)
export function fibonacciIterative(n: number): number {
  if (n <= 1) return n;
  let a = 0, b = 1;
  for (let i = 2; i <= n; i++) {
    const temp = a + b;
    a = b;
    b = temp;
  }
  return b;
}

// SHA-256 like hash computation (simplified intensive computation)
export function computeHash(iterations: number): number {
  let hash = 0x6a09e667;
  const prime1 = 0x85ebca6b;
  const prime2 = 0xc2b2ae35;

  for (let i = 0; i < iterations; i++) {
    hash ^= (i * prime1);
    hash = (hash << 13) | (hash >>> 19);
    hash *= prime2;
    hash ^= (hash >>> 16);
    hash = Math.abs(hash);
  }

  return hash;
}

// Mandelbrot set calculation (very CPU intensive)
export function mandelbrotCalculation(width: number, height: number, maxIterations: number): number {
  let totalIterations = 0;
  const xMin = -2.5, xMax = 1.0;
  const yMin = -1.0, yMax = 1.0;

  for (let py = 0; py < height; py++) {
    for (let px = 0; px < width; px++) {
      const x0 = xMin + (px / width) * (xMax - xMin);
      const y0 = yMin + (py / height) * (yMax - yMin);

      let x = 0, y = 0;
      let iteration = 0;

      while (x * x + y * y <= 4 && iteration < maxIterations) {
        const xTemp = x * x - y * y + x0;
        y = 2 * x * y + y0;
        x = xTemp;
        iteration++;
      }

      totalIterations += iteration;
    }
  }

  return totalIterations;
}

// N-Queens problem solver (backtracking)
export function solveNQueens(n: number): number {
  let solutions = 0;
  const board = new Array(n).fill(-1);

  function isSafe(row: number, col: number): boolean {
    for (let i = 0; i < row; i++) {
      if (board[i] === col || 
          Math.abs(board[i] - col) === Math.abs(i - row)) {
        return false;
      }
    }
    return true;
  }

  function solve(row: number): void {
    if (row === n) {
      solutions++;
      return;
    }

    for (let col = 0; col < n; col++) {
      if (isSafe(row, col)) {
        board[row] = col;
        solve(row + 1);
        board[row] = -1;
      }
    }
  }

  solve(0);
  return solutions;
}

// FFT-like computation (trigonometric operations)
export function fftLikeComputation(size: number): number {
  let result = 0;
  const data = new Array(size).fill(0).map((_, i) => Math.sin(i * 0.01));

  for (let k = 0; k < size; k++) {
    let realSum = 0;
    let imagSum = 0;
    for (let n = 0; n < size; n++) {
      const angle = (2 * Math.PI * k * n) / size;
      realSum += data[n] * Math.cos(angle);
      imagSum += data[n] * Math.sin(angle);
    }
    result += Math.sqrt(realSum * realSum + imagSum * imagSum);
  }

  return result;
}

// Sorting benchmark (QuickSort on large array)
export function sortBenchmark(size: number): number[] {
  const arr = new Array(size).fill(0).map(() => Math.random() * 1000000);
  
  function quickSort(arr: number[], low: number, high: number): void {
    if (low < high) {
      const pivot = arr[high];
      let i = low - 1;

      for (let j = low; j < high; j++) {
        if (arr[j] < pivot) {
          i++;
          [arr[i], arr[j]] = [arr[j], arr[i]];
        }
      }
      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
      const pi = i + 1;

      quickSort(arr, low, pi - 1);
      quickSort(arr, pi + 1, high);
    }
  }

  quickSort(arr, 0, arr.length - 1);
  return arr;
}

// Floating-point intensive computation
export function floatingPointBenchmark(iterations: number): number {
  let result = 1.0;
  
  for (let i = 1; i <= iterations; i++) {
    result *= Math.sin(i) * Math.cos(i) + Math.tan(i * 0.001);
    result = Math.sqrt(Math.abs(result) + 1);
    result += Math.log(Math.abs(result) + 1);
    result = Math.pow(result, 0.99);
  }

  return result;
}

// Memory-intensive computation with cache stress
export function memoryIntensiveBenchmark(size: number): number {
  const data = new Array(size).fill(0).map((_, i) => i);
  let sum = 0;

  // Random access pattern to stress cache
  for (let i = 0; i < size * 2; i++) {
    const index = Math.floor(Math.random() * size);
    data[index] = (data[index] + data[(index + 127) % size]) % 1000000;
    sum += data[index];
  }

  return sum;
}

export interface BenchmarkResult {
  name: string;
  duration: number;
  score: number;
}

export interface BenchmarkConfig {
  // Single-core test configurations
  primeLimit: number;
  matrixSize: number;
  fibonacciN: number;
  hashIterations: number;
  mandelbrotWidth: number;
  mandelbrotHeight: number;
  mandelbrotMaxIter: number;
  nQueensN: number;
  fftSize: number;
  sortSize: number;
  floatIterations: number;
  memorySize: number;
  
  // Number of iterations for each test
  iterations: number;
}

// Default configuration calibrated for ~30-45 seconds total runtime on modern devices
export const DEFAULT_CONFIG: BenchmarkConfig = {
  primeLimit: 50000,
  matrixSize: 100,
  fibonacciN: 100000,
  hashIterations: 500000,
  mandelbrotWidth: 200,
  mandelbrotHeight: 200,
  mandelbrotMaxIter: 100,
  nQueensN: 11,
  fftSize: 512,
  sortSize: 50000,
  floatIterations: 100000,
  memorySize: 100000,
  iterations: 3, // Run each test 3 times for averaging
};

// Reference times (in ms) for score normalization - based on a "100 score" reference device
const REFERENCE_TIMES: { [key: string]: number } = {
  primes: 50,
  matrix: 80,
  fibonacci: 20,
  hash: 100,
  mandelbrot: 150,
  nqueens: 200,
  fft: 120,
  sort: 100,
  float: 80,
  memory: 60,
};

export function calculateScore(testName: string, duration: number): number {
  const refTime = REFERENCE_TIMES[testName] || 100;
  // Score formula: reference_time / actual_time * 50 (so 50 is the middle score)
  // Clamp between 1 and 100
  const rawScore = (refTime / duration) * 50;
  return Math.max(1, Math.min(100, Math.round(rawScore)));
}

export function calculateOverallScore(results: BenchmarkResult[]): number {
  if (results.length === 0) return 0;
  const totalScore = results.reduce((sum, r) => sum + r.score, 0);
  return Math.round(totalScore / results.length);
}
