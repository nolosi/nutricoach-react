import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Select,
  Checkbox,
  CheckboxGroup,
  SimpleGrid,
  Progress,
  useToast,
  Flex,
  Divider,
  IconButton,
  Image,
  useColorModeValue,
  RadioGroup,
  Radio,
  Stack,
  Switch,
  Card,
  CardBody,
  Textarea,
  Icon,
  Tag,
  TagLabel,
  TagLeftIcon,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useBreakpointValue,
  Center,
  useDisclosure
} from '@chakra-ui/react';
import { FiArrowRight, FiArrowLeft, FiUser, FiTarget, FiActivity, FiHeart, FiCheck, FiUpload } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { useUser } from '../contexts/UserContext';
import { 
  calculateNutritionGoals, 
  NutritionInputData, 
  NutritionGoals,
  calculateBMR,
  calculateCalorieGoal,
  calculateBurnCalorieGoal
} from '../utils/nutritionCalculator';
// @ts-ignore
import { v4 as uuidv4 } from 'uuid';
import BackupRestoreModal from '../components/BackupRestoreModal';

// Begrüßungskomponente
const WelcomeStep: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  const { t } = useTranslation();
  const bgColor = useColorModeValue('brand.50', 'gray.800');
  const navigate = useNavigate();
  
  // Für das Backup/Restore Modal
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  // Callback für erfolgreichen Import
  const handleImportSuccess = () => {
    // Nach erfolgreichem Import direkt zur Hauptseite navigieren
    navigate('/');
  };
  
  return (
    <VStack spacing={8} textAlign="center" py={8}>
      <Box>
        <Heading as="h1" size="xl" mb={4} color="brand.500">
          {t('onboarding.welcome', 'Willkommen bei NutriCoach!')}
        </Heading>
        <Text fontSize="lg">
          {t('onboarding.intro', 'Dein persönlicher Ernährungsassistent für einen gesünderen Lebensstil.')}
        </Text>
      </Box>
      
      <Box 
        bg={bgColor} 
        p={6} 
        borderRadius="lg" 
        boxShadow="md" 
        maxW="md" 
        w="100%"
      >
        <VStack spacing={4}>
          <Image 
            src="/assets/images/logo.png"
            alt="NutriCoach Logo" 
            fallbackSrc="https://via.placeholder.com/150?text=NutriCoach"
            width="180px"
            height="180px"
            objectFit="contain"
            mb={2}
          />
          <Text>
            {t('onboarding.setupPrompt', 'Lass uns dein Profil einrichten, damit wir die App perfekt auf deine Bedürfnisse anpassen können.')}
          </Text>
        </VStack>
      </Box>
      
      <VStack spacing={4} width="100%" maxW="md">
        <Button 
          rightIcon={<FiArrowRight />} 
          colorScheme="brand" 
          size="lg" 
          width="100%"
          onClick={onNext}
        >
          {t('onboarding.getStarted', 'Loslegen')}
        </Button>
        
        <Text fontSize="sm" color="gray.500" mt={2}>
          {t('onboarding.alreadyHaveBackup', 'Du hast bereits ein Backup deiner Daten?')}
        </Text>
        
        <Button 
          leftIcon={<FiUpload />} 
          variant="outline" 
          colorScheme="blue"
          size="md"
          width="100%"
          onClick={onOpen}
        >
          {t('onboarding.importBackup', 'Backup importieren')}
        </Button>
      </VStack>
      
      {/* Backup/Restore Modal */}
      <BackupRestoreModal 
        isOpen={isOpen} 
        onClose={onClose} 
        defaultTab={1} // Öffne direkt den Import-Tab
        onImportSuccess={handleImportSuccess}
      />
    </VStack>
  );
};

// Persönliche Daten
const PersonalInfoStep: React.FC<{ 
  onNext: () => void, 
  onBack: () => void,
  formData: any,
  setFormData: React.Dispatch<React.SetStateAction<any>>
}> = ({ onNext, onBack, formData, setFormData }) => {
  const { t } = useTranslation();
  
  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };
  
  // Validierung vor dem Fortfahren
  const canProceed = () => {
    return (
      formData.name.trim() !== '' && 
      formData.age > 0 && 
      formData.height > 0 && 
      formData.weight > 0 &&
      formData.gender !== ''
    );
  };
  
  return (
    <VStack spacing={6} w="100%" maxW="md">
      <Heading size="lg">{t('onboarding.personalInfo', 'Persönliche Informationen')}</Heading>
      <Text textAlign="center" color="gray.500">
        {t('onboarding.personalInfoDesc', 'Diese Informationen helfen uns, personalisierte Ernährungsempfehlungen zu erstellen.')}
      </Text>
      
      <FormControl isRequired>
        <FormLabel>{t('profile.name', 'Name')}</FormLabel>
        <Input 
          value={formData.name} 
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder={t('onboarding.namePlaceholder', 'Dein Name') as string}
        />
      </FormControl>
      
      <FormControl isRequired>
        <FormLabel>{t('profile.age', 'Alter')}</FormLabel>
        <NumberInput 
          min={1} 
          max={120} 
          value={formData.age}
          onChange={(valueString) => handleChange('age', parseInt(valueString))}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </FormControl>
      
      <FormControl isRequired>
        <FormLabel>{t('profile.gender', 'Geschlecht')}</FormLabel>
        <Select 
          placeholder={t('onboarding.selectGender', 'Wähle dein Geschlecht') as string}
          value={formData.gender} 
          onChange={(e) => handleChange('gender', e.target.value)}
        >
          <option value="male">{t('profile.male', 'Männlich')}</option>
          <option value="female">{t('profile.female', 'Weiblich')}</option>
          <option value="diverse">{t('profile.other', 'Divers')}</option>
        </Select>
      </FormControl>
      
      <SimpleGrid columns={2} spacing={4} w="100%">
        <FormControl isRequired>
          <FormLabel>{t('profile.height', 'Größe')} (cm)</FormLabel>
          <NumberInput 
            min={50} 
            max={250} 
            value={formData.height}
            onChange={(valueString) => handleChange('height', parseInt(valueString))}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
        
        <FormControl isRequired>
          <FormLabel>{t('profile.weight', 'Gewicht')} (kg)</FormLabel>
          <NumberInput 
            min={20} 
            max={300} 
            precision={1}
            step={0.1}
            value={formData.weight}
            onChange={(valueString) => handleChange('weight', parseFloat(valueString))}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
      </SimpleGrid>
      
      <HStack spacing={4} pt={4} w="100%" justifyContent="space-between">
        <Button leftIcon={<FiArrowLeft />} onClick={onBack} variant="outline">
          {t('common.back', 'Zurück')}
        </Button>
        <Button 
          rightIcon={<FiArrowRight />} 
          colorScheme="brand" 
          onClick={onNext}
          isDisabled={!canProceed()}
        >
          {t('common.next', 'Weiter')}
        </Button>
      </HStack>
    </VStack>
  );
};

