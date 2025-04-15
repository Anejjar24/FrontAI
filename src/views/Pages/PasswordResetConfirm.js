import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Flex,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
  useColorModeValue,
  useToast,
  FormErrorMessage,
} from "@chakra-ui/react";

function PasswordResetConfirm() {
  const router = useRouter();
  const toast = useToast();
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uid, setUid] = useState("");
  const [token, setToken] = useState("");
  const [formErrors, setFormErrors] = useState({});

  const textColor = useColorModeValue("gray.700", "white");
  const bgForm = useColorModeValue("white", "navy.800");

  // Parse URL params on component mount
  useEffect(() => {
    // In a real implementation, you would extract these from the URL
    // Using Next.js router.query, but for this example we'll use window.location
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const uidParam = urlParams.get('uid');
      const tokenParam = urlParams.get('token');
      
      if (uidParam) setUid(uidParam);
      if (tokenParam) setToken(tokenParam);
    }
  }, []);

  const validateForm = () => {
    const errors = {};
    if (!password1) errors.password1 = "New password is required";
    if (!password2) errors.password2 = "Confirm password is required";
    if (password1 !== password2) errors.password2 = "Passwords don't match";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordReset = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/authentication/api/password-reset-confirm/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          uid,
          token,
          new_password1: password1,
          new_password2: password2 
        }),
      });
  
      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: "Success",
          description: data.message || "Password changed successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        // Redirect to login page after successful reset
        setTimeout(() => {
          router.push("/auth/sign-in");
        }, 3000);
      } else {
        // Handle validation errors from backend
        if (data.errors) {
          setFormErrors(data.errors);
        }
        
        toast({
          title: "Error",
          description: data.message || "Failed to reset password",
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
              Set New Password
            </Text>
            <FormControl isInvalid={formErrors.password1}>
              <FormLabel fontSize="sm" fontWeight="normal">
                New password
              </FormLabel>
              <Input
                variant="auth"
                fontSize="sm"
                type="password"
                placeholder="New password"
                mb={formErrors.password1 ? "2px" : "24px"}
                size="lg"
                value={password1}
                onChange={(e) => setPassword1(e.target.value)}
              />
              {formErrors.password1 && (
                <FormErrorMessage mb="12px">{formErrors.password1}</FormErrorMessage>
              )}
            </FormControl>
            
            <FormControl isInvalid={formErrors.password2}>
              <FormLabel fontSize="sm" fontWeight="normal">
                New password confirmation
              </FormLabel>
              <Input
                variant="auth"
                fontSize="sm"
                type="password"
                placeholder="Retype new password"
                mb={formErrors.password2 ? "2px" : "24px"}
                size="lg"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
              />
              {formErrors.password2 && (
                <FormErrorMessage mb="12px">{formErrors.password2}</FormErrorMessage>
              )}
            </FormControl>
            
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
              isDisabled={!uid || !token}
            >
              Change My Password
            </Button>
            
            {(!uid || !token) && (
              <Text color="red.500" fontSize="sm" textAlign="center">
                Invalid password reset link. Please request a new link.
              </Text>
            )}
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

export default PasswordResetConfirm;