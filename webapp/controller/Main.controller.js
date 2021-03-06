sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function(Controller) {
	"use strict";

	return Controller.extend("com.boolanWeather.controller.Main", {
		onInit: function(){
			this._loadForecast();
		},
		
		_formatDate: function(date){
			var d = new Date(date),
			month = ''+ (d.getMonth() + 1),
			day = ''+ (d.getDate()),
			year = d.getFullYear();
			
			if (month.length < 2){
				month = '0' + month;
			}
			
			if (day.length < 2){
				day = '0' + day;
			}
			
			return [year, month, day].join('-');
		},
		
		_mapResults: function(results){
			var oModel = this.getView().getModel();
			oModel.setProperty("/city", results.city.name);
			oModel.setProperty("/country", "Poland");
			
			
			
			var aForecastResults = [];
			for(var i=0; i < results.list.length; i++){
				var oTemp=results.list[i].temp;
				var date=this._formatDate(results.list[i].dt * 1000);
				
				aForecastResults.push({
					date:		date,
					temp:		oTemp.eve,
					units:		"Celsius",
					humidity:	results.list[i].humidity
				});
			}
		
			oModel.setProperty("/items", aForecastResults);
		},
		
		_loadForecast: function(){
			var oView = this.getView();
			var oParams = {
				q: "Wroclaw",
				units: "metric",
				appid: "ee554b6dadcc2a02996b26ef6f4ab33a",
				cnt:	16,
				mode:	"json"
			};
			var sUrl = "/OpenWeather/data/2.5/forecast/daily";
			
		
		
				oView.setBusy(true);
			var self = this;
			
			$.get(sUrl, oParams)
				.done(function(results){
					oView.setBusy(false);
					self._mapResults(results);
				})
				.fail(function(err){
					oView.setBusy(false);
					if (err !== undefined){
						var oResp = $.parseJSON(err.ResponseText);
						sap.m.MessageToast.show(oResp.message, {duration: 6000});
					} else {
						sap.m.MessageToast.show("Coś nie poszło jak należy");
					}
				});
				
		}
		
	});
});