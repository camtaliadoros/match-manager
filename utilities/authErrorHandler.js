import { AuthErrorCodes } from 'firebase/auth';

export const handleAuthError = (error) => {
  switch (error.code) {
    case AuthErrorCodes.EMAIL_EXISTS:
      return 'This email address already has an account.';
    case AuthErrorCodes.INVALID_EMAIL:
      return 'The email address you entered is not valid.';
    case AuthErrorCodes.INVALID_PASSWORD:
      return 'The password you have entered is not valid';
    case AuthErrorCodes.WRONG_PASSWORD:
      return 'Your password is wrong';
    default:
      return 'Something wrong happened. Please try again.';
  }
};
