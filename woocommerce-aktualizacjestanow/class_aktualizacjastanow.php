<?php if( !defined( 'ABSPATH' ) ) exit;

class AktualizacjaStanow {
	public function __construct() {
		register_setting( 'synchronize_products', 'time' );
		register_setting( 'synchronize_products', $this->config['api'] );
		register_setting( 'synchronize_products', $this->config['by'] );
	
		add_action( 'admin_menu', array($this, 'synchronize_products_menu') );
		
		add_action( 'rest_api_init', function () {
			register_rest_route( 'stany/v1', 'aktualizuj', array(
				'methods' => 'POST',
				'callback' => array($this, 'synchronize_products_json'),
			));
			
			register_rest_route( 'stany/v1', 'produkty', array(
				'methods' => 'POST',
				'callback' => array($this, 'list_products_json'),
			));
		});
		
		wp_register_script( 'synchronize_jsproducts', plugin_dir_url( __FILE__ ).'js/script.js', array( 'jquery' ), null, true );
	}
	
	public function synchronize_products_menu() {
		add_menu_page( 'Ustawienia synchronizacji', 'Stany magazynowe', 'manage_options', 'synchronize_products_index', array($this, 'synchronize_products_index') );
	}
	
	public function synchronize_products_index() {
		wp_enqueue_script( 'synchronize_jsproducts' );
		wp_localize_script( 'synchronize_jsproducts', 'sync_products', array('config' => $this->config) );
		
		settings_fields('synchronize_products');
		do_settings_sections( 'time' );
		
		include('templates/synchronize_index.php');
	}
	
	public function synchronize_products_json() {
		if($_POST['api'] != 'api') return array('ok'=>'fail');
		
		global $wpdb;
		$data = array();
		
		foreach($_POST['products'] as $p => $product) {
			$wpdb->query( "UPDATE wp_postmeta SET meta_value = '".$product[1]."' WHERE meta_key = '_stock' AND post_id = '".$product[0]."'");
			$wpdb->query( "UPDATE wp_postmeta SET meta_value = '".($product[1] ? 'instock' : 'outofstock')."' WHERE meta_key = '_stock_status' AND post_id = '".$product[0]."'");
		}

		$data['ok'] = 'done';
		
		return $data;
	}
	
	public function list_products_json() {
		if($_POST['api'] != 'api') return array('ok'=>'fail');
		
		global $wpdb;
		return $wpdb->get_results( "SELECT `post_id` `id`, `meta_value` `sku` FROM $wpdb->postmeta WHERE `meta_key` = '_sku' AND `meta_value` <> ''" );
	}
}
