jQuery(document).ready(function() {
    var $ = jQuery, $inputURL = $('#sync_prod_url'), $buttonSel = $('.sel_sync_prod'), $buttonSet = $('.set_sync_prod'), $perRequest = parseInt(sync_products.per_request);
	
    if( !(typeof wp !== 'undefined' && wp.media && wp.media.editor ) ) return;
    
	wp.media.editor.send.attachment = function(props, attachment) {
		if(attachment.type !== 'text' || attachment.mime !== 'text/plain') return showMessage('Wybrany plik nie spełnia wymagań (plik tekstowy).');
					
   		$inputURL.val(attachment.url);
		$buttonSel.html(attachment.title);
	};
	
	$buttonSel.on('click', function() {
  		wp.media.editor.open( $(this) );
	});
	
	$buttonSet.on('click', function(){
		if( $inputURL.val().length <= 5 ) return wp.media.editor.open( $buttonSet );
		
		showMessage('Trwa oczekiwanie na odpowiedź od serwera... To może chwilę potrwać.', true);
		$buttonSet.attr('disabled', true);
		
		synchronize(0);
	});
	
	function synchronize(num) {
		var data = {
			'action' : 'synchronize_products',
			'file' : $inputURL.val(),
			'num' : num
		};
		
		$.post(ajaxurl, data).done(function(response) {
			if(typeof response.success === 'undefined' || !response.success) return showMessage(typeof response.data.msg !== 'undefined' ? response.data.msg : '\r\nWystąpił nieoczekiwany błąd podczas próby podłączenia synchronizatora. Spróbuj ponownie po odświeżeniu strony.', true);
			
			showMessage(response.data.msg);
			
			var snum = num+$perRequest;
			if(snum < response.data.ilosc) {
				$('#syncText').html( 'Trwa aktualizowanie stanów magazynowych... ('+snum+'/'+response.data.ilosc+')' );
				
				setTimeout(function() {
					synchronize(snum);
				}, 1000);
			} else {
				setTimeout(function(){
					showMessage('Aktualizacja gotowa.');
					$buttonSet.attr('disabled', false);
				}, 2000);
			}
		});
	}
	
	function showMessage(msg, clean=false) { 
		if(clean) $('#syncMsg').html('');
		return $('#syncMsg').append( msg ); 
	}
});