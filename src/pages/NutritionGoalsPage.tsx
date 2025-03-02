import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Grid,
  Heading,
  Icon,
  List,
  ListIcon,
  ListItem,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  useColorModeValue,
  useToast
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { 
  FiTarget, 
  FiInfo, 
  FiCheckCircle, 
  FiMenu, 
  FiDroplet, 
  FiHeart,
  FiArrowUp
} from 'react-icons/fi';
import { useUser } from '../contexts/UserContext';
import { 
  calculateNutritionGoals,
  calculateBMR,
  calculateCalorieGoal,
  calculateProteinGoal,
  calculateFatGoal,
  calculateCarbGoal,
  calculateWaterGoal,
  calculateBurnCalorieGoal,
  NutritionInputData, 
  NutritionGoals 
} from '../utils/nutritionCalculator';

// Definiere den Typ für die Aktivitätslevel
type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
type WeightGoal = 'lose' | 'maintain' | 'gain';
type WeightLossRate = 'moderate' | 'aggressive';

// Interface für die Benutzerdaten, die wir für die Berechnungen benötigen
interface NutritionData {
  gender: 'male' | 'female' | 'diverse';
  weight: number;
  height: number;
  age: number;
  activityLevel: ActivityLevel;
  weightGoal: WeightGoal;
  calorieGoal: number;
  proteinGoal: number;
  carbGoal: number;
  fatGoal: number;
  waterGoal: number;
}

