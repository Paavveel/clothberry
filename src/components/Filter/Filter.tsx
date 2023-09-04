import React, { FC, useCallback, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Select, { SingleValue, StylesConfig } from 'react-select';

import chroma from 'chroma-js';
import classNames from 'classnames';

import styles from './Filter.module.css';
import { ColorOption, Option, colorOptions, optionsBrand, optionsPrice, optionsSize, sortBy } from './data';

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
  handleFilterBrand: (option: Option | null) => void;
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Filter: FC<FilterProps> = ({
  handleSort,
  handleFilterColor,
  handleSearch,
  handleFilterSize,
  handleFilterPrice,
  handleFilterBrand,
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
        <div className={styles.row}>
          <Select
            isSearchable={false}
            className={`${styles.sort} ${styles.select}`}
            options={sortBy}
            placeholder='sort'
            isClearable
            onChange={(e) => handleSort(e)}
          />
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
            className={styles.select}
            placeholder='by price'
            options={optionsPrice}
            isClearable
            onChange={(e) => handleFilterPrice(e)}
          />
          <Select
            isSearchable={false}
            placeholder='by brand'
            isClearable
            className={styles.select}
            options={optionsBrand}
            onChange={(e) => handleFilterBrand(e)}
          />
        </div>

        <div className={styles['search-wrapper']}>
          <input
            className={styles['search-input']}
            type='text'
            placeholder='Search'
            ref={setFocus}
            onChange={handleSearch}
            defaultValue={search.get('q') || ''}
          />
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='20'
            height='20'
            fill='none'
            stroke='currentColor'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            className={`${styles.feather} ${'feather-search'}`}
            viewBox='0 0 24 24'
          >
            <defs />
            <circle cx='11' cy='11' r='8' />
            <path d='M21 21l-4.35-4.35' />
          </svg>
        </div>
      </div>
    </div>
  );
};
