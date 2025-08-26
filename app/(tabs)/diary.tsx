import {
  StyleSheet,
  View,
  ActivityIndicator,
  InteractionManager,
} from "react-native";

import { ThemedText } from "@/components/ThemedText";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import AddButton from "@/components/ui/AddButton";
import { SideSheetRef } from "@/components/SideSheet";
import AddNewEntry from "@/components/diary/add-new-entry/AddNewEntry";
import { apiRequest } from "@/utils";
import { Entry, MoodByDate, type User } from "@/types";
import WeekView from "@/components/diary/calendar/WeekView";
import MonthView from "@/components/diary/calendar/MonthView";
import Animated from "react-native-reanimated";
import { useTranslation } from "react-i18next";
import EntryCard from "@/components/diary/EntryCard";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Portal } from "@gorhom/portal";
import Background from "@/components/Background";
import WelcomeModal from "@/components/diary/WelcomeModal";
import Toast from "react-native-toast-message";
import { UserEvents } from "@/utils/events/userEvents";

function localISODate(d = new Date()) {
  const dt = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return dt.toISOString().slice(0, 10);
}

export default function Diary() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const addNewEntryRef = useRef<SideSheetRef>(null);
  const scrollRef = useRef<Animated.ScrollView>(null);

  const initialDay = useRef(localISODate()).current;
  const [selectedDay, setSelectedDay] = useState<string>(initialDay);
  const [weekAnchorDay, setWeekAnchorDay] = useState<string>(initialDay);
  const [diaryEntries, setDiaryEntries] = useState<Record<string, Entry[]>>({});
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [moodsByDate, setMoodsByDate] = useState<Record<string, MoodByDate[]>>(
    {},
  );
  const [showWeek, setShowWeek] = useState(false);
  const [initialDate, setInitialDate] = useState<string>(initialDay);

  const offsetMinutes = useMemo(() => -new Date().getTimezoneOffset(), []);
  const timeZone = useMemo(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone,
    [],
  );

  const [loading, setLoading] = useState(true);
  const [isAddNewEntryOpen, setIsAddNewEntryOpen] = useState(false);
  const [addNewEntryButtonDisabled, setAddNewEntryButtonDisabled] =
    useState(false);
  const [activeMoods, setActiveMoods] = useState<{ id: number }[]>([]);

  useEffect(() => {
    setActiveMoods([]);
  }, [selectedDay]);

  const openingRef = useRef(false);

  const handleNewEntryOpen = useCallback(() => {
    if (openingRef.current) return;
    openingRef.current = true;
    setAddNewEntryButtonDisabled(true);
    setIsAddNewEntryOpen(true);
    addNewEntryRef.current?.open();
    setTimeout(() => {
      openingRef.current = false;
      setAddNewEntryButtonDisabled(false);
      setSelectedDay(initialDay);
    }, 1000);
  }, [initialDay]);

  const reqIdRef = useRef(0);

  const fetchDiaryEntriesFor = useCallback(
    async (day: string) => {
      const id = ++reqIdRef.current;
      setLoading(true);
      try {
        const response = await apiRequest({
          url: "/diary-entries/get-by-date",
          method: "POST",
          data: { date: day, timeZone },
        });
        if (id !== reqIdRef.current) return;
        setDiaryEntries((prev) => ({
          ...prev,
          [day]: response.data,
        }));
        setWeekAnchorDay(day);
        setShowWeek(true);
      } catch (e) {
        if (id === reqIdRef.current) {
          console.error("Error fetching diary entries:", e);
        }
      } finally {
        if (id === reqIdRef.current) setLoading(false);
      }
    },
    [timeZone],
  );

  useEffect(() => {
    fetchDiaryEntriesFor(selectedDay);
  }, [fetchDiaryEntriesFor, selectedDay]);

  const fetchMoodsByDate = useCallback(async () => {
    try {
      const response = await apiRequest({
        url: "/diary-entries/get-moods-by-date",
        method: "POST",
        data: { month, year, offsetMinutes },
      });
      setMoodsByDate(response.data);
    } catch (e) {
      console.error("Error fetching moods by date:", e);
    }
  }, [month, year, offsetMinutes]);

  useEffect(() => {
    fetchMoodsByDate();
  }, [fetchMoodsByDate]);

  const updateDiary = useCallback(() => {
    fetchMoodsByDate();
    fetchDiaryEntriesFor(selectedDay);
  }, []);

  useEffect(() => {
    const handler = () => updateDiary();
    UserEvents.on("userLoggedIn", handler);
    return () => UserEvents.off("userLoggedIn", handler);
  }, []);

  const handleBack = useCallback(
    async (back: boolean) => {
      if (!back) return;

      setIsAddNewEntryOpen(false);

      const today = initialDay;

      if (selectedDay === today) {
        await fetchDiaryEntriesFor(today);
      } else {
        setSelectedDay(today);
      }

      await fetchMoodsByDate();

      InteractionManager.runAfterInteractions(() => {
        setTimeout(() => {
          scrollRef.current?.scrollToEnd({ animated: true });
        }, 50);
      });
    },
    [selectedDay, fetchDiaryEntriesFor, fetchMoodsByDate, initialDay],
  );

  const tabBarHeight = useBottomTabBarHeight();

  const deleteEntry = useCallback(
    async (id: number) => {
      try {
        const response = await apiRequest({
          url: `/diary-entries/${id}`,
          method: "DELETE",
        });
        if (response?.status !== 200) {
          console.log("No data returned from server");
          return;
        }
        setDiaryEntries((prev) => ({
          ...prev,
          [selectedDay]: prev[selectedDay]?.filter((e) => e.id !== id) ?? [],
        }));
        Toast.show({
          type: "success",
          text1: t(`diary.entry.entryDeleted`),
          text2: t(`diary.entry.youHaveSuccessfullyDeletedThisEntry`),
        });
        await fetchMoodsByDate();
      } catch (e) {
        console.error("Error deleting entry:", e);
      }
    },
    [selectedDay, fetchMoodsByDate],
  );

  const entriesForDay = diaryEntries[selectedDay] ?? [];

  return (
    <Background background={colors.backgroundImage} paddingTop={40}>
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
            initialDate={initialDate}
            activeMoods={activeMoods}
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
            loadingDays={loading}
            setInitialDate={setInitialDate}
            activeMoods={activeMoods}
          />
        )}
        <ParallaxScrollView scrollRef={scrollRef}>
          <View style={{ flex: 1 }}>
            {loading ? (
              <View style={styles.activeIndicatorContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
              </View>
            ) : entriesForDay.length ? (
              entriesForDay.map((entry) => (
                <EntryCard
                  entry={entry}
                  key={entry.id}
                  deleteEntry={deleteEntry}
                  setActiveMoods={setActiveMoods}
                />
              ))
            ) : (
              <ThemedText>{t("diary.noRecords")}</ThemedText>
            )}
          </View>
        </ParallaxScrollView>
        <AddButton
          onPress={handleNewEntryOpen}
          addNewEntryButtonDisabled={addNewEntryButtonDisabled}
        />
        <Portal>
          <AddNewEntry
            ref={addNewEntryRef}
            isOpen={isAddNewEntryOpen}
            handleBack={(back) => handleBack(back)}
            tabBarHeight={tabBarHeight}
          />
        </Portal>
      </>
      <WelcomeModal />
    </Background>
  );
}

const styles = StyleSheet.create({
  activeIndicatorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
