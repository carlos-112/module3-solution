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
      };
      return ddo;
    }

    NarrowItDownController.$inject = ['MenuSearchService'];
    function NarrowItDownController(MenuSearchService) {
    var list = this;
    list.searchTerm = "";
    list.message = "";

    list.narrowItDown = function() {
      var promise = MenuSearchService.getMatchedMenuItems();
      promise.then(function (response) {
        console.log(response.data);
        if (list.searchTerm != ""){
          var found = [];
          for(let i = 0; i < response.data.menu_items.length; i++){
              if(response.data.menu_items[i].description.toLowerCase().search(list.searchTerm.toLowerCase()) > 0) {
                found.push(response.data.menu_items[i]);
            }
            }
          list.items = found;

        } else {
          list.items = response.data.menu_items;
        }
        if(list.items.length != 0){
          list.message = "";
        } else {
          list.message = "Nothing Found!!";
        }
      })
        .catch(function (error) {
          console.log("Something went terribly wrong.");
        });

      list.removeItem = function (itemIndex) {
        list.items.splice(itemIndex, 1);
      }
  }
}

    MenuSearchService.$inject = ['$http', 'ApiBasePath'];
    function MenuSearchService($http, ApiBasePath, searchTerm) {
      var service = this;
      service.getMatchedMenuItems = function ()  {
        var response = $http({
          method: "GET",
          url: (ApiBasePath + "/menu_items.json")
        });
        return response;
      };    
    }
})();    