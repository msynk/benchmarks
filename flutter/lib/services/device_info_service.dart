import 'dart:io';
import 'package:device_info_plus/device_info_plus.dart';

class DeviceInfo {
  final String deviceName;
  final String deviceModel;
  final String osVersion;
  final String platform;
  final int? processorCount;

  DeviceInfo({
    required this.deviceName,
    required this.deviceModel,
    required this.osVersion,
    required this.platform,
    this.processorCount,
  });
}

class DeviceInfoService {
  static final DeviceInfoService _instance = DeviceInfoService._internal();
  factory DeviceInfoService() => _instance;
  DeviceInfoService._internal();

  final DeviceInfoPlugin _deviceInfoPlugin = DeviceInfoPlugin();

  Future<DeviceInfo> getDeviceInfo() async {
    if (Platform.isAndroid) {
      final androidInfo = await _deviceInfoPlugin.androidInfo;
      return DeviceInfo(
        deviceName: androidInfo.device ?? 'Unknown',
        deviceModel: androidInfo.model ?? 'Unknown',
        osVersion: 'Android ${androidInfo.version.release} (SDK ${androidInfo.version.sdkInt})',
        platform: 'Android',
        processorCount: Platform.numberOfProcessors,
      );
    } else if (Platform.isIOS) {
      final iosInfo = await _deviceInfoPlugin.iosInfo;
      return DeviceInfo(
        deviceName: iosInfo.name,
        deviceModel: iosInfo.model ?? 'Unknown',
        osVersion: 'iOS ${iosInfo.systemVersion}',
        platform: 'iOS',
        processorCount: Platform.numberOfProcessors,
      );
    } else if (Platform.isWindows) {
      final windowsInfo = await _deviceInfoPlugin.windowsInfo;
      return DeviceInfo(
        deviceName: windowsInfo.computerName,
        deviceModel: windowsInfo.productName.isNotEmpty 
            ? windowsInfo.productName 
            : 'Windows Device',
        osVersion: 'Windows ${windowsInfo.displayVersion} (${windowsInfo.releaseId})',
        platform: 'Windows',
        processorCount: Platform.numberOfProcessors,
      );
    } else if (Platform.isMacOS) {
      final macInfo = await _deviceInfoPlugin.macOsInfo;
      return DeviceInfo(
        deviceName: macInfo.computerName,
        deviceModel: macInfo.model ?? 'Unknown',
        osVersion: 'macOS ${macInfo.osRelease}',
        platform: 'macOS',
        processorCount: Platform.numberOfProcessors,
      );
    } else if (Platform.isLinux) {
      final linuxInfo = await _deviceInfoPlugin.linuxInfo;
      return DeviceInfo(
        deviceName: linuxInfo.prettyName,
        deviceModel: '${linuxInfo.variant} ${linuxInfo.version}',
        osVersion: 'Linux ${linuxInfo.versionId ?? "Unknown"}',
        platform: 'Linux',
        processorCount: Platform.numberOfProcessors,
      );
    }

    return DeviceInfo(
      deviceName: 'Unknown',
      deviceModel: 'Unknown',
      osVersion: 'Unknown',
      platform: Platform.operatingSystem,
      processorCount: Platform.numberOfProcessors,
    );
  }
}

