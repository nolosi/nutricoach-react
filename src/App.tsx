import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { useUser, UserProvider } from './contexts/UserContext';
import theme from './theme';
import './index.css';

// Pages
import HomePage from './pages/HomePage';
import MealsPage from './pages/MealsPage';
import ProgressPage from './pages/ProgressPage';
import ProfilePage from './pages/ProfilePage';
import OnboardingPage from './pages/OnboardingPage';
import AchievementsPage from './pages/AchievementsPage';
import RecipesPage from './pages/RecipesPage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import RecipeCreatePage from './pages/RecipeCreatePage';
import NutritionGoalsPage from './pages/NutritionGoalsPage';
import NotFoundPage from './pages/NotFoundPage';
import WaterTrackingPage from './pages/WaterTrackingPage';

// Components
import Layout from './components/common/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';
import LoadingSpinner from './components/common/LoadingSpinner';

// Hooks
import useAutoBackup from './hooks/useAutoBackup';

import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

// UpdateNotification Komponente
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
  Box,
  Link,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

// Aktuelle Version der App
const APP_VERSION = '1.0.0'; // Diese sollte bei jedem Update erhöht werden

interface UpdateNotificationProps {
  onClose: () => void;
}

const UpdateNotification: React.FC<UpdateNotificationProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const [shouldShow, setShouldShow] = useState(true);

  useEffect(() => {
    // Prüfe, ob der Benutzer bereits die aktuelle Version gesehen hat
    const lastSeenVersion = localStorage.getItem('lastSeenVersion');
    if (lastSeenVersion === APP_VERSION) {
      setShouldShow(false);
      onClose();
    }
  }, [onClose]);

  const handleUpdate = () => {
    // Speichere die aktuelle Version im localStorage
    localStorage.setItem('lastSeenVersion', APP_VERSION);
    // Lade die Seite neu
    window.location.reload();
  };

  if (!shouldShow) {
    return null;
  }

  return (
    <Alert status="info" variant="subtle" mb={4}>
      <AlertIcon />
      <Box flex="1">
        <AlertTitle>{t('updates.available', 'Update verfügbar')}</AlertTitle>
        <AlertDescription display="block">
          {t('updates.newVersion', 'Eine neue Version der App ist verfügbar.')}
          <Link
            color="blue.500"
            ml={1}
            onClick={handleUpdate}
          >
            {t('updates.updateNow', 'Jetzt aktualisieren')}
          </Link>
        </AlertDescription>
      </Box>
      <CloseButton
        alignSelf="flex-start"
        position="relative"
        right={-1}
        top={-1}
        onClick={() => {
          // Speichere die aktuelle Version im localStorage, wenn der Benutzer die Benachrichtigung schließt
          localStorage.setItem('lastSeenVersion', APP_VERSION);
          onClose();
          setShouldShow(false);
        }}
      />
    </Alert>
  );
};

// Haupt-App-Komponente, die von UserProvider umschlossen wird
const AppContent: React.FC = () => {
  const { user, isLoading: userLoading } = useUser();
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [showUpdateNotification, setShowUpdateNotification] = useState(true);
  
  // Automatische Backups
  useAutoBackup();

  useEffect(() => {
    // Zeige die Ladeanimation für mindestens 1.5 Sekunden
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 1500);

    // Prüfe, ob der Benutzer bereits die aktuelle Version gesehen hat
    const lastSeenVersion = localStorage.getItem('lastSeenVersion');
    if (lastSeenVersion === APP_VERSION) {
      setShowUpdateNotification(false);
    }

    return () => clearTimeout(timer);
  }, []);

  if (isInitialLoading || userLoading) {
    return <LoadingSpinner />;
  }

  // Wenn der Benutzer das Onboarding nicht abgeschlossen hat, leite ihn zur Onboarding-Seite weiter
  const onboardingCompleted = user?.onboardingCompleted;

  return (
    <Router>
      {showUpdateNotification && (
        <UpdateNotification onClose={() => setShowUpdateNotification(false)} />
      )}
      <Routes>
        {/* Onboarding Route */}
        <Route
          path="/onboarding"
          element={onboardingCompleted ? <Navigate to="/" replace /> : <OnboardingPage />}
        />
        
        {/* Geschützte Routen */}
        <Route element={<Layout />}>
          <Route path="/" element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } />
          <Route path="meals" element={
            <ProtectedRoute>
              <MealsPage />
            </ProtectedRoute>
          } />
          <Route path="progress" element={
            <ProtectedRoute>
              <ProgressPage />
            </ProtectedRoute>
          } />
          <Route path="profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path="achievements" element={
            <ProtectedRoute>
              <Navigate to="/progress" replace />
            </ProtectedRoute>
          } />
          <Route path="nutrition-goals" element={
            <ProtectedRoute>
              <NutritionGoalsPage />
            </ProtectedRoute>
          } />
          <Route path="track/water" element={
            <ProtectedRoute>
              <WaterTrackingPage />
            </ProtectedRoute>
          } />
          <Route path="recipes" element={
            <ProtectedRoute>
              <RecipesPage />
            </ProtectedRoute>
          } />
          <Route path="recipes/create" element={
            <ProtectedRoute>
              <RecipeCreatePage />
            </ProtectedRoute>
          } />
          <Route path="recipes/:recipeId" element={
            <ProtectedRoute>
              <RecipeDetailPage />
            </ProtectedRoute>
          } />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <I18nextProvider i18n={i18n}>
      <ChakraProvider theme={theme}>
        <UserProvider>
          <AppContent />
        </UserProvider>
      </ChakraProvider>
    </I18nextProvider>
  );
};

export default App;