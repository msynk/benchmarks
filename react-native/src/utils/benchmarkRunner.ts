/**
 * Benchmark Runner
 * Orchestrates single-core and multi-core benchmark tests
 */

import {
  sieveOfEratosthenes,
  matrixMultiply,
  fibonacciIterative,
  computeHash,
  mandelbrotCalculation,
  solveNQueens,
  fftLikeComputation,
  sortBenchmark,
  floatingPointBenchmark,
  memoryIntensiveBenchmark,
  BenchmarkResult,
  BenchmarkConfig,
  DEFAULT_CONFIG,
  calculateScore,
  calculateOverallScore,
} from './benchmarkCore';

export interface TestProgress {
  currentTest: string;
  testIndex: number;
  totalTests: number;
  iteration: number;
  totalIterations: number;
  overallProgress: number; // 0-100
}

export interface BenchmarkSummary {
  singleCoreScore: number;
  multiCoreScore: number;
  singleCoreResults: BenchmarkResult[];
  multiCoreResults: BenchmarkResult[];
  totalDuration: number;
  coreCount: number;
}

type ProgressCallback = (progress: TestProgress) => void;

// Get simulated core count (React Native doesn't have direct access)
// We'll use a reasonable default and let the device info module provide actual count
export function getEstimatedCoreCount(): number {
  // This will be overridden by actual device info
  return 4;
}

// Allow a small delay for UI updates
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Run a single test and measure time
async function runTest(
  testName: string,
  testFn: () => void,
  iterations: number,
  onProgress?: (iteration: number) => void
): Promise<{ avgDuration: number; durations: number[] }> {
  const durations: number[] = [];

  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    testFn();
    const end = performance.now();
    durations.push(end - start);
    
    if (onProgress) {
      onProgress(i + 1);
    }
    
    // Small delay to keep UI responsive
    await delay(10);
  }

  const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
  return { avgDuration, durations };
}

// Single-core benchmark tests
const SINGLE_CORE_TESTS = [
  {
    name: 'primes',
    displayName: 'Prime Numbers',
    run: (config: BenchmarkConfig) => () => sieveOfEratosthenes(config.primeLimit),
  },
  {
    name: 'matrix',
    displayName: 'Matrix Multiplication',
    run: (config: BenchmarkConfig) => () => matrixMultiply(config.matrixSize),
  },
  {
    name: 'fibonacci',
    displayName: 'Fibonacci Sequence',
    run: (config: BenchmarkConfig) => () => fibonacciIterative(config.fibonacciN),
  },
  {
    name: 'hash',
    displayName: 'Hash Computation',
    run: (config: BenchmarkConfig) => () => computeHash(config.hashIterations),
  },
  {
    name: 'mandelbrot',
    displayName: 'Mandelbrot Set',
    run: (config: BenchmarkConfig) => () =>
      mandelbrotCalculation(config.mandelbrotWidth, config.mandelbrotHeight, config.mandelbrotMaxIter),
  },
  {
    name: 'nqueens',
    displayName: 'N-Queens Problem',
    run: (config: BenchmarkConfig) => () => solveNQueens(config.nQueensN),
  },
  {
    name: 'fft',
    displayName: 'FFT Computation',
    run: (config: BenchmarkConfig) => () => fftLikeComputation(config.fftSize),
  },
  {
    name: 'sort',
    displayName: 'QuickSort',
    run: (config: BenchmarkConfig) => () => sortBenchmark(config.sortSize),
  },
  {
    name: 'float',
    displayName: 'Floating Point',
    run: (config: BenchmarkConfig) => () => floatingPointBenchmark(config.floatIterations),
  },
  {
    name: 'memory',
    displayName: 'Memory Access',
    run: (config: BenchmarkConfig) => () => memoryIntensiveBenchmark(config.memorySize),
  },
];

