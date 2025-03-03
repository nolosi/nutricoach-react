import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
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
  Input,
} from '@chakra-ui/react';
import { FiCalendar, FiTrash2, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
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
  
  // Farben
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  
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
    <Box>
      {/* Datumsauswahl */}
      <Flex 
        justify="space-between" 
        align="center" 
        mb={6}
        borderBottom="1px"
        borderColor={borderColor}
        pb={4}
      >
        <IconButton
          aria-label={t('common.previous')}
          icon={<FiChevronLeft />}
          onClick={() => changeDate(-1)}
          variant="ghost"
        />
        
        <VStack>
          <Heading size="md">{formatDate(selectedDate)}</Heading>
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            size="sm"
            width="auto"
          />
        </VStack>
        
        <IconButton
          aria-label={t('common.next')}
          icon={<FiChevronRight />}
          onClick={() => changeDate(1)}
          variant="ghost"
        />
      </Flex>
      
      {/* Essensplan */}
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        {mealTypes.map(mealType => {
          const meal = mealPlan.find(m => m.mealType === mealType);
          
          return (
            <Box 
              key={mealType}
              borderWidth="1px"
              borderRadius="lg"
              borderColor={borderColor}
              overflow="hidden"
              bg={cardBg}
            >
              <Flex 
                bg="teal.500" 
                color="white" 
                p={3} 
                justify="space-between" 
                align="center"
              >
                <Heading size="sm">{t(`meals.${mealType}`)}</Heading>
              </Flex>
              
              {isLoading ? (
                <Box p={4}>
                  <Skeleton height="100px" />
                </Box>
              ) : meal ? (
                <Box>
                  <Flex>
                    <Image 
                      src={meal.recipe.image} 
                      alt={meal.recipe.title}
                      boxSize="100px"
                      objectFit="cover"
                    />
                    <Box p={3} flex="1">
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="bold" noOfLines={1}>{meal.recipe.title}</Text>
                        <HStack>
                          <Badge colorScheme="green">{meal.recipe.prepTime} {t('common.min')}</Badge>
                          <Badge colorScheme="purple">{t(`recipes.difficulty.${meal.recipe.difficulty}`)}</Badge>
                        </HStack>
                      </VStack>
                      <Flex justify="space-between" mt={3}>
                        <Button 
                          size="sm" 
                          onClick={() => handleViewRecipe(meal.recipe.id)}
                          colorScheme="teal"
                          variant="outline"
                        >
                          {t('common.view')}
                        </Button>
                        <IconButton
                          aria-label={t('common.remove')}
                          icon={<FiTrash2 />}
                          size="sm"
                          colorScheme="red"
                          variant="ghost"
                          onClick={() => handleRemoveFromMealPlan(mealType)}
                        />
                      </Flex>
                    </Box>
                  </Flex>
                </Box>
              ) : (
                <Box p={6} textAlign="center">
                  <Text color="gray.500">{t('meals.noMealPlanned')}</Text>
                  <Button
                    mt={3}
                    size="sm"
                    leftIcon={<FiCalendar />}
                    onClick={() => handleAddRecipe(mealType)}
                    colorScheme="teal"
                  >
                    {t('meals.addMeal')}
                  </Button>
                </Box>
              )}
            </Box>
          );
        })}
      </SimpleGrid>
    </Box>
  );
};

export default MealPlanView; 