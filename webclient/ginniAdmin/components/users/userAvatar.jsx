import React from 'react';
import {Image} from 'semantic-ui-react';

export default class UserAvatar extends React.Component
{
    constructor() {
        super();
    }
// To find the online user @ Deepika
    render() {
        let color = this.props.loginStatus
            ? 'lime'
            : 'gainsboro';
        let p = this.props.photo;
        let divStyle = {
            backgroundColor: color,
            width: '40px',
            height: '40px',
            paddingTop: '6px',
            paddingLeft: '2px',
            borderRadius: '50%'
        };
        /* @santhosh - view online user updated for google and facebook */
        if(this.props.authType === 'local') {
          return (
              <div>
                  <a>
                      <div style={divStyle}>
                          <center>
                            <Image
                               avatar
                              src={require('../../../../webserver/images/' + p)}
                            />
                          </center>
                      </div>
                  </a>
              </div>
          );
        } else {
          return (
              <div>
                  <a>
                      <div style={divStyle}>
                          <center>
                            <Image
                               avatar
                              src={p}
                            />
                          </center>
                      </div>
                  </a>
              </div>
          );
        }
    }
}
