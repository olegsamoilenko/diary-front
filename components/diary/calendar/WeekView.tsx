import React, { useCallback, useEffect, useMemo } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import * as Localization from "expo-localization";
import { FIRST_DAY_BY_LOCALE } from "@/constants/FirstDayByLocale";
import {
  addDays,
  getWeekdayLabels,
  getMonthYearStr,
  getNumbersMonthAndYear,
  polarToCartesian,
} from "@/utils";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import i18n from "i18next";
import { ColorTheme, MoodByDate } from "@/types";
import { CENTER, CLOCK_RADIUS, EMOJI_SIZE } from "@/constants/Calendar";
import { ThemedText } from "@/components/ThemedText";
import EmojiBadge from "@/components/diary/EmojiBadge";

function getWeekDates(
  selectedDate: string | number | Date,
  firstDayOfWeek = 1,
) {
  const date = new Date(selectedDate);
  let weekDay = date.getDay();
  let diff = weekDay - firstDayOfWeek;
  if (diff < 0) diff += 7;

  const weekStart = new Date(date);
  weekStart.setDate(date.getDate() - diff);

  return Array(7)
    .fill(0)
    .map((_, i) => {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    });
}

type WeekViewProps = {
  weekAnchorDay: string | number | Date;
  setWeekAnchorDay: (d: string) => void;
  selectedDay: string;
  setSelectedDay: React.Dispatch<React.SetStateAction<string>>;
  moodsByDate: Record<string, MoodByDate[] | undefined>;
  setMonth: (month: number) => void;
  setYear: (year: number) => void;
  onBackToMonth: () => void;
  loadingDays: boolean;
  setInitialDate: (date: string) => void;
  activeMoods: { id: number }[];
};

