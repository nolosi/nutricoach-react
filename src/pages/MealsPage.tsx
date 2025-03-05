import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorModeValue,
  Button,
  Flex,
  Icon,
  useBreakpointValue,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { FiChevronRight, FiBook } from 'react-icons/fi';
import MealPlanView from '../components/meals/MealPlanView';
import FoodTrackingView from '../components/meals/FoodTrackingView';
import FoodDatabaseView from '../components/meals/FoodDatabaseView';

const MealsPage: React.FC = () => {
  const { t } = useTranslation();
  const tabBg = useColorModeValue('white', 'gray.800');
  const infoBannerBg = useColorModeValue('blue.50', 'blue.900');
  const navigate = useNavigate();
  
  // Responsive Größen basierend auf dem Breakpoint
  const headingSize = useBreakpointValue({ base: 'lg', md: 'xl' });
  const containerPadding = useBreakpointValue({ base: 4, md: 8 });
  const buttonSize = useBreakpointValue({ base: 'xs', md: 'sm' });
  const tabPadding = useBreakpointValue({ base: 2, md: 4 });
  const bannerPadding = useBreakpointValue({ base: 3, md: 4 });
  const bannerMarginBottom = useBreakpointValue({ base: 4, md: 8 });
  
  return (
    <Container maxW="container.xl" py={containerPadding}>
      <Heading as="h1" size={headingSize} mb={4}>
        {t('nav.meals')}
      </Heading>
      
      <Text mb={3} fontSize={{ base: 'sm', md: 'md' }}>
        {t('meals.pageDescription')}
      </Text>
      
      {/* Info-Banner für Rezepte */}
      <Box 
        bg={infoBannerBg} 
        p={bannerPadding} 
        borderRadius="md" 
        mb={bannerMarginBottom}
        boxShadow="sm"
      >
        <Flex justifyContent="space-between" alignItems="center" flexWrap={{ base: 'wrap', sm: 'nowrap' }}>
          <Box mb={{ base: 2, sm: 0 }} flex="1">
            <Heading size="xs" mb={1}>{t('meals.discoverRecipes')}</Heading>
            <Text fontSize="xs">
              {t('meals.discoverRecipesDesc')}
            </Text>
          </Box>
          <Button 
            colorScheme="teal" 
            size={buttonSize}
            rightIcon={<FiChevronRight />}
            leftIcon={<FiBook />}
            onClick={() => navigate('/recipes')}
            ml={{ sm: 2 }}
            width={{ base: '100%', sm: 'auto' }}
          >
            {t('meals.goToRecipes')}
          </Button>
        </Flex>
      </Box>
      
      <Tabs variant="enclosed" colorScheme="teal" isLazy>
        <TabList>
          <Tab px={tabPadding} _selected={{ bg: tabBg, borderBottomColor: tabBg }}>
            {t('meals.mealPlan')}
          </Tab>
          <Tab px={tabPadding} _selected={{ bg: tabBg, borderBottomColor: tabBg }}>
            {t('meals.trackFood')}
          </Tab>
          <Tab px={tabPadding} _selected={{ bg: tabBg, borderBottomColor: tabBg }}>
            {t('meals.foodDatabase')}
          </Tab>
        </TabList>
        
        <TabPanels bg={tabBg} borderWidth="1px" borderTop="none" borderBottomRadius="md">
          <TabPanel p={{ base: 3, md: 5 }}>
            <MealPlanView />
          </TabPanel>
          
          <TabPanel p={{ base: 3, md: 5 }}>
            <FoodTrackingView />
          </TabPanel>
          
          <TabPanel p={{ base: 3, md: 5 }}>
            <FoodDatabaseView />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
};

export default MealsPage; 