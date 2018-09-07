var esgfsearch_pc_mutiplyHexColor = function(hexcolor,factor){
	var r = parseInt('0x'+hexcolor.substring(1,3));r*=factor;if(r<0)r=0;if(r>255)r=255;r = parseInt(r).toString(16);if(r.length==1)r="0"+r;
	var g = parseInt('0x'+hexcolor.substring(3,5));g*=factor;if(g<0)g=0;if(g>255)g=255;g = parseInt(g).toString(16);if(g.length==1)g="0"+g;
	var b = parseInt('0x'+hexcolor.substring(5,7));b*=factor;if(b<0)b=0;if(b>255)b=255;b = parseInt(b).toString(16);if(b.length==1)b="0"+b;
	return "#"+r+g+b;
};

var PropertyChooser = function(config){
	this.config = config;
}

PropertyChooser.prototype.html = "<div class=\"esgfsearch-ppc\"></div>";

PropertyChooser.prototype.init = function(parentEl, facetName,facetList,query,selectPropertyCallback){
	var config = this.config;
	var k = new ESGFSearch_KVP(query);
	var selectedFacets = k.getKeyValues();
	var selectedPropertiesForFacet = selectedFacets[facetName];
	var foundProperties = 0;
	var createTile = function(color,enabled,name,description,tileobj){

		var extraCls = "";
		var cbcls = "c4i-esgfsearch-checkboxclear";
		if(!enabled){
			color = 'gray';
			extraCls="esgfsearch-ppc-tile-disabled";
			cbcls = "";
		}else{
			foundProperties++;
		}
		if(selectedPropertiesForFacet){
			if(esgfSearchIndexOf(selectedPropertiesForFacet,name)!=-1){
				extraCls+= " c4i-esgfsearch-property-selected";
				cbcls = "c4i-esgfsearch-checkbox";
			}
		}

    var tooltip="";
      if (tileobj.hasOwnProperty('tooltip')){
      tooltip="title=\""+tileobj.tooltip+"\" ";
    }  

		var d= $("<div class=\"esgfsearch-ppc-tile c4i-esgfsearch-property "+extraCls+"\" "+tooltip+"/>");
		d.attr('name',name);
		var title = name;
		if(tileobj.shortname)name=tileobj.shortname;
		if(config.tilewidth){
			d.css({"width":config.tilewidth});
		}
		d.html(
				"<div class=\"esgfsearch-ppc-tileheader\" style=\"background-color:"+color+";\">"+ "<div class=\""+cbcls+"\" style=\"float:none;\"></div>&nbsp;<span>"+name+""+
				"</span></div>"+
				"<div class=\"esgfsearch-ppc-tilebody\" style=\"padding:5px 15px 5px 15px;\">"+description+
				"</div>"
		);

//		if(enabled){
//		var colorsel = esgfsearch_pc_mutiplyHexColor(color,1.25);
//		d.mouseenter(function(){d.css("background-color",colorsel);});
//		d.mouseleave(function(){d.css("background-color",color);});
//		}
		return d;
	};


	var main=$("<div class=\"esgfsearch-ppc-main\" ></div>");
//	main.css('background-color', esgfsearch_currentcolorscheme.background);


	for(var j=0;j<this.config.properties.length;j++){
		var enable = true;
		if(facetList){
			if(esgfSearchIndexOf(esgfSearchGetKeys(facetList),this.config.properties[j].name)==-1){
				enable = false;
			}
		}
		main.append(createTile(this.config.properties[j].color,enable,this.config.properties[j].name,this.config.properties[j].longname,this.config.properties[j]));

	}
	parentEl.find(".esgfsearch-ppc").empty();

	parentEl.find(".esgfsearch-ppc").append(main);
	return foundProperties;
};


var NestedPropertyChooser = function(config){
	this.config = config;
}

NestedPropertyChooser.prototype.html = "<div class=\"esgfsearch-ppc\"></div>";

