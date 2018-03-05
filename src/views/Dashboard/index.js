import React from 'react';
import styles from './styles.scss';
import ProvinceDashboard from '../ProvinceDashboard';


// eslint-disable-next-line react/prefer-stateless-function
export default class Dashboard extends React.PureComponent {
    render() {
        return (
            <div className={styles.dashboard}>
                <ProvinceDashboard />
            </div>
        );
    }
}
