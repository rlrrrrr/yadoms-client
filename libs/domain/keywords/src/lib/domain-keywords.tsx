import styles from './domain-keywords.module.css';

/* eslint-disable-next-line */
export interface DomainKeywordsProps {}

export function DomainKeywords(props: DomainKeywordsProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to DomainKeywords!</h1>
    </div>
  );
}

export default DomainKeywords;
