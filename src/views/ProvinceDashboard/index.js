import React from 'react';
import { interpolateYlGn as interpolateFunction } from 'd3-scale-chromatic';
import { scaleSequential } from 'd3-scale';
import * as d3 from 'd3'; // eslint-disable-line no-unused-vars

import { provinceMeta, provinces } from '../../data/province';
import provinceGeoJson from '../../data/province.geo.json';

import SelectInput from '../../vendor/react-store/components/Input/SelectInput';
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
            indicator: 'totalPopulation',
        };
        this.indicatorOptions = Object.keys(provinceMeta).map(key => ({
            key,
            label: provinceMeta[key].title,
        }));
        this.calculateNewData(this.state.indicator);
    }

    calculateNewData(indicator) {
        const scale = scaleSequential(interpolateFunction);
        const allValues = provinces.map(p => p[indicator]);
        scale.domain([
            0,
            Math.max(...allValues),
        ]);

        this.colorMapping = {};
        provinces.forEach((province) => {
            const value = province[indicator];
            this.colorMapping[province.provinceNumber] = getHexFromRgb(scale(value));
        });

        this.mapStrokeColor = getHexFromRgb(scale(Math.max(...allValues)));
    }

    // handleMapClick = (indicator) => {
    //     if (this.state.selection !== indicator) {
    //         this.setState({ selection: indicator });
    //     } else {
    //         this.setState({ selection: undefined });
    //     }
    // }

    handleIndicatorChange = (indicator) => {
        this.calculateNewData(indicator);
        this.setState({ indicator });
    }

    valueAccessor = data => data[this.state.indicator];
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
                    // selections={this.state.selection ? [this.state.selection] : []}
                    onClick={this.handleMapClick}
                    colorMapping={this.colorMapping}
                    strokeColor={this.mapStrokeColor}
                />
                <SelectInput
                    className={styles.indicator}
                    options={this.indicatorOptions}
                    value={this.state.indicator}
                    onChange={this.handleIndicatorChange}
                    hideClearButton
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
