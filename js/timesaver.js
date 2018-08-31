
//---------card js-----//
$(document).ready(function() {
	$('.card').mouseover(function(event) {
        /* Act on the event */
        $(this).addClass('cardChange');
    });
    $('.card').mouseout(function(event) {
            /* Act on the event */
        $(this).removeClass('cardChange');
     });
    var iconEventList = ['#icon-new-patient','#icon-existing','#icon-historical']
    for(i=0; i < iconEventList.length;i++)
    {
    	$(iconEventList[i]).mouseover(function(event){
    		$(this).removeClass('link-icon');
    		$(this).addClass('hover-icon');
    	});
    	$(iconEventList[i]).mouseout(function(event) {
    		/* Act on the event */
    		$(this).removeClass('hover-icon');
    		$(this).addClass('link-icon');
    	});

    }

    function awsDataRetrieve()
    {
    	$.ajax({
    		url: 'http://ec2-13-55-228-104.ap-southeast-2.compute.amazonaws.com:8080/timesaver2/webresources/cilnic/newPatientWaitingTime',
    		type: 'GET',
    		datatype:"json",
    		
    		//header:{'Access-Control-Allow-Origin': '*'}
    	})
    	.done(function(data) {
    		console.log("success");
    		
    	})
    	.fail(function() {
    		console.log("error");
    	})
    	.always(function() {
    		console.log("complete");
    	});
   
    	
    	
    }



	//--- data retrieval function --- //

	function dataRetrieve(query,time,clinic)
	{
		var elements = [];

		var database = firebase.database();
		var waitingtime = Number.parseInt(time);
		var date = new Date();
		var day = date.getUTCDate();
		return firebase.database().ref(query).once('value').then(function(snapshot)
		{ 
			var i = 0;
			var elements = [];
			try 
			{
				var childExist;
				if(clinic == "new patient")
				{
					childExist = true;
				}
				else
				{
				 	childExist = snapshot.child(clinic).exists();
				 
				}
				if (childExist)
				{
					snapshot.forEach( function(hospital)
				    {
				    	var element = new Map();
				    	var totalTreated = hospital.child('Total Treated').val();
				    	//var name = hospital.parent;
						if(totalTreated == 0)
						{
							totalTreated = 1;
						}
						var august = hospital.child('Waiting Aug').val();
						var sept = hospital.child('Waiting Sept').val();
						var augLength = august.length;
						var septLength = sept.length;
						if(waitingtime > augLength)
						{
							waitingtime = augLength;
						};
					
						var restPatient = (sept[waitingtime] - august[waitingtime]) * (day/31) + august[waitingtime];
						restMonth = restPatient/totalTreated;
						var name = hospital.ref.key;
						var address = hospital.child('Address').val();
						var center = hospital.child('Hospital').val();
						var phone = hospital.child('Phone').val();
						var postcode = hospital.child('Postcode').val();
						
						element.set('Hospital',name);
						element.set('Address', address);
						element.set('Health Center',center);
						element.set('Contact',phone);
						element.set('Postcode',postcode); 
						restMonth = restMonth.toFixed(1);
						element.set('rest of months',restMonth); 
						console.info(name);
						console.info("how long you may have to wait: " + element.get('rest of months') + " months");
						elements.push(element);
					// statements
					});
					return elements;
				}
				console.info(childExist);
				return false;
				
			
			}
			 catch(e) 
			{
			// statements
				console.log(e);
			}
			



		});
	}


	function listHtmlElement(record,parentElement,backgroundcolor,isExistUl)
	{
		//card -> li >- ul
		var clinic = record.get('Hospital');
		var address = record.get('Address');
		var center = record.get('Health Center');
		var contact = record.get('Contact');
		var postcode = record.get('Postcode');
		var restMonth = record.get('rest of months');
		
		if(!isExistUl)
		{
			var ulFramework = document.createElement('ul');
			ulFramework.setAttribute("id", "results");
			ulFrameworkCss = "overflow: hidden;height:500px; overflow-y:auto;" 
							+ "margin-top:20px;";
			ulFramework.style.cssText = ulFrameworkCss;
		 	
		}

	 	var listFramework = document.createElement('li');
	 	liCss = backgroundcolor + "margin-top:10px;"
	 	listFramework.style.cssText = liCss;

	 	//CLinic Div Setting ----Start// 
		var clinicDiv = document.createElement('div');
		var clinicDivCss = "text-align-last: left; font-size:20px;padding-top:20px;";
		clinicDiv.classList.add('col-12');
		clinicDiv.style.cssText = clinicDivCss
		var clinicNameText = document.createTextNode(clinic);
		var clinicLabel = document.createElement('label');
		var clinicLabelContent = document.createTextNode(clinic);
		clinicLabel.appendChild(clinicLabelContent);
		clinicDiv.appendChild(clinicLabel);
		listFramework.appendChild(clinicDiv);
		//clinicDiv.appendChild(clinicNameText);
		// clnic Div add to card body//
		// cardBody.appendChild(clinicDiv);
		//clinic Div setting ----END//

		//Address setting ---- Start//
		var addressDiv = document.createElement('div');
		var addressDivCss = "text-align-last: left;";
		addressDiv.classList.add('col-12');
		addressDiv.style.cssText = addressDivCss;
		var addressDataText = document.createTextNode(address);
		var addressLabel = document.createElement('label');
		var addressText = document.createTextNode('Address:\u00A0');
		addressLabel.appendChild(addressText);
		addressDiv.appendChild(addressLabel);
		addressDiv.appendChild(addressDataText);
		// address Div add to card body//
		listFramework.appendChild(addressDiv);
		//Address Setting --- End//


		var centerDiv = document.createElement('div');
		var centerDivCss = "text-align-last: left;";
		centerDiv.classList.add('col-12');
		centerDiv.style.cssText = centerDivCss;
		var centerDataText = document.createTextNode(center);
		var centerLabel = document.createElement('label');
		var centerText = document.createTextNode('Health Center:\u00A0');
		centerLabel.appendChild(centerText);
		centerDiv.appendChild(centerLabel);
		centerDiv.appendChild(centerDataText);
		//center add to card body//
		listFramework.appendChild(centerDiv);
		//center setting ---End//

		//PostCode setting ---- start//
		var postcodeDiv = document.createElement('div');
		var postcodeDivCss = "text-align-last: left;";
		postcodeDiv.classList.add('col-12');
		postcodeDiv.style.cssText = postcodeDivCss;
		var postcodeDataText = document.createTextNode(postcode);
		var postcodeLabel = document.createElement('label');
		var postcodeText = document.createTextNode('Post Code:\u00A0');
		postcodeLabel.appendChild(postcodeText);
		postcodeDiv.appendChild(postcodeLabel);
		postcodeDiv.appendChild(postcodeDataText);
		//postcode add to card body//
		listFramework.appendChild(postcodeDiv);

		//contact setting --- Start//
		var contactDiv = document.createElement('div');
		var contactDivCss = "text-align-last: left;";
		contactDiv.classList.add('col-12');
		contactDiv.style.cssText = contactDivCss;
		var contactDataText = document.createTextNode(contact);
		var contactLabel = document.createElement('label');
		var contactText = document.createTextNode('Contact:\u00A0');
		contactLabel.appendChild(contactText);
		contactDiv.appendChild(contactLabel);
		contactDiv.appendChild(contactDataText);
		//contact add to card body //
		listFramework.appendChild(contactDiv);
		//contact setting --- End//

		//contact setting --- Start//
		var restDiv = document.createElement('div');
		var restDivCss = "text-align-last: left;";
		restDiv.classList.add('col-12');
		restDiv.style.cssText = restDivCss;
		var restDataText = document.createTextNode(restMonth);
		var restLabel = document.createElement('label');
		var monthLabel = document.createElement('label');
		var isLess3Days = false;
		if(restMonth == 0)
		{
			restDataText = document.createTextNode("Less than 3 days \u00A0");
			isLess3Days = true;

		}
		var restText = document.createTextNode("How long you may have to wait: \u00A0");
		var monthText = document.createTextNode('\u00A0 Months');
		restLabel.appendChild(restText);
		monthLabel.appendChild(monthText);
		restDiv.appendChild(restLabel);
		restDiv.appendChild(restDataText);
		if(!isLess3Days)
		{
			restDiv.appendChild(monthLabel);
		}
		
		//contact add to card body //
		listFramework.appendChild(restDiv);
		//contact setting --- End//

		//add cardBody to card//

		if(!isExistUl)
		{
			ulFramework.appendChild(listFramework);
			//add card to cardArea
			parentElement.appendChild(ulFramework);
		}
		else
		{
			parentElement.appendChild(listFramework);
		}
		
		
	}
 	var searchButton = document.getElementById('search');
 	var searchBarButton = document.getElementById('searchButton');
 	var search;
 	var searchItems = new Map();
 	var hospital;
 	let uiHtml;
 	if(searchBarButton != 'undefined' && searchBarButton != null)
 	{
 		searchBarButton.addEventListener('click', function()
 		{
 			awsDataRetrieve();

 			var selectedItem = $("#clinicSelect option:selected").text();
 			console.info(selectedItem);
			var backgroundcolor;	
 			if(selectedItem == "All")
 			{
 				
 				
 				var resultlist = document.getElementById('resultlist');
 				resultlist.innerHTML = "";
 				resultlist.innerHTML = uiHtml;
 				console.info(resultlist);
 			}
 			else
 			{
 				var parentElement = document.getElementById('results');
 				parentElement.innerHTML = "";
 				if(searchItems.has(selectedItem))
 				{
 					var item = searchItems.get(selectedItem);
	 				if(item.get('Hospital') == hospital)
	 				{	
	 					backgroundcolor = "background-color:#f7f8fc;"
	 				}
	 				else
	 				{
	 					backgroundcolor = "background-color:#abebc6;";
	 				}
	 				listHtmlElement(item,parentElement,backgroundcolor,true);
	 			}
 				
 			}
 			
 		});

 	}

 	if(searchButton != 'undefined' && searchButton != null){
 		$("#search").on('click', function()
 		{
 			
 			var time;
 			var category;
 			if(searchButton)
 			{
 				time = $("#timeField").val();
 				//$("#timeSearchField").val(time);
 				hospital =  $("#hospitalSelect option:selected").text();
 				console.info("hospital" + hospital +":");
 				//$("#areaSearchField").val(areaCode);
 				category = $("#categorySelect option:selected").text();
 				console.info(category);
 				//$("#categorySearchSelect option:selected").val(category);
 			}
 			time = time.trim();
 			function shortEmptyValidation(time)
 			{
 				var isNotEmpty = time != "" && time != null ;
 				if(!isNotEmpty)
 				{
 					alert("Months can't be left blank");
 				}
 				return isNotEmpty;
 			};

 			var isCorrect = shortEmptyValidation(time);
 			
 			if(isCorrect)
 			{
 				for(i=0; i<time.length;i++)
 				{
	 				if(isNaN(time.charAt(i)) || Number.parseInt(time) == '0')
	 				{
	 					alert("Please Input correct month that you waited for");
	 					isCorrect = false;
	 					break;
	 				}
 				}
 			}
 			if(isCorrect)
 			{
 				$('#patientOption').modal('hide');
 				var prom = dataRetrieve(category,time,hospital);
 				prom.then(function(records)
 				{
 					try 
 					{
 						//var cardArea = document.getElementById("cardArea");
 						var parent= document.getElementById('resultlist');
 						parent.innerHTML = "";
 						if ($('#newSearchSection').hasClass('hidden-search-section') == false)
 						{
 							$('#newSearchSection').addClass('hidden-search-section');
 						}
 						if($('#newSearchSection').hasClass('search-section'))
 						{
 							$('#newSearchSection').removeClass('search-section');
 						}
 						$('#newSearchSection').css('visibility','hidden');
 						if(records != false)
 						{
	 						records.sort(function(small,large)
	 						{
	 							return small.get('rest of months') - large.get('rest of months');
	 						});
	 						var backgroundcolor = "background-color:#f7f8fc;";
	 						var existingHospital = false;
	 						for (let record of records)
	 						{
	 							var dentalClinic = record.get('Hospital');
	 							if(dentalClinic == hospital)
	 							{
	 								var parentElement = document.getElementById('resultlist');
	 								//buildHtmlElement(record,cardArea,backgroundcolor);
	 								listHtmlElement(record,parentElement,backgroundcolor,false);
	 								existingHospital = true;
	 								break;
	 							}
	 						}

	 						for (let record of records)
	 						{
	 							var clinic = record.get('Hospital');
	 							searchItems.set(clinic,record);
								if (clinic != hospital)
								{
									backgroundcolor = "background-color:#abebc6;";
									var parentElement = document.getElementById('results');
									//buildHtmlElement(record,cardArea,backgroundcolor);
									listHtmlElement(record,parentElement,backgroundcolor,true);
								}
	 						}
		 					var relist =  document.getElementById('resultlist');
		 					uiHtml = relist.innerHTML;
							$('#newSearchSection').removeClass('hidden-search-section');
							$('#newSearchSection').addClass('search-section');
							$('#newSearchSection').css('visibility','visible');
							$('#patientTag').text('Type: Existing Patient');
							$('#categoryLabel').text('Category: \u00A0' + category );
	 					}
	 					else
	 					{
	 						alert("This hospital does not offer this category of Service." 
	 								+ " Please enter the correct category given to you" 
	 								+ " when you were put on the waiting list");
	 					}
	 						
	 				}
	 				catch(e) 
	 				{
 						// statements
 						console.log(e);
 					}
 					
 					console.info("first");
 				 });		
 			}
			
 		});
 	}

 	var newPatient = document.getElementById('newPatient');
 	if(newPatient)
 	{
 		newPatient.addEventListener('click', function()
 		{
 			var category = "General";
 			var time = 1;
 			var tag = "new patient"
 			var prom = dataRetrieve(category,time,tag);
 			prom.then(function(records)
 			{
 				try 
 				{
 					
 					records.sort(function(small,large)
 					{
 						return small.get('rest of months') - large.get('rest of months');
 					});
					var parentElement = document.getElementById('resultlist');
					var backgroundcolor = "background-color:#abebc6;";
					parentElement.innerHTML = "";
					var i = 0;
					for (let record of records)
					{
						var clinic = record.get('Hospital');
	 					searchItems.set(clinic,record);
						if(i == 0)
						{
							listHtmlElement(record,parentElement,backgroundcolor,false);
						}
						else
						{
							parentElement = document.getElementById('results');
							listHtmlElement(record,parentElement,backgroundcolor,true);
						}
						i = i + 1;
					}
 					var relist = document.getElementById('resultlist');
 					uiHtml = relist.innerHTML;
 					$('#newSearchSection').removeClass('hidden-search-section');
 					$('#newSearchSection').addClass('search-section');
 					$('#newSearchSection').css('visibility','visible');
 					$('patientTag').text('Type: New Patient');
					$('#categoryLabel').text('Category: General' );
 				} 
 				catch(e) 
 				{
 					// statements
 					console.log(e);
 				}
 			});
 			
 			
 		});
 	}

});
