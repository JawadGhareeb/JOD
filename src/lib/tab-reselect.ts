import { useEffect, useRef } from "react";

export type TopNavTabKey =
  | "home"
  | "groups"
  | "student"
  | "reels"
  | "notifications"
  | "profile";

type Listener = () => void;

const listeners = new Map<TopNavTabKey, Set<Listener>>();

export function emitTabReselect(tab: TopNavTabKey) {
  listeners.get(tab)?.forEach((listener) => {
    try {
      listener();
    } catch (error) {
      console.warn("[JOD] tab reselect handler failed", error);
    }
  });
}

export function subscribeTabReselect(tab: TopNavTabKey, listener: Listener) {
  let bucket = listeners.get(tab);
  if (!bucket) {
    bucket = new Set();
    listeners.set(tab, bucket);
  }
  bucket.add(listener);
  return () => {
    bucket?.delete(listener);
  };
}

/** Subscribe to "tap active tab again" — scroll to top + refresh. */
export function useOnTabReselect(tab: TopNavTabKey, listener: Listener) {
  const listenerRef = useRef(listener);
  listenerRef.current = listener;

  useEffect(() => subscribeTabReselect(tab, () => listenerRef.current()), [tab]);
}
