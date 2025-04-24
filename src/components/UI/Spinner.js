import styles from './style.module.css';

export default function Spinner() {
  return (
    <div className="flex justify-center items-center">
      <div className={styles.spinner}></div>
    </div>
  );
}
