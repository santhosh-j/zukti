import React from 'react';
import {Feed, Icon, Label, Grid, Popup, Divider} from 'semantic-ui-react';
import Axios from 'axios';
import Snackbar from 'material-ui/Snackbar';
import UnfurlLink from './unfurlLink';
export default class BookmarkView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          saved: false,
          openSnackbar: false,
          snackbarMsg: ''
        };
        this.deleteBookmark = this.deleteBookmark.bind(this);
    }
    deleteBookmark(e, data) {
      this.setState({openSnackbar: true, snackbarMsg: 'Deleted'});
      let id = data.id;
      Axios.delete(`bookmarks/${id}`).then((response) => {
            this.props.handlerRemoveBookmarkFromView(id);
        }).catch((error) => {
          console.log(error);
        });
    }
    handleRequestClose = () => {
        this.setState({openSnackbar: false});
    };
    render() {
        let bookmark = this.props.bookmark;
        let question = bookmark.question;
        let savedResponse = bookmark.savedResponse;
        let responseType = bookmark.responseType;
        let date = bookmark.date;
        let id =bookmark._id;
        let responseView;
        if (responseType === 'text') {
            responseView = savedResponse;
        } else if (responseType === 'blog') {
            responseView = <UnfurlLink url={savedResponse}/>
        } else if (responseType === 'video') {
            responseView = <UnfurlLink url={savedResponse}/>
        }
        return (
          <Grid vertically>
            <Grid.Row columns={3}>
              <Grid.Column width={1}/>
              <Grid.Column width={13}>
            <Grid vertically>
              <Grid.Row columns={2}>
                <Grid.Column width={1}/>
                <Grid.Column width={15}>
                <Grid.Row/>
            <Feed>
 <Feed.Event>
    <Feed.Content>
      <Feed.Summary>
        <Label as='a' style={{background: 'transparent'}} size='medium'
          onClick={this.deleteBookmark} id={id}>
                <Popup positioning='left center' offset={20}
                  inverted trigger={<Icon name='delete' circular
                     style={{background: 'white', color: 'red'}}/>} size= 'mini' content='Delete' />
           </Label>
 <Feed.User><h3>{question}</h3></Feed.User>
   <Feed.Date >{date}</Feed.Date>
  </Feed.Summary>
    <Grid vertically>
  <Grid.Row columns={2}>
    <Grid.Column width={1}/>
    <Grid.Column width={15}>
    <Feed.Extra>
       {responseView}
    </Feed.Extra>
  </Grid.Column>
</Grid.Row>
</Grid>
   </Feed.Content>
   </Feed.Event>
    </Feed>
    <Grid.Row/>
    <Divider/>
  </Grid.Column>
  </Grid.Row>
</Grid>
  </Grid.Column>
  <Grid.Column width={2}/>
  </Grid.Row>
  <Snackbar open={this.state.openSnackbar}
    message={this.state.snackbarMsg} autoHideDuration={1200}
    onRequestClose={this.handleRequestClose}/>
</Grid>

        );
    }
}
