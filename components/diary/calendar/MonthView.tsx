import React, { useCallback, useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import * as Localization from "expo-localization";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import dayjs from "dayjs";

import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { FIRST_DAY_BY_LOCALE } from "@/constants/FirstDayByLocale";
import i18n from "i18next";
import { ColorTheme, MoodByDate, Font } from "@/types";
import { getMonthYearStr, getWeekdayLabels, polarToCartesian } from "@/utils";
import { CENTER, CLOCK_RADIUS, EMOJI_SIZE } from "@/constants/Calendar";
import { ThemedText } from "@/components/ThemedText";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { getFont } from "@/utils/common/getFont";
import EmojiBadge from "@/components/diary/EmojiBadge";

type MonthViewProps = {
  selectedDay: string | number | Date | undefined;
  onDayPress: (day: string) => void;
  moodsByDate: Record<string, MoodByDate[] | undefined>;
  setMonth: (month: number) => void;
  setYear: (year: number) => void;
  setShowWeek: (show: boolean) => void;
  initialDate: string;
  activeMoods: { id: number }[];
};

type RNDayProps = {
  date?: DateData;
  state?: "" | "disabled" | "today" | "selected";
  marking?: any;
  onPress?: (date?: DateData) => void;
  onLongPress?: (date?: DateData) => void;
  theme?: any;
  [k: string]: any;
};

export default function MonthView({
  selectedDay,
  moodsByDate,
  onDayPress,
  setMonth,
  setYear,
  setShowWeek,
  initialDate,
  activeMoods = [],
}: MonthViewProps) {
  const lang = i18n.language || "en";
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const styles = useMemo(() => getStyles(colors), [colors]);
  const settings = useSelector((state: RootState) => state.settings.value);

  const locale = useMemo(() => {
    const arr = Localization.getLocales();
    return (
      arr?.find((loc) => loc.languageCode === lang)?.languageTag ?? "en-US"
    );
  }, [lang]);
  const firstDayOfWeek = FIRST_DAY_BY_LOCALE[locale] ?? 1;

  const selectedStr = useMemo(() => {
    if (!selectedDay) return null;
    if (typeof selectedDay === "string") {
      return selectedDay.slice(0, 10);
    }
    return dayjs(selectedDay).format("YYYY-MM-DD");
  }, [selectedDay]);

  const weekdayLabels = useMemo(
    () => getWeekdayLabels(lang, firstDayOfWeek),
    [lang, firstDayOfWeek],
  );

  const calendarTheme = useMemo(
    () => ({
      calendarBackground: colors.calendarBackground,
      arrowColor: colors.primary,
      monthTextColor: colors.text,
      textDayHeaderFontFamily: getFont(settings?.font as Font, "regular"),
    }),
    [colors.calendarBackground, colors.primary, colors.text, settings?.font],
  );

  const renderArrow = useCallback(
    (direction: "left" | "right") => (
      <MaterialCommunityIcons
        name="triangle"
        size={12}
        color={colors.primary}
        style={[
          styles.arrow,
          {
            transform:
              direction === "left"
                ? [{ rotate: "270deg" }, { scaleX: 1.4 }, { scaleY: 0.8 }]
                : [{ rotate: "90deg" }, { scaleX: 1.4 }, { scaleY: 0.8 }],
          },
        ]}
      />
    ),
    [colors.primary, styles.arrow],
  );

  const renderHeader = useCallback(
    (date: string) => {
      const monthYearStr = getMonthYearStr(date, lang);
      return (
        <View>
          <ThemedText style={styles.header}>
            {monthYearStr.slice(0, 1).toUpperCase() + monthYearStr.slice(1)}
          </ThemedText>
        </View>
      );
    },
    [lang, styles.header],
  );

  const dayComponent: React.FC<RNDayProps> = ({ date, state }) => {
    if (!date) return null;
    const isSelected = selectedStr === date.dateString;
    const moods = moodsByDate[date.dateString] || [];

    const bg = isSelected ? colors.primary : "transparent";
    const border =
      state === "disabled"
        ? colors.calendarDisableDayBorder
        : isSelected
          ? colors.primary
          : colors.calendarEnableDayBorder;
    const textColor =
      state === "disabled" ? "gray" : isSelected ? "#ffffff" : colors.text;

    return (
      <Pressable
        onPress={() => onDayPress(date.dateString)}
        style={[
          styles.dayContainer,
          {
            backgroundColor: bg,
            borderColor: border,
          },
        ]}
      >
        <ThemedText style={[styles.day, { color: textColor }]}>
          {date.day}
        </ThemedText>

        {moods.map((mood, idx) => {
          const d = new Date(mood.createdAt);
          const hour = d.getUTCHours() + d.getMinutes() / 60;
          const angle = (hour / 12) * 2 * Math.PI - Math.PI / 2;
          const r = CLOCK_RADIUS - EMOJI_SIZE / 10;
          const { x, y } = polarToCartesian(CENTER, CENTER, r, angle);
          const activeMood = activeMoods.find((m) => m.id === mood.id);
          return (
            <View
              key={idx}
              style={[
                styles.moodContainer,
                {
                  left: x - EMOJI_SIZE / 1.5,
                  top: y - EMOJI_SIZE / 1.5,
                },
              ]}
            >
              <View style={{ position: "relative" }}>
                <EmojiBadge
                  emoji={mood.mood}
                  size={EMOJI_SIZE}
                  zIndex={Math.round(hour)}
                  ringColor={colors.primary}
                  active={activeMood?.id === mood.id}
                />
                <Text
                  style={[
                    styles.emojiLabel,
                    {
                      zIndex: activeMood
                        ? 101 + Math.round(hour)
                        : Math.round(hour),
                      backgroundColor: hour < 7 || hour > 19 ? "#000" : "#fff",
                    },
                  ]}
                >
                  {hour < 7 || hour > 19 ? "🌙" : "☀️"}
                </Text>
              </View>
            </View>
          );
        })}
      </Pressable>
    );
  };

  const calendarKey = `${lang}-${colorScheme}`;

  return (
    <View style={styles.container}>
      <View style={styles.dayLabels}>
        {weekdayLabels.map((label) => (
          <ThemedText
            key={label}
            style={{
              flex: 1,
              textAlign: "center",
              color: colors.calendarDayLabels,
              fontSize: 14,
            }}
          >
            {label}
          </ThemedText>
        ))}
      </View>

      <Calendar
        key={calendarKey}
        firstDay={firstDayOfWeek}
        hideDayNames
        initialDate={initialDate}
        theme={calendarTheme}
        renderArrow={renderArrow}
        renderHeader={renderHeader}
        dayComponent={dayComponent as React.ComponentType<any>}
        onMonthChange={(obj) => {
          setMonth(obj.month);
          setYear(obj.year);
        }}
      />
    </View>
  );
}

const getStyles = (colors: ColorTheme) =>
  StyleSheet.create({
    container: {
      position: "relative",
    },
    dayLabels: {
      position: "absolute",
      left: 0,
      top: 50,
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: 5,
      width: "100%",
      zIndex: 200,
    },
    arrow: {
      marginHorizontal: 10,
      marginBottom: 40,
    },
    header: {
      fontSize: 18,
      textAlign: "center",
      marginBottom: 40,
    },
    dayContainer: {
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 100,
      position: "relative",
      width: "80%",
      height: 37,
      borderWidth: 2,
    },
    day: {
      position: "absolute",
      zIndex: 100,
    },
    moodContainer: {
      position: "absolute",
      borderRadius: EMOJI_SIZE / 2,
      alignItems: "center",
      justifyContent: "center",
    },
    emojiLabel: {
      fontSize: 6,
      position: "absolute",
      top: 0,
      right: 0,
      borderRadius: 10,
    },
  });
