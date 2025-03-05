import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Flex,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Tabs,
  TabList,
  TabPanels as ChakraTabPanels,
  Tab,
  TabPanel,
  useColorModeValue,
  HStack,
  Select,
  Progress,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Icon,
  Card,
  CardBody,
  CardHeader,
  ButtonGroup,
  VStack
} from '@chakra-ui/react';
import { 
  FiActivity, 
  FiTrendingUp, 
  FiBarChart2, 
  FiCheckCircle, 
  FiDroplet,
  FiHeart,
  FiCoffee,
  FiLayers,
  FiPieChart,
  FiTarget,
  FiArrowUp,
  FiArrowDown,
  FiCalendar,
  FiClock,
  FiPlus
} from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { useUser } from '../contexts/UserContext';
import { Mission } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip as ChartTooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

// Chart.js-Komponenten registrieren
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend
);

// Komponente für Missionsanzeige
const MissionItem: React.FC<{ mission: Mission, onComplete: (id: number) => void }> = ({ mission, onComplete }) => {
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  // Funktion zum Abrufen des Icons basierend auf dem iconName
  const getMissionIcon = (iconName: string | undefined) => {
    switch (iconName) {
      case 'FiCoffee': return FiCoffee;
      case 'FiDroplet': return FiDroplet;
      case 'FiHeart': return FiHeart;
      case 'FiActivity': return FiActivity;
      case 'FiLayers': return FiLayers;
      case 'FiPieChart': return FiPieChart;
      case 'FiTarget': return FiTarget;
      default: return FiCheckCircle;
    }
  };

  // Prüfe, ob es sich um eine Aktivitätsmission handelt, die manuell abgeschlossen werden kann
  const isActivityMission = mission.requirements?.type === 'activity';

  // Funktion zum Navigieren zur entsprechenden Seite basierend auf dem Missionstyp
  const handleMissionClick = () => {
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
        // Bei Aktivitätsmissionen keine Navigation, nur Abschluss-Button anzeigen
        break;
      default:
        // Standardmäßig zur Fortschrittsseite navigieren
        break;
    }
  };

  return (
    <Box 
      p={4} 
      bg={mission.completed ? "green.50" : bgColor} 
      borderRadius="md" 
      boxShadow="sm" 
      borderWidth="1px"
      borderColor={mission.completed ? "green.200" : borderColor}
      mb={3}
      cursor={mission.completed ? "default" : "pointer"}
      onClick={handleMissionClick}
      _hover={mission.completed ? {} : { borderColor: "brand.500" }}
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
          bg="green.500" 
          color="white"
          fontSize="xs"
          fontWeight="bold"
        >
          {t('common.completed')}
        </Box>
      )}
      <Flex justify="space-between" align="center">
        <Flex align="center" flex="1">
          <Icon 
            as={mission.completed ? FiCheckCircle : getMissionIcon(mission.iconName)} 
            color={mission.completed ? "green.500" : "gray.400"}
            boxSize={5}
            mr={3}
          />
          <Box>
            <Text fontWeight="bold" color={mission.completed ? "green.600" : ""}>{t(mission.title)}</Text>
            <Text fontSize="sm" color={mission.completed ? "green.500" : "gray.500"}>{t(mission.description)}</Text>
            {mission.progress !== undefined && mission.progress > 0 && !mission.completed && (
              <Progress value={mission.progress} size="xs" colorScheme="brand" mt={1} />
            )}
          </Box>
        </Flex>
        <Flex direction="column" align="flex-end">
          <Badge colorScheme={mission.completed ? "green" : "brand"}>+{mission.xp} XP</Badge>
          {!mission.completed && isActivityMission && (
            <Button 
              size="xs" 
              colorScheme="green" 
              mt={2} 
              leftIcon={<FiCheckCircle />}
              onClick={(e) => {
                e.stopPropagation();
                onComplete(mission.id);
              }}
            >
              {t('common.complete')}
            </Button>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

// Komponente für Nährwertdaten
const NutritionStats = () => {
  const { t } = useTranslation();
  const { user } = useUser();
  const statBg = useColorModeValue('white', 'gray.700');
  
  // Wir verwenden nur tatsächliche Benutzerdaten
  const weeklyAvg = user?.nutritionStats || {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    water: 0,
  };
  
  // Prozentsatz im Vergleich zu den Zielen
  const weeklyCaloriePercentage = user?.calorieGoal ? Math.round((weeklyAvg.calories / user.calorieGoal) * 100) : 0;
  const proteinPercentage = user?.proteinGoal ? Math.round((weeklyAvg.protein / user.proteinGoal) * 100) : 0;
  const carbsPercentage = user?.carbGoal ? Math.round((weeklyAvg.carbs / user.carbGoal) * 100) : 0;
  const fatPercentage = user?.fatGoal ? Math.round((weeklyAvg.fat / user.fatGoal) * 100) : 0;
  const waterPercentage = user?.waterGoal ? Math.round((weeklyAvg.water / user.waterGoal) * 100) : 0;
  
  if (!user?.nutritionStats) {
    return (
      <Box bg={statBg} p={6} borderRadius="lg" boxShadow="sm" textAlign="center">
        <Text color="gray.500">{t('progress.noNutritionData', 'Keine Ernährungsdaten vorhanden. Beginne mit der Aufzeichnung deiner Mahlzeiten.')}</Text>
      </Box>
    );
  }
  
  return (
    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
      <Stat p={4} bg={statBg} borderRadius="lg" boxShadow="sm">
        <StatLabel>{t('progress.caloriesAvg', 'Ø Kalorien')}</StatLabel>
        <StatNumber>{weeklyAvg.calories} kcal</StatNumber>
        <Progress value={weeklyCaloriePercentage} colorScheme="green" size="sm" mt={2} />
        <StatHelpText>{weeklyCaloriePercentage}% {t('progress.ofGoal', 'deines Ziels')}</StatHelpText>
      </Stat>
      
      <Stat p={4} bg={statBg} borderRadius="lg" boxShadow="sm">
        <StatLabel>{t('progress.proteinAvg', 'Ø Protein')}</StatLabel>
        <StatNumber>{weeklyAvg.protein} g</StatNumber>
        <Progress value={proteinPercentage} colorScheme="blue" size="sm" mt={2} />
        <StatHelpText>{proteinPercentage}% {t('progress.ofGoal', 'deines Ziels')}</StatHelpText>
      </Stat>
      
      <Stat p={4} bg={statBg} borderRadius="lg" boxShadow="sm">
        <StatLabel>{t('progress.carbsAvg', 'Ø Kohlenhydrate')}</StatLabel>
        <StatNumber>{weeklyAvg.carbs} g</StatNumber>
        <Progress value={carbsPercentage} colorScheme="orange" size="sm" mt={2} />
        <StatHelpText>{carbsPercentage}% {t('progress.ofGoal', 'deines Ziels')}</StatHelpText>
      </Stat>
      
      <Stat p={4} bg={statBg} borderRadius="lg" boxShadow="sm">
        <StatLabel>{t('progress.fatAvg', 'Ø Fett')}</StatLabel>
        <StatNumber>{weeklyAvg.fat} g</StatNumber>
        <Progress value={fatPercentage} colorScheme="yellow" size="sm" mt={2} />
        <StatHelpText>{fatPercentage}% {t('progress.ofGoal', 'deines Ziels')}</StatHelpText>
      </Stat>
      
      <Stat p={4} bg={statBg} borderRadius="lg" boxShadow="sm" gridColumn={{ md: 'span 2' }}>
        <StatLabel>{t('progress.waterAvg', 'Ø Wasser')}</StatLabel>
        <StatNumber>{weeklyAvg.water} ml</StatNumber>
        <Progress value={waterPercentage} colorScheme="cyan" size="sm" mt={2} />
        <StatHelpText>{waterPercentage}% {t('progress.ofGoal', 'deines Ziels')}</StatHelpText>
      </Stat>
    </SimpleGrid>
  );
};

// XP und Level-Fortschritt Zusammenfassung Komponente für Overview
const XpProgressSummary: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useUser();
  const level = user?.level || 1;
  const xp = user?.experiencePoints || 0;
  const nextLevelXp = level * 100;
  const xpProgress = (xp / nextLevelXp) * 100;
  const cardBg = useColorModeValue('white', 'gray.800');

  return (
    <Box p={4} bg={cardBg} borderRadius="lg" boxShadow="md">
      <Flex justify="space-between" align="center" mb={2}>
        <Heading size="md">{t('common.yourLevel')}</Heading>
        <Badge colorScheme="brand" p={2} fontSize="md">LEVEL {level}</Badge>
      </Flex>
      <Progress 
        value={xpProgress} 
        colorScheme="brand" 
        size="md" 
        borderRadius="md" 
        mb={2}
      />
      <Flex justify="space-between" fontSize="sm" color="gray.500">
        <Text>{xp} XP</Text>
        <Text>{nextLevelXp} XP</Text>
      </Flex>
    </Box>
  );
};

// Streak Komponente
const StreakSummary: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useUser();
  const cardBg = useColorModeValue('white', 'gray.800');

  return (
    <Box p={4} bg={cardBg} borderRadius="lg" boxShadow="md">
      <Flex justify="space-between" align="center">
        <Box>
          <Heading size="md" mb={1}>{t('common.streak', 'Deine Serie')}</Heading>
          <Heading size="lg">{user?.streakDays || 0} {t('common.days', 'Tage')}</Heading>
          <Text color="gray.500" fontSize="sm">
            {t('common.streakDescription', 'Tägliche Anmeldung und Aktivität')}
          </Text>
        </Box>
        <Icon as={FiTrendingUp} boxSize={8} color="brand.500" />
      </Flex>
    </Box>
  );
};

