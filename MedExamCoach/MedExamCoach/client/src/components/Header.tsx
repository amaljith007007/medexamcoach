import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Stethoscope, User, Settings, LogOut, Crown } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { useAppSettings } from "../contexts/AppSettingsContext";

interface HeaderProps {
  user?: {
    firstName?: string;
    lastName?: string;
    email: string;
    subscriptionTier: string;
  };
  onLogout?: () => void;
}

export default function Header({ user, onLogout }: HeaderProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  // Try to get settings, but don't crash if provider is not available
  let settings = null;
  try {
    const context = useAppSettings();
    settings = context.settings;
  } catch (error) {
    // Provider not available, use defaults
  }

  const handleLogout = async () => {
    setIsLoggingOut(true);
    console.log("Logout triggered");
    onLogout?.();
    setIsLoggingOut(false);
  };

  const userInitials = user ? 
    `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() || 
    user.email[0].toUpperCase() : 
    '';

  const appName = settings?.appName || "MedExam Pro";
  const logoUrl = settings?.logoUrl;

  return (
    <header className="border-b bg-card">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-2">
          {logoUrl ? (
            <img 
              src={logoUrl} 
              alt={appName} 
              className="h-8 w-8 object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <Stethoscope className="h-8 w-8 text-primary" />
          )}
          <h1 className="text-xl font-semibold text-foreground">{appName}</h1>
        </div>

        {user ? (
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Badge variant={user.subscriptionTier === "premium" ? "default" : "secondary"}>
              {user.subscriptionTier === "premium" ? (
                <>
                  <Crown className="h-3 w-3 mr-1" />
                  Premium
                </>
              ) : (
                "Free"
              )}
            </Badge>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="relative h-8 w-8 rounded-full" 
                  data-testid="button-user-menu"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" alt="User avatar" />
                    <AvatarFallback>{userInitials}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="px-2 py-1.5 text-sm font-medium">
                  {user.firstName} {user.lastName}
                </div>
                <div className="px-2 py-1.5 text-xs text-muted-foreground">
                  {user.email}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem data-testid="button-profile">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem data-testid="button-settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  data-testid="button-logout"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {isLoggingOut ? "Logging out..." : "Log out"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" data-testid="button-login">
              Log in
            </Button>
            <Button data-testid="button-signup">
              Sign up
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}