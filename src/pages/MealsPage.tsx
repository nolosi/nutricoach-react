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
  
  return (
    <Container maxW="container.xl" py={8}>
      <Heading as="h1" size="xl" mb={6}>
        {t('nav.meals')}
      </Heading>
      
      <Text mb={4}>
        {t('meals.pageDescription', 'Plan and track your meals to reach your nutrition goals.')}
      </Text>
      
      {/* Info-Banner für Rezepte */}
      <Box 
        bg={infoBannerBg} 
        p={4} 
        borderRadius="md" 
        mb={8}
        boxShadow="sm"
      >
        <Flex justifyContent="space-between" alignItems="center">
          <Box>
            <Heading size="sm" mb={1}>{t('meals.discoverRecipes', 'Entdecke neue Rezepte')}</Heading>
            <Text fontSize="sm">
              {t('meals.discoverRecipesDesc', 'Finde gesunde und leckere Rezepte für deinen Ernährungsplan')}
            </Text>
          </Box>
          <Button 
            colorScheme="teal" 
            size="sm"
            rightIcon={<FiChevronRight />}
            leftIcon={<FiBook />}
            onClick={() => navigate('/recipes')}
          >
            {t('meals.goToRecipes', 'Zu den Rezepten')}
          </Button>
        </Flex>
      </Box>
      
      <Tabs variant="enclosed" colorScheme="teal" isLazy>
        <TabList 
          mb={4}
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
          <Tab _selected={{ bg: tabBg, borderBottomColor: tabBg }} minW="auto" px={4}>
            {t('meals.mealPlan')}
          </Tab>
          <Tab _selected={{ bg: tabBg, borderBottomColor: tabBg }} minW="auto" px={4}>
            {t('meals.trackFood')}
          </Tab>
          <Tab _selected={{ bg: tabBg, borderBottomColor: tabBg }} minW="auto" px={4}>
            {t('meals.foodDatabase')}
          </Tab>
        </TabList>
        
        <TabPanels bg={tabBg} borderRadius="md" shadow="md">
          <TabPanel>
            <MealPlanView />
          </TabPanel>
          
          <TabPanel>
            <FoodTrackingView />
          </TabPanel>
          
          <TabPanel>
            <FoodDatabaseView />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
};

export default MealsPage; 