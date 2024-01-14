import { styled } from '@stitches/react';
import { useContext } from 'react';
import { Appstate } from '../../context/Appstate';
import UserUnlock from './UserUnlock';
import { BsFillLockFill, BsFillUnlockFill } from 'react-icons/bs';
import { GoLock } from 'react-icons/go';
import Image from 'next/image';

/* * */
/* USER BUTTON */
/* Explanation needed. */
/* * */

/* */
/* STYLES */

const LockOverlay = styled('div', {
  position: 'fixed',
  top: '0',
  left: '0',
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(255,255,255,0.95)',
  zIndex: 100,
  display: 'flex',
  flexDirection: 'column',
  gap: '50px',
  alignItems: 'center',
  justifyContent: 'center',
  color: '$gray7',
  fontSize: '200px',
  '&:active': {
    color: '$gray9',
  },
});

const Container = styled('div', {
  height: '40px',
  minHeight: '40px',
  display: 'flex',
  flexDirection: 'row',
  gap: '$xs',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '$medium',
  textTransform: 'uppercase',
  borderBottomWidth: '$sm',
  borderBottomStyle: 'solid',
  borderBottomColor: 'transparent',
  variants: {
    locked: {
      true: {
        color: '$gray0',
        backgroundColor: '$primary5',
        borderBottomColor: '$primary5',
      },
      false: {
        color: '$primary5',
        borderBottomColor: '$gray7',
      },
    },
  },
});

/* */
/* LOGIC */

export default function UserButton() {
  //

  const appstate = useContext(Appstate);

  const environment = !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ? 'DEV' : false;

  function handleLockUnlock() {
    if (appstate.hasCurrentUser) {
      appstate.logoutUser();
    } else {
      appstate.setOverlay(<UserUnlock />);
    }
  }

  return (
    <>
      <Container locked={!appstate.hasCurrentUser} onClick={handleLockUnlock}>
        {appstate.hasCurrentUser ? (
          <>
            <BsFillUnlockFill />
            {appstate.currentUser.name}
          </>
        ) : (
          <>
            <BsFillLockFill />
            Caixa Bloqueada
          </>
        )}
      </Container>
      {!appstate.hasCurrentUser && (
        <LockOverlay onClick={handleLockUnlock}>
          <GoLock />
          <Image src={'/brand/chefpoint-logo-light.svg'} width={0} height={0} alt={'Chef Point - Leading Food & Beverages Solutions'} style={{ width: 250, height: 'auto' }} />
          {environment && <p>{environment}</p>}
        </LockOverlay>
      )}
    </>
  );
}
