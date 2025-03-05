import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Flex,
  Progress,
  Badge,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useColorModeValue,
  Tooltip,
  Card,
  CardBody,
  VStack,
  Icon,
  Button,
  Divider,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useUser } from '../contexts/UserContext';
import { 
  FiAward, FiTarget, FiCheckCircle, FiClock, FiTrendingUp, 
  FiHeart, FiDroplet, FiLayers, FiCoffee, FiBookOpen, FiUser 
} from 'react-icons/fi';

// Komponente für Achievement-Badges
interface AchievementBadgeProps {
  name: string;
  description: string;
  icon: React.ReactElement;
  isLocked?: boolean;
  progress?: number;
  colorScheme?: string;
}

const AchievementBadge: React.FC<AchievementBadgeProps> = ({
  name,
  description,
  icon,
  isLocked = false,
  progress = 100,
  colorScheme = 'brand',
}) => {
  const bgColor = useColorModeValue('white', 'gray.700');
  const lockedBgColor = useColorModeValue('gray.100', 'gray.800');
  const lockedTextColor = useColorModeValue('gray.400', 'gray.500');
  const { t } = useTranslation();
  
  return (
    <Tooltip label={description} placement="top" hasArrow>
      <Card
        bg={isLocked ? lockedBgColor : bgColor}
        borderRadius="lg"
        boxShadow="sm"
        p={0}
        opacity={isLocked ? 0.7 : 1}
        transition="transform 0.2s"
        _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}
      >
        <CardBody>
          <VStack spacing={2} align="center">
            <Flex
              w="60px"
              h="60px"
              borderRadius="full"
              bg={isLocked ? 'gray.300' : `${colorScheme}.100`}
              color={isLocked ? 'gray.500' : `${colorScheme}.500`}
              justify="center"
              align="center"
              mb={2}
            >
              {React.cloneElement(icon, { size: 24 })}
            </Flex>
            
            <Heading size="sm" textAlign="center" color={isLocked ? lockedTextColor : "inherit"}>
              {name}
            </Heading>
            
            {isLocked && progress < 100 && (
              <Box w="100%">
                <Progress value={progress} size="xs" borderRadius="full" colorScheme={colorScheme} />
                <Text fontSize="xs" textAlign="center" mt={1} color={lockedTextColor}>
                  {progress}%
                </Text>
              </Box>
            )}
            
            {isLocked && (
              <Badge colorScheme="gray" mt={1}>
                {progress === 100 ? t('achievements.unlock', 'Freischalten') : t('achievements.inProgress', 'In Bearbeitung')}
              </Badge>
            )}
          </VStack>
        </CardBody>
      </Card>
    </Tooltip>
  );
};

// Komponente für Herausforderungen
interface ChallengeProps {
  title: string;
  description: string;
  xp: number;
  isCompleted?: boolean;
  progress?: number;
  deadline?: string;
}

const Challenge: React.FC<ChallengeProps> = ({
  title,
  description,
  xp,
  isCompleted = false,
  progress = 0,
  deadline,
}) => {
  const bgColor = useColorModeValue('white', 'gray.700');
  
  return (
    <Box 
      p={4} 
      bg={bgColor} 
      borderRadius="md" 
      boxShadow="sm"
      borderLeft="4px solid"
      borderLeftColor={isCompleted ? 'green.500' : 'brand.500'}
    >
      <Flex justify="space-between" align="center" mb={2}>
        <Heading size="sm">{title}</Heading>
        <Badge colorScheme={isCompleted ? 'green' : 'blue'}>
          {isCompleted ? (
            <Flex align="center">
              <Icon as={FiCheckCircle} mr={1} />
              {xp} XP
            </Flex>
          ) : (
            `${xp} XP`
          )}
        </Badge>
      </Flex>
      
      <Text fontSize="sm" mb={3} color="gray.500">
        {description}
      </Text>
      
      {!isCompleted && (
        <>
          <Progress value={progress} size="sm" colorScheme="brand" mb={2} />
          <Flex justify="space-between" fontSize="xs" color="gray.500">
            <Text>{progress}% abgeschlossen</Text>
            {deadline && (
              <Flex align="center">
                <Icon as={FiClock} mr={1} />
                {deadline}
              </Flex>
            )}
          </Flex>
        </>
      )}
    </Box>
  );
};

