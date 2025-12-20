// CPU Benchmark Application
// Tests single-core and multi-core performance using Web Workers

class CPUBenchmark {
    constructor() {
        this.elements = {
            startBtn: document.getElementById('startBtn'),
            workerCount: document.getElementById('workerCount'),
            coreCount: document.getElementById('coreCount'),
            progressSection: document.getElementById('progressSection'),
            progressFill: document.getElementById('progressFill'),
            progressText: document.getElementById('progressText'),
            singleScore: document.getElementById('singleScore'),
            multiScore: document.getElementById('multiScore'),
            singleThroughput: document.getElementById('singleThroughput'),
            singleDuration: document.getElementById('singleDuration'),
            multiThroughput: document.getElementById('multiThroughput'),
            multiDuration: document.getElementById('multiDuration'),
            multiWorkers: document.getElementById('multiWorkers'),
            log: document.getElementById('log')
        };

        this.detectedCores = navigator.hardwareConcurrency || 4;
        this.elements.coreCount.textContent = this.detectedCores;
        this.elements.workerCount.value = this.detectedCores;

        this.elements.startBtn.addEventListener('click', () => this.runBenchmark());
    }

    log(message, type = 'info') {
        const entry = document.createElement('div');
        entry.className = `log-entry ${type}`;
        entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        this.elements.log.appendChild(entry);
        this.elements.log.scrollTop = this.elements.log.scrollHeight;
        console.log(message);
    }

    updateProgress(percent, text) {
        this.elements.progressFill.style.width = `${percent}%`;
        this.elements.progressText.textContent = text;
    }

    // CPU-intensive task: Prime number calculation
    // This is a good benchmark as it's deterministic and CPU-bound
    calculatePrimes(limit) {
        const primes = [];
        const sieve = new Array(limit + 1).fill(true);
        sieve[0] = sieve[1] = false;

        for (let i = 2; i * i <= limit; i++) {
            if (sieve[i]) {
                for (let j = i * i; j <= limit; j += i) {
                    sieve[j] = false;
                }
            }
        }

        for (let i = 2; i <= limit; i++) {
            if (sieve[i]) {
                primes.push(i);
            }
        }

        return primes.length;
    }

