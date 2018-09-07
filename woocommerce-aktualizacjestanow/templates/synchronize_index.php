<?php if( !defined( 'ABSPATH' ) ) exit; 
$lastSync = get_option('synchronize_products_last'); ?>

<h1>Synchronizator stanów magazynowych</h1><br>

Ostatnia aktualizacja została zakończona: <b><?=$lastSync['time']?></b>.<br>
Została przeprowadzona plikiem: <b><?=$lastSync['file']?></b>.<br>
Została przeprowadzona do końca: <b><?=($lastSync['full'] ? 'tak' : 'nie')?></b>.

<form onSubmit="return false">
	<div id="syncText"></div>
	<textarea id="syncMsg" style="width: 500px; min-height: 300px; margin: 35px" placeholder="Tutaj trafi odpowiedź żądania..." readonly></textarea><br>
    <input type="hidden" id="sync_prod_url" value="">
    <button class="sel_sync_prod button" style="vertical-align: middle;">Wybierz raport</button>
	<button class="set_sync_prod button" style="vertical-align: middle;">Aktualizuj stany magazynowe</button>
</form>