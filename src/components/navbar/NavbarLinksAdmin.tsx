'use client';
// Chakra Imports
import {
  Box,
  Button,
  Center,
  Flex,
  Icon,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import { SearchBar } from '@/components/navbar/searchBar/SearchBar';
import { SidebarResponsive } from '@/components/sidebar/Sidebar';
import { IoMdMoon, IoMdSunny } from 'react-icons/io';
import { MdInfoOutline } from 'react-icons/md';
import APIModal from '@/components/apiModal';
import NavLink from '../link/NavLink';
import routes from '@/routes';
import { useAuth } from "@/contexts/AuthContext";

export default function HeaderLinks(props: {
  secondary: boolean;
  setApiKey: any;
}) {
  const { secondary, setApiKey } = props;
  const { colorMode, toggleColorMode } = useColorMode();
  const { user, logout } = useAuth(); // Utilisation du hook useAuth pour accéder à l'utilisateur et à la fonction de déconnexion
  
  // Chakra Color Mode
  const navbarIcon = useColorModeValue('gray.500', 'white');
  let menuBg = useColorModeValue('white', 'navy.800');
  const textColor = useColorModeValue('navy.700', 'white');
  const borderColor = useColorModeValue('#E6ECFA', 'rgba(135, 140, 189, 0.3)');
  const shadow = useColorModeValue(
    '14px 17px 40px 4px rgba(112, 144, 176, 0.18)',
    '0px 41px 75px #081132',
  );
  const buttonBg = useColorModeValue('transparent', 'navy.800');
  const hoverButton = useColorModeValue(
    { bg: 'gray.100' },
    { bg: 'whiteAlpha.100' },
  );
  const activeButton = useColorModeValue(
    { bg: 'gray.200' },
    { bg: 'whiteAlpha.200' },
  );

  // Obtenir les initiales de l'utilisateur
  const getInitials = () => {
    if (user && user.first_name) {
      return user.first_name.charAt(0) + (user.last_name ? user.last_name.charAt(0) : '');
    }
    return 'AP'; // Valeur par défaut
  };

  // Obtenir le nom complet de l'utilisateur
  const getFullName = () => {
    if (user) {
      return `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username;
    }
    return 'Adela'; // Valeur par défaut
  };

  return (
    <Flex
      zIndex="100"
      w={{ sm: '100%', md: 'auto' }}
      alignItems="center"
      flexDirection="row"
      bg={menuBg}
      flexWrap={secondary ? { base: 'wrap', md: 'nowrap' } : 'unset'}
      p="10px"
      borderRadius="30px"
      boxShadow={shadow}
    >
      <SearchBar
        mb={() => {
          if (secondary) {
            return { base: '10px', md: 'unset' };
          }
          return 'unset';
        }}
        me="10px"
        borderRadius="30px"
      />
      <SidebarResponsive routes={routes} />

      <Button
        variant="no-hover"
        bg="transparent"
        p="0px"
        minW="unset"
        minH="unset"
        h="18px"
        w="max-content"
        onClick={toggleColorMode}
      >
        <Icon
          me="10px"
          h="18px"
          w="18px"
          color={navbarIcon}
          as={colorMode === 'light' ? IoMdMoon : IoMdSunny}
        />
      </Button>

      {/*  Account modification here */}
      <Menu>
        <MenuButton p="0px" style={{ position: 'relative' }}>
          <Box
            _hover={{ cursor: 'pointer' }}
            color="white"
            bg="#11047A"
            w="40px"
            h="40px"
            borderRadius={'50%'}
          />
          <Center top={0} left={0} position={'absolute'} w={'100%'} h={'100%'}>
            <Text fontSize={'xs'} fontWeight="bold" color={'white'}>
              {getInitials()}
            </Text>
          </Center>
        </MenuButton>
        <MenuList
          boxShadow={shadow}
          p="0px"
          mt="10px"
          borderRadius="20px"
          bg={menuBg}
          border="none"
        >
          <Flex w="100%" mb="0px">
            <Text
              ps="20px"
              pt="16px"
              pb="10px"
              w="100%"
              borderBottom="1px solid"
              borderColor={borderColor}
              fontSize="sm"
              fontWeight="700"
              color={textColor}
            >
              👋&nbsp; Hey, {getFullName()}
            </Text>
          </Flex>
          <Flex flexDirection="column" p="10px">
            <NavLink href="/settings">
              <MenuItem
                _hover={{ bg: 'none' }}
                _focus={{ bg: 'none' }}
                color={textColor}
                borderRadius="8px"
                px="14px"
              >
                <Text fontWeight="500" fontSize="sm">
                  Profile Settings
                </Text>
              </MenuItem>
            </NavLink>
            
            <MenuItem
              _hover={{ bg: 'none' }}
              _focus={{ bg: 'none' }}
              color="red.400"
              borderRadius="8px"
              px="14px"
              onClick={logout}
            >
              <Text fontWeight="500" fontSize="sm">
                Log out
              </Text>
            </MenuItem>
          </Flex>
        </MenuList>
      </Menu>
    </Flex>
  );
}