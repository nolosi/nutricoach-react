import React from 'react';
import { Box, Heading, Text, Button, Container, VStack, useColorModeValue } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const NotFoundPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  
  return (
    <Box minH="100vh" bg={bgColor} py={10}>
      <Container maxW="container.md">
        <VStack spacing={8} textAlign="center">
          <Heading as="h1" size="2xl" color="brand.500">
            404
          </Heading>
          <Heading as="h2" size="xl">
            {t('notFound.title', 'Seite nicht gefunden')}
          </Heading>
          <Text fontSize="xl">
            {t('notFound.message', 'Die angeforderte Seite existiert leider nicht.')}
          </Text>
          <Button 
            colorScheme="brand" 
            size="lg"
            onClick={() => navigate('/')}
          >
            {t('notFound.backToHome', 'Zurück zur Startseite')}
          </Button>
        </VStack>
      </Container>
    </Box>
  );
};

export default NotFoundPage; 