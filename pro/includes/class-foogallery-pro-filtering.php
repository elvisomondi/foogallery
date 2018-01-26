<?php
/**
 * FooGallery Pro Filtering Class
 */
if ( ! class_exists( 'FooGallery_Pro_Filtering' ) ) {

	class FooGallery_Pro_Filtering {

		function __construct() {
			if ( is_admin() ) {
				//add extra fields to the templates that support filtering
				add_filter( 'foogallery_override_gallery_template_fields', array( $this, 'add_filtering_fields' ), 10, 2 );

				//set the settings icon for filtering
				add_filter( 'foogallery_gallery_settings_metabox_section_icon', array( $this, 'add_section_icons' ) );

				//build up any preview arguments
				add_filter( 'foogallery_preview_arguments', array( $this, 'preview_arguments' ), 10, 3 );
			}

			//adds the filtering property to a FooGallery
			add_action( 'foogallery_located_template', array( $this, 'determine_filtering' ), 10, 2 );

			//add the filtering attributes to the gallery container
			add_filter( 'foogallery_build_container_data_options', array( $this, 'add_filtering_data_options' ), 10, 3 );

			//add attributes to the thumbnail anchors
			add_filter( 'foogallery_attachment_html_link_attributes', array( $this, 'add_tag_attribute' ), 10, 3 );
		}

		/**
		 * Returns the Dashicon that can be used in the settings tabs
		 *
		 * @param $section_slug
		 *
		 * @return string
		 */
		function add_section_icons( $section_slug ) {
			if ( 'filtering' === $section_slug ) {
				return 'dashicons-filter';
			}

			return $section_slug;
		}

		/**
		 * Add filtering fields to the gallery template
		 *
		 * @uses "foogallery_override_gallery_template_fields"
		 *
		 * @param $fields
		 * @param $template
		 *
		 * @return array
		 */
		function add_filtering_fields( $fields, $template ) {
			if ( $template && array_key_exists( 'filtering_support', $template ) && true === $template['filtering_support'] ) {
				$fields[] = array(
					'id'       => 'filtering_type',
					'title'    => __( 'Filtering Type', 'foogallery' ),
					'desc'     => __( 'Which type of filtering do you want to use in the gallery.', 'foogallery' ),
					'section'  => __( 'Filtering', 'foogallery' ),
					'spacer'   => '<span class="spacer"></span>',
					'type'     => 'radio',
					'default'  => '',
					'choices'  => apply_filters(
						'foogallery_gallery_template_filtering_type_choices', array(
						''        => __( 'None', 'foogallery' ),
						'default' => __( 'Buttons', 'foogallery' ),
						'tags'    => __( 'Tags', 'foogallery' )
					)
					),
					'row_data' => array(
						'data-foogallery-change-selector' => 'input',
						'data-foogallery-preview'         => 'shortcode',
						'data-foogallery-value-selector'  => 'input:checked',
					)
				);

				$taxonomy_objects = get_object_taxonomies( 'attachment', 'objects' );
				$taxonomy_choices = array();
				foreach ( $taxonomy_objects as $taxonomy_object ) {
					$taxonomy_choices[$taxonomy_object->name] = $taxonomy_object->label;
				}

				$fields[] = array(
					'id'       => 'filtering_taxonomy',
					'title'    => __( 'Taxonomy', 'foogallery' ),
					'desc'     => __( 'The attachment taxonomy used for filtering.', 'foogallery' ),
					'section'  => __( 'Filtering', 'foogallery' ),
					'spacer'   => '<span class="spacer"></span>',
					'type'     => 'radio',
					'default'  => FOOGALLERY_ATTACHMENT_TAXONOMY_TAG,
					'choices'  => apply_filters( 'foogallery_gallery_template_filtering_taxonomy_choices', $taxonomy_choices ),
					'row_data' => array(
						'data-foogallery-hidden'                   => true,
						'data-foogallery-show-when-field-operator' => '!==',
						'data-foogallery-show-when-field'          => 'filtering_type',
						'data-foogallery-show-when-field-value'    => '',
						'data-foogallery-change-selector'          => 'input',
						'data-foogallery-preview'                  => 'shortcode'
					)
				);

				$fields[] = array(
					'id'       => 'filtering_position',
					'title'    => __( 'Position', 'foogallery' ),
					'desc'     => __( 'The position of the filtering.', 'foogallery' ),
					'section'  => __( 'Filtering', 'foogallery' ),
					'spacer'   => '<span class="spacer"></span>',
					'type'     => 'radio',
					'default'  => 'top',
					'choices'  => apply_filters(
						'foogallery_gallery_template_filtering_position_choices', array(
						''       => __( 'None', 'foogallery' ),
						'top'    => __( 'Top', 'foogallery' ),
						'bottom' => __( 'Bottom', 'foogallery' ),
						'both'   => __( 'Both', 'foogallery' )
					)
					),
					'row_data' => array(
						'data-foogallery-hidden'                   => true,
						'data-foogallery-show-when-field-operator' => '!==',
						'data-foogallery-show-when-field'          => 'filtering_type',
						'data-foogallery-show-when-field-value'    => '',
						'data-foogallery-change-selector'          => 'input',
						'data-foogallery-preview'                  => 'shortcode'
					)
				);

				$fields[] = array(
					'id'       => 'filtering_mode',
					'title'    => __( 'Mode', 'foogallery' ),
					'desc'     => __( 'The mode used when filtering.', 'foogallery' ),
					'section'  => __( 'Filtering', 'foogallery' ),
					'spacer'   => '<span class="spacer"></span>',
					'type'     => 'radio',
					'default'  => 'single',
					'choices'  => apply_filters(
						'foogallery_gallery_template_filtering_mode_choices', array(
						'single'    => __( 'Default', 'foogallery' ),
						'Union'     => __( 'OR', 'foogallery' ),
						'Intersect' => __( 'AND', 'foogallery' )
					)
					),
					'row_data' => array(
						'data-foogallery-hidden'                   => true,
						'data-foogallery-show-when-field-operator' => '!==',
						'data-foogallery-show-when-field'          => 'filtering_type',
						'data-foogallery-show-when-field-value'    => '',
						'data-foogallery-change-selector'          => 'input',
						'data-foogallery-preview'                  => 'shortcode'
					)
				);

				$fields[] = array(
					'id'       => 'filtering_push',
					'title'    => __( 'Push', 'foogallery' ),
					'desc'     => __( 'Whether to push or replace when using filtering.', 'foogallery' ),
					'section'  => __( 'Filtering', 'foogallery' ),
					'spacer'   => '<span class="spacer"></span>',
					'type'     => 'radio',
					'default'  => 'push',
					'choices'  => apply_filters(
						'foogallery_gallery_template_filtering_push_choices', array(
						'push'    => __( 'Push', 'foogallery' ),
						'replace' => __( 'Replace', 'foogallery' )
					)
					),
					'row_data' => array(
						'data-foogallery-hidden'                   => true,
						'data-foogallery-show-when-field-operator' => '!==',
						'data-foogallery-show-when-field'          => 'filtering_type',
						'data-foogallery-show-when-field-value'    => '',
						'data-foogallery-change-selector'          => 'input',
						'data-foogallery-preview'                  => 'shortcode'
					)
				);

				$fields[] = array(
					'id'       => 'filtering_min',
					'title'    => __( 'Minimum', 'foogallery' ),
					'desc'     => __( 'The minimum count before a filter is shown, 0 = disabled and all are shown.', 'foogallery' ),
					'section'  => __( 'Filtering', 'foogallery' ),
					'type'     => 'number',
					'class'    => 'small-text',
					'default'  => 0,
					'step'     => '1',
					'min'      => '0',
					'row_data' => array(
						'data-foogallery-change-selector'          => 'input',
						'data-foogallery-preview'                  => 'shortcode',
						'data-foogallery-hidden'                   => true,
						'data-foogallery-show-when-field'          => 'filtering_type',
						'data-foogallery-show-when-field-operator' => '!==',
						'data-foogallery-show-when-field-value'    => '',
					)
				);

				$fields[] = array(
					'id'       => 'filtering_limit',
					'title'    => __( 'Limit', 'foogallery' ),
					'desc'     => __( 'The maximum number of filters to show, 0 = disabled and all are shown.', 'foogallery' ),
					'section'  => __( 'Filtering', 'foogallery' ),
					'type'     => 'number',
					'class'    => 'small-text',
					'default'  => 0,
					'step'     => '1',
					'min'      => '0',
					'row_data' => array(
						'data-foogallery-change-selector'          => 'input',
						'data-foogallery-preview'                  => 'shortcode',
						'data-foogallery-hidden'                   => true,
						'data-foogallery-show-when-field'          => 'filtering_type',
						'data-foogallery-show-when-field-operator' => '!==',
						'data-foogallery-show-when-field-value'    => '',
					)
				);

				$fields[] = array(
					'id'       => 'filtering_show_count',
					'title'    => __( 'Show Count', 'foogallery' ),
					'desc'     => __( 'Whether or not to show the counts within each filter.', 'foogallery' ),
					'section'  => __( 'Filtering', 'foogallery' ),
					'spacer'   => '<span class="spacer"></span>',
					'type'     => 'radio',
					'default'  => '',
					'choices'  => apply_filters(
						'foogallery_gallery_template_filtering_show_count_choices', array(
						''     => __( 'No', 'foogallery' ),
						'true' => __( 'Yes', 'foogallery' ),
					)
					),
					'row_data' => array(
						'data-foogallery-change-selector'          => 'input',
						'data-foogallery-preview'                  => 'shortcode',
						'data-foogallery-hidden'                   => true,
						'data-foogallery-show-when-field'          => 'filtering_type',
						'data-foogallery-show-when-field-operator' => '!==',
						'data-foogallery-show-when-field-value'    => '',
					)
				);

				$fields[] = array(
					'id'       => 'filtering_adjust_size',
					'title'    => __( 'Adjust Size', 'foogallery' ),
					'desc'     => __( 'Whether or not to adjust the size of each filter depending on the count.', 'foogallery' ),
					'section'  => __( 'Filtering', 'foogallery' ),
					'spacer'   => '<span class="spacer"></span>',
					'type'     => 'radio',
					'default'  => 'no',
					'choices'  => apply_filters(
						'foogallery_gallery_template_filtering_adjust_size_choices', array(
						'no'  => __( 'No', 'foogallery' ),
						'yes' => __( 'Yes', 'foogallery' ),
					)
					),
					'row_data' => array(
						'data-foogallery-change-selector'          => 'input',
						'data-foogallery-value-selector'           => 'input:checked',
						'data-foogallery-preview'                  => 'shortcode',
						'data-foogallery-hidden'                   => true,
						'data-foogallery-show-when-field'          => 'filtering_type',
						'data-foogallery-show-when-field-operator' => '!==',
						'data-foogallery-show-when-field-value'    => '',
					)
				);

				$fields[] = array(
					'id'       => 'filtering_adjust_size_smallest',
					'title'    => __( 'Smallest Size', 'foogallery' ),
					'desc'     => __( 'The smallest possible font size to use, when Adjust Size is used.', 'foogallery' ),
					'section'  => __( 'Filtering', 'foogallery' ),
					'type'     => 'number',
					'class'    => 'small-text',
					'default'  => 12,
					'step'     => '1',
					'min'      => '0',
					'row_data' => array(
						'data-foogallery-change-selector'          => 'input',
						'data-foogallery-preview'                  => 'shortcode',
						'data-foogallery-hidden'                   => true,
						'data-foogallery-show-when-field'          => 'filtering_adjust_size',
						'data-foogallery-show-when-field-operator' => '==',
						'data-foogallery-show-when-field-value'    => 'yes',
					)
				);

				$fields[] = array(
					'id'       => 'filtering_adjust_size_largest',
					'title'    => __( 'Largest Size', 'foogallery' ),
					'desc'     => __( 'The largest possible font size to use, when Adjust Size is used.', 'foogallery' ),
					'section'  => __( 'Filtering', 'foogallery' ),
					'type'     => 'number',
					'class'    => 'small-text',
					'default'  => 16,
					'step'     => '1',
					'min'      => '0',
					'row_data' => array(
						'data-foogallery-change-selector'          => 'input',
						'data-foogallery-preview'                  => 'shortcode',
						'data-foogallery-hidden'                   => true,
						'data-foogallery-show-when-field'          => 'filtering_adjust_size',
						'data-foogallery-show-when-field-operator' => '==',
						'data-foogallery-show-when-field-value'    => 'yes',
					)
				);

				$fields[] = array(
					'id'       => 'filtering_adjust_opacity',
					'title'    => __( 'Adjust Opacity', 'foogallery' ),
					'desc'     => __( 'Whether or not to adjust the opacity of each filter depending on the count.', 'foogallery' ),
					'section'  => __( 'Filtering', 'foogallery' ),
					'spacer'   => '<span class="spacer"></span>',
					'type'     => 'radio',
					'default'  => 'no',
					'choices'  => apply_filters(
						'foogallery_gallery_template_filtering_adjust_opacity_choices', array(
						'no'  => __( 'No', 'foogallery' ),
						'yes' => __( 'Yes', 'foogallery' ),
					)
					),
					'row_data' => array(
						'data-foogallery-change-selector'          => 'input',
						'data-foogallery-value-selector'           => 'input:checked',
						'data-foogallery-preview'                  => 'shortcode',
						'data-foogallery-hidden'                   => true,
						'data-foogallery-show-when-field'          => 'filtering_type',
						'data-foogallery-show-when-field-operator' => '!==',
						'data-foogallery-show-when-field-value'    => '',
					)
				);

				$fields[] = array(
					'id'       => 'filtering_adjust_opacity_lightest',
					'title'    => __( 'Lightest Opacity', 'foogallery' ),
					'desc'     => __( 'The lightest or most transparent opacity to use, when Adjust Opacity is used.', 'foogallery' ),
					'section'  => __( 'Filtering', 'foogallery' ),
					'type'     => 'number',
					'class'    => 'small-text',
					'default'  => 0.5,
					'step'     => '0.1',
					'min'      => '0',
					'row_data' => array(
						'data-foogallery-change-selector'          => 'input',
						'data-foogallery-preview'                  => 'shortcode',
						'data-foogallery-hidden'                   => true,
						'data-foogallery-show-when-field'          => 'filtering_adjust_opacity',
						'data-foogallery-show-when-field-operator' => '==',
						'data-foogallery-show-when-field-value'    => 'yes',
					)
				);

				$fields[] = array(
					'id'       => 'filtering_adjust_opacity_darkest',
					'title'    => __( 'Darkest Opacity', 'foogallery' ),
					'desc'     => __( 'The darkest or most opaque opacity to use, when Adjust Opacity is used.', 'foogallery' ),
					'section'  => __( 'Filtering', 'foogallery' ),
					'type'     => 'number',
					'class'    => 'small-text',
					'default'  => '1',
					'step'     => '0.1',
					'min'      => '0',
					'row_data' => array(
						'data-foogallery-change-selector'          => 'input',
						'data-foogallery-preview'                  => 'shortcode',
						'data-foogallery-hidden'                   => true,
						'data-foogallery-show-when-field'          => 'filtering_adjust_opacity',
						'data-foogallery-show-when-field-operator' => '==',
						'data-foogallery-show-when-field-value'    => 'yes',
					)
				);
			}

			return $fields;
		}

		/**
		 * Build up a arguments used in the preview of the gallery
		 *
		 * @param $args
		 * @param $post_data
		 * @param $template
		 *
		 * @return mixed
		 */
		function preview_arguments( $args, $post_data, $template ) {
			$template_data = foogallery_get_gallery_template( $template );

			//check the template supports filtering
			if ( $template_data && array_key_exists( 'filtering_support', $template_data ) && true === $template_data['filtering_support'] ) {
				$args['filtering_type']                    = $post_data[FOOGALLERY_META_SETTINGS][$template . '_filtering_type'];
				$args['filtering_taxonomy']                = $post_data[FOOGALLERY_META_SETTINGS][$template . '_filtering_taxonomy'];
				$args['filtering_position']                = $post_data[FOOGALLERY_META_SETTINGS][$template . '_filtering_position'];
				$args['filtering_mode']                    = $post_data[FOOGALLERY_META_SETTINGS][$template . '_filtering_mode'];
				$args['filtering_push']                    = $post_data[FOOGALLERY_META_SETTINGS][$template . '_filtering_push'];
				$args['filtering_min']                     = $post_data[FOOGALLERY_META_SETTINGS][$template . '_filtering_min'];
				$args['filtering_limit']                   = $post_data[FOOGALLERY_META_SETTINGS][$template . '_filtering_limit'];
				$args['filtering_show_count']              = $post_data[FOOGALLERY_META_SETTINGS][$template . '_filtering_show_count'];
				$args['filtering_adjust_size']             = $post_data[FOOGALLERY_META_SETTINGS][$template . '_filtering_adjust_size'];
				$args['filtering_adjust_size_smallest']    = $post_data[FOOGALLERY_META_SETTINGS][$template . '_filtering_adjust_size_smallest'];
				$args['filtering_adjust_size_largest']     = $post_data[FOOGALLERY_META_SETTINGS][$template . '_filtering_adjust_size_largest'];
				$args['filtering_adjust_opacity']          = $post_data[FOOGALLERY_META_SETTINGS][$template . '_filtering_adjust_opacity'];
				$args['filtering_adjust_opacity_lightest'] = $post_data[FOOGALLERY_META_SETTINGS][$template . '_filtering_adjust_opacity_lightest'];
				$args['filtering_adjust_opacity_darkest']  = $post_data[FOOGALLERY_META_SETTINGS][$template . '_filtering_adjust_opacity_darkest'];
			}

			return $args;
		}

		/**
		 * Determine if the gallery has filtering enabled
		 *
		 * @param $foogallery FooGallery
		 */
		function determine_filtering( $foogallery ) {
			$template_data = foogallery_get_gallery_template( $foogallery->gallery_template );

			//check the template supports filtering
			$paging = $template_data && array_key_exists( 'filtering_support', $template_data ) && true === $template_data['filtering_support'];

			$foogallery->filtering = apply_filters( 'foogallery_filtering', $paging, $foogallery );
		}

		/**
		 * Add the required filtering data options if needed
		 *
		 * @param $attributes array
		 * @param $gallery    FooGallery
		 *
		 * @return array
		 */
		function add_filtering_data_options( $options, $gallery, $attributes ) {
			if ( isset( $gallery->filtering ) && true === $gallery->filtering ) {

				//check if we have arguments from the shortcode and override the saved settings
				$filtering = $this->get_foogallery_argument( $gallery, 'filtering_type', 'filtering_type', '' );

				if ( '' !== $filtering ) {
					$filtering_show_count     = $this->get_foogallery_argument( $gallery, 'filtering_show_count', 'filtering_show_count', '' ) === 'true';
					$filtering_adjust_size    = $this->get_foogallery_argument( $gallery, 'filtering_adjust_size', 'filtering_adjust_size', 'no' ) === 'yes';
					$filtering_adjust_opacity = $this->get_foogallery_argument( $gallery, 'filtering_adjust_opacity', 'filtering_adjust_opacity', 'no' ) === 'yes';

					$filtering_options = array(
						'type'          => $filtering,
						'position'      => $this->get_foogallery_argument( $gallery, 'filtering_position', 'filtering_position', 'top' ),
						'pushOrReplace' => $this->get_foogallery_argument( $gallery, 'filtering_push', 'filtering_push', 'push' ),
						'mode'          => $this->get_foogallery_argument( $gallery, 'filtering_mode', 'filtering_mode', 'single' ),
						'min'           => intval( $this->get_foogallery_argument( $gallery, 'filtering_min', 'filtering_min', '0' ) ),
						'limit'         => intval( $this->get_foogallery_argument( $gallery, 'filtering_limit', 'filtering_limit', '0' ) ),
						'showCount'     => $filtering_show_count,
						'adjustSize'    => $filtering_adjust_size,
						'adjustOpacity' => $filtering_adjust_opacity,
					);

					if ( $filtering_adjust_size ) {
						$filtering_options['smallest'] = intval( $this->get_foogallery_argument( $gallery, 'filtering_adjust_size_smallest', 'filtering_adjust_size_smallest', '12' ) );
						$filtering_options['largest']  = intval( $this->get_foogallery_argument( $gallery, 'filtering_adjust_size_largest', 'filtering_adjust_size_largest', '16' ) );
					}

					if ( $filtering_adjust_size ) {
						$filtering_options['lightest'] = intval( $this->get_foogallery_argument( $gallery, 'filtering_adjust_opacity_lightest', 'filtering_adjust_opacity_lightest', '0.5' ) );
						$filtering_options['darkest']  = intval( $this->get_foogallery_argument( $gallery, 'filtering_adjust_opacity_darkest', 'filtering_adjust_opacity_darkest', '1' ) );
					}

					$options['filtering']        = $gallery->filtering_options = $filtering_options;
					$gallery->filtering_taxonomy = $this->get_foogallery_argument( $gallery, 'filtering_taxonomy', 'filtering_taxonomy', FOOGALLERY_ATTACHMENT_TAXONOMY_TAG );
				}
			}

			return $options;
		}

		private function get_foogallery_argument( $gallery, $setting_id, $argument_name, $default_value ) {
			global $current_foogallery_arguments;

			if ( isset( $current_foogallery_arguments ) && isset( $current_foogallery_arguments[$argument_name] ) ) {
				return $current_foogallery_arguments[$argument_name];
			} else {
				return $gallery->get_setting( $setting_id, $default_value );
			}
		}

		/**
		 * Applies the taxonomy terms to the thumbnail
		 *
		 * @uses     "foogallery_attachment_html_link_attributes" filter
		 *
		 * @param array $attr
		 * @param array $args
		 * @param FooGalleryAttachment $attachment
		 *
		 * @return array
		 */
		public function add_tag_attribute( $attr, $args, $attachment ) {
			global $current_foogallery;

			if ( isset( $current_foogallery->filtering_taxonomy ) && isset( $current_foogallery->filtering ) && true === $current_foogallery->filtering ) {
				$taxonomy = $current_foogallery->filtering_taxonomy;

				$terms = wp_get_post_terms( $attachment->ID, $taxonomy, array('fields' => 'names') );

				$attr['data-tags'] = json_encode($terms);
			}

			return $attr;
		}
	}
}