NestedPropertyChooser.prototype.init = function(parentEl, facetName,facetList,query,selectPropertyCallback){
	var config = this.config;
	var createTile = function(color,name,description,iconClass,tileobj){
	  var tooltip="";
    if (tileobj.hasOwnProperty('tooltip')){
      tooltip="title=\""+tileobj.tooltip+"\" ";
    }  

    var d= $("<div class=\"esgfsearch-ppc-tile\""+tooltip+"/>");
		if(config.tilewidth){
			d.css({"width":config.tilewidth});
		}
		d.attr('name',name);
		var icon ="";
		if(iconClass){
			icon='<i class="esgfsearch-ppc-tileheader-icon '+iconClass+'"></i>';
		}
		d.html(
				"<div class=\"esgfsearch-ppc-tileheader\" style=\"background-color:"+color+";\">"+
				icon+
				"<span class=\"esgfsearch-ppc-tileheader-text\">"+name+"</span>"+
				"</div>"+
				"<div class=\"esgfsearch-ppc-tilebody\">"+description+
				"</div>"
		);


		var colorsel = esgfsearch_pc_mutiplyHexColor(color,1.1);

//		d.mouseenter(function(){d.css("background-color",colorsel);});
//		d.mouseleave(function(){d.css("background-color",color);});
		return d;
	};

	var k = new ESGFSearch_KVP(query);
	var selectedFacets = k.getKeyValues();
	var selectedPropertiesForFacet = selectedFacets[facetName];

	var main=$("<div class=\"esgfsearch-ppc-main\"></div>");
//	main.css('background-color', esgfsearch_currentcolorscheme.background);


	var foundProperties = 0;
	for(var j=0;j<this.config.properties.length;j++){

		var tilehtml=  "";
		for(var i=0;i<this.config.properties[j].children.length;i++){
			var c= this.config.properties[j].children[i];
			var cls = "";
			var cbcls = "c4i-esgfsearch-checkboxclear";

			if (!c.hasOwnProperty("name")){
				tilehtml+="<br>";
			} else {
				if(esgfSearchIndexOf(esgfSearchGetKeys(facetList),c.name)==-1){
					cls = "c4i-esgfsearch-property-disabled"
				}else{
					foundProperties++;
				}

				if(selectedPropertiesForFacet){
					if(esgfSearchIndexOf(selectedPropertiesForFacet,c.name)!=-1){
						cls+= " c4i-esgfsearch-property-selected";
						cbcls = "c4i-esgfsearch-checkbox";

					}
				}
				var tooltip="";
				if (c.hasOwnProperty('tooltip')){
					tooltip="title=\""+c.tooltip+"\" ";
				}  

				tilehtml+="<div class=\"c4i-esgfsearch-property esgfsearch-ppc-tileproperty "+cls+"\" name=\""+c.name+"\""+tooltip+">"+
				"<span class=\""+cbcls+"\"></span>"+c.shortname+" ("+c.name+")</div>";
			}
		}

		main.append(createTile(this.config.properties[j].color,this.config.properties[j].shortname,tilehtml,this.config.properties[j].weathericon,this.config.properties[j]));
	}

	parentEl.find(".esgfsearch-ppc").empty();


	parentEl.find(".esgfsearch-ppc").append(main);
	return foundProperties;
};




var TimeChooser = function(config){
	this.config = config;
}

TimeChooser.prototype.html = "<div class=\"esgfsearch-ppc\"></div>";