// Hauptkomponente für die Erfolgsseite
const AchievementsPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useUser();
  const level = user?.level || 1;
  const xp = user?.experiencePoints || 0;
  const nextLevelXp = level * 100;
  const xpProgress = (xp / nextLevelXp) * 100;
  
  // Simulierte freigeschaltete Badges
  const unlockedBadges = [
    {
      name: t('achievements.firstMeal', 'Erste Mahlzeit'),
      description: t('achievements.firstMealDesc', 'Trage deine erste Mahlzeit ein'),
      icon: <FiLayers />,
      colorScheme: 'green',
    },
    {
      name: t('achievements.waterHabit', 'Wassergewohnheit'),
      description: t('achievements.waterHabitDesc', 'Trinke 7 Tage in Folge genug Wasser'),
      icon: <FiDroplet />,
      colorScheme: 'blue',
    },
    {
      name: t('achievements.profileComplete', 'Profil vervollständigt'),
      description: t('achievements.profileCompleteDesc', 'Fülle alle Details in deinem Profil aus'),
      icon: <FiUser />,
      colorScheme: 'purple',
    },
  ];
  
  // Simulierte gesperrte Badges
  const lockedBadges = [
    {
      name: t('achievements.mealMaster', 'Mahlzeit-Meister'),
      description: t('achievements.mealMasterDesc', 'Erstelle 20 verschiedene Mahlzeiten'),
      icon: <FiCoffee />,
      isLocked: true,
      progress: 65,
      colorScheme: 'orange',
    },
    {
      name: t('achievements.nutritionExpert', 'Ernährungsexperte'),
      description: t('achievements.nutritionExpertDesc', 'Erreiche deine Nährwert-Ziele 30 Tage in Folge'),
      icon: <FiHeart />,
      isLocked: true,
      progress: 40,
      colorScheme: 'red',
    },
    {
      name: t('achievements.recipeCreator', 'Rezeptersteller'),
      description: t('achievements.recipeCreatorDesc', 'Erstelle dein erstes eigenes Rezept'),
      icon: <FiBookOpen />,
      isLocked: true,
      progress: 0,
      colorScheme: 'teal',
    },
    {
      name: t('achievements.weightGoal', 'Gewichtsziel'),
      description: t('achievements.weightGoalDesc', 'Erreiche dein Gewichtsziel'),
      icon: <FiTarget />,
      isLocked: true,
      progress: 75,
      colorScheme: 'cyan',
    },
    {
      name: t('achievements.consistencyKing', 'Konsistenz-König'),
      description: t('achievements.consistencyKingDesc', 'Melde dich 60 Tage in Folge an'),
      icon: <FiTrendingUp />,
      isLocked: true,
      progress: 50,
      colorScheme: 'brand',
    },
  ];
  
  // Simulierte Herausforderungen
  const challenges = [
    {
      title: t('challenges.waterGoal', 'Wasser-Ziel'),
      description: t('challenges.waterGoalDesc', 'Trinke 8 Gläser Wasser an 7 aufeinanderfolgenden Tagen'),
      xp: 50,
      isCompleted: false,
      progress: 70,
      deadline: '3 Tage',
    },
    {
      title: t('challenges.logAllMeals', 'Alle Mahlzeiten protokollieren'),
      description: t('challenges.logAllMealsDesc', 'Protokolliere alle deine Mahlzeiten für 5 Tage'),
      xp: 30,
      isCompleted: true,
    },
    {
      title: t('challenges.tryNewRecipe', 'Neues Rezept ausprobieren'),
      description: t('challenges.tryNewRecipeDesc', 'Probiere ein neues Rezept aus und bewerte es'),
      xp: 20,
      isCompleted: false,
      progress: 0,
      deadline: '7 Tage',
    },
    {
      title: t('challenges.proteinGoal', 'Protein-Ziel'),
      description: t('challenges.proteinGoalDesc', 'Erreiche dein tägliches Protein-Ziel an 3 aufeinanderfolgenden Tagen'),
      xp: 25,
      isCompleted: false,
      progress: 33,
      deadline: '2 Tage',
    },
  ];
  
  // Tab-Farben
  const tabBg = useColorModeValue('white', 'gray.800');
  const statBg = useColorModeValue('gray.50', 'gray.700');
  
  // Statistiken für die Achievements
  const completedChallenges = 3;
  
  return (
    <Container maxW="container.xl" py={6}>
      <Box mb={8}>
        <Heading as="h1" size="xl" mb={2}>
          {t('nav.achievements')}
        </Heading>
        <Text color="gray.500">
          {t('achievements.pageDescription', 'Sammle Auszeichnungen und verdiene XP durch das Erreichen von Meilensteinen.')}
        </Text>
      </Box>
      
      {/* Level-Fortschritt */}
      <Box bg={statBg} p={6} borderRadius="lg" boxShadow="md" mb={6}>
        <Flex justify="space-between" align="center" mb={4}>
          <Heading size="md">{t('achievements.yourLevel', 'Dein Level')}</Heading>
          <Badge colorScheme="purple" fontSize="md" p={1}>
            Level {level}
          </Badge>
        </Flex>
        
        <Flex justify="space-between" mb={2}>
          <Text>{xp} XP</Text>
          <Text>{nextLevelXp} XP</Text>
        </Flex>
        
        <Progress 
          value={xpProgress} 
          colorScheme="purple" 
          size="lg" 
          borderRadius="full" 
          mb={4}
        />
        
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
          <Stat bg={tabBg} p={4} borderRadius="md" boxShadow="sm">
            <StatLabel>{t('achievements.badgesEarned', 'Verdiente Abzeichen')}</StatLabel>
            <StatNumber>{unlockedBadges.length}</StatNumber>
            <StatHelpText>
              {t('achievements.outOf', 'von {{total}}', { total: unlockedBadges.length + lockedBadges.length })}
            </StatHelpText>
          </Stat>
          
          <Stat bg={tabBg} p={4} borderRadius="md" boxShadow="sm">
            <StatLabel>{t('achievements.challengesCompleted', 'Abgeschlossene Herausforderungen')}</StatLabel>
            <StatNumber>{completedChallenges}</StatNumber>
            <StatHelpText>
              {t('achievements.outOf', 'von {{total}}', { total: challenges.length })}
            </StatHelpText>
          </Stat>
          
          <Stat bg={tabBg} p={4} borderRadius="md" boxShadow="sm">
            <StatLabel>{t('achievements.nextReward', 'Nächste Belohnung')}</StatLabel>
            <StatNumber>150 XP</StatNumber>
            <StatHelpText>
              {t('achievements.atLevel', 'bei Level {{level}}', { level: level + 1 })}
            </StatHelpText>
          </Stat>
        </SimpleGrid>
      </Box>
      
      {/* Tabs für die verschiedenen Erfolgstypen */}
      <Tabs colorScheme="brand" variant="enclosed">
        <TabList>
          <Tab>{t('achievements.badges', 'Abzeichen')}</Tab>
          <Tab>{t('achievements.challenges', 'Herausforderungen')}</Tab>
        </TabList>
        
        <TabPanels mt={4}>
          <TabPanel p={0}>
            <VStack spacing={6} align="stretch">
              <Box>
                <Flex justify="space-between" align="center" mb={4}>
                  <Heading size="md">
                    {t('achievements.unlockedBadges', 'Freigeschaltete Abzeichen')}
                  </Heading>
                  <Badge colorScheme="green">{unlockedBadges.length}</Badge>
                </Flex>
                
                <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing={4}>
                  {unlockedBadges.map((badge, index) => (
                    <AchievementBadge
                      key={index}
                      name={badge.name}
                      description={badge.description}
                      icon={badge.icon}
                      colorScheme={badge.colorScheme}
                    />
                  ))}
                </SimpleGrid>
              </Box>
              
              <Divider my={4} />
              
              <Box>
                <Flex justify="space-between" align="center" mb={4}>
                  <Heading size="md">
                    {t('achievements.lockedBadges', 'Gesperrte Abzeichen')}
                  </Heading>
                  <Badge colorScheme="gray">{lockedBadges.length}</Badge>
                </Flex>
                
                <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing={4}>
                  {lockedBadges.map((badge, index) => (
                    <AchievementBadge
                      key={index}
                      name={badge.name}
                      description={badge.description}
                      icon={badge.icon}
                      isLocked={badge.isLocked}
                      progress={badge.progress}
                      colorScheme={badge.colorScheme}
                    />
                  ))}
                </SimpleGrid>
              </Box>
            </VStack>
          </TabPanel>
          
          <TabPanel p={0}>
            <VStack spacing={6} align="stretch">
              <Heading size="md" mb={2}>
                {t('achievements.activeChallenges', 'Aktive Herausforderungen')}
              </Heading>
              
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                {challenges.map((challenge, index) => (
                  <Challenge
                    key={index}
                    title={challenge.title}
                    description={challenge.description}
                    xp={challenge.xp}
                    isCompleted={challenge.isCompleted}
                    progress={challenge.progress}
                    deadline={challenge.deadline}
                  />
                ))}
              </SimpleGrid>
              
              <Flex justify="center" mt={4}>
                <Button colorScheme="brand" variant="outline">
                  {t('achievements.viewAllChallenges', 'Alle Herausforderungen anzeigen')}
                </Button>
              </Flex>
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
};

export default AchievementsPage; 