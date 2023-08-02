import { render } from '@testing-library/react';

import App from './App';

test('renders Hello to the Clothberry', () => {
  const { getByText } = render(<App />);

  expect(getByText(/Hello to the Clothberry/i)).toBeInTheDocument();
});
