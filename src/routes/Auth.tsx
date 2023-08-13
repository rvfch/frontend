import React from 'react';
import LoginForm from '../components/LoginForm';
import SignupForm from '../components/SignupForm';

interface Props {
  signup?: boolean;
}

const Auth: React.FC<Props> = ({ signup = false }) => {
  return <div className='mx-auto pt-8'>{signup ? <SignupForm /> : <LoginForm />}</div>;
};

export default Auth;
