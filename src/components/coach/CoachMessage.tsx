import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Flex, 
  Text, 
  Avatar, 
  Spinner, 
  useColorModeValue
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { coaches } from '../../data/coaches';

interface CoachMessageProps {
  message: string;
  coach?: string;
  coachImage?: string;
  isTyping?: boolean;
  delay?: number;
}

const MotionBox = motion(Box);

const TypingIndicator: React.FC = () => {
  return (
    <Flex alignItems="center">
      <Box
        height="8px"
        width="8px"
        borderRadius="full"
        bg="brand.500"
        mr={1}
        animation="typing 1s infinite"
        sx={{
          "@keyframes typing": {
            "0%, 100%": { opacity: 0.3 },
            "50%": { opacity: 1 }
          }
        }}
      />
      <Box
        height="8px"
        width="8px"
        borderRadius="full"
        bg="brand.500"
        mr={1}
        animation="typing 1s infinite 0.2s"
        sx={{
          "@keyframes typing": {
            "0%, 100%": { opacity: 0.3 },
            "50%": { opacity: 1 }
          }
        }}
      />
      <Box
        height="8px"
        width="8px"
        borderRadius="full"
        bg="brand.500"
        animation="typing 1s infinite 0.4s"
        sx={{
          "@keyframes typing": {
            "0%, 100%": { opacity: 0.3 },
            "50%": { opacity: 1 }
          }
        }}
      />
    </Flex>
  );
};

const CoachMessage: React.FC<CoachMessageProps> = ({ 
  message, 
  coach = 'sophia', 
  coachImage, 
  isTyping = false, 
  delay = 0 
}) => {
  const bgColor = useColorModeValue('blue.50', 'blue.900');
  const textColor = useColorModeValue('gray.800', 'white');
  const [showMessage, setShowMessage] = useState(false);
  
  // Wenn kein coachImage übergeben wurde, versuchen wir ein Standardbild basierend auf der coach ID zu finden
  const imageUrl = coachImage || `/images/coaches/${coach}.jpg`;
  
  useEffect(() => {
    if (!isTyping) {
      const timer = setTimeout(() => {
        setShowMessage(true);
      }, delay);
      
      return () => clearTimeout(timer);
    }
  }, [isTyping, delay]);
  
  return (
    <Flex mb={4} alignItems="flex-start">
      <Avatar 
        src={imageUrl} 
        name={coach} 
        size="sm" 
        mr={2} 
      />
      
      {isTyping ? (
        <Flex alignItems="center" bg={bgColor} p={2} borderRadius="lg" maxWidth="80%">
          <TypingIndicator />
        </Flex>
      ) : (
        showMessage && (
          <MotionBox 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            bg={bgColor} 
            p={3} 
            borderRadius="lg" 
            maxWidth="80%"
          >
            <Text color={textColor}>{message}</Text>
          </MotionBox>
        )
      )}
    </Flex>
  );
};

export default CoachMessage;