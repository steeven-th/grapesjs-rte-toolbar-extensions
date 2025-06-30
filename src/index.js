import en from './locale/en';
import de from './locale/de';
import fr from './locale/fr';

export default (editor, opts = {}) => {
    const options = {
        ...{
            base: { bold: true, italic: true, underline: true, strikethrough: true, link: true },
            fonts: { span: true },
            format: {
                heading1: true, heading2: true, heading3: true,
                heading4: true, heading5: true, heading6: true,
                paragraph: true, quote: true
            },
            subscriptSuperscript: true,
            indentOutdent: true,
            list: true,
            align: true,
            actions: true,
            undoredo: true,
            extra: true,
            icons: {},
        },
        ...opts,
    };

    const { icons } = options;
    const formatBlock = "formatBlock";
    const rte = editor.RichTextEditor;

    const addCommand = (name, title, command, fallbackIcon) => {
        rte.add(name, {
            icon: icons[name] || fallbackIcon || undefined,
            attributes: { title },
            result: (rte) => rte.exec(command || name),
        });
    };

    const fontNames = Array.isArray(options.fonts.fontName) ? options.fonts.fontName : false;
    options.fonts.fontName = fontNames;

    const fontOptionsEl = fontNames
        ? fontNames.map(font => `<option>${font.toString()}</option>`).join("")
        : "";

    const fontNamesEl = `<select style="height:1.8rem;color:inherit;" class="gjs-field gjs-field-select">
        ${fontOptionsEl}
    </select>`;

    editor.onReady(() => {
        if (options.maxWidth)
            rte.getToolbarEl().firstChild.style.maxWidth = options.maxWidth;

        if (!options.base || typeof options.base === "object") {
            !options.base.bold && rte.remove("bold");
            !options.base.italic && rte.remove("italic");
            !options.base.underline && rte.remove("underline");
            !options.base.strikethrough && rte.remove("strikethrough");
            !options.base.link && rte.remove("link");
        }

        fontNames && rte.add("fontName", {
            icon: fontNamesEl,
            event: "change",
            attributes: { style: "padding: 0 4px 2px;", title: "Font Name" },
            result: (rte, action) => rte.exec("fontName", action.btn.firstChild.value),
            update: (rte, action) => {
                const value = rte.doc.queryCommandValue(action.name);
                if (value != "false") action.btn.firstChild.value = value;
            },
        });

        options.fonts.fontSize && rte.add("fontSize", {
            icon: `<select style="height:1.8rem;color:inherit;" class="gjs-field gjs-field-select">
                <option value="1">xx-small</option>
                <option value="2">x-small</option>
                <option value="3">small</option>
                <option value="4">medium</option>
                <option value="5">large</option>
                <option value="6">x-large</option>
                <option value="7">xx-large</option>
            </select>`,
            event: "change",
            attributes: { style: "padding: 0 4px 2px;", title: "Font Size" },
            result: (rte, action) => rte.exec("fontSize", action.btn.firstChild.value),
            update: (rte, action) => {
                const value = rte.doc.queryCommandValue(action.name);
                if (value != "false") action.btn.firstChild.value = value;
            },
        });

        // Span inline tool
        options.fonts?.span && rte.add("span", {
            icon: icons.span || "<div>Span</div>",
            attributes: { title: "Wrap in span" },
            result: (rte) => {
                const sel = rte.doc.getSelection();
                if (!sel.rangeCount) return;
                const range = sel.getRangeAt(0);
                if (range.collapsed) return;
                const parentTag = range.startContainer.parentElement?.tagName;
                if (parentTag === 'SPAN') return;
                const span = rte.doc.createElement("span");
                span.className = "gjs-inline-span-in-paragraph";
                span.textContent = range.toString();
                range.deleteContents();
                range.insertNode(span);
                const newRange = rte.doc.createRange();
                newRange.selectNodeContents(span);
                sel.removeAllRanges();
                sel.addRange(newRange);
            },
        });

        // Commandes de formatage
        options.format?.heading1 && addCommand("heading1", "Heading 1", formatBlock, icons.heading1 || "<div>H1</div>");
        options.format?.heading2 && addCommand("heading2", "Heading 2", formatBlock, icons.heading2 || "<div>H2</div>");
        options.format?.heading3 && addCommand("heading3", "Heading 3", formatBlock, icons.heading3 || "<div>H3</div>");
        options.format?.heading4 && addCommand("heading4", "Heading 4", formatBlock, icons.heading4 || "<div>H4</div>");
        options.format?.heading5 && addCommand("heading5", "Heading 5", formatBlock, icons.heading5 || "<div>H5</div>");
        options.format?.heading6 && addCommand("heading6", "Heading 6", formatBlock, icons.heading6 || "<div>H6</div>");
        options.format?.paragraph && addCommand("paragraph", "Paragraph", formatBlock, icons.paragraph || "&#182;");
        options.format?.quote && addCommand("quote", "Quote", formatBlock, icons.quote || '<i class="fa fa-quote-left"></i>');

        // Indent / Outdent
        options.indentOutdent && addCommand("indent", "Indent", "indent", icons.indent || '<i class="fa fa-indent"></i>');
        options.indentOutdent && addCommand("outdent", "Outdent", "outdent", icons.outdent || '<i class="fa fa-outdent"></i>');

        // Superscript / Subscript
        options.subscriptSuperscript && addCommand("subscript", "Subscript", "subscript", icons.subscript || "<div>X<sub>2</sub></div>");
        options.subscriptSuperscript && addCommand("superscript", "Superscript", "superscript", icons.superscript || "<div>X<sup>2</sup></div>");

        // Listes
        options.list && addCommand("olist", "Ordered List", "insertOrderedList", icons.olist || '<i class="fa fa-list-ol"></i>');
        options.list && addCommand("ulist", "Unordered List", "insertUnorderedList", icons.ulist || '<i class="fa fa-list-ul"></i>');

        // Alignement
        options.align && addCommand("justifyLeft", "Align Left", "justifyLeft", icons.justifyLeft || '<i class="fa fa-align-left"></i>');
        options.align && addCommand("justifyCenter", "Align Center", "justifyCenter", icons.justifyCenter || '<i class="fa fa-align-center"></i>');
        options.align && addCommand("justifyRight", "Align Right", "justifyRight", icons.justifyRight || '<i class="fa fa-align-right"></i>');
        options.align && addCommand("justifyFull", "Align Justify", "justifyFull", icons.justifyFull || '<i class="fa fa-align-justify"></i>');

        // Extras
        options.extra && addCommand("line", "Horizontal Line", "insertHorizontalRule", icons.line || "<b>&#8213;</b>");

        options.extra && rte.add("uppercase", {
            icon: icons.uppercase || "<div>ABC</div>",
            attributes: { title: "Uppercase" },
            result: (rte) => {
                const sel = rte.doc.getSelection();
                if (!sel.rangeCount) return;
                const range = sel.getRangeAt(0);
                const span = rte.doc.createElement("span");
                span.style.textTransform = "uppercase";
                span.textContent = range.toString();
                range.deleteContents();
                range.insertNode(span);
            },
        });

        options.extra && rte.add("lowercase", {
            icon: icons.lowercase || "<div>abc</div>",
            attributes: { title: "Lowercase" },
            result: (rte) => {
                const sel = rte.doc.getSelection();
                if (!sel.rangeCount) return;
                const range = sel.getRangeAt(0);
                const span = rte.doc.createElement("span");
                span.style.textTransform = "lowercase";
                span.textContent = range.toString();
                range.deleteContents();
                range.insertNode(span);
            },
        });

        options.undoredo && addCommand("undo", "Undo", "undo", icons.undo || '<i class="fa fa-reply"></i>');
        options.undoredo && addCommand("redo", "Redo", "redo", icons.redo || '<i class="fa fa-share"></i>');
    });

    editor.Commands.add('unwrap-span', {
        run(editor) {
            const selected = editor.getSelected();
            if (!selected) return;
            const el = selected.getEl();
            if (el.tagName !== 'SPAN') return;
            const parent = el.parentNode;
            while (el.firstChild) parent.insertBefore(el.firstChild, el);
            parent.removeChild(el);
            editor.selectRemove(selected);
        },
    });

    editor.DomComponents.addType('inline-span', {
        isComponent: el => el.tagName === 'SPAN' && el.classList.contains('gjs-inline-span-in-paragraph'),
        model: {
            defaults: {
                tagName: 'span',
                draggable: true,
                droppable: false,
                editable: true,
                stylable: true,
                toolbar: [
                    { command: 'move', label: '<i class="fa fa-arrows-alt"></i>' },
                    { command: 'tlb-clone', label: '<i class="fa fa-clone"></i>' },
                    { command: 'unwrap-span', label: '<i class="fa fa-ban"></i>', attributes: { title: 'Supprimer le SPAN' } },
                    { command: 'tlb-delete', label: '<i class="fa fa-trash"></i>' },
                ],
            },
        },
    });
};