// Top Missionen Komponente
const TopMissions: React.FC = () => {
  const { t } = useTranslation();
  const { user, completeDaily } = useUser();
  const cardBg = useColorModeValue('white', 'gray.800');
  
  // Wir holen uns die ersten 3 nicht abgeschlossenen täglichen Missionen
  const pendingDailyMissions = (user?.dailyMissions || [])
    .filter(mission => !mission.completed)
    .slice(0, 3);

  return (
    <Box p={4} bg={cardBg} borderRadius="lg" boxShadow="md" gridColumn={{ md: 'span 2' }}>
      <Flex justify="space-between" align="center" mb={3}>
        <Heading size="md">{t('progress.topMissions', 'Wichtige Missionen')}</Heading>
        <Badge colorScheme="brand">{pendingDailyMissions.length}</Badge>
      </Flex>
      
      {pendingDailyMissions.length > 0 ? (
        pendingDailyMissions.map(mission => (
          <MissionItem 
            key={mission.id} 
            mission={mission} 
            onComplete={completeDaily} 
          />
        ))
      ) : (
        <Text color="gray.500" textAlign="center" py={2}>
          {t('progress.allMissionsCompleted', 'Alle Missionen erledigt!')}
        </Text>
      )}
      
      <Button 
        as="a" 
        href="#missions-tab" 
        variant="link" 
        size="sm" 
        rightIcon={<Icon as={FiTarget} />}
        mt={2}
        onClick={(e) => {
          e.preventDefault();
          // Wechsle zum Missionen-Tab
          const tabsElement = document.querySelector('button[aria-controls="missions-tab"]');
          if (tabsElement) {
            (tabsElement as HTMLElement).click();
          }
        }}
      >
        {t('progress.viewAllMissions', 'Alle Missionen ansehen')}
      </Button>
    </Box>
  );
};

