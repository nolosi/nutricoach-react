import React from 'react';
import { 
  Box, 
  Flex, 
  Text, 
  Avatar, 
  useColorModeValue
} from '@chakra-ui/react';
import { motion } from 'framer-motion';

interface UserMessageProps {
  message: string;
}

const MotionBox = motion(Box);

const UserMessage: React.FC<UserMessageProps> = ({ message }) => {
  const bgColor = useColorModeValue('brand.100', 'brand.700');
  const textColor = useColorModeValue('gray.800', 'white');
  
  return (
    <Flex mb={4} alignItems="flex-start" justifyContent="flex-end">
      <MotionBox
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        p={3}
        borderRadius="lg"
        bg={bgColor}
        color={textColor}
        maxW="80%"
        mr={2}
      >
        <Text>{message}</Text>
      </MotionBox>
      
      <Avatar 
        name="User" 
        size="sm" 
        src="/assets/images/user-avatar.png"
      />
    </Flex>
  );
};

export default UserMessage; 