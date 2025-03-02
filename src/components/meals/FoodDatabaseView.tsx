import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Grid,
  Heading,
  Text,
  Flex,
  Badge,
  Select,
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
  Radio,
  RadioGroup,
  Stack,
  Divider,
  useColorModeValue,
  Icon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  FormHelperText,
  Code,
  VStack,
  chakra,
  Tooltip,
} from '@chakra-ui/react';
import { FiSearch, FiPlus, FiUpload, FiFilter, FiDownload, FiInfo, FiRefreshCw, FiChevronUp, FiChevronDown } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { FoodService, Food } from '../../services/FoodService';

// Definiere einen Typ für die Sortieroptionen
type SortField = 'name' | 'calories' | 'protein' | 'carbs' | 'fat' | 'category';
type SortDirection = 'asc' | 'desc';

const FoodDatabaseView: React.FC = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const jsonFileInputRef = useRef<HTMLInputElement>(null);
  
  // State für Lebensmittel und Filter
  const [foods, setFoods] = useState<Food[]>([]);
  const [filteredFoods, setFilteredFoods] = useState<Food[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  
  // State für Sortierung
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  
  // State für Import/Export Modal
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importFormat, setImportFormat] = useState<'json' | 'csv'>('json');
  const [importData, setImportData] = useState('');
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importMode, setImportMode] = useState<'extend' | 'replace'>('extend');
  
  // State für neues Lebensmittel Modal
  const [isNewFoodModalOpen, setIsNewFoodModalOpen] = useState(false);
  const [newFood, setNewFood] = useState<Omit<Food, 'id'>>({
    name: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    servingSize: 100,
    servingUnit: 'g',
    category: '',
    isCustom: true
  });
  
  // State für JSON-Datei-Upload Dialog
  const [isJsonUploadOpen, setIsJsonUploadOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Farben
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  // Lade Lebensmittel beim ersten Rendern
  useEffect(() => {
    loadFoods();
  }, []);

  // Effekt für die Suche und Filterung
  useEffect(() => {
    filterAndSortFoods();
  }, [searchQuery, selectedCategory, foods, sortField, sortDirection]);
  
  // Lade Lebensmittel aus dem Service
  const loadFoods = () => {
    const allFoods = FoodService.getAllFoods();
    setFoods(allFoods);
    setFilteredFoods(allFoods);
    
    // Extrahiere alle einzigartigen Kategorien
    const uniqueCategories = Array.from(new Set(allFoods.map(food => food.category || 'Sonstige'))).sort();
    setCategories(uniqueCategories);
  };
  
  // Filtere und sortiere Lebensmittel
  const filterAndSortFoods = () => {
    let filtered = foods;
    
    // Filtere nach Suchbegriff
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(food => 
        food.name.toLowerCase().includes(query) || 
        (food.category && food.category.toLowerCase().includes(query))
      );
    }
    
    // Filtere nach Kategorie
    if (selectedCategory) {
      filtered = filtered.filter(food => food.category === selectedCategory);
    }
    
    // Sortiere nach ausgewähltem Feld und Richtung
    filtered = [...filtered].sort((a, b) => {
      let valueA, valueB;
      
      // Bestimme die zu vergleichenden Werte basierend auf dem Sortierfeld
      switch (sortField) {
        case 'name':
          valueA = a.name.toLowerCase();
          valueB = b.name.toLowerCase();
          break;
        case 'calories':
          valueA = a.calories;
          valueB = b.calories;
          break;
        case 'protein':
          valueA = a.protein;
          valueB = b.protein;
          break;
        case 'carbs':
          valueA = a.carbs;
          valueB = b.carbs;
          break;
        case 'fat':
          valueA = a.fat;
          valueB = b.fat;
          break;
        case 'category':
          valueA = (a.category || '').toLowerCase();
          valueB = (b.category || '').toLowerCase();
          break;
        default:
          valueA = a.name.toLowerCase();
          valueB = b.name.toLowerCase();
      }
      
      // Vergleiche die Werte in der richtigen Richtung
      if (sortDirection === 'asc') {
        return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
      } else {
        return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
      }
    });
    
    setFilteredFoods(filtered);
  };
  
  // Handler für den Wechsel des Sortierfelds
  const handleSortChange = (field: SortField) => {
    // Wenn das gleiche Feld geklickt wird, ändere die Richtung
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Sonst setze neues Feld und Standardrichtung (aufsteigend)
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Handler für das Hinzufügen eines neuen Lebensmittels
  const handleAddNewFood = () => {
    if (!newFood.name || newFood.calories <= 0) {
      toast({
        title: t('foodDatabase.validationError', 'Validierungsfehler'),
        description: t('foodDatabase.nameAndCaloriesRequired', 'Name und Kalorien sind erforderlich') as string,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    try {
      const addedFood = FoodService.addFood(newFood);
      
      toast({
        title: t('foodDatabase.foodAdded', 'Lebensmittel hinzugefügt'),
        description: t('foodDatabase.foodAddedSuccess', '{{name}} wurde erfolgreich hinzugefügt', { name: addedFood.name }) as string,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      // Zurücksetzen des Formulars und Schließen des Modals
      setNewFood({
        name: '',
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        servingSize: 100,
        servingUnit: 'g',
        category: '',
        isCustom: true
      });
      
      setIsNewFoodModalOpen(false);
      loadFoods(); // Aktualisiere die Liste
    } catch (error) {
      toast({
        title: t('foodDatabase.errorAddingFood', 'Fehler beim Hinzufügen'),
        description: String(error),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
  // Handler für den Import von Lebensmitteln
  const handleImportFoods = () => {
    if (!importData && !importFile) {
      toast({
        title: t('foodDatabase.noDataToImport', 'Keine Daten zum Importieren'),
        description: t('foodDatabase.pleaseEnterDataOrUploadFile', 'Bitte gib Daten ein oder lade eine Datei hoch') as string,
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    try {
      let dataToImport = importData;
      
      if (importFile) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const fileContent = e.target?.result as string;
          
          const result = FoodService.importFoods(fileContent, importFormat);
          
          if (result.success) {
            toast({
              title: t('foodDatabase.importSuccess', 'Import erfolgreich'),
              description: t('foodDatabase.importedItems', '{{count}} Lebensmittel importiert', { count: result.imported }) as string,
              status: 'success',
              duration: 3000,
              isClosable: true,
            });
            
            loadFoods(); // Aktualisiere die Liste
            setIsImportModalOpen(false);
            setImportData('');
            setImportFile(null);
          } else {
            toast({
              title: t('foodDatabase.importError', 'Fehler beim Import'),
              description: t('foodDatabase.importErrorWithCount', 'Import fehlgeschlagen mit {{count}} Fehlern', { count: result.errors }) as string,
              status: 'error',
              duration: 3000,
              isClosable: true,
            });
          }
        };
        
        reader.readAsText(importFile);
      } else {
        const result = FoodService.importFoods(dataToImport, importFormat);
        
        if (result.success) {
          toast({
            title: t('foodDatabase.importSuccess', 'Import erfolgreich'),
            description: t('foodDatabase.importedItems', '{{count}} Lebensmittel importiert', { count: result.imported }) as string,
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
          
          loadFoods(); // Aktualisiere die Liste
          setIsImportModalOpen(false);
          setImportData('');
        } else {
          toast({
            title: t('foodDatabase.importError', 'Fehler beim Import'),
            description: t('foodDatabase.importErrorWithCount', 'Import fehlgeschlagen mit {{count}} Fehlern', { count: result.errors }) as string,
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        }
      }
    } catch (error) {
      toast({
        title: t('foodDatabase.importError', 'Fehler beim Import'),
        description: String(error),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
  // Handler für Datei-Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImportFile(e.target.files[0]);
    }
  };
  
  // Handler für JSON-Datei-Upload
  const handleJsonFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsProcessing(true);
      
      try {
        const file = e.target.files[0];
        const result = await FoodService.loadFoodDatabaseFromJson(file, importMode);
        
        toast({
          title: result.success ? t('foodDatabase.importSuccess', 'Import erfolgreich') : t('foodDatabase.importError', 'Fehler beim Import'),
          description: result.message,
          status: result.success ? 'success' : 'error',
          duration: 4000,
          isClosable: true,
        });
        
        if (result.success) {
          loadFoods(); // Aktualisiere die Liste
          setIsJsonUploadOpen(false);
        }
      } catch (error) {
        toast({
          title: t('foodDatabase.importError', 'Fehler beim Import'),
          description: String(error),
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsProcessing(false);
        // Reset File Input
        if (jsonFileInputRef.current) {
          jsonFileInputRef.current.value = '';
        }
      }
    }
  };
  
  // Handler für Export der Lebensmitteldatenbank
  const handleExportFoods = () => {
    try {
      const foodsToExport = selectedCategory 
        ? foods.filter(food => food.category === selectedCategory)
        : foods;
      
      const exportData = {
        version: "1.0",
        lastUpdate: new Date().toISOString(),
        foods: foodsToExport
      };
      
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = 'nutricoach_foods.json';
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      toast({
        title: t('foodDatabase.exportSuccess', 'Export erfolgreich'),
        description: t('foodDatabase.exportedItems', '{{count}} Lebensmittel exportiert', { count: foodsToExport.length }) as string,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: t('foodDatabase.exportError', 'Fehler beim Export'),
        description: String(error),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
  // Zurücksetzen der Datenbank auf Standardwerte
  const handleResetDatabase = () => {
    if (window.confirm(t('foodDatabase.confirmReset', 'Möchten Sie die Lebensmitteldatenbank wirklich auf die Standardwerte zurücksetzen? Diese Aktion kann nicht rückgängig gemacht werden.') as string)) {
      const result = FoodService.resetDatabase();
      
      if (result.success) {
        toast({
          title: t('foodDatabase.resetSuccess', 'Datenbank zurückgesetzt'),
          description: t('foodDatabase.resetSuccessMessage', 'Die Lebensmitteldatenbank wurde erfolgreich auf die Standardwerte zurückgesetzt ({{count}} Lebensmittel).', { count: result.count }) as string,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        
        // Lade die Lebensmittel neu
        loadFoods();
      } else {
        toast({
          title: t('foodDatabase.resetError', 'Fehler beim Zurücksetzen'),
          description: t('foodDatabase.resetErrorMessage', 'Beim Zurücksetzen der Datenbank ist ein Fehler aufgetreten.') as string,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };
  
  // Render der Komponente
  return (
    <Box>
      {/* Header mit Suchfeld, Filter und Aktionsbuttons */}
      <Box mb={6} bg={useColorModeValue('gray.50', 'gray.700')} p={4} borderRadius="lg" shadow="sm">
        {/* Suchfeld - nimmt volle Breite ein */}
        <InputGroup mb={4} size="lg">
          <InputLeftElement pointerEvents="none" h="full" pl={2}>
            <Icon as={FiSearch} color="gray.500" boxSize={5} />
          </InputLeftElement>
          <Input 
            placeholder={t('foodDatabase.searchFoods', 'Lebensmittel suchen...') as string}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
              placeholder={t('foodDatabase.allCategories', 'Alle Kategorien') as string}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              size="md"
              bg={useColorModeValue('white', 'gray.800')}
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
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
            <Tooltip label={t('foodDatabase.addFood', 'Hinzufügen')} hasArrow>
              <Button 
                aria-label={t('foodDatabase.addFood', 'Hinzufügen') as string}
                colorScheme="teal"
                onClick={() => setIsNewFoodModalOpen(true)}
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
            
            <Tooltip label={t('foodDatabase.importJson', 'JSON Import')} hasArrow>
              <Button 
                aria-label={t('foodDatabase.importJson', 'JSON Import') as string}
                colorScheme="blue"
                onClick={() => setIsJsonUploadOpen(true)}
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
            
            <Tooltip label={t('foodDatabase.export', 'Export')} hasArrow>
              <Button 
                aria-label={t('foodDatabase.export', 'Export') as string}
                colorScheme="purple"
                onClick={handleExportFoods}
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
            
            <Tooltip label={t('foodDatabase.reset', 'Zurücksetzen')} hasArrow>
              <Button
                aria-label={t('foodDatabase.reset', 'Zurücksetzen') as string}
                colorScheme="orange"
                onClick={handleResetDatabase}
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
      <Box mb={4} p={4} borderRadius="md" bg={useColorModeValue('blue.50', 'blue.900')} color={useColorModeValue('blue.600', 'blue.200')}>
        <Flex alignItems="center" gap={2}>
          <Icon as={FiInfo} />
          <Text fontWeight="medium">
            {t('foodDatabase.databaseInfo', 'Lebensmitteldatenbank')}:
            <Text as="span" ml={1} fontWeight="normal">
              {foods.length} {t('foodDatabase.foodItems', 'Lebensmittel')}
              {FoodService.getLastUpdateDate() && (
                <Text as="span">
                  {" • "}{t('foodDatabase.lastUpdate', 'Letzte Aktualisierung')}: {FoodService.getLastUpdateDate()?.toLocaleDateString()}
                </Text>
              )}
            </Text>
          </Text>
        </Flex>
      </Box>
      
      {/* Lebensmitteltabelle */}
      <TableContainer borderWidth="1px" borderRadius="lg" borderColor={borderColor}>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th 
                cursor="pointer" 
                onClick={() => handleSortChange('name')}
              >
                <Flex align="center">
                  {t('foodDatabase.name', 'Name')}
                  {sortField === 'name' && (
                    <Icon ml={1} as={sortDirection === 'asc' ? FiChevronUp : FiChevronDown} />
                  )}
                </Flex>
              </Th>
              <Th 
                isNumeric 
                cursor="pointer" 
                onClick={() => handleSortChange('calories')}
              >
                <Flex align="center" justify="flex-end">
                  {t('foodDatabase.calories', 'Kalorien')}
                  {sortField === 'calories' && (
                    <Icon ml={1} as={sortDirection === 'asc' ? FiChevronUp : FiChevronDown} />
                  )}
                </Flex>
              </Th>
              <Th 
                isNumeric 
                cursor="pointer" 
                onClick={() => handleSortChange('protein')}
              >
                <Flex align="center" justify="flex-end">
                  {t('foodDatabase.protein', 'Protein')}
                  {sortField === 'protein' && (
                    <Icon ml={1} as={sortDirection === 'asc' ? FiChevronUp : FiChevronDown} />
                  )}
                </Flex>
              </Th>
              <Th 
                isNumeric 
                cursor="pointer" 
                onClick={() => handleSortChange('carbs')}
              >
                <Flex align="center" justify="flex-end">
                  {t('foodDatabase.carbs', 'Kohlenhydrate')}
                  {sortField === 'carbs' && (
                    <Icon ml={1} as={sortDirection === 'asc' ? FiChevronUp : FiChevronDown} />
                  )}
                </Flex>
              </Th>
              <Th 
                isNumeric 
                cursor="pointer" 
                onClick={() => handleSortChange('fat')}
              >
                <Flex align="center" justify="flex-end">
                  {t('foodDatabase.fat', 'Fett')}
                  {sortField === 'fat' && (
                    <Icon ml={1} as={sortDirection === 'asc' ? FiChevronUp : FiChevronDown} />
                  )}
                </Flex>
              </Th>
              <Th>{t('foodDatabase.serving', 'Portion')}</Th>
              <Th 
                cursor="pointer" 
                onClick={() => handleSortChange('category')}
              >
                <Flex align="center">
                  {t('foodDatabase.category', 'Kategorie')}
                  {sortField === 'category' && (
                    <Icon ml={1} as={sortDirection === 'asc' ? FiChevronUp : FiChevronDown} />
                  )}
                </Flex>
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredFoods.map(food => (
              <Tr key={food.id}>
                <Td fontWeight="medium">
                  {food.name}
                  {food.isCustom && (
                    <Badge ml={2} colorScheme="green" fontSize="xs">
                      {t('foodDatabase.custom', 'Eigenes')}
                    </Badge>
                  )}
                </Td>
                <Td isNumeric>{food.calories} kcal</Td>
                <Td isNumeric>{food.protein}g</Td>
                <Td isNumeric>{food.carbs}g</Td>
                <Td isNumeric>{food.fat}g</Td>
                <Td>{food.servingSize} {food.servingUnit}</Td>
                <Td>{food.category || '-'}</Td>
              </Tr>
            ))}
            {filteredFoods.length === 0 && (
              <Tr>
                <Td colSpan={7} textAlign="center" py={4}>
                  <Text color="gray.500">
                    {t('foodDatabase.noFoodsFound', 'Keine Lebensmittel gefunden')}
                  </Text>
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </TableContainer>
      
      {/* Modal für JSON-Upload */}
      <Modal isOpen={isJsonUploadOpen} onClose={() => setIsJsonUploadOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t('foodDatabase.importJsonFood', 'Lebensmittel aus JSON importieren')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Text>
                {t('foodDatabase.importJsonDescription', 'Importiere Lebensmittel aus einer JSON-Datei in die Datenbank.')}
              </Text>
              
              <FormControl>
                <FormLabel>{t('foodDatabase.importMode', 'Import-Modus')}</FormLabel>
                <RadioGroup value={importMode} onChange={(value) => setImportMode(value as 'extend' | 'replace')}>
                  <Stack direction="row">
                    <Radio value="extend">
                      {t('foodDatabase.extendMode', 'Hinzufügen (nur neue Lebensmittel)')}
                    </Radio>
                    <Radio value="replace">
                      {t('foodDatabase.replaceMode', 'Ersetzen (komplette Datenbank)')}
                    </Radio>
                  </Stack>
                </RadioGroup>
              </FormControl>
              
              <FormControl>
                <FormLabel>{t('foodDatabase.selectJsonFile', 'JSON-Datei auswählen')}</FormLabel>
                <Input
                  type="file"
                  accept=".json"
                  ref={jsonFileInputRef}
                  onChange={handleJsonFileChange}
                  p={1}
                />
                <FormHelperText>
                  {t('foodDatabase.jsonFormatHelp', 'Datei sollte ein JSON-Array mit Lebensmitteln enthalten oder ein Objekt mit einem "foods"-Array.')}
                </FormHelperText>
              </FormControl>
              
              <Box bg={useColorModeValue('yellow.50', 'yellow.900')} p={3} borderRadius="md">
                <Text fontSize="sm" color={useColorModeValue('yellow.700', 'yellow.200')}>
                  <strong>{t('foodDatabase.jsonFormatExample', 'Beispiel-Format')}:</strong>
                </Text>
                <Code p={2} mt={2} w="full" bg={useColorModeValue('gray.50', 'gray.800')} overflowX="auto" fontSize="xs">
                  {`{
  "version": "1.0",
  "lastUpdate": "2023-07-01T12:00:00Z",
  "foods": [
    {
      "Name": "Haferflocken",
      "Kalorien": 370,
      "Protein": 13,
      "Kohlenhydrate": 59,
      "Fett": 7
    },
    {
      "name": "Banane",
      "calories": 89,
      "protein": 1.1,
      "carbs": 22.8,
      "fat": 0.3
    }
  ]
}`}
                </Code>
              </Box>
            </VStack>
          </ModalBody>
          
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={() => setIsJsonUploadOpen(false)}>
              {t('common.cancel', 'Abbrechen')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      
      {/* Modal für neues Lebensmittel */}
      <Modal isOpen={isNewFoodModalOpen} onClose={() => setIsNewFoodModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t('foodDatabase.addNewFood', 'Neues Lebensmittel hinzufügen')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4} isRequired>
              <FormLabel>{t('foodDatabase.name', 'Name')}</FormLabel>
              <Input 
                value={newFood.name}
                onChange={(e) => setNewFood({...newFood, name: e.target.value})}
                placeholder={t('foodDatabase.foodName', 'Name des Lebensmittels') as string}
              />
            </FormControl>
            
            <Grid templateColumns="repeat(2, 1fr)" gap={4} mb={4}>
              <FormControl isRequired>
                <FormLabel>{t('foodDatabase.calories', 'Kalorien')}</FormLabel>
                <Input 
                  type="number"
                  value={newFood.calories}
                  onChange={(e) => setNewFood({...newFood, calories: Number(e.target.value)})}
                  placeholder="0"
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>{t('foodDatabase.category', 'Kategorie')}</FormLabel>
                <Input 
                  value={newFood.category}
                  onChange={(e) => setNewFood({...newFood, category: e.target.value})}
                  placeholder={t('foodDatabase.categoryPlaceholder', 'z.B. Obst, Gemüse, Fleisch') as string}
                />
              </FormControl>
            </Grid>
            
            <Grid templateColumns="repeat(3, 1fr)" gap={4} mb={4}>
              <FormControl>
                <FormLabel>{t('foodDatabase.protein', 'Protein (g)')}</FormLabel>
                <Input 
                  type="number"
                  value={newFood.protein}
                  onChange={(e) => setNewFood({...newFood, protein: Number(e.target.value)})}
                  placeholder="0"
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>{t('foodDatabase.carbs', 'Kohlenhydrate (g)')}</FormLabel>
                <Input 
                  type="number"
                  value={newFood.carbs}
                  onChange={(e) => setNewFood({...newFood, carbs: Number(e.target.value)})}
                  placeholder="0"
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>{t('foodDatabase.fat', 'Fett (g)')}</FormLabel>
                <Input 
                  type="number"
                  value={newFood.fat}
                  onChange={(e) => setNewFood({...newFood, fat: Number(e.target.value)})}
                  placeholder="0"
                />
              </FormControl>
            </Grid>
            
            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
              <FormControl>
                <FormLabel>{t('foodDatabase.servingSize', 'Portionsgröße')}</FormLabel>
                <Input 
                  type="number"
                  value={newFood.servingSize}
                  onChange={(e) => setNewFood({...newFood, servingSize: Number(e.target.value)})}
                  placeholder="100"
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>{t('foodDatabase.servingUnit', 'Einheit')}</FormLabel>
                <Select 
                  value={newFood.servingUnit}
                  onChange={(e) => setNewFood({...newFood, servingUnit: e.target.value})}
                >
                  <option value="g">g (Gramm)</option>
                  <option value="ml">ml (Milliliter)</option>
                  <option value="stk">stk (Stück)</option>
                  <option value="portion">Portion</option>
                </Select>
              </FormControl>
            </Grid>
          </ModalBody>
          
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={() => setIsNewFoodModalOpen(false)}>
              {t('common.cancel', 'Abbrechen')}
            </Button>
            <Button colorScheme="blue" onClick={handleAddNewFood}>
              {t('common.add', 'Hinzufügen')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      
      {/* Modal für Import (traditionell) */}
      <Modal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t('foodDatabase.importFoods', 'Lebensmittel importieren')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4}>
              <FormLabel>{t('foodDatabase.format', 'Format')}</FormLabel>
              <RadioGroup value={importFormat} onChange={(value) => setImportFormat(value as 'json' | 'csv')}>
                <Stack direction="row">
                  <Radio value="json">JSON</Radio>
                  <Radio value="csv">CSV</Radio>
                </Stack>
              </RadioGroup>
            </FormControl>
            
            <FormControl mb={4}>
              <FormLabel>{t('foodDatabase.uploadFile', 'Datei hochladen')}</FormLabel>
              <Input
                type="file"
                accept={importFormat === 'json' ? '.json' : '.csv'}
                ref={fileInputRef}
                onChange={handleFileChange}
                p={1}
              />
            </FormControl>
            
            <FormControl>
              <FormLabel>{t('foodDatabase.pasteData', 'Oder Daten einfügen')}</FormLabel>
              <Textarea
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
                placeholder={
                  importFormat === 'json'
                    ? '{ "foods": [{ "name": "Apfel", "calories": 52, ... }] }'
                    : 'name,calories,protein,carbs,fat\nApfel,52,0.3,13.8,0.2'
                }
                minH="150px"
              />
            </FormControl>
          </ModalBody>
          
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={() => setIsImportModalOpen(false)}>
              {t('common.cancel', 'Abbrechen')}
            </Button>
            <Button colorScheme="blue" onClick={handleImportFoods}>
              {t('common.import', 'Importieren')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default FoodDatabaseView; 