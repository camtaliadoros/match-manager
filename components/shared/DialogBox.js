export default function DialogBox(props, { action }) {
  return (
    <div className={classes.modalWrapper}>
      <div className={classes.authModal}>
        <button className='close' onClick={() => action()}>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='64'
            height='63.982'
            viewBox='0 0 64 63.982'
          >
            <path
              id='Icon_ionic-ios-close'
              data-name='Icon ionic-ios-close'
              d='M50.868,43.28,73.727,20.422a5.356,5.356,0,0,0-7.575-7.575L43.294,35.706,20.435,12.847a5.356,5.356,0,1,0-7.575,7.575L35.719,43.28,12.86,66.139a5.356,5.356,0,0,0,7.575,7.575L43.294,50.855,66.152,73.713a5.356,5.356,0,0,0,7.575-7.575Z'
              transform='translate(-11.285 -11.289)'
            />
          </svg>
        </button>
        <div>{props.children}</div>
      </div>
    </div>
  );
}
