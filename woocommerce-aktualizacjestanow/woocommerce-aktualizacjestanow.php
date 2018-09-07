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
