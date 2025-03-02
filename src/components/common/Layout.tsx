import React from 'react';
import { Box, Container, useColorModeValue } from '@chakra-ui/react';
import Header from './Header';
import Navigation from './Navigation';
import Footer from './Footer';
import { useLocation, Outlet } from 'react-router-dom';

interface LayoutProps {
  children?: React.ReactNode;
  title?: string;
  hideNavigation?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  title, 
  hideNavigation = false
}) => {
  const location = useLocation();
  const isOnboarding = location.pathname === '/onboarding';
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  // Automatisch Navigation während des Onboardings ausblenden
  const shouldHideNavigation = hideNavigation || isOnboarding;

  // Verwende den Pfadnamen, um den Titel dynamisch zu setzen
  let pageTitle = title;
  if (!pageTitle) {
    const path = location.pathname;
    if (path === '/' || path === '') {
      pageTitle = 'Start';
    } else if (path.includes('meals')) {
      pageTitle = 'Mahlzeiten';
    } else if (path.includes('progress')) {
      pageTitle = 'Fortschritt';
    } else if (path.includes('nutrition-goals')) {
      pageTitle = 'Ernährungsziele';
    } else if (path.includes('profile')) {
      pageTitle = 'Profil';
    } else {
      pageTitle = 'NutriCoach';
    }
  }

  return (
    <Box minHeight="100vh" display="flex" flexDirection="column" bg={bgColor}>
      {!isOnboarding && <Header title={pageTitle} />}
      
      <Container 
        flex="1" 
        py={4} 
        px={4} 
        maxW="container.md"
        pb={shouldHideNavigation ? 4 : 24} // Mehr Padding am unteren Rand, wenn die Navigation sichtbar ist
        display="flex"
        flexDirection="column"
      >
        {/* Rendere entweder die children-Prop oder den Outlet für React Router */}
        <Box flex="1">
          {children || <Outlet />}
        </Box>
        
        {!isOnboarding && <Footer />}
      </Container>
      
      {!shouldHideNavigation && <Navigation />}
    </Box>
  );
};

export default Layout; 