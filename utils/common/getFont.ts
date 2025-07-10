export function getFont(
  font: string,
  weight: "regular" | "bold" = "regular",
): string {
  switch (weight) {
    case "regular":
      return `${font}-Regular`;
    case "bold":
      return `${font}-Bold`;
    default:
      return `Inter-Regular`;
  }
}
