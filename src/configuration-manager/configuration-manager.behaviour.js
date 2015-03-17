module.exports = {
	registerBehaviour: function($scope){
		$scope.$DOM.applicationMenuItemsList.addEventListener('click', function(ev){
			var clickedElement = ev.target;
			if( !clickedElement.classList.contains('menu-item') ){
	            return;
	        }
			var selectedApplication = clickedElement.parentNode.dataset.application;
			Array.prototype.slice.call($scope.$DOM.applicationMenuItemsList.children).forEach( function(li){
		        li.classList.remove('active');
		        if(li.dataset.application === selectedApplication){
		            li.classList.add('active');
		        }
		    });
			$scope.selectApplication(selectedApplication);
		});
	}
}

