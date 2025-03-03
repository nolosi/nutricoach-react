import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  calculateNutritionGoals, 
  NutritionInputData, 
  NutritionGoals,
  DEFAULT_NUTRITION_GOALS
} from '../utils/nutritionCalculator';
import { FoodService, Meal } from '../services/FoodService';
import TrackingService from '../services/TrackingService';

// Missionstypen
export interface Mission {
  id: number;
  title: string;
  description: string;
  xp: number;
  completed: boolean;
  type: 'daily' | 'weekly' | 'achievement' | 'water' | 'nutrition' | 'weight' | 'goals'; // Missionstypen erweitert
  iconName?: string;
  progress?: number;
  requirements?: {
    type?: string;
    value?: number;
    current?: number; // Aktueller Fortschritt für Missionen mit mehreren Schritten
  };
  deadline?: Date; // Fälligkeitsdatum für die Mission
}

// XP-Ergebnis-Interface hinzufügen
export interface XPResult {
  newXP: number;
  newLevel: number;
  levelUp: boolean;
}

// Achievement-Schnittstelle
export interface Achievement {
  id: number;
  title: string;
  description: string;
  xp: number;
  completed: boolean;
  icon?: string;
  category?: string;
  unlockDate?: string;
}

export interface UserData {
  uid: string;
  email?: string; // Optional machen
  displayName?: string; // Optional machen
  name?: string; // Name des Benutzers für die Begrüßung
  onboardingCompleted: boolean;
  joinDate?: string; // Beitrittsdatum als ISO-String
  // Persönliche Daten
  age?: number;
  gender?: 'male' | 'female' | 'diverse';
  weight?: number;
  height?: number;
  activityLevel?: string;
  weightGoal?: 'lose' | 'maintain' | 'gain';
  dailyMissions?: Mission[];
  weeklyMissions?: Mission[];
  lastMissionRefresh?: string; // ISO-String für das letzte Aktualisierungsdatum
  lastMissionCheck?: string; // ISO-String für das letzte Überprüfungsdatum der Missionen
  experiencePoints?: number;
  level?: number;
  streakDays?: number;
  // Tägliche Fortschrittsdaten
  dailyProgress?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    water: number;
    burnedCalories?: number; // Hinzugefügt für die Verfolgung verbrannter Kalorien
  };
  // Ziele und Präferenzen
  calorieGoal?: number;
  proteinGoal?: number;
  carbGoal?: number;
  fatGoal?: number;
  waterGoal?: number;
  burnCalorieGoal?: number; // NEU: Tägliches Ziel für zu verbrennende Kalorien
  language?: string;
  darkMode?: boolean;
  dietaryPreferences?: string[];
  goals?: string[];
  // Statistik
  nutritionStats?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    water: number;
  };
  weightHistory?: Array<{ date: string; weight: number, note?: string }>;
  
  // NEU: Historische Daten für andere Metriken
  caloriesHistory?: Array<{ date: string; value: number, note?: string }>;
  proteinHistory?: Array<{ date: string; value: number, note?: string }>;
  waterHistory?: Array<{ date: string; value: number, note?: string }>;
  
  selectedCoach?: string;
  
  // Persönliche Daten
  avatar?: string;
  initialWeight?: number;
  targetWeight?: number;
  dailyWaterIntake?: number;
  lastActive?: string;
  unlockedBadges: string[];
  completedChallenges: string[];
}

