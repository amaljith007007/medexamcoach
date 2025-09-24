import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Save, Settings, Palette, Type, Image } from "lucide-react";

interface AppSettings {
  id: string;
  appName: string;
  logoUrl?: string;
  primaryColor?: string;
  updatedAt: string;
}

interface SettingsFormData {
  appName: string;
  logoUrl?: string;
  primaryColor?: string;
}

export default function AdminSettings() {
  const [formData, setFormData] = useState<SettingsFormData>({
    appName: "MedExam Pro",
    logoUrl: "",
    primaryColor: "#3b82f6"
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch current settings
  const { data: settings, isLoading } = useQuery({
    queryKey: ['/api/admin/settings'],
    queryFn: async () => {
      const response = await fetch('/api/admin/settings');
      if (!response.ok) throw new Error('Failed to fetch settings');
      const data = await response.json();
      if (data) {
        setFormData({
          appName: data.appName || "MedExam Pro",
          logoUrl: data.logoUrl || "",
          primaryColor: data.primaryColor || "#3b82f6"
        });
      }
      return data;
    }
  });

  // Update settings mutation
  const updateMutation = useMutation({
    mutationFn: async (data: SettingsFormData) => {
      return apiRequest('PUT', '/api/admin/settings', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/settings'] });
      toast({
        title: "Success",
        description: "Settings updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update settings.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.appName.trim()) {
      toast({
        title: "Error",
        description: "App name is required.",
        variant: "destructive",
      });
      return;
    }

    updateMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Settings className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-foreground">App Settings</h1>
          <p className="text-muted-foreground">
            Configure your application's appearance and branding
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Settings Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Type className="h-5 w-5" />
              Branding Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="appName">Application Name *</Label>
                <Input
                  id="appName"
                  value={formData.appName}
                  onChange={(e) => setFormData({ ...formData, appName: e.target.value })}
                  placeholder="Enter application name"
                  data-testid="input-app-name"
                />
              </div>

              <div>
                <Label htmlFor="logoUrl">Logo URL</Label>
                <Input
                  id="logoUrl"
                  value={formData.logoUrl || ""}
                  onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                  placeholder="Enter logo image URL"
                  data-testid="input-logo-url"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Leave empty to use default logo
                </p>
              </div>

              <div>
                <Label htmlFor="primaryColor">Primary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="primaryColor"
                    type="color"
                    value={formData.primaryColor || "#3b82f6"}
                    onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                    className="w-20 h-10"
                    data-testid="input-primary-color"
                  />
                  <Input
                    value={formData.primaryColor || "#3b82f6"}
                    onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                    placeholder="#3b82f6"
                    className="flex-1"
                    data-testid="input-primary-color-text"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={updateMutation.isPending}
                className="w-full"
                data-testid="button-save-settings"
              >
                <Save className="h-4 w-4 mr-2" />
                {updateMutation.isPending ? "Saving..." : "Save Settings"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="h-5 w-5" />
              Preview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border rounded-lg p-4 bg-background">
              <div className="flex items-center gap-3 mb-4">
                {formData.logoUrl ? (
                  <img 
                    src={formData.logoUrl} 
                    alt="Logo preview" 
                    className="h-8 w-8 object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div 
                    className="h-8 w-8 rounded flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: formData.primaryColor }}
                  >
                    {formData.appName.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-lg font-bold">{formData.appName}</span>
              </div>
              
              <div className="space-y-2">
                <div 
                  className="h-2 w-3/4 rounded"
                  style={{ backgroundColor: formData.primaryColor + '40' }}
                ></div>
                <div 
                  className="h-2 w-1/2 rounded"
                  style={{ backgroundColor: formData.primaryColor + '20' }}
                ></div>
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              <p className="font-medium mb-2">Preview shows:</p>
              <ul className="space-y-1 text-xs">
                <li>• Application name in header</li>
                <li>• Logo or generated initial</li>
                <li>• Primary color theming</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Settings Info */}
      {settings && (
        <Card>
          <CardHeader>
            <CardTitle>Current Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <dt className="font-medium text-muted-foreground">App Name</dt>
                <dd className="mt-1">{settings.appName}</dd>
              </div>
              <div>
                <dt className="font-medium text-muted-foreground">Logo URL</dt>
                <dd className="mt-1 truncate">{settings.logoUrl || "Default"}</dd>
              </div>
              <div>
                <dt className="font-medium text-muted-foreground">Primary Color</dt>
                <dd className="mt-1 flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded border"
                    style={{ backgroundColor: settings.primaryColor }}
                  ></div>
                  {settings.primaryColor}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      )}
    </div>
  );
}