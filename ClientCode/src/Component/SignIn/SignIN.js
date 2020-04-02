import React, { Component } from 'react';
import Viewer from '../Viewer/Viewer';
import { connect } from 'react-redux';
import credentials from '../../config/config';


var access_token = "";
var url ="";
var params ="";

class SignIN extends Component{

  render(){
    // url = window.location.href
    // params = new URLSearchParams(window.location.search)
    // console.log(url)  //<Viewer accesstoken={(() => this.props.sett(access_token)).at}/>
    // console.log("params",params.get('accessToken'))
    // access_token = params.get('accessToken');
    // console.log("accesstoken generated:==>", access_token)
    //this.props.sett(access_token)
    return(      
    <a href={`https://developer.api.autodesk.com/authentication/v1/authorize?response_type=code&client_id=${credentials.clientId}&redirect_uri=${credentials.redirect_uri}&scope=data:read`}>Click here to grant access to your data!</a> 
    )
  }
}
const mapStateToProps = state => {
  return {
      at: state.access_token
  };
};
const mapDispatchToProps = dispatch => {
  return {
      sett: (token) => dispatch({type: 'ASSIGN', val : token})
  };
};

export default connect(mapStateToProps,mapDispatchToProps)(SignIN);

