import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import {
    Switch,
    Route,
    withRouter,
} from 'react-router-dom';

import ExclusivelyPublicRoute from './vendor/react-store/components/General/ExclusivelyPublicRoute';
import PrivateRoute from './vendor/react-store/components/General/PrivateRoute';
import Navbar from './components/Navbar';

import { pathNames } from './constants';
import views from './views';

const ROUTE = {
    exclusivelyPublic: 'exclusively-public',
    public: 'public',
    private: 'private',
};

const routesOrder = [
    'dashboard',
    // 'map',
    // 'visualization',
];

const routes = {
    dashboard: { type: ROUTE.public },
};

const propTypes = {
    authenticated: PropTypes.bool,
};

const defaultProps = {
    authenticated: true,
};

@withRouter
export default class Multiplexer extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    constructor(props) {
        super(props);

        this.state = {
            pending: true,
        };
    }

    renderRoutes = () => (
        routesOrder.map((routeId) => {
            const view = views[routeId];
            const path = pathNames[routeId];

            if (!view) {
                console.error(`Cannot find view associated with routeID: ${routeId}`);
                return null;
            }

            const { authenticated } = this.props;
            const redirectTo = routes[routeId].redirectTo;

            switch (routes[routeId].type) {
                case ROUTE.exclusivelyPublic:
                    return (
                        <ExclusivelyPublicRoute
                            component={view}
                            key={routeId}
                            path={path}
                            authenticated={authenticated}
                            redirectLink={redirectTo}
                            exact
                        />
                    );
                case ROUTE.private:
                    return (
                        <PrivateRoute
                            component={view}
                            key={routeId}
                            path={path}
                            authenticated={authenticated}
                            redirectLink={redirectTo}
                            exact
                        />
                    );
                case ROUTE.public:
                    return (
                        <Route
                            component={view}
                            key={routeId}
                            path={path}
                            exact
                        />
                    );
                default:
                    console.error(`Invalid route type ${routes[routeId].type}`);
                    return null;
            }
        })
    )

    render() {
        const Routes = this.renderRoutes;
        const navLinks = [
            // 'map',
            // 'visualization',
        ];

        return (
            <Fragment>
                <Navbar
                    className="navbar"
                    navLinks={navLinks}
                />
                <div className="dfid-main-content">
                    <Switch>
                        <Routes />
                    </Switch>
                </div>
            </Fragment>
        );
    }
}
