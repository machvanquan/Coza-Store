app.controller("category-ctrl", function($scope, $http) {

	$scope.cates = [];
	$scope.tops = [];
	$scope.form = {};
	$scope.form1 = {};
	$scope.labels = [];
	$scope.data = [];

	$scope.initialize = function() {

		$http.get("/rest/categories").then(resp => {
			$scope.cates = resp.data;
		});

		$http.get("/rest/revenueCategory").then(resp => {
			$scope.tops = resp.data;


			$scope.labels = $scope.tops.map(function(item) {
				return item.categories.name;
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
							label: 'Số Lượng Bán',
							data: $scope.data,
							backgroundColor: 'rgba(255, 99, 132, 0.2)',
							borderColor: 'rgba(75, 192, 192, 1)',
							borderWidth: 1,
							barPercentage: 0.4,
						},
						{
							label: 'Doanh Thu',
							data: $scope.totalAmounts,
							backgroundColor: 'rgba(75, 192, 192, 0.2)',
							borderColor: 'rgba(255, 99, 132, 1)',
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
		$scope.form = {};
	}

	$scope.edit = function(item) {
		$scope.form = angular.copy(item);
	}

	$scope.create = function() {
		if ( !$scope.form.name) {
       
        Swal.fire({
				icon: 'warning',
				text: "Vui lòng nhập tên loại hàng",
				showConfirmButton: false,
				timer: 1500
			})
        return;
    }else{
		var item = angular.copy($scope.form);
		$http.post(`/rest/categories`, item).then(resp => {
			$scope.cates.push(resp.data);
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

	$scope.update = function() {
		if ( !$scope.form.name) {   
        Swal.fire({
				icon: 'warning',
				text: "Vui lòng nhập tên loại hàng",
				showConfirmButton: false,
				timer: 1500
			})
        return;
    }else{
		var item = angular.copy($scope.form);
		$http.put(`/rest/categories/${item.id}`, item).then(resp => {
			var index = $scope.cates.findIndex(p => p.id == item.id);
			$scope.cates[index] = item;
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
		$http.delete(`/rest/categories/${item.id}`).then(resp => {
			var index = $scope.cates.findIndex(p => p.id == item.id);
			$scope.cates.splice(index, 1);
			$scope.reset();
			$scope.initialize();
			Swal.fire({
				icon: 'success',
				showConfirmButton: false,
				timer: 1500
			})
		}).catch(error => {
			Swal.fire({
				icon: 'warning',
				title: 'Loại hàng còn sản phẩm !',
				showConfirmButton: false,
				timer: 1500
			})
			console.log("Error", error);
		});
	}


});