import 'package:flutter/material.dart';
import '../services/device_info_service.dart';

class DeviceInfoCard extends StatelessWidget {
  final DeviceInfo deviceInfo;

  const DeviceInfoCard({
    super.key,
    required this.deviceInfo,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Device Information',
              style: Theme.of(context).textTheme.titleSmall?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
            ),
            const SizedBox(height: 8),
            _buildInfoRow('Device', deviceInfo.deviceName),
            const SizedBox(height: 4),
            _buildInfoRow('Model', deviceInfo.deviceModel),
            const SizedBox(height: 4),
            _buildInfoRow('Platform', deviceInfo.platform),
            const SizedBox(height: 4),
            _buildInfoRow('OS', deviceInfo.osVersion),
            const SizedBox(height: 4),
            _buildInfoRow(
              'CPU Cores',
              deviceInfo.processorCount?.toString() ?? 'Unknown',
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SizedBox(
          width: 80,
          child: Text(
            label,
            style: const TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w500,
              color: Colors.grey,
            ),
          ),
        ),
        Expanded(
          child: Text(
            value,
            style: const TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w600,
            ),
          ),
        ),
      ],
    );
  }
}

