import React from 'react';

export default class Graph extends React.Component {
  constructor() {
      super();
  }

    render() {
      return(
        <div>
            <frameset>
              <frame src = 'http://192.168.1.55:8081/graphie'/>
            </frameset>
        </div>
      );
  }
}
