$(document).ready(function(){
    //loadOffers();

    function loadOffers() {
        $.get( '/allegro/offers/load', function( data ) {
            if( !data.success ) {
                console.log( data );
                return alert( 'Podczas odpytywania /alllegro/load-orders doszło do błędu.' );
            }
    
            console.log( data );
            let offers = data.offerList;
    
            if( typeof offers === 'object' && offers.length ) {
                $('#offerData').empty();
            }

            for( var oid in offers ) {
                let offerData = offers[ oid ];

                $('#offerData').append( offerTableList.
                    replaceAll( '{nr}', offerData.id ).
                    replaceAll( '{name}', offerData.name ).
                    replaceAll( '{price}', offerData.sellingMode.price.amount + ' ' + offerData.sellingMode.price.currency ).
                    replaceAll( '{stock}', offerData.stock.available )
                );
            }
        });
    }

    let offerTableList = `
    <tr data-toggle="collapse" data-target="#details{nr}" class="accordion-toggle">
        <th scope="row">{nr}</th>
        <td>{name}</td>
        <td>{price}</td>
        <td>{stock} szt.</td>
        <td><button class="btn btn-info">Szczegóły</button></td>
    </tr>`;
});