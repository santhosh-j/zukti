  import React from 'react';
import Display from './displayaccordion';
import FilterData from './filterData';
import FilterConcept from './filterConcept';
import Pager from 'react-pager';
import Config from '../../../../config/url';
import Axios from 'axios';

import {Grid} from 'semantic-ui-react';
import Style from '../../../css/style.css';
import './questionanswer.css';

export default class Pagination extends React.Component {
      constructor(props) {
        super(props);
        this.handlePageChanged = this.handlePageChanged.bind(this);
        this.handleDropResponse = this.handleDropResponse.bind(this);
        this.updateArray = this.updateArray.bind(this);
        this.state = {
            total: Math.ceil(this.props.data.length / 4),
            current: 0,
            visiblePage: 4,
            data: [],
            showData: [],
            filterData: [],
            searchIntent: '',
            searchkeyword: ''
        };
    }
    // to divide data into smaller arrays for pagination
    componentWillMount() {
        let lengthOfData = this.props.data.length;
        let splitData = [];
        for (var i = 0; i < lengthOfData; i = i + 4) {
            splitData.push(this.props.data.slice(i, i + 4))
        }
        this.setState({data: splitData})
    }

    // to Display 1st page of Pagination
    componentDidMount() {
        this.state.data[0].map((data) => {
            this.state.showData.push(
              <Display questions={data.questions} answers={data.answers}/>);
        });
        this.setState({showData: this.state.showData});
        this.state.showData = [];
    }

    //handle pagination when page changed
    handlePageChanged(newPage) {
        this.state.showData = [];
        this.state.current = newPage;
        this.state.data[this.state.current].map((data1) => {
        this.state.showData.push(<Display questions={data1.questions} answers={data1.answers}/>);
        });
        this.setState({showData: this.state.showData});
    }

