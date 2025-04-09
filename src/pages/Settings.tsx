
import React from 'react';
import Layout from '@/components/Layout';
import ThemeCustomizer from '@/components/ThemeCustomizer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Palette, User, Database, Shield } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAppConfig } from '@/context/AppConfigContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const Settings = () => {
  const { 
    appName, 
    setAppName, 
    logoUrl, 
    setLogoUrl, 
    storageLimitMB, 
    setStorageLimitMB 
  } = useAppConfig();

  const handleAppNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAppName(e.target.value);
  };

  const handleLogoUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLogoUrl(e.target.value);
  };

  const handleStorageLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setStorageLimitMB(value);
    }
  };

  return (
    <Layout>
      <div className="container py-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Settings</h1>
        
        <Tabs defaultValue="appearance">
          <TabsList className="mb-8">
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="account" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Account
            </TabsTrigger>
            <TabsTrigger value="storage" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Storage
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Privacy
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="appearance" className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-semibold mb-4">Customization</h2>
              <ThemeCustomizer />
            </motion.div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Application</h3>
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="appName">Application Name</Label>
                    <Input 
                      id="appName" 
                      value={appName} 
                      onChange={handleAppNameChange} 
                      placeholder="Application Name"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="logoUrl">Logo URL</Label>
                    <Input 
                      id="logoUrl" 
                      value={logoUrl} 
                      onChange={handleLogoUrlChange} 
                      placeholder="https://example.com/logo.png"
                    />
                    {logoUrl && (
                      <div className="mt-2 p-2 border rounded flex items-center justify-center bg-muted/50">
                        <img 
                          src={logoUrl} 
                          alt="Application Logo" 
                          className="max-h-10 max-w-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200x60?text=Invalid+URL';
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Interface Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="showAnimations">Show Animations</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable or disable interface animations
                      </p>
                    </div>
                    <Switch id="showAnimations" defaultChecked />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="highQualityPreviews">High-Quality Previews</Label>
                      <p className="text-sm text-muted-foreground">
                        Load higher resolution thumbnails (uses more bandwidth)
                      </p>
                    </div>
                    <Switch id="highQualityPreviews" defaultChecked />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="account" className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
              <p className="text-muted-foreground mb-6">
                Manage your account settings and preferences
              </p>
              
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" value="user@example.com" disabled />
                  <p className="text-sm text-muted-foreground">
                    Your account email cannot be changed
                  </p>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input id="displayName" placeholder="Display Name" />
                </div>
                
                <Button className="mt-2">Save Changes</Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="storage" className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Storage Settings</h2>
              <p className="text-muted-foreground mb-6">
                Manage storage settings and limits
              </p>
              
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="storageLimit">Storage Limit (MB)</Label>
                  <Input 
                    id="storageLimit"
                    type="number"
                    value={storageLimitMB} 
                    onChange={handleStorageLimitChange}
                    min={1}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="offlineMode">Offline Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable to use application without internet connection
                    </p>
                  </div>
                  <Switch id="offlineMode" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="cloudSync">Cloud Synchronization</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically sync photos with cloud storage
                    </p>
                  </div>
                  <Switch id="cloudSync" defaultChecked />
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="privacy" className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Privacy Settings</h2>
              <p className="text-muted-foreground mb-6">
                Manage your privacy and security settings
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="metadataProcessing">Metadata Processing</Label>
                    <p className="text-sm text-muted-foreground">
                      Extract location and other metadata from uploaded photos
                    </p>
                  </div>
                  <Switch id="metadataProcessing" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="aiClassification">AI Classification</Label>
                    <p className="text-sm text-muted-foreground">
                      Use AI to automatically classify and tag your photos
                    </p>
                  </div>
                  <Switch id="aiClassification" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="storeLocation">Store Location Data</Label>
                    <p className="text-sm text-muted-foreground">
                      Save geographic location data from your photos
                    </p>
                  </div>
                  <Switch id="storeLocation" defaultChecked />
                </div>
                
                <Button variant="destructive" className="mt-4">
                  Clear All User Data
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Settings;
