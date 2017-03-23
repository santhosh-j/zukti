import React from 'react';

export default class Graph extends React.Component {
  constructor() {
      super();
  }

    render() {
      return(
        <div>
            <frameset>
              <frame src = 'http://localhost:8080/graphie'/>
            </frameset>
        </div>
      );
  }
}
