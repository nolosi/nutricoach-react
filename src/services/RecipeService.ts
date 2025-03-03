// Typen für Rezepte
export interface Recipe {
  id: string;
  title: string;
  image: string;
  difficulty: 'easy' | 'medium' | 'hard';
  prepTime: number; // in Minuten
  servings: number;
  categories: string[];
  ingredients: string[];
  instructions: string[];
  calories: number; // Kalorien pro Portion
  protein: number; // Protein in Gramm pro Portion
  carbs: number; // Kohlenhydrate in Gramm pro Portion
  fat: number; // Fett in Gramm pro Portion
}

// Interface für Meal Plan Einträge
export interface MealPlanEntry {
  date: string;
  recipeId: string;
  mealType: string;
}

// Interface für Meal Plan Ergebnisse
export interface MealPlanResult {
  mealType: string;
  recipe: Recipe;
}

// Mock-Daten für Rezepte
const mockRecipes: Recipe[] = [
  {
    id: '1',
    title: 'Protein Pancakes',
    image: 'https://images.unsplash.com/photo-1575853121743-60c24f0a7502?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGFuY2FrZXN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
    difficulty: 'easy',
    prepTime: 15,
    servings: 2,
    categories: ['breakfast', 'high-protein', 'quick'],
    ingredients: [
      '1 Banane',
      '2 Eier',
      '30g Proteinpulver',
      '1 TL Backpulver',
      'Etwas Zimt'
    ],
    instructions: [
      'Banane zerdrücken und mit den Eiern verquirlen',
      'Proteinpulver und Backpulver hinzufügen und verrühren',
      'Zimt nach Geschmack hinzufügen',
      'In einer Pfanne bei mittlerer Hitze kleine Pancakes braten'
    ],
    calories: 320,
    protein: 25,
    carbs: 30,
    fat: 10
  },
  {
    id: '2',
    title: 'Griechischer Salat',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Z3JlZWslMjBzYWxhZHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
    difficulty: 'easy',
    prepTime: 10,
    servings: 2,
    categories: ['lunch', 'vegetarian', 'quick'],
    ingredients: [
      '1 Gurke',
      '3 Tomaten',
      '1 rote Zwiebel',
      '200g Feta',
      'Oliven',
      'Olivenöl',
      'Salz und Pfeffer'
    ],
    instructions: [
      'Gemüse in mundgerechte Stücke schneiden',
      'Feta würfeln',
      'Alles in einer Schüssel vermischen',
      'Mit Olivenöl, Salz und Pfeffer abschmecken'
    ],
    calories: 280,
    protein: 12,
    carbs: 15,
    fat: 18
  },
  {
    id: '3',
    title: 'Hähnchen-Quinoa-Bowl',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Ym93bHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
    difficulty: 'medium',
    prepTime: 30,
    servings: 2,
    categories: ['dinner', 'high-protein', 'meal-prep'],
    ingredients: [
      '200g Quinoa',
      '400g Hähnchenbrust',
      'Verschiedenes Gemüse nach Wahl',
      'Olivenöl',
      'Gewürze nach Geschmack'
    ],
    instructions: [
      'Quinoa nach Packungsanweisung kochen',
      'Hähnchenbrust mit Gewürzen marinieren und braten',
      'Gemüse anbraten oder roh vorbereiten',
      'Alles in einer Schüssel anrichten'
    ],
    calories: 450,
    protein: 40,
    carbs: 45,
    fat: 12
  },
  {
    id: '4',
    title: 'Schokoladen-Protein-Smoothie',
    image: 'https://images.unsplash.com/photo-1629704792095-78194586bb26?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y2hvY29sYXRlJTIwc21vb3RoaWV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
    difficulty: 'easy',
    prepTime: 5,
    servings: 1,
    categories: ['breakfast', 'snack', 'high-protein'],
    ingredients: [
      '1 Banane',
      '250ml Milch',
      '30g Schokoladen-Proteinpulver',
      '1 EL Kakaopulver',
      '1 TL Honig (optional)'
    ],
    instructions: [
      'Alle Zutaten in einen Mixer geben',
      'Bis zur gewünschten Konsistenz mixen',
      'In ein Glas füllen und servieren'
    ],
    calories: 350,
    protein: 20,
    carbs: 25,
    fat: 15
  },
  {
    id: '5',
    title: 'Gemüsesuppe',
    image: 'https://images.unsplash.com/photo-1616501268209-edfff098fdd2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    difficulty: 'medium',
    prepTime: 45,
    servings: 4,
    categories: ['lunch', 'dinner', 'vegetarian'],
    ingredients: [
      'Verschiedenes Gemüse nach Wahl',
      '1 Zwiebel',
      '2 Knoblauchzehen',
      '1L Gemüsebrühe',
      'Kräuter nach Geschmack'
    ],
    instructions: [
      'Gemüse und Zwiebeln klein schneiden',
      'In einem großen Topf anbraten',
      'Mit Brühe aufgießen',
      'Bei niedriger Hitze 30 Minuten köcheln lassen',
      'Mit Gewürzen abschmecken'
    ],
    calories: 200,
    protein: 5,
    carbs: 10,
    fat: 10
  },
  {
    id: '6',
    title: 'Avocado-Toast',
    image: 'https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGF2b2NhZG8lMjB0b2FzdHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
    difficulty: 'easy',
    prepTime: 10,
    servings: 1,
    categories: ['breakfast', 'vegetarian', 'quick'],
    ingredients: [
      '2 Scheiben Vollkornbrot',
      '1 reife Avocado',
      'Salz und Pfeffer',
      'Chiliflocken',
      'Zitronensaft'
    ],
    instructions: [
      'Brot toasten',
      'Avocado zerdrücken und mit Zitronensaft, Salz und Pfeffer vermischen',
      'Auf das getoastete Brot streichen',
      'Mit Chiliflocken bestreuen',
      'Optional mit weiteren Zutaten belegen'
    ],
    calories: 200,
    protein: 3,
    carbs: 15,
    fat: 12
  },
  {
    id: '24',
    title: 'Brokkoli-Quinoa-Auflauf',
    image: 'https://images.unsplash.com/photo-1620981210415-c25e9fb1ae00?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    difficulty: 'medium',
    prepTime: 30,
    servings: 4,
    categories: ['dinner', 'vegetarian', 'meal-prep'],
    ingredients: [
      '200g Quinoa',
      '1 Brokkoli',
      '1 Zwiebel',
      '2 Knoblauchzehen',
      '1L Gemüsebrühe',
      'Kräuter nach Geschmack'
    ],
    instructions: [
      'Quinoa nach Packungsanweisung kochen',
      'Brokkoli und Zwiebeln klein schneiden',
      'In einem großen Topf anbraten',
      'Mit Brühe aufgießen',
      'Bei niedriger Hitze 30 Minuten köcheln lassen',
      'Mit Gewürzen abschmecken'
    ],
    calories: 300,
    protein: 10,
    carbs: 40,
    fat: 8
  },
  {
    id: '27',
    title: 'Gefüllte Süßkartoffeln mit Kichererbsen',
    image: 'https://images.unsplash.com/photo-1640885988938-6de6236a3148?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    difficulty: 'medium',
    prepTime: 20,
    servings: 4,
    categories: ['dinner', 'vegetarian', 'meal-prep'],
    ingredients: [
      '4 Süßkartoffeln',
      '200g Kichererbsen',
      '1 Zwiebel',
      '2 Knoblauchzehen',
      '1 EL Olivenöl',
      'Salz und Pfeffer',
      'Kräuter nach Geschmack'
    ],
    instructions: [
      'Süßkartoffeln schälen und in mundgerechte Stücke schneiden',
      'Kichererbsen nach Packungsanweisung kochen',
      'Zwiebel und Knoblauch klein schneiden',
      'In einem großen Topf anbraten',
      'Mit Olivenöl, Salz und Pfeffer abschmecken',
      'Alles in einer Schüssel anrichten'
    ],
    calories: 250,
    protein: 10,
    carbs: 30,
    fat: 8
  }
];

