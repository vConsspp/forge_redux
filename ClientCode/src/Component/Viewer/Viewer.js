import React, { Component } from 'react';
import ForgeViewer from 'react-forge-viewer';
import {connect} from 'react-redux';

const Autodesk = window.Autodesk
const panels = [];
const allDBIds =[];
var accessToken = "";

class Viewer extends Component{

      componentDidUpdate() {
        const viewerDiv = this.viewerDiv;
        let accessToken = this.props.accessToken;
        if(accessToken)
        {
          var options = {
            env: "AutodeskProduction",
            getAccessToken: function(onTokenReady) {
              var token = accessToken;
              var timeInSeconds = 3600; // Use value provided by Forge Authentication (OAuth) API
              onTokenReady(token, timeInSeconds);
            }
          };
          console.log("access token in viewer", accessToken);
          Autodesk.Viewing.Initializer(
            options,
            this.InitializeViewer.bind(this, viewerDiv)
          );
        }
        
      }
    
      InitializeViewer = viewerDiv => {
        this.viewer = new Autodesk.Viewing.Private.GuiViewer3D(viewerDiv);
        // var startedCode = this.viewer.start();
        this.loadDocument(
          "urn:dXJuOmFkc2sud2lwcHJvZDpmcy5maWxlOnZmLjhxcnkzNGd2UUFldjJtblUwemR5Qnc/dmVyc2lvbj0x"
          //"urn:dXJuOmFkc2sud2lwcHJvZDpmcy5maWxlOnZmLkw0SktZV0Q0UVJXYXA3RERoS25VVUE/dmVyc2lvbj0y"
          //"urn:dXJuOmFkc2sud2lwcHJvZDpmcy5maWxlOnZmLkVNZEc0TUxCUXEycWdUQXZ3dEpkbWc/dmVyc2lvbj0z"
        );
      };
    
      loadDocument = urn => {
        Autodesk.Viewing.Document.load(
          urn,
          this.onDocumentLoadSuccess.bind(this),
          this.onDocumentLoadFailure
        );
      };
    
      onDocumentLoadSuccess = viewerDocument => {
        this.sauViewerDocument = viewerDocument;
        var viewables = viewerDocument
          .getRoot()
          .search({ type: "geometry", role: "3d" });
        var svfUrl = viewerDocument.getViewablePath(viewables[0]);
        var modelOptions = {
          sharedPropertyDbPath: viewerDocument.getRoot().findPropertyDbPath()
        };
    
        this.viewer.start(
          svfUrl,
          modelOptions,
          this.onLoadModelSuccess.bind(this , this.sauViewerDocument),
          this.onLoadModelError
        );
        console.log("panels",panels)
      };
    
      onLoadModelSuccess = (viewerDocument) => {
        console.log("model is loaded");
        
        this.viewer.addEventListener(Autodesk.Viewing.MODEL_LAYERS_LOADED_EVENT,()=>{
          this.viewer.setViewCube('top');
          this.viewer.setActiveNavigationTool('pan');
          this.viewer.navigation.toOrthographic();
        })

        this.viewer.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT,()=>{
          console.log("geometry loaded");
        })

        this.viewer.addEventListener(Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT,()=>{
            var model = this.viewer.model
            console.log("model mudit",model);
            var it = model.getData().instanceTree

            var count = 0;

            it.enumNodeChildren(it.getRootId(), function (dbId) {										
              count++;
              model.getProperties(dbId,function(result){
                if(dbId === 56) {console.log("dbID=6",result)}
                //console.log(result)
                for(var i=0;i<result.properties.length;i++){
                  var attrName = result.properties[i].displayName
                  var attrValue = result.properties[i].displayValue
                  if(attrName === "BIMSF_Container" && attrValue !== ""){
                    allDBIds.push(dbId)
                    console.log("dbId",dbId, "attrValue",attrValue)
                     var isFound = false;
                    for(var j=0;j<panels.length;j++){
                      if(panels[j].BIMSF_Value === attrValue){
                        panels[j].panelIds.push(dbId)
                        isFound = true
                      }
                    }
                    if(isFound === false){
                      var obj = {
                        BIMSF_Value : attrValue,
                        panelIds :[dbId],
                        isSequenced : false,
                        sequenceNumber : ''
                      }
                      panels.push(obj)
                    }
                  }
                }
              })
            }, true);
            setTimeout(function(){console.log("panels",panels)},2000)
            console.log(count)
            
        })
        
        setTimeout(()=>{
          console.log("dbIds",allDBIds)
          this.viewer.show(allDBIds)},3000)
        
        this.viewer.addEventListener(Autodesk.Viewing.AGGREGATE_SELECTION_CHANGED_EVENT,()=>{
          console.log(this.viewer.getSelection())
          for(var i=0;i<panels.length;i++){
            for(var j=0;j<panels[i].panelIds.length;j++){
              if(panels[i].panelIds.includes(this.viewer.getSelection()))
                  console.log("BIMSF_Value",panels[i].BIMSF_Value)
            }
          }
        })
      };
      
      onLoadModelError = () => {console.log("Something went wrong")};
    
      onDocumentLoadFailure() {alert("You do not have permission to access this model")}

      render() {
        return (
          <div>
            <div
              ref={divElement => {
                this.viewerDiv = divElement;
              }}
            > Hey There </div>
          </div>
        );
      }
}




export default Viewer;