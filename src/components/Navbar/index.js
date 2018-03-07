import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router-dom';

import logo from '../../resources/img/logo.png';
import NavMenu from './NavMenu';
import styles from './styles.scss';

const propTypes = {
    className: PropTypes.string,
    navLinks: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
};

const defaultProps = {
    className: '',
};

@withRouter
export default class Navbar extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    render() {
        const {
            className,
            navLinks,
        } = this.props;

        const classNames = [
            className,
            styles.navbar,
        ];

        return (
            <nav className={classNames.join(' ')}>
                <div className={styles['left-container']}>
                    <img
                        src={logo}
                        className={styles.logo}
                        alt="DFID Nepal"
                    />
                    <h2 className={styles.heading}>
                        Provinces
                    </h2>
                </div>
                <NavMenu
                    links={navLinks}
                    className={styles.mainMenu}
                />
            </nav>
        );
    }
}
