import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  View,
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  Platform,
  StyleSheet,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { useTranslation } from "react-i18next";
import type { ColorTheme } from "@/types";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { getFont } from "@/utils";

export type TextAreaProps = Omit<
  RNTextInputProps,
  "multiline" | "style" | "onChange"
> & {
  label?: string;
  helperText?: string;
  error?: string;
  minLines?: number;
  maxLines?: number;
  maxHeight?: number;
  containerStyle?: any;
  inputStyle?: any;
  labelStyle?: any;
  helperStyle?: any;
  counter?: boolean;
};

export type TextAreaHandle = {
  focus: () => void;
  blur: () => void;
  clear: () => void;
};

const DEFAULT_LINE_HEIGHT = 20; // tune if your font-size differs
const VERTICAL_PADDING = Platform.select({ ios: 0, android: 0 }) ?? 0;

const TextArea = forwardRef<TextAreaHandle, TextAreaProps>(
  (
    {
      label,
      helperText,
      error,
      minLines = 5,
      maxLines,
      maxHeight,
      value,
      onChangeText,
      placeholder,
      editable = true,
      maxLength,
      counter = true,
      containerStyle,
      inputStyle,
      labelStyle,
      helperStyle,
      ...rest
    },
    ref,
  ) => {
    const innerRef = useRef<RNTextInput>(null);
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme];
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { t } = useTranslation();
    const settings = useSelector((s: RootState) => s.settings.value);

    useImperativeHandle(ref, () => ({
      focus: () => innerRef.current?.focus(),
      blur: () => innerRef.current?.blur(),
      clear: () => innerRef.current?.clear(),
    }));

    // Compute minHeight based on line height
    const lineHeightFromStyle = useMemo(() => {
      const lh = (inputStyle && inputStyle.lineHeight) || DEFAULT_LINE_HEIGHT;
      return typeof lh === "number" ? lh : DEFAULT_LINE_HEIGHT;
    }, [inputStyle]);

    const minHeightPx = useMemo(
      () => Math.ceil(minLines * lineHeightFromStyle + VERTICAL_PADDING * 2),
      [minLines, lineHeightFromStyle],
    );

    const maxHeightPx = useMemo(() => {
      if (typeof maxHeight === "number") return maxHeight;
      if (typeof maxLines === "number") {
        return Math.ceil(maxLines * lineHeightFromStyle + VERTICAL_PADDING * 2);
      }
      return Infinity;
    }, [maxHeight, maxLines, lineHeightFromStyle]);

    const [height, setHeight] = useState(minHeightPx);
    const [scrollEnabled, setScrollEnabled] = useState(false);

    const handleContentSizeChange: NonNullable<
      RNTextInputProps["onContentSizeChange"]
    > = (e) => {
      const contentHeight = Math.ceil(
        e.nativeEvent.contentSize.height + VERTICAL_PADDING * 2,
      );
      const next = Math.max(minHeightPx, Math.min(contentHeight, maxHeightPx));
      setHeight(next);
      setScrollEnabled(contentHeight > maxHeightPx);
    };

    useEffect(() => {
      if (!value) {
        setHeight(minHeightPx);
        setScrollEnabled(false);
      }
    }, [value, minHeightPx]);

    return (
      <View style={containerStyle}>
        {label ? (
          <ThemedText
            style={[styles.label, editable ? null : styles.muted, labelStyle]}
          >
            {label}
          </ThemedText>
        ) : null}

        <View style={[styles.field, !editable && styles.fieldDisabled]}>
          <RNTextInput
            ref={innerRef}
            multiline
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={colors.inputPlaceholder}
            editable={editable}
            style={[
              styles.input,
              {
                height,
                minHeight: minHeightPx,
                textAlignVertical: "top",
                fontSize: 16,
                fontFamily: getFont(settings!.font, "regular"),
              },
              inputStyle,
            ]}
            onContentSizeChange={handleContentSizeChange}
            scrollEnabled={scrollEnabled}
            maxLength={maxLength}
            {...rest}
          />
        </View>

        {!!(
          error ||
          helperText ||
          (counter && typeof value === "string" && maxLength)
        ) && (
          <View style={styles.helperRow}>
            <ThemedText
              style={[
                styles.helper,
                error ? styles.helperError : undefined,
                helperStyle,
              ]}
            >
              {error ?? helperText}
            </ThemedText>
            {counter && typeof value === "string" && maxLength ? (
              <ThemedText style={styles.counter}>
                {value.length}/{maxLength}
              </ThemedText>
            ) : null}
          </View>
        )}
      </View>
    );
  },
);

TextArea.displayName = "TextArea";

const getStyles = (colors: ColorTheme) =>
  StyleSheet.create({
    label: { marginBottom: 10, color: colors.text },
    muted: { opacity: 0.6 },

    field: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 10,
      backgroundColor: colors.inputBackground,
      paddingHorizontal: 10,
      paddingVertical: VERTICAL_PADDING,
    },
    fieldDisabled: { opacity: 0.5 },
    fieldError: { borderColor: "#ff3b30" },

    input: {
      color: colors.text,
      lineHeight: DEFAULT_LINE_HEIGHT,
    },

    helperRow: {
      marginTop: 6,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    helper: { fontSize: 14, color: "#6b7280" },
    helperError: { color: colors.error },
    counter: { fontSize: 12, color: "#6b7280" },
  });

export default TextArea;

/**
 * Usage:
 * const [bio, setBio] = useState("");
 * <TextArea
 *   label="Describe your issue"
 *   placeholder="Give us a few details..."
 *   value={bio}
 *   onChangeText={setBio}
 *   minLines={5}
 *   maxLines={12} // optional, will enable inner scroll once exceeded
 *   maxLength={1000}
 * />
 */
