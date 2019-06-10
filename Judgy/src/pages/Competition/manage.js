import React, { Component } from 'react';
import Sidebar from '../../components/sidebar/sidebar';
import { HashRouter as Redirect } from "react-router-dom";

import AuthUserContext from '../../components/withAuth/AuthUserContext';
import withAuthorization from '../../components/withAuth/withAuthorization';
import { db } from '../../firebase';
import { auth } from '../../firebase';

import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';

import 'url-search-params-polyfill';

const centered = {
  float: 'center',
  flexGrow: 1,
};

// Created the manage competition page
class Manage extends Component{
  constructor(props){
    super(props);
    // Initializes state with blank Id and name
    this.state = {
      competitionIDs: [''],
      competitionNames: [''],
    };
  }

  // After page is loaded
  componentDidMount(){
    var competitionIDs = [];
    var competitionNames = [];
    // Gets competition id's the user is a part of as well as the names
    // and stores them in the state under competitionIDs and competitionNames respectively
    db.getCompetitions(auth.getUserID()).then(function(result){
      result.forEach(function(child){
        competitionIDs.push(child.val().compKey);
        db.getCompetitionName(child.val().compKey).then(data =>{
          competitionNames.push(data.val())
          this.setState({competitionNames});
        });
      }.bind(this))
      this.setState({competitionIDs});
    }.bind(this));

  }

  // Displays the competitons the user is in
  doDisplayCompetitions(){
    var compids = [];
    var compnames = [];
    // Stores the array of names into compnames array
    this.state.competitionNames.map((ids) =>
      compnames.push(ids),
    )
    // Stores the array of IDs into the compids array
    this.state.competitionIDs.map((ids, i) =>
      compids.push(ids),
    )
    // renders the competition name, competition key, as well as
    // three buttons that currently do nothing per competition
    return compids.map((ids, i) =>
      <div className="boxed" style={{margin: "auto"}}>
        <Paper elevation={4} style={{minWidth: "20em", minHeight: "5em",}}>
          <label>{compnames[i]}</label>
          <div/>
          <label>{ids}</label>
          <div>
          <Button>Manage</Button>
          <Button>Judges</Button>
          <Button>Submissions</Button>
          </div>
        </ Paper>
      </div>
    )
  }

  render(){

    return(
      <div className="page-centered">
        <Sidebar />
        <div style={centered}>
          <h1>Competitions You Are In</h1>
          <div>
            {this.doDisplayCompetitions()}
          </div>
        </div>
      </div>
    )
  }
}

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(Manage);
