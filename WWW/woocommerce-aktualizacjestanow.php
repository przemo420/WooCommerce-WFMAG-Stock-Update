<?php if( !defined( 'ABSPATH' ) ) exit;
/*
Plugin Name: Aktualizacja stanów magazynowych
Description: Wtyczka synchronizuje stany magazynowe WFMAG -> WooCommerce
Version: 1.0 wersja okrojona
Author: Przemysław Kozłowski
Author URI: https://kozioldev.eu
License: GPL2
*/

include(plugin_dir_path( __FILE__ ).'class_aktualizacjastanow.php');

if ( in_array( 'woocommerce/woocommerce.php', apply_filters( 'active_plugins', get_option( 'active_plugins' ) ) ) ) {
	$aktualizacjaStanow = new AktualizacjaStanow();
}

add_action( 'add_meta_boxes', 'mv_add_meta_boxes' );
function mv_add_meta_boxes() {
    add_meta_box( 'mv_other_fields', __('My Field','woocommerce'), 'mv_add_other_fields_for_packaging', 'shop_order', 'side', 'core' );
}

function mv_add_other_fields_for_packaging() {
    global $post;

    $meta_field_data = get_post_meta( $post->ID, '_my_field_slug', true ) ? get_post_meta( $post->ID, '_my_field_slug', true ) : '';

    echo '<button type="button" class="button-primary" id="send-order-gls">Wyślij kurierem GLS</button>';
}