// Aktivitätslevel und Zielgewicht
const ActivityGoalsStep: React.FC<{ 
  onNext: () => void, 
  onBack: () => void,
  formData: any,
  setFormData: React.Dispatch<React.SetStateAction<any>>
}> = ({ onNext, onBack, formData, setFormData }) => {
  const { t } = useTranslation();
  
  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };
  
  // Validierung vor dem Fortfahren
  const canProceed = () => {
    return (
      formData.activityLevel !== '' && 
      formData.targetWeight > 0
    );
  };
  
  return (
    <VStack spacing={6} w="100%" maxW="md">
      <Heading size="lg">{t('onboarding.activityGoals', 'Aktivität & Ziele')}</Heading>
      <Text textAlign="center" color="gray.500">
        {t('onboarding.activityGoalsDesc', 'Deine Aktivität und Ziele helfen uns, deine täglichen Kalorienbedürfnisse zu berechnen.')}
      </Text>
      
      <FormControl isRequired>
        <FormLabel>{t('profile.activityLevel', 'Aktivitätslevel')}</FormLabel>
        <Select 
          placeholder={t('onboarding.selectActivity', 'Wähle dein Aktivitätslevel') as string}
          value={formData.activityLevel} 
          onChange={(e) => handleChange('activityLevel', e.target.value)}
        >
          <option value="sedentary">{t('profile.sedentary', 'Sitzend (wenig Bewegung)')}</option>
          <option value="light">{t('profile.light', 'Leichte Aktivität (1-2x Sport/Woche)')}</option>
          <option value="moderate">{t('profile.moderate', 'Moderat aktiv (3-5x Sport/Woche)')}</option>
          <option value="active">{t('profile.active', 'Sehr aktiv (6-7x Sport/Woche)')}</option>
          <option value="very-active">{t('profile.veryActive', 'Extrem aktiv (2x täglich Training)')}</option>
        </Select>
      </FormControl>
      
      <FormControl isRequired>
        <FormLabel>{t('profile.targetWeight', 'Zielgewicht')} (kg)</FormLabel>
        <NumberInput 
          min={20} 
          max={300} 
          precision={1}
          step={0.1}
          value={formData.targetWeight}
          onChange={(valueString) => handleChange('targetWeight', parseFloat(valueString))}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </FormControl>
      
      <HStack spacing={4} pt={4} w="100%" justifyContent="space-between">
        <Button leftIcon={<FiArrowLeft />} onClick={onBack} variant="outline">
          {t('common.back', 'Zurück')}
        </Button>
        <Button 
          rightIcon={<FiArrowRight />} 
          colorScheme="brand" 
          onClick={onNext}
          isDisabled={!canProceed()}
        >
          {t('common.next', 'Weiter')}
        </Button>
      </HStack>
    </VStack>
  );
};

