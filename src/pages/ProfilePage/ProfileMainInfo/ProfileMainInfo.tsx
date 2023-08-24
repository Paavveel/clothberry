import { FC } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import cn from 'classnames';

import { Button } from '@components/Button';
import { Input } from '@components/Input';
import { emailValidator } from '@helpers/Validators';

import styles from './ProfileMainInfo.module.css';

interface ProfileMainInfoProps {
  className?: string;
}

export interface FormProfileMain extends Record<string, unknown> {
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
}

export const ProfileMainInfo: FC<ProfileMainInfoProps> = ({ className, ...props }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormProfileMain>({
    mode: 'onChange',
  });

  const submit: SubmitHandler<FormProfileMain> = async (data) => {
    console.log(data);
  };

  return (
    <form className={cn(className, styles['main-info'])} onSubmit={handleSubmit(submit)} noValidate {...props}>
      <h3 className={styles['main-info__title']}>Personal information</h3>
      <Input<FormProfileMain>
        type='text'
        placeholder='Email *'
        label='email'
        register={register}
        error={errors.email}
        inputMode='email'
        options={{
          required: '⚠ Email is required field!',
          validate: (value: string) => emailValidator(value, 'Please enter valid email!'),
        }}
      />
      <Button className={styles['main-info__button']} type='submit' secondary>
        Submit
      </Button>
    </form>
  );
};

ProfileMainInfo.defaultProps = {
  className: '',
};
