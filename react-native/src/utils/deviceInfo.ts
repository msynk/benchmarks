/**
 * Device Information Utility
 * Gathers device-specific information for display
 */

import { Platform, Dimensions, PixelRatio } from 'react-native';

export interface DeviceInfo {
  // Basic Info
  platform: string;
  osVersion: string;
  deviceType: string;
  
  // Screen Info
  screenWidth: number;
  screenHeight: number;
  screenScale: number;
  pixelRatio: number;
  
  // Performance Metrics
  estimatedCores: number;
  jsEngineName: string;
  
  // Memory (estimated)
  estimatedMemory: string;
  
  // Additional
  isEmulator: boolean;
  appVersion: string;
}

// Estimate core count based on platform and device performance
function estimateCoreCount(): number {
  // Modern devices typically have:
  // - High-end phones: 8 cores
  // - Mid-range phones: 6-8 cores
  // - Budget phones: 4-6 cores
  // - Tablets: 4-8 cores
  
  // We'll use a heuristic based on screen size and platform
  const { width, height } = Dimensions.get('window');
  const screenArea = width * height;
  
  if (Platform.OS === 'ios') {
    // iOS devices are generally well-optimized
    // iPhone 12+ has 6 cores (2 performance + 4 efficiency)
    // iPad Pro has 8 cores
    if (screenArea > 800000) {
      return 8; // iPad Pro range
    } else if (screenArea > 400000) {
      return 6; // Modern iPhone
    }
    return 4; // Older devices
  }
  
  if (Platform.OS === 'android') {
    // Android varies widely
    // Flagship: 8 cores
    // Mid-range: 6-8 cores
    // Budget: 4 cores
    if (screenArea > 1000000) {
      return 8; // Large tablets / high-end
    } else if (screenArea > 500000) {
      return 6; // Mid-range
    }
    return 4; // Budget devices
  }
  
  // Web/other platforms
  if (typeof navigator !== 'undefined' && navigator.hardwareConcurrency) {
    return navigator.hardwareConcurrency;
  }
  
  return 4; // Default fallback
}

// Get JS engine name
function getJSEngineName(): string {
  if (Platform.OS === 'ios') {
    return 'JavaScriptCore';
  }
  if (Platform.OS === 'android') {
    // Check for Hermes
    // @ts-ignore
    if (typeof HermesInternal !== 'undefined') {
      return 'Hermes';
    }
    return 'JavaScriptCore / V8';
  }
  if (Platform.OS === 'web') {
    return 'V8 (Chrome) / SpiderMonkey (Firefox)';
  }
  return 'Unknown';
}

// Estimate available memory
function estimateMemory(): string {
  const { width, height } = Dimensions.get('window');
  const screenArea = width * height;
  
  // Rough estimation based on device class
  if (screenArea > 1000000) {
    return '6-8 GB';
  } else if (screenArea > 500000) {
    return '4-6 GB';
  } else if (screenArea > 300000) {
    return '3-4 GB';
  }
  return '2-3 GB';
}

// Check if running on emulator/simulator
function checkIsEmulator(): boolean {
  if (Platform.OS === 'ios') {
    // On iOS simulator, the model is typically 'x86_64' or 'arm64'
    return false; // Can't reliably detect without native module
  }
  if (Platform.OS === 'android') {
    return false; // Can't reliably detect without native module
  }
  return false;
}

// Get device type
function getDeviceType(): string {
  const { width, height } = Dimensions.get('window');
  const aspectRatio = Math.max(width, height) / Math.min(width, height);
  const minDimension = Math.min(width, height);
  
  if (Platform.OS === 'web') {
    return 'Web Browser';
  }
  
  // Tablets typically have lower aspect ratios
  if (aspectRatio < 1.6 && minDimension > 500) {
    return 'Tablet';
  }
  
  return 'Phone';
}

export function getDeviceInfo(): DeviceInfo {
  const { width, height } = Dimensions.get('window');
  const scale = Dimensions.get('window').scale || 1;
  
  return {
    platform: Platform.OS.charAt(0).toUpperCase() + Platform.OS.slice(1),
    osVersion: Platform.Version?.toString() || 'Unknown',
    deviceType: getDeviceType(),
    
    screenWidth: Math.round(width),
    screenHeight: Math.round(height),
    screenScale: scale,
    pixelRatio: PixelRatio.get(),
    
    estimatedCores: estimateCoreCount(),
    jsEngineName: getJSEngineName(),
    
    estimatedMemory: estimateMemory(),
    
    isEmulator: checkIsEmulator(),
    appVersion: '1.0.0',
  };
}

// Format device info for display
export function formatDeviceInfo(info: DeviceInfo): string[] {
  return [
    `Platform: ${info.platform} ${info.osVersion}`,
    `Device Type: ${info.deviceType}`,
    `Screen: ${info.screenWidth}x${info.screenHeight} @${info.pixelRatio}x`,
    `Estimated Cores: ${info.estimatedCores}`,
    `JS Engine: ${info.jsEngineName}`,
    `Est. Memory: ${info.estimatedMemory}`,
  ];
}
