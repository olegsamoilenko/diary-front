import React, { useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  Modal,
  FlatList,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { useTranslation } from "react-i18next";
import type { ColorTheme } from "@/types";
import { ThemedText } from "../ThemedText";

export type SelectOption<V extends string | number = string> = {
  key: string;
  value: V;
  disabled?: boolean;
};

export type SelectProps<V extends string | number = string> = {
  value?: V | null;
  onChange: (value: V | null, option: SelectOption<V> | null) => void;
  options: SelectOption<V>[];
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  helperText?: string;
  error?: string;
  // Styling hooks
  style?: any;
  triggerStyle?: any;
  triggerTextStyle?: any;
  modalStyle?: any;
  optionStyle?: any;
  optionTextStyle?: any;
  listEmptyText?: string;
};

export function CustomSelect<V extends string | number = string>({
  value,
  onChange,
  options,
  placeholder = "Select...",
  label,
  disabled,
  searchable = true,
  clearable = true,
  helperText,
  error,
  style,
  triggerStyle,
  triggerTextStyle,
  modalStyle,
  optionStyle,
  optionTextStyle,
  listEmptyText = "No options",
}: SelectProps<V>) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const styles = useMemo(() => getStyles(colors), [colors]);
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<TextInput>(null);

  const selected = useMemo(
    () => options.find((o) => o.value === value),
    [options, value],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) =>
      [o.key, String(o.value)].some((f) => f.toLowerCase().includes(q)),
    );
  }, [query, options]);

  const openModal = () => {
    if (disabled) return;
    setOpen(true);
    requestAnimationFrame(() => {
      if (searchable) inputRef.current?.focus();
    });
  };

  const closeModal = () => {
    setOpen(false);
    setQuery("");
  };

  const handleSelect = (opt: SelectOption<V>) => {
    if (opt.disabled) return;
    onChange(opt.value, opt);
    closeModal();
  };

  const handleClear = () => {
    onChange(null, null);
    closeModal();
  };

  return (
    <View style={style}>
      {label ? (
        <ThemedText style={[styles.label, disabled && styles.muted]}>
          {label}
        </ThemedText>
      ) : null}

      {/* Trigger */}
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        onPress={openModal}
        style={({ pressed }) => [
          styles.trigger,
          disabled && styles.triggerDisabled,
          pressed && !disabled && styles.triggerPressed,
          triggerStyle,
        ]}
      >
        <ThemedText
          numberOfLines={1}
          ellipsizeMode="tail"
          style={[
            styles.triggerText,
            !selected && styles.placeholder,
            triggerTextStyle,
          ]}
        >
          {selected ? t(`settings.support.${selected.key}`) : placeholder}
        </ThemedText>
        <ThemedText style={styles.chevron}>▾</ThemedText>
      </Pressable>

      {/* Helper / Error */}
      {!!(error || helperText) && (
        <ThemedText
          style={[styles.helper, error ? styles.helperError : undefined]}
        >
          {error ?? helperText}
        </ThemedText>
      )}

      {/* Modal */}
      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <KeyboardAvoidingView
          behavior={Platform.select({ ios: "padding", android: undefined })}
          style={styles.backdrop}
        >
          <Pressable style={styles.backdropTouchable} onPress={closeModal} />

          <View style={[styles.sheet, modalStyle]}>
            {/* Header */}
            <View style={styles.sheetHeader}>
              <ThemedText style={styles.sheetTitle}>
                {label || t("common.select" + "...")}
              </ThemedText>
              <Pressable onPress={closeModal} hitSlop={12}>
                <ThemedText style={styles.sheetClose}>✕</ThemedText>
              </Pressable>
            </View>

            {/* Search */}
            {searchable && (
              <View style={styles.searchWrap}>
                <TextInput
                  ref={inputRef}
                  value={query}
                  onChangeText={setQuery}
                  placeholder="Search"
                  placeholderTextColor="#8a8a8e"
                  style={styles.searchInput}
                  returnKeyType="done"
                />
                {clearable && selected && (
                  <Pressable onPress={handleClear} style={styles.clearBtn}>
                    <ThemedText style={styles.clearText}>Clear</ThemedText>
                  </Pressable>
                )}
              </View>
            )}

            {/* List */}
            <FlatList
              data={filtered}
              keyExtractor={(item) => String(item.value)}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingBottom: 8 }}
              ListEmptyComponent={
                <View style={styles.emptyWrap}>
                  <ThemedText style={styles.emptyText}>
                    {listEmptyText}
                  </ThemedText>
                </View>
              }
              renderItem={({ item }) => {
                const isSelected = item.value === selected?.value;
                return (
                  <Pressable
                    onPress={() => handleSelect(item)}
                    disabled={item.disabled}
                    style={({ pressed }) => [
                      styles.option,
                      item.disabled && styles.optionDisabled,
                      pressed && !item.disabled && styles.optionPressed,
                      optionStyle,
                    ]}
                  >
                    <ThemedText
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={[styles.optionText, optionTextStyle]}
                    >
                      {t(`settings.support.${item.key}`)}
                    </ThemedText>
                    {isSelected ? (
                      <ThemedText style={styles.check}>✓</ThemedText>
                    ) : null}
                  </Pressable>
                );
              }}
            />
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const getStyles = (colors: ColorTheme) =>
  StyleSheet.create({
    label: {
      marginBottom: 10,
    },
    muted: { opacity: 0.6 },
    trigger: {
      minHeight: 44,
      paddingHorizontal: 12,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 10,
      backgroundColor: colors.inputBackground,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    triggerPressed: { opacity: 0.9 },
    triggerDisabled: { opacity: 0.5 },
    triggerError: { borderColor: "#ff3b30" },
    triggerText: {
      flex: 1,
      fontSize: 16,
      color: colors.text,
      marginRight: 8,
    },
    placeholder: { color: colors.inputPlaceholder },
    chevron: { fontSize: 16, color: colors.inputPlaceholder },
    helper: { marginTop: 6, fontSize: 14, color: "#6b7280" },
    helperError: { color: colors.error },

    backdrop: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.3)",
      justifyContent: "flex-end",
    },
    backdropTouchable: { flex: 1 },
    sheet: {
      backgroundColor: colors.modalBackground,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      paddingBottom: 8,
      maxHeight: "70%",
    },
    sheetHeader: {
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 8,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    sheetTitle: { fontSize: 16, fontWeight: "600", color: colors.text },
    sheetClose: { fontSize: 20, color: colors.icon },

    searchWrap: {
      paddingHorizontal: 16,
      paddingBottom: 8,
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    searchInput: {
      flex: 1,
      height: 40,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: "#e5e7eb",
      paddingHorizontal: 12,
      fontSize: 16,
      backgroundColor: "#fafafa",
      color: "#111",
    },
    clearBtn: { marginLeft: 8, paddingHorizontal: 8, paddingVertical: 6 },
    clearText: { color: "#2563eb", fontSize: 14 },

    option: {
      minHeight: 46,
      paddingHorizontal: 16,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    optionDisabled: { opacity: 0.5 },
    optionPressed: { backgroundColor: colors.backgroundAdditional },
    optionText: { fontSize: 16, color: colors.text, flex: 1, marginRight: 8 },
    check: { fontSize: 16, color: colors.icon },

    emptyWrap: { padding: 24, alignItems: "center" },
    emptyText: { color: "#6b7280" },
  });

export default CustomSelect;

/**
 * Usage example:
 *
 * const [val, setVal] = useState<string | null>(null);
 * const options = [
 *   { label: 'Ukraine', value: 'UA' },
 *   { label: 'United States', value: 'US' },
 *   { label: 'Poland', value: 'PL' },
 * ];
 *
 * <Select
 *   label="Country"
 *   value={val}
 *   onChange={(v) => setVal(v)}
 *   options={options}
 *   searchable
 *   clearable
 * />
 */
