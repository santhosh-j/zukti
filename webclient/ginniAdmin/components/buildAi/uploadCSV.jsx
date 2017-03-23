/* @santhosh: upload csv to add question and answers to neo4j graph */
import React from 'react';
import {Form , Input, Button, Grid, Icon} from 'semantic-ui-react';
import Cookie from 'react-cookie';

class IndexComponent extends React.Component {
  constructor() {
     super();
 }
 render() {
    let domain = Cookie.load('domain');
    let email = Cookie.load('email');
    domain = domain.toLowerCase();
     domain = domain.replace(' ', '_');
    let act = `/uploadcsv?domain=${domain}&email=${email}`
       return (
            <div style={{"margin-left":"30%", "margin-top":"5%"}}>
              <h1 style={{"margin-left":"35%"}}>Upload File</h1>
                <Form method="post" encType="multipart/form-data" action={act} >
                  <Input type="file" name="uploadedFile"  accept=".csv" />
                   <Button color = 'red' type = "submit" ><Icon name='upload'/>Upload</Button>
                 </Form>
            </div>
       );
   }
}
export default IndexComponent;
