import React from 'react';
import {Feed, Image} from 'semantic-ui-react';
import './chatcontainerstyle.css';
import Cookie from 'react-cookie';

export default class AssistantView extends React.Component {
   constructor(props) {
       super(props);
       this.state = {
           date1: 'Today'
       };
   }
   render() {
     let storedTime;
     let date = new Date().toLocaleDateString();

     let historydate = this.props.msgDate;
     let splitDate = historydate.split(',');
     let finalDate = splitDate[0];
     let datelocal = this.props.msgDate;
     let storedDate = datelocal[0] + datelocal[1] + datelocal[2] + datelocal[3]
      + datelocal[4] + datelocal[5] + datelocal[6] + datelocal[7] + datelocal[8] ;
     let timelocal = this.props.msgDate;
     if(datelocal[21] === 'M')
     {
         storedTime = datelocal[10] + datelocal[11] + datelocal[12] + datelocal[13]
           + datelocal[14] + datelocal[15] + datelocal[16] + datelocal[17] + datelocal[18]
           + datelocal[19] + datelocal[20] + datelocal[21];
     }
     else{
       storedTime = datelocal[10] + datelocal[11] + datelocal[12] + datelocal[13]
         + datelocal[14] + datelocal[15] + datelocal[16] + datelocal[17] + datelocal[18]
         + datelocal[19] + datelocal[20];
     }

       console.log('here');
     /* @threkashri: display for userMessage */
     if (date === storedDate) {
         return (
             <div id='assistantView'>
                 <div id='assistantViewUser'>
                     {this.props.userMessage}
                     <div id='assistantViewUserDate'>{storedTime}
                     </div>
                 </div>
             </div>
         );
     } else {
         return (
             <div id='assistantView'>
                 <div id='assistantViewUser'>
                     {this.props.userMessage}
                     <div id='assistantViewUserDate'>{this.props.msgDate}
                     </div>
                 </div>
             </div>
         );
     }
   }
}