// Schlüssel für den Local Storage
const SAVED_RECIPES_KEY = 'nutricoach_saved_recipes';
const MEAL_PLAN_KEY = 'nutricoach_meal_plan';

/**
 * Service für die Verwaltung von Rezepten
 */
export const RecipeService = {
  /**
   * Alle benutzerdefinierten Rezepte abrufen
   */
  getUserRecipes: (): Recipe[] => {
    const savedRecipes = localStorage.getItem('nutricoach_user_recipes');
    return savedRecipes ? JSON.parse(savedRecipes) : [];
  },

  /**
   * Alle Rezepte abrufen
   */
  getAllRecipes: (): Promise<Recipe[]> => {
    return new Promise((resolve) => {
      // Simulieren einer API-Anfrage mit einer kurzen Verzögerung
      setTimeout(() => {
        // Kombiniere Standard-Rezepte mit benutzerdefinierten Rezepten
        const userRecipes = RecipeService.getUserRecipes();
        resolve([...mockRecipes, ...userRecipes]);
      }, 500);
    });
  },

  /**
   * Ein Rezept anhand seiner ID abrufen
   */
  getRecipeById: (id: string): Promise<Recipe | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const recipe = mockRecipes.find(r => r.id === id) || null;
        resolve(recipe);
      }, 300);
    });
  },

  /**
   * Rezepte nach Kategorien filtern
   */
  getRecipesByCategory: (category: string): Promise<Recipe[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filteredRecipes = mockRecipes.filter(recipe => 
          recipe.categories.includes(category)
        );
        resolve(filteredRecipes);
      }, 300);
    });
  },

  /**
   * Rezepte nach Suchbegriff filtern
   */
  searchRecipes: (searchTerm: string): Promise<Recipe[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const term = searchTerm.toLowerCase();
        const filteredRecipes = mockRecipes.filter(recipe => 
          recipe.title.toLowerCase().includes(term) ||
          recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(term)) ||
          recipe.categories.some(category => category.toLowerCase().includes(term))
        );
        resolve(filteredRecipes);
      }, 300);
    });
  },

  /**
   * Ein neues Rezept erstellen
   */
  createRecipe: (newRecipe: Omit<Recipe, 'id'>): Promise<Recipe> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Lade alle gespeicherten benutzerdefinierten Rezepte
        const savedRecipes = localStorage.getItem('nutricoach_user_recipes');
        const userRecipes: Recipe[] = savedRecipes ? JSON.parse(savedRecipes) : [];
        
        // Generiere eine eindeutige ID für das neue Rezept
        // Format: user-recipe-{timestamp}
        const id = `user-recipe-${Date.now()}`;
        
        // Erstelle das neue Rezept mit der generierten ID
        const recipe: Recipe = {
          ...newRecipe,
          id
        };
        
        // Füge das neue Rezept hinzu und speichere es im Local Storage
        userRecipes.push(recipe);
        localStorage.setItem('nutricoach_user_recipes', JSON.stringify(userRecipes));
        
        resolve(recipe);
      }, 300);
    });
  },

  /**
   * Gespeicherte Rezepte abrufen
   */
  getSavedRecipes: (): string[] => {
    const savedRecipes = localStorage.getItem(SAVED_RECIPES_KEY);
    return savedRecipes ? JSON.parse(savedRecipes) : [];
  },

  /**
   * Prüfen, ob ein Rezept gespeichert ist
   */
  isRecipeSaved: (recipeId: string): boolean => {
    const savedRecipes = RecipeService.getSavedRecipes();
    return savedRecipes.includes(recipeId);
  },

  /**
   * Ein Rezept speichern oder aus den gespeicherten entfernen
   */
  toggleSaveRecipe: (recipeId: string): boolean => {
    const savedRecipes = RecipeService.getSavedRecipes();
    const isCurrentlySaved = savedRecipes.includes(recipeId);
    
    let newSavedRecipes: string[];
    
    if (isCurrentlySaved) {
      // Rezept aus den gespeicherten entfernen
      newSavedRecipes = savedRecipes.filter(id => id !== recipeId);
    } else {
      // Rezept zu den gespeicherten hinzufügen
      newSavedRecipes = [...savedRecipes, recipeId];
    }
    
    localStorage.setItem(SAVED_RECIPES_KEY, JSON.stringify(newSavedRecipes));
    return !isCurrentlySaved; // Gibt zurück, ob das Rezept jetzt gespeichert ist
  },

  /**
   * Alle gespeicherten Rezepte abrufen
   */
  getAllSavedRecipes: async (): Promise<Recipe[]> => {
    const savedRecipeIds = RecipeService.getSavedRecipes();
    const allRecipes = await RecipeService.getAllRecipes();
    
    return allRecipes.filter(recipe => savedRecipeIds.includes(recipe.id));
  },

  /**
   * Essensplan abrufen
   */
  getMealPlan: (): MealPlanEntry[] => {
    const mealPlan = localStorage.getItem(MEAL_PLAN_KEY);
    return mealPlan ? JSON.parse(mealPlan) : [];
  },

  /**
   * Rezept zum Essensplan hinzufügen
   */
  addToMealPlan: (recipeId: string, date: string, mealType: string): void => {
    const mealPlan = RecipeService.getMealPlan();
    
    // Prüfen, ob bereits ein Eintrag für dieses Datum und diese Mahlzeit existiert
    const existingEntryIndex = mealPlan.findIndex(
      entry => entry.date === date && entry.mealType === mealType
    );
    
    if (existingEntryIndex >= 0) {
      // Bestehenden Eintrag aktualisieren
      mealPlan[existingEntryIndex].recipeId = recipeId;
    } else {
      // Neuen Eintrag hinzufügen
      mealPlan.push({ date, recipeId, mealType });
    }
    
    localStorage.setItem(MEAL_PLAN_KEY, JSON.stringify(mealPlan));
  },

  /**
   * Rezept aus dem Essensplan entfernen
   */
  removeFromMealPlan: (date: string, mealType: string): void => {
    const mealPlan = RecipeService.getMealPlan();
    const updatedMealPlan = mealPlan.filter(
      entry => !(entry.date === date && entry.mealType === mealType)
    );
    
    localStorage.setItem(MEAL_PLAN_KEY, JSON.stringify(updatedMealPlan));
  },

  /**
   * Essensplan für ein bestimmtes Datum abrufen
   */
  getMealPlanForDate: async (date: string): Promise<MealPlanResult[]> => {
    const mealPlan = RecipeService.getMealPlan();
    const entriesForDate = mealPlan.filter(entry => entry.date === date);
    
    const result: MealPlanResult[] = [];
    
    for (const entry of entriesForDate) {
      const recipe = await RecipeService.getRecipeById(entry.recipeId);
      if (recipe) {
        result.push({
          mealType: entry.mealType,
          recipe
        });
      }
    }
    
    return result;
  },

  /**
   * Ein bestehendes Rezept aktualisieren
   */
  updateRecipe: (id: string, updatedRecipe: Omit<Recipe, 'id'>): Promise<Recipe | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Prüfen, ob es ein benutzerdefiniertes Rezept ist
        if (!id.startsWith('user-recipe-')) {
          // Kann nur benutzerdefinierte Rezepte aktualisieren
          resolve(null);
          return;
        }
        
        // Lade alle gespeicherten benutzerdefinierten Rezepte
        const savedRecipes = localStorage.getItem('nutricoach_user_recipes');
        let userRecipes: Recipe[] = savedRecipes ? JSON.parse(savedRecipes) : [];
        
        // Suche nach dem Rezept mit der gegebenen ID
        const index = userRecipes.findIndex(recipe => recipe.id === id);
        
        if (index === -1) {
          // Rezept nicht gefunden
          resolve(null);
          return;
        }
        
        // Aktualisiere das Rezept
        const updatedRecipeWithId: Recipe = {
          ...updatedRecipe,
          id
        };
        
        userRecipes[index] = updatedRecipeWithId;
        
        // Speichere die Änderungen im Local Storage
        localStorage.setItem('nutricoach_user_recipes', JSON.stringify(userRecipes));
        
        resolve(updatedRecipeWithId);
      }, 300);
    });
  },

  /**
   * Ein Rezept löschen
   */
  deleteRecipe: (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Prüfen, ob es ein benutzerdefiniertes Rezept ist
        if (!id.startsWith('user-recipe-')) {
          // Kann nur benutzerdefinierte Rezepte löschen
          resolve(false);
          return;
        }
        
        // Lade alle gespeicherten benutzerdefinierten Rezepte
        const savedRecipes = localStorage.getItem('nutricoach_user_recipes');
        let userRecipes: Recipe[] = savedRecipes ? JSON.parse(savedRecipes) : [];
        
        // Entferne das Rezept mit der gegebenen ID
        const initialLength = userRecipes.length;
        userRecipes = userRecipes.filter(recipe => recipe.id !== id);
        
        if (userRecipes.length === initialLength) {
          // Rezept nicht gefunden oder nicht entfernt
          resolve(false);
          return;
        }
        
        // Speichere die Änderungen im Local Storage
        localStorage.setItem('nutricoach_user_recipes', JSON.stringify(userRecipes));
        
        // Entferne das Rezept auch aus Meal Plan, wenn es dort verwendet wird
        const mealPlan = RecipeService.getMealPlan();
        const updatedMealPlan = mealPlan.filter(entry => entry.recipeId !== id);
        localStorage.setItem(MEAL_PLAN_KEY, JSON.stringify(updatedMealPlan));
        
        // Entferne das Rezept auch aus gespeicherten Rezepten, wenn es dort vorhanden ist
        const savedRecipeIds = RecipeService.getSavedRecipes();
        if (savedRecipeIds.includes(id)) {
          const updatedSavedRecipes = savedRecipeIds.filter(recipeId => recipeId !== id);
          localStorage.setItem(SAVED_RECIPES_KEY, JSON.stringify(updatedSavedRecipes));
        }
        
        resolve(true);
      }, 300);
    });
  }
};

export default RecipeService; 