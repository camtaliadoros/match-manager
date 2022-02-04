/**
 * @jest-environment jsdom
 */

import { getAuth } from 'firebase/auth';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import UserRegisterForm from '../UserRegisterForm';
import '@testing-library/jest-dom';

jest.mock('firebase/auth', () => {
  return {
    getAuth: jest.fn().mockReturnValue({ currentUser: { uid: 'uid' } }),
  };
});

describe('User Register Form', () => {
  beforeEach(() => {
    const component = render(<UserRegisterForm />);
  });
  it('renders', () => {
    const form = screen.getByRole('form');
    expect(form).toBeInTheDocument();
  });

  it('triggers a warning if passwords do not match', () => {
    const passwordInput = screen.getByLabelText('password');
    userEvent.type(passwordInput, 'password');

    const passValInput = screen.getByLabelText('password-validation');
    userEvent.type(passValInput, 'password2');

    const passWarning = screen.getByText('Your password does not match');
    expect(passWarning).toBeInTheDocument();
  });

  it('disables submit button is passwords do not match', () => {
    const passwordInput = screen.getByLabelText('password');
    userEvent.type(passwordInput, 'password');

    const passValInput = screen.getByLabelText('password-validation');
    userEvent.type(passValInput, 'password2');

    const submit = screen.getByRole('button');
    expect(submit).toBeDisabled();
  });
});
