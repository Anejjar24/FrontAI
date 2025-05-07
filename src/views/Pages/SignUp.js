import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Icon,
  Input,
  Link,
  Switch,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { FaApple, FaFacebook, FaGoogle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

function SignUp() {
  const router = useRouter();
  const toast = useToast();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const bgForm = useColorModeValue("white", "navy.800");
  const titleColor = useColorModeValue("gray.700", "blue.500");
  const textColor = useColorModeValue("gray.700", "white");
  const colorIcons = useColorModeValue("gray.700", "white");
  const bgIcons = useColorModeValue("trasnparent", "navy.700");
  const bgIconsHover = useColorModeValue("gray.50", "whiteAlpha.100");
  
  const handleSignIn = () => {
    router.push('/auth/sign-in');
  };
  
  const handleSignUp = async () => {
    // Basic validation
    if (!name || !username || !email || !password) {
      toast({
        title: "Error",
        description: "All fields are required",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      const success = await register(name, username, email, password);
      
      if (success) {
        toast({
          title: "Success",
          description: "Registration successful. Please check your email to activate your account.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        router.push('/auth/sign-in');
      } else {
        toast({
          title: "Error",
          description: "Registration failed. Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Connection error. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Flex
      direction='column'
      alignSelf='center'
      justifySelf='center'
      overflow='hidden'>
      <Box
        position='absolute'
        minH={{ base: "70vh", md: "50vh" }}
        maxH={{ base: "70vh", md: "50vh" }}
        w={{ md: "calc(100vw - 50px)" }}
        maxW={{ md: "calc(100vw - 50px)" }}
        left='0'
        right='0'
        bgRepeat='no-repeat'
        overflow='hidden'
        zIndex='-1'
        top='0'
        bgImage={'/assets/img/BgSignUp.png'}
        bgSize='cover'
        mx={{ md: "auto" }}
        mt={{ md: "14px" }}
        borderRadius={{ base: "0px", md: "20px" }}>
       
      </Box>
      <Flex
        direction='column'
        textAlign='center'
        justifyContent='center'
        align='center'
        mt='125px'
        mb='30px'>
        <Text fontSize='4xl' color='white' fontWeight='bold'>
          Welcome!
        </Text>
        <Text
          fontSize='md'
          color='white'
          fontWeight='normal'
          mt='10px'
          mb='26px'
          w={{ base: "90%", sm: "60%", lg: "40%", xl: "333px" }}>
          
        </Text>
      </Flex>
      <Flex alignItems='center' justifyContent='center' mb='60px' mt='20px'>
        <Flex
          direction='column'
          w='445px'
          background='transparent'
          borderRadius='15px'
          p='40px'
          mx={{ base: "100px" }}
          bg={bgForm}
          boxShadow={useColorModeValue(
            "0px 5px 14px rgba(0, 0, 0, 0.05)",
            "unset"
          )}>
          <Text
            fontSize='xl'
            color={textColor}
            fontWeight='bold'
            textAlign='center'
            mb='22px'>
            Register 
          </Text>
         
          
          <FormControl>
            <FormLabel ms='4px' fontSize='sm' fontWeight='normal'>
              Name
            </FormLabel>
            <Input
              variant='auth'
              fontSize='sm'
              ms='4px'
              type='text'
              placeholder='Your full name'
              mb='24px'
              size='lg'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          
            <FormLabel ms='4px' fontSize='sm' fontWeight='normal'>
            User Name
            </FormLabel>
            <Input
              variant='auth'
              fontSize='sm'
              ms='4px'
              type='text'
              placeholder='Your username'
              mb='24px'
              size='lg'
              value={username}
              onChange={(e) => setUserName(e.target.value)}
            />
            <FormLabel ms='4px' fontSize='sm' fontWeight='normal'>
              Email
            </FormLabel>
            <Input
              variant='auth'
              fontSize='sm'
              ms='4px'
              type='email'
              placeholder='Your email address'
              mb='24px'
              size='lg'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <FormLabel ms='4px' fontSize='sm' fontWeight='normal'>
              Password
            </FormLabel>
            <Input
              variant='auth'
              fontSize='sm'
              ms='4px'
              type='password'
              placeholder='Your password'
              mb='24px'
              size='lg'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            
            <Button
              fontSize='16px'
              variant='dark'
              fontWeight='bold'
              w='100%'
              h='45'
              mb='24px'
              color="white"
              bgColor="#24559A"
              onClick={handleSignUp}
              isLoading={isLoading}>
              SIGN UP
            </Button>
          </FormControl>
          <Flex
            flexDirection='column'
            justifyContent='center'
            alignItems='center'
            maxW='100%'
            mt='0px'>
            <Text color={textColor} fontWeight='medium'>
              Already have an account?
              <Link
                color={titleColor}
                as='span'
                ms='5px'
                onClick={handleSignIn}
                fontWeight='bold'
                cursor='pointer'>
                Sign In
              </Link>
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default SignUp;