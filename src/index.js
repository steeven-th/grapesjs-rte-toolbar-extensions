import en from './locale/en';
import de from './locale/de';
import fr from './locale/fr';

export default (editor, opts = {}) => {
    const options = {
        ...{
            base: {
                bold: true,
                italic: true,
                underline: true,
                strikethrough: true,
                link: true,
            },
            fonts: {
                span: true,
            },
            format: {
                heading1: true,
                heading2: true,
                heading3: true,
                heading4: true,
                heading5: true,
                heading6: true,
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
            icons: {},
        },
        ...opts,
    };

    const { icons } = options;
    const formatBlock = "formatBlock";
    const rte = editor.RichTextEditor;
    const t = (key) => editor.I18n?.t(`grapesjs-rte-toolbar-extensions.${key}`) || key;

    const fontNames = options.fonts.fontName
        ? Array.isArray(options.fonts.fontName)
            ? options.fonts.fontName
            : false
        : false;

    options.fonts.fontName = fontNames;

    const fontOptionsEl = fontNames
        ? fontNames
            .map((font) => "<option>" + font.toString() + "</option>")
            .join("")
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

        const defaultIcons = {
            bold: "<b>B</b>",
            italic: "<i>I</i>",
            underline: "<u>U</u>",
            strikethrough: "<s>S</s>",
            link: "🔗",
            heading1: "<div>H1</div>",
            heading2: "<div>H2</div>",
            heading3: "<div>H3</div>",
            heading4: "<div>H4</div>",
            heading5: "<div>H5</div>",
            heading6: "<div>H6</div>",
            paragraph: "¶",
            quote: "❝",
            indent: "➡️",
            outdent: "⬅️",
            subscript: "X<sub>2</sub>",
            superscript: "X<sup>2</sup>",
            uppercase: "<div>ABC</div>",
            lowercase: "<div>abc</div>",
            olist: "1.",
            ulist: "•",
            justifyLeft: "⬅",
            justifyCenter: "↔",
            justifyRight: "➡",
            justifyFull: "↕",
            line: "―",
            undo: "↶",
            redo: "↷",
        };

        const addButton = (name, icon, title, exec, extra = {}) => {
            const htmlIcon = icon || defaultIcons[name] || `<div>${name}</div>`;
            rte.add(name, {
                icon: htmlIcon,
                attributes: {
                    title: t(title),
                    ...extra,
                },
                result: (rte) => rte.exec(exec),
            });
        };

        options.base.bold && addButton("bold", icons.bold, "bold", "bold");
        options.base.italic && addButton("italic", icons.italic, "italic", "italic");
        options.base.underline && addButton("underline", icons.underline, "underline", "underline");
        options.base.strikethrough && addButton("strikethrough", icons.strikethrough, "strikethrough", "strikethrough");
        options.base.link && addButton("link", icons.link, "link", "createLink");

        options.fonts?.fontName && rte.add("fontName", {
            icon: fontNamesEl,
            event: "change",
            attributes: {
                style: "padding: 0 4px 2px;",
                title: t("fontName"),
            },
            result: (rte, action) =>
                rte.exec("fontName", action.btn.firstChild.value),
            update: (rte, action) => {
                const value = rte.doc.queryCommandValue(action.name);
                if (value != "false") {
                    action.btn.firstChild.value = value;
                }
            },
        });

        options.fonts?.fontSize && rte.add("fontSize", {
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
            attributes: {
                style: "padding: 0 4px 2px;",
                title: t("fontSize"),
            },
            result: (rte, action) =>
                rte.exec("fontSize", action.btn.firstChild.value),
            update: (rte, action) => {
                const value = rte.doc.queryCommandValue(action.name);
                if (value != "false") {
                    action.btn.firstChild.value = value;
                }
            },
        });

        const addFormatButton = (name, label) => {
            options.format?.[name] && addButton(name, icons[name] || `<div>${label.toUpperCase()}</div>`, name, formatBlock, { tag: name });
        };

        ["heading1","heading2","heading3","heading4","heading5","heading6","paragraph","quote"].forEach(type => {
            const label = type === "paragraph" ? "¶" : type.replace("heading", "H");
            addFormatButton(type, label);
        });

        options.indentOutdent && addButton("indent", icons.indent, "indent", "indent");
        options.indentOutdent && addButton("outdent", icons.outdent, "outdent", "outdent");
        options.subscriptSuperscript && addButton("subscript", icons.subscript || "<div>X<sub>2</sub></div>", "subscript", "subscript");
        options.subscriptSuperscript && addButton("superscript", icons.superscript || "<div>X<sup>2</sup></div>", "superscript", "superscript");

        options.extra && rte.add("uppercase", {
            icon: icons.uppercase || "<div>ABC</div>",
            attributes: { title: t("uppercase") },
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
            attributes: { title: t("lowercase") },
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

        options.list && addButton("olist", icons.olist, "olist", "insertOrderedList");
        options.list && addButton("ulist", icons.ulist, "ulist", "insertUnorderedList");
        options.align && addButton("justifyLeft", icons.justifyLeft, "justifyLeft", "justifyLeft");
        options.align && addButton("justifyCenter", icons.justifyCenter, "justifyCenter", "justifyCenter");
        options.align && addButton("justifyRight", icons.justifyRight, "justifyRight", "justifyRight");
        options.align && addButton("justifyFull", icons.justifyFull, "justifyFull", "justifyFull");
        options.extra && addButton("line", icons.line || "<b>&#8213;</b>", "line", "insertHorizontalRule");
        options.undoredo && addButton("undo", icons.undo, "undo", "undo");
        options.undoredo && addButton("redo", icons.redo, "redo", "redo");
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
                    { command: 'unwrap-span', label: '<i class="fa fa-ban"></i>', attributes: { title: t('unwrapSpan') } },
                    { command: 'tlb-delete', label: '<i class="fa fa-trash"></i>' },
                ],
            },
        },
    });

    editor.I18n && editor.I18n.addMessages({
        en,
        fr,
        de,
    });
};
