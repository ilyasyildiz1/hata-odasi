// JSX yerine htm: derleme gerektirmeden React bileşenleri yazmayı sağlar.
// Vite + TypeScript'e geçişte html`` şablonları doğrudan JSX'e çevrilebilir.
import React from "react";
import htm from "htm";

export const html = htm.bind(React.createElement);
export const {
  useState, useEffect, useMemo, useRef, useCallback, useContext, createContext, Fragment,
} = React;
export default React;
