'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  Box,
  Text,
  Spinner,
  Flex,
  VStack,
  Heading,
  Divider,
  useColorModeValue,
} from '@chakra-ui/react';

interface Message {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
}

export default function ConversationPage() {
  const searchParams = useSearchParams();
  const conversationId = searchParams.get('conversation');
  const { token } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const textColor = useColorModeValue('gray.800', 'white');

  useEffect(() => {
    if (conversationId && token) {
      const fetchMessages = async () => {
        try {
          const response = await fetch(`http://localhost:8000/api/conversations/${conversationId}/`, {
            method: 'GET',
            headers: {
              Authorization: `Token ${token}`,
              'Content-Type': 'application/json',
            },
          });

          const data = await response.json();

          if (response.ok && data.success) {
            setMessages(data.conversation.messages);
          } else {
            setError(data.error || 'Erreur inconnue');
          }
        } catch (err: any) {
          setError(err.message || 'Erreur réseau');
        } finally {
          setLoading(false);
        }
      };

      fetchMessages();
    }
  }, [conversationId, token]);

  return (
    <Box p={6}>
      <Heading size="md" mb={4}>Conversation #{conversationId}</Heading>

      {loading ? (
        <Flex justify="center" align="center" minH="200px">
          <Spinner size="lg" />
        </Flex>
      ) : error ? (
        <Text color="red.500">{error}</Text>
      ) : (
        <VStack align="stretch" spacing={4}>
          {messages.map((msg) => (
            <Box
              key={msg.id}
              p={4}
              borderRadius="md"
              bg={msg.sender === 'user' ? 'blue.50' : 'gray.100'}
              alignSelf={msg.sender === 'user' ? 'flex-end' : 'flex-start'}
            >
              <Text fontWeight="bold" mb={1}>
                {msg.sender === 'user' ? 'Vous' : 'Assistant'}
              </Text>
              <Text color={textColor}>{msg.content}</Text>
              <Divider mt={2} />
              <Text fontSize="xs" color="gray.500" mt={1}>
                {new Date(msg.timestamp).toLocaleString()}
              </Text>
            </Box>
          ))}
        </VStack>
      )}
    </Box>
  );
}