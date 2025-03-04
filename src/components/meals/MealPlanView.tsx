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
  useBreakpointValue,
  Icon,
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
  
  // Responsive Größen
  const buttonSize = useBreakpointValue({ base: 'xs', md: 'sm' });
  const headingSize = useBreakpointValue({ base: 'sm', md: 'md' });
  const cardPadding = useBreakpointValue({ base: 3, md: 4 });
  const spacing = useBreakpointValue({ base: 2, md: 4 });
  const fontSize = useBreakpointValue({ base: 'xs', md: 'sm' });
  const gridColumns = useBreakpointValue({ base: 1, md: 2, lg: 3 });
  
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
      <Flex justifyContent="space-between" alignItems="center" mb={spacing}>
        <IconButton
          aria-label={t('common.previousDay', 'Vorheriger Tag')}
          icon={<FiChevronLeft />}
          onClick={() => changeDate(-1)}
          size={buttonSize}
        />
        
        <Flex alignItems="center">
          <Icon as={FiCalendar} mr={2} />
          <Text fontSize={fontSize} fontWeight="medium">
            {formatDate(selectedDate)}
          </Text>
        </Flex>
        
        <IconButton
          aria-label={t('common.nextDay', 'Nächster Tag')}
          icon={<FiChevronRight />}
          onClick={() => changeDate(1)}
          size={buttonSize}
        />
      </Flex>
      
      {/* Essensplan */}
      {isLoading ? (
        <VStack spacing={spacing} align="stretch">
          <Skeleton height="100px" />
          <Skeleton height="100px" />
          <Skeleton height="100px" />
        </VStack>
      ) : mealPlan.length > 0 ? (
        <SimpleGrid columns={gridColumns} spacing={spacing}>
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
              >
                <Box p={cardPadding}>
                  <Flex justifyContent="space-between" alignItems="center" mb={2}>
                    <Heading size={headingSize}>{t(`meals.${mealType}`, mealType)}</Heading>
                    <IconButton
                      aria-label={t('common.remove', 'Entfernen')}
                      icon={<FiTrash2 />}
                      size={buttonSize}
                      variant="ghost"
                      onClick={() => handleRemoveFromMealPlan(mealType)}
                    />
                  </Flex>
                  
                  {meal ? (
                    <VStack align="stretch" spacing={2}>
                      {meal.recipe.image && (
                        <Image
                          src={meal.recipe.image}
                          alt={meal.recipe.title}
                          borderRadius="md"
                          objectFit="cover"
                          height="120px"
                        />
                      )}
                      
                      <Heading size="sm" mt={2}>
                        {meal.recipe.title}
                      </Heading>
                      
                      <HStack spacing={2} mt={1}>
                        <Badge colorScheme="green">{meal.recipe.prepTime} {t('common.min')}</Badge>
                        <Badge colorScheme="purple">{t(`recipes.difficulty.${meal.recipe.difficulty}`)}</Badge>
                      </HStack>
                      
                      <Button
                        size={buttonSize}
                        variant="outline"
                        colorScheme="teal"
                        mt={2}
                        onClick={() => handleViewRecipe(meal.recipe.id)}
                      >
                        {t('common.view')}
                      </Button>
                    </VStack>
                  ) : (
                    <Box p={6} textAlign="center">
                      <Text color="gray.500">{t('meals.noMealPlanned')}</Text>
                      <Button
                        mt={3}
                        size={buttonSize}
                        leftIcon={<FiCalendar />}
                        onClick={() => handleAddRecipe(mealType)}
                        colorScheme="teal"
                      >
                        {t('meals.addMeal')}
                      </Button>
                    </Box>
                  )}
                </Box>
              </Box>
            );
          })}
        </SimpleGrid>
      ) : (
        <Box textAlign="center" p={cardPadding} borderWidth="1px" borderRadius="lg" borderColor={borderColor}>
          <Text fontSize={fontSize}>{t('meals.noMealPlan', 'Kein Essensplan für diesen Tag')}</Text>
          <Button
            mt={spacing}
            colorScheme="teal"
            size={buttonSize}
            onClick={() => navigate('/recipes')}
          >
            {t('meals.browseRecipes', 'Rezepte durchsuchen')}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default MealPlanView; 