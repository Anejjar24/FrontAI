'use client';
import React, { useEffect, useRef } from 'react';
import { 
  Box, 
  Flex, 
  useColorModeValue, 
  Text,
  Button,
  useClipboard
} from '@chakra-ui/react';
import { MdContentCopy } from 'react-icons/md';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';

type MessageBoxProps = {
  output: string;
};

export default function MessageBoxChat({ output }: MessageBoxProps) {
  const textColor = useColorModeValue('navy.700', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const codeRef = useRef<HTMLDivElement>(null);
  const { hasCopied, onCopy } = useClipboard(output);

  // Détecter si la sortie est du code Python
  const isPythonCode = output.includes('import') || 
                        output.includes('def ') || 
                        output.includes('class ') || 
                        output.includes('=') || 
                        output.includes('return');

  return (
    <Flex
      direction="column"
      border="1px solid"
      borderColor={borderColor}
      borderRadius="14px"
      w="100%"
      p="15px"
      mb="20px"
      position="relative"
    >
      <Flex justify="space-between" w="100%" mb={2}>
        <Text
          fontWeight="bold"
          fontSize="md"
          color={textColor}
        >
          {isPythonCode ? 'Code Python généré:' : 'Réponse:'}
        </Text>
        <Button
          size="sm"
          variant="ghost"
          leftIcon={<MdContentCopy />}
          onClick={onCopy}
          aria-label="Copier le code"
        >
          {hasCopied ? 'Copié!' : 'Copier'}
        </Button>
      </Flex>

      <Box
        ref={codeRef}
        borderRadius="8px"
        w="100%"
        overflowX="auto"
        fontSize={{ base: 'xs', md: 'sm' }}
      >
        {isPythonCode ? (
          <SyntaxHighlighter
            language="python"
            style={vs2015}
            customStyle={{
              borderRadius: '8px',
              padding: '15px',
              margin: '0px',
              fontSize: '14px',
            }}
          >
            {output}
          </SyntaxHighlighter>
        ) : (
          <Text
            color={textColor}
            fontSize={{ base: 'sm', md: 'md' }}
            lineHeight={{ base: '24px', md: '26px' }}
            whiteSpace="pre-wrap"
          >
            {output}
          </Text>
        )}
      </Box>
    </Flex>
  );
}