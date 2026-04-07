export interface Template {
  id: string;
  label: string;
  description: string;
  html: string;
}

export const TEMPLATES: Template[] = [
  {
    id: "basic",
    label: "Basic",
    description: "A simple review structure with an overview, highlights, lowlights, and a final verdict.",
    html: `<h1>Replace this with the game title</h1>
<p>Write a one to two sentence overview of the game here. What kind of game is it, and what's your general impression?</p>
<h2>What I Liked</h2>
<p>Describe the parts of the game that stood out positively. Think about gameplay mechanics, story, visuals, sound design, or anything else that made the experience enjoyable. Replace this paragraph with your own thoughts.</p>
<h2>What I Didn't Like</h2>
<p>Be honest about the downsides. Are there performance issues, frustrating mechanics, a weak story, or anything else worth flagging? Replace this paragraph with your honest criticisms.</p>
<h2>Final Verdict</h2>
<p>Wrap up your review here. Would you recommend this game, and to whom? Replace this with your conclusion and whether you'd recommend it or not.</p>
<p><em>- Edited using <a href="https://steam-review-editor.netlify.app" target="_blank">Steam Review Editor</a></em></p>`,
  },
  {
    id: "advanced",
    label: "Advanced",
    description: "A detailed review with dedicated sections for gameplay, story, performance, and a pros/cons table.",
    html: `<h1>Replace this with the game title</h1>
<p>Write your introduction here. Set the scene — what genre is this, who made it, and how long did you play it before writing this review? Replace this with your own opening paragraph.</p>
<h2>Gameplay</h2>
<p>Describe the core gameplay loop. Is it fun to play moment to moment? How do the mechanics feel — tight or sluggish, deep or shallow? Replace this with your analysis of the gameplay systems.</p>
<h2>Story &amp; Characters</h2>
<p>Talk about the narrative. Is there one? Does it matter? Are the characters memorable or forgettable? Replace this paragraph with your thoughts on the writing, world-building, or lack thereof.</p>
<h2>Performance &amp; Polish</h2>
<p>Cover the technical side. Did the game run well on your hardware? Were there bugs, crashes, or notable issues at launch? Replace this with your observations about stability and polish.</p>
<h2>Value</h2>
<p>Consider the price-to-content ratio. How many hours did you get out of it? Is there replay value or post-launch support? Replace this with your value assessment.</p>
<h2>Pros &amp; Cons</h2>
<table class="steam-table"><tbody><tr><th>Pros</th><th>Cons</th></tr><tr><td>Replace with a positive point</td><td>Replace with a negative point</td></tr><tr><td>Replace with a positive point</td><td>Replace with a negative point</td></tr><tr><td>Replace with a positive point</td><td>Replace with a negative point</td></tr></tbody></table>
<h2>Verdict</h2>
<p>Summarise everything here. Who should buy this game, and who should skip or wait for a sale? Replace this with your final recommendation.</p>
<p><em>- Edited using <a href="https://steam-review-editor.netlify.app" target="_blank">Steam Review Editor</a></em></p>`,
  },
  {
    id: "tables",
    label: "Review with Tables",
    description: "A ratings breakdown table and a pros/cons table, with narrative intro and verdict.",
    html: `<h1>Replace this with the game title</h1>
<p>Write a brief intro here. Give the reader a sense of what they're about to read and what the game is. Replace this paragraph with your own introduction.</p>
<h2>Ratings Breakdown</h2>
<table class="steam-table"><tbody><tr><th>Category</th><th>Score</th><th>Notes</th></tr><tr><td>Gameplay</td><td>?/10</td><td>Replace with a short note about gameplay</td></tr><tr><td>Story</td><td>?/10</td><td>Replace with a short note about the story</td></tr><tr><td>Visuals</td><td>?/10</td><td>Replace with a short note about art and graphics</td></tr><tr><td>Sound &amp; Music</td><td>?/10</td><td>Replace with a short note about audio</td></tr><tr><td>Performance</td><td>?/10</td><td>Replace with a short note about technical state</td></tr><tr><td>Value</td><td>?/10</td><td>Replace with a short note about value for money</td></tr></tbody></table>
<h2>Pros &amp; Cons</h2>
<table class="steam-table"><tbody><tr><th>Pros</th><th>Cons</th></tr><tr><td>Replace with a positive point</td><td>Replace with a negative point</td></tr><tr><td>Replace with a positive point</td><td>Replace with a negative point</td></tr><tr><td>Replace with a positive point</td><td>Replace with a negative point</td></tr></tbody></table>
<h2>Verdict</h2>
<p>Bring it all together here. Based on the scores and your experience, is this game worth your time and money? Replace this with your final summary and recommendation.</p>
<p><em>- Edited using <a href="https://steam-review-editor.netlify.app" target="_blank">Steam Review Editor</a></em></p>`,
  },
  {
    id: "workshop",
    label: "Workshop Item",
    description: "A showcase-style write-up for a mod, map, or other Steam Workshop item.",
    html: `<h1>Replace this with the workshop item name</h1>
<div data-type="steam-workshop-embed" data-workshopid="123456789"></div>
<p>Write a brief summary of what this workshop item is and what it's for. What game does it belong to, and what does it do at a high level? Replace this with your own description.</p>
<h2>What It Adds</h2>
<p>Go into detail about the content or changes this item introduces. Does it add new levels, characters, mechanics, textures, or something else entirely? Replace this paragraph with a thorough description of the item's content.</p>
<h2>Quality &amp; Presentation</h2>
<p>Comment on the craft behind the item. Does it fit the visual or gameplay style of the base game? Is the quality consistent throughout? Replace this with your honest assessment of the item's polish and presentation.</p>
<h2>Installation &amp; Compatibility</h2>
<p>Describe how easy or difficult the item is to install. Does it require other mods or dependencies? Are there any known compatibility issues with other workshop items or game updates? Replace this with your installation experience and any compatibility notes.</p>
<h2>Who Is It For?</h2>
<p>Help readers decide whether this item is right for them. Is it aimed at beginners, veterans, fans of a particular playstyle, or a specific community? Replace this section with your recommendation of who would enjoy this item most.</p>
<p><em>- Edited using <a href="https://steam-review-editor.netlify.app" target="_blank">Steam Review Editor</a></em></p>`,
  },
  {
    id: "demo",
    label: "Demo",
    description: "Showcases every editor format — headings, lists, tables, quotes, spoilers, code, and more.",
    html: `<h1>Heading 1 — The Big Title</h1>
<p>This is a regular paragraph. You can make text <strong>bold</strong>, <em>italic</em>, <u>underlined</u>, or <s>strikethrough</s>. You can even combine them: <strong><em>bold and italic</em></strong>.</p>
<h2>Heading 2 — Section Title</h2>
<p>Headings help break your review into readable sections. Use H1 for the main title, H2 for major sections, and H3 for sub-sections.</p>
<h3>Heading 3 — Sub-section</h3>
<p>This is a smaller heading, useful for finer organisation within a section.</p>
<h2>Lists</h2>
<ul><li>This is a bullet list item</li><li>Another bullet point</li><li>A third bullet point</li></ul>
<ol><li>This is a numbered list item</li><li>Step two</li><li>Step three</li></ol>
<h2>Table</h2>
<table class="steam-table"><tbody><tr><th>Category</th><th>Value</th><th>Notes</th></tr><tr><td>Row 1</td><td>Data</td><td>Some notes here</td></tr><tr><td>Row 2</td><td>Data</td><td>More notes here</td></tr></tbody></table>
<h2>Quote</h2>
<blockquote data-type="quote" class="quote" data-author="Author Name"><p>This is a quote block. Use it to highlight a memorable line or attribute a statement to someone. The author attribute is optional.</p></blockquote>
<h2>Spoiler</h2>
<div data-type="spoiler" class="spoiler"><p>This content is hidden behind a spoiler tag. Readers hover over it to reveal the text. Use it to avoid spoiling plot points.</p></div>
<h2>Code Block</h2>
<pre><code>This is a code block.
Use it for console commands, config snippets, or any monospaced text.</code></pre>
<h2>No-Parse Block</h2>
<pre data-type="noparse" class="noparse">This is a no-parse block. Steam will not apply any BBCode formatting inside it. [b]This will not be bold.[/b]</pre>
<h2>Embeds</h2>
<div data-type="steam-store-embed" data-appid="400"></div>
<div data-type="steam-workshop-embed" data-workshopid="123456789"></div>
<div data-type="youtube-embed" data-videoid="dQw4w9WgXcQ"></div>
<h2>Horizontal Rule</h2>
<p>A horizontal rule creates a visual divider between sections.</p>
<hr>
<p>This paragraph appears after the divider.</p>
<p><em>- Edited using <a href="https://steam-review-editor.netlify.app" target="_blank">Steam Review Editor</a></em></p>`,
  },
];
