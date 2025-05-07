// Chakra imports
import { Box, Flex, Stack } from '@chakra-ui/react';
//   Custom components
import Brand from '@/components/sidebar/components/Brand';
import Links from '@/components/sidebar/components/Links';
// eslint-disable-next-line
import SidebarCard from '@/components/sidebar/components/SidebarCard';
import ConversationList from '@/components/sidebar/components/ConversationList';

// FUNCTIONS

function SidebarContent(props: { routes: any[]; [x: string]: any }) {
  const { routes, setApiKey } = props;
  // SIDEBAR
  return (
    <Flex direction="column" height="100%" pt="25px" px="16px">
      <Brand />
      <Stack direction="column" mt="8px" mb="auto">
        <Box ps="20px" pe={{ lg: '16px', '2xl': '16px' }}>
          <Links routes={routes} />
        </Box>
      </Stack>

      <Box px="20px" mb="10px" mt="10px">
        <ConversationList />
      </Box>

      <Box ps="20px" pe={{ lg: '16px', '2xl': '16px' }} mt="60px" mb="40px">
        <SidebarCard />
      </Box>
    </Flex>
  );
}

export default SidebarContent;