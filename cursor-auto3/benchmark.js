// Embedded Web Worker code
const WORKER_CODE = `
self.onmessage = function(e) {
    const { type, testRuns, config, workerId } = e.data;

    if (type === 'start-single-core') {
        runSingleCoreBenchmarks(testRuns, config);
    } else if (type === 'start-multi-core') {
        runMultiCoreBenchmarks(testRuns, config, workerId);
    }
};

function runSingleCoreBenchmarks(testRuns, config) {
    const testNames = Object.keys(config);
    
    testNames.forEach(testName => {
        const testConfig = config[testName];
        
        for (let run = 0; run < testRuns; run++) {
            const startTime = performance.now();
            runTest(testName, testConfig);
            const endTime = performance.now();
            const duration = endTime - startTime;
            
            self.postMessage({
                type: 'test-complete',
                testName: testName,
                result: duration
            });
        }
    });
    
    self.postMessage({ type: 'single-core-complete' });
}

function runMultiCoreBenchmarks(testRuns, config, workerId) {
    const testNames = Object.keys(config);
    
    testNames.forEach(testName => {
        const testConfig = config[testName];
        
        for (let run = 0; run < testRuns; run++) {
            const startTime = performance.now();
            runTest(testName, testConfig);
            const endTime = performance.now();
            const duration = endTime - startTime;
            
            self.postMessage({
                type: 'test-complete',
                testName: testName,
                result: duration,
                workerId: workerId
            });
        }
    });
    
    self.postMessage({ 
        type: 'multi-core-complete',
        workerId: workerId 
    });
}

function runTest(testName, config) {
    switch (testName) {
        case 'Integer Arithmetic':
            integerArithmeticTest(config.iterations);
            break;
        case 'Floating Point':
            floatingPointTest(config.iterations);
            break;
        case 'Memory Operations':
            memoryOperationsTest(config.iterations);
            break;
        case 'Array Operations':
            arrayOperationsTest(config.iterations);
            break;
        case 'String Operations':
            stringOperationsTest(config.iterations);
            break;
        case 'Prime Calculation':
            primeCalculationTest(config.iterations);
            break;
        case 'Matrix Multiplication':
            matrixMultiplicationTest(config.size);
            break;
        case 'Sorting':
            sortingTest(config.arraySize);
            break;
        case 'Hash Operations':
            hashOperationsTest(config.iterations);
            break;
        case 'Recursive Fibonacci':
            recursiveFibonacciTest(config.n);
            break;
    }
}

function integerArithmeticTest(iterations) {
    let result = 0;
    for (let i = 0; i < iterations; i++) {
        result = ((result + i) * 3 - 5) % 1000;
        result = result ^ (i * 7);
        result = result << 1;
        result = result >> 1;
    }
    return result;
}

function floatingPointTest(iterations) {
    let result = 0.0;
    for (let i = 0; i < iterations; i++) {
        result = Math.sin(result) + Math.cos(i);
        result = Math.sqrt(Math.abs(result));
        result = Math.pow(result, 1.5);
        result = Math.log(Math.abs(result) + 1);
    }
    return result;
}

function memoryOperationsTest(iterations) {
    const array = new Array(10000);
    for (let i = 0; i < iterations; i++) {
        const index = i % 10000;
        array[index] = i;
        const value = array[index];
        array[index] = value * 2;
    }
    return array[0];
}

function arrayOperationsTest(iterations) {
    const array = new Array(1000);
    for (let i = 0; i < 1000; i++) {
        array[i] = i;
    }
    for (let i = 0; i < iterations; i++) {
        const index = i % 1000;
        array[index] = array[index] * 2;
        if (i % 100 === 0) {
            array[index] = i;
        }
    }
    return array.length;
}

function stringOperationsTest(iterations) {
    let str = '';
    for (let i = 0; i < iterations; i++) {
        str += 't' + i;
        if (str.length > 3000) {
            str = str.substring(0, 1500);
        }
        if (i % 20 === 0) {
            str = str.replace(/t/g, 'T');
            str = str.toUpperCase().toLowerCase();
        }
    }
    return str.length;
}

function primeCalculationTest(iterations) {
    let primeCount = 0;
    for (let num = 2; num < iterations; num++) {
        let isPrime = true;
        for (let i = 2; i * i <= num; i++) {
            if (num % i === 0) {
                isPrime = false;
                break;
            }
        }
        if (isPrime) primeCount++;
    }
    return primeCount;
}

function matrixMultiplicationTest(size) {
    const a = new Array(size);
    const b = new Array(size);
    const c = new Array(size);
    
    for (let i = 0; i < size; i++) {
        a[i] = new Array(size);
        b[i] = new Array(size);
        c[i] = new Array(size);
        for (let j = 0; j < size; j++) {
            a[i][j] = Math.random();
            b[i][j] = Math.random();
            c[i][j] = 0;
        }
    }
    
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            for (let k = 0; k < size; k++) {
                c[i][j] += a[i][k] * b[k][j];
            }
        }
    }
    
    return c[0][0];
}

function sortingTest(arraySize) {
    const arrays = [];
    for (let i = 0; i < 10; i++) {
        const arr = new Array(arraySize);
        for (let j = 0; j < arraySize; j++) {
            arr[j] = Math.random() * 1000000;
        }
        arrays.push(arr);
    }
    
    arrays.forEach(arr => {
        arr.sort((a, b) => a - b);
        arr.reverse();
        arr.sort((a, b) => b - a);
    });
    
    return arrays[0][0];
}

function hashOperationsTest(iterations) {
    const map = new Map();
    for (let i = 0; i < iterations; i++) {
        const key = 'key' + (i % 1000);
        map.set(key, i);
        const value = map.get(key);
        map.set(key, value * 2);
        if (i % 100 === 0) {
            map.delete(key);
        }
    }
    return map.size;
}

function recursiveFibonacciTest(n) {
    function fib(num) {
        if (num <= 1) return num;
        return fib(num - 1) + fib(num - 2);
    }
    return fib(n);
}
`;