// Nährwerte Zusammenfassung
const NutritionSummary: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useUser();
  const cardBg = useColorModeValue('white', 'gray.800');
  
  // Verwende tatsächliche Benutzerdaten wenn vorhanden
  const weeklyAvg = user?.nutritionStats || {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    water: 0,
  };
  
  // Prozentsatz im Vergleich zu den Zielen
  const summaryCaloriePercentage = user?.calorieGoal ? Math.round((weeklyAvg.calories / user.calorieGoal) * 100) : 0;
  const summaryWaterPercentage = user?.waterGoal ? Math.round((weeklyAvg.water / user.waterGoal) * 100) : 0;
  
  if (!user?.nutritionStats) {
    return null;
  }
  
  return (
    <Box p={4} bg={cardBg} borderRadius="lg" boxShadow="md">
      <Flex justify="space-between" align="center" mb={3}>
        <Heading size="md">{t('progress.nutritionOverview', 'Ernährungsübersicht')}</Heading>
        <Icon as={FiBarChart2} color="brand.500" />
      </Flex>
      
      <SimpleGrid columns={2} spacing={4}>
        <Box>
          <Text fontWeight="medium">{t('progress.caloriesAvg', 'Ø Kalorien')}</Text>
          <Text fontSize="xl" fontWeight="bold">{weeklyAvg.calories} kcal</Text>
          <Progress value={summaryCaloriePercentage} colorScheme="green" size="sm" mt={1} mb={1} />
          <Text fontSize="xs" color="gray.500">{summaryCaloriePercentage}% {t('progress.ofGoal', 'deines Ziels')}</Text>
        </Box>
        
        <Box>
          <Text fontWeight="medium">{t('progress.waterAvg', 'Ø Wasser')}</Text>
          <Text fontSize="xl" fontWeight="bold">{weeklyAvg.water} ml</Text>
          <Progress value={summaryWaterPercentage} colorScheme="cyan" size="sm" mt={1} mb={1} />
          <Text fontSize="xs" color="gray.500">{summaryWaterPercentage}% {t('progress.ofGoal', 'deines Ziels')}</Text>
        </Box>
      </SimpleGrid>
      
      <Button 
        as="a" 
        href="#nutrition-tab" 
        variant="link" 
        size="sm" 
        rightIcon={<Icon as={FiBarChart2} />}
        mt={3}
        onClick={(e) => {
          e.preventDefault();
          // Wechsle zum Ernährungs-Tab
          const tabsElement = document.querySelector('button[aria-controls="nutrition-tab"]');
          if (tabsElement) {
            (tabsElement as HTMLElement).click();
          }
        }}
      >
        {t('progress.viewDetailedNutrition', 'Detaillierte Ernährungsdaten ansehen')}
      </Button>
    </Box>
  );
};

