app.controller("account-ctrl", function($scope, $http) {

	$scope.items = [];
	$scope.form = {};
	$scope.tops = [];

	$scope.initialize = function() {
		// Load product
		$http.get("/rest/accounts").then(resp => {
			$scope.items = resp.data;
			$scope.form = {
				birthday: new Date(),
				photo: 'photo.svg',
			}
			$scope.items.forEach(item => {
				item.birthday = new Date(item.birthday)
			})
		});

		$http.get("/rest/topCustomer").then(resp => {
			$scope.tops = resp.data;

			// Xử lý dữ liệu để đưa vào biểu đồ
			$scope.labels = $scope.tops.map(function(item) {
				return item.accounts.username;
			});
			$scope.data = $scope.tops.map(function(item) {
				return item.sum;
			});

			// Vẽ biểu đồ
			var ctx = document.getElementById('myChart').getContext('2d');
			var myChart = new Chart(ctx, {
				type: 'bar',
				data: {
					labels: $scope.labels,
					datasets: [
						{
							label: 'Khách Hàng Thân Thiết',
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

	$scope.getDate = function() {
		var startDateValue = $scope.form1.startDate;
		var endDateValue = $scope.form1.endDate;
				

		$http.get(`/rest/topCustomer/${startDateValue}/${endDateValue}`).then(resp => {
			$scope.tops = resp.data;

			// Xử lý dữ liệu để đưa vào biểu đồ
			$scope.labels = $scope.tops.map(function(item) {
				return item.accounts.username;
			});
			$scope.data = $scope.tops.map(function(item) {
				return item.sum;
			});

			// Vẽ biểu đồ
			var ctx = document.getElementById('myChart').getContext('2d');
			var myChart = new Chart(ctx, {
				type: 'bar',
				data: {
					labels: $scope.labels,
					datasets: [
						{
							label: 'Khách Hàng Thân Thiết',
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
			birthday: new Date(),
			photo: 'photo.svg',
			gender: true,
			active: true,
		};
	}


	$scope.edit = function(item) {
		$scope.form = angular.copy(item);
	}


	$scope.create = function() {
		if (!$scope.form.photo === 'photo.svg' || !$scope.form.username || !$scope.form.first_name || !$scope.form.last_name || !$scope.form.password || !$scope.form.birthday || !$scope.form.email || !$scope.form.nationality) {

			Swal.fire({
				icon: 'warning',
				text: "Vui lòng nhập đầy đủ thông tin người dùng",
				showConfirmButton: false,
				timer: 1500
			})
			return;
		} else {
			var item = angular.copy($scope.form);
			$http.post(`/rest/accounts`, item).then(resp => {
				resp.data.createDate = new Date(resp.data.createDate)
				$scope.items.push(resp.data);
				$scope.reset();
				Swal.fire({
					icon: 'success',
					text: 'Thêm mới tài khoản thành công',
					showConfirmButton: false,
					timer: 1500
				})
			}).catch(error => {
				console.log("Error", error);
			});
		}
	}

	$scope.update = function() {
		if (!$scope.form.photo === 'photo.svg' || !$scope.form.username || !$scope.form.phone || !$scope.form.first_name || !$scope.form.last_name || !$scope.form.password || !$scope.form.birthday || !$scope.form.email || !$scope.form.nationality) {

			Swal.fire({
				icon: 'warning',
				text: "Vui lòng nhập thông tin trước khi cập nhật",
				showConfirmButton: false,
				timer: 1500
			})
			return;
		} else {
			var item = angular.copy($scope.form);
			$http.put(`/rest/accounts/${item.username}`, item).then(resp => {
				var index = $scope.items.findIndex(p => p.username == item.username);
				$scope.items[index] = item;
				$scope.reset();
				Swal.fire({
					icon: 'success',
					showConfirmButton: false,
					timer: 1500
				})
			}).catch(error => {
				console.log("Error", error);
			});
		}
	}

	$scope.delete = function(item) {
		$http.delete(`/rest/accounts/${item.username}`).then(resp => {
			var index = $scope.items.findIndex(p => p.username == item.username);
			$scope.items.splice(index, 1);
			$scope.reset();
			//Khởi Đầu
			$scope.initialize();
			Swal.fire({
				icon: 'success',
				text: 'Xóa tài khoản thành công',
				showConfirmButton: false,
				timer: 1500
			})
		}).catch(error => {
			Swal.fire({
				icon: 'warning',
				text: 'Vui lòng thu hồi quyền sử dụng !',
				showConfirmButton: false,
				timer: 1500
			})
			console.log("Error", error);
		});
	}


	$scope.imageChanged = function(files) {
		var data = new FormData();
		data.append('file', files[0]);
		$http.post('/rest/upload/images', data, {
			transformRequest: angular.identity,
			headers: { 'Content-Type': undefined }
		}).then(resp => {
			$scope.form.photo = resp.data.name;
		}).catch(error => {
			console.log("Error", error);
		})
	}


});