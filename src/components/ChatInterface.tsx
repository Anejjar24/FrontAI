'use client';
import {
  Box,
  Flex,
  Text,
  Input,
  Button,
  Spinner,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  id: number;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface Props {
  conversationId: string;
}

export default function ChatInterface({ conversationId }: Props) {
  const { token } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!token || !conversationId) return;

    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/conversations/${conversationId}/`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        const data = await response.json();
        if (data.success) {
          setMessages(data.conversation.messages);
        } else {
          toast({
            title: 'Erreur',
            description: data.error,
            status: 'error',
          });
        }
      } catch (err) {
        toast({
          title: 'Erreur',
          description: 'Impossible de charger les messages',
          status: 'error',
        });
      }
    };

    fetchMessages();
  }, [conversationId, token]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setLoading(true);

    const userMessage: Message = {
      id: Date.now(),
      sender: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      // 1. Sauvegarder le message utilisateur
      await fetch('http://localhost:8000/api/messages/', {
        method: 'POST',
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversation: conversationId,
          sender: 'user',
          content: input,
        }),
      });

      // 2. Appeler le backend pour générer la réponse du LLM
      const response = await fetch('http://localhost:8000/api/generate-code/', {
        method: 'POST',
        body: JSON.stringify({ query: input, conversation_id: conversationId }),
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Erreur LLM');
      }

      const assistantMessage: Message = {
        id: Date.now() + 1,
        sender: 'assistant',
        content: data.code,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // 3. Sauvegarder le message de l’assistant
      await fetch('http://localhost:8000/api/messages/', {
        method: 'POST',
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversation: conversationId,
          sender: 'assistant',
          content: data.code,
        }),
      });
    } catch (err: any) {
      toast({
        title: 'Erreur',
        description: err.message || 'Erreur serveur',
        status: 'error',
      });
    } finally {
      setInput('');
      setLoading(false);
    }
  };

  return (
    <Flex direction="column" maxW="800px" mx="auto" p={4}>
      <VStack align="stretch" spacing={4} mb={4}>
        {messages.map((msg, index) => (
          <Box
            key={index}
            alignSelf={msg.sender === 'user' ? 'flex-end' : 'flex-start'}
            bg={msg.sender === 'user' ? 'blue.100' : 'gray.100'}
            p={3}
            borderRadius="md"
            maxW="70%"
          >
            <Text fontWeight="bold">
              {msg.sender === 'user' ? 'Vous' : 'Assistant'}
            </Text>
            <Text whiteSpace="pre-wrap">{msg.content}</Text>
          </Box>
        ))}
        <div ref={scrollRef}></div>
      </VStack>

      <Flex gap={2}>
        <Input
          placeholder="Votre prompt..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button
          onClick={sendMessage}
          isLoading={loading}
          colorScheme="blue"
          disabled={!input.trim()}
        >
          Envoyer
        </Button>
      </Flex>
    </Flex>
  );
}
