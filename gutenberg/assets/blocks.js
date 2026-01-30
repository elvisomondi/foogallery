/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./gutenberg/src/block/edit/components/block-controls.js":
/*!***************************************************************!*\
  !*** ./gutenberg/src/block/edit/components/block-controls.js ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ FooGalleryEditBlockControls; }
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__);





class FooGalleryEditBlockControls extends _wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Component {
  render() {
    const {
      select,
      onRequestModalOpen,
      canEdit,
      edit,
      onRequestGalleryEdit,
      canReload,
      reload,
      onRequestGalleryReload,
      remove,
      onRequestBlockRemove,
      children
    } = this.props;
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.BlockControls, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToolbarGroup, {
      className: "foogallery__toolbar-group"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToolbarButton, {
      icon: "trash",
      label: remove,
      onClick: onRequestBlockRemove
    })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToolbarGroup, {
      className: "foogallery__toolbar-group"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToolbarButton, {
      icon: "format-gallery",
      label: select,
      onClick: onRequestModalOpen
    }), canEdit ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToolbarButton, {
      icon: "edit",
      label: edit,
      onClick: onRequestGalleryEdit
    }) : null, canReload ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToolbarButton, {
      icon: "update",
      label: reload,
      onClick: onRequestGalleryReload
    }) : null), children);
  }
}
FooGalleryEditBlockControls.defaultProps = {
  canEdit: false,
  canReload: false,
  select: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Select gallery", "foogallery"),
  remove: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Remove gallery", "foogallery"),
  reload: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Reload gallery", "foogallery"),
  edit: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Edit gallery", "foogallery"),
  onRequestModalOpen: _.noop,
  onRequestBlockRemove: _.noop,
  onRequestGalleryEdit: _.noop,
  onRequestGalleryReload: _.noop
};

/***/ }),

/***/ "./gutenberg/src/block/edit/components/index.js":
/*!******************************************************!*\
  !*** ./gutenberg/src/block/edit/components/index.js ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FooGalleryEditBlockControls": function() { return /* reexport safe */ _block_controls__WEBPACK_IMPORTED_MODULE_1__["default"]; },
/* harmony export */   "FooGalleryEditInspectorControls": function() { return /* reexport safe */ _inspector_controls__WEBPACK_IMPORTED_MODULE_2__["default"]; },
/* harmony export */   "FooGalleryEditModal": function() { return /* reexport safe */ _modal__WEBPACK_IMPORTED_MODULE_0__["default"]; },
/* harmony export */   "FooGalleryEditPlaceholder": function() { return /* reexport safe */ _placeholder__WEBPACK_IMPORTED_MODULE_3__["default"]; },
/* harmony export */   "FooGalleryEditServerSideRender": function() { return /* reexport safe */ _server_side_render__WEBPACK_IMPORTED_MODULE_4__["default"]; }
/* harmony export */ });
/* harmony import */ var _modal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modal */ "./gutenberg/src/block/edit/components/modal/index.js");
/* harmony import */ var _block_controls__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./block-controls */ "./gutenberg/src/block/edit/components/block-controls.js");
/* harmony import */ var _inspector_controls__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./inspector-controls */ "./gutenberg/src/block/edit/components/inspector-controls/index.js");
/* harmony import */ var _placeholder__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./placeholder */ "./gutenberg/src/block/edit/components/placeholder.js");
/* harmony import */ var _server_side_render__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./server-side-render */ "./gutenberg/src/block/edit/components/server-side-render.js");






/***/ }),

/***/ "./gutenberg/src/block/edit/components/inspector-controls/index.js":
/*!*************************************************************************!*\
  !*** ./gutenberg/src/block/edit/components/inspector-controls/index.js ***!
  \*************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ FooGalleryEditInspectorControls; }
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./editor.scss */ "./gutenberg/src/block/edit/components/inspector-controls/editor.scss");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_4__);






