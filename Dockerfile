FROM nginx
COPY . /usr/share/nginx/html

COPY esgfsearch.html /usr/share/nginx/html/index.html

CMD echo "var c4iconfigjs = { \
  'searchservice': '${searchservice}', \
  'catalogbrowserservice': '${catalogbrowserservice}',  \
  'adagucservice' : '${adagucservice}', \
  'getvariables' : '${getvariables}', \
  'xml2jsonservice' : '${xml2jsonservice}', \
  'adagucviewer' : '${adagucviewer}' \
  };" > /usr/share/nginx/html/esgfbrowserconfig.js && nginx -g "daemon off;";
