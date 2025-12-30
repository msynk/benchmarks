/**
 * Custom Button Component
 * Professional styled button with variants
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import { colors } from '../theme/colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
}) => {
  const isDisabled = disabled || loading;

  const getButtonStyle = () => {
    const baseStyle = [styles.button, styles[`button_${size}`]];

    switch (variant) {
      case 'primary':
        return [
          ...baseStyle,
          styles.buttonPrimary,
          isDisabled && styles.buttonDisabled,
        ];
      case 'secondary':
        return [
          ...baseStyle,
          styles.buttonSecondary,
          isDisabled && styles.buttonDisabled,
        ];
      case 'outline':
        return [
          ...baseStyle,
          styles.buttonOutline,
          isDisabled && styles.buttonOutlineDisabled,
        ];
      case 'danger':
        return [
          ...baseStyle,
          styles.buttonDanger,
          isDisabled && styles.buttonDisabled,
        ];
      default:
        return baseStyle;
    }
  };

  const getTextStyle = () => {
    const baseStyle = [styles.text, styles[`text_${size}`]];

    switch (variant) {
      case 'outline':
        return [
          ...baseStyle,
          styles.textOutline,
          isDisabled && styles.textDisabled,
        ];
      default:
        return [
          ...baseStyle,
          styles.textLight,
          isDisabled && styles.textDisabled,
        ];
    }
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={colors.textPrimary} size="small" />
      ) : (
        <View style={styles.contentContainer}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text style={getTextStyle()}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  button_small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    minWidth: 80,
  },
  button_medium: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    minWidth: 120,
  },
  button_large: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    minWidth: 160,
  },
  buttonPrimary: {
    backgroundColor: colors.primary,
  },
  buttonSecondary: {
    backgroundColor: colors.secondary,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  buttonDanger: {
    backgroundColor: colors.error,
  },
  buttonDisabled: {
    backgroundColor: colors.backgroundLight,
    opacity: 0.6,
  },
  buttonOutlineDisabled: {
    borderColor: colors.border,
    opacity: 0.6,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: 8,
  },
  text: {
    fontWeight: '600',
  },
  text_small: {
    fontSize: 14,
  },
  text_medium: {
    fontSize: 16,
  },
  text_large: {
    fontSize: 18,
  },
  textLight: {
    color: colors.textPrimary,
  },
  textOutline: {
    color: colors.primary,
  },
  textDisabled: {
    color: colors.textMuted,
  },
});

export default Button;
