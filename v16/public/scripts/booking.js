
$( document ).ready(function() {
	$( function() {
		var dateSelected = $("#info").html();
		var dateArray = dateSelected.split(',');
		var dateToday = new Date();
		var dates = $("#from, #to").datepicker({
		defaultDate: "+2d",
		changeMonth: true,
		numberOfMonths: 1,
		minDate: dateToday,
		beforeShowDay: function(date) {
			var string = jQuery.datepicker.formatDate('mm/dd/yy', date);
			return [dateArray.indexOf(string) == -1]
		},
		onSelect: function(selectedDate) {
			var option = this.id == "from" ? "minDate" : "maxDate",
			instance = $(this).data("datepicker"),
			date = $.datepicker.parseDate(instance.settings.dateFormat || $.datepicker._defaults.dateFormat, selectedDate, instance.settings);
			dates.not(this).datepicker("option", option, date);
			if(this.id == "from") {
				startDate = $(this).datepicker("getDate");
			} else {
					endDate = $(this).datepicker("getDate");
					for (var d = new Date(startDate);
						d <= new Date(endDate);
						d.setDate(d.getDate() + 1)) {
							notAvailable.push($.datepicker.formatDate('mm-dd-yy', d));
					}
					console.log(notAvailable)
			}
		}
	  });
	});
});