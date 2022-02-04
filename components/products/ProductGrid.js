import Loading from '../loading/Loading';

import ProductSlot from './ProductSlot';
import styles from './ProductsGrid.module.css';

import useSWR from 'swr';

import { useContext } from 'react';
import { GlobalContext } from '../../utils/global-context';

export default function ProductsGrid() {
  const { data } = useSWR('/api/data');

  const { currentFolder } = useContext(GlobalContext);

  return (
    <div className={styles.container}>
      {data.folders[currentFolder.position] ? (
        data.folders[currentFolder.position].slots.map(({ position, product }) => <ProductSlot key={position} product={product} />)
      ) : (
        <Loading />
      )}
    </div>
  );
}