window.addEventListener(
  "load",
  function load() {
    // Temporary workaround for Quill not loading properly
    if (!window.jQuery || !window.Quill) return setTimeout(load, 120);

    const Inline = Quill.import("blots/inline");
    const BlockEmbed = Quill.import("blots/block/embed");

    class SpoilerBlot extends Inline {
      static blotName = "spoiler";
      static className = "spoiler";
      static tagName = "span";

      static create() {
        return super.create();
      }
    
      static formats() {
        return true;
      }
    
      optimize(context) {
        super.optimize(context);
        if (this.domNode.tagName !== this.statics.tagName) {
          this.replaceWith(this.statics.blotName);
        }
      }
    }

    class DividerBlot extends BlockEmbed {
      static blotName = 'divider';
      static tagName = 'hr';
    }

    const steamDivider = function () {
      const range = quillInstance.getSelection(true);
      quillInstance.insertText(range.index, '', Quill.sources.USER);
      quillInstance.insertEmbed(range.index, 'divider', true, Quill.sources.USER);
      quillInstance.setSelection(range.index + 1, Quill.sources.SILENT);
    };

    Quill.register("formats/spoiler", SpoilerBlot);
    Quill.register("formats/divider", DividerBlot); 

    const Delta = Quill.import("delta");
    const quillInstance = new Quill("#editor", {
      modules: {
        toolbar: {
          container: "#toolbar",
          handlers: {
            divider: steamDivider
          },
        },
      },
      formats: [
        "header",
        "bold",
        "italic",
        "underline",
        "strike",
        "blockquote",
        "code",
        "code-block",
        "divider",
        "spoiler",
        "list",
        "link",
      ],
      placeholder: "Write your review here!",
      theme: "snow",
    });

    let text = quillInstance.container.firstChild.innerHTML;

    // Enable all tooltips
    $('[data-toggle="tooltip"]').tooltip();

    let change = new Delta();

    quillInstance.on("selection-change", function (range, oldRange, source) {
      text = quillInstance.container.firstChild.innerHTML;
      convertHTML(text);
      if (range) {
        $("#editorWindow").addClass("active");
      } else {
        $("#editorWindow").removeClass("active");
      }
    });

    quillInstance.on("text-change", function (delta, oldDelta, source) {
      text = quillInstance.container.firstChild.innerHTML;
      convertHTML(text);
      change = change.compose(delta);
    });

    /**
     * @param {string} convertText 
     */
    function convertHTML(convertText) {
      //Process the markup tags
      let markupText = convertText
        .replace(/<p>/g, "")
        .replace(/<\/p>/g, "\n")
        .replace(/<strong>/g, "[b]")
        .replace(/<\/strong>/g, "[/b]")
        .replace(/<hr>/g, "[hr][/hr]\n")
        .replace(/<h1>/g, "[h1]")
        .replace(/<\/h1>/g, "[/h1]\n")
        .replace(/<h2>/g, "[h2]")
        .replace(/<\/h2>/g, "[/h2]\n")
        .replace(/<h3>/g, "[h3]")
        .replace(/<\/h3>/g, "[/h3]\n")
        .replace(/<em>/g, "[i]")
        .replace(/<\/em>/g, "[/i]")
        .replace(/<u>/g, "[u]")
        .replace(/<\/u>/g, "[/u]")
        .replace(/<ol>/g, "")
        .replace(/<\/ol>/g, "")
        .replace(/((<li data-list="ordered">)(.*?)(<\/li>))+/g, `[olist]\n$&[/olist]\n`)
        .replace(/((<li data-list="bullet">)(.*?)(<\/li>))+/g, `[list]\n$&[/list]\n`)
        .replace(/<li (.*?)>/g, "\t[*]")
        .replace(/<\/li>/g, "\n")
        .replace(/<br>/g, "\n")
        .replace(/<a href="/g, "[url=")
        .replace(/" target="_blank">/g, "]")
        .replace(/<\/a>/g, "[/url]")
        .replace(/<s>/g, "[strike]")
        .replace(/<\/s>/g, "[/strike]")
        .replace(/<blockquote>/g, "[quote=author]")
        .replace(/<\/blockquote>/g, "[/quote]\n")
        .replace(/(<span class="ql-ui")(.*?)(<\/span>)/g, "")
        .replace(/<span class="spoiler">(.*?)<\/span>/g, "[spoiler]$1[/spoiler]")
        .replace(/<span contenteditable="false">/g, "")
        .replace(/<\/span>/g, "[/spoiler]")
        .replace(/<pre spellcheck="false">/g, "[code]")
        .replace(/<\/pre>/g, "[/code]\n")
        .replace(/<code>/g, "[noparse]")
        .replace(/<\/code>/g, "[/noparse]");

      let previewText = quillInstance.getSemanticHTML().replaceAll('<blockquote>', `
        <blockquote>
          <div class="font-italic quote-author">Originally posted by <b>author</b>:</div>
      `);

      //Set the markup display
      $("#markup").html(markupText);

      //Set the preview display
      $("#preview").html(previewText);
    }

    function CopyToClipboard(containerid) {
      let t = document.createElement("textarea");
      t.id = "t";
      t.style.height = 0;
      document.body.appendChild(t);
      t.value = document.getElementById(containerid).innerText;
      let selector = document.querySelector("#t");
      selector.select();
      selector.setSelectionRange(0, 99999); /*For mobile devices*/
      navigator.clipboard.writeText(selector.value);
      // Remove the textarea
      document.body.removeChild(t);
      alert("Markup copied to clipboard!");
    }

    function pushFooter() {
      let docHeight = $(window).height();
      let footerHeight = $("#footer").height();
      let footerTop = $("#footer").position().top + footerHeight;

      if (footerTop < docHeight) {
        $("#footer").css("margin-top", 10 + (docHeight - footerTop) + "px");
      }
    }

    //Show Preview
    $("#previewCollapse").on("show.bs.collapse", function () {
      quillInstance.blur();
      document.getElementById("showBtn").innerHTML = "Hide Preview";
    });

    //Hide Preview
    $("#previewCollapse").on("hide.bs.collapse", function () {
      document.getElementById("showBtn").innerHTML = "Show Preview";
      quillInstance.focus();
    });

    $("#copyBtn").click(function () {
      CopyToClipboard("markup");
    });

    $("#closeBtn").click(function () {
      $("#help").fadeOut(1000, function complete() {
        pushFooter();
      });
    });

    // Save periodically
    setInterval(function () {
      if (change.length() > 0) {
        // console.log("Saving changes", change);
        change = new Delta();
      }
    }, 5 * 1000);

    // Check for unsaved data
    window.onbeforeunload = function () {
      if (change.length() > 0) {
        return "There are unsaved changes. Are you sure you want to leave?";
      }
    };

    $(document).ready(function () {
      pushFooter();
      let fade = $(".fade");
      fade.css({ opacity: "0" });
      fade.fadeTo(500, 1, "swing");

      let today = new Date();
      let day = today.getDate();
      let monthName = today.toLocaleString("en-us", { month: "long" });

      $(".current-date").html(`${day} ${monthName}`);
    });
  },
  false
);
