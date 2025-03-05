import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Flex,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Progress,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  IconButton,
  useColorMode,
  VStack,
  HStack,
  Card,
  CardBody,
  Badge,
  Icon,
  Center,
  useToast
} from '@chakra-ui/react';
import { FiMinus, FiDroplet, FiAward, FiClock, FiAlertCircle, FiActivity, FiPlus, FiRefreshCw } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { useUser } from '../contexts/UserContext';
import { UserData } from '../contexts/UserContext';

// Wassertracking-Seite
const WaterTrackingPage: React.FC = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const { user, updateUser, addXP, completeDaily, checkAndCompleteMissions } = useUser();
  const colorMode = useColorMode();
  
  // Farbschemata basierend auf dem Farbmodus
  const cardBg = colorMode.colorMode === 'dark' ? 'gray.700' : 'white';
  const progressColorScheme = 'teal';
  const sliderColorScheme = 'blue';
  
  // Standardwerte, falls keine Benutzerdaten vorhanden sind
  const waterGoal = user?.waterGoal || 2000; // ml
  
  // Initialisieren mit 0, wird später durch useEffect aktualisiert
  const [currentWater, setCurrentWater] = useState<number>(0);
  const [glassSize, setGlassSize] = useState<number>(250); // ml
  
  // Berechne Fortschritt in Prozent
  const waterPercentage = Math.min(100, Math.round((currentWater / waterGoal) * 100));
  
  // Komponente für Tipps
  interface TipProps {
    icon: React.ElementType;
    title: string;
    description: string;
    iconBg: string;
    iconColor: string;
  }
  
  const Tip: React.FC<TipProps> = ({ icon, title, description, iconBg, iconColor }) => (
    <Box 
      p={4} 
      borderWidth="1px" 
      borderRadius="lg"
      boxShadow="sm"
      transition="all 0.3s"
      _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}
    >
      <Flex align="center" mb={2}>
        <Center 
          bg={iconBg} 
          boxSize="36px" 
          borderRadius="full" 
          mr={3}
          boxShadow="sm"
        >
          <Icon as={icon} color={iconColor} boxSize={5} />
        </Center>
        <Text fontWeight="600">{title}</Text>
      </Flex>
      <Text fontSize="sm" color="gray.600" pl="45px">{description}</Text>
    </Box>
  );

  // Wassermission finden
  const waterMission = useMemo(() => {
    return user?.dailyMissions?.find(m => m.requirements?.type === 'water');
  }, [user?.dailyMissions]);
  
  // Hier wird ein separater useEffect nur für die einmalige Initialisierung verwendet
  // Dieser wird nur ausgeführt, wenn der Benutzer geladen wird, nicht bei Änderungen von currentWater
  useEffect(() => {
    if (user) {
      console.log('Einmalige Initialisierung des Wasserstands');
      
      // Prüfe, welcher Wert vorhanden und gültig ist
      if (typeof user.dailyWaterIntake === 'number' && user.dailyWaterIntake > 0) {
        console.log('Setze Wasserstand auf dailyWaterIntake:', user.dailyWaterIntake);
        setCurrentWater(user.dailyWaterIntake);
      } else if (typeof user.dailyProgress?.water === 'number' && user.dailyProgress.water > 0) {
        console.log('Setze Wasserstand auf dailyProgress.water:', user.dailyProgress.water);
        setCurrentWater(user.dailyProgress.water);
      }
    }
  // Wichtig: Hier KEINE Abhängigkeit von currentWater, da das zu einem Teufelskreis führen würde
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid]); // Nur bei Änderung der Benutzer-ID neu initialisieren
  
  // Funktion zum Hinzufügen von Wasser
  const addWater = () => {
    if (!user) return;
    
    const newAmount = currentWater + glassSize;
    console.log('Füge Wasser hinzu:', currentWater, '+', glassSize, '=', newAmount);
    
    // Prüfen, ob das Wasserziel zum ersten Mal erreicht wird
    const isReachingGoal = currentWater < waterGoal && newAmount >= waterGoal;
    
    // Lokalen State aktualisieren
    setCurrentWater(newAmount);
    
    // Wassermission finden, bevor wir das User-Objekt aktualisieren
    const missionToComplete = user?.dailyMissions?.find(m => 
      m.requirements?.type === 'water' && !m.completed
    );
    
    console.log('Gefundene Wassermission:', missionToComplete);
    
    // Nur die Wasser-bezogenen Werte aktualisieren, ohne das gesamte User-Objekt zu ersetzen
    // Wasserwerte zwischenspeichern, damit sie in Timeouts verfügbar sind
    const updatedWaterIntake = newAmount;
    
    // Zuerst das User-Objekt mit den neuen Wasserwerten aktualisieren
    const waterUpdate: Partial<UserData> = {
      dailyWaterIntake: updatedWaterIntake
    };
    
    // Nur dailyProgress.water aktualisieren, wenn dailyProgress existiert
    if (user.dailyProgress) {
      waterUpdate.dailyProgress = {
        ...user.dailyProgress,
        water: updatedWaterIntake
      };
    } else {
      waterUpdate.dailyProgress = {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        water: updatedWaterIntake,
        burnedCalories: 0
      };
    }
    
    // Benutzerobjekt aktualisieren - aber nur die Wasserwerte
    updateUser(waterUpdate);
    
    // Wasserziel erreicht - XP und Mission nur bearbeiten, wenn es noch keine abgeschlossene Wassermission gibt
    if (isReachingGoal) {
      // Prüfen, ob bereits eine abgeschlossene Wassermission existiert
      const existingCompletedWaterMission = user.dailyMissions?.find(m => 
        m.requirements?.type === 'water' && m.completed
      );
      
      console.log('Bereits abgeschlossene Wassermission:', existingCompletedWaterMission);
      
      // Nur wenn keine Wassermission abgeschlossen ist, XP vergeben und Mission markieren
      if (!existingCompletedWaterMission) {
        console.log('Vergebe XP für das erste Erreichen des Wasserziels.');
        
        // Zunächst nur die XP vergeben
        addXP(30);
        toast({
          title: t('water.goalReached', 'Wasserziel erreicht!'),
          description: t('water.goalReachedDesc', '+30 XP für das Erreichen deines täglichen Wasserziels!'),
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        
        // Wassermission abschließen, falls vorhanden und noch nicht abgeschlossen
        console.log('Ziel erreicht! Versuche Wassermission abzuschließen...');
        
        // Erneut nach der Wassermission suchen, falls missionToComplete null ist
        const waterMission = missionToComplete || user?.dailyMissions?.find(m => 
          m.requirements?.type === 'water' && !m.completed
        );
        
        console.log('Wassermission zum Abschließen:', waterMission);
        
        if (waterMission && !waterMission.completed) {
          console.log('Schließe Wassermission ab mit ID:', waterMission.id);
          
          // In einem Timeout ausführen, um die Wasseraktualisierung abzuschließen
          setTimeout(() => {
            // Direktes Update des User-Objekts mit aktualisierter Mission
            const updatedMissions = user?.dailyMissions?.map(mission => {
              if (mission.id === waterMission.id) {
                console.log('Markiere Mission als abgeschlossen:', mission.title);
                return { ...mission, completed: true };
              }
              return mission;
            }) || [];
            
            // User-Objekt aktualisieren mit den aktualisierten Missionen und behalte Wasserwerte bei
            updateUser({
              ...user,
              dailyMissions: updatedMissions,
              dailyWaterIntake: updatedWaterIntake,
              dailyProgress: user.dailyProgress ? {
                ...user.dailyProgress,
                water: updatedWaterIntake
              } : {
                calories: 0,
                protein: 0,
                carbs: 0,
                fat: 0,
                water: updatedWaterIntake,
                burnedCalories: 0
              }
            });
            
            console.log('User aktualisiert mit abgeschlossener Mission und Wasserstand:', updatedWaterIntake);
            
            // Missionen überprüfen, aber ohne den Wasserstand zu beeinträchtigen
            setTimeout(() => {
              checkAndCompleteMissions();
              
              toast({
                title: t('missions.water.missionCompleted', 'Mission abgeschlossen!'),
                description: t('missions.water.missionCompletedDesc', 'Du hast dein tägliches Wasserziel erreicht.'),
                status: 'success',
                duration: 3000,
                isClosable: true,
              });
            }, 500);
          }, 300);
        } else {
          // Wenn keine Mission gefunden wurde, nur die Missionen prüfen
          console.log('Keine unerledigte Wassermission gefunden. Führe manuelle Prüfung durch.');
          checkAndCompleteMissions();
        }
      } else {
        console.log('Wassermission bereits abgeschlossen, keine XP vergeben oder Mission markiert.');
        // Zeige nur eine Nachricht an, dass das Ziel wieder erreicht wurde
        toast({
          title: t('water.goalReachedAgain', 'Wasserziel erreicht!'),
          description: t('water.goalReachedAgainDesc', 'Gut gemacht! Du hast dein tägliches Wasserziel erreicht.'),
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };
  
  // Funktion zum Entfernen von Wasser
  const removeWater = () => {
    if (!user) return;
    
    const newAmount = Math.max(0, currentWater - glassSize);
    console.log('Entferne Wasser:', currentWater, '-', glassSize, '=', newAmount);
    
    // Lokalen State aktualisieren
    setCurrentWater(newAmount);
    
    // Nur die Wasser-bezogenen Werte aktualisieren, ohne das gesamte User-Objekt zu ersetzen
    const waterUpdate: Partial<UserData> = {
      dailyWaterIntake: newAmount
    };
    
    // Nur dailyProgress.water aktualisieren, wenn dailyProgress existiert
    if (user.dailyProgress) {
      waterUpdate.dailyProgress = {
        ...user.dailyProgress,
        water: newAmount
      };
    } else {
      waterUpdate.dailyProgress = {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        water: newAmount,
        burnedCalories: 0
      };
    }
    
    // Benutzerobjekt aktualisieren - aber nur die Wasserwerte
    updateUser(waterUpdate);
  };
  
  // Funktion zum Zurücksetzen des Wasserkonsums
  const resetWater = () => {
    if (!user) return;
    
    console.log('Setze Wasserstand zurück auf 0');
    
    // Lokalen State aktualisieren
    setCurrentWater(0);
    
    // Nur die Wasser-bezogenen Werte aktualisieren, ohne das gesamte User-Objekt zu ersetzen
    const waterUpdate: Partial<UserData> = {
      dailyWaterIntake: 0
    };
    
    // Nur dailyProgress.water aktualisieren, wenn dailyProgress existiert
    if (user.dailyProgress) {
      waterUpdate.dailyProgress = {
        ...user.dailyProgress,
        water: 0
      };
    } else {
      waterUpdate.dailyProgress = {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        water: 0,
        burnedCalories: 0
      };
    }
    
    // Benutzerobjekt aktualisieren - aber nur die Wasserwerte
    updateUser(waterUpdate);
    
    toast({
      title: t('water.reset', 'Zurückgesetzt'),
      description: t('water.resetDesc', 'Dein Wasserkonsum wurde zurückgesetzt.'),
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
  };
  
  return (
    <Container maxW="container.xl" py={8}>
      <Box mb={8}>
        <Heading as="h1" size="xl" mb={2}>
          {t('water.title', 'Wassertracking')}
        </Heading>
        <Text color="gray.500">
          {t('water.subtitle', 'Verfolge deinen täglichen Wasserkonsum und bleibe hydratisiert.')}
        </Text>
      </Box>
      
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
        {/* Haupttracking-Bereich */}
        <Box>
          <Card bg={cardBg} borderRadius="lg" boxShadow="md" mb={6} overflow="hidden">
            <CardBody>
              <VStack spacing={6} align="stretch">
                {/* Fortschrittsanzeige */}
                <Box textAlign="center" position="relative" mb={4}>
                  <Heading size="md" mb={4} fontWeight="600">{t('water.progress', 'Dein Fortschritt')}</Heading>
                  <Box position="relative" h="240px" w="240px" mx="auto">
                    <Box
                      position="absolute"
                      bottom="0"
                      left="0"
                      right="0"
                      bg={`${progressColorScheme}.50`}
                      h="240px"
                      borderRadius="xl"
                      overflow="hidden"
                      boxShadow="inset 0 0 10px rgba(0, 0, 0, 0.1)"
                    >
                      <Box
                        bg={`${progressColorScheme}.500`}
                        h={`${waterPercentage}%`}
                        transition="height 0.7s ease-in-out"
                        position="absolute"
                        bottom="0"
                        left="0"
                        right="0"
                        backdropFilter="blur(5px)"
                        _after={{
                          content: '""',
                          position: 'absolute',
                          top: '0',
                          left: '0',
                          right: '0',
                          height: '10px',
                          background: `${progressColorScheme}.400`,
                          borderRadius: 'sm',
                          opacity: '0.7'
                        }}
                      />
                    </Box>
                    <Flex
                      position="absolute"
                      top="0"
                      left="0"
                      right="0"
                      bottom="0"
                      align="center"
                      justify="center"
                      direction="column"
                    >
                      <Icon 
                        as={FiDroplet} 
                        boxSize={12} 
                        color={waterPercentage >= 50 ? "white" : `${progressColorScheme}.500`} 
                        mb={3}
                        filter="drop-shadow(0 0 2px rgba(0,0,0,0.2))"
                      />
                      <Text 
                        fontSize="3xl" 
                        fontWeight="bold" 
                        color={waterPercentage >= 50 ? "white" : "inherit"}
                        textShadow={waterPercentage >= 50 ? "0 0 4px rgba(0,0,0,0.2)" : "none"}
                      >
                        {currentWater} / {waterGoal} ml
                      </Text>
                      <Text 
                        fontSize="lg" 
                        fontWeight="600" 
                        color={waterPercentage >= 50 ? "white" : "inherit"}
                        textShadow={waterPercentage >= 50 ? "0 0 4px rgba(0,0,0,0.2)" : "none"}
                      >
                        {waterPercentage}%
                      </Text>
                    </Flex>
                  </Box>
                </Box>
                
                {/* Steuerung */}
                <Box>
                  <Text mb={3} textAlign="center" fontWeight="500" fontSize="md">
                    {t('water.glassSize', 'Glasgröße')}: {glassSize} ml
                  </Text>
                  <Slider
                    min={50}
                    max={500}
                    step={50}
                    value={glassSize}
                    onChange={(val) => setGlassSize(val)}
                    colorScheme={sliderColorScheme}
                    mb={8}
                  >
                    <SliderTrack h="4px">
                      <SliderFilledTrack />
                    </SliderTrack>
                    <SliderThumb 
                      boxSize={8} 
                      boxShadow="0 0 6px rgba(0,0,0,0.15)" 
                      _focus={{ boxShadow: "0 0 6px rgba(0,0,0,0.15), 0 0 0 3px rgba(66, 153, 225, 0.6)" }}
                    >
                      <Box color={`${sliderColorScheme}.500`} as={FiDroplet} />
                    </SliderThumb>
                  </Slider>
                  
                  <HStack spacing={6} justify="center" mt={4}>
                    <IconButton
                      aria-label={t('water.remove', 'Wasser entfernen')}
                      icon={<Icon as={FiMinus} boxSize={6} />}
                      onClick={removeWater}
                      isDisabled={currentWater <= 0}
                      colorScheme={sliderColorScheme}
                      variant="outline"
                      size="lg"
                      borderRadius="full"
                      boxShadow="sm"
                      w="60px"
                      h="60px"
                      _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}
                      transition="all 0.2s"
                    />
                    <IconButton
                      aria-label={t('water.add', 'Wasser hinzufügen')}
                      icon={<Icon as={FiPlus} boxSize={8} />}
                      onClick={addWater}
                      colorScheme={sliderColorScheme}
                      size="lg"
                      borderRadius="full"
                      boxShadow="md"
                      w="70px"
                      h="70px"
                      _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                      transition="all 0.2s"
                    />
                    <IconButton
                      aria-label={t('water.reset', 'Zurücksetzen')}
                      icon={<Icon as={FiRefreshCw} boxSize={6} />}
                      onClick={resetWater}
                      variant="outline"
                      colorScheme="red"
                      size="lg"
                      borderRadius="full"
                      boxShadow="sm"
                      w="60px"
                      h="60px"
                      _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}
                      transition="all 0.2s"
                    />
                  </HStack>
                </Box>
              </VStack>
            </CardBody>
          </Card>
          
          {/* Tägliche Statistiken */}
          <Card bg={cardBg} borderRadius="lg" boxShadow="md" overflow="hidden">
            <CardBody>
              <Heading size="md" mb={5} fontWeight="600">{t('water.dailyStats', 'Tägliche Statistiken')}</Heading>
              <SimpleGrid columns={3} spacing={5}>
                <Stat>
                  <StatLabel fontSize="sm" color="gray.600">{t('water.totalConsumed', 'Gesamt')}</StatLabel>
                  <StatNumber fontSize="2xl" fontWeight="700" color={`${progressColorScheme}.600`}>
                    {currentWater} ml
                  </StatNumber>
                  <StatHelpText fontSize="md" fontWeight="500">
                    {(currentWater / 1000).toFixed(1)} {t('water.liter', 'Liter')}
                  </StatHelpText>
                </Stat>
                <Stat>
                  <StatLabel fontSize="sm" color="gray.600">{t('water.remaining', 'Verbleibend')}</StatLabel>
                  <StatNumber fontSize="2xl" fontWeight="700">
                    {Math.max(0, waterGoal - currentWater)} ml
                  </StatNumber>
                  <StatHelpText fontSize="md" fontWeight="500">
                    {Math.max(0, (waterGoal - currentWater) / glassSize).toFixed(0)} {t('water.glasses', 'Gläser')}
                  </StatHelpText>
                </Stat>
                <Stat>
                  <StatLabel fontSize="sm" color="gray.600">{t('water.glassesConsumed', 'Gläser')}</StatLabel>
                  <StatNumber fontSize="2xl" fontWeight="700" color={currentWater >= waterGoal ? "green.500" : "inherit"}>
                    {Math.floor(currentWater / glassSize)}
                  </StatNumber>
                  <StatHelpText fontSize="md" fontWeight="500" color={currentWater >= waterGoal ? "green.500" : "inherit"}>
                    {((currentWater / waterGoal) * 100).toFixed(0)}% {t('water.ofGoal', 'des Ziels')}
                  </StatHelpText>
                </Stat>
              </SimpleGrid>
            </CardBody>
          </Card>
        </Box>
        
        {/* Wassermissionen und Tipps */}
        <Box>
          {/* Wassermissionen */}
          {waterMission && (
            <Card bg={cardBg} borderRadius="lg" boxShadow="md" mb={6} overflow="hidden">
              <CardBody>
                <Heading size="md" mb={4} display="flex" alignItems="center" fontWeight="600">
                  <Icon as={FiAward} mr={3} color="yellow.500" boxSize={5} />
                  {t('water.missions', 'Wassermissionen')}
                </Heading>
                <Box 
                  p={5} 
                  borderWidth="1px" 
                  borderRadius="lg" 
                  mb={2}
                  bgGradient={waterMission.completed ? 
                    "linear(to-r, green.50, gray.50)" : 
                    "linear(to-r, blue.50, gray.50)"
                  }
                  boxShadow="sm"
                  transition="all 0.3s"
                  _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}
                >
                  <Flex justify="space-between" align="center" mb={3}>
                    <Heading size="sm" fontWeight="600">{waterMission.title}</Heading>
                    <Badge 
                      colorScheme={waterMission.completed ? 'green' : 'blue'} 
                      fontSize="sm" 
                      fontWeight="600" 
                      px={3} 
                      py={1} 
                      borderRadius="full"
                      boxShadow="sm"
                    >
                      {waterMission.completed 
                        ? t('water.completed', 'Abgeschlossen') 
                        : `+${waterMission.xp} XP`}
                    </Badge>
                  </Flex>
                  <Text fontSize="sm" color="gray.600" mb={4}>{waterMission.description}</Text>
                  <Progress 
                    value={Math.min(100, (currentWater / (waterMission.requirements?.value || waterGoal)) * 100)} 
                    colorScheme={waterMission.completed ? 'green' : 'blue'} 
                    size="sm" 
                    borderRadius="full"
                    bg="white"
                    boxShadow="inset 0 0 2px rgba(0,0,0,0.1)"
                    height="8px"
                  />
                  <Flex justify="space-between" mt={2}>
                    <Text fontSize="xs" fontWeight="500" color="gray.600">{currentWater} ml</Text>
                    <Text fontSize="xs" fontWeight="500" color="gray.600">{waterMission.requirements?.value || waterGoal} ml</Text>
                  </Flex>
                </Box>
              </CardBody>
            </Card>
          )}
          
          {/* Hydratisierungstipps */}
          <Card bg={cardBg} borderRadius="lg" boxShadow="md" overflow="hidden">
            <CardBody>
              <Heading size="md" mb={5} display="flex" alignItems="center" fontWeight="600">
                <Icon as={FiDroplet} mr={3} color="blue.500" boxSize={5} />
                {t('water.tips.title', 'Hydratisierungstipps')}
              </Heading>
              <VStack spacing={4} align="stretch">
                <Tip
                  icon={FiClock}
                  title={t('water.tips.morning.title', 'Morgens trinken')}
                  description={t('water.tips.morning.desc', 'Trinke ein Glas Wasser direkt nach dem Aufstehen, um deinen Stoffwechsel anzukurbeln.')}
                  iconBg="blue.50"
                  iconColor="blue.500"
                />
                <Tip
                  icon={FiAlertCircle}
                  title={t('water.tips.dehydration.title', 'Anzeichen von Dehydrierung')}
                  description={t('water.tips.dehydration.desc', 'Achte auf Anzeichen wie Kopfschmerzen oder Müdigkeit, die auf Dehydrierung hindeuten können.')}
                  iconBg="orange.50"
                  iconColor="orange.500"
                />
                <Tip
                  icon={FiActivity}
                  title={t('water.tips.workout.title', 'Vor und nach dem Sport')}
                  description={t('water.tips.workout.desc', 'Trinke vor, während und nach dem Training ausreichend Wasser, um deine Leistung zu verbessern.')}
                  iconBg="green.50"
                  iconColor="green.500"
                />
              </VStack>
            </CardBody>
          </Card>
        </Box>
      </SimpleGrid>
    </Container>
  );
};

export default WaterTrackingPage; 