// Ernährungspräferenzen
const NutritionPreferencesStep: React.FC<{ 
  onNext: () => void, 
  onBack: () => void,
  formData: any,
  setFormData: React.Dispatch<React.SetStateAction<any>>
}> = ({ onNext, onBack, formData, setFormData }) => {
  const { t } = useTranslation();
  
  // Entfernen der nicht verwendeten Handler
  // Einfache direkte Toggle-Funktionen
  const toggleDietaryPreference = (value: string) => {
    console.log('Toggling dietary preference:', value);
    const currentPreferences = [...(formData.dietaryPreferences || [])];
    const newPreferences = currentPreferences.includes(value)
      ? currentPreferences.filter(pref => pref !== value)
      : [...currentPreferences, value];
    
    console.log('New preferences:', newPreferences);
    setFormData({ ...formData, dietaryPreferences: newPreferences });
  };
  
  const toggleGoal = (value: string) => {
    console.log('Toggling goal:', value);
    const currentGoals = [...(formData.goals || [])];
    const newGoals = currentGoals.includes(value)
      ? currentGoals.filter(goal => goal !== value)
      : [...currentGoals, value];
    
    console.log('New goals:', newGoals);
    setFormData({ ...formData, goals: newGoals });
  };
  
  // Custom Checkbox Component
  const CustomCheckbox = ({ value, label, isChecked, onChange }: { 
    value: string, 
    label: string, 
    isChecked: boolean, 
    onChange: () => void 
  }) => {
    return (
      <Box 
        as="label" 
        display="flex" 
        alignItems="center" 
        p={3}
        borderRadius="md"
        cursor="pointer"
        bg={isChecked ? 'rgba(106, 191, 75, 0.1)' : 'transparent'}
        _hover={{ bg: 'rgba(106, 191, 75, 0.05)' }}
        border="1px solid"
        borderColor={isChecked ? 'brand.500' : 'gray.200'}
        mb={2}
      >
        <input 
          type="checkbox" 
          checked={isChecked}
          onChange={onChange}
          style={{ marginRight: '10px' }}
        />
        <Text fontWeight={isChecked ? 'bold' : 'normal'}>{label}</Text>
      </Box>
    );
  };
  
  return (
    <VStack spacing={6} w="100%" maxW="md">
      <Heading size="lg">{t('onboarding.nutritionPreferences', 'Ernährungspräferenzen')}</Heading>
      <Text textAlign="center" color="gray.500">
        {t('onboarding.nutritionPreferencesDesc', 'Teile uns deine Ernährungspräferenzen und Ziele mit, damit wir dir passende Rezepte und Tipps vorschlagen können.')}
      </Text>
      
      <FormControl>
        <FormLabel>{t('profile.dietaryPreferences', 'Ernährungspräferenzen')}</FormLabel>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <CustomCheckbox 
            value="vegetarian"
            label={t('profile.vegetarian', 'Vegetarisch')}
            isChecked={formData.dietaryPreferences?.includes('vegetarian')}
            onChange={() => toggleDietaryPreference('vegetarian')}
          />
          <CustomCheckbox 
            value="vegan"
            label={t('profile.vegan', 'Vegan')}
            isChecked={formData.dietaryPreferences?.includes('vegan')}
            onChange={() => toggleDietaryPreference('vegan')}
          />
          <CustomCheckbox 
            value="glutenFree"
            label={t('profile.glutenFree', 'Glutenfrei')}
            isChecked={formData.dietaryPreferences?.includes('glutenFree')}
            onChange={() => toggleDietaryPreference('glutenFree')}
          />
          <CustomCheckbox 
            value="lactoseFree"
            label={t('profile.lactoseFree', 'Laktosefrei')}
            isChecked={formData.dietaryPreferences?.includes('lactoseFree')}
            onChange={() => toggleDietaryPreference('lactoseFree')}
          />
          <CustomCheckbox 
            value="lowCarb"
            label={t('profile.lowCarb', 'Low Carb')}
            isChecked={formData.dietaryPreferences?.includes('lowCarb')}
            onChange={() => toggleDietaryPreference('lowCarb')}
          />
          <CustomCheckbox 
            value="highProtein"
            label={t('profile.highProtein', 'High Protein')}
            isChecked={formData.dietaryPreferences?.includes('highProtein')}
            onChange={() => toggleDietaryPreference('highProtein')}
          />
        </SimpleGrid>
      </FormControl>
      
      <FormControl>
        <FormLabel>{t('profile.fitnessGoals', 'Fitnessziele')}</FormLabel>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <CustomCheckbox 
            value="weightLoss"
            label={t('profile.weightLoss', 'Gewichtsverlust')}
            isChecked={formData.goals?.includes('weightLoss')}
            onChange={() => toggleGoal('weightLoss')}
          />
          <CustomCheckbox 
            value="muscleGain"
            label={t('profile.muscleGain', 'Muskelaufbau')}
            isChecked={formData.goals?.includes('muscleGain')}
            onChange={() => toggleGoal('muscleGain')}
          />
          <CustomCheckbox 
            value="maintenance"
            label={t('profile.maintenance', 'Gewichtserhaltung')}
            isChecked={formData.goals?.includes('maintenance')}
            onChange={() => toggleGoal('maintenance')}
          />
          <CustomCheckbox 
            value="healthyEating"
            label={t('profile.healthyEating', 'Gesunde Ernährung')}
            isChecked={formData.goals?.includes('healthyEating')}
            onChange={() => toggleGoal('healthyEating')}
          />
          <CustomCheckbox 
            value="energy"
            label={t('profile.energy', 'Mehr Energie')}
            isChecked={formData.goals?.includes('energy')}
            onChange={() => toggleGoal('energy')}
          />
          <CustomCheckbox 
            value="performance"
            label={t('profile.performance', 'Sportliche Leistung')}
            isChecked={formData.goals?.includes('performance')}
            onChange={() => toggleGoal('performance')}
          />
        </SimpleGrid>
      </FormControl>
      
      <HStack spacing={4} pt={4} w="100%" justifyContent="space-between">
        <Button leftIcon={<FiArrowLeft />} onClick={onBack} variant="outline">
          {t('common.back', 'Zurück')}
        </Button>
        <Button 
          rightIcon={<FiArrowRight />} 
          colorScheme="brand" 
          onClick={onNext}
        >
          {t('common.next', 'Weiter')}
        </Button>
      </HStack>
    </VStack>
  );
};

