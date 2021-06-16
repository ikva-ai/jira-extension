var numResults = 10;
// Base URL for requests to the API
var baseURL = 'https://demo.kvasira.com/api';

// Return the query URL for a given corpus ID
//var queryURL = baseURL+'/corpus/enwiki/query'; //enwiki
var queryURL_so = baseURL+'/corpus/scala-so/query'; //scala stackoverflow
var queryURL_chat = baseURL+'/corpus/s-gitter/query'; //Scala chat
var queryURL_bugs = baseURL+'/corpus/scala-gh/query'; //scala Github
var queryURL_wikipedia = baseURL+'/corpus/enwiki/query'; //wikipedia
			
function processIssue(issue){
 var obj = JSON.parse(issue); 
 var fields = obj.fields;
 var description = fields.description;
 var comments = fields.comment.comments;
 var commentsString = "";
 comments.forEach(function (item, index) {
	 commentsString = commentsString + " " + item.body;
 });
 var fullIssueText = description + " " + commentsString;
 getIKVA_StackOverflowResultFromText(fullIssueText);
 getIKVA_ChatResultFromText(fullIssueText);
 getIKVA_BugsResultFromText(fullIssueText);
 getIKVA_WikiResultFromText(fullIssueText);
}

function displayResults(data,elementID){
	var results = data.response.results;
 	var parent_element = document.getElementById(elementID);
	
	results.forEach(function (item, index) {
		var title = item.title;
		var summary = item.summary;
		var link = item.uri;
		// each result looks like this
		//<h3><a href="https://citrix.com" target="_blank">Article title</a></h3>
		//<p>Summary</p>
		var h_element = document.createElement("h4");
		var link_element = document.createElement("a");
		link_element.innerHTML = title;
		link_element.setAttribute("href", item.uri);
		link_element.setAttribute("target", "_blank");
		h_element.appendChild(link_element);
		parent_element.appendChild(h_element);
		var summary_element = document.createElement("p");
		summary_element.innerHTML = summary;
		parent_element.appendChild(summary_element)
 	});
}

function getIKVA_StackOverflowResultFromText(text){
	getIkvaResultFromText(text,queryURL_so,"SO-results");
}

function getIKVA_ChatResultFromText(text){
	getIkvaResultFromText(text,queryURL_chat,"Chat-results");
}

function getIKVA_BugsResultFromText(text){
	getIkvaResultFromText(text,queryURL_bugs,"BUGS-results");
}

function getIKVA_WikiResultFromText(text){
	getIkvaResultFromText(text,queryURL_wikipedia,"Wikipedia-results");
}

Wikipedia
function getIkvaResultFromText(text,queryURL,elementID){
  var fullURL = queryURL + '?query_type=text&k=5'
  axios.post(fullURL,
    {
      'doc': text,
      'application': {
        'id': 'chrome',
        'metadata': {
        },
      }
    }).then((res) => {
     displayResults(res.data,elementID);
  }).catch((error) => {
    const data = error.response.data;
	document.getElementById("error").innerHTML = 'Please try again in a moment or contact support@kvasira.com';
	});
  }
  
function getCurrentIssue () {
	console.log('Some test');
    AP.context.getContext(function(response){
  	    var requesturl = '/rest/api/2/issue/'+response.jira.issue.key +'?fields=description,summary,comment';
		console.log(requesturl);
	  	AP.request(requesturl)
	    	.then(data => processIssue(data.body))
	    	.catch(e => alert(e.err));
	});
};
