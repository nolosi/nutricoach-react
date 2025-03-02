import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Flex,
  Input,
  IconButton,
  VStack,
  Text,
  useColorModeValue
} from '@chakra-ui/react';
import { FiSend } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import CoachMessage from './CoachMessage';
import UserMessage from './UserMessage';
import { Coach } from '../../types/coach';
import { useUser } from '../../contexts/UserContext';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'coach';
  timestamp: Date;
}

interface ConversationContainerProps {
  coach: Coach;
}

const ConversationContainer: React.FC<ConversationContainerProps> = ({ coach }) => {
  const { t, i18n } = useTranslation();
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const language = i18n.language as 'en' | 'de' | 'sq';
  
  // Beim ersten Rendern eine Begrüßungsnachricht anzeigen
  useEffect(() => {
    const greetings = coach.greetings[language] || coach.greetings.en;
    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
    
    // Kurze Verzögerung, um das "Tippen" des Coaches zu simulieren
    setIsTyping(true);
    
    const typingTimer = setTimeout(() => {
      setIsTyping(false);
      setMessages([
        {
          id: Date.now().toString(),
          content: randomGreeting,
          sender: 'coach',
          timestamp: new Date()
        }
      ]);
    }, 1500);
    
    return () => clearTimeout(typingTimer);
  }, [coach, language]);
  
  // Automatisches Scrollen zu neuen Nachrichten
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);
  
  const handleSendMessage = () => {
    if (input.trim() === '') return;
    
    // Benutzernachricht hinzufügen
    const newUserMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setInput('');
    
    // Coach-Antwort simulieren
    setIsTyping(true);
    
    // Zufällige Verzögerung für realistischeres Gefühl
    const replyDelay = 1000 + Math.random() * 2000;
    
    setTimeout(() => {
      setIsTyping(false);
      
      // Zufällige Motivationsphrase oder Tipp als Antwort auswählen
      const responses = [...coach.motivationalPhrases[language], ...coach.tips[language]];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const newCoachMessage: Message = {
        id: Date.now().toString(),
        content: randomResponse,
        sender: 'coach',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, newCoachMessage]);
    }, replyDelay);
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };
  
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  
  return (
    <Box
      position="relative"
      height="100%"
      display="flex"
      flexDirection="column"
      bg={bgColor}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={borderColor}
      boxShadow="sm"
      overflow="hidden"
    >
      {/* Nachrichtenbereich */}
      <VStack
        flex="1"
        p={4}
        spacing={4}
        align="stretch"
        overflowY="auto"
        maxHeight="400px"
      >
        {messages.map(message => (
          message.sender === 'coach' ? (
            <CoachMessage
              key={message.id}
              message={message.content}
              coachImage={coach.image}
            />
          ) : (
            <UserMessage
              key={message.id}
              message={message.content}
            />
          )
        ))}
        
        {isTyping && (
          <CoachMessage
            message=""
            coachImage={coach.image}
            isTyping={true}
          />
        )}
        
        <div ref={messagesEndRef} />
      </VStack>
      
      {/* Eingabebereich */}
      <Flex 
        p={3} 
        borderTopWidth="1px" 
        borderColor={borderColor}
        alignItems="center"
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={String(t('coach.typingPlaceholder'))}
          mr={2}
        />
        <IconButton
          aria-label="Send message"
          icon={<FiSend />}
          colorScheme="brand"
          onClick={handleSendMessage}
          isDisabled={input.trim() === ''}
        />
      </Flex>
    </Box>
  );
};

export default ConversationContainer; 