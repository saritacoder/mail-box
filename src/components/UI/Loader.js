import styles from './style.module.css';

export default function Loader() {
  return (
    <div className="flex justify-center items-center h-96">
      <div className={styles.loader}></div>
    </div>
  );
}