class FooGalleryEditInspectorControls extends _wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Component {
  render() {
    const {
      select,
      onRequestModalOpen,
      canEdit,
      edit,
      onRequestGalleryEdit,
      children
    } = this.props;
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_4__.InspectorControls, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "foogallery-inspector-controls__button-container"
    }, canEdit ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Button, {
      isSecondary: true,
      onClick: onRequestGalleryEdit,
      icon: "edit",
      label: edit
    }) : null, "\xA0", (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Button, {
      isPrimary: true,
      onClick: onRequestModalOpen
    }, select)), children);
  }
}
FooGalleryEditInspectorControls.defaultProps = {
  canEdit: false,
  edit: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Edit Gallery", "foogallery"),
  select: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Select Gallery", "foogallery"),
  onRequestGalleryEdit: _.noop,
  onRequestModalOpen: _.noop
};

/***/ }),

/***/ "./gutenberg/src/block/edit/components/modal/index.js":
/*!************************************************************!*\
  !*** ./gutenberg/src/block/edit/components/modal/index.js ***!
  \************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ FooGalleryEditModal; }
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./editor.scss */ "./gutenberg/src/block/edit/components/modal/editor.scss");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _item__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./item */ "./gutenberg/src/block/edit/components/modal/item.js");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__);





/**
 * Internal block libraries
 */




/**
 * Create the FooGallery Select Modal Component
 */
class FooGalleryEditModal extends _wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Component {
  constructor() {
    super(...arguments);
    this.state = {
      id: this.props.currentId,
      data: null,
      isLoading: false,
      query: ''
    };
    this.onReloadClick = this.onReloadClick.bind(this);
    this.onInsertClick = this.onInsertClick.bind(this);
    this.onQueryChange = this.onQueryChange.bind(this);
  }
  async fetchGalleries() {
    this.setState({
      data: null,
      isLoading: true
    });
    let data = await wp.apiFetch({
      path: "/foogallery/v1/galleries/"
    });
    data.forEach(gallery => {
      gallery.lowerName = typeof gallery.name === 'string' ? gallery.name.toLowerCase() : '';
    });
    this.setState({
      data: data,
      isLoading: false
    });
  }
  componentDidMount() {
    const {
      data,
      isLoading
    } = this.state;
    if (data === null && !isLoading) {
      this.fetchGalleries();
    }
  }
  onReloadClick(event) {
    event.stopPropagation();
    this.fetchGalleries();
  }
  onInsertClick(event) {
    event.stopPropagation();
    const {
      onRequestModalClose,
      onRequestGalleryInsert
    } = this.props;
    const {
      id
    } = this.state;
    if (id !== 0) {
      onRequestGalleryInsert(id);
      onRequestModalClose();
    }
  }
  onQueryChange(event) {
    this.setState({
      query: event.target.value
    });
  }
  render() {
    const {
      isModalOpen,
      className,
      title,
      insert,
      reload,
      search,
      onRequestModalClose
    } = this.props;
    if (!isModalOpen) {
      return null;
    }
    const {
      id,
      isLoading,
      query
    } = this.state;
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.Modal, {
      className: classnames__WEBPACK_IMPORTED_MODULE_2___default()("foogallery-modal", className),
      title: title,
      onRequestClose: onRequestModalClose
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "foogallery-modal__content"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "foogallery-modal__content-container"
    }, this.renderContent())), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "foogallery-modal__footer"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
      type: "text",
      className: "foogallery-modal__footer-search",
      placeholder: search,
      value: query,
      onChange: this.onQueryChange
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "foogallery-modal__footer-buttons"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.Button, {
      isSecondary: true,
      icon: "update",
      label: reload,
      onClick: this.onReloadClick,
      disabled: isLoading
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.Button, {
      isPrimary: true,
      onClick: this.onInsertClick,
      disabled: id === 0
    }, insert))));
  }
  renderContent() {
    const {
      disable,
      empty,
      loading
    } = this.props;
    const {
      id,
      data,
      isLoading,
      query
    } = this.state;
    if (data === null && !isLoading) {
      return null;
    }
    if (isLoading) {
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.Placeholder, {
        className: "foogallery-modal__content-placeholder",
        label: loading
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.Spinner, null));
    }
    if (data === null || !data.length) {
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.Placeholder, {
        className: "foogallery-modal__content-placeholder",
        label: empty
      });
    }
    let self = this,
      hasQuery = query && query.length > 2,
      lowerQuery = hasQuery ? query.toLowerCase() : '',
      filtered = hasQuery ? data.filter(gallery => {
        return gallery.lowerName.indexOf(lowerQuery) !== -1;
      }) : data;
    return filtered.map(gallery => {
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_item__WEBPACK_IMPORTED_MODULE_3__["default"], {
        key: gallery.id,
        data: gallery,
        isSelected: id === gallery.id,
        isDisabled: disable.indexOf(gallery.id) !== -1,
        onSelected: nextId => {
          self.setState({
            id: id === nextId ? 0 : nextId
          });
        }
      });
    });
  }
}
FooGalleryEditModal.defaultProps = {
  currentId: 0,
  isModalOpen: false,
  className: "",
  title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)("Select a gallery"),
  empty: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)("No galleries found!"),
  insert: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)("Insert Gallery"),
  reload: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)("Reload Galleries"),
  loading: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)("Loading galleries please wait..."),
  search: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)("Search..."),
  disable: [],
  onRequestGalleryInsert: _.noop,
  onRequestModalClose: _.noop
};

