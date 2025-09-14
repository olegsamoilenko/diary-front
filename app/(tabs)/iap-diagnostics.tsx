// app/(tabs)/iap-diagnostics.tsx
import React, { useEffect, useState } from "react";
import { View, Text, Button, ScrollView } from "react-native";
import { useIap } from "@/context/IapContext";
import { getProductTitle, getProductPrice } from "@/utils";

export default function IapDiagnostics() {
  const { connected, products, restore, buySubById } = useIap();

  const [log, setLog] = useState<string[]>([]);
  const add = (m: string) =>
    setLog((prev) => [`${new Date().toISOString()}  ${m}`, ...prev]);

  useEffect(() => add(`connected = ${connected}`), [connected]);

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 8 }}>
        IAP diagnostics
      </Text>
      <Text>connected: {String(connected)}</Text>
      <Text>products: {products.length}</Text>

      <View style={{ height: 12 }} />
      <Button
        title="REFRESH CATALOG"
        onPress={() => restore().then(() => add("refreshed"))}
      />

      <View style={{ height: 12 }} />
      {products.map((p) => (
        <View key={p.id} style={{ paddingVertical: 8 }}>
          <Text>{getProductTitle(p)}</Text>
          <Text>{getProductPrice(p)}</Text>
          <Button title={`Buy ${p.id}`} onPress={() => buySubById(p.id)} />
        </View>
      ))}

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
