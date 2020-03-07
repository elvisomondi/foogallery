<?php
/**
 * Class for adding advanced thumb settings to all gallery templates
 * Date: 22/02/2020
 */
if ( ! class_exists( 'FooGallery_Pro_Advanced_Thumbnails' ) ) {

    class FooGallery_Pro_Advanced_Thumbnails {

        function __construct() {
            //add fields to all templates
            add_filter( 'foogallery_override_gallery_template_fields', array( $this, 'add_advanced_thumb_fields' ), 100, 2 );

            //add custom captions
            //add_filter( 'foogallery_build_attachment_html_caption_custom', array( $this, 'customize_captions' ), 30, 3 );
            add_filter( 'foogallery_thumbnail_resize_args', array( $this, 'add_arguments' ), 10, 3 );
        }

        /**
         * Add arguments for the resize
         *
         * @param $args
         * @param $original_image_src
         * @param $thumbnail_object
         * @return array
         */
        function add_arguments($args, $original_image_src, $thumbnail_object) {
            $thumb_cropping_options = foogallery_gallery_template_setting( 'thumb_cropping_options', '' );

            if ( 'background_fill' === $thumb_cropping_options ) {
                $background_fill_color = foogallery_gallery_template_setting( 'thumb_background_fill', 'rbg(0,0,0)' );
                $colors = $this->rgb_to_colors( $background_fill_color );
                $args['background_fill'] = sprintf( "%03d%03d%03d000", $colors[0], $colors[1], $colors[2] );
                $args['crop'] = false;
            }

            return $args;
        }

        function rgb_to_colors( string $rgba ) {
            preg_match( '/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i', $rgba, $by_color );

            return array( $by_color[1], $by_color[2], $by_color[3] );
        }

        /**
         * Add thumb fields to the gallery template
         *
         * @param $fields
         * @param $template
         *
         * @return array
         */
        function add_advanced_thumb_fields( $fields, $template ) {

            $fields[] = array(
                'id'       => 'thumb_cropping_options',
                'title'    => __( 'Thumbnail Cropping', 'foogallery' ),
                'desc'     => __( 'Additional options to change how thumbnails are cropped.', 'foogallery' ),
                'section'  => __( 'Advanced', 'foogallery' ),
                'type'     => 'radio',
                'default'  => '',
                'choices'  => array(
                    ''  => __( 'Default', 'foogallery' ),
                    'background_fill'   => __( 'Background Fill (No crop)', 'foogallery' ),
                ),
                'row_data'=> array(
                    'data-foogallery-change-selector' => 'input:radio',
                    'data-foogallery-preview' => 'shortcode',
                    'data-foogallery-value-selector'  => 'input:checked',
                )
            );

            $fields[] = array(
                'id'      => 'thumb_background_fill',
                'title'   => __( 'Background Fill Color', 'foogallery' ),
                'desc'	  => __( 'Choose a color for the background fill.', 'foogallery '),
                'section' => __( 'Advanced', 'foogallery' ),
                'type'    => 'colorpicker',
                'default' => '',
                'row_data' => array(
                    'data-foogallery-hidden'                => true,
                    'data-foogallery-show-when-field'       => 'thumb_cropping_options',
                    'data-foogallery-show-when-field-value' => 'background_fill',
                    'data-foogallery-preview'               => 'shortcode'
                )
            );

            return $fields;
        }

        /**
         * Return the index of the requested field
         *
         * @param $fields
         * @param $field_id
         *
         * @return int
         */
        private function find_index_of_field( $fields, $field_id ) {
            $index = 0;
            foreach ( $fields as $field ) {
                if ( isset( $field['id'] ) && $field_id === $field['id'] ) {
                    return $index;
                }
                $index++;
            }
            return $index;
        }

        /**
         * Return the requested field
         *
         * @param $fields
         * @param $field_id
         *
         * @return array|bool
         */
        private function &find_field( &$fields, $field_id ) {
            foreach ( $fields as &$field ) {
                if ( isset( $field['id'] ) && $field_id === $field['id'] ) {
                    return $field;
                }
            }
            return false;
        }

        /**
         * Customize the captions if needed
         *
         * @param $captions
         * @param $foogallery_attachment    FooGalleryAttachment
         * @param $args array
         *
         * @return array
         */
        function customize_captions( $captions, $foogallery_attachment, $args) {
            $caption_type = foogallery_gallery_template_setting( 'captions_type', '' );

            if ( 'custom' === $caption_type ) {
                $captions = array();
                $template = foogallery_gallery_template_setting( 'caption_custom_template', '' );
                $captions['desc'] = $this->build_custom_caption( $template, $foogallery_attachment );
            }

            return $captions;
        }

        /**
         * Build up the custom caption based on the template
         *
         * @param $template
         * @param $foogallery_attachment FooGalleryAttachment
         * @return string
         */
        function build_custom_caption( $template, $foogallery_attachment ) {
            $html = $template;

            $html = preg_replace_callback( '{{?(#[a-z]+ )?[a-z]+.[a-z]*}?}',
                function ($matches) use ($foogallery_attachment) {
                    if ( isset( $foogallery_attachment->$matches[0] ) ) {
                        return $foogallery_attachment->$matches[0];
                    } else if ( strpos( $matches[0], 'postmeta.' ) === 0 ) {
                        $post_meta_key = str_replace( 'postmeta.', '', $matches[0] );
                        $post_meta_value = get_post_meta( $foogallery_attachment->ID, $post_meta_key, true );

                        return $post_meta_value;
                    }

                    return '';
                },
                $html );

//            //basic attachment info replacement
//            $html = str_replace( '{ID}', $foogallery_attachment->ID, $html );
//            $html = str_replace( '{title}', $foogallery_attachment->title, $html );
//            $html = str_replace( '{caption}', $foogallery_attachment->caption, $html );
//            $html = str_replace( '{description}', $foogallery_attachment->description, $html );
//            $html = str_replace( '{alt}', $foogallery_attachment->alt, $html );
//            $html = str_replace( '{custom_url}', $foogallery_attachment->custom_url, $html );
//            $html = str_replace( '{custom_target}', $foogallery_attachment->custom_target, $html );
//            $html = str_replace( '{url}', $foogallery_attachment->url, $html );
//            $html = str_replace( '{width}', $foogallery_attachment->width, $html );
//            $html = str_replace( '{height}', $foogallery_attachment->height, $html );

            return apply_filters( 'foogallery_build_custom_caption', $html, $template, $foogallery_attachment );
        }
    }
}