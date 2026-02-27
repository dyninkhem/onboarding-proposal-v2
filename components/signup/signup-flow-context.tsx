"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type SignupFlowState = {
  email: string;
  password: string;
  companyName: string;
};

const initialState: SignupFlowState = {
  email: "",
  password: "",
  companyName: "",
};

const STORAGE_KEY = "signup-flow-state";

function loadState(): SignupFlowState {
  if (typeof window === "undefined") return initialState;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    return { ...initialState, ...JSON.parse(raw) };
  } catch {
    return initialState;
  }
}

function saveState(state: SignupFlowState): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // sessionStorage may be full or disabled
  }
}

type SignupFlowContextValue = SignupFlowState & {
  updateField: <K extends keyof SignupFlowState>(
    field: K,
    value: SignupFlowState[K]
  ) => void;
  clearState: () => void;
};

const SignupFlowContext = createContext<SignupFlowContextValue | null>(null);

export function SignupFlowProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<SignupFlowState>(loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const updateField = useCallback(
    <K extends keyof SignupFlowState>(field: K, value: SignupFlowState[K]) => {
      setState((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const clearState = useCallback(() => {
    setState(initialState);
    if (typeof window !== "undefined") {
      try {
        sessionStorage.removeItem(STORAGE_KEY);
      } catch {
        // silently fail
      }
    }
  }, []);

  const value = useMemo(
    () => ({ ...state, updateField, clearState }),
    [state, updateField, clearState]
  );

  return (
    <SignupFlowContext.Provider value={value}>
      {children}
    </SignupFlowContext.Provider>
  );
}

export function useSignupFlow() {
  const ctx = useContext(SignupFlowContext);
  if (!ctx)
    throw new Error("useSignupFlow must be used within SignupFlowProvider");
  return ctx;
}
