import { useEffect } from 'react';
import { BackupService } from '../services/BackupService';
import { useUser } from '../contexts/UserContext';

/**
 * Hook für automatische Backups
 * Prüft beim App-Start, ob ein automatisches Backup erstellt werden sollte
 */
const useAutoBackup = () => {
  const { user } = useUser();

  useEffect(() => {
    // Nur ausführen, wenn ein Benutzer angemeldet ist
    if (!user || !user.onboardingCompleted) return;

    // Backup-Einstellungen laden
    const backupSettings = BackupService.getBackupSettings();

    // Prüfen, ob ein Backup erstellt werden sollte
    if (BackupService.shouldCreateBackup(backupSettings)) {
      console.log('Erstelle automatisches Backup...');
      
      // Backup erstellen
      const success = BackupService.createAutoBackup();
      
      if (success) {
        // Datum des letzten Backups aktualisieren
        backupSettings.lastBackupDate = new Date().toISOString();
        BackupService.saveBackupSettings(backupSettings);
        console.log('Automatisches Backup erfolgreich erstellt');
      } else {
        console.error('Fehler beim Erstellen des automatischen Backups');
      }
    }
  }, [user]);
};

export default useAutoBackup; 