const NutritionGoalsPage: React.FC = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const { user, updateUser, addXP } = useUser();
  const [nutritionData, setNutritionData] = useState<NutritionData | null>(null);
  const [inputData, setInputData] = useState<NutritionInputData | null>(null);
  
  // Farben für die verschiedenen Abschnitte
  const calorieBoxBg = useColorModeValue('green.50', 'green.900');
  const calorieTextColor = useColorModeValue('green.800', 'green.200');
  const burnBoxBg = useColorModeValue('orange.50', 'orange.900');
  const burnTextColor = useColorModeValue('orange.800', 'orange.200');
  const sectionBg = useColorModeValue('gray.50', 'gray.800');
  const tipBg = useColorModeValue('blue.50', 'blue.900');
  const tipTextColor = useColorModeValue('blue.800', 'blue.200');

  // Aktualisiere die Ernährungsdaten, wenn sich der Benutzer ändert
  useEffect(() => {
    if (user) {
      // Basierend auf der tatsächlichen UserData-Struktur
      const weightGoal = user.goals?.includes('weightLoss') 
        ? 'lose' 
        : user.goals?.includes('muscleGain') 
          ? 'gain' 
          : 'maintain';
      
      const newInputData: NutritionInputData = {
        gender: user.gender || 'male',
        weight: user.weight || 75,
        height: user.height || 175,
        age: user.age || 30,
        activityLevel: (user.activityLevel as ActivityLevel) || 'moderate',
        weightGoal: weightGoal as WeightGoal
      };
      
      setInputData(newInputData);
      
      setNutritionData({
        gender: newInputData.gender,
        weight: newInputData.weight,
        height: newInputData.height,
        age: newInputData.age,
        activityLevel: newInputData.activityLevel,
        weightGoal: weightGoal as WeightGoal,
        calorieGoal: 0,
        proteinGoal: 0,
        carbGoal: 0,
        fatGoal: 0,
        waterGoal: 0
      });
    }
  }, [user]);
  
  // Effekt zum Initialisieren der Daten und Berechnung der Ziele
  useEffect(() => {
    // Berechnung der Ziele nur durchführen, wenn alle notwendigen Daten vorhanden sind
    if (inputData && inputData.weight && inputData.height && inputData.age) {
      const goals = calculateNutritionGoals(inputData);
      
      setNutritionData(prev => {
        if (!prev) return null;
        return {
          ...prev,
          calorieGoal: goals.calorieGoal,
          proteinGoal: goals.proteinGoal,
          carbGoal: goals.carbGoal,
          fatGoal: goals.fatGoal,
          waterGoal: goals.waterGoal
        };
      });
    }
  }, [inputData]);
  
  // Berechne den TDEE basierend auf BMR und Aktivitätslevel
  const calculateTDEE = (): number => {
    if (!inputData) return 2000; // Standardwert
    
    const bmr = calculateBMR(inputData);
    
    const activityMultipliers: Record<ActivityLevel, number> = {
      sedentary: 1.2,      // Sitzende oder leichte Aktivität
      light: 1.375,        // Leichtes Training 1-3 Tage/Woche
      moderate: 1.55,      // Moderates Training 3-5 Tage/Woche
      active: 1.725,       // Intensives Training 6-7 Tage/Woche
      very_active: 1.9      // Sehr intensives Training, körperliche Arbeit oder 2x täglich Training
    };
    
    return Math.round(bmr * activityMultipliers[inputData.activityLevel]);
  };
  
  // Verwende die zentrale Funktion, um zusätzlich zu verbrennende Kalorien zu berechnen
  const calculateAdditionalBurnRequired = (): number => {
    if (!inputData) return 0;
    return calculateBurnCalorieGoal(inputData);
  };
  
  // Berechne Wasserbedarf als String mit einer Dezimalstelle
  const getWaterIntakeString = (): string => {
    if (!inputData) return "2.0"; // Standard-Wasserbedarf
    
    const waterGoalInMl = calculateWaterGoal(inputData);
    return (waterGoalInMl / 1000).toFixed(1); // Umrechnung von ml in Liter mit einer Dezimalstelle
  };
  
  interface Tip {
    title: string;
    description: string;
    icon: React.ComponentType;
  }
  
  // Personalisierte Tipps basierend auf Benutzerdaten
  const getPersonalizedTips = (): Tip[] => {
    const tips: Tip[] = [];
    
    if (!inputData) {
      // Standard-Tipps, wenn keine Benutzerdaten verfügbar sind
      tips.push({
        title: t('tips.mealPrep', 'Mahlzeiten vorbereiten'),
        description: t('tips.mealPrepDesc', 'Plane und bereite deine Mahlzeiten im Voraus zu, um Impulsentscheidungen zu vermeiden und deine Ernährungsziele besser einhalten zu können.'),
        icon: FiCheckCircle
      });
      
      return tips;
    }
    
    // Tipps basierend auf dem Ziel
    if (inputData.weightGoal === 'lose') {
      tips.push({
        title: t('tips.highProteinDiet', 'Proteinreiche Ernährung'),
        description: t('tips.highProteinDietDesc', 'Proteine halten länger satt und helfen beim Erhalt der Muskelmasse während einer Diät. Versuche, in jeder Mahlzeit Protein zu integrieren.'),
        icon: FiHeart
      });
      tips.push({
        title: t('tips.volumeEating', 'Voluminöses Essen'),
        description: t('tips.volumeEatingDesc', 'Fülle deinen Teller mit voluminösem, kalorienarmen Gemüse und Protein, um satt zu werden, ohne zu viele Kalorien zu konsumieren.'),
        icon: FiMenu
      });
    } else if (inputData.weightGoal === 'gain') {
      tips.push({
        title: t('tips.calorieDense', 'Kalorienreiches Essen'),
        description: t('tips.calorieDenseDesc', 'Integriere kalorienreiche, aber nährstoffreiche Lebensmittel wie Nüsse, Avocados und gesunde Öle in deine Ernährung.'),
        icon: FiArrowUp
      });
      tips.push({
        title: t('tips.frequentMeals', 'Häufigere Mahlzeiten'),
        description: t('tips.frequentMealsDesc', 'Versuche, 4-6 kleinere Mahlzeiten pro Tag zu essen, um deinen Kalorienbedarf zu decken, wenn du Schwierigkeiten hast, genug zu essen.'),
        icon: FiMenu
      });
    }
    
    // Tipps basierend auf der Aktivität
    if (['active', 'very_active'].includes(inputData.activityLevel)) {
      tips.push({
        title: t('tips.postWorkoutNutrition', 'Ernährung nach dem Training'),
        description: t('tips.postWorkoutNutritionDesc', 'Nimm innerhalb von 30-60 Minuten nach dem Training eine Kombination aus Proteinen und Kohlenhydraten zu dir, um die Erholung zu fördern.'),
        icon: FiTarget
      });
      tips.push({
        title: t('tips.stayHydrated', 'Bleib hydriert'),
        description: t('tips.stayHydratedDesc', `Trinke mindestens ${getWaterIntakeString()} Liter Wasser täglich, besonders an Trainingstagen, um optimal zu performen.`),
        icon: FiDroplet
      });
    }
    
    // Allgemeine Tipps
    tips.push({
      title: t('tips.mealPrep', 'Mahlzeiten vorbereiten'),
      description: t('tips.mealPrepDesc', 'Plane und bereite deine Mahlzeiten im Voraus zu, um Impulsentscheidungen zu vermeiden und deine Ernährungsziele besser einhalten zu können.'),
      icon: FiCheckCircle
    });
    
    // Gebe eine Teilmenge der Tipps zurück (max. 4)
    return tips.slice(0, 4);
  };
  
  // Detaillierte Erklärungen zu den Makronährstoffen
  const getMacronutrientExplanations = () => {
    return {
      protein: {
        title: t('macros.protein.title', 'Protein'),
        description: t('macros.protein.description', 'Proteine sind die Bausteine deines Körpers und unterstützen den Muskelaufbau und die Regeneration. Sie helfen auch, dich länger satt zu halten.'),
        benefits: [
          t('macros.protein.benefit1', 'Unterstützt Muskelaufbau und -erhalt'),
          t('macros.protein.benefit2', 'Fördert Sättigung und reduziert Hunger'),
          t('macros.protein.benefit3', 'Hilft bei der Gewebereparatur und Erholung')
        ],
        sources: [
          t('macros.protein.source1', 'Mageres Fleisch (Huhn, Pute, Rind)'),
          t('macros.protein.source2', 'Fisch und Meeresfrüchte'),
          t('macros.protein.source3', 'Eier und Milchprodukte'),
          t('macros.protein.source4', 'Hülsenfrüchte, Tofu und Tempeh'),
          t('macros.protein.source5', 'Nüsse und Samen')
        ]
      },
      carbs: {
        title: t('macros.carbs.title', 'Kohlenhydrate'),
        description: t('macros.carbs.description', 'Kohlenhydrate sind deine primäre Energiequelle, besonders für intensive körperliche Aktivitäten und Gehirnfunktionen.'),
        benefits: [
          t('macros.carbs.benefit1', 'Liefert schnelle und effiziente Energie'),
          t('macros.carbs.benefit2', 'Unterstützt Gehirnfunktion und kognitive Leistung'),
          t('macros.carbs.benefit3', 'Spart Protein für Muskelaufbau statt Energiegewinnung')
        ],
        sources: [
          t('macros.carbs.source1', 'Vollkornprodukte (Brot, Reis, Pasta)'),
          t('macros.carbs.source2', 'Obst und Gemüse'),
          t('macros.carbs.source3', 'Hülsenfrüchte und Bohnen'),
          t('macros.carbs.source4', 'Kartoffeln und Süßkartoffeln'),
          t('macros.carbs.source5', 'Haferflocken und Quinoa')
        ]
      },
      fats: {
        title: t('macros.fats.title', 'Fette'),
        description: t('macros.fats.description', 'Gesunde Fette sind essentiell für Hormonproduktion, Zellgesundheit und die Aufnahme fettlöslicher Vitamine.'),
        benefits: [
          t('macros.fats.benefit1', 'Unterstützt Hormonproduktion und -balance'),
          t('macros.fats.benefit2', 'Fördert Gehirngesundheit und kognitive Funktion'),
          t('macros.fats.benefit3', 'Hilft bei der Aufnahme der Vitamine A, D, E und K')
        ],
        sources: [
          t('macros.fats.source1', 'Avocados'),
          t('macros.fats.source2', 'Nüsse und Samen'),
          t('macros.fats.source3', 'Olivenöl und andere pflanzliche Öle'),
          t('macros.fats.source4', 'Fetthaltiger Fisch (Lachs, Makrele)'),
          t('macros.fats.source5', 'Eier und vollfette Milchprodukte in Maßen')
        ]
      },
      water: {
        title: t('macros.water.title', 'Wasser'),
        description: t('macros.water.description', 'Wasser ist lebenswichtig für alle Körperfunktionen, von der Verdauung bis zur Temperaturregulierung.'),
        benefits: [
          t('macros.water.benefit1', 'Unterstützt Stoffwechsel und Verdauung'),
          t('macros.water.benefit2', 'Reguliert Körpertemperatur'),
          t('macros.water.benefit3', 'Verbessert körperliche und geistige Leistung'),
          t('macros.water.benefit4', 'Hilft bei der Entgiftung des Körpers')
        ],
        sources: [
          t('macros.water.source1', 'Reines Wasser'),
          t('macros.water.source2', 'Ungesüßter Tee'),
          t('macros.water.source3', 'Wasserreiches Obst und Gemüse'),
          t('macros.water.source4', 'Kokoswasser (natürlich, ungesüßt)')
        ]
      }
    };
  };
  
  // Personalisierte Ernährungsempfehlungen basierend auf Zielen
  const getNutritionRecommendations = () => {
    if (!inputData) return [];
    
    const recommendations = [];
    
    // Allgemeine Empfehlungen
    recommendations.push({
      title: t('recommendations.general.title', 'Ausgewogene Ernährung'),
      description: t('recommendations.general.description', 'Achte auf eine ausgewogene Ernährung mit vielen Vollwertkost-Lebensmitteln, Gemüse, Obst, magerem Protein und gesunden Fetten.')
    });
    
    // Zielspezifische Empfehlungen
    if (inputData.weightGoal === 'lose') {
      recommendations.push({
        title: t('recommendations.lose.title', 'Kaloriendefizit'),
        description: t('recommendations.lose.description', `Ein moderates Kaloriendefizit von etwa 500 kcal pro Tag führt zu einem gesunden Gewichtsverlust von etwa 0,5 kg pro Woche. Dein Ziel liegt bei ${calorieGoal} kcal täglich.`)
      });
      recommendations.push({
        title: t('recommendations.lose.protein.title', 'Hoher Proteinkonsum'),
        description: t('recommendations.lose.protein.description', `Erhöhe deinen Proteinkonsum auf ${proteinGoal}g täglich, um Muskelmasse zu erhalten und Sättigung zu fördern.`)
      });
    } else if (inputData.weightGoal === 'gain') {
      recommendations.push({
        title: t('recommendations.gain.title', 'Kalorienüberschuss'),
        description: t('recommendations.gain.description', `Ein moderater Kalorienüberschuss von etwa 500 kcal pro Tag unterstützt den Muskelaufbau. Dein Ziel liegt bei ${calorieGoal} kcal täglich.`)
      });
      recommendations.push({
        title: t('recommendations.gain.protein.title', 'Hoher Proteinkonsum'),
        description: t('recommendations.gain.protein.description', `Konsumiere etwa ${proteinGoal}g Protein täglich, um den Muskelaufbau optimal zu unterstützen.`)
      });
    } else {
      recommendations.push({
        title: t('recommendations.maintain.title', 'Energiebalance'),
        description: t('recommendations.maintain.description', `Für die Gewichtserhaltung solltest du etwa ${calorieGoal} kcal täglich zu dir nehmen, was deinem Gesamtenergiebedarf entspricht.`)
      });
    }
    
    // Aktivitätsspezifische Empfehlungen
    if (['active', 'very_active'].includes(inputData.activityLevel)) {
      recommendations.push({
        title: t('recommendations.active.title', 'Sportlerernährung'),
        description: t('recommendations.active.description', 'Timing deiner Mahlzeiten ist wichtig. Versuche, vor dem Training komplexe Kohlenhydrate zu essen und danach eine Kombination aus Protein und Kohlenhydraten für optimale Erholung.')
      });
    }
    
    return recommendations;
  };
  
  // Beispielhafte Mahlzeitenpläne basierend auf Zielen
  const getMealPlanExample = () => {
    if (!inputData) return null;
    
    interface Meal {
      name: string;
      description: string;
    }
    
    interface MealPlan {
      title: string;
      meals: Meal[];
    }
    
    let mealPlan: MealPlan = {
      title: '',
      meals: []
    };
    
    if (inputData.weightGoal === 'lose') {
      mealPlan.title = t('mealPlans.lose.title', 'Beispiel-Mahlzeitenplan für Gewichtsverlust');
      mealPlan.meals = [
        {
          name: t('mealPlans.lose.breakfast', 'Frühstück'),
          description: t('mealPlans.lose.breakfastDesc', 'Proteinreiches Omelett mit Gemüse oder Griechischer Joghurt mit Beeren und einem Teelöffel Honig')
        },
        {
          name: t('mealPlans.lose.snack1', 'Snack'),
          description: t('mealPlans.lose.snack1Desc', 'Eine kleine Handvoll Nüsse oder ein Apfel mit einem Esslöffel Mandelmus')
        },
        {
          name: t('mealPlans.lose.lunch', 'Mittagessen'),
          description: t('mealPlans.lose.lunchDesc', 'Großer Salat mit gegrilltem Hähnchen, Gemüse und Olivenöl-Dressing')
        },
        {
          name: t('mealPlans.lose.snack2', 'Snack'),
          description: t('mealPlans.lose.snack2Desc', 'Proteinshake oder Hüttenkäse mit Gemüsesticks')
        },
        {
          name: t('mealPlans.lose.dinner', 'Abendessen'),
          description: t('mealPlans.lose.dinnerDesc', 'Gegrillter Fisch mit gedünstetem Gemüse und einer kleinen Portion Vollkornreis')
        }
      ];
    } else if (inputData.weightGoal === 'gain') {
      mealPlan.title = t('mealPlans.gain.title', 'Beispiel-Mahlzeitenplan für Muskelaufbau');
      mealPlan.meals = [
        {
          name: t('mealPlans.gain.breakfast', 'Frühstück'),
          description: t('mealPlans.gain.breakfastDesc', 'Haferflocken mit Banane, Proteinpulver, Nüssen und Milch')
        },
        {
          name: t('mealPlans.gain.snack1', 'Snack'),
          description: t('mealPlans.gain.snack1Desc', 'Vollkornbrot mit Avocado und gekochten Eiern')
        },
        {
          name: t('mealPlans.gain.lunch', 'Mittagessen'),
          description: t('mealPlans.gain.lunchDesc', 'Große Portion Hähnchenbrust mit Süßkartoffeln und Gemüse')
        },
        {
          name: t('mealPlans.gain.snack2', 'Snack'),
          description: t('mealPlans.gain.snack2Desc', 'Proteinshake mit Banane und Erdnussbutter')
        },
        {
          name: t('mealPlans.gain.dinner', 'Abendessen'),
          description: t('mealPlans.gain.dinnerDesc', 'Rindfleisch oder Tofu mit Vollkornnudeln und Gemüse in Tomatensauce')
        },
        {
          name: t('mealPlans.gain.snack3', 'Abendsnack'),
          description: t('mealPlans.gain.snack3Desc', 'Griechischer Joghurt mit Honig und Beeren')
        }
      ];
    } else {
      mealPlan.title = t('mealPlans.maintain.title', 'Beispiel-Mahlzeitenplan für Gewichtserhaltung');
      mealPlan.meals = [
        {
          name: t('mealPlans.maintain.breakfast', 'Frühstück'),
          description: t('mealPlans.maintain.breakfastDesc', 'Vollkornbrot mit Rührei und Avocado oder Müsli mit Joghurt und frischem Obst')
        },
        {
          name: t('mealPlans.maintain.snack1', 'Snack'),
          description: t('mealPlans.maintain.snack1Desc', 'Eine Handvoll Nüsse oder ein Stück Obst')
        },
        {
          name: t('mealPlans.maintain.lunch', 'Mittagessen'),
          description: t('mealPlans.maintain.lunchDesc', 'Gemischter Salat mit Protein deiner Wahl und einer Portion Vollkornbrot oder Quinoa')
        },
        {
          name: t('mealPlans.maintain.snack2', 'Snack'),
          description: t('mealPlans.maintain.snack2Desc', 'Joghurt mit Beeren oder Gemüsesticks mit Hummus')
        },
        {
          name: t('mealPlans.maintain.dinner', 'Abendessen'),
          description: t('mealPlans.maintain.dinnerDesc', 'Ausgewogene Mahlzeit mit Protein, Gemüse und einer moderaten Portion Kohlenhydrate')
        }
      ];
    }
    
    return mealPlan;
  };
  
  // Erklärungen zur Berechnung der Ernährungsziele
  const getCalculationExplanations = () => {
    if (!inputData) return null;
    
    return {
      bmr: {
        title: t('calculations.bmr.title', 'Grundumsatz (BMR)'),
        description: t('calculations.bmr.description', 'Der Grundumsatz ist die Energiemenge, die dein Körper in völliger Ruhe benötigt, um lebenswichtige Funktionen aufrechtzuerhalten.'),
        formula: t('calculations.bmr.formula', 'Wir verwenden die Harris-Benedict-Formel, die Geschlecht, Gewicht, Größe und Alter berücksichtigt:'),
        example: inputData.gender === 'male' 
          ? t('calculations.bmr.exampleMale', `Für Männer: 66,5 + (13,75 × ${inputData.weight} kg) + (5,003 × ${inputData.height} cm) - (6,755 × ${inputData.age} Jahre) = ${bmr} kcal`)
          : t('calculations.bmr.exampleFemale', `Für Frauen: 655,1 + (9,563 × ${inputData.weight} kg) + (1,85 × ${inputData.height} cm) - (4,676 × ${inputData.age} Jahre) = ${bmr} kcal`)
      },
      tdee: {
        title: t('calculations.tdee.title', 'Gesamtumsatz (TDEE)'),
        description: t('calculations.tdee.description', 'Der Gesamtumsatz berücksichtigt zusätzlich deine tägliche Aktivität und gibt an, wie viele Kalorien du insgesamt verbrauchst.'),
        formula: t('calculations.tdee.formula', 'TDEE = BMR × Aktivitätsfaktor'),
        example: t('calculations.tdee.example', `${bmr} kcal × ${inputData.activityLevel === 'sedentary' ? '1,2' : 
          inputData.activityLevel === 'light' ? '1,375' : 
          inputData.activityLevel === 'moderate' ? '1,55' : 
          inputData.activityLevel === 'active' ? '1,725' : '1,9'} = ${tdee} kcal`)
      },
      calorieGoal: {
        title: t('calculations.calorieGoal.title', 'Kalorienziel'),
        description: t('calculations.calorieGoal.description', 'Dein tägliches Kalorienziel basiert auf deinem Gesamtumsatz und deinem Gewichtsziel.'),
        formula: inputData.weightGoal === 'lose' 
          ? t('calculations.calorieGoal.formulaLose', 'TDEE - 500 kcal (für Gewichtsverlust)')
          : inputData.weightGoal === 'gain'
            ? t('calculations.calorieGoal.formulaGain', 'TDEE + 500 kcal (für Muskelaufbau)')
            : t('calculations.calorieGoal.formulaMaintain', 'TDEE (für Gewichtserhaltung)'),
        example: inputData.weightGoal === 'lose'
          ? t('calculations.calorieGoal.exampleLose', `${tdee} kcal - 500 kcal = ${calorieGoal} kcal`)
          : inputData.weightGoal === 'gain'
            ? t('calculations.calorieGoal.exampleGain', `${tdee} kcal + 500 kcal = ${calorieGoal} kcal`)
            : t('calculations.calorieGoal.exampleMaintain', `${tdee} kcal = ${calorieGoal} kcal`)
      },
      burnCalorieGoal: {
        title: t('calculations.burnCalorieGoal.title', 'Zu verbrennende Kalorien'),
        description: t('calculations.burnCalorieGoal.description', 'Die Anzahl der Kalorien, die du täglich durch Bewegung und Sport verbrennen solltest.'),
        formula: inputData.weightGoal === 'lose'
          ? t('calculations.burnCalorieGoal.formulaLose', '500 kcal (fester Wert für Gewichtsverlust)')
          : t('calculations.burnCalorieGoal.formulaNormal', '20% deines täglichen Kalorienziels'),
        example: inputData.weightGoal === 'lose'
          ? t('calculations.burnCalorieGoal.exampleLose', `500 kcal`)
          : t('calculations.burnCalorieGoal.exampleNormal', `${calorieGoal} kcal × 0,2 = ${additionalBurnRequired} kcal`)
      },
      protein: {
        title: t('calculations.protein.title', 'Proteinziel'),
        description: t('calculations.protein.description', 'Protein ist wichtig für Muskelaufbau und -erhalt. Dein Proteinbedarf hängt von deinem Körpergewicht ab.'),
        formula: t('calculations.protein.formula', '1,8g Protein pro kg Körpergewicht'),
        example: t('calculations.protein.example', `${inputData.weight} kg × 1,8g = ${proteinGoal}g Protein`)
      },
      fat: {
        title: t('calculations.fat.title', 'Fettziel'),
        description: t('calculations.fat.description', 'Gesunde Fette sind wichtig für Hormonproduktion und Zellgesundheit. Wir berechnen 30% deiner Gesamtkalorien als Fett.'),
        formula: t('calculations.fat.formula', '(Kalorienziel × 0,3) ÷ 9 kcal/g'),
        example: t('calculations.fat.example', `(${calorieGoal} kcal × 0,3) ÷ 9 kcal/g = ${fatGoal}g Fett`)
      },
      carbs: {
        title: t('calculations.carbs.title', 'Kohlenhydratziel'),
        description: t('calculations.carbs.description', 'Kohlenhydrate sind deine Hauptenergiequelle. Wir berechnen sie als die verbleibenden Kalorien nach Protein und Fett.'),
        formula: t('calculations.carbs.formula', '(Kalorienziel - Proteinkalorien - Fettkalorien) ÷ 4 kcal/g'),
        example: t('calculations.carbs.example', `(${calorieGoal} kcal - ${proteinGoal}g × 4 kcal/g - ${fatGoal}g × 9 kcal/g) ÷ 4 kcal/g = ${carbGoal}g Kohlenhydrate`)
      },
      water: {
        title: t('calculations.water.title', 'Wasserziel'),
        description: t('calculations.water.description', 'Ausreichend Wasser ist wichtig für alle Körperfunktionen. Wir berechnen 35ml pro kg Körpergewicht plus einen Aktivitätszuschlag.'),
        formula: t('calculations.water.formula', '35ml × Körpergewicht in kg'),
        example: t('calculations.water.example', `35ml × ${inputData.weight} kg = ${Math.round(inputData.weight * 35)}ml ≈ ${waterIntake} Liter`)
      }
    };
  };
  
  // Berechnete Werte mit zentralen Funktionen
  const bmr = inputData ? calculateBMR(inputData) : 1800;
  const tdee = calculateTDEE();
  const calorieGoal = inputData ? calculateCalorieGoal(inputData) : 2000;
  const additionalBurnRequired = calculateAdditionalBurnRequired();
  const proteinGoal = inputData ? calculateProteinGoal(inputData) : 75;
  const fatGoal = calorieGoal ? calculateFatGoal(calorieGoal) : 65;
  const carbGoal = (calorieGoal && proteinGoal && fatGoal) ? 
    calculateCarbGoal(calorieGoal, proteinGoal, fatGoal) : 250;
  const waterIntake = getWaterIntakeString();
  
  // Berechnung der Makronährstoffverteilung in Prozent
  const proteinCalories = proteinGoal * 4;
  const carbCalories = carbGoal * 4;
  const fatCalories = fatGoal * 9;
  const totalCalories = proteinCalories + carbCalories + fatCalories;
  
  const proteinPercentage = Math.round((proteinCalories / totalCalories) * 100);
  const carbsPercentage = Math.round((carbCalories / totalCalories) * 100);
  const fatPercentage = Math.round((fatCalories / totalCalories) * 100);
  
  const personalizedTips = getPersonalizedTips();
  const macroExplanations = getMacronutrientExplanations();
  const nutritionRecommendations = getNutritionRecommendations();
  const mealPlanExample = getMealPlanExample();
  const calculationExplanations = getCalculationExplanations();
  
  // Funktion zum Speichern der Ziele
  const saveGoals = () => {
    if (user) {
      const updatedUser = {
        ...user,
        calorieGoal: calorieGoal,
        proteinGoal: proteinGoal,
        carbGoal: carbGoal,
        fatGoal: fatGoal,
        waterGoal: inputData ? calculateWaterGoal(inputData) : 2500
      };
      
      updateUser(updatedUser);
      
      // XP-Belohnung für das Setzen von Ernährungszielen (wenn noch nicht getan)
      if (!user.calorieGoal || !user.proteinGoal || !user.carbGoal || !user.fatGoal) {
        addXP(50);
      }
      
      toast({
        title: t('nutritionGoals.saved', 'Ernährungsziele gespeichert'),
        description: t('nutritionGoals.savedDescription', 'Du kannst deine Ziele jederzeit in deinem Profil ändern.'),
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    }
  };
  
  // Lade-Indikator, wenn keine Benutzerdaten verfügbar sind
  if (!user) {
    return (
      <Container maxW="container.xl" py={8} textAlign="center">
        <Heading as="h1" size="xl" mb={2}>
          {t('nutritionGoals.loading', 'Deine Ernährungsdaten werden geladen...')}
        </Heading>
        <Text color="gray.500">
          {t('nutritionGoals.pleaseWait', 'Bitte warte einen Moment, während wir deine persönlichen Ziele berechnen.')}
        </Text>
      </Container>
    );
  }
  
  return (
    <Container maxW="container.xl" py={8}>
      <Box mb={8}>
        <Heading as="h1" size="xl" mb={2}>
          {t('nutritionGoals.title', 'Ernährungsziele')}
        </Heading>
        <Text color="gray.500">
          {t('nutritionGoals.subtitle', 'Personalisierte Ernährungsziele basierend auf deinen Bedürfnissen.')}
        </Text>
      </Box>
      
      <Flex direction="column" align="center">
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} width="100%" mb={8}>
          <Box 
            p={5} 
            shadow="md" 
            borderRadius="lg" 
            bg={calorieBoxBg} 
            color={calorieTextColor}
            textAlign="center"
            transition="transform 0.3s"
            _hover={{ transform: "translateY(-5px)", shadow: "lg" }}
          >
            <Heading size="md" mb={2}>
              {t('nutritionGoals.bmr', 'Grundumsatz (BMR)')}
            </Heading>
            <Heading size="xl" mb={2}>
              {Math.round(bmr)} kcal
            </Heading>
            <Text fontSize="sm">
              {t('nutritionGoals.bmrDescription', 'Kalorien, die dein Körper in Ruhe verbrennt')}
            </Text>
          </Box>
          
          <Box 
            p={5} 
            shadow="md" 
            borderRadius="lg" 
            bg={calorieBoxBg} 
            color={calorieTextColor}
            textAlign="center"
            transition="transform 0.3s"
            _hover={{ transform: "translateY(-5px)", shadow: "lg" }}
          >
            <Heading size="md" mb={2}>
              {t('nutritionGoals.tdee', 'Gesamtumsatz (TDEE)')}
            </Heading>
            <Heading size="xl" mb={2}>
              {Math.round(tdee)} kcal
            </Heading>
            <Text fontSize="sm">
              {t('nutritionGoals.tdeeDescription', 'Kalorien, die du täglich verbrauchst (inkl. Aktivität)')}
            </Text>
          </Box>
          
          <Box 
            p={5} 
            shadow="md" 
            borderRadius="lg" 
            bg={calorieBoxBg} 
            color={calorieTextColor}
            textAlign="center"
            transition="transform 0.3s"
            _hover={{ transform: "translateY(-5px)", shadow: "lg" }}
          >
            <Heading size="md" mb={2}>
              {t('nutritionGoals.dailyCalories', 'Tägliches Kalorienziel')}
            </Heading>
            <Heading size="xl" mb={2}>
              {calorieGoal} kcal
            </Heading>
            <Text fontSize="sm">
              {t('nutritionGoals.caloriesDescription', 'Deine optimale tägliche Kalorienzufuhr')}
            </Text>
          </Box>
        </SimpleGrid>
        
        {/* Neue Wasseraufnahme-Visualisierung */}
        <Box 
          p={5} 
          shadow="md" 
          borderRadius="lg" 
          bg={tipBg} 
          color={tipTextColor}
          mb={8}
          width={{ base: "100%", md: "50%" }}
          mx="auto"
          transition="transform 0.3s"
          _hover={{ transform: "translateY(-5px)", shadow: "lg" }}
        >
          <Flex direction={{ base: "column", sm: "row" }} align="center" justify="space-between">
            <Box textAlign={{ base: "center", sm: "left" }} mb={{ base: 4, sm: 0 }}>
              <Heading size="md" mb={2}>
                {t('nutritionGoals.waterIntake', 'Tägliche Wasseraufnahme')}
              </Heading>
              <Heading size="xl" mb={2}>
                {waterIntake} Liter
              </Heading>
              <Text fontSize="sm">
                {t('nutritionGoals.waterDescription', 'Optimale Hydration für deinen Körper')}
              </Text>
            </Box>
            <Box 
              position="relative" 
              width="100px" 
              height="100px"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Box 
                position="absolute"
                bottom="0"
                width="60px"
                height="80px"
                borderRadius="md"
                border="2px solid"
                borderColor="cyan.500"
                overflow="hidden"
              >
                <Box 
                  position="absolute"
                  bottom="0"
                  width="100%"
                  height="100%"
                  bg="cyan.200"
                  opacity="0.3"
                />
                <Box 
                  position="absolute"
                  bottom="0"
                  width="100%"
                  height="70%"
                  bg="cyan.500"
                  transition="height 1s"
                />
              </Box>
              <Icon 
                as={FiDroplet} 
                position="absolute" 
                color="cyan.500" 
                boxSize="100px" 
                opacity="0.2" 
              />
            </Box>
          </Flex>
          <Text fontSize="sm" mt={4} textAlign="center">
            {t('nutritionGoals.waterTip', 'Tipp: Verteile deine Wasseraufnahme über den Tag, um optimal hydriert zu bleiben.')}
          </Text>
        </Box>
        
        {nutritionData?.weightGoal === 'lose' && (
          <Box 
            p={5} 
            shadow="md" 
            borderRadius="lg" 
            bg={burnBoxBg} 
            color={burnTextColor}
            textAlign="center"
            mb={8}
            width={{ base: "100%", md: "50%" }}
            transition="transform 0.3s"
            _hover={{ transform: "translateY(-5px)", shadow: "lg" }}
          >
            <Heading size="md" mb={2}>
              {t('nutritionGoals.additionalBurn', 'Zusätzlich zu verbrennen')}
            </Heading>
            <Heading size="xl" mb={2}>
              {additionalBurnRequired} kcal
            </Heading>
            <Text fontSize="sm">
              {inputData?.weightGoal === 'lose' 
                ? t('nutritionGoals.additionalBurnDescriptionLose', 'Diese Kalorien solltest du täglich durch körperliche Aktivität zusätzlich verbrennen, um dein Gewichtsreduktionsziel zu erreichen')
                : t('nutritionGoals.additionalBurnDescription', 'Diese Kalorien solltest du täglich durch körperliche Aktivität verbrennen, um deine allgemeine Fitness zu fördern (20% deines Kalorienziels)')}
            </Text>
          </Box>
        )}
        
        <Grid 
          templateColumns={{ base: "1fr", md: "1fr 1fr" }} 
          gap={6} 
          width="100%" 
          mb={8}
        >
          <Box p={5} shadow="md" borderRadius="lg" bg={sectionBg} transition="transform 0.3s" _hover={{ transform: "translateY(-5px)", shadow: "lg" }}>
            <Heading size="md" mb={4}>
              <Flex align="center">
                <Icon as={FiTarget} mr={2} />
                {t('nutritionGoals.macronutrients', 'Makronährstoffe')}
              </Flex>
            </Heading>
            <SimpleGrid columns={3} spacing={4}>
              <Stat>
                <StatLabel>{t('nutritionGoals.protein', 'Protein')}</StatLabel>
                <StatNumber>{proteinGoal}g</StatNumber>
                <Text fontSize="sm">{Math.round(proteinGoal * 4)} kcal</Text>
                <Box 
                  mt={2} 
                  h="8px" 
                  w="100%" 
                  bg="red.100" 
                  borderRadius="full"
                  overflow="hidden"
                >
                  <Box 
                    h="100%" 
                    w={`${proteinPercentage}%`} 
                    bg="red.500" 
                    borderRadius="full"
                  />
                </Box>
                <Text fontSize="xs" mt={1} textAlign="right">{proteinPercentage}%</Text>
              </Stat>
              <Stat>
                <StatLabel>{t('nutritionGoals.carbs', 'Kohlenhydrate')}</StatLabel>
                <StatNumber>{carbGoal}g</StatNumber>
                <Text fontSize="sm">{Math.round(carbGoal * 4)} kcal</Text>
                <Box 
                  mt={2} 
                  h="8px" 
                  w="100%" 
                  bg="green.100" 
                  borderRadius="full"
                  overflow="hidden"
                >
                  <Box 
                    h="100%" 
                    w={`${carbsPercentage}%`} 
                    bg="green.500" 
                    borderRadius="full"
                  />
                </Box>
                <Text fontSize="xs" mt={1} textAlign="right">{carbsPercentage}%</Text>
              </Stat>
              <Stat>
                <StatLabel>{t('nutritionGoals.fat', 'Fett')}</StatLabel>
                <StatNumber>{fatGoal}g</StatNumber>
                <Text fontSize="sm">{Math.round(fatGoal * 9)} kcal</Text>
                <Box 
                  mt={2} 
                  h="8px" 
                  w="100%" 
                  bg="blue.100" 
                  borderRadius="full"
                  overflow="hidden"
                >
                  <Box 
                    h="100%" 
                    w={`${fatPercentage}%`} 
                    bg="blue.500" 
                    borderRadius="full"
                  />
                </Box>
                <Text fontSize="xs" mt={1} textAlign="right">{fatPercentage}%</Text>
              </Stat>
            </SimpleGrid>
            <Divider my={4} />
            <Text fontSize="sm">
              {t('nutritionGoals.macroDescription', 'Diese Verteilung der Makronährstoffe ist optimal für dein Ziel. Proteine helfen beim Muskelerhalt, Kohlenhydrate liefern Energie und Fette sind wichtig für Hormone und Zellgesundheit.')}
            </Text>
          </Box>
          
          <Box p={5} shadow="md" borderRadius="lg" bg={sectionBg} transition="transform 0.3s" _hover={{ transform: "translateY(-5px)", shadow: "lg" }}>
            <Heading size="md" mb={4}>
              <Flex align="center">
                <Icon as={FiInfo} mr={2} />
                {t('nutritionGoals.otherGoals', 'Weitere Ziele')}
              </Flex>
            </Heading>
            <List spacing={3}>
              <ListItem>
                <Flex align="center">
                  <ListIcon as={FiDroplet} color="blue.500" />
                  <Text fontWeight="bold">{t('nutritionGoals.water', 'Wasser')}: {waterIntake} Liter</Text>
                </Flex>
                <Text ml={6} fontSize="sm">
                  {t('nutritionGoals.waterDescription', 'Tägliche Flüssigkeitszufuhr für optimale Hydration')}
                </Text>
              </ListItem>
              <ListItem>
                <Flex align="center">
                  <ListIcon as={FiMenu} color="purple.500" />
                  <Text fontWeight="bold">{t('nutritionGoals.mealFrequency', 'Mahlzeitenhäufigkeit')}: 3-5</Text>
                </Flex>
                <Text ml={6} fontSize="sm">
                  {t('nutritionGoals.mealFrequencyDescription', 'Empfohlene Anzahl Mahlzeiten pro Tag')}
                </Text>
              </ListItem>
            </List>
          </Box>
        </Grid>
        
        <Box width="100%" mb={8}>
          <Heading size="md" mb={4}>
            <Flex align="center">
              <Icon as={FiInfo} mr={2} />
              {t('nutritionGoals.macronutrientDetails', 'Über deine Makronährstoffe')}
            </Flex>
          </Heading>
          
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            {/* Protein */}
            <Box p={5} shadow="md" borderRadius="lg" bg={sectionBg}>
              <Heading size="sm" mb={2}>{macroExplanations.protein.title}</Heading>
              <Text fontSize="sm" mb={3}>{macroExplanations.protein.description}</Text>
              
              <Text fontWeight="bold" fontSize="sm" mb={1}>{t('nutritionGoals.benefits', 'Vorteile:')}</Text>
              <List spacing={1} mb={3}>
                {macroExplanations.protein.benefits.map((benefit, index) => (
                  <ListItem key={index} fontSize="xs">
                    <ListIcon as={FiCheckCircle} color="green.500" />
                    {benefit}
                  </ListItem>
                ))}
              </List>
              
              <Text fontWeight="bold" fontSize="sm" mb={1}>{t('nutritionGoals.sources', 'Quellen:')}</Text>
              <List spacing={1}>
                {macroExplanations.protein.sources.map((source, index) => (
                  <ListItem key={index} fontSize="xs">
                    <ListIcon as={FiCheckCircle} color="green.500" />
                    {source}
                  </ListItem>
                ))}
              </List>
            </Box>
            
            {/* Kohlenhydrate */}
            <Box p={5} shadow="md" borderRadius="lg" bg={sectionBg}>
              <Heading size="sm" mb={2}>{macroExplanations.carbs.title}</Heading>
              <Text fontSize="sm" mb={3}>{macroExplanations.carbs.description}</Text>
              
              <Text fontWeight="bold" fontSize="sm" mb={1}>{t('nutritionGoals.benefits', 'Vorteile:')}</Text>
              <List spacing={1} mb={3}>
                {macroExplanations.carbs.benefits.map((benefit, index) => (
                  <ListItem key={index} fontSize="xs">
                    <ListIcon as={FiCheckCircle} color="green.500" />
                    {benefit}
                  </ListItem>
                ))}
              </List>
              
              <Text fontWeight="bold" fontSize="sm" mb={1}>{t('nutritionGoals.sources', 'Quellen:')}</Text>
              <List spacing={1}>
                {macroExplanations.carbs.sources.map((source, index) => (
                  <ListItem key={index} fontSize="xs">
                    <ListIcon as={FiCheckCircle} color="green.500" />
                    {source}
                  </ListItem>
                ))}
              </List>
            </Box>
            
            {/* Fette */}
            <Box p={5} shadow="md" borderRadius="lg" bg={sectionBg}>
              <Heading size="sm" mb={2}>{macroExplanations.fats.title}</Heading>
              <Text fontSize="sm" mb={3}>{macroExplanations.fats.description}</Text>
              
              <Text fontWeight="bold" fontSize="sm" mb={1}>{t('nutritionGoals.benefits', 'Vorteile:')}</Text>
              <List spacing={1} mb={3}>
                {macroExplanations.fats.benefits.map((benefit, index) => (
                  <ListItem key={index} fontSize="xs">
                    <ListIcon as={FiCheckCircle} color="green.500" />
                    {benefit}
                  </ListItem>
                ))}
              </List>
              
              <Text fontWeight="bold" fontSize="sm" mb={1}>{t('nutritionGoals.sources', 'Quellen:')}</Text>
              <List spacing={1}>
                {macroExplanations.fats.sources.map((source, index) => (
                  <ListItem key={index} fontSize="xs">
                    <ListIcon as={FiCheckCircle} color="green.500" />
                    {source}
                  </ListItem>
                ))}
              </List>
            </Box>
            
            {/* Wasser */}
            <Box p={5} shadow="md" borderRadius="lg" bg={sectionBg}>
              <Heading size="sm" mb={2}>{macroExplanations.water.title}</Heading>
              <Text fontSize="sm" mb={3}>{macroExplanations.water.description}</Text>
              
              <Text fontWeight="bold" fontSize="sm" mb={1}>{t('nutritionGoals.benefits', 'Vorteile:')}</Text>
              <List spacing={1} mb={3}>
                {macroExplanations.water.benefits.map((benefit, index) => (
                  <ListItem key={index} fontSize="xs">
                    <ListIcon as={FiCheckCircle} color="green.500" />
                    {benefit}
                  </ListItem>
                ))}
              </List>
              
              <Text fontWeight="bold" fontSize="sm" mb={1}>{t('nutritionGoals.sources', 'Quellen:')}</Text>
              <List spacing={1}>
                {macroExplanations.water.sources.map((source, index) => (
                  <ListItem key={index} fontSize="xs">
                    <ListIcon as={FiCheckCircle} color="green.500" />
                    {source}
                  </ListItem>
                ))}
              </List>
            </Box>
          </SimpleGrid>
        </Box>
        
        <Box width="100%" mb={8}>
          <Heading size="md" mb={4}>
            <Flex align="center">
              <Icon as={FiTarget} mr={2} />
              {t('nutritionGoals.recommendations', 'Personalisierte Ernährungsempfehlungen')}
            </Flex>
          </Heading>
          
          <List spacing={4}>
            {nutritionRecommendations.map((recommendation, index) => (
              <ListItem key={index} p={4} shadow="md" borderRadius="lg" bg={sectionBg}>
                <Heading size="sm" mb={2}>{recommendation.title}</Heading>
                <Text fontSize="sm">{recommendation.description}</Text>
              </ListItem>
            ))}
          </List>
        </Box>
        
        {/* Beispiel-Mahlzeitenplan */}
        {mealPlanExample && (
          <Box width="100%" mb={8}>
            <Heading size="md" mb={4}>
              <Flex align="center">
                <Icon as={FiMenu} mr={2} />
                {mealPlanExample.title}
              </Flex>
            </Heading>
            
            <List spacing={3}>
              {mealPlanExample.meals.map((meal, index) => (
                <ListItem key={index} p={4} shadow="md" borderRadius="lg" bg={sectionBg}>
                  <Heading size="sm" mb={1}>{meal.name}</Heading>
                  <Text fontSize="sm">{meal.description}</Text>
                </ListItem>
              ))}
            </List>
          </Box>
        )}
        
        {/* Erklärungen zur Berechnung */}
        {calculationExplanations && (
          <Box width="100%" mb={8}>
            <Heading size="md" mb={4}>
              <Flex align="center">
                <Icon as={FiInfo} mr={2} />
                {t('nutritionGoals.calculationExplanations', 'Wie wir deine Ziele berechnen')}
              </Flex>
            </Heading>
            
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              {/* BMR Erklärung */}
              <Box p={5} shadow="md" borderRadius="lg" bg={sectionBg}>
                <Heading size="sm" mb={2}>{calculationExplanations.bmr.title}</Heading>
                <Text fontSize="sm" mb={2}>{calculationExplanations.bmr.description}</Text>
                <Text fontSize="sm" fontWeight="bold" mb={1}>{calculationExplanations.bmr.formula}</Text>
                <Text fontSize="xs" fontStyle="italic">{calculationExplanations.bmr.example}</Text>
              </Box>
              
              {/* TDEE Erklärung */}
              <Box p={5} shadow="md" borderRadius="lg" bg={sectionBg}>
                <Heading size="sm" mb={2}>{calculationExplanations.tdee.title}</Heading>
                <Text fontSize="sm" mb={2}>{calculationExplanations.tdee.description}</Text>
                <Text fontSize="sm" fontWeight="bold" mb={1}>{calculationExplanations.tdee.formula}</Text>
                <Text fontSize="xs" fontStyle="italic">{calculationExplanations.tdee.example}</Text>
              </Box>
              
              {/* Kalorienziel Erklärung */}
              <Box p={5} shadow="md" borderRadius="lg" bg={sectionBg}>
                <Heading size="sm" mb={2}>{calculationExplanations.calorieGoal.title}</Heading>
                <Text fontSize="sm" mb={2}>{calculationExplanations.calorieGoal.description}</Text>
                <Text fontSize="sm" fontWeight="bold" mb={1}>{calculationExplanations.calorieGoal.formula}</Text>
                <Text fontSize="xs" fontStyle="italic">{calculationExplanations.calorieGoal.example}</Text>
              </Box>
              
              {/* Protein Erklärung */}
              <Box p={5} shadow="md" borderRadius="lg" bg={sectionBg}>
                <Heading size="sm" mb={2}>{calculationExplanations.protein.title}</Heading>
                <Text fontSize="sm" mb={2}>{calculationExplanations.protein.description}</Text>
                <Text fontSize="sm" fontWeight="bold" mb={1}>{calculationExplanations.protein.formula}</Text>
                <Text fontSize="xs" fontStyle="italic">{calculationExplanations.protein.example}</Text>
              </Box>
              
              {/* Fett Erklärung */}
              <Box p={5} shadow="md" borderRadius="lg" bg={sectionBg}>
                <Heading size="sm" mb={2}>{calculationExplanations.fat.title}</Heading>
                <Text fontSize="sm" mb={2}>{calculationExplanations.fat.description}</Text>
                <Text fontSize="sm" fontWeight="bold" mb={1}>{calculationExplanations.fat.formula}</Text>
                <Text fontSize="xs" fontStyle="italic">{calculationExplanations.fat.example}</Text>
              </Box>
              
              {/* Kohlenhydrate Erklärung */}
              <Box p={5} shadow="md" borderRadius="lg" bg={sectionBg}>
                <Heading size="sm" mb={2}>{calculationExplanations.carbs.title}</Heading>
                <Text fontSize="sm" mb={2}>{calculationExplanations.carbs.description}</Text>
                <Text fontSize="sm" fontWeight="bold" mb={1}>{calculationExplanations.carbs.formula}</Text>
                <Text fontSize="xs" fontStyle="italic">{calculationExplanations.carbs.example}</Text>
              </Box>
              
              {/* Wasser Erklärung */}
              <Box p={5} shadow="md" borderRadius="lg" bg={sectionBg} gridColumn={{ md: "span 2" }}>
                <Heading size="sm" mb={2}>{calculationExplanations.water.title}</Heading>
                <Text fontSize="sm" mb={2}>{calculationExplanations.water.description}</Text>
                <Text fontSize="sm" fontWeight="bold" mb={1}>{calculationExplanations.water.formula}</Text>
                <Text fontSize="xs" fontStyle="italic">{calculationExplanations.water.example}</Text>
              </Box>
            </SimpleGrid>
          </Box>
        )}
        
        {/* Personalisierte Tipps */}
        <Box width="100%" mb={8}>
          <Heading size="md" mb={4}>
            <Flex align="center">
              <Icon as={FiCheckCircle} mr={2} />
              {t('nutritionGoals.personalizedTips', 'Persönliche Tipps für dich')}
            </Flex>
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            {personalizedTips.map((tip, index) => (
              <Box 
                key={index} 
                p={4} 
                borderRadius="md" 
                bg={tipBg} 
                color={tipTextColor}
                transition="transform 0.3s"
                _hover={{ transform: "translateY(-3px)", shadow: "md" }}
              >
                <Flex align="center" mb={2}>
                  <Icon as={tip.icon} mr={2} />
                  <Heading size="sm">{tip.title}</Heading>
                </Flex>
                <Text fontSize="sm">{tip.description}</Text>
              </Box>
            ))}
          </SimpleGrid>
        </Box>
        
        <Box width="100%" textAlign="center">
          <Button 
            colorScheme="brand" 
            size="lg" 
            leftIcon={<FiCheckCircle />}
            onClick={saveGoals}
          >
            {t('nutritionGoals.saveGoals', 'Ziele bestätigen')}
          </Button>
        </Box>
      </Flex>
    </Container>
  );
};

export default NutritionGoalsPage; 