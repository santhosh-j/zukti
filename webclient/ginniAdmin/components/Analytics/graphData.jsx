import React from 'react';
import {Line} from 'react-chartjs';
import {Grid} from 'semantic-ui-react';
import {Bar} from 'react-chartjs';
let styles = {
    graphContainer: {
        height: '350px',
        width: '450px',
        marginTop: '15px',
        padding: '20px'
    }
};
let chartOptions = {
    bezierCurve: false,
    datasetFill: false,
    pointDotStrokeWidth: 4,
    scaleShowVerticalLines: false,
    responsive: true
};
export default class GraphData extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            chartData: {
                labels: [
                    'January',
                    'February',
                    'March',
                    'April',
                    'May',
                    'June',
                    'July',
                    'August',
                    'September',
                    'October',
                    'November',
                    'December'
                ],
                datasets: [
                    {
                        fillColor: '#25BDFF',
                        strokeColor: '#25BDFF',
                        pointColor: '#25BDFF',
                        pointStrokeColor: '#fff',
                        pointHighlightFill: '#fff',
                        pointHighlightStroke: '5BDFF',
                        data: [
                            28,
                            48,
                            40,
                            19,
                            86,
                            27,
                            90,
                            45,
                            56,
                            78,
                            98,
                            76
                        ]
                    }
                ]
            },
            chartData1: {
                labels: [
                  'January',
                  'February',
                  'March',
                  'April',
                  'May',
                  'June',
                  'July',
                  'August',
                  'September',
                  'October',
                  'November',
                  'December'
                ],
                datasets: [
                    {
                        label: 'My Second dataset',
                        fillColor: [
                            'rgba(255,0,0,0.3)',
                            'rgba(0,255,0,0.3)',
                            'rgba(0,0,255,0.3)',
                            'rgba(192,192,192,0.3)',
                            'rgba(255,255,0,0.3)',
                            'rgba(255,0,255,0.3)',
                            'rgba(255,0,0,0.3)',
                            'rgba(0,255,0,0.3)',
                            'rgba(0,0,255,0.3)',
                            'rgba(192,192,192,0.3)',
                            'rgba(255,255,0,0.3)',
                            'rgba(255,0,255,0.3)'
                        ],
                        strokeColor: [
                            'rgba(255,0,0,0.3)',
                            'rgba(0,255,0,0.3)',
                            'rgba(0,0,255,0.3)',
                            'rgba(192,192,192,0.3)',
                            'rgba(255,255,0,0.3)',
                            'rgba(255,0,0,0.3)',
                            'rgba(255,0,255,0.3)',
                            'rgba(0,255,0,0.3)',
                            'rgba(0,0,255,0.3)',
                            'rgba(192,192,192,0.3)',
                            'rgba(255,255,0,0.3)',
                            'rgba(255,0,255,0.3)'
                        ],
                        highlightFill: [
                            'rgba(255,0,0,0.3)',
                            'rgba(0,255,0,0.3)',
                            'rgba(0,0,255,0.3)',
                            'rgba(192,192,192,0.3)',
                            'rgba(255,0,255,0.3)',
                            'rgba(255,255,0,0.3)',
                            'rgba(255,0,0,0.3)',
                            'rgba(0,255,0,0.3)',
                            'rgba(0,0,255,0.3)',
                            'rgba(192,192,192,0.3)',
                            'rgba(255,255,0,0.3)',
                            'rgba(255,0,255,0.3)'
                        ],
                        highlightStroke: [
                            'rgba(255,0,0,0.3)',
                            'rgba(0,0,255,0.3)',
                            'rgba(0,255,0,0.3)',
                            'rgba(192,192,192,0.3)',
                            'rgba(255,255,0,0.3)',
                            'rgba(0,255,0,0.3)',
                            'rgba(255,0,255,0.3)',
                            'rgba(255,0,0,0.3)',
                            'rgba(0,0,255,0.3)',
                            'rgba(192,192,192,0.3)',
                            'rgba(255,255,0,0.3)',
                            'rgba(255,0,255,0.3)'
                        ],
                        data: [
                            28,
                            48,
                            40,
                            19,
                            86,
                            27,
                            90,
                            67,
                            87,
                            97,
                            89,
                            45
                        ]
                    }
                ]
            }
        };
      }
        render() {
            return (
              <Grid stackable itemsPerRow={2} >
            <Grid.Column width={10} >
            <div style={styles.graphContainer}>
            <h2>Users Added In Each Month</h2>
            <Line data={this.state.chartData} options={chartOptions} width='300' height='200' />
            </div>
            </Grid.Column>
            <Grid.Column width={2}>
            <div style={styles.graphContainer}>
            <h2>Overall Yearly Usage</h2>
            <Bar data={this.state.chartData1} width='400' height='300' />
            </div>
            </Grid.Column>
            </Grid>
            );
        }
    }
