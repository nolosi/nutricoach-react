import React, { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Flex,
  SimpleGrid,
  Progress,
  useColorModeValue,
  Icon,
  VStack,
  HStack,
  Button,
  Badge,
} from '@chakra-ui/react';
import { FiActivity, FiDroplet, FiPieChart, FiHeart, FiPlus, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { useUser } from '../contexts/UserContext';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

// ChartJS registrieren
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface WeightEntry {
  date: string;
  weight: number;
  note?: string;
}

interface MetricCardProps {
  title: string;
  value: string;
  description?: string;
  color?: string;
  icon?: React.ReactElement;
}

// Komponente für Metrikkarten
const MetricCard: React.FC<MetricCardProps> = ({ title, value, description, color = "brand.500", icon }) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.100', 'gray.700');
  
  return (
    <Box 
      p={5} 
      bg={cardBg} 
      borderRadius="xl" 
      boxShadow="sm" 
      borderWidth="1px" 
      borderColor={borderColor}
      transition="all 0.3s"
      _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}
    >
      <Flex justify="space-between" align="center" mb={2}>
        <Text fontSize="sm" fontWeight="medium" color="gray.500">{title}</Text>
        {icon && icon}
      </Flex>
      <Text fontSize="2xl" fontWeight="bold" color={color}>{value}</Text>
      {description && <Text fontSize="xs" color="gray.500" mt={1}>{description}</Text>}
    </Box>
  );
};

