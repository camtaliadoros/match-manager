import Link from 'next/link';
import classes from './AuthButtons.module.scss';

function AuthButtons() {
  return (
    <div className={classes.wrapper}>
      <Link href="/">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="17.995"
          viewBox="0 0 18 17.995"
          className={classes.closeButton}
        >
          <path
            id="Icon_ionic-ios-close"
            data-name="Icon ionic-ios-close"
            d="M22.418,20.286l6.429-6.429a1.506,1.506,0,0,0-2.13-2.13l-6.429,6.429-6.429-6.429a1.506,1.506,0,1,0-2.13,2.13l6.429,6.429-6.429,6.429a1.506,1.506,0,0,0,2.13,2.13l6.429-6.429,6.429,6.429a1.506,1.506,0,0,0,2.13-2.13Z"
            transform="translate(-11.285 -11.289)"
            fill="#a9bda7"
          />
        </svg>
      </Link>
      <Link href="/">
        <a className={classes.authButton}>Sign In</a>
      </Link>
      <h2>or</h2>
      <Link href="/">
        <a className={classes.authButton}>Sign Up</a>
      </Link>
    </div>
  );
}

export default AuthButtons;