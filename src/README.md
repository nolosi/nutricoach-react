# NutriCoach - Dokumentation der Ernährungsziele

## Übersicht

Die Ernährungsziele sind ein zentraler Bestandteil der NutriCoach-App und werden an verschiedenen Stellen verwendet:

- Auf der Startseite (HomePage) zur Anzeige des täglichen Fortschritts
- Auf der Profil-Seite (ProfilePage) zur Verwaltung der Ziele
- In der Nutrition-Goals-Seite zur Berechnung und Erklärung der Ziele
- Bei der Erstellung von täglichen Missionen

## Zentrale Berechnungsfunktion

Um konsistente Berechnungen zu gewährleisten, wurde die Berechnung aller Ernährungsziele in eine zentrale Utility-Datei ausgelagert:

**Datei:** `src/utils/nutritionCalculator.ts`

Diese Datei enthält alle notwendigen Funktionen zur Berechnung von:
- Grundumsatz (BMR)
- Kalorienbedarf
- Proteinbedarf
- Kohlenhydratbedarf
- Fettbedarf
- Wasserbedarf

## Berechnungsmethoden

### Grundumsatz (BMR)
- Berechnet mittels Harris-Benedict-Formel
- Berücksichtigt Geschlecht, Gewicht, Größe und Alter

### Kalorienberechnung
- Basiert auf BMR und Aktivitätslevel
- Anpassung je nach Gewichtsziel (+/- 500 kcal)

### Proteinberechnung
- 1.8g Protein pro kg Körpergewicht

### Fettberechnung
- 30% der Gesamtkalorien
- Umrechnung: 9 kcal pro Gramm Fett

### Kohlenhydratberechnung
- Restliche Kalorien nach Abzug von Protein und Fett
- Umrechnung: 4 kcal pro Gramm Kohlenhydrate

### Wasserberechnung
- 35ml pro kg Körpergewicht

## Verwendung der Berechnungsfunktion

Um die Berechnungsfunktion zu verwenden:

```typescript
import { 
  calculateNutritionGoals, 
  NutritionInputData 
} from '../utils/nutritionCalculator';

// Erforderliche Eingabedaten
const inputData: NutritionInputData = {
  gender: 'male', // 'male', 'female' oder 'diverse'
  weight: 75, // in kg
  height: 180, // in cm
  age: 30,
  activityLevel: 'moderate', // 'sedentary', 'light', 'moderate', 'active', 'very_active'
  weightGoal: 'maintain' // 'lose', 'maintain', 'gain'
};

// Berechnung der Ziele
const goals = calculateNutritionGoals(inputData);

// Ergebnis:
// {
//   calorieGoal: 2750,
//   proteinGoal: 135,
//   carbGoal: 325,
//   fatGoal: 92,
//   waterGoal: 2625
// }
```

## Neuberechnung der Ziele

Auf der Profil-Seite gibt es nun einen Button "Ziele neu berechnen", der die Ernährungsziele basierend auf den aktuellen Profildaten neu berechnet.

## Wichtige Hinweise

1. Die Gender-Optionen sollten überall in der App einheitlich sein:
   - In den Interfaces: 'male' | 'female' | 'diverse'
   - In den Dropdowns: Werte 'male', 'female', 'diverse'

2. Bei der Missionsgeneration sollten die Ernährungsziele-Missionen nur generiert werden, wenn die entsprechenden Ziele definiert sind (> 0).

3. Es gibt keine Hardcoded-Werte für Ernährungsziele mehr - alle Standardwerte werden zentral in `DEFAULT_NUTRITION_GOALS` in `nutritionCalculator.ts` definiert. 