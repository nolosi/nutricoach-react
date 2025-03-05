import React from 'react';
import { Box, Spinner, Text, useColorMode, useColorModeValue } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { useTranslation } from 'react-i18next';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const LoadingSpinner: React.FC = () => {
  const { t } = useTranslation();
  const { colorMode } = useColorMode();
  
  // Dynamische Farbwerte basierend auf dem Farbmodus
  const bgColor = useColorModeValue('rgba(255, 255, 255, 0.9)', 'rgba(26, 32, 44, 0.9)');
  const spinnerEmptyColor = useColorModeValue('gray.200', 'gray.700');
  const spinnerColor = useColorModeValue('blue.500', 'brand.400');
  const titleColor = useColorModeValue('gray.700', 'gray.100');
  const subtitleColor = useColorModeValue('gray.500', 'gray.400');
  
  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      bg={bgColor}
      zIndex={9999}
      animation={`${fadeIn} 0.3s ease-in-out`}
    >
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor={spinnerEmptyColor}
        color={spinnerColor}
        size="xl"
        mb={4}
      />
      <Text
        fontSize="xl"
        fontWeight="500"
        color={titleColor}
        animation={`${fadeIn} 0.3s ease-in-out 0.2s`}
        opacity={0}
        style={{ animationFillMode: 'forwards' }}
      >
        {t('common.loading')}
      </Text>
      <Text
        fontSize="md"
        color={subtitleColor}
        mt={2}
        animation={`${fadeIn} 0.3s ease-in-out 0.4s`}
        opacity={0}
        style={{ animationFillMode: 'forwards' }}
      >
        {t('app.slogan')}
      </Text>
    </Box>
  );
};

export default LoadingSpinner; 