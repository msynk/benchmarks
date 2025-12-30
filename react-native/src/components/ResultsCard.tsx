/**
 * Results Card Component
 * Displays individual benchmark test results
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { colors, getScoreColor } from '../theme/colors';
import { BenchmarkResult } from '../utils/benchmarkCore';

interface ResultsCardProps {
  title: string;
  results: BenchmarkResult[];
  overallScore: number;
}

interface ResultRowProps {
  result: BenchmarkResult;
  index: number;
}

const ResultRow: React.FC<ResultRowProps> = ({ result, index }) => {
  const scoreColor = getScoreColor(result.score);

  return (
    <View style={[styles.resultRow, index % 2 === 0 && styles.resultRowAlt]}>
      <View style={styles.resultInfo}>
        <Text style={styles.resultName}>{result.name}</Text>
        <Text style={styles.resultDuration}>
          {result.duration.toFixed(1)} ms
        </Text>
      </View>
      <View style={styles.scoreContainer}>
        <View style={[styles.scoreBadge, { backgroundColor: scoreColor + '20' }]}>
          <Text style={[styles.scoreText, { color: scoreColor }]}>
            {result.score}
          </Text>
        </View>
      </View>
    </View>
  );
};

export const ResultsCard: React.FC<ResultsCardProps> = ({
  title,
  results,
  overallScore,
}) => {
  const overallColor = getScoreColor(overallScore);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.icon}>
            {title.includes('Single') ? '⚡' : '🔥'}
          </Text>
          <Text style={styles.headerTitle}>{title}</Text>
        </View>
        <View style={[styles.overallBadge, { backgroundColor: overallColor + '20' }]}>
          <Text style={[styles.overallScore, { color: overallColor }]}>
            {overallScore}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>Test</Text>
          <Text style={styles.tableHeaderText}>Score</Text>
        </View>
        
        {results.map((result, index) => (
          <ResultRow key={index} result={result} index={index} />
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Average execution time:{' '}
          <Text style={styles.footerValue}>
            {(results.reduce((sum, r) => sum + r.duration, 0) / results.length).toFixed(1)} ms
          </Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: colors.backgroundLight,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 20,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  overallBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  overallScore: {
    fontSize: 18,
    fontWeight: '700',
  },
  content: {
    padding: 0,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.backgroundLight,
  },
  tableHeaderText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  resultRowAlt: {
    backgroundColor: colors.backgroundLight + '50',
  },
  resultInfo: {
    flex: 1,
  },
  resultName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  resultDuration: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  scoreContainer: {
    alignItems: 'flex-end',
  },
  scoreBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    minWidth: 40,
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    padding: 12,
    backgroundColor: colors.backgroundLight,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerText: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
  },
  footerValue: {
    color: colors.textSecondary,
    fontWeight: '600',
  },
});

export default ResultsCard;
