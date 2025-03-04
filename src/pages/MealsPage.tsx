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
        {t('meals.pageDescription', 'Plan and track your meals to reach your nutrition goals.')}
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
            <Heading size="xs" mb={1}>{t('meals.discoverRecipes', 'Entdecke neue Rezepte')}</Heading>
            <Text fontSize="xs">
              {t('meals.discoverRecipesDesc', 'Finde gesunde und leckere Rezepte für deinen Ernährungsplan')}
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
            {t('meals.goToRecipes', 'Zu den Rezepten')}
          </Button>
        </Flex>
      </Box>
      
      <Tabs variant="enclosed" colorScheme="teal" isLazy>
        <TabList 
          mb={3}
          overflowX="auto" 
          overflowY="hidden" 
          css={{
            scrollbarWidth: 'none',
            '::-webkit-scrollbar': { display: 'none' },
            whiteSpace: 'nowrap',
            flexWrap: 'nowrap'
          }}
          pb={1}
        >
          <Tab 
            _selected={{ bg: tabBg, borderBottomColor: tabBg }} 
            minW="auto" 
            px={tabPadding}
            py={1.5}
            fontSize={{ base: 'xs', md: 'sm' }}
          >
            {t('meals.mealPlan')}
          </Tab>
          <Tab 
            _selected={{ bg: tabBg, borderBottomColor: tabBg }} 
            minW="auto" 
            px={tabPadding}
            py={1.5}
            fontSize={{ base: 'xs', md: 'sm' }}
          >
            {t('meals.trackFood')}
          </Tab>
          <Tab 
            _selected={{ bg: tabBg, borderBottomColor: tabBg }} 
            minW="auto" 
            px={tabPadding}
            py={1.5}
            fontSize={{ base: 'xs', md: 'sm' }}
          >
            {t('meals.foodDatabase')}
          </Tab>
        </TabList>
        
        <TabPanels bg={tabBg} borderRadius="md" shadow="md">
          <TabPanel p={{ base: 2, md: 4 }}>
            <MealPlanView />
          </TabPanel>
          
          <TabPanel p={{ base: 2, md: 4 }}>
            <FoodTrackingView />
          </TabPanel>
          
          <TabPanel p={{ base: 2, md: 4 }}>
            <FoodDatabaseView />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
};

export default MealsPage; 