import React from "react";
import { useRouter } from "next/navigation";
// Chakra imports
import {
  Box,
  Flex,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Icon,
  Link,
  Switch,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
// Assets
import { FaApple, FaFacebook, FaGoogle } from "react-icons/fa";

function Sign1In() {
  const router = useRouter();
  // Chakra color mode
  const textColor = useColorModeValue("gray.700", "white");
  const bgForm = useColorModeValue("white", "navy.800");
  const titleColor = useColorModeValue("gray.700", "blue.500");
  const colorIcons = useColorModeValue("gray.700", "white");
  const bgIcons = useColorModeValue("transparent", "navy.700");
  const bgIconsHover = useColorModeValue("gray.50", "whiteAlpha.100");

  const handleSignUp = () => {
    router.push('/auth/register');
  };

  const handleSignIn = () => {
    router.push('/');
  };

  return (
    <Flex
      minHeight="100vh"
      align="center"
      justify="center"
      bg={useColorModeValue("gray.50", "navy.900")}
      position="relative"
    >
      {/* Image de fond qui prend toute la hauteur */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        bgImage="/assets/img/signInImage.png"
        bgSize="cover"
        bgPosition="center"
        
      />
      
      {/* Formulaire centré dans une carte */}
      <Flex
        direction="column"
        justify="center"
        align="center"
        w={{ base: "90%", sm: "80%", md: "60%" }}
        maxW="1044px"
        bg={bgForm}
        boxShadow="lg"
        borderRadius="15px"
        p={8}
        position="relative"
        zIndex="2"
      >
        <Text fontSize="2xl" color={textColor} fontWeight="bold" textAlign="center" mb={6}>
          Sign In
        </Text>

        {/* Icônes de connexion sociale */}
        <HStack spacing={4} justify="center" mb={6}>
          <Flex
            justify="center"
            align="center"
            w="50px"
            h="50px"
            borderRadius="8px"
            border="1px solid"
            borderColor="gray.200"
            bg={bgIcons}
            _hover={{ bg: bgIconsHover }}
            cursor="pointer"
          >
            <Link href="#">
              <Icon as={FaFacebook} color={colorIcons} w={6} h={6} />
            </Link>
          </Flex>
          <Flex
            justify="center"
            align="center"
            w="50px"
            h="50px"
            borderRadius="8px"
            border="1px solid"
            borderColor="gray.200"
            bg={bgIcons}
            _hover={{ bg: bgIconsHover }}
            cursor="pointer"
          >
            <Link href="#">
              <Icon as={FaApple} color={colorIcons} w={6} h={6} _hover={{ filter: "brightness(120%)" }} />
            </Link>
          </Flex>
          <Flex
            justify="center"
            align="center"
            w="50px"
            h="50px"
            borderRadius="8px"
            border="1px solid"
            borderColor="gray.200"
            bg={bgIcons}
            _hover={{ bg: bgIconsHover }}
            cursor="pointer"
          >
            <Link href="#">
              <Icon as={FaGoogle} color={colorIcons} w={6} h={6} _hover={{ filter: "brightness(120%)" }} />
            </Link>
          </Flex>
        </HStack>

        <Text fontSize="lg" color="gray.400" fontWeight="bold" textAlign="center" mb={6}>
          or
        </Text>

        {/* Formulaire de connexion */}
        <FormControl mb={4}>
          <FormLabel htmlFor="email" fontSize="sm" fontWeight="normal">
            Email
          </FormLabel>
          <Input
            variant="outline"
            fontSize="sm"
            id="email"
            type="email"
            placeholder="Your email address"
            size="lg"
          />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel htmlFor="password" fontSize="sm" fontWeight="normal">
            Password
          </FormLabel>
          <Input
            variant="outline"
            fontSize="sm"
            id="password"
            type="password"
            placeholder="Your password"
            size="lg"
          />
        </FormControl>

        <FormControl display="flex" alignItems="center" mb={6}>
          <Switch id="remember-login" colorScheme="blue" me={2} />
          <FormLabel htmlFor="remember-login" mb={0} fontWeight="normal">
            Remember me
          </FormLabel>
        </FormControl>

        <Button
          fontSize="lg"
          variant="solid"
          colorScheme="blue"
          w="100%"
          mb={6}
          onClick={handleSignIn}
        >
          SIGN IN
        </Button>

        <Flex direction="column" justify="center" align="center">
          <Text color={textColor} fontWeight="medium">
            Don't have an account?
            <Link
              color={titleColor}
              as="span"
              ms={2}
              onClick={handleSignUp}
              fontWeight="bold"
              cursor="pointer"
            >
              Sign Up
            </Link>
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default Sign1In;
