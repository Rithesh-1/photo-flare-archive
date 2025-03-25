
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Photo } from '@/context/PhotoContext';

export type StorageMode = 'local' | 'cloud';

interface DatabaseContextType {
  mode: StorageMode;
  setMode: (mode: StorageMode) => void;
  isOffline: boolean;
  syncStatus: 'synced' | 'syncing' | 'pending' | 'error';
  pendingChanges: number;
  savePhotoLocally: (photo: Photo) => Promise<void>;
  getLocalPhotos: () => Promise<Photo[]>;
  deleteLocalPhoto: (id: string) => Promise<void>;
  clearLocalStorage: () => Promise<void>;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<StorageMode>(() => {
    const savedMode = localStorage.getItem('storageMode');
    return (savedMode as StorageMode) || 'cloud';
  });
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'pending' | 'error'>('synced');
  const [pendingChanges, setPendingChanges] = useState<number>(0);
  const { toast } = useToast();

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      toast({
        title: "You're back online",
        description: "Syncing your data...",
        duration: 2000,
      });
      // Attempt to sync pending changes when coming back online
      syncPendingChanges();
    };

    const handleOffline = () => {
      setIsOffline(true);
      toast({
        title: "You're offline",
        description: "Changes will be saved locally until you reconnect",
        duration: 2000,
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [toast]);

  // Save storage mode preference
  useEffect(() => {
    localStorage.setItem('storageMode', mode);
  }, [mode]);

  const syncPendingChanges = async () => {
    // This would contain logic to sync local changes to cloud
    // when connection is restored
    if (isOffline || mode === 'local') return;

    try {
      setSyncStatus('syncing');
      // Perform sync operations here
      
      // For now, just simulate a sync
      await new Promise(resolve => setTimeout(resolve, 1500));
      setPendingChanges(0);
      setSyncStatus('synced');
      
      toast({
        title: "Sync completed",
        description: "All your changes have been saved to the cloud",
        duration: 1500,
      });
    } catch (error) {
      console.error("Sync failed:", error);
      setSyncStatus('error');
      toast({
        title: "Sync failed",
        description: "Please try again later",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  // Local storage operations
  const savePhotoLocally = async (photo: Photo): Promise<void> => {
    try {
      const localPhotos = await getLocalPhotos();
      const updatedPhotos = [...localPhotos.filter(p => p.id !== photo.id), photo];
      localStorage.setItem('localPhotos', JSON.stringify(updatedPhotos));
      
      if (mode === 'cloud' && isOffline) {
        setPendingChanges(prev => prev + 1);
        setSyncStatus('pending');
      }
    } catch (error) {
      console.error("Error saving photo locally:", error);
      throw error;
    }
  };

  const getLocalPhotos = async (): Promise<Photo[]> => {
    try {
      const localData = localStorage.getItem('localPhotos');
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      console.error("Error retrieving local photos:", error);
      return [];
    }
  };

  const deleteLocalPhoto = async (id: string): Promise<void> => {
    try {
      const localPhotos = await getLocalPhotos();
      const updatedPhotos = localPhotos.filter(photo => photo.id !== id);
      localStorage.setItem('localPhotos', JSON.stringify(updatedPhotos));
      
      if (mode === 'cloud' && isOffline) {
        setPendingChanges(prev => prev + 1);
        setSyncStatus('pending');
      }
    } catch (error) {
      console.error("Error deleting local photo:", error);
      throw error;
    }
  };

  const clearLocalStorage = async (): Promise<void> => {
    try {
      localStorage.removeItem('localPhotos');
      toast({
        title: "Local storage cleared",
        description: "All locally stored photos have been removed",
        duration: 1500,
      });
    } catch (error) {
      console.error("Error clearing local storage:", error);
      throw error;
    }
  };

  return (
    <DatabaseContext.Provider
      value={{
        mode,
        setMode,
        isOffline,
        syncStatus,
        pendingChanges,
        savePhotoLocally,
        getLocalPhotos,
        deleteLocalPhoto,
        clearLocalStorage,
      }}
    >
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};
