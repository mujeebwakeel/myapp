
$( document ).ready(function() {
	$( function() {
		var endDate, startDate, dateLength, totalAmount;
		var dateSelected = $("#info").html();
		var price = Number($("#price").html());
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
				if(endDate) {
					var selectedPeriod = []
					for (var d = new Date(startDate);
						d <= new Date(endDate);
						d.setDate(d.getDate() + 1)) {
							if(dateArray.indexOf($.datepicker.formatDate('mm/dd/yy', d)) == -1) {
								selectedPeriod.push($.datepicker.formatDate('mm/dd/yy', d));
							}
					}
					dateLength = selectedPeriod.length;
					totalAmount = price*dateLength;
					$("#payable-amount").val(totalAmount);
					$("#payable-amount").attr("readonly", true);
				}
			} else {
					endDate = $(this).datepicker("getDate");
					var selectedPeriod = []
					for (var d = new Date(startDate);
						d <= new Date(endDate);
						d.setDate(d.getDate() + 1)) {
							if(dateArray.indexOf($.datepicker.formatDate('mm/dd/yy', d)) == -1) {
								selectedPeriod.push($.datepicker.formatDate('mm/dd/yy', d));
							}
					}
					dateLength = selectedPeriod.length;
					totalAmount = (price*dateLength).toFixed(2);
					$("#payable-amount").val(totalAmount);
					$("#payable-amount").attr("readonly", true);
			}
		}
	});
	paypal.Buttons({
		createOrder: function(data, actions) {
		// This function sets up the details of the transaction, including the amount and line item details.
		return actions.order.create({
			purchase_units: [{
			amount: {
				value: totalAmount
			}
			}]
		});
		},
		onApprove: async function(data, actions) {
			const order = await actions.order.capture()
			$("#first-name").attr("readonly", true);
			$("#last-name").attr("readonly", true);
			$("#email").attr("readonly", true);
			$("#family-member").attr("readonly", true);
			$("#duration").css("display", "none");
			$("#button").attr("disabled", false);
			$("#submit-button").css("display", "block");
			$("#instruct").text("Kindly click the submit button to complete your booking and generate your receipt");
			$("#payment-button").css("display", "none");
			$("#paymentIdDiv").css("display", "block");
			$("#paymentId").val(order.id);
			$("#paymentIdDiv").attr("readonly", true);
			alert("Transaction successful. click 'OK' to submit your booking");

		},
		onError: err => {
			alert(err + ". Kindly retry later");
		}
	}).render('#paypal-button-container');
	//This function displays Smart Payment Buttons on your web page.
		});
	});