/***/ }),

/***/ "./gutenberg/src/block/edit/components/modal/item.js":
/*!***********************************************************!*\
  !*** ./gutenberg/src/block/edit/components/modal/item.js ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ FooGalleryEditModalItem; }
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);




class FooGalleryEditModalItem extends _wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Component {
  render() {
    const {
      data,
      className,
      isSelected,
      isDisabled,
      onSelected
    } = this.props;
    let props = {
      className: classnames__WEBPACK_IMPORTED_MODULE_1___default()("foogallery-modal__item", className, {
        "is-selected": isSelected,
        "is-disabled": isDisabled
      })
    };
    if (!isDisabled) {
      let selectable = {
        onClick: event => {
          event.stopPropagation();
          onSelected(data.id);
        },
        onKeyPress: event => {
          event.stopPropagation();
          if (event.which === 32 || event.which === 13) {
            onSelected(data.id);
          }
        },
        tabIndex: 0
      };
      props = {
        ...props,
        ...selectable
      };
    }
    let thumb = !!data.thumbnail ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("img", {
      className: "foogallery-modal__item-thumbnail",
      src: data.thumbnail,
      alt: data.name
    }) : (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Dashicon, {
      className: "foogallery-modal__item-thumbnail",
      icon: "format-image"
    });
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("figure", props, thumb, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("figcaption", {
      className: "foogallery-modal__item-caption"
    }, data.name), isSelected ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Dashicon, {
      className: "foogallery-modal__icon-selected",
      icon: "yes"
    }) : null, isDisabled ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Dashicon, {
      className: "foogallery-modal__icon-disabled",
      icon: "no"
    }) : null);
  }
}
FooGalleryEditModalItem.defaultProps = {
  data: {},
  className: "",
  isSelected: false,
  isDisabled: false,
  onSelected: _.noop
};

/***/ }),

/***/ "./gutenberg/src/block/edit/components/placeholder.js":
/*!************************************************************!*\
  !*** ./gutenberg/src/block/edit/components/placeholder.js ***!
  \************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ FooGalleryEditPlaceholder; }
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);





class FooGalleryEditPlaceholder extends _wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Component {
  render() {
    const {
      className,
      children,
      ...props
    } = this.props;
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Placeholder, (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
      className: classnames__WEBPACK_IMPORTED_MODULE_2___default()("editor-media-placeholder foogallery__placeholder", className)
    }, props), children);
  }
}

/***/ }),

/***/ "./gutenberg/src/block/edit/components/server-side-render.js":
/*!*******************************************************************!*\
  !*** ./gutenberg/src/block/edit/components/server-side-render.js ***!
  \*******************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ FooGalleryEditServerSideRender; }
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _placeholder__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./placeholder */ "./gutenberg/src/block/edit/components/placeholder.js");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_server_side_render__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/server-side-render */ "@wordpress/server-side-render");
/* harmony import */ var _wordpress_server_side_render__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_server_side_render__WEBPACK_IMPORTED_MODULE_4__);






