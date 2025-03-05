import React from 'react';
import { Box, Spinner, Text } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { useTranslation } from 'react-i18next';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const LoadingSpinner: React.FC = () => {
  const { t } = useTranslation();
  
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
      bg="rgba(255, 255, 255, 0.9)"
      zIndex={9999}
      animation={`${fadeIn} 0.3s ease-in-out`}
    >
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="blue.500"
        size="xl"
        mb={4}
      />
      <Text
        fontSize="xl"
        fontWeight="500"
        color="gray.700"
        animation={`${fadeIn} 0.3s ease-in-out 0.2s`}
        opacity={0}
        style={{ animationFillMode: 'forwards' }}
      >
        {t('common.loading')}
      </Text>
      <Text
        fontSize="md"
        color="gray.500"
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