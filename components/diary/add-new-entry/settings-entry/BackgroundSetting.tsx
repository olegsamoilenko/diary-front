import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import type { BackgroundSettings, ColorTheme } from "@/types";
import {
  AddEntryBackgroundColors,
  AddEntryBackgroundImage,
} from "@/constants/EntrySettings";

type OnChangeBackgroundArg = { background: BackgroundSettings };

type BackgroundSettingProps = {
  backgroundEntry: BackgroundSettings;
  onChangeBackground: (arg: OnChangeBackgroundArg) => void;
};
export default function BackgroundSetting({
  backgroundEntry,
  onChangeBackground,
}: BackgroundSettingProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const styles = getStyles(colors);

  const handleBackground = (background: BackgroundSettings) => {
    onChangeBackground({ background: background });
  };
  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        marginLeft: -7,
        position: "relative",
        zIndex: 1000,
      }}
    >
      <View style={{ width: "105%" }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            flexDirection: "row",
            alignItems: "center",
            padding: 20,
            gap: 10,
            backgroundColor: colors.background,
          }}
          pointerEvents="auto"
        >
          {AddEntryBackgroundColors.map((color) => (
            <TouchableOpacity
              key={color.id}
              onPress={() => handleBackground(color)}
            >
              <View
                style={[
                  styles.colorRing,
                  {
                    borderColor:
                      color.id === backgroundEntry.id
                        ? colors.primary
                        : "transparent",
                  },
                ]}
              />
              <View
                style={[
                  styles.color,
                  {
                    backgroundColor: color.value?.toString(),
                  },
                ]}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <View
        style={{
          height: 250,
          width: "105%",
          backgroundColor: colors.background,
        }}
      >
        <ScrollView
          contentContainerStyle={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
            gap: 10,
            paddingLeft: 30,
            paddingRight: 15,
          }}
        >
          {AddEntryBackgroundImage.map((image) => (
            <TouchableOpacity
              key={image.id}
              onPress={() => handleBackground(image)}
            >
              <View
                style={[
                  styles.imageRing,
                  {
                    borderColor:
                      image.id === backgroundEntry.id
                        ? colors.primary
                        : "transparent",
                  },
                ]}
              />
              <View
                style={[
                  styles.color,
                  {
                    backgroundColor: "transparent",
                    padding: 0,
                    width: 100,
                    height: 150,
                    borderRadius: 10,
                    overflow: "hidden",
                  },
                ]}
              >
                <Image
                  source={image.url}
                  style={{ width: "100%", height: "100%" }}
                />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const getStyles = (colors: ColorTheme) =>
  StyleSheet.create({
    colorsContainer: {
      width: "100%",
      padding: 10,
    },
    colorsRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    color: {
      width: 50,
      height: 50,
      borderRadius: 50,
      elevation: 5,
      padding: 5,
    },
    colorRing: {
      position: "absolute",
      top: -5,
      left: -5,
      width: 60,
      height: 60,
      borderRadius: 100,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 3,
      backgroundColor: "transparent",
    },
    imageRing: {
      position: "absolute",
      top: -4,
      left: -4,
      width: 108,
      height: 158,
      borderRadius: 15,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 3,
      backgroundColor: "transparent",
    },
  });
