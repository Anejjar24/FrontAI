'use client';
// Chakra imports
import { Flex, useColorModeValue } from '@chakra-ui/react';
import { CodeGeneratorLogo } from '@/components/icons/CodeGeneratorLogo';
import { HorizonLogo } from '@/components/icons/Icons';
import { HSeparator } from '@/components/separator/Separator';

export function SidebarBrand() {
  //   Chakra color mode
  let logoColor = useColorModeValue('navy.700', 'white');

  return (
    <Flex alignItems="center" flexDirection="column">
      <CodeGeneratorLogo h="26px" w="550px" my="20px" color={logoColor}  />
      <HSeparator mb="20px" w="284px" />
    </Flex>
  );
}

export default SidebarBrand;