// Ernährungsziele
const NutritionGoalsStep: React.FC<{ 
  onNext: () => void, 
  onBack: () => void,
  formData: any,
  setFormData: React.Dispatch<React.SetStateAction<any>>
}> = ({ onNext, onBack, formData, setFormData }) => {
  const { t } = useTranslation();
  // Alle Hooks am Anfang der Komponente deklarieren
  const infoBoxBg = useColorModeValue('gray.50', 'gray.700');
  const chartBg = useColorModeValue('gray.50', 'gray.700');
  const calorieBoxBg = useColorModeValue('green.50', 'green.900');
  const burnBoxBg = useColorModeValue('orange.50', 'orange.900');
  const statBg = useColorModeValue('blue.50', 'blue.800');
  
  // State für Zielbeschreibungen
  const [goalDescriptions, setGoalDescriptions] = useState({
    calorieGoal: '',
    proteinGoal: '',
    carbGoal: '',
    fatGoal: '',
    waterGoal: ''
  });
  
  // Berechne die Ernährungsziele basierend auf den Nutzerdaten
  const handleNutritionGoalsNext = () => {
    // Berechne die Ernährungsziele basierend auf den Nutzerdaten
    const inputData: NutritionInputData = {
      weight: Number(formData.weight || 70),
      height: Number(formData.height || 170),
      age: formData.birthday ? calculateAge(new Date(formData.birthday)) : 30,
      gender: formData.gender as 'male' | 'female' | 'diverse',
      activityLevel: mapActivityLevel(formData.activityLevel || 'moderate') as 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active',
      weightGoal: formData.weight > formData.targetWeight ? 'lose' : 
                 formData.weight < formData.targetWeight ? 'gain' : 'maintain'
    };
    
    const goals = calculateNutritionGoals(inputData);
    
    setFormData((prev: any) => ({
      ...prev,
      calorieGoal: goals.calorieGoal,
      proteinGoal: goals.proteinGoal,
      carbGoal: goals.carbGoal,
      fatGoal: goals.fatGoal,
      waterGoal: goals.waterGoal,
      burnCalorieGoal: goals.burnCalorieGoal,
      nutritionDetails: {
        bmr: calculateBMR(inputData),
        tdee: calculateCalorieGoal(inputData),
        activityDescription: getActivityDescription(inputData.activityLevel),
        goalDescription: getGoalDescription(inputData.weightGoal),
        additionalBurnRequired: calculateBurnCalorieGoal(inputData)
      }
    }));

    // Aktualisiere auch die Beschreibungen für die Ziele
    setGoalDescriptions((prev: any) => ({
      ...prev,
      calorieGoal: `${goals.calorieGoal} kcal täglich basierend auf Ihrem ${formData.weight}kg Gewicht, ${formData.height}cm Größe, Alter und Aktivitätslevel.`,
      proteinGoal: `${goals.proteinGoal}g Protein täglich für Muskelerhalt und -aufbau.`,
      carbGoal: `${goals.carbGoal}g Kohlenhydrate für Ihre tägliche Energie.`,
      fatGoal: `${goals.fatGoal}g gesunde Fette für Hormonproduktion und Nährstoffaufnahme.`,
      waterGoal: `${goals.waterGoal}ml Wasser täglich für optimale Hydration.`
    }));

    onNext();
  };
  
  // Berechne Ernährungsziele, wenn sie noch nicht gesetzt sind oder neu berechnet werden müssen
  useEffect(() => {
    // Springe diesen Schritt über, wenn die erforderlichen Daten nicht vorhanden sind
    if (!formData.weight || !formData.height || !formData.birthday || !formData.gender) {
      return;
    }
    
    // Alter aus Geburtsdatum berechnen
    const age = calculateAge(formData.birthday);
    
    const inputData: NutritionInputData = {
      gender: formData.gender as 'male' | 'female' | 'diverse',
      weight: formData.weight,
      height: formData.height,
      age: age,
      activityLevel: formData.activityLevel as any || 'moderate',
      weightGoal: formData.targetWeight < formData.weight ? 'lose' : 
                  formData.targetWeight > formData.weight ? 'gain' : 'maintain'
    };
    
    // Berechnung der Ernährungsziele
    const goals = calculateNutritionGoals(inputData);
    
    setFormData((prev: any) => ({
      ...prev,
      age: age,
      calorieGoal: goals.calorieGoal,
      proteinGoal: goals.proteinGoal,
      carbGoal: goals.carbGoal,
      fatGoal: goals.fatGoal,
      waterGoal: goals.waterGoal,
      burnCalorieGoal: goals.burnCalorieGoal,
      nutritionDetails: {
        bmr: calculateBMR(inputData),
        tdee: calculateCalorieGoal(inputData),
        activityDescription: getActivityDescription(inputData.activityLevel),
        goalDescription: getGoalDescription(inputData.weightGoal),
        additionalBurnRequired: calculateBurnCalorieGoal(inputData)
      }
    }));
  }, [formData.weight, formData.height, formData.birthday, formData.gender, formData.activityLevel, formData.targetWeight, setFormData]);
  
  // Makronährstoffverteilung berechnen
  const totalCalories = formData.calorieGoal || 2000;
  const proteinCalories = (formData.proteinGoal || 150) * 4;
  const carbsCalories = (formData.carbGoal || 200) * 4;
  const fatCalories = (formData.fatGoal || 70) * 9;
  
  const proteinPercentage = Math.round((proteinCalories / totalCalories) * 100);
  const carbsPercentage = Math.round((carbsCalories / totalCalories) * 100);
  const fatPercentage = Math.round((fatCalories / totalCalories) * 100);
  
  // Zusätzliche Infos für die Zusammenfassung
  const weightDifferenceKg = Math.abs(formData.weight - formData.targetWeight).toFixed(1);
  const isWeightLoss = formData.weight > formData.targetWeight;
  const isWeightGain = formData.weight < formData.targetWeight;
  
  return (
    <VStack spacing={6} w="100%" maxW="md">
      <Heading size="lg">{t('onboarding.nutritionGoals', 'Ernährungsziele')}</Heading>
      <Text textAlign="center" color="gray.500">
        {t('onboarding.nutritionGoalsDesc', 'Basierend auf deinen Angaben haben wir folgende Ziele für dich berechnet:')}
      </Text>
      
      {/* Zusammenfassung der Ziele */}
      {isWeightLoss && (
        <Box 
          w="100%" 
          bg="orange.50" 
          borderLeft="4px solid" 
          borderColor="orange.400"
          p={4} 
          borderRadius="md"
        >
          <Heading size="sm" color="orange.600" mb={2}>
            {t('profile.weightLossGoal', 'Gewichtsabnahme: ')} {weightDifferenceKg} kg
          </Heading>
          <Text fontSize="sm">
            {t('profile.weightLossDesc', 'Dein Kalorienziel wurde angepasst, um eine gesunde Gewichtsabnahme zu unterstützen.')}
          </Text>
        </Box>
      )}
      
      {isWeightGain && (
        <Box 
          w="100%" 
          bg="blue.50" 
          borderLeft="4px solid" 
          borderColor="blue.400"
          p={4} 
          borderRadius="md"
        >
          <Heading size="sm" color="blue.600" mb={2}>
            {t('profile.weightGainGoal', 'Gewichtszunahme: ')} {weightDifferenceKg} kg
          </Heading>
          <Text fontSize="sm">
            {t('profile.weightGainDesc', 'Dein Kalorienziel wurde erhöht, um deine Gewichtszunahme zu unterstützen.')}
          </Text>
        </Box>
      )}
      
      {/* Neu: Grundverbrauch und zusätzlich zu verbrennende Kalorien */}
      {formData.nutritionDetails && (
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="100%">
          <Box 
            bg={calorieBoxBg}
            p={4} 
            borderRadius="md" 
            boxShadow="sm"
          >
            <Heading size="sm" mb={2}>{t('profile.bmrTitle', 'Dein Grundumsatz (BMR):')}</Heading>
            <Text fontSize="xl" fontWeight="bold">{Math.round(formData.nutritionDetails.bmr)} kcal</Text>
            <Text fontSize="sm" mt={1}>
              {t('profile.bmrDescription', 'Kalorien, die dein Körper in völliger Ruhe benötigt')}
            </Text>
          </Box>
          
          <Box 
            bg={calorieBoxBg}
            p={4} 
            borderRadius="md" 
            boxShadow="sm"
          >
            <Heading size="sm" mb={2}>{t('profile.tdeeTitle', 'Täglicher Gesamtumsatz:')}</Heading>
            <Text fontSize="xl" fontWeight="bold">{Math.round(formData.nutritionDetails.tdee)} kcal</Text>
            <Text fontSize="sm" mt={1}>
              {t('profile.tdeeDescription', 'Grundumsatz + Energie für tägliche Aktivitäten')}
            </Text>
          </Box>
        </SimpleGrid>
      )}
      
      {/* Zusätzlich zu verbrennende Kalorien bei Gewichtsabnahme */}
      {isWeightLoss && formData.nutritionDetails && formData.nutritionDetails.additionalBurnRequired > 0 && (
        <Box 
          bg={calorieBoxBg}
          p={4} 
          borderRadius="md" 
          boxShadow="sm"
          mt={4}
        >
          <Heading size="sm" mb={2}>{t('profile.burnTitle', 'Täglich zusätzlich zu verbrennen:')}</Heading>
          <Text fontSize="xl" fontWeight="bold">{formData.nutritionDetails.additionalBurnRequired} kcal</Text>
          <Text fontSize="sm" mt={1}>
            {formData.targetWeight < formData.weight
              ? t('profile.burnDescriptionLose', 'Diese Kalorien solltest du täglich durch körperliche Aktivität zusätzlich verbrennen, um dein Gewichtsreduktionsziel zu erreichen')
              : t('profile.burnDescription', 'Diese Kalorien solltest du täglich durch körperliche Aktivität verbrennen, um deine allgemeine Fitness zu fördern (20% deines Kalorienziels)')}
          </Text>
        </Box>
      )}
      
      {formData.nutritionDetails && (
        <Box 
          w="100%" 
          bg={infoBoxBg}
          p={4} 
          borderRadius="md" 
          fontSize="sm"
        >
          <VStack align="start" spacing={2}>
            <Text fontWeight="bold">{t('profile.calculationBased', 'Berechnung basierend auf:')}</Text>
            <Text>• {formData.nutritionDetails.activityDescription}</Text>
            <Text>• {formData.nutritionDetails.goalDescription}</Text>
            {formData.goals.length > 0 && (
              <Text>• {t('profile.selectedGoals', 'Ausgewählte Ziele')}: {formData.goals.join(', ')}</Text>
            )}
          </VStack>
        </Box>
      )}
      
      {/* Anzeige des Kalorienziels */}
      <Box 
        w="100%" 
        bg={calorieBoxBg}
        p={4} 
        borderRadius="md" 
        boxShadow="sm"
      >
        <Heading size="sm" mb={2}>{t('profile.calorieGoal', 'Kalorienziel:')}</Heading>
        <Text fontSize="xl" fontWeight="bold">{formData.calorieGoal} kcal</Text>
        <Text fontSize="sm" mt={1}>
          {t('profile.calorieExplanation', 'Tägliche Kalorienmenge für deine Ziele')}
        </Text>
      </Box>
      
      {/* Makronährstoffverteilung Visualisierung */}
      <Box w="100%" p={3} borderRadius="md" bg={chartBg}>
        <Text fontWeight="bold" mb={2}>{t('profile.macroDistribution', 'Nährstoffverteilung')}:</Text>
        <HStack w="100%" h="20px" borderRadius="full" overflow="hidden">
          <Box bg="red.400" w={`${proteinPercentage}%`} h="100%" />
          <Box bg="green.400" w={`${carbsPercentage}%`} h="100%" />
          <Box bg="blue.400" w={`${fatPercentage}%`} h="100%" />
        </HStack>
        <HStack mt={1} fontSize="xs" justify="space-between">
          <Text color="red.500">{t('profile.protein', 'Protein')}: {proteinPercentage}%</Text>
          <Text color="green.500">{t('profile.carbs', 'Kohlenhydrate')}: {carbsPercentage}%</Text>
          <Text color="blue.500">{t('profile.fat', 'Fett')}: {fatPercentage}%</Text>
        </HStack>
      </Box>
      
      {/* Makronährstoffe und Wasserziel als Cards */}
      <SimpleGrid columns={2} spacing={4} w="100%">
        <Box bg={statBg} p={3} borderRadius="md">
          <Text fontWeight="bold">{t('profile.proteinGoal', 'Protein:')}</Text>
          <Text fontSize="lg" fontWeight="bold">{formData.proteinGoal} g</Text>
          <Text fontSize="xs" mt={1}>{t('profile.proteinExplanation', 'Wichtig für Muskelaufbau')}</Text>
        </Box>
        
        <Box bg={statBg} p={3} borderRadius="md">
          <Text fontWeight="bold">{t('profile.waterGoal', 'Wasser:')}</Text>
          <Text fontSize="lg" fontWeight="bold">{formData.waterGoal} ml</Text>
          <Text fontSize="xs" mt={1}>{t('profile.waterExplanation', 'Für optimale Hydration')}</Text>
        </Box>
        
        <Box bg={statBg} p={3} borderRadius="md">
          <Text fontWeight="bold">{t('profile.carbGoal', 'Kohlenhydrate:')}</Text>
          <Text fontSize="lg" fontWeight="bold">{formData.carbGoal} g</Text>
          <Text fontSize="xs" mt={1}>{t('profile.carbExplanation', 'Energiequelle')}</Text>
        </Box>
        
        <Box bg={statBg} p={3} borderRadius="md">
          <Text fontWeight="bold">{t('profile.fatGoal', 'Fett:')}</Text>
          <Text fontSize="lg" fontWeight="bold">{formData.fatGoal} g</Text>
          <Text fontSize="xs" mt={1}>{t('profile.fatExplanation', 'Wichtig für Hormone')}</Text>
        </Box>
      </SimpleGrid>
      
      <Text fontSize="sm" color="gray.500" textAlign="center" mt={2}>
        {t('profile.goalsAdjustable', 'Du kannst diese Ziele später jederzeit in deinem Profil anpassen.')}
      </Text>
      
      <HStack spacing={4} pt={4} w="100%" justifyContent="space-between">
        <Button leftIcon={<FiArrowLeft />} onClick={onBack} variant="outline">
          {t('common.back', 'Zurück')}
        </Button>
        <Button 
          rightIcon={<FiArrowRight />} 
          colorScheme="brand" 
          onClick={handleNutritionGoalsNext}
        >
          {t('common.next', 'Weiter')}
        </Button>
      </HStack>
    </VStack>
  );
};

