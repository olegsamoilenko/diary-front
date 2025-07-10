export function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleRad: number,
) {
  return {
    x: centerX + radius * Math.cos(angleRad),
    y: centerY + radius * Math.sin(angleRad),
  };
}
