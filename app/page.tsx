'use client';
/*eslint-disable*/
import { AddIcon, CheckIcon, CloseIcon } from '@chakra-ui/icons';
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
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Spinner,
  Tooltip,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { MdAutoAwesome, MdBolt, MdEdit, MdPerson, MdCode, MdPlayArrow, MdOutput, MdInsertChart } from 'react-icons/md';
import Bg from '../public/img/chat/bg-image.png';
import { useRef } from 'react';


export default function Chat() {
  // Input States
  const [inputOnSubmit, setInputOnSubmit] = useState<string>('');
  const [inputCode, setInputCode] = useState<string>('');
  // Response message
  const [outputCode, setOutputCode] = useState<string>('');
  // Results from execution
  const [executionResults, setExecutionResults] = useState<any>(null);
  // Model (but we'll only use CodeLlama from Django backend)
  const [model, setModel] = useState<string>('codellama');
  // Loading states
  const [loading, setLoading] = useState<boolean>(false);
  const [executingCode, setExecutingCode] = useState<boolean>(false);
  // Files csv
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvContent, setCsvContent] = useState<string>('');
  const [csvLoaded, setCsvLoaded] = useState<boolean>(false);
  // State pour les erreurs
  const [error, setError] = useState<string | null>(null);
  // État actif de l'onglet
  const [activeTab, setActiveTab] = useState(0);
  
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
  const tabBg = useColorModeValue('gray.50', 'whiteAlpha.50');
  const activeTabBg = useColorModeValue('white', 'whiteAlpha.100');
  const hoverTabBg = useColorModeValue('gray.100', 'whiteAlpha.200');

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

  // Génération du code
  const handleGenerate = async () => {
    setInputOnSubmit(inputCode);
  
    if (!inputCode) {
      setError('Veuillez entrer votre description.');
      return;
    }
  
    setOutputCode('');
    setLoading(true);
    setError(null);
    setExecutionResults(null); // Réinitialiser les résultats précédents
  
    try {
      console.log("Préparation de la requête...");
      
      // Création d'un FormData pour envoyer le fichier
      const formData = new FormData();
      
      // Ajout du query/prompt
      formData.append('data', JSON.stringify({ query: inputCode }));
      
      // Ajout du fichier CSV s'il existe
      if (csvFile) {
        formData.append('csv_file', csvFile);
        console.log(`Fichier CSV joint: ${csvFile.name}`);
      }
      
      // URL du backend - utilisation de l'URL qui correspond à votre backend Django
      const url = 'http://localhost:8000/api/generate-code/';
      console.log(`Envoi vers: ${url}`);
      
      const response = await fetch(url, {
        method: 'POST',
        body: formData, // Utilisation de FormData au lieu de JSON
      });
      
      console.log(`Statut de la réponse: ${response.status}`);
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Réponse d'erreur du serveur:", errorText);
        throw new Error(`Le serveur a répondu avec le statut ${response.status}: ${errorText.substring(0, 100)}`);
      }
  
      const data = await response.json();
      console.log("Réponse reçue du serveur:", data);
  
      if (!data.success) {
        throw new Error(data.error || 'Une erreur inconnue est survenue');
      }
  
      // Mettre à jour le code généré
      setOutputCode(data.code || '');


      //localStorage.setItem('code_to_run', data.code_to_run || '');
      // Changer vers l'onglet de code

      // j'ai ajouté
      // Stockage du code à exécuter - s'assurer qu'il est propre
      const codeToRun = data.code_to_run || '';
      localStorage.setItem('code_to_run', codeToRun);
      console.log("Code stocké pour exécution:", codeToRun.substring(0, 100) + "...");

      setActiveTab(0);
      
    } catch (error: any) {
      console.error('Erreur complète:', error);
      setError(error.message || String(error));
    } finally {
      setLoading(false);
    }
  };

  // Nouvelle fonction pour exécuter le code généré
  // Le problème se trouve dans la fonction handleExecuteCode 
// Voici la version modifiée pour permettre l'exécution sans fichier CSV

