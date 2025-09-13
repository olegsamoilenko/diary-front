// app/(tabs)/iap-diagnostics.tsx
import React, { useEffect, useState } from "react";
import { View, Text, Button, ScrollView } from "react-native";
import { useIAP } from "react-native-iap";

// підстав свої айдішки
const INAPP_SKUS = ["your.inapp.sku"];
const SUB_SKUS = ["your.sub.sku"];

export default function IapDiagnostics() {
  const {
    connected,
    products,
    fetchProducts,
    requestPurchase,
    currentPurchase,
    finishTransaction,
  } = useIAP(); // <-- викликаємо ОДИН раз, на верхньому рівні

  const [log, setLog] = useState<string[]>([]);
  const add = (m: string) =>
    setLog((prev) => [`${new Date().toISOString()}  ${m}`, ...prev]);

  useEffect(() => {
    add(`connected = ${connected}`);
  }, [connected]);

  // локальна перевірка фетчу (у Play-збірці тут з’являться реальні товари)
  const tryFetch = async () => {
    try {
      // можна викликати окремо для subs/inapp
      await fetchProducts({ skus: SUB_SKUS, type: "subs" });
      await fetchProducts({ skus: INAPP_SKUS, type: "inapp" });
      add(`products.length = ${products.length}`);
      const subsCount = products.filter((p: any) =>
        Array.isArray(p.subscriptionOfferDetails),
      ).length;
      add(`subs (фільтр) = ${subsCount}`);
    } catch (e: any) {
      add(`fetch error: ${e?.message || String(e)}`);
    }
  };

  // у локальному білді очікуємо керовану помилку (без креша)
  const tryPurchase = async () => {
    try {
      const sku = SUB_SKUS[0] || INAPP_SKUS[0];
      if (!sku) return add("SKU не задані");

      await requestPurchase({
        request: {
          android: { skus: [sku] },
          ios: { sku },
        },
      });
    } catch (e: any) {
      add(
        `requestPurchase error (очікувано локально): ${e?.message || String(e)}`,
      );
    }
  };

  // на Play-збірці це спрацює після тестової покупки
  useEffect(() => {
    const handle = async () => {
      if (!currentPurchase) return;
      try {
        add(`purchase completed: ${currentPurchase.id}`);
        await finishTransaction({
          purchase: currentPurchase,
          isConsumable: false,
        });
        add("finishTransaction OK");
      } catch (e: any) {
        add(`finishTransaction error: ${e?.message || String(e)}`);
      }
    };
    handle();
  }, [currentPurchase]);

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 8 }}>
        IAP diagnostics
      </Text>
      <Text>connected: {String(connected)}</Text>
      <Text>products: {products.length}</Text>

      <View style={{ height: 12 }} />
      <Button title="CHECK PRODUCTS" onPress={tryFetch} />
      <View style={{ height: 8 }} />
      <Button
        title="TRY PURCHASE (EXPECT ERROR LOCALLY)"
        onPress={tryPurchase}
      />

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
