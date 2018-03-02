import React from 'react';
import ViewManager from '../components/ViewManager';

const importers = {
    dashboard: () => import('./Dashboard'),
};

const views = Object.keys(importers).reduce(
    (acc, key) => {
        const importer = importers[key];
        acc[key] = props => (
            <ViewManager
                {...props}
                load={importer}
            />
        );
        return acc;
    },
    {},
);

export default views;
