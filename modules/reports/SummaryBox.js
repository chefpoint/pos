import { styled } from '@stitches/react';
import { Loader } from '@mantine/core';

/* * */
/* SUMMARY BOX */
/* Explanation needed. */
/* * */

/* */
/* STYLES */

const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  borderWidth: '$md',
  borderStyle: 'solid',
  borderColor: '$gray6',
  borderRadius: '$sm',
  fontSize: '30px',
  alignItems: 'center',
});

const InnerWrapper = styled('div', {
  width: '100%',
  padding: '$md',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
});

const Title = styled('div', {
  width: '100%',
  textAlign: 'center',
  fontSize: '15px',
  fontWeight: '$medium',
  textTransform: 'uppercase',
  color: '$gray12',
  padding: '$xs $lg',
  borderBottomWidth: '$md',
  borderBottomStyle: 'solid',
  borderBottomColor: '$gray6',
  backgroundColor: '$gray2',
});

const Value = styled('div', {
  fontSize: '35px',
  fontWeight: '$bold',
  color: '$primary5',
  padding: '$sm $lg',
  width: '100%',
  textAlign: 'center',
});

/* */
/* LOGIC */

export default function SummaryBox({ title, value }) {
  //
  // Check if there is a value
  let isLoading = true;
  if (value || value === 0) isLoading = false;

  return (
    <Container>
      <Title>{title}</Title>
      {isLoading ? (
        <InnerWrapper>
          <Loader color='gray' size='sm' />
        </InnerWrapper>
      ) : (
        <Value>{value}</Value>
      )}
    </Container>
  );
}
