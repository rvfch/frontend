import React from 'react';
import TLink from '../components/core/TenantLink';
import { useAppSelector } from '../store';
import { NotAuthenticatedContent } from './Header/NotAuthenticatedContent';
import { AuthenticatedContent } from './Header/AuthenticatedContent';

const Header: React.FC = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return (
    <header className='w-full bg-gray-200 p-4'>
      <div className='container mx-auto flex justify-between items-center'>
        <nav className='flex items-center'>
          <img className='w-8 h-8 mr-4' src='https://via.placeholder.com/150' alt='Logo' />
          <ul className='flex'>
            <li className='mx-2'>
              <TLink to=''>Recent articles</TLink>
            </li>
            <li className='mx-2'>
              <TLink to='about'>About</TLink>
            </li>
          </ul>
        </nav>
        <div>{!isAuthenticated ? <NotAuthenticatedContent /> : <AuthenticatedContent />}</div>
      </div>
    </header>
  );
};

export default Header;
