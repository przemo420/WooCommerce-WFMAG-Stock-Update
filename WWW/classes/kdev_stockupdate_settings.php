<?php if( !defined( 'ABSPATH' ) ) exit;

class KDEV_StockUpdate_Settings {
	private $parentInstance = null;
	private $configName = 'kdev_stock_update';
	private $config = array();
	
	public function __construct( $instance ) {
		if( isset( $parentInstance ) ) {
			return;
		}
		
		$this->setConfigValue( 'api',  'Klucz API', false );
		$this->setConfigValue( 'time', 'Ostatnia aktualizacja' );
		$this->setConfigValue( 'ip',   'Ostatnie IP aktualizacji' );
		
		$this->parentInstance = $instance;
	}
	
	public function addPage() {
		add_options_page( 'Ustawienia synchronizacji WFMAG', 'Stany WFMAG', 'manage_options', 'updateStockSetingsIndexPage', array( $this, 'updateStockSetingsIndexPage' ) );
	}
	
	public function updateStockSetingsIndexPage() {
		if ( !current_user_can( 'manage_options' ) )  {
			wp_die( __( 'You do not have sufficient permissions to access this page.' ) );
		}
  
		//wp_enqueue_script( 'synchronize_jsproducts' );
		//wp_localize_script( 'synchronize_jsproducts', 'sync_products', array( 'config' => $this->config ) );?>

		<h2>Ustawienia synchronizacji WFMAG</h2>
		
		<form method="post" action="options.php">
			<?php settings_fields( $this->configName ); ?>

			<table class="form-table">
				<?php foreach( $this->config as $key => $config ) { ?>
				<tr valign="top">
					<th scope="row"><?php echo $config[ 'title' ]; ?></th>
					<td><input type="text" size="80" <?php echo ( $config['disabled'] ? '' : 'name="'.$key.'"' ); ?> value="<?php echo $this->getConfigValue( $key ); ?>" <?php readonly( $config[ 'disabled' ], true ); ?> /></td>
				</tr>
				<?php } ?>
				<tr>
					<td colspan="2">
						<p class="submit">
							<input type="submit" class="button-primary" value="<?php _e('Zapisz zmiany') ?>" />
						</p>
					</td>
				</tr>
			</table>
        </form>
		<?php
	}
	
	public function prepareSettings() {
		foreach( $this->config as $key => $config ) {
			register_setting( $this->configName, $key );
			add_option( $key, "", "", "yes" );
		}
	}
	
	public function setUpdateData( $ip ) {
		update_option( 'time', date('d.m.Y H:i:s') );
		update_option( 'ip', $ip );
	}
	
	public function getApiKey() {
		return $this->getConfigValue( 'api' );
	}
	
	private function getConfigValue( $key ) {
		return get_option( $key );
	}
	
	private function setConfigValue( $varKey, $title, $disabled=true ) {
		$this->config[ $varKey ] = array( 'title' => $title, 'disabled' => $disabled );
	}
}