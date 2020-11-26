<?php if( !defined( 'ABSPATH' ) ) exit;

class AktualizacjaStanow {
	private $settingsInstance;
	private $restInstance;

	public function __construct() {
		require 'classes/kdev_stockupdate_settings.php';
		require 'classes/kdev_stockupdate_rest.php';
		
		$this->settingsInstance = new KDEV_StockUpdate_Settings( $this );
		$this->restInstance = new KDEV_StockUpdate_Rest( $this, $this->settingsInstance );
	
		add_action( 'admin_init', array( $this->settingsInstance, 'prepareSettings' ) );
		add_action( 'admin_menu', array( $this->settingsInstance, 'addPage' ) );
		//add_filter( 'post_submitbox_misc_actions', array($this, 'add_admin_order_button') );
	
		add_action( 'rest_api_init', array( $this->restInstance, 'apiInit' ) );
		
		//wp_register_script( 'synchronize_jsproducts', plugin_dir_url( __FILE__ ).'js/script.js', array( 'jquery' ), null, true );
	}
}