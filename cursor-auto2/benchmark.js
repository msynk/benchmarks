// CPU Benchmark Suite
class CPUBenchmark {
    constructor() {
        this.isRunning = false;
        this.singleCoreResults = [];
        this.multiCoreResults = [];
        this.workers = [];
        this.maxWorkers = navigator.hardwareConcurrency || 4;
        
        this.initializeUI();
        this.detectCPUInfo();
    }

    initializeUI() {
        document.getElementById('start-benchmark').addEventListener('click', () => this.startBenchmark());
        document.getElementById('stop-benchmark').addEventListener('click', () => this.stopBenchmark());
    }

    detectCPUInfo() {
        document.getElementById('cpu-cores').textContent = navigator.hardwareConcurrency || 'Unknown';
        document.getElementById('hardware-concurrency').textContent = navigator.hardwareConcurrency || 'Unknown';
        document.getElementById('user-agent').textContent = navigator.userAgent;
        document.getElementById('platform').textContent = navigator.platform || 'Unknown';
    }

    async startBenchmark() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.singleCoreResults = [];
        this.multiCoreResults = [];
        
        document.getElementById('start-benchmark').disabled = true;
        document.getElementById('stop-benchmark').disabled = false;
        document.getElementById('results-section').style.display = 'none';
        
        // Clear previous results
        document.getElementById('single-core-tests').innerHTML = '';
        document.getElementById('multi-core-tests').innerHTML = '';
        
