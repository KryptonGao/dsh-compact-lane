import type { ObservableSnapshot } from "@deepseek-ai/dsh-client-store";
import type { ChatSnapshot } from "@deepseek-ai/dsh-client-ui-chat/client";
import { adaptTurn } from "./turn";
import type { TurnModel } from "./model";

/** A disposable view of the host nodes, not a second event log or persistent store. */
export function turnSource(
  chat: ObservableSnapshot<ChatSnapshot>,
  turn: number,
): ObservableSnapshot<TurnModel> {
  let value = adaptTurn(chat.getSnapshot(), turn);
  return {
    getSnapshot: () => value,
    subscribe(listener) {
      let keys: readonly string[] = [],
        location: unknown,
        stops: (() => void)[] = [];
      const publish = () => {
        value = adaptTurn(chat.getSnapshot(), turn);
        listener();
      };
      const sync = () => {
        const s = chat.getSnapshot(),
          next = s.locations.getTurn(turn),
          loc = s.timeline.turns.get(turn);
        if (next !== keys) {
          stops.forEach((stop) => stop());
          keys = next;
          stops = keys.map((key) => s.nodes.source(key).subscribe(publish));
          location = loc;
          publish();
        } else if (loc !== location) {
          location = loc;
          publish();
        }
      };
      const stop = chat.subscribe(sync);
      sync();
      return () => {
        stop();
        stops.forEach((dispose) => dispose());
      };
    },
  };
}
