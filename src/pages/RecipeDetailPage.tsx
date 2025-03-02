import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Image,
  List,
  ListItem,
  ListIcon,
  Text,
  VStack,
  HStack,
  Badge,
  Divider,
  Icon,
  useColorModeValue,
  Tag,
  TagLabel,
  SimpleGrid,
  Skeleton,
  IconButton,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Select,
  useDisclosure,
  Input,
} from '@chakra-ui/react';
import { FiClock, FiUsers, FiArrowLeft, FiBookmark, FiShare2, FiCalendar } from 'react-icons/fi';
import { MdCheckCircle } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import RecipeService, { Recipe } from '../services/RecipeService';

const RecipeDetailPage: React.FC = () => {
  const { recipeId } = useParams<{ recipeId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedMealType, setSelectedMealType] = useState<string>('breakfast');
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  // Übersetzungen für Schwierigkeitsgrade
  const difficultyMap = {
    easy: t('recipes.difficulty.easy'),
    medium: t('recipes.difficulty.medium'),
    hard: t('recipes.difficulty.hard')
  };
  
  // Farbzuordnung für Schwierigkeitsgrade
  const difficultyColorMap = {
    easy: 'green',
    medium: 'orange',
    hard: 'red'
  };
  
  // Laden des Rezepts und Prüfen, ob es gespeichert ist
  useEffect(() => {
    const fetchRecipe = async () => {
      if (!recipeId) return;
      
      try {
        setIsLoading(true);
        const data = await RecipeService.getRecipeById(recipeId);
        setRecipe(data);
        
        // Prüfen, ob das Rezept gespeichert ist
        const saved = RecipeService.isRecipeSaved(recipeId);
        setIsSaved(saved);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Fehler beim Laden des Rezepts:', error);
        setIsLoading(false);
      }
    };
    
    fetchRecipe();
  }, [recipeId]);
  
  // Funktion zum Hinzufügen des Rezepts zum Essensplan
  const handleAddToMealPlan = () => {
    onOpen();
  };
  
  // Funktion zum Speichern des Rezepts zum Essensplan
  const handleSaveMealPlan = () => {
    if (!recipeId) return;
    
    RecipeService.addToMealPlan(recipeId, selectedDate, selectedMealType);
    
    toast({
      title: t('common.success'),
      description: `${recipe?.title} ${t('recipes.addedToMealPlan')}`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    
    onClose();
  };
  
  // Funktion zum Speichern des Rezepts (Favoriten)
  const handleSaveRecipe = () => {
    if (!recipeId) return;
    
    const newSavedState = RecipeService.toggleSaveRecipe(recipeId);
    setIsSaved(newSavedState);
    
    toast({
      title: newSavedState ? t('recipes.addedToSaved') : t('recipes.removedFromSaved'),
      status: newSavedState ? 'success' : 'info',
      duration: 2000,
      isClosable: true,
    });
  };
  
  // Funktion zum Teilen des Rezepts (simuliert)
  const handleShareRecipe = () => {
    // In einer echten App würde hier die Share-API verwendet werden
    navigator.clipboard.writeText(window.location.href).then(() => {
      toast({
        title: t('recipes.shared'),
        description: t('recipes.shareLinkCopied'),
        status: 'info',
        duration: 2000,
        isClosable: true,
      });
    });
  };
  
  if (isLoading) {
    return (
      <Container maxW="container.lg" py={8}>
        <Button
          leftIcon={<FiArrowLeft />}
          variant="ghost"
          mb={6}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            navigate('/recipes');
          }}
        >
          {t('common.back')}
        </Button>
        
        <Skeleton height="300px" mb={6} />
        <Skeleton height="40px" mb={4} />
        <Skeleton height="20px" mb={2} />
        <Skeleton height="20px" mb={6} />
        
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
          <Box>
            <Skeleton height="30px" mb={4} />
            <Skeleton height="20px" mb={2} />
            <Skeleton height="20px" mb={2} />
            <Skeleton height="20px" mb={2} />
            <Skeleton height="20px" mb={2} />
          </Box>
          <Box>
            <Skeleton height="30px" mb={4} />
            <Skeleton height="20px" mb={2} />
            <Skeleton height="20px" mb={2} />
            <Skeleton height="20px" mb={2} />
            <Skeleton height="20px" mb={2} />
          </Box>
        </SimpleGrid>
      </Container>
    );
  }
  
  // 404-Anzeige, wenn das Rezept nicht gefunden wurde
  if (!recipe) {
    return (
      <Container maxW="container.lg" py={8}>
        <Button
          leftIcon={<FiArrowLeft />}
          variant="ghost"
          mb={6}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            navigate('/recipes');
          }}
        >
          {t('common.back')}
        </Button>
        
        <VStack spacing={4} align="center" justify="center" minH="50vh">
          <Heading>{t('errors.notFound')}</Heading>
          <Text>{t('recipes.recipeNotFound')}</Text>
          <Button 
            colorScheme="teal" 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              navigate('/recipes');
            }}
          >
            {t('recipes.browseAllRecipes')}
          </Button>
        </VStack>
      </Container>
    );
  }
  
  return (
    <Container maxW="container.lg" py={8}>
      {/* Zurück-Button und Aktionen */}
      <Flex 
        justify="space-between" 
        align="center" 
        mb={6}
        wrap={{ base: 'wrap', md: 'nowrap' }}
        gap={4}
      >
        <Button
          leftIcon={<FiArrowLeft />}
          variant="ghost"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            navigate('/recipes');
          }}
        >
          {t('common.back')}
        </Button>
        
        <HStack spacing={2}>
          <IconButton
            aria-label={isSaved ? t('recipes.removeSaved') : t('recipes.addSaved')}
            icon={<FiBookmark />}
            colorScheme={isSaved ? 'teal' : 'gray'}
            onClick={handleSaveRecipe}
          />
          <IconButton
            aria-label={t('recipes.share')}
            icon={<FiShare2 />}
            onClick={handleShareRecipe}
          />
        </HStack>
      </Flex>
      
      {/* Rezeptbild */}
      <Box
        borderRadius="lg"
        overflow="hidden"
        mb={6}
        maxH="400px"
      >
        <Image
          src={recipe.image}
          alt={recipe.title}
          objectFit="cover"
          w="100%"
          h="100%"
        />
      </Box>
      
      {/* Rezepttitel und Details */}
      <VStack align="start" spacing={4} mb={8}>
        <Heading size="xl">{recipe.title}</Heading>
        
        <HStack spacing={4} wrap="wrap">
          <Flex align="center">
            <Icon as={FiClock} mr={2} />
            <Text>{recipe.prepTime} {t('common.min')}</Text>
          </Flex>
          
          <Flex align="center">
            <Icon as={FiUsers} mr={2} />
            <Text>{recipe.servings} {t('recipes.servings')}</Text>
          </Flex>
          
          <Badge colorScheme={difficultyColorMap[recipe.difficulty]} p={1}>
            {difficultyMap[recipe.difficulty]}
          </Badge>
        </HStack>
        
        <HStack spacing={2} wrap="wrap">
          {recipe.categories.map((category, idx) => (
            <Tag key={idx} size="md" colorScheme="teal" borderRadius="full" mt={1}>
              <TagLabel>{t(`recipes.categories.${category}`)}</TagLabel>
            </Tag>
          ))}
        </HStack>
      </VStack>
      
      {/* Hinzufügen zum Essensplan Button */}
      <Button
        colorScheme="teal"
        size="lg"
        mb={10}
        leftIcon={<FiCalendar />}
        onClick={handleAddToMealPlan}
      >
        {t('recipes.addToMealPlan')}
      </Button>
      
      <Divider mb={10} />
      
      {/* Zutaten und Anleitung */}
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
        <Box 
          p={5} 
          borderWidth="1px" 
          borderRadius="lg" 
          borderColor={borderColor}
          bg={bgColor}
        >
          <Heading size="md" mb={4}>{t('recipes.ingredients')}</Heading>
          <List spacing={2}>
            {recipe.ingredients.map((ingredient, idx) => (
              <ListItem key={idx} display="flex" alignItems="flex-start">
                <ListIcon as={MdCheckCircle} color="green.500" mt={1} />
                <Text>{ingredient}</Text>
              </ListItem>
            ))}
          </List>
        </Box>
        
        <Box 
          p={5} 
          borderWidth="1px" 
          borderRadius="lg" 
          borderColor={borderColor}
          bg={bgColor}
        >
          <Heading size="md" mb={4}>{t('recipes.instructions')}</Heading>
          <List spacing={3}>
            {recipe.instructions.map((step, idx) => (
              <ListItem key={idx}>
                <Flex>
                  <Box 
                    minW="24px" 
                    h="24px" 
                    borderRadius="full" 
                    bg="teal.500" 
                    color="white"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    mr={3}
                    mt={0.5}
                  >
                    {idx + 1}
                  </Box>
                  <Text>{step}</Text>
                </Flex>
              </ListItem>
            ))}
          </List>
        </Box>
      </SimpleGrid>
      
      {/* Modal für Essensplan */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t('recipes.addToMealPlan')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>{t('common.day')}</FormLabel>
                <Input 
                  type="date" 
                  value={selectedDate} 
                  onChange={(e) => setSelectedDate(e.target.value)} 
                />
              </FormControl>
              <FormControl>
                <FormLabel>{t('common.mealType')}</FormLabel>
                <Select 
                  value={selectedMealType} 
                  onChange={(e) => setSelectedMealType(e.target.value)}
                >
                  <option value="breakfast">{t('meals.breakfast')}</option>
                  <option value="lunch">{t('meals.lunch')}</option>
                  <option value="dinner">{t('meals.dinner')}</option>
                  <option value="snacks">{t('meals.snacks')}</option>
                </Select>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              {t('common.cancel')}
            </Button>
            <Button colorScheme="teal" onClick={handleSaveMealPlan}>
              {t('common.add')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default RecipeDetailPage; 