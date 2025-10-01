// app/(tabs)/iap-diagnostics.tsx
import React, { useEffect, useState } from "react";
import { View, Text, Button, ScrollView, Alert } from "react-native";
import { useIap } from "@/context/IapContext";
import { getProductTitle, getProductPrice } from "@/utils";
import { fetchProducts } from "react-native-iap";

const SUB_SKUS = ["nemory_lite", "nemory_base", "nemory_pro"];
export default function IapDiagnostics() {
  const { connected, restore } = useIap();

  const [log, setLog] = useState<string[]>([]);
  const add = (m: string) =>
    setLog((prev) => [`${new Date().toISOString()}  ${m}`, ...prev]);

  useEffect(() => add(`connected = ${connected}`), [connected]);

  const testFetchOnce = async () => {
    try {
      const subs = await fetchProducts({ skus: SUB_SKUS, type: "subs" });
      Alert.alert("Direct fetch", `Count: ${subs?.length ?? 0}`);
    } catch (e: any) {
      console.warn("[IAP] DIRECT fetch error:", e?.message || String(e));
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{ padding: 16 }}
      showsVerticalScrollIndicator={false}
    >
      <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 8 }}>
        IAP diagnostics
      </Text>
      <Text>connected: {String(connected)}</Text>

      <View style={{ height: 12 }} />
      <Button
        title="REFRESH CATALOG"
        onPress={() => restore().then(() => add("refreshed"))}
      />

      <View style={{ height: 12 }} />

      <View style={{ height: 12 }} />

      <View style={{ height: 12 }} />
      <Button title="Test Fetch Once" onPress={() => testFetchOnce()} />

      <View style={{ height: 16 }} />
      <Text style={{ fontWeight: "700", marginBottom: 8 }}>Log:</Text>
      {log.map((l, i) => (
        <Text key={i} style={{ fontFamily: "monospace", marginBottom: 4 }}>
          {l}
        </Text>
      ))}
    </ScrollView>
  );
}
