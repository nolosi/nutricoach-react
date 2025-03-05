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
        title: t('tips.mealPrep'),
        description: t('tips.mealPrepDesc'),
        icon: FiCheckCircle
      });
      
      return tips;
    }
    
    // Tipps basierend auf dem Ziel
    if (inputData.weightGoal === 'lose') {
      tips.push({
        title: t('tips.highProteinDiet'),
        description: t('tips.highProteinDietDesc'),
        icon: FiHeart
      });
      tips.push({
        title: t('tips.volumeEating'),
        description: t('tips.volumeEatingDesc'),
        icon: FiMenu
      });
    } else if (inputData.weightGoal === 'gain') {
      tips.push({
        title: t('tips.calorieDense'),
        description: t('tips.calorieDenseDesc'),
        icon: FiArrowUp
      });
      tips.push({
        title: t('tips.frequentMeals'),
        description: t('tips.frequentMealsDesc'),
        icon: FiMenu
      });
    }
    
    // Tipps basierend auf der Aktivität
    if (['active', 'very_active'].includes(inputData.activityLevel)) {
      tips.push({
        title: t('tips.postWorkoutNutrition'),
        description: t('tips.postWorkoutNutritionDesc'),
        icon: FiTarget
      });
      tips.push({
        title: t('tips.stayHydrated'),
        description: t('tips.stayHydratedDesc', { amount: getWaterIntakeString() }),
        icon: FiDroplet
      });
    }
    
    // Allgemeine Tipps
    tips.push({
      title: t('tips.mealPrep'),
      description: t('tips.mealPrepDesc'),
      icon: FiCheckCircle
    });
    
    // Gebe eine Teilmenge der Tipps zurück (max. 4)
    return tips.slice(0, 4);
  };
  
  // Makronährstofferklärungen
  const macroExplanations = {
    protein: {
      title: t('nutritionGoals.protein'),
      description: t('nutritionGoals.proteinDescription'),
      benefits: [
        t('nutritionGoals.proteinBenefit1'),
        t('nutritionGoals.proteinBenefit2'),
        t('nutritionGoals.proteinBenefit3')
      ],
      sources: [
        t('nutritionGoals.proteinSource1'),
        t('nutritionGoals.proteinSource2'),
        t('nutritionGoals.proteinSource3'),
        t('nutritionGoals.proteinSource4')
      ]
    },
    carbs: {
      title: t('nutritionGoals.carbs'),
      description: t('nutritionGoals.carbsDescription'),
      benefits: [
        t('nutritionGoals.carbsBenefit1'),
        t('nutritionGoals.carbsBenefit2'),
        t('nutritionGoals.carbsBenefit3')
      ],
      sources: [
        t('nutritionGoals.carbsSource1'),
        t('nutritionGoals.carbsSource2'),
        t('nutritionGoals.carbsSource3'),
        t('nutritionGoals.carbsSource4')
      ]
    },
    fats: {
      title: t('nutritionGoals.fat'),
      description: t('nutritionGoals.fatDescription'),
      benefits: [
        t('nutritionGoals.fatBenefit1'),
        t('nutritionGoals.fatBenefit2'),
        t('nutritionGoals.fatBenefit3')
      ],
      sources: [
        t('nutritionGoals.fatSource1'),
        t('nutritionGoals.fatSource2'),
        t('nutritionGoals.fatSource3'),
        t('nutritionGoals.fatSource4')
      ]
    },
    water: {
      title: t('nutritionGoals.water'),
      description: t('nutritionGoals.waterDetailDescription'),
      benefits: [
        t('nutritionGoals.waterBenefit1'),
        t('nutritionGoals.waterBenefit2'),
        t('nutritionGoals.waterBenefit3')
      ],
      sources: [
        t('nutritionGoals.waterSource1'),
        t('nutritionGoals.waterSource2'),
        t('nutritionGoals.waterSource3')
      ]
    }
  };
  
  // Personalisierte Ernährungsempfehlungen basierend auf Zielen
  const getNutritionRecommendations = () => {
    if (!inputData) return [];
    
    const recommendations = [];
    
    // Allgemeine Empfehlungen
    recommendations.push({
      title: t('recommendations.general.title'),
      description: t('recommendations.general.description')
    });
    
    // Zielspezifische Empfehlungen
    if (inputData.weightGoal === 'lose') {
      recommendations.push({
        title: t('recommendations.lose.title'),
        description: t('recommendations.lose.description', { calorieGoal })
      });
      recommendations.push({
        title: t('recommendations.lose.protein.title'),
        description: t('recommendations.lose.protein.description', { proteinGoal })
      });
    } else if (inputData.weightGoal === 'gain') {
      recommendations.push({
        title: t('recommendations.gain.title'),
        description: t('recommendations.gain.description', { calorieGoal })
      });
      recommendations.push({
        title: t('recommendations.gain.protein.title'),
        description: t('recommendations.gain.protein.description', { proteinGoal })
      });
    } else {
      recommendations.push({
        title: t('recommendations.maintain.title'),
        description: t('recommendations.maintain.description', { calorieGoal })
      });
    }
    
    // Aktivitätsspezifische Empfehlungen
    if (['active', 'very_active'].includes(inputData.activityLevel)) {
      recommendations.push({
        title: t('recommendations.active.title'),
        description: t('recommendations.active.description')
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
      mealPlan.title = t('mealPlans.lose.title');
      mealPlan.meals = [
        {
          name: t('mealPlans.lose.breakfast'),
          description: t('mealPlans.lose.breakfastDesc')
        },
        {
          name: t('mealPlans.lose.snack1'),
          description: t('mealPlans.lose.snack1Desc')
        },
        {
          name: t('mealPlans.lose.lunch'),
          description: t('mealPlans.lose.lunchDesc')
        },
        {
          name: t('mealPlans.lose.snack2'),
          description: t('mealPlans.lose.snack2Desc')
        },
        {
          name: t('mealPlans.lose.dinner'),
          description: t('mealPlans.lose.dinnerDesc')
        }
      ];
    } else if (inputData.weightGoal === 'gain') {
      mealPlan.title = t('mealPlans.gain.title');
      mealPlan.meals = [
        {
          name: t('mealPlans.gain.breakfast'),
          description: t('mealPlans.gain.breakfastDesc')
        },
        {
          name: t('mealPlans.gain.snack1'),
          description: t('mealPlans.gain.snack1Desc')
        },
        {
          name: t('mealPlans.gain.lunch'),
          description: t('mealPlans.gain.lunchDesc')
        },
        {
          name: t('mealPlans.gain.snack2'),
          description: t('mealPlans.gain.snack2Desc')
        },
        {
          name: t('mealPlans.gain.dinner'),
          description: t('mealPlans.gain.dinnerDesc')
        },
        {
          name: t('mealPlans.gain.snack3'),
          description: t('mealPlans.gain.snack3Desc')
        }
      ];
    } else {
      mealPlan.title = t('mealPlans.maintain.title');
      mealPlan.meals = [
        {
          name: t('mealPlans.maintain.breakfast'),
          description: t('mealPlans.maintain.breakfastDesc')
        },
        {
          name: t('mealPlans.maintain.snack1'),
          description: t('mealPlans.maintain.snack1Desc')
        },
        {
          name: t('mealPlans.maintain.lunch'),
          description: t('mealPlans.maintain.lunchDesc')
        },
        {
          name: t('mealPlans.maintain.snack2'),
          description: t('mealPlans.maintain.snack2Desc')
        },
        {
          name: t('mealPlans.maintain.dinner'),
          description: t('mealPlans.maintain.dinnerDesc')
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
        title: t('calculations.bmr.title'),
        description: t('calculations.bmr.description'),
        formula: t('calculations.bmr.formula'),
        example: inputData.gender === 'male' 
          ? t('calculations.bmr.exampleMale', { weight: inputData.weight, height: inputData.height, age: inputData.age, bmr })
          : t('calculations.bmr.exampleFemale', { weight: inputData.weight, height: inputData.height, age: inputData.age, bmr })
      },
      tdee: {
        title: t('calculations.tdee.title'),
        description: t('calculations.tdee.description'),
        formula: t('calculations.tdee.formula'),
        example: t('calculations.tdee.example', { 
          bmr,
          activityFactor: inputData.activityLevel === 'sedentary' ? '1,2' : 
            inputData.activityLevel === 'light' ? '1,375' : 
            inputData.activityLevel === 'moderate' ? '1,55' : 
            inputData.activityLevel === 'active' ? '1,725' : '1,9',
          tdee
        })
      },
      calorieGoal: {
        title: t('calculations.calorieGoal.title'),
        description: t('calculations.calorieGoal.description'),
        formula: inputData.weightGoal === 'lose' 
          ? t('calculations.calorieGoal.formulaLose')
          : inputData.weightGoal === 'gain'
            ? t('calculations.calorieGoal.formulaGain')
            : t('calculations.calorieGoal.formulaMaintain'),
        example: inputData.weightGoal === 'lose'
          ? t('calculations.calorieGoal.exampleLose', { tdee, calorieGoal })
          : inputData.weightGoal === 'gain'
            ? t('calculations.calorieGoal.exampleGain', { tdee, calorieGoal })
            : t('calculations.calorieGoal.exampleMaintain', { tdee, calorieGoal })
      },
      burnCalorieGoal: {
        title: t('calculations.burnCalorieGoal.title'),
        description: t('calculations.burnCalorieGoal.description'),
        formula: inputData.weightGoal === 'lose'
          ? t('calculations.burnCalorieGoal.formulaLose')
          : t('calculations.burnCalorieGoal.formulaNormal'),
        example: inputData.weightGoal === 'lose'
          ? t('calculations.burnCalorieGoal.exampleLose')
          : t('calculations.burnCalorieGoal.exampleNormal', { calorieGoal, additionalBurnRequired })
      },
      protein: {
        title: t('calculations.protein.title'),
        description: t('calculations.protein.description'),
        formula: t('calculations.protein.formula'),
        example: t('calculations.protein.example', { weight: inputData.weight, proteinGoal })
      },
      fat: {
        title: t('calculations.fat.title'),
        description: t('calculations.fat.description'),
        formula: t('calculations.fat.formula'),
        example: t('calculations.fat.example', { calorieGoal, fatGoal })
      },
      carbs: {
        title: t('calculations.carbs.title'),
        description: t('calculations.carbs.description'),
        formula: t('calculations.carbs.formula'),
        example: t('calculations.carbs.example', { calorieGoal, proteinGoal, fatGoal, carbGoal })
      },
      water: {
        title: t('calculations.water.title'),
        description: t('calculations.water.description'),
        formula: t('calculations.water.formula'),
        example: t('calculations.water.example', { weight: inputData.weight, waterAmount: Math.round(inputData.weight * 35), waterIntake })
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
          {t('nutritionGoals.loading')}
        </Heading>
        <Text color="gray.500">
          {t('nutritionGoals.pleaseWait')}
        </Text>
      </Container>
    );
  }
  
  return (
    <Container maxW="container.xl" py={8}>
      <Box mb={8}>
        <Heading as="h1" size="xl" mb={2}>
          {t('nutritionGoals.title')}
        </Heading>
        <Text color="gray.500">
          {t('nutritionGoals.subtitle')}
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
              {t('nutritionGoals.bmr')}
            </Heading>
            <Heading size="xl" mb={2}>
              {Math.round(bmr)} kcal
            </Heading>
            <Text fontSize="sm">
              {t('nutritionGoals.bmrDescription')}
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
              {t('nutritionGoals.tdee')}
            </Heading>
            <Heading size="xl" mb={2}>
              {Math.round(tdee)} kcal
            </Heading>
            <Text fontSize="sm">
              {t('nutritionGoals.tdeeDescription')}
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
              {t('nutritionGoals.dailyCalories')}
            </Heading>
            <Heading size="xl" mb={2}>
              {calorieGoal} kcal
            </Heading>
            <Text fontSize="sm">
              {t('nutritionGoals.caloriesDescription')}
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
                {t('nutritionGoals.waterIntake')}
              </Heading>
              <Heading size="xl" mb={2}>
                {waterIntake} Liter
              </Heading>
              <Text fontSize="sm">
                {t('nutritionGoals.waterDescription')}
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
            {t('nutritionGoals.waterTip')}
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
              {t('nutritionGoals.additionalBurn')}
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
                {t('nutritionGoals.macronutrients')}
              </Flex>
            </Heading>
            <SimpleGrid columns={3} spacing={4}>
              <Stat>
                <StatLabel>{t('nutritionGoals.protein')}</StatLabel>
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
                <StatLabel>{t('nutritionGoals.carbs')}</StatLabel>
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
                <StatLabel>{t('nutritionGoals.fat')}</StatLabel>
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
              {t('nutritionGoals.macroDescription')}
            </Text>
          </Box>
          
          <Box p={5} shadow="md" borderRadius="lg" bg={sectionBg} transition="transform 0.3s" _hover={{ transform: "translateY(-5px)", shadow: "lg" }}>
            <Heading size="md" mb={4}>
              <Flex align="center">
                <Icon as={FiInfo} mr={2} />
                {t('nutritionGoals.otherGoals')}
              </Flex>
            </Heading>
            <List spacing={3}>
              <ListItem>
                <Flex align="center">
                  <ListIcon as={FiDroplet} color="blue.500" />
                  <Text fontWeight="bold">{t('nutritionGoals.water')}: {waterIntake} Liter</Text>
                </Flex>
                <Text ml={6} fontSize="sm">
                  {t('nutritionGoals.waterDescription')}
                </Text>
              </ListItem>
              <ListItem>
                <Flex align="center">
                  <ListIcon as={FiMenu} color="purple.500" />
                  <Text fontWeight="bold">{t('nutritionGoals.mealFrequency')}: 3-5</Text>
                </Flex>
                <Text ml={6} fontSize="sm">
                  {t('nutritionGoals.mealFrequencyDescription')}
                </Text>
              </ListItem>
            </List>
          </Box>
        </Grid>
        
        <Box width="100%" mb={8}>
          <Heading size="md" mb={4}>
            <Flex align="center">
              <Icon as={FiInfo} mr={2} />
              {t('nutritionGoals.macronutrientDetails')}
            </Flex>
          </Heading>
          
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            {/* Protein */}
            <Box p={5} shadow="md" borderRadius="lg" bg={sectionBg}>
              <Heading size="sm" mb={2}>{macroExplanations.protein.title}</Heading>
              <Text fontSize="sm" mb={3}>{macroExplanations.protein.description}</Text>
              
              <Text fontWeight="bold" fontSize="sm" mb={1}>{t('nutritionGoals.benefits')}:</Text>
              <List spacing={1} mb={3}>
                {macroExplanations.protein.benefits.map((benefit, index) => (
                  <ListItem key={index} fontSize="xs">
                    <ListIcon as={FiCheckCircle} color="green.500" />
                    {benefit}
                  </ListItem>
                ))}
              </List>
              
              <Text fontWeight="bold" fontSize="sm" mb={1}>{t('nutritionGoals.sources')}:</Text>
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
              
              <Text fontWeight="bold" fontSize="sm" mb={1}>{t('nutritionGoals.benefits')}:</Text>
              <List spacing={1} mb={3}>
                {macroExplanations.carbs.benefits.map((benefit, index) => (
                  <ListItem key={index} fontSize="xs">
                    <ListIcon as={FiCheckCircle} color="green.500" />
                    {benefit}
                  </ListItem>
                ))}
              </List>
              
              <Text fontWeight="bold" fontSize="sm" mb={1}>{t('nutritionGoals.sources')}:</Text>
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
              
              <Text fontWeight="bold" fontSize="sm" mb={1}>{t('nutritionGoals.benefits')}:</Text>
              <List spacing={1} mb={3}>
                {macroExplanations.fats.benefits.map((benefit, index) => (
                  <ListItem key={index} fontSize="xs">
                    <ListIcon as={FiCheckCircle} color="green.500" />
                    {benefit}
                  </ListItem>
                ))}
              </List>
              
              <Text fontWeight="bold" fontSize="sm" mb={1}>{t('nutritionGoals.sources')}:</Text>
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
              
              <Text fontWeight="bold" fontSize="sm" mb={1}>{t('nutritionGoals.benefits')}:</Text>
              <List spacing={1} mb={3}>
                {macroExplanations.water.benefits.map((benefit, index) => (
                  <ListItem key={index} fontSize="xs">
                    <ListIcon as={FiCheckCircle} color="green.500" />
                    {benefit}
                  </ListItem>
                ))}
              </List>
              
              <Text fontWeight="bold" fontSize="sm" mb={1}>{t('nutritionGoals.sources')}:</Text>
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
              {t('nutritionGoals.recommendations')}
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
                {t('nutritionGoals.calculationExplanations')}
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
              {t('nutritionGoals.personalizedTips')}
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
            {t('nutritionGoals.saveGoals')}
          </Button>
        </Box>
      </Flex>
    </Container>
  );
};

export default NutritionGoalsPage; 