// Überarbeitete Dashboard-Übersicht Komponente
const DashboardOverview: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useUser();
  const navigate = useNavigate();
  const [activeMetric, setActiveMetric] = useState('weight');
  const [timeRange, setTimeRange] = useState('month');
  
  // Farben außerhalb von Options für Chart.js definieren
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const chartBg = useColorModeValue('white', 'gray.800');
  const chartBorderColor = useColorModeValue('gray.200', 'gray.600');
  const greenBoxBg = useColorModeValue('green.50', 'green.900');
  const greenTextColor = useColorModeValue('green.600', 'green.200');
  const blueBoxBg = useColorModeValue('blue.50', 'blue.900');
  const blueTextColor = useColorModeValue('blue.600', 'blue.200');
  const redBoxBg = useColorModeValue('red.50', 'red.900');
  const redTextColor = useColorModeValue('red.600', 'red.200');
  const purpleBoxBg = useColorModeValue('purple.50', 'purple.900');
  const purpleTextColor = useColorModeValue('purple.600', 'purple.200');
  
  // Optionen für die Auswahl von Metriken
  const metricOptions = [
    { value: 'weight', label: t('nutrition.weight', 'Gewicht'), unit: 'kg' },
    { value: 'calories', label: t('nutrition.calories', 'Kalorien'), unit: 'kcal' },
    { value: 'water', label: t('nutrition.water', 'Wasser'), unit: 'ml' },
    { value: 'protein', label: t('nutrition.protein', 'Protein'), unit: 'g' }
  ];
  
  // Optionen für die Auswahl des Zeitraums
  const timeRangeOptions = [
    { value: 'week', label: t('common.week', 'Woche') },
    { value: 'month', label: t('common.month', 'Monat') },
    { value: 'year', label: t('common.year', 'Jahr') }
  ];
  
  // Filtere Daten basierend auf dem ausgewählten Zeitraum
  const filterDataByTimeRange = (data: any[]) => {
    const now = new Date();
    let cutoffDate = new Date();
    
    if (timeRange === 'week') {
      cutoffDate.setDate(now.getDate() - 7);
    } else if (timeRange === 'month') {
      cutoffDate.setMonth(now.getMonth() - 1);
    } else if (timeRange === 'year') {
      cutoffDate.setFullYear(now.getFullYear() - 1);
    }
    
    return data.filter((entry: any) => new Date(entry.date) >= cutoffDate);
  };
  
  // Hole Metrikdaten basierend auf der ausgewählten Metrik
  const getMetricData = () => {
    if (!user) return [];
    
    switch (activeMetric) {
      case 'weight':
        return user.weightHistory ? 
          filterDataByTimeRange([...user.weightHistory].reverse().map(entry => ({
            date: entry.date,
            value: entry.weight
          }))) : [];
      case 'calories':
        return user.caloriesHistory ? 
          filterDataByTimeRange([...user.caloriesHistory].reverse()) : [];
      case 'water':
        return user.waterHistory ? 
          filterDataByTimeRange([...user.waterHistory].reverse()) : [];
      case 'protein':
        return user.proteinHistory ? 
          filterDataByTimeRange([...user.proteinHistory].reverse()) : [];
      default:
        return [];
    }
  };
  
  // Hole die Daten für die ausgewählte Metrik
  const metricData = getMetricData();
  
  // Aktuelle Metrik-Informationen
  const currentMetric = metricOptions.find(m => m.value === activeMetric) || metricOptions[0];
  
  // Aktueller Wert, Zielwert und Trend
  const latestValue = metricData.length > 0 ? metricData[metricData.length - 1].value : 0;
  
  // Berechne Zielwert basierend auf der Metrik
  let targetValue = 0;
  if (user) {
    switch (activeMetric) {
      case 'weight':
        targetValue = user.targetWeight || 0;
        break;
      case 'calories':
        targetValue = user.calorieGoal || 0;
        break;
      case 'water':
        targetValue = user.waterGoal || 0;
        break;
      case 'protein':
        targetValue = user.proteinGoal || 0;
        break;
    }
  }
  
  // Berechne Veränderung
  const valueDiff = metricData.length > 1 
    ? metricData[metricData.length - 1].value - metricData[0].value 
    : 0;
  
  // Bestimme, ob ein positiver Trend gut ist (für Gewicht ist eine Reduktion positiv, wenn Zielgewicht kleiner ist)
  let isPositiveTrend = false;
  if (activeMetric === 'weight' && user?.targetWeight && user?.weight) {
    isPositiveTrend = user.targetWeight < user.weight ? valueDiff < 0 : valueDiff > 0;
  } else {
    isPositiveTrend = valueDiff > 0;
  }
  
  // Trendfarbe basierend auf der Metrik
  const trendColor = isPositiveTrend ? 'green.500' : 'red.500';
  
  return (
    <Box mb={8}>
      <Heading size="md" mb={4}>{t('common.dashboard', 'Dashboard')}</Heading>
      
      {/* Auswahlmöglichkeiten für Metrik und Zeitraum */}
      <Flex justify="space-between" align="center" mb={4}>
        <Select 
          value={activeMetric} 
          onChange={(e) => setActiveMetric(e.target.value)} 
          width="auto"
          size="sm"
        >
          {metricOptions.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </Select>
        
        <HStack>
          <Text fontSize="sm">{t('common.timeRange', 'Zeitraum')}:</Text>
          <Select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)} 
            width="auto"
            size="sm"
          >
            {timeRangeOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </Select>
        </HStack>
      </Flex>
      
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mb={6}>
        <Box 
          p={3} 
          borderRadius="md" 
          bg={greenBoxBg}
          borderLeft="4px solid" 
          borderColor="green.400"
        >
          <Text fontWeight="medium" fontSize="sm" color={greenTextColor}>
            {t(`common.current${activeMetric.charAt(0).toUpperCase() + activeMetric.slice(1)}`, `Aktuelles ${currentMetric.label}`)}
          </Text>
          <Text fontSize="xl" fontWeight="bold">{latestValue} {currentMetric.unit}</Text>
          <Text fontSize="xs" color="gray.500">{metricData[metricData.length - 1]?.date}</Text>
        </Box>
            
        <Box 
          p={3} 
          borderRadius="md" 
          bg={isPositiveTrend ? blueBoxBg : redBoxBg}
          borderLeft="4px solid"
          borderColor={isPositiveTrend ? 'blue.400' : 'red.400'}
        >
          <Flex align="center">
            <Text 
              fontWeight="medium" 
              fontSize="sm" 
              color={isPositiveTrend ? blueTextColor : redTextColor}
            >
              {t('common.trend', 'Trend')}
            </Text>
            {metricData.length > 1 && (
              <Icon 
                as={isPositiveTrend ? FiArrowUp : FiArrowDown} 
                color={trendColor}
                ml={1}
                boxSize={4}
              />
            )}
          </Flex>
          {metricData.length > 1 ? (
            <>
              <Text 
                fontSize="xl" 
                fontWeight="bold" 
                color={trendColor}
              >
                {isPositiveTrend ? '+' : ''}{Math.abs(valueDiff).toFixed(1)} {currentMetric.unit}
              </Text>
              <Text fontSize="xs" color="gray.500">{t('common.overTimeRange', `Über ${timeRangeOptions.find(o => o.value === timeRange)?.label}`)}</Text>
            </>
          ) : (
            <>
              <Text fontSize="xl" fontWeight="bold" color="gray.500">-- {currentMetric.unit}</Text>
              <Text fontSize="xs" color="gray.500">{t('common.notEnoughData', 'Nicht genügend Daten')}</Text>
          </>
        )}
      </Box>
        
        <Box 
          p={3} 
          borderRadius="md" 
          bg={purpleBoxBg} 
          borderLeft="4px solid" 
          borderColor="purple.400"
        >
          <Text fontWeight="medium" fontSize="sm" color={purpleTextColor}>
            {t('common.target', 'Ziel')}
          </Text>
          <Text fontSize="xl" fontWeight="bold">{targetValue} {currentMetric.unit}</Text>
          <Text 
            fontSize="xs" 
            color={activeMetric === 'weight' ? (latestValue > targetValue ? "green.500" : "red.500") : (latestValue < targetValue ? "red.500" : "green.500")}
          >
            {Math.abs(latestValue - targetValue).toFixed(1)} {currentMetric.unit} {t('common.fromTarget', 'vom Ziel entfernt')}
          </Text>
        </Box>
      </SimpleGrid>
      
      {/* Verbesserte Visualisierung der Daten */}
      <Box 
        h="250px" 
        mb={4} 
        bg={chartBg} 
        borderRadius="md" 
        p={4} 
        position="relative"
        boxShadow="sm"
        borderWidth="1px"
        borderColor={chartBorderColor}
      >
        {/* Hier kommt die Chart-Implementierung */}
        {metricData.length > 0 ? (
          <Line
            data={{
              labels: metricData.map(entry => new Date(entry.date).toLocaleDateString()),
              datasets: [
                {
                  label: currentMetric.label,
                  data: metricData.map(entry => entry.value),
                  borderColor: trendColor,
                  backgroundColor: isPositiveTrend ? 'rgba(79, 209, 197, 0.2)' : 'rgba(255, 99, 132, 0.2)',
                  borderWidth: 2,
                  pointRadius: 0,
                  pointHoverRadius: 5,
                  pointHoverBorderWidth: 1,
                  pointHoverBorderColor: trendColor,
                  pointHoverBackgroundColor: isPositiveTrend ? 'rgba(79, 209, 197, 1)' : 'rgba(255, 99, 132, 1)',
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false,
                },
                tooltip: {
                  callbacks: {
                    label: (context) => {
                      const value = context.parsed.y;
                      return `${currentMetric.label}: ${value} ${currentMetric.unit}`;
                    },
                  },
                },
              },
              scales: {
                x: {
                  ticks: {
                    color: textColor,
                  },
                },
                y: {
                  ticks: {
                    color: textColor,
                  },
                },
              },
            }}
          />
        ) : (
          <Flex
            height="100%"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            color="gray.500"
          >
            <Icon as={FiBarChart2} boxSize={10} mb={2} />
            <Text>{t('progress.noDataAvailable', 'Keine Daten verfügbar')}</Text>
            <Text fontSize="sm">
              {t('progress.startTracking', 'Beginne mit dem Tracking, um Daten zu sehen')}
            </Text>
          </Flex>
        )}
      </Box>
      
      {/* Button zum Springen zur Tracking-Seite */}
      <Flex justifyContent="center">
        <Button 
          size="sm" 
          leftIcon={<Icon as={FiPlus} />}
          colorScheme="brand"
          onClick={() => {
            switch (activeMetric) {
              case 'weight':
                navigate('/profile');
                break;
              case 'calories':
                navigate('/meals');
                break;
              case 'water':
                navigate('/water');
                break;
              case 'protein':
                navigate('/meals');
                break;
            }
          }}
        >
          {t('progress.addNew', 'Neuen Eintrag hinzufügen')}
        </Button>
      </Flex>
    </Box>
  );
};