    // CPU-intensive task: Matrix multiplication
    multiplyMatrices(size) {
        const a = new Array(size);
        const b = new Array(size);
        const c = new Array(size);

        // Initialize matrices with random values
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

        // Multiply matrices
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                let sum = 0;
                for (let k = 0; k < size; k++) {
                    sum += a[i][k] * b[k][j];
                }
                c[i][j] = sum;
            }
        }

        return c[0][0]; // Return a value to prevent optimization
    }

    // CPU-intensive task: Fibonacci calculation
    fibonacci(n) {
        if (n <= 1) return n;
        let a = 0, b = 1;
        for (let i = 2; i <= n; i++) {
            const temp = a + b;
            a = b;
            b = temp;
        }
        return b;
    }

    // Combined CPU workload for benchmarking
    runCPUTask(iterations) {
        let result = 0;
        for (let i = 0; i < iterations; i++) {
            // Mix different CPU-intensive operations
            result += this.calculatePrimes(1000 + (i % 100));
            result += this.multiplyMatrices(50);
            result += this.fibonacci(30 + (i % 20));
            
            // Additional integer arithmetic
            let hash = i;
            for (let j = 0; j < 100; j++) {
                hash = ((hash << 5) - hash) + j;
                hash = hash & hash; // Convert to 32-bit integer
            }
            result += hash;
        }
        return result;
    }

    async runSingleCoreBenchmark() {
        this.log('Starting single-core benchmark...', 'info');
        
        const warmupIterations = 1000;
        const testIterations = 10000;
        
        // Warmup
        this.log('Warming up single-core...', 'info');
        this.runCPUTask(warmupIterations);
        
        // Actual benchmark
        this.log('Running single-core test...', 'info');
        const startTime = performance.now();
        const result = this.runCPUTask(testIterations);
        const endTime = performance.now();
        
        const duration = endTime - startTime;
        const throughput = (testIterations / duration) * 1000; // iterations per second
        
        this.log(`Single-core completed: ${throughput.toFixed(2)} ops/sec`, 'success');
        
        return {
            duration,
            throughput,
            iterations: testIterations,
            result
        };
    }

    async runMultiCoreBenchmark(workerCount) {
        this.log(`Starting multi-core benchmark with ${workerCount} workers...`, 'info');
        
        const warmupIterations = 1000;
        const testIterations = 10000;
        
        // Create worker URL
        const workerScript = `
            function calculatePrimes(limit) {
                const primes = [];
                const sieve = new Array(limit + 1).fill(true);
                sieve[0] = sieve[1] = false;
                for (let i = 2; i * i <= limit; i++) {
                    if (sieve[i]) {
                        for (let j = i * i; j <= limit; j += i) {
                            sieve[j] = false;
                        }
                    }
                }
                for (let i = 2; i <= limit; i++) {
                    if (sieve[i]) primes.push(i);
                }
                return primes.length;
            }

            function multiplyMatrices(size) {
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
                        let sum = 0;
                        for (let k = 0; k < size; k++) {
                            sum += a[i][k] * b[k][j];
                        }
                        c[i][j] = sum;
                    }
                }
                return c[0][0];
            }

            function fibonacci(n) {
                if (n <= 1) return n;
                let a = 0, b = 1;
                for (let i = 2; i <= n; i++) {
                    const temp = a + b;
                    a = b;
                    b = temp;
                }
                return b;
            }

            function runCPUTask(iterations) {
                let result = 0;
                for (let i = 0; i < iterations; i++) {
                    result += calculatePrimes(1000 + (i % 100));
                    result += multiplyMatrices(50);
                    result += fibonacci(30 + (i % 20));
                    let hash = i;
                    for (let j = 0; j < 100; j++) {
                        hash = ((hash << 5) - hash) + j;
                        hash = hash & hash;
                    }
                    result += hash;
                }
                return result;
            }

            self.onmessage = function(e) {
                const { warmupIterations, testIterations } = e.data;
                
                // Warmup
                runCPUTask(warmupIterations);
                
                // Benchmark
                const startTime = performance.now();
                const result = runCPUTask(testIterations);
                const endTime = performance.now();
                
                const duration = endTime - startTime;
                const throughput = (testIterations / duration) * 1000;
                
                self.postMessage({
                    duration,
                    throughput,
                    iterations: testIterations,
                    result
                });
            };
        `;
        
        const blob = new Blob([workerScript], { type: 'application/javascript' });
        const workerUrl = URL.createObjectURL(blob);
        
        const workers = [];
        const promises = [];
        
        // Create workers
        for (let i = 0; i < workerCount; i++) {
            const worker = new Worker(workerUrl);
            workers.push(worker);
            
            const promise = new Promise((resolve, reject) => {
                worker.onmessage = (e) => resolve(e.data);
                worker.onerror = (e) => reject(e);
            });
            
            promises.push(promise);
        }
        
        // Warmup
        this.log('Warming up workers...', 'info');
        for (const worker of workers) {
            worker.postMessage({ warmupIterations, testIterations: warmupIterations });
        }
        await Promise.all(promises.map((p, i) => 
            new Promise((resolve) => {
                workers[i].onmessage = () => resolve();
            })
        ));
        
        // Reset promises for actual benchmark
        const benchmarkPromises = workers.map((worker, i) => 
            new Promise((resolve, reject) => {
                worker.onmessage = (e) => resolve(e.data);
                worker.onerror = (e) => reject(e);
            })
        );
        
        // Run benchmark
        this.log('Running multi-core test...', 'info');
        const startTime = performance.now();
        
        for (const worker of workers) {
            worker.postMessage({ warmupIterations: 0, testIterations });
        }
        
        const results = await Promise.all(benchmarkPromises);
        const endTime = performance.now();
        
        // Cleanup
        for (const worker of workers) {
            worker.terminate();
        }
        URL.revokeObjectURL(workerUrl);
        
        const totalDuration = endTime - startTime;
        const totalThroughput = results.reduce((sum, r) => sum + r.throughput, 0);
        const avgDuration = results.reduce((sum, r) => sum + r.duration, 0) / results.length;
        
        this.log(`Multi-core completed: ${totalThroughput.toFixed(2)} ops/sec (${workerCount} workers)`, 'success');
        
        return {
            duration: totalDuration,
            avgDuration,
            throughput: totalThroughput,
            iterations: testIterations * workerCount,
            workers: workerCount,
            perWorker: results
        };
    }

    calculateScore(throughput, referenceThroughput = 100000) {
        // Score is normalized to reference throughput
        // Higher throughput = higher score
        return Math.round((throughput / referenceThroughput) * 1000);
    }

    formatNumber(num) {
        if (num === null || num === undefined || isNaN(num)) return '—';
        if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(2) + 'K';
        return num.toFixed(2);
    }

    formatDuration(ms) {
        if (ms === null || ms === undefined || isNaN(ms)) return '—';
        if (ms >= 1000) return (ms / 1000).toFixed(2) + 's';
        return ms.toFixed(2) + 'ms';
    }

    async runBenchmark() {
        this.elements.startBtn.disabled = true;
        this.elements.progressSection.style.display = 'block';
        this.elements.log.innerHTML = '';
        
        // Reset scores
        this.elements.singleScore.textContent = '—';
        this.elements.multiScore.textContent = '—';
        this.elements.singleThroughput.textContent = '—';
        this.elements.singleDuration.textContent = '—';
        this.elements.multiThroughput.textContent = '—';
        this.elements.multiDuration.textContent = '—';
        this.elements.multiWorkers.textContent = '—';
        
        try {
            const workerCount = Math.max(1, Math.min(32, parseInt(this.elements.workerCount.value) || this.detectedCores));
            
            // Single-core benchmark
            this.updateProgress(10, 'Running single-core benchmark...');
            const singleResult = await this.runSingleCoreBenchmark();
            
            const singleScore = this.calculateScore(singleResult.throughput);
            this.elements.singleScore.textContent = singleScore.toLocaleString();
            this.elements.singleThroughput.textContent = this.formatNumber(singleResult.throughput) + ' ops/sec';
            this.elements.singleDuration.textContent = this.formatDuration(singleResult.duration);
            
            this.updateProgress(50, 'Single-core complete. Running multi-core benchmark...');
            
            // Small delay to show progress
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Multi-core benchmark
            const multiResult = await this.runMultiCoreBenchmark(workerCount);
            
            const multiScore = this.calculateScore(multiResult.throughput);
            this.elements.multiScore.textContent = multiScore.toLocaleString();
            this.elements.multiThroughput.textContent = this.formatNumber(multiResult.throughput) + ' ops/sec';
            this.elements.multiDuration.textContent = this.formatDuration(multiResult.duration);
            this.elements.multiWorkers.textContent = workerCount.toString();
            
            this.updateProgress(100, 'Benchmark complete!');
            
            // Final summary
            this.log('=== Benchmark Results ===', 'success');
            this.log(`Single-core score: ${singleScore.toLocaleString()}`, 'success');
            this.log(`Multi-core score: ${multiScore.toLocaleString()}`, 'success');
            this.log(`Speedup: ${(multiResult.throughput / singleResult.throughput).toFixed(2)}x`, 'success');
            
        } catch (error) {
            this.log(`Error: ${error.message}`, 'error');
            console.error(error);
            this.updateProgress(0, 'Benchmark failed');
        } finally {
            this.elements.startBtn.disabled = false;
            setTimeout(() => {
                this.elements.progressSection.style.display = 'none';
            }, 2000);
        }
    }
}

// Initialize benchmark when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new CPUBenchmark();
});

