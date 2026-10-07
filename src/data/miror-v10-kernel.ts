import { useState, useEffect, RefObject } from "react";

export function useV10DeviceHook() {
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setDevice("mobile");
      else if (window.innerWidth < 1024) setDevice("tablet");
      else setDevice("desktop");
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return device;
}

export function useV10ReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mediaQuery.matches);
    const listener = () => setReduced(mediaQuery.matches);
    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);
  return reduced;
}

export function useV10Online() {
  const [online, setOnline] = useState(true);
  useEffect(() => {
    setOnline(navigator.onLine);
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);
  return online;
}

export function useV10Progress(ref: RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const height = rect.height;
      const viewportHeight = window.innerHeight;
      if (rect.top > viewportHeight) {
        setProgress(0);
      } else if (rect.bottom < 0) {
        setProgress(1);
      } else {
        const totalScroll = height + viewportHeight;
        const currentScroll = viewportHeight - rect.top;
        setProgress(Math.max(0, Math.min(1, currentScroll / totalScroll)));
      }
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [ref]);
  return progress;
}

export function useV10Events(feature: string) {
  return (event: string, payload: any) => {
    console.log(`[V10 Event: ${feature}] ${event}`, payload);
  };
}

export function v10Mail(to: string, subject?: string, body?: string) {
  const params = new URLSearchParams();
  if (subject) params.append("subject", subject);
  if (body) params.append("body", body);
  return `mailto:${to}?${params.toString()}`;
}
