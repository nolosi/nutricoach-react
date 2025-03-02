import { Food } from './FoodService';

// Typdefinition für das Ergebnis der Bildanalyse
export interface FoodRecognitionResult {
  confidence: number;
  foods: {
    name: string;
    probability: number;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    estimatedAmount: number;
  }[];
}

// Simulierte Datenbank mit häufigen Lebensmitteln und deren Nährwerten
const commonFoods: Record<string, Omit<Food, 'id'>> = {
  'apfel': {
    name: 'Apfel',
    calories: 52,
    protein: 0.3,
    carbs: 14,
    fat: 0.2,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Obst'
  },
  'banane': {
    name: 'Banane',
    calories: 89,
    protein: 1.1,
    carbs: 23,
    fat: 0.3,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Obst'
  },
  'brot': {
    name: 'Vollkornbrot',
    calories: 247,
    protein: 8.5,
    carbs: 49,
    fat: 1.2,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Grundnahrungsmittel'
  },
  'käse': {
    name: 'Gouda Käse',
    calories: 356,
    protein: 25,
    carbs: 2.2,
    fat: 27.4,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Milchprodukte'
  },
  'hühnchen': {
    name: 'Hähnchenbrust',
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Fleisch'
  },
  'nudeln': {
    name: 'Pasta (gekocht)',
    calories: 158,
    protein: 5.8,
    carbs: 31,
    fat: 0.9,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Grundnahrungsmittel'
  },
  'salat': {
    name: 'Gemischter Salat',
    calories: 15,
    protein: 1.2,
    carbs: 2.9,
    fat: 0.2,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Gemüse'
  },
  'reis': {
    name: 'Weißer Reis (gekocht)',
    calories: 130,
    protein: 2.7,
    carbs: 28.2,
    fat: 0.3,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Grundnahrungsmittel'
  },
};

/**
 * Service für die Erkennung von Lebensmitteln aus Bildern
 */
class FoodRecognitionService {
  /**
   * Analysiert ein Bild und versucht, Lebensmittel zu erkennen
   * In einer realen Implementierung würde hier ein ML-Modell verwendet werden
   * Derzeit simulieren wir die Erkennung mit Zufallsdaten
   */
  analyzeImage(imageFile: File): Promise<FoodRecognitionResult> {
    return new Promise((resolve) => {
      // Simuliere Verarbeitungszeit
      setTimeout(() => {
        // In einer echten App würden wir ein lokales ML-Modell verwenden
        // Für den Prototyp generieren wir einfach zufällige "Erkennungen"
        
        // Wähle 1-3 zufällige Lebensmittel aus
        const foodCount = Math.floor(Math.random() * 3) + 1;
        const foodKeys = Object.keys(commonFoods);
        const selectedFoods = [];
        
        for (let i = 0; i < foodCount; i++) {
          const randomIndex = Math.floor(Math.random() * foodKeys.length);
          const foodKey = foodKeys[randomIndex];
          const food = commonFoods[foodKey];
          
          selectedFoods.push({
            name: food.name,
            probability: Math.random() * 0.5 + 0.5, // 50-100% Wahrscheinlichkeit
            calories: food.calories,
            protein: food.protein,
            carbs: food.carbs,
            fat: food.fat,
            estimatedAmount: Math.floor(Math.random() * 150) + 50 // 50-200g
          });
          
          // Entferne das ausgewählte Lebensmittel, damit es nicht erneut ausgewählt wird
          foodKeys.splice(randomIndex, 1);
          if (foodKeys.length === 0) break;
        }
        
        resolve({
          confidence: Math.random() * 0.4 + 0.6, // 60-100% Konfidenz
          foods: selectedFoods
        });
      }, 1500); // 1,5 Sekunden Verzögerung für realistisches Gefühl
    });
  }
  
  /**
   * Konvertiert ein erkanntes Lebensmittel in ein Food-Objekt
   */
  convertToFood(recognizedFood: FoodRecognitionResult['foods'][0]): Food {
    return {
      id: `recognized-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: recognizedFood.name,
      calories: recognizedFood.calories,
      protein: recognizedFood.protein,
      carbs: recognizedFood.carbs,
      fat: recognizedFood.fat,
      servingSize: 100, // Standardmäßig 100g
      servingUnit: 'g',
      category: 'Erkannt'
    };
  }
  
  /**
   * In einer echten Implementierung: Lade das ML-Modell
   * Hier als Platzhalter implementiert
   */
  async loadModel(): Promise<void> {
    console.log('Simuliere Laden des ML-Modells...');
    // In einer echten App würde hier ein TensorFlow.js-Modell geladen werden
    return Promise.resolve();
  }
}

export default new FoodRecognitionService(); 