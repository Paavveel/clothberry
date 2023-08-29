/* eslint-disable import/no-extraneous-dependencies */

/* eslint-disable no-nested-ternary */
import { FC, useState } from 'react';
import Select, { SingleValue, StylesConfig } from 'react-select';

import chroma from 'chroma-js';
import classNames from 'classnames';

import styles from './Filter.module.css';
import { ColourOption, Option, colourOptions, optionsSize, sortBy } from './data';

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

const colourStyles: StylesConfig<ColourOption> = {
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
  handleFilterColor: (option: ColourOption | null) => void;
}

export const Filter: FC<FilterProps> = ({ handleSort, handleFilterColor }) => {
  const [show, setShow] = useState(false);
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
            options={colourOptions}
            styles={colourStyles}
            isClearable
            onChange={(e) => handleFilterColor(e as SingleValue<ColourOption>)}
          />
          <Select
            isSearchable={false}
            className={`${styles.sizes} ${styles.select}`}
            options={optionsSize}
            placeholder='by size'
            isClearable
          />
        </div>
      </div>
    </div>
  );
};
