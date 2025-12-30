import 'dart:async';
import 'dart:isolate';
import 'dart:math';

class BenchmarkResult {
  final double score;
  final double operationsPerSecond;
  final Duration duration;
  final String testName;

  BenchmarkResult({
    required this.score,
    required this.operationsPerSecond,
    required this.duration,
    required this.testName,
  });
}

class BenchmarkService {
  // CPU-intensive calculation: Prime number generation
  static int _calculatePrimes(int limit) {
    if (limit < 2) return 0;
    int count = 0;
    for (int i = 2; i <= limit; i++) {
      bool isPrime = true;
      for (int j = 2; j * j <= i; j++) {
        if (i % j == 0) {
          isPrime = false;
          break;
        }
      }
      if (isPrime) count++;
    }
    return count;
  }

  // CPU-intensive calculation: Matrix multiplication
  static double _matrixMultiplication(int size) {
    final random = Random(42);
    final matrixA = List.generate(size, (_) => List.generate(size, (_) => random.nextDouble()));
    final matrixB = List.generate(size, (_) => List.generate(size, (_) => random.nextDouble()));
    final result = List.generate(size, (_) => List.generate(size, (_) => 0.0));

    for (int i = 0; i < size; i++) {
      for (int j = 0; j < size; j++) {
        double sum = 0.0;
        for (int k = 0; k < size; k++) {
          sum += matrixA[i][k] * matrixB[k][j];
        }
        result[i][j] = sum;
      }
    }

    // Return sum to prevent optimization
    return result.fold(0.0, (sum, row) => sum + row.fold(0.0, (s, val) => s + val));
  }

  // CPU-intensive calculation: Fibonacci with memoization
  static int _fibonacci(int n) {
    if (n <= 1) return n;
    int a = 0, b = 1;
    for (int i = 2; i <= n; i++) {
      int temp = a + b;
      a = b;
      b = temp;
    }
    return b;
  }

  // CPU-intensive calculation: Mandelbrot set calculation
  static int _mandelbrot(double real, double imag, int maxIterations) {
    double zReal = 0.0;
    double zImag = 0.0;
    for (int i = 0; i < maxIterations; i++) {
      if (zReal * zReal + zImag * zImag > 4.0) {
        return i;
      }
      double temp = zReal * zReal - zImag * zImag + real;
      zImag = 2.0 * zReal * zImag + imag;
      zReal = temp;
    }
    return maxIterations;
  }

  // CPU-intensive calculation: Fast Fourier Transform simulation
  static double _fftSimulation(int size) {
    final random = Random(42);
    final real = List.generate(size, (_) => random.nextDouble());
    final imag = List.generate(size, (_) => random.nextDouble());
    
    // Simplified FFT-like computation
    for (int i = 0; i < size; i++) {
      double sumReal = 0.0;
      double sumImag = 0.0;
      for (int j = 0; j < size; j++) {
        final angle = 2.0 * pi * i * j / size;
        sumReal += real[j] * cos(angle) + imag[j] * sin(angle);
        sumImag += imag[j] * cos(angle) - real[j] * sin(angle);
      }
      real[i] = sumReal;
      imag[i] = sumImag;
    }
    
    return real.fold(0.0, (sum, val) => sum + val) + 
           imag.fold(0.0, (sum, val) => sum + val);
  }

  // CPU-intensive calculation: Sorting large arrays
  static double _sortingBenchmark(int size) {
    final random = Random(42);
    final list1 = List.generate(size, (_) => random.nextInt(1000000));
    final list2 = List.generate(size, (_) => random.nextDouble());
    
    list1.sort();
    list2.sort();
    
    return list1.fold(0, (sum, val) => sum + val).toDouble() + 
           list2.fold(0.0, (sum, val) => sum + val);
  }