export default function WeekView({
  weekAnchorDay,
  setWeekAnchorDay,
  selectedDay,
  setSelectedDay,
  moodsByDate,
  setMonth,
  setYear,
  onBackToMonth,
  loadingDays,
  setInitialDate,
  activeMoods = [],
}: WeekViewProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const lang = i18n.language || "en";

  const locale = useMemo(() => {
    const arr = Localization.getLocales();
    return arr?.find((loc) => loc.languageCode === lang)?.languageTag;
  }, [lang]);

  const firstDayOfWeek = FIRST_DAY_BY_LOCALE[locale as string] ?? 1;

  const styles = useMemo(() => getStyles(colors), [colors]);

  const weekDates = useMemo(
    () => getWeekDates(weekAnchorDay, firstDayOfWeek),
    [weekAnchorDay, firstDayOfWeek],
  );

  const weekdayLabels = useMemo(
    () => getWeekdayLabels(lang, firstDayOfWeek),
    [lang, firstDayOfWeek],
  );

  const monthYearStr = useMemo(
    () => getMonthYearStr(weekDates[3], lang),
    [weekDates, lang],
  );

  const prevWeek = useCallback(() => {
    const newDate = addDays(weekDates[0], -7);
    setWeekAnchorDay(newDate);
    const { month, year } = getNumbersMonthAndYear(newDate);
    setMonth(month);
    setYear(year);
  }, [weekDates, setWeekAnchorDay, setMonth, setYear]);

  const nextWeek = useCallback(() => {
    const newDate = addDays(weekDates[0], 7);
    setWeekAnchorDay(newDate);
    const { month, year } = getNumbersMonthAndYear(newDate);
    setMonth(month);
    setYear(year);
  }, [weekDates, setWeekAnchorDay, setMonth, setYear]);

  const handleDayPress = useCallback(
    (item: string) => setSelectedDay(item),
    [setSelectedDay],
  );

  const handleBackToMonth = useCallback(() => {
    onBackToMonth();
    setInitialDate(weekDates[3]);
  }, [onBackToMonth, setInitialDate, weekDates]);

  return (
    <View style={styles.container}>
      <View style={styles.calendarHeader}>
        <Pressable onPress={prevWeek} style={styles.arrow}>
          <MaterialCommunityIcons
            name="triangle"
            size={12}
            color={colors.primary}
            style={styles.iconLeft}
          />
        </Pressable>
        <ThemedText style={{ fontSize: 18 }}>
          {monthYearStr.slice(0, 1).toUpperCase() + monthYearStr.slice(1)}
        </ThemedText>
        <Pressable onPress={nextWeek} style={styles.arrow}>
          <MaterialCommunityIcons
            name="triangle"
            size={12}
            color={colors.primary}
            style={styles.iconRight}
          />
        </Pressable>
      </View>

      <View style={styles.dayNameContainer}>
        {weekdayLabels.map((label, i) => (
          <ThemedText key={label} style={styles.dayName}>
            {label}
          </ThemedText>
        ))}
      </View>
      <View style={styles.daysContainer}>
        {weekDates.map((item) => {
          const moods = moodsByDate[item] || [];
          const isSelected = selectedDay === item;
          const day = Number(item.split("-")[2]);
          const itemMonth = Number(item.split("-")[1]);
          const month = Number(weekDates[3].split("-")[1]);
          return (
            <Pressable
              key={item}
              onPress={() => handleDayPress(item)}
              style={[
                styles.dayContainer,
                {
                  backgroundColor:
                    isSelected && !loadingDays
                      ? colors.primary
                      : isSelected && loadingDays
                        ? colors.disabledPrimary
                        : "transparent",
                  borderColor:
                    itemMonth === month && !isSelected
                      ? colors.calendarEnableDayBorder
                      : itemMonth !== month && !isSelected
                        ? colors.calendarDisableDayBorder
                        : loadingDays
                          ? colors.calendarDayDisabled
                          : colors.primary,
                },
              ]}
              disabled={loadingDays}
            >
              <ThemedText
                style={[
                  styles.day,
                  {
                    color:
                      itemMonth !== month && !isSelected
                        ? "gray"
                        : isSelected
                          ? "#ffffff"
                          : colors.text,
                    fontWeight: isSelected ? "bold" : "normal",
                  },
                ]}
              >
                {day}
              </ThemedText>
              {moods.map((mood) => {
                const date = new Date(mood.createdAt);
                const hour = date.getUTCHours() + date.getMinutes() / 60;
                const angle = (hour / 12) * 2 * Math.PI - Math.PI / 2;
                const r = CLOCK_RADIUS - EMOJI_SIZE / 10;
                const { x, y } = polarToCartesian(CENTER, CENTER, r, angle);
                const activeMood = activeMoods.find((m) => m.id === mood.id);
                return (
                  <View
                    key={mood.id}
                    style={[
                      styles.emojiContainer,
                      {
                        left: x - EMOJI_SIZE / 1.5,
                        top: y - EMOJI_SIZE / 1.5,
                      },
                    ]}
                  >
                    <View
                      style={{
                        position: "relative",
                      }}
                    >
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
                            backgroundColor:
                              hour < 7 || hour > 19 ? "#000" : "#fff",
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
        })}
      </View>

      <Pressable onPress={handleBackToMonth}>
        <Text style={styles.openFullArrow}>
          <MaterialCommunityIcons
            name="chevron-down"
            size={24}
            color="#000"
            style={{
              transform: [{ scaleX: 5.6 }, { scaleY: 6.9 }],
              color: colors.icon,
            }}
          />
        </Text>
      </Pressable>
    </View>
  );
}

const getStyles = (colors: ColorTheme) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 12,
      marginTop: 9,
    },
    calendarHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 8,
    },
    arrow: {
      width: 40,
      height: 40,
      alignItems: "center",
      justifyContent: "center",
    },
    iconLeft: {
      transform: [{ rotate: "270deg" }, { scaleX: 1.4 }, { scaleY: 0.8 }],
      marginLeft: 11,
    },
    iconRight: {
      transform: [{ rotate: "90deg" }, { scaleX: 1.4 }, { scaleY: 0.8 }],
      marginRight: 11,
    },
    dayNameContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 2,
    },
    dayName: {
      width: 40,
      textAlign: "center",
      color: colors.calendarDayLabels,
      fontSize: 14,
    },
    daysContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 8,
    },
    dayContainer: {
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 2,
      width: CLOCK_RADIUS * 2,
      height: CLOCK_RADIUS * 2,
      borderRadius: CLOCK_RADIUS,
      position: "relative",
    },
    day: {
      fontSize: 14,
      position: "absolute",
      alignItems: "center",
      justifyContent: "center",
    },
    emojiContainer: {
      position: "absolute",
      borderRadius: EMOJI_SIZE / 2,
      alignItems: "center",
      justifyContent: "center",
    },
    emoji: {
      fontSize: EMOJI_SIZE,
    },
    emojiLabel: {
      fontSize: 6,
      position: "absolute",
      top: 0,
      right: 0,
      borderRadius: 10,
    },
    openFullArrow: {
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      marginTop: 10,
      marginBottom: 10,
    },
  });