        try {
            await this.runSingleCoreTests();
            await this.runMultiCoreTests();
            this.calculateScores();
        } catch (error) {
            console.error('Benchmark error:', error);
            this.updateProgress('Error occurred during benchmark', 0);
        } finally {
            this.isRunning = false;
            document.getElementById('start-benchmark').disabled = false;
            document.getElementById('stop-benchmark').disabled = true;
            document.getElementById('results-section').style.display = 'block';
        }
    }

    stopBenchmark() {
        this.isRunning = false;
        this.workers.forEach(worker => worker.terminate());
        this.workers = [];
        document.getElementById('start-benchmark').disabled = false;
        document.getElementById('stop-benchmark').disabled = true;
        this.updateProgress('Benchmark stopped', 0);
    }

    updateProgress(text, percentage) {
        document.getElementById('progress-text').textContent = text;
        document.getElementById('progress-bar').style.width = percentage + '%';
    }

    addTestResult(category, name, status, score = null) {
        const container = document.getElementById(category === 'single' ? 'single-core-tests' : 'multi-core-tests');
        const testItem = document.createElement('div');
        testItem.className = `test-item ${status}`;
        
        let html = `<div class="test-item-name">${name}</div>`;
        html += `<div class="test-item-status">${status === 'running' ? 'Running...' : status === 'completed' ? 'Completed' : 'Pending'}</div>`;
        // if (score !== null) {
            html += `<div class="test-item-score">Score: ${score?.toLocaleString() || 'N/A'}</div>`;
        // }
        
        testItem.innerHTML = html;
        container.appendChild(testItem);
        return testItem;
    }

    async runSingleCoreTests() {
        const tests = [
            { name: 'Prime Number Calculation', fn: () => this.testPrimeNumbers() },
            { name: 'Matrix Multiplication', fn: () => this.testMatrixMultiplication() },
            { name: 'Floating Point Operations', fn: () => this.testFloatingPoint() },
            { name: 'Array Sorting', fn: () => this.testArraySorting() },
            { name: 'String Operations', fn: () => this.testStringOperations() },
            { name: 'Fibonacci Calculation', fn: () => this.testFibonacci() },
            { name: 'Hash Computation', fn: () => this.testHashComputation() },
            { name: 'Memory Access Patterns', fn: () => this.testMemoryAccess() }
        ];

        const totalTests = tests.length;
        this.updateProgress('Running single-core tests...', 0);

        for (let i = 0; i < tests.length; i++) {
            if (!this.isRunning) break;
            
            const testItem = this.addTestResult('single', tests[i].name, 'running');
            const startTime = performance.now();
            
            try {
                const score = await tests[i].fn();
                const endTime = performance.now();
                const duration = endTime - startTime;
                
                testItem.classList.remove('running');
                testItem.classList.add('completed');
                testItem.querySelector('.test-item-score').textContent = `Score: ${score.toLocaleString()} (${duration.toFixed(2)}ms)`;
                
                this.singleCoreResults.push({ name: tests[i].name, score, duration });
            } catch (error) {
                console.error(`Test ${tests[i].name} failed:`, error);
                testItem.classList.remove('running');
                testItem.querySelector('.test-item-status').textContent = 'Failed';
            }
            
            this.updateProgress(`Running single-core tests... (${i + 1}/${totalTests})`, ((i + 1) / totalTests) * 50);
        }
    }

    async runMultiCoreTests() {
        const tests = [
            { name: 'Parallel Prime Calculation', iterations: 50000 },
            { name: 'Parallel Matrix Operations', iterations: 100 },
            { name: 'Parallel Floating Point', iterations: 1000000 },
            { name: 'Parallel Array Processing', iterations: 500000 },
            { name: 'Parallel String Processing', iterations: 100000 },
            { name: 'Parallel Hash Computation', iterations: 50000 }
        ];

        const totalTests = tests.length;
        this.updateProgress('Running multi-core tests...', 50);

        for (let i = 0; i < tests.length; i++) {
            if (!this.isRunning) break;
            
            const testItem = this.addTestResult('multi', tests[i].name, 'running');
            const startTime = performance.now();
            
            try {
                const score = await this.runParallelTest(tests[i].name, tests[i].iterations);
                const endTime = performance.now();
                const duration = endTime - startTime;
                
                testItem.classList.remove('running');
                testItem.classList.add('completed');
                testItem.querySelector('.test-item-score').textContent = `Score: ${score.toLocaleString()} (${duration.toFixed(2)}ms)`;
                
                this.multiCoreResults.push({ name: tests[i].name, score, duration });
            } catch (error) {
                console.error(`Test ${tests[i].name} failed:`, error);
                testItem.classList.remove('running');
                testItem.querySelector('.test-item-status').textContent = 'Failed';
            }
            
            this.updateProgress(`Running multi-core tests... (${i + 1}/${totalTests})`, 50 + ((i + 1) / totalTests) * 50);
        }
    }

    async runParallelTest(testName, iterations) {
        return new Promise((resolve, reject) => {
            const workers = [];
            const results = [];
            let completed = 0;
            
            for (let i = 0; i < this.maxWorkers; i++) {
                const worker = new Worker('worker.js');
                workers.push(worker);
                
                worker.postMessage({ testName, iterations });
                
                worker.onmessage = (e) => {
                    results.push(e.data.score);
                    completed++;
                    
                    if (completed === this.maxWorkers) {
                        workers.forEach(w => w.terminate());
                        const totalScore = results.reduce((a, b) => a + b, 0);
                        resolve(totalScore);
                    }
                };
                
                worker.onerror = (error) => {
                    workers.forEach(w => w.terminate());
                    reject(error);
                };
            }
        });
    }

    // Single-core test implementations
    testPrimeNumbers() {
        const limit = 100000;
        let count = 0;
        
        for (let num = 2; num <= limit; num++) {
            let isPrime = true;
            for (let i = 2; i * i <= num; i++) {
                if (num % i === 0) {
                    isPrime = false;
                    break;
                }
            }
            if (isPrime) count++;
        }
        
        return count * 1000; // Score based on primes found
    }

    testMatrixMultiplication() {
        const size = 200;
        const a = new Array(size).fill(null).map(() => new Array(size).fill(0).map(() => Math.random()));
        const b = new Array(size).fill(null).map(() => new Array(size).fill(0).map(() => Math.random()));
        const c = new Array(size).fill(null).map(() => new Array(size).fill(0));
        
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                for (let k = 0; k < size; k++) {
                    c[i][j] += a[i][k] * b[k][j];
                }
            }
        }
        
        return size * size * size; // Score based on operations
    }

    testFloatingPoint() {
        let result = 0;
        const iterations = 5000000;
        
        for (let i = 0; i < iterations; i++) {
            result += Math.sin(i) * Math.cos(i) + Math.sqrt(i) * Math.log(i + 1);
        }
        
        return iterations / 1000; // Score based on iterations
    }

    testArraySorting() {
        const arrays = [];
        for (let i = 0; i < 50; i++) {
            arrays.push(new Array(10000).fill(0).map(() => Math.random()));
        }
        
        arrays.forEach(arr => arr.sort((a, b) => a - b));
        
        return arrays.length * 10000; // Score based on elements sorted
    }

    testStringOperations() {
        let result = '';
        const iterations = 100000;
        
        for (let i = 0; i < iterations; i++) {
            const str = `TestString${i}`;
            result += str.toUpperCase().toLowerCase().split('').reverse().join('');
            result = result.substring(0, 1000); // Prevent memory issues
        }
        
        return iterations; // Score based on operations
    }

    testFibonacci() {
        const n = 40;
        
        function fib(num) {
            if (num <= 1) return num;
            return fib(num - 1) + fib(num - 2);
        }
        
        return fib(n) * 1000; // Score based on calculation
    }

    testHashComputation() {
        const iterations = 100000;
        let hash = 0;
        
        for (let i = 0; i < iterations; i++) {
            const str = `hash${i}`;
            for (let j = 0; j < str.length; j++) {
                hash = ((hash << 5) - hash) + str.charCodeAt(j);
                hash = hash & hash; // Convert to 32-bit integer
            }
        }
        
        return iterations; // Score based on iterations
    }

    testMemoryAccess() {
        const size = 1000000;
        const array = new Array(size).fill(0).map((_, i) => i);
        let sum = 0;
        
        // Sequential access
        for (let i = 0; i < size; i++) {
            sum += array[i];
        }
        
        // Random access
        for (let i = 0; i < size / 10; i++) {
            sum += array[Math.floor(Math.random() * size)];
        }
        
        return size; // Score based on memory accesses
    }

    calculateScores() {
        const singleCoreScore = this.singleCoreResults.reduce((sum, r) => sum + r.score, 0) / this.singleCoreResults.length;
        const multiCoreScore = this.multiCoreResults.reduce((sum, r) => sum + r.score, 0) / this.multiCoreResults.length;
        const overallScore = (singleCoreScore + multiCoreScore) / 2;
        
        document.getElementById('single-core-score').textContent = Math.round(singleCoreScore).toLocaleString();
        document.getElementById('multi-core-score').textContent = Math.round(multiCoreScore).toLocaleString();
        document.getElementById('overall-score').textContent = Math.round(overallScore).toLocaleString();
        
        this.updateProgress('Benchmark completed!', 100);
    }
}

// Initialize benchmark when page loads
let benchmark;
window.addEventListener('DOMContentLoaded', () => {
    benchmark = new CPUBenchmark();
});