// Hilfsfunktionen für die Beschreibungen
const getActivityDescription = (activityLevel: string): string => {
  switch(activityLevel) {
    case 'sedentary': return 'Sitzende Tätigkeit mit wenig Bewegung';
    case 'light': return 'Leichte Aktivität (1-2x Sport pro Woche)';
    case 'moderate': return 'Moderate Aktivität (3-5x Sport pro Woche)';
    case 'active': return 'Hohe Aktivität (6-7x Sport pro Woche)';
    case 'very_active': return 'Sehr hohe Aktivität (2x täglich Training)';
    default: return 'Moderate Aktivität';
  }
};

const getGoalDescription = (weightGoal?: string): string => {
  switch(weightGoal) {
    case 'lose': return 'Gewichtsabnahme (500 kcal Defizit pro Tag)';
    case 'gain': return 'Gewichtszunahme (500 kcal Überschuss pro Tag)';
    default: return 'Gewichtserhaltung';
  }
};

// Appeinstellungen
const AppSettingsStep: React.FC<{ 
  onNext: () => void, 
  onBack: () => void,
  formData: any,
  setFormData: React.Dispatch<React.SetStateAction<any>>
}> = ({ onNext, onBack, formData, setFormData }) => {
  const { t } = useTranslation();
  
  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };
  
  return (
    <VStack spacing={6} w="100%" maxW="md">
      <Heading size="lg">{t('onboarding.appSettings', 'App-Einstellungen')}</Heading>
      <Text textAlign="center" color="gray.500">
        {t('onboarding.appSettingsDesc', 'Passe die App-Einstellungen nach deinen Präferenzen an.')}
      </Text>
      
      <FormControl>
        <FormLabel>{t('profile.language', 'Sprache')}</FormLabel>
        <Select 
          value={formData.language} 
          onChange={(e) => handleChange('language', e.target.value)}
        >
          <option value="de">{t('language.german', 'Deutsch')}</option>
          <option value="en">{t('language.english', 'Englisch')}</option>
          <option value="sq">{t('language.albanian', 'Albanisch')}</option>
        </Select>
      </FormControl>
      
      <FormControl display="flex" alignItems="center">
        <FormLabel htmlFor="darkMode" mb="0">
          {t('profile.darkMode', 'Dunkelmodus')}
        </FormLabel>
        <Switch 
          id="darkMode"
          isChecked={formData.darkMode}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('darkMode', e.target.checked)}
          colorScheme="brand"
        />
      </FormControl>
      
      <HStack spacing={4} pt={4} w="100%" justifyContent="space-between">
        <Button leftIcon={<FiArrowLeft />} onClick={onBack} variant="outline">
          {t('common.back', 'Zurück')}
        </Button>
        <Button 
          rightIcon={<FiCheck />} 
          colorScheme="brand" 
          onClick={onNext}
        >
          {t('onboarding.complete', 'Abschließen')}
        </Button>
      </HStack>
    </VStack>
  );
};