  // CPU-intensive calculation: String processing and hashing
  static int _stringProcessing(int iterations) {
    int hash = 0;
    for (int i = 0; i < iterations; i++) {
      final str = 'benchmark_test_$i';
      for (int j = 0; j < str.length; j++) {
        hash = ((hash << 5) - hash) + str.codeUnitAt(j);
        hash = hash & hash; // Convert to 32-bit integer
      }
      // Additional string operations
      final reversed = str.split('').reversed.join();
      hash += reversed.length;
    }
    return hash;
  }

  // CPU-intensive calculation: Numerical integration
  static double _numericalIntegration(int steps) {
    double sum = 0.0;
    final stepSize = 1.0 / steps;
    for (int i = 0; i < steps; i++) {
      final x = i * stepSize;
      // Integrate sin(x) * cos(x) from 0 to 1
      sum += sin(x) * cos(x) * stepSize;
    }
    return sum;
  }

  // CPU-intensive calculation: Graph traversal simulation
  static int _graphTraversal(int nodes) {
    final random = Random(42);
    final visited = List<bool>.filled(nodes, false);
    int visitCount = 0;
    
    // Simulate BFS-like traversal
    final queue = <int>[0];
    visited[0] = true;
    
    while (queue.isNotEmpty && visitCount < nodes) {
      final current = queue.removeAt(0);
      visitCount++;
      
      // Generate random neighbors
      for (int i = 0; i < 3 && visitCount < nodes; i++) {
        final neighbor = random.nextInt(nodes);
        if (!visited[neighbor]) {
          visited[neighbor] = true;
          queue.add(neighbor);
        }
      }
    }
    
    return visitCount;
  }

  // CPU-intensive calculation: Cryptography simulation (SHA-like)
  static int _cryptoHash(int iterations) {
    int hash = 0x5A827999;
    for (int i = 0; i < iterations; i++) {
      hash = ((hash << 1) | (hash >> 31)) ^ i;
      hash = (hash + (hash << 5)) & 0xFFFFFFFF;
      hash = hash ^ (hash >> 11);
      hash = (hash + (hash << 7)) & 0xFFFFFFFF;
    }
    return hash;
  }

  // Combined CPU workload
  static double _runCpuWorkload(int iterations) {
    double total = 0.0;
    final random = Random(42);

    for (int i = 0; i < iterations; i++) {
      // Mix different types of calculations
      total += _calculatePrimes(1000 + (i % 100));
      total += _matrixMultiplication(20 + (i % 10));
      total += _fibonacci(30 + (i % 20));
      total += _mandelbrot(
        -2.0 + random.nextDouble() * 2.0,
        -2.0 + random.nextDouble() * 2.0,
        100,
      );
    }

    return total;
  }

