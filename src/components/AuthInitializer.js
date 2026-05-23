"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { initializeAuth } from "../store/slices/authSlice";

export default function AuthInitializer({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  return children;
}
