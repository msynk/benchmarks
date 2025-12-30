/**
 * Color Theme for CPU Benchmark App
 * Professional dark theme with accent colors
 */

export const colors = {
  // Background colors
  background: '#0D1117',
  backgroundLight: '#161B22',
  backgroundCard: '#1C2128',
  backgroundCardHover: '#262C36',
  
  // Primary accent - Electric Blue
  primary: '#58A6FF',
  primaryDark: '#1F6FEB',
  primaryLight: '#79C0FF',
  
  // Secondary accent - Teal
  secondary: '#3FB950',
  secondaryDark: '#238636',
  secondaryLight: '#56D364',
  
  // Score colors
  scoreExcellent: '#3FB950', // 80-100
  scoreGood: '#58A6FF',      // 60-79
  scoreAverage: '#D29922',   // 40-59
  scoreBelowAverage: '#F85149', // 20-39
  scorePoor: '#DA3633',      // 1-19
  
  // Text colors
  textPrimary: '#F0F6FC',
  textSecondary: '#8B949E',
  textMuted: '#6E7681',
  textAccent: '#58A6FF',
  
  // Border colors
  border: '#30363D',
  borderLight: '#3D444D',
  borderFocus: '#58A6FF',
  
  // Status colors
  success: '#3FB950',
  warning: '#D29922',
  error: '#F85149',
  info: '#58A6FF',
  
  // Progress bar
  progressBackground: '#30363D',
  progressFill: '#58A6FF',
  progressFillActive: '#79C0FF',
  
  // Gradients (as arrays for LinearGradient)
  gradientPrimary: ['#1F6FEB', '#58A6FF'],
  gradientSuccess: ['#238636', '#3FB950'],
  gradientWarning: ['#9E6A03', '#D29922'],
  gradientDanger: ['#DA3633', '#F85149'],
  gradientDark: ['#0D1117', '#161B22'],
};

// Get score color based on value
export function getScoreColor(score: number): string {
  if (score >= 80) return colors.scoreExcellent;
  if (score >= 60) return colors.scoreGood;
  if (score >= 40) return colors.scoreAverage;
  if (score >= 20) return colors.scoreBelowAverage;
  return colors.scorePoor;
}

// Get score label based on value
export function getScoreLabel(score: number): string {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Average';
  if (score >= 20) return 'Below Average';
  return 'Poor';
}