function FooGalleryEditServerSideRender(_ref) {
  let {
    block = 'fooplugins/foogallery',
    attributes = {},
    urlQueryArgs = {},
    reload = false,
    loading = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Loading gallery...', 'foogallery'),
    error = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Error loading gallery: %s', 'foogallery'),
    empty = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('No gallery was found.', 'foogallery')
  } = _ref;
  const galleryRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const mergedUrlQueryArgs = {
    ...urlQueryArgs,
    _foogalleryReload: reload ? '1' : '0'
  };
  const {
    status,
    content,
    error: errorMsg
  } = (0,_wordpress_server_side_render__WEBPACK_IMPORTED_MODULE_4__.useServerSideRender)({
    block,
    attributes,
    urlQueryArgs: mergedUrlQueryArgs
  });
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (status !== 'success' || !content || !galleryRef.current) {
      return;
    }
    if (typeof jQuery === 'undefined' || typeof FooGallery === 'undefined') {
      return;
    }
    const frameWin = galleryRef.current?.ownerDocument?.defaultView;
    if (!frameWin?.FooGallery || !frameWin?.FooGallery.$) return;
    frameWin.FooGallery.$(galleryRef.current).children('.foogallery').foogallery(frameWin.FooGallery.autoDefaults);
  }, [status, content]);
  if (status === 'loading' || status === 'idle') {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_placeholder__WEBPACK_IMPORTED_MODULE_1__["default"], {
      instructions: loading
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Spinner, null));
  }
  if (status === 'error') {
    const errorMessage = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.sprintf)(error, errorMsg);
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_placeholder__WEBPACK_IMPORTED_MODULE_1__["default"], {
      instructions: errorMessage
    });
  }
  if (!content) {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_placeholder__WEBPACK_IMPORTED_MODULE_1__["default"], {
      instructions: empty
    });
  }
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    dangerouslySetInnerHTML: {
      __html: content
    },
    ref: galleryRef
  });
}

/***/ }),

/***/ "./gutenberg/src/block/edit/index.js":
/*!*******************************************!*\
  !*** ./gutenberg/src/block/edit/index.js ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ FooGalleryEdit; }
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _rendered__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./rendered */ "./gutenberg/src/block/edit/rendered.js");
/* harmony import */ var _views__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./views */ "./gutenberg/src/block/edit/views/index.js");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_5__);







const {
  editGalleryUrl
} = window.FOOGALLERY_BLOCK;
class FooGalleryEdit extends _wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Component {
  /**
   * Called whenever a block is created in the editor.
   */
  constructor() {
    super(...arguments);

    // Keep track of whether or not the modal is open and a boolean indicating if the component should reload in the state.
    this.state = {
      isModalOpen: false,
      reload: false // to force a reload simply call this.setState({ reload: !this.state.reload })
    };

    // Ensure that whenever this methods are called the `this` variable correctly points to this instance of the component.
    this.showModal = this.showModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.insertGallery = this.insertGallery.bind(this);
    this.editGallery = this.editGallery.bind(this);
    this.reloadGallery = this.reloadGallery.bind(this);
    this.removeBlock = this.removeBlock.bind(this);
  }

  /**
   * Every time the editor is mounted add the current gallery id and clientId to the static rendered array.
   */
  componentDidMount() {
    const {
      clientId,
      attributes: {
        id
      }
    } = this.props;
    if (id !== 0) {
      _rendered__WEBPACK_IMPORTED_MODULE_2__["default"].add(id, clientId);
    }
  }

