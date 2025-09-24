import { useAppSettings } from "../contexts/AppSettingsContext";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";

interface AppHeaderProps {
  user: any;
  currentView: string;
  onNavigate: (view: string) => void;
}

export default function AppHeader({ user, currentView, onNavigate }: AppHeaderProps) {
  const { settings } = useAppSettings();
  
  const appName = settings?.appName || "MedExam Pro";
  const logoUrl = settings?.logoUrl;

  return (
    <header className="bg-background border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {logoUrl ? (
              <img 
                src={logoUrl} 
                alt={appName} 
                className="w-8 h-8 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">
                  {appName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <h1 className="text-xl font-bold text-foreground">{appName}</h1>
          </div>

          <div className="flex items-center space-x-2">
            <nav className="flex space-x-2">
              <Button
                variant={currentView === "dashboard" ? "default" : "ghost"}
                size="sm"
                onClick={() => onNavigate("dashboard")}
                data-testid="nav-dashboard"
              >
                Dashboard
              </Button>
              <Button
                variant={currentView === "practice" ? "default" : "ghost"}
                size="sm"
                onClick={() => onNavigate("practice")}
                data-testid="nav-practice"
              >
                Practice
              </Button>
              <Button
                variant={currentView === "mock-exam" ? "default" : "ghost"}
                size="sm"
                onClick={() => onNavigate("mock-exam")}
                data-testid="nav-mock-exam"
              >
                Mock Exam
              </Button>
              {(user.subscriptionTier === "free" || user.subscriptionTier === "premium") && (
                <Button
                  variant={currentView === "subscription" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onNavigate("subscription")}
                  data-testid="nav-subscription"
                >
                  Upgrade
                </Button>
              )}
              {user.role === "admin" && (
                <Button
                  variant={currentView === "admin" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onNavigate("admin")}
                  data-testid="nav-admin"
                >
                  Admin
                </Button>
              )}
            </nav>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}