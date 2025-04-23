'use client';
/*eslint-disable*/
import { AddIcon } from '@chakra-ui/icons';
import Link from 'next/link';
import MessageBoxChat from '@/components/MessageBox';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  Icon,
  Img,
  Input,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { MdAutoAwesome, MdBolt, MdEdit, MdPerson } from 'react-icons/md';
import Bg from '../public/img/chat/bg-image.png';
import { useRef } from 'react';


// Dans le composant

export default function Chat() {
  // Input States
  const [inputOnSubmit, setInputOnSubmit] = useState<string>('');
  const [inputCode, setInputCode] = useState<string>('');
  // Response message - changer outputCode pour stocker la réponse complète
  const [outputCode, setOutputCode] = useState<string>('');
  // Model (but we'll only use CodeLlama from Django backend)
  const [model, setModel] = useState<string>('codellama');
  // Loading state
  const [loading, setLoading] = useState<boolean>(false);
  //Files csv
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvContent, setCsvContent] = useState<string>('');
  const [csvLoaded, setCsvLoaded] = useState<boolean>(false);
  // State pour les erreurs
  const [error, setError] = useState<string | null>(null);
  // Styling variables
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const inputColor = useColorModeValue('navy.700', 'white');
  const iconColor = useColorModeValue('brand.500', 'white');
  const bgIcon = useColorModeValue(
    'linear-gradient(180deg, #FBFBFF 0%, #CACAFF 100%)',
    'whiteAlpha.200',
  );
  const brandColor = useColorModeValue('brand.500', 'white');
  const buttonBg = useColorModeValue('white', 'whiteAlpha.100');
  const gray = useColorModeValue('gray.500', 'white');
  const successColor = useColorModeValue('green.500', 'green.300');
  const errorColor = useColorModeValue('red.500', 'red.300');
  const buttonShadow = useColorModeValue(
    '14px 27px 45px rgba(112, 144, 176, 0.2)',
    'none',
  );
  const textColor = useColorModeValue('navy.700', 'white');
  const placeholderColor = useColorModeValue(
    { color: 'gray.500' },
    { color: 'whiteAlpha.600' },
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Méthode améliorée pour traitement du fichier CSV
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCsvFile(file);
      setCsvLoaded(false); // Réinitialiser l'état de chargement
      
      const reader = new FileReader();
      
      reader.onload = (event) => {
        let text = event.target?.result as string;
        
        // Nettoyage des retours à la ligne pour garantir la compatibilité
        text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
        
        console.log(`CSV chargé - Taille: ${text.length} caractères`);
        console.log(`Aperçu: ${text.substring(0, 100)}...`);
        
        setCsvContent(text);
        setCsvLoaded(true);
        setError(null); // Réinitialiser les erreurs précédentes
      };
      
      reader.onerror = (error) => {
        console.error("Erreur de lecture du fichier:", error);
        setError("Erreur lors de la lecture du fichier CSV");
        setCsvLoaded(false);
      };
      
      reader.readAsText(file, 'UTF-8'); // Spécifier explicitement l'encodage UTF-8
    }
  };

  const handleGenerate = async () => {
    setInputOnSubmit(inputCode);
  
    if (!inputCode) {
      setError('Veuillez entrer votre description.');
      return;
    }
  
    setOutputCode('');
    setLoading(true);
    setError(null);
  
    try {
      console.log("Envoi de la requête avec:");
      console.log(`- Prompt: ${inputCode.substring(0, 50)}...`);
      console.log(`- CSV présent: ${csvContent ? 'Oui' : 'Non'}`);
      if (csvContent) {
        console.log(`- Taille CSV: ${csvContent.length} caractères`);
      }
      
      const response = await fetch('http://localhost:8000/generate/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt: inputCode, 
          csv: csvContent || '' // S'assurer qu'une chaîne vide est envoyée si pas de CSV
        }),
      });
      
      console.log(`Statut de la réponse: ${response.status}`);
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Réponse d'erreur du serveur:", errorText);
        throw new Error(`Le serveur a répondu avec le statut ${response.status}: ${errorText}`);
      }
  
      const data = await response.json();
      console.log("Réponse reçue du serveur:", data);
  
      if (data.error) {
        throw new Error(`${data.error}${data.details ? ': ' + data.details : ''}`);
      }
  
      // Utilisez data.code au lieu de data.response
      setOutputCode(data.code || '');
      
      // Si vous souhaitez également afficher l'explication
      if (data.explanation) {
        console.log("Explication:", data.explanation);
        // Vous pourriez ajouter un état pour l'explication si vous voulez l'afficher
      }
    } catch (error: any) {
      console.error('Erreur complète:', error);
      setError(error.message || String(error));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputCode(event.target.value);
  };

  return (
    <Flex
      w="100%"
      pt={{ base: '70px', md: '0px' }}
      direction="column"
      position="relative"
    >
      <Img
        src={Bg.src}
        position={'absolute'}
        w="350px"
        left="50%"
        top="50%"
        transform={'translate(-50%, -50%)'}
      />
      <Flex
        direction="column"
        mx="auto"
        w={{ base: '100%', md: '100%', xl: '100%' }}
        minH={{ base: '75vh', '2xl': '85vh' }}
        maxW="1000px"
      >
        {/* Model Selection */}
        <Flex direction={'column'} w="100%" mb={outputCode ? '20px' : 'auto'}>
          <Flex
            mx="auto"
            zIndex="2"
            w="max-content"
            mb="20px"
            borderRadius="60px"
          >
            <Flex
              cursor={'pointer'}
              transition="0.3s"
              justify={'center'}
              align="center"
              bg={model === 'codellama' ? buttonBg : 'transparent'}
              w="174px"
              h="70px"
              boxShadow={model === 'codellama' ? buttonShadow : 'none'}
              borderRadius="14px"
              color={textColor}
              fontSize="18px"
              fontWeight={'700'}
              onClick={() => setModel('codellama')}
            >
              <Flex
                borderRadius="full"
                justify="center"
                align="center"
                bg={bgIcon}
                me="10px"
                h="39px"
                w="39px"
              >
                <Icon
                  as={MdAutoAwesome}
                  width="20px"
                  height="20px"
                  color={iconColor}
                />
              </Flex>
              CodeLlama
            </Flex>
          </Flex>

          <Accordion color={gray} allowToggle w="100%" my="0px" mx="auto">
            <AccordionItem border="none">
              <AccordionButton
                borderBottom="0px solid"
                maxW="max-content"
                mx="auto"
                _hover={{ border: '0px solid', bg: 'none' }}
                _focus={{ border: '0px solid', bg: 'none' }}
              >
                <Box flex="1" textAlign="left">
                  <Text color={gray} fontWeight="500" fontSize="sm">
                    Générateur de Code Python
                  </Text>
                </Box>
                <AccordionIcon color={gray} />
              </AccordionButton>
              <AccordionPanel mx="auto" w="max-content" p="0px 0px 10px 0px">
                <Text
                  color={gray}
                  fontWeight="500"
                  fontSize="sm"
                  textAlign={'center'}
                >
                  Décrivez ce que vous voulez générer en Python
                </Text>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </Flex>
        
        {/* Affichage des erreurs */}
        {error && (
          <Flex 
            w="100%" 
            bg="red.50" 
            border="1px solid" 
            borderColor="red.200" 
            borderRadius="md" 
            p={3} 
            mb={4}
          >
            <Icon as={MdBolt} color={errorColor} mr={2} />
            <Text color={errorColor} fontSize="sm">
              {error}
            </Text>
          </Flex>
        )}
        
        {/* Main Box */}
        <Flex
          direction="column"
          w="100%"
          mx="auto"
          display={outputCode ? 'flex' : 'none'}
          mb={'auto'}
        >
          <Flex w="100%" align={'center'} mb="10px">
            <Flex
              borderRadius="full"
              justify="center"
              align="center"
              bg={'transparent'}
              border="1px solid"
              borderColor={borderColor}
              me="20px"
              h="40px"
              minH="40px"
              minW="40px"
            >
              <Icon
                as={MdPerson}
                width="20px"
                height="20px"
                color={brandColor}
              />
            </Flex>
            <Flex
              p="22px"
              border="1px solid"
              borderColor={borderColor}
              borderRadius="14px"
              w="100%"
              zIndex={'2'}
            >
              <Text
                color={textColor}
                fontWeight="600"
                fontSize={{ base: 'sm', md: 'md' }}
                lineHeight={{ base: '24px', md: '26px' }}
              >
                {inputOnSubmit}
              </Text>
              <Icon
                cursor="pointer"
                as={MdEdit}
                ms="auto"
                width="20px"
                height="20px"
                color={gray}
              />
            </Flex>
          </Flex>
          <Flex w="100%">
            <Flex
              borderRadius="full"
              justify="center"
              align="center"
              bg={'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%)'}
              me="20px"
              h="40px"
              minH="40px"
              minW="40px"
            >
              <Icon
                as={MdAutoAwesome}
                width="20px"
                height="20px"
                color="white"
              />
            </Flex>
            <MessageBoxChat output={outputCode} />
          </Flex>
        </Flex>

        {/* CSV Upload Section with feedback */}
        <Flex 
          direction="column"
          mt="20px"
          w="100%"
          mb="10px"
        >
          <Box position="relative">
            <Input
              type="file"
              accept=".csv"
              ref={fileInputRef}
              onChange={handleFileUpload}
              mb="5px"
              w="100%"
              border="1px dashed"
              borderColor={borderColor}
              p="10px"
              borderRadius="md"
              bg="whiteAlpha.100"
              style={{ display: 'none' }}
            />
          </Box>
        </Flex>
        {csvLoaded && csvFile && (
          <Flex
            ms={{ base: '0px', xl: '60px' }}
            mt="10px"
            justifySelf={'flex-end'}
            border="1px solid"
            borderColor={borderColor}
            borderRadius="lg"
            p="10px"
            mb="10px"
            alignItems="center"
            bg="whiteAlpha.100"
            maxW="100%"
          >
            <Icon as={MdBolt} color={brandColor} mr="8px" boxSize={5} />
            <Text color={textColor} fontSize="sm" isTruncated>
              {csvFile.name}
            </Text>
          </Flex>
        )}
        
        {/* Chat Input */}
        <Flex
          ms={{ base: '0px', xl: '60px' }}
          mt="10px"
          justifySelf={'flex-end'}
        >
          <Input
            minH="54px"
            h="100%"
            border="1px solid"
            borderColor={borderColor}
            borderRadius="45px"
            p="15px 20px"
            me="10px"
            fontSize="sm"
            fontWeight="500"
            _focus={{ borderColor: 'none' }}
            color={inputColor}
            _placeholder={placeholderColor}
            placeholder="Décrivez le code Python que vous souhaitez générer..."
            onChange={handleChange}
            value={inputCode}
          />
          <Button
            variant="primary"
            py="20px"
            px="16px"
            fontSize="sm"
            borderRadius="45px"
            ms="auto"
            me="10px"
            w={{ base: '160px', md: '210px' }}
            h="54px"
            _hover={{
              boxShadow:
                '0px 21px 27px -10px rgba(96, 60, 255, 0.48) !important',
              bg: 'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%) !important',
              _disabled: {
                bg: 'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%)',
              },
            }}
            onClick={handleGenerate}
            isLoading={loading}
            disabled={loading}
          >
            Générer
          </Button>

          <Button
            variant="primary"
            py="20px"
            px="16px"
            fontSize="sm"
            borderRadius="50px"
            ms="auto"
            w={{ base: '70px', md: '70px' }}
            h="54px"
            _hover={{
              boxShadow:
                '0px 21px 27px -10px rgba(96, 60, 255, 0.48) !important',
              bg: 'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%) !important',
              _disabled: {
                bg: 'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%)',
              },
            }}
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
          >
            <AddIcon boxSize={4} />
          </Button>
        </Flex>

        <Flex
          justify="center"
          mt="20px"
          direction={{ base: 'column', md: 'row' }}
          alignItems="center"
        >
          <Text fontSize="xs" textAlign="center" color={gray}>
            Générateur de code Python - Powered by Ollama
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
}