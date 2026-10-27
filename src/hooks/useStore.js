import React from "react";
import { resultStore } from "../services/resultService.js";
import { userStore } from "../services/userService.js";
import { soundStore } from "../services/soundService.js";

const useExternal = (store) => React.useSyncExternalStore(store.subscribe, store.get, store.get);

export const useResults = () => useExternal(resultStore);
export const useSound = () => useExternal(soundStore);
export function useUsers() {
  const s = useExternal(userStore);
  return { users: s.users, current: s.users.find((u) => u.id === s.currentId) || null };
}