// Fonction améliorée pour exécuter le code généré
const handleExecuteCode = async () => {
  if (!outputCode) {
    setError('Aucun code à exécuter.');
    return;
  }
  
  setExecutingCode(true);
  setError(null);
  
  try {
    console.log("Préparation de l'exécution du code...");
    
    // Récupération du code à exécuter depuis localStorage
    const codeToRun = localStorage.getItem('code_to_run') || outputCode.replace(/```python|```/g, '').trim();
    console.log("Code récupéré pour exécution:", codeToRun.substring(0, 100) + "...");
    
    // Création d'un FormData pour envoyer le fichier et le code
    const formData = new FormData();
    
    // Ajout du code à exécuter
    formData.append('data', JSON.stringify({ 
      code: codeToRun,
      query: inputOnSubmit
    }));
    
    // Ajout du fichier CSV s'il existe
    if (csvFile) {
      formData.append('csv_file', csvFile);
    }
    
    // URL du backend pour l'exécution du code
    const url = 'http://localhost:8000/api/execute-code/';
    console.log(`Envoi vers: ${url}`);
    
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });
    
    console.log(`Statut de la réponse: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Réponse d'erreur du serveur:", errorText);
      throw new Error(`Le serveur a répondu avec le statut ${response.status}: ${errorText.substring(0, 100)}`);
    }

    const data = await response.json();
    console.log("Résultats d'exécution reçus:", data);

    if (!data.success) {
      throw new Error(data.error || 'Une erreur inconnue est survenue');
    }

    // Mettre à jour les résultats d'exécution
    if (data.result) {
      try {
        // Tenter de parser le résultat comme JSON
        const parsedResult = typeof data.result === 'string' ? JSON.parse(data.result) : data.result;
        setExecutionResults(parsedResult);
        
        // Changer vers l'onglet approprié
        if (parsedResult.errors && parsedResult.errors.length > 0) {
          setActiveTab(1); // Onglet console pour voir les erreurs
        } else if (parsedResult.figures && parsedResult.figures.length > 0) {
          setActiveTab(2); // Onglet des graphiques
        } else {
          setActiveTab(1); // Onglet de console par défaut
        }
      } catch (e) {
        console.error("Erreur de parsing du résultat:", e);
        // Si le parsing échoue, utiliser la chaîne brute
        setExecutionResults({ output: String(data.result), errors: 'Erreur de parsing: ' + e.message, figures: [] });
        setActiveTab(1); // Onglet de console
      }
    }
  } catch (error) {
    console.error('Erreur d\'exécution:', error);
    if (error instanceof Error) {
      setError(error.message);
    } else {
      setError(String(error));
    }
  } finally {
    setExecutingCode(false);
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
                    Générateur de Code Python pour Data Science
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
                  Décrivez ce que vous voulez analyser ou visualiser avec vos données CSV
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
        
        {/* Main Box - Affichage du code et résultats */}
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
          
          {/* Section de réponse avec onglets */}
          <Flex w="100%" direction="column">
            <Flex
              borderRadius="full"
              justify="center"
              align="center"
              bg={'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%)'}
              me="20px"
              h="40px"
              minH="40px"
              minW="40px"
              alignSelf="flex-start"
              mt="10px"
            >
              <Icon
                as={MdAutoAwesome}
                width="20px"
                height="20px"
                color="white"
              />
            </Flex>
            
            {/* Bouton d'exécution */}
            <Flex ms="60px" mb="15px" mt="10px">
              <Button
                leftIcon={<Icon as={MdPlayArrow} />}
                colorScheme="teal"
                variant="solid"
                isLoading={executingCode}
                loadingText="Exécution..."
                onClick={handleExecuteCode}
                size="md"
                borderRadius="md"
              >
                Exécuter le code
              </Button>
              
              {csvLoaded && csvFile && (
                <Flex
                  ml="10px"
                  alignItems="center"
                  bg="green.50"
                  border="1px solid"
                  borderColor="green.200"
                  borderRadius="md"
                  p="6px 12px"
                >
                  <Icon as={CheckIcon} color="green.500" mr="8px" boxSize={3} />
                  <Text color="green.700" fontSize="xs">
                    {csvFile.name}
                  </Text>
                </Flex>
              )}
            </Flex>
            
            {/* Onglets pour Code, Console, Graphiques */}
            <Box
              ms="60px"
              border="1px solid"
              borderColor={borderColor}
              borderRadius="14px"
              w="100%"
              overflow="hidden"
            >
              <Tabs 
                isFitted 
                variant="enclosed" 
                index={activeTab} 
                onChange={(index) => setActiveTab(index)}
                colorScheme="purple"
              >
                <TabList bg={tabBg}>
                  <Tab 
                    _selected={{ 
                      color: brandColor, 
                      bg: activeTabBg,
                      fontWeight: "600",
                      borderBottomColor: "transparent" 
                    }}
                    _hover={{ bg: hoverTabBg }}
                  >
                    <Icon as={MdCode} mr="2" /> Code
                  </Tab>
                  <Tab 
                    _selected={{ 
                      color: brandColor, 
                      bg: activeTabBg,
                      fontWeight: "600",
                      borderBottomColor: "transparent"  
                    }}
                    _hover={{ bg: hoverTabBg }}
                  >
                    <Icon as={MdOutput} mr="2" /> Console
                  </Tab>
                  <Tab 
                    _selected={{ 
                      color: brandColor, 
                      bg: activeTabBg,
                      fontWeight: "600",
                      borderBottomColor: "transparent"  
                    }}
                    _hover={{ bg: hoverTabBg }}
                  >
                    <Icon as={MdInsertChart} mr="2" /> Graphiques
                  </Tab>
                </TabList>
                
                <TabPanels>
                  {/* Onglet Code */}
                  <TabPanel p="0">
                    <MessageBoxChat output={outputCode} />
                  </TabPanel>
                  
                  {/* Onglet Console */}
                  <TabPanel p="0">
                    {executionResults ? (
                      <Flex direction="column" w="100%" p="15px">
                        {/* Erreurs */}
                        {executionResults.errors && executionResults.errors.length > 0 && (
                          <Box mb="15px">
                            <Text color={errorColor} fontWeight="600" fontSize="sm" mb="5px">
                              Erreurs:
                            </Text>
                            <Box 
                              bg="red.50" 
                              borderRadius="md" 
                              p="10px" 
                              fontSize="sm" 
                              fontFamily="monospace"
                              whiteSpace="pre-wrap"
                              maxH="200px"
                              overflowY="auto"
                            >
                              {executionResults.errors}
                            </Box>
                          </Box>
                        )}
                        
                        {/* Sortie */}
                        {executionResults.output && (
                          <Box>
                            <Text color={textColor} fontWeight="600" fontSize="sm" mb="5px">
                              Sortie:
                            </Text>
                            <Box 
                              bg="gray.50" 
                              borderRadius="md" 
                              p="10px" 
                              fontSize="sm" 
                              fontFamily="monospace"
                              whiteSpace="pre-wrap"
                              maxH="400px"
                              overflowY="auto"
                            >
                              {executionResults.output}
                            </Box>
                          </Box>
                        )}
                        
                        {/* Message si pas de sortie */}
                        {!executionResults.output && !executionResults.errors && (
                          <Text color={gray} fontSize="sm" p="20px" textAlign="center">
                            L'exécution n'a généré aucune sortie textuelle.
                          </Text>
                        )}
                      </Flex>
                    ) : (
                      <Flex 
                        justify="center" 
                        align="center" 
                        direction="column" 
                        p="40px"
                      >
                        <Text color={gray} fontSize="sm" mb="10px">
                          Exécutez le code pour voir les résultats
                        </Text>
                        <Button
                          leftIcon={<Icon as={MdPlayArrow} />}
                          colorScheme="teal"
                          variant="outline"
                          size="sm"
                          onClick={handleExecuteCode}
                          isLoading={executingCode}
                        >
                          Exécuter
                        </Button>
                      </Flex>
                    )}
                  </TabPanel>
                  
                  {/* Onglet Graphiques */}
                  <TabPanel p="0">
                    {executionResults && executionResults.figures && executionResults.figures.length > 0 ? (
                      <Flex direction="column" w="100%" p="15px">
                        <Text color={textColor} fontWeight="600" fontSize="md" mb="15px">
                          Visualisations générées:
                        </Text>
                        <Flex flexWrap="wrap" gap="20px" justify="center">
                          {executionResults.figures.map((figPath, index) => (
                            <Box 
                              key={index} 
                              borderRadius="lg" 
                              overflow="hidden" 
                              border="1px solid"
                              borderColor="gray.200"
                              boxShadow="sm"
                              maxW="100%"
                              w={{ base: "100%", md: "45%" }}
                            >
                              <Img 
                                src={figPath} 
                                alt={`Figure ${index + 1}`} 
                                w="100%" 
                                h="auto"
                              />
                              <Box p="10px" bg="gray.50">
                                <Text color={textColor} fontSize="sm" fontWeight="500">
                                  Figure {index + 1}
                                </Text>
                              </Box>
                            </Box>
                          ))}
                        </Flex>
                      </Flex>
                    ) : (
                      <Flex 
                        justify="center" 
                        align="center" 
                        direction="column" 
                        p="40px"
                      >
                        <Text color={gray} fontSize="sm" mb="10px">
                          {executingCode ? "Génération des graphiques..." : 
                          (executionResults ? "Aucun graphique généré par ce code" : "Exécutez le code pour voir les graphiques")}
                        </Text>
                        {executingCode ? (
                          <Spinner color="teal.500" size="md" />
                        ) : (
                          !executionResults && (
                            <Button
                              leftIcon={<Icon as={MdPlayArrow} />}
                              colorScheme="teal"
                              variant="outline"
                              size="sm"
                              onClick={handleExecuteCode}
                            >
                              Exécuter
                            </Button>
                          )
                        )}
                      </Flex>
                    )}
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Box>
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
            <Icon 
              as={CloseIcon} 
              color={gray} 
              ml="auto" 
              boxSize={3} 
              cursor="pointer"
              onClick={() => {
                setCsvFile(null);
                setCsvContent('');
                setCsvLoaded(false);
              }}
            />
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
            placeholder="Décrivez l'analyse ou la visualisation que vous souhaitez générer..."
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

          <Tooltip label="Charger un fichier CSV" placement="top">
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
          </Tooltip>
        </Flex>

        <Flex
          justify="center"
          mt="20px"
          direction={{ base: 'column', md: 'row' }}
          alignItems="center"
        >
          <Text fontSize="xs" textAlign="center" color={gray}>
            Générateur de code Python pour Data Science - Powered by Ollama
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
}