  /**
   * Whenever the editor is unmounted remove the id and clientId from the static rendered array.
   */
  componentWillUnmount() {
    const {
      clientId,
      attributes: {
        id
      }
    } = this.props;
    if (id !== 0) {
      _rendered__WEBPACK_IMPORTED_MODULE_2__["default"].remove(clientId);
    }
  }
  showModal() {
    this.setState({
      isModalOpen: true
    });
  }
  closeModal() {
    this.setState({
      isModalOpen: false
    });
  }
  insertGallery(id) {
    const {
      clientId,
      setAttributes
    } = this.props;
    _rendered__WEBPACK_IMPORTED_MODULE_2__["default"].update(id, clientId);
    setAttributes({
      id
    });
  }
  editGallery() {
    const {
      attributes: {
        id
      }
    } = this.props;
    let editPost = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.sprintf)(editGalleryUrl, id);
    window.open(editPost, "_blank");
  }
  reloadGallery() {
    const {
      reload
    } = this.state;
    this.setState({
      reload: !reload
    });
  }
  removeBlock() {
    const {
      clientId
    } = this.props;
    (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_5__.dispatch)("core/editor").removeBlock(clientId);
  }
  render() {
    const {
      attributes,
      clientId
    } = this.props;
    const {
      isModalOpen,
      reload
    } = this.state;
    let props = {
      disable: _rendered__WEBPACK_IMPORTED_MODULE_2__["default"].ids(),
      isModalOpen: isModalOpen,
      onRequestModalOpen: this.showModal,
      onRequestModalClose: this.closeModal,
      onRequestBlockRemove: this.removeBlock,
      onRequestGalleryInsert: this.insertGallery,
      onRequestGalleryEdit: this.editGallery,
      onRequestGalleryReload: this.reloadGallery
    };
    if (_rendered__WEBPACK_IMPORTED_MODULE_2__["default"].contains(attributes.id, clientId)) {
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_views__WEBPACK_IMPORTED_MODULE_3__.FooGalleryEditDuplicate, props);
    }
    if (!attributes.id) {
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_views__WEBPACK_IMPORTED_MODULE_3__.FooGalleryEditEmpty, props);
    }
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_views__WEBPACK_IMPORTED_MODULE_3__.FooGalleryEditPopulated, (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
      attributes: attributes,
      reload: reload
    }, props));
  }
}
FooGalleryEdit.defaultProps = {};

/***/ }),

/***/ "./gutenberg/src/block/edit/rendered.js":
/*!**********************************************!*\
  !*** ./gutenberg/src/block/edit/rendered.js ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ FooGalleryEditRendered; }
/* harmony export */ });
const rendered = [];
class FooGalleryEditRendered {
  static get array() {
    return rendered;
  }
  static add(id, clientId) {
    let index = rendered.findIndex(r => r.id === id);
    if (index === -1) {
      rendered.push({
        id,
        clientId
      });
      return true;
    }
    return false;
  }
  static remove(clientId) {
    let index = rendered.findIndex(r => r.clientId === clientId);
    if (index !== -1) {
      rendered.splice(index, 1);
      return true;
    }
    return index === -1 || false;
  }
  static update(id, clientId) {
    if (this.remove(clientId)) {
      return this.add(id, clientId);
    }
    return false;
  }
  static ids() {
    return rendered.map(r => r.id);
  }
  static contains(id, clientId) {
    return rendered.findIndex(r => r.id === id && r.clientId !== clientId) !== -1;
  }
}

/***/ }),

/***/ "./gutenberg/src/block/edit/views/duplicate.js":
/*!*****************************************************!*\
  !*** ./gutenberg/src/block/edit/views/duplicate.js ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ FooGalleryEditDuplicate; }
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../components */ "./gutenberg/src/block/edit/components/index.js");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);





class FooGalleryEditDuplicate extends _wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Component {
  render() {
    const {
      icon,
      label,
      instructions,
      button,
      ...props
    } = this.props;
    let placeholderProps = {
      icon,
      label,
      instructions
    };
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components__WEBPACK_IMPORTED_MODULE_1__.FooGalleryEditBlockControls, props), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components__WEBPACK_IMPORTED_MODULE_1__.FooGalleryEditPlaceholder, placeholderProps, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Button, {
      isSecondary: true,
      onClick: props.onRequestModalOpen
    }, button)), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components__WEBPACK_IMPORTED_MODULE_1__.FooGalleryEditModal, props), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components__WEBPACK_IMPORTED_MODULE_1__.FooGalleryEditInspectorControls, props));
  }
}
FooGalleryEditDuplicate.defaultProps = {
  icon: "format-gallery",
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("FooGallery", "foogallery"),
  instructions: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Duplicate gallery, please select another to insert.", "foogallery"),
  button: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Select Gallery", "foogallery"),
  onRequestModalOpen: _.noop
};

/***/ }),

/***/ "./gutenberg/src/block/edit/views/empty.js":
/*!*************************************************!*\
  !*** ./gutenberg/src/block/edit/views/empty.js ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ FooGalleryEditEmpty; }
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../components */ "./gutenberg/src/block/edit/components/index.js");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);





