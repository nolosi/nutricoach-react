import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Container,
  Heading,
  SimpleGrid,
  Text,
  Avatar,
  Stat,
  StatLabel,
  StatNumber,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Tab,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  Divider,
  Flex,
  Tag,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  useDisclosure,
  HStack,
  useToast,
  useColorModeValue,
  Badge,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  CheckboxGroup,
  Checkbox,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Icon
} from '@chakra-ui/react';
import { FiUser, FiSettings, FiTarget, FiEdit, FiLogOut, FiRefreshCw, FiActivity, FiArrowUp, FiArrowDown, FiDatabase } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { 
  calculateNutritionGoals, 
  NutritionInputData 
} from '../utils/nutritionCalculator';
import { recalculateAndUpdateNutritionGoals } from '../contexts/UserContext';
import BackupRestoreModal from '../components/BackupRestoreModal';

const ProfilePage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user, updateUser, clearUser } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const toast = useToast();
  const navigate = useNavigate();
  
  // Backup/Restore Modal
  const { isOpen: isBackupModalOpen, onOpen: onBackupModalOpen, onClose: onBackupModalClose } = useDisclosure();
  
  // Farbwerte für light/dark mode - früher bedingt aufgerufen
  const nutritionGreenBg = useColorModeValue('green.50', 'green.900');
  const nutritionGreenText = useColorModeValue('green.700', 'green.200');
  const nutritionGrayText = useColorModeValue('gray.600', 'gray.300');
  const proteinBg = useColorModeValue('blue.50', 'blue.900');
  const carbBg = useColorModeValue('orange.50', 'orange.900');
  const fatBg = useColorModeValue('yellow.50', 'yellow.900');
  const waterBg = useColorModeValue('cyan.50', 'cyan.900');
  const infoBg = useColorModeValue('gray.50', 'gray.700');
  
  // Alle anderen useColorModeValue-Aufrufe aus dem restlichen Code
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  
  // Formularwerte für die Bearbeitung
  const [formValues, setFormValues] = useState({
    name: user?.name || '',
    age: user?.age || 0,
    height: user?.height || 0,
    weight: user?.weight || 0,
    targetWeight: user?.targetWeight || 0,
    gender: user?.gender || 'male',
    activityLevel: user?.activityLevel || 'moderate',
    language: user?.language || 'de',
    darkMode: user?.darkMode || false,
    dietaryPreferences: user?.dietaryPreferences || [],
    goals: user?.goals || [],
    calorieGoal: user?.calorieGoal || 0,
    proteinGoal: user?.proteinGoal || 0,
    carbGoal: user?.carbGoal || 0,
    fatGoal: user?.fatGoal || 0,
    waterGoal: user?.waterGoal || 0,
  });
  
  // Handle für Formularänderungen
  const handleInputChange = (field: string, value: any) => {
    setFormValues({
      ...formValues,
      [field]: value,
    });
  };
  
  // Speichern der Profildaten
  const handleSave = () => {
    // Aktualisiere Benutzerdaten
    updateUser(formValues);
    setIsEditing(false);
    
    // Sprache ändern, wenn notwendig
    if (user?.language !== formValues.language) {
      i18n.changeLanguage(formValues.language);
    }
    
    // Ernährungsziele neu berechnen, wenn relevante Daten geändert wurden
    if (
      user?.weight !== formValues.weight ||
      user?.height !== formValues.height ||
      user?.age !== formValues.age ||
      user?.gender !== formValues.gender ||
      user?.activityLevel !== formValues.activityLevel
    ) {
      // Anstatt recalculateAndUpdateNutritionGoals zu verwenden, 
      // machen wir die Berechnung direkt
      if (formValues.weight && formValues.height && formValues.age && formValues.gender) {
        const inputData: NutritionInputData = {
          gender: formValues.gender,
          weight: formValues.weight,
          height: formValues.height,
          age: formValues.age,
          activityLevel: formValues.activityLevel as any || 'moderate',
          weightGoal: (user?.weightGoal as any) || 'maintain'
        };
        
        const newGoals = calculateNutritionGoals(inputData);
        
        // Aktualisiere die Ernährungsziele
        updateUser({
          calorieGoal: newGoals.calorieGoal,
          proteinGoal: newGoals.proteinGoal,
          carbGoal: newGoals.carbGoal,
          fatGoal: newGoals.fatGoal,
          waterGoal: newGoals.waterGoal
        });
      }
    }
    
    toast({
      title: t('profile.savedSuccess', 'Änderungen gespeichert'),
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };
  
  // Abbrechen der Bearbeitung
  const handleCancel = () => {
    setFormValues({
      name: user?.name || '',
      age: user?.age || 0,
      height: user?.height || 0,
      weight: user?.weight || 0,
      targetWeight: user?.targetWeight || 0,
      gender: user?.gender || 'male',
      activityLevel: user?.activityLevel || 'moderate',
      language: user?.language || 'de',
      darkMode: user?.darkMode || false,
      dietaryPreferences: user?.dietaryPreferences || [],
      goals: user?.goals || [],
      calorieGoal: user?.calorieGoal || 0,
      proteinGoal: user?.proteinGoal || 0,
      carbGoal: user?.carbGoal || 0,
      fatGoal: user?.fatGoal || 0,
      waterGoal: user?.waterGoal || 0,
    });
    setIsEditing(false);
  };
  
  // Benutzer abmelden
  const handleLogout = () => {
    clearUser();
    onClose();
    toast({
      title: t('profile.logoutSuccess', 'Abmeldung erfolgreich'),
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
    navigate('/');
  };
  
  // Level und Erfahrungspunkte
  const level = user?.level || '-';
  
  // Funktion zum Neuberechnen der Ernährungsziele
  const recalculateNutritionGoals = () => {
    if (!user || !user.weight || !user.height || !user.age || !user.gender) {
      toast({
        title: t('profile.missingData', 'Fehlende Daten'),
        description: t('profile.completeProfileFirst', 'Bitte vervollständige zuerst dein Profil.'),
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    
    const inputData: NutritionInputData = {
      gender: user.gender as 'male' | 'female' | 'diverse',
      weight: user.weight,
      height: user.height,
      age: user.age,
      activityLevel: (user.activityLevel as any) || 'moderate',
      weightGoal: (user.weightGoal as any) || 'maintain'
    };
    
    const newGoals = calculateNutritionGoals(inputData);
    
    updateUser({
      calorieGoal: newGoals.calorieGoal,
      proteinGoal: newGoals.proteinGoal,
      carbGoal: newGoals.carbGoal,
      fatGoal: newGoals.fatGoal,
      waterGoal: newGoals.waterGoal
    });
    
    toast({
      title: t('profile.goalsUpdated', 'Ernährungsziele aktualisiert'),
      description: t('profile.goalsRecalculated', 'Deine Ernährungsziele wurden basierend auf deinen Profildaten neu berechnet.'),
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
    
    // Aktualisiere auch die Formular-Werte
    setFormValues({
      ...formValues,
      calorieGoal: newGoals.calorieGoal,
      proteinGoal: newGoals.proteinGoal,
      carbGoal: newGoals.carbGoal,
      fatGoal: newGoals.fatGoal,
      waterGoal: newGoals.waterGoal
    });
  };
  
  return (
    <Container maxW="container.xl" py={8}>
      <Box mb={8}>
        <Heading as="h1" size="xl" mb={2}>
          {t('nav.profile')}
        </Heading>
        <Text color="gray.500">
          {t('profile.pageDescription', 'Verwalte deine persönlichen Daten und Einstellungen.')}
        </Text>
      </Box>
      
      {/* Profil-Header */}
      <Box 
        bg={bgColor} 
        p={6} 
        borderRadius="lg" 
        boxShadow="md"
        mb={8}
      >
        <Flex direction={{base: "column", md: "row"}} align="center" justifyContent="space-between">
          <Flex align="center" mb={{base: 4, md: 0}}>
            <Avatar 
              size="xl" 
              name={user?.name || 'Nutzer'} 
              src="/avatars/default.png" 
              mr={4}
            />
            <Box>
              <Heading size="md">{user?.name || t('profile.anonymous', 'Anonym')}</Heading>
              <HStack mt={1}>
                <Badge colorScheme="brand">Level {level}</Badge>
                <Badge colorScheme="green">{user?.experiencePoints || 0} XP</Badge>
              </HStack>
              <Text fontSize="sm" color="gray.500" mt={1}>
                {t('profile.joinedDate', `Dabei seit ${new Date().toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })}`)}
              </Text>
            </Box>
          </Flex>
          
          <HStack spacing={4}>
            <Button 
              leftIcon={<FiEdit />} 
              onClick={() => setIsEditing(true)}
              isDisabled={isEditing}
              colorScheme="brand"
              variant="outline"
            >
              {t('profile.edit', 'Bearbeiten')}
            </Button>
            <Button
              leftIcon={<FiLogOut />}
              onClick={onOpen}
              variant="ghost"
            >
              {t('profile.logout', 'Abmelden')}
            </Button>
          </HStack>
        </Flex>
      </Box>
      
      {/* Abmeldedialog */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {t('profile.logoutConfirm', 'Abmelden bestätigen')}
            </AlertDialogHeader>

            <AlertDialogBody>
              {t('profile.logoutQuestion', 'Möchtest du dich wirklich abmelden?')}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                {t('profile.cancel', 'Abbrechen')}
              </Button>
              <Button colorScheme="red" onClick={handleLogout} ml={3}>
                {t('profile.logout', 'Abmelden')}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      
      {/* Profiltabs */}
      <Tabs variant="enclosed" colorScheme="brand">
        <TabList
          overflowX="auto" 
          overflowY="hidden" 
          css={{
            scrollbarWidth: 'none',
            '::-webkit-scrollbar': { display: 'none' },
            whiteSpace: 'nowrap',
            flexWrap: 'nowrap'
          }}
          pb={2}
        >
          <Tab minW="auto" px={3}><FiUser style={{marginRight: '8px'}} /> {t('profile.personalData', 'Persönliche Daten')}</Tab>
          <Tab minW="auto" px={3}><FiTarget style={{marginRight: '8px'}} /> {t('profile.goals', 'Ziele')}</Tab>
          <Tab minW="auto" px={3}><FiActivity style={{marginRight: '8px'}} /> {t('profile.weightHistory', 'Gewichtsverlauf')}</Tab>
          <Tab minW="auto" px={3}><FiSettings style={{marginRight: '8px'}} /> {t('profile.settings', 'Einstellungen')}</Tab>
        </TabList>
        
        <TabPanels 
          bg={bgColor} 
          borderWidth="1px" 
          borderTopWidth="0" 
          borderRadius="0 0 lg lg"
          borderColor={borderColor}
        >
          {/* Persönliche Daten */}
          <TabPanel>
            {isEditing ? (
              <VStack spacing={6} align="stretch">
                <SimpleGrid columns={{base: 1, md: 2}} spacing={6}>
                  <FormControl>
                    <FormLabel>{t('profile.name', 'Name')}</FormLabel>
                    <Input 
                      value={formValues.name} 
                      onChange={(e) => handleInputChange('name', e.target.value)} 
                    />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>{t('profile.age', 'Alter')}</FormLabel>
                    <NumberInput 
                      min={1} 
                      max={120} 
                      value={formValues.age}
                      onChange={(valueString: string) => handleInputChange('age', parseInt(valueString))}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>{t('profile.height', 'Größe')} (cm)</FormLabel>
                    <NumberInput 
                      min={50} 
                      max={250} 
                      value={formValues.height}
                      onChange={(valueString: string) => handleInputChange('height', parseInt(valueString))}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>{t('profile.weight', 'Gewicht')} (kg)</FormLabel>
                    <NumberInput 
                      min={30} 
                      max={300} 
                      precision={1}
                      step={0.1}
                      value={formValues.weight}
                      onChange={(valueString: string) => handleInputChange('weight', parseFloat(valueString))}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>{t('profile.gender', 'Geschlecht')}</FormLabel>
                    <Select 
                      value={formValues.gender} 
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                    >
                      <option value="male">{t('profile.male', 'Männlich')}</option>
                      <option value="female">{t('profile.female', 'Weiblich')}</option>
                      <option value="diverse">{t('profile.diverse', 'Divers')}</option>
                    </Select>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>{t('profile.activityLevel', 'Aktivitätslevel')}</FormLabel>
                    <Select 
                      value={formValues.activityLevel} 
                      onChange={(e) => handleInputChange('activityLevel', e.target.value)}
                    >
                      <option value="sedentary">{t('profile.sedentary', 'Sitzend (wenig Bewegung)')}</option>
                      <option value="light">{t('profile.light', 'Leicht aktiv (1-2x Sport/Woche)')}</option>
                      <option value="moderate">{t('profile.moderate', 'Moderat aktiv (3-5x Sport/Woche)')}</option>
                      <option value="active">{t('profile.active', 'Sehr aktiv (6-7x Sport/Woche)')}</option>
                      <option value="very-active">{t('profile.veryActive', 'Extrem aktiv (2x täglich Training)')}</option>
                    </Select>
                  </FormControl>
                </SimpleGrid>
                
                <Box>
                  <FormLabel mb={3}>{t('profile.dietaryPreferences', 'Ernährungspräferenzen')}</FormLabel>
                  <CheckboxGroup
                    colorScheme="brand"
                    value={formValues.dietaryPreferences}
                    onChange={(value: string[]) => handleInputChange('dietaryPreferences', value)}
                  >
                    <SimpleGrid columns={{base: 1, sm: 2, md: 3}} spacing={2}>
                      <Checkbox value="vegetarian">{t('profile.vegetarian', 'Vegetarisch')}</Checkbox>
                      <Checkbox value="vegan">{t('profile.vegan', 'Vegan')}</Checkbox>
                      <Checkbox value="glutenFree">{t('profile.glutenFree', 'Glutenfrei')}</Checkbox>
                      <Checkbox value="lactoseFree">{t('profile.lactoseFree', 'Laktosefrei')}</Checkbox>
                      <Checkbox value="lowCarb">{t('profile.lowCarb', 'Low Carb')}</Checkbox>
                      <Checkbox value="highProtein">{t('profile.highProtein', 'High Protein')}</Checkbox>
                    </SimpleGrid>
                  </CheckboxGroup>
                </Box>
                
                <Flex justifyContent="flex-end" mt={4}>
                  <Button mr={3} onClick={handleCancel}>
                    {t('profile.cancel', 'Abbrechen')}
                  </Button>
                  <Button colorScheme="brand" onClick={handleSave}>
                    {t('profile.saveChanges', 'Änderungen speichern')}
                  </Button>
                </Flex>
              </VStack>
            ) : (
              <SimpleGrid columns={{base: 1, md: 2}} spacing={6}>
                <Stat>
                  <StatLabel>{t('profile.name', 'Name')}</StatLabel>
                  <StatNumber fontSize="md">{user?.name || '-'}</StatNumber>
                </Stat>
                
                <Stat>
                  <StatLabel>{t('profile.age', 'Alter')}</StatLabel>
                  <StatNumber fontSize="md">{user?.age || '-'}</StatNumber>
                </Stat>
                
                <Stat>
                  <StatLabel>{t('profile.height', 'Größe')}</StatLabel>
                  <StatNumber fontSize="md">{user?.height || '-'} cm</StatNumber>
                </Stat>
                
                <Stat>
                  <StatLabel>{t('profile.weight', 'Gewicht')}</StatLabel>
                  <StatNumber fontSize="md">{user?.weight || '-'} kg</StatNumber>
                </Stat>
                
                <Stat>
                  <StatLabel>{t('profile.gender', 'Geschlecht')}</StatLabel>
                  <StatNumber fontSize="md">
                    {user?.gender === 'male' ? t('profile.male', 'Männlich') : 
                     user?.gender === 'female' ? t('profile.female', 'Weiblich') : 
                     t('profile.diverse', 'Divers')}
                  </StatNumber>
                </Stat>
                
                <Stat>
                  <StatLabel>{t('profile.activityLevel', 'Aktivitätslevel')}</StatLabel>
                  <StatNumber fontSize="md">
                    {user?.activityLevel === 'sedentary' ? t('profile.sedentary', 'Sitzend (wenig Bewegung)') :
                     user?.activityLevel === 'light' ? t('profile.light', 'Leicht aktiv (1-2x Sport/Woche)') :
                     user?.activityLevel === 'moderate' ? t('profile.moderate', 'Moderat aktiv (3-5x Sport/Woche)') :
                     user?.activityLevel === 'active' ? t('profile.active', 'Sehr aktiv (6-7x Sport/Woche)') :
                     t('profile.veryActive', 'Extrem aktiv (2x täglich Training)')}
                  </StatNumber>
                </Stat>
                
                <Stat gridColumn={{md: 'span 2'}}>
                  <StatLabel>{t('profile.dietaryPreferences', 'Ernährungspräferenzen')}</StatLabel>
                  <Box mt={2}>
                    {user?.dietaryPreferences && user.dietaryPreferences.length > 0 ? (
                      <Flex wrap="wrap" gap={2}>
                        {user.dietaryPreferences.map((pref) => (
                          <Tag key={pref} colorScheme="brand" size="md">
                            {pref === 'vegetarian' ? t('profile.vegetarian', 'Vegetarisch') :
                             pref === 'vegan' ? t('profile.vegan', 'Vegan') :
                             pref === 'glutenFree' ? t('profile.glutenFree', 'Glutenfrei') :
                             pref === 'lactoseFree' ? t('profile.lactoseFree', 'Laktosefrei') :
                             pref === 'lowCarb' ? t('profile.lowCarb', 'Low Carb') :
                             pref === 'highProtein' ? t('profile.highProtein', 'High Protein') : pref}
                          </Tag>
                        ))}
                      </Flex>
                    ) : (
                      <Text color="gray.500">-</Text>
                    )}
                  </Box>
                </Stat>
              </SimpleGrid>
            )}
          </TabPanel>
          
          {/* Ziele */}
          <TabPanel>
            {isEditing ? (
              <VStack spacing={6} align="stretch">
                <FormControl>
                  <FormLabel>{t('profile.targetWeight', 'Zielgewicht')} (kg)</FormLabel>
                  <NumberInput 
                    min={30} 
                    max={300} 
                    precision={1}
                    step={0.1}
                    value={formValues.targetWeight}
                    onChange={(valueString: string) => handleInputChange('targetWeight', parseFloat(valueString))}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
                
                <Box>
                  <FormLabel mb={3}>{t('profile.fitnessGoals', 'Fitnessziele')}</FormLabel>
                  <CheckboxGroup
                    colorScheme="brand"
                    value={formValues.goals}
                    onChange={(value: string[]) => handleInputChange('goals', value)}
                  >
                    <SimpleGrid columns={{base: 1, sm: 2}} spacing={2}>
                      <Checkbox value="weightLoss">{t('profile.weightLoss', 'Gewichtsverlust')}</Checkbox>
                      <Checkbox value="muscleGain">{t('profile.muscleGain', 'Muskelaufbau')}</Checkbox>
                      <Checkbox value="maintenance">{t('profile.maintenance', 'Gewichtserhaltung')}</Checkbox>
                      <Checkbox value="healthyEating">{t('profile.healthyEating', 'Gesunde Ernährung')}</Checkbox>
                      <Checkbox value="energy">{t('profile.energy', 'Mehr Energie')}</Checkbox>
                      <Checkbox value="performance">{t('profile.performance', 'Sportliche Leistung')}</Checkbox>
                    </SimpleGrid>
                  </CheckboxGroup>
                </Box>
                
                <Divider my={4} />
                
                <Heading size="md" mb={3}>{t('profile.nutritionGoals', 'Ernährungsziele')}</Heading>
                
                <Box mb={6}>
                  <Heading size="md" mb={4}>{t('profile.nutritionGoals', 'Ernährungsziele')}</Heading>
                  
                  <Button 
                    leftIcon={<FiRefreshCw />} 
                    colorScheme="brand" 
                    onClick={recalculateNutritionGoals}
                    mb={4}
                  >
                    {t('profile.recalculateGoals', 'Ziele neu berechnen')}
                  </Button>
                  
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mt={4}>
                    <FormControl>
                      <FormLabel>{t('profile.calorieGoal', 'Kalorienziel')} (kcal)</FormLabel>
                      <NumberInput 
                        min={500} 
                        max={5000} 
                        step={50}
                        value={formValues.calorieGoal}
                        onChange={(valueString: string) => handleInputChange('calorieGoal', parseInt(valueString))}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel>{t('profile.proteinGoal', 'Proteinziel')} (g)</FormLabel>
                      <NumberInput 
                        min={30} 
                        max={300} 
                        step={5}
                        value={formValues.proteinGoal}
                        onChange={(valueString: string) => handleInputChange('proteinGoal', parseInt(valueString))}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel>{t('profile.carbGoal', 'Kohlenhydrateziel')} (g)</FormLabel>
                      <NumberInput 
                        min={50} 
                        max={500} 
                        step={5}
                        value={formValues.carbGoal}
                        onChange={(valueString: string) => handleInputChange('carbGoal', parseInt(valueString))}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel>{t('profile.fatGoal', 'Fettziel')} (g)</FormLabel>
                      <NumberInput 
                        min={20} 
                        max={200} 
                        step={5}
                        value={formValues.fatGoal}
                        onChange={(valueString: string) => handleInputChange('fatGoal', parseInt(valueString))}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel>{t('profile.waterGoal', 'Wasserziel')} (ml)</FormLabel>
                      <NumberInput 
                        min={500} 
                        max={5000} 
                        step={100}
                        value={formValues.waterGoal}
                        onChange={(valueString: string) => handleInputChange('waterGoal', parseInt(valueString))}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>
                  </SimpleGrid>
                </Box>
                
                <Flex justifyContent="flex-end" mt={4}>
                  <Button mr={3} onClick={handleCancel}>
                    {t('profile.cancel', 'Abbrechen')}
                  </Button>
                  <Button colorScheme="brand" onClick={handleSave}>
                    {t('profile.saveChanges', 'Änderungen speichern')}
                  </Button>
                </Flex>
              </VStack>
            ) : (
              <Box>
                <SimpleGrid columns={{base: 1, md: 2}} spacing={6} mb={8}>
                  <Stat>
                    <StatLabel>{t('profile.currentWeight', 'Aktuelles Gewicht')}</StatLabel>
                    <StatNumber fontSize="md">{user?.weight || '-'} kg</StatNumber>
                  </Stat>
                  
                  <Stat>
                    <StatLabel>{t('profile.targetWeight', 'Zielgewicht')}</StatLabel>
                    <StatNumber fontSize="md">{user?.targetWeight || '-'} kg</StatNumber>
                  </Stat>
                </SimpleGrid>
                
                {/* Anzeige der Fitnessziele */}
                <Box mb={8}>
                  <Heading size="sm" mb={3}>{t('profile.fitnessGoals', 'Fitnessziele')}</Heading>
                  {user?.goals && user.goals.length > 0 ? (
                    <Flex wrap="wrap" gap={2}>
                      {user.goals.map((goal) => (
                        <Tag key={goal} colorScheme="green" size="md">
                          {goal === 'weightLoss' ? t('profile.weightLoss', 'Gewichtsverlust') :
                           goal === 'muscleGain' ? t('profile.muscleGain', 'Muskelaufbau') :
                           goal === 'maintenance' ? t('profile.maintenance', 'Gewichtserhaltung') :
                           goal === 'healthyEating' ? t('profile.healthyEating', 'Gesunde Ernährung') :
                           goal === 'energy' ? t('profile.energy', 'Mehr Energie') :
                           goal === 'performance' ? t('profile.performance', 'Sportliche Leistung') : goal}
                        </Tag>
                      ))}
                    </Flex>
                  ) : (
                    <Text color="gray.500">-</Text>
                  )}
                </Box>
                
                {/* Anzeige der Ernährungsziele */}
                <Heading size="sm" mb={4}>{t('profile.nutritionGoals', 'Ernährungsziele')}</Heading>
                
                {/* Kalorien-Ziel mit Erklärung */}
                <Box mb={6} p={4} bg={nutritionGreenBg} borderRadius="md">
                  <Flex justify="space-between" align="center">
                    <Box>
                      <Heading size="sm" color={nutritionGreenText}>
                        {t('profile.calorieGoal', 'Tägliches Kalorienziel')}
                      </Heading>
                      <Text fontSize="2xl" fontWeight="bold" mt={1}>
                        {user?.calorieGoal || '-'} kcal
                      </Text>
                    </Box>
                    
                    <Box w="50%" fontSize="sm" color={nutritionGrayText}>
                      {t('profile.calorieExplanation', 'Basierend auf deinem Grundumsatz, Aktivitätslevel und persönlichen Zielen. Dieser Wert wurde für dich optimiert.')}
                    </Box>
                  </Flex>
                </Box>
                
                {/* Makronährstoffe mit Erklärung */}
                <SimpleGrid columns={{base: 1, md: 3}} spacing={6} mb={4}>
                  <Stat bg={proteinBg} p={3} borderRadius="md">
                    <StatLabel>{t('profile.proteinGoal', 'Protein')}</StatLabel>
                    <StatNumber fontSize="xl">{user?.proteinGoal || '-'} g</StatNumber>
                    <Text fontSize="xs" mt={1}>{t('profile.proteinExplanation', 'Wichtig für Muskelaufbau und -erhalt')}</Text>
                  </Stat>
                  
                  <Stat bg={carbBg} p={3} borderRadius="md">
                    <StatLabel>{t('profile.carbGoal', 'Kohlenhydrate')}</StatLabel>
                    <StatNumber fontSize="xl">{user?.carbGoal || '-'} g</StatNumber>
                    <Text fontSize="xs" mt={1}>{t('profile.carbExplanation', 'Hauptenergiequelle für Körper und Gehirn')}</Text>
                  </Stat>
                  
                  <Stat bg={fatBg} p={3} borderRadius="md">
                    <StatLabel>{t('profile.fatGoal', 'Fett')}</StatLabel>
                    <StatNumber fontSize="xl">{user?.fatGoal || '-'} g</StatNumber>
                    <Text fontSize="xs" mt={1}>{t('profile.fatExplanation', 'Wichtig für Hormone und Nährstoffaufnahme')}</Text>
                  </Stat>
                </SimpleGrid>
                
                {/* Wasserziel */}
                <Stat bg={waterBg} p={4} borderRadius="md" mb={6}>
                  <StatLabel>{t('profile.waterGoal', 'Tägliches Wasserziel')}</StatLabel>
                  <Flex align="center" justify="space-between">
                    <StatNumber fontSize="xl">{user?.waterGoal || '-'} ml</StatNumber>
                    <Text fontSize="sm">{t('profile.waterExplanation', 'Ca. 30ml pro kg Körpergewicht für optimale Hydration')}</Text>
                  </Flex>
                </Stat>
                
                {/* Zusätzliche Informationen zur Berechnung der Ernährungsziele */}
                <Box mt={4} p={4} bg={infoBg} borderRadius="md" borderLeft="4px solid" borderColor="brand.400">
                  <Heading size="xs" mb={2} color="brand.500">{t('profile.nutritionCalculation', 'Berechnungsgrundlage')}</Heading>
                  <Text fontSize="sm">
                    {t('profile.calculationInfo', 'Die Ziele wurden aus deinen persönlichen Daten (Alter, Gewicht, Größe, Aktivitätslevel) und ausgewählten Fitness- und Ernährungszielen automatisch berechnet. Diese Werte sind wissenschaftlich fundierte Empfehlungen.')}
                  </Text>
                  
                  <Text fontSize="sm" mt={2}>
                    {user?.weight !== user?.targetWeight ? 
                      (user?.weight || 0) > (user?.targetWeight || 0) ?
                        t('profile.weightLossInfo', 'Für dein Gewichtsreduktionsziel wurde ein angemessenes Kaloriendefizit berechnet.') :
                        t('profile.weightGainInfo', 'Für dein Gewichtszunahmeziel wurde ein angemessenes Kalorienplus berechnet.')
                      : t('profile.weightMaintenanceInfo', 'Deine Werte wurden für die Erhaltung deines aktuellen Gewichts optimiert.')}
                  </Text>
                </Box>
              </Box>
            )}
          </TabPanel>
          
          {/* Gewichtsverlauf */}
          <TabPanel>
            <Box mb={6}>
              <Heading size="md" mb={4}>{t('profile.weightTracking', 'Gewichtstracking')}</Heading>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <WeightEntryForm />
                <WeightHistoryList />
              </SimpleGrid>
            </Box>
          </TabPanel>
          
          {/* Einstellungen */}
          <TabPanel>
            {isEditing ? (
              <VStack spacing={6} align="stretch">
                <FormControl>
                  <FormLabel>{t('profile.language', 'Sprache')}</FormLabel>
                  <Select 
                    value={formValues.language} 
                    onChange={(e) => handleInputChange('language', e.target.value)}
                  >
                    <option value="de">{t('profile.german', 'Deutsch')}</option>
                    <option value="en">{t('profile.english', 'Englisch')}</option>
                  </Select>
                </FormControl>
                
                <Flex justifyContent="flex-end" mt={4}>
                  <Button mr={3} onClick={handleCancel}>
                    {t('profile.cancel', 'Abbrechen')}
                  </Button>
                  <Button colorScheme="brand" onClick={handleSave}>
                    {t('profile.saveChanges', 'Änderungen speichern')}
                  </Button>
                </Flex>
              </VStack>
            ) : (
              <VStack spacing={6} align="stretch">
                <SimpleGrid columns={{base: 1, md: 2}} spacing={6}>
                  <Stat>
                    <StatLabel>{t('profile.language', 'Sprache')}</StatLabel>
                    <StatNumber fontSize="md">
                      {user?.language === 'de' ? t('profile.german', 'Deutsch') : 
                       user?.language === 'en' ? t('profile.english', 'Englisch') : '-'}
                    </StatNumber>
                  </Stat>
                </SimpleGrid>
                
                <Divider my={4} />
                
                <Box>
                  <Heading size="md" mb={4}>{t('profile.dataManagement', 'Datenverwaltung')}</Heading>
                  <Text mb={4}>
                    {t('profile.dataBackupInfo', 'Sichere deine Daten oder stelle sie auf einem anderen Gerät wieder her.')}
                  </Text>
                  <Button 
                    leftIcon={<FiDatabase />} 
                    colorScheme="blue" 
                    onClick={onBackupModalOpen}
                    mb={2}
                  >
                    {t('profile.backupRestore', 'Daten sichern & wiederherstellen')}
                  </Button>
                </Box>
              </VStack>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
      
      {/* Backup/Restore Modal */}
      <BackupRestoreModal isOpen={isBackupModalOpen} onClose={onBackupModalClose} />
    </Container>
  );
};

export default ProfilePage;

// Definition der neuen Komponenten nach dem ProfilePage
const WeightEntryForm = () => {
  const { t } = useTranslation();
  const { user, updateUser } = useUser();
  const [weight, setWeight] = useState<number | string>('');
  const [note, setNote] = useState<string>('');
  const toast = useToast();
  const formBg = useColorModeValue('white', 'gray.700');
  
  const handleAddWeight = () => {
    if (!weight || parseFloat(weight.toString()) <= 0) {
      toast({
        title: t('profile.invalidWeight', 'Ungültiges Gewicht'),
        description: t('profile.enterValidWeight', 'Bitte gib ein gültiges Gewicht ein.'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    // Neuer Gewichtseintrag
    const newEntry = {
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD Format
      weight: parseFloat(weight.toString()),
      note: note.trim() || undefined
    };
    
    // Kopiere die vorhandene Historie oder initialisiere sie als leeres Array
    const weightHistory = user?.weightHistory ? [...user.weightHistory] : [];
    
    // Prüfe, ob bereits ein Eintrag für heute existiert
    const todayEntryIndex = weightHistory.findIndex(entry => entry.date === newEntry.date);
    
    if (todayEntryIndex >= 0) {
      // Aktualisiere den heutigen Eintrag
      weightHistory[todayEntryIndex] = newEntry;
    } else {
      // Füge einen neuen Eintrag hinzu
      weightHistory.unshift(newEntry); // Am Anfang hinzufügen (neuster Eintrag zuerst)
    }
    
    // Aktualisiere den Benutzer mit der neuen Gewichtshistorie
    updateUser({
      weightHistory,
      weight: newEntry.weight // Aktualisiere auch das aktuelle Gewicht
    });
    
    // Rücksetzen der Formularfelder
    setWeight('');
    setNote('');
    
    toast({
      title: t('profile.weightAdded', 'Gewicht hinzugefügt'),
      description: t('profile.weightAddedSuccess', 'Dein Gewichtseintrag wurde erfolgreich gespeichert.'),
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };
  
  return (
    <Box p={6} bg={formBg} borderRadius="lg" boxShadow="md">
      <Heading size="sm" mb={4}>{t('profile.addWeightEntry', 'Neuen Gewichtseintrag hinzufügen')}</Heading>
      
      <VStack spacing={4} align="stretch">
        <FormControl>
          <FormLabel>{t('profile.weight', 'Gewicht')} (kg)</FormLabel>
          <NumberInput 
            min={30} 
            max={300} 
            precision={1}
            step={0.1}
            value={weight}
            onChange={(valueString) => setWeight(valueString)}
          >
            <NumberInputField placeholder={String(t('profile.weightPlaceholder', 'z.B. 75.5'))} />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
        
        <FormControl>
          <FormLabel>{t('profile.note', 'Notiz')} ({t('profile.optional', 'optional')})</FormLabel>
          <Input 
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={String(t('profile.notePlaceholder', 'z.B. Nach dem Urlaub'))}
          />
        </FormControl>
        
        <Button 
          colorScheme="brand" 
          leftIcon={<FiActivity />}
          onClick={handleAddWeight}
          isDisabled={!weight}
          mt={2}
        >
          {t('profile.addWeight', 'Gewicht hinzufügen')}
        </Button>
      </VStack>
    </Box>
  );
};

const WeightHistoryList = () => {
  const { t } = useTranslation();
  const { user } = useUser();
  const tableBg = useColorModeValue('white', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.600');
  
  // Wir verwenden nur tatsächliche Benutzerdaten
  const weightEntries = user?.weightHistory || [];
  
  if (weightEntries.length === 0) {
    return (
      <Box bg={tableBg} borderRadius="lg" boxShadow="md" p={6} textAlign="center">
        <Icon as={FiActivity} color="gray.300" boxSize={8} mb={3} />
        <Text>{t('profile.noWeightData', 'Keine Gewichtsdaten vorhanden')}</Text>
        <Text fontSize="sm" color="gray.500" mt={2}>
          {String(t('profile.startTrackingWeight', 'Beginne mit der Aufzeichnung deines Gewichts, um deinen Fortschritt zu sehen.'))}
        </Text>
      </Box>
    );
  }
  
  return (
    <Box bg={tableBg} borderRadius="lg" boxShadow="md" overflow="hidden">
      <Heading size="sm" p={4} borderBottomWidth="1px">{t('profile.weightHistory', 'Gewichtsverlauf')}</Heading>
      
      <Table variant="simple" size="sm">
        <Thead>
          <Tr>
            <Th>{t('profile.date', 'Datum')}</Th>
            <Th>{t('profile.weight', 'Gewicht')}</Th>
            <Th>{t('profile.change', 'Veränderung')}</Th>
            <Th>{t('profile.note', 'Notiz')}</Th>
          </Tr>
        </Thead>
        <Tbody>
          {weightEntries.map((entry, index) => {
            const prevWeight = index < weightEntries.length - 1 ? weightEntries[index + 1].weight : entry.weight;
            const change = entry.weight - prevWeight;
            const changeText = change === 0 ? '±0' : change > 0 ? `+${change.toFixed(1)}` : `${change.toFixed(1)}`;
            const changeColor = change === 0 ? 'gray.500' : change > 0 ? 'red.500' : 'green.500';
            
            return (
              <Tr key={entry.date} _hover={{ bg: hoverBg }}>
                <Td fontWeight={index === 0 ? "bold" : "normal"}>{entry.date}</Td>
                <Td fontWeight={index === 0 ? "bold" : "normal"}>{entry.weight} kg</Td>
                <Td color={changeColor} fontWeight="medium">
                  <Flex align="center">
                    {change !== 0 && (
                      <Icon 
                        as={change > 0 ? FiArrowUp : FiArrowDown} 
                        boxSize={3} 
                        mr={1} 
                      />
                    )}
                    {changeText} kg
                  </Flex>
                </Td>
                <Td color="gray.600" fontSize="sm">{entry.note || '-'}</Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </Box>
  );
};