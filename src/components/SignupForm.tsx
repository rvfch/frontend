import { FC, useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import FormInput from './core/FormInput';
import TLink from './core/TenantLink';
import { useAppDispatch, useAppSelector } from '../store';
import { signup } from '../api/auth.api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import BeatLoader from 'react-spinners/BeatLoader';
import { ISignupRequest } from '../api/interface/signup-request.interface';
import { useTenant } from '../hooks/UseTenant.hook';
import { Button } from 'flowbite-react';

const FormSchema = z
  .object({
    email: z.string().email().min(5),
    password1: z.string().min(6),
    password2: z.string().min(6),
    name: z.string().min(5),
  })
  .required();

type FormInputType = z.infer<typeof FormSchema>;

const SignupForm: FC = () => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const { tenantId } = useTenant();

  const methods = useForm<FormInputType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
      password1: '',
      password2: '',
    },
  });

  const [signupAttempted, setSignupAttempted] = useState(false);

  useEffect(() => {
    if (signupAttempted && !isLoading && !error) {
      toast.success('You successfully signed up.');
      methods.reset();
      navigate(`/${tenantId}/login`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signupAttempted, error, isLoading]);

  const onSubmit = (dtoIn: ISignupRequest) => {
    setSignupAttempted(true);
    dispatch(signup(dtoIn));
  };

  if (isLoading) return <BeatLoader className='h-screen flex items-center justify-center' />;

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className='bg-white shadow-xl rounded-lg px-8 pt-6 pb-8 w-96'
      >
        <FormInput name='email' label='Email' type='email' placeholder='Email' />
        <FormInput name='name' label='Name' type='text' placeholder='Name' />
        <FormInput name='password1' label='Password' type='password' placeholder='********' />
        <FormInput
          name='password2'
          label='Repeat password'
          type='password'
          placeholder='********'
        />
        <div className='flex items-center justify-between'>
          <TLink to='login' className='text-blue-500'>
            Back to login
          </TLink>
          <Button type='submit'>Sign Up</Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default SignupForm;