// Zusammenfassungsseite
const SummaryStep: React.FC<{ 
  onComplete: () => void, 
  onBack: () => void,
  formData: any 
}> = ({ onComplete, onBack, formData }) => {
  const { t } = useTranslation();
  const bgColor = useColorModeValue('white', 'gray.700');
  
  return (
    <VStack spacing={6} w="100%" maxW="lg">
      <Heading size="lg" color="brand.500">{t('onboarding.allSet', 'Alles bereit!')}</Heading>
      <Text textAlign="center">
        {t('onboarding.thankYou', 'Vielen Dank für deine Angaben. Dein NutriCoach-Profil ist jetzt eingerichtet.')}
      </Text>
      
      <Box 
        bg={bgColor} 
        p={6} 
        borderRadius="lg" 
        boxShadow="md"
        w="100%"
      >
        <SimpleGrid columns={{base: 1, md: 2}} spacing={4}>
          <Box>
            <Heading size="sm" mb={2}>{t('onboarding.personalInfoSummary', 'Persönliche Informationen')}</Heading>
            <Text>{t('profile.name', 'Name')}: {formData.name}</Text>
            <Text>{t('profile.age', 'Alter')}: {formData.age}</Text>
            <Text>{t('profile.gender', 'Geschlecht')}: {
              formData.gender === 'male' ? t('profile.male', 'Männlich') :
              formData.gender === 'female' ? t('profile.female', 'Weiblich') :
              t('profile.other', 'Divers')
            }</Text>
            <Text>{t('profile.height', 'Größe')}: {formData.height} cm</Text>
            <Text>{t('profile.weight', 'Gewicht')}: {formData.weight} kg</Text>
          </Box>
          
          <Box>
            <Heading size="sm" mb={2}>{t('onboarding.goalsSummary', 'Ziele')}</Heading>
            <Text>{t('profile.targetWeight', 'Zielgewicht')}: {formData.targetWeight} kg</Text>
            <Text>{t('profile.calorieGoal', 'Kalorienziel')}: {formData.calorieGoal} kcal</Text>
            <Text>{t('profile.proteinGoal', 'Protein')}: {formData.proteinGoal} g</Text>
            <Text>{t('profile.carbGoal', 'Kohlenhydrate')}: {formData.carbGoal} g</Text>
            <Text>{t('profile.fatGoal', 'Fett')}: {formData.fatGoal} g</Text>
            <Text>{t('profile.waterGoal', 'Wasser')}: {formData.waterGoal} ml</Text>
          </Box>
        </SimpleGrid>
      </Box>
      
      <HStack spacing={4} pt={4} w="100%" justifyContent="space-between">
        <Button leftIcon={<FiArrowLeft />} onClick={onBack} variant="outline">
          {t('common.back', 'Zurück')}
        </Button>
        <Button 
          rightIcon={<FiCheck />} 
          colorScheme="brand" 
          size="lg"
          onClick={onComplete}
        >
          {t('onboarding.startUsingApp', 'App jetzt nutzen')}
        </Button>
      </HStack>
    </VStack>
  );
};

