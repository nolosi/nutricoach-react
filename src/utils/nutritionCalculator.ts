/**
 * Zentrale Utility-Funktionen für die Berechnung von Ernährungszielen.
 * Diese Datei soll von allen Komponenten verwendet werden, die Ernährungsziele berechnen,
 * um sicherzustellen, dass die Berechnungen überall konsistent sind.
 */

export interface NutritionInputData {
  gender: 'male' | 'female' | 'diverse';
  weight: number; // in kg
  height: number; // in cm
  age: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  weightGoal?: 'lose' | 'maintain' | 'gain';
}

export interface NutritionGoals {
  calorieGoal: number;
  proteinGoal: number;
  carbGoal: number;
  fatGoal: number;
  waterGoal: number;
  burnCalorieGoal: number; // Neu: Tägliches Ziel für zusätzlich zu verbrennende Kalorien
}

// Fallback-Werte für den Fall, dass die Berechnung nicht möglich ist
export const DEFAULT_NUTRITION_GOALS: NutritionGoals = {
  calorieGoal: 2000,
  proteinGoal: 75,
  carbGoal: 250,
  fatGoal: 65,
  waterGoal: 2500,
  burnCalorieGoal: 500 // Standard-Verbrennungsziel
};

/**
 * Berechnet den Grundumsatz (BMR) mit der Harris-Benedict-Formel
 */
export function calculateBMR(data: NutritionInputData): number {
  let bmr = 0;
  if (data.gender === 'male') {
    bmr = 66.5 + (13.75 * data.weight) + (5.003 * data.height) - (6.755 * data.age);
  } else {
    bmr = 655.1 + (9.563 * data.weight) + (1.85 * data.height) - (4.676 * data.age);
  }
  return Math.round(bmr); // Runde auf ganze Zahlen
}

/**
 * Berechnet den täglichen Kalorienbedarf basierend auf dem Aktivitätslevel
 * und dem Gewichtsziel
 */
export function calculateCalorieGoal(data: NutritionInputData): number {
  const bmr = calculateBMR(data);
  
  // Aktivitätsfaktoren
  const activityFactors: Record<string, number> = {
    sedentary: 1.2,    // Wenig oder keine Bewegung
    light: 1.375,      // Leichte Aktivität (1-3 Tage/Woche)
    moderate: 1.55,    // Mäßige Aktivität (3-5 Tage/Woche)
    active: 1.725,     // Hohe Aktivität (6-7 Tage/Woche)
    very_active: 1.9   // Sehr hohe Aktivität (2x täglich)
  };
  
  const activityFactor = activityFactors[data.activityLevel] || 1.2;
  let tdee = bmr * activityFactor;
  
  // Anpassung basierend auf dem Gewichtsziel
  if (data.weightGoal === 'lose') {
    tdee -= 500; // 500 Kalorien Defizit für Gewichtsabnahme
  } else if (data.weightGoal === 'gain') {
    tdee += 500; // 500 Kalorien Überschuss für Gewichtszunahme
  }
  
  return Math.round(tdee);
}

/**
 * Berechnet die Kalorien, die täglich zusätzlich verbrannt werden sollten.
 * Dies ist einheitlich definiert, unabhängig davon, wo in der Anwendung darauf zugegriffen wird,
 * um konsistente Werte zu gewährleisten.
 * 
 * Bei Gewichtsverlust ist dies ein fester Wert von 500 kcal,
 * ansonsten beträgt das Ziel 20% der täglichen Kalorienaufnahme für allgemeine Fitness.
 */
export function calculateBurnCalorieGoal(data: NutritionInputData): number {
  // Berechne das tägliche Kalorienziel
  const calorieGoal = calculateCalorieGoal(data);
  
  // Bei Gewichtsverlust sollten aktiv 500 kcal täglich verbrannt werden
  if (data.weightGoal === 'lose') {
    return 500; 
  }
  
  // Bei Gewichtserhalt oder -zunahme: 20% des Kalorienziels als gesundes Aktivitätsziel
  return Math.round(calorieGoal * 0.2);
}

/**
 * Berechnet den täglichen Proteinbedarf basierend auf dem Körpergewicht
 * Verwendet 1.8g Protein pro kg Körpergewicht (konsistent in der gesamten App)
 */
export function calculateProteinGoal(data: NutritionInputData): number {
  // Konstant 1.8g pro kg Körpergewicht für alle Benutzer
  return Math.round(data.weight * 1.8);
}

/**
 * Berechnet den täglichen Fettbedarf basierend auf dem Kalorienziel
 * Verwendet 30% der Gesamtkalorien
 */
export function calculateFatGoal(calorieGoal: number): number {
  // 30% der Gesamtkalorien als Fett
  return Math.round((calorieGoal * 0.3) / 9); // Fett hat 9 Kalorien pro Gramm
}

/**
 * Berechnet den täglichen Kohlenhydratbedarf basierend auf dem Kalorienziel,
 * dem Proteinziel und dem Fettziel
 */
export function calculateCarbGoal(calorieGoal: number, proteinGoal: number, fatGoal: number): number {
  // Rest der Kalorien als Kohlenhydrate
  const remainingCalories = calorieGoal - (proteinGoal * 4) - (fatGoal * 9);
  return Math.round(remainingCalories / 4); // Kohlenhydrate haben 4 Kalorien pro Gramm
}

/**
 * Berechnet den täglichen Wasserbedarf basierend auf dem Körpergewicht
 * Verwendet 35ml pro kg Körpergewicht
 */
export function calculateWaterGoal(data: NutritionInputData): number {
  // 35ml pro kg Körpergewicht
  return Math.round(data.weight * 35 / 100) * 100; // Runde auf die nächsten 100ml
}

/**
 * Hauptfunktion, die alle Ernährungsziele berechnet
 */
export function calculateNutritionGoals(data: NutritionInputData): NutritionGoals {
  try {
    // Prüfe, ob alle erforderlichen Daten vorhanden sind
    if (!data.weight || !data.height || !data.age) {
      console.warn('Unvollständige Daten für die Ernährungszielberechnung. Verwende Standardwerte.');
      return DEFAULT_NUTRITION_GOALS;
    }
    
    const calorieGoal = calculateCalorieGoal(data);
    const proteinGoal = calculateProteinGoal(data);
    const fatGoal = calculateFatGoal(calorieGoal);
    const carbGoal = calculateCarbGoal(calorieGoal, proteinGoal, fatGoal);
    const waterGoal = calculateWaterGoal(data);
    const burnCalorieGoal = calculateBurnCalorieGoal(data);
    
    return {
      calorieGoal,
      proteinGoal,
      carbGoal,
      fatGoal,
      waterGoal,
      burnCalorieGoal
    };
  } catch (error) {
    console.error('Fehler bei der Berechnung der Ernährungsziele:', error);
    return DEFAULT_NUTRITION_GOALS;
  }
} 