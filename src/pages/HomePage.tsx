import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  Icon,
  Image,
  Progress,
  SimpleGrid,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  useColorModeValue,
  Tooltip,
  CardHeader,
  HStack,
  Checkbox,
  Badge,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { FiCalendar, FiUser, FiActivity, FiList, FiBookOpen, FiCheckCircle, FiCoffee, FiDroplet, FiHeart, FiLayers, FiPieChart, FiChevronRight, FiAward } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { useUser, recalculateAndUpdateNutritionGoals } from '../contexts/UserContext';
import { Mission } from '../contexts/UserContext';
import CoachMessage from '../components/coach/CoachMessage';

// XP-Fortschrittsanzeige Komponente
const XpProgressBar: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useUser();
  const level = user?.level || 1;
  const xp = user?.experiencePoints || 0;
  const nextLevelXp = level * 100;
  const xpProgress = ((xp % 100) / 100) * 100; // Prozentsatz zum nächsten Level
  
  // Farben für Dark/Light Mode
  const cardBg = useColorModeValue('white', 'gray.800');
  const progressTrackBg = useColorModeValue('gray.100', 'gray.700');
  const levelBadgeBg = useColorModeValue('brand.500', 'brand.400');
  const levelBadgeColor = useColorModeValue('white', 'white');
  
  return (
    <Box p={4} bg={cardBg} borderRadius="lg" boxShadow="md" mb={6}>
      <Flex justify="space-between" align="center" mb={3}>
        <Heading size="md" display="flex" alignItems="center">
          <Icon as={FiAward} mr={2} color="brand.500" />
          {t('common.yourLevel', 'Dein Level')}
        </Heading>
        <Badge 
          colorScheme="brand" 
          p={2} 
          fontSize="md" 
          borderRadius="md"
          boxShadow="0px 2px 4px rgba(0,0,0,0.1)"
        >
          LEVEL {level}
        </Badge>
      </Flex>
      <Box position="relative" mb={2}>
        <Progress 
          value={xpProgress} 
          colorScheme="brand" 
          size="md" 
          borderRadius="full" 
          bg={progressTrackBg}
          sx={{
            '& > div': {
              background: 'linear-gradient(90deg, brand.400, brand.600)',
              transition: 'width 0.5s ease-in-out',
            }
          }}
        />
      </Box>
      <Flex justify="space-between" align="center">
        <Text fontWeight="bold" fontSize="sm">
          {xp} XP
        </Text>
        <Text color="gray.500">
          {t('gamification.nextLevel')}: {nextLevelXp} XP
        </Text>
      </Flex>
    </Box>
  );
};

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const { user, resetDailyMissions, completeDaily, updateUser, checkAndCompleteMissions } = useUser();
  const navigate = useNavigate();
  
  // Color mode values
  const cardBg = useColorModeValue('white', 'gray.800');
  const statBg = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const hoverBg = useColorModeValue('gray.100', 'gray.700');
  
  // Neue Color-Modus-Variablen für completed missions
  const completedMissionBg = useColorModeValue("green.50", "green.900");
  const completedMissionBorderColor = useColorModeValue("green.200", "green.700");
  const completedMissionShadow = useColorModeValue("0 0 0 1px green.200", "0 0 0 1px green.700");
  const completedBadgeBg = useColorModeValue("green.500", "green.400");
  const completedMissionTitleColor = useColorModeValue("green.600", "green.300");
  const completedMissionTextColor = useColorModeValue("green.500", "green.300");
  const completedCheckIconColor = useColorModeValue("green.500", "green.300");
  
  // Funktion zum Testen: Alle Missionen abschließen
  const completeAllMissions = () => {
    if (user && user.dailyMissions) {
      const updatedMissions = user.dailyMissions.map(mission => ({ ...mission, completed: true }));
      updateUser({ dailyMissions: updatedMissions });
    }
  };
  
  // Täglich zurücksetzen
  useEffect(() => {
    if (user && user.onboardingCompleted && (!user.dailyMissions || user.dailyMissions.length === 0)) {
      resetDailyMissions();
    }
  }, [user, resetDailyMissions]);
  
  // Ernährungsziele beim Laden der Seite neu berechnen
  useEffect(() => {
    if (user) {
      recalculateAndUpdateNutritionGoals(user, updateUser);
    }
  }, [user?.weight, user?.height, user?.age, user?.gender, user?.activityLevel, user?.weightGoal]);
  
  // Überprüfe und aktualisiere Missionen beim Laden der Seite
  useEffect(() => {
    if (user && user.onboardingCompleted) {
      checkAndCompleteMissions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkAndCompleteMissions]); // Nur von checkAndCompleteMissions abhängig, nicht von user, um Endlosschleifen zu vermeiden
  
  // Heutige Fortschritte mit tatsächlichen Werten
  const todayProgress = user?.dailyProgress || {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    water: 0
  };
  
  // Prozentsätze berechnen
  const caloriePercentage = user?.calorieGoal ? Math.min(100, Math.round((todayProgress.calories / user.calorieGoal) * 100)) : 0;
  const proteinPercentage = user?.proteinGoal ? Math.min(100, Math.round((todayProgress.protein / user.proteinGoal) * 100)) : 0;
  const waterPercentage = user?.waterGoal ? Math.min(100, Math.round((todayProgress.water / user.waterGoal) * 100)) : 0;
  const fatPercentage = user?.fatGoal ? Math.min(100, Math.round((todayProgress.fat / user.fatGoal) * 100)) : 0;

  // Prüfen, ob Onboarding abgeschlossen wurde
  const onboardingComplete = user?.onboardingCompleted;
  
  // Missionen aus dem UserContext verwenden
  const dailyMissions = user?.dailyMissions || [];

  // Funktion zum Navigieren basierend auf dem Missionstyp
  const handleMissionClick = (mission: Mission) => {
    if (mission.completed) return; // Keine Aktion, wenn die Mission bereits abgeschlossen ist
    
    switch (mission.requirements?.type) {
      case 'water':
        navigate('/track/water');
        break;
      case 'food':
        navigate('/meals');
        break;
      case 'protein':
        navigate('/nutrition-goals');
        break;
      case 'activity':
        // Bei Aktivitätsmissionen keine spezielle Navigation
        break;
      case 'weight':
        navigate('/profile');
        break;
      case 'goals':
        navigate('/nutrition-goals');
        break;
      default:
        navigate('/progress');
        break;
    }
  };
  
  // Funktion zum Abrufen des Icons basierend auf dem iconName
  const getMissionIcon = (iconName: string | undefined) => {
    switch (iconName) {
      case 'FiCoffee': return FiCoffee;
      case 'FiDroplet': return FiDroplet;
      case 'FiHeart': return FiHeart;
      case 'FiActivity': return FiActivity;
      case 'FiLayers': return FiLayers;
      case 'FiPieChart': return FiPieChart;
      default: return FiCheckCircle;
    }
  };
  
  // Tägliche Missionen-Sektion
  const renderDailyMissions = () => (
    <Card bg={cardBg} borderRadius="lg" boxShadow="md" mb={6}>
      <CardHeader>
        <Flex justify="space-between" align="center">
          <Heading size="md">{t('home.dailyMissions', 'Tägliche Missionen')}</Heading>
          <Button 
            size="sm" 
            variant="ghost" 
            rightIcon={<FiChevronRight />}
            onClick={() => navigate('/progress')}
          >
            {t('home.seeAll', 'Alle anzeigen')}
          </Button>
        </Flex>
      </CardHeader>
      <CardBody>
        {dailyMissions.length > 0 ? (
          dailyMissions.slice(0, 3).map((mission) => (
            <Box 
              key={mission.id} 
              p={4} 
              mb={3} 
              borderWidth="1px" 
              borderRadius="md" 
              onClick={() => handleMissionClick(mission)}
              cursor={mission.completed ? "default" : "pointer"}
              _hover={mission.completed ? {} : { bg: hoverBg }}
              transition="background-color 0.2s"
              bg={mission.completed ? completedMissionBg : ""}
              borderColor={mission.completed ? completedMissionBorderColor : ""}
              boxShadow={mission.completed ? completedMissionShadow : "none"}
              position="relative"
            >
              {mission.completed && (
                <Box 
                  position="absolute" 
                  top="0" 
                  right="0" 
                  borderTopRightRadius="md"
                  borderBottomLeftRadius="md"
                  px={2}
                  py={1}
                  bg={completedBadgeBg} 
                  color="white"
                  fontSize="xs"
                  fontWeight="bold"
                >
                  {t('common.completed')}
                </Box>
              )}
              <Flex justify="space-between" align="center">
                <HStack spacing={3}>
                  <Checkbox 
                    isChecked={mission.completed} 
                    colorScheme="green"
                    isDisabled={mission.requirements?.type !== 'activity' || mission.completed}
                    onChange={(e) => {
                      e.stopPropagation();
                      if (mission.requirements?.type === 'activity' && !mission.completed) {
                        completeDaily(mission.id);
                      }
                    }}
                  />
                  <Box>
                    <Flex align="center">
                      <Text fontWeight="medium" color={mission.completed ? completedMissionTitleColor : ""}>{t(mission.title)}</Text>
                      {mission.completed && <Icon as={FiCheckCircle} color={completedCheckIconColor} ml={2} />}
                    </Flex>
                    <Text fontSize="sm" color={mission.completed ? completedMissionTextColor : "gray.500"}>{t(mission.description)}</Text>
                  </Box>
                </HStack>
                <Badge colorScheme={mission.completed ? "green" : "brand"}>+{mission.xp} XP</Badge>
              </Flex>
            </Box>
          ))
        ) : (
          <Text color="gray.500" textAlign="center" py={4}>
            {t('home.noMissions', 'Keine täglichen Missionen verfügbar.')}
          </Text>
        )}
      </CardBody>
    </Card>
  );
  
  if (!onboardingComplete) {
    return (
      <Container maxW="container.xl" py={8} textAlign="center">
        <Heading as="h1" size="xl" mb={4}>
          {t('home.welcomeNew', 'Willkommen bei NutriCoach')}
        </Heading>
        <Text fontSize="lg" mb={6}>
          {t('home.startOnboarding', 'Lass uns deine Reise beginnen! Beantworte ein paar Fragen, damit wir dein Ernährungsprogramm personalisieren können.')}
        </Text>
        <Button 
          as={RouterLink} 
          to="/onboarding" 
          colorScheme="brand" 
          size="lg"
        >
          {t('home.startNow', 'Jetzt starten')}
        </Button>
      </Container>
    );
  }
  
  return (
    <Container maxW="container.xl" py={4}>
      {/* Begrüßung */}
      <Box mb={4}>
        <Heading size="lg" mb={2}>
          {t('home.welcomeBack', { name: user?.name || '' })}
        </Heading>
      </Box>
      
      {/* XP Fortschrittsanzeige */}
      <XpProgressBar />
      
      {/* Tägliche Ziele */}
      <Heading size="md" mb={4}>
        {t('home.dailyGoals', 'Objektivat e Ditës')}
      </Heading>

      {/* Quick Access */}
      <Box mb={8}>
        <Heading size="md" mb={4}>
          {t('home.quickAccess', 'Qasje e Shpejtë')}
        </Heading>
        <SimpleGrid columns={{base: 2, md: 4}} spacing={4}>
          <Card as={RouterLink} to="/meals" bg={cardBg} _hover={{ transform: 'translateY(-4px)', shadow: 'md' }} transition="all 0.3s" borderRadius="lg">
            <CardBody p={4} textAlign="center">
              <Icon as={FiList} boxSize={10} mb={3} color="brand.500" />
              <Heading size="sm">{t('nav.meals', 'Mahlzeiten')}</Heading>
              <Text fontSize="xs" mt={1}>{t('home.trackMeals', 'Mahlzeiten verfolgen')}</Text>
            </CardBody>
          </Card>
          
          <Card as={RouterLink} to="/recipes" bg={cardBg} _hover={{ transform: 'translateY(-4px)', shadow: 'md' }} transition="all 0.3s" borderRadius="lg">
            <CardBody p={4} textAlign="center">
              <Icon as={FiBookOpen} boxSize={10} mb={3} color="orange.500" />
              <Heading size="sm">{t('nav.recipes', 'Rezepte')}</Heading>
              <Text fontSize="xs" mt={1}>{t('home.findRecipes', 'Gesunde Rezepte finden')}</Text>
            </CardBody>
          </Card>
          
          <Card as={RouterLink} to="/progress" bg={cardBg} _hover={{ transform: 'translateY(-4px)', shadow: 'md' }} transition="all 0.3s" borderRadius="lg">
            <CardBody p={4} textAlign="center">
              <Icon as={FiActivity} boxSize={10} mb={3} color="green.500" />
              <Heading size="sm">{t('nav.progress', 'Fortschritt')}</Heading>
              <Text fontSize="xs" mt={1}>{t('home.trackProgress', 'Erfolge verfolgen')}</Text>
            </CardBody>
          </Card>
          
          <Card as={RouterLink} to="/achievements" bg={cardBg} _hover={{ transform: 'translateY(-4px)', shadow: 'md' }} transition="all 0.3s" borderRadius="lg">
            <CardBody p={4} textAlign="center">
              <Icon as={FiUser} boxSize={10} mb={3} color="purple.500" />
              <Heading size="sm">{t('nav.achievements', 'Erfolge')}</Heading>
              <Text fontSize="xs" mt={1}>{t('home.viewAchievements', 'Medaillen und Level')}</Text>
            </CardBody>
          </Card>
        </SimpleGrid>
      </Box>

      {/* Daily Tip */}
      <Box mb={8}>
        <Heading size="md" mb={4}>
          {t('home.dailyTip', 'Këshilla e Ditës')}
        </Heading>
        <Card bg={cardBg} borderRadius="lg" boxShadow="md">
          <CardBody>
            <Flex direction={{base: "column", md: "row"}} align="center" gap={4}>
              <Box flex="1">
                <Heading size="sm" mb={2}>{t('home.tip', 'Täglicher Tipp')}</Heading>
                <Text>{t('home.randomTip', 'Trinke über den Tag verteilt Wasser, um deinen Stoffwechsel anzuregen und deine Energielevels hoch zu halten.')}</Text>
              </Box>
            </Flex>
          </CardBody>
        </Card>
      </Box>

      {/* Progress */}
      <Box mb={8}>
        <Heading size="md" mb={4}>
          {t('home.progress', 'Progresi')}
        </Heading>
        <SimpleGrid columns={{base: 1, md: 3}} spacing={4}>
          <Stat p={4} bg={statBg} borderRadius="lg" boxShadow="sm">
            <StatLabel display="flex" alignItems="center">
              <Icon as={FiPieChart} mr={2} /> {t('home.calories', 'Kalorien')}
            </StatLabel>
            <StatNumber>{todayProgress.calories} / {user?.calorieGoal || '-'} kcal</StatNumber>
            <Progress value={caloriePercentage} colorScheme="green" size="sm" mt={2} />
            <StatHelpText>{caloriePercentage}% {t('common.completed')}</StatHelpText>
          </Stat>
          
          <Stat p={4} bg={statBg} borderRadius="lg" boxShadow="sm">
            <StatLabel display="flex" alignItems="center">
              <Icon as={FiHeart} mr={2} /> {t('home.protein', 'Protein')}
            </StatLabel>
            <StatNumber>{todayProgress.protein} / {user?.proteinGoal || '-'} g</StatNumber>
            <Progress value={proteinPercentage} colorScheme="pink" size="sm" mt={2} />
            <StatHelpText>{proteinPercentage}% {t('common.completed')}</StatHelpText>
          </Stat>
          
          <Stat p={4} bg={statBg} borderRadius="lg" boxShadow="sm">
            <StatLabel display="flex" alignItems="center">
              <Icon as={FiLayers} mr={2} /> {t('home.fat', 'Fett')}
            </StatLabel>
            <StatNumber>{todayProgress.fat} / {user?.fatGoal || '-'} g</StatNumber>
            <Progress value={fatPercentage} colorScheme="yellow" size="sm" mt={2} />
            <StatHelpText>{fatPercentage}% {t('common.completed')}</StatHelpText>
          </Stat>
          
          <Stat p={4} bg={statBg} borderRadius="lg" boxShadow="sm">
            <StatLabel display="flex" alignItems="center">
              <Icon as={FiDroplet} mr={2} /> {t('home.water', 'Wasser')}
            </StatLabel>
            <StatNumber>{todayProgress.water} / {user?.waterGoal || '-'} ml</StatNumber>
            <Progress value={waterPercentage} colorScheme="cyan" size="sm" mt={2} />
            <StatHelpText>{waterPercentage}% {t('common.completed')}</StatHelpText>
          </Stat>
          
          <Stat p={4} bg={statBg} borderRadius="lg" boxShadow="sm">
            <StatLabel display="flex" alignItems="center">
              <Icon as={FiPieChart} mr={2} /> {t('nutrition.carbs', 'Kohlenhydrate')}
            </StatLabel>
            <StatNumber>{todayProgress.carbs} / {user?.carbGoal || '-'} g</StatNumber>
            <Progress 
              value={user?.carbGoal ? Math.min(100, Math.round((todayProgress.carbs / (user.carbGoal || 1)) * 100)) : 0} 
              colorScheme="orange" 
              size="sm" 
              mt={2} 
            />
            <StatHelpText>
              {user?.carbGoal ? Math.min(100, Math.round((todayProgress.carbs / (user.carbGoal || 1)) * 100)) : 0}% {t('common.completed')}
            </StatHelpText>
          </Stat>
          
          <Stat p={4} bg={statBg} borderRadius="lg" boxShadow="sm">
            <StatLabel display="flex" alignItems="center">
              <Icon as={FiActivity} mr={2} /> {t('home.burnedCalories', 'Verbrannte Kalorien')}
            </StatLabel>
            <StatNumber>
              {todayProgress.burnedCalories || 0} / {user?.burnCalorieGoal || 500} kcal
            </StatNumber>
            <Progress 
              value={user ? Math.min(100, Math.round(((todayProgress.burnedCalories || 0) / (user.burnCalorieGoal || 500)) * 100)) : 0} 
              colorScheme="red" 
              size="sm" 
              mt={2} 
            />
            <StatHelpText>
              {user ? Math.min(100, Math.round(((todayProgress.burnedCalories || 0) / (user.burnCalorieGoal || 500)) * 100)) : 0}% {t('common.completed')}
            </StatHelpText>
            <Text fontSize="xs" color="gray.500" mt={1}>
              {user?.weightGoal === 'lose' 
                ? t('home.burnCalorieExplanationLose', 'Ziel für Gewichtsreduktion: 500 kcal')
                : t('home.burnCalorieExplanationNormal', '20% deines täglichen Kalorienziels')}
            </Text>
          </Stat>
        </SimpleGrid>
      </Box>

      {/* Tägliche Missionen */}
      <Box mb={10}>
        <Heading as="h2" size="md" mb={4}>
          {t('home.dailyMissions', 'Tägliche Missionen')}
        </Heading>
        {renderDailyMissions()}
      </Box>
    </Container>
  );
};

export default HomePage; 