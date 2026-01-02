"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

interface MaintenanceBanner {
  enabled?: boolean | null;
  bannerMessage?: string | null;
  modalMessage?: string | null;
  interceptExternalLinks?: boolean | null;
}

interface SiteSettingsContextType {
  maintenanceBanner: MaintenanceBanner;
  showExternalLinkModal: (url: string) => void;
  showMaintenanceModal: () => void;
  hideExternalLinkModal: () => void;
  pendingExternalUrl: string | null;
  isModalOpen: boolean;
}

const SiteSettingsContext = createContext<SiteSettingsContextType | null>(null);

export function SiteSettingsProvider({
  children,
  maintenanceBanner,
}: {
  children: ReactNode;
  maintenanceBanner: MaintenanceBanner;
}) {
  const [pendingExternalUrl, setPendingExternalUrl] = useState<string | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showExternalLinkModal = useCallback((url: string) => {
    setPendingExternalUrl(url);
    setIsModalOpen(true);
  }, []);

  const showMaintenanceModal = useCallback(() => {
    setPendingExternalUrl(null);
    setIsModalOpen(true);
  }, []);

  const hideExternalLinkModal = useCallback(() => {
    setIsModalOpen(false);
    setPendingExternalUrl(null);
  }, []);

  return (
    <SiteSettingsContext.Provider
      value={{
        maintenanceBanner,
        showExternalLinkModal,
        showMaintenanceModal,
        hideExternalLinkModal,
        pendingExternalUrl,
        isModalOpen,
      }}
    >
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error(
      "useSiteSettings must be used within a SiteSettingsProvider"
    );
  }
  return context;
}

export { SiteSettingsContext };

