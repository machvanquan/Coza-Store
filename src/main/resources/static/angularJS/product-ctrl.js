app.controller("product-ctrl", function($scope, $http, $window) {

	$scope.items = [];
	$scope.noSell = [];
	$scope.tops = [];
	$scope.form = {};
	$scope.labels = [];
	$scope.data = [];

	$scope.initialize = function() {
		// Load product
		$http.get("/rest/products/onSell").then(resp => {
			$scope.items = resp.data;
			$scope.form = {
				image: 'upload0.png',
				image1: 'upload1.png',
				image2: 'upload2.png',
				image3: 'upload3.png',
				image4: 'upload4.png',
				available: true,
				create_date: new Date(),
			}
		});

		$http.get("/rest/products/noSell").then(resp => {
			$scope.noSell = resp.data;
		});

		$http.get("/rest/categories").then(resp => {
			$scope.cate = resp.data;
		});

		$http.get("/rest/topProduct").then(resp => {
			$scope.tops = resp.data;

			var maxDataPoints = 10;

			$scope.labels = $scope.tops.slice(0, maxDataPoints).map(function(item) {
				return item.products.name;
			});

			$scope.data = $scope.tops.slice(0, maxDataPoints).map(function(item) {
				return item.sold;
			});

			var ctx = document.getElementById('myChart').getContext('2d');
			var myChart = new Chart(ctx, {
				type: 'bar',
				data: {
					labels: $scope.labels,
					datasets: [
						{
							label: 'Sản Phẩm Bán Chạy',
							data: $scope.data,
							backgroundColor: '#83A2FF',
							borderColor: '#83A2FF',
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

	$scope.initialize();


	$scope.reset = function() {
		$scope.form = {
			image: 'upload0.png',
			image1: 'upload1.png',
			image2: 'upload2.png',
			image3: 'upload3.png',
			image4: 'upload4.png',
			available: true,
			create_date: new Date(),
		};
	}


	$scope.edit = function(item) {
		$scope.form = angular.copy(item);
	}


	$scope.create = function() {
		if ($scope.form.image === 'upload0.png' || $scope.form.image1 === 'upload1.png' || $scope.form.image2 === 'upload2png' || $scope.form.image3 === 'upload3.png' || $scope.form.image4 === 'upload4.png' || !$scope.form.name || !$scope.form.price || !$scope.form.describe || !$scope.form.categories.id) {

			Swal.fire({
				icon: 'warning',
				text: "Vui lòng nhập đầy đủ thông tin sản phẩm",
				showConfirmButton: false,
				timer: 1500
			})
			return;
		} else {
			var item = angular.copy($scope.form);
			item.sale = 0;
			item.available = false;
			$http.post(`/rest/products`, item).
				then(resp => {
					resp.data.createDate = new Date(resp.data.createDate)
					$scope.items.push(resp.data);
					$scope.reset();
					Swal.fire({
						icon: 'success',
						text: 'Đã thêm sản phẩm vào kho',
						showConfirmButton: false,
						timer: 1500
					})
					setTimeout(function() {
						$window.location.reload();
					}, 1500);
				}).catch(error => {

					console.log("Error", error);
				});
		}
	}

	$scope.update = function() {
		if ($scope.form.image === 'upload0.png' || $scope.form.image1 === 'upload1.png' || $scope.form.image2 === 'upload2png' || $scope.form.image3 === 'upload3.png' || $scope.form.image4 === 'upload4.png' || !$scope.form.name || !$scope.form.price || !$scope.form.describe || !$scope.form.categories.id) {

			Swal.fire({
				icon: 'warning',
				text: "Vui lòng nhập đầy đủ thông tin sản phẩm",
				showConfirmButton: false,
				timer: 1500
			})
			return;
		} else if ($scope.form.quantity < 1 || $scope.form.quantity === null) {
			Swal.fire({
				icon: 'warning',
				text: "Vui lòng nhập số lượng lớn hơn hoặc bằng 1",
				showConfirmButton: false,
				timer: 1500
			})
			console.log("Error", error);
		} else {
			var item = angular.copy($scope.form);
			$http.put(`/rest/products/${item.id}`, item).then(resp => {
				var index = $scope.items.findIndex(p => p.id == item.id);
				$scope.items[index] = item;
				$scope.reset();
				Swal.fire({
					icon: 'success',
					showConfirmButton: false,
					timer: 1500
				})
			}).catch(error => {
				Swal.fire({
					icon: 'warning',
					showConfirmButton: false,
					timer: 1500
				})
				console.log("Error", error);
			});
		}
	}

	$scope.push = function(item) {
		item.available = true;
		$http.put(`/rest/products/${item.id}`, item).then(resp => {
			var index = $scope.items.findIndex(p => p.id == item.id);
			$scope.items[index] = item;
			$scope.reset();
			Swal.fire({
				icon: 'success',
				showConfirmButton: false,
				timer: 1500
			})
			setTimeout(function() {
				$window.location.reload();
			}, 1500);
		}).catch(error => {
			console.log("Error", error);
		});
	}

	$scope.pull = function(item) {
		item.available = false;
		$http.put(`/rest/products/${item.id}`, item).then(resp => {
			var index = $scope.items.findIndex(p => p.id == item.id);
			$scope.items[index] = item;
			$scope.reset();
			Swal.fire({
				icon: 'success',
				showConfirmButton: false,
				timer: 1500
			})
			setTimeout(function() {
				$window.location.reload();
			}, 1500);
		}).catch(error => {
			console.log("Error", error);
		});
	}

	$scope.delete = function(item) {
		$http.delete(`/rest/products/${item.id}`).then(resp => {
			var index = $scope.items.findIndex(p => p.id == item.id);
			$scope.items.splice(index, 1);
			$scope.reset();
			//Khởi Đầu
			$scope.initialize();
			Swal.fire({
				icon: 'success',
				title: 'Delete Successfully !',
				showConfirmButton: false,
				timer: 1500
			})
		}).catch(error => {
			Swal.fire({
				icon: 'warning',
				title: 'Lỗi !',
				text: "Vui lòng chọn sản phẩm cần xóa !",
				showConfirmButton: false,
				timer: 1500
			}),
				console.log("Error", error);
		});
	}

	//upload hinh 0
	$scope.image0 = function(files) {
		var data = new FormData();
		data.append('file', files[0]);
		$http.post('/rest/upload/images', data, {
			transformRequest: angular.identity,
			headers: { 'Content-Type': undefined }
		}).then(resp => {
			$scope.form.image = resp.data.name;
		}).catch(error => {
			alert("Upload Image False !");
			console.log("Error", error);
		})
	}

	//upload hinh 1
	$scope.image1 = function(files) {
		var data = new FormData();
		data.append('file', files[0]);
		$http.post('/rest/upload/images', data, {
			transformRequest: angular.identity,
			headers: { 'Content-Type': undefined }
		}).then(resp => {
			$scope.form.image1 = resp.data.name;
		}).catch(error => {
			alert("Upload Image False !");
			console.log("Error", error);
		})
	}


	//upload hinh 2
	$scope.image2 = function(files) {
		var data = new FormData();
		data.append('file', files[0]);
		$http.post('/rest/upload/images', data, {
			transformRequest: angular.identity,
			headers: { 'Content-Type': undefined }
		}).then(resp => {
			$scope.form.image2 = resp.data.name;
		}).catch(error => {
			alert("Upload Image False !");
			console.log("Error", error);
		})
	}

	//upload hinh 3
	$scope.image3 = function(files) {
		var data = new FormData();
		data.append('file', files[0]);
		$http.post('/rest/upload/images', data, {
			transformRequest: angular.identity,
			headers: { 'Content-Type': undefined }
		}).then(resp => {
			$scope.form.image3 = resp.data.name;
		}).catch(error => {
			alert("Upload Image False !");
			console.log("Error", error);
		})
	}

	//upload hinh 4
	$scope.image4 = function(files) {
		var data = new FormData();
		data.append('file', files[0]);
		$http.post('/rest/upload/images', data, {
			transformRequest: angular.identity,
			headers: { 'Content-Type': undefined }
		}).then(resp => {
			$scope.form.image4 = resp.data.name;
		}).catch(error => {
			alert("Upload Image False !");
			console.log("Error", error);
		})
	}

	// PAGE Product
	$scope.pageProd = {
		page: 0,
		size: 5,
		get items() {
			var start = this.page * this.size;
			return $scope.items.slice(start, start + this.size);
		},
		get count() {
			return Math.ceil(1.0 * $scope.items.length / this.size)
		},
		first() {
			this.page = 0;
		},
		prev() {
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