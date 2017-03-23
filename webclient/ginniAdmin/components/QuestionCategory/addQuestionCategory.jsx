import React from 'react';
import ReactDOM from 'react-dom';
import Axios from 'axios';
import {Grid, Button, Card} from 'semantic-ui-react';
import Config from '../../../../config/url';
import BuildAi from '../buildAi/questionSetDisplay';
export default class AddQuestionCategory extends React.Component {
    constructor(props) {
        super(props);
        this.addCategory = this.addCategory.bind(this);
        // to open specifc question set
        this.openQuestionSet = this.openQuestionSet.bind(this);
        // function to set isCategoryClicked to false and then render questionCategories again
        this.changeIsCategoryClicked = this.changeIsCategoryClicked.bind(this);
        this.state = {
          categories: [],
          isCategoryClicked: false,
          selectedCategory: {}
        };
    }
    // ajax call to get all existing categories in questions
    componentDidMount() {
      let url = Config.url + '/qc/questionCategory';
      Axios.get(url).
      then((response)=>{
        this.setState({categories: response.data});
      }).
      catch((error)=>{
        console.log(error);
      });
    }
    changeIsCategoryClicked() {
      this.setState({isCategoryClicked: false});
    }
    // to open specifc question SetupAi
    openQuestionSet(selectedCategory) {
      // selectedCategory will hold a object containing cateogry nodeID and CategoryName
      this.setState({isCategoryClicked: true, selectedCategory: selectedCategory});
    }
    addCategory() {
        // getting the value of category name from text field
        let category = ReactDOM.findDOMNode(this.refs.category).value;
        // clearing the input category text field
        ReactDOM.findDOMNode(this.refs.category).value = '';
        // ajax call to save question in a specifc question set
        let url = Config.url + '/qc/questionCategory';
        Axios.post(url, {
            category: category
        }).then((response)=> {
          this.state.categories.push(response.data);
          this.setState({categories: this.state.categories});
        }).catch((error)=> {
            console.log(error);
        });
    }

    render() {
        if(!this.state.isCategoryClicked) {
        let existingCategories = this.state.categories.map((item)=>{
          return(
            <Card key={item.nodeID}>
          <Button content={item.categoryName} onClick={() => this.openQuestionSet(item)}
             circular={true} />
            </Card>
          );
        });
        let categoriesDisplay = (
            <Grid style={{
                width: '95%',
                margin: 'auto'
            }}>
            <Grid.Row>
              <input autoComplete="off" type='text' name='category' ref='category'
                placeholder='Add new question category'/>
              <br/><Button primary onClick={this.addCategory}>Add a category</Button>
            </Grid.Row>
            <Card.Group>
              {existingCategories}
          </Card.Group>
            </Grid>
        );
        return categoriesDisplay;
      }
      else{
        return <BuildAi handlerBackToQuestionCategories={this.changeIsCategoryClicked}
          categoryID={this.state.selectedCategory.nodeID} categoryName={this.state.selectedCategory.categoryName}/>
      }
    }
}
