"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type SignupFlowState = {
  email: string;
  fullName: string;
  code: string;
  businessName: string;
  dbaNames: string[];
  country: string;
  useCase: string;
  incorporationIdType: string;
  incorporationId: string;
  passkeyDone: boolean;
};

const initialState: SignupFlowState = {
  email: "",
  fullName: "",
  code: "",
  businessName: "",
  dbaNames: [],
  country: "",
  useCase: "",
  incorporationIdType: "",
  incorporationId: "",
  passkeyDone: false,
};

type SignupFlowContextValue = SignupFlowState & {
  updateField: <K extends keyof SignupFlowState>(
    field: K,
    value: SignupFlowState[K]
  ) => void;
};

const SignupFlowContext = createContext<SignupFlowContextValue | null>(null);

export function SignupFlowProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<SignupFlowState>(initialState);

  const updateField = useCallback(
    <K extends keyof SignupFlowState>(field: K, value: SignupFlowState[K]) => {
      setState((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const value = useMemo(
    () => ({ ...state, updateField }),
    [state, updateField]
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
