if (typeof module === 'object') { window.module = module; module = undefined; }
    
$(document).ready(function(){
    $(document).on('click', '.redirectSite', function(){
        window.location.href = '/allegro/' + $(this).data('to');
    });

    /*$(document).on('click', '#allegroOffersButton', function(){
        window.location.href = '#offers';

        $.get( '/allegro/offers', function( data ) {
            if( !data.success ) {
                console.log( data );
                return alert( 'Podczas odpytywania /allegro/offers doszło do błędu.' );
            }

            $('#main').html( data.template );
        });
    });*?

    /*$.get( '/allegro/init', function( data ) {
        if( !data.success ) {
            console.log( data );
            return alert( 'Podczas odpytywania /allegro/init doszło do błędu.' );
        }
    
        let val = data.auth;
        if( typeof val === 'boolean' && val.authNeed ) {
            const allegroAuth = window.open( val.authUrl, "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=500,left=500,width=600,height=800" );
            
            let allegroInterval = setInterval(function(){
                if( allegroAuth.closed ) {
                    clearInterval( allegroInterval );
                    $.post( '/allegro/auth', { 'code': val.deviceCode }, function() {});
                }
            }, 1000);
        } else {
            $('#main').html( data.template );
            $('#loadOrders').trigger('click');
        }
    });*/
});