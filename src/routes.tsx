import { Icon } from './lib/chakra';
import {
  MdFileCopy,
  MdHome,
  MdLock,
  MdLayers,
  MdAutoAwesome,
  MdOutlineManageAccounts,
} from 'react-icons/md';
import { IoMdPerson } from 'react-icons/io';
import { LuHistory } from 'react-icons/lu';
import { RoundedChart } from '@/components/icons/Icons';

// Auth Imports
import { IRoute } from './types/navigation';

const routes: IRoute[] = [
  {
    name: 'Chat UI',
    path: '/',
    icon: (
      <Icon as={MdAutoAwesome} width="20px" height="20px" color="inherit" />
    ),
    collapse: false,
  },
 
];

export const authRoutes: IRoute[] = [
  {
    name: 'Sign In',
    path: '/auth/sign-in',
    invisible: true,
  },
  {
    name: 'Sign Up',
    path: '/auth/register',
    invisible: true,
  },
  {
    name: 'Forgot Password',
    path: '/auth/forgot-password',
    invisible: true,
  },

  {
    name: 'Password Reset Confirm',
    path: '/auth/password-reset-confirm',
    invisible: true,
  },

];

export default routes;
