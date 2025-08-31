(function(){
  function addCopyButtons(root){
    // Select pre > code blocks inside markdown content
    var container = root || document.getElementById('markdown-content-container') || document;
    var blocks = container.querySelectorAll('pre > code');
    blocks.forEach(function(code){
      var pre = code.parentElement;
      if(pre.classList.contains('cc-wired')) return; // avoid duplicates
      pre.classList.add('cc-wired');

      var wrapper = document.createElement('div');
      wrapper.className = 'code-block-wrapper';
      pre.parentNode.insertBefore(wrapper, pre);
      wrapper.appendChild(pre);

      var btn = document.createElement('button');
      btn.type = 'button';
  btn.className = 'btn btn-xs btn-default copy-button';
  btn.setAttribute('aria-label','Copy to clipboard');
  btn.setAttribute('title','Copy');
  btn.innerHTML = '<i class="fa fa-clipboard"></i>';
      wrapper.insertBefore(btn, pre);

      btn.addEventListener('click', function(){
        var text = code.innerText;
        if(navigator.clipboard && navigator.clipboard.writeText){
          navigator.clipboard.writeText(text).then(function(){
            flash(btn);
          }, function(){
            fallbackCopy(text, btn);
          });
        } else {
          fallbackCopy(text, btn);
        }
      });
    });
  }

  function fallbackCopy(text, btn){
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try { document.execCommand('copy'); } catch(e){}
    document.body.removeChild(ta);
    flash(btn);
  }

  function flash(btn){
  var original = btn.innerHTML;
    btn.classList.add('copied');
  btn.innerHTML = '<i class="fa fa-check"></i>';
    setTimeout(function(){
      btn.classList.remove('copied');
      btn.innerHTML = original;
    }, 1500);
  }

  // Run on ready
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', function(){ addCopyButtons(); });
  } else {
    addCopyButtons();
  }
})();
