/**
 * Europäische Lebensmitteldatenbank
 * 
 * Diese Datei enthält eine umfassende Liste europäischer Lebensmittel mit Nährwertangaben.
 * Die Lebensmittel sind in Kategorien unterteilt.
 */

import { Food } from '../services/FoodService';

// Kategorien für die Lebensmittel
export const foodCategories = [
  'Getreideprodukte',
  'Milchprodukte',
  'Fleisch',
  'Fisch',
  'Eier',
  'Gemüse',
  'Obst',
  'Nüsse und Samen',
  'Hülsenfrüchte',
  'Fette und Öle',
  'Süßigkeiten',
  'Getränke',
  'Fertiggerichte',
  'Snacks',
  'Gewürze und Kräuter'
];

// Lebensmitteldatenbank
export const europeanFoods: Food[] = [
  // Getreideprodukte
  {
    id: 'bread-wheat-whole',
    name: 'Vollkornbrot',
    calories: 247,
    protein: 8.5,
    carbs: 41.3,
    fat: 3.4,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Getreideprodukte'
  },
  {
    id: 'bread-wheat-white',
    name: 'Weißbrot',
    calories: 265,
    protein: 7.5,
    carbs: 49.8,
    fat: 3.2,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Getreideprodukte'
  },
  {
    id: 'bread-rye',
    name: 'Roggenbrot',
    calories: 259,
    protein: 8.5,
    carbs: 48.3,
    fat: 3.3,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Getreideprodukte'
  },
  {
    id: 'pasta-wheat',
    name: 'Nudeln (gekocht)',
    calories: 158,
    protein: 5.8,
    carbs: 30.9,
    fat: 0.9,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Getreideprodukte'
  },
  {
    id: 'rice-white',
    name: 'Weißer Reis (gekocht)',
    calories: 130,
    protein: 2.7,
    carbs: 28.2,
    fat: 0.3,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Getreideprodukte'
  },
  {
    id: 'rice-brown',
    name: 'Brauner Reis (gekocht)',
    calories: 112,
    protein: 2.6,
    carbs: 23.5,
    fat: 0.9,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Getreideprodukte'
  },
  {
    id: 'oats',
    name: 'Haferflocken',
    calories: 370,
    protein: 13.0,
    carbs: 59.0,
    fat: 7.0,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Getreideprodukte'
  },
  {
    id: 'muesli',
    name: 'Müsli',
    calories: 354,
    protein: 8.5,
    carbs: 69.0,
    fat: 7.5,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Getreideprodukte'
  },
  
  // Milchprodukte
  {
    id: 'milk-whole',
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
    id: 'milk-semi',
    name: 'Fettarme Milch',
    calories: 46,
    protein: 3.4,
    carbs: 4.8,
    fat: 1.5,
    servingSize: 100,
    servingUnit: 'ml',
    category: 'Milchprodukte'
  },
  {
    id: 'yogurt-plain',
    name: 'Naturjoghurt',
    calories: 61,
    protein: 3.5,
    carbs: 4.7,
    fat: 3.3,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Milchprodukte'
  },
  {
    id: 'cheese-gouda',
    name: 'Gouda',
    calories: 356,
    protein: 25.0,
    carbs: 2.2,
    fat: 27.4,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Milchprodukte'
  },
  {
    id: 'cheese-camembert',
    name: 'Camembert',
    calories: 300,
    protein: 20.0,
    carbs: 0.5,
    fat: 24.0,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Milchprodukte'
  },
  {
    id: 'cheese-mozzarella',
    name: 'Mozzarella',
    calories: 280,
    protein: 22.0,
    carbs: 2.2,
    fat: 21.0,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Milchprodukte'
  },
  {
    id: 'quark',
    name: 'Quark (Magerquark)',
    calories: 73,
    protein: 13.5,
    carbs: 3.5,
    fat: 0.2,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Milchprodukte'
  },
  
  // Fleisch
  {
    id: 'chicken-breast',
    name: 'Hähnchenbrust',
    calories: 165,
    protein: 31.0,
    carbs: 0.0,
    fat: 3.6,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Fleisch'
  },
  {
    id: 'beef-ground',
    name: 'Rinderhackfleisch',
    calories: 250,
    protein: 26.0,
    carbs: 0.0,
    fat: 17.0,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Fleisch'
  },
  {
    id: 'pork-chop',
    name: 'Schweinekotelett',
    calories: 231,
    protein: 27.0,
    carbs: 0.0,
    fat: 14.0,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Fleisch'
  },
  {
    id: 'turkey-breast',
    name: 'Putenbrust',
    calories: 135,
    protein: 30.0,
    carbs: 0.0,
    fat: 1.0,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Fleisch'
  },
  {
    id: 'sausage-bratwurst',
    name: 'Bratwurst',
    calories: 326,
    protein: 15.0,
    carbs: 2.0,
    fat: 29.0,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Fleisch'
  },
  
  // Fisch
  {
    id: 'salmon',
    name: 'Lachs',
    calories: 208,
    protein: 20.0,
    carbs: 0.0,
    fat: 14.0,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Fisch'
  },
  {
    id: 'tuna',
    name: 'Thunfisch',
    calories: 132,
    protein: 28.0,
    carbs: 0.0,
    fat: 1.0,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Fisch'
  },
  {
    id: 'cod',
    name: 'Kabeljau',
    calories: 82,
    protein: 18.0,
    carbs: 0.0,
    fat: 0.7,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Fisch'
  },
  {
    id: 'herring',
    name: 'Hering',
    calories: 203,
    protein: 18.0,
    carbs: 0.0,
    fat: 14.0,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Fisch'
  },
  {
    id: 'trout',
    name: 'Forelle',
    calories: 141,
    protein: 20.0,
    carbs: 0.0,
    fat: 6.0,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Fisch'
  },
  
  // Gemüse
  {
    id: 'potato',
    name: 'Kartoffel (gekocht)',
    calories: 77,
    protein: 2.0,
    carbs: 17.0,
    fat: 0.1,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Gemüse'
  },
  {
    id: 'carrot',
    name: 'Karotte',
    calories: 41,
    protein: 0.9,
    carbs: 10.0,
    fat: 0.2,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Gemüse'
  },
  {
    id: 'broccoli',
    name: 'Brokkoli',
    calories: 34,
    protein: 2.8,
    carbs: 7.0,
    fat: 0.4,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Gemüse'
  },
  {
    id: 'tomato',
    name: 'Tomate',
    calories: 18,
    protein: 0.9,
    carbs: 3.9,
    fat: 0.2,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Gemüse'
  },
  {
    id: 'cucumber',
    name: 'Gurke',
    calories: 15,
    protein: 0.7,
    carbs: 3.6,
    fat: 0.1,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Gemüse'
  },
  {
    id: 'bell-pepper',
    name: 'Paprika',
    calories: 31,
    protein: 1.0,
    carbs: 6.0,
    fat: 0.3,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Gemüse'
  },
  {
    id: 'spinach',
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
    id: 'zucchini',
    name: 'Zucchini',
    calories: 17,
    protein: 1.2,
    carbs: 3.1,
    fat: 0.3,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Gemüse'
  },
  
  // Obst
  {
    id: 'apple',
    name: 'Apfel',
    calories: 52,
    protein: 0.3,
    carbs: 14.0,
    fat: 0.2,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Obst'
  },
  {
    id: 'banana',
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
    id: 'orange',
    name: 'Orange',
    calories: 47,
    protein: 0.9,
    carbs: 11.8,
    fat: 0.1,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Obst'
  },
  {
    id: 'strawberry',
    name: 'Erdbeere',
    calories: 32,
    protein: 0.7,
    carbs: 7.7,
    fat: 0.3,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Obst'
  },
  {
    id: 'blueberry',
    name: 'Blaubeere',
    calories: 57,
    protein: 0.7,
    carbs: 14.5,
    fat: 0.3,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Obst'
  },
  {
    id: 'grape',
    name: 'Weintraube',
    calories: 69,
    protein: 0.7,
    carbs: 18.1,
    fat: 0.2,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Obst'
  },
  {
    id: 'pear',
    name: 'Birne',
    calories: 57,
    protein: 0.4,
    carbs: 15.2,
    fat: 0.1,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Obst'
  },
  
  // Nüsse und Samen
  {
    id: 'almonds',
    name: 'Mandeln',
    calories: 579,
    protein: 21.0,
    carbs: 22.0,
    fat: 49.0,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Nüsse und Samen'
  },
  {
    id: 'walnuts',
    name: 'Walnüsse',
    calories: 654,
    protein: 15.0,
    carbs: 14.0,
    fat: 65.0,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Nüsse und Samen'
  },
  {
    id: 'hazelnuts',
    name: 'Haselnüsse',
    calories: 628,
    protein: 15.0,
    carbs: 17.0,
    fat: 61.0,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Nüsse und Samen'
  },
  {
    id: 'chia-seeds',
    name: 'Chiasamen',
    calories: 486,
    protein: 17.0,
    carbs: 42.0,
    fat: 31.0,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Nüsse und Samen'
  },
  {
    id: 'flaxseeds',
    name: 'Leinsamen',
    calories: 534,
    protein: 18.0,
    carbs: 29.0,
    fat: 42.0,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Nüsse und Samen'
  },
  
  // Hülsenfrüchte
  {
    id: 'lentils-cooked',
    name: 'Linsen (gekocht)',
    calories: 116,
    protein: 9.0,
    carbs: 20.0,
    fat: 0.4,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Hülsenfrüchte'
  },
  {
    id: 'chickpeas-cooked',
    name: 'Kichererbsen (gekocht)',
    calories: 164,
    protein: 8.9,
    carbs: 27.0,
    fat: 2.6,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Hülsenfrüchte'
  },
  {
    id: 'beans-kidney-cooked',
    name: 'Kidneybohnen (gekocht)',
    calories: 127,
    protein: 8.7,
    carbs: 22.8,
    fat: 0.5,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Hülsenfrüchte'
  },
  {
    id: 'beans-white-cooked',
    name: 'Weiße Bohnen (gekocht)',
    calories: 139,
    protein: 9.7,
    carbs: 25.1,
    fat: 0.5,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Hülsenfrüchte'
  },
  {
    id: 'peas-cooked',
    name: 'Erbsen (gekocht)',
    calories: 81,
    protein: 5.4,
    carbs: 14.5,
    fat: 0.4,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Hülsenfrüchte'
  },
  
  // Fette und Öle
  {
    id: 'olive-oil',
    name: 'Olivenöl',
    calories: 884,
    protein: 0.0,
    carbs: 0.0,
    fat: 100.0,
    servingSize: 100,
    servingUnit: 'ml',
    category: 'Fette und Öle'
  },
  {
    id: 'butter',
    name: 'Butter',
    calories: 717,
    protein: 0.9,
    carbs: 0.1,
    fat: 81.0,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Fette und Öle'
  },
  {
    id: 'coconut-oil',
    name: 'Kokosöl',
    calories: 862,
    protein: 0.0,
    carbs: 0.0,
    fat: 100.0,
    servingSize: 100,
    servingUnit: 'ml',
    category: 'Fette und Öle'
  },
  {
    id: 'sunflower-oil',
    name: 'Sonnenblumenöl',
    calories: 884,
    protein: 0.0,
    carbs: 0.0,
    fat: 100.0,
    servingSize: 100,
    servingUnit: 'ml',
    category: 'Fette und Öle'
  },
  
  // Süßigkeiten
  {
    id: 'chocolate-dark',
    name: 'Zartbitterschokolade',
    calories: 598,
    protein: 7.8,
    carbs: 45.9,
    fat: 42.6,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Süßigkeiten'
  },
  {
    id: 'chocolate-milk',
    name: 'Vollmilchschokolade',
    calories: 535,
    protein: 7.7,
    carbs: 59.4,
    fat: 29.7,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Süßigkeiten'
  },
  {
    id: 'honey',
    name: 'Honig',
    calories: 304,
    protein: 0.3,
    carbs: 82.4,
    fat: 0.0,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Süßigkeiten'
  },
  {
    id: 'jam-strawberry',
    name: 'Erdbeermarmelade',
    calories: 253,
    protein: 0.7,
    carbs: 69.0,
    fat: 0.1,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Süßigkeiten'
  },
  
  // Getränke
  {
    id: 'water',
    name: 'Wasser',
    calories: 0,
    protein: 0.0,
    carbs: 0.0,
    fat: 0.0,
    servingSize: 100,
    servingUnit: 'ml',
    category: 'Getränke'
  },
  {
    id: 'coffee-black',
    name: 'Kaffee (schwarz)',
    calories: 2,
    protein: 0.1,
    carbs: 0.0,
    fat: 0.0,
    servingSize: 100,
    servingUnit: 'ml',
    category: 'Getränke'
  },
  {
    id: 'tea-black',
    name: 'Schwarzer Tee',
    calories: 1,
    protein: 0.0,
    carbs: 0.2,
    fat: 0.0,
    servingSize: 100,
    servingUnit: 'ml',
    category: 'Getränke'
  },
  {
    id: 'orange-juice',
    name: 'Orangensaft',
    calories: 45,
    protein: 0.7,
    carbs: 10.4,
    fat: 0.2,
    servingSize: 100,
    servingUnit: 'ml',
    category: 'Getränke'
  },
  {
    id: 'apple-juice',
    name: 'Apfelsaft',
    calories: 46,
    protein: 0.1,
    carbs: 11.3,
    fat: 0.1,
    servingSize: 100,
    servingUnit: 'ml',
    category: 'Getränke'
  },
  {
    id: 'beer',
    name: 'Bier',
    calories: 43,
    protein: 0.5,
    carbs: 3.6,
    fat: 0.0,
    servingSize: 100,
    servingUnit: 'ml',
    category: 'Getränke'
  },
  {
    id: 'wine-red',
    name: 'Rotwein',
    calories: 85,
    protein: 0.1,
    carbs: 2.7,
    fat: 0.0,
    servingSize: 100,
    servingUnit: 'ml',
    category: 'Getränke'
  }
];

// Exportiere alle Lebensmittel als Standardlebensmittel
export const defaultFoods: Food[] = europeanFoods; 