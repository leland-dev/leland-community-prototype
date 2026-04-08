import type { ReactNode } from "react";
import { useVersion, type PrototypeVersion } from "../contexts/VersionContext";

interface VersionGateProps {
  /** Which version must be active for children to render. */
  version: PrototypeVersion;
  children: ReactNode;
}

/**
 * Renders children only when the active prototype version matches.
 *
 * Usage:
 *   <VersionGate version="B">
 *     <ExperimentalFeature />
 *   </VersionGate>
 *
 * For inline logic, use the useVersion() hook directly:
 *   const { version } = useVersion();
 *   const isExperimental = version === "B";
 */
export default function VersionGate({ version, children }: VersionGateProps) {
  const { version: current } = useVersion();
  return current === version ? <>{children}</> : null;
}
