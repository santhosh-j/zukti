import React from 'react';
import {
    Divider,
    Grid
  } from 'semantic-ui-react';
import QuestionAnswer from './questionsAnswer';
import './buildAi.css';
export default class QuestionSetDisplay extends React.Component {

    constructor() {
        super();
    }
    render() {
        return (
            <div >
              <Grid style={{
                  width: '95%',
                  margin: 'auto'
              }}>
                  <Grid.Row columns={1} />
                  <Grid.Column width={16}>
                      <QuestionAnswer/>
                  </Grid.Column>
              </Grid>
            </div>
        );
    }
}
