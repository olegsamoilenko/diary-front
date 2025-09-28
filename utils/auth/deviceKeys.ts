import "react-native-get-random-values";
import nacl from "tweetnacl";
import * as util from "tweetnacl-util";
import * as SecureStore from "expo-secure-store";
import * as ExpoCrypto from "expo-crypto";

const SK_KEY = "device_sk_b64";
const PK_KEY = "device_pk_b64";

(function ensurePrng() {
  const g: any = globalThis as any;
  const hasGRV = !!g?.crypto?.getRandomValues;
  const hasSetPRNG = typeof (nacl as any).setPRNG === "function";

  if (!hasGRV && hasSetPRNG) {
    (nacl as any).setPRNG((x: Uint8Array, n: number) => {
      const bytes = ExpoCrypto.getRandomBytes(n);

      for (let i = 0; i < n; i++) x[i] = bytes[i];
    });
  }
})();

export async function ensureDeviceKeypair() {
  let sk = await SecureStore.getItemAsync(SK_KEY);
  let pk = await SecureStore.getItemAsync(PK_KEY);
  if (!sk || !pk) {
    const kp = nacl.sign.keyPair();
    sk = util.encodeBase64(kp.secretKey);
    pk = util.encodeBase64(kp.publicKey);
    await SecureStore.setItemAsync(SK_KEY, sk);
    await SecureStore.setItemAsync(PK_KEY, pk);
  }
  return { sk, pk };
}

export async function getDevicePublicKey(): Promise<string | null> {
  return SecureStore.getItemAsync(PK_KEY);
}

export async function signRefreshPayload(payload: {
  userId: number;
  deviceId: string;
  refreshToken: string;
  ts: number;
}) {
  const skB64 = await SecureStore.getItemAsync(SK_KEY);
  if (!skB64) throw new Error("No device secret key");
  const secretKey = util.decodeBase64(skB64);
  const msg = util.decodeUTF8(JSON.stringify(payload));
  const sig = nacl.sign.detached(msg, secretKey);
  return util.encodeBase64(sig);
}
