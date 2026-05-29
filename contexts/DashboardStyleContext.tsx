import { createContext, PropsWithChildren, useContext, useMemo, useState } from "react";

export type DashboardStyle = "map" | "music";

type DashboardStyleContextValue = {
  dashboardStyle: DashboardStyle;
  setDashboardStyle: (style: DashboardStyle) => void;
};

const DashboardStyleContext = createContext<DashboardStyleContextValue | null>(null);

export function DashboardStyleProvider({ children }: PropsWithChildren) {
  const [dashboardStyle, setDashboardStyle] = useState<DashboardStyle>("map");

  const value = useMemo(
    () => ({ dashboardStyle, setDashboardStyle }),
    [dashboardStyle]
  );

  return (
    <DashboardStyleContext.Provider value={value}>
      {children}
    </DashboardStyleContext.Provider>
  );
}

export function useDashboardStyle() {
  const value = useContext(DashboardStyleContext);

  if (!value) {
    throw new Error("useDashboardStyle must be used inside DashboardStyleProvider");
  }

  return value;
}
