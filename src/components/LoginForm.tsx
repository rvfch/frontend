import { FC, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import FormInput from './core/FormInput';
import TLink from './core/TenantLink';
import { useAppDispatch, useAppSelector } from '../store';
import { login } from '../api/auth.api';
import { ILoginRequest } from '../api/interface/login-request.interface';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import BeatLoader from 'react-spinners/BeatLoader';
import styled from 'styled-components';
import { useTenant } from '../hooks/UseTenant.hook';
import { Button } from 'flowbite-react';

const FormSchema = z
  .object({
    email: z.string().email().min(5),
    password1: z.string(),
  })
  .required();

type FormInputType = z.infer<typeof FormSchema>;

const Spinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  animation: fadeIn 0.3s;
  color: rgb(59, 130, 296);

  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`;

const LoginForm: FC = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const { tenantId } = useTenant();

  useEffect(() => {
    if (isAuthenticated) {
      toast.success('You successfully logged in.');
      navigate(`/${tenantId}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const onSubmit = (dtoIn: ILoginRequest) => {
    dispatch(login(dtoIn));
  };

  const methods = useForm<FormInputType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
      password1: '',
    },
  });

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className='bg-white shadow-xl rounded-lg px-8 pt-6 pb-8 w-96'
      >
        {isLoading ? (
          <Spinner>
            <BeatLoader />
          </Spinner>
        ) : (
          <>
            <FormInput name='email' label='Email' type='text' placeholder='Email' />
            <FormInput name='password1' label='Password' type='password' placeholder='********' />
            <div className='flex items-center justify-between'>
              <TLink to='signup' className='text-blue-500'>
                Create new account
              </TLink>
              <Button type='submit'>Log In</Button>
            </div>
          </>
        )}
      </form>
    </FormProvider>
  );
};

export default LoginForm;
