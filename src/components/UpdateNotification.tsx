import React from 'react';
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
  Box,
  Link,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

interface UpdateNotificationProps {
  onClose: () => void;
}

const UpdateNotification: React.FC<UpdateNotificationProps> = ({ onClose }) => {
  const { t } = useTranslation();

  return (
    <Alert status="info" variant="subtle" mb={4}>
      <AlertIcon />
      <Box flex="1">
        <AlertTitle>{t('update.available', 'Update verfügbar')}</AlertTitle>
        <AlertDescription display="block">
          {t('update.description', 'Eine neue Version der App ist verfügbar.')}
          <Link
            color="blue.500"
            ml={1}
            onClick={() => window.location.reload()}
          >
            {t('update.refresh', 'Jetzt aktualisieren')}
          </Link>
        </AlertDescription>
      </Box>
      <CloseButton
        alignSelf="flex-start"
        position="relative"
        right={-1}
        top={-1}
        onClick={onClose}
      />
    </Alert>
  );
};

export default UpdateNotification; 