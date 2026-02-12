<?php

class FooGalleryAttachmentFieldsTest extends WP_UnitTestCase {
	private $admin_id;
	private $subscriber_id;
	private $attachment_id;
	private $attachment_fields;

	public function setUp(): void {
		parent::setUp();

		$this->admin_id = self::factory()->user->create( array( 'role' => 'administrator' ) );
		$this->subscriber_id = self::factory()->user->create( array( 'role' => 'subscriber' ) );

		$this->attachment_id = self::factory()->attachment->create( array(
			'post_mime_type' => 'image/jpeg',
			'post_title'     => 'Attachment Fields Test Image',
			'post_author'    => $this->admin_id,
			'guid'           => 'https://example.org/attachment-fields-test.jpg',
		) );

		if ( ! class_exists( 'FooGallery_Attachment_Fields' ) ) {
			require_once FOOGALLERY_PATH . 'includes/admin/class-attachment-fields.php';
		}

		$this->attachment_fields = new class extends FooGallery_Attachment_Fields {
			public function __construct() {}
		};
	}

	/**
	 * Tests custom field registration includes URL, target, and rel fields.
	 */
	public function test_get_custom_fields_includes_expected_fields() {
		$fields = $this->attachment_fields->get_custom_fields();

		$this->assertArrayHasKey( 'foogallery_custom_url', $fields );
		$this->assertArrayHasKey( 'foogallery_custom_target', $fields );
		$this->assertArrayHasKey( 'foogallery_custom_rel', $fields );
	}

	/**
	 * Tests custom URL sanitizer blocks unsafe URLs and keeps valid URLs.
	 */
	public function test_sanitize_attachment_custom_url_is_strict() {
		$this->assertSame( '', foogallery_sanitize_attachment_custom_url( 'javascript:alert(1)' ) );
		$this->assertSame( 'https://example.org/path/image.jpg', foogallery_sanitize_attachment_custom_url( ' https://example.org/path/image.jpg ' ) );
	}

	/**
	 * Tests custom target sanitizer only allows known options.
	 */
	public function test_sanitize_attachment_custom_target_is_strict() {
		$this->assertSame( '_blank', foogallery_sanitize_attachment_custom_target( '_blank' ) );
		$this->assertSame( 'default', foogallery_sanitize_attachment_custom_target( 'new_window' ) );
		$this->assertSame( '', foogallery_sanitize_attachment_custom_target( array() ) );
	}

	/**
	 * Tests custom rel sanitizer strips unknown tokens and normalizes output.
	 */
	public function test_sanitize_attachment_custom_rel_is_strict() {
		$this->assertSame(
			'nofollow sponsored',
			foogallery_sanitize_attachment_custom_rel( ' NOFOLLOW sponsored onclick nofollow ' )
		);
	}

	/**
	 * Tests custom rel sanitizer allows extending token list via filter.
	 */
	public function test_sanitize_attachment_custom_rel_allows_custom_tokens_via_filter() {
		$filter = function( $allowed_tokens ) {
			$allowed_tokens[] = 'customtoken';
			return $allowed_tokens;
		};

		add_filter( 'foogallery_custom_rel_allowed_tokens', $filter );
		try {
			$this->assertSame(
				'sponsored customtoken',
				foogallery_sanitize_attachment_custom_rel( 'sponsored customtoken' )
			);
		} finally {
			remove_filter( 'foogallery_custom_rel_allowed_tokens', $filter );
		}
	}

