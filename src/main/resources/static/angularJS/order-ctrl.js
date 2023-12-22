app.controller("order-ctrl", function($scope, $http) {

	$scope.items = [];
	$scope.itemsPending = [];
	$scope.itemsConfirm = [];
	$scope.itemsDelivery = [];
	$scope.itemsComplete = [];
	$scope.itemsCancel = [];
	$scope.tops = [];
	$scope.cash = [];
	$scope.paypal = [];

	$scope.form = {};
	$scope.form1 = {};

	$scope.labels = [];
	$scope.data = [];



	$scope.getTotalCount = function() {
		var totalCount = 0;
		for (var i = 0; i < $scope.tops.length; i++) {
			totalCount += $scope.tops[i].count;
		}
		return totalCount;
	};

	$scope.printContent = function(items) {
	
		$http.get(`/rest/orders/load-orders-detail/${items.id}`).then(resp => {
			$scope.formDetail = resp.data;
			$scope.getOrderStatus = $scope.form.order_status.id;

			var screenWidth = window.screen.width;
			var screenHeight = window.screen.height;

			var popupWidth = 1000;
			var popupHeight = 1000;
			var left = (screenWidth - popupWidth) / 2;
			var top = (screenHeight - popupHeight) / 2;

			var popupWin = window.open('', '_blank', 'width=' + popupWidth + ',height=' + popupHeight + ',left=' + left + ',top=' + top);
			popupWin.document.open();
			popupWin.document.write('<html><head><title>Print</title>' +
				'<style>' +
				'body { font-family: Arial, sans-serif; }' +
				'.table-responsive { width: 100%; }' +
				'.table { width: 100%; border-collapse: collapse; }' +
				'.table th, .table td { border: 1px solid #ddd; padding: 8px; text-align: center; }' +
				'.table th { background-color: #f2f2f2; }' +
				'.text-center { text-align: center; }' +
				'</style></head><body onload="window.print(); window.onafterprint = function(){ window.close(); }">' +
				'<div class="col-12 p-0">' +
				'<div class="card col-12 p-0">' +
				'<div class="row">' +
				'<div class="col-2 text-right">' +
				'<img height="20px;" style="margin-top: 30px;" src="/user/images/icons/logo-01.png">' +
				'</div>' +
				'<div class="col-6 text-center">' +
				'<h1 style="font-family: sans-serif; font-weight: bold; margin-top: 20px;">HÓA ĐƠN BÁN HÀNG</h1>' +
				'</div>' +
				'<div class="col-2 text-center">' +
				'<h5 style="font-family: sans-serif;">Kí hiệu: 2C21TBB</h5>' +
				'<h5 style="font-family: sans-serif;">Số: #' + items.id + '</h5>' +
				'<h4 style="font-family: sans-serif;">Ngày xuất hóa đơn: ' + items.create_date + '</h4>' +
				'</div>' +
				'</div>' +
				'<br>' +
				'<hr>' +
				'<div class="col-12 text-left mt-3 ml-2 border mr-4">' +
				'<p>Đơn vị bán: CozaStore </p>' +
				'<p>Mã số thuế: 0100010203 </p>' +
				'<p>Địa chỉ: Công viên phần mềm Quang Trung, QTSC Building 1, P Quận 12, Thành phố Hồ Chí Minh, Việt Nam</p>' +
				'<p>Liên hệ: 0123456789</p>' +
				'</div>' +
				'<hr>' +
				'<div class="col-12 text-left ml-2 border mr-4">' +
				'<p>Người mua hàng: ' + items.accounts.username + '</p>' +
				(items.ship_phone ? '<p>Số điện thoại: ' + items.ship_phone + '</p>' : '<p>Số điện thoại: ' + items.account_address.phone + '</p>') +
				(items.ship_notes ? '<p>Ghi chú: ' + items.ship_notes + '</p>' : '<p>Ghi chú: ' + items.account_address.notes + '</p>') +
				'<p>Địa chỉ: ' + (items.ship_address ? items.ship_address : items.account_address.address) 
				+ ', ' + (items.ship_ward ? items.ship_ward : items.account_address.ward) 
				+ ', ' + (items.ship_district ? items.ship_district : items.account_address.district) 
				+ ', ' + (items.ship_province ? items.ship_province : items.account_address.province) 
				+ '.</p>' +
				'<p>Đơn vị giao hàng: ' + items.ship_delivery + '</p>' +
				'<p>Hình thức thanh toán: ' + '<b>' + items.ship_pay + '</b>' + '</p>' +
				'</div>' +
				'</div>' +
				'<hr>' +
				'<br>' +
				'<div class="card-body">' +
				'<div class="table-responsive">' +
				'<table class="table table-hover">' +
				'<thead>' +
				'<tr class="text-center">' +
				'<th>Hình</th>' +
				'<th>Tên Sản Phẩm</th>' +
				'<th>Dung Lượng</th>' +
				'<th>Màu Sắc</th>' +
				'<th>Giá Thành</th>' +
				'<th>Số Lượng</th>' +
				'<th>Tổng Giá</th>' +
				'</tr>' +
				'</thead>' +
				'<tbody>');

			for (var i = 0; i < $scope.formDetail.length; i++) {
				var item = $scope.formDetail[i];
				popupWin.document.write('<tr class="text-center">' +
					'<td><img alt="' + item.products.image + '" style="width: 70px; height: 70px; border-radius: 0px;" src="/images/' + item.products.image + '"></td>' +
					'<td>' + item.products.name + '</td>' +
					'<td>' + item.ram + '</td>' +
					'<td>' + item.color + '</td>' +
					'<td>' + (item.price || 0).toLocaleString('en-US', { style: 'currency', currency: 'VND' }) + '</td>' +
					'<td>' + item.quantity + '</td>' +
					'<td>' + (item.price * item.quantity || 0).toLocaleString('en-US', { style: 'currency', currency: 'VND' }) + '</td>' +
					'</tr>');
			}

			popupWin.document.write('</tbody>' +
				'<tbody>' +
				'<tr>' +
				'<th class="text-right" colspan="6">Phí gửi hàng:</th>' +
				'<th>' + (items.ship_fee || 0).toLocaleString('en-US', { style: 'currency', currency: 'VND' }) + '</th>' +
				'</tr>' +
				'<tr>' +
				'<th class="text-right" colspan="6">Tổng thanh toán:</th>' +
					'<th>' + (items.total || 0).toLocaleString('en-US', { style: 'currency', currency: 'VND' }) + '</th>' +
				'</tr>' +
				'</tbody>' +
				'</table>' +
				'</div>' +
				'</div>' +
				'<hr>' +						
				'</div>' +
				'</div>' +
				'</div>' +
				'</div>' +
				'<div class="row">' +
				    '<div class="col-6 text-center">' +
				        '<h3>Người bán hàng</h3>' +
				        '<p><i>Chữ kí : Coza Store</i></p>' +
				        '<div><img style="width: 120px; height: 120px; border-radius: 50%;" src="/images/daumoc.jpeg"></div>' +
				   '</div>' +
				'</div>' +
				'<hr>' +	
				'<div class="row">' +
				   '<div class="col-6 text-center">' +
				        '<p><i>(Cần kiểm tra, đối chiếu và rà soát, nhận hóa đơn trước khi nhận hàng, xuất hàng.)</i></p>' +
				    '</div>' +				   
				'</div>' +		
				'</body></html>');
			popupWin.document.close();
		});
	};


	$scope.getDate = function() {
		var startDateValue = $scope.form1.startDate;
		var endDateValue = $scope.form1.endDate;
		
		$http.get(`/rest/OrderDTO/cash/${startDateValue}/${endDateValue}`).then(resp => {
			$scope.cash = resp.data;
		});
		
		$http.get(`/rest/OrderDTO/paypal/${startDateValue}/${endDateValue}`).then(resp => {
			$scope.paypal = resp.data;
		});
				
		$http.get(`/rest/revenueOrder/${startDateValue}/${endDateValue}`).then(resp => {
			$scope.tops = resp.data;

			$scope.labels = $scope.tops.map(function(item) {
				return item.order_status.id;
			});
			$scope.data = $scope.tops.map(function(item) {
				return item.count;
			});
			$scope.totalAmounts = $scope.tops.map(function(item) {
				return item.sum;
			});

			var ctx = document.getElementById('myChart').getContext('2d');
			var myChart = new Chart(ctx, {
				type: 'line',
				data: {
					labels: $scope.labels,
					datasets: [
						{
							label: 'Đơn Hàng',
							data: $scope.data,
							backgroundColor: 'rgba(255, 99, 132, 0.2)',
							borderColor: 'rgba(255, 99, 132, 1)',
							borderWidth: 1,
							barPercentage: 0.4,
						},
						{
							label: 'Doanh Thu',
							data: $scope.totalAmounts,
							backgroundColor: 'rgba(75, 192, 192, 0.2)',
							borderColor: 'rgba(75, 192, 192, 1)',
							borderWidth: 1,
							barPercentage: 0.4,
						}
					]
				},
				options: {
					scales: {
						y: [{
							beginAtZero: true
						}]
					}
				}
			});
		});
	}


	$scope.init = function() {
		$http.get(`/rest/orders/all-orders`).then(resp => {
			$scope.items = resp.data;
			$scope.form = $scope.items[0];
		})

		$http.get(`/rest/orders/order-pending`).then(resp => {
			$scope.itemsPending = resp.data;
		});

		$http.get(`/rest/orders/order-confirm`).then(resp => {
			$scope.itemsConfirm = resp.data;
		});

		$http.get(`/rest/orders/order-delivery`).then(resp => {
			$scope.itemsDelivery = resp.data;
		});

		$http.get(`/rest/orders/order-complete`).then(resp => {
			$scope.itemsComplete = resp.data;
		});

		$http.get(`/rest/orders/order-cancel`).then(resp => {
			$scope.itemsCancel = resp.data;
		});

		$scope.getOrderStatus = '';
		
		$http.get(`/rest/OrderDTO/cash`).then(resp => {
			$scope.cash = resp.data;
		});
		
		$http.get(`/rest/OrderDTO/paypal`).then(resp => {
			$scope.paypal = resp.data;
		});

		$http.get(`/rest/revenueOrder/all`).then(resp => {
			$scope.tops = resp.data;

			$scope.labels = $scope.tops.map(function(item) {
				return item.order_status.id;
			});
			$scope.data = $scope.tops.map(function(item) {
				return item.count;
			});
			$scope.totalAmounts = $scope.tops.map(function(item) {
				return item.sum;
			});

			var ctx = document.getElementById('myChart').getContext('2d');
			var myChart = new Chart(ctx, {
				type: 'line',
				data: {
					labels: $scope.labels,
					datasets: [
						{
							label: 'Đơn Hàng',
							data: $scope.data,
							backgroundColor: 'rgba(255, 99, 132, 0.2)',
							borderColor: 'rgba(255, 99, 132, 1)',
							borderWidth: 1,
							barPercentage: 0.4,
						},
						{
							label: 'Doanh Thu',
							data: $scope.totalAmounts,
							backgroundColor: 'rgba(75, 192, 192, 0.2)',
							borderColor: 'rgba(75, 192, 192, 1)',
							borderWidth: 1,
							barPercentage: 0.4,
						}
					]
				},
				options: {
					scales: {
						y: [{
							beginAtZero: true
						}]
					}
				}
			});

		});
	}



	$scope.init();

	$scope.findByAllOrder = function() {
		var kw = $scope.kw;
		if (kw.length > 0) {
			$http.get(`/rest/orders/search/${kw}`).then(resp => {
				$scope.items = resp.data;
			});
		} else {
			$http.get(`/rest/orders/all-orders`).then(resp => {
				$scope.items = resp.data;
			});
		}
	}



	$scope.formDetail = [];

	$scope.edit = function(item) {
		$scope.form = angular.copy(item);
		$http.get(`/rest/orders/load-orders-detail/${item.id}`).then(resp => {
			$scope.formDetail = resp.data;
			$scope.getOrderStatus = $scope.form.order_status.id;
		})
	}

	$scope.confirm = function() {
		var item = angular.copy($scope.form);
		item.order_status.id = 'Confirm';
		$scope.getOrderStatus = 'Confirm';

		Swal.fire({
			icon: 'success',
			showConfirmButton: false,
			timer: 1500
		});

		$http.put(`/rest/orders/${item.id}`, item)
			.then(function(response) {
				console.log('Success:', response.data);
			})
			.catch(function(error) {
				console.error('Error:', error);
			})
			.finally(function() {
				$http.get(`/rest/orders/order-confirm`).then(resp => {
					$scope.itemsConfirm = resp.data;
				});
			});

		$("#myTab li:eq(2) a").tab('show');
	};



	$scope.delivery = function() {
		var item = angular.copy($scope.form);
		item.order_status.id = 'Delivery';
		$scope.getOrderStatus = 'Delivery';

		Swal.fire({
			icon: 'success',
			showConfirmButton: false,
			timer: 1500
		})
		$http.put(`/rest/orders/${item.id}`, item)
			.then(function(response) {
				console.log('Success:', response.data);
			})
			.catch(function(error) {
				console.error('Error:', error);
			})
			.finally(function() {
				$http.get(`/rest/orders/order-delivery`).then(resp => {
					$scope.itemsDelivery = resp.data;
				});
			});

		$("#myTab li:eq(3) a").tab('show');
	};

	$scope.complete = function() {
		var item = angular.copy($scope.form);
		item.order_status.id = 'Complete';
		$scope.getOrderStatus = 'Complete';

		Swal.fire({
			icon: 'success',
			showConfirmButton: false,
			timer: 1500
		})
		$http.put(`/rest/orders/${item.id}`, item)
			.then(function(response) {
				console.log('Success:', response.data);
			})
			.catch(function(error) {
				console.error('Error:', error);
			})
			.finally(function() {
				$http.get(`/rest/orders/order-complete`).then(resp => {
					$scope.itemsComplete = resp.data;
				});
			});

		$("#myTab li:eq(4) a").tab('show');
	};

	$scope.cancel = function() {
		var item = angular.copy($scope.form);
		item.order_status.id = 'Cancel';
		item.ship_delivery = 'Shop Đã Hủy Đơn';
		$scope.getOrderStatus = 'Cancel';
		Swal.fire({
			icon: 'success',
			showConfirmButton: false,
			timer: 1500
		})
		$http.put(`/rest/orders/${item.id}`, item)
			.then(function(response) {
				console.log('Success:', response.data);
			})
			.catch(function(error) {
				console.error('Error:', error);
			})
			.finally(function() {
				$http.get(`/rest/orders/order-cancel`).then(resp => {
					$scope.itemsCancel = resp.data;
				});
			});
		$("#myTab li:eq(5) a").tab('show');
	};


	$scope.pager = {
		page: 0,
		size: 10,
		get items() {
			var start = this.page * this.size;
			return $scope.items.slice(start, start + this.size);
		},
		get count() {
			return Math.ceil(1.0 * $scope.items.length / this.size);
		},
		first() {
			this.page = 0;
		},
		pre() {
			this.page--;
			if (this.page < 0) {
				this.last();
			}
		},
		next() {
			this.page++;
			if (this.page >= this.count) {
				this.first();
			}
		},
		last() {
			this.page = this.count - 1;
		}

	}


	$scope.pagerPending = {
		page: 0,
		size: 10,
		get itemsPending() {
			var start = this.page * this.size;
			return $scope.itemsPending.slice(start, start + this.size);
		},
		get count() {
			return Math.ceil(1.0 * $scope.itemsPending.length / this.size);
		},
		first() {
			this.page = 0;
		},
		pre() {
			this.page--;
			if (this.page < 0) {
				this.last();
			}
		},
		next() {
			this.page++;
			if (this.page >= this.count) {
				this.first();
			}
		},
		last() {
			this.page = this.count - 1;
		}
	}


	$scope.pagerConfirm = {
		page: 0,
		size: 10,
		get itemsConfirm() {
			var start = this.page * this.size;
			return $scope.itemsConfirm.slice(start, start + this.size);
		},
		get count() {
			return Math.ceil(1.0 * $scope.itemsConfirm.length / this.size);
		},
		first() {
			this.page = 0;
		},
		pre() {
			this.page--;
			if (this.page < 0) {
				this.last();
			}
		},
		next() {
			this.page++;
			if (this.page >= this.count) {
				this.first();
			}
		},
		last() {
			this.page = this.count - 1;
		}
	}

	$scope.pagerDelivery = {
		page: 0,
		size: 10,
		get itemsDelivery() {
			var start = this.page * this.size;
			return $scope.itemsDelivery.slice(start, start + this.size);
		},
		get count() {
			return Math.ceil(1.0 * $scope.itemsDelivery.length / this.size);
		},
		first() {
			this.page = 0;
		},
		pre() {
			this.page--;
			if (this.page < 0) {
				this.last();
			}
		},
		next() {
			this.page++;
			if (this.page >= this.count) {
				this.first();
			}
		},
		last() {
			this.page = this.count - 1;
		}
	}


	$scope.pagerComplete = {
		page: 0,
		size: 10,
		get itemsComplete() {
			var start = this.page * this.size;
			return $scope.itemsComplete.slice(start, start + this.size);
		},
		get count() {
			return Math.ceil(1.0 * $scope.itemsComplete.length / this.size);
		},
		first() {
			this.page = 0;
		},
		pre() {
			this.page--;
			if (this.page < 0) {
				this.last();
			}
		},
		next() {
			this.page++;
			if (this.page >= this.count) {
				this.first();
			}
		},
		last() {
			this.page = this.count - 1;
		}
	}




	$scope.pagerCancel = {
		page: 0,
		size: 10,
		get itemsCancel() {
			var start = this.page * this.size;
			return $scope.itemsCancel.slice(start, start + this.size);
		},
		get count() {
			return Math.ceil(1.0 * $scope.itemsCancel.length / this.size);
		},
		first() {
			this.page = 0;
		},
		pre() {
			this.page--;
			if (this.page < 0) {
				this.last();
			}
		},
		next() {
			this.page++;
			if (this.page >= this.count) {
				this.first();
			}
		},
		last() {
			this.page = this.count - 1;
		}
	}

});
