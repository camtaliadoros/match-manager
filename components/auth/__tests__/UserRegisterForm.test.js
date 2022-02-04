/**
 * @jest-environment jsdom
 */

import { getAuth } from 'firebase/auth';
import { screen, render } from '@testing-library/react';
import UserRegisterForm from '../UserRegisterForm';
jest.mock('firebase/auth', () => {
  return {
    getAuth: jest.fn().mockReturnValue({ currentUser: { uid: 'uid' } }),
  };
});

it('renders', () => {
  const component = render(<UserRegisterForm />);
});
