import { AuthErrorCodes } from 'firebase/auth';
export const handleAuthError = (error) => {
  switch (error.code) {
    case AuthErrorCodes.EMAIL_EXISTS:
      return 'This email address already has an account.';
    case AuthErrorCodes.INVALID_EMAIL:
      return 'The email address you entered is not valid.';
    case AuthErrorCodes.INVALID_PASSWORD:
      return 'The password is wrong, please try again.';
    case AuthErrorCodes.WRONG_PASSWORD:
      return 'Your password is wrong';
    case AuthErrorCodes.CREDENTIAL_ALREADY_IN_USE:
      return 'This email address is already in use.';
    case AuthErrorCodes.USER_DELETED:
      return 'User not found';
    case AuthErrorCodes.TOO_MANY_ATTEMPTS_TRY_LATER:
      return 'Too many attempts, try later.';

    default:
      return 'Something wrong happened. Please try again.';
  }
};