class FooGalleryEditEmpty extends _wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Component {
  render() {
    const {
      icon,
      label,
      instructions,
      button,
      ...props
    } = this.props;
    let placeholderProps = {
      icon,
      label,
      instructions
    };
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components__WEBPACK_IMPORTED_MODULE_1__.FooGalleryEditBlockControls, props), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components__WEBPACK_IMPORTED_MODULE_1__.FooGalleryEditPlaceholder, placeholderProps, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Button, {
      isSecondary: true,
      onClick: props.onRequestModalOpen
    }, button)), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components__WEBPACK_IMPORTED_MODULE_1__.FooGalleryEditModal, props), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components__WEBPACK_IMPORTED_MODULE_1__.FooGalleryEditInspectorControls, props));
  }
}
FooGalleryEditEmpty.defaultProps = {
  icon: "format-gallery",
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("FooGallery", "foogallery"),
  instructions: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Select the gallery you want to insert.", "foogallery"),
  button: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Select Gallery", "foogallery"),
  onRequestModalOpen: _.noop
};

/***/ }),

/***/ "./gutenberg/src/block/edit/views/index.js":
/*!*************************************************!*\
  !*** ./gutenberg/src/block/edit/views/index.js ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FooGalleryEditDuplicate": function() { return /* reexport safe */ _duplicate__WEBPACK_IMPORTED_MODULE_1__["default"]; },
/* harmony export */   "FooGalleryEditEmpty": function() { return /* reexport safe */ _empty__WEBPACK_IMPORTED_MODULE_0__["default"]; },
/* harmony export */   "FooGalleryEditPopulated": function() { return /* reexport safe */ _populated__WEBPACK_IMPORTED_MODULE_2__["default"]; }
/* harmony export */ });
/* harmony import */ var _empty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./empty */ "./gutenberg/src/block/edit/views/empty.js");
/* harmony import */ var _duplicate__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./duplicate */ "./gutenberg/src/block/edit/views/duplicate.js");
/* harmony import */ var _populated__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./populated */ "./gutenberg/src/block/edit/views/populated.js");




/***/ }),

/***/ "./gutenberg/src/block/edit/views/populated.js":
/*!*****************************************************!*\
  !*** ./gutenberg/src/block/edit/views/populated.js ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ FooGalleryEditPopulated; }
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../components */ "./gutenberg/src/block/edit/components/index.js");



class FooGalleryEditPopulated extends _wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Component {
  render() {
    const {
      block,
      attributes,
      reload,
      ...props
    } = this.props;
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components__WEBPACK_IMPORTED_MODULE_1__.FooGalleryEditBlockControls, props), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components__WEBPACK_IMPORTED_MODULE_1__.FooGalleryEditServerSideRender, {
      block: block,
      attributes: attributes,
      reload: reload
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components__WEBPACK_IMPORTED_MODULE_1__.FooGalleryEditModal, props), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components__WEBPACK_IMPORTED_MODULE_1__.FooGalleryEditInspectorControls, props));
  }
}
FooGalleryEditPopulated.defaultProps = {
  block: "fooplugins/foogallery",
  attributes: {},
  reload: false,
  canEdit: true,
  canReload: true
};

/***/ }),

/***/ "./gutenberg/src/block/index.js":
/*!**************************************!*\
  !*** ./gutenberg/src/block/index.js ***!
  \**************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./editor.scss */ "./gutenberg/src/block/editor.scss");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./edit */ "./gutenberg/src/block/edit/index.js");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../block.json */ "./gutenberg/block.json");

/**
 * BLOCK: fooplugins/foogallery
 *
 * Registering a basic FooGallery block with Gutenberg.
 */





const FooGalleryEditWithBlockProps = props => {
  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.useBlockProps)();
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", blockProps, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_edit__WEBPACK_IMPORTED_MODULE_4__["default"], props));
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
(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_2__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_5__.name, {
  ..._block_json__WEBPACK_IMPORTED_MODULE_5__,
  /**
   * The edit function describes the structure of your block in the context of the editor.
   * This represents what the editor will render when the block is used.
   *
   * The "edit" property must be a valid function.
   *
   * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
   */
  edit(props) {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(FooGalleryEditWithBlockProps, props);
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
  }
});

/***/ }),

/***/ "./node_modules/classnames/index.js":
/*!******************************************!*\
  !*** ./node_modules/classnames/index.js ***!
  \******************************************/
