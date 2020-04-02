var isOffice = false
var clientId = ""
var clientSecret = ""
var redirect_uri = ""
if(isOffice){
    //dev server credentials would be here
    clientId = "" 
    clientSecret = ""
    redirect_uri = ""
}
else 
{
    clientId = "AJJL8rCAXbToYuzwN4XbLRpXrlDwmp1U"
    clientSecret = "6VU5X6QJJltI4ftz"
    redirect_uri = "http://192.168.0.105:8081/oauth/callback/"
}

var credentials = {
    clientId : clientId,
    clientSecret : clientSecret,
    redirect_uri : redirect_uri

}

export default credentials;

