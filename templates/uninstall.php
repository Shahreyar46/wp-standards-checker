<?php
/**
 * Fired when the plugin is uninstalled.
 *
 * @package           YourPlugin
 */

// If uninstall not called from WordPress, then exit.
if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit;
}

/**
 * START CLEANUP LOGIC HERE
 * Delete options, transients, and custom database tables.
 */

// delete_option( 'your_plugin_option' );
// delete_metadata( 'user', 0, 'your_user_meta', '', true );
