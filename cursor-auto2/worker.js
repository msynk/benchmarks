// Web Worker for parallel CPU benchmark tests
self.onmessage = function(e) {
    const { testName, iterations } = e.data;
    let score = 0;
    
    try {
        switch (testName) {
            case 'Parallel Prime Calculation':
                score = workerTestPrimeNumbers(iterations);
                break;
            case 'Parallel Matrix Operations':
                score = workerTestMatrixOperations(iterations);
                break;
            case 'Parallel Floating Point':
                score = workerTestFloatingPoint(iterations);
                break;
            case 'Parallel Array Processing':
                score = workerTestArrayProcessing(iterations);
                break;
            case 'Parallel String Processing':
                score = workerTestStringProcessing(iterations);
                break;
            case 'Parallel Hash Computation':
                score = workerTestHashComputation(iterations);
                break;
            default:
                score = 0;
        }
        
        self.postMessage({ score });
    } catch (error) {
        self.postMessage({ score: 0, error: error.message });
    }
};

function workerTestPrimeNumbers(iterations) {
    const limit = Math.min(iterations, 50000);
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
    
    return count * 100;
}

function workerTestMatrixOperations(iterations) {
    const size = Math.min(iterations, 150);
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
    
    return size * size * size;
}

function workerTestFloatingPoint(iterations) {
    let result = 0;
    const maxIterations = Math.min(iterations, 1000000);
    
    for (let i = 0; i < maxIterations; i++) {
        result += Math.sin(i) * Math.cos(i) + Math.sqrt(i) * Math.log(i + 1);
    }
    
    return maxIterations / 100;
}

function workerTestArrayProcessing(iterations) {
    const arrays = [];
    const numArrays = Math.min(Math.floor(iterations / 10000), 20);
    const arraySize = 5000;
    
    for (let i = 0; i < numArrays; i++) {
        arrays.push(new Array(arraySize).fill(0).map(() => Math.random()));
    }
    
    arrays.forEach(arr => {
        arr.sort((a, b) => a - b);
        arr.reverse();
        arr.map(x => x * 2);
        arr.filter(x => x > 0.5);
    });
    
    return numArrays * arraySize;
}

function workerTestStringProcessing(iterations) {
    let result = '';
    const maxIterations = Math.min(iterations, 50000);
    
    for (let i = 0; i < maxIterations; i++) {
        const str = `WorkerString${i}`;
        result += str.toUpperCase().toLowerCase().split('').reverse().join('');
        if (result.length > 5000) {
            result = result.substring(0, 5000);
        }
    }
    
    return maxIterations;
}

function workerTestHashComputation(iterations) {
    const maxIterations = Math.min(iterations, 50000);
    let hash = 0;
    
    for (let i = 0; i < maxIterations; i++) {
        const str = `hash${i}`;
        for (let j = 0; j < str.length; j++) {
            hash = ((hash << 5) - hash) + str.charCodeAt(j);
            hash = hash & hash;
        }
    }
    
    return maxIterations;
}

