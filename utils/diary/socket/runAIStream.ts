import { io, Socket } from "socket.io-client";
import { getValidAccessToken } from "@/utils/auth/getValidAccessToken";

type StreamEventHandlers = {
  onChunk: (data: any) => void;
  onDone: (data: any) => void;
  onError: (error: any) => void;
};

export async function runAIStream({
  endpoint,
  data,
  eventNames,
  handlers,
}: {
  endpoint: string;
  data: any;
  eventNames: { chunk: string; done: string; error: string[] };
  handlers: StreamEventHandlers;
}) {
  const token = await getValidAccessToken();
  const socket = io(process.env.EXPO_PUBLIC_URL, {
    transports: ["websocket"],
    auth: { token },
  });

  socket.off(eventNames.chunk);
  socket.off(eventNames.done);
  eventNames.error.forEach((errEvt) => socket.off(errEvt));

  socket.on(eventNames.chunk, handlers.onChunk);

  socket.on(eventNames.done, (data) => {
    handlers.onDone(data);
    socket.disconnect();
  });

  eventNames.error.forEach((errEvt) =>
    socket.on(errEvt, (err) => {
      handlers.onError(err);
      socket.disconnect();
    }),
  );

  socket.emit(endpoint, data);

  const timeout = setTimeout(() => {
    socket.disconnect();
    handlers.onError({ message: "Timeout" });
  }, 600000);

  socket.on("disconnect", () => clearTimeout(timeout));
}
