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
  code: string;
};

const initialState: SignupFlowState = {
  email: "",
  code: "",
};

const STORAGE_KEY = "signup-flow-state";

function loadState(): SignupFlowState {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    return { ...initialState, ...JSON.parse(raw) };
  } catch {
    return initialState;
  }
}

function saveState(state: SignupFlowState): void {
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
  isHydrated: boolean;
};

const SignupFlowContext = createContext<SignupFlowContextValue | null>(null);

export function SignupFlowProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Always initialize with the same state on server and client to avoid hydration mismatch
  const [state, setState] = useState<SignupFlowState>(initialState);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from sessionStorage after mount
  useEffect(() => {
    setState(loadState());
    setIsHydrated(true);
  }, []);

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
    () => ({ ...state, updateField, clearState, isHydrated }),
    [state, updateField, clearState, isHydrated]
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
