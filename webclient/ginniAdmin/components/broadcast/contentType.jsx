import React from 'react';
import { Menu, Segment} from 'semantic-ui-react';
import AddContent from './addContent';
export default class ContentType extends React.Component {
  constructor(props) {
    super(props);
  }
    handleItemClick = (e, { name }) => this.setState({ activeItem: name })
    handleAdminInput = (username, text, date) => {
        this.props.handlercontent(username, text, date);
      }
    render() {
      return (
        <div>
          <Menu attached='top' tabular>
            <Menu.Item name='Message' active='Message' onClick={this.handleItemClick} />
            </Menu>
          <Segment attached='bottom'>
            <AddContent handleAdminInput ={this.handleAdminInput}/>
          </Segment>
        </div>
      );
    }
  }