/***/ (function(module, exports) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
	Copyright (c) 2018 Jed Watson.
	Licensed under the MIT License (MIT), see
	http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	'use strict';

	var hasOwn = {}.hasOwnProperty;
	var nativeCodeString = '[native code]';

	function classNames() {
		var classes = [];

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (!arg) continue;

			var argType = typeof arg;

			if (argType === 'string' || argType === 'number') {
				classes.push(arg);
			} else if (Array.isArray(arg)) {
				if (arg.length) {
					var inner = classNames.apply(null, arg);
					if (inner) {
						classes.push(inner);
					}
				}
			} else if (argType === 'object') {
				if (arg.toString !== Object.prototype.toString && !arg.toString.toString().includes('[native code]')) {
					classes.push(arg.toString());
					continue;
				}

				for (var key in arg) {
					if (hasOwn.call(arg, key) && arg[key]) {
						classes.push(key);
					}
				}
			}
		}

		return classes.join(' ');
	}

	if ( true && module.exports) {
		classNames.default = classNames;
		module.exports = classNames;
	} else if (true) {
		// register as 'classnames', consistent with npm package name
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
			return classNames;
		}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {}
}());


/***/ }),

/***/ "./gutenberg/src/block/edit/components/inspector-controls/editor.scss":
/*!****************************************************************************!*\
  !*** ./gutenberg/src/block/edit/components/inspector-controls/editor.scss ***!
  \****************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./gutenberg/src/block/edit/components/modal/editor.scss":
/*!***************************************************************!*\
  !*** ./gutenberg/src/block/edit/components/modal/editor.scss ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./gutenberg/src/block/editor.scss":
/*!*****************************************!*\
  !*** ./gutenberg/src/block/editor.scss ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "@wordpress/block-editor":
/*!*************************************!*\
  !*** external ["wp","blockEditor"] ***!
  \*************************************/
/***/ (function(module) {

"use strict";
module.exports = window["wp"]["blockEditor"];

/***/ }),

/***/ "@wordpress/blocks":
/*!********************************!*\
  !*** external ["wp","blocks"] ***!
  \********************************/
/***/ (function(module) {

"use strict";
module.exports = window["wp"]["blocks"];

/***/ }),

/***/ "@wordpress/components":
/*!************************************!*\
  !*** external ["wp","components"] ***!
  \************************************/
/***/ (function(module) {

"use strict";
module.exports = window["wp"]["components"];

/***/ }),

/***/ "@wordpress/data":
/*!******************************!*\
  !*** external ["wp","data"] ***!
  \******************************/
/***/ (function(module) {

"use strict";
module.exports = window["wp"]["data"];

/***/ }),

/***/ "@wordpress/element":
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
/***/ (function(module) {

"use strict";
module.exports = window["wp"]["element"];

/***/ }),

/***/ "@wordpress/i18n":
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
/***/ (function(module) {

"use strict";
module.exports = window["wp"]["i18n"];

/***/ }),

/***/ "@wordpress/server-side-render":
/*!******************************************!*\
  !*** external ["wp","serverSideRender"] ***!
  \******************************************/
/***/ (function(module) {

"use strict";
module.exports = window["wp"]["serverSideRender"];

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/extends.js":
/*!************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/extends.js ***!
  \************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _extends; }
/* harmony export */ });
function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}

/***/ }),

/***/ "./gutenberg/block.json":
/*!******************************!*\
  !*** ./gutenberg/block.json ***!
  \******************************/
/***/ (function(module) {

"use strict";
module.exports = JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"fooplugins/foogallery","title":"FooGallery","description":"Insert a FooGallery into your content","category":"media","icon":"format-gallery","keywords":["foogallery","gallery"],"textdomain":"foogallery","attributes":{"id":{"type":"number","default":0},"className":{"type":"string"}},"supports":{"multiple":true,"html":false}}');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
!function() {
"use strict";
/*!********************************!*\
  !*** ./gutenberg/src/index.js ***!
  \********************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _block___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./block/ */ "./gutenberg/src/block/index.js");
/**
 * Gutenberg Blocks
 *
 * All blocks related JavaScript files should be imported here.
 * You can create a new block folder in this dir and include code
 * for that block here as well.
 *
 * All blocks should be included here since this is the file that
 * Webpack is compiling as the input file.
 */

}();
/******/ })()
;
//# sourceMappingURL=blocks.js.map