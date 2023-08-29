export type ColourOption = {
  readonly value: string;
  readonly label: string;
  readonly color: string;
  readonly isFixed?: boolean;
  readonly isDisabled?: boolean;
};

export const colourOptions: readonly ColourOption[] = [
  { value: 'blue', label: 'Blue', color: '#0052CC' },
  { value: 'black', label: 'Black', color: '#000' },
  { value: 'multicolored', label: 'Multicolored', color: '#ff00e1' },
  { value: 'red', label: 'Red', color: '#FF5630' },
  { value: 'orange', label: 'Orange', color: '#FF8B00' },
  { value: 'yellow', label: 'Yellow', color: '#FFC400' },
  { value: 'green', label: 'Green', color: '#36B37E' },
  { value: 'silver', label: 'Silver', color: '#666666' },
  { value: 'grey', label: 'Grey', color: '#898282' },
  { value: 'white', label: 'White', color: '#b5afaf' },
];

export type Option = {
  value: string;
  label: string;
};

export const optionsSize: Option[] = [
  { value: 'S', label: 'S' },
  { value: 'M', label: 'M' },
  { value: 'L', label: 'L' },
  { value: 'XL', label: 'XL' },
];

export const sortBy: Option[] = [
  { value: 'price asc', label: 'Price: Low to High' },
  { value: 'price desc', label: 'Price: High to Low' },
  { value: 'name.en asc', label: 'Name: A-Z' },
  { value: 'name.en desc', label: 'Name: Z-A' },
];