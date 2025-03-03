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
    image: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
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
    image: 'https://images.unsplash.com/photo-1551248429-40975aa4de74?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
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
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
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
    image: 'https://images.unsplash.com/photo-1577805947697-89e18249d767?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
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
    image: 'https://images.unsplash.com/photo-1605291535361-c90ca7696400?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
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
    image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
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
    id: '20',
    title: 'Gesunder Schokoshake',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    difficulty: 'easy',
    prepTime: 5,
    servings: 1,
    categories: ['breakfast', 'snack', 'quick'],
    ingredients: [
      '1 gefrorene Banane',
      '250ml Mandelmilch',
      '1 EL Kakaopulver',
      '1 TL Erdnussbutter',
      '1 Dattel',
      'Eiswürfel'
    ],
    instructions: [
      'Alle Zutaten in einen Mixer geben',
      'Cremig pürieren',
      'In ein Glas füllen und sofort genießen'
    ],
    calories: 220,
    protein: 5,
    carbs: 36,
    fat: 8
  },
  {
    id: '21',
    title: 'Rührei mit Spinat und Feta',
    image: 'https://images.unsplash.com/photo-1510693206972-df098062cb71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    difficulty: 'easy',
    prepTime: 12,
    servings: 1,
    categories: ['breakfast', 'high-protein', 'quick'],
    ingredients: [
      '3 Eier',
      '50g frischer Spinat',
      '50g Feta-Käse',
      '1/2 Zwiebel',
      '1 EL Olivenöl',
      'Salz und Pfeffer'
    ],
    instructions: [
      'Zwiebel fein hacken und in Olivenöl glasig dünsten',
      'Spinat hinzufügen und zusammenfallen lassen',
      'Eier verquirlen, würzen und in die Pfanne geben',
      'Bei mittlerer Hitze stocken lassen und gelegentlich umrühren',
      'Feta darüber bröseln und kurz schmelzen lassen'
    ],
    calories: 340,
    protein: 25,
    carbs: 5,
    fat: 22
  },
  {
    id: '22',
    title: 'Tomaten-Mozzarella-Salat',
    image: 'https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    difficulty: 'easy',
    prepTime: 10,
    servings: 2,
    categories: ['lunch', 'vegetarian', 'quick'],
    ingredients: [
      '3 große Tomaten',
      '250g Mozzarella',
      'Frisches Basilikum',
      'Hochwertiges Olivenöl',
      'Balsamico-Essig',
      'Salz und Pfeffer'
    ],
    instructions: [
      'Tomaten und Mozzarella in Scheiben schneiden',
      'Abwechselnd auf einem Teller anrichten',
      'Basilikumblätter darüber streuen',
      'Mit Olivenöl und Balsamico beträufeln',
      'Mit Salz und Pfeffer würzen'
    ],
    calories: 300,
    protein: 18,
    carbs: 8,
    fat: 21
  },
  {
    id: '23',
    title: 'Vollkorn-Wrap mit Huhn',
    image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    difficulty: 'easy',
    prepTime: 15,
    servings: 2,
    categories: ['lunch', 'high-protein', 'quick'],
    ingredients: [
      '2 Vollkorn-Wraps',
      '200g gekochtes Hühnerfleisch',
      '1 Avocado',
      '50g Blattsalat',
      '1/2 Gurke',
      '2 EL Joghurt',
      'Saft einer halben Zitrone',
      'Salz und Pfeffer'
    ],
    instructions: [
      'Hühnerfleisch in Streifen schneiden',
      'Avocado halbieren, entkernen und in Scheiben schneiden',
      'Joghurt mit Zitronensaft, Salz und Pfeffer zu einer Sauce verrühren',
      'Wraps kurz erwärmen',
      'Alle Zutaten auf die Wraps verteilen',
      'Sauce darüber geben',
      'Wraps einrollen und servieren'
    ],
    calories: 390,
    protein: 30,
    carbs: 35,
    fat: 16
  },
  {
    id: '24',
    title: 'Brokkoli-Quinoa-Auflauf',
    image: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    difficulty: 'medium',
    prepTime: 40,
    servings: 4,
    categories: ['dinner', 'vegetarian', 'meal-prep'],
    ingredients: [
      '200g Quinoa',
      '1 großer Brokkoli',
      '200g Feta-Käse',
      '100g geriebener Käse',
      '3 Eier',
      '200ml Milch',
      '2 Knoblauchzehen',
      'Olivenöl',
      'Salz, Pfeffer und Muskat'
    ],
    instructions: [
      'Quinoa nach Packungsanweisung kochen',
      'Brokkoli in kleine Röschen teilen und blanchieren',
      'Knoblauch fein hacken',
      'Eier und Milch verquirlen, mit Gewürzen abschmecken',
      'Feta zerbröckeln',
      'Alle Zutaten in einer Auflaufform vermischen',
      'Mit geriebenem Käse bestreuen',
      'Bei 180°C etwa 25-30 Minuten backen'
    ],
    calories: 380,
    protein: 22,
    carbs: 35,
    fat: 18
  },
  {
    id: '25',
    title: 'Kürbissuppe mit Kokosmilch',
    image: 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    difficulty: 'medium',
    prepTime: 35,
    servings: 4,
    categories: ['lunch', 'dinner', 'vegetarian'],
    ingredients: [
      '1 mittelgroßer Hokkaido-Kürbis',
      '1 Zwiebel',
      '2 Knoblauchzehen',
      '1 Stück Ingwer',
      '1 Dose Kokosmilch',
      '500ml Gemüsebrühe',
      'Currypulver',
      'Kürbiskerne zum Garnieren',
      'Olivenöl',
      'Salz und Pfeffer'
    ],
    instructions: [
      'Kürbis waschen, entkernen und in Würfel schneiden',
      'Zwiebel, Knoblauch und Ingwer fein hacken',
      'In Olivenöl anbraten, bis die Zwiebel glasig ist',
      'Kürbiswürfel und Currypulver hinzufügen, kurz mitbraten',
      'Mit Gemüsebrühe ablöschen und 15-20 Minuten köcheln lassen',
      'Kokosmilch hinzufügen',
      'Alles pürieren und mit Salz und Pfeffer abschmecken',
      'Mit gerösteten Kürbiskernen garnieren'
    ],
    calories: 290,
    protein: 5,
    carbs: 20,
    fat: 22
  },
  {
    id: '26',
    title: 'Mandel-Honig-Granola',
    image: 'https://images.unsplash.com/photo-1517093157656-b9eccef91cb1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    difficulty: 'easy',
    prepTime: 30,
    servings: 10,
    categories: ['breakfast', 'snack', 'meal-prep'],
    ingredients: [
      '300g Haferflocken',
      '100g gehackte Mandeln',
      '50g Sonnenblumenkerne',
      '50g Kürbiskerne',
      '50g Kokosraspeln',
      '80g Honig',
      '50g Kokosöl',
      '1 TL Vanilleextrakt',
      '1 TL Zimt'
    ],
    instructions: [
      'Ofen auf 150°C vorheizen',
      'Alle trockenen Zutaten in einer Schüssel mischen',
      'Kokosöl schmelzen und mit Honig und Vanilleextrakt verrühren',
      'Flüssige Zutaten über die trockenen gießen und gut vermischen',
      'Auf einem mit Backpapier ausgelegten Blech verteilen',
      '25-30 Minuten backen, dabei alle 10 Minuten umrühren',
      'Vollständig abkühlen lassen, bevor es in einem luftdichten Behälter aufbewahrt wird'
    ],
    calories: 210,
    protein: 6,
    carbs: 20,
    fat: 12
  },
  {
    id: '27',
    title: 'Gefüllte Süßkartoffeln mit Kichererbsen',
    image: 'https://images.unsplash.com/photo-1596951609925-e868fdf877a7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    difficulty: 'medium',
    prepTime: 50,
    servings: 2,
    categories: ['dinner', 'vegetarian', 'gluten-free'],
    ingredients: [
      '2 große Süßkartoffeln',
      '1 Dose Kichererbsen',
      '1 rote Paprika',
      '1 Handvoll Spinat',
      '1 Zwiebel',
      '2 Knoblauchzehen',
      'Kreuzkümmel',
      'Paprikapulver',
      'Chiliflocken',
      'Olivenöl',
      'Salz und Pfeffer',
      'Frischer Koriander'
    ],
    instructions: [
      'Süßkartoffeln waschen und mit einer Gabel mehrmals einstechen',
      'Im Ofen bei 200°C ca. 40-45 Minuten backen, bis sie weich sind',
      'Zwiebel und Knoblauch fein hacken, Paprika würfeln',
      'In Olivenöl anbraten, Gewürze hinzufügen',
      'Kichererbsen abtropfen lassen und hinzugeben, 5 Minuten braten',
      'Spinat untermischen, bis er zusammenfällt',
      'Süßkartoffeln längs aufschneiden und etwas auseinander drücken',
      'Mit der Kichererbsen-Mischung füllen',
      'Mit frischem Koriander garnieren'
    ],
    calories: 380,
    protein: 12,
    carbs: 60,
    fat: 10
  },
  {
    id: '28',
    title: 'Apfel-Zimt-Porridge',
    image: 'https://images.unsplash.com/photo-1586511925558-a4c6376fe65f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    difficulty: 'easy',
    prepTime: 15,
    servings: 1,
    categories: ['breakfast', 'vegetarian', 'quick'],
    ingredients: [
      '50g Haferflocken',
      '200ml Milch oder Pflanzenmilch',
      '1 Apfel',
      '1 TL Zimt',
      '1 TL Honig oder Ahornsirup',
      '10g Walnüsse'
    ],
    instructions: [
      'Haferflocken mit Milch in einen Topf geben',
      'Bei mittlerer Hitze unter Rühren zum Kochen bringen',
      'Apfel waschen, entkernen und in kleine Würfel schneiden',
      'Die Hälfte der Apfelwürfel in den Haferbrei geben',
      '5 Minuten köcheln lassen, dabei gelegentlich umrühren',
      'In eine Schüssel geben, mit restlichen Apfelwürfeln, Zimt, Honig und gehackten Walnüssen toppen'
    ],
    calories: 340,
    protein: 10,
    carbs: 52,
    fat: 12
  },
  {
    id: '29',
    title: 'Tofu-Gemüse-Pfanne mit Teriyaki-Sauce',
    image: 'https://images.unsplash.com/photo-1546069901-d5bfd2cbfb1f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    difficulty: 'medium',
    prepTime: 25,
    servings: 2,
    categories: ['dinner', 'vegan', 'asian-inspired'],
    ingredients: [
      '200g fester Tofu',
      'Gemischtes Gemüse (Paprika, Brokkoli, Karotten, Zuckerschoten)',
      '2 EL Sojasoße',
      '1 EL Honig oder Ahornsirup',
      '1 TL Sesamöl',
      '1 EL Reisessig',
      '1 Knoblauchzehe',
      '1 Stück Ingwer',
      'Sesamsamen zum Garnieren',
      'Rapsöl zum Braten'
    ],
    instructions: [
      'Tofu in Würfel schneiden und auf Küchenpapier abtropfen lassen',
      'Gemüse waschen und in mundgerechte Stücke schneiden',
      'Knoblauch und Ingwer fein hacken',
      'Für die Teriyaki-Sauce Sojasoße, Honig, Sesamöl und Reisessig vermischen',
      'Tofu in heißem Öl von allen Seiten goldbraun braten',
      'Aus der Pfanne nehmen und beiseite stellen',
      'Gemüse, Knoblauch und Ingwer im selben Öl anbraten',
      'Tofu zurück in die Pfanne geben',
      'Teriyaki-Sauce hinzufügen und alles kurz einkochen lassen',
      'Mit Sesamsamen bestreuen und servieren'
    ],
    calories: 320,
    protein: 18,
    carbs: 25,
    fat: 16
  },
  {
    id: '30',
    title: 'Grüner Detox-Smoothie',
    image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z3JlZW4lMjBzbW9vdGhpZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
    difficulty: 'easy',
    prepTime: 5,
    servings: 1,
    categories: ['breakfast', 'snack', 'detox'],
    ingredients: [
      '1 Handvoll Spinat',
      '1/2 Gurke',
      '1 grüner Apfel',
      '1 Stange Sellerie',
      'Saft einer halben Zitrone',
      '1 Stück Ingwer',
      '200ml Wasser',
      'Eiswürfel (optional)'
    ],
    instructions: [
      'Alle Zutaten waschen',
      'Apfel entkernen und in Stücke schneiden',
      'Gurke und Sellerie in Stücke schneiden',
      'Ingwer schälen',
      'Alle Zutaten in einen Mixer geben',
      'Pürieren, bis eine glatte Konsistenz entsteht',
      'In ein Glas gießen und sofort genießen'
    ],
    calories: 120,
    protein: 2,
    carbs: 28,
    fat: 0
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