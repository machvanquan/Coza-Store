app.controller("blog-ctrl", function($scope, $http) {

	$scope.items = [];
	$scope.form = {};

	$scope.initialize = function() {

		$http.get("/rest/blogs").then(resp => {
			$scope.items = resp.data;
			$scope.form = {
				createDate: new Date(),
				image: 'upload.png',
			}
			$scope.items.forEach(item => {
				item.create_date = new Date(item.create_date)
			})
		});


		$http.get("/rest/accounts").then(resp => {
			$scope.accounts = resp.data;
		});

	}


	$scope.initialize();


	$scope.reset = function() {
		$scope.form = {
			create_date: new Date(),
			image: 'upload.png',
		};
	}

	$scope.edit = function(item) {
		$scope.form = angular.copy(item);
	}


	$scope.create = function() {
		$http.get("/rest/accounts/logged").then(resp => {
			$scope.logged = resp.data;
			if (!$scope.form.title || $scope.form.image === 'upload.png' || !$scope.form.short_describe || !$scope.form.describe) {
				Swal.fire({
					icon: 'warning',
					text: "Vui lòng nhập đầy đủ thông tin !",
					showConfirmButton: false,
					timer: 1500
				})
				return;
			} else {				
				var item = angular.copy($scope.form);
				item.create_date = new Date();
				item.accounts = { username: $scope.logged.username };
				$http.post(`/rest/blogs`, item).then(resp => {					
					$scope.items.push(resp.data);
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
		});
	}

	$scope.update = function() {
		if (!$scope.form.title || $scope.form.image === 'upload.png' || !$scope.form.short_describe || !$scope.form.describe) {
			Swal.fire({
				icon: 'warning',
				text: "Vui lòng nhập đầy đủ thông tin !",
				showConfirmButton: false,
				timer: 1500
			})
			return;
		} else {
			var item = angular.copy($scope.form);
			item.create_date = new Date();
			$http.put(`/rest/blogs/${item.id}`, item).then(resp => {
				var index = $scope.items.findIndex(p => p.id == item.id);
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
		$http.delete(`/rest/blogs/${item.id}`).then(resp => {
			var index = $scope.items.findIndex(p => p.id == item.id);
			$scope.items.splice(index, 1);
			$scope.reset();
			$scope.initialize();
			Swal.fire({
				icon: 'success',
				showConfirmButton: false,
				timer: 1500
			})
		}).catch(error => {
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
			$scope.form.image = resp.data.name;
		}).catch(error => {
			console.log("Error", error);
		})
	}

});