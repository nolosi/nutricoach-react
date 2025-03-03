import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Grid,
  Text,
  Image,
  Flex,
  Badge,
  SimpleGrid,
  Select,
  useColorModeValue,
  Container,
  VStack,
  HStack,
  Tag,
  TagLabel,
  Icon,
  Skeleton,
  Button,
  Tooltip,
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
  Textarea,
} from '@chakra-ui/react';
import { FiSearch, FiClock, FiUsers, FiPlus, FiUpload, FiDownload, FiRefreshCw, FiInfo } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import RecipeService, { Recipe } from '../services/RecipeService';

// Komponente für einzelne Rezeptkarte
const RecipeCard: React.FC<{ recipe: Recipe }> = ({ recipe }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const cardBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.700', 'white');
  
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

  // Funktion zum Navigieren zur Detailseite
  const handleClick = () => {
    navigate(`/recipes/${recipe.id}`);
  };

  return (
    <Box 
      borderRadius="lg" 
      overflow="hidden" 
      bg={cardBg}
      boxShadow="md"
      transition="transform 0.3s, box-shadow 0.3s"
      _hover={{ transform: 'translateY(-5px)', boxShadow: 'lg', cursor: 'pointer' }}
      onClick={handleClick}
    >
      <Box position="relative" height="200px">
        <Image 
          src={recipe.image} 
          alt={recipe.title} 
          objectFit="cover" 
          width="100%" 
          height="100%" 
        />
      </Box>
      
      <Box p={4}>
        <Heading size="md" mb={2} color={textColor}>{recipe.title}</Heading>
        
        <HStack spacing={2} mb={3} wrap="wrap">
          {recipe.categories.slice(0, 3).map((category, idx) => (
            <Tag key={idx} size="sm" colorScheme="teal" borderRadius="full" mt={1}>
              <TagLabel>{t(`recipes.categories.${category}`)}</TagLabel>
            </Tag>
          ))}
        </HStack>
        
        <Flex justifyContent="space-between" alignItems="center" mb={2}>
          <Flex alignItems="center">
            <Icon as={FiClock} mr={1} />
            <Text fontSize="sm">{recipe.prepTime} min</Text>
          </Flex>
          
          <Flex alignItems="center">
            <Icon as={FiUsers} mr={1} />
            <Text fontSize="sm">{recipe.servings}</Text>
          </Flex>
          
          <Badge colorScheme={difficultyColorMap[recipe.difficulty]}>
            {difficultyMap[recipe.difficulty]}
          </Badge>
        </Flex>
      </Box>
    </Box>
  );
};

const RecipesPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isJsonUploadOpen, setIsJsonUploadOpen] = useState(false);
  const [jsonContent, setJsonContent] = useState('');
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  
  // Lade alle Rezepte beim ersten Rendern
  useEffect(() => {
    loadRecipes();
  }, []);
  
  // Lade Rezepte
  const loadRecipes = async () => {
    try {
      setIsLoading(true);
      const data = await RecipeService.getAllRecipes();
      setRecipes(data);
      
      // Extrahiere alle einzigartigen Kategorien
      const uniqueCategories = Array.from(
        new Set(data.flatMap(recipe => recipe.categories))
      ).sort();
      setCategories(uniqueCategories);
      
      setIsLoading(false);
    } catch (error) {
      console.error('Fehler beim Laden der Rezepte:', error);
      setIsLoading(false);
    }
  };
  
  // Export-Funktion
  const handleExportRecipes = () => {
    try {
      // Hole nur die benutzerdefinierten Rezepte
      const userRecipesString = localStorage.getItem('nutricoach_user_recipes');
      const userRecipes: Recipe[] = userRecipesString ? JSON.parse(userRecipesString) : [];
      
      if (userRecipes.length === 0) {
        toast({
          title: t('recipes.noUserRecipesToExport', 'Keine benutzerdefinierten Rezepte zum Exportieren'),
          status: 'info',
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      
      // Erstelle eine Datei zum Herunterladen
      const dataStr = JSON.stringify(userRecipes, null, 2);
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
      
      const exportFileName = `nutricoach_recipes_${new Date().toISOString().slice(0, 10)}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileName);
      linkElement.click();
      
      toast({
        title: t('recipes.exportSuccess', 'Rezepte erfolgreich exportiert'),
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Fehler beim Exportieren der Rezepte:', error);
      toast({
        title: t('recipes.exportError', 'Fehler beim Exportieren'),
        description: String(error),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
  // Import-Dialog öffnen
  const openFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Datei lesen, wenn ausgewählt
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setJsonContent(content);
      setIsJsonUploadOpen(true);
    };
    reader.readAsText(file);
    
    // Reset file input
    if (event.target) {
      event.target.value = '';
    }
  };
  
  // Import durchführen
  const handleImportRecipes = () => {
    try {
      const recipesToImport: Recipe[] = JSON.parse(jsonContent);
      
      if (!Array.isArray(recipesToImport)) {
        throw new Error(t('recipes.invalidFormat', 'Ungültiges Format. Eine Array von Rezepten wird erwartet') || 'Ungültiges Format. Eine Array von Rezepten wird erwartet');
      }
      
      // Validiere jedes Rezept
      recipesToImport.forEach(recipe => {
        if (!recipe.title || !recipe.id || !recipe.ingredients || !recipe.instructions) {
          throw new Error(t('recipes.invalidRecipeFormat', 'Ungültiges Rezeptformat. Einige erforderliche Felder fehlen') || 'Ungültiges Rezeptformat. Einige erforderliche Felder fehlen');
        }
      });
      
      // Lade bestehende Rezepte
      const userRecipesString = localStorage.getItem('nutricoach_user_recipes');
      let existingUserRecipes: Recipe[] = userRecipesString ? JSON.parse(userRecipesString) : [];
      
      // Füge neue Rezepte hinzu und verhindere Duplikate
      const existingIds = new Set(existingUserRecipes.map(r => r.id));
      const newRecipes = recipesToImport.filter(r => !existingIds.has(r.id));
      
      // Aktualisiere local storage
      const updatedUserRecipes = [...existingUserRecipes, ...newRecipes];
      localStorage.setItem('nutricoach_user_recipes', JSON.stringify(updatedUserRecipes));
      
      // Aktualisiere UI
      loadRecipes();
      
      toast({
        title: t('recipes.importSuccess', 'Rezepte erfolgreich importiert'),
        description: t('recipes.importedCount', '{{count}} Rezepte importiert', { count: newRecipes.length }),
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      setIsJsonUploadOpen(false);
      setJsonContent('');
    } catch (error) {
      console.error('Fehler beim Importieren der Rezepte:', error);
      toast({
        title: t('recipes.importError', 'Fehler beim Importieren'),
        description: String(error),
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };
  
  // Reset-Funktion
  const handleResetRecipes = () => {
    try {
      localStorage.removeItem('nutricoach_user_recipes');
      loadRecipes();
      
      toast({
        title: t('recipes.resetSuccess', 'Benutzerdefinierte Rezepte zurückgesetzt'),
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      setResetConfirmOpen(false);
    } catch (error) {
      console.error('Fehler beim Zurücksetzen der Rezepte:', error);
      toast({
        title: t('recipes.resetError', 'Fehler beim Zurücksetzen'),
        description: String(error),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
  // Filtern der Rezepte basierend auf Suchbegriff und Kategorie
  useEffect(() => {
    let results = [...recipes];
    
    if (searchTerm) {
      results = results.filter(recipe => 
        recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (selectedCategory) {
      results = results.filter(recipe => 
        recipe.categories.includes(selectedCategory)
      );
    }
    
    setFilteredRecipes(results);
  }, [searchTerm, selectedCategory, recipes]);

  // Farben
  const bgInfo = useColorModeValue('blue.50', 'blue.900');
  const colorInfo = useColorModeValue('blue.600', 'blue.200');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        {/* Header-Box */}
        <Box mb={2}>
          {/* Suchfeld */}
          <InputGroup mb={4} size="lg">
            <InputLeftElement pointerEvents="none" h="full" pl={2}>
              <Icon as={FiSearch} color="gray.500" boxSize={5} />
            </InputLeftElement>
            <Input 
              placeholder={t('recipes.searchPlaceholder', 'Rezepte durchsuchen...') as string}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              h="3rem"
              fontSize="lg"
              bg={useColorModeValue('white', 'gray.800')}
              borderWidth={2}
            />
          </InputGroup>
          
          {/* Filter und Aktionen */}
          <Flex 
            justifyContent="space-between" 
            flexDirection={{ base: 'column', md: 'row' }}
            gap={3}
          >
            {/* Kategoriefilter */}
            <Box w={{ base: 'full', md: '300px' }}>
              <Select 
                placeholder={t('recipes.allCategories', 'Alle Kategorien') as string}
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                size="md"
                bg={useColorModeValue('white', 'gray.800')}
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {t(`recipes.categories.${category}`, category)}
                  </option>
                ))}
              </Select>
            </Box>
            
            {/* Aktionsbuttons */}
            <Flex 
              gap={2} 
              flexWrap="wrap"
              justifyContent={{ base: 'flex-start', md: 'flex-end' }}
              mt={{ base: 1, md: 0 }}
            >
              <Tooltip label={t('recipes.create.button', 'Erstellen')} hasArrow>
                <Button 
                  aria-label={t('recipes.create.button', 'Erstellen') as string}
                  colorScheme="teal"
                  onClick={() => navigate('/recipes/create')}
                  size="md"
                  w="40px"
                  h="40px"
                  borderRadius="full"
                  p={0}
                  _hover={{ 
                    transform: 'scale(1.1)',
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  <Icon as={FiPlus} boxSize={5} />
                </Button>
              </Tooltip>
              
              <Tooltip label={t('recipes.importJson', 'JSON Import')} hasArrow>
                <Button 
                  aria-label={t('recipes.importJson', 'JSON Import') as string}
                  colorScheme="blue"
                  onClick={openFileInput}
                  size="md"
                  w="40px"
                  h="40px"
                  borderRadius="full"
                  p={0}
                  _hover={{ 
                    transform: 'scale(1.1)',
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  <Icon as={FiUpload} boxSize={5} />
                </Button>
              </Tooltip>
              
              <Tooltip label={t('recipes.export', 'Export')} hasArrow>
                <Button 
                  aria-label={t('recipes.export', 'Export') as string}
                  colorScheme="purple"
                  onClick={handleExportRecipes}
                  size="md"
                  w="40px"
                  h="40px"
                  borderRadius="full"
                  p={0}
                  _hover={{ 
                    transform: 'scale(1.1)',
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  <Icon as={FiDownload} boxSize={5} />
                </Button>
              </Tooltip>
              
              <Tooltip label={t('recipes.reset', 'Zurücksetzen')} hasArrow>
                <Button
                  aria-label={t('recipes.reset', 'Zurücksetzen') as string}
                  colorScheme="orange"
                  onClick={() => setResetConfirmOpen(true)}
                  size="md"
                  w="40px"
                  h="40px"
                  borderRadius="full"
                  p={0}
                  _hover={{ 
                    transform: 'scale(1.1)',
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  <Icon as={FiRefreshCw} boxSize={5} />
                </Button>
              </Tooltip>
            </Flex>
          </Flex>
        </Box>
        
        {/* Info über die Datenbank */}
        <Box mb={2} p={4} borderRadius="md" bg={bgInfo} color={colorInfo}>
          <Flex alignItems="center" gap={2}>
            <Icon as={FiInfo} />
            <Text fontWeight="medium">
              {t('recipes.databaseInfo', 'Rezeptdatenbank')}:
              <Text as="span" ml={1} fontWeight="normal">
                {filteredRecipes.length} {t('recipes.recipeItems', 'Rezepte')}
              </Text>
            </Text>
          </Flex>
        </Box>
        
        {/* Rezeptgitter */}
        {isLoading ? (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
            {[...Array(6)].map((_, idx) => (
              <Box key={idx} borderRadius="lg" overflow="hidden">
                <Skeleton height="200px" />
                <Box p={4}>
                  <Skeleton height="20px" mb={2} />
                  <Skeleton height="15px" mb={3} />
                  <Skeleton height="15px" />
                </Box>
              </Box>
            ))}
          </SimpleGrid>
        ) : filteredRecipes.length > 0 ? (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
            {filteredRecipes.map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </SimpleGrid>
        ) : (
          <Flex justify="center" align="center" height="200px">
            <Text fontSize="lg">{t('recipes.noResults', 'Keine Rezepte gefunden')}</Text>
          </Flex>
        )}
      </VStack>
      
      {/* Verstecktes Datei-Input-Element */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept=".json"
        onChange={handleFileChange}
      />
      
      {/* JSON-Import-Modal */}
      <Modal isOpen={isJsonUploadOpen} onClose={() => setIsJsonUploadOpen(false)} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t('recipes.importJson', 'JSON Import')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>{t('recipes.jsonContent', 'JSON-Inhalt')}</FormLabel>
              <Textarea 
                value={jsonContent}
                onChange={(e) => setJsonContent(e.target.value)}
                height="300px"
                placeholder={t('recipes.pasteJson', 'JSON hier einfügen...') as string}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={() => setIsJsonUploadOpen(false)}>
              {t('common.cancel', 'Abbrechen')}
            </Button>
            <Button colorScheme="blue" onClick={handleImportRecipes}>
              {t('recipes.import', 'Importieren')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      
      {/* Reset-Bestätigungs-Modal */}
      <Modal isOpen={resetConfirmOpen} onClose={() => setResetConfirmOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t('recipes.resetConfirmTitle', 'Rezepte zurücksetzen')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              {t('recipes.resetConfirmMessage', 'Möchten Sie wirklich alle benutzerdefinierten Rezepte zurücksetzen? Diese Aktion kann nicht rückgängig gemacht werden.')}
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={() => setResetConfirmOpen(false)}>
              {t('common.cancel', 'Abbrechen')}
            </Button>
            <Button colorScheme="red" onClick={handleResetRecipes}>
              {t('recipes.resetConfirm', 'Zurücksetzen')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default RecipesPage; 