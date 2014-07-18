function ProductController($scope, productGroups, productForms, dosageUnits, programs, categories, productDTO, Products, $location) {
  $scope.productGroups = productGroups;
  $scope.productForms = productForms;
  $scope.dosageUnits = dosageUnits;

  if (!isUndefined(productDTO)) {
    if (!isUndefined(productDTO.product)) {
      $scope.product = productDTO.product;
      $scope.programProducts = productDTO.programProductList;
      $scope.selectedProductGroupCode = isUndefined($scope.product.productGroup) ? undefined : $scope.product.productGroup.code;
      $scope.selectedProductFormCode = isUndefined($scope.product.form) ? undefined : $scope.product.form.code;
      $scope.selectedProductDosageUnitCode = isUndefined($scope.product.dosageUnit) ? undefined : $scope.product.dosageUnit.code;
    }
    else {
      $scope.product = {};
    }
    $scope.productLastUpdated = productDTO.productLastUpdated;
  }

  var success = function (data) {
    $scope.error = "";
    $scope.$parent.message = data.success;
    $scope.$parent.productId = data.productId;
    $scope.showError = false;
    $location.path('');
  };

  var error = function (data) {
    $scope.$parent.message = "";
    $scope.error = data.data.error;
    $scope.showError = true;
  };

  var setProductReferenceData = function () {
    $scope.product.productGroup = _.where($scope.productGroups, {code: $scope.selectedProductGroupCode})[0];
    $scope.product.form = _.where($scope.productForms, {code: $scope.selectedProductFormCode})[0];
    $scope.product.dosageUnit = _.where($scope.dosageUnits, {code: $scope.selectedProductDosageUnitCode})[0];
  };

  $scope.save = function () {
    if ($scope.productForm.$error.required) {
      $scope.showError = true;
      $scope.error = "form.error";
      return;
    }
    setProductReferenceData();

    if ($scope.product.id) {
      Products.update({id: $scope.product.id}, {product: $scope.product}, success, error);
    }
    else {
      Products.save({}, {product: $scope.product}, success, error);
    }
  };

  $scope.cancel = function () {
    $scope.$parent.productId = undefined;
    $scope.$parent.message = "";
    $location.path('#/search');
  };

}

ProductController.resolve = {
  productGroups: function ($q, $timeout, ProductGroups) {
    var deferred = $q.defer();

    $timeout(function () {
      ProductGroups.get({}, function (data) {
        deferred.resolve(data.productGroupList);
      }, {});
    }, 100);
    return deferred.promise;
  },

  productForms: function ($q, $timeout, ProductForms) {
    var deferred = $q.defer();

    $timeout(function () {
      ProductForms.get({}, function (data) {
        deferred.resolve(data.productFormList);
      }, {});
    }, 100);
    return deferred.promise;
  },

  dosageUnits: function ($q, $timeout, DosageUnits) {
    var deferred = $q.defer();

    $timeout(function () {
      DosageUnits.get({}, function (data) {
        deferred.resolve(data.dosageUnitList);
      }, {});
    }, 100);
    return deferred.promise;
  },

  programs: function ($q, $timeout, Program) {
    var deferred = $q.defer();

    $timeout(function () {
      Program.get({}, function (data) {
        deferred.resolve(data.programs);
      }, {});
    }, 100);
    return deferred.promise;
  },

  categories: function ($q, $timeout, ProductCategories) {
    var deferred = $q.defer();

    $timeout(function () {
      ProductCategories.get({}, function (data) {
        deferred.resolve(data.productCategoryList);
      }, {});
    }, 100);
    return deferred.promise;
  },

  productDTO: function ($q, $route, $timeout, Products) {
    if ($route.current.params.id === undefined) return undefined;

    var deferred = $q.defer();
    var productId = $route.current.params.id;

    $timeout(function () {
      Products.get({id: productId}, function (data) {
        deferred.resolve(data.productDTO);
      }, {});
    }, 100);
    return deferred.promise;
  }
};