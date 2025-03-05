import React from 'react';
import { Box, Text, Link, HStack, useColorModeValue } from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';
import { FiGithub } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

const Footer: React.FC = () => {
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const location = useLocation();
  const isOnboarding = location.pathname === '/onboarding';
  const { t } = useTranslation();
  
  return (
    <Box 
      as="footer" 
      width="100%" 
      py={3}
      textAlign="center"
      bg={bgColor}
      borderTopWidth="1px"
      borderTopColor={borderColor}
      position="relative"
      mt="auto"
      display={isOnboarding ? 'none' : 'block'}
      zIndex={1}
    >
      <HStack spacing={2} justify="center">
        <Text fontSize="xs" color={textColor}>
          {t('footer.credits')}
        </Text>
        <Text fontSize="xs" color={textColor}>{t('footer.separator')}</Text>
        <Link 
          href="https://github.com/nolosi/nutricoach-react" 
          isExternal 
          fontSize="xs" 
          color={textColor}
          display="flex"
          alignItems="center"
        >
          <Box as={FiGithub} mr={1} />
          {t('footer.openSource')}
        </Link>
      </HStack>
    </Box>
  );
};

export default Footer; 