  // Single-core benchmark worker
  static Future<void> _singleCoreWorker(List<dynamic> args) async {
    final sendPort = args[0] as SendPort;
    final receivePort = ReceivePort();
    sendPort.send(receivePort.sendPort);

    await for (final message in receivePort) {
      if (message == 'start') {
        final stopwatch = Stopwatch()..start();
        double totalOperations = 0;
        int completedTests = 0;

        // Define test suites: each test will run 50 times for intensive testing
        const int runsPerTest = 50;
        const int testSuiteRepeats = 2; // Run each test suite multiple times
        final testSuites = [
      {
        'name': 'Prime Calculation',
        'run': () {
          double result = 0;
          // Run multiple passes for more intensity
          for (int pass = 0; pass < testSuiteRepeats; pass++) {
            for (int i = 0; i < runsPerTest; i++) {
              result += _calculatePrimes(5000 + (i * 500));
            }
          }
          return result;
        },
        'ops': runsPerTest * testSuiteRepeats,
      },
      {
        'name': 'Matrix Multiplication',
        'run': () {
          double result = 0;
          for (int pass = 0; pass < testSuiteRepeats; pass++) {
            for (int i = 0; i < runsPerTest; i++) {
              result += _matrixMultiplication(80 + (i % 30));
            }
          }
          return result;
        },
        'ops': runsPerTest * testSuiteRepeats,
      },
      {
        'name': 'Fibonacci Sequence',
        'run': () {
          int result = 0;
          for (int pass = 0; pass < testSuiteRepeats; pass++) {
            for (int i = 0; i < runsPerTest; i++) {
              result += _fibonacci(60 + (i % 40));
            }
          }
          return result.toDouble();
        },
        'ops': runsPerTest * testSuiteRepeats,
      },
      {
        'name': 'Mandelbrot Set',
        'run': () {
          final random = Random(42);
          int result = 0;
          for (int pass = 0; pass < testSuiteRepeats; pass++) {
            for (int i = 0; i < runsPerTest; i++) {
              result += _mandelbrot(
                -2.0 + random.nextDouble() * 2.0,
                -2.0 + random.nextDouble() * 2.0,
                400,
              );
            }
          }
          return result.toDouble();
        },
        'ops': runsPerTest * testSuiteRepeats,
      },
      {
        'name': 'FFT Simulation',
        'run': () {
          double result = 0;
          for (int pass = 0; pass < testSuiteRepeats; pass++) {
            for (int i = 0; i < runsPerTest; i++) {
              result += _fftSimulation(256 + (i % 64));
            }
          }
          return result;
        },
        'ops': runsPerTest * testSuiteRepeats,
      },
      {
        'name': 'Sorting Algorithms',
        'run': () {
          double result = 0;
          for (int pass = 0; pass < testSuiteRepeats; pass++) {
            for (int i = 0; i < runsPerTest; i++) {
              result += _sortingBenchmark(20000 + (i * 2000));
            }
          }
          return result;
        },
        'ops': runsPerTest * testSuiteRepeats,
      },
      {
        'name': 'String Processing',
        'run': () {
          int result = 0;
          for (int pass = 0; pass < testSuiteRepeats; pass++) {
            for (int i = 0; i < runsPerTest; i++) {
              result += _stringProcessing(5000 + (i * 500));
            }
          }
          return result.toDouble();
        },
        'ops': runsPerTest * testSuiteRepeats,
      },
      {
        'name': 'Numerical Integration',
        'run': () {
          double result = 0;
          for (int pass = 0; pass < testSuiteRepeats; pass++) {
            for (int i = 0; i < runsPerTest; i++) {
              result += _numericalIntegration(50000 + (i * 5000));
            }
          }
          return result;
        },
        'ops': runsPerTest * testSuiteRepeats,
      },
      {
        'name': 'Graph Traversal',
        'run': () {
          int result = 0;
          for (int pass = 0; pass < testSuiteRepeats; pass++) {
            for (int i = 0; i < runsPerTest; i++) {
              result += _graphTraversal(2000 + (i * 200));
            }
          }
          return result.toDouble();
        },
        'ops': runsPerTest * testSuiteRepeats,
      },
      {
        'name': 'Cryptographic Hash',
        'run': () {
          int result = 0;
          for (int pass = 0; pass < testSuiteRepeats; pass++) {
            for (int i = 0; i < runsPerTest; i++) {
              result += _cryptoHash(20000 + (i * 2000));
            }
          }
          return result.toDouble();
        },
        'ops': runsPerTest * testSuiteRepeats,
      },
    ];

        final totalTests = testSuites.length;
        final totalRuns = totalTests * runsPerTest * testSuiteRepeats;
        int completedRuns = 0;
        
        // Run each test suite with progress updates during execution
        for (int testIndex = 0; testIndex < testSuites.length; testIndex++) {
          final testSuite = testSuites[testIndex];
          final testName = testSuite['name'] as String;
          
          // Run the test with progress updates
          for (int pass = 0; pass < testSuiteRepeats; pass++) {
            for (int run = 0; run < runsPerTest; run++) {
              // Execute one iteration of the test
              if (testName == 'Prime Calculation') {
                _calculatePrimes(5000 + (run * 500));
              } else if (testName == 'Matrix Multiplication') {
                _matrixMultiplication(80 + (run % 30));
              } else if (testName == 'Fibonacci Sequence') {
                _fibonacci(60 + (run % 40));
              } else if (testName == 'Mandelbrot Set') {
                final random = Random(42);
                _mandelbrot(
                  -2.0 + random.nextDouble() * 2.0,
                  -2.0 + random.nextDouble() * 2.0,
                  400,
                );
              } else if (testName == 'FFT Simulation') {
                _fftSimulation(256 + (run % 64));
              } else if (testName == 'Sorting Algorithms') {
                _sortingBenchmark(20000 + (run * 2000));
              } else if (testName == 'String Processing') {
                _stringProcessing(5000 + (run * 500));
              } else if (testName == 'Numerical Integration') {
                _numericalIntegration(50000 + (run * 5000));
              } else if (testName == 'Graph Traversal') {
                _graphTraversal(2000 + (run * 200));
              } else if (testName == 'Cryptographic Hash') {
                _cryptoHash(20000 + (run * 2000));
              }
              
              completedRuns++;
              totalOperations++;
              
              // Send progress update every few runs for smooth progress
              if (completedRuns % 5 == 0 || completedRuns == totalRuns) {
                sendPort.send({
                  'type': 'progress',
                  'progress': completedRuns / totalRuns,
                });
              }
            }
          }
          
          completedTests++;
        }
        
        // Ensure final progress is sent
        sendPort.send({
          'type': 'progress',
          'progress': 1.0,
        });

        stopwatch.stop();
        final duration = stopwatch.elapsed;
        final opsPerSecond = totalOperations / duration.inMicroseconds * 1000000;

        // Scale score to 1-100 (calibrated for modern devices)
        // High-end devices (2023-2024) should score around 80-90
        // Using logarithmic-like scaling: score = 100 * (1 - e^(-opsPerSecond/divisor))
        // Simplified to linear with higher divisor for better distribution
        final score = (opsPerSecond / 5); //.clamp(1.0, 100.0);

        // Send result back to main thread
        sendPort.send({
          'type': 'result',
          'score': score,
          'operationsPerSecond': opsPerSecond,
          'duration': duration,
        });
      } else if (message == 'stop') {
        break;
      }
    }
    
    receivePort.close();
  }

