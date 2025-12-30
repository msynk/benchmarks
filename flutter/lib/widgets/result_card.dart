import 'package:flutter/material.dart';

class ResultCard extends StatelessWidget {
  final double overallScore;
  final double singleCoreScore;
  final double multiCoreScore;

  const ResultCard({
    super.key,
    required this.overallScore,
    required this.singleCoreScore,
    required this.multiCoreScore,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Overall Score',
                  style: Theme.of(context).textTheme.titleSmall?.copyWith(
                        color: Colors.grey,
                      ),
                ),
                const SizedBox(height: 4),
                Text(
                  overallScore.toStringAsFixed(1),
                  style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                ),
              ],
            ),
            Row(
              children: [
                _buildMiniScore('Single', singleCoreScore),
                const SizedBox(width: 24),
                _buildMiniScore('Multi', multiCoreScore),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMiniScore(String label, double score) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.end,
      children: [
        Text(
          label,
          style: const TextStyle(
            fontSize: 11,
            color: Colors.grey,
          ),
        ),
        const SizedBox(height: 2),
        Text(
          score.toStringAsFixed(1),
          style: const TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
          ),
        ),
      ],
    );
  }
}


