import { createCollection, settings } from "./storage.js";
import { createStore } from "./store.js";
import { DEMO_USERS } from "../data/users.js";
import { uid } from "../utils/format.js";

const users = createCollection("users");

export const userStore = createStore({
  users: [...DEMO_USERS, ...users.all()],
  currentId: settings.get("currentUser", null),
});

const refresh = () => userStore.set((s) => ({ ...s, users: [...DEMO_USERS, ...users.all()] }));

export const userService = {
  list: () => userStore.get().users,
  byId: (id) => userStore.get().users.find((u) => u.id === id),
  current: () => {
    const { users: list, currentId } = userStore.get();
    return list.find((u) => u.id === currentId) || null;
  },
  /** Yeni kullanıcı ekler ve aktif kullanıcı yapar. */
  create({ name, unit, role = "hemsire" }) {
    const clean = name.trim().replace(/\s+/g, " ");
    const existing = this.list().find((u) => u.name.toLocaleLowerCase("tr-TR") === clean.toLocaleLowerCase("tr-TR") && !u.demo);
    const user = existing || users.insert({ id: uid("u"), name: clean, unit: unit || "Diğer", role });
    refresh();
    this.setCurrent(user.id);
    return user;
  },
  update(id, patch) {
    users.update(id, patch);
    refresh();
  },
  setCurrent(id) {
    settings.set("currentUser", id);
    userStore.set((s) => ({ ...s, currentId: id }));
  },
  signOut() {
    settings.set("currentUser", null);
    userStore.set((s) => ({ ...s, currentId: null }));
  },
};
