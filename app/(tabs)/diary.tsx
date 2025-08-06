import { StyleSheet, View, ActivityIndicator } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import React, { useCallback, useEffect, useRef, useState } from "react";
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
import Background from "@/components/Background";
import SubscriptionErrors from "@/components/errors/SubscriptionErrors";

export default function Diary() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme] ?? Colors.system;
  const addNewEntryRef = useRef<SideSheetRef>(null);
  const subscriptionErrorsRef = useRef<SideSheetRef>(null);
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

  const offsetMinutes = new Date().getTimezoneOffset() * -1;
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const scrollRef = useRef<Animated.ScrollView>(null);
  const [loading, setLoading] = useState(true);
  const [isAddNewEntryOpen, setIsAddNewEntryOpen] = useState(false);
  const [planExpiredError, setPlanExpiredError] = useState<boolean>(false);
  const [addNewEntryButtonDisabled, setAddNewEntryButtonDisabled] =
    useState<boolean>(false);

  const handleNewEntryOpen = useCallback(() => {
    setAddNewEntryButtonDisabled(true);
    setIsAddNewEntryOpen(true);
    addNewEntryRef.current?.open();
    setTimeout(() => {
      setAddNewEntryButtonDisabled(false);
    }, 1000);
  }, []);

  const onPlanExpiredErrorOccurred = useCallback(() => {
    subscriptionErrorsRef.current?.open();
    setTimeout(() => {
      addNewEntryRef.current?.close();
    }, 100);
  }, []);

  const onSuccessRenewPlan = useCallback(() => {
    setPlanExpiredError(false);
    subscriptionErrorsRef.current?.close();
  }, []);

  const fetchDiaryEntries = async (back = false) => {
    setDiaryEntries({});

    setLoading(true);

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

  const handleBack = useCallback(
    async (back: boolean) => {
      const today = new Date().toISOString().split("T")[0];
      if (back) {
        if (today === selectedDay) {
          fetchDiaryEntries();
        } else {
          setSelectedDay(new Date().toISOString().split("T")[0]);
        }

        await fetchMoodsByDate();
        if (!loading) {
          setTimeout(() => {
            scrollRef.current?.scrollToEnd({ animated: true });
          }, 1000);
        }
      }
    },
    [selectedDay],
  );

  useEffect(() => {
    if (selectedDay && timeZone) {
      fetchDiaryEntries();
    }
  }, [selectedDay, timeZone]);

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

  const deleteEntry = useCallback(
    async (id: number) => {
      try {
        const response = await apiRequest({
          url: `/diary-entries/${id}`,
          method: "DELETE",
        });

        if (!response || response.status !== 200) {
          console.log("No data returned from server");
          return;
        }

        setDiaryEntries((prev) => {
          return {
            ...prev,
            [selectedDay]: prev[selectedDay]
              ? prev[selectedDay].filter((entry: Entry) => entry.id !== id)
              : [],
          };
        });
        await fetchMoodsByDate();
      } catch (error) {
        console.error("Error deleting entry:", error);
      }
    },
    [selectedDay],
  );

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
          />
        )}
        <ParallaxScrollView scrollRef={scrollRef}>
          <View style={{ flex: 1 }}>
            {loading ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ActivityIndicator size="large" color={colors.primary} />
              </View>
            ) : (
              (diaryEntries[selectedDay as string] &&
                diaryEntries[selectedDay as string].length > 0 &&
                diaryEntries[selectedDay as string].map((entry: Entry) => (
                  <EntryCard
                    entry={entry}
                    key={entry.id}
                    deleteEntry={deleteEntry}
                  />
                ))) || <ThemedText>{t("diary.noRecords")}</ThemedText>
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
            onPlanExpiredErrorOccurred={onPlanExpiredErrorOccurred}
          />
        </Portal>
        <Portal>
          <SubscriptionErrors
            onSuccessRenewPlan={onSuccessRenewPlan}
            ref={subscriptionErrorsRef}
            isOpen={planExpiredError}
          />
        </Portal>
      </>
      {/*)}*/}
    </Background>
  );
}

const styles = StyleSheet.create({});
