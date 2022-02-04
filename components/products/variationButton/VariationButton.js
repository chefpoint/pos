import cn from 'classnames';

import styles from './VariationButton.module.css';

export default function VariationButton({ variation, selectedVariation, setSelectedVariation, onSelect }) {
  let isThisVariationSelected = false;
  if (selectedVariation && selectedVariation.id == variation.id) isThisVariationSelected = true;

  return (
    <div
      className={cn({
        [styles.container]: true,
        [styles.unselected]: !isThisVariationSelected,
        [styles.selected]: isThisVariationSelected,
      })}
      onClick={() => {
        onSelect(variation);
      }}
    >
      <div className={styles.title}>{variation.title}</div>
      <div className={styles.price}>{variation.price.toFixed(2)}€</div>
    </div>
  );
}