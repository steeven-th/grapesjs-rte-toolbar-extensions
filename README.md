# Grapesjs RTE Toolbar Extensions

[DEMO](https://codepen.io/steeven-th/pen/jEPRYPJ)

### HTML
```html
<link href="https://unpkg.com/grapesjs/dist/css/grapes.min.css" rel="stylesheet">
<script src="https://unpkg.com/grapesjs"></script>
<script src="https://unpkg.com/grapesjs-rte-toolbar-extensions"></script>

<div id="gjs"></div>
```

### JS
```js
const editor = grapesjs.init({
	container: '#gjs',
  height: '100%',
  fromElement: true,
  storageManager: false,
  plugins: ['grapesjs-rte-toolbar-extensions'],
});
```

### CSS
```css
body, html {
  margin: 0;
  height: 100%;
}
```


## Summary

* Plugin name: `grapesjs-rte-toolbar-extensions`
* Description: This plugin extends the default GrapesJS Rich Text Editor (RTE) toolbar by adding a wide range of customizable text formatting tools. It includes buttons for inline styles (bold, italic, underline, strikethrough), font families and sizes, headings, alignment, quotes, lists, indentation, subscript/superscript, case transformation, horizontal line, undo/redo, and even a custom “span” wrapper with its own GrapesJS toolbar support.
  Each feature is modular and can be enabled or disabled individually through options.


## Options

## Options

| Option                  | Description                                                                                   | Default     |
|-------------------------|-----------------------------------------------------------------------------------------------|-------------|
| `base.bold`             | Enables the **bold** button.                                                                  | `true`      |
| `base.italic`           | Enables the **italic** button.                                                                | `true`      |
| `base.underline`        | Enables the **underline** button.                                                             | `true`      |
| `base.strikethrough`    | Enables the **strikethrough** button.                                                         | `true`      |
| `base.link`             | Enables the **link** button.                                                                  | `true`      |
| `fonts.span`            | Adds a **wrap in span** button.                                                               | `true`      |
| `fonts.fontName`        | Array of font names to be displayed in a dropdown. Set to `false` to disable.                 | `false`     |
| `fonts.fontSize`        | Enables a **font size** dropdown selector.                                                    | `false`     |
| `format.heading1`       | Adds **H1** format button.                                                                     | `true`      |
| `format.heading2`       | Adds **H2** format button.                                                                     | `true`      |
| `format.heading3`       | Adds **H3** format button.                                                                     | `true`      |
| `format.heading4`       | Adds **H4** format button.                                                                     | `true`      |
| `format.heading5`       | Adds **H5** format button.                                                                     | `true`      |
| `format.heading6`       | Adds **H6** format button.                                                                     | `true`      |
| `format.paragraph`      | Adds **Paragraph** format button.                                                              | `true`      |
| `format.quote`          | Adds a **blockquote** format button.                                                          | `true`      |
| `subscriptSuperscript`  | Adds **subscript** and **superscript** buttons.                                               | `true`      |
| `indentOutdent`         | Adds **indent** and **outdent** buttons.                                                      | `true`      |
| `list`                  | Adds **ordered list** and **unordered list** buttons.                                         | `true`      |
| `align`                 | Adds **text alignment** buttons: left, center, right, justify.                                | `true`      |
| `actions`               | Reserved for future use (currently unused).                                                   | `true`      |
| `undoredo`              | Adds **undo** and **redo** buttons.                                                           | `true`      |
| `extra`                 | Adds **uppercase**, **lowercase**, and **horizontal line** tools.                             | `true`      |
| `icons`                 | Object allowing to override default button icons. Example: `{ heading1: '<b>H1</b>' }`.       | `{}`        |
| `maxWidth`              | Optional CSS `max-width` for the toolbar element. Example: `"700px"`                          | `undefined` |


## Download

* CDN
    * `https://unpkg.com/grapesjs-rte-toolbar-extensions`
* NPM
    * `npm i grapesjs-rte-toolbar-extensions`
* GIT
    * `git clone https://github.com/steeven-th/grapesjs-rte-toolbar-extensions.git`



## Usage

Directly in the browser
```html
<link href="https://unpkg.com/grapesjs/dist/css/grapes.min.css" rel="stylesheet"/>
<script src="https://unpkg.com/grapesjs"></script>
<script src="path/to/grapesjs-rte-toolbar-extensions.min.js"></script>

<div id="gjs"></div>

<script type="text/javascript">
  var editor = grapesjs.init({
      container: '#gjs',
      // ...
      plugins: ['grapesjs-rte-toolbar-extensions'],
      pluginsOpts: {
        'grapesjs-rte-toolbar-extensions': { /* options */ }
      }
  });
</script>
```

Modern javascript
```js
import grapesjs from 'grapesjs';
import rteToolbarExtensionsPlugin from 'grapesjs-rte-toolbar-extensions';
import 'grapesjs/dist/css/grapes.min.css';

const editor = grapesjs.init({
  container : '#gjs',
  // ...
  plugins: [rteToolbarExtensionsPlugin],
  pluginsOpts: {
    [rteToolbarExtensionsPlugin]: { /* options */ }
  }
  // or
  plugins: [
    editor => rteToolbarExtensionsPlugin(editor, { /* options */ }),
  ],
});
```

### Example

```js
import grapesjs from 'grapesjs';
import rteToolbarExtensionsPlugin from 'grapesjs-rte-toolbar-extensions';
import 'grapesjs/dist/css/grapes.min.css';

const editor = grapesjs.init({
    container : '#gjs',
    height: '100%',
    fromElement: true,
    storageManager: false,
    plugins: [rteToolbarExtensionsPlugin],
    pluginsOpts: {
        [rteToolbarExtensionsPlugin]: {
            base: {
                bold: true,
                italic: true,
                underline: true,
                strikethrough: false,
                link: true,
            },
            fonts: {
                span: true,
                fontName: ['Arial', 'Georgia', 'Courier New'],
                fontSize: true,
            },
            format: {
                heading1: true,
                heading2: true,
                heading3: false,
                heading4: false,
                heading5: false,
                heading6: false,
                paragraph: true,
                quote: true,
            },
            subscriptSuperscript: true,
            indentOutdent: true,
            list: true,
            align: true,
            actions: true,
            undoredo: true,
            extra: true,
            icons: {
                heading1: '<b>H1</b>',
                heading2: '<b>H2</b>',
                uppercase: '<span style="font-weight:bold;">UP</span>',
            },
            maxWidth: '700px',
        },
    }
});
```


## Development

Clone the repository

```sh
$ git clone https://github.com/steeven-th/grapesjs-rte-toolbar-extensions.git
$ cd grapesjs-rte-toolbar-extensions
```

Install dependencies

```sh
$ npm i
```

Start the dev server

```sh
$ npm start
```

Build the source

```sh
$ npm run build
```



## License

MIT
