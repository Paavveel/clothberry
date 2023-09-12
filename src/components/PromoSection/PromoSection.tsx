import { memo, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import cn from 'classnames';

import { Button } from '..';
import styles from './PromoSection.module.css';

interface PromoSectionProps {
  handlePromo: (code: string) => Promise<void>;
  className: string;
}

type PromoType = { code: string };

export const PromoSection = memo(function PromoSection({ handlePromo, className, ...props }: PromoSectionProps) {
  const [loading, setLoading] = useState(false);
  const { handleSubmit, register, reset } = useForm<PromoType>({ mode: 'onChange' });

  const handleOnSubmit = async ({ code }: PromoType) => {
    if (!code.length) {
      toast.error('Please, type a promo code');
      return;
    }
    try {
      setLoading(true);
      await handlePromo(code);
      toast.success('Promo code is activated');
      reset();
    } catch (error) {
      toast.error('Invalid promo code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={cn(className, styles.promo__form)} onSubmit={handleSubmit(handleOnSubmit)} {...props}>
      <input
        {...register('code', { maxLength: 15, minLength: 1 })}
        type='text'
        className={styles.basket__order__promo__input}
        placeholder='Promo code'
      />
      <Button type='submit' className={styles.apply__promo__button} secondary disabled={loading}>
        Apply code
      </Button>
    </form>
  );
});
