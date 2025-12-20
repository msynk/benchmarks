// Web Worker for Multi-Core Benchmark Tests

// Test 1: Prime Number Generation (Sieve of Eratosthenes)
function testPrimeNumbers(limit) {
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
function testMatrixMultiplication(size) {
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
function testFibonacci(n) {
    let a = 0n, b = 1n;
    for (let i = 0; i < n; i++) {
        [a, b] = [b, a + b];
    }
    return a.toString().length;
}

// Test 4: Quick Sort with random data
function testQuickSort(size) {
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

// Test 5: Cryptographic Hash Simulation
function testCryptoHash(iterations) {
    let hash = 0x6a09e667;
    
    for (let i = 0; i < iterations; i++) {
        hash = ((hash << 5) - hash) + i;
        hash = hash & hash;
        hash = ((hash >>> 16) ^ hash) * 0x45d9f3b;
        hash = ((hash >>> 16) ^ hash) * 0x45d9f3b;
        hash = (hash >>> 16) ^ hash;
    }
    
    return hash >>> 0;
}

// Test 6: Floating Point Operations
function testFloatingPoint(iterations) {
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
function testStringManipulation(iterations) {
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
function testArrayOperations(size) {
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

// Test weights for scoring
const testWeights = {
    'primes': 1.2,
    'matrix': 1.5,
    'fibonacci': 1.0,
    'sort': 1.1,
    'crypto': 1.3,
    'float': 1.2,
    'string': 0.9,
    'array': 1.0
};

// Message handler
self.onmessage = function(e) {
    const { test, param } = e.data;
    let testFunction;
    
    switch(test) {
        case 'primes':
            testFunction = () => testPrimeNumbers(param);
            break;
        case 'matrix':
            testFunction = () => testMatrixMultiplication(param);
            break;
        case 'fibonacci':
            testFunction = () => testFibonacci(param);
            break;
        case 'sort':
            testFunction = () => testQuickSort(param);
            break;
        case 'crypto':
            testFunction = () => testCryptoHash(param);
            break;
        case 'float':
            testFunction = () => testFloatingPoint(param);
            break;
        case 'string':
            testFunction = () => testStringManipulation(param);
            break;
        case 'array':
            testFunction = () => testArrayOperations(param);
            break;
        default:
            self.postMessage({ error: 'Unknown test' });
            return;
    }
    
    // Run test 3 times and take average
    let totalTime = 0;
    for (let run = 0; run < 3; run++) {
        const startTime = performance.now();
        testFunction();
        totalTime += (performance.now() - startTime);
    }
    
    const avgTime = totalTime / 3;
    const weight = testWeights[test] || 1.0;
    const score = Math.round((10000 / avgTime) * weight * 100);
    
    self.postMessage({
        time: avgTime,
        score: score
    });
};

