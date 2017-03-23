import React from 'react';
import {Grid, Image, Button, Label} from 'semantic-ui-react';
import {Scrollbars} from 'react-custom-scrollbars';
import Axios from 'axios';
import BookmarkView from './bookmarkView';
import Bookmarkspage from '../../../Multi_Lingual/Wordings.json';
export default class BookmarkList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bookmarks: []
        }
        this.removeBookmarkFromView = this.removeBookmarkFromView.bind(this);
    }
    componentDidMount() {
        Axios.get('/bookmarks').
        then((response)=>{
          if(response.data){
            console.log(response.data[0]);
            this.setState({bookmarks:response.data[0].bookmarks});
          }
        }).
        catch((error)=>{
          console.log(error);
        });
    }
    removeBookmarkFromView(id){
      let bookmarks = this.state.bookmarks.filter((bookmark)=>{
        return (bookmark._id!=id);
      });
      this.setState({bookmarks:bookmarks});
    }
    render() {
      console.log(this.state);
      console.log(this.state.bookmarks);
        var bookmarkView = this.state.bookmarks.map((bookmark,index)=>{
          return <BookmarkView key={index} bookmark={bookmark} handlerRemoveBookmarkFromView={this.removeBookmarkFromView}/>
        });
        return (
            <div style={{
                backgroundImage: "url('../../images/background.jpg')",
                marginTop: '1%',
                height: '100%'
            }}>

                <Grid divided='vertically'>
                    <Grid.Row columns={3}>
                        <Grid.Column width={1}></Grid.Column>
                        <Grid.Column width={13}>
                            <Scrollbars renderTrackHorizontal={props => <div {...props} className="track-horizontal" style={{
                                display: "none",
                                position: "right"
                            }}/>} autoHeight autoHeightMin={555}>
                                <div style={{
                                    width: '98%',
                                    height: '50%'
                                }}>
                                    <h3 style={{color:'black',textAlign:'center'}}>{Bookmarkspage.Bookmarks.Heading}</h3>
                                    {bookmarkView}
                                </div>
                            </Scrollbars>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
        );
    }
}
