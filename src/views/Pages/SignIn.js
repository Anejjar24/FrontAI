import React, { useState } from "react";
import { useRouter } from "next/navigation";
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
  useToast,
} from "@chakra-ui/react";
import { FaApple, FaFacebook, FaGoogle } from "react-icons/fa";
import { useAuth } from "@/contexts/AuthContext";

function SignIn() {
  const router = useRouter();
  const toast = useToast();
  const { login } = useAuth();
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const textColor = useColorModeValue("gray.700", "white");
  const bgForm = useColorModeValue("white", "navy.800");
  const titleColor = useColorModeValue("gray.700", "blue.500");
  const colorIcons = useColorModeValue("gray.700", "white");
  const bgIcons = useColorModeValue("transparent", "navy.700");
  const bgIconsHover = useColorModeValue("gray.50", "whiteAlpha.100");

  const handleSignUp = () => {
    router.push("/auth/register");
  };
  const handlePasswordReset = () => {
    router.push("/auth/forgot-password");
  };
  
  const handleSignIn = async () => {
    if (!username || !password) {
      toast({
        title: "Error",
        description: "Please enter both username and password",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const success = await login(username, password);
      
      if (success) {
        toast({
          title: "Success",
          description: "Login successful",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        router.push("/");
      } else {
        toast({
          title: "Error",
          description: "Invalid credentials",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Connection error. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex position="relative" overflow="hidden" minH="100vh" h="100vh">
      <Flex
        h="100vh"
        w="100%"
        maxW="1044px"
        mx="auto"
        justifyContent="space-between"
      >
        <Flex
          w="100%"
          h="100%"
          alignItems="center"
          justifyContent="center"
        >
          <Flex
            zIndex="2"
            direction="column"
            w="445px"
            borderRadius="15px"
            p="40px"
            m="auto"
            bg={bgForm}
            boxShadow={useColorModeValue(
              "0px 5px 14px rgba(0, 0, 0, 0.05)",
              "unset"
            )}
          >
            <Text
              fontSize="xl"
              color={textColor}
              fontWeight="bold"
              textAlign="center"
              mb="22px"
            >
              Sign In
            </Text>

            <FormControl>
              <FormLabel fontSize="md" fontWeight="normal">
              User Name
              </FormLabel>
              <Input
                variant="auth"
                fontSize="sm"
                type="text"
                placeholder="Your User Name"
                mb="24px"
                size="lg"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
              />
              <FormLabel fontSize="md" fontWeight="normal">
                Password
              </FormLabel>
              <Input
                variant="auth"
                fontSize="sm"
                type="password"
                placeholder="Your password"
                mb="24px"
                size="lg"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <FormControl display="flex" alignItems="center" mb="24px">
              <Text color={textColor} fontWeight="normal"  fontSize="sm">
              Forgot Password? 
                <Link
                  color={titleColor}
                  as="span"
                  ms="5px"
                   fontSize="sm"
                  onClick={handlePasswordReset}
                  fontWeight="bold"
                  cursor="pointer"
                >
                  password_reset
                </Link>
              </Text>
              </FormControl>
              <Button
                fontSize="16px"
                variant="dark"
                fontWeight="bold"
                w="100%"
                h="45"
                mb="24px"
                color="white"
              bgColor="#24559A"
                onClick={handleSignIn}
                isLoading={isLoading}
              >
                SIGN IN
              </Button>
            </FormControl>

            <Flex justifyContent="center" alignItems="center">
              <Text color={textColor} fontWeight="medium">
                Don't have an account?
                <Link
                  color={titleColor}
                  as="span"
                  ms="5px"
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

        <Box
          overflowX="hidden"
          h="100%"
          w="100%"
          bgSize="cover"
          left="0px"
          bgRepeat="no-repeat"
          position="absolute"
          bgImage={"/assets/img/signInImage.png"}
        />
      </Flex>
    </Flex>
  );
}

export default SignIn;