    /* @yuvashree: to store filtered data */
    updateArray() {
      let lengthOfData = this.state.filterData.length;
      if(lengthOfData === 0)
        this.state.filterData = [{questions:'',answers:''}];
      let splitData = [];
      for (var i = 0; i < lengthOfData; i = i + 4) {
          splitData.push(this.state.filterData.slice(i, i + 4))
      }
      this.state.showData = [];
      this.setState({data: splitData});
      this.state.data[0].map((data) => {
          this.state.showData.push(
            <Display questions={data.questions} answers={data.answers}/>);
      });
      this.setState({showData: this.state.showData});
      this.state.showData = [];
    }
    /* @yuvashree: to filter data according to intents */
    handleDropResponse = (intent) => {
      this.setState({searchIntent: intent});
      if(this.state.searchkeyword === '')
      {
      let url = Config.url + '/getknowledge/intents/'+intent;
      Axios.get(url).then((response) => {
          // separate questions and answers
          let intentset = response.data.intentSet;

          let set = [];
          intentset.map((data, index) => {
              let blogArray = [],
                  textArray = [],
                  videoArray = [];
              data._fields[1].map((data1, i) => {
                  if (data1[0] === 'blog') {
                      blogArray.push(data1[1])
                  }
              });
              data._fields[1].map((data1, i) => {
                  if (data1[0] === 'text') {
                      textArray.push(data1[1]);
                  }
              });
              data._fields[1].map((data1, i) => {
                  if (data1[0] === 'video') {
                      videoArray.push(data1[1]);
                  }
              });
              set.push(
                  {
                    questions: data._fields[0],
                    answers: {
                      blogs: blogArray,
                      texts: textArray,
                      videos: videoArray
                  }
                });
          });
          this.setState({filterData: set});
          this.showData = [];
          this.updateArray();
      }).catch((error) => {
          console.log(error);
      });
      }
      else {
        let concept = this.state.searchkeyword;
        let url = Config.url + '/getknowledge/keywordsandintents/'+intent+'/'+concept;
        Axios.get(url).then((response) => {
            // separate questions and answers
            let keywordandintentSet = response.data.keywordandintentSet;
            let set = [];
            keywordandintentSet.map((data, index) => {
                let blogArray = [],
                    textArray = [],
                    videoArray = [];
                data._fields[1].map((data1, i) => {
                    if (data1[0] === 'blog') {
                        blogArray.push(data1[1])
                    }
                });
                data._fields[1].map((data1, i) => {
                    if (data1[0] === 'text') {
                        textArray.push(data1[1]);
                    }
                });
                data._fields[1].map((data1, i) => {
                    if (data1[0] === 'video') {
                        videoArray.push(data1[1]);
                    }
                });
                set.push(
                    {
                      questions: data._fields[0],
                      answers: {
                        blogs: blogArray,
                        texts: textArray,
                        videos: videoArray
                    }
                  });
            });
            this.setState({filterData: set});
            this.showData = [];
            this.updateArray();
        }).catch((error) => {
            console.log(error);
        });
      }
    }
    /* @yuvashree: to filter data according to concepts */
    handleConcept = (concept) => {
      this.setState({searchkeyword: concept});
      if(this.state.searchIntent === '')
      {
      let url = Config.url + '/getknowledge/keywords/'+concept;
      Axios.get(url).then((response) => {
          // separate questions and answers
          let keywordSet = response.data.keywordSet;
          let set = [];
          keywordSet.map((data, index) => {
              let blogArray = [],
                  textArray = [],
                  videoArray = [];
              data._fields[1].map((data1, i) => {
                  if (data1[0] === 'blog') {
                      blogArray.push(data1[1])
                  }
              });
              data._fields[1].map((data1, i) => {
                  if (data1[0] === 'text') {
                      textArray.push(data1[1]);
                  }
              });
              data._fields[1].map((data1, i) => {
                  if (data1[0] === 'video') {
                      videoArray.push(data1[1]);
                  }
              });
              set.push(
                  {
                    questions: data._fields[0],
                    answers: {
                      blogs: blogArray,
                      texts: textArray,
                      videos: videoArray
                  }
                });
          });
          this.setState({filterData: set});
          this.showData = [];
          this.updateArray();
      }).catch((error) => {
          console.log(error);
      });
    }
    else {
      let intent = this.state.searchIntent;
      let url = Config.url + '/getknowledge/keywordsandintents/'+intent+'/'+concept;
      Axios.get(url).then((response) => {
          // separate questions and answers
          let keywordandintentSet = response.data.keywordandintentSet;
          let set = [];
          keywordandintentSet.map((data, index) => {
              let blogArray = [],
                  textArray = [],
                  videoArray = [];
              data._fields[1].map((data1, i) => {
                  if (data1[0] === 'blog') {
                      blogArray.push(data1[1])
                  }
              });
              data._fields[1].map((data1, i) => {
                  if (data1[0] === 'text') {
                      textArray.push(data1[1]);
                  }
              });
              data._fields[1].map((data1, i) => {
                  if (data1[0] === 'video') {
                      videoArray.push(data1[1]);
                  }
              });
              set.push(
                  {
                    questions: data._fields[0],
                    answers: {
                      blogs: blogArray,
                      texts: textArray,
                      videos: videoArray
                  }
                });
          });
          this.setState({filterData: set});
          this.showData = [];
          this.updateArray();
      }).catch((error) => {
          console.log(error);
      });
    }
  }
    render() {
      /* @yuvashree : pagination condition */
      let pager = "";
      if(this.state.filterData.length > 4 || this.state.filterData.length === 0)
        {
          pager = (<Pager style={Style}
            total={this.state.total}
            current={this.state.current}
            visiblePages={this.state.visiblePage}
            titles={{ first: '<|', last: '|>' }}
            className="pagination-sm pull-right"
            onPageChanged={this.handlePageChanged} />);
          }
        return (
          <div >
<Grid vertically>
    <Grid.Row columns={3}>
      <Grid.Column width={2}/>
      <Grid.Column width={7}>
        <Grid vertically>
            <Grid.Row columns={2}>
              <Grid.Column width={4}/>
              <Grid.Column width={12}>
            <FilterData intent={this.handleDropResponse}/>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Grid.Column>
              <Grid.Column width={7}>
                      <Grid.Column width={16}>
        <FilterConcept concept={this.handleConcept}/>
        </Grid.Column>
  </Grid.Column>
</Grid.Row>
    <Grid.Row>
      <Grid vertically>
          <Grid.Row>
            <Grid.Column width={16}>
          {this.state.showData}
</Grid.Column>
</Grid.Row>
</Grid>
</Grid.Row>
<Grid.Row>
          <Grid.Column width={16} id="pager">
          {pager}
</Grid.Column>
</Grid.Row>
</Grid>
            </div>

        );
    }
}