// Umbenennung der Komponente von TabPanels zu CustomTabPanels
const CustomTabPanels: React.FC<{ activeTab: number; handleTabChange: (index: number) => void }> = ({ activeTab, handleTabChange }) => {
  const { t } = useTranslation();
  const [missionType, setMissionType] = useState<'daily' | 'weekly'>('daily');
  
  return (
    <ChakraTabPanels>
      <TabPanel p={0}>
        {/* Verbesserte Übersichtsseite mit Grid-Layout */}
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={8}>
          <XpProgressSummary />
          <StreakSummary />
        </SimpleGrid>
        
        {/* Dashboard mit Charts */}
        <DashboardOverview />
        
        {/* Missionen */}
        <Box mb={8}>
          <Heading size="md" mb={4}>{t('progress.missions', 'Missionen')}</Heading>
          
          {/* Umschalter zwischen täglichen und wöchentlichen Missionen */}
          <Flex justify="space-between" align="center" mt={6} mb={4}>
            <Text fontSize="lg" fontWeight="bold">
              {missionType === 'daily' 
                ? t('progress.dailyMissionsTitle', 'Daily Missions') 
                : t('progress.weeklyMissions', 'Weekly Missions')}
            </Text>
            <ButtonGroup size="sm" isAttached variant="outline">
              <Button
                leftIcon={<Icon as={FiClock} />}
                onClick={() => setMissionType('daily')}
                colorScheme={missionType === 'daily' ? 'brand' : undefined}
                variant={missionType === 'daily' ? 'solid' : 'outline'}
              >
                {t('progress.daily', 'Daily')}
              </Button>
              <Button
                leftIcon={<Icon as={FiTarget} />}
                onClick={() => setMissionType('weekly')}
                colorScheme={missionType === 'weekly' ? 'brand' : undefined}
                variant={missionType === 'weekly' ? 'solid' : 'outline'}
              >
                {t('progress.weekly', 'Weekly')}
              </Button>
            </ButtonGroup>
          </Flex>
          
          {/* Anzeige der entsprechenden Missionen basierend auf der Auswahl */}
          {missionType === 'daily' ? (
            <DailyMissionsContent />
          ) : (
            <WeeklyMissionsContent />
          )}
        </Box>
      </TabPanel>
      
      <TabPanel p={0} id="nutrition-tab">
        <NutritionGoalsContent />
      </TabPanel>
    </ChakraTabPanels>
  );
};

