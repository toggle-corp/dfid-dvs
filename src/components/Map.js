import PropTypes from 'prop-types';
import React from 'react';
import mapboxgl from 'mapbox-gl';


const propTypes = {
    className: PropTypes.string,
    geojson: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    idKey: PropTypes.string,
    labelKey: PropTypes.string,
    // eslint-disable-next-line react/no-unused-prop-types
    colorMapping: PropTypes.objectOf(PropTypes.string),

    selections: PropTypes.arrayOf(PropTypes.any),
    onClick: PropTypes.func,
};
const defaultProps = {
    className: '',
    geojson: undefined,
    idKey: '',
    labelKey: '',
    colorMapping: {
        undefined: '#088',
    },

    selections: [],
    onClick: undefined,
};

const getInFilter = (key, values) => {
    if (values.length === 0) {
        return ['in', key, ''];
    }

    return ['in', key, ...values];
};


export default class Map extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    constructor(props) {
        super(props);

        this.state = {
            map: undefined,
        };
        this.layers = [];
        this.sources = [];
    }

    componentDidMount() {
        this.mounted = true;

        // Add the mapbox map
        mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;
        const map = new mapboxgl.Map({
            center: [50, 10],
            container: this.mapElement,
            style: process.env.REACT_APP_MAPBOX_STYLE,
            zoom: 2,
        });

        map.on('load', () => {
            // Since the map is loaded asynchronously, make sure
            // we are still mounted before doing setState
            if (this.mounted) {
                this.setState({ map }, () => {
                    this.loadMapLayers(this.props);
                });
            }
        });

        setTimeout(() => {
            map.resize();
        }, 200);

        this.initializeMap(map);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.geojson !== nextProps.geojson) {
            this.loadMapLayers(nextProps);
            return;
        }

        const { map } = this.state;
        if (this.props.selections !== nextProps.selections && map) {
            const { selections, idKey } = nextProps;
            map.setFilter('geojson-selected', getInFilter(idKey, selections));
        }
    }

    componentWillUnmount() {
        this.mounted = false;

        // Remove the mapbox map
        const { map } = this.state;
        if (map) {
            this.destroyMapLayers();
            map.remove();
            this.setState({ map: undefined });
        }
    }

    getClassName() {
        const { className } = this.props;
        const classNames = [
            className,
            'map',
        ];
        return classNames.join(' ');
    }

    /* eslint-disable no-param-reassign */
    initializeMap = (map) => {
        const { idKey, labelKey } = this.props;

        const popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false,
        });

        map.on('zoom', (e) => {
            if (e.originalEvent) {
                popup.setLngLat(map.unproject([
                    e.originalEvent.offsetX,
                    e.originalEvent.offsetY - 8,
                ]));
            }
        });

        map.on('mouseenter', 'geojson-fill', (e) => {
            const feature = e.features[0];
            popup.setHTML(feature.properties[labelKey])
                .addTo(map);
        });

        map.on('mousemove', 'geojson-fill', (e) => {
            const feature = e.features[0];
            map.setFilter('geojson-hover', ['==', idKey, feature.properties[idKey]]);
            map.getCanvas().style.cursor = 'pointer';

            popup.setLngLat(map.unproject([
                e.point.x,
                e.point.y - 8,
            ])).setHTML(feature.properties[labelKey]);
        });

        map.on('mouseleave', 'geojson-fill', () => {
            map.setFilter('geojson-hover', ['==', idKey, '']);
            map.getCanvas().style.cursor = '';

            popup.remove();
        });

        map.on('click', 'geojson-fill', (e) => {
            if (this.props.onClick) {
                const feature = e.features[0];
                this.props.onClick(feature.properties[idKey]);
            }
        });
    }
    /* eslint-enable no-param-reassign */

    destroyMapLayers() {
        const { map } = this.state;
        this.layers.forEach(layer => map.removeLayer(layer));
        this.sources.forEach(source => map.removeSource(source));
        this.layers = [];
        this.sources = [];
    }

    loadMapLayers(props) {
        const { map } = this.state;
        const { geojson, idKey, colorMapping, selections } = props;

        if (!map || !geojson) {
            return;
        }

        map.fitBounds(
            [[
                80.06014251708984,
                26.347515106201286,
            ], [
                88.20392608642595,
                30.447021484375057,
            ]],
            { padding: 48 },
        );

        if (this.sources.indexOf('geojson') >= 0) {
            map.getSource('geojson').setData({
                type: 'FeatureCollection',
                features: [],
            });
            map.getSource('geojson').setData(geojson);
            map.setFilter('geojson-selected', getInFilter(idKey, selections));
            return;
        }

        const basePaint = {
            'fill-color': {
                property: idKey,
                type: 'categorical',
                stops: Object.entries(colorMapping),
                default: '#088',
            },
            'fill-opacity': 0.8,
        };

        map.addSource('geojson', {
            type: 'geojson',
            data: geojson,
        });
        this.sources.push('geojson');

        map.addLayer({
            id: 'geojson-fill',
            type: 'fill',
            source: 'geojson',
            paint: basePaint,
        });
        map.addLayer({
            id: 'geojson-hover',
            type: 'fill',
            source: 'geojson',
            paint: {
                ...basePaint,
                'fill-color': '#fff',
                'fill-opacity': 0.2,
            },
            filter: ['==', idKey, ''],
        });
        map.addLayer({
            id: 'geojson-selected',
            type: 'fill',
            source: 'geojson',
            paint: {
                ...basePaint,
                'fill-color': '#6e599f',
                'fill-opacity': 0.5,
            },
            filter: getInFilter(idKey, selections),
        });

        this.layers = [...this.layers, 'geojson-fill', 'geojson-hover', 'geojson-selected'];
    }

    render() {
        const className = this.getClassName();

        return (
            <div
                className={className}
                ref={(el) => { this.mapElement = el; }}
            />
        );
    }
}
