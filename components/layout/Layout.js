import classes from './Layout.module.scss';
import AuthNavigation from './AuthNavigation';
import Header from '../layout/Header';

function Layout(props) {
  return (
    <div className='wrapper'>
      <Header classes={classes} />
      <main className={classes.main}>{props.children}</main>
      <footer className='bottom-nav'>
        <AuthNavigation />
      </footer>
    </div>
  );
}

export default Layout;