	/**
	 * Tests save_fields sanitizes URL, target, and rel values before storing.
	 */
	public function test_save_fields_sanitizes_core_attachment_fields() {
		wp_set_current_user( $this->admin_id );

		$post = array( 'ID' => $this->attachment_id );
		$attachment = array(
			'foogallery_custom_url'    => ' javascript:alert(1) ',
			'foogallery_custom_target' => 'window',
			'foogallery_custom_rel'    => 'nofollow sponsored onclick',
		);

		$this->attachment_fields->save_fields( $post, $attachment );

		$this->assertSame( '', get_post_meta( $this->attachment_id, '_foogallery_custom_url', true ) );
		$this->assertSame( 'default', get_post_meta( $this->attachment_id, '_foogallery_custom_target', true ) );
		$this->assertSame( 'nofollow sponsored', get_post_meta( $this->attachment_id, '_foogallery_custom_rel', true ) );
	}

	/**
	 * Tests save_fields sanitizes custom text fields via sanitize_text_field.
	 */
	public function test_save_fields_sanitizes_custom_text_field_value() {
		wp_set_current_user( $this->admin_id );

		$custom_fields_filter = function( $fields ) {
			$fields['foogallery_custom_extra'] = array(
				'label' => 'Custom Extra',
				'input' => 'text',
			);

			return $fields;
		};

		add_filter( 'foogallery_attachment_custom_fields', $custom_fields_filter );

		try {
			$post = array( 'ID' => $this->attachment_id );
			$attachment = array(
				'foogallery_custom_extra' => '<script>alert(1)</script> extra-value',
			);

			$this->attachment_fields->save_fields( $post, $attachment );

			$stored_value = get_post_meta( $this->attachment_id, '_foogallery_custom_extra', true );

			$this->assertStringContainsString( 'extra-value', $stored_value );
			$this->assertStringNotContainsString( '<', $stored_value );
			$this->assertStringNotContainsString( '>', $stored_value );
		} finally {
			remove_filter( 'foogallery_attachment_custom_fields', $custom_fields_filter );
		}
	}

	/**
	 * Tests save_fields does not write data when user cannot edit attachment.
	 */
	public function test_save_fields_does_not_update_meta_for_unauthorized_user() {
		update_post_meta( $this->attachment_id, '_foogallery_custom_url', 'https://example.org/existing.jpg' );
		update_post_meta( $this->attachment_id, '_foogallery_custom_target', '_blank' );
		update_post_meta( $this->attachment_id, '_foogallery_custom_rel', 'nofollow' );

		wp_set_current_user( $this->subscriber_id );

		$post = array( 'ID' => $this->attachment_id );
		$attachment = array(
			'foogallery_custom_url'    => 'javascript:alert(1)',
			'foogallery_custom_target' => 'invalid_target',
			'foogallery_custom_rel'    => 'onclick',
		);

		$this->attachment_fields->save_fields( $post, $attachment );

		$this->assertSame( 'https://example.org/existing.jpg', get_post_meta( $this->attachment_id, '_foogallery_custom_url', true ) );
		$this->assertSame( '_blank', get_post_meta( $this->attachment_id, '_foogallery_custom_target', true ) );
		$this->assertSame( 'nofollow', get_post_meta( $this->attachment_id, '_foogallery_custom_rel', true ) );
	}

	/**
	 * Tests save_fields deletes values when submitted attachment payload omits fields.
	 */
	public function test_save_fields_deletes_existing_meta_when_field_is_missing() {
		wp_set_current_user( $this->admin_id );

		update_post_meta( $this->attachment_id, '_foogallery_custom_url', 'https://example.org/existing.jpg' );
		update_post_meta( $this->attachment_id, '_foogallery_custom_target', '_blank' );
		update_post_meta( $this->attachment_id, '_foogallery_custom_rel', 'nofollow sponsored' );

		$post = array( 'ID' => $this->attachment_id );
		$this->attachment_fields->save_fields( $post, array() );

		$this->assertSame( '', get_post_meta( $this->attachment_id, '_foogallery_custom_url', true ) );
		$this->assertSame( '', get_post_meta( $this->attachment_id, '_foogallery_custom_target', true ) );
		$this->assertSame( '', get_post_meta( $this->attachment_id, '_foogallery_custom_rel', true ) );
	}
}
