"use client";

import { useEffect } from "react";
import { hydrate } from "@/redux/slices/authSlice";
import { useAppDispatch } from "@/redux/hooks";

export function AuthHydration({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(hydrate());
  }, [dispatch]);

  return children;
}
