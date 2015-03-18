module.exports = {
	registerBehaviour: function($scope){
		$scope.$DOM.applicationMenuItemsList.addEventListener('click', function(ev){
			var clickedElement = ev.target;
			if( !clickedElement.classList.contains('menu-item') ){
	            return;
	        }
			var selectedApplication = clickedElement.parentNode.dataset.application;
			
			$scope.selectApplication(selectedApplication);
		});
	}
}

