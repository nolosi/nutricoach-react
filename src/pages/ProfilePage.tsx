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
import { FiUser, FiSettings, FiTarget, FiEdit, FiLogOut, FiRefreshCw, FiActivity, FiArrowUp, FiArrowDown, FiDatabase, FiTrendingUp } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { 
  calculateNutritionGoals, 
  NutritionInputData 
} from '../utils/nutritionCalculator';
import { recalculateAndUpdateNutritionGoals } from '../contexts/UserContext';
import BackupRestoreModal from '../components/BackupRestoreModal';

// Definition der Hilfskomponenten vor dem ProfilePage
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
        title: t('profile.invalidWeight', 'Ung├╝ltiges Gewicht'),
        description: t('profile.enterValidWeight', 'Bitte gib ein g├╝ltiges Gewicht ein.'),
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
    
    // Pr├╝fe, ob bereits ein Eintrag f├╝r heute existiert
    const todayEntryIndex = weightHistory.findIndex(entry => entry.date === newEntry.date);
    
    if (todayEntryIndex >= 0) {
      // Aktualisiere den heutigen Eintrag
      weightHistory[todayEntryIndex] = newEntry;
    } else {
      // F├╝ge einen neuen Eintrag hinzu
      weightHistory.unshift(newEntry); // Am Anfang hinzuf├╝gen (neuster Eintrag zuerst)
    }
    
    // Aktualisiere den Benutzer mit der neuen Gewichtshistorie
    updateUser({
      weightHistory,
      weight: newEntry.weight // Aktualisiere auch das aktuelle Gewicht
    });
    
    // R├╝cksetzen der Formularfelder
    setWeight('');
    setNote('');
    
    toast({
      title: t('profile.weightAdded', 'Gewicht hinzugef├╝gt'),
      description: t('profile.weightAddedSuccess', 'Dein Gewichtseintrag wurde erfolgreich gespeichert.'),
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };
  
  return (
    <Box p={6} bg={formBg} borderRadius="lg" boxShadow="md">
      <Heading size="sm" mb={4}>{t('profile.addWeightEntry', 'Neuen Gewichtseintrag hinzuf├╝gen')}</Heading>
      
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
          {t('profile.addWeight', 'Gewicht hinzuf├╝gen')}
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
  
  // Wir verwenden nur tats├ñchliche Benutzerdaten
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
            <Th>{t('profile.change', 'Ver├ñnderung')}</Th>
            <Th>{t('profile.note', 'Notiz')}</Th>
          </Tr>
        </Thead>
        <Tbody>
          {weightEntries.map((entry, index) => {
            const prevWeight = index < weightEntries.length - 1 ? weightEntries[index + 1].weight : entry.weight;
            const change = entry.weight - prevWeight;
            const changeText = change === 0 ? '┬▒0' : change > 0 ? `+${change.toFixed(1)}` : `${change.toFixed(1)}`;
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
  
  // Farbwerte f├╝r light/dark mode - fr├╝her bedingt aufgerufen
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
  
  // Formularwerte f├╝r die Bearbeitung
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
  
  // Handle f├╝r Formular├ñnderungen
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
    
    // Sprache ├ñndern, wenn notwendig
    if (user?.language !== formValues.language) {
      i18n.changeLanguage(formValues.language);
    }
    
    // Ern├ñhrungsziele neu berechnen, wenn relevante Daten ge├ñndert wurden
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
          age: formValues.age,
          weight: formValues.weight,
          height: formValues.height,
          activityLevel: formValues.activityLevel as "moderate" | "sedentary" | "light" | "active" | "very_active",
          weightGoal: 'maintain' // Standard-Wert, kann sp├ñter angepasst werden
        };
        
        const newGoals = calculateNutritionGoals(inputData);
        
        // Aktualisiere die Ern├ñhrungsziele
        updateUser({
          calorieGoal: newGoals.calorieGoal,
          proteinGoal: newGoals.proteinGoal,
          carbGoal: newGoals.carbGoal,
          fatGoal: newGoals.fatGoal,
          waterGoal: newGoals.waterGoal
        });
        
        // Aktualisiere auch die Formularwerte
        setFormValues(prev => ({
          ...prev,
          calorieGoal: newGoals.calorieGoal,
          proteinGoal: newGoals.proteinGoal,
          carbGoal: newGoals.carbGoal,
          fatGoal: newGoals.fatGoal,
          waterGoal: newGoals.waterGoal
        }));
      }
    }
    
    toast({
      title: t('profile.savedSuccess', '├änderungen gespeichert'),
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };
  
  // Abbrechen der Bearbeitung
  const handleCancel = () => {
    // Zur├╝cksetzen der Formularwerte auf die aktuellen Benutzerdaten
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
  
  // Abmelden
  const handleLogout = () => {
    clearUser();
    onClose();
    
    toast({
      title: t('profile.logoutSuccess', 'Abmeldung erfolgreich'),
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    
    navigate('/onboarding');
  };
  
  // Ern├ñhrungsziele neu berechnen
  const recalculateNutritionGoals = () => {
    if (!user?.weight || !user?.height || !user?.age || !user?.gender) {
      toast({
        title: t('profile.missingData', 'Fehlende Daten'),
        description: t('profile.completeProfileFirst', 'Bitte vervollst├ñndige zuerst dein Profil.'),
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    const inputData: NutritionInputData = {
      gender: user.gender,
      age: user.age,
      weight: user.weight,
      height: user.height,
      activityLevel: user.activityLevel as "moderate" | "sedentary" | "light" | "active" | "very_active" || 'moderate',
      weightGoal: 'maintain' // Standard-Wert, kann sp├ñter angepasst werden
    };
    
    const newGoals = calculateNutritionGoals(inputData);
    
    // Aktualisiere die Ern├ñhrungsziele
    updateUser({
      calorieGoal: newGoals.calorieGoal,
      proteinGoal: newGoals.proteinGoal,
      carbGoal: newGoals.carbGoal,
      fatGoal: newGoals.fatGoal,
      waterGoal: newGoals.waterGoal
    });
    
    toast({
      title: t('profile.goalsUpdated', 'Ern├ñhrungsziele aktualisiert'),
      description: t('profile.goalsRecalculated', 'Deine Ern├ñhrungsziele wurden basierend auf deinen Profildaten neu berechnet.'),
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };
  
  // Formularwerte f├╝r Ern├ñhrungspr├ñferenzen aktualisieren
  const handleDietaryPreferencesChange = (values: string[]) => {
    handleInputChange('dietaryPreferences', values);
  };
  
  // Formularwerte f├╝r Fitnessziele aktualisieren
  const handleGoalsChange = (values: string[]) => {
    handleInputChange('goals', values);
  };

  return (
    <Container maxW="container.md" py={6}>
      <Flex direction="column" align="center" mb={6}>
        <Heading as="h1" size="lg" mb={2}>
          {t('nav.profile')}
        </Heading>
        <Text color="gray.600" _dark={{ color: "gray.400" }} textAlign="center">
          {t('profile.pageDescription', 'Verwalte deine pers├Ânlichen Daten und Einstellungen.')}
        </Text>
      </Flex>
      
      {/* Profil-Header */}
      <Box 
        bg={bgColor} 
        borderRadius="lg" 
        boxShadow="md" 
        p={4} 
        mb={4}
      >
        <Flex 
          direction={{ base: "column", md: "row" }} 
          align={{ base: "center", md: "center" }}
          justify="space-between"
        >
          <Flex align="center" mb={{ base: 3, md: 0 }}>
            <Avatar 
              size="lg" 
              name={user?.name} 
              src={user?.avatar} 
              mr={3}
              bg="green.500"
              color="white"
              fontSize="xl"
            />
            <Box>
              <Heading size="md">{user?.name || t('profile.anonymous', 'Anonym')}</Heading>
              <HStack mt={1} spacing={1}>
                <Badge colorScheme="green" fontSize="xs">Level {user?.level || 1}</Badge>
                <Badge colorScheme="purple" fontSize="xs">{user?.experiencePoints || 0} XP</Badge>
              </HStack>
              <Text fontSize="xs" color="gray.500" mt={1}>
                {t('profile.joinedDate', `Dabei seit ${new Date().toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })}`)}
              </Text>
            </Box>
          </Flex>
          
          <HStack spacing={1} mt={{ base: 2, md: 0 }}>
            {!isEditing ? (
              <Button 
                leftIcon={<FiEdit />} 
                onClick={() => setIsEditing(true)}
                colorScheme="green"
                variant="outline"
                size="sm"
              >
                {t('profile.edit', 'Bearbeiten')}
              </Button>
            ) : (
              <>
                <Button 
                  onClick={handleCancel}
                  variant="outline"
                  colorScheme="gray"
                  size="sm"
                >
                  {t('profile.cancel', 'Abbrechen')}
                </Button>
                <Button 
                  colorScheme="green" 
                  onClick={handleSave}
                  size="sm"
                >
                  {t('profile.saveChanges', '├änderungen speichern')}
                </Button>
              </>
            )}
            <Button
              leftIcon={<FiLogOut />}
              onClick={onOpen}
              variant="ghost"
              colorScheme="red"
              size="sm"
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
              {t('profile.logoutConfirm', 'Abmelden best├ñtigen')}
            </AlertDialogHeader>

            <AlertDialogBody>
              {t('profile.logoutQuestion', 'M├Âchtest du dich wirklich abmelden?')}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose} size="sm">
                {t('profile.cancel', 'Abbrechen')}
              </Button>
              <Button colorScheme="red" onClick={handleLogout} ml={3} size="sm">
                {t('profile.logout', 'Abmelden')}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      
      {/* Neue Struktur ohne Tabs */}
      <Box>
        {/* Pers├Ânliche Daten */}
        <Box 
          bg={bgColor} 
          borderRadius="lg" 
          boxShadow="md" 
          p={4} 
          mb={4}
        >
          <Flex justify="space-between" align="center" mb={3}>
            <Heading size="md">
              <Flex align="center">
                <Icon as={FiUser} mr={2} />
                {t('profile.personalData', 'Pers├Ânliche Daten')}
              </Flex>
            </Heading>
          </Flex>
          
          {isEditing ? (
            <VStack spacing={6} align="stretch">
              <SimpleGrid columns={{base: 1, md: 2}} spacing={6}>
                <FormControl>
                  <FormLabel>{t('profile.name', 'Name')}</FormLabel>
                  <Input 
                    value={formValues.name} 
                    onChange={(e) => handleInputChange('name', e.target.value)} 
                    bg="white"
                    _dark={{ bg: "gray.800", borderColor: "gray.600" }}
                    borderColor="gray.300"
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel>{t('profile.age', 'Alter')}</FormLabel>
                  <NumberInput 
                    min={1} 
                    max={120} 
                    value={formValues.age}
                    onChange={(valueString: string) => handleInputChange('age', parseInt(valueString))}
                    bg="white"
                    _dark={{ bg: "gray.800", borderColor: "gray.600" }}
                    borderColor="gray.300"
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
                
                <FormControl>
                  <FormLabel>{t('profile.height', 'Gr├Â├ƒe')} (cm)</FormLabel>
                  <NumberInput 
                    min={50} 
                    max={250} 
                    value={formValues.height}
                    onChange={(valueString: string) => handleInputChange('height', parseInt(valueString))}
                    bg="white"
                    _dark={{ bg: "gray.800", borderColor: "gray.600" }}
                    borderColor="gray.300"
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
                    bg="white"
                    _dark={{ bg: "gray.800", borderColor: "gray.600" }}
                    borderColor="gray.300"
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
                    bg="white"
                    _dark={{ bg: "gray.800", borderColor: "gray.600" }}
                    borderColor="gray.300"
                  >
                    <option value="male">{t('profile.male', 'M├ñnnlich')}</option>
                    <option value="female">{t('profile.female', 'Weiblich')}</option>
                    <option value="diverse">{t('profile.diverse', 'Divers')}</option>
                  </Select>
                </FormControl>
                
                <FormControl>
                  <FormLabel>{t('profile.activityLevel', 'Aktivit├ñtslevel')}</FormLabel>
                  <Select 
                    value={formValues.activityLevel} 
                    onChange={(e) => handleInputChange('activityLevel', e.target.value)}
                    bg="white"
                    _dark={{ bg: "gray.800", borderColor: "gray.600" }}
                    borderColor="gray.300"
                  >
                    <option value="sedentary">{t('profile.sedentary', 'Sitzend (wenig Bewegung)')}</option>
                    <option value="light">{t('profile.light', 'Leicht aktiv (1-2x Sport/Woche)')}</option>
                    <option value="moderate">{t('profile.moderate', 'Moderat aktiv (3-5x Sport/Woche)')}</option>
                    <option value="active">{t('profile.active', 'Sehr aktiv (6-7x Sport/Woche)')}</option>
                    <option value="very_active">{t('profile.veryActive', 'Extrem aktiv (2x t├ñglich Training)')}</option>
                  </Select>
                </FormControl>
              </SimpleGrid>
              
              <Box>
                <FormLabel mb={3}>{t('profile.dietaryPreferences', 'Ern├ñhrungspr├ñferenzen')}</FormLabel>
                <CheckboxGroup
                  colorScheme="green"
                  value={formValues.dietaryPreferences}
                  onChange={(value: string[]) => handleDietaryPreferencesChange(value)}
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
                <StatLabel>{t('profile.height', 'Gr├Â├ƒe')}</StatLabel>
                <StatNumber fontSize="md">{user?.height || '-'} cm</StatNumber>
              </Stat>
              
              <Stat>
                <StatLabel>{t('profile.weight', 'Gewicht')}</StatLabel>
                <StatNumber fontSize="md">{user?.weight || '-'} kg</StatNumber>
              </Stat>
              
              <Stat>
                <StatLabel>{t('profile.gender', 'Geschlecht')}</StatLabel>
                <StatNumber fontSize="md">
                  {user?.gender === 'male' ? t('profile.male', 'M├ñnnlich') : 
                   user?.gender === 'female' ? t('profile.female', 'Weiblich') : 
                   t('profile.diverse', 'Divers')}
                </StatNumber>
              </Stat>
              
              <Stat>
                <StatLabel>{t('profile.activityLevel', 'Aktivit├ñtslevel')}</StatLabel>
                <StatNumber fontSize="md">
                  {user?.activityLevel === 'sedentary' ? t('profile.sedentary', 'Sitzend (wenig Bewegung)') :
                   user?.activityLevel === 'light' ? t('profile.light', 'Leicht aktiv (1-2x Sport/Woche)') :
                   user?.activityLevel === 'moderate' ? t('profile.moderate', 'Moderat aktiv (3-5x Sport/Woche)') :
                   user?.activityLevel === 'active' ? t('profile.active', 'Sehr aktiv (6-7x Sport/Woche)') :
                   t('profile.veryActive', 'Extrem aktiv (2x t├ñglich Training)')}
                </StatNumber>
              </Stat>
              
              <Stat gridColumn={{md: 'span 2'}}>
                <StatLabel>{t('profile.dietaryPreferences', 'Ern├ñhrungspr├ñferenzen')}</StatLabel>
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
        </Box>
        
        {/* Ern├ñhrungsziele */}
        <Box 
          bg={bgColor} 
          borderRadius="lg" 
          boxShadow="md" 
          p={4} 
          mb={4}
        >
          <Flex justify="space-between" align="center" mb={3}>
            <Heading size="md">
              <Flex align="center">
                <Icon as={FiTarget} mr={2} />
                {t('profile.nutritionGoals', 'Ern├ñhrungsziele')}
              </Flex>
            </Heading>
            
            {!isEditing && (
              <Button 
                leftIcon={<FiRefreshCw />} 
                colorScheme="green" 
                onClick={recalculateNutritionGoals}
                size="sm"
              >
                {t('profile.recalculateGoals', 'Neu berechnen')}
              </Button>
            )}
          </Flex>
          
          {isEditing ? (
            <VStack spacing={6} align="stretch">
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <FormControl>
                  <FormLabel>{t('profile.calorieGoal', 'Kalorienziel')} (kcal)</FormLabel>
                  <NumberInput 
                    min={500} 
                    max={5000} 
                    step={50}
                    value={formValues.calorieGoal}
                    onChange={(valueString: string) => handleInputChange('calorieGoal', parseInt(valueString))}
                    bg="white"
                    _dark={{ bg: "gray.800", borderColor: "gray.600" }}
                    borderColor="gray.300"
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
                    bg="white"
                    _dark={{ bg: "gray.800", borderColor: "gray.600" }}
                    borderColor="gray.300"
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
                    bg="white"
                    _dark={{ bg: "gray.800", borderColor: "gray.600" }}
                    borderColor="gray.300"
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
                    bg="white"
                    _dark={{ bg: "gray.800", borderColor: "gray.600" }}
                    borderColor="gray.300"
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
                    bg="white"
                    _dark={{ bg: "gray.800", borderColor: "gray.600" }}
                    borderColor="gray.300"
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
                
                <FormControl>
                  <FormLabel>{t('profile.targetWeight', 'Zielgewicht')} (kg)</FormLabel>
                  <NumberInput 
                    min={30} 
                    max={300} 
                    precision={1}
                    step={0.1}
                    value={formValues.targetWeight}
                    onChange={(valueString: string) => handleInputChange('targetWeight', parseFloat(valueString))}
                    bg="white"
                    _dark={{ bg: "gray.800", borderColor: "gray.600" }}
                    borderColor="gray.300"
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
              </SimpleGrid>
              
              <Box>
                <FormLabel mb={3}>{t('profile.fitnessGoals', 'Fitnessziele')}</FormLabel>
                <CheckboxGroup
                  colorScheme="green"
                  value={formValues.goals}
                  onChange={(value: string[]) => handleGoalsChange(value)}
                >
                  <SimpleGrid columns={{base: 1, sm: 2}} spacing={2}>
                    <Checkbox value="weightLoss">{t('profile.weightLoss', 'Gewichtsverlust')}</Checkbox>
                    <Checkbox value="muscleGain">{t('profile.muscleGain', 'Muskelaufbau')}</Checkbox>
                    <Checkbox value="maintenance">{t('profile.maintenance', 'Gewichtserhaltung')}</Checkbox>
                    <Checkbox value="healthyEating">{t('profile.healthyEating', 'Gesunde Ern├ñhrung')}</Checkbox>
                    <Checkbox value="energy">{t('profile.energy', 'Mehr Energie')}</Checkbox>
                    <Checkbox value="performance">{t('profile.performance', 'Sportliche Leistung')}</Checkbox>
                  </SimpleGrid>
                </CheckboxGroup>
              </Box>
            </VStack>
          ) : (
            <Box>
              {/* Kalorien-Ziel mit Erkl├ñrung */}
              <Box mb={6} p={4} bg={nutritionGreenBg} borderRadius="md">
                <Flex justify="space-between" align="center">
                  <Box>
                    <Heading size="sm" color={nutritionGreenText}>
                      {t('profile.calorieGoal', 'T├ñgliches Kalorienziel')}
                    </Heading>
                    <Text fontSize="2xl" fontWeight="bold" mt={1}>
                      {user?.calorieGoal || '-'} kcal
                    </Text>
                  </Box>
                  
                  <Box w="50%" fontSize="sm" color={nutritionGrayText}>
                    {t('profile.calorieExplanation', 'Basierend auf deinem Grundumsatz, Aktivit├ñtslevel und pers├Ânlichen Zielen. Dieser Wert wurde f├╝r dich optimiert.')}
                  </Box>
                </Flex>
              </Box>
              
              {/* Makron├ñhrstoffe mit Erkl├ñrung */}
              <SimpleGrid columns={{base: 1, md: 3}} spacing={6} mb={4}>
                <Stat bg={proteinBg} p={3} borderRadius="md">
                  <StatLabel>{t('profile.proteinGoal', 'Protein')}</StatLabel>
                  <StatNumber fontSize="xl">{user?.proteinGoal || '-'} g</StatNumber>
                  <Text fontSize="xs" mt={1}>{t('profile.proteinExplanation', 'Wichtig f├╝r Muskelaufbau und -erhalt')}</Text>
                </Stat>
                
                <Stat bg={carbBg} p={3} borderRadius="md">
                  <StatLabel>{t('profile.carbGoal', 'Kohlenhydrate')}</StatLabel>
                  <StatNumber fontSize="xl">{user?.carbGoal || '-'} g</StatNumber>
                  <Text fontSize="xs" mt={1}>{t('profile.carbExplanation', 'Hauptenergiequelle f├╝r K├Ârper und Gehirn')}</Text>
                </Stat>
                
                <Stat bg={fatBg} p={3} borderRadius="md">
                  <StatLabel>{t('profile.fatGoal', 'Fett')}</StatLabel>
                  <StatNumber fontSize="xl">{user?.fatGoal || '-'} g</StatNumber>
                  <Text fontSize="xs" mt={1}>{t('profile.fatExplanation', 'Wichtig f├╝r Hormone und N├ñhrstoffaufnahme')}</Text>
                </Stat>
              </SimpleGrid>
              
              {/* Wasserziel */}
              <Stat bg={waterBg} p={4} borderRadius="md" mb={6}>
                <StatLabel>{t('profile.waterGoal', 'T├ñgliches Wasserziel')}</StatLabel>
                <Flex align="center" justify="space-between">
                  <StatNumber fontSize="xl">{user?.waterGoal || '-'} ml</StatNumber>
                  <Text fontSize="sm">{t('profile.waterExplanation', 'Ca. 30ml pro kg K├Ârpergewicht f├╝r optimale Hydration')}</Text>
                </Flex>
              </Stat>
              
              {/* Gewichtsziele */}
              <SimpleGrid columns={{base: 1, md: 2}} spacing={6} mb={6}>
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
              <Box mb={4}>
                <Heading size="sm" mb={3}>{t('profile.fitnessGoals', 'Fitnessziele')}</Heading>
                {user?.goals && user.goals.length > 0 ? (
                  <Flex wrap="wrap" gap={2}>
                    {user.goals.map((goal) => (
                      <Tag key={goal} colorScheme="green" size="md">
                        {goal === 'weightLoss' ? t('profile.weightLoss', 'Gewichtsverlust') :
                         goal === 'muscleGain' ? t('profile.muscleGain', 'Muskelaufbau') :
                         goal === 'maintenance' ? t('profile.maintenance', 'Gewichtserhaltung') :
                         goal === 'healthyEating' ? t('profile.healthyEating', 'Gesunde Ern├ñhrung') :
                         goal === 'energy' ? t('profile.energy', 'Mehr Energie') :
                         goal === 'performance' ? t('profile.performance', 'Sportliche Leistung') : goal}
                      </Tag>
                    ))}
                  </Flex>
                ) : (
                  <Text color="gray.500">-</Text>
                )}
              </Box>
            </Box>
          )}
        </Box>
        
        {/* Gewichtsverlauf */}
        <Box 
          bg={bgColor} 
          borderRadius="lg" 
          boxShadow="md" 
          p={4} 
          mb={4}
        >
          <Flex justify="space-between" align="center" mb={3}>
            <Heading size="md">
              <Flex align="center">
                <Icon as={FiTrendingUp} mr={2} />
                {t('profile.weightHistory', 'Gewichtsverlauf')}
              </Flex>
            </Heading>
          </Flex>
          
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <WeightEntryForm />
            <WeightHistoryList />
          </SimpleGrid>
        </Box>
        
        {/* Einstellungen */}
        <Box 
          bg={bgColor} 
          borderRadius="lg" 
          boxShadow="md" 
          p={4} 
          mb={4}
        >
          <Flex justify="space-between" align="center" mb={3}>
            <Heading size="md">
              <Flex align="center">
                <Icon as={FiSettings} mr={2} />
                {t('profile.settings', 'Einstellungen')}
              </Flex>
            </Heading>
          </Flex>
          
          {isEditing ? (
            <VStack spacing={6} align="stretch">
              <FormControl>
                <FormLabel>{t('profile.language', 'Sprache')}</FormLabel>
                <Select 
                  value={formValues.language} 
                  onChange={(e) => handleInputChange('language', e.target.value)}
                  bg="white"
                  _dark={{ bg: "gray.800", borderColor: "gray.600" }}
                  borderColor="gray.300"
                >
                  <option value="de">{t('profile.german', 'Deutsch')}</option>
                  <option value="en">{t('profile.english', 'Englisch')}</option>
                </Select>
              </FormControl>
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
                  {t('profile.dataBackupInfo', 'Sichere deine Daten oder stelle sie auf einem anderen Ger├ñt wieder her.')}
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
        </Box>
      </Box>
      
      {/* Backup/Restore Modal */}
      <BackupRestoreModal isOpen={isBackupModalOpen} onClose={onBackupModalClose} />
    </Container>
  );
};

export default ProfilePage;
