import FooGalleryEditPlaceholder from './placeholder';

import { __, sprintf } from '@wordpress/i18n';
import { useEffect, useRef } from '@wordpress/element';
import { Spinner } from '@wordpress/components';
import { useServerSideRender } from '@wordpress/server-side-render';

export default function FooGalleryEditServerSideRender( {
	block = 'fooplugins/foogallery',
	attributes = {},
	urlQueryArgs = {},
	reload = false,
	loading = __( 'Loading gallery...', 'foogallery' ),
	error = __( 'Error loading gallery: %s', 'foogallery' ),
	empty = __( 'No gallery was found.', 'foogallery' ),
} ) {
	const galleryRef = useRef( null );
	const mergedUrlQueryArgs = {
		...urlQueryArgs,
		_foogalleryReload: reload ? '1' : '0',
	};

	const { status, content, error: errorMsg } = useServerSideRender( {
		block,
		attributes,
		urlQueryArgs: mergedUrlQueryArgs,
	} );

	useEffect( () => {
		if ( status !== 'success' || !content || !galleryRef.current ) {
			return;
		}
		if ( typeof jQuery === 'undefined' || typeof FooGallery === 'undefined' ) {
			return;
		}

		const frameWin = galleryRef.current?.ownerDocument?.defaultView;
		if (!frameWin?.FooGallery || !frameWin?.FooGallery.$) return;

		frameWin.FooGallery.$(galleryRef.current)
			.children('.foogallery')
			.foogallery(frameWin.FooGallery.autoDefaults);

	}, [ status, content ] );

	if ( status === 'loading' || status === 'idle' ) {
		return (
			<FooGalleryEditPlaceholder instructions={ loading }>
				<Spinner />
			</FooGalleryEditPlaceholder>
		);
	}

	if ( status === 'error' ) {
		const errorMessage = sprintf( error, errorMsg );
		return <FooGalleryEditPlaceholder instructions={ errorMessage } />;
	}

	if ( !content ) {
		return <FooGalleryEditPlaceholder instructions={ empty } />;
	}

	return (
		<div
			dangerouslySetInnerHTML={ { __html: content } }
			ref={ galleryRef }
		/>
	);
}
