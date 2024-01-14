import { styled } from '@stitches/react';
import { useContext } from 'react';
import { Appstate } from '../../context/Appstate';
import { CurrentOrder } from '../../context/CurrentOrder';
import Image from 'next/image';
import VariationSelector from './VariationSelector';

/* * */
/* PRODUCT SLOT */
/* Explanation needed. */
/* * */

/* */
/* STYLES */

const EmptySlot = styled('div', {
  width: '100%',
  backgroundColor: '$gray2',
  borderRadius: '$sm',
});

const Container = styled('div', {
  width: '100%',
  backgroundColor: '$gray0',
  boxShadow: '$sm',
  borderRadius: '$sm',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  transition: '$default',
  cursor: 'pointer',
  '&:hover': {
    opacity: 0.9,
    transform: 'scale(1.01)',
  },
  '&:active': {
    opacity: 0.6,
    transform: 'scale(1.05)',
    boxShadow: '$md',
  },
});

const ImageWrapper = styled('div', {
  position: 'relative',
  height: '100%',
  backgroundColor: '$gray2',
  overflow: 'hidden',
});

const Label = styled('div', {
  fontSize: '13px',
  fontWeight: '$bold',
  textTransform: 'uppercase',
  textAlign: 'center',
  padding: '$md $sm',
  lineHeight: 0,
  width: '100%',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  borderTopWidth: '$sm',
  borderTopStyle: 'solid',
  borderTopColor: '$gray4',
});

/* */
/* LOGIC */

export default function ProductSlot({ product }) {
  //
  const appstate = useContext(Appstate);
  const currentOrder = useContext(CurrentOrder);

  const productImageLoader = ({ src, width, quality }) => {
    return '/media/products/' + src;
  };

  function handleClick() {
    if (product.variations.length == 1) {
      // If product only has 1 variation, add it to the order imediatly
      currentOrder.addItem(product, product.variations[0], 1);
    } else {
      // Else, show the variations screen
      appstate.setOverlay(<VariationSelector product={product} />);
    }
  }

  // If product is set
  return product ? (
    <Container onClick={handleClick}>
      <ImageWrapper>
        <Image
          loader={productImageLoader}
          src={product.image}
          alt={product.title}
          priority={true}
          sizes="500px"
          fill
          style={{
            objectFit: 'cover',
          }}
        />
      </ImageWrapper>
      <Label>{product.short_title ? product.short_title : product.title}</Label>
    </Container>
  ) : (
    <EmptySlot />
  );
}