// Helper function to create a worker from embedded code
function createWorker() {
    const blob = new Blob([WORKER_CODE], { type: 'application/javascript' });
    return new Worker(URL.createObjectURL(blob));
}

// Main benchmark orchestrator
class CPUBenchmark {
    constructor() {
        this.singleCoreResults = {};
        this.multiCoreResults = {};
        this.testRuns = 10; // Run each test 10 times
        this.initializeCPUInfo();
    }

    initializeCPUInfo() {
        document.getElementById('cpuCores').textContent = navigator.hardwareConcurrency || 'Unknown';
        document.getElementById('hardwareConcurrency').textContent = navigator.hardwareConcurrency || 'Unknown';
        document.getElementById('platform').textContent = navigator.platform || 'Unknown';
    }

    async startBenchmark() {
        const btn = document.getElementById('startBenchmark');
        btn.disabled = true;
        btn.textContent = 'Running...';

        document.getElementById('status').textContent = 'Starting benchmark...';
        document.getElementById('progressSection').classList.remove('hidden');
        document.getElementById('results').classList.add('hidden');
        document.getElementById('scoreSection').classList.add('hidden');

        try {
            // Run single-core benchmark
            await this.runSingleCoreBenchmark();
            
            // Run multi-core benchmark
            await this.runMultiCoreBenchmark();
            
            // Calculate and display scores
            this.calculateAndDisplayScores();
            
            document.getElementById('status').textContent = 'Benchmark completed!';
            document.getElementById('progressSection').classList.add('hidden');
        } catch (error) {
            console.error('Benchmark error:', error);
            document.getElementById('status').textContent = 'Error: ' + error.message;
        } finally {
            btn.disabled = false;
            btn.textContent = 'Start Benchmark';
        }
    }

    async runSingleCoreBenchmark() {
        const worker = createWorker();
        const totalTests = Object.keys(this.getTestConfig()).length;
        let completedTests = 0;

        return new Promise((resolve, reject) => {
            worker.onmessage = (e) => {
                const { type, testName, result, progress } = e.data;
                
                if (type === 'test-complete') {
                    if (!this.singleCoreResults[testName]) {
                        this.singleCoreResults[testName] = [];
                    }
                    this.singleCoreResults[testName].push(result);
                    
                    completedTests++;
                    const overallProgress = (completedTests / (totalTests * this.testRuns)) * 50; // First 50% for single-core
                    this.updateProgress(overallProgress, `Single-core: ${testName} (${completedTests}/${totalTests * this.testRuns})`);
                } else if (type === 'single-core-complete') {
                    worker.terminate();
                    resolve();
                } else if (type === 'error') {
                    worker.terminate();
                    reject(new Error(e.data.message));
                }
            };

            worker.onerror = (error) => {
                worker.terminate();
                reject(error);
            };

            worker.postMessage({
                type: 'start-single-core',
                testRuns: this.testRuns,
                config: this.getTestConfig()
            });
        });
    }

