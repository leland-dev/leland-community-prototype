import { useEffect, useReducer } from "react";

import type { ConnectorKey, Persona, VendorKey } from "./data";

export type ItSetupStep =
  | "welcome"
  | "context"
  | "choosetool"
  | "plan"
  | "appinstall"
  | "extension"
  | "cohort"
  | "connectors-intro"
  | "connectors"
  | "checking"
  | "clear";

// null = unanswered, true = yes, false = "not yet" (flagged, never blocks).
type TriState = null | boolean;
type ConnectorStatus = "ok" | "flag" | "bad";

type AccountState = {
  plan: TriState;
  app: TriState;
  ext: TriState;
  cohort: TriState;
};

type ConnectorState = Record<ConnectorKey, ConnectorStatus>;

type ItSetupState = {
  step: ItSetupStep;
  persona: Persona;
  vendor: VendorKey;
  account: AccountState;
  connectors: ConnectorState;
  // The connectors screen is one visual step with two views; the verify action
  // swaps in place rather than navigating.
  connectorsConfirming: boolean;
  connectorsVerifyStarted: boolean;
};

const INITIAL_STATE: ItSetupState = {
  step: "welcome",
  persona: "personal",
  vendor: "claude",
  account: { plan: null, app: null, ext: null, cohort: null },
  connectors: { slack: "ok", email: "ok", calendar: "ok" },
  connectorsConfirming: false,
  connectorsVerifyStarted: false,
};

type Action =
  | { type: "GO_TO"; step: ItSetupStep }
  | { type: "SELECT_VENDOR"; vendor: VendorKey }
  | { type: "SET_PERSONA"; persona: Persona }
  | { type: "SET_ACCOUNT"; field: keyof AccountState; value: TriState }
  | { type: "SET_CONNECTOR"; key: ConnectorKey; value: ConnectorStatus }
  | { type: "START_VERIFY" }
  | { type: "SET_CONFIRMING"; value: boolean }
  | { type: "RESET" };

function reducer(state: ItSetupState, action: Action): ItSetupState {
  switch (action.type) {
    case "GO_TO":
      return { ...state, step: action.step };
    case "SELECT_VENDOR":
      return { ...state, vendor: action.vendor };
    case "SET_PERSONA":
      return { ...state, persona: action.persona };
    case "SET_ACCOUNT":
      return {
        ...state,
        account: { ...state.account, [action.field]: action.value },
      };
    case "SET_CONNECTOR":
      return {
        ...state,
        connectors: { ...state.connectors, [action.key]: action.value },
      };
    case "START_VERIFY":
      return { ...state, connectorsConfirming: true, connectorsVerifyStarted: true };
    case "SET_CONFIRMING":
      return { ...state, connectorsConfirming: action.value };
    case "RESET":
      return INITIAL_STATE;
    default:
      return state;
  }
}

const STORAGE_KEY = "aibp_it_setup";

function loadState(): ItSetupState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_STATE;
    return { ...INITIAL_STATE, ...JSON.parse(raw) };
  } catch {
    return INITIAL_STATE;
  }
}

// Counted steps map to their progress number; context / connectors-intro hold
// the prior number so the bar never snaps backward on transition screens.
const PROGRESS_N: Record<ItSetupStep, number> = {
  welcome: 0,
  context: 1,
  choosetool: 1,
  plan: 2,
  appinstall: 3,
  extension: 4,
  cohort: 5,
  "connectors-intro": 5,
  connectors: 6,
  checking: 7,
  clear: 7,
};

const COUNTED_STEPS: ReadonlySet<ItSetupStep> = new Set([
  "choosetool",
  "plan",
  "appinstall",
  "extension",
  "cohort",
  "connectors",
  "checking",
  "clear",
]);

const TOTAL_STEPS = 7;

export type ItSetupController = {
  state: ItSetupState;
  progress: { breadcrumb: string; value: number; n: number; total: number; counted: boolean };
  goTo: (step: ItSetupStep) => void;
  selectVendor: (vendor: VendorKey) => void;
  setPersona: (persona: Persona) => void;
  setAccount: (field: keyof AccountState, value: TriState) => void;
  setConnector: (key: ConnectorKey, value: ConnectorStatus) => void;
  startVerify: () => void;
  setConfirming: (value: boolean) => void;
  reset: () => void;
  // Persona-dependent transitions (personal skips the IT-context screen).
  nextFromWelcome: () => ItSetupStep;
  backFromAccount: () => ItSetupStep;
};

export function useItSetupFlow(): ItSetupController {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // best-effort persistence; ignore quota/serialization failures
    }
  }, [state]);

  const n = PROGRESS_N[state.step];
  const counted = COUNTED_STEPS.has(state.step);
  const breadcrumb = counted
    ? `IT Setup · Step ${n} of ${TOTAL_STEPS}`
    : "IT Setup";
  const value = Math.round((n / TOTAL_STEPS) * 100);

  return {
    state,
    progress: { breadcrumb, value, n, total: TOTAL_STEPS, counted },
    goTo: (step) => dispatch({ type: "GO_TO", step }),
    selectVendor: (vendor) => dispatch({ type: "SELECT_VENDOR", vendor }),
    setPersona: (persona) => dispatch({ type: "SET_PERSONA", persona }),
    setAccount: (field, value) => dispatch({ type: "SET_ACCOUNT", field, value }),
    setConnector: (key, value) => dispatch({ type: "SET_CONNECTOR", key, value }),
    startVerify: () => dispatch({ type: "START_VERIFY" }),
    setConfirming: (value) => dispatch({ type: "SET_CONFIRMING", value }),
    reset: () => dispatch({ type: "RESET" }),
    nextFromWelcome: () => (state.persona === "personal" ? "choosetool" : "context"),
    backFromAccount: () => (state.persona === "personal" ? "welcome" : "context"),
  };
}
