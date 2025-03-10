import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Image,
  Badge,
  Flex,
  Button,
  IconButton,
  useColorModeValue,
  Skeleton,
  useToast,
  useBreakpointValue,
  Icon,
  Center,
} from '@chakra-ui/react';
import { FiCalendar, FiTrash2, FiChevronLeft, FiChevronRight, FiPlus } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import RecipeService, { Recipe, MealPlanResult } from '../../services/RecipeService';

interface MealPlanViewProps {
  initialDate?: string;
}

const MealPlanView: React.FC<MealPlanViewProps> = ({ initialDate }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useToast();
  
  // Responsive Größen
  const buttonSize = useBreakpointValue({ base: 'sm', md: 'md' });
  const headingSize = useBreakpointValue({ base: 'sm', md: 'md' });
  const cardPadding = useBreakpointValue({ base: 4, md: 5 });
  const spacing = useBreakpointValue({ base: 4, md: 6 });
  const fontSize = useBreakpointValue({ base: 'sm', md: 'md' });
  
  // Farben
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const emptyCardBg = useColorModeValue('gray.50', 'gray.700');
  const headerBg = useColorModeValue('gray.50', 'gray.600');
  const dateSelectorBg = useColorModeValue('gray.50', 'gray.700');
  
  // State
  const [selectedDate, setSelectedDate] = useState<string>(
    initialDate || new Date().toISOString().split('T')[0]
  );
  const [mealPlan, setMealPlan] = useState<MealPlanResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Laden des Essensplans für das ausgewählte Datum
  useEffect(() => {
    const fetchMealPlan = async () => {
      setIsLoading(true);
      try {
        const data = await RecipeService.getMealPlanForDate(selectedDate);
        setMealPlan(data);
      } catch (error) {
        console.error('Fehler beim Laden des Essensplans:', error);
        toast({
          title: t('errors.general'),
          description: t('errors.tryAgain'),
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMealPlan();
  }, [selectedDate, toast, t]);
  
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
  
  // Funktion zum Entfernen eines Rezepts aus dem Essensplan
  const handleRemoveFromMealPlan = (mealType: string) => {
    RecipeService.removeFromMealPlan(selectedDate, mealType);
    
    // Aktualisieren der Anzeige
    setMealPlan(prevMealPlan => 
      prevMealPlan.filter(meal => meal.mealType !== mealType)
    );
    
    toast({
      title: t('common.success'),
      description: t('meals.removedFromMealPlan'),
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
  };
  
  // Funktion zum Navigieren zur Rezeptdetailseite
  const handleViewRecipe = (recipeId: string) => {
    navigate(`/recipes/${recipeId}`);
  };
  
  // Funktion zum Navigieren zur Rezeptübersicht
  const handleAddRecipe = (mealType: string) => {
    navigate(`/recipes?mealType=${mealType}&date=${selectedDate}`);
  };
  
  // Mahlzeitentypen
  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snacks'];
  
  return (
    <Box maxW="100%" mx="auto">
      {/* Datumsauswahl */}
      <Flex 
        justifyContent="space-between" 
        alignItems="center" 
        mb={spacing}
        bg={dateSelectorBg}
        p={3}
        borderRadius="md"
      >
        <IconButton
          aria-label={t('common.previousDay')}
          icon={<FiChevronLeft />}
          onClick={() => changeDate(-1)}
          size={buttonSize}
          variant="ghost"
        />
        
        <Flex alignItems="center">
          <Icon as={FiCalendar} mr={2} color="teal.500" />
          <Text fontSize={fontSize} fontWeight="medium">
            {formatDate(selectedDate)}
          </Text>
        </Flex>
        
        <IconButton
          aria-label={t('common.nextDay')}
          icon={<FiChevronRight />}
          onClick={() => changeDate(1)}
          size={buttonSize}
          variant="ghost"
        />
      </Flex>
      
      {/* Essensplan */}
      {isLoading ? (
        <VStack spacing={spacing} align="stretch">
          <Skeleton height="200px" />
          <Skeleton height="200px" />
          <Skeleton height="200px" />
        </VStack>
      ) : (
        <VStack spacing={spacing} align="stretch" width="100%">
          {mealTypes.map(mealType => {
            const meal = mealPlan.find(m => m.mealType === mealType);
            
            return (
              <Box
                key={mealType}
                borderWidth="1px"
                borderRadius="lg"
                overflow="hidden"
                borderColor={borderColor}
                bg={cardBg}
                boxShadow="sm"
                width="100%"
                position="relative"
              >
                {/* Kopfzeile mit Titel und Löschen-Button */}
                <Flex 
                  justifyContent="space-between" 
                  alignItems="center" 
                  p={3}
                  borderBottomWidth="1px"
                  borderColor={borderColor}
                  bg={headerBg}
                >
                  <Heading size={headingSize}>{t(`meals.${mealType}`)}</Heading>
                  {meal && (
                    <IconButton
                      aria-label={t('common.remove')}
                      icon={<FiTrash2 />}
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemoveFromMealPlan(mealType)}
                    />
                  )}
                </Flex>
                
                {/* Mahlzeiteninhalt */}
                {meal ? (
                  <Flex direction={{ base: "column", md: "row" }} width="100%">
                    {meal.recipe.image && (
                      <Box height={{ base: "160px", md: "200px" }} width={{ base: "100%", md: "250px" }} flexShrink={0}>
                        <Image
                          src={meal.recipe.image}
                          alt={meal.recipe.title}
                          objectFit="cover"
                          width="100%"
                          height="100%"
                        />
                      </Box>
                    )}
                    
                    <Box p={4} flex="1">
                      <Heading size="md" mb={2}>
                        {meal.recipe.title}
                      </Heading>
                      
                      <HStack spacing={2} mb={3}>
                        <Badge colorScheme="green">{meal.recipe.prepTime} {t('common.min')}</Badge>
                        <Badge colorScheme="purple">{t(`recipes.difficulty.${meal.recipe.difficulty}`)}</Badge>
                      </HStack>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        colorScheme="teal"
                        width={{ base: "100%", md: "auto" }}
                        onClick={() => handleViewRecipe(meal.recipe.id)}
                      >
                        {t('common.view')}
                      </Button>
                    </Box>
                  </Flex>
                ) : (
                  <Box p={0} height="120px">
                    <Flex 
                      direction="column" 
                      justify="center" 
                      align="center" 
                      height="100%" 
                      p={4}
                    >
                      <Text color="gray.500" mb={4} textAlign="center">
                        {t('meals.noMealPlanned')}
                      </Text>
                      <Button
                        size="sm"
                        colorScheme="teal"
                        leftIcon={<FiPlus />}
                        onClick={() => handleAddRecipe(mealType)}
                      >
                        {t('meals.addMeal')}
                      </Button>
                    </Flex>
                  </Box>
                )}
              </Box>
            );
          })}
        </VStack>
      )}
    </Box>
  );
};

export default MealPlanView; 