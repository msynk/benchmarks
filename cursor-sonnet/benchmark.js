// CPU Benchmark Suite - Main Script

let benchmarkState = {
    running: false,
    currentTest: '',
    singleCoreResults: {},
    multiCoreResults: {},
    singleCoreScore: 0,
    multiCoreScore: 0
};

// Initialize system information
function detectSystemInfo() {
    // CPU Cores
    const cores = navigator.hardwareConcurrency || 'Unknown';
    document.getElementById('cpu-cores').textContent = cores;

    // Platform
    const platform = navigator.platform || 'Unknown';
    document.getElementById('platform').textContent = platform;

    // Browser
    const userAgent = navigator.userAgent;
    let browser = 'Unknown';
    if (userAgent.indexOf('Firefox') > -1) {
        browser = 'Firefox';
    } else if (userAgent.indexOf('Chrome') > -1) {
        browser = 'Chrome';
    } else if (userAgent.indexOf('Safari') > -1) {
        browser = 'Safari';
    } else if (userAgent.indexOf('Edge') > -1) {
        browser = 'Edge';
    }
    document.getElementById('browser').textContent = browser;

    // Memory
    if (navigator.deviceMemory) {
        document.getElementById('memory').textContent = `${navigator.deviceMemory} GB`;
    } else {
        document.getElementById('memory').textContent = 'Unknown';
    }
}

// Update UI progress
function updateProgress(percent, status) {
    const progressFill = document.getElementById('progress-fill');
    const testStatus = document.getElementById('test-status');
    
    progressFill.style.width = `${percent}%`;
    progressFill.textContent = `${Math.round(percent)}%`;
    testStatus.textContent = status;
}

// Show/hide UI elements
function setUIState(running) {
    benchmarkState.running = running;
    
    document.getElementById('start-btn').disabled = running;
    document.getElementById('single-btn').disabled = running;
    document.getElementById('multi-btn').disabled = running;
    
    const progressSection = document.getElementById('progress-section');
    if (running) {
        progressSection.classList.remove('hidden');
        progressSection.classList.add('running');
    } else {
        progressSection.classList.remove('running');
    }
}

// CPU Test Algorithms

// Test 1: Prime Number Generation (Sieve of Eratosthenes)
function testPrimeNumbers(limit = 1000000) {
    const sieve = new Array(limit + 1).fill(true);
    sieve[0] = sieve[1] = false;
    
    for (let i = 2; i * i <= limit; i++) {
        if (sieve[i]) {
            for (let j = i * i; j <= limit; j += i) {
                sieve[j] = false;
            }
        }
    }
    
    let count = 0;
    for (let i = 2; i <= limit; i++) {
        if (sieve[i]) count++;
    }
    
    return count;
}

// Test 2: Matrix Multiplication
function testMatrixMultiplication(size = 256) {
    const matrixA = Array(size).fill(0).map(() => 
        Array(size).fill(0).map(() => Math.random())
    );
    const matrixB = Array(size).fill(0).map(() => 
        Array(size).fill(0).map(() => Math.random())
    );
    const result = Array(size).fill(0).map(() => Array(size).fill(0));
    
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            let sum = 0;
            for (let k = 0; k < size; k++) {
                sum += matrixA[i][k] * matrixB[k][j];
            }
            result[i][j] = sum;
        }
    }
    
    return result[0][0];
}

// Test 3: Fibonacci (Dynamic Programming)
function testFibonacci(n = 1000000) {
    let a = 0n, b = 1n;
    for (let i = 0; i < n; i++) {
        [a, b] = [b, a + b];
    }
    return a.toString().length;
}

// Test 4: Quick Sort with random data
function testQuickSort(size = 100000) {
    const arr = Array(size).fill(0).map(() => Math.random() * 1000000);
    
    function quickSort(arr, low, high) {
        if (low < high) {
            const pi = partition(arr, low, high);
            quickSort(arr, low, pi - 1);
            quickSort(arr, pi + 1, high);
        }
    }
    
    function partition(arr, low, high) {
        const pivot = arr[high];
        let i = low - 1;
        
        for (let j = low; j < high; j++) {
            if (arr[j] < pivot) {
                i++;
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
        }
        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
        return i + 1;
    }
    
    quickSort(arr, 0, arr.length - 1);
    return arr[0];
}

// Test 5: Cryptographic Hash Simulation (SHA-256-like operations)
function testCryptoHash(iterations = 500000) {
    let hash = 0x6a09e667;
    
    for (let i = 0; i < iterations; i++) {
        // Simulate complex bit operations
        hash = ((hash << 5) - hash) + i;
        hash = hash & hash;
        hash = ((hash >>> 16) ^ hash) * 0x45d9f3b;
        hash = ((hash >>> 16) ^ hash) * 0x45d9f3b;
        hash = (hash >>> 16) ^ hash;
    }
    
    return hash >>> 0;
}

// Test 6: Floating Point Operations
function testFloatingPoint(iterations = 10000000) {
    let result = 1.0;
    const pi = Math.PI;
    const e = Math.E;
    
    for (let i = 0; i < iterations; i++) {
        result = Math.sin(result * pi) * Math.cos(result * e);
        result = Math.sqrt(Math.abs(result) + 1.0);
        result = Math.log(result + 1.0) * Math.exp(result / 100);
        result = Math.pow(Math.abs(result), 0.5);
    }
    
    return result;
}

// Test 7: String Manipulation
function testStringManipulation(iterations = 100000) {
    let text = 'The quick brown fox jumps over the lazy dog';
    let result = '';
    
    for (let i = 0; i < iterations; i++) {
        result = text.split('').reverse().join('');
        result = result.toUpperCase();
        result = result.replace(/[AEIOU]/g, '*');
        result = result.substring(0, 20) + result.substring(20);
    }
    
    return result.length;
}

// Test 8: Array Operations
function testArrayOperations(size = 50000) {
    const arr = Array(size).fill(0).map((_, i) => i);
    
    // Map
    const mapped = arr.map(x => x * 2);
    
    // Filter
    const filtered = mapped.filter(x => x % 3 === 0);
    
    // Reduce
    const sum = filtered.reduce((acc, val) => acc + val, 0);
    
    // Sort
    const sorted = [...filtered].sort((a, b) => b - a);
    
    return sum + sorted[0];
}

// Single-Core Benchmark Runner
async function runSingleCoreBenchmark() {
    const tests = [
        { name: 'Prime Numbers', fn: () => testPrimeNumbers(1000000), weight: 1.2 },
        { name: 'Matrix Multiplication', fn: () => testMatrixMultiplication(256), weight: 1.5 },
        { name: 'Fibonacci Calculation', fn: () => testFibonacci(500000), weight: 1.0 },
        { name: 'Quick Sort', fn: () => testQuickSort(100000), weight: 1.1 },
        { name: 'Cryptographic Hash', fn: () => testCryptoHash(500000), weight: 1.3 },
        { name: 'Floating Point Math', fn: () => testFloatingPoint(5000000), weight: 1.2 },
        { name: 'String Manipulation', fn: () => testStringManipulation(100000), weight: 0.9 },
        { name: 'Array Operations', fn: () => testArrayOperations(50000), weight: 1.0 }
    ];
    
    const results = {};
    let totalScore = 0;
    const startTime = performance.now();
    
    for (let i = 0; i < tests.length; i++) {
        const test = tests[i];
        updateProgress((i / tests.length) * 50, `Running Single-Core: ${test.name}...`);
        
        // Run test 3 times and take average
        let totalTime = 0;
        for (let run = 0; run < 3; run++) {
            const testStart = performance.now();
            test.fn();
            totalTime += (performance.now() - testStart);
        }
        
        const avgTime = totalTime / 3;
        const score = Math.round((10000 / avgTime) * test.weight * 100);
        
        results[test.name] = {
            time: avgTime,
            score: score
        };
        
        totalScore += score;
    }
    
    const totalTime = (performance.now() - startTime) / 1000;
    
    return {
        results,
        totalScore,
        totalTime
    };
}

// Multi-Core Benchmark Runner
async function runMultiCoreBenchmark() {
    const numWorkers = navigator.hardwareConcurrency || 4;
    const workers = [];
    const results = {};
    
    updateProgress(50, `Starting Multi-Core test with ${numWorkers} workers...`);
    
    const tests = [
        { name: 'Prime Numbers', test: 'primes', param: 1000000 },
        { name: 'Matrix Multiplication', test: 'matrix', param: 256 },
        { name: 'Fibonacci Calculation', test: 'fibonacci', param: 500000 },
        { name: 'Quick Sort', test: 'sort', param: 100000 },
        { name: 'Cryptographic Hash', test: 'crypto', param: 500000 },
        { name: 'Floating Point Math', test: 'float', param: 5000000 },
        { name: 'String Manipulation', test: 'string', param: 100000 },
        { name: 'Array Operations', test: 'array', param: 50000 }
    ];
    
    const startTime = performance.now();
    
    // Create workers
    for (let i = 0; i < numWorkers; i++) {
        workers.push(new Worker('worker.js'));
    }
    
    // Distribute tests across workers
    const promises = tests.map((test, index) => {
        return new Promise((resolve) => {
            const worker = workers[index % numWorkers];
            
            worker.onmessage = (e) => {
                results[test.name] = {
                    time: e.data.time,
                    score: e.data.score
                };
                resolve();
            };
            
            worker.postMessage({
                test: test.test,
                param: test.param
            });
        });
    });
    
    // Wait for all tests to complete
    await Promise.all(promises);
    
    // Terminate workers
    workers.forEach(worker => worker.terminate());
    
    const totalTime = (performance.now() - startTime) / 1000;
    const totalScore = Object.values(results).reduce((sum, r) => sum + r.score, 0);
    
    updateProgress(100, 'Benchmark Complete!');
    
    return {
        results,
        totalScore,
        totalTime
    };
}

// Display Results
function displayResults() {
    document.getElementById('results-card').classList.remove('hidden');
    
    // Display scores
    document.getElementById('single-score').textContent = 
        benchmarkState.singleCoreScore.toLocaleString();
    document.getElementById('single-time').textContent = 
        `${benchmarkState.singleCoreResults.totalTime.toFixed(2)}s`;
    
    document.getElementById('multi-score').textContent = 
        benchmarkState.multiCoreScore.toLocaleString();
    document.getElementById('multi-time').textContent = 
        `${benchmarkState.multiCoreResults.totalTime.toFixed(2)}s`;
    
    // Display test breakdown
    const breakdown = document.getElementById('test-breakdown');
    breakdown.innerHTML = '';
    
    const allTests = new Set([
        ...Object.keys(benchmarkState.singleCoreResults.results || {}),
        ...Object.keys(benchmarkState.multiCoreResults.results || {})
    ]);
    
    allTests.forEach(testName => {
        const singleResult = benchmarkState.singleCoreResults.results?.[testName];
        const multiResult = benchmarkState.multiCoreResults.results?.[testName];
        
        if (singleResult || multiResult) {
            const div = document.createElement('div');
            div.className = 'test-item';
            
            let html = `<div class="test-name">${testName}</div><div>`;
            
            if (singleResult) {
                html += `<div class="test-time">Single: ${singleResult.time.toFixed(2)}ms (${singleResult.score.toLocaleString()})</div>`;
            }
            if (multiResult) {
                html += `<div class="test-time">Multi: ${multiResult.time.toFixed(2)}ms (${multiResult.score.toLocaleString()})</div>`;
            }
            
            html += '</div>';
            div.innerHTML = html;
            breakdown.appendChild(div);
        }
    });
}

// Main Benchmark Functions
async function startBenchmark() {
    setUIState(true);
    updateProgress(0, 'Starting Full Benchmark...');
    
    try {
        // Run single-core tests
        const singleResults = await runSingleCoreBenchmark();
        benchmarkState.singleCoreResults = singleResults;
        benchmarkState.singleCoreScore = singleResults.totalScore;
        
        // Run multi-core tests
        const multiResults = await runMultiCoreBenchmark();
        benchmarkState.multiCoreResults = multiResults;
        benchmarkState.multiCoreScore = multiResults.totalScore;
        
        displayResults();
    } catch (error) {
        console.error('Benchmark error:', error);
        updateProgress(0, 'Error running benchmark: ' + error.message);
    } finally {
        setUIState(false);
    }
}

async function startSingleCore() {
    setUIState(true);
    updateProgress(0, 'Starting Single-Core Benchmark...');
    
    try {
        const singleResults = await runSingleCoreBenchmark();
        benchmarkState.singleCoreResults = singleResults;
        benchmarkState.singleCoreScore = singleResults.totalScore;
        
        updateProgress(100, 'Single-Core Benchmark Complete!');
        displayResults();
    } catch (error) {
        console.error('Benchmark error:', error);
        updateProgress(0, 'Error running benchmark: ' + error.message);
    } finally {
        setUIState(false);
    }
}

async function startMultiCore() {
    setUIState(true);
    updateProgress(0, 'Starting Multi-Core Benchmark...');
    
    try {
        const multiResults = await runMultiCoreBenchmark();
        benchmarkState.multiCoreResults = multiResults;
        benchmarkState.multiCoreScore = multiResults.totalScore;
        
        updateProgress(100, 'Multi-Core Benchmark Complete!');
        displayResults();
    } catch (error) {
        console.error('Benchmark error:', error);
        updateProgress(0, 'Error running benchmark: ' + error.message);
    } finally {
        setUIState(false);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    detectSystemInfo();
});

