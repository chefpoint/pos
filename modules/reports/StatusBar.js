'use client';

/* * */

import { styled } from '@stitches/react';
import { useContext } from 'react';
import { GoLinkExternal } from 'react-icons/go';
import { Appstate } from '../../context/Appstate';
import SalesReport from './SalesReport';

/* * */

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

const Label = styled('div', {
  textTransform: 'uppercase',
  fontSize: '12px',
  fontWeight: '$medium',
});

/* * */

export default function StatusBar() {
  //

  const appstate = useContext(Appstate);

  function handleOpenReport() {
    appstate.setOverlay(<SalesReport />);
  }

  /* */
  /* RENDER */

  return (
    <Container onClick={handleOpenReport}>
      <Wrapper halign={'left'}>
        <GoLinkExternal />
        <Label>Abrir Relatório do Dia</Label>
      </Wrapper>
    </Container>
  );

  //
}
