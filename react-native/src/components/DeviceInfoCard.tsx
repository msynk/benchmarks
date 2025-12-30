/**
 * Device Info Card Component
 * Displays device information in a styled card
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { colors } from '../theme/colors';
import { DeviceInfo } from '../utils/deviceInfo';

interface DeviceInfoCardProps {
  deviceInfo: DeviceInfo;
  compact?: boolean;
}

interface InfoRowProps {
  label: string;
  value: string | number;
  icon?: string;
}

const InfoRow: React.FC<InfoRowProps> = ({ label, value, icon }) => (
  <View style={styles.infoRow}>
    <View style={styles.infoLabelContainer}>
      {icon && <Text style={styles.icon}>{icon}</Text>}
      <Text style={styles.infoLabel}>{label}</Text>
    </View>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

export const DeviceInfoCard: React.FC<DeviceInfoCardProps> = ({
  deviceInfo,
  compact = false,
}) => {
  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <View style={styles.compactRow}>
          <Text style={styles.compactLabel}>
            {deviceInfo.platform} {deviceInfo.osVersion}
          </Text>
          <Text style={styles.compactSeparator}>•</Text>
          <Text style={styles.compactLabel}>{deviceInfo.estimatedCores} Cores</Text>
          <Text style={styles.compactSeparator}>•</Text>
          <Text style={styles.compactLabel}>{deviceInfo.jsEngineName}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerIcon}>📱</Text>
        <Text style={styles.headerTitle}>Device Information</Text>
      </View>
      
      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>System</Text>
          <InfoRow icon="🖥️" label="Platform" value={deviceInfo.platform} />
          <InfoRow icon="📟" label="Version" value={deviceInfo.osVersion} />
          <InfoRow icon="📲" label="Device Type" value={deviceInfo.deviceType} />
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance</Text>
          <InfoRow icon="⚡" label="CPU Cores" value={`${deviceInfo.estimatedCores} cores`} />
          <InfoRow icon="🧠" label="JS Engine" value={deviceInfo.jsEngineName} />
          <InfoRow icon="💾" label="Est. Memory" value={deviceInfo.estimatedMemory} />
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Display</Text>
          <InfoRow 
            icon="📺" 
            label="Resolution" 
            value={`${deviceInfo.screenWidth} × ${deviceInfo.screenHeight}`} 
          />
          <InfoRow icon="🔍" label="Pixel Ratio" value={`${deviceInfo.pixelRatio}x`} />
        </View>
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.backgroundLight,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 14,
    marginRight: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
  // Compact styles
  compactContainer: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  compactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  compactLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  compactSeparator: {
    fontSize: 12,
    color: colors.textMuted,
    marginHorizontal: 8,
  },
});

export default DeviceInfoCard;