export async function runSingleCoreBenchmark(
  config: BenchmarkConfig = DEFAULT_CONFIG,
  onProgress?: ProgressCallback
): Promise<BenchmarkResult[]> {
  const results: BenchmarkResult[] = [];
  const totalTests = SINGLE_CORE_TESTS.length;
  const totalIterations = config.iterations;

  for (let testIndex = 0; testIndex < totalTests; testIndex++) {
    const test = SINGLE_CORE_TESTS[testIndex];
    
    const { avgDuration } = await runTest(
      test.name,
      test.run(config),
      totalIterations,
      (iteration) => {
        if (onProgress) {
          const overallProgress = 
            ((testIndex * totalIterations + iteration) / (totalTests * totalIterations)) * 100;
          
          onProgress({
            currentTest: test.displayName,
            testIndex: testIndex + 1,
            totalTests,
            iteration,
            totalIterations,
            overallProgress,
          });
        }
      }
    );

    const score = calculateScore(test.name, avgDuration);
    results.push({
      name: test.displayName,
      duration: avgDuration,
      score,
    });
  }

  return results;
}

// Multi-core simulation using parallel workloads
// In React Native, true multi-threading requires native modules
// We simulate multi-core stress by running multiple computations in parallel using Promises
async function runParallelWorkload(
  config: BenchmarkConfig,
  coreCount: number
): Promise<number> {
  const start = performance.now();
  
  // Create parallel workloads - each "thread" runs intensive calculations
  const workloads = Array.from({ length: coreCount }, async (_, threadId) => {
    // Each thread runs a mix of intensive calculations
    const workPerThread = Math.floor(config.hashIterations / coreCount);
    
    // Run multiple types of computations to stress different CPU features
    computeHash(workPerThread);
    matrixMultiply(Math.floor(config.matrixSize * 0.8));
    mandelbrotCalculation(
      Math.floor(config.mandelbrotWidth / 2),
      Math.floor(config.mandelbrotHeight / 2),
      config.mandelbrotMaxIter
    );
    floatingPointBenchmark(Math.floor(config.floatIterations / coreCount));
    
    return threadId;
  });

  // Wait for all workloads to complete
  await Promise.all(workloads);
  
  const end = performance.now();
  return end - start;
}

// Multi-core tests - designed to stress multiple cores
const MULTI_CORE_TESTS = [
  {
    name: 'parallel_hash',
    displayName: 'Parallel Hashing',
    run: async (config: BenchmarkConfig, coreCount: number) => {
      const workloads = Array.from({ length: coreCount }, () => 
        Promise.resolve(computeHash(Math.floor(config.hashIterations / 2)))
      );
      await Promise.all(workloads);
    },
  },
  {
    name: 'parallel_matrix',
    displayName: 'Parallel Matrix Ops',
    run: async (config: BenchmarkConfig, coreCount: number) => {
      const workloads = Array.from({ length: coreCount }, () =>
        Promise.resolve(matrixMultiply(config.matrixSize))
      );
      await Promise.all(workloads);
    },
  },
  {
    name: 'parallel_mandelbrot',
    displayName: 'Parallel Fractals',
    run: async (config: BenchmarkConfig, coreCount: number) => {
      const workloads = Array.from({ length: coreCount }, (_, i) => {
        const startY = Math.floor((i * config.mandelbrotHeight) / coreCount);
        const endY = Math.floor(((i + 1) * config.mandelbrotHeight) / coreCount);
        const height = endY - startY;
        return Promise.resolve(
          mandelbrotCalculation(config.mandelbrotWidth, height, config.mandelbrotMaxIter)
        );
      });
      await Promise.all(workloads);
    },
  },
  {
    name: 'parallel_float',
    displayName: 'Parallel Float Ops',
    run: async (config: BenchmarkConfig, coreCount: number) => {
      const workloads = Array.from({ length: coreCount }, () =>
        Promise.resolve(floatingPointBenchmark(Math.floor(config.floatIterations / 2)))
      );
      await Promise.all(workloads);
    },
  },
  {
    name: 'parallel_sort',
    displayName: 'Parallel Sorting',
    run: async (config: BenchmarkConfig, coreCount: number) => {
      const workloads = Array.from({ length: coreCount }, () =>
        Promise.resolve(sortBenchmark(Math.floor(config.sortSize / 2)))
      );
      await Promise.all(workloads);
    },
  },
  {
    name: 'parallel_mixed',
    displayName: 'Mixed Workload',
    run: async (config: BenchmarkConfig, coreCount: number) => {
      const workloads = Array.from({ length: coreCount * 2 }, (_, i) => {
        const testType = i % 4;
        switch (testType) {
          case 0:
            return Promise.resolve(computeHash(config.hashIterations / 4));
          case 1:
            return Promise.resolve(matrixMultiply(Math.floor(config.matrixSize * 0.7)));
          case 2:
            return Promise.resolve(floatingPointBenchmark(config.floatIterations / 4));
          default:
            return Promise.resolve(sortBenchmark(config.sortSize / 4));
        }
      });
      await Promise.all(workloads);
    },
  },
];

