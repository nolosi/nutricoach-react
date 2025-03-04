import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  Image,
  Badge,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useToast,
  useColorModeValue,
  useColorMode,
  HStack,
  VStack,
  List,
  ListItem,
  Divider,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Card,
  CardBody,
  Tooltip,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
  Progress,
  SimpleGrid,
  Stat,
  Icon,
  Grid,
  Stack,
  FormControl,
  FormLabel,
  Select,
  useBreakpointValue
} from '@chakra-ui/react';
import { 
  FiPlus, 
  FiSearch, 
  FiTrash2, 
  FiCalendar, 
  FiChevronLeft, 
  FiChevronRight,
  FiInfo,
  FiCheckCircle,
  FiHelpCircle,
  FiCamera,
  FiUnlock,
  FiCheck
} from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { FoodService, Food, Meal, MealFood } from '../../services/FoodService';
import RecipeService, { Recipe, MealPlanResult } from '../../services/RecipeService';
import { useUser } from '../../contexts/UserContext';
import FoodRecognitionService, { FoodRecognitionResult } from '../../services/FoodRecognitionService';
import { useNavigate } from 'react-router-dom';
import TrackingService from '../../services/TrackingService';

const FoodTrackingView: React.FC<{ initialDate?: string }> = ({ initialDate }) => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const { colorMode } = useColorMode();
  const { user, updateUser, checkAndCompleteMissions, completeMeal } = useUser();
  const navigate = useNavigate();
  
  // Responsive Größen basierend auf dem Breakpoint
  const buttonSize = useBreakpointValue({ base: 'xs', md: 'sm' });
  const iconSize = useBreakpointValue({ base: 3, md: 4 });
  const headingSize = useBreakpointValue({ base: 'sm', md: 'md' });
  const cardPadding = useBreakpointValue({ base: 3, md: 4 });
  const spacing = useBreakpointValue({ base: 2, md: 4 });
  
  // Farben basierend auf dem Farbmodus
  const cardBg = useColorModeValue('white', 'gray.700');
  const mealBoxBgColor = useColorModeValue('gray.50', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  
  // Farben für die Erkennungsergebnisse und andere Bereiche
  const recognitionBg = useColorModeValue('blue.50', 'blue.900');
  const listItemBg = useColorModeValue('white', 'gray.700');
  const listItemHoverBg = useColorModeValue('gray.50', 'gray.600');
  const selectedFoodBg = useColorModeValue('teal.50', 'teal.900');
  const selectedFoodHoverBg = useColorModeValue('teal.100', 'teal.800');
  const photoUploadBg = useColorModeValue('blue.50', 'blue.900');
  const calculatedNutritionBg = useColorModeValue('white', 'gray.700');
  const selectedFoodDisplayBg = useColorModeValue('green.50', 'green.900');
  const completedMealBg = useColorModeValue('gray.50', 'gray.700');
  const infoBannerBg = useColorModeValue('blue.50', 'blue.900');
  
  // Referenz zum Foto-Input (global für die Komponente)
  const photoInputRef = React.useRef<HTMLInputElement>(null);
  
  // State für die ausgewählten Daten
  const [selectedDate, setSelectedDate] = useState<string>(initialDate || new Date().toISOString().split('T')[0]);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // State für die Lebensmittelsuche
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Food[]>([]);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [foodAmount, setFoodAmount] = useState<number>(100);
  const [currentMealType, setCurrentMealType] = useState<string>('');
  
  // State für geplante Mahlzeiten
  const [plannedMeals, setPlannedMeals] = useState<MealPlanResult[]>([]);
  
  // Neuer State für das benutzerdefinierte Lebensmittel Modal
  const { 
    isOpen: isCustomFoodModalOpen, 
    onOpen: onCustomFoodModalOpen, 
    onClose: onCustomFoodModalClose 
  } = useDisclosure();
  
  // State für das neue benutzerdefinierte Lebensmittel
  const [newCustomFood, setNewCustomFood] = useState<Omit<Food, 'id'>>({
    name: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    servingSize: 100,
    servingUnit: 'g',
    category: 'Benutzerdefiniert'
  });
  
  // Neuer State für das erste Mal, dass ein Benutzer die Seite besucht
  const [showHelp, setShowHelp] = useState<boolean>(!localStorage.getItem('nutricoach_meals_intro_seen'));
  
  // State für die Bildanalyse
  const [isAnalyzingImage, setIsAnalyzingImage] = useState<boolean>(false);
  const [recognitionResult, setRecognitionResult] = useState<FoodRecognitionResult | null>(null);
  
  // Lade die Mahlzeiten für das ausgewählte Datum
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      try {
        // Lade die Mahlzeiten für das ausgewählte Datum
        const loadedMeals = FoodService.getMealsForDate(selectedDate);
        setMeals(loadedMeals);
        
        // Lade die geplanten Mahlzeiten für das ausgewählte Datum
        const loadedPlannedMeals = await RecipeService.getMealPlanForDate(selectedDate);
        setPlannedMeals(loadedPlannedMeals);
      } catch (error) {
        toast({
          title: t('common.error'),
          description: t('meals.errorLoadingMeals'),
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [selectedDate, t, toast]);
  
  // Funktion zum Importieren einer geplanten Mahlzeit in die Tracking-Ansicht
  const handleImportPlannedMeal = (plannedMeal: MealPlanResult, mealType: string) => {
    // Erstelle ein Food-Objekt aus dem Rezept
    const recipeId = `recipe-${plannedMeal.recipe.id}`;
    const recipeAsFood: Food = {
      id: recipeId,
      name: plannedMeal.recipe.title,
      // Verwende die Originalwerte aus dem Rezept ohne Modifikation
      calories: plannedMeal.recipe.calories,
      protein: plannedMeal.recipe.protein,
      carbs: plannedMeal.recipe.carbs,
      fat: plannedMeal.recipe.fat,
      servingSize: 1,
      servingUnit: 'Portion',
      category: 'Rezepte'
    };
    
    // Prüfe, ob bereits eine Mahlzeit dieses Typs existiert
    const existingMeal = meals.find(meal => meal.mealType === mealType);
    
    if (existingMeal) {
      // Prüfe, ob das Rezept bereits in der Mahlzeit enthalten ist
      const recipeAlreadyAdded = existingMeal.foods.some(mealFood => mealFood.food.id === recipeId);
      
      if (recipeAlreadyAdded) {
        // Zeige eine Warnmeldung an
        toast({
          title: t('common.info', 'Information'),
          description: t('meals.recipeAlreadyAdded', 'Dieses Rezept wurde bereits zu dieser Mahlzeit hinzugefügt'),
          status: 'info',
          duration: 2000,
          isClosable: true,
        });
        return;
      }
      
      // Füge das Rezept zu einer bestehenden Mahlzeit hinzu
      const updatedFoods = [...existingMeal.foods, { food: recipeAsFood, amount: 1 }];
      const totals = FoodService.calculateMealTotals(updatedFoods);
      
      // Lösche die alte Mahlzeit
      FoodService.deleteMeal(existingMeal.id);
      
      // Erstelle eine neue Mahlzeit mit den aktualisierten Lebensmitteln
      const newMeal: Omit<Meal, 'id'> = {
        date: selectedDate,
        mealType: mealType,
        foods: updatedFoods,
        totalCalories: totals.calories,
        totalProtein: totals.protein,
        totalCarbs: totals.carbs,
        totalFat: totals.fat
      };
      
      const addedMeal = FoodService.addMeal(newMeal);
      
      // Aktualisiere die Mahlzeiten im State
      setMeals(meals.map(meal => meal.id === existingMeal.id ? addedMeal : meal));
    } else {
      // Erstelle eine neue Mahlzeit
      const newMeal: Omit<Meal, 'id'> = {
        date: selectedDate,
        mealType: mealType,
        foods: [{ food: recipeAsFood, amount: 1 }],
        totalCalories: recipeAsFood.calories,
        totalProtein: recipeAsFood.protein,
        totalCarbs: recipeAsFood.carbs,
        totalFat: recipeAsFood.fat
      };
      
      const addedMeal = FoodService.addMeal(newMeal);
      
      // Füge die neue Mahlzeit zum State hinzu
      setMeals([...meals, addedMeal]);
    }
    
    // Zeige eine Erfolgsmeldung
    toast({
      title: t('common.success'),
      description: t('meals.plannedMealImported'),
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };
  
  // Funktion zum Ändern des Datums
  const changeDate = (days: number) => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + days);
    setSelectedDate(date.toISOString().split('T')[0]);
  };
  
  // Funktion zum Formatieren des Datums
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  // Berechne die täglichen Gesamtwerte
  const calculateDailyTotals = () => {
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    
    // Nur abgeschlossene Mahlzeiten einbeziehen
    meals.filter(meal => meal.isCompleted).forEach(meal => {
      totalCalories += meal.totalCalories;
      totalProtein += meal.totalProtein;
      totalCarbs += meal.totalCarbs;
      totalFat += meal.totalFat;
    });
    
    return { calories: totalCalories, protein: totalProtein, carbs: totalCarbs, fat: totalFat };
  };
  
  // Tägliche Gesamtwerte
  const dailyTotals = calculateDailyTotals();
  console.log('Tägliche Gesamtwerte (aus abgeschlossenen Mahlzeiten):', dailyTotals);
  
  // Aktualisiere die täglichen Fortschritte
  useEffect(() => {
    if (user) {
      console.log('Aktualisiere tägliche Fortschritte mit:', dailyTotals);
      updateUser({
        ...user,
        dailyProgress: {
          calories: dailyTotals.calories,
          protein: dailyTotals.protein,
          carbs: dailyTotals.carbs,
          fat: dailyTotals.fat,
          water: user.dailyProgress?.water || 0
        }
      });
      
      // Speichere die Ernährungsdaten in der Historie mit dem TrackingService
      if (dailyTotals.calories > 0) {
        TrackingService.updateMetric(
          user,
          updateUser,
          'calories',
          dailyTotals.calories,
          undefined,
          selectedDate
        );
      }
      
      if (dailyTotals.protein > 0) {
        TrackingService.updateMetric(
          user,
          updateUser,
          'protein',
          dailyTotals.protein,
          undefined,
          selectedDate
        );
      }
    }
  }, [dailyTotals, user, updateUser, selectedDate]);
  
  // Funktion zum Ausblenden des Hilfetexts und Setzen des Flags
  const dismissHelp = () => {
    setShowHelp(false);
    localStorage.setItem('nutricoach_meals_intro_seen', 'true');
  };
  
  // Funktion zum Öffnen des Modals für eine bestimmte Mahlzeit
  const handleAddFood = (mealType: string) => {
    setCurrentMealType(mealType);
    setSearchQuery('');
    setSearchResults(FoodService.getRecentFoods());
    setSelectedFood(null);
    setFoodAmount(100);
    onOpen();
  };
  
  // Funktion zum Suchen von Lebensmitteln
  const handleSearch = () => {
    console.log('Suche nach:', searchQuery);
    const results = FoodService.searchFoods(searchQuery);
    console.log('Gefundene Ergebnisse:', results.length);
    setSearchResults(results);
  };
  
  // Effekt zum Suchen bei Änderung der Suchanfrage
  useEffect(() => {
    if (searchQuery.length > 0) {
      handleSearch();
    } else if (searchQuery.length === 0) {
      setSearchResults(FoodService.getRecentFoods());
    }
  }, [searchQuery]);
  
  // Funktion zum Auswählen eines Lebensmittels
  const handleSelectFood = (food: Food) => {
    setSelectedFood(food);
    setFoodAmount(food.servingSize);
  };
  
  // Funktion zum Hinzufügen eines Lebensmittels zur Mahlzeit
  const handleAddFoodToMeal = () => {
    if (!selectedFood) return;
    
    // Berechne die Nährwerte für die ausgewählte Menge
    const nutrition = FoodService.calculateNutrition(selectedFood, foodAmount);
    
    // Erstelle eine neue Mahlzeit oder füge das Lebensmittel zu einer bestehenden hinzu
    const existingMeal = meals.find(meal => meal.mealType === currentMealType);
    
    if (existingMeal) {
      // Füge das Lebensmittel zu einer bestehenden Mahlzeit hinzu
      const updatedFoods = [...existingMeal.foods, { food: selectedFood, amount: foodAmount }];
      const totals = FoodService.calculateMealTotals(updatedFoods);
      
      // Lösche die alte Mahlzeit
      FoodService.deleteMeal(existingMeal.id);
      
      // Erstelle eine neue Mahlzeit mit den aktualisierten Lebensmitteln
      const newMeal: Omit<Meal, 'id'> = {
        date: selectedDate,
        mealType: currentMealType,
        foods: updatedFoods,
        totalCalories: totals.calories,
        totalProtein: totals.protein,
        totalCarbs: totals.carbs,
        totalFat: totals.fat,
        isCompleted: existingMeal.isCompleted || false // Behalte den Status der Mahlzeit bei
      };
      
      const addedMeal = FoodService.addMeal(newMeal);
      
      // Aktualisiere die Mahlzeiten im State
      setMeals(meals.map(meal => meal.id === existingMeal.id ? addedMeal : meal));
    } else {
      // Erstelle eine neue Mahlzeit
      const newMeal: Omit<Meal, 'id'> = {
        date: selectedDate,
        mealType: currentMealType,
        foods: [{ food: selectedFood, amount: foodAmount }],
        totalCalories: nutrition.calories,
        totalProtein: nutrition.protein,
        totalCarbs: nutrition.carbs,
        totalFat: nutrition.fat,
        isCompleted: false // Standardmäßig ist eine neue Mahlzeit nicht abgeschlossen
      };
      
      const addedMeal = FoodService.addMeal(newMeal);
      
      // Füge die neue Mahlzeit zum State hinzu
      setMeals([...meals, addedMeal]);
    }
    
    // Schließe das Modal
    onClose();
    
    // Zeige eine Erfolgsmeldung
    toast({
      title: t('common.success'),
      description: t('meals.foodAdded'),
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
    
    // Überprüfe Missionen
    checkAndCompleteMissions();
  };
  
  // Funktion zum Löschen einer Mahlzeit
  const handleDeleteMeal = (mealId: string) => {
    FoodService.deleteMeal(mealId);
    setMeals(meals.filter(meal => meal.id !== mealId));
    
    toast({
      title: t('common.success'),
      description: t('meals.mealDeleted'),
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
  };
  
  // Funktion zum Entfernen eines Lebensmittels aus einer Mahlzeit
  const handleRemoveFood = (mealId: string, foodId: string) => {
    const meal = meals.find(m => m.id === mealId);
    if (!meal) return;
    
    // Entferne das Lebensmittel aus der Mahlzeit
    const updatedFoods = meal.foods.filter(mf => mf.food.id !== foodId);
    
    if (updatedFoods.length === 0) {
      // Wenn keine Lebensmittel mehr übrig sind, lösche die Mahlzeit
      handleDeleteMeal(mealId);
    } else {
      // Berechne die neuen Gesamtwerte
      const totals = FoodService.calculateMealTotals(updatedFoods);
      
      // Lösche die alte Mahlzeit
      FoodService.deleteMeal(mealId);
      
      // Erstelle eine neue Mahlzeit mit den aktualisierten Lebensmitteln
      const newMeal: Omit<Meal, 'id'> = {
        date: selectedDate,
        mealType: meal.mealType,
        foods: updatedFoods,
        totalCalories: totals.calories,
        totalProtein: totals.protein,
        totalCarbs: totals.carbs,
        totalFat: totals.fat,
        isCompleted: meal.isCompleted || false // Behalte den Status der Mahlzeit bei
      };
      
      const addedMeal = FoodService.addMeal(newMeal);
      
      // Aktualisiere die Mahlzeiten im State
      setMeals(meals.map(m => m.id === mealId ? addedMeal : m));
    }
    
    toast({
      title: t('common.success'),
      description: t('meals.foodRemoved'),
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
  };
  
  // Funktion zum Hinzufügen eines Rezepts als Mahlzeit
  const handleAddRecipeAsMeal = (recipe: Recipe, mealType: string) => {
    // Erstelle ein Food-Objekt aus dem Rezept
    const recipeFood: Food = {
      id: `recipe-${recipe.id}`,
      name: recipe.title,
      calories: recipe.calories, // Verwende nur Originalwerte ohne Standardwerte
      protein: recipe.protein,
      carbs: recipe.carbs,
      fat: recipe.fat,
      servingSize: 1,
      servingUnit: 'Portion',
      category: 'Rezept'
    };
    
    // Setze das ausgewählte Lebensmittel und die Mahlzeitenart
    setSelectedFood(recipeFood);
    setCurrentMealType(mealType);
    setFoodAmount(1);
    
    // Füge das Rezept als Mahlzeit hinzu
    const nutrition = FoodService.calculateNutrition(recipeFood, 1);
    
    // Erstelle eine neue Mahlzeit oder füge das Lebensmittel zu einer bestehenden hinzu
    const existingMeal = meals.find(meal => meal.mealType === mealType);
    
    if (existingMeal) {
      // Füge das Lebensmittel zu einer bestehenden Mahlzeit hinzu
      const updatedFoods = [...existingMeal.foods, { food: recipeFood, amount: 1 }];
      const totals = FoodService.calculateMealTotals(updatedFoods);
      
      // Lösche die alte Mahlzeit
      FoodService.deleteMeal(existingMeal.id);
      
      // Erstelle eine neue Mahlzeit mit den aktualisierten Lebensmitteln
      const newMeal: Omit<Meal, 'id'> = {
        date: selectedDate,
        mealType: mealType,
        foods: updatedFoods,
        totalCalories: totals.calories,
        totalProtein: totals.protein,
        totalCarbs: totals.carbs,
        totalFat: totals.fat,
        isCompleted: existingMeal.isCompleted || false // Behalte den Status der Mahlzeit bei
      };
      
      const addedMeal = FoodService.addMeal(newMeal);
      
      // Aktualisiere die Mahlzeiten
      setMeals(prevMeals => 
        prevMeals.map(meal => meal.id === existingMeal.id ? addedMeal : meal)
      );
    } else {
      // Erstelle eine neue Mahlzeit
      const newMeal: Omit<Meal, 'id'> = {
        date: selectedDate,
        mealType: mealType,
        foods: [{ food: recipeFood, amount: 1 }],
        totalCalories: nutrition.calories,
        totalProtein: nutrition.protein,
        totalCarbs: nutrition.carbs,
        totalFat: nutrition.fat,
        isCompleted: false // Standardmäßig ist eine neue Mahlzeit nicht abgeschlossen
      };
      
      const addedMeal = FoodService.addMeal(newMeal);
      
      // Aktualisiere die Mahlzeiten
      setMeals(prevMeals => [...prevMeals, addedMeal]);
    }
    
    toast({
      title: t('common.success'),
      description: t('meals.addedToMeal', { food: recipe.title }),
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
    
    // Überprüfe Missionen
    checkAndCompleteMissions();
  };
  
  // Funktion zum Abschließen einer Mahlzeit
  const handleCompleteMeal = (mealId: string, mealType: string) => {
    // Finde die Mahlzeit zur Überprüfung
    const mealToComplete = meals.find(meal => meal.id === mealId);
    if (!mealToComplete) {
      console.error('Mahlzeit zum Abschließen nicht gefunden:', mealId);
      return;
    }
    
    console.log('FoodTrackingView: Mahlzeit zum Abschließen:', mealToComplete);
    
    // Rufe completeMeal auf, um die Mahlzeit abzuschließen und überprüfe, ob Missionen abgeschlossen wurden
    const missionResult = completeMeal(mealId);
    console.log('FoodTrackingView: Mahlzeit abgeschlossen, Ergebnis:', missionResult);
    
    // Aktualisiere den lokalen State, um die UI sofort zu aktualisieren
    setMeals(prevMeals => prevMeals.map(meal => 
      meal.id === mealId ? { ...meal, isCompleted: true } : meal
    ));
    
    // Standard-Benachrichtigung für abgeschlossene Mahlzeit
    toast({
      title: t('common.success'),
      description: t('meals.mealCompleted', { meal: t(`meals.${mealType}`) }),
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
    
    // Wenn Missionen abgeschlossen wurden, zusätzliche Benachrichtigung anzeigen
    if (missionResult) {
      toast({
        title: t('missions.completed', 'Mission abgeschlossen!'),
        description: t('missions.xpEarned', { xp: 20 }),
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
    }
  };
  
  // Funktion zur Analyse eines Bildes
  const analyzeImage = async (file: File) => {
    setIsAnalyzingImage(true);
    setRecognitionResult(null);
    
    try {
      // Analysiere das Bild
      const result = await FoodRecognitionService.analyzeImage(file);
      setRecognitionResult(result);
      
      // Wähle automatisch das Lebensmittel mit der höchsten Wahrscheinlichkeit
      if (result.foods.length > 0) {
        // Sortiere nach Wahrscheinlichkeit
        const sortedFoods = [...result.foods].sort((a, b) => b.probability - a.probability);
        const bestMatch = sortedFoods[0];
        
        // Konvertiere zu einem Food-Objekt
        const food = FoodRecognitionService.convertToFood(bestMatch);
        setSelectedFood(food);
        setFoodAmount(bestMatch.estimatedAmount);
      }
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('meals.errorAnalyzingImage', 'Fehler bei der Bildanalyse'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsAnalyzingImage(false);
    }
  };
  
  // Funktion zum Handhaben des Bildupload-Ereignisses
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      analyzeImage(file);
    }
  };
  
  // Funktion zum Zurücksetzen des neuen benutzerdefinierten Lebensmittels
  const resetNewCustomFood = () => {
    setNewCustomFood({
      name: '',
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      servingSize: 100,
      servingUnit: 'g',
      category: 'Benutzerdefiniert'
    });
  };
  
  // Funktion zum Öffnen des Modals für ein benutzerdefiniertes Lebensmittel
  const handleOpenCustomFoodModal = () => {
    resetNewCustomFood();
    onCustomFoodModalOpen();
  };
  
  // Funktion zum Hinzufügen eines benutzerdefinierten Lebensmittels
  const handleAddCustomFood = () => {
    // Validiere die Eingaben
    if (!newCustomFood.name.trim()) {
      toast({
        title: t('common.error'),
        description: t('meals.customFood.errorNoName', 'Bitte gib einen Namen für das Lebensmittel ein'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    if (newCustomFood.calories <= 0) {
      toast({
        title: t('common.error'),
        description: t('meals.customFood.errorInvalidCalories', 'Bitte gib gültige Kalorien ein'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    // Füge das Lebensmittel zur Datenbank hinzu
    const addedFood = FoodService.addFood(newCustomFood);
    
    // Setze das hinzugefügte Lebensmittel als ausgewähltes Lebensmittel
    setSelectedFood(addedFood);
    setFoodAmount(addedFood.servingSize);
    
    // Aktualisiere die Suchergebnisse, um das neue Lebensmittel anzuzeigen
    setSearchResults([...searchResults, addedFood]);
    
    // Schließe das Modal
    onCustomFoodModalClose();
    
    // Zeige eine Erfolgsmeldung
    toast({
      title: t('common.success'),
      description: t('meals.customFood.addedSuccess', 'Lebensmittel erfolgreich hinzugefügt'),
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };
  
  // Funktion zum Aktualisieren des neuen benutzerdefinierten Lebensmittels
  const handleCustomFoodChange = (field: keyof Omit<Food, 'id'>, value: string | number) => {
    setNewCustomFood({
      ...newCustomFood,
      [field]: value
    });
  };
  
  // Aktualisierte Funktion zum Rendern der Mahlzeiten mit verbesserten Tooltips und Informationen
  const renderMeals = () => {
    const mealTypes = ['breakfast', 'lunch', 'dinner', 'snacks'] as const;
    type MealType = typeof mealTypes[number];
    
    // Berechne die kumulativen Nährwerte für jede Mahlzeit
    const cumulativeNutrition: Record<MealType, { calories: number, protein: number, carbs: number, fat: number }> = {
      breakfast: { calories: 0, protein: 0, carbs: 0, fat: 0 },
      lunch: { calories: 0, protein: 0, carbs: 0, fat: 0 },
      dinner: { calories: 0, protein: 0, carbs: 0, fat: 0 },
      snacks: { calories: 0, protein: 0, carbs: 0, fat: 0 },
    };
    
    // Berechne die kumulativen Werte
    let totalSoFar = { calories: 0, protein: 0, carbs: 0, fat: 0 };
    
    mealTypes.forEach(type => {
      const currentMeal = meals.find(m => m.mealType === type);
      if (currentMeal) {
        totalSoFar.calories += currentMeal.totalCalories;
        totalSoFar.protein += currentMeal.totalProtein;
        totalSoFar.carbs += currentMeal.totalCarbs;
        totalSoFar.fat += currentMeal.totalFat;
      }
      
      cumulativeNutrition[type] = { ...totalSoFar };
    });
    
    // Verbesserte Funktion zur Darstellung der Lebensmittelmengen
    const renderFoodAmount = (mealFood: MealFood): string => {
      const food = mealFood.food;
      
      // Wenn ein Rezept mit bestimmter Portionsgröße
      if (food && food.servingUnit) {
        return `${mealFood.amount} ${food.servingUnit}`;
      }
      
      // Fallback für Lebensmittel ohne spezifische Mengenangabe
      return mealFood.amount ? `${mealFood.amount} g` : '1 Portion';
    };
    
    // Funktion zum Entsperren einer abgeschlossenen Mahlzeit
    const handleUnlockMeal = (mealId: string) => {
      // Aktualisiere den lokalen State, um die UI sofort zu aktualisieren
      setMeals(prevMeals => prevMeals.map(meal => 
        meal.id === mealId ? { ...meal, isCompleted: false } : meal
      ));
      
      // Da es keine updateMealCompletionStatus-Methode gibt, löschen wir die alte
      // Mahlzeit und erstellen eine neue mit isCompleted=false
      const mealToUpdate = meals.find(m => m.id === mealId);
      if (mealToUpdate) {
        // Lösche die alte Mahlzeit
        FoodService.deleteMeal(mealId);
        
        // Erstelle eine neue Mahlzeit mit den gleichen Daten, aber isCompleted=false
        const newMeal: Omit<Meal, 'id'> = {
          date: mealToUpdate.date,
          mealType: mealToUpdate.mealType,
          foods: mealToUpdate.foods,
          totalCalories: mealToUpdate.totalCalories,
          totalProtein: mealToUpdate.totalProtein,
          totalCarbs: mealToUpdate.totalCarbs,
          totalFat: mealToUpdate.totalFat,
          isCompleted: false
        };
        
        // Füge die neue Mahlzeit hinzu
        FoodService.addMeal(newMeal);
      }
      
      toast({
        title: t('common.success'),
        description: t('meals.mealUnlocked', 'Mahlzeit zum Bearbeiten entsperrt'),
        status: 'info',
        duration: 2000,
        isClosable: true,
      });
    };

    // Aktualisierte Render-Funktion für einzelne Mahlzeiten
    const renderMeal = (mealType: MealType, index: number) => {
          const meal = meals.find(m => m.mealType === mealType);
      const cumulativeValues = cumulativeNutrition[mealType];
          
          return (
            <Box 
              key={mealType}
              borderWidth="1px"
          borderRadius="lg"
          p={cardPadding}
          mb={spacing}
          bg={meal?.isCompleted ? completedMealBg : cardBg}
        >
          <Flex justifyContent="space-between" alignItems="center" mb={2}>
            <Heading size={headingSize} mb={2}>
              {t(`meals.${mealType}`, mealType)}
                </Heading>
            <Flex>
              {meal?.isCompleted ? (
                <>
                  <Badge colorScheme="green" p={2} mr={2} fontSize="sm">
                    {t('meals.missionComplete', 'Completed')}
                  </Badge>
                  <Tooltip label={t('meals.unlockMeal', 'Mahlzeit entsperren')}>
                    <IconButton
                      aria-label={t('meals.unlockMeal', 'Mahlzeit entsperren')}
                      icon={<FiUnlock />}
                      colorScheme="blue"
                      variant="outline"
                      size={buttonSize}
                      onClick={() => handleUnlockMeal(meal.id)}
                    />
                  </Tooltip>
                </>
              ) : (
                <>
                  {meal ? (
                    <>
                      <Tooltip label={t('meals.completeMeal', 'Mahlzeit abschließen')}>
                        <IconButton
                          aria-label={t('meals.completeMeal', 'Mahlzeit abschließen')}
                          icon={<FiCheck />}
                          colorScheme="green"
                          variant="outline"
                          size={buttonSize}
                          mr={2}
                          onClick={() => handleCompleteMeal(meal.id, mealType)}
                        />
                      </Tooltip>
                      <Tooltip label={t('meals.takePhoto', 'Foto für automatische Erkennung aufnehmen')}>
                        <IconButton
                          aria-label={t('meals.takePhoto', 'Foto aufnehmen')}
                          icon={<FiCamera />}
                          colorScheme="blue"
                          variant="outline"
                          size={buttonSize}
                          mr={2}
                          onClick={() => {
                            setCurrentMealType(mealType);
                            setTimeout(() => {
                              if (photoInputRef.current) {
                                photoInputRef.current.click();
                              }
                            }, 100);
                          }}
                        />
                      </Tooltip>
                      <Tooltip label={t('meals.addFood', 'Lebensmittel hinzufügen')}>
                        <IconButton
                          aria-label={t('meals.addFood', 'Lebensmittel hinzufügen')}
                          icon={<FiPlus />}
                          colorScheme="teal"
                          variant="outline"
                          size={buttonSize}
                          onClick={() => {
                            setCurrentMealType(mealType);
                            onOpen();
                          }}
                        />
                      </Tooltip>
                    </>
                  ) : (
                    <Tooltip label={t('meals.addFirstFood', 'Erste Mahlzeit hinzufügen')}>
                <Button
                  colorScheme="teal"
                        leftIcon={<FiPlus />}
                  size={buttonSize}
                        onClick={() => {
                          setCurrentMealType(mealType);
                          onOpen();
                        }}
                >
                        {t('meals.addFirstFood', 'Erste Mahlzeit hinzufügen')}
                </Button>
                    </Tooltip>
                  )}
                </>
              )}
            </Flex>
              </Flex>
              
          {/* Nährwertinformationen mit kumulativen Fortschrittsbalken */}
          <Grid templateColumns="repeat(4, 1fr)" gap={4} mb={4}>
            <Box>
              <Text fontSize="sm" fontWeight="bold" mb={1}>
                {t('meals.calories', 'Kalorien')}
              </Text>
              <Progress 
                value={(cumulativeValues.calories / (user?.calorieGoal || 2000)) * 100} 
                colorScheme="blue" 
                size="sm" 
                mb={1}
                hasStripe={meal?.isCompleted}
              />
              <Text fontSize="xs">
                {cumulativeValues.calories.toFixed(0)} / {user?.calorieGoal || 2000} kcal
                        </Text>
            </Box>
            <Box>
              <Text fontSize="sm" fontWeight="bold" mb={1}>
                {t('meals.protein', 'Protein')}
              </Text>
              <Progress 
                value={user?.proteinGoal ? Math.min(100, (meals.reduce((sum, meal) => sum + meal.totalProtein, 0) / user.proteinGoal) * 100) : 0} 
                colorScheme="pink" 
                      size="sm"
                borderRadius="md"
              />
              <Text fontSize="xs">
                {cumulativeValues.protein.toFixed(0)} / {user?.proteinGoal || 100} g
              </Text>
            </Box>
            <Box>
              <Text fontSize="sm" fontWeight="bold" mb={1}>
                {t('meals.carbs', 'Kohlenhydrate')}
              </Text>
              <Progress 
                value={user?.carbGoal ? Math.min(100, (meals.reduce((sum, meal) => sum + meal.totalCarbs, 0) / user.carbGoal) * 100) : 0} 
                      colorScheme="blue"
                size="sm" 
                borderRadius="md"
              />
              <Text fontSize="xs">
                {cumulativeValues.carbs.toFixed(0)} / {user?.carbGoal || 250} g
              </Text>
                </Box>
            <Box>
              <Text fontSize="sm" fontWeight="bold" mb={1}>
                {t('meals.fat', 'Fett')}
              </Text>
              <Progress 
                value={user?.fatGoal ? Math.min(100, (meals.reduce((sum, meal) => sum + meal.totalFat, 0) / user.fatGoal) * 100) : 0} 
                colorScheme="yellow" 
                size="sm" 
                borderRadius="md"
              />
              <Text fontSize="xs">
                {cumulativeValues.fat.toFixed(0)} / {user?.fatGoal || 70} g
              </Text>
            </Box>
          </Grid>

          {/* Liste der Lebensmittel */}
              {meal && meal.foods.length > 0 ? (
            <VStack spacing={2} align="stretch">
              {meal.foods.map((mealFood, idx) => (
                    <Flex 
                  key={idx}
                  justifyContent="space-between"
                      p={2}
                      borderRadius="md"
                  bg={listItemBg}
                  _hover={{ bg: listItemHoverBg }}
                >
                  <Box>
                    <Text fontWeight="bold">{mealFood.food.name}</Text>
                    <Text fontSize="sm">
                      {renderFoodAmount(mealFood)} • {mealFood.food.servingUnit === 'Portion' 
                        ? mealFood.food.calories.toFixed(0)  // Für Rezepte/Portionen direkt den Kalorienwert anzeigen
                        : (mealFood.food.calories * mealFood.amount / 100).toFixed(0)} kcal
                        </Text>
                  </Box>
                  {!meal.isCompleted && (
                        <IconButton
                      aria-label={t('common.delete', 'Löschen')}
                          icon={<FiTrash2 />}
                          size={buttonSize}
                          variant="ghost"
                          colorScheme="red"
                          onClick={() => handleRemoveFood(meal.id, mealFood.food.id)}
                        />
                  )}
                    </Flex>
                  ))}
                </VStack>
              ) : (
            <Box textAlign="center" py={4}>
              <Text color="gray.500">
                {t('meals.noFoodAdded', 'Noch keine Lebensmittel hinzugefügt')}
                </Text>
            </Box>
          )}

          {/* Geplante Mahlzeiten anzeigen */}
          {!meal?.isCompleted && plannedMeals.length > 0 && (
            <Box mt={4}>
              <Divider mb={2} />
              <Heading size="xs" mb={2}>{t('meals.plannedMeals', 'Geplante Mahlzeiten')}</Heading>
              <VStack spacing={2} align="stretch">
                {plannedMeals
                  .filter(pm => pm.mealType === mealType)
                  .map((plannedMeal, idx) => (
                    <Flex
                      key={idx}
                      justifyContent="space-between"
                      p={2}
                      borderRadius="md"
                      bg="gray.50"
                      _dark={{ bg: "gray.700" }}
                    >
                      <Box>
                        <Text fontWeight="bold">{plannedMeal.recipe.title}</Text>
                        <Text fontSize="sm">
                          {plannedMeal.recipe.calories} kcal • {t('meals.portion', 'Portion')}
                        </Text>
            </Box>
                      {meal && (() => {
                        // Prüfe, ob dieses Rezept bereits zu dieser Mahlzeit hinzugefügt wurde
                        const recipeId = `recipe-${plannedMeal.recipe.id}`;
                        const recipeAlreadyAdded = meal.foods.some(mealFood => mealFood.food.id === recipeId);
                        
                        if (recipeAlreadyAdded) {
                          return (
                            <Button
                              size={buttonSize}
                              leftIcon={<FiCheck />}
                              colorScheme="green"
                              variant="outline"
                              isDisabled={true}
                            >
                              {t('meals.alreadyAdded', 'Hinzugefügt')}
                            </Button>
                          );
                        } else {
                          return (
                            <Button
                              size={buttonSize}
                              leftIcon={<FiPlus />}
                              colorScheme="green"
                              variant="outline"
                              onClick={() => handleImportPlannedMeal(plannedMeal, mealType)}
                            >
                              {t('meals.addToMeal', 'Zur Mahlzeit hinzufügen')}
                            </Button>
                          );
                        }
                      })()}
                      {!meal && (
                        <Button
                          size={buttonSize}
                          leftIcon={<FiPlus />}
                          colorScheme="green"
                          variant="outline"
                          onClick={() => handleImportPlannedMeal(plannedMeal, mealType)}
                        >
                          {t('meals.addToMeal', 'Zur Mahlzeit hinzufügen')}
                        </Button>
                      )}
                    </Flex>
                  ))}
      </VStack>
            </Box>
          )}
        </Box>
      );
    };

    // Verstecktes Input-Element für Datei-Uploads
    const fileInput = (
      <input
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: 'none' }}
        ref={photoInputRef}
        onChange={handleImageUpload}
        id="photo-input"
      />
    );

    return (
      <Box>
        {/* Der Info-Banner für Rezepte wird entfernt, da er bereits in der MealsPage.tsx existiert */}
        {fileInput}
        {mealTypes.map((type, idx) => renderMeal(type, idx))}
        <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
            <ModalHeader>{t('meals.addFood', 'Lebensmittel hinzufügen')}</ModalHeader>
          <ModalBody>
              {/* Suchfeld mit besserer Sichtbarkeit */}
              <InputGroup mb={4} size="lg">
                <InputLeftElement pointerEvents="none" color="gray.400">
                  <FiSearch />
              </InputLeftElement>
              <Input
                placeholder={String(t('meals.searchFood', 'Lebensmittel suchen'))}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                  borderRadius="md"
                  shadow="sm"
              />
            </InputGroup>
              
              {/* Button zum Hinzufügen eines benutzerdefinierten Lebensmittels */}
              <Button 
                colorScheme="blue" 
                leftIcon={<FiPlus />} 
                size="md" 
                mb={4} 
                onClick={handleOpenCustomFoodModal}
                width="full"
              >
                {t('meals.customFood.add', 'Eigenes Lebensmittel hinzufügen')}
              </Button>
            
            {/* Kürzlich hinzugefügte Lebensmittel */}
            {searchQuery.length === 0 && (
              <Box mb={4}>
                <Text fontWeight="bold" mb={2}>{t('meals.recentlyAdded', 'Kürzlich hinzugefügt')}</Text>
                <Divider mb={2} />
              </Box>
            )}
            
              {/* Verbesserte Suchergebnisse */}
            <List spacing={2} mb={4} maxH="300px" overflowY="auto">
              {searchResults.map(food => (
                <ListItem 
                  key={food.id} 
                    p={3} 
                  borderWidth="1px" 
                  borderRadius="md"
                    bg={selectedFood?.id === food.id ? selectedFoodBg : listItemBg}
                    _hover={{ bg: selectedFood?.id === food.id ? selectedFoodHoverBg : listItemHoverBg }}
                  cursor="pointer"
                  onClick={() => handleSelectFood(food)}
                    transition="all 0.2s"
                    shadow="sm"
                >
                  <Flex justify="space-between" align="center">
                    <Box>
                      <Text fontWeight="bold">{food.name}</Text>
                        <HStack mt={1} spacing={2}>
                          <Badge colorScheme="blue">{food.calories} kcal</Badge>
                      <Text fontSize="sm" color="gray.500">
                            {food.servingSize}{food.servingUnit}
                      </Text>
                        </HStack>
                    </Box>
                    {food.category && (
                        <Badge colorScheme="purple" px={2} py={1} borderRadius="md">{food.category}</Badge>
                    )}
                  </Flex>
                </ListItem>
              ))}
              
              {searchResults.length === 0 && (
                <Text color="gray.500" textAlign="center" py={4}>
                  {searchQuery.length > 0 
                    ? t('meals.noFoodFound', 'Keine Lebensmittel gefunden') 
                    : t('meals.noRecentFood', 'Keine kürzlich hinzugefügten Lebensmittel')}
                </Text>
              )}
            </List>
            
              {/* Ausgewähltes Lebensmittel mit verbessener Darstellung */}
            {selectedFood && (
                <Box mt={4} p={4} borderWidth="1px" borderRadius="md" bg={selectedFoodDisplayBg} shadow="md">
                  <Heading size="sm" mb={3}>{selectedFood.name}</Heading>
                
                  <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} mb={4}>
                  <Box>
                    <Text fontSize="sm" color="gray.500">{t('nutrition.calories', 'Kalorien')}</Text>
                    <Text fontWeight="bold">{selectedFood.calories} kcal</Text>
                  </Box>
                  <Box>
                    <Text fontSize="sm" color="gray.500">{t('nutrition.protein', 'Protein')}</Text>
                    <Text fontWeight="bold">{selectedFood.protein}g</Text>
                  </Box>
                  <Box>
                    <Text fontSize="sm" color="gray.500">{t('nutrition.carbs', 'Kohlenhydrate')}</Text>
                    <Text fontWeight="bold">{selectedFood.carbs}g</Text>
                  </Box>
                  <Box>
                    <Text fontSize="sm" color="gray.500">{t('nutrition.fat', 'Fett')}</Text>
                    <Text fontWeight="bold">{selectedFood.fat}g</Text>
                  </Box>
                  </SimpleGrid>
                
                  <Text fontWeight="medium" mb={2}>{t('meals.amount', 'Menge')} ({selectedFood.servingUnit})</Text>
                <NumberInput
                  value={foodAmount}
                  onChange={(_, value) => setFoodAmount(value)}
                  min={1}
                  max={1000}
                    size="lg"
                >
                    <NumberInputField borderRadius="md" shadow="sm" />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                
                {/* Berechnete Nährwerte für die ausgewählte Menge */}
                {foodAmount !== selectedFood.servingSize && (
                    <Box mt={4} p={3} borderWidth="1px" borderRadius="md" bg={calculatedNutritionBg}>
                      <Text fontSize="sm" fontWeight="medium" mb={2}>
                        {t('meals.calculatedNutrition', 'Berechnete Nährwerte für')} {foodAmount}{selectedFood.servingUnit}:
                      </Text>
                      <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
                      <Box>
                        <Text fontSize="sm" color="gray.500">{t('nutrition.calories', 'Kalorien')}</Text>
                        <Text fontWeight="bold">
                          {Math.round(selectedFood.calories * (foodAmount / selectedFood.servingSize))} kcal
                        </Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="gray.500">{t('nutrition.protein', 'Protein')}</Text>
                        <Text fontWeight="bold">
                          {(selectedFood.protein * (foodAmount / selectedFood.servingSize)).toFixed(1)}g
                        </Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="gray.500">{t('nutrition.carbs', 'Kohlenhydrate')}</Text>
                        <Text fontWeight="bold">
                          {(selectedFood.carbs * (foodAmount / selectedFood.servingSize)).toFixed(1)}g
                        </Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="gray.500">{t('nutrition.fat', 'Fett')}</Text>
                        <Text fontWeight="bold">
                          {(selectedFood.fat * (foodAmount / selectedFood.servingSize)).toFixed(1)}g
                        </Text>
                      </Box>
                      </SimpleGrid>
                  </Box>
                )}
              </Box>
            )}
          </ModalBody>
          
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              {t('common.cancel', 'Abbrechen')}
            </Button>
            <Button 
              colorScheme="teal" 
              isDisabled={!selectedFood}
              onClick={handleAddFoodToMeal}
                size="lg"
                leftIcon={<FiPlus />}
            >
              {t('common.add', 'Hinzufügen')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      
        {/* Modal für das Hinzufügen eines benutzerdefinierten Lebensmittels */}
        <Modal isOpen={isCustomFoodModalOpen} onClose={onCustomFoodModalClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{t('meals.customFood.title', 'Eigenes Lebensmittel erstellen')}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4} align="stretch">
                <FormControl isRequired>
                  <FormLabel>{t('meals.customFood.name', 'Name')}</FormLabel>
                  <Input
                    value={newCustomFood.name}
                    onChange={(e) => handleCustomFoodChange('name', e.target.value)}
                    placeholder={String(t('meals.customFood.namePlaceholder', 'z.B. Hausgemachtes Müsli'))}
                  />
                </FormControl>
                
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>{t('nutrition.calories', 'Kalorien')} (kcal)</FormLabel>
                    <NumberInput
                      value={newCustomFood.calories}
                      onChange={(_, val) => handleCustomFoodChange('calories', val)}
                      min={0}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                  
                  <FormControl isRequired>
                    <FormLabel>{t('nutrition.protein', 'Protein')} (g)</FormLabel>
                    <NumberInput
                      value={newCustomFood.protein}
                      onChange={(_, val) => handleCustomFoodChange('protein', val)}
                      min={0}
                      precision={1}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                  
                  <FormControl isRequired>
                    <FormLabel>{t('nutrition.carbs', 'Kohlenhydrate')} (g)</FormLabel>
                    <NumberInput
                      value={newCustomFood.carbs}
                      onChange={(_, val) => handleCustomFoodChange('carbs', val)}
                      min={0}
                      precision={1}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                  
                  <FormControl isRequired>
                    <FormLabel>{t('nutrition.fat', 'Fett')} (g)</FormLabel>
                    <NumberInput
                      value={newCustomFood.fat}
                      onChange={(_, val) => handleCustomFoodChange('fat', val)}
                      min={0}
                      precision={1}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                </SimpleGrid>
                
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>{t('meals.customFood.servingSize', 'Portionsgröße')}</FormLabel>
                    <NumberInput
                      value={newCustomFood.servingSize}
                      onChange={(_, val) => handleCustomFoodChange('servingSize', val)}
                      min={1}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                  
                  <FormControl isRequired>
                    <FormLabel>{t('meals.customFood.servingUnit', 'Einheit')}</FormLabel>
                    <Select
                      value={newCustomFood.servingUnit}
                      onChange={(e) => handleCustomFoodChange('servingUnit', e.target.value)}
                    >
                      <option value="g">g (Gramm)</option>
                      <option value="ml">ml (Milliliter)</option>
                      <option value="Portion">Portion</option>
                      <option value="Stück">Stück</option>
                    </Select>
                  </FormControl>
                </SimpleGrid>
                
                <FormControl>
                  <FormLabel>{t('meals.customFood.category', 'Kategorie')}</FormLabel>
                  <Select
                    value={newCustomFood.category}
                    onChange={(e) => handleCustomFoodChange('category', e.target.value)}
                  >
                    <option value="Benutzerdefiniert">Benutzerdefiniert</option>
                    <option value="Getreideprodukte">Getreideprodukte</option>
                    <option value="Milchprodukte">Milchprodukte</option>
                    <option value="Fleisch">Fleisch</option>
                    <option value="Fisch">Fisch</option>
                    <option value="Gemüse">Gemüse</option>
                    <option value="Obst">Obst</option>
                    <option value="Hülsenfrüchte">Hülsenfrüchte</option>
                    <option value="Fette und Öle">Fette und Öle</option>
                    <option value="Süßigkeiten">Süßigkeiten</option>
                    <option value="Getränke">Getränke</option>
                    <option value="Fertiggerichte">Fertiggerichte</option>
                  </Select>
                </FormControl>
              </VStack>
            </ModalBody>
            
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onCustomFoodModalClose}>
                {t('common.cancel', 'Abbrechen')}
              </Button>
              <Button 
                colorScheme="blue" 
                onClick={handleAddCustomFood}
                leftIcon={<FiPlus />}
              >
                {t('common.create', 'Erstellen')}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    );
  };

  return (
    <Box>
      {renderMeals()}
    </Box>
  );
};

export default FoodTrackingView; 