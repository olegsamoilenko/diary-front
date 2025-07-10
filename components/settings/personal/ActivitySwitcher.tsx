import React, { forwardRef } from "react";
import SideSheet, { SideSheetRef } from "@/components/SideSheet";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "@/constants/Colors";
import BackArrow from "@/components/ui/BackArrow";
import { useColorScheme } from "@/hooks/useColorScheme";

const ActivitySwitcher = forwardRef<SideSheetRef, {}>((props, ref) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const styles = getStyles(colors);
  return (
    <SideSheet ref={ref}>
      <View style={styles.container}>
        <BackArrow ref={ref} />
        <Text>ActivitySwitcher</Text>
      </View>
    </SideSheet>
  );
});

ActivitySwitcher.displayName = "ActivitySwitcher";

export default ActivitySwitcher;

const getStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      paddingLeft: 20,
      backgroundColor: colors.background,
      flex: 1,
      marginBottom: -6,
    },
  });
