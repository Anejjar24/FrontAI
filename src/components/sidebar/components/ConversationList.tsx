import React, { useEffect, useState } from 'react';
import {
  Box,
  Flex,
  Text,
  Icon,
  List,
  ListItem,
  Button,
  useColorModeValue,
  Spinner,
  Badge,
  useToast
} from '@chakra-ui/react';
import { MdChat, MdDelete, MdAdd } from 'react-icons/md';
import { useRouter } from 'next/navigation';
import {useAuth} from "@/contexts/AuthContext";

// Interface pour le type de conversation
interface Conversation {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
}

const ConversationList: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth(); //hadi zdtha
  const router = useRouter();
  const toast = useToast();

  // Couleurs pour le thème
  const textColor = useColorModeValue('navy.700', 'white');
  const brandColor = useColorModeValue('brand.500', 'white');
  const bgHover = useColorModeValue('gray.100', 'whiteAlpha.100');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  
  // Fonction pour récupérer les conversations
  const fetchConversations = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/conversations/', {
        method: 'GET',
        //credentials: 'include', // Important pour les cookies d'authentification
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur réseau: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setConversations(data.conversations);
      } else {
        throw new Error(data.error || 'Erreur lors de la récupération des conversations');
      }
    } catch (err: any) {
      setError(err.message);
      toast({
        title: 'Erreur',
        description: err.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour créer une nouvelle conversation
  const createNewConversation = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/conversations/create/', {
        method: 'POST',
        //credentials: 'include',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Nouvelle conversation',
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur réseau: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        // Ajouter la nouvelle conversation à la liste et rediriger vers celle-ci
        setConversations([data.conversation, ...conversations]);
        router.push(`/conversation?conversation=${data.conversation.id}`);
      } else {
        throw new Error(data.error || 'Erreur lors de la création de la conversation');
      }
    } catch (err: any) {
      toast({
        title: 'Erreur',
        description: err.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Fonction pour supprimer une conversation
  const deleteConversation = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Empêcher le clic de se propager à l'élément parent
    
    try {
      const response = await fetch(`http://localhost:8000/api/conversations/${id}/delete/`, {
        method: 'DELETE',
        //credentials: 'include',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur réseau: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        // Supprimer la conversation de la liste
        setConversations(conversations.filter(conv => conv.id !== id));
        toast({
          title: 'Succès',
          description: 'Conversation supprimée avec succès',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        throw new Error(data.error || 'Erreur lors de la suppression de la conversation');
      }
    } catch (err: any) {
      toast({
        title: 'Erreur',
        description: err.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Fonction pour ouvrir une conversation
  /*const openConversation = (id: number) => {
    router.push(`/`);
  };*/

  const openConversation = (id: number) => {
    router.push(`/conversation?conversation=${id}`);
  };
  

  useEffect(() => {
    fetchConversations();
  }, []);

  // Formater la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <Box my="26px" width="100%">
      <Flex mb="20px" align="center" justify="space-between" px="10px">
        <Text
          color={textColor}
          fontSize="md"
          fontWeight="700"
        >
          Conversations
        </Text>
        <Button
          size="sm"
          variant="ghost"
          colorScheme="blue"
          borderRadius="50%"
          p="0"
          onClick={createNewConversation}
          _hover={{ bg: bgHover }}
        >
          <Icon as={MdAdd} w="20px" h="20px" />
        </Button>
      </Flex>

      {loading ? (
        <Flex justify="center" py="20px">
          <Spinner color={brandColor} />
        </Flex>
      ) : error ? (
        <Text color="red.500" fontSize="sm" textAlign="center">
          {error}
        </Text>
      ) : conversations.length === 0 ? (
        <Text color={textColor} fontSize="sm" textAlign="center" opacity="0.7">
          Aucune conversation trouvée
        </Text>
      ) : (
        <List spacing={2}>
          {conversations.map((conversation) => (
            <ListItem 
              key={conversation.id} 
              onClick={() => openConversation(conversation.id)}
              cursor="pointer"
            >
              <Flex
                align="center"
                py="10px"
                px="16px"
                borderRadius="10px"
                _hover={{ bg: bgHover }}
                transition="all 0.2s ease"
              >
                <Icon as={MdChat} mr="12px" w="20px" h="20px" color={brandColor} />
                <Box flex="1">
                  <Text color={textColor} fontSize="sm" fontWeight="500" noOfLines={1}>
                    {conversation.title}
                  </Text>
                  <Text color="gray.500" fontSize="xs">
                    {formatDate(conversation.updated_at)}
                  </Text>
                </Box>
                <Button
                  size="xs"
                  colorScheme="red"
                  variant="ghost"
                  borderRadius="50%"
                  onClick={(e) => deleteConversation(conversation.id, e)}
                  opacity="0.6"
                  _hover={{ opacity: 1, bg: 'red.50' }}
                >
                  <Icon as={MdDelete} w="16px" h="16px" />
                </Button>
              </Flex>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default ConversationList;