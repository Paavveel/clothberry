import React, { FC, useCallback, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Select, { SingleValue, StylesConfig } from 'react-select';

import chroma from 'chroma-js';
import classNames from 'classnames';

import styles from './Filter.module.css';
import { ColorOption, Option, colorOptions, optionsPrice, optionsSize, sortBy } from './data';

const dot = (color = 'transparent') => ({
  alignItems: 'center',
  display: 'flex',

  ':before': {
    backgroundColor: color,
    borderRadius: 10,
    content: '" "',
    display: 'block',
    marginRight: 8,
    height: 10,
    width: 10,
  },
});

const colourStyles: StylesConfig<ColorOption> = {
  control: (styles) => ({ ...styles, backgroundColor: 'white' }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    const color = chroma(data.color);
    return {
      ...styles,
      backgroundColor: isDisabled
        ? undefined
        : isSelected
        ? data.color
        : isFocused
        ? color.alpha(0.1).css()
        : undefined,
      color: isDisabled ? '#ccc' : isSelected ? (chroma.contrast(color, 'white') > 2 ? 'white' : 'black') : data.color,
      cursor: isDisabled ? 'not-allowed' : 'default',

      ':active': {
        ...styles[':active'],
        backgroundColor: !isDisabled ? (isSelected ? data.color : color.alpha(0.3).css()) : undefined,
      },
    };
  },
  input: (styles) => ({ ...styles, ...dot() }),
  placeholder: (styles) => ({ ...styles, ...dot('#ccc') }),
  singleValue: (styles, { data }) => ({ ...styles, ...dot(data.color) }),
};

interface FilterProps {
  handleSort: (option: Option | null) => void;
  handleFilterSize: (option: Option | null) => void;
  handleFilterColor: (option: ColorOption | null) => void;
  handleFilterPrice: (option: Option | null) => void;
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Filter: FC<FilterProps> = ({
  handleSort,
  handleFilterColor,
  handleSearch,
  handleFilterSize,
  handleFilterPrice,
}) => {
  const [show, setShow] = useState(false);
  const [search] = useSearchParams();
  const setFocus = useCallback(
    (element: HTMLInputElement) => {
      if (element && search.get('q')) {
        element.focus();
      }
    },
    [search]
  );
  return (
    <div className={styles.container}>
      <button
        onClick={() => setShow((prev) => !prev)}
        className={classNames(styles.filter__button, {
          [styles.active]: show,
        })}
      >
        <img src='/filter.svg' width={30} height={30} alt='' />
      </button>
      <div
        className={classNames(styles.filter__wrapper, {
          [styles.active]: show,
        })}
      >
        <div className={styles.left}>
          <Select
            isSearchable={false}
            className={`${styles.sort} ${styles.select}`}
            options={sortBy}
            placeholder='sort'
            isClearable
            onChange={(e) => handleSort(e)}
          />
        </div>
        <div className={styles.right}>
          <Select
            isSearchable={false}
            className={`${styles.color} ${styles.select}`}
            placeholder='by color'
            options={colorOptions}
            styles={colourStyles}
            isClearable
            onChange={(e) => handleFilterColor(e as SingleValue<ColorOption>)}
          />
          <Select
            isSearchable={false}
            className={`${styles.sizes} ${styles.select}`}
            options={optionsSize}
            placeholder='by size'
            isClearable
            onChange={(e) => handleFilterSize(e)}
          />
          <Select
            isSearchable={false}
            className={`${styles.sort} ${styles.sizes}`}
            placeholder='by price'
            options={optionsPrice}
            isClearable
            onChange={(e) => handleFilterPrice(e)}
          />
        </div>
        <div className={styles['search-wrapper']}>
          <input
            ref={setFocus}
            type='search'
            className={styles.search}
            placeholder='search'
            onChange={handleSearch}
            defaultValue={search.get('q') || ''}
          />
        </div>
      </div>
    </div>
  );
};
