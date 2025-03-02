import React, { useState } from 'react';
import {
  Box,
  Flex,
  Text,
  Icon,
  HStack,
  useColorModeValue,
  Tooltip,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  VStack,
  Button,
} from '@chakra-ui/react';
import { FiHome, FiList, FiActivity, FiTarget, FiUser, FiPieChart, FiAward, FiCoffee, FiDroplet, FiMoreHorizontal, FiX } from 'react-icons/fi';
import { NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Hauptnavigations-Item für die untere Leiste
const NavItem = ({ icon, name, path }: { icon: React.ComponentType; name: string; path: string }) => {
  const activeBg = useColorModeValue('brand.50', 'brand.800');
  const inactiveBg = useColorModeValue('transparent', 'transparent');
  const activeColor = useColorModeValue('brand.600', 'white');
  const inactiveColor = useColorModeValue('gray.600', 'gray.400');
  
  return (
    <NavLink 
      to={path}
      style={({ isActive }) => ({
        textDecoration: 'none'
      })}
    >
      {({ isActive }) => (
        <Flex
          align="center"
          p="3"
          mx="1"
          borderRadius="lg"
          role="group"
          cursor="pointer"
          bg={isActive ? activeBg : inactiveBg}
          color={isActive ? activeColor : inactiveColor}
          _hover={{
            bg: activeBg,
            color: activeColor,
          }}
          flexDirection="column"
          justifyContent="center"
        >
          <Icon
            fontSize="18"
            as={icon}
            mb="1"
          />
          <Text fontSize="xs">{name}</Text>
        </Flex>
      )}
    </NavLink>
  );
};

// Sekundäres Navigations-Item für das Popup-Menü
const SecondaryNavItem = ({ icon, name, path, onClose }: { icon: React.ComponentType; name: string; path: string; onClose: () => void }) => {
  const location = useLocation();
  const isActive = location.pathname === path;
  const activeColor = useColorModeValue('brand.600', 'white');
  const inactiveColor = useColorModeValue('gray.600', 'gray.400');
  const activeBg = useColorModeValue('brand.50', 'brand.800');
  
  return (
    <NavLink 
      to={path}
      style={{ width: '100%', textDecoration: 'none' }}
      onClick={onClose}
    >
      <Flex
        align="center"
        p="3"
        borderRadius="md"
        role="group"
        cursor="pointer"
        bg={isActive ? activeBg : 'transparent'}
        color={isActive ? activeColor : inactiveColor}
        _hover={{
          bg: activeBg,
          color: activeColor,
        }}
      >
        <Icon as={icon} mr="2" />
        <Text fontSize="sm">{name}</Text>
      </Flex>
    </NavLink>
  );
};

const Navigation: React.FC = () => {
  const { t } = useTranslation();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  // Hauptnavigationspunkte (maximal 4 für die untere Leiste)
  const mainNavItems = [
    { name: t('nav.home', 'Home'), icon: FiHome, path: '/' },
    { name: t('nav.meals', 'Mahlzeiten'), icon: FiCoffee, path: '/meals' },
    { name: t('nav.progress', 'Fortschritt'), icon: FiPieChart, path: '/progress' },
    { name: t('nav.profile', 'Profil'), icon: FiUser, path: '/profile' },
  ];
  
  // Zusätzliche Navigationspunkte für das "Mehr"-Menü
  const secondaryNavItems = [
    { name: t('nav.water', 'Wasser'), icon: FiDroplet, path: '/track/water' },
    { name: t('nav.nutrition', 'Ernährung'), icon: FiTarget, path: '/nutrition-goals' },
  ];
  
  const handleClose = () => setIsMoreOpen(false);
  
  return (
    <Box 
      as="nav" 
      position="fixed" 
      bottom={0} 
      left={0} 
      right={0}
      bg={bgColor}
      borderTopWidth="1px"
      borderColor={borderColor}
      boxShadow="0 -2px 10px rgba(0, 0, 0, 0.05)"
      zIndex={10}
    >
      <HStack justify="space-around" align="center" py={1}>
        {mainNavItems.map((item) => (
          <NavItem 
            key={item.path} 
            icon={item.icon} 
            name={item.name} 
            path={item.path} 
          />
        ))}
        
        <Popover
          isOpen={isMoreOpen}
          onClose={handleClose}
          placement="top"
          gutter={20}
          closeOnBlur={true}
        >
          <PopoverTrigger>
            <Flex
              align="center"
              p="3"
              mx="1"
              borderRadius="lg"
              role="button"
              cursor="pointer"
              bg="transparent"
              _hover={{
                bg: useColorModeValue('brand.50', 'brand.800'),
                color: useColorModeValue('brand.600', 'white'),
              }}
              flexDirection="column"
              justifyContent="center"
              onClick={() => setIsMoreOpen(!isMoreOpen)}
            >
              <Icon
                fontSize="18"
                as={isMoreOpen ? FiX : FiMoreHorizontal}
                mb="1"
              />
              <Text fontSize="xs">{t('nav.more', 'Mehr')}</Text>
            </Flex>
          </PopoverTrigger>
          <PopoverContent width="200px" bg={bgColor} borderColor={borderColor}>
            <PopoverBody p={2}>
              <VStack spacing={1} align="stretch">
                {secondaryNavItems.map((item) => (
                  <SecondaryNavItem
                    key={item.path}
                    icon={item.icon}
                    name={item.name}
                    path={item.path}
                    onClose={handleClose}
                  />
                ))}
              </VStack>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </HStack>
    </Box>
  );
};

export default Navigation; 