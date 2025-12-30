/**
 * Score Display Component
 * Shows benchmark score with visual indicator
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import { colors, getScoreColor, getScoreLabel } from '../theme/colors';

interface ScoreDisplayProps {
  score: number;
  label: string;
  subtitle?: string;
  size?: 'small' | 'medium' | 'large';
  animated?: boolean;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
  score,
  label,
  subtitle,
  size = 'medium',
  animated = true,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const displayScore = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animated && score > 0) {
      Animated.parallel([
        Animated.timing(animatedValue, {
          toValue: score / 100,
          duration: 1500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }),
        Animated.timing(displayScore, {
          toValue: score,
          duration: 1500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      animatedValue.setValue(score / 100);
      displayScore.setValue(score);
    }
  }, [score, animated]);

  const sizeConfig = {
    small: { circle: 80, fontSize: 24, labelSize: 12, stroke: 6 },
    medium: { circle: 120, fontSize: 36, labelSize: 14, stroke: 8 },
    large: { circle: 160, fontSize: 48, labelSize: 16, stroke: 10 },
  };

  const config = sizeConfig[size];
  const radius = (config.circle - config.stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  const scoreColor = getScoreColor(score);
  const scoreLabel = getScoreLabel(score);

  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  });

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { fontSize: config.labelSize }]}>{label}</Text>
      
      <View style={[styles.circleContainer, { width: config.circle, height: config.circle }]}>
        {/* Background circle */}
        <View
          style={[
            styles.backgroundCircle,
            {
              width: config.circle,
              height: config.circle,
              borderRadius: config.circle / 2,
              borderWidth: config.stroke,
            },
          ]}
        />
        
        {/* Animated progress ring using View approximation */}
        <Animated.View
          style={[
            styles.progressRing,
            {
              width: config.circle,
              height: config.circle,
              borderRadius: config.circle / 2,
              borderWidth: config.stroke,
              borderColor: scoreColor,
              borderTopColor: 'transparent',
              borderRightColor: 'transparent',
              transform: [
                {
                  rotate: animatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg'],
                  }),
                },
              ],
            },
          ]}
        />

        {/* Score text */}
        <View style={styles.scoreTextContainer}>
          <Animated.Text
            style={[
              styles.scoreText,
              { fontSize: config.fontSize, color: scoreColor },
            ]}
          >
            {animated
              ? displayScore.interpolate({
                  inputRange: [0, 100],
                  outputRange: ['0', '100'],
                  extrapolate: 'clamp',
                })
              : Math.round(score).toString()}
          </Animated.Text>
        </View>
      </View>

      <Text style={[styles.scoreLabel, { color: scoreColor }]}>{scoreLabel}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 16,
  },
  label: {
    color: colors.textSecondary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  circleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  backgroundCircle: {
    position: 'absolute',
    borderColor: colors.progressBackground,
  },
  progressRing: {
    position: 'absolute',
  },
  scoreTextContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreText: {
    fontWeight: '700',
  },
  scoreLabel: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  subtitle: {
    marginTop: 4,
    fontSize: 12,
    color: colors.textMuted,
  },
});

export default ScoreDisplay;
