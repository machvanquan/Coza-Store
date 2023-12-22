const app = angular.module("cozastore", []);
app.controller("ctrl", function($scope, $http, $timeout) {


	$scope.printContent = function() {

		var orderId = document.getElementById('orderId').innerText.split(' : ')[1];

		var orderId = document.getElementById('orderId').innerText.split(' : ')[1];

		var itemsPromise = $http.get(`/rest/orders/${orderId}`).then(resp => resp.data);

		var formDetailPromise = $http.get(`/rest/orders/load-orders-detail/${orderId}`).then(resp => resp.data);

		Promise.all([itemsPromise, formDetailPromise])
			.then(([items, formDetail]) => {
				$scope.items = items;
				$scope.formDetail = formDetail;

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
					'<br>' +
					'<div class="row">' +
					'<div class="col-6 text-center">' +
					'<div><img style="width: 100%;" src="/images/baohanh.jpg"></div>' +
					'</div>' +
					'</div>' +
					'<div class="row">' +
					'<div class="col-6 text-center">' +
					'<h3>Người bán hàng</h3>' +
					'<p><i>Chữ kí : Coza Store</i></p>' +
					'<div><img style="width: 120px; height: 120px; border-radius: 50%;" src="/images/daumoc.jpeg"></div>' +
					'</div>' +
					'</div>' +
					'<br>' +
					'<hr>' +
					'<div class="row">' +
					'<div class="col-6 text-center">' +
					'<p><i>(Cần kiểm tra, đối chiếu và rà soát, nhận hóa đơn trước khi nhận hàng, xuất hàng.)</i></p>' +
					'</div>' +
					'</div>' +
					'</body></html>');
				popupWin.document.close();
			})
			.catch(error => {
				console.error('Error fetching data:', error);
			});

	};


	$scope.loadSALE = function() {

		var startTimeFromStorage = localStorage.getItem('startTime');

		var endTimeFromStorage = localStorage.getItem('endTime');

		var nowTimestamp = new Date().toISOString();

		if (startTimeFromStorage && endTimeFromStorage) {
			var startTimestamp = new Date(startTimeFromStorage).toISOString();
			var endTimestamp = new Date(endTimeFromStorage).toISOString();

			if (startTimestamp <= nowTimestamp && nowTimestamp <= endTimestamp) {
				console.log('Trong khoảng thời gian hợp lệ');
				document.getElementById("quandz").style.display = 'block';

			} else {
				console.log('Ngoài khoảng thời gian hợp lệ');
				document.getElementById('quandz').style.display = 'none';
			}
		} else {
			console.log('Thời gian không hợp lệ trong Local Storage');
			document.getElementById('quandz').style.display = 'none';
		}

	}

	$timeout(function() {
		$scope.loadSALE();
	});



	$scope.changeRam = function() {

		var priceDisplay = document.getElementById('priceDisplay');
		var oldPriceInput = document.getElementById('oldPrice');
		var oldPrice = oldPriceInput.value;

		function updatePriceDisplay(newPrice) {
			priceDisplay.innerHTML = Number(newPrice).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
		}

		var selectedRam = $scope.ram;
		console.log(selectedRam);

		switch (selectedRam) {
			case '128G':
				var newPrice = oldPrice;
				break;
			case '256G':
				var newPrice = parseFloat(oldPrice) + 500000;
				break;
			case '512G':
				var newPrice = parseFloat(oldPrice) + 1000000;
				break;
			case '1TB':
				var newPrice = parseFloat(oldPrice) + 2000000;
				break;
			default:
				var newPrice = oldPrice;
				break;
		}
		updatePriceDisplay(newPrice);
	};

	$scope.ram = '128G';
	$scope.color = 'Black';
	$scope.qty = 1;

	$scope.congQuantity = function() {
		$scope.qty++;
	}

	$scope.truQuantity = function() {
		if ($scope.qty > 1) {
			$scope.qty--;
		} else {
			$scope.qty = 1;
		}
	}

	$scope.updateRam = function() {
		var selectedQuantityElement = document.getElementById('ram');
		if (selectedQuantityElement) {
			var selectedQuantity = selectedQuantityElement.value;
			$scope.ram = selectedQuantity || '128G';
			console.log("Quantity Ram Updated: " + $scope.ram);
		} else {
			$scope.ram = '128G'
		}
	}

	$scope.updateColor = function() {
		var selectedQuantityElement = document.getElementById('color');
		if (selectedQuantityElement) {
			var selectedQuantity2 = selectedQuantityElement.value;
			$scope.color = selectedQuantity2 || 'Black';
			console.log("Quantity color Updated: " + $scope.color);
		} else {
			$scope.color = 'Black'
		}
	}

	$scope.vouchers = [];

	$scope.voucher = function() {
		var username = $("#username").text();
		$http.get(`/rest/account-voucher/${username}`).then(resp => {
			$scope.vouchers = resp.data;
		});
	}


	$scope.voucher();
	$scope.voucherCost = null;
	$scope.selectedVoucher = {};
	$scope.voucherID = null;

	$scope.applyVoucher = function() {
		var id = document.getElementById('voucher').value;
		if (id === '0') {
			$scope.voucherCost = 0;
			Swal.fire({
				icon: 'warning',
				title: 'Đã gỡ mã giảm giá',
				showConfirmButton: false,
				timer: 1500
			})
		} else {
			$http.get(`/rest/vouchers/${id}`).then(resp => {
				$scope.selectedVoucher = resp.data;
				
				var selectedVoucher = $scope.selectedVoucher.price;

				var formattedDate = new Date();

				var year = formattedDate.getFullYear();
				var month = String(formattedDate.getMonth() + 1).padStart(2, '0');
				var day = String(formattedDate.getDate()).padStart(2, '0');

				var now_date = `${year}-${month}-${day}`;

				if ($scope.selectedVoucher.quantity > 0 && $scope.selectedVoucher.end_date >= now_date && $scope.selectedVoucher.price < $cart.amount) {
					$scope.voucherCost = parseFloat(selectedVoucher);
					$cart.tong;
					Swal.fire({
						icon: 'success',
						title: 'Đã áp dụng mã giảm giá',
						showConfirmButton: false,
						timer: 1500
					})
				} else {
					$scope.voucherCost = 0;
					$cart.tong;
					Swal.fire({
						icon: 'error',
						title: 'Đã hết hạn hoặc số lượng và không hợp lệ !',
						showConfirmButton: false,
						timer: 2000
					})
				}
			});

		}
	};



	/////////////////////////////////////////////////////////
	$scope.addresss = [];
	$scope.address = function() {
		var username = $("#username").text();
		$http.get(`/rest/account-address/${username}`).then(resp => {
			$scope.addresss = resp.data;
		});
	}

	$scope.address();

	/////////////////////////////////////////////////////////




	var $cart = $scope.cart = {
		items: [],
		add(id, ram, color) {
			var item = this.items.find(item => item.id == id && item.ram == ram && item.color == color);

			if (item) {
				item.qty++;
				item.ram = $scope.ram;
				item.color = $scope.color;
				if (item.ram === '256G') {
					item.price += 500000;
				}
				if (item.ram === '512G') {
					item.price += 1000000;
				}
				if (item.ram === '1TB') {
					item.price += 2000000;
				}
				Swal.fire({
					icon: 'success',
					title: 'Success',
					showConfirmButton: false,
					timer: 1500
				});
			} else {
				$http.get(`/rest/products/${id}`).then(resp => {
					$scope.updateRam();
					$scope.updateColor();
					resp.data.qty = $scope.qty;
					resp.data.ram = $scope.ram;
					resp.data.color = $scope.color;
					resp.data.price1 = resp.data.price * (100 - resp.data.sale) / 100;
					if (resp.data.categories && (resp.data.categories.id === 5 || resp.data.categories.id === 6)) {
						resp.data.ram = '';
						resp.data.color = '';
					}
					if (resp.data.ram === '256G') {
						resp.data.price += 500000;
					}
					if (resp.data.ram === '512G') {
						resp.data.price += 1000000;
					}
					if (resp.data.ram === '1TB') {
						resp.data.price += 2000000;
					}
					this.items.push(resp.data);
					this.saveToLocalStorage();
					Swal.fire({
						icon: 'success',
						showConfirmButton: false,
						timer: 1500
					});
				});
			}
		},
		remove(id) {
			var index = this.items.findIndex(item => item.id == id);
			this.items.splice(index, 1);
			this.saveToLocalStorage();
		},
		clear() {
			this.items = []
			this.saveToLocalStorage();
		},
		amt_of(item) {
			return (item.price * item.qty);
		},
		get count() {
			return this.items
				.map(item => item.qty)
				.reduce((total, qty) => total += qty, 0);
		},
		get amount() {
			return this.items
				.map(item => this.amt_of(item))
				.reduce((total, amt) => total += amt, 0);
		},
		get tong() {
			const shippingCost = 250000;
			const voucherCost = $scope.voucherCost;
			const total = $cart.amount + shippingCost - voucherCost;
			if (total > 50000000) {
				return total - shippingCost;
			}
			return total;
		},
		get ship() {
			const shippingCost = 250000;
			if (this.tong > 50000000) {
				return 0;
			}
			return shippingCost;
		},
		saveToLocalStorage() {
			this.items.forEach(item => {
				if (item.ram === '128G') {
					item.price = item.price1;
				} else if (item.ram === '256G') {
					item.price = item.price1 + 500000;
				} else if (item.ram === '512G') {
					item.price = item.price1 + 1000000;
				} else if (item.ram === '1TB') {
					item.price = item.price1 + 2000000;
				}
			});
			var json = JSON.stringify(angular.copy($scope.cart.items));
			localStorage.setItem("cart", json);
		},
		loadFromLocalStorage() {
			var json = localStorage.getItem("cart");
			this.items = json ? JSON.parse(json) : [];
		}
	}

	$cart.loadFromLocalStorage();


	// Favorite 	
	var $favorite = $scope.favorite = {
		favorite_items: [],
		add(id) {
			var favorite_item = this.favorite_items.find(favorite_item => favorite_item.id == id);
			Swal.fire({
				icon: 'success',
				showConfirmButton: false,
				timer: 1500
			})
			if (favorite_item) {
				Swal.fire({
					icon: 'error',
					title: 'Đã gỡ khỏi yêu thích !',
					showConfirmButton: false,
					timer: 1500
				})
				favorite_item = false;
				var index = this.favorite_items.findIndex(favorite_item => favorite_item.id == id);
				this.favorite_items.splice(index, 1);
				this.saveFavoriteToLocalStorage();
			} else {
				$http.get(`/rest/products/${id}`).then(resp => {
					resp.data.qty = $scope.qty;
					resp.data.price1 = resp.data.price * (100 - resp.data.sale) / 100;
					this.favorite_items.push(resp.data);
					this.saveFavoriteToLocalStorage();
				})
			}
		},
		remove(id) {
			id = false;
			var index = this.favorite_items.findIndex(favorite_item => favorite_item.id == id);
			this.favorite_items.splice(index, 1);
			Swal.fire({
				icon: 'error',
				title: 'Đã gỡ khỏi yêu thích !',
				showConfirmButton: false,
				timer: 1500
			})
			this.saveFavoriteToLocalStorage();

		},
		clear() {
			this.favorite_items = []
			this.saveFavoriteToLocalStorage();
		},
		get count() {
			return this.favorite_items
				.map(favorite_item => favorite_item.qty)
				.reduce((total, qty) => total += qty, 0);
		},
		saveFavoriteToLocalStorage() {
			var json = JSON.stringify(angular.copy(this.favorite_items));
			localStorage.setItem("favorite", json);
		},
		loadFavoriteFromLocalStorage() {
			var json = localStorage.getItem("favorite");
			this.favorite_items = json ? JSON.parse(json) : [];
		}
	}

	$favorite.loadFavoriteFromLocalStorage();


	// Sản Phẩm Vừa Xem

	var $viewed = $scope.viewed = {
		viewed_items: [],
		add(id) {
			var viewed_item = this.viewed_items.find(viewed_item => viewed_item.id == id);
			if (viewed_item) {
				viewed_item.date = new Date();
				this.saveViewedToLocalStorage();
			} else {
				$http.get(`/rest/products/${id}`).then(resp => {
					resp.data.qty = $scope.qty;
					resp.data.date = new Date();
					resp.data.price1 = resp.data.price * (100 - resp.data.sale) / 100;
					this.viewed_items.push(resp.data);
					this.saveViewedToLocalStorage();
				})
			}
		},
		remove(id) {
			id = false;
			var index = this.viewed_items.findIndex(viewed_item => viewed_item.id == id);
			this.viewed_items.splice(index, 1);
			Swal.fire({
				icon: 'error',
				title: 'Remove from viewed !',
				showConfirmButton: false,
				timer: 1000
			})
			this.saveViewedToLocalStorage();

		},
		clear() {
			this.viewed_items = []
			this.saveViewedToLocalStorage();
		},
		get count() {
			return this.viewed_items
				.map(viewed_item => viewed_item.qty)
				.reduce((total, qty) => total += qty, 0);
		},
		saveViewedToLocalStorage() {
			var json = JSON.stringify(angular.copy(this.viewed_items));
			localStorage.setItem("viewed", json);
		},
		loadViewedFromLocalStorage() {
			var json = localStorage.getItem("viewed");
			this.viewed_items = json ? JSON.parse(json) : [];
		}
	}

	$viewed.loadViewedFromLocalStorage();

	$scope.useVoucher = function() {
		var id = document.getElementById('voucher').value;

		if (id !== '0') {
			// Giảm giá trị quantity đi 1
			if ($scope.selectedVoucher && $scope.selectedVoucher.quantity > 0) {
				$scope.selectedVoucher.quantity -= 1;
			}

			$http.put(`/rest/vouchers/${id}`, $scope.selectedVoucher).then(resp => {
			}).catch(error => {
				console.log("Error", error);
			});
		}
	};

	const host = "https://provinces.open-api.vn/api/";
	var callAPI = (api) => {
		return axios.get(api)
			.then((response) => {
				renderData(response.data, "province");
			});
	}
	callAPI('https://provinces.open-api.vn/api/?depth=1');
	var callApiDistrict = (api) => {
		return axios.get(api)
			.then((response) => {
				renderData(response.data.districts, "district");
			});
	}
	var callApiWard = (api) => {
		return axios.get(api)
			.then((response) => {
				renderData(response.data.wards, "ward");
			});
	}

	var renderData = (array, select) => {
		let row = ' <option disable value="">Chọn Thành Phố / Tỉnh</option>';
		array.forEach(element => {
			row += `<option value="${element.code}">${element.name}</option>`
		});
		document.querySelector("#" + select).innerHTML = row
	}

	$("#province").change(() => {
		callApiDistrict(host + "p/" + $("#province").val() + "?depth=2");
		printResult();
	});
	$("#district").change(() => {
		callApiWard(host + "d/" + $("#district").val() + "?depth=2");
		printResult();
	});

	$scope.selectedWards = [];
	$scope.selectedProvice = [];
	$scope.selectedDistrict = [];

	$("#ward").change(() => {
		let selectedDistrict = $("#district option:selected").text();
		let selectedProvice = $("#province option:selected").text();
		let selectedWard = $("#ward option:selected").text();
		$scope.order.ship_ward = selectedWard;
		$scope.order.ship_province = selectedProvice;
		$scope.order.ship_district = selectedDistrict;
	});


	// Đặt hàng - Tiền Mặt
	$scope.order = {
		ship_address: "",
		ship_notes: "",
		ship_phone: "",
		ship_ward: "",
		ship_district: "",
		ship_province: "",
		ship_delivery: "",
		create_date: new Date(),
		accounts: { username: $("#username").text() },
		order_status: { id: "Pending" },
		account_address: { id: "" },
		get orderDetails() {
			return $scope.cart.items.map(item => {
				return {
					products: { id: item.id },
					price: item.price,
					quantity: item.qty,
					ram: item.ram,
					color: item.color
				}
			});
		},
		get total() {
			return $cart.tong - ($scope.voucherCost || 0);
		},
		purchase() {
			var order = angular.copy(this);
			order.ship_pay = "Cash";
			order.total = $cart.tong;
			order.ship_fee = $cart.ship;
			order.ship_delivery = document.getElementById("shipping").value;
			order.account_address.id = document.getElementById("address").value || 1;
			if ($cart.amount == 0) {
				Swal.fire({
					icon: 'error',
					title: 'Kiểm tra lại đơn hàng',
					showConfirmButton: false,
					timer: 1500
				})
			} else {
				$http.post("/rest/orders", order).then(resp => {
					Swal.fire({
						icon: 'success',
						title: 'Đặt Hàng Thành Công',
						showConfirmButton: false,
						timer: 2500
					})
					$scope.useVoucher();
					$scope.cart.clear();
					$scope.voucherCost = null;
					setTimeout(function() {
						location.href = "/home/order/detail/" + resp.data.id;
					}, 2500);
				}).catch(error => {
					Swal.fire({
						icon: 'error',
						title: 'Kiểm tra lại đơn hàng',
						showConfirmButton: false,
						timer: 1500
					})
					console.log(error)
				})
			}

		},
		paypal() {
			var order = angular.copy(this);
			order.ship_pay = "Paypal";
			order.total = $cart.tong;
			order.ship_fee = $cart.ship;
			order.ship_delivery = document.getElementById("shipping").value;
			order.account_address.id = document.getElementById("address").value || 1;
			if ($cart.amount == 0 || $cart.amount == null) {
				Swal.fire({
					icon: 'error',
					title: 'Kiểm tra lại đơn hàng',
					showConfirmButton: false,
					timer: 1500
				})
			} else {
				$http.post("/rest/orders", order).then(resp => {
					Swal.fire({
						icon: 'success',
						title: 'Đặt Hàng Thành Công',
						showConfirmButton: false,
						timer: 2500
					})
					$scope.useVoucher();
					$scope.cart.clear();
					$scope.voucherCost = null;
					setTimeout(function() {
						location.href = "/home/order/detail/" + resp.data.id;
					}, 2500);

				}).catch(error => {
					Swal.fire({
						icon: 'error',
						title: 'Kiểm tra lại đơn hàng',
						showConfirmButton: false,
						timer: 1500
					})
					console.log(error)
				})
			}

		},
		vnpay() {
			var order = angular.copy(this);
			order.ship_pay = "VNPay";
			order.total = $cart.tong;
			order.account_address.id = document.getElementById("address").value;
			if ($cart.amount == 0 || $cart.amount == null) {
				Swal.fire({
					icon: 'error',
					title: 'Error !',
					showConfirmButton: false,
					timer: 1500
				})
			} else {
				$http.post("/rest/orders", order).then(resp => {
					Swal.fire({
						icon: 'success',
						title: 'Payment Success !',
						showConfirmButton: false,
						timer: 2500
					})
					$scope.useVoucher();
					$scope.cart.clear();
					$scope.voucherCost = null;
					setTimeout(function() {
						location.href = "/home/order/detail/" + resp.data.id;
					}, 2500);

				}).catch(error => {
					Swal.fire({
						icon: 'error',
						title: 'Error !',
						showConfirmButton: false,
						timer: 1500
					})
					console.log(error)
				})
			}

		}
	}


	$scope.paypalAmount = Math.round($cart.tong / 24000);



	$scope.vnpay = function() {
		Swal.fire({
			icon: 'error',
			title: 'Payment VNPay !',
			showConfirmButton: false,
			timer: 2000
		})
	};

	$scope.momo = function() {
		Swal.fire({
			icon: 'error',
			title: 'Payment Momo !',
			showConfirmButton: false,
			timer: 2000
		})
	};

	// Rating
	$scope.formRV = {};

	$scope.initRV = function() {
		$scope.formRV = {
			image: 'upload.png',
		}
	}

	$scope.initRV();


	$scope.createReview = function(id) {
		console.log(id);

		Swal.fire({
			icon: 'success',
			title: 'Đánh giá thành công !',
			showConfirmButton: false,
			timer: 1000
		})
	}

	$scope.imageRate = function(files) {
		var data = new FormData();
		data.append('file', files[0]);
		$http.post('/rest/upload/images', data, {
			transformRequest: angular.identity,
			headers: { 'Content-Type': undefined }
		}).then(resp => {
			$scope.formRV.image = resp.data.name;
		}).catch(error => {
			alert("Upload Image False !");
			console.log("Error", error);
		})
	}

})