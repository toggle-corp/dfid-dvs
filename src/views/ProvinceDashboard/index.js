import React from 'react';
import { interpolateYlGn as interpolateFunction } from 'd3-scale-chromatic';
import { scaleSequential } from 'd3-scale';
import * as d3 from 'd3'; // eslint-disable-line no-unused-vars

import { provinces } from '../../data/province';
import provinceGeoJson from '../../data/province.geo.json';

import PieChart from '../../vendor/react-store/components/Visualization/PieChart';
import HorizontalBar from '../../vendor/react-store/components/Visualization/HorizontalBar';
import { getHexFromRgb } from '../../vendor/react-store/utils/common';

import Map from '../../components/Map';
import styles from './styles.scss';


// eslint-disable-next-line react/prefer-stateless-function
export default class ProvinceDashboard extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            selection: undefined,
        };

        const key = 'totalPopulation';
        const scale = scaleSequential(interpolateFunction);
        const populationValues = provinces.map(p => p[key]);
        scale.domain([
            0,
            Math.max(...populationValues),
        ]);

        this.colorMapping = {};
        this.key = key;
        provinces.forEach((province) => {
            const value = province[key];
            this.colorMapping[province.provinceNumber] = getHexFromRgb(scale(value));
        });
    }

    handleMapClick = (key) => {
        if (this.state.selection !== key) {
            this.setState({ selection: key });
        } else {
            this.setState({ selection: undefined });
        }
    }

    valueAccessor = data => data[this.key];
    labelAccessor = data => `Province #${data.provinceNumber}`;
    colorAccessor = data => this.colorMapping[data.provinceNumber];

    render() {
        return (
            <div className={styles.provinceDashboard}>
                <Map
                    className={styles.map}
                    geojson={provinceGeoJson}
                    idKey="D_ID"
                    labelKey="Title"
                    selections={this.state.selection ? [this.state.selection] : []}
                    onClick={this.handleMapClick}
                    colorMapping={this.colorMapping}
                />
                <div className={styles.viz}>
                    <PieChart
                        className={styles.chart}
                        data={provinces}
                        valueAccessor={this.valueAccessor}
                        labelAccessor={this.labelAccessor}
                        colorAccessor={this.colorAccessor}
                    />
                    <HorizontalBar
                        className={styles.chart}
                        data={provinces}
                        valueAccessor={this.valueAccessor}
                        labelAccessor={this.labelAccessor}
                        colorAccessor={this.colorAccessor}
                    />
                </div>
            </div>
        );
    }
}