interface UserContextType {
  user: UserData | null;
  isLoading: boolean;
  updateUser: (data: Partial<UserData>) => void;
  clearUser: () => void;
  addXP: (xp: number) => XPResult | null;
  completeDaily: (missionId: number) => void;
  resetDailyMissions: () => void;
  resetAllMissions: () => void;
  generateMissions: () => void;
  checkAndCompleteMissions: () => boolean;
  completeMeal: (mealId: string) => boolean; // Typ von void zu boolean geändert
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Standard-Benutzer für Initialisierung
const DEFAULT_USER: UserData = {
  uid: '1',
  email: 'user@example.com', // Bleibt für den Standardwert
  displayName: 'User', // Bleibt für den Standardwert
  name: '',
  onboardingCompleted: false,
  selectedCoach: '',
  goals: [],
  dietaryPreferences: [],
  calorieGoal: 0,
  proteinGoal: 0,
  carbGoal: 0,
  fatGoal: 0,
  waterGoal: 0,
  weight: 0,
  targetWeight: 0,
  height: 0,
  age: 0,
  gender: 'diverse',
  activityLevel: 'moderate',
  language: 'de',
  darkMode: false,
  experiencePoints: 0,
  level: 1,
  streakDays: 0,
  dailyProgress: {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    water: 0
  },
  unlockedBadges: [],
  completedChallenges: [],
  dailyMissions: [],
  weeklyMissions: []
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Laden der Benutzerdaten aus dem lokalen Speicher beim Start
  useEffect(() => {
    const loadUserFromStorage = () => {
      const storedUser = localStorage.getItem('nutricoach_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(DEFAULT_USER);
      }
      setIsLoading(false);
    };

    loadUserFromStorage();
  }, []);

  // Überprüfen und ggf. Aktualisieren der täglichen Missionen
  useEffect(() => {
    if (user && user.onboardingCompleted) {
      const today = new Date().toISOString().split('T')[0];
      
      // Überprüfe, ob die Missionen heute bereits zurückgesetzt wurden
      if (!user.lastMissionRefresh || user.lastMissionRefresh !== today) {
        console.log('Tägliche Missionen werden zurückgesetzt...');
        resetDailyMissions();
      }
      
      // Setze einen Timer, der um Mitternacht die Missionen zurücksetzt
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const timeUntilMidnight = tomorrow.getTime() - now.getTime();
      
      console.log(`Nächster Missions-Reset in ${Math.floor(timeUntilMidnight / 1000 / 60)} Minuten um Mitternacht.`);
      
      const midnightTimer = setTimeout(() => {
        console.log('Mitternacht erreicht - Missionen werden zurückgesetzt');
        resetDailyMissions();
        
        // Täglichen Fortschritt zurücksetzen
        if (user) {
          updateUser({
            ...user,
            dailyWaterIntake: 0,
            dailyProgress: {
              ...user.dailyProgress,
              water: 0,
              calories: 0,
              protein: 0,
              carbs: 0,
              fat: 0,
              burnedCalories: 0
            }
          });
        }
      }, timeUntilMidnight);
      
      // Timer bereinigen
      return () => clearTimeout(midnightTimer);
    }
  }, [user?.onboardingCompleted, user?.lastMissionRefresh]);

  // Speichern der Benutzerdaten im lokalen Speicher bei Änderungen
  useEffect(() => {
    if (user) {
      localStorage.setItem('nutricoach_user', JSON.stringify(user));
    }
  }, [user]);

  const updateUser = (data: Partial<UserData>) => {
    setUser(prev => {
      if (!prev) return { ...DEFAULT_USER, ...data };
      return { ...prev, ...data };
    });
  };

  const clearUser = () => {
    localStorage.removeItem('nutricoach_user');
    setUser(DEFAULT_USER);
  };

  // Funktion zum Hinzufügen von XP
  const addXP = (amount: number) => {
    if (user) {
      const currentXP = user.experiencePoints || 0;
      const currentLevel = user.level || 1;
      let newXP = currentXP + amount;
      let newLevel = currentLevel;
      
      // Levelaufstieg, wenn genügend XP gesammelt wurden
      const requiredXP = currentLevel * 100;
      if (newXP >= requiredXP) {
        newXP -= requiredXP;
        newLevel += 1;
      }
      
      updateUser({
        ...user,
        experiencePoints: newXP,
        level: newLevel
      });
      
      return { newXP, newLevel, levelUp: newLevel > currentLevel };
    }
    return null;
  };

  // Funktion zum Abschließen einer täglichen Mission
  const completeDaily = (missionId: number) => {
    if (!user || !user.dailyMissions) return;
    
    console.log('Versuche Mission abzuschließen:', missionId);
    
    // Finde die Mission
    const updatedMissions = user.dailyMissions.map(mission => {
      if (mission.id === missionId) {
        console.log('Mission gefunden und wird als abgeschlossen markiert:', mission.title);
        return { ...mission, completed: true };
      }
      return mission;
    });
    
    // Aktualisiere den Benutzer mit den aktualisierten Missionen
      updateUser({
        ...user,
        dailyMissions: updatedMissions
      });
      
    // Gib XP für die abgeschlossene Mission
    const completedMission = user.dailyMissions.find(m => m.id === missionId);
    if (completedMission) {
      addXP(completedMission.xp);
    }
  };

  // NEU: Funktion zum Abschließen einer Mahlzeit
  const completeMeal = (mealId: string): boolean => {
    if (!user) return false;
    
    // Finde die Mahlzeit in der Speicherung
    const meal = FoodService.getMealById(mealId);
    if (!meal) return false;
    
    console.log('UserContext: Mahlzeit zum Abschließen gefunden:', meal);
    console.log('UserContext: Aktuelle dailyProgress-Werte:', user.dailyProgress);
    
    // Aktualisiere die Mahlzeit als abgeschlossen
    const updatedMeal = {
      ...meal,
      isCompleted: true
    };
    
    // Alte Mahlzeit löschen und aktualisierte Version speichern
    FoodService.deleteMeal(mealId);
    FoodService.addMeal(updatedMeal);
    
    // Aktualisiere die täglichen Nährwerte mit den Mahlzeitdaten
    if (user) {
      // Aktualisiere die täglichen Fortschritte
      const updatedDailyProgress = {
        ...user.dailyProgress,
        calories: (user.dailyProgress?.calories || 0) + meal.totalCalories,
        protein: (user.dailyProgress?.protein || 0) + meal.totalProtein,
        carbs: (user.dailyProgress?.carbs || 0) + meal.totalCarbs,
        fat: (user.dailyProgress?.fat || 0) + meal.totalFat,
        water: user.dailyProgress?.water || 0
      };
      
      console.log('UserContext: Aktualisierte dailyProgress-Werte:', updatedDailyProgress);

      // Benutzer direkt und sofort aktualisieren, ohne auf Missionsabschluss zu warten
      const updatedUser = {
        ...user,
        dailyProgress: updatedDailyProgress
      };
      
      // Aktualisiere die Tracking-Historie für Kalorien und Protein
      if (meal.totalCalories > 0) {
        TrackingService.updateMetric(
          updatedUser, // Verwende den aktualisierter Benutzer
          updateUser,
          'calories',
          updatedDailyProgress.calories,
          `Mahlzeit: ${meal.mealType}`,
          meal.date
        );
      }
      
      if (meal.totalProtein > 0) {
        TrackingService.updateMetric(
          updatedUser, // Verwende den aktualisierter Benutzer
          updateUser,
          'protein',
          updatedDailyProgress.protein,
          `Mahlzeit: ${meal.mealType}`,
          meal.date
        );
      }
      
      // Finde die entsprechende Mission für diese Mahlzeit
      if (user.dailyMissions) {
        const mealType = meal.mealType;
        let matchingMission: Mission | undefined;
        
        // Exaktere Suche nach der entsprechenden Mission
        let missionTitle = '';
        if (mealType === 'breakfast') {
          missionTitle = 'Frühstück eintragen';
        } else if (mealType === 'lunch') {
          missionTitle = 'Mittagessen eintragen';
        } else if (mealType === 'dinner') {
          missionTitle = 'Abendessen eintragen';
        }
        
        // Finde die Mission mit dem exakten Titel
        matchingMission = user.dailyMissions.find(m => m.title === missionTitle);
        
        // Wenn eine passende Mission gefunden wurde und diese noch nicht abgeschlossen ist, vergebe XP
        if (matchingMission && !matchingMission.completed) {
          // Mission als abgeschlossen markieren
          const updatedMissions = user.dailyMissions.map(mission => 
            mission.id === matchingMission?.id ? { ...mission, completed: true } : mission
          );
          
          // Aktuelle XP-Werte sichern
          const currentXP = user.experiencePoints || 0;
          const currentLevel = user.level || 1;
          
          // XP berechnen
          let newXP = currentXP + matchingMission.xp;
          let newLevel = currentLevel;
          
          // Levelaufstieg, wenn genügend XP gesammelt wurden
          const requiredXP = currentLevel * 100;
          if (newXP >= requiredXP) {
            newXP -= requiredXP;
            newLevel += 1;
          }
          
          // Benutzer mit allen Änderungen auf einmal aktualisieren
          updateUser({
            ...updatedUser,
            dailyMissions: updatedMissions,
            experiencePoints: newXP,
            level: newLevel
          });
          
          return true; // Mission wurde abgeschlossen
        } else {
          // Wenn keine Mission abgeschlossen wurde, trotzdem die täglichen Fortschritte aktualisieren
          updateUser(updatedUser);
          
          if (matchingMission && matchingMission.completed) {
            // Mission bereits abgeschlossen
            return false;
          }
        }
      } else {
        // Wenn keine Missionen vorhanden sind, trotzdem die täglichen Fortschritte aktualisieren
        updateUser(updatedUser);
      }
    }
    
    return false; // Keine Mission wurde abgeschlossen
  };

  // Funktion zum Überprüfen und automatischen Abschließen von Missionen
  const checkAndCompleteMissions = () => {
    if (!user || !user.dailyMissions) return false;

    // Überprüfe jede Mission
    let missionsCompleted = false; // Flag, um zu verfolgen, ob Missionen abgeschlossen wurden
    let updatedMissions = [...user.dailyMissions]; // Lokale Kopie, um alle Aktualisierungen zu sammeln

    // Hole die Mahlzeiten vom heutigen Tag
    const today = new Date().toISOString().split('T')[0];
    const dailyMeals = FoodService.getMealsForDate(today);
    
    // Finde die vorhandenen abgeschlossenen Mahlzeitentypen für den Tag
    const completedMealTypes = dailyMeals
      .filter(meal => meal.isCompleted) // Nur abgeschlossene Mahlzeiten berücksichtigen
      .map(meal => meal.mealType);
      
    const hasBreakfast = completedMealTypes.includes('breakfast');
    const hasLunch = completedMealTypes.includes('lunch');
    const hasDinner = completedMealTypes.includes('dinner');

    updatedMissions = updatedMissions.map(mission => {
      // Überspringe bereits abgeschlossene Missionen
      if (mission.completed) return mission;
      
      // Aktivitätsmissionen werden manuell abgeschlossen und hier überspringen
      if (mission.requirements?.type === 'activity') return mission;

      let shouldComplete = false;

      // Überprüfe je nach Missionstyp
      switch (mission.requirements?.type) {
        case 'water':
          // Wassermission: Überprüfe, ob das Wasserziel erreicht wurde
          console.log('Prüfe Wassermission:', {
            missionId: mission.id,
            missionTitle: mission.title,
            currentWater: user.dailyWaterIntake,
            progressWater: user.dailyProgress?.water,
            requiredWater: mission.requirements.value,
            isCompleted: mission.completed
          });
          
          // Prüfe sowohl dailyWaterIntake als auch dailyProgress.water
          if (user.dailyWaterIntake && mission.requirements.value) {
            shouldComplete = user.dailyWaterIntake >= mission.requirements.value;
            console.log('Wassermission sollte abgeschlossen werden:', shouldComplete, 'basierend auf dailyWaterIntake');
          } else if (user.dailyProgress?.water && mission.requirements.value) {
            shouldComplete = user.dailyProgress.water >= mission.requirements.value;
            console.log('Wassermission sollte abgeschlossen werden:', shouldComplete, 'basierend auf dailyProgress.water');
          }
          
          break;
        case 'food':
          // Nahrungsmission: Überprüfe, ob spezifische Mahlzeiten eingetragen und abgeschlossen wurden
            if (mission.title.includes('Frühstück')) {
            // Prüfe, ob Frühstück für heute eingetragen und abgeschlossen wurde
            shouldComplete = hasBreakfast;
            } else if (mission.title.includes('Mittagessen')) {
            // Prüfe, ob Mittagessen für heute eingetragen und abgeschlossen wurde
            shouldComplete = hasLunch;
            } else if (mission.title.includes('Abendessen')) {
            // Prüfe, ob Abendessen für heute eingetragen und abgeschlossen wurde
            shouldComplete = hasDinner;
            } else {
            // Allgemeine Nahrungsmission - nur als erledigt markieren, wenn mind. eine Mahlzeit abgeschlossen wurde
            shouldComplete = completedMealTypes.length > 0;
          }
          break;
        case 'protein':
          // Proteinmission: Überprüfe, ob das Proteinziel erreicht wurde
          if (user.dailyProgress?.protein && mission.requirements.value) {
            shouldComplete = user.dailyProgress.protein >= mission.requirements.value;
          }
          break;
        case 'weight':
          // Gewichtsmission: Überprüfe, ob in der aktuellen Woche ein Gewichtseintrag vorgenommen wurde
          const now = new Date();
          const oneWeekAgo = new Date(now);
          oneWeekAgo.setDate(now.getDate() - 7);
          
          // Überprüfe, ob es einen Gewichtseintrag in der letzten Woche gibt
          if (user.weightHistory && user.weightHistory.length > 0) {
            const latestEntry = user.weightHistory[0]; // Neuester Eintrag steht am Anfang
            const entryDate = new Date(latestEntry.date);
            shouldComplete = entryDate >= oneWeekAgo;
          }
          break;
        // Weitere Missionstypen können hier hinzugefügt werden
      }

      // Wenn die Mission erfüllt ist, markiere sie als abgeschlossen und gib XP
      if (shouldComplete) {
        missionsCompleted = true;
        // XP vergeben
        addXP(mission.xp);
        return { ...mission, completed: true };
      }

      return mission;
    });

    // Aktualisiere die Missionen des Benutzers, wenn sich etwas geändert hat
    if (missionsCompleted) {
      updateUser({
        ...user,
        dailyMissions: updatedMissions,
        lastMissionCheck: new Date().toISOString() // Aktualisiere den Zeitstempel der letzten Prüfung
      });
    }

    // Gib zurück, ob Missionen abgeschlossen wurden
    return missionsCompleted;
  };

  // Funktion zum Zurücksetzen der täglichen Missionen
  const resetDailyMissions = () => {
    if (!user) return;
    
    console.log('Starte das Zurücksetzen der täglichen Missionen');
    
    // Generiere neue Missionen
    const newMissions = generateDailyMissions(user);
    
    console.log('Neue Missionen generiert:', newMissions);
    
    // Aktualisiere sowohl die Missionen als auch den täglichen Fortschritt
    updateUser({ 
      ...user,
      dailyMissions: newMissions,
      lastMissionRefresh: new Date().toISOString().split('T')[0], // YYYY-MM-DD Format
      dailyWaterIntake: 0,
      dailyProgress: {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        water: 0,
        burnedCalories: 0
      }
    });
    
    console.log('Tägliche Missionen und Fortschritt wurden zurückgesetzt.');
  };

  // Funktion zum Zurücksetzen aller Missionen (auch die, die bereits abgeschlossen sind)
  const resetAllMissions = () => {
    if (!user) return;
    
    // Generiere neue Missionen
    const newMissions = generateDailyMissions(user);
    
    // Aktualisiere den Benutzer mit den neuen Missionen
    updateUser({ 
      dailyMissions: newMissions,
      lastMissionRefresh: new Date().toISOString().split('T')[0] // YYYY-MM-DD Format
    });
    
    console.log('Alle Missionen wurden zurückgesetzt.');
  };

  // Funktion zum Generieren neuer täglicher Missionen
  const generateDailyMissions = (userData: UserData): Mission[] => {
    // Basis-Missionen, die immer vorhanden sind
    const missions: Mission[] = [
      { 
        id: 1, 
        title: 'Frühstück eintragen', 
        description: 'Trage dein Frühstück ein, um deine Ernährung zu verfolgen',
        completed: false, 
        type: 'daily',
        xp: 20,
        requirements: {
          type: 'food'
        },
        iconName: 'FiCoffee'
      },
      { 
        id: 2, 
        title: 'Mittagessen eintragen', 
        description: 'Trage dein Mittagessen ein, um deine Ernährung zu verfolgen',
        completed: false, 
        type: 'daily',
        xp: 20,
        requirements: {
          type: 'food'
        },
        iconName: 'FiLayers'
      },
      { 
        id: 3, 
        title: 'Abendessen eintragen', 
        description: 'Trage dein Abendessen ein, um deine Ernährung zu verfolgen',
        completed: false, 
        type: 'daily',
        xp: 20,
        requirements: {
          type: 'food'
        },
        iconName: 'FiLayers'
      },
    ];

    // Wasserziel-Mission basierend auf dem Benutzerziel
    if (userData.waterGoal && userData.waterGoal > 0) {
      missions.push({
        id: 4,
        title: `${userData.waterGoal / 1000} Liter Wasser trinken`,
        description: `Trinke ${userData.waterGoal / 1000} Liter Wasser für optimale Hydration`,
        completed: false,
        type: 'daily',
        xp: 30,
        requirements: {
          type: 'water',
          value: userData.waterGoal
        },
        iconName: 'FiDroplet'
      });
    }

    // Proteinziel-Mission basierend auf dem Benutzerziel
    if (userData.proteinGoal && userData.proteinGoal > 0) {
      missions.push({
        id: 5,
        title: `${userData.proteinGoal}g Protein zu dir nehmen`,
        description: `Erreiche dein Proteinziel von ${userData.proteinGoal}g`,
        completed: false,
        type: 'daily',
        xp: 40,
        requirements: {
          type: 'protein',
          value: userData.proteinGoal
        },
        iconName: 'FiHeart'
      });
    }

    // Weitere Mission für körperliche Aktivität
    const activityMinutes = 30; // Standard für moderate Aktivität
    missions.push({
      id: 6,
      title: `${activityMinutes} Minuten Bewegung`,
      description: `Bewege dich mindestens ${activityMinutes} Minuten`,
      completed: false,
      type: 'daily',
      xp: 50,
      requirements: {
        type: 'activity',
        value: activityMinutes
      },
      iconName: 'FiActivity'
    });

    return missions;
  };

  // Funktion zum Generieren von Missionen
  const generateMissions = () => {
    if (user) {
      // Tägliche Missionen generieren durch Aufruf von generateDailyMissions für Konsistenz
      const dailyMissions = generateDailyMissions(user);
      
      // Wöchentliche Missionen
      const weeklyMissions: Mission[] = [
        {
          id: 101,
          title: 'Erreiche deine Proteinziele',
          description: 'Erreiche 5 Tage lang dein tägliches Proteinziel',
          xp: 50,
          completed: false,
          type: 'nutrition',
          iconName: 'FiHeart',
          progress: 0,
          requirements: { type: 'protein', value: 5, current: 0 }
        },
        {
          id: 102,
          title: 'Gewicht tracken',
          description: 'Trage einmal pro Woche dein Gewicht ein, um deinen Fortschritt zu verfolgen',
          xp: 100,
          completed: false,
          type: 'weight',
          iconName: 'FiActivity',
          requirements: { type: 'weight' }
        }
      ];
      
      // Aktualisiere den Benutzer mit den neuen Missionen
      updateUser({
        ...user,
        dailyMissions,
        weeklyMissions,
        lastMissionRefresh: new Date().toISOString().split('T')[0] // YYYY-MM-DD Format
      });
    }
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      isLoading, 
      updateUser, 
      clearUser,
      addXP,
      completeDaily,
      resetDailyMissions,
      resetAllMissions,
      generateMissions,
      checkAndCompleteMissions,
      completeMeal
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// Recalculate nutrition goals helper
export const recalculateAndUpdateNutritionGoals = (userData: UserData, updateUserFunc: (data: Partial<UserData>) => void) => {
  // Prüfen, ob die erforderlichen Daten vorhanden sind
  if (!userData.weight || !userData.height || !userData.age || !userData.gender) {
    console.warn('Unvollständige Benutzerdaten für die Ernährungszielberechnung');
    return;
  }

  const inputData: NutritionInputData = {
    gender: userData.gender,
    weight: userData.weight,
    height: userData.height,
    age: userData.age,
    activityLevel: userData.activityLevel as any || 'moderate',
    weightGoal: userData.weightGoal || 'maintain'
  };

  const goals = calculateNutritionGoals(inputData);

  // Aktualisiere die Ziele des Benutzers
  updateUserFunc({
    calorieGoal: goals.calorieGoal,
    proteinGoal: goals.proteinGoal,
    carbGoal: goals.carbGoal,
    fatGoal: goals.fatGoal,
    waterGoal: goals.waterGoal,
    burnCalorieGoal: goals.burnCalorieGoal
  });
}; 