
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import { useDatabase } from '@/context/DatabaseContext';
import { motion } from 'framer-motion';
import { useAppConfig } from '@/context/AppConfigContext';
import { 
  Settings, 
  Database, 
  Cloud, 
  Server, 
  Users, 
  Palette, 
  FileArchive,
  Lock,
  ImageIcon,
  BarChart,
  RefreshCw 
} from 'lucide-react';

const Admin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();
  const { mode, setMode, clearLocalStorage, syncStatus, pendingChanges } = useDatabase();
  const { 
    appName, 
    setAppName, 
    primaryColor, 
    setPrimaryColor,
    logoUrl,
    setLogoUrl,
    storageLimitMB,
    setStorageLimitMB
  } = useAppConfig();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple authentication for demo purposes
    // In production, this would use a secure authentication system
    if (username === 'admin' && password === 'password') {
      setIsAuthenticated(true);
      toast({
        title: "Login successful",
        description: "Welcome to the admin dashboard",
        duration: 1500,
      });
    } else {
      toast({
        title: "Login failed",
        description: "Invalid username or password",
        variant: "destructive",
        duration: 1500,
      });
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
  };

  const handleStorageModeChange = (newMode: 'local' | 'cloud') => {
    setMode(newMode);
    toast({
      title: `Switched to ${newMode} storage`,
      description: newMode === 'local' ? "Your photos will be stored locally" : "Your photos will be stored in the cloud",
      duration: 1500,
    });
  };

  const handleClearLocalStorage = async () => {
    await clearLocalStorage();
  };

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md p-6"
          >
            <Card>
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
                <CardDescription className="text-center">
                  Enter your credentials to access the admin dashboard
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Input
                      id="username"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Input
                      id="password"
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Login
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button variant="ghost" onClick={() => navigate('/')}>
                  Return to Home
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button variant="outline" onClick={handleLogout}>Logout</Button>
        </div>

        <Tabs defaultValue="storage">
          <TabsList className="mb-6 grid w-full grid-cols-5">
            <TabsTrigger value="storage" className="flex items-center gap-2">
              <Database className="h-4 w-4" /> Storage
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="h-4 w-4" /> Appearance
            </TabsTrigger>
            <TabsTrigger value="assets" className="flex items-center gap-2">
              <FileArchive className="h-4 w-4" /> Assets
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" /> Users
            </TabsTrigger>
            <TabsTrigger value="limits" className="flex items-center gap-2">
              <BarChart className="h-4 w-4" /> Limits
            </TabsTrigger>
          </TabsList>

          <TabsContent value="storage" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Storage Configuration</CardTitle>
                <CardDescription>
                  Choose how your application stores and manages data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Storage Mode</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Card 
                      className={`cursor-pointer border-2 ${mode === 'local' ? 'border-primary' : 'border-border'}`}
                      onClick={() => handleStorageModeChange('local')}
                    >
                      <CardContent className="flex flex-col items-center justify-center p-6">
                        <Server className="h-12 w-12 mb-4 text-primary" />
                        <h4 className="text-xl font-semibold">Local Storage</h4>
                        <p className="text-sm text-muted-foreground text-center mt-2">
                          Store photos on your device for offline access
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card 
                      className={`cursor-pointer border-2 ${mode === 'cloud' ? 'border-primary' : 'border-border'}`}
                      onClick={() => handleStorageModeChange('cloud')}
                    >
                      <CardContent className="flex flex-col items-center justify-center p-6">
                        <Cloud className="h-12 w-12 mb-4 text-primary" />
                        <h4 className="text-xl font-semibold">Cloud Storage</h4>
                        <p className="text-sm text-muted-foreground text-center mt-2">
                          Store photos in the cloud for access anywhere
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Local Data Management</h3>
                  <div className="flex space-x-4">
                    <Button 
                      variant="outline" 
                      onClick={handleClearLocalStorage}
                      className="flex items-center gap-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Clear Local Cache
                    </Button>
                    
                    {syncStatus !== 'synced' && (
                      <Button className="flex items-center gap-2">
                        <Cloud className="h-4 w-4" />
                        Sync Now ({pendingChanges} pending)
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>
                  Customize how your application looks
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Application Name</h3>
                    <Input 
                      value={appName} 
                      onChange={(e) => setAppName(e.target.value)}
                      placeholder="Application Name" 
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Primary Color</h3>
                    <div className="flex space-x-4 items-center">
                      <div 
                        className="w-12 h-12 rounded-full border"
                        style={{ backgroundColor: primaryColor }}
                      />
                      <Input 
                        value={primaryColor} 
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        placeholder="#3b82f6" 
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Logo URL</h3>
                  <Input 
                    value={logoUrl} 
                    onChange={(e) => setLogoUrl(e.target.value)}
                    placeholder="URL to your logo image" 
                  />
                  {logoUrl && (
                    <div className="mt-4 border rounded-md p-4 flex justify-center">
                      <img 
                        src={logoUrl} 
                        alt="Logo Preview" 
                        className="max-h-16 object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.svg';
                        }}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save Appearance Settings</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="assets" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Asset Management</CardTitle>
                <CardDescription>
                  Manage application assets like icons and themes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Application Assets</h3>
                    <p className="text-muted-foreground">
                      Upload and manage assets for your application. These will be stored locally for easy access.
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <Card>
                        <CardContent className="p-6 flex flex-col items-center justify-center">
                          <ImageIcon className="h-12 w-12 mb-4 text-primary" />
                          <h4 className="text-xl font-semibold">Icon Library</h4>
                          <p className="text-sm text-muted-foreground text-center mt-2">
                            Manage app icons and images
                          </p>
                          <Button className="mt-4">Manage Icons</Button>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="p-6 flex flex-col items-center justify-center">
                          <Palette className="h-12 w-12 mb-4 text-primary" />
                          <h4 className="text-xl font-semibold">Theme Manager</h4>
                          <p className="text-sm text-muted-foreground text-center mt-2">
                            Create and switch between themes
                          </p>
                          <Button className="mt-4">Manage Themes</Button>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Manage user access and permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Authentication</h3>
                  <div className="flex items-center p-4 border rounded-md">
                    <Lock className="h-8 w-8 text-primary mr-4" />
                    <div>
                      <h4 className="font-medium">Admin Credentials</h4>
                      <p className="text-sm text-muted-foreground">
                        Change your admin username and password
                      </p>
                    </div>
                    <Button variant="outline" className="ml-auto">
                      Change Password
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="limits" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Storage Limits</CardTitle>
                <CardDescription>
                  Configure application storage limits and quotas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Local Storage Limit</h3>
                  <div className="flex items-center space-x-4">
                    <Input 
                      type="number" 
                      value={storageLimitMB.toString()} 
                      onChange={(e) => setStorageLimitMB(parseInt(e.target.value) || 100)}
                      min="10"
                      className="w-32"
                    />
                    <span>MB</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Maximum storage space allocated for locally stored photos. Default is 100MB.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Current Usage</h3>
                  <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary" 
                      style={{ width: '15%' }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>15MB used</span>
                    <span>{storageLimitMB}MB total</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save Limits</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Admin;
