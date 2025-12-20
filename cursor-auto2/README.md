# CPU Benchmark Suite

A comprehensive web-based CPU benchmark application that measures single-core and multi-core performance using JavaScript and Web Workers.

## Features

- **Single-Core Tests**: Measures individual core performance with 8 different intensive tests
- **Multi-Core Tests**: Utilizes Web Workers to test parallel processing capabilities
- **Real-Time Progress**: Visual progress bar and live test results
- **System Information**: Displays CPU cores, platform, and browser information
- **Comprehensive Scoring**: Calculates single-core, multi-core, and overall performance scores

## Test Categories

### Single-Core Tests
1. **Prime Number Calculation** - Tests integer arithmetic and loop performance
2. **Matrix Multiplication** - Tests floating-point operations and memory access
3. **Floating Point Operations** - Tests trigonometric and logarithmic functions
4. **Array Sorting** - Tests sorting algorithm performance
5. **String Operations** - Tests string manipulation and processing
6. **Fibonacci Calculation** - Tests recursive algorithm performance
7. **Hash Computation** - Tests bitwise operations and hashing
8. **Memory Access Patterns** - Tests sequential and random memory access

### Multi-Core Tests
All tests run in parallel across all available CPU cores using Web Workers:
- Parallel Prime Calculation
- Parallel Matrix Operations
- Parallel Floating Point
- Parallel Array Processing
- Parallel String Processing
- Parallel Hash Computation

## Usage

1. Open `index.html` in a modern web browser
2. Review the system information displayed
3. Click "Start Benchmark" to begin testing
4. Wait for all tests to complete (may take 1-3 minutes depending on your CPU)
5. View the final scores for single-core, multi-core, and overall performance

## Technical Details

- Uses Web Workers API for true multi-threading
- Automatically detects available CPU cores using `navigator.hardwareConcurrency`
- Tests are designed to be CPU-intensive and measure various aspects of processor performance
- Scores are calculated based on operations completed per test

## Browser Compatibility

Requires a modern browser with support for:
- ES6+ JavaScript
- Web Workers API
- Performance API

Tested on Chrome, Firefox, Edge, and Safari.

## Notes

- The benchmark may cause high CPU usage during testing
- Results may vary based on browser optimizations and system load
- Close other applications for more accurate results

