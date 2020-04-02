import React, { Component } from 'react';
import SignIN from './Component/Viewer/Viewer';
import credentials from '././config/config';
import {connect} from 'react-redux';

// var accessToken = "";
var url ="";
var params ="";
class App extends Component
{
  state = {
    accessToken : "",
    hasAccessToken : false
  }

  componentDidMount(){
    if(!this.props.hasAccessToken){
      this.props.onAccessTokenCreated(this.accessToken)
    }
  }
  render()
  {
    url = window.location.href
    params = new URLSearchParams(window.location.search)
    console.log(url)  
    console.log("params",params.get('accessToken'))
    this.accessToken = params.get('accessToken');
    console.log("accesstoken generated:==>", this.accessToken)
    return(
    (this.accessToken==null)?<a href={`https://developer.api.autodesk.com/authentication/v1/authorize?response_type=code&client_id=${credentials.clientId}&redirect_uri=${credentials.redirect_uri}&scope=data:read`}>Click here to grant access to your data!</a> 
    : <SignIN accessToken = {this.props.accessToken} /> 
    )
  }

}

const mapStateToProps = state  => {
    return {
      accessToken : state.accessToken,
      hasAccessToken : state.hasAccessToken
    };
};

const mapDispatcherToProps = dispatch => {
  return {
    onAccessTokenCreated: (accessToken) => dispatch({type : "ASSIGN" , val : accessToken}),
    onGettingAccessToken: () => dispatch({type: "GOT_TOKEN"})
  }
};

export default connect(mapStateToProps , mapDispatcherToProps)(App);