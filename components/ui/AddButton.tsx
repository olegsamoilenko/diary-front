import { TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ColorTheme } from "@/types";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";

export default function AddButton({
  onPress,
  addNewEntryButtonDisabled,
}: {
  onPress: () => void;
  addNewEntryButtonDisabled: boolean;
}) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const styles = getStyles(colors);
  return (
    <TouchableOpacity
      style={[
        styles.fab,
        {
          backgroundColor: addNewEntryButtonDisabled
            ? colors.disabledPrimary
            : colors.primary,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={addNewEntryButtonDisabled}
    >
      <Ionicons name="add" size={32} color="#fff" />
    </TouchableOpacity>
  );
}

const getStyles = (colors: ColorTheme) =>
  StyleSheet.create({
    fab: {
      position: "absolute",
      right: 24,
      bottom: 32,
      width: 56,
      height: 56,
      borderRadius: 28,
      alignItems: "center",
      justifyContent: "center",
      elevation: 4,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      zIndex: 10,
    },
  });
