import { memo, useState } from 'react';
import toast from 'react-hot-toast';

import cn from 'classnames';

import { ReactComponent as Minus } from '@assets/img/minus.svg';
import { ReactComponent as Plus } from '@assets/img/plus.svg';
import { ReactComponent as TrashCan } from '@assets/img/trash-can.svg';
import { LineItem } from '@commercetools/platform-sdk';

import styles from './BasketItem.module.css';

interface BasketItemProps {
  item: LineItem;
  handleUpdateItem: (lineItemId: string, quantity: number) => Promise<void>;
  handleDeleteItem: (lineItemId: string) => Promise<void>;
}

export const BasketItem = memo(function BasketItem({ item, handleUpdateItem, handleDeleteItem }: BasketItemProps) {
  const { id, name, price, quantity, variant, totalPrice } = item;
  const size = variant.attributes?.find((attr) => attr.name === 'size');
  const color = variant.attributes?.find((attr) => attr.name === 'color');
  const [loading, setLoading] = useState(false);

  const changeQuantity = async (quantity: number) => {
    try {
      setLoading(true);
      await handleUpdateItem(id, quantity);
    } catch (error) {
      toast.error('Error with update item');
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async () => {
    try {
      setLoading(true);
      await handleDeleteItem(id);
    } catch (error) {
      toast.error('Error with update item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.basket__table__item}>
      <div className={styles.item__info}>
        <img src={variant.images && variant.images.at(0)?.url} width={90} height={90} alt={name.en} />
        <div className={styles.item__info__text}>
          <p className={styles.item__info__title}>{name.en}</p>
          <div className={styles.attributes}>
            <div className={styles.attributes__color}>
              <span>Color:</span>
              <div
                className={cn(styles.circle, {
                  [styles.multicolored]: color?.value.label.en === 'multicolored',
                  [styles.blue]: color?.value.label.en === 'blue',
                  [styles.black]: color?.value.label.en === 'black',
                  [styles.red]: color?.value.label.en === 'red',
                  [styles.orange]: color?.value.label.en === 'orange',
                  [styles.yellow]: color?.value.label.en === 'yellow',
                  [styles.green]: color?.value.label.en === 'green',
                  [styles.silver]: color?.value.label.en === 'silver',
                  [styles.grey]: color?.value.label.en === 'grey',
                  [styles.white]: color?.value.label.en === 'white',
                })}
                title={color?.value.label.en}
              />
            </div>
            <span>Size: {size && size.value.label.en}</span>
          </div>
        </div>
      </div>
      <div className={styles.item__info__inner__wrapper}>
        <div className={styles.prices}>
          {price.discounted && <span className={styles.price}>{price.discounted.value.centAmount / 100}$</span>}
          <span className={cn(styles.price, { [styles.price__discounted]: !!price.discounted })}>
            {price.value.centAmount / 100}$
          </span>
        </div>
        <div className={styles.quantity}>
          <button
            type='button'
            className={styles.button__control}
            disabled={loading}
            onClick={() => changeQuantity(quantity - 1)}
          >
            <Minus />
          </button>
          <span className={styles.monitor}>{quantity}</span>
          <button
            type='button'
            className={styles.button__control}
            disabled={loading}
            onClick={() => changeQuantity(quantity + 1)}
          >
            <Plus />
          </button>
        </div>
        <span className={styles.amount}>{totalPrice.centAmount / 100}$</span>
        <button className={styles.remove} disabled={loading} onClick={deleteItem}>
          <TrashCan />
        </button>
      </div>
    </div>
  );
});
