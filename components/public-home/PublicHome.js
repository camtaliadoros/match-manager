import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
import classes from './PublicHome.module.scss';
import AuthNavigation from '../layout/AuthNavigation';
import Header from '../layout/Header';

export default function PublicHome() {
  return (
    <div className='outter-wrapper'>
      <Header classes={classes} />
      <main className={classes.main}>
        <div className={classes.heroScreen}>
          <div className={`${classes.onboardingText} light-text`}>
            <h1>Match Manager</h1>
            <h4>Take control of your games.</h4>
            <button className='mobile-hidden'>
              <Link href='/login'>SIGN UP NOW</Link>
            </button>
          </div>
        </div>
        <div className={classes.features}>
          <div className={classes.featureImage}>
            <Image
              src='/app-feature-1.png'
              alt='App Feature Example'
              width='528'
              height='610'
              layout='intrinsic'
            />
          </div>
          <div className={classes.featuresText}>
            <h2>Feature #1</h2>
            <h4>
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
              nonumy eirmod tempor invidunt.
            </h4>
          </div>
        </div>
      </main>
      <footer className={classes.bottomNav}>
        <AuthNavigation />
      </footer>
    </div>
  );
}