// Hauptkomponente
const WeightTracker: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<string>('weight');
  const [timeRange, setTimeRange] = useState<string>('Monat');
  
  // Farbschemas
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const tabBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const accentColor = useColorModeValue('brand.500', 'brand.400');
  const headingColor = useColorModeValue('gray.800', 'white');
  
  // Zusätzliche Farbvariablen für Charts
  const weightBgColor = useColorModeValue('rgba(66, 153, 225, 0.1)', 'rgba(66, 153, 225, 0.05)');
  const targetWeightColor = useColorModeValue('#E53E3E', '#FC8181');
  const caloriesBgColor = useColorModeValue('rgba(72, 187, 120, 0.1)', 'rgba(72, 187, 120, 0.05)');
  const caloriesTargetColor = useColorModeValue('#DD6B20', '#F6AD55');
  const waterBgColor = useColorModeValue('rgba(49, 130, 206, 0.1)', 'rgba(49, 130, 206, 0.05)');
  const waterTargetColor = useColorModeValue('#3182CE', '#63B3ED');
  const proteinBgColor = useColorModeValue('rgba(159, 122, 234, 0.1)', 'rgba(159, 122, 234, 0.05)');
  const proteinTargetColor = useColorModeValue('#805AD5', '#B794F4');
  
  // Testdaten für die Entwicklung
  const testWeightEntries: WeightEntry[] = [
    { date: '2025-03-02', weight: 104.5 },
    { date: '2025-03-01', weight: 105.0 },
    { date: '2025-02-28', weight: 105.2 },
    { date: '2025-02-25', weight: 106.0 },
    { date: '2025-02-20', weight: 106.5 },
    { date: '2025-02-15', weight: 107.0 },
    { date: '2025-02-10', weight: 107.5 },
    { date: '2025-02-05', weight: 108.0 },
    { date: '2025-02-01', weight: 108.5 },
    { date: '2025-01-25', weight: 109.0 },
    { date: '2025-01-20', weight: 109.5 },
    { date: '2025-01-15', weight: 110.0 },
  ];
  
  const testCaloriesHistory = [
    { date: '2025-03-02', value: 1850 },
    { date: '2025-03-01', value: 1920 },
    { date: '2025-02-28', value: 2100 },
    { date: '2025-02-27', value: 1950 },
    { date: '2025-02-26', value: 2050 },
    { date: '2025-02-25', value: 1900 },
    { date: '2025-02-24', value: 2200 },
    { date: '2025-02-23', value: 1800 },
    { date: '2025-02-22', value: 2150 },
    { date: '2025-02-21', value: 1950 },
    { date: '2025-02-20', value: 2000 },
    { date: '2025-02-19', value: 1850 },
  ];
  
  const testWaterHistory = [
    { date: '2025-03-02', value: 2200 },
    { date: '2025-03-01', value: 2500 },
    { date: '2025-02-28', value: 2300 },
    { date: '2025-02-27', value: 2100 },
    { date: '2025-02-26', value: 2400 },
    { date: '2025-02-25', value: 2600 },
    { date: '2025-02-24', value: 2200 },
    { date: '2025-02-23', value: 2000 },
    { date: '2025-02-22', value: 2300 },
    { date: '2025-02-21', value: 2500 },
    { date: '2025-02-20', value: 2400 },
    { date: '2025-02-19', value: 2200 },
  ];
  
  const testProteinHistory = [
    { date: '2025-03-02', value: 95 },
    { date: '2025-03-01', value: 110 },
    { date: '2025-02-28', value: 105 },
    { date: '2025-02-27', value: 90 },
    { date: '2025-02-26', value: 115 },
    { date: '2025-02-25', value: 120 },
    { date: '2025-02-24', value: 100 },
    { date: '2025-02-23', value: 95 },
    { date: '2025-02-22', value: 105 },
    { date: '2025-02-21', value: 110 },
    { date: '2025-02-20', value: 100 },
    { date: '2025-02-19', value: 90 },
  ];
  
  // Wir verwenden tatsächliche Benutzerdaten oder Testdaten, wenn keine vorhanden sind
  const weightEntries = user?.weightHistory?.length ? user.weightHistory : testWeightEntries;
  const targetWeight = user?.targetWeight || 90; // Fallback: 90kg als Zielgewicht
  
  // Historische Daten für andere Metriken
  const caloriesHistory = user?.caloriesHistory?.length ? user.caloriesHistory : testCaloriesHistory;
  const proteinHistory = user?.proteinHistory?.length ? user.proteinHistory : testProteinHistory;
  const waterHistory = user?.waterHistory?.length ? user.waterHistory : testWaterHistory;
  
  // Aktuelles Gewicht und Trend
  const currentWeight = weightEntries.length > 0 ? weightEntries[0].weight : 0;
  const weightTrend = weightEntries.length > 1 
    ? (currentWeight - weightEntries[1].weight).toFixed(1) 
    : '--';
  const showTrend = weightEntries.length > 1;
  
  // Differenz zum Ziel berechnen
  const weightDifference = Math.abs(currentWeight - targetWeight).toFixed(1);
  const isAtTarget = Math.abs(currentWeight - targetWeight) < 0.5;
  const isAboveTarget = currentWeight > targetWeight;
  
  // Datum der letzten Messung - Fallback auf aktuelles Datum
  const lastMeasurementDate = weightEntries.length > 0 
    ? weightEntries[0].date 
    : '2025-03-02';
  
  // Formatiertes Datum für die Anzeige
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
  };
  
  // Zeitraum für die Anzeige der Daten filtern
  const filterDataByTimeRange = (data: any[], dateField: string = 'date') => {
    if (data.length === 0) return [];
    
    const now = new Date();
    let startDate = new Date();
    
    switch(timeRange) {
      case 'Woche':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'Monat':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'Jahr':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(now.getMonth() - 1); // Standard: 1 Monat
    }
    
    return data
      .filter(item => new Date(item[dateField]) >= startDate)
      .sort((a, b) => new Date(a[dateField]).getTime() - new Date(b[dateField]).getTime());
  };
  
  // Chart-Daten für Gewicht vorbereiten
  const prepareWeightChartData = () => {
    // Falldaten, wenn keine Gewichtsdaten vorhanden sind
    if (weightEntries.length === 0) {
      return {
        labels: ['2.3.2025'],
        weights: [104],
        minWeight: 98,
        maxWeight: 110
      };
    }
    
    const filteredEntries = filterDataByTimeRange(weightEntries);
    
    if (filteredEntries.length === 0) {
      return {
        labels: ['2.3.2025'],
        weights: [104],
        minWeight: 98,
        maxWeight: 110
      };
    }
    
    const labels = filteredEntries.map(entry => {
      const date = new Date(entry.date);
      return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    });
    
    const weights = filteredEntries.map(entry => entry.weight);
    
    return {
      labels,
      weights,
      minWeight: Math.min(...weights, targetWeight) - 2,
      maxWeight: Math.max(...weights, targetWeight) + 2
    };
  };
  
  // Chart-Daten für Kalorien vorbereiten
  const prepareCaloriesChartData = () => {
    if (caloriesHistory.length === 0) {
      return {
        labels: ['2.3.2025'],
        values: [2000],
        minValue: 1800,
        maxValue: 2200
      };
    }
    
    const filteredEntries = filterDataByTimeRange(caloriesHistory);
    
    if (filteredEntries.length === 0) {
      return {
        labels: ['2.3.2025'],
        values: [2000],
        minValue: 1800,
        maxValue: 2200
      };
    }
    
    const labels = filteredEntries.map(entry => {
      const date = new Date(entry.date);
      return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    });
    
    const values = filteredEntries.map(entry => entry.value);
    const calorieGoal = user?.calorieGoal || 2000;
    
    return {
      labels,
      values,
      minValue: Math.min(...values, calorieGoal) - 200,
      maxValue: Math.max(...values, calorieGoal) + 200
    };
  };
  
  // Chart-Daten für Wasser vorbereiten
  const prepareWaterChartData = () => {
    if (waterHistory.length === 0) {
      return {
        labels: ['2.3.2025'],
        values: [2000],
        minValue: 1800,
        maxValue: 2200
      };
    }
    
    const filteredEntries = filterDataByTimeRange(waterHistory);
    
    if (filteredEntries.length === 0) {
      return {
        labels: ['2.3.2025'],
        values: [2000],
        minValue: 1800,
        maxValue: 2200
      };
    }
    
    const labels = filteredEntries.map(entry => {
      const date = new Date(entry.date);
      return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    });
    
    const values = filteredEntries.map(entry => entry.value);
    const waterGoal = user?.waterGoal || 2500;
    
    return {
      labels,
      values,
      minValue: Math.min(...values, waterGoal) - 200,
      maxValue: Math.max(...values, waterGoal) + 200
    };
  };
  
  // Chart-Daten für Protein vorbereiten
  const prepareProteinChartData = () => {
    if (proteinHistory.length === 0) {
      return {
        labels: ['2.3.2025'],
        values: [80],
        minValue: 60,
        maxValue: 100
      };
    }
    
    const filteredEntries = filterDataByTimeRange(proteinHistory);
    
    if (filteredEntries.length === 0) {
      return {
        labels: ['2.3.2025'],
        values: [80],
        minValue: 60,
        maxValue: 100
      };
    }
    
    const labels = filteredEntries.map(entry => {
      const date = new Date(entry.date);
      return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    });
    
    const values = filteredEntries.map(entry => entry.value);
    const proteinGoal = user?.proteinGoal || 120;
    
    return {
      labels,
      values,
      minValue: Math.min(...values, proteinGoal) - 20,
      maxValue: Math.max(...values, proteinGoal) + 20
    };
  };
  
  // Daten für das aktive Tab vorbereiten
  const getActiveChartData = React.useCallback(() => {
    switch(activeTab) {
      case 'weight':
        const { labels, weights, minWeight, maxWeight } = prepareWeightChartData();
        return {
          labels,
          datasets: [
            {
              label: t('tracker.weight', 'Gewicht'),
              data: weights,
              borderColor: accentColor,
              backgroundColor: weightBgColor,
              borderWidth: 3,
              tension: 0.4,
              fill: true,
              pointBackgroundColor: accentColor,
              pointRadius: 4,
              pointHoverRadius: 6,
            },
            {
              label: t('tracker.targetWeight', 'Zielgewicht'),
              data: Array(labels.length).fill(targetWeight),
              borderColor: targetWeightColor,
              borderWidth: 2,
              borderDash: [5, 5],
              pointRadius: 0,
              tension: 0,
              fill: false,
            },
          ],
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                min: minWeight,
                max: maxWeight,
                title: {
                  display: true,
                  text: t('tracker.weightKg', 'Gewicht (kg)'),
                  font: {
                    size: 12,
                  }
                },
                ticks: {
                  font: {
                    size: 12,
                  }
                }
              },
              x: {
                title: {
                  display: true,
                  text: t('tracker.date', 'Datum'),
                  font: {
                    size: 12,
                  }
                },
                ticks: {
                  font: {
                    size: 12,
                  }
                }
              }
            },
            plugins: {
              tooltip: {
                enabled: true,
                mode: 'index' as const,
                intersect: false,
                titleFont: {
                  size: 14,
                },
                bodyFont: {
                  size: 13,
                },
              },
            },
          }
        };
      case 'calories':
        const caloriesData = prepareCaloriesChartData();
        return {
          labels: caloriesData.labels,
          datasets: [
            {
              label: t('tracker.calories', 'Kalorien'),
              data: caloriesData.values,
              borderColor: caloriesTargetColor,
              backgroundColor: caloriesBgColor,
              borderWidth: 3,
              tension: 0.4,
              fill: true,
              pointBackgroundColor: caloriesTargetColor,
              pointRadius: 4,
              pointHoverRadius: 6,
            },
            {
              label: t('tracker.calorieGoal', 'Kalorienziel'),
              data: Array(caloriesData.labels.length).fill(user?.calorieGoal || 2000),
              borderColor: caloriesTargetColor,
              borderWidth: 2,
              borderDash: [5, 5],
              pointRadius: 0,
              tension: 0,
              fill: false,
            },
          ],
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                min: caloriesData.minValue,
                max: caloriesData.maxValue,
                title: {
                  display: true,
                  text: t('tracker.caloriesKcal', 'Kalorien (kcal)'),
                  font: {
                    size: 12,
                  }
                },
                grid: {
                  color: useColorModeValue('rgba(0,0,0,0.05)', 'rgba(255,255,255,0.05)'),
                },
              },
              x: {
                title: {
                  display: true,
                  text: t('tracker.date', 'Datum'),
                  font: {
                    size: 12,
                  }
                },
                grid: {
                  display: false,
                },
              },
            },
            plugins: {
              legend: {
                position: 'top' as const,
                labels: {
                  boxWidth: 12,
                  usePointStyle: true,
                  pointStyle: 'circle',
                }
              },
              tooltip: {
                mode: 'index' as const,
                intersect: false,
                backgroundColor: useColorModeValue('rgba(0,0,0,0.7)', 'rgba(0,0,0,0.9)'),
                padding: 10,
                cornerRadius: 4,
                titleFont: {
                  size: 14,
                },
                bodyFont: {
                  size: 13,
                },
              },
            },
          }
        };
      case 'water':
        const waterData = prepareWaterChartData();
        return {
          labels: waterData.labels,
          datasets: [
            {
              label: t('tracker.water', 'Wasser'),
              data: waterData.values,
              borderColor: waterTargetColor,
              backgroundColor: waterBgColor,
              borderWidth: 3,
              tension: 0.4,
              fill: true,
              pointBackgroundColor: waterTargetColor,
              pointRadius: 4,
              pointHoverRadius: 6,
            },
            {
              label: t('tracker.waterGoal', 'Wasserziel'),
              data: Array(waterData.labels.length).fill(user?.waterGoal || 2500),
              borderColor: waterTargetColor,
              borderWidth: 2,
              borderDash: [5, 5],
              pointRadius: 0,
              tension: 0,
              fill: false,
            },
          ],
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                min: waterData.minValue,
                max: waterData.maxValue,
                title: {
                  display: true,
                  text: t('tracker.waterMl', 'Wasser (ml)'),
                  font: {
                    size: 12,
                  }
                },
                grid: {
                  color: useColorModeValue('rgba(0,0,0,0.05)', 'rgba(255,255,255,0.05)'),
                },
              },
              x: {
                title: {
                  display: true,
                  text: t('tracker.date', 'Datum'),
                  font: {
                    size: 12,
                  }
                },
                grid: {
                  display: false,
                },
              },
            },
            plugins: {
              legend: {
                position: 'top' as const,
                labels: {
                  boxWidth: 12,
                  usePointStyle: true,
                  pointStyle: 'circle',
                }
              },
              tooltip: {
                mode: 'index' as const,
                intersect: false,
                backgroundColor: useColorModeValue('rgba(0,0,0,0.7)', 'rgba(0,0,0,0.9)'),
                padding: 10,
                cornerRadius: 4,
                titleFont: {
                  size: 14,
                },
                bodyFont: {
                  size: 13,
                },
              },
            },
          }
        };
      case 'protein':
        const proteinData = prepareProteinChartData();
        return {
          labels: proteinData.labels,
          datasets: [
            {
              label: t('tracker.protein', 'Protein'),
              data: proteinData.values,
              borderColor: proteinTargetColor,
              backgroundColor: proteinBgColor,
              borderWidth: 3,
              tension: 0.4,
              fill: true,
              pointBackgroundColor: proteinTargetColor,
              pointRadius: 4,
              pointHoverRadius: 6,
            },
            {
              label: t('tracker.proteinGoal', 'Proteinziel'),
              data: Array(proteinData.labels.length).fill(user?.proteinGoal || 120),
              borderColor: proteinTargetColor,
              borderWidth: 2,
              borderDash: [5, 5],
              pointRadius: 0,
              tension: 0,
              fill: false,
            },
          ],
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                min: proteinData.minValue,
                max: proteinData.maxValue,
                title: {
                  display: true,
                  text: t('tracker.proteinG', 'Protein (g)'),
                  font: {
                    size: 12,
                  }
                },
                grid: {
                  color: useColorModeValue('rgba(0,0,0,0.05)', 'rgba(255,255,255,0.05)'),
                },
              },
              x: {
                title: {
                  display: true,
                  text: t('tracker.date', 'Datum'),
                  font: {
                    size: 12,
                  }
                },
                grid: {
                  display: false,
                },
              },
            },
            plugins: {
              legend: {
                position: 'top' as const,
                labels: {
                  boxWidth: 12,
                  usePointStyle: true,
                  pointStyle: 'circle',
                }
              },
              tooltip: {
                mode: 'index' as const,
                intersect: false,
                backgroundColor: useColorModeValue('rgba(0,0,0,0.7)', 'rgba(0,0,0,0.9)'),
                padding: 10,
                cornerRadius: 4,
                titleFont: {
                  size: 14,
                },
                bodyFont: {
                  size: 13,
                },
              },
            },
          }
        };
      default:
        const defaultData = prepareWeightChartData();
        return {
          labels: defaultData.labels,
          datasets: [
            {
              label: t('tracker.weight', 'Gewicht'),
              data: defaultData.weights,
              borderColor: accentColor,
              backgroundColor: weightBgColor,
              borderWidth: 3,
              tension: 0.4,
              fill: true,
              pointBackgroundColor: accentColor,
              pointRadius: 4,
              pointHoverRadius: 6,
            },
            {
              label: t('tracker.targetWeight', 'Zielgewicht'),
              data: Array(defaultData.labels.length).fill(targetWeight),
              borderColor: targetWeightColor,
              borderWidth: 2,
              borderDash: [5, 5],
              pointRadius: 0,
              tension: 0,
              fill: false,
            },
          ],
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                min: defaultData.minWeight,
                max: defaultData.maxWeight,
                title: {
                  display: true,
                  text: t('tracker.weightKg', 'Gewicht (kg)'),
                  font: {
                    size: 12,
                  }
                },
                grid: {
                  color: useColorModeValue('rgba(0,0,0,0.05)', 'rgba(255,255,255,0.05)'),
                },
              },
              x: {
                title: {
                  display: true,
                  text: t('tracker.date', 'Datum'),
                  font: {
                    size: 12,
                  }
                },
                grid: {
                  display: false,
                },
              },
            },
            plugins: {
              legend: {
                position: 'top' as const,
                labels: {
                  boxWidth: 12,
                  usePointStyle: true,
                  pointStyle: 'circle',
                }
              },
              tooltip: {
                mode: 'index' as const,
                intersect: false,
                backgroundColor: useColorModeValue('rgba(0,0,0,0.7)', 'rgba(0,0,0,0.9)'),
                padding: 10,
                cornerRadius: 4,
                titleFont: {
                  size: 14,
                },
                bodyFont: {
                  size: 13,
                },
              },
            },
          }
        };
    }
  }, [activeTab, t, accentColor, weightBgColor, targetWeight, targetWeightColor]);
  
  const activeChartData = getActiveChartData();
  const chartOptions = activeChartData.options;
  
  // Ernährungsdaten
  const nutrition = user?.nutritionStats || {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    water: 0,
  };
  
  // Prozentsatz im Vergleich zu den Zielen
  const caloriePercentage = user?.calorieGoal ? Math.round((nutrition.calories / user.calorieGoal) * 100) : 0;
  const proteinPercentage = user?.proteinGoal ? Math.round((nutrition.protein / user.proteinGoal) * 100) : 0;
  const waterPercentage = user?.waterGoal ? Math.round((nutrition.water / user.waterGoal) * 100) : 0;
  
  return (
    <Box bg={bgColor} borderRadius="xl" p={{ base: 4, md: 6 }} boxShadow="sm">
      <Flex direction="column" mb={6}>
        <Flex justify="space-between" align="center" mb={4}>
          <Text fontSize="sm" color="gray.500">
            {t('tracker.lastUpdate', 'Letzte Aktualisierung:')} {formatDate(new Date().toISOString())}
          </Text>
          
          <HStack spacing={2}>
            <Button 
              size="sm" 
              variant={timeRange === 'Woche' ? "solid" : "outline"} 
              colorScheme={timeRange === 'Woche' ? "brand" : "gray"}
              borderRadius="full"
              onClick={() => setTimeRange('Woche')}
            >
              {t('tracker.week', 'Woche')}
            </Button>
            
            <Button 
              size="sm" 
              variant={timeRange === 'Monat' ? "solid" : "outline"} 
              colorScheme={timeRange === 'Monat' ? "brand" : "gray"}
              borderRadius="full"
              onClick={() => setTimeRange('Monat')}
            >
              {t('tracker.month', 'Monat')}
            </Button>
            
            <Button 
              size="sm" 
              variant={timeRange === 'Jahr' ? "solid" : "outline"} 
              colorScheme={timeRange === 'Jahr' ? "brand" : "gray"}
              borderRadius="full"
              onClick={() => setTimeRange('Jahr')}
            >
              {t('tracker.year', 'Jahr')}
            </Button>
            
            <Button 
              size="sm" 
              colorScheme="brand" 
              leftIcon={<FiPlus />}
              borderRadius="full"
              onClick={() => {/* Hier Logik für Datenerfassung */}}
            >
              {t('tracker.add', 'Eintragen')}
            </Button>
          </HStack>
        </Flex>
        
        <Tabs 
          variant="soft-rounded" 
          colorScheme="brand" 
          onChange={(index) => {
            const tabNames = ['weight', 'calories', 'water', 'protein'];
            setActiveTab(tabNames[index]);
          }}
          mb={6}
        >
          <TabList mb={6} overflowX="auto" py={2} css={{
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
            '-ms-overflow-style': 'none',
          }}>
            <Tab _selected={{ color: 'white', bg: 'brand.500' }} px={5} mr={2}>
              <Icon as={FiActivity} mr={2} /> {t('tracker.weight', 'Gewicht')}
            </Tab>
            <Tab _selected={{ color: 'white', bg: 'orange.500' }} px={5} mr={2}>
              <Icon as={FiPieChart} mr={2} /> {t('tracker.calories', 'Kalorien')}
            </Tab>
            <Tab _selected={{ color: 'white', bg: 'blue.500' }} px={5} mr={2}>
              <Icon as={FiDroplet} mr={2} /> {t('tracker.water', 'Wasser')}
            </Tab>
            <Tab _selected={{ color: 'white', bg: 'purple.500' }} px={5}>
              <Icon as={FiHeart} mr={2} /> {t('tracker.protein', 'Protein')}
            </Tab>
          </TabList>
          
          <TabPanels>
            {/* Gewichts-Tab */}
            <TabPanel p={0}>
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5} mb={6}>
                <MetricCard 
                  title={t('tracker.currentWeight', 'Aktuelles Gewicht')}
                  value={`${currentWeight} kg`}
                  description={weightEntries.length > 0 ? `Gemessen am ${formatDate(weightEntries[0].date)}` : ''}
                  color="brand.500"
                  icon={<Icon as={FiActivity} color="brand.500" />}
                />
                
                <MetricCard 
                  title={t('tracker.trend', 'Trend')}
                  value={showTrend ? `${Number(weightTrend) > 0 ? '+' : ''}${weightTrend} kg` : '-- kg'}
                  color={showTrend && Number(weightTrend) < 0 ? 'green.500' : showTrend && Number(weightTrend) > 0 ? 'red.500' : 'gray.500'}
                  description={String(t('tracker.since', 'Seit letzter Messung'))}
                  icon={showTrend && Number(weightTrend) < 0 ? 
                    <Icon as={FiTrendingDown} color="green.500" /> : 
                    showTrend && Number(weightTrend) > 0 ? 
                    <Icon as={FiTrendingUp} color="red.500" /> : 
                    <Icon as={FiActivity} color="gray.500" />}
                />
                
                <MetricCard 
                  title={t('tracker.target', 'Ziel')}
                  value={`${targetWeight} kg`}
                  color={isAtTarget ? "green.500" : "blue.500"}
                  description={isAtTarget ? 
                    String(t('tracker.targetReached', 'Ziel erreicht!')) : 
                    `${weightDifference} kg ${isAboveTarget ? t('tracker.toGo', 'abzunehmen') : t('tracker.toGain', 'zuzunehmen')}`}
                  icon={<Icon as={FiHeart} color={isAtTarget ? "green.500" : "blue.500"} />}
                />
              </SimpleGrid>
              
              <Box 
                bg={tabBg} 
                p={5} 
                borderRadius="xl" 
                boxShadow="sm" 
                height="400px"
                borderWidth="1px"
                borderColor={borderColor}
              >
                {((activeTab === 'weight' && weightEntries.length > 0) || 
                 (activeTab === 'calories' && caloriesHistory.length > 0) || 
                 (activeTab === 'water' && waterHistory.length > 0) || 
                 (activeTab === 'protein' && proteinHistory.length > 0)) ? (
                  <Line data={activeChartData} options={chartOptions} />
                ) : (
                  <Flex 
                    justify="center" 
                    align="center" 
                    height="100%" 
                    direction="column"
                  >
                    <Text color="gray.500" mb={2}>
                      {t('tracker.noData', 'Keine Daten verfügbar')}
                    </Text>
                    <Text fontSize="sm" color="gray.400">
                      {activeTab === 'weight' 
                        ? t('tracker.addWeight', 'Füge dein erstes Gewicht hinzu, um den Verlauf zu sehen')
                        : activeTab === 'calories'
                        ? t('tracker.addCalories', 'Füge deine ersten Kalorien hinzu, um den Verlauf zu sehen')
                        : activeTab === 'water'
                        ? t('tracker.addWater', 'Füge deine erste Wasseraufnahme hinzu, um den Verlauf zu sehen')
                        : t('tracker.addProtein', 'Füge deine erste Proteinaufnahme hinzu, um den Verlauf zu sehen')
                      }
                    </Text>
                    <Button 
                      mt={4} 
                      colorScheme="brand" 
                      size="sm"
                      leftIcon={<FiPlus />}
                      onClick={() => {/* Hier Logik für Datenerfassung */}}
                    >
                      {activeTab === 'weight' 
                        ? t('tracker.addWeightButton', 'Gewicht eintragen')
                        : activeTab === 'calories'
                        ? t('tracker.addCaloriesButton', 'Kalorien eintragen')
                        : activeTab === 'water'
                        ? t('tracker.addWaterButton', 'Wasser eintragen')
                        : t('tracker.addProteinButton', 'Protein eintragen')
                      }
                    </Button>
                  </Flex>
                )}
              </Box>
            </TabPanel>
            
            {/* Kalorien-Tab */}
            <TabPanel p={0}>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5} mb={6}>
                <Box 
                  p={5} 
                  bg={tabBg} 
                  borderRadius="xl" 
                  boxShadow="sm"
                  borderWidth="1px"
                  borderColor={borderColor}
                >
                  <Flex justify="space-between" align="center" mb={2}>
                    <Text fontSize="sm" fontWeight="medium" color="gray.500">
                      {t('tracker.dailyCalories', 'Tägliche Kalorien')}
                    </Text>
                    <Icon as={FiPieChart} color="orange.500" />
                  </Flex>
                  <Text fontSize="2xl" fontWeight="bold" color="orange.500">
                    {nutrition.calories} kcal
                  </Text>
                  <Progress 
                    value={caloriePercentage} 
                    colorScheme="orange" 
                    size="sm" 
                    mt={3}
                    borderRadius="full"
                  />
                  <Flex justify="space-between" align="center" mt={1}>
                    <Text fontSize="xs" color="gray.500">
                      0 kcal
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      <Badge colorScheme="orange" borderRadius="full" px={2}>
                        {caloriePercentage}%
                      </Badge>
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      {user?.calorieGoal || 2000} kcal
                    </Text>
                  </Flex>
                </Box>
                
                <Box 
                  p={5} 
                  bg={tabBg} 
                  borderRadius="xl" 
                  boxShadow="sm"
                  borderWidth="1px"
                  borderColor={borderColor}
                >
                  <Flex justify="space-between" align="center" mb={3}>
                    <Text fontSize="sm" fontWeight="medium" color="gray.500">
                      {t('tracker.macroDistribution', 'Makronährstoffverteilung')}
                    </Text>
                    <Icon as={FiActivity} color="gray.500" />
                  </Flex>
                  
                  <VStack spacing={4} align="stretch">
                    <Box>
                      <Flex justify="space-between" mb={1}>
                        <Text fontSize="sm" fontWeight="medium">
                          {t('tracker.protein', 'Protein')}
                        </Text>
                        <Text fontSize="sm" fontWeight="bold">
                          {nutrition.protein}g
                        </Text>
                      </Flex>
                      <Progress value={proteinPercentage} colorScheme="purple" size="sm" borderRadius="full" />
                    </Box>
                    
                    <Box>
                      <Flex justify="space-between" mb={1}>
                        <Text fontSize="sm" fontWeight="medium">
                          {t('tracker.carbs', 'Kohlenhydrate')}
                        </Text>
                        <Text fontSize="sm" fontWeight="bold">
                          {nutrition.carbs}g
                        </Text>
                      </Flex>
                      <Progress value={nutrition.carbs / (user?.carbGoal || 200) * 100} colorScheme="blue" size="sm" borderRadius="full" />
                    </Box>
                    
                    <Box>
                      <Flex justify="space-between" mb={1}>
                        <Text fontSize="sm" fontWeight="medium">
                          {t('tracker.fat', 'Fett')}
                        </Text>
                        <Text fontSize="sm" fontWeight="bold">
                          {nutrition.fat}g
                        </Text>
                      </Flex>
                      <Progress value={nutrition.fat / (user?.fatGoal || 70) * 100} colorScheme="yellow" size="sm" borderRadius="full" />
                    </Box>
                  </VStack>
                </Box>
              </SimpleGrid>
            </TabPanel>
            
            {/* Wasser-Tab */}
            <TabPanel p={0}>
              <Box 
                p={5} 
                bg={tabBg} 
                borderRadius="xl" 
                boxShadow="sm" 
                mb={6}
                borderWidth="1px"
                borderColor={borderColor}
              >
                <Flex justify="space-between" align="center" mb={2}>
                  <Text fontSize="sm" fontWeight="medium" color="gray.500">
                    {t('tracker.waterIntake', 'Wasseraufnahme')}
                  </Text>
                  <Icon as={FiDroplet} color="blue.500" />
                </Flex>
                <Text fontSize="2xl" fontWeight="bold" color="blue.500">
                  {nutrition.water} ml
                </Text>
                <Progress 
                  value={waterPercentage} 
                  colorScheme="blue" 
                  size="sm" 
                  mt={3}
                  borderRadius="full"
                />
                <Flex justify="space-between" align="center" mt={1}>
                  <Text fontSize="xs" color="gray.500">
                    0 ml
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    <Badge colorScheme="blue" borderRadius="full" px={2}>
                      {waterPercentage}%
                    </Badge>
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    {user?.waterGoal || 2500} ml
                  </Text>
                </Flex>
              </Box>
              
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
                <Box 
                  p={5} 
                  bg={tabBg} 
                  borderRadius="xl" 
                  boxShadow="sm"
                  borderWidth="1px"
                  borderColor={borderColor}
                >
                  <Flex justify="space-between" align="center" mb={2}>
                    <Text fontSize="sm" fontWeight="medium" color="gray.500">
                      {t('tracker.waterTips', 'Tipps')}
                    </Text>
                    <Icon as={FiDroplet} color="blue.500" />
                  </Flex>
                  <VStack align="start" spacing={3} mt={2}>
                    <Text fontSize="sm">• Trinke ein Glas Wasser nach dem Aufstehen</Text>
                    <Text fontSize="sm">• Halte eine Wasserflasche immer griffbereit</Text>
                    <Text fontSize="sm">• Setze Erinnerungen auf deinem Handy</Text>
                  </VStack>
                </Box>
                
                <Box 
                  p={5} 
                  bg={tabBg} 
                  borderRadius="xl" 
                  boxShadow="sm"
                  borderWidth="1px"
                  borderColor={borderColor}
                >
                  <Flex justify="space-between" align="center" mb={2}>
                    <Text fontSize="sm" fontWeight="medium" color="gray.500">
                      {t('tracker.waterGoal', 'Dein Ziel')}
                    </Text>
                    <Icon as={FiHeart} color="blue.500" />
                  </Flex>
                  <Text fontSize="2xl" fontWeight="bold" color="blue.500" mb={2}>
                    {user?.waterGoal || 2500} ml
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    {t('tracker.waterGoalDescription', 'Basierend auf deinem Gewicht und Aktivitätslevel')}
                  </Text>
                </Box>
              </SimpleGrid>
            </TabPanel>
            
            {/* Protein-Tab */}
            <TabPanel p={0}>
              <Box 
                p={5} 
                bg={tabBg} 
                borderRadius="xl" 
                boxShadow="sm" 
                mb={6}
                borderWidth="1px"
                borderColor={borderColor}
              >
                <Flex justify="space-between" align="center" mb={2}>
                  <Text fontSize="sm" fontWeight="medium" color="gray.500">
                    {t('tracker.proteinIntake', 'Proteinaufnahme')}
                  </Text>
                  <Icon as={FiHeart} color="purple.500" />
                </Flex>
                <Text fontSize="2xl" fontWeight="bold" color="purple.500">
                  {nutrition.protein} g
                </Text>
                <Progress 
                  value={proteinPercentage} 
                  colorScheme="purple" 
                  size="sm" 
                  mt={3}
                  borderRadius="full"
                />
                <Flex justify="space-between" align="center" mt={1}>
                  <Text fontSize="xs" color="gray.500">
                    0 g
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    <Badge colorScheme="purple" borderRadius="full" px={2}>
                      {proteinPercentage}%
                    </Badge>
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    {user?.proteinGoal || 120} g
                  </Text>
                </Flex>
              </Box>
              
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
                <Box 
                  p={5} 
                  bg={tabBg} 
                  borderRadius="xl" 
                  boxShadow="sm"
                  borderWidth="1px"
                  borderColor={borderColor}
                >
                  <Flex justify="space-between" align="center" mb={2}>
                    <Text fontSize="sm" fontWeight="medium" color="gray.500">
                      {t('tracker.proteinSources', 'Proteinquellen')}
                    </Text>
                    <Icon as={FiHeart} color="purple.500" />
                  </Flex>
                  <VStack align="start" spacing={3} mt={2}>
                    <Text fontSize="sm">• Hühnerbrust (31g pro 100g)</Text>
                    <Text fontSize="sm">• Griechischer Joghurt (10g pro 100g)</Text>
                    <Text fontSize="sm">• Eier (13g pro 100g)</Text>
                    <Text fontSize="sm">• Linsen (9g pro 100g)</Text>
                  </VStack>
                </Box>
                
                <Box 
                  p={5} 
                  bg={tabBg} 
                  borderRadius="xl" 
                  boxShadow="sm"
                  borderWidth="1px"
                  borderColor={borderColor}
                >
                  <Flex justify="space-between" align="center" mb={2}>
                    <Text fontSize="sm" fontWeight="medium" color="gray.500">
                      {t('tracker.proteinGoal', 'Dein Ziel')}
                    </Text>
                    <Icon as={FiActivity} color="purple.500" />
                  </Flex>
                  <Text fontSize="2xl" fontWeight="bold" color="purple.500" mb={2}>
                    {user?.proteinGoal || 120} g
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    {t('tracker.proteinGoalDescription', 'Basierend auf deinem Gewicht und Trainingsziel')}
                  </Text>
                </Box>
              </SimpleGrid>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>
    </Box>
  );
};

export default WeightTracker; 