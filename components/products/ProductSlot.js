import styles from './ProductSlot.module.css';

import Image from 'next/image';

import { useContext } from 'react';
import { GlobalContext } from '../../utils/global-context';
import VariationSelector from './variationSelector/VariationSelector';

export default function ProductSlot({ product }) {
  //
  const { overlay, currentOrder } = useContext(GlobalContext);

  // If no product is present
  if (!product) {
    return <div className={styles.emptySlot}></div>;
  }

  const productImageLoader = ({ src, width, quality }) => {
    return '/media/products/' + src;
  };

  function handleClick() {
    if (product.variations.length == 1) {
      // If product only has 1 variation, add it to the order imediatly
      currentOrder.add(product, product.variations[0]);
    } else {
      // Else, show the variations screen
      overlay.setComponent(<VariationSelector product={product} />);
    }
  }

  // If product is set
  return (
    <div className={styles.container} onClick={handleClick}>
      <div className={styles.image}>
        <Image loader={productImageLoader} src={product.image} priority={true} layout={'fill'} objectFit={'cover'} alt={product.title} />
      </div>
      <div className={styles.label}>{product.short_title ? product.short_title : product.title}</div>
    </div>
  );
}