  // Single-core benchmark with multiple test types
  static Future<BenchmarkResult> runSingleCoreBenchmark({
    required Function(double progress) onProgress,
  }) async {
    final receivePort = ReceivePort();
    final isolate = await Isolate.spawn(
      _singleCoreWorker,
      [receivePort.sendPort],
    );

    try {
      // Set up result completer
      final resultCompleter = Completer<BenchmarkResult>();
      SendPort? workerSendPort;
      final workerSendPortCompleter = Completer<SendPort>();
      
      // Listen for messages from worker (single listener for all messages)
      receivePort.listen((message) {
        if (message is SendPort) {
          // First message is the worker's send port
          workerSendPort = message;
          if (!workerSendPortCompleter.isCompleted) {
            workerSendPortCompleter.complete(message);
          }
        } else if (message is Map<String, dynamic>) {
          if (message['type'] == 'progress') {
            onProgress(message['progress'] as double);
          } else if (message['type'] == 'result') {
            if (!resultCompleter.isCompleted) {
              resultCompleter.complete(BenchmarkResult(
                score: message['score'] as double,
                operationsPerSecond: message['operationsPerSecond'] as double,
                duration: message['duration'] as Duration,
                testName: 'Single-Core',
              ));
            }
          }
        }
      });

      // Wait for worker's send port
      final sendPort = await workerSendPortCompleter.future;
      
      // Start the benchmark
      sendPort.send('start');
      
      // Wait for result
      final result = await resultCompleter.future;
      
      // Stop the worker
      sendPort.send('stop');
      
      return result;
    } finally {
      isolate.kill(priority: Isolate.immediate);
      receivePort.close();
    }
  }