    async runMultiCoreBenchmark() {
        const cores = navigator.hardwareConcurrency || 4;
        const workers = [];
        const totalTests = Object.keys(this.getTestConfig()).length;
        let completedTests = 0;
        const resultsPerWorker = {};
        let completedWorkers = 0;

        return new Promise((resolve, reject) => {
            // Create workers for multi-core testing
            for (let i = 0; i < cores; i++) {
                const worker = createWorker();
                workers.push(worker);
                resultsPerWorker[i] = {};

                worker.onmessage = (e) => {
                    const { type, testName, result, workerId } = e.data;
                    
                    if (type === 'test-complete') {
                        if (!resultsPerWorker[workerId][testName]) {
                            resultsPerWorker[workerId][testName] = [];
                        }
                        resultsPerWorker[workerId][testName].push(result);
                        
                        completedTests++;
                        const totalMultiCoreTests = totalTests * this.testRuns * cores;
                        const overallProgress = 50 + (completedTests / totalMultiCoreTests) * 50;
                        this.updateProgress(overallProgress, `Multi-core: ${testName} (${completedTests}/${totalMultiCoreTests})`);
                    } else if (type === 'multi-core-complete') {
                        completedWorkers++;
                        if (completedWorkers === cores) {
                            // Aggregate results from all workers
                            this.aggregateMultiCoreResults(resultsPerWorker);
                            workers.forEach(w => w.terminate());
                            resolve();
                        }
                    } else if (type === 'error') {
                        workers.forEach(w => w.terminate());
                        reject(new Error(e.data.message));
                    }
                };

                worker.onerror = (error) => {
                    workers.forEach(w => w.terminate());
                    reject(error);
                };
            }

            // Start all workers
            workers.forEach((worker, index) => {
                worker.postMessage({
                    type: 'start-multi-core',
                    testRuns: this.testRuns,
                    config: this.getTestConfig(),
                    workerId: index
                });
            });
        });
    }

    aggregateMultiCoreResults(resultsPerWorker) {
        // Aggregate results from all workers
        const allTestNames = new Set();
        Object.values(resultsPerWorker).forEach(workerResults => {
            Object.keys(workerResults).forEach(testName => allTestNames.add(testName));
        });

        allTestNames.forEach(testName => {
            const allResults = [];
            Object.values(resultsPerWorker).forEach(workerResults => {
                if (workerResults[testName]) {
                    allResults.push(...workerResults[testName]);
                }
            });
            
            if (allResults.length > 0) {
                this.multiCoreResults[testName] = allResults;
            }
        });
    }

    getTestConfig() {
        return {
            'Integer Arithmetic': { iterations: 50000000 },
            'Floating Point': { iterations: 5000000 },
            'Memory Operations': { iterations: 100000000 },
            'Array Operations': { iterations: 100000000 },
            'String Operations': { iterations: 300000 },
            'Prime Calculation': { iterations: 1500000 },
            'Matrix Multiplication': { size: 300 },
            'Sorting': { arraySize: 50000 },
            'Hash Operations': { iterations: 3000000 },
            'Recursive Fibonacci': { n: 35 }
        };
    }

    updateProgress(percentage, text) {
        const progressBar = document.getElementById('progressBar');
        const progressText = document.getElementById('progressText');
        progressBar.style.width = percentage + '%';
        progressBar.textContent = Math.round(percentage) + '%';
        progressText.textContent = text;
    }

    calculateAndDisplayScores() {
        // Calculate average times for each test
        const singleCoreAverages = this.calculateAverages(this.singleCoreResults);
        const multiCoreAverages = this.calculateAverages(this.multiCoreResults);

        // Display results
        this.displayResults('singleCoreResults', singleCoreAverages);
        this.displayResults('multiCoreResults', multiCoreAverages);

        // Calculate and display scores (scaled to be under 100)
        const singleCoreScore = this.calculateScore(singleCoreAverages);
        const multiCoreScore = this.calculateScore(multiCoreAverages);

        document.getElementById('singleCoreScore').textContent = singleCoreScore.toFixed(2);
        document.getElementById('multiCoreScore').textContent = multiCoreScore.toFixed(2);

        document.getElementById('results').classList.remove('hidden');
        document.getElementById('scoreSection').classList.remove('hidden');
    }

    calculateAverages(results) {
        const averages = {};
        Object.keys(results).forEach(testName => {
            const testResults = results[testName];
            const sum = testResults.reduce((a, b) => a + b, 0);
            averages[testName] = sum / testResults.length;
        });
        return averages;
    }

    displayResults(containerId, averages) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';

        Object.keys(averages).forEach(testName => {
            const item = document.createElement('div');
            item.className = 'test-item';
            item.innerHTML = `
                <span class="test-name">${testName}</span>
                <span class="test-value">${averages[testName].toFixed(2)}ms</span>
            `;
            container.appendChild(item);
        });
    }

    calculateScore(averages) {
        // Calculate a score based on performance
        // Lower times = better performance = higher score
        // Scale to be under 100
        
        const totalTime = Object.values(averages).reduce((a, b) => a + b, 0);
        // Use a reference time (e.g., 10000ms total) as baseline
        // Score = (reference / actual) * scaling_factor
        const referenceTime = 5000; // Baseline reference
        const rawScore = (referenceTime / totalTime) * 10;
        
        // Scale to be under 100
        // return Math.min(rawScore, 99.99);
        return rawScore;
    }
}

// Initialize benchmark when page loads
document.addEventListener('DOMContentLoaded', () => {
    const benchmark = new CPUBenchmark();
    document.getElementById('startBenchmark').addEventListener('click', () => {
        benchmark.startBenchmark();
    });
});

