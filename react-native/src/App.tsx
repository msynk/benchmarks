/**
 * CPU Benchmark App
 * A cross-platform benchmark application for measuring device performance
 */

import React, { useState, useCallback, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Animated,
  Dimensions,
} from 'react-native';

import { colors, getScoreColor } from './theme/colors';
import {
  ScoreDisplay,
  ProgressBar,
  DeviceInfoCard,
  ResultsCard,
  Button,
} from './components';
import { getDeviceInfo, DeviceInfo } from './utils/deviceInfo';
import {
  runSingleCoreBenchmark,
  runMultiCoreBenchmark,
  TestProgress,
  BenchmarkSummary,
} from './utils/benchmarkRunner';
import { BenchmarkResult, DEFAULT_CONFIG, calculateOverallScore } from './utils/benchmarkCore';

type BenchmarkState = 'idle' | 'running-single' | 'running-multi' | 'completed';

const App: React.FC = () => {
  // State
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
  const [benchmarkState, setBenchmarkState] = useState<BenchmarkState>('idle');
  const [currentProgress, setCurrentProgress] = useState<TestProgress | null>(null);
  const [singleCoreResults, setSingleCoreResults] = useState<BenchmarkResult[]>([]);
  const [multiCoreResults, setMultiCoreResults] = useState<BenchmarkResult[]>([]);
  const [singleCoreScore, setSingleCoreScore] = useState<number>(0);
  const [multiCoreScore, setMultiCoreScore] = useState<number>(0);
  const [totalDuration, setTotalDuration] = useState<number>(0);
  const [fadeAnim] = useState(new Animated.Value(1));

  // Get device info on mount
  useEffect(() => {
    const info = getDeviceInfo();
    setDeviceInfo(info);
  }, []);

  // Handle progress updates for single-core tests
  const handleSingleCoreProgress = useCallback((progress: TestProgress) => {
    setCurrentProgress(progress);
  }, []);

  // Handle progress updates for multi-core tests
  const handleMultiCoreProgress = useCallback((progress: TestProgress) => {
    setCurrentProgress(progress);
  }, []);

  // Start benchmark
  const startBenchmark = useCallback(async () => {
    if (!deviceInfo) return;

    const startTime = performance.now();

    // Reset state
    setSingleCoreResults([]);
    setMultiCoreResults([]);
    setSingleCoreScore(0);
    setMultiCoreScore(0);
    setCurrentProgress(null);

    // Fade animation
    Animated.timing(fadeAnim, {
      toValue: 0.5,
      duration: 300,
      useNativeDriver: true,
    }).start();

    try {
      // Run single-core benchmark
      setBenchmarkState('running-single');
      const singleResults = await runSingleCoreBenchmark(
        DEFAULT_CONFIG,
        handleSingleCoreProgress
      );
      setSingleCoreResults(singleResults);
      setSingleCoreScore(calculateOverallScore(singleResults));

      // Small delay between test phases
      await new Promise(resolve => setTimeout(resolve, 500));

      // Run multi-core benchmark
      setBenchmarkState('running-multi');
      const multiResults = await runMultiCoreBenchmark(
        DEFAULT_CONFIG,
        deviceInfo.estimatedCores,
        handleMultiCoreProgress
      );
      setMultiCoreResults(multiResults);
      setMultiCoreScore(calculateOverallScore(multiResults));

      // Mark as completed
      setBenchmarkState('completed');
      setTotalDuration(performance.now() - startTime);

    } catch (error) {
      console.error('Benchmark error:', error);
      setBenchmarkState('idle');
    }

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [deviceInfo, fadeAnim, handleSingleCoreProgress, handleMultiCoreProgress]);

  // Reset benchmark
  const resetBenchmark = useCallback(() => {
    setBenchmarkState('idle');
    setCurrentProgress(null);
    setSingleCoreResults([]);
    setMultiCoreResults([]);
    setSingleCoreScore(0);
    setMultiCoreScore(0);
    setTotalDuration(0);
  }, []);

  // Render running state
  const renderRunningState = () => {
    if (!currentProgress) return null;

    const isMultiCore = benchmarkState === 'running-multi';
    const phaseProgress = isMultiCore ? 50 + (currentProgress.overallProgress / 2) : currentProgress.overallProgress / 2;

    return (
      <View style={styles.runningContainer}>
        <View style={styles.runningHeader}>
          <Text style={styles.runningIcon}>⚙️</Text>
          <Text style={styles.runningTitle}>
            {isMultiCore ? 'Multi-Core Test' : 'Single-Core Test'}
          </Text>
        </View>

        <View style={styles.currentTestContainer}>
          <Text style={styles.currentTestLabel}>Current Test</Text>
          <Text style={styles.currentTestName}>{currentProgress.currentTest}</Text>
          <Text style={styles.iterationText}>
            Iteration {currentProgress.iteration} of {currentProgress.totalIterations}
          </Text>
        </View>

        <View style={styles.progressContainer}>
          <ProgressBar
            progress={currentProgress.overallProgress}
            label={isMultiCore ? 'Multi-Core Progress' : 'Single-Core Progress'}
            color={isMultiCore ? colors.secondary : colors.primary}
          />
          <View style={styles.progressSpacer} />
          <ProgressBar
            progress={phaseProgress}
            label="Overall Progress"
            color={colors.textAccent}
          />
        </View>

        <View style={styles.testCountContainer}>
          <Text style={styles.testCountText}>
            Test {currentProgress.testIndex} of {currentProgress.totalTests}
          </Text>
        </View>
      </View>
    );
  };

  // Render completed state
  const renderCompletedState = () => {
    const combinedScore = Math.round((singleCoreScore + multiCoreScore) / 2);

    return (
      <View style={styles.completedContainer}>
        {/* Overall Score */}
        <View style={styles.overallScoreContainer}>
          <Text style={styles.overallScoreLabel}>Overall Score</Text>
          <Text style={[styles.overallScoreValue, { color: getScoreColor(combinedScore) }]}>
            {combinedScore}
          </Text>
          <Text style={styles.overallScoreSubtext}>
            Completed in {(totalDuration / 1000).toFixed(1)}s
          </Text>
        </View>

        {/* Score Comparison */}
        <View style={styles.scoreComparison}>
          <ScoreDisplay
            score={singleCoreScore}
            label="Single-Core"
            subtitle="Sequential performance"
            size="medium"
            animated={true}
          />
          <ScoreDisplay
            score={multiCoreScore}
            label="Multi-Core"
            subtitle={`${deviceInfo?.estimatedCores || 4} cores utilized`}
            size="medium"
            animated={true}
          />
        </View>

        {/* Detailed Results */}
        <View style={styles.detailedResults}>
          <ResultsCard
            title="Single-Core Results"
            results={singleCoreResults}
            overallScore={singleCoreScore}
          />
          <ResultsCard
            title="Multi-Core Results"
            results={multiCoreResults}
            overallScore={multiCoreScore}
          />
        </View>

        {/* Actions */}
        <View style={styles.actionContainer}>
          <Button
            title="Run Again"
            onPress={startBenchmark}
            variant="primary"
            size="large"
          />
          <View style={styles.buttonSpacer} />
          <Button
            title="Reset"
            onPress={resetBenchmark}
            variant="outline"
            size="medium"
          />
        </View>
      </View>
    );
  };

  // Render idle state
  const renderIdleState = () => (
    <View style={styles.idleContainer}>
      <View style={styles.heroSection}>
        <Text style={styles.heroIcon}>⚡</Text>
        <Text style={styles.heroTitle}>CPU Benchmark</Text>
        <Text style={styles.heroSubtitle}>
          Measure your device's processing power with comprehensive CPU tests
        </Text>
      </View>

      <View style={styles.featuresContainer}>
        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>🎯</Text>
          <View style={styles.featureText}>
            <Text style={styles.featureTitle}>Single-Core Test</Text>
            <Text style={styles.featureDescription}>
              10 intensive tests measuring sequential processing
            </Text>
          </View>
        </View>

        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>🔥</Text>
          <View style={styles.featureText}>
            <Text style={styles.featureTitle}>Multi-Core Test</Text>
            <Text style={styles.featureDescription}>
              Parallel workloads to stress all CPU cores
            </Text>
          </View>
        </View>

        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>📊</Text>
          <View style={styles.featureText}>
            <Text style={styles.featureTitle}>Detailed Results</Text>
            <Text style={styles.featureDescription}>
              Scores from 1-100 with individual test breakdowns
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.startButtonContainer}>
        <Button
          title="Start Benchmark"
          onPress={startBenchmark}
          variant="primary"
          size="large"
        />
        <Text style={styles.estimatedTime}>
          Estimated time: 30-60 seconds
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerLogo}>⚡</Text>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>CPU Benchmark</Text>
            <Text style={styles.headerVersion}>v1.0.0</Text>
          </View>
        </View>

        {/* Device Info */}
        {deviceInfo && (
          <Animated.View style={{ opacity: fadeAnim }}>
            {benchmarkState === 'idle' ? (
              <DeviceInfoCard deviceInfo={deviceInfo} />
            ) : (
              <DeviceInfoCard deviceInfo={deviceInfo} compact />
            )}
          </Animated.View>
        )}

        {/* Main Content */}
        <View style={styles.mainContent}>
          {benchmarkState === 'idle' && renderIdleState()}
          {(benchmarkState === 'running-single' || benchmarkState === 'running-multi') && 
            renderRunningState()}
          {benchmarkState === 'completed' && renderCompletedState()}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Built with React Native • Cross-Platform
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerLogo: {
    fontSize: 32,
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  headerVersion: {
    fontSize: 12,
    color: colors.textMuted,
  },

  // Main Content
  mainContent: {
    marginTop: 24,
  },

  // Idle State
  idleContainer: {
    alignItems: 'center',
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  heroIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
  },
  featuresContainer: {
    width: '100%',
    marginBottom: 32,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.backgroundCard,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  startButtonContainer: {
    alignItems: 'center',
  },
  estimatedTime: {
    marginTop: 12,
    fontSize: 14,
    color: colors.textMuted,
  },

  // Running State
  runningContainer: {
    backgroundColor: colors.backgroundCard,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  runningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  runningIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  runningTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  currentTestContainer: {
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 16,
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
  },
  currentTestLabel: {
    fontSize: 12,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  currentTestName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 4,
  },
  iterationText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressSpacer: {
    height: 16,
  },
  testCountContainer: {
    alignItems: 'center',
  },
  testCountText: {
    fontSize: 14,
    color: colors.textMuted,
  },

  // Completed State
  completedContainer: {
    alignItems: 'center',
  },
  overallScoreContainer: {
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 24,
    paddingHorizontal: 32,
    backgroundColor: colors.backgroundCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    width: '100%',
  },
  overallScoreLabel: {
    fontSize: 14,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  overallScoreValue: {
    fontSize: 72,
    fontWeight: '700',
  },
  overallScoreSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
  },
  scoreComparison: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 24,
  },
  detailedResults: {
    width: '100%',
  },
  actionContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  buttonSpacer: {
    height: 12,
  },

  // Footer
  footer: {
    marginTop: 32,
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerText: {
    fontSize: 12,
    color: colors.textMuted,
  },
});

export default App;
