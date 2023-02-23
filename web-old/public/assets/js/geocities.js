var easter_egg = new Konami();

var addGeocitiesCss = function(){
  var head  = document.getElementsByTagName('head')[0]
  var link = document.createElement('link');
  link.rel  = 'stylesheet';
  link.type = 'text/css';
  link.href = 'assets/bootstrap/css/geocities.min.css';
  link.media = 'all';
  head.appendChild(link);
}

var removeCurrentStyles = function(){
  var head  = document.getElementsByTagName('head')[0]
  var links = head.getElementsByTagName('link');
  for(var i=0; i<links.length; i++){
    links[i].parentNode.removeChild(links[i]);
  }
}

easter_egg.code = function(){
    removeCurrentStyles();
    // Weirdly, this needs to be run twice to remove all <link> tags.
    removeCurrentStyles();
    addGeocitiesCss();
}
easter_egg.load();
