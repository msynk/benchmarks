# CPU Benchmark App

A cross-platform Flutter application that measures CPU performance through intensive calculations. The app provides both single-core and multi-core benchmark tests with scores scaled from 1 to 100.

## Features

- **Single-Core Benchmark**: Tests CPU performance using a single core
- **Multi-Core Benchmark**: Utilizes all available CPU cores for maximum performance testing
- **Real-time Progress**: Shows progress indicators during benchmark execution
- **Device Information**: Displays comprehensive device and system information
- **Professional UI**: Modern, clean interface with Material Design 3
- **Scaled Scoring**: Results are normalized to a 1-100 scale for easy comparison

## Getting Started

### Prerequisites

- Flutter SDK (3.0.0 or higher)
- Dart SDK (3.0.0 or higher)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   flutter pub get
   ```
3. Run the app:
   ```bash
   flutter run
   ```

## How It Works

The benchmark uses several CPU-intensive calculations:
- Prime number generation
- Matrix multiplication
- Fibonacci sequence calculation
- Mandelbrot set computation

These calculations are run multiple times to get average performance metrics. The single-core test runs sequentially, while the multi-core test distributes work across all available CPU cores using Dart isolates.

## Scoring System

- Scores are scaled from 1 to 100
- Overall score is calculated as: 30% single-core + 70% multi-core
- Score labels:
  - 90-100: Excellent
  - 75-89: Very Good
  - 60-74: Good
  - 45-59: Average
  - 30-44: Below Average
  - 1-29: Poor

## Supported Platforms

- Android
- iOS
- Windows
- macOS
- Linux

## License

This project is open source and available for use.

