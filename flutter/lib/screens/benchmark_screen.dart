import 'dart:async';
import 'package:flutter/material.dart';
import '../services/benchmark_service.dart';
import '../services/device_info_service.dart';
import '../widgets/device_info_card.dart';
import '../widgets/benchmark_card.dart';
import '../widgets/result_card.dart';

class BenchmarkScreen extends StatefulWidget {
  const BenchmarkScreen({super.key});

  @override
  State<BenchmarkScreen> createState() => _BenchmarkScreenState();
}

class _BenchmarkScreenState extends State<BenchmarkScreen> {
  DeviceInfo? _deviceInfo;
  bool _isRunning = false;
  double _singleCoreProgress = 0.0;
  double _multiCoreProgress = 0.0;
  BenchmarkResult? _singleCoreResult;
  BenchmarkResult? _multiCoreResult;
  double? _overallScore;

  @override
  void initState() {
    super.initState();
    _loadDeviceInfo();
  }

  Future<void> _loadDeviceInfo() async {
    final deviceInfo = await DeviceInfoService().getDeviceInfo();
    setState(() {
      _deviceInfo = deviceInfo;
    });
  }

  Future<void> _runBenchmarks() async {
    if (_deviceInfo == null || _isRunning) return;

    setState(() {
      _isRunning = true;
      _singleCoreProgress = 0.0;
      _multiCoreProgress = 0.0;
      _singleCoreResult = null;
      _multiCoreResult = null;
      _overallScore = null;
    });

    try {
      // Run single-core benchmark
      final singleCoreResult = await BenchmarkService.runSingleCoreBenchmark(
        onProgress: (progress) {
          setState(() {
            _singleCoreProgress = progress;
          });
        },
      );

      setState(() {
        _singleCoreResult = singleCoreResult;
      });

      // Run multi-core benchmark
      final coreCount = _deviceInfo!.processorCount ?? 4;
      final multiCoreResult = await BenchmarkService.runMultiCoreBenchmark(
        coreCount: coreCount,
        onProgress: (progress) {
          setState(() {
            _multiCoreProgress = progress;
          });
        },
      );

      setState(() {
        _multiCoreResult = multiCoreResult;
        // Calculate overall score (weighted: 30% single-core, 70% multi-core)
        _overallScore = (singleCoreResult.score * 0.3 + multiCoreResult.score * 0.7);
      });
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error running benchmarks: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() {
          _isRunning = false;
        });
      }
    }
  }

  void _resetBenchmarks() {
    setState(() {
      _singleCoreProgress = 0.0;
      _multiCoreProgress = 0.0;
      _singleCoreResult = null;
      _multiCoreResult = null;
      _overallScore = null;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'CPU Benchmark',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        centerTitle: true,
        elevation: 0,
      ),
      body: SafeArea(
        child: _deviceInfo == null
            ? const Center(child: CircularProgressIndicator())
            : Padding(
                padding: const EdgeInsets.all(12.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    DeviceInfoCard(deviceInfo: _deviceInfo!),
                    const SizedBox(height: 8),
                    if (_overallScore != null)
                      ResultCard(
                        overallScore: _overallScore!,
                        singleCoreScore: _singleCoreResult!.score,
                        multiCoreScore: _multiCoreResult!.score,
                      ),
                    if (_overallScore != null) const SizedBox(height: 8),
                    BenchmarkCard(
                      title: 'Single-Core',
                      progress: _singleCoreProgress,
                      isRunning: _isRunning && _multiCoreProgress == 0.0,
                      result: _singleCoreResult,
                    ),
                    const SizedBox(height: 8),
                    BenchmarkCard(
                      title: 'Multi-Core',
                      progress: _multiCoreProgress,
                      isRunning: _isRunning && _singleCoreProgress == 1.0,
                      result: _multiCoreResult,
                    ),
                    const Spacer(),
                    Row(
                      children: [
                        Expanded(
                          child: ElevatedButton.icon(
                            onPressed: _isRunning ? null : _runBenchmarks,
                            icon: _isRunning
                                ? const SizedBox(
                                    width: 14,
                                    height: 14,
                                    child: CircularProgressIndicator(
                                      strokeWidth: 2,
                                    ),
                                  )
                                : const Icon(Icons.play_arrow, size: 18),
                            label: Text(_isRunning ? 'Running...' : 'Run Benchmark'),
                            style: ElevatedButton.styleFrom(
                              padding: const EdgeInsets.symmetric(vertical: 12),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(8),
                              ),
                            ),
                          ),
                        ),
                        if (_overallScore != null) ...[
                          const SizedBox(width: 8),
                          OutlinedButton.icon(
                            onPressed: _resetBenchmarks,
                            icon: const Icon(Icons.refresh, size: 18),
                            label: const Text('Reset'),
                            style: OutlinedButton.styleFrom(
                              padding: const EdgeInsets.symmetric(vertical: 12),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(8),
                              ),
                            ),
                          ),
                        ],
                      ],
                    ),
                  ],
                ),
              ),
      ),
    );
  }
}

