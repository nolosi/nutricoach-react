/**
 * Service für die Verwaltung von Lebensmitteln und Mahlzeiten
 */

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

// Beispiel-Lebensmittel für die Datenbank
const defaultFoods: Food[] = [
  {
    id: '1',
    name: 'Haferflocken',
    calories: 370,
    protein: 13,
    carbs: 59,
    fat: 7,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Getreide'
  },
  {
    id: '2',
    name: 'Vollmilch',
    calories: 65,
    protein: 3.3,
    carbs: 4.7,
    fat: 3.6,
    servingSize: 100,
    servingUnit: 'ml',
    category: 'Milchprodukte'
  },
  {
    id: '3',
    name: 'Banane',
    calories: 89,
    protein: 1.1,
    carbs: 22.8,
    fat: 0.3,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Obst'
  },
  {
    id: '4',
    name: 'Hühnerbrust',
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Fleisch'
  },
  {
    id: '5',
    name: 'Vollkornbrot',
    calories: 247,
    protein: 8.5,
    carbs: 41.3,
    fat: 3.4,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Getreide'
  },
  {
    id: '6',
    name: 'Käse (Gouda)',
    calories: 356,
    protein: 25,
    carbs: 2.2,
    fat: 27.4,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Milchprodukte'
  },
  {
    id: '7',
    name: 'Apfel',
    calories: 52,
    protein: 0.3,
    carbs: 13.8,
    fat: 0.2,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Obst'
  },
  {
    id: '8',
    name: 'Reis (gekocht)',
    calories: 130,
    protein: 2.7,
    carbs: 28.2,
    fat: 0.3,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Getreide'
  },
  {
    id: '9',
    name: 'Ei',
    calories: 155,
    protein: 12.6,
    carbs: 1.1,
    fat: 11.2,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Eier'
  },
  {
    id: '10',
    name: 'Thunfisch (in Wasser)',
    calories: 116,
    protein: 25.5,
    carbs: 0,
    fat: 1,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Fisch'
  },
  // Neue Lebensmittel
  {
    id: '11',
    name: 'Hähnchenbrust',
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Fleisch'
  },
  {
    id: '12',
    name: 'Lachs',
    calories: 208,
    protein: 20,
    carbs: 0,
    fat: 13,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Fisch'
  },
  {
    id: '13',
    name: 'Thunfisch (Dose)',
    calories: 128,
    protein: 29,
    carbs: 0,
    fat: 1,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Fisch'
  },
  {
    id: '14',
    name: 'Kartoffeln',
    calories: 86,
    protein: 1.7,
    carbs: 19.1,
    fat: 0.1,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Kartoffeln'
  },
  {
    id: '15',
    name: 'Süßkartoffeln',
    calories: 86,
    protein: 1.6,
    carbs: 20.1,
    fat: 0.1,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Kartoffeln'
  },
  {
    id: '16',
    name: 'Roggen-Vollkornbrot',
    calories: 244,
    protein: 6.4,
    carbs: 41.3,
    fat: 2.9,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Getreide'
  },
  {
    id: '17',
    name: 'Avocado',
    calories: 160,
    protein: 2,
    carbs: 8.5,
    fat: 14.7,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Obst'
  },
  {
    id: '18',
    name: 'Spinat',
    calories: 23,
    protein: 2.9,
    carbs: 3.6,
    fat: 0.4,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Gemüse'
  },
  {
    id: '19',
    name: 'Brokkoli',
    calories: 34,
    protein: 2.8,
    carbs: 6.6,
    fat: 0.4,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Gemüse'
  },
  {
    id: '20',
    name: 'Hüttenkäse',
    calories: 98,
    protein: 11.1,
    carbs: 3.4,
    fat: 4.3,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Milchprodukte'
  },
  {
    id: '21',
    name: 'Magerquark',
    calories: 73,
    protein: 13.5,
    carbs: 4.0,
    fat: 0.2,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Milchprodukte'
  },
  {
    id: '22',
    name: 'Griechischer Joghurt',
    calories: 97,
    protein: 9.0,
    carbs: 3.6,
    fat: 5.0,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Milchprodukte'
  },
  {
    id: '23',
    name: 'Mandeln',
    calories: 576,
    protein: 21.2,
    carbs: 21.7,
    fat: 49.4,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Nüsse & Samen'
  },
  {
    id: '24',
    name: 'Walnüsse',
    calories: 654,
    protein: 15.2,
    carbs: 13.7,
    fat: 65.2,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Nüsse & Samen'
  },
  {
    id: '25',
    name: 'Olivenöl',
    calories: 884,
    protein: 0,
    carbs: 0,
    fat: 100,
    servingSize: 100,
    servingUnit: 'ml',
    category: 'Fette & Öle'
  },
  {
    id: '26',
    name: 'Kokosnussöl',
    calories: 862,
    protein: 0,
    carbs: 0,
    fat: 100,
    servingSize: 100,
    servingUnit: 'ml',
    category: 'Fette & Öle'
  },
  {
    id: '27',
    name: 'Quinoa',
    calories: 120,
    protein: 4.4,
    carbs: 21.3,
    fat: 1.9,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Getreide'
  },
  {
    id: '28',
    name: 'Linsen',
    calories: 116,
    protein: 9.0,
    carbs: 20.1,
    fat: 0.4,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Hülsenfrüchte'
  },
  {
    id: '29',
    name: 'Kichererbsen',
    calories: 364,
    protein: 19.3,
    carbs: 61.0,
    fat: 6.0,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Hülsenfrüchte'
  },
  // Hinzugefügte 40 neue Lebensmittel
  {
    id: '30',
    name: 'Haselnüsse',
    calories: 628,
    protein: 15,
    carbs: 17,
    fat: 61,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Nüsse & Samen'
  },
  {
    id: '31',
    name: 'Sonnenblumenkerne',
    calories: 584,
    protein: 21,
    carbs: 20,
    fat: 51,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Nüsse & Samen'
  },
  {
    id: '32',
    name: 'Sesamsamen',
    calories: 573,
    protein: 18,
    carbs: 23,
    fat: 50,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Nüsse & Samen'
  },
  {
    id: '33',
    name: 'Mandelmilch',
    calories: 15,
    protein: 0.5,
    carbs: 0.3,
    fat: 1.2,
    servingSize: 100,
    servingUnit: 'ml',
    category: 'Milchprodukte'
  },
  {
    id: '34',
    name: 'Kokosmilch',
    calories: 230,
    protein: 2.3,
    carbs: 5.5,
    fat: 24,
    servingSize: 100,
    servingUnit: 'ml',
    category: 'Milchprodukte'
  },
  {
    id: '35',
    name: 'Kokosnuss',
    calories: 354,
    protein: 3.3,
    carbs: 15,
    fat: 33,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Nüsse & Samen'
  },
  {
    id: '36',
    name: 'Datteln',
    calories: 282,
    protein: 2.5,
    carbs: 75,
    fat: 0.4,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Obst'
  },
  {
    id: '37',
    name: 'Feigen',
    calories: 74,
    protein: 0.8,
    carbs: 19,
    fat: 0.3,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Obst'
  },
  {
    id: '38',
    name: 'Pflaumen',
    calories: 46,
    protein: 0.7,
    carbs: 11,
    fat: 0.3,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Obst'
  },
  {
    id: '39',
    name: 'Rosinen',
    calories: 299,
    protein: 3.1,
    carbs: 79,
    fat: 0.5,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Obst'
  },
  {
    id: '40',
    name: 'Oliven (schwarz)',
    calories: 115,
    protein: 0.8,
    carbs: 6,
    fat: 10,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Gemüse'
  },
  {
    id: '41',
    name: 'Butter',
    calories: 717,
    protein: 0.9,
    carbs: 0.1,
    fat: 81,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Fette & Öle'
  },
  {
    id: '42',
    name: 'Margarine',
    calories: 717,
    protein: 0,
    carbs: 0,
    fat: 81,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Fette & Öle'
  },
  {
    id: '43',
    name: 'Sahne (30%)',
    calories: 292,
    protein: 2,
    carbs: 2.9,
    fat: 30,
    servingSize: 100,
    servingUnit: 'ml',
    category: 'Milchprodukte'
  },
  {
    id: '44',
    name: 'Schlagsahne',
    calories: 340,
    protein: 2.5,
    carbs: 3,
    fat: 36,
    servingSize: 100,
    servingUnit: 'ml',
    category: 'Milchprodukte'
  },
  {
    id: '45',
    name: 'Mozzarella',
    calories: 280,
    protein: 22,
    carbs: 2,
    fat: 22,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Milchprodukte'
  },
  {
    id: '46',
    name: 'Parmesan',
    calories: 431,
    protein: 38,
    carbs: 4.1,
    fat: 29,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Milchprodukte'
  },
  {
    id: '47',
    name: 'Camembert',
    calories: 300,
    protein: 19,
    carbs: 0.5,
    fat: 24,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Milchprodukte'
  },
  {
    id: '48',
    name: 'Gorgonzola',
    calories: 353,
    protein: 21,
    carbs: 2,
    fat: 29,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Milchprodukte'
  },
  {
    id: '49',
    name: 'Blauschimmelkäse',
    calories: 357,
    protein: 21,
    carbs: 2,
    fat: 30,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Milchprodukte'
  },
  {
    id: '50',
    name: 'Schweizer Käse',
    calories: 393,
    protein: 27,
    carbs: 1.4,
    fat: 30,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Milchprodukte'
  },
  {
    id: '51',
    name: 'Brie',
    calories: 334,
    protein: 21,
    carbs: 0.5,
    fat: 28,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Milchprodukte'
  },
  {
    id: '52',
    name: 'Weißbrot',
    calories: 265,
    protein: 9,
    carbs: 49,
    fat: 3.2,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Getreide'
  },
  {
    id: '53',
    name: 'Toastbrot',
    calories: 265,
    protein: 8,
    carbs: 50,
    fat: 3,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Getreide'
  },
  {
    id: '54',
    name: 'Croissant',
    calories: 406,
    protein: 8,
    carbs: 46,
    fat: 21,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Getreide'
  },
  {
    id: '55',
    name: 'Schokolade (Zartbitter)',
    calories: 546,
    protein: 5.5,
    carbs: 61,
    fat: 31,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Süßigkeiten'
  },
  {
    id: '56',
    name: 'Schokolade (Milch)',
    calories: 535,
    protein: 7.9,
    carbs: 58,
    fat: 30,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Süßigkeiten'
  },
  {
    id: '57',
    name: 'Schokolade (Weiß)',
    calories: 539,
    protein: 5.9,
    carbs: 59,
    fat: 32,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Süßigkeiten'
  },
  {
    id: '58',
    name: 'Gummibärchen',
    calories: 343,
    protein: 6.9,
    carbs: 77,
    fat: 0.2,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Süßigkeiten'
  },
  {
    id: '59',
    name: 'Honig',
    calories: 304,
    protein: 0.3,
    carbs: 82,
    fat: 0,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Süßigkeiten'
  },
  {
    id: '60',
    name: 'Nutella',
    calories: 546,
    protein: 6,
    carbs: 57,
    fat: 31,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Süßigkeiten'
  },
  {
    id: '61',
    name: 'Müsli',
    calories: 400,
    protein: 10,
    carbs: 70,
    fat: 7,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Getreide'
  },
  {
    id: '62',
    name: 'Cornflakes',
    calories: 375,
    protein: 7,
    carbs: 84,
    fat: 0.5,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Getreide'
  },
  {
    id: '63',
    name: 'Erdnüsse',
    calories: 567,
    protein: 26,
    carbs: 16,
    fat: 49,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Nüsse & Samen'
  },
  {
    id: '64',
    name: 'Popcorn',
    calories: 375,
    protein: 12,
    carbs: 74,
    fat: 4.5,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Getreide'
  },
  {
    id: '65',
    name: 'Pommes Frites',
    calories: 312,
    protein: 3.4,
    carbs: 41,
    fat: 15,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Kartoffeln'
  },
  {
    id: '66',
    name: 'Burger (Rindfleisch)',
    calories: 295,
    protein: 17,
    carbs: 30,
    fat: 12,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Fleisch'
  },
  {
    id: '67',
    name: 'Pizza Margherita',
    calories: 266,
    protein: 11,
    carbs: 33,
    fat: 10,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Getreide'
  },
  {
    id: '68',
    name: 'Lasagne',
    calories: 280,
    protein: 14,
    carbs: 28,
    fat: 13,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Getreide'
  },
  {
    id: '69',
    name: 'Spaghetti Bolognese',
    calories: 250,
    protein: 12,
    carbs: 30,
    fat: 9,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Getreide'
  },
  {
    id: '70',
    name: 'Nudeln (gekocht)',
    calories: 131,
    protein: 5,
    carbs: 25,
    fat: 1.1,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Getreide'
  },
  {
    id: '71',
    name: 'Tortilla',
    calories: 237,
    protein: 6.5,
    carbs: 40,
    fat: 5.8,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Getreide'
  },
  {
    id: '72',
    name: 'Baguette',
    calories: 270,
    protein: 9,
    carbs: 55,
    fat: 1.5,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Getreide'
  },
  {
    id: '73',
    name: 'Breze',
    calories: 340,
    protein: 8,
    carbs: 70,
    fat: 3,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Getreide'
  },
  {
    id: '74',
    name: 'Donut',
    calories: 452,
    protein: 4,
    carbs: 51,
    fat: 25,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Süßigkeiten'
  },
  {
    id: '75',
    name: 'Apfelstrudel',
    calories: 280,
    protein: 3,
    carbs: 38,
    fat: 12,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Süßigkeiten'
  },
  {
    id: '76',
    name: 'Schwarzwälder Kirschtorte',
    calories: 350,
    protein: 4,
    carbs: 40,
    fat: 20,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Süßigkeiten'
  },
  {
    id: '77',
    name: 'Tiramisu',
    calories: 360,
    protein: 5,
    carbs: 30,
    fat: 25,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Süßigkeiten'
  },
  {
    id: '78',
    name: 'Schlagsahne (ungesüßt)',
    calories: 345,
    protein: 2,
    carbs: 3,
    fat: 36,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Milchprodukte'
  },
  {
    id: '79',
    name: 'Kaffee (schwarz)',
    calories: 2,
    protein: 0.2,
    carbs: 0,
    fat: 0,
    servingSize: 100,
    servingUnit: 'ml',
    category: 'Getränke'
  },
  {
    id: '80',
    name: 'Espresso',
    calories: 1,
    protein: 0.1,
    carbs: 0,
    fat: 0,
    servingSize: 30,
    servingUnit: 'ml',
    category: 'Getränke'
  },
  {
    id: '81',
    name: 'Cappuccino',
    calories: 60,
    protein: 3,
    carbs: 7,
    fat: 2,
    servingSize: 100,
    servingUnit: 'ml',
    category: 'Getränke'
  },
  {
    id: '82',
    name: 'Latte Macchiato',
    calories: 80,
    protein: 3,
    carbs: 10,
    fat: 3,
    servingSize: 100,
    servingUnit: 'ml',
    category: 'Getränke'
  },
  {
    id: '83',
    name: 'Heiße Schokolade',
    calories: 180,
    protein: 5,
    carbs: 25,
    fat: 6,
    servingSize: 100,
    servingUnit: 'ml',
    category: 'Getränke'
  },
  {
    id: '84',
    name: 'Grüner Tee',
    calories: 1,
    protein: 0.2,
    carbs: 0.1,
    fat: 0,
    servingSize: 100,
    servingUnit: 'ml',
    category: 'Getränke'
  },
  {
    id: '85',
    name: 'Schwarztee',
    calories: 1,
    protein: 0.2,
    carbs: 0.1,
    fat: 0,
    servingSize: 100,
    servingUnit: 'ml',
    category: 'Getränke'
  },
  {
    id: '86',
    name: 'Kräutertee',
    calories: 1,
    protein: 0.1,
    carbs: 0,
    fat: 0,
    servingSize: 100,
    servingUnit: 'ml',
    category: 'Getränke'
  },
  {
    id: '87',
    name: 'Eistee (gezuckert)',
    calories: 40,
    protein: 0,
    carbs: 10,
    fat: 0,
    servingSize: 100,
    servingUnit: 'ml',
    category: 'Getränke'
  },
  {
    id: '88',
    name: 'Limonade',
    calories: 42,
    protein: 0,
    carbs: 10,
    fat: 0,
    servingSize: 100,
    servingUnit: 'ml',
    category: 'Getränke'
  },
  {
    id: '89',
    name: 'Cola',
    calories: 44,
    protein: 0,
    carbs: 11,
    fat: 0,
    servingSize: 100,
    servingUnit: 'ml',
    category: 'Getränke'
  },
  {
    id: '90',
    name: 'Orangensaft',
    calories: 47,
    protein: 0.9,
    carbs: 11,
    fat: 0.1,
    servingSize: 100,
    servingUnit: 'ml',
    category: 'Getränke'
  },
  {
    id: '91',
    name: 'Apfelsaft',
    calories: 46,
    protein: 0.2,
    carbs: 12,
    fat: 0,
    servingSize: 100,
    servingUnit: 'ml',
    category: 'Getränke'
  },
  {
    id: '92',
    name: 'Multivitaminsaft',
    calories: 50,
    protein: 0.5,
    carbs: 12,
    fat: 0.2,
    servingSize: 100,
    servingUnit: 'ml',
    category: 'Getränke'
  },
  {
    id: '93',
    name: 'Bier',
    calories: 43,
    protein: 0.5,
    carbs: 3.6,
    fat: 0,
    servingSize: 100,
    servingUnit: 'ml',
    category: 'Alkoholische Getränke'
  },
  {
    id: '94',
    name: 'Weißwein',
    calories: 82,
    protein: 0.1,
    carbs: 2.6,
    fat: 0,
    servingSize: 100,
    servingUnit: 'ml',
    category: 'Alkoholische Getränke'
  },
  {
    id: '95',
    name: 'Rotwein',
    calories: 85,
    protein: 0.2,
    carbs: 2.5,
    fat: 0,
    servingSize: 100,
    servingUnit: 'ml',
    category: 'Alkoholische Getränke'
  },
  {
    id: '96',
    name: 'Wodka',
    calories: 231,
    protein: 0,
    carbs: 0,
    fat: 0,
    servingSize: 100,
    servingUnit: 'ml',
    category: 'Alkoholische Getränke'
  },
  {
    id: '97',
    name: 'Rum',
    calories: 231,
    protein: 0,
    carbs: 0,
    fat: 0,
    servingSize: 100,
    servingUnit: 'ml',
    category: 'Alkoholische Getränke'
  },
  {
    id: '98',
    name: 'Whiskey',
    calories: 250,
    protein: 0,
    carbs: 0,
    fat: 0,
    servingSize: 100,
    servingUnit: 'ml',
    category: 'Alkoholische Getränke'
  },
  {
    id: '99',
    name: 'Schnitzel (paniert)',
    calories: 320,
    protein: 25,
    carbs: 20,
    fat: 15,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Fleisch'
  },
  {
    id: '100',
    name: 'Bratwurst',
    calories: 290,
    protein: 14,
    carbs: 3,
    fat: 25,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Fleisch'
  },
  {
    id: '101',
    name: 'Currywurst',
    calories: 310,
    protein: 15,
    carbs: 10,
    fat: 25,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Fleisch'
  },
  {
    id: '102',
    name: 'Leberkäse',
    calories: 290,
    protein: 13,
    carbs: 3,
    fat: 25,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Fleisch'
  },
  {
    id: '103',
    name: 'Gulasch',
    calories: 220,
    protein: 20,
    carbs: 5,
    fat: 12,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Fleisch'
  },
  {
    id: '104',
    name: 'Rindersteak',
    calories: 250,
    protein: 27,
    carbs: 0,
    fat: 17,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Fleisch'
  },
  {
    id: '105',
    name: 'Schweinekotelett',
    calories: 260,
    protein: 26,
    carbs: 0,
    fat: 18,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Fleisch'
  },
  {
    id: '106',
    name: 'Hähnchenschenkel',
    calories: 200,
    protein: 22,
    carbs: 0,
    fat: 12,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Fleisch'
  },
  {
    id: '107',
    name: 'Lammfleisch',
    calories: 294,
    protein: 25,
    carbs: 0,
    fat: 21,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Fleisch'
  },
  {
    id: '108',
    name: 'Hackfleisch (Rind)',
    calories: 250,
    protein: 26,
    carbs: 0,
    fat: 18,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Fleisch'
  },
  {
    id: '109',
    name: 'Frühlingsrollen',
    calories: 150,
    protein: 4,
    carbs: 20,
    fat: 5,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Internationale Gerichte'
  },
  {
    id: '110',
    name: 'Dim Sum',
    calories: 120,
    protein: 5,
    carbs: 18,
    fat: 3,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Internationale Gerichte'
  },
  {
    id: '111',
    name: 'Chow Mein',
    calories: 250,
    protein: 12,
    carbs: 40,
    fat: 6,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Internationale Gerichte'
  },
  {
    id: '112',
    name: 'Tandoori Hähnchen',
    calories: 210,
    protein: 25,
    carbs: 3,
    fat: 8,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Internationale Gerichte'
  },
  {
    id: '113',
    name: 'Naan Brot',
    calories: 290,
    protein: 9,
    carbs: 55,
    fat: 6,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Internationale Gerichte'
  },
  {
    id: '114',
    name: 'Falafel',
    calories: 333,
    protein: 13,
    carbs: 31,
    fat: 17,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Internationale Gerichte'
  },
  {
    id: '115',
    name: 'Hummus',
    calories: 166,
    protein: 8,
    carbs: 14,
    fat: 10,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Internationale Gerichte'
  }
];

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
    if (!query) return foods;
    
    const lowerQuery = query.toLowerCase();
    return foods.filter(food => 
      food.name.toLowerCase().includes(lowerQuery) || 
      food.category?.toLowerCase().includes(lowerQuery)
    );
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