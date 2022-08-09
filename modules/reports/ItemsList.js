import { styled } from '@stitches/react';
import { Loader } from '@mantine/core';

/* * */
/* ITEMS LIST */
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

const InnerWrapper = styled('div', {
  width: '100%',
  maxHeight: '400px',
  overflowY: 'scroll',
});

const Row = styled('div', {
  padding: '$sm $md',
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '$md',
  borderBottomWidth: '$sm',
  borderBottomStyle: 'solid',
  borderBottomColor: '$gray6',
  '&:last-child': {
    borderBottomWidth: '0',
  },
});

const ItemTitle = styled('div', {
  fontSize: '15px',
  color: '$gray12',
  fontWeight: '$medium',
  width: '100%',
  textTransform: 'uppercase',
});

const ItemQuantity = styled('div', {
  fontSize: '20px',
  color: '$gray12',
  fontWeight: '$bold',
  minWidth: '100px',
  textAlign: 'right',
});

const NoData = styled('div', {
  width: '100%',
  padding: '$lg',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: '$medium',
  fontSize: '20px',
  textTransform: 'uppercase',
  color: '$gray4',
});

/* */
/* LOGIC */

export default function ItemsList({ data }) {
  //
  // Check if there is a value
  let isLoading = true;
  if (data || Array.isArray(data)) isLoading = false;

  return (
    <Container>
      <Title>Totais por Produto</Title>
      {isLoading ? (
        <NoData>
          <Loader color='gray' size='sm' />
        </NoData>
      ) : data.length ? (
        <InnerWrapper>
          {data.map((item) => (
            <Row key={item.variation_id}>
              <ItemTitle>{`${item.product_title} - ${item.variation_title}`}</ItemTitle>
              <ItemQuantity>{item.qty}</ItemQuantity>
            </Row>
          ))}
        </InnerWrapper>
      ) : (
        <NoData>Nenhum dado disponível</NoData>
      )}
    </Container>
  );
}