// Überarbeitete Hauptkomponente für die Fortschrittsseite
const ProgressPage: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);
  
  const handleTabChange = (index: number) => {
    setActiveTab(index);
  };

  return (
    <Container maxW="1200px" py={6}>
      <Flex direction="column">
        <Heading mb={6}>{t('progress.title', 'Fortschritt & Missionen')}</Heading>
        
        <Tabs 
          variant="soft-rounded" 
          colorScheme="brand" 
          isLazy 
          index={activeTab}
          onChange={handleTabChange}
        >
        <TabList
            mb={6} 
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
            <Tab minW="auto" px={3}><Icon as={FiActivity} mr={2} /> {t('progress.overview', 'Übersicht')}</Tab>
            <Tab minW="auto" px={3}><Icon as={FiBarChart2} mr={2} /> {t('progress.nutrition', 'Ernährung')}</Tab>
        </TabList>
        
          <CustomTabPanels activeTab={activeTab} handleTabChange={handleTabChange} />
        </Tabs>
      </Flex>
    </Container>
  );
};

// Hilfsfunktion für tägliche Missionen
const DailyMissionsContent: React.FC = () => {
  const { t } = useTranslation();
  const { user, completeDaily } = useUser();
  const tabBg = useColorModeValue('white', 'gray.800');
  
  const dailyMissions = user?.dailyMissions || [];

  return (
    <Box 
      p={4} 
      bg={tabBg} 
      borderRadius="md" 
      boxShadow="sm"
      gridColumn={{ md: "span 2" }}
    >
      <Box>
        {dailyMissions.length === 0 ? (
          <Text textAlign="center" color="gray.500" py={4}>
            {t('progress.noMissions', 'Keine täglichen Missionen gefunden.')}
          </Text>
        ) : (
          <VStack spacing={4} align="stretch">
            {dailyMissions.map((mission) => (
              <MissionItem 
                key={mission.id} 
                mission={mission} 
                onComplete={completeDaily} 
              />
            ))}
          </VStack>
        )}
      </Box>
    </Box>
  );
};

