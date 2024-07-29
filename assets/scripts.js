window.addEventListener(
  "load",
  function load() {
    if (!window.jQuery || !window.Quill) return setTimeout(load, 50);

    let Embed = Quill.import("blots/embed");

    //Create a new spoiler class for span tags with class spoiler applied

    class Spoiler extends Embed {
      static create(value) {
        let node = super.create(value);
        node.innerHTML = value;
        return node;
      }
    }

    Spoiler.blotName = "span";
    Spoiler.className = "spoiler";
    Spoiler.tagName = "span";

    let steamSpoiler = function () {
      let customSpan = document.createElement("span");
      let range = quill.getSelection();
      if (range) {
        quill.insertEmbed(range.index, "span", customSpan);
      }
    };

    Quill.register({
      "formats/spoiler": Spoiler,
    });

    let Delta = Quill.import("delta");
    let quill = new Quill("#editor", {
      modules: {
        toolbar: {
          container: "#toolbar",
          handlers: {
            spoiler: steamSpoiler,
          },
        },
      },
      placeholder: "Write your review here!",
      theme: "snow",
    });

    let text = quill.container.firstChild.innerHTML;

    // Enable all tooltips
    $('[data-toggle="tooltip"]').tooltip();

    let change = new Delta();

    quill.on("selection-change", function (range, oldRange, source) {
      text = quill.container.firstChild.innerHTML;
      convertHTML(text);
      if (range) {
        $("#editorWindow").addClass("active");
      } else {
        $("#editorWindow").removeClass("active");
      }
    });

    quill.on("text-change", function (delta, oldDelta, source) {
      text = quill.container.firstChild.innerHTML;
      convertHTML(text);
      change = change.compose(delta);
    });

    function convertHTML(convertText) {
      //TODO: No Parse, Table
      //Process the markup tags
      let markupText = convertText
        .replace(/<p>/g, "")
        .replace(/<\/p>/g, "\n")
        .replace(/<strong>/g, "[b]")
        .replace(/<\/strong>/g, "[/b]")
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
        .replace(/((<li data-list="ordered">)(.*?)(<\/li>))+/g, `[olist]\n$&[/olist]`)
        .replace(/((<li data-list="bullet">)(.*?)(<\/li>))+/g, `[list]\n$&[/list]`)
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
        .replace(/<span class="spoiler">/g, "[spoiler]")
        .replace(/<\/span>/g, "[/spoiler]")
        .replace(/<pre spellcheck="false">/g, "[code]")
        .replace(/<\/pre>/g, "[/code]\n")
        .replace(/<code>/g, "[noparse]")
        .replace(/<\/code>/g, "[/noparse]");

      let previewText = quill.getSemanticHTML().replaceAll('<blockquote>', `
        <blockquote>
          <div class="font-italic quote-author">Originally posted by <b>author</b>:</div>
      `);

      //Set the markup display
      $("#markup").html(markupText);

      //Set the preview display
      $("#preview").html(previewText);
    }

    function CopyToClipboard(containerid) {
      // creating new textarea element and giveing it id 't'
      let t = document.createElement("textarea");
      t.id = "t";
      // Optional step to make less noise in the page, if any!
      t.style.height = 0;
      // You have to append it to your page somewhere, I chose <body>
      document.body.appendChild(t);
      // Copy whatever is in your div to our new textarea
      t.value = document.getElementById(containerid).innerText;
      // Now copy whatever inside the textarea to clipboard
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
      quill.blur();
      document.getElementById("showBtn").innerHTML = "Hide Preview";
    });

    //Hide Preview
    $("#previewCollapse").on("hide.bs.collapse", function () {
      document.getElementById("showBtn").innerHTML = "Show Preview";
      quill.focus();
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
