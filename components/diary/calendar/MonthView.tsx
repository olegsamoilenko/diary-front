import { Colors } from "@/constants/Colors";
import { Pressable, Text, View } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { useColorScheme } from "@/hooks/useColorScheme";
import * as Localization from "expo-localization";
import { FIRST_DAY_BY_LOCALE } from "@/constants/FirstDayByLocale";
import i18n from "i18next";
import { MoodByDate } from "@/types";
import { getEmojiByMood } from "@/constants/Mood";
import React from "react";
import { getMonthYearStr, getWeekdayLabels, polarToCartesian } from "@/utils";
import { CENTER, CLOCK_RADIUS, EMOJI_SIZE } from "@/constants/Calendar";
import { ThemedText } from "@/components/ThemedText";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { getFont } from "@/utils/common/getFont";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type MonthViewProps = {
  selectedDay: string | number | Date | undefined;
  onDayPress: (day: string) => void;
  moodsByDate: Record<string, MoodByDate[] | undefined>;
  setMonth: (month: number) => void;
  setYear: (year: number) => void;
  setShowWeek: (show: boolean) => void;
};
export default function MonthView({
  selectedDay,
  moodsByDate,
  onDayPress,
  setMonth,
  setYear,
  setShowWeek,
}: MonthViewProps) {
  const lang = i18n.language || "uk";
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const localeArr = Localization.getLocales();
  const locale =
    localeArr!.find((loc) => loc.languageCode === lang)?.languageTag ?? "en-US";
  const firstDayOfWeek = FIRST_DAY_BY_LOCALE[locale] ?? 1;
  const key = `${i18n.language || "uk"}-${colorScheme}`;
  const font = useSelector((state: RootState) => state.font);

  const weekdayLabels = getWeekdayLabels(lang, firstDayOfWeek);
  return (
    <View
      style={{
        position: "relative",
      }}
    >
      <View
        style={{
          position: "absolute",
          left: 0,
          top: 50,
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 5,
          width: "100%",
          zIndex: 200,
        }}
      >
        {weekdayLabels.map((label, idx) => (
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
        key={key}
        firstDay={firstDayOfWeek}
        hideDayNames={true}
        theme={{
          calendarBackground: colors.calendarBackground,
          arrowColor: colors.primary,
          monthTextColor: colors.text,
          textDayHeaderFontFamily: getFont(font, "regular"),
        }}
        onMonthChange={(obj) => {
          setMonth(obj.month);
          setYear(obj.year);
        }}
        renderArrow={(direction) => (
          <MaterialCommunityIcons
            name="triangle"
            size={12}
            color={colors.primary}
            style={{
              marginHorizontal: 10,
              marginBottom: 40,
              transform:
                direction === "left"
                  ? [{ rotate: "270deg" }, { scaleX: 1.4 }, { scaleY: 0.8 }]
                  : [{ rotate: "90deg" }, { scaleX: 1.4 }, { scaleY: 0.8 }],
            }}
          />
        )}
        renderHeader={(date) => {
          const dt = new Date(date);
          const monthYearStr = dt.toLocaleString(lang, {
            month: "long",
            year: "numeric",
          });

          return (
            <View style={{}}>
              <ThemedText
                style={{
                  fontSize: 18,
                  textAlign: "center",
                  marginBottom: 40,
                }}
              >
                {monthYearStr.slice(0, 1).toUpperCase() + monthYearStr.slice(1)}
              </ThemedText>
            </View>
          );
        }}
        dayComponent={({ date, state }) => {
          if (!date) return null;
          const moods = moodsByDate[date.dateString] || [];
          return (
            <Pressable
              onPress={() => onDayPress(date.dateString)}
              style={{
                alignItems: "center",
                justifyContent: "center",
                backgroundColor:
                  selectedDay === date.dateString
                    ? colors.primary
                    : "transparent",
                borderRadius: 100,
                position: "relative",
                width: "80%",
                height: 37,
                borderWidth: 2,
                borderColor:
                  state === "disabled"
                    ? colors.calendarDisableDayBorder
                    : selectedDay === date.dateString
                      ? colors.primary
                      : colors.calendarEnableDayBorder,
              }}
            >
              <ThemedText
                style={{
                  color:
                    state === "disabled"
                      ? "gray"
                      : selectedDay === date.dateString
                        ? "#ffffff"
                        : colors.text,
                  position: "absolute",
                  zIndex: 100,
                }}
              >
                {date.day}
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
        }}
      />
    </View>
  );
}