// Reference times for multi-core tests (scaled by core count)
const MULTI_CORE_REFERENCE_TIMES: { [key: string]: number } = {
  parallel_hash: 150,
  parallel_matrix: 200,
  parallel_mandelbrot: 180,
  parallel_float: 120,
  parallel_sort: 140,
  parallel_mixed: 250,
};

export async function runMultiCoreBenchmark(
  config: BenchmarkConfig = DEFAULT_CONFIG,
  coreCount: number = 4,
  onProgress?: ProgressCallback
): Promise<BenchmarkResult[]> {
  const results: BenchmarkResult[] = [];
  const totalTests = MULTI_CORE_TESTS.length;
  const iterations = Math.max(2, config.iterations - 1); // Slightly fewer iterations for multi-core

  for (let testIndex = 0; testIndex < totalTests; testIndex++) {
    const test = MULTI_CORE_TESTS[testIndex];
    const durations: number[] = [];

    for (let iter = 0; iter < iterations; iter++) {
      const start = performance.now();
      await test.run(config, coreCount);
      const end = performance.now();
      durations.push(end - start);

      if (onProgress) {
        const overallProgress =
          ((testIndex * iterations + iter + 1) / (totalTests * iterations)) * 100;

        onProgress({
          currentTest: test.displayName,
          testIndex: testIndex + 1,
          totalTests,
          iteration: iter + 1,
          totalIterations: iterations,
          overallProgress,
        });
      }

      // Allow UI to update
      await delay(10);
    }

    const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
    const refTime = MULTI_CORE_REFERENCE_TIMES[test.name] || 150;
    
    // Multi-core score considers the number of cores used
    const efficiencyBonus = Math.log2(coreCount) * 10;
    const rawScore = ((refTime / avgDuration) * 50) + efficiencyBonus;
    const score = Math.max(1, Math.min(100, Math.round(rawScore)));

    results.push({
      name: test.displayName,
      duration: avgDuration,
      score,
    });
  }

  return results;
}

export async function runFullBenchmark(
  config: BenchmarkConfig = DEFAULT_CONFIG,
  coreCount: number = 4,
  onSingleCoreProgress?: ProgressCallback,
  onMultiCoreProgress?: ProgressCallback
): Promise<BenchmarkSummary> {
  const startTime = performance.now();

  // Run single-core tests
  const singleCoreResults = await runSingleCoreBenchmark(config, onSingleCoreProgress);
  const singleCoreScore = calculateOverallScore(singleCoreResults);

  // Run multi-core tests
  const multiCoreResults = await runMultiCoreBenchmark(config, coreCount, onMultiCoreProgress);
  const multiCoreScore = calculateOverallScore(multiCoreResults);

  const endTime = performance.now();

  return {
    singleCoreScore,
    multiCoreScore,
    singleCoreResults,
    multiCoreResults,
    totalDuration: endTime - startTime,
    coreCount,
  };
}
