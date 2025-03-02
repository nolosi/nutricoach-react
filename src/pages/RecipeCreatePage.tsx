import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  VStack,
  Select,
  Text,
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  IconButton,
  Tag,
  TagLabel,
  TagCloseButton,
  useToast,
  FormHelperText,
  Divider,
  useColorModeValue,
  Icon,
} from '@chakra-ui/react';
import { FiPlus, FiTrash2, FiArrowLeft } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import RecipeService, { Recipe } from '../services/RecipeService';

const RecipeCreatePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useToast();
  
  // Colors
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  // Recipe state
  const [recipe, setRecipe] = useState<Omit<Recipe, 'id'>>({
    title: '',
    image: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGZvb2R8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60', // Default placeholder image
    difficulty: 'medium',
    prepTime: 30,
    servings: 2,
    categories: [],
    ingredients: [''],
    instructions: [''],
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  });
  
  // Form states
  const [newCategory, setNewCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  // Available categories
  const availableCategories = [
    'breakfast', 'lunch', 'dinner', 'snack', 
    'vegetarian', 'vegan', 'high-protein', 'low-carb', 
    'quick', 'meal-prep', 'dessert', 'smoothie', 'salad'
  ];
  
  // Handle text input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setRecipe({
      ...recipe,
      [name]: value
    });
  };
  
  // Handle number input changes
  const handleNumberChange = (name: string, value: number) => {
    setRecipe({
      ...recipe,
      [name]: value
    });
  };
  
  // Handle adding a category
  const handleAddCategory = () => {
    if (newCategory && !recipe.categories.includes(newCategory)) {
      setRecipe({
        ...recipe,
        categories: [...recipe.categories, newCategory]
      });
      setNewCategory('');
    }
  };
  
  // Handle removing a category
  const handleRemoveCategory = (category: string) => {
    setRecipe({
      ...recipe,
      categories: recipe.categories.filter(c => c !== category)
    });
  };
  
  // Handle adding an ingredient
  const handleAddIngredient = () => {
    setRecipe({
      ...recipe,
      ingredients: [...recipe.ingredients, '']
    });
  };
  
  // Handle updating an ingredient
  const handleIngredientChange = (index: number, value: string) => {
    const updatedIngredients = [...recipe.ingredients];
    updatedIngredients[index] = value;
    setRecipe({
      ...recipe,
      ingredients: updatedIngredients
    });
  };
  
  // Handle removing an ingredient
  const handleRemoveIngredient = (index: number) => {
    if (recipe.ingredients.length > 1) {
      const updatedIngredients = [...recipe.ingredients];
      updatedIngredients.splice(index, 1);
      setRecipe({
        ...recipe,
        ingredients: updatedIngredients
      });
    }
  };
  
  // Handle adding an instruction
  const handleAddInstruction = () => {
    setRecipe({
      ...recipe,
      instructions: [...recipe.instructions, '']
    });
  };
  
  // Handle updating an instruction
  const handleInstructionChange = (index: number, value: string) => {
    const updatedInstructions = [...recipe.instructions];
    updatedInstructions[index] = value;
    setRecipe({
      ...recipe,
      instructions: updatedInstructions
    });
  };
  
  // Handle removing an instruction
  const handleRemoveInstruction = (index: number) => {
    if (recipe.instructions.length > 1) {
      const updatedInstructions = [...recipe.instructions];
      updatedInstructions.splice(index, 1);
      setRecipe({
        ...recipe,
        instructions: updatedInstructions
      });
    }
  };
  
  // Validate form
  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};
    
    if (!recipe.title.trim()) {
      newErrors.title = t('recipes.errors.titleRequired', 'Titel ist erforderlich');
    }
    
    if (recipe.categories.length === 0) {
      newErrors.categories = t('recipes.errors.categoriesRequired', 'Mindestens eine Kategorie ist erforderlich');
    }
    
    if (recipe.ingredients.some(ing => !ing.trim())) {
      newErrors.ingredients = t('recipes.errors.ingredientsRequired', 'Alle Zutaten müssen ausgefüllt sein');
    }
    
    if (recipe.instructions.some(inst => !inst.trim())) {
      newErrors.instructions = t('recipes.errors.instructionsRequired', 'Alle Zubereitungsschritte müssen ausgefüllt sein');
    }
    
    if (recipe.calories <= 0) {
      newErrors.calories = t('recipes.errors.caloriesRequired', 'Kalorien müssen größer als 0 sein');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) {
      toast({
        title: t('common.error'),
        description: t('recipes.errors.formErrors'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const createdRecipe = await RecipeService.createRecipe(recipe);
      
      toast({
        title: t('common.success'),
        description: t('recipes.created', 'Rezept erfolgreich erstellt'),
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      // Zurück zur Rezeptdetailseite des neu erstellten Rezepts
      navigate(`/recipes/${createdRecipe.id}`);
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('recipes.errors.createFailed', 'Fehler beim Erstellen des Rezepts'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Container maxW="container.lg" py={8}>
      {/* Zurück-Button */}
      <Button
        leftIcon={<FiArrowLeft />}
        variant="ghost"
        mb={6}
        onClick={() => navigate('/recipes')}
      >
        {t('common.back', 'Zurück')}
      </Button>
      
      <Heading as="h1" size="xl" mb={6}>
        {t('recipes.create.title', 'Neues Rezept erstellen')}
      </Heading>
      
      <Box bg={bgColor} p={6} borderRadius="md" boxShadow="md" mb={8}>
        <VStack spacing={6} align="start">
          {/* Rezeptname */}
          <FormControl isRequired isInvalid={!!errors.title}>
            <FormLabel>{t('recipes.create.name', 'Rezeptname')}</FormLabel>
            <Input 
              name="title"
              value={recipe.title}
              onChange={handleInputChange}
              placeholder={t('recipes.create.namePlaceholder', 'z.B. Leckere Gemüsepfanne') as string}
            />
            {errors.title && <FormHelperText color="red.500">{errors.title}</FormHelperText>}
          </FormControl>
          
          {/* Bild-URL */}
          <FormControl>
            <FormLabel>{t('recipes.create.imageUrl', 'Bild-URL')}</FormLabel>
            <Input 
              name="image"
              value={recipe.image}
              onChange={handleInputChange}
              placeholder={t('recipes.create.imageUrlPlaceholder', 'https://example.com/image.jpg') as string}
            />
            <FormHelperText>
              {t('recipes.create.imageUrlHelper', 'URL zu einem Bild deines Rezepts. Leer lassen für ein Standardbild.')}
            </FormHelperText>
          </FormControl>
          
          {/* Schwierigkeitsgrad */}
          <FormControl>
            <FormLabel>{t('recipes.create.difficulty', 'Schwierigkeitsgrad')}</FormLabel>
            <Select 
              name="difficulty"
              value={recipe.difficulty}
              onChange={handleInputChange}
            >
              <option value="easy">{t('recipes.difficulty.easy', 'Einfach')}</option>
              <option value="medium">{t('recipes.difficulty.medium', 'Mittel')}</option>
              <option value="hard">{t('recipes.difficulty.hard', 'Schwer')}</option>
            </Select>
          </FormControl>
          
          {/* Zubereitungszeit und Portionen */}
          <Flex width="100%" gap={4} direction={{ base: 'column', md: 'row' }}>
            <FormControl>
              <FormLabel>{t('recipes.create.prepTime', 'Zubereitungszeit (Minuten)')}</FormLabel>
              <NumberInput 
                min={5} 
                max={240} 
                value={recipe.prepTime}
                onChange={(_, value) => handleNumberChange('prepTime', value)}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
            
            <FormControl>
              <FormLabel>{t('recipes.create.servings', 'Portionen')}</FormLabel>
              <NumberInput 
                min={1} 
                max={12} 
                value={recipe.servings}
                onChange={(_, value) => handleNumberChange('servings', value)}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
          </Flex>
          
          {/* Kategorien */}
          <FormControl isRequired isInvalid={!!errors.categories}>
            <FormLabel>{t('recipes.create.categories', 'Kategorien')}</FormLabel>
            <Flex flexWrap="wrap" gap={2} mb={2}>
              {recipe.categories.map((category, index) => (
                <Tag key={index} size="md" borderRadius="full" colorScheme="teal">
                  <TagLabel>{t(`recipes.categories.${category}`, category)}</TagLabel>
                  <TagCloseButton onClick={() => handleRemoveCategory(category)} />
                </Tag>
              ))}
            </Flex>
            <Flex mb={2}>
              <Select 
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder={t('recipes.create.selectCategory', 'Kategorie auswählen') as string}
                mr={2}
              >
                {availableCategories.map(category => (
                  <option key={category} value={category}>
                    {t(`recipes.categories.${category}`, category)}
                  </option>
                ))}
              </Select>
              <Button 
                leftIcon={<FiPlus />} 
                colorScheme="teal" 
                onClick={handleAddCategory}
                isDisabled={!newCategory}
              >
                {t('common.add', 'Hinzufügen')}
              </Button>
            </Flex>
            {errors.categories && <FormHelperText color="red.500">{errors.categories}</FormHelperText>}
          </FormControl>
          
          <Divider />
          
          {/* Zutaten */}
          <FormControl isRequired isInvalid={!!errors.ingredients}>
            <FormLabel>{t('recipes.create.ingredients', 'Zutaten')}</FormLabel>
            <VStack spacing={2} align="stretch" width="100%">
              {recipe.ingredients.map((ingredient, index) => (
                <Flex key={index} gap={2}>
                  <Input 
                    value={ingredient}
                    onChange={(e) => handleIngredientChange(index, e.target.value)}
                    placeholder={t('recipes.create.ingredientPlaceholder', 'z.B. 200g Mehl') as string}
                  />
                  <IconButton
                    aria-label={t('common.remove', 'Entfernen') as string}
                    icon={<FiTrash2 />}
                    onClick={() => handleRemoveIngredient(index)}
                    isDisabled={recipe.ingredients.length <= 1}
                    colorScheme="red"
                    variant="ghost"
                  />
                </Flex>
              ))}
              <Button 
                leftIcon={<FiPlus />} 
                onClick={handleAddIngredient}
                variant="outline"
                alignSelf="flex-start"
              >
                {t('recipes.create.addIngredient', 'Zutat hinzufügen')}
              </Button>
            </VStack>
            {errors.ingredients && <FormHelperText color="red.500">{errors.ingredients}</FormHelperText>}
          </FormControl>
          
          <Divider />
          
          {/* Zubereitungsschritte */}
          <FormControl isRequired isInvalid={!!errors.instructions}>
            <FormLabel>{t('recipes.create.instructions', 'Zubereitungsschritte')}</FormLabel>
            <VStack spacing={3} align="stretch" width="100%">
              {recipe.instructions.map((instruction, index) => (
                <Flex key={index} gap={2}>
                  <Box minWidth="30px" textAlign="center">
                    <Text fontWeight="bold">{index + 1}.</Text>
                  </Box>
                  <Textarea 
                    value={instruction}
                    onChange={(e) => handleInstructionChange(index, e.target.value)}
                    placeholder={t('recipes.create.instructionPlaceholder', 'Beschreibe diesen Zubereitungsschritt...') as string}
                  />
                  <IconButton
                    aria-label={t('common.remove', 'Entfernen') as string}
                    icon={<FiTrash2 />}
                    onClick={() => handleRemoveInstruction(index)}
                    isDisabled={recipe.instructions.length <= 1}
                    colorScheme="red"
                    variant="ghost"
                  />
                </Flex>
              ))}
              <Button 
                leftIcon={<FiPlus />} 
                onClick={handleAddInstruction}
                variant="outline"
                alignSelf="flex-start"
              >
                {t('recipes.create.addInstruction', 'Schritt hinzufügen')}
              </Button>
            </VStack>
            {errors.instructions && <FormHelperText color="red.500">{errors.instructions}</FormHelperText>}
          </FormControl>
          
          <Divider />
          
          {/* Nährwertinformationen */}
          <Box width="100%">
            <Heading size="md" mb={4}>
              {t('recipes.create.nutritionInfo', 'Nährwertinformationen (pro Portion)')}
            </Heading>
            
            <Flex direction={{ base: 'column', md: 'row' }} gap={4} wrap="wrap">
              <FormControl isRequired isInvalid={!!errors.calories} flex="1">
                <FormLabel>{t('recipes.create.calories', 'Kalorien')}</FormLabel>
                <NumberInput 
                  min={0} 
                  value={recipe.calories}
                  onChange={(_, value) => handleNumberChange('calories', value)}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                {errors.calories && <FormHelperText color="red.500">{errors.calories}</FormHelperText>}
              </FormControl>
              
              <FormControl flex="1">
                <FormLabel>{t('recipes.create.protein', 'Protein (g)')}</FormLabel>
                <NumberInput 
                  min={0} 
                  value={recipe.protein}
                  onChange={(_, value) => handleNumberChange('protein', value)}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
              
              <FormControl flex="1">
                <FormLabel>{t('recipes.create.carbs', 'Kohlenhydrate (g)')}</FormLabel>
                <NumberInput 
                  min={0} 
                  value={recipe.carbs}
                  onChange={(_, value) => handleNumberChange('carbs', value)}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
              
              <FormControl flex="1">
                <FormLabel>{t('recipes.create.fat', 'Fett (g)')}</FormLabel>
                <NumberInput 
                  min={0} 
                  value={recipe.fat}
                  onChange={(_, value) => handleNumberChange('fat', value)}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
            </Flex>
          </Box>
        </VStack>
      </Box>
      
      {/* Submit Button */}
      <Flex justify="flex-end">
        <Button
          colorScheme="teal"
          size="lg"
          onClick={handleSubmit}
          isLoading={isSubmitting}
          loadingText={t('common.saving', 'Speichern...') as string}
        >
          {t('recipes.create.submit', 'Rezept erstellen')}
        </Button>
      </Flex>
    </Container>
  );
};

export default RecipeCreatePage; 