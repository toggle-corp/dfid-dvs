import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { getRandomFromList } from './vendor/react-store/utils/common';

import Multiplexer from './Multiplexer';

export default class App extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            pending: true,
        };

        const loadingMessages = [
            'RAM ok, CPU ok, PATIENCE testing',
            'Is that something on your teeth?',
            'Hold your breath',
        ];

        // Get a random message from the loading message list
        this.randomMessage = getRandomFromList(loadingMessages);

        // Style for random message page
        this.randomMessageStyle = {
            alignItems: 'center',
            display: 'flex',
            height: '100vh',
            justifyContent: 'center',
            color: 'rgba(0, 0, 0, 0.5)',
            fontSize: '1.5em',
        };
    }

    componentDidMount() {
        this.timeout = setTimeout(() => {
            this.setState({ pending: false });
        }, 2000);
    }

    componentWillUnmount() {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
    }

    render() {
        if (this.state.pending) {
            // Show loading screen until access token is retrieved
            return (
                <div style={this.randomMessageStyle} >
                    { this.randomMessage }
                </div>
            );
        }

        return (
            <BrowserRouter>
                <Multiplexer />
            </BrowserRouter>
        );
    }
}
