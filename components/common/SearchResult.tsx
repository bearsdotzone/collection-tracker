import styles from "../../styles/SearchResultStyles.module.css";
function SearchResult({ name, foil = true, nonfoil = true }) {
  return (
    <div>
      {foil && <button className={styles.foil}>-</button>}
      {nonfoil && <button className={styles.nonfoil}>-</button>}
      {name}
      {nonfoil && <button className={styles.nonfoil}>+</button>}
      {foil && <button className={styles.foil}>+</button>}
    </div>
  );
}
export default SearchResult;
