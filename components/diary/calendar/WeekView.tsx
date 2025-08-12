import React from "react";
import { View, Text, Pressable } from "react-native";
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
import { Entry, MoodByDate } from "@/types";
import { getEmojiByMood } from "@/constants/Mood";
import { CENTER, CLOCK_RADIUS, EMOJI_SIZE } from "@/constants/Calendar";
import { ThemedText } from "@/components/ThemedText";

function getWeekDates(
  selectedDate: string | number | Date,
  firstDayOfWeek = 1,
) {
  const date = new Date(selectedDate);
  let weekDay = date.getDay(); // 0 (Sun) ... 6 (Sat)
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
  selectedDay: string | number | Date | undefined;
  setSelectedDay: (day: string | undefined) => void;
  moodsByDate: Record<string, MoodByDate[] | undefined>;
  setMonth: (month: number) => void;
  setYear: (year: number) => void;
  onBackToMonth: () => void;
  loadingDays: boolean;
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
}: WeekViewProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const localeArr = Localization.getLocales();
  const locale = localeArr!.find((loc) => {
    return loc.languageCode === (i18n.language || "uk");
  })?.languageTag;
  const firstDayOfWeek = FIRST_DAY_BY_LOCALE[locale!] ?? 1;
  const lang = i18n.language || "uk";

  const weekDates = getWeekDates(weekAnchorDay, firstDayOfWeek);

  const weekdayLabels = getWeekdayLabels(lang, firstDayOfWeek);

  const monthYearStr = getMonthYearStr(weekDates[3], lang);

  const prevWeek = () => {
    const newDate = addDays(weekDates[0], -7);
    setWeekAnchorDay(newDate);
    setSelectedDay(undefined);

    const { month, year } = getNumbersMonthAndYear(newDate);
    setMonth(month);
    setYear(year);
  };
  const nextWeek = () => {
    const newDate = addDays(weekDates[0], 7);
    setWeekAnchorDay(newDate);
    setSelectedDay(undefined);

    const { month, year } = getNumbersMonthAndYear(newDate);
    setMonth(month);
    setYear(year);
  };

  const handleDayPress = (item: string) => {
    setSelectedDay(item);
  };

  return (
    <View style={{ paddingHorizontal: 12, marginTop: 9 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <Pressable
          onPress={prevWeek}
          style={{
            width: 40,
            height: 40,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MaterialCommunityIcons
            name="triangle"
            size={12}
            color={colors.primary}
            style={{
              transform: [
                { rotate: "270deg" },
                { scaleX: 1.4 },
                { scaleY: 0.8 },
              ],
              marginLeft: 11,
            }}
          />
        </Pressable>
        <ThemedText style={{ fontSize: 18 }}>
          {monthYearStr.slice(0, 1).toUpperCase() + monthYearStr.slice(1)}
        </ThemedText>
        <Pressable
          onPress={nextWeek}
          style={{
            width: 40,
            height: 40,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MaterialCommunityIcons
            name="triangle"
            size={12}
            color={colors.primary}
            style={{
              transform: [
                { rotate: "90deg" },
                { scaleX: 1.4 },
                { scaleY: 0.8 },
              ],
              marginRight: 11,
            }}
          />
        </Pressable>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 2,
        }}
      >
        {weekdayLabels.map((label, i) => (
          <ThemedText
            key={label}
            style={{
              width: 40,
              textAlign: "center",
              color: colors.calendarDayLabels,
              fontSize: 14,
            }}
          >
            {label}
          </ThemedText>
        ))}
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingVertical: 8,
        }}
      >
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
              style={{
                alignItems: "center",
                justifyContent: "center",
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
                borderWidth: 2,
                width: CLOCK_RADIUS * 2,
                height: CLOCK_RADIUS * 2,
                borderRadius: CLOCK_RADIUS,
                position: "relative",
              }}
              disabled={loadingDays}
            >
              <ThemedText
                style={{
                  color:
                    itemMonth !== month && !isSelected
                      ? "gray"
                      : isSelected
                        ? "#ffffff"
                        : colors.text,
                  fontWeight: isSelected ? "bold" : "normal",
                  fontSize: 14,
                  position: "absolute",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {day}
              </ThemedText>
              {moods.map((mood, idx) => {
                const date = new Date(mood.createdAt);
                const hour = date.getUTCHours() + date.getMinutes() / 60;
                const angle = (hour / 12) * 2 * Math.PI - Math.PI / 2;
                const r = CLOCK_RADIUS - EMOJI_SIZE / 10;
                const { x, y } = polarToCartesian(CENTER, CENTER, r, angle);
                return (
                  <View
                    key={idx}
                    style={{
                      position: "absolute",
                      left: x - EMOJI_SIZE / 1.5,
                      top: y - EMOJI_SIZE / 1.5,
                      borderRadius: EMOJI_SIZE / 2,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <View
                      style={{
                        position: "relative",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: EMOJI_SIZE,
                          zIndex: Math.round(hour),
                        }}
                      >
                        {mood.mood}
                      </Text>
                      <Text
                        style={{
                          fontSize: 6,
                          position: "absolute",
                          top: 0,
                          right: 0,
                          zIndex: 1 + Math.round(hour),
                          backgroundColor:
                            hour < 7 || hour > 19 ? "#000" : "#fff",
                          borderRadius: 10,
                        }}
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

      <Pressable onPress={onBackToMonth}>
        <Text
          style={{
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            marginTop: 10,
            marginBottom: 10,
            color: "#888",
          }}
        >
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
