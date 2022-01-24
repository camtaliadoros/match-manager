import Link from "next/link";
import React from "react";
import Image from "next/image";
import classes from "./PublicHome.module.scss";
import AuthNavigation from "../layout/AuthNavigation";

export default function PublicHome() {
  return (
    <div className={classes.wrapper}>
      <header className={classes.header}>
        <Link href="/" >
          <a className={`${classes.logo} light-text`}>FA</a>
        </Link>
        <AuthNavigation />
      </header>
      <main className={classes.main}>
        <div className={classes.firstScreen}>
          <div className={`${classes.onboardingText} light-text`}>
            <h1>Match Manager</h1>
            <h4>Take control of your games.</h4>
            <button className="mobile-hidden">
              <Link href="/login">SIGN UP NOW</Link>
            </button>
          </div>
        </div>
        <div className={classes.features}>
          <div className={classes.featureImage}>
            <Image
              src="/app-feature-1.png"
              alt="App Feature Example"
              width="528"
              height="610"
              layout="intrinsic"
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
      <footer>
        <button className={classes.bottomNav}>
          <Link href="/login">REGISTER / LOG IN</Link>
        </button>
      </footer>
    </div>
  );
}