// Funktion zum Berechnen des Alters aus dem Geburtsdatum
const calculateAge = (birthday: Date): number => {
  const today = new Date();
  let age = today.getFullYear() - birthday.getFullYear();
  const monthDiff = today.getMonth() - birthday.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthday.getDate())) {
    age--;
  }
  
  return age;
};

// Funktion zum Mappen des Aktivitätslevels
const mapActivityLevel = (level: string): string => {
  const activityMapping: Record<string, string> = {
    'sedentary': 'sedentary',
    'light': 'light',
    'moderate': 'moderate',
    'active': 'active',
    'very-active': 'very_active'
  };
  
  return activityMapping[level] || 'moderate';
};

// Hauptkomponente für die Onboarding-Seite
const OnboardingPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { updateUser } = useUser();
  const navigate = useNavigate();
  const toast = useToast();
  
  // Farbkonstante hier innerhalb der Komponente definieren
  const pageBackgroundColor = useColorModeValue('gray.50', 'gray.900');
  
  // Schritte des Onboardings
  const steps = [
    'welcome',
    'personalInfo',
    'activityGoals',
    'nutritionPreferences',
    'nutritionGoals',
    'appSettings',
    'summary'
  ];
  
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    age: 30,
    height: 170,
    weight: 70,
    targetWeight: 65,
    gender: '',
    activityLevel: '',
    goals: [] as string[],
    dietaryPreferences: [] as string[],
    calorieGoal: 2000,
    proteinGoal: 150,
    carbGoal: 200,
    fatGoal: 70,
    waterGoal: 2000,
    language: 'de',
    darkMode: false,
    calculatedDefaults: false,
  });
  
  // State für Zielbeschreibungen
  const [goalDescriptions, setGoalDescriptions] = useState({
    calorieGoal: '',
    proteinGoal: '',
    carbGoal: '',
    fatGoal: '',
    waterGoal: ''
  });
  
  // Navigiert zum nächsten Schritt
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };
  
  // Navigiert zum vorherigen Schritt
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };
  
  // Schließt das Onboarding ab und speichert die Daten
  const handleComplete = () => {
    // Sprache ändern, wenn ausgewählt
    if (formData.language && formData.language !== i18n.language) {
      i18n.changeLanguage(formData.language);
    }
    
    // Stellen Sie sicher, dass gender ein gültiger Wert ist
    const genderValue = (formData.gender === 'male' || formData.gender === 'female' || formData.gender === 'diverse') 
      ? formData.gender as 'male' | 'female' | 'diverse' 
      : 'diverse';
    
    // Stellen Sie sicher, dass language ein gültiger Wert ist
    const languageValue = (formData.language === 'de' || formData.language === 'en' || formData.language === 'sq') 
      ? formData.language as 'de' | 'en' | 'sq' 
      : 'de';
    
    // Benutzerdaten mit einer eindeutigen ID generieren und aktualisieren
    const userData = {
      id: Math.random().toString(36).substring(2, 15),
      ...formData,
      gender: genderValue,
      language: languageValue,
      onboardingCompleted: true,
      experiencePoints: 0,
      level: 1,
      unlockedBadges: [],
      completedChallenges: [],
      selectedCoach: 'coach1', // Standard-Coach
      joinDate: new Date().toISOString(), // Beitrittsdatum beim Onboarding setzen
    };
    
    updateUser(userData);
    
    toast({
      title: t('onboarding.profileCreated', 'Profil erstellt'),
      description: t('onboarding.welcomeMessage', 'Willkommen bei NutriCoach! Dein persönliches Profil wurde erstellt.'),
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
    
    // Zur Startseite navigieren
    navigate('/');
  };
  
  // Berechnet den Fortschritt in Prozent
  const progress = ((currentStep) / (steps.length - 1)) * 100;
  
  // Rendert den aktuellen Schritt
  const renderStep = () => {
    switch (currentStep) {
      case 0: // welcome
        return <WelcomeStep onNext={handleNext} />;
      case 1: // personalInfo
        return <PersonalInfoStep onNext={handleNext} onBack={handleBack} formData={formData} setFormData={setFormData} />;
      case 2: // activityGoals
        return <ActivityGoalsStep onNext={handleNext} onBack={handleBack} formData={formData} setFormData={setFormData} />;
      case 3: // nutritionPreferences
        return <NutritionPreferencesStep onNext={handleNext} onBack={handleBack} formData={formData} setFormData={setFormData} />;
      case 4: // nutritionGoals
        return <NutritionGoalsStep onNext={handleNext} onBack={handleBack} formData={formData} setFormData={setFormData} />;
      case 5: // appSettings
        return <AppSettingsStep onNext={handleNext} onBack={handleBack} formData={formData} setFormData={setFormData} />;
      case 6: // summary
        return <SummaryStep onComplete={handleComplete} onBack={handleBack} formData={formData} />;
      default:
        return null;
    }
  };
  
  return (
    <Box minH="100vh" bg={pageBackgroundColor}>
      {currentStep > 0 && (
        <Box bg="white" shadow="sm" py={2} position="sticky" top={0} zIndex={10}>
          <Container maxW="container.xl">
            <Progress value={progress} size="sm" colorScheme="brand" borderRadius="full" />
            <Text textAlign="center" fontSize="sm" mt={1} color="gray.500">
              {t('onboarding.step', 'Schritt')} {currentStep} {t('onboarding.of', 'von')} {steps.length - 1}
            </Text>
          </Container>
        </Box>
      )}
      
      <Container maxW="container.md" py={10} centerContent>
        {renderStep()}
      </Container>
    </Box>
  );
};

export default OnboardingPage; 