// Komponente, die den Inhalt der NutritionGoalsPage einbindet
const NutritionGoalsContent: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useUser();
  const navigate = useNavigate();
  
  // Farben für die verschiedenen Abschnitte
  const calorieBoxBg = useColorModeValue('green.50', 'green.900');
  const calorieTextColor = useColorModeValue('green.800', 'green.200');
  const burnBoxBg = useColorModeValue('orange.50', 'orange.900');
  const burnTextColor = useColorModeValue('orange.800', 'orange.200');
  const sectionBg = useColorModeValue('gray.50', 'gray.800');
  const tipBg = useColorModeValue('blue.50', 'blue.900');
  const tipTextColor = useColorModeValue('blue.800', 'blue.200');
  
  // Hole die Ernährungsziele aus dem Benutzer
  const calorieGoal = user?.calorieGoal || 0;
  const proteinGoal = user?.proteinGoal || 0;
  const carbGoal = user?.carbGoal || 0;
  const fatGoal = user?.fatGoal || 0;
  const waterGoal = user?.waterGoal || 0;
  
  // Berechne das Wasserintake in Litern für die Anzeige
  const waterIntake = (waterGoal / 1000).toFixed(1);
  
  // Täglicher Fortschritt
  const dailyProgress = user?.dailyProgress || { calories: 0, protein: 0, carbs: 0, fat: 0, water: 0 };
  
  // Berechne die Prozentsätze für die Fortschrittsanzeigen
  const goalCaloriePercentage = Math.min(100, Math.round((dailyProgress.calories / calorieGoal) * 100) || 0);
  const goalProteinPercentage = Math.min(100, Math.round((dailyProgress.protein / proteinGoal) * 100) || 0);
  const goalCarbPercentage = Math.min(100, Math.round((dailyProgress.carbs / carbGoal) * 100) || 0);
  const goalFatPercentage = Math.min(100, Math.round((dailyProgress.fat / fatGoal) * 100) || 0);
  const goalWaterPercentage = Math.min(100, Math.round((dailyProgress.water / waterGoal) * 100) || 0);
  
  return (
    <Box>
      <Heading size="md" mb={4}>{t('common.yourNutritionGoals', 'Deine Ernährungsziele')}</Heading>
      
      {/* Kalorienübersicht */}
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={6}>
        <Box 
          p={5} 
          shadow="md" 
          borderRadius="lg" 
          bg={calorieBoxBg} 
          color={calorieTextColor}
          textAlign="center"
          transition="transform 0.3s"
          _hover={{ transform: "translateY(-5px)", shadow: "lg" }}
        >
          <Heading size="md" mb={2}>
            {t('common.dailyCalories', 'Tägliches Kalorienziel')}
        </Heading>
          <Heading size="xl" mb={2}>
            {calorieGoal} kcal
          </Heading>
          <Text fontSize="sm">
            {t('common.caloriesDescription', 'Deine optimale tägliche Kalorienzufuhr')}
        </Text>
          <Progress value={goalCaloriePercentage} colorScheme="green" size="sm" mt={4} />
          <Text fontSize="xs" mt={1}>{dailyProgress.calories} / {calorieGoal} kcal ({goalCaloriePercentage}%)</Text>
      </Box>
      
        {/* Wasseraufnahme */}
        <Box 
          p={5} 
          shadow="md" 
          borderRadius="lg" 
          bg={tipBg} 
          color={tipTextColor}
          transition="transform 0.3s"
          _hover={{ transform: "translateY(-5px)", shadow: "lg" }}
        >
          <Flex direction="column" align="center">
            <Heading size="md" mb={2}>
              {t('common.waterIntake', 'Tägliche Wasseraufnahme')}
            </Heading>
            <Heading size="xl" mb={2}>
              {waterIntake} Liter
            </Heading>
            <Text fontSize="sm" textAlign="center">
              {t('common.waterDescription', 'Optimale Hydration für deinen Körper')}
            </Text>
            <Progress value={goalWaterPercentage} colorScheme="blue" size="sm" mt={4} width="100%" />
            <Text fontSize="xs" mt={1}>{dailyProgress.water} / {waterGoal} ml ({goalWaterPercentage}%)</Text>
          </Flex>
        </Box>
      </SimpleGrid>
      
      {/* Makronährstoffe */}
      <Heading size="sm" mb={3}>{t('nutritionGoals.macronutrients', 'Makronährstoffe')}</Heading>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mb={6}>
        {/* Protein */}
        <Stat p={4} bg={sectionBg} borderRadius="lg" shadow="sm">
          <StatLabel>{t('nutritionGoals.protein', 'Protein')}</StatLabel>
          <StatNumber>{proteinGoal} g</StatNumber>
          <Progress value={goalProteinPercentage} colorScheme="purple" size="sm" mt={2} />
          <Text fontSize="xs" mt={1}>{dailyProgress.protein} / {proteinGoal} g ({goalProteinPercentage}%)</Text>
        </Stat>
        
        {/* Kohlenhydrate */}
        <Stat p={4} bg={sectionBg} borderRadius="lg" shadow="sm">
          <StatLabel>{t('nutritionGoals.carbs', 'Kohlenhydrate')}</StatLabel>
          <StatNumber>{carbGoal} g</StatNumber>
          <Progress value={goalCarbPercentage} colorScheme="orange" size="sm" mt={2} />
          <Text fontSize="xs" mt={1}>{dailyProgress.carbs} / {carbGoal} g ({goalCarbPercentage}%)</Text>
        </Stat>
        
        {/* Fett */}
        <Stat p={4} bg={sectionBg} borderRadius="lg" shadow="sm">
          <StatLabel>{t('nutritionGoals.fat', 'Fett')}</StatLabel>
          <StatNumber>{fatGoal} g</StatNumber>
          <Progress value={goalFatPercentage} colorScheme="yellow" size="sm" mt={2} />
          <Text fontSize="xs" mt={1}>{dailyProgress.fat} / {fatGoal} g ({goalFatPercentage}%)</Text>
        </Stat>
      </SimpleGrid>
      
      {/* Button zur vollständigen Seite */}
      <Flex justify="center" mt={6}>
        <Button 
          colorScheme="brand" 
          size="md" 
          leftIcon={<FiTarget />}
          onClick={() => navigate('/nutrition-goals')}
        >
          {t('nutritionGoals.adjustGoals', 'Ernährungsziele anpassen')}
        </Button>
      </Flex>
    </Box>
  );
};

// Hilfsfunktion für wöchentliche Missionen
const WeeklyMissionsContent: React.FC = () => {
  const { t } = useTranslation();
  const { user, updateUser } = useUser();
  const tabBg = useColorModeValue('white', 'gray.800');
  
  const weeklyMissions = user?.weeklyMissions || [];

  // Funktion zum Abschließen einer wöchentlichen Mission
  const completeWeekly = (id: number) => {
    if (!user) return;
    
    const updatedMissions = user.weeklyMissions?.map(mission => 
      mission.id === id ? { ...mission, completed: true } : mission
    ) || [];
    
    // Aktualisiere den Benutzer mit den neuen Missionen
    updateUser({
      ...user,
      weeklyMissions: updatedMissions
    });
  };

  return (
    <Box 
      p={4} 
      bg={tabBg} 
      borderRadius="md" 
      boxShadow="sm"
      gridColumn={{ md: "span 2" }}
    >
      <Box>
        {weeklyMissions.length === 0 ? (
          <Text textAlign="center" color="gray.500" py={4}>
            {t('progress.noWeeklyMissions', 'Keine wöchentlichen Missionen gefunden.')}
          </Text>
        ) : (
          <VStack spacing={4} align="stretch">
            {weeklyMissions.map((mission) => (
              <MissionItem 
                key={mission.id} 
                mission={mission} 
                onComplete={completeWeekly} 
              />
            ))}
          </VStack>
        )}
      </Box>
    </Box>
  );
};

export default ProgressPage; 