TimeChooser.prototype.init = function(parentEl, facetName,facetList,query,selectPropertyCallback){
	var config = this.config;
	var k = new ESGFSearch_KVP(query);
	var selectedFacets = k.getKeyValues();
	var selectedPropertiesForFacet = selectedFacets[facetName];
	var foundProperties = 0;

	var html='<div class="c4i-esgfsearch-tss">'+
	'<span class="c4i-esgfsearch-generallabel">Specify the date in years you wish to search for. Results will be shown that overlap the specified date.<br/><br/></span>'+
	'<table>'+
	'<tr>'+
	'  <td><span class="c4i-esgfsearch-tss-text">Year from </span></td>'+
	'  <td><input  class="c4i-esgfsearch-tss-timestart c4i-esgfsearch-tss-input" type="text" placeholder="YYYY"/></td>'+
//	'</tr>'+
//	'<tr>'+
	'  <td><span class="c4i-esgfsearch-tss-text"> till</span></td>'+
	'  <td><input  class="c4i-esgfsearch-tss-timestop c4i-esgfsearch-tss-input" type="text" placeholder="YYYY"/></td>'+
	'<td>'+
	'<button class="c4i-esgfsearch-tss-searchbutton">Search</button>'+
	'<button class="c4i-esgfsearch-tss-clearbutton">X</button>'+
	'</td>'+
	'</tr>'+
	'</table>'+

	'</div>';

	parentEl.find(".esgfsearch-ppc").html(html);

	var searchStartStop = function (){
		var valStart = parentEl.find(".c4i-esgfsearch-tss-timestart").val();
		var valStop = parentEl.find(".c4i-esgfsearch-tss-timestop").val();
		var dateQuery= valStart+"/"+valStop;
		if(dateQuery.length==9&&valStart.length==4&&valStop.length==4){
			selectPropertyCallback("time_start_stop",dateQuery);  
		}else{
			alert("Please enter Years in the format YYYY.<br/><br/>For example 1950 till 2150.");
		}
	};

	/* Search dates */
	parentEl.find(".c4i-esgfsearch-tss-searchbutton").button().click(searchStartStop);

	/* Clear dates */
	parentEl.find(".c4i-esgfsearch-tss-clearbutton").button().click(function(){
		selectPropertyCallback("time_start_stop");  
	});

	/* OnEnter behaviour */
	parentEl.find(".c4i-esgfsearch-tss-input").keypress(function(event) {
		if (event.keyCode == 13) {
			searchStartStop();
		}
	});


	/* Filling inputs based on query */
	var startStopValue;
	var start="";
	var stop="";
	if(selectedFacets["time_start_stop"]){
		var input = selectedFacets["time_start_stop"][0];
		startStopValue = (decodeURIComponent(input));
	}
	if(startStopValue){
		if(startStopValue.length==9){
			if(startStopValue.split("/").length==2){
				start=startStopValue.split("/")[0];
				stop=startStopValue.split("/")[1];
			}else{
			}
		}
	}
	parentEl.find(".c4i-esgfsearch-tss-timestart").val(start);
	parentEl.find(".c4i-esgfsearch-tss-timestop").val(stop);
	return foundProperties;
};


var AreaChooser = function(config){
	this.config = config;
}

AreaChooser.prototype.html = "<div class=\"esgfsearch-ppc\"></div>";

AreaChooser.prototype.init = function(parentEl, facetName,facetList,query,selectPropertyCallback){
	var config = this.config;
	var k = new ESGFSearch_KVP(query);
	var selectedFacets = k.getKeyValues();
	var selectedPropertiesForFacet = selectedFacets[facetName];
	var foundProperties = 0;

	var html='<div class="c4i-esgfsearch-bbox">'+
	'<span class="c4i-esgfsearch-generallabel">Search box in degrees. Searches for data overlapping the box.<br/><br/></span>'+
	'<table>'+
	'<tr>'+
	'  <td></td>'+
	'  <td><input  class="c4i-esgfsearch-bbox-north c4i-esgfsearch-bbox-input" type="text" placeholder="North"/></td>'+
	'  <td></td>'+
	'</tr>'+
	'<tr>'+
	'  <td><input  class="c4i-esgfsearch-bbox-west c4i-esgfsearch-bbox-input" type="text" placeholder="West"/></td>'+
	'  <td></td>'+
	'  <td><input  class="c4i-esgfsearch-bbox-east c4i-esgfsearch-bbox-input" type="text" placeholder="East"/></td>'+
	'</tr>'+
	'<tr>'+
	'  <td></td>'+
	'  <td><input  class="c4i-esgfsearch-bbox-south c4i-esgfsearch-bbox-input" type="text" placeholder="South"/></td>'+
	'  <td></td>'+
	'</tr>'+
	'</table><br/>'+
	'<button class="c4i-esgfsearch-bbox-searchbutton">Search</button>'+
	'<button class="c4i-esgfsearch-bbox-clearbutton">X</button>'+
	'</div>';

	parentEl.find(".esgfsearch-ppc").html(html);

	var searchGeoBox = function (){
		var north = parentEl.find(".c4i-esgfsearch-bbox-north").val();
		var west  = parentEl.find(".c4i-esgfsearch-bbox-west").val();
		var east  = parentEl.find(".c4i-esgfsearch-bbox-east").val();
		var south = parentEl.find(".c4i-esgfsearch-bbox-south").val();
		if(north&&west&&east&&south){
			selectPropertyCallback("bbox",west+","+south+","+east+","+north);  
		}else{
			alert("Please enter numbers for the geobox in degrees.");
		}

	};

	/* Search geobox */
	parentEl.find(".c4i-esgfsearch-bbox-searchbutton").button().click(searchGeoBox);

	/* Clear */
	parentEl.find(".c4i-esgfsearch-bbox-clearbutton").button().click(function(){
		selectPropertyCallback("bbox");  
	});

	/* OnEnter behaviour */
	parentEl.find(".c4i-esgfsearch-bbox-input").keypress(function(event) {
		if (event.keyCode == 13) {
			searchGeoBox();
		}
	});

	/* Filling inputs based on query */

	var north="";
	var west="";
	var east="";
	var south="";
	var bboxValue;
	if(selectedFacets["bbox"]){
		var input = selectedFacets["bbox"][0];
		bboxValue = (decodeURIComponent(input));
	}
	if(bboxValue){
		if(bboxValue.split(",").length==4){
			west=bboxValue.split(",")[0];
			south=bboxValue.split(",")[1];
			east=bboxValue.split(",")[2];
			north=bboxValue.split(",")[3];
		}else{
		}
	}
	parentEl.find(".c4i-esgfsearch-bbox-north").val(north);
	parentEl.find(".c4i-esgfsearch-bbox-west").val(west);
	parentEl.find(".c4i-esgfsearch-bbox-east").val(east);
	parentEl.find(".c4i-esgfsearch-bbox-south").val(south);

	return foundProperties;
};



