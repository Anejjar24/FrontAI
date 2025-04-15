import React from "react";
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
} from "@chakra-ui/react";
import { FaApple, FaFacebook, FaGoogle } from "react-icons/fa";

function SignIn() {
  const router = useRouter();

  const textColor = useColorModeValue("gray.700", "white");
  const bgForm = useColorModeValue("white", "navy.800");
  const titleColor = useColorModeValue("gray.700", "blue.500");
  const colorIcons = useColorModeValue("gray.700", "white");
  const bgIcons = useColorModeValue("transparent", "navy.700");
  const bgIconsHover = useColorModeValue("gray.50", "whiteAlpha.100");

  const handleSignUp = () => {
    router.push("/auth/register");
  };

  const handleSignIn = () => {
    router.push("/");
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

            <HStack spacing="15px" justify="center" mb="22px">
              {[FaFacebook, FaApple, FaGoogle].map((IconItem, i) => (
                <Flex
                  key={i}
                  justify="center"
                  align="center"
                  w="75px"
                  h="75px"
                  borderRadius="8px"
                  border={useColorModeValue("1px solid", "0px")}
                  borderColor="gray.200"
                  cursor="pointer"
                  transition="all .25s ease"
                  bg={bgIcons}
                  _hover={{ bg: bgIconsHover }}
                >
                  <Link href="#">
                    <Icon
                      as={IconItem}
                      color={colorIcons}
                      w="30px"
                      h="30px"
                      _hover={{ filter: "brightness(120%)" }}
                    />
                  </Link>
                </Flex>
              ))}
            </HStack>

            <Text
              fontSize="lg"
              color="gray.400"
              fontWeight="bold"
              textAlign="center"
              mb="22px"
            >
              or
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
              />
              <FormLabel fontSize="sm" fontWeight="normal">
                Password
              </FormLabel>
              <Input
                variant="auth"
                fontSize="sm"
                type="password"
                placeholder="Your password"
                mb="24px"
                size="lg"
              />
              <FormControl display="flex" alignItems="center" mb="24px">
                <Switch id="remember-login" colorScheme="blue" me="10px" />
                <FormLabel
                  htmlFor="remember-login"
                  mb="0"
                  fontWeight="normal"
                >
                  Remember me
                </FormLabel>
              </FormControl>
              <Button
                fontSize="10px"
                variant="dark"
                fontWeight="bold"
                w="100%"
                h="45"
                mb="24px"
                onClick={handleSignIn}
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
