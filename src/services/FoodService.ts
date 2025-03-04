/**
 * Service für die Verwaltung von Lebensmitteln und Mahlzeiten
 */

import { defaultFoods } from '../data/foodDatabase';

// Schlüssel für den lokalen Speicher
const FOOD_DATABASE_KEY = 'nutricoach_food_database';
const RECENT_FOODS_KEY = 'nutricoach_recent_foods';
const DAILY_MEALS_KEY = 'nutricoach_daily_meals';
const LAST_UPDATE_KEY = 'nutricoach_food_db_last_update';

// Interface für Lebensmittel
export interface Food {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: number; // in Gramm
  servingUnit: string; // g, ml, etc.
  category?: string;
  isCustom?: boolean;
}

// Interface für eine Mahlzeit
export interface Meal {
  id: string;
  date: string;
  mealType: string; // breakfast, lunch, dinner, snacks
  foods: MealFood[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  isCompleted?: boolean; // NEU: Flag, ob die Mahlzeit abgeschlossen ist
}

// Interface für ein Lebensmittel in einer Mahlzeit
export interface MealFood {
  food: Food;
  amount: number; // in Gramm oder ml
}

// Interface für die JSON-Datei mit Lebensmitteln
export interface FoodDatabaseFile {
  version?: string;
  lastUpdate?: string;
  foods: FoodInput[];
}

// Interface für Lebensmitteleingaben (flexibler für Import)
export interface FoodInput {
  id?: string;
  Name?: string;
  name?: string;
  Kalorien?: number;
  calories?: number;
  Protein?: number;
  protein?: number;
  Kohlenhydrate?: number;
  carbs?: number;
  Fett?: number;
  fat?: number;
  servingSize?: number;
  servingUnit?: string;
  category?: string;
  Kategorie?: string;
  isCustom?: boolean;
}

export const FoodService = {
  /**
   * Initialisiert die Lebensmitteldatenbank, falls sie noch nicht existiert
   */
  initFoodDatabase: (): void => {
    const foodDatabase = localStorage.getItem(FOOD_DATABASE_KEY);
    if (!foodDatabase) {
      localStorage.setItem(FOOD_DATABASE_KEY, JSON.stringify(defaultFoods));
    }
  },

  /**
   * Gibt alle Lebensmittel aus der Datenbank zurück
   */
  getAllFoods: (): Food[] => {
    FoodService.initFoodDatabase();
    const foodDatabase = localStorage.getItem(FOOD_DATABASE_KEY);
    return foodDatabase ? JSON.parse(foodDatabase) : [];
  },

  /**
   * Sucht nach Lebensmitteln basierend auf einem Suchbegriff
   */
  searchFoods: (query: string): Food[] => {
    const foods = FoodService.getAllFoods();
    console.log('Alle Lebensmittel:', foods.length);
    
    if (!query) return foods;
    
    const lowerQuery = query.toLowerCase();
    console.log('Suche nach:', lowerQuery);
    
    const results = foods.filter(food => 
      food.name.toLowerCase().includes(lowerQuery) || 
      (food.category && food.category.toLowerCase().includes(lowerQuery))
    );
    
    console.log('Gefundene Ergebnisse:', results.length);
    return results;
  },

  /**
   * Fügt ein neues Lebensmittel zur Datenbank hinzu
   */
  addFood: (food: Omit<Food, 'id'>): Food => {
    const foods = FoodService.getAllFoods();
    const newFood: Food = {
      ...food,
      id: Date.now().toString(),
      isCustom: true
    };
    
    localStorage.setItem(FOOD_DATABASE_KEY, JSON.stringify([...foods, newFood]));
    return newFood;
  },

  /**
   * Gibt die zuletzt verwendeten Lebensmittel zurück
   */
  getRecentFoods: (): Food[] => {
    const recentFoodIds = localStorage.getItem(RECENT_FOODS_KEY);
    const recentIds = recentFoodIds ? JSON.parse(recentFoodIds) : [];
    
    const allFoods = FoodService.getAllFoods();
    return recentIds.map((id: string) => allFoods.find(food => food.id === id)).filter(Boolean);
  },

  /**
   * Fügt ein Lebensmittel zu den zuletzt verwendeten hinzu
   */
  addToRecentFoods: (foodId: string): void => {
    const recentFoodIds = localStorage.getItem(RECENT_FOODS_KEY);
    let recentIds = recentFoodIds ? JSON.parse(recentFoodIds) : [];
    
    // Entferne das Lebensmittel, falls es bereits in der Liste ist
    recentIds = recentIds.filter((id: string) => id !== foodId);
    
    // Füge das Lebensmittel am Anfang der Liste hinzu
    recentIds.unshift(foodId);
    
    // Begrenze die Liste auf 10 Einträge
    if (recentIds.length > 10) {
      recentIds = recentIds.slice(0, 10);
    }
    
    localStorage.setItem(RECENT_FOODS_KEY, JSON.stringify(recentIds));
  },

  /**
   * Gibt alle Mahlzeiten für ein bestimmtes Datum zurück
   */
  getMealsForDate: (date: string): Meal[] => {
    const dailyMeals = localStorage.getItem(DAILY_MEALS_KEY);
    const allMeals = dailyMeals ? JSON.parse(dailyMeals) : [];
    
    return allMeals.filter((meal: Meal) => meal.date === date);
  },

  /**
   * Fügt eine neue Mahlzeit hinzu
   */
  addMeal: (meal: Omit<Meal, 'id'>): Meal => {
    const dailyMeals = localStorage.getItem(DAILY_MEALS_KEY);
    const allMeals = dailyMeals ? JSON.parse(dailyMeals) : [];
    
    const newMeal: Meal = {
      ...meal,
      id: Date.now().toString(),
      isCompleted: meal.isCompleted !== undefined ? meal.isCompleted : false // Standardmäßig ist eine Mahlzeit nicht abgeschlossen
    };
    
    localStorage.setItem(DAILY_MEALS_KEY, JSON.stringify([...allMeals, newMeal]));
    
    // Füge alle Lebensmittel zu den zuletzt verwendeten hinzu
    meal.foods.forEach(mealFood => {
      FoodService.addToRecentFoods(mealFood.food.id);
    });
    
    return newMeal;
  },

  /**
   * Löscht eine Mahlzeit
   */
  deleteMeal: (mealId: string): void => {
    const dailyMeals = localStorage.getItem(DAILY_MEALS_KEY);
    const allMeals = dailyMeals ? JSON.parse(dailyMeals) : [];
    
    const updatedMeals = allMeals.filter((meal: Meal) => meal.id !== mealId);
    
    localStorage.setItem(DAILY_MEALS_KEY, JSON.stringify(updatedMeals));
  },

  /**
   * Berechnet die Nährwerte für eine bestimmte Menge eines Lebensmittels
   */
  calculateNutrition: (food: Food, amount: number): { calories: number; protein: number; carbs: number; fat: number } => {
    const factor = amount / food.servingSize;
    
    return {
      calories: Math.round(food.calories * factor),
      protein: Math.round(food.protein * factor * 10) / 10,
      carbs: Math.round(food.carbs * factor * 10) / 10,
      fat: Math.round(food.fat * factor * 10) / 10
    };
  },

  /**
   * Berechnet die Gesamtnährwerte für eine Mahlzeit
   */
  calculateMealTotals: (foods: MealFood[]): { calories: number; protein: number; carbs: number; fat: number } => {
    return foods.reduce((totals, mealFood) => {
      const nutrition = FoodService.calculateNutrition(mealFood.food, mealFood.amount);
      
      return {
        calories: totals.calories + nutrition.calories,
        protein: totals.protein + nutrition.protein,
        carbs: totals.carbs + nutrition.carbs,
        fat: totals.fat + nutrition.fat
      };
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
  },

  /**
   * Berechnet die Gesamtnährwerte für einen Tag
   */
  calculateDailyTotals: (date: string): { calories: number; protein: number; carbs: number; fat: number } => {
    const meals = FoodService.getMealsForDate(date);
    
    return meals.reduce((totals, meal) => {
      return {
        calories: totals.calories + meal.totalCalories,
        protein: totals.protein + meal.totalProtein,
        carbs: totals.carbs + meal.totalCarbs,
        fat: totals.fat + meal.totalFat
      };
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
  },

  /**
   * Gibt eine Mahlzeit anhand ihrer ID zurück
   */
  getMealById: (mealId: string): Meal | undefined => {
    const dailyMeals = localStorage.getItem(DAILY_MEALS_KEY);
    const allMeals = dailyMeals ? JSON.parse(dailyMeals) : [];
    
    return allMeals.find((meal: Meal) => meal.id === mealId);
  },

  /**
   * Importiert Lebensmittel aus einer externen Quelle (CSV oder JSON)
   */
  importFoods: (foodsData: string, format: 'csv' | 'json'): { success: boolean; imported: number; errors: number } => {
    let foodsToImport: Omit<Food, 'id'>[] = [];
    let errors = 0;
    
    try {
      if (format === 'json') {
        // Parse JSON format
        const parsedData = JSON.parse(foodsData);
        
        // Handle array of foods or object with foods array
        const foodsArray = Array.isArray(parsedData) ? parsedData : parsedData.foods || [];
        
        foodsToImport = foodsArray.map((item: any) => ({
          name: item.name || 'Unbekanntes Lebensmittel',
          calories: parseFloat(item.calories) || 0,
          protein: parseFloat(item.protein) || 0,
          carbs: parseFloat(item.carbs) || 0,
          fat: parseFloat(item.fat) || 0,
          servingSize: parseFloat(item.servingSize) || 100,
          servingUnit: item.servingUnit || 'g',
          category: item.category || 'Importiert',
          isCustom: true
        }));
      } else if (format === 'csv') {
        // Parse CSV format (assumes header row and comma separator)
        const lines = foodsData.split('\n');
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        
        // Check for required headers
        const nameIndex = headers.indexOf('name');
        const caloriesIndex = headers.indexOf('calories');
        
        if (nameIndex === -1 || caloriesIndex === -1) {
          throw new Error('CSV muss mindestens Spalten für "name" und "calories" enthalten');
        }
        
        // Map other headers
        const proteinIndex = headers.indexOf('protein');
        const carbsIndex = headers.indexOf('carbs');
        const fatIndex = headers.indexOf('fat');
        const servingSizeIndex = headers.indexOf('servingsize');
        const servingUnitIndex = headers.indexOf('servingunit');
        const categoryIndex = headers.indexOf('category');
        
        // Parse each data row
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue; // Skip empty lines
          
          const values = line.split(',').map(v => v.trim());
          
          if (values.length < 2) {
            errors++;
            continue;
          }
          
          try {
            foodsToImport.push({
              name: values[nameIndex] || 'Unbekanntes Lebensmittel',
              calories: parseFloat(values[caloriesIndex]) || 0,
              protein: proteinIndex !== -1 ? parseFloat(values[proteinIndex]) || 0 : 0,
              carbs: carbsIndex !== -1 ? parseFloat(values[carbsIndex]) || 0 : 0,
              fat: fatIndex !== -1 ? parseFloat(values[fatIndex]) || 0 : 0,
              servingSize: servingSizeIndex !== -1 ? parseFloat(values[servingSizeIndex]) || 100 : 100,
              servingUnit: servingUnitIndex !== -1 ? values[servingUnitIndex] || 'g' : 'g',
              category: categoryIndex !== -1 ? values[categoryIndex] || 'Importiert' : 'Importiert',
              isCustom: true
            });
          } catch (e) {
            errors++;
          }
        }
      }
      
      // Add all valid foods to the database
      const existingFoods = FoodService.getAllFoods();
      const newFoods = foodsToImport.map(food => ({
        ...food,
        id: Date.now() + Math.random().toString(36).substring(2, 10)
      }));
      
      localStorage.setItem(FOOD_DATABASE_KEY, JSON.stringify([...existingFoods, ...newFoods]));
      
      return {
        success: true,
        imported: foodsToImport.length,
        errors: errors
      };
    } catch (error) {
      console.error('Error importing foods:', error);
      return {
        success: false,
        imported: 0,
        errors: 1
      };
    }
  },

  /**
   * Ersetzt die Lebensmitteldatenbank mit neuen Daten
   */
  replaceDatabase: (foodsData: any[]): { success: boolean; count: number } => {
    try {
      // Konvertiere die deutschen Feldnamen in englische Feldnamen
      const convertedFoods: Food[] = foodsData.map(item => ({
        id: Date.now() + Math.random().toString(36).substring(2, 10),
        name: item.Name || item.name || 'Unbekannt',
        calories: item.Kalorien || item.calories || 0,
        protein: item.Protein || item.protein || 0,
        carbs: item.Kohlenhydrate || item.carbs || 0,
        fat: item.Fett || item.fat || 0,
        servingSize: item.servingSize || 100,
        servingUnit: item.servingUnit || 'g',
        category: item.category || item.Kategorie || determineCategory(item.Name || item.name || ''),
        isCustom: false
      }));

      // Speichere die konvertierten Lebensmittel in der Datenbank
      localStorage.setItem(FOOD_DATABASE_KEY, JSON.stringify(convertedFoods));
      localStorage.setItem(LAST_UPDATE_KEY, new Date().toISOString());

      return {
        success: true,
        count: convertedFoods.length
      };
    } catch (error) {
      console.error('Fehler beim Ersetzen der Datenbank:', error);
      return {
        success: false,
        count: 0
      };
    }
  },

  /**
   * Erweitert die bestehende Lebensmitteldatenbank mit neuen Daten
   * Bestehende Lebensmittel werden nicht überschrieben
   */
  extendDatabase: (foodsData: any[]): { success: boolean; added: number } => {
    try {
      // Lade bestehende Lebensmittel
      const existingFoods = FoodService.getAllFoods();
      const existingNames = new Set(existingFoods.map(food => food.name.toLowerCase()));
      
      // Konvertiere die neuen Daten und filtere Duplikate heraus
      const newFoods = foodsData
        .filter(item => {
          const name = (item.Name || item.name || '').toLowerCase();
          return name && !existingNames.has(name);
        })
        .map(item => ({
          id: Date.now() + Math.random().toString(36).substring(2, 10),
          name: item.Name || item.name || 'Unbekannt',
          calories: item.Kalorien || item.calories || 0,
          protein: item.Protein || item.protein || 0,
          carbs: item.Kohlenhydrate || item.carbs || 0,
          fat: item.Fett || item.fat || 0,
          servingSize: item.servingSize || 100,
          servingUnit: item.servingUnit || 'g',
          category: item.category || item.Kategorie || determineCategory(item.Name || item.name || ''),
          isCustom: false
        }));

      // Kombiniere bestehende und neue Lebensmittel
      const updatedFoods = [...existingFoods, ...newFoods];
      localStorage.setItem(FOOD_DATABASE_KEY, JSON.stringify(updatedFoods));
      localStorage.setItem(LAST_UPDATE_KEY, new Date().toISOString());

      return {
        success: true,
        added: newFoods.length
      };
    } catch (error) {
      console.error('Fehler beim Erweitern der Datenbank:', error);
      return {
        success: false,
        added: 0
      };
    }
  },
  
  /**
   * Lädt eine JSON-Datei mit Lebensmitteln und aktualisiert die Datenbank
   * @param jsonUrl URL zur JSON-Datei oder File-Objekt
   * @param mode 'replace' ersetzt die gesamte Datenbank, 'extend' fügt nur neue Lebensmittel hinzu
   */
  loadFoodDatabaseFromJson: async (
    jsonSource: string | File,
    mode: 'replace' | 'extend' = 'extend'
  ): Promise<{ success: boolean; message: string; count: number }> => {
    try {
      let jsonData: string;
      
      // Lade Daten aus URL oder File
      if (typeof jsonSource === 'string') {
        // Falls es eine URL ist
        const response = await fetch(jsonSource);
        if (!response.ok) {
          throw new Error(`Fehler beim Laden der Datei: ${response.statusText}`);
        }
        jsonData = await response.text();
      } else {
        // Falls es ein File-Objekt ist
        jsonData = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsText(jsonSource);
        });
      }
      
      // Parse JSON
      const parsedData = JSON.parse(jsonData);
      
      // Extrahiere Lebensmittel aus der JSON-Struktur
      const foodsArray = Array.isArray(parsedData) 
        ? parsedData 
        : parsedData.foods || [];
      
      if (foodsArray.length === 0) {
        return {
          success: false,
          message: 'Keine gültigen Lebensmitteldaten in der Datei gefunden',
          count: 0
        };
      }
      
      // Update der Datenbank
      let result;
      if (mode === 'replace') {
        result = FoodService.replaceDatabase(foodsArray);
        return {
          success: result.success,
          message: result.success 
            ? `Datenbank erfolgreich ersetzt mit ${result.count} Lebensmitteln` 
            : 'Fehler beim Ersetzen der Datenbank',
          count: result.count
        };
      } else {
        result = FoodService.extendDatabase(foodsArray);
        return {
          success: result.success,
          message: result.success 
            ? `Datenbank erfolgreich erweitert um ${result.added} neue Lebensmittel` 
            : 'Fehler beim Erweitern der Datenbank',
          count: result.added
        };
      }
    } catch (error) {
      console.error('Fehler beim Laden der Lebensmitteldatenbank:', error);
      return {
        success: false,
        message: `Fehler: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`,
        count: 0
      };
    }
  },
  
  /**
   * Gibt das Datum der letzten Aktualisierung der Lebensmitteldatenbank zurück
   */
  getLastUpdateDate: (): Date | null => {
    const lastUpdate = localStorage.getItem(LAST_UPDATE_KEY);
    return lastUpdate ? new Date(lastUpdate) : null;
  },

  /**
   * Setzt die Lebensmitteldatenbank auf die Standardwerte zurück
   * @returns Ein Objekt mit Informationen über den Erfolg und die Anzahl der geladenen Lebensmittel
   */
  resetDatabase: (): { success: boolean; count: number } => {
    try {
      // Leere die bestehende Datenbank
      localStorage.removeItem(FOOD_DATABASE_KEY);
      
      // Initialisiere die Datenbank neu mit Standardwerten
      FoodService.initFoodDatabase();
      
      // Setze das Aktualisierungsdatum
      localStorage.setItem(LAST_UPDATE_KEY, new Date().toISOString());
      
      return {
        success: true,
        count: defaultFoods.length
      };
    } catch (error) {
      console.error('Fehler beim Zurücksetzen der Datenbank:', error);
      return {
        success: false,
        count: 0
      };
    }
  }
};

/**
 * Hilfsfunktion zur Bestimmung der Kategorie basierend auf dem Namen
 */
function determineCategory(name: string): string {
  const lowerName = name.toLowerCase();
  
  if (lowerName.includes('fleisch') || lowerName.includes('hähnchen') || lowerName.includes('huhn') || lowerName.includes('rind') || lowerName.includes('schwein')) {
    return 'Fleisch';
  } else if (lowerName.includes('fisch') || lowerName.includes('lachs') || lowerName.includes('thunfisch')) {
    return 'Fisch';
  } else if (lowerName.includes('obst') || lowerName.includes('apfel') || lowerName.includes('banane') || lowerName.includes('beere')) {
    return 'Obst';
  } else if (lowerName.includes('gemüse') || lowerName.includes('gemuse') || lowerName.includes('karotte') || lowerName.includes('spinat') || lowerName.includes('salat') || lowerName.includes('tomate') || lowerName.includes('erbse')) {
    return 'Gemüse';
  } else if (lowerName.includes('milch') || lowerName.includes('käse') || lowerName.includes('joghurt') || lowerName.includes('quark')) {
    return 'Milchprodukte';
  } else if (lowerName.includes('getreide') || lowerName.includes('reis') || lowerName.includes('hafer') || lowerName.includes('brot') || lowerName.includes('nudel') || lowerName.includes('pasta') || lowerName.includes('müsli')) {
    return 'Getreide';
  } else if (lowerName.includes('nuss') || lowerName.includes('mandel') || lowerName.includes('erdnuss')) {
    return 'Nüsse & Samen';
  } else if (lowerName.includes('ei')) {
    return 'Eier';
  } else if (lowerName.includes('linse') || lowerName.includes('bohne') || lowerName.includes('tofu')) {
    return 'Hülsenfrüchte';
  } else if (lowerName.includes('öl') || lowerName.includes('butter') || lowerName.includes('margarine')) {
    return 'Fette & Öle';
  } else if (lowerName.includes('zucker') || lowerName.includes('honig') || lowerName.includes('schokolade') || lowerName.includes('süßigkeit')) {
    return 'Süßigkeiten';
  } else if (lowerName.includes('kartoffel')) {
    return 'Kartoffeln';
  } else if (lowerName.includes('avocado')) {
    return 'Obst';
  }
  
  return 'Sonstiges';
} 