var FreeTextQueryChooser = function(config){
	this.config = config;
}

FreeTextQueryChooser.prototype.html = "<div class=\"esgfsearch-ppc\"></div>";

FreeTextQueryChooser.prototype.init = function(parentEl, facetName,facetList,query,selectPropertyCallback){
	var config = this.config;
	var k = new ESGFSearch_KVP(query);
	var selectedFacets = k.getKeyValues();
	var selectedPropertiesForFacet = selectedFacets[facetName];
	var foundProperties = 0;

	var html='<div class="c4i-esgfsearch-ftq">'+
	'<span class="c4i-esgfsearch-generallabel">The free text query can be used to execute a query that matches the given text anywhere in the metadata fields.<br/><br/>If you happen to know a property in the Solr metadata that gives an exact match, then you can search for it using "name:value" and just get the results of interest.<br/><br/>For example "drs_id:cmip5.output1.MPI-M.MPI-ESM-LR.abrupt4xCO2.day.atmos.cfDay.r1i1p1" will return results matching the drs_id.<br/><br/></span>'+
	'<input  class="c4i-esgfsearch-ftq-freetext c4i-esgfsearch-ftq-input" type="text"/>'+
	'<button class="c4i-esgfsearch-ftq-searchbutton">Search</button>'+
	'<button class="c4i-esgfsearch-ftq-clearbutton">X</button>'+
	'</div>';

	parentEl.find(".esgfsearch-ppc").html(html);

	var searchFreeTextQuery = function (){
		console.log("searchFreeTextQuery triggered");
		var freeTextQuery = parentEl.find(".c4i-esgfsearch-ftq-freetext").val();
		selectPropertyCallback("query",freeTextQuery);  
	};

	/* Search free text */
	parentEl.find(".c4i-esgfsearch-ftq-searchbutton").button().click(searchFreeTextQuery);

	/* Clear */
	parentEl.find(".c4i-esgfsearch-ftq-clearbutton").button().click(function(){
		selectPropertyCallback("query");  
	});

	/* OnEnter behaviour */
	parentEl.find(".c4i-esgfsearch-ftq-input").keypress(function(event) {
		if (event.keyCode == 13) {
			console.log("Enter triggered");
			searchFreeTextQuery();
		}
	});


	/* Filling inputs based on query */
	var freeTextQuery = "";

	if(selectedFacets["query"]){
		var input = selectedFacets["query"][0];
		freeTextQuery = (decodeURIComponent(input));
	}
	if(freeTextQuery){
		if(freeTextQuery.length<1){
			freeTextQuery = "";
		}
	}
	parentEl.find(".c4i-esgfsearch-ftq-input").val(freeTextQuery);

	return foundProperties;
};
