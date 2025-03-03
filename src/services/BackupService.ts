/**
 * Service für das Backup und die Wiederherstellung von Benutzerdaten
 */

// Schlüssel für alle relevanten localStorage-Einträge
const STORAGE_KEYS = {
  USER_DATA: 'nutricoach_user',
  MEAL_PLAN: 'nutricoach_meal_plan',
  SAVED_RECIPES: 'nutricoach_saved_recipes',
  USER_RECIPES: 'nutricoach_user_recipes',
  DAILY_MEALS: 'nutricoach_daily_meals',
  FOOD_DATABASE: 'nutricoach_food_database',
  RECENT_FOODS: 'nutricoach_recent_foods',
  AUTO_BACKUP: 'nutricoach_auto_backup',
  LAST_BACKUP_DATE: 'nutricoach_last_backup_date'
};

// Interface für die Backup-Daten
export interface BackupData {
  version: string;
  timestamp: string;
  userData: any;
  mealPlan: any;
  savedRecipes: any;
  userRecipes: any;
  dailyMeals: any;
  customFoods: any;
  recentFoods: any;
}

// Interface für die Backup-Einstellungen
export interface BackupSettings {
  autoBackupEnabled: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
  lastBackupDate: string | null;
  keepBackupsCount: number;
}

/**
 * Service für das Backup und die Wiederherstellung von Benutzerdaten
 */
export const BackupService = {
  /**
   * Erstellt ein Backup aller Benutzerdaten
   */
  createBackup: (): BackupData => {
    // Alle relevanten Daten aus dem localStorage abrufen
    const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    const mealPlan = localStorage.getItem(STORAGE_KEYS.MEAL_PLAN);
    const savedRecipes = localStorage.getItem(STORAGE_KEYS.SAVED_RECIPES);
    const userRecipes = localStorage.getItem(STORAGE_KEYS.USER_RECIPES);
    const dailyMeals = localStorage.getItem(STORAGE_KEYS.DAILY_MEALS);
    const foodDatabase = localStorage.getItem(STORAGE_KEYS.FOOD_DATABASE);
    const recentFoods = localStorage.getItem(STORAGE_KEYS.RECENT_FOODS);

    // Extrahiere nur benutzerdefinierte Lebensmittel aus der Datenbank
    const allFoods = foodDatabase ? JSON.parse(foodDatabase) : [];
    const customFoods = allFoods.filter((food: any) => food.isCustom === true);

    // Erstelle das Backup-Objekt
    const backup: BackupData = {
      version: '1.0.0', // Version des Backup-Formats
      timestamp: new Date().toISOString(),
      userData: userData ? JSON.parse(userData) : null,
      mealPlan: mealPlan ? JSON.parse(mealPlan) : [],
      savedRecipes: savedRecipes ? JSON.parse(savedRecipes) : [],
      userRecipes: userRecipes ? JSON.parse(userRecipes) : [],
      dailyMeals: dailyMeals ? JSON.parse(dailyMeals) : [],
      customFoods: customFoods,
      recentFoods: recentFoods ? JSON.parse(recentFoods) : []
    };

    return backup;
  },

  /**
   * Exportiert das Backup als JSON-Datei
   */
  exportBackup: (): void => {
    const backup = BackupService.createBackup();
    const backupString = JSON.stringify(backup, null, 2);
    const blob = new Blob([backupString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Erstelle einen Download-Link und klicke ihn automatisch an
    const a = document.createElement('a');
    a.href = url;
    a.download = `nutricoach_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    
    // Bereinige den URL-Objekt und entferne den Link
    setTimeout(() => {
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, 0);
  },

  /**
   * Importiert ein Backup aus einer JSON-Datei
   * @param backupData Die zu importierenden Backup-Daten
   * @param options Optionen für den Import (was soll importiert werden)
   */
  importBackup: (
    backupData: BackupData,
    options: {
      importUserData: boolean;
      importMealPlan: boolean;
      importRecipes: boolean;
      importMeals: boolean;
      importCustomFoods: boolean;
    }
  ): { success: boolean; message: string } => {
    try {
      // Überprüfe die Version des Backups
      if (!backupData.version) {
        return { success: false, message: 'Ungültiges Backup-Format' };
      }

      // Importiere Benutzerdaten
      if (options.importUserData && backupData.userData) {
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(backupData.userData));
      }

      // Importiere Mahlzeitenplan
      if (options.importMealPlan && backupData.mealPlan) {
        localStorage.setItem(STORAGE_KEYS.MEAL_PLAN, JSON.stringify(backupData.mealPlan));
      }

      // Importiere Rezepte
      if (options.importRecipes) {
        // Gespeicherte Rezepte
        if (backupData.savedRecipes) {
          localStorage.setItem(STORAGE_KEYS.SAVED_RECIPES, JSON.stringify(backupData.savedRecipes));
        }
        
        // Benutzerdefinierte Rezepte
        if (backupData.userRecipes) {
          // Bestehende benutzerdefinierte Rezepte laden
          const existingUserRecipesStr = localStorage.getItem(STORAGE_KEYS.USER_RECIPES);
          const existingUserRecipes = existingUserRecipesStr ? JSON.parse(existingUserRecipesStr) : [];
          
          // Neue Rezepte hinzufügen und Duplikate vermeiden
          const existingIds = new Set(existingUserRecipes.map((recipe: any) => recipe.id));
          const newRecipes = backupData.userRecipes.filter((recipe: any) => !existingIds.has(recipe.id));
          
          const mergedRecipes = [...existingUserRecipes, ...newRecipes];
          localStorage.setItem(STORAGE_KEYS.USER_RECIPES, JSON.stringify(mergedRecipes));
        }
      }

      // Importiere Mahlzeiten
      if (options.importMeals && backupData.dailyMeals) {
        // Bestehende Mahlzeiten laden
        const existingMealsStr = localStorage.getItem(STORAGE_KEYS.DAILY_MEALS);
        const existingMeals = existingMealsStr ? JSON.parse(existingMealsStr) : [];
        
        // Neue Mahlzeiten hinzufügen und Duplikate vermeiden
        const existingIds = new Set(existingMeals.map((meal: any) => meal.id));
        const newMeals = backupData.dailyMeals.filter((meal: any) => !existingIds.has(meal.id));
        
        const mergedMeals = [...existingMeals, ...newMeals];
        localStorage.setItem(STORAGE_KEYS.DAILY_MEALS, JSON.stringify(mergedMeals));
      }

      // Importiere benutzerdefinierte Lebensmittel
      if (options.importCustomFoods && backupData.customFoods) {
        // Bestehende Lebensmittel laden
        const existingFoodsStr = localStorage.getItem(STORAGE_KEYS.FOOD_DATABASE);
        const existingFoods = existingFoodsStr ? JSON.parse(existingFoodsStr) : [];
        
        // Nur die nicht-benutzerdefinierten Lebensmittel behalten
        const standardFoods = existingFoods.filter((food: any) => food.isCustom !== true);
        
        // Neue benutzerdefinierte Lebensmittel hinzufügen
        const mergedFoods = [...standardFoods, ...backupData.customFoods];
        localStorage.setItem(STORAGE_KEYS.FOOD_DATABASE, JSON.stringify(mergedFoods));
      }

      return { success: true, message: 'Backup erfolgreich importiert' };
    } catch (error) {
      console.error('Fehler beim Importieren des Backups:', error);
      return { success: false, message: 'Fehler beim Importieren des Backups' };
    }
  },

  /**
   * Liest eine Backup-Datei ein
   * @param file Die einzulesende Datei
   * @returns Ein Promise mit den Backup-Daten
   */
  readBackupFile: (file: File): Promise<BackupData> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const backupData = JSON.parse(event.target?.result as string);
          resolve(backupData);
        } catch (error) {
          reject(new Error('Die Datei konnte nicht als JSON gelesen werden'));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Fehler beim Lesen der Datei'));
      };
      
      reader.readAsText(file);
    });
  },

  /**
   * Erstellt ein automatisches Backup und speichert es im localStorage
   * @returns true, wenn das Backup erfolgreich erstellt wurde
   */
  createAutoBackup: (): boolean => {
    try {
      const backup = BackupService.createBackup();
      localStorage.setItem(STORAGE_KEYS.AUTO_BACKUP, JSON.stringify(backup));
      localStorage.setItem(STORAGE_KEYS.LAST_BACKUP_DATE, new Date().toISOString());
      return true;
    } catch (error) {
      console.error('Fehler beim Erstellen des automatischen Backups:', error);
      return false;
    }
  },

  /**
   * Lädt das automatische Backup aus dem localStorage
   * @returns Das Backup oder null, wenn keines vorhanden ist
   */
  loadAutoBackup: (): BackupData | null => {
    try {
      const backupStr = localStorage.getItem(STORAGE_KEYS.AUTO_BACKUP);
      if (!backupStr) return null;
      
      return JSON.parse(backupStr);
    } catch (error) {
      console.error('Fehler beim Laden des automatischen Backups:', error);
      return null;
    }
  },

  /**
   * Prüft, ob ein automatisches Backup erstellt werden sollte
   * @param settings Die Backup-Einstellungen
   * @returns true, wenn ein Backup erstellt werden sollte
   */
  shouldCreateBackup: (settings: BackupSettings): boolean => {
    if (!settings.autoBackupEnabled || !settings.lastBackupDate) {
      return settings.autoBackupEnabled; // Wenn aktiviert aber noch kein Backup, dann ja
    }

    const lastBackup = new Date(settings.lastBackupDate);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - lastBackup.getTime()) / (1000 * 60 * 60 * 24));

    switch (settings.backupFrequency) {
      case 'daily':
        return diffDays >= 1;
      case 'weekly':
        return diffDays >= 7;
      case 'monthly':
        return diffDays >= 30;
      default:
        return false;
    }
  },

  /**
   * Lädt die Backup-Einstellungen aus dem localStorage
   * @returns Die Backup-Einstellungen
   */
  getBackupSettings: (): BackupSettings => {
    // Lade die gespeicherten Einstellungen
    const autoBackupEnabled = localStorage.getItem('nutricoach_auto_backup_enabled') === 'true';
    const backupFrequency = localStorage.getItem('nutricoach_backup_frequency') || 'weekly';
    const lastBackupDate = localStorage.getItem(STORAGE_KEYS.LAST_BACKUP_DATE);
    const keepBackupsCount = parseInt(localStorage.getItem('nutricoach_keep_backups_count') || '3', 10);
    
    return {
      autoBackupEnabled,
      backupFrequency: backupFrequency as 'daily' | 'weekly' | 'monthly',
      lastBackupDate,
      keepBackupsCount
    };
  },

  /**
   * Speichert die Backup-Einstellungen
   */
  saveBackupSettings: (settings: BackupSettings): void => {
    localStorage.setItem('nutricoach_auto_backup_enabled', settings.autoBackupEnabled.toString());
    localStorage.setItem('nutricoach_backup_frequency', settings.backupFrequency);
    if (settings.lastBackupDate) {
      localStorage.setItem(STORAGE_KEYS.LAST_BACKUP_DATE, settings.lastBackupDate);
    }
    localStorage.setItem('nutricoach_keep_backups_count', settings.keepBackupsCount.toString());
  }
}; 