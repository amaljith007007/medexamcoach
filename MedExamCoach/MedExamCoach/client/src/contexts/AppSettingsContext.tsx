import { createContext, useContext, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

interface AppSettings {
  id: string;
  appName: string;
  logoUrl?: string;
  primaryColor?: string;
  updatedAt: string;
}

interface AppSettingsContextType {
  settings: AppSettings | undefined;
  isLoading: boolean;
}

const AppSettingsContext = createContext<AppSettingsContextType | undefined>(undefined);

export function AppSettingsProvider({ children }: { children: React.ReactNode }) {
  const { data: settings, isLoading } = useQuery({
    queryKey: ['/api/admin/settings'],
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: false,
    meta: {
      errorMessage: 'Failed to load app settings'
    }
  });

  // Apply primary color to CSS custom property when settings change
  useEffect(() => {
    if (settings && 'primaryColor' in settings && settings.primaryColor) {
      // Convert hex to HSL for CSS custom properties
      const hex = settings.primaryColor;
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      
      if (result) {
        const r = parseInt(result[1], 16) / 255;
        const g = parseInt(result[2], 16) / 255;
        const b = parseInt(result[3], 16) / 255;
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h = 0, s = 0, l = (max + min) / 2;
        
        if (max !== min) {
          const d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
          switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
          }
          h /= 6;
        }
        
        const hslH = Math.round(h * 360);
        const hslS = Math.round(s * 100);
        const hslL = Math.round(l * 100);
        
        // Update CSS custom properties
        document.documentElement.style.setProperty('--primary', `${hslH} ${hslS}% ${hslL}%`);
        document.documentElement.style.setProperty('--primary-foreground', '0 0% 98%');
      }
    }
  }, [settings]);

  return (
    <AppSettingsContext.Provider value={{ settings: settings as AppSettings | undefined, isLoading }}>
      {children}
    </AppSettingsContext.Provider>
  );
}

export function useAppSettings() {
  const context = useContext(AppSettingsContext);
  if (context === undefined) {
    throw new Error('useAppSettings must be used within an AppSettingsProvider');
  }
  return context;
}