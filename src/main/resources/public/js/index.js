var defaultLanguage = undefined;
function getDefaultLanguage() {
    if (!defaultLanguage && app)
        defaultLanguage = app.getConfig().getDefaultLanguage();
    return defaultLanguage;
}

function convertBasicHtml(content) {

    var options = Opal.hash2(['backend', 'safe', 'attributes'], {
        backend: 'html5',
        safe: 'safeMode',
        attributes: 'showtitle icons=font@ source-highlighter=highlight.js platform=opal platform-opal env=browser env-browser idprefix idseparator=- '
    });

    var doc = Opal.Asciidoctor.$load(content,options);

    doc.attributes.keys["lang"] = doc.attributes.keys["lang"] || getDefaultLanguage();

    return doc.$convert();
}

function convertHtmlBook(content) {

    var options = Opal.hash2(['backend', 'safe', 'attributes', "header_footer"], {
        backend: 'html5',
        safe: 'safeMode',
        attributes: 'showtitle icons=font@ source-highlighter=highlight.js platform=opal platform-opal env=browser env-browser idprefix sectanchors idseparator=- '
        , 'header_footer': true
    });

    var doc = Opal.Asciidoctor.$load(content,options);

    doc.attributes.keys["lang"] = doc.attributes.keys["lang"] || getDefaultLanguage();

    return doc.$render();
}

function convertHtmlArticle(content) {

    var options = Opal.hash2(['attributes', 'header_footer'],
        {
            'attributes': ['backend=html5', 'doctype=article',"idprefix=","idseparator=-","sectanchors="],
            'header_footer': true
        });

    var doc = Opal.Asciidoctor.$load(content,options);

    doc.attributes.keys["lang"] = doc.attributes.keys["lang"] || getDefaultLanguage();

    return doc.$render();
}

function convertDocbook(content, includeHeader) {

    var options = Opal.hash2(['attributes', 'header_footer'],
        {
            'attributes': ['backend=docbook5', 'doctype=book'],
            'header_footer': includeHeader
        });

    var doc = Opal.Asciidoctor.$load(content, options);

    doc.attributes.keys["lang"] = doc.attributes.keys["lang"] || getDefaultLanguage();

    return doc.$render();
}

function convertDocbookArticle(content) {

    var options = Opal.hash2(["lang", 'attributes', 'header_footer'],
        {
            'attributes': ['backend=docbook5', 'doctype=article'],
            'header_footer': true
        });

    var doc = Opal.Asciidoctor.$load(content,options);

    doc.attributes.keys["lang"] = doc.attributes.keys["lang"] || getDefaultLanguage();

    return doc.$render();
}

function scrollTo60(position) {
    $(window).scrollTop(position - 60);
}

function runScroller(content) {

    var renderedSelection = Opal.Asciidoctor.$render(content);

    if (renderedSelection.trim() == "") {
        return;
    }
    else if ($(renderedSelection).css("page-break-after")) {
        //page break element
        return;
    }
    else if ($(renderedSelection).is("hr")) {
        // horizontal rules
        return;
    }
    else if ($(renderedSelection).is(".imageblock")) {
        var src = $(renderedSelection).find("img").attr("src");
        scrollTo60($("img[src^='" + src + "']").offset().top);
        return;
    }

    if ($(renderedSelection).is(".admonitionblock")) {
        scrollToElement(".admonitionblock", $(renderedSelection).find(".content").text());
    }
    else if ($(renderedSelection).is(".exampleblock")) {
        scrollToUniqueElement(".exampleblock", $(renderedSelection).text(), /^Example \d+\./, "Example 1.");
    }
    else if ($(renderedSelection).is(".listingblock")) {
        scrollToElement(".listingblock", $(renderedSelection).text());
    }
    else if ($(renderedSelection).is(".literalblock")) {
        scrollToElement(".literalblock", $(renderedSelection).text());
    }
    else if ($(renderedSelection).is(".openblock")) {
        scrollToElement(".openblock", $(renderedSelection).text());
    }
    else if ($(renderedSelection).is(".sidebarblock")) {
        scrollToElement(".sidebarblock", $(renderedSelection).text());
    }
    else if ($(renderedSelection).is(".quoteblock")) {
        scrollToElement(".quoteblock > blockquote, .verseblock > .content", $(renderedSelection).find(".paragraph").text());
    }
    else if ($(renderedSelection).is(".paragraph")) {
        scrollToElement(".paragraph, .quoteblock > blockquote", $($(renderedSelection).get(0)).text());
    }
    else if ($(renderedSelection).is(".ulist")) {
        scrollToElement(".ulist:not(.checklist) > ul > li", $(renderedSelection).text());
    }
    else if ($(renderedSelection).is(".olist")) {
        scrollToElement(".olist > ol > li", $(renderedSelection).text());
    }
    else if ($(renderedSelection).is(".colist")) {
        scrollToUniqueElement(".colist > table > tbody > tr", $(renderedSelection).text(), /^\d+ */, "");
    }
    else if ($(renderedSelection).is(".tableblock")) {
        scrollToUniqueElement("table.tableblock, table.frame-all", $(renderedSelection).text(), /^Table \d+\./, "Table 1.");
    }
    else {
        var header = false;

        $("*:header").each(function () {
            if ($(this).text().trim() == $(renderedSelection).text().trim()) {
                header = true;
                scrollTo60($(this).offset().top);
                return false;
            }
        });

        if (!header) {
            var search = $("*:contains(" + $(renderedSelection).text().trim() + "):last");
            scrollTo60(search.offset().top);
        }
    }
}

function scrollToElement(elements, content) {
    if(content.trim() == "")
        return;

    $(elements).each(function () {
        if (simplify($(this).text()) == simplify(content)) {
            scrollTo60($(this).offset().top);
            return false;
        }
    });
}

function scrollToUniqueElement(elements, content, pattern, expected) {
    $(elements).each(function () {
        var element = $(this).text().trim().replace(pattern, expected);
        if (simplify(element) == simplify(content)) {
            scrollTo60($(this).offset().top);
            return false;
        }
    });
}

function simplify(text) {
    return text.replace(/( |\n|\r|\t|\")/g, "");
}
