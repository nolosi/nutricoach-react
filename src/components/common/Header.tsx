import React from 'react';
import {
  Box,
  Flex,
  Heading,
  IconButton,
  useColorMode,
  useColorModeValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Image,
  Spacer
} from '@chakra-ui/react';
import { FiSun, FiMoon, FiGlobe } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';

interface HeaderProps {
  title?: string;
}

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();
  
  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
  };
  
  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label="Sprache wählen"
        icon={<FiGlobe />}
        variant="ghost"
        size="md"
      />
      <MenuList>
        <MenuItem onClick={() => changeLanguage('de')}>Deutsch</MenuItem>
        <MenuItem onClick={() => changeLanguage('en')}>English</MenuItem>
        <MenuItem onClick={() => changeLanguage('sq')}>Shqip</MenuItem>
      </MenuList>
    </Menu>
  );
};

const Header: React.FC<HeaderProps> = ({ title = 'NutriCoach' }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const location = useLocation();
  const isHomePage = location.pathname === '/' || location.pathname === '';
  
  return (
    <Box
      as="header"
      position="sticky"
      top="0"
      bg={bg}
      boxShadow="sm"
      zIndex="sticky"
      p={3}
      borderBottomWidth="1px"
      borderColor={borderColor}
    >
      <Flex justify="space-between" align="center">
        <Link to="/" style={{ textDecoration: 'none' }}>
          <Flex align="center">
            <Image 
              src="/assets/images/logo.png"
              alt="NutriCoach Logo"
              height="36px"
              width="36px"
              objectFit="contain"
              mr={2}
            />
            {isHomePage ? (
              <Heading
                as="h1"
                size="md"
                color="brand.500"
              >
                NutriCoach
              </Heading>
            ) : (
              <Heading
                as="h1"
                size="md"
                color="gray.700"
                _dark={{ color: "gray.200" }}
              >
                {title}
              </Heading>
            )}
          </Flex>
        </Link>
        
        <Spacer />
        
        <Flex>
          <LanguageSelector />
          <IconButton
            aria-label={colorMode === 'light' ? 'Dunkles Design' : 'Helles Design'}
            icon={colorMode === 'light' ? <FiMoon /> : <FiSun />}
            onClick={toggleColorMode}
            variant="ghost"
            ml={2}
          />
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header; 