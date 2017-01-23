var Embed = Quill.import('blots/embed');

//Create a new spoiler class for span tags with class spoiler applied

class Spoiler extends Embed {
    static create(value) {
        let node = super.create(value);
        node.innerHTML = value;
        return node;
    }
}

Spoiler.blotName = 'span';
Spoiler.className = 'spoiler';
Spoiler.tagName = 'span';

var steamSpoiler = function() {
    var customSpan = document.createElement('span');
    var range = quill.getSelection();
    if (range) {
        quill.insertEmbed(range.index, "span", customSpan);
    }
};

Quill.register({
    'formats/spoiler': Spoiler
});

var quill = new Quill('#editor', {
    modules: {
        toolbar : { container : '#toolbar',
            handlers : {
                'spoiler' : steamSpoiler
            }
        }
    },
    placeholder: 'Write your review here!',
    theme: 'snow'
});

var text = quill.container.firstChild.innerHTML;

// Enable all tooltips
$('[data-toggle="tooltip"]').tooltip();


quill.on('selection-change', function(range, oldRange, source) {
    text = quill.container.firstChild.innerHTML;
    convertHTML(text);
    if (range) {
        $("#editorWindow").addClass("active");
    } else {
        $("#editorWindow").removeClass("active");
    }
});

quill.on('text-change', function(delta, oldDelta, source) {
    text = quill.container.firstChild.innerHTML;
    convertHTML(text);
});

function convertHTML(convertText) {
    //TODO: No Parse, Table
    //Process the markup tags
    var markupText = convertText.replace(/<p>/g, '').replace(/<\/p>/g, '\n').replace(/<strong>/g, '[b]').replace(/<\/strong>/g, '[/b]').replace(/<h1>/g, '[h1]').replace(/<\/h1>/g, '[/h1]\n').replace(/<em>/g, '[i]').replace(/<\/em>/g, '[/i]').replace(/<u>/g, '[u]').replace(/<\/u>/g, '[/u]').replace(/<ol>/g, '[olist]\n').replace(/<\/ol>/g, '[/olist]\n').replace(/<ul>/g, '[list]\n').replace(/<\/ul>/g, '[/list]\n').replace(/<li>/g, '[*]').replace(/<\/li>/g, '\n').replace(/<br>/g, '\n').replace(/<a href="/g, '[url=').replace(/" target="_blank">/g ,']').replace(/<\/a>/g ,'[/url]').replace(/<s>/g, '[strike]').replace(/<\/s>/g, '[/strike]').replace(/<blockquote>/g, '[quote=author]').replace(/<\/blockquote>/g, '[/quote]\n').replace(/<span class="spoiler">/g, '[spoiler]').replace(/<\/span>/g, '[/spoiler]').replace(/<pre spellcheck="false">/g, '[code]').replace(/<\/pre>/g, '[/code]\n').replace(/<code>/g, '[noparse]').replace(/<\/code>/g, '[/noparse]');

    //Process the preview
    //var previewText = text;

    //Set the markup display
    $('#markup').html(markupText);
    
    //Set the preview display
    $('#preview').html(convertText);
}

function CopyToClipboard(containerid) {
    // creating new textarea element and giveing it id 't'
    let t = document.createElement('textarea')
    t.id = 't'
    // Optional step to make less noise in the page, if any!
    t.style.height = 0
    // You have to append it to your page somewhere, I chose <body>
    document.body.appendChild(t)
    // Copy whatever is in your div to our new textarea
    t.value = document.getElementById(containerid).innerText
    // Now copy whatever inside the textarea to clipboard
    let selector = document.querySelector('#t')
    selector.select()
    document.execCommand('copy')
    // Remove the textarea
    document.body.removeChild(t)
    alert("Markup copied to clipboard!");
};

function pushFooter() {
    var docHeight = $(window).height();
    var footerHeight = $('#footer').height();
    var footerTop = $('#footer').position().top + footerHeight;

    if (footerTop < docHeight) {
        $('#footer').css('margin-top', 10+ (docHeight - footerTop) + 'px');
    }
}

//Show Preview
$('#previewCollapse').on('show.bs.collapse', function() {
    quill.blur();
    console.log(text);
    document.getElementById("showBtn").innerHTML = "Hide Preview";
});

//Hide Preview
$('#previewCollapse').on('hide.bs.collapse', function() {
    document.getElementById("showBtn").innerHTML = "Show Preview";
    quill.focus();
});

$('#closeBtn').click(function() {
    $('#help').fadeOut(1000, function complete() {
        pushFooter();
    });
});

$(document).ready(function () {
    pushFooter();
    var fade = $(".fade");
    fade.css({ "opacity":"0"});
    fade.fadeTo(500, 1, "swing");
});