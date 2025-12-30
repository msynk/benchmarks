/**
 * Progress Bar Component
 * Animated progress indicator with label
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import { colors } from '../theme/colors';

interface ProgressBarProps {
  progress: number; // 0-100
  label?: string;
  showPercentage?: boolean;
  height?: number;
  animated?: boolean;
  color?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  label,
  showPercentage = true,
  height = 8,
  animated = true,
  color = colors.primary,
}) => {
  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animated) {
      Animated.timing(animatedWidth, {
        toValue: progress,
        duration: 300,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      }).start();
    } else {
      animatedWidth.setValue(progress);
    }
  }, [progress, animated]);

  const widthInterpolation = animatedWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      {(label || showPercentage) && (
        <View style={styles.labelContainer}>
          {label && <Text style={styles.label}>{label}</Text>}
          {showPercentage && (
            <Text style={styles.percentage}>{Math.round(progress)}%</Text>
          )}
        </View>
      )}
      <View style={[styles.track, { height }]}>
        <Animated.View
          style={[
            styles.fill,
            {
              width: widthInterpolation,
              backgroundColor: color,
              height: '100%',
            },
          ]}
        />
        {/* Glow effect */}
        <Animated.View
          style={[
            styles.glow,
            {
              width: widthInterpolation,
              backgroundColor: color,
              opacity: 0.3,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
  percentage: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  track: {
    backgroundColor: colors.progressBackground,
    borderRadius: 4,
    overflow: 'hidden',
    position: 'relative',
  },
  fill: {
    borderRadius: 4,
  },
  glow: {
    position: 'absolute',
    top: -2,
    left: 0,
    height: 4,
    borderRadius: 4,
  },
});

export default ProgressBar;
