import { useModel } from '@umijs/max';
import styles from './index.less';
import Simulate from '@/pages/Simulate';
import React from 'react';

const HomePage: React.FC = () => {
  const { name } = useModel('global');
  return (
    <div className={styles.container}>
      <Simulate />
    </div>
  );
};

export default HomePage;