  // Multi-core benchmark worker
  static Future<void> _multiCoreWorker(List<dynamic> args) async {
    final mainSendPort = args[0] as SendPort;
    final workerId = args[1] as int;
    final receivePort = ReceivePort();
    
    // Send back the worker's receive port
    mainSendPort.send({
      'type': 'ready',
      'workerId': workerId,
      'sendPort': receivePort.sendPort,
    });

    await for (final message in receivePort) {
      if (message is Map<String, dynamic> && message['type'] == 'work') {
        final iterations = message['iterations'] as int;
        final result = _runCpuWorkload(iterations);
        mainSendPort.send({
          'type': 'result',
          'workerId': workerId,
          'result': result,
        });
      } else if (message == 'stop') {
        break;
      }
    }
    
    receivePort.close();
  }

  // Multi-core benchmark
  static Future<BenchmarkResult> runMultiCoreBenchmark({
    required int coreCount,
    required Function(double progress) onProgress,
  }) async {
    const int totalIterations = 50;
    const int operationsPerIteration = 400;
    final stopwatch = Stopwatch()..start();

    // Create isolates for each core
    final isolates = <Isolate>[];
    final workerSendPorts = <int, SendPort>{};
    final mainReceivePort = ReceivePort();
    final readyCompleter = Completer<void>();
    int readyWorkers = 0;

    // Results tracking for current iteration
    Completer<void>? iterationCompleter;
    final completedWorkers = <int>{};

    // Listen for all messages from workers
    mainReceivePort.listen((message) {
      if (message is Map<String, dynamic>) {
        if (message['type'] == 'ready') {
          final workerId = message['workerId'] as int;
          workerSendPorts[workerId] = message['sendPort'] as SendPort;
          readyWorkers++;
          if (readyWorkers == coreCount && !readyCompleter.isCompleted) {
            readyCompleter.complete();
          }
        } else if (message['type'] == 'result') {
          final workerId = message['workerId'] as int;
          completedWorkers.add(workerId);
          if (iterationCompleter != null && 
              completedWorkers.length >= coreCount && 
              !iterationCompleter!.isCompleted) {
            iterationCompleter!.complete();
          }
        }
      }
    });

    try {
      // Spawn isolates
      for (int i = 0; i < coreCount; i++) {
        final isolate = await Isolate.spawn(
          _multiCoreWorker,
          [mainReceivePort.sendPort, i],
        );
        isolates.add(isolate);
      }

      // Wait for all workers to be ready
      await readyCompleter.future.timeout(
        const Duration(seconds: 5),
        onTimeout: () {},
      );

      double totalOperations = 0;

      for (int iteration = 0; iteration < totalIterations; iteration++) {
        // Reset for new iteration
        iterationCompleter = Completer<void>();
        completedWorkers.clear();

        // Send work to all cores
        for (final sendPort in workerSendPorts.values) {
          sendPort.send({
            'type': 'work',
            'iterations': operationsPerIteration,
          });
        }

        // Wait for all cores to complete
        await iterationCompleter!.future;

        totalOperations += operationsPerIteration * coreCount;
        onProgress((iteration + 1) / totalIterations);
      }

      // Stop all workers
      for (final sendPort in workerSendPorts.values) {
        sendPort.send('stop');
      }

      stopwatch.stop();
      final duration = stopwatch.elapsed;
      final opsPerSecond = totalOperations / duration.inMicroseconds * 1000000;

      // Scale score to 1-100 (multi-core should be higher)
      // High-end multi-core systems should score around 80-90
      // Using higher divisor since multi-core produces more ops/sec
      final score = (opsPerSecond / 3000); //.clamp(1.0, 100.0);

      return BenchmarkResult(
        score: score,
        operationsPerSecond: opsPerSecond,
        duration: duration,
        testName: 'Multi-Core',
      );
    } finally {
      // Clean up isolates
      for (final isolate in isolates) {
        isolate.kill(priority: Isolate.immediate);
      }
      mainReceivePort.close();
    }
  }
}

