import React, { Component } from 'react';
import Sidebar from '../../components/sidebar/sidebar';
import { HashRouter as Redirect } from "react-router-dom";

import AuthUserContext from '../../components/withAuth/AuthUserContext';
import withAuthorization from '../../components/withAuth/withAuthorization';
import { db } from '../../firebase';
import { auth } from '../../firebase';

import TextField from 'material-ui/TextField';

import 'url-search-params-polyfill';

//Creates the join module of the website
class Join extends Component{
  constructor(props){
    super(props);
    //Reads URL for compKey and id(judgekey) parameters
    var search = new URLSearchParams(window.location.search);
    this.state = {
      competitionKey: search.get("compKey"),
      id: search.get("id"),
      judge: false,
      name: "",
      joined: false,
      formRendered: false,
      competitorSubmission: "",
      competitionFields: [],
      competitionName: "",
    };

    //Binds functions
    this.handleCompetitorSubmit = this.handleCompetitorSubmit.bind(this);
    this.handleCompetitionKey = this.handleCompetitionKey.bind(this);
    this.handleJudgeKey = this.handleJudgeKey.bind(this);
    this.handleCompetitionSubmission = this.handleCompetitionSubmission.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // Updates state with the competition key.
  // Attempts to grab name from database, however promise Object
  // is used incorrectly here which means it will do nothing.
  handleCompetitionKey(event){
    this.setState({
      competitionKey: event.target.value,
    });
    var temp = db.getCompetitionName(this.state.competitionKey);
    this.setState({
      name: temp,
    });
  }

  // Updates the state with the judge key that is provided
  handleJudgeKey(event){
    this.setState({id: event.target.value})
  }

  // Does nothing as there was miscommunication on how competitor forms are submitted
  handleCompetitionSubmission(event){
    this.setState({
      competitorSubmission: event.target.value,
    })
  }

  // Second submit button for competitors after
  // it asks them competitor form questions
  handleCompetitorSubmit(event){
    alert("You have successfully joined " + this.state.competitionName + " as a contestant.");
  }

  // First submit button that handles data from both judges and competitors
  handleSubmit(event){
    var that = this;
    //Checks the judge key with the one stored in the competition in the database
    db.checkJudgeKey(this.state.competitionKey, this.state.id).then(function(result){
      // If judge key does exist
      if(result.exists()){
        // Stores competition key in check variable
        var check = result.val();
        var confirm;
        if(check == this.state.id) {
          // If judge key in database matches one given by user
          // set confirm variable to true
          confirm = true;
        } else {
          // else set confirm variable to false
          confirm = false;
        }
        // Grabs competition name from database using competition key
        db.getCompetitionName(that.state.competitionKey).then(function(name){
          // If they are a judge
          if(confirm){
            // Adds the user to the competiton with the judge role
            db.joinCompetitionJudge(that.state.competitionKey, auth.getUserID());
            // Alerts user that they have joined the competition as a judge
            alert("You have successfully joined "
            + name.val() + " as a judge.");
          } else {
            // If they are not a judge
            // Updates state saying they are a competitor and changes page
            // to show competitor form
            this.setState({
              joined: true,
              competitionName: name.val()
            })
            // This shouldn't be here and should instead be in other submit button,
            // however competitor join isn't fully implemented
            db.joinCompetitionContestant(that.state.competitionKey, auth.getUserID());
          };
        }.bind(this));
      }
    else{
      // Checks if competition has a judge key which all competitions should.
      // If it doesn't then the competition doesn't exist and will alert the user.
      alert("That competition doesn't exist");
    }
    }.bind(this));

    // Prevents refreshing of page on clicking submit
    event.preventDefault();
  }



  doCreateCompetitorForm(){
    var competitionFields = [];
    // Makes sure the promise object is only parsed one time
    if(!this.state.formRendered){
      // Grabs fields from the database and stores it in the array competitionFields
      db.getCompetitorApplication(this.state.competitionKey).then(function(fields){
        fields.forEach(function(child, i){
          competitionFields.push(child.val());
        }.bind(this))
        // Adds the competitionFields array to the state and
        // setState so that it knows the array has been filled
        this.setState({
          competitionFields,
          formRendered: true});
      }.bind(this));
    }
    // Sets competitionFields variable
    competitionFields = this.state.competitionFields;
    // Renders each text field for the user
    return competitionFields.map((ids,i) =>
    <div>
      <div>
      <label>{ids}</label>
      <div>
      <TextField
        type="text"
        placeholder={i}/>
      </div>
      </div>
    </div>
    )
  }

  render(){
    if(this.state.joined){
      return(
        <div className="page-centered">
          <Sidebar />
          <div style={{flexGrow: 1}}>
            <h1>Competitor Application</h1>
            <form onSubmit={this.handleCompetitorSubmit}>
              {this.doCreateCompetitorForm()}
              <div>
              <input type="submit" value="Submit" />
              </div>
            </form>
          </div>
        </div>
      )
    } else {
      return(
        <div className="page-centered">
          <Sidebar />
          <div style={{flexGrow: 1}}>
            <h1>Join a Competition</h1>
            <form onSubmit={this.handleSubmit}>
              <label>
                <TextField
                  type="text"
                  value={this.state.competitionKey}
                  placeholder="Competition key"
                  onChange={this.handleCompetitionKey} />
              </label>
              <div>
              <label>
                <TextField
                  type="text"
                  value={this.state.id}
                  placeholder="Only judges fill this"
                  onChange={this.handleJudgeKey} />
              </label>
              </div>
              <div>
              <input type="submit" value="Submit" />
              </div>
            </form>
          </div>
        </div>
      )
    }
  }
}

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(Join);
