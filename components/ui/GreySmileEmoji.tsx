import Svg, { Circle, Path } from "react-native-svg";

export function GreySmileEmoji({
  size = 44,
  face = "#f7f7fa",
  mouth = "#636366",
  eyes = "#636366",
  ring = "#636366",
  border = "#636366",
  ringWidth = 1,
  faceRadius = 17, // 22 - 5
  ringRadius = 20, // по краю SVG
}) {
  // все по центру 22,22 (SVG 44x44)
  return (
    <Svg width={size} height={size} viewBox="0 0 44 44" fill="none">
      {/* Dashed ring */}
      <Circle
        cx={22}
        cy={22}
        r={ringRadius}
        stroke={ring}
        strokeWidth={ringWidth}
        strokeDasharray="4 4"
        fill="none"
      />
      <Circle
        cx={22}
        cy={22}
        r={17}
        stroke={border}
        strokeWidth={ringWidth}
        fill="none"
      />
      {/* Face */}
      <Circle cx={22} cy={22} r={faceRadius} fill={face} />
      {/* Eyes */}
      <Circle cx={15.5} cy={18} r={2} fill={eyes} />
      <Circle cx={28.5} cy={18} r={2} fill={eyes} />
      {/* Smile */}
      <Path
        d="M15 27 C18 32, 26 32, 29 27"
        stroke={mouth}
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
}
