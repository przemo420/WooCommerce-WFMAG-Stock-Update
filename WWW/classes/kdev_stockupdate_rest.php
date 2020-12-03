<?php if( !defined( 'ABSPATH' ) ) exit;

class KDEV_StockUpdate_Rest {
	private $parentInstance;
	private $settingsInstance;
	
	public function __construct( $pInstance, $sInstance ) {
		if( !isset( $parentInstance ) ) {
			$this->parentInstance = $pInstance;
		}
		
		if( !isset( $settingsInstance ) ) {
			$this->settingsInstance = $sInstance;
		}
	}
	
	public function apiInit() {
		$this->settingsInstance->prepareSettings();
			
		register_rest_route( 'stany/v1', 'aktualizuj', array(
			'methods' => 'POST',
			'callback' => array($this, 'synchronizeStockProducts'),
			'permission_callback' => '__return_true'
		));
			
		register_rest_route( 'stany/v1', 'produkty', array(
			'methods' => 'POST',
			'callback' => array($this, 'listStockProducts'),
			'permission_callback' => '__return_true'
		));
	}
	
	public function synchronizeStockProducts() {
		if( $_POST['api'] != $this->settingsInstance->getApiKey() ) return array( 'ok' => 'failApi' );
		
		$data = array( 'startTime' => time(), 'updateCount' => array(), 'ok' => 'done' );
		
		foreach($_POST['products'] as $productID => $productCount) {
			if( !is_numeric( $productCount ) ) continue;
			
			$productMeta = get_post_meta( $productID );
			$productMetaStock = (int)$productMeta['_stock'][0];
			$productMetaManageStock = $productMeta['_manage_stock'][0];
			$productCount = (int)$productCount;
			
			if( $productMetaManageStock == 'yes' && $productMetaStock != $productCount ) {
				wc_update_product_stock( $productID, $productCount, 'set' );
				$data['updateCount'][ $productID ] = array( 'old' => $productMetaStock, 'new' => $productCount );
			}
		}

		$this->settingsInstance->setUpdateData( $_SERVER['REMOTE_ADDR'] );
		
		$data['endTime'] = time();
		$data['needTime'] = $data['endTime'] - $data['startTime'];
		
		return $data;
	}
	
	public function listStockProducts() {
		if( $_POST['api'] != $this->settingsInstance->getApiKey() ) return array( 'ok' => 'failApi' );
		
		global $wpdb;
		return $wpdb->get_results( "SELECT `post_id` `id`, `meta_value` `sku` FROM $wpdb->postmeta WHERE `meta_key` = '_sku' AND `meta_value` <> ''" );
	}
}