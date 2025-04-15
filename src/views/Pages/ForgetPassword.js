import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Flex,
  Button,
  FormControl,
  FormLabel,
  Input,
  Link,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";

function ForgotPassword() {
  const router = useRouter();
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const textColor = useColorModeValue("gray.700", "white");
  const bgForm = useColorModeValue("white", "navy.800");
  const titleColor = useColorModeValue("gray.700", "blue.500");

  const handleSignUp = () => {
    router.push("/auth/register");
  };
  
  const handlePasswordReset = async () => {
    if (!email) {
      toast({
        title: "Error",
        description: "Email is required",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/authentication/api/password-reset/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
  
      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: "Success",
          description: data.message || "Password reset email has been sent. Please check your inbox.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to process password reset request",
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
              Password Reset
            </Text>

            <FormControl>
              <FormLabel fontSize="sm" fontWeight="normal">
                Email
              </FormLabel>
              <Input
                variant="auth"
                fontSize="sm"
                type="email"
                placeholder="Your email address"
                mb="24px"
                size="lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              
              <Button
                fontSize="18px"
                variant="dark"
                fontWeight="bold"
                w="100%"
                h="45"
                color="white"
                mb="24px"
                onClick={handlePasswordReset}
                isLoading={isLoading}
                bgColor="#1C66A4"
              >
                Send Reset Link
              </Button>
            </FormControl>

            <Flex justifyContent="center" alignItems="center">
              <Text color={textColor} fontWeight="medium">
                Back to login?
                <Link
                  color={titleColor}
                  as="span"
                  ms="5px"
                  onClick={() => router.push("/auth/sign-in")}
                  fontWeight="bold"
                  cursor="pointer"
                >
                  Click Here
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

export default ForgotPassword;