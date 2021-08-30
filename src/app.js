(function () {
  'use strict';

    angular.module('NarrowItDownApp',[])
    .controller('NarrowItDownController', NarrowItDownController)
    .service('MenuSearchService', MenuSearchService)
    .constant('ApiBasePath', "https://davids-restaurant.herokuapp.com")
    .directive('foundItems', FoundItemsDirective);

    function FoundItemsDirective() {
      var ddo = {
        templateUrl: 'foundItems.html',
        scope: {
          items: '<',
          onEmpty: '<',
          onRemove: '&',
        },
        controller: NarrowItDownController,
        controllerAs: 'list',
        bindToController: true
      };
      return ddo;
    }

    NarrowItDownController.$inject = ['MenuSearchService'];
    function NarrowItDownController(MenuSearchService) {
    var list = this;
    list.searchTerm = "";

    list.narrowItDown = function() {
      var promise = MenuSearchService.getMatchedMenuItems(list.searchTerm);
      promise.then(function (response) {
        list.items = response;
        if (list.items.length > 0){
          list.message = false;
        } else {
          list.message = true;
        };
      })
        .catch(function (error) {
          console.log("Something went terribly wrong.");
        });

      list.removeItem = function (itemIndex) {
        list.items.splice(itemIndex, 1);
        if (list.items.length == 0){
          list.message = true;
        };
      }
  }
}

    MenuSearchService.$inject = ['$http', 'ApiBasePath'];
    function MenuSearchService($http, ApiBasePath, searchTerm) {
      var service = this;
      service.getMatchedMenuItems = function (searchTerm)  {
        return $http({
          method: "GET",
          url: (ApiBasePath + "/menu_items.json")
        }).then(function (result){
        var found = [];
          for(let i = 0; i < result.data.menu_items.length; i++){
              if(result.data.menu_items[i].description.toLowerCase().search(searchTerm.toLowerCase()) > 0) {
                found.push(result.data.menu_items[i]);
              }
            }
            return found;
        });
      };    
    }
    
})();    