const regexEscape = (x) => x.replace(/[-\/\\^$*+?.()|\[\]{}]/g, '\\$&');

var previewDisplay = null;
const katexLabel = 'katexProcessed';
const katexRender = (content) => {
  const katexDelimiters = [
    {left: "$$", right: "$$", display: true},
    {left: "$", right: "$", display: false},
    {left: "\\(", right: "\\)", display: false},
    {left: "\\begin{equation}", right: "\\end{equation}", display: true},
    {left: "\\begin{align}", right: "\\end{align}", display: true},
    {left: "\\begin{alignat}", right: "\\end{alignat}", display: true},
    {left: "\\[", right: "\\]", display: true}
  ];
  var html = content.innerHTML;
  katexDelimiters.forEach((data) => {
    if (data.display) {
      const patterns = [
        {
          regex: '<br>' + regexEscape(data.left),
          func: (x) => x.replaceAll('<br>', '')
        },
        {
          regex: regexEscape(data.right) + '<br>',
          func: (x) => x.replaceAll('<br>', '')
        },
        {
          regex: [regexEscape(data.left), ".+?", regexEscape(data.right) ].join(''),
          func: (x) => x.replaceAll('<br>', "\n")
        }
      ];
      patterns.forEach((p) => {
        const regex = new RegExp(p.regex, 'gi');
        html = html.replaceAll(regex, p.func);
      });
    }
  });
  content.innerHTML = html;
  renderMathInElement(content, {
    delimiters: katexDelimiters,
    throwOnError: false
  });
};
const katexMonitor = (mutation) => {
  if (mutation.target.querySelector) {
    document.querySelectorAll('.StatusContent').forEach((stat) => {
      if (stat.classList.contains('preview-status')) {
        return;
      }
      const content = stat.querySelector('.RichContent');
      if (!content.classList.contains(katexLabel)) {
        katexRender(content);
        content.classList.add(katexLabel);
      }
    });
  }
};


window.addEventListener('DOMContentLoaded', (event) => {
  const callback = (mutations) => {
    mutations.forEach(katexMonitor);
  }
  new MutationObserver(callback).observe(document.body, {
    childList: true,
    attributes: true,
    characterData: true,
    subtree: true,
  });
});
