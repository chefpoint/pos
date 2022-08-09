import { styled } from '@stitches/react';
import { useContext, useEffect, useState } from 'react';
import { GoLinkExternal, GoRadioTower, GoSync } from 'react-icons/go';
import { Appstate } from '../../context/Appstate';
import SalesReport from './SalesReport';

/* * */
/* POINT OF SALE */
/* Explanation needed. */
/* * */

/* */
/* STYLES */

const Container = styled('div', {
  width: '100%',
  padding: '$sm',
  backgroundColor: '$gray0',
  borderRadius: '$md',
  boxShadow: '$md',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'stretch',
  justifyContent: 'stretch',
  gap: '$sm',
  cursor: 'pointer',
  '&:active': {
    backgroundColor: '$gray6',
  },
});

const Wrapper = styled('div', {
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '$xs',
  color: '$gray9',
  variants: {
    halign: {
      left: {
        justifyContent: 'left',
      },
      right: {
        justifyContent: 'right',
      },
    },
  },
});

const StatusWrapper = styled(Wrapper, {
  gap: '$md',
  variants: {
    connected: {
      true: {
        color: '$success5',
      },
      false: {
        color: '$danger5',
      },
    },
  },
  defaultVariants: {
    connected: true,
  },
});

const Label = styled('div', {
  textTransform: 'uppercase',
  fontSize: '12px',
  fontWeight: '$medium',
});

const IconWrapper = styled('div', {
  display: 'flex',
});

export default function StatusBar() {
  //

  const appstate = useContext(Appstate);

  const [hasStableConnection, setHasStableConnection] = useState(false);

  function handleOpenReport() {
    appstate.setOverlay(<SalesReport />);
  }

  useEffect(() => {
    const detectConnection = setInterval(async () => {
      try {
        // const res = await fetch(`https://static-global-s-msn-com.akamaized.net/hp-neu/sc/2b/a5ea21.ico?d=${Date.now()}`);
        const res = await fetch(`/api/version/?d=${Date.now()}`);
        if (res.ok) setHasStableConnection(true);
        else throw new Error('Network failed.');
      } catch (err) {
        setHasStableConnection(false);
      }
    }, 1000);
    return () => clearInterval(detectConnection);
  });

  /* */
  /* RENDER */

  return (
    <Container onClick={handleOpenReport}>
      <Wrapper halign={'left'}>
        <GoLinkExternal />
        <Label>Abrir Relatório do Dia</Label>
      </Wrapper>
      <StatusWrapper halign={'right'} connected={hasStableConnection}>
        <Label connected={hasStableConnection}>{appstate.device?.location?.title}</Label>
        <IconWrapper>
          <GoRadioTower />
        </IconWrapper>
        <IconWrapper>
          <GoSync />
        </IconWrapper>
      </StatusWrapper>
    </Container>
  );
}
