import {
  StyleSheet,
  View,
  ActivityIndicator,
  Platform,
  StatusBar,
} from "react-native";

import { ThemedText } from "@/components/ThemedText";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useEffect, useRef, useState } from "react";
import AddButton from "@/components/ui/AddButton";
import { SideSheetRef } from "@/components/SideSheet";
import AddNewEntry from "@/components/diary/add-new-entry/AddNewEntry";
import { apiRequest } from "@/utils";
import { Entry, MoodByDate } from "@/types";
import WeekView from "@/components/diary/calendar/WeekView";
import MonthView from "@/components/diary/calendar/MonthView";
import Animated from "react-native-reanimated";
import * as SecureStore from "@/utils/store/secureStore";
import { useTranslation } from "react-i18next";
import EntryCard from "@/components/diary/EntryCard";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Portal } from "@gorhom/portal";
import ViewReachEditor from "@/components/diary/ViewReachEditor";

export default function Diary() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const addNewEntryRef = useRef<SideSheetRef>(null);
  const [selectedDay, setSelectedDay] = useState<
    string | number | Date | undefined
  >(new Date().toISOString().split("T")[0]);
  const [weekAnchorDay, setWeekAnchorDay] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [diaryEntries, setDiaryEntries] = useState<Record<string, Entry[]>>({});
  const [month, setMonth] = useState<number | null>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number | null>(new Date().getFullYear());
  const [moodsByDate, setMoodsByDate] = useState<Record<string, MoodByDate[]>>(
    {},
  );
  const [showWeek, setShowWeek] = useState(false);
  const [expanded, setExpanded] = useState<{ [key: number]: boolean }>({});

  const offsetMinutes = new Date().getTimezoneOffset() * -1;
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const scrollRef = useRef<Animated.ScrollView>(null);
  const [loading, setLoading] = useState(true);
  const [justAddedTodayEntry, setJustAddedTodayEntry] = useState(false);
  const [isAddNewEntryOpen, setIsAddNewEntryOpen] = useState(false);

  const handleNewEntryOpen = () => {
    setIsAddNewEntryOpen(true);
    addNewEntryRef.current?.open();
  };

  const fetchDiaryEntries = async (back = false) => {
    if (justAddedTodayEntry) return;

    const user = await SecureStore.getItemAsync("user");

    if (!user) return;

    if (!back) {
      setLoading(true);
    }

    try {
      const response = await apiRequest({
        url: "/diary-entries/get-by-date",
        method: "POST",
        data: {
          date: selectedDay,
          timeZone,
        },
      });

      setDiaryEntries((prev) => ({
        ...prev,
        [selectedDay?.toString() || "unknown"]: response.data,
      }));

      setWeekAnchorDay(selectedDay as string);
      setShowWeek(true);
    } catch (error) {
      console.error("Error fetching diary entries:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = async (back: boolean) => {
    if (back) {
      await fetchDiaryEntries(back);
      await fetchMoodsByDate();

      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 0);
    }
  };

  useEffect(() => {
    if (selectedDay && timeZone) {
      fetchDiaryEntries();
    }
  }, [selectedDay, timeZone]);

  useEffect(() => {
    if (justAddedTodayEntry) {
      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
        setJustAddedTodayEntry(false);
      }, 100);
    }
  }, [justAddedTodayEntry]);

  const fetchMoodsByDate = async () => {
    const user = await SecureStore.getItemAsync("user");

    if (!user) return;
    try {
      const response = await apiRequest({
        url: "/diary-entries/get-moods-by-date",
        method: "POST",
        data: {
          month,
          year,
          offsetMinutes,
        },
      });

      setMoodsByDate(response.data);
    } catch (error) {
      console.error("Error fetching moods by date:", error);
    }
  };

  useEffect(() => {
    fetchMoodsByDate();
  }, [month, year, offsetMinutes]);

  const tabBarHeight = useBottomTabBarHeight();

  // useEffect(() => {
  //   setMoodsByDate(moodsArrayToDict(moodsByDateBeforeConvert));
  // }, [moodsByDateBeforeConvert]);

  return (
    <View
      style={{
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        backgroundColor: colors.background,
      }}
    >
      {loading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <>
          {!showWeek ? (
            <MonthView
              selectedDay={selectedDay}
              onDayPress={(dayStr: string) => {
                setSelectedDay(dayStr);
                setWeekAnchorDay(dayStr);
                setShowWeek(true);
              }}
              moodsByDate={moodsByDate}
              setMonth={setMonth}
              setYear={setYear}
              setShowWeek={setShowWeek}
            />
          ) : (
            <WeekView
              weekAnchorDay={weekAnchorDay}
              setWeekAnchorDay={setWeekAnchorDay}
              selectedDay={selectedDay}
              setSelectedDay={setSelectedDay}
              moodsByDate={moodsByDate}
              setMonth={setMonth}
              setYear={setYear}
              onBackToMonth={() => setShowWeek(false)}
            />
          )}
          <ParallaxScrollView scrollRef={scrollRef}>
            <View style={{ flex: 1 }}>
              {(diaryEntries[selectedDay as string] &&
                diaryEntries[selectedDay as string].length > 0 &&
                diaryEntries[selectedDay as string].map((entry: Entry) => (
                  <EntryCard entry={entry} key={entry.id} />
                ))) || <ThemedText>{t("diary.noRecords")}</ThemedText>}
            </View>
          </ParallaxScrollView>
          <AddButton onPress={handleNewEntryOpen} />
          <Portal>
            <AddNewEntry
              ref={addNewEntryRef}
              isOpen={isAddNewEntryOpen}
              handleBack={(back) => handleBack(back)}
              tabBarHeight={tabBarHeight}
            />
          </Portal>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({});
