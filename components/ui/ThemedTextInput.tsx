import React, { useEffect } from "react";
import { TextInput, TextInputProps, View } from "react-native";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useUIStyles } from "@/hooks/useUIStyles";
import { ThemedText } from "@/components/ThemedText";

type Props = TextInputProps & {
  name: string;
  touched?: { [field: string]: boolean };
  errors?: { [field: string]: string };
  errorMessage?: string | null;
  inputStyle?: object;
  containerStyle?: object;
  errorStyle?: object;
};

export default function ThemedTextInput({
  name,
  touched,
  errors,
  errorMessage,
  inputStyle,
  containerStyle,
  errorStyle,
  ...props
}: Props) {
  const scheme = useColorScheme();
  const colors = Colors[scheme];
  const ui = useUIStyles();
  return (
    <View style={containerStyle}>
      <TextInput
        {...props}
        style={[ui.input, inputStyle, { marginBottom: 4 }]}
        placeholderTextColor={
          props.placeholderTextColor ?? colors.inputPlaceholder
        }
      />
      {touched && touched[name] && errors && errors[name] && (
        <ThemedText
          type="small"
          style={[
            errorStyle,
            {
              color: colors.error,
            },
          ]}
        >
          {errors[name]}
        </ThemedText>
      )}
      {errorMessage && (
        <ThemedText
          type="small"
          style={[
            errorStyle,
            {
              color: colors.error,
            },
          ]}
        >
          {errorMessage}
        </ThemedText>
      )}
    </View>
  );
}
