
import React, { useState } from 'react';
import { useTheme, ThemeStyle } from '@/context/ThemeContext';
import { useAppConfig } from '@/context/AppConfigContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Paintbrush,
  Palette,
  Sun,
  Moon,
  Droplet,
  Square,
  Transparency,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const themePresets = [
  { name: 'Blue Sky', primary: '#3b82f6', secondary: '#10b981', bg: '#ffffff', text: '#1f2937' },
  { name: 'Sunset', primary: '#f97316', secondary: '#ec4899', bg: '#fffbf0', text: '#1e293b' },
  { name: 'Forest', primary: '#10b981', secondary: '#3b82f6', bg: '#f0fff4', text: '#1e293b' },
  { name: 'Carbon', primary: '#6366f1', secondary: '#8b5cf6', bg: '#1a1a1a', text: '#f3f4f6' },
];

const ThemeCustomizer = () => {
  const { themeOptions, setThemeStyle, setPrimaryColor, setSecondaryColor, setBackgroundColor, setTextColor, applyTheme } = useTheme();
  const { isDarkMode, toggleDarkMode } = useAppConfig();
  const [selectedStyle, setSelectedStyle] = useState<ThemeStyle>(themeOptions.style);

  const handleStyleChange = (style: ThemeStyle) => {
    setSelectedStyle(style);
    setThemeStyle(style);
  };

  const handleApplyPreset = (preset: typeof themePresets[0]) => {
    applyTheme({
      primaryColor: preset.primary,
      secondaryColor: preset.secondary,
      backgroundColor: preset.bg,
      textColor: preset.text,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-4 rounded-lg bg-card shadow-lg border border-border max-w-md mx-auto"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <Palette className="w-5 h-5 mr-2" />
          Theme Customizer
        </h3>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={toggleDarkMode}
        >
          {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>

      <Tabs defaultValue="style" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="style" className="flex items-center justify-center">
            <Paintbrush className="w-4 h-4 mr-2" />
            <span>Style</span>
          </TabsTrigger>
          <TabsTrigger value="colors" className="flex items-center justify-center">
            <Palette className="w-4 h-4 mr-2" />
            <span>Colors</span>
          </TabsTrigger>
          <TabsTrigger value="presets" className="flex items-center justify-center">
            <Droplet className="w-4 h-4 mr-2" />
            <span>Presets</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="style" className="mt-4 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <Button
              variant="outline"
              className={cn(
                "flex flex-col items-center justify-center h-24 p-2 border-2",
                selectedStyle === 'glass' && "border-primary"
              )}
              onClick={() => handleStyleChange('glass')}
            >
              <div className="bg-primary/20 backdrop-blur p-2 rounded w-full h-12 mb-2 flex items-center justify-center">
                <span className="text-xs">Glass</span>
              </div>
              <span className="text-xs">Glassmorphic UI</span>
            </Button>
            <Button
              variant="outline"
              className={cn(
                "flex flex-col items-center justify-center h-24 p-2 border-2",
                selectedStyle === 'matte' && "border-primary"
              )}
              onClick={() => handleStyleChange('matte')}
            >
              <div className="bg-primary/80 p-2 rounded w-full h-12 mb-2 flex items-center justify-center">
                <span className="text-xs text-white">Matte</span>
              </div>
              <span className="text-xs">Solid Colors</span>
            </Button>
            <Button
              variant="outline"
              className={cn(
                "flex flex-col items-center justify-center h-24 p-2 border-2",
                selectedStyle === 'transparent' && "border-primary"
              )}
              onClick={() => handleStyleChange('transparent')}
            >
              <div className="bg-background/50 p-2 border border-dashed border-foreground/20 rounded w-full h-12 mb-2 flex items-center justify-center">
                <span className="text-xs">Trans</span>
              </div>
              <span className="text-xs">Transparent UI</span>
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="colors" className="mt-4 space-y-4">
          <div className="grid gap-4">
            <div>
              <Label htmlFor="primaryColor" className="flex items-center mb-1.5">
                <div 
                  className="w-4 h-4 rounded-full mr-2" 
                  style={{ backgroundColor: themeOptions.primaryColor }}
                />
                Primary Color
              </Label>
              <div className="flex gap-2">
                <Input 
                  type="color" 
                  id="primaryColor" 
                  value={themeOptions.primaryColor} 
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-12 h-10 p-1"
                />
                <Input 
                  type="text" 
                  value={themeOptions.primaryColor} 
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="secondaryColor" className="flex items-center mb-1.5">
                <div 
                  className="w-4 h-4 rounded-full mr-2" 
                  style={{ backgroundColor: themeOptions.secondaryColor }}
                />
                Secondary Color
              </Label>
              <div className="flex gap-2">
                <Input 
                  type="color" 
                  id="secondaryColor" 
                  value={themeOptions.secondaryColor} 
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="w-12 h-10 p-1"
                />
                <Input 
                  type="text" 
                  value={themeOptions.secondaryColor} 
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="backgroundColor" className="flex items-center mb-1.5">
                <div 
                  className="w-4 h-4 rounded-full mr-2 border border-gray-300" 
                  style={{ backgroundColor: themeOptions.backgroundColor }}
                />
                Background Color
              </Label>
              <div className="flex gap-2">
                <Input 
                  type="color" 
                  id="backgroundColor" 
                  value={themeOptions.backgroundColor} 
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="w-12 h-10 p-1"
                />
                <Input 
                  type="text" 
                  value={themeOptions.backgroundColor} 
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="textColor" className="flex items-center mb-1.5">
                <div 
                  className="w-4 h-4 rounded-full mr-2" 
                  style={{ backgroundColor: themeOptions.textColor }}
                />
                Text Color
              </Label>
              <div className="flex gap-2">
                <Input 
                  type="color" 
                  id="textColor" 
                  value={themeOptions.textColor} 
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-12 h-10 p-1"
                />
                <Input 
                  type="text" 
                  value={themeOptions.textColor} 
                  onChange={(e) => setTextColor(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="presets" className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {themePresets.map((preset, idx) => (
              <Button
                key={idx}
                variant="outline"
                className="h-auto p-3 flex flex-col items-start justify-start text-left border hover:bg-accent"
                onClick={() => handleApplyPreset(preset)}
              >
                <span className="font-medium mb-2">{preset.name}</span>
                <div className="flex gap-1 w-full">
                  <div 
                    className="w-6 h-6 rounded-full border border-border" 
                    style={{ backgroundColor: preset.primary }}
                  />
                  <div 
                    className="w-6 h-6 rounded-full border border-border" 
                    style={{ backgroundColor: preset.secondary }}
                  />
                  <div className="flex-1" />
                  <div 
                    className="w-6 h-6 rounded border border-border" 
                    style={{ backgroundColor: preset.bg }}
                  />
                </div>
              </Button>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default ThemeCustomizer;
