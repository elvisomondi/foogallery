/**
 * BLOCK: fooplugins/foogallery
 *
 * Registering a basic FooGallery block with Gutenberg.
 */
import './editor.scss';

import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps } from '@wordpress/block-editor';
import FooGalleryEdit from './edit';
import metadata from '../../block.json';

const FooGalleryEditWithBlockProps = ( props ) => {
	const blockProps = useBlockProps();
	return (
		<div { ...blockProps }>
			<FooGalleryEdit { ...props } />
		</div>
	);
};

/**
 * Register: aa Gutenberg Block.
 *
 * Registers a new block provided a unique name and an object defining its
 * behavior. Once registered, the block is made editor as an option to any
 * editor interface where blocks are implemented.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( metadata.name, {
	...metadata,
	/**
	 * The edit function describes the structure of your block in the context of the editor.
	 * This represents what the editor will render when the block is used.
	 *
	 * The "edit" property must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 */
	edit(props) {
		return ( <FooGalleryEditWithBlockProps { ...props } /> );
	},


	/**
	 * The save function defines the way in which the different attributes should be combined
	 * into the final markup, which is then serialized by Gutenberg into post_content.
	 *
	 * The "save" property must be specified and must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 */
	save() {
		// Rendering in PHP
		return null;
	},
} );
