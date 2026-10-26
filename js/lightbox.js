(function () {
  var CONTENT = '.post-content'

  // 正文里的普通图片才接管：跳过已在 <a> 里的图（保留外链行为）和手动排除的图
  function eligible(el) {
    return !!el
      && el.tagName === 'IMG'
      && !!el.closest(CONTENT)
      && !el.closest('a')
      && !el.hasAttribute('data-no-lightbox')
  }

  function candidates() {
    return Array.prototype.filter.call(document.querySelectorAll(CONTENT + ' img'), eligible)
  }

  var initial = candidates()
  if (!initial.length) return

  initial.forEach(function (el) { el.classList.add('lightbox-item') })

  var dialog = document.createElement('dialog')
  dialog.className = 'lightbox'
  dialog.setAttribute('aria-label', '查看大图')
  dialog.tabIndex = -1
  dialog.innerHTML = ''
    + '<button class="lb-btn lb-close" type="button" aria-label="关闭">×</button>'
    + '<button class="lb-btn lb-prev" type="button" aria-label="上一张">‹</button>'
    + '<img class="lb-img" alt="">'
    + '<button class="lb-btn lb-next" type="button" aria-label="下一张">›</button>'
    + '<p class="lb-caption"></p>'
  document.body.appendChild(dialog)

  var img = dialog.querySelector('.lb-img')
  var caption = dialog.querySelector('.lb-caption')
  var prev = dialog.querySelector('.lb-prev')
  var next = dialog.querySelector('.lb-next')

  var group = []
  var index = 0

  function captionOf(el) {
    var figure = el.closest('figure')
    var figcaption = figure ? figure.querySelector('figcaption') : null
    var text = figcaption ? figcaption.textContent.trim() : ''
    return text || (el.getAttribute('alt') || '').trim()
  }

  function show(i) {
    index = (i + group.length) % group.length
    var el = group[index]
    img.src = el.currentSrc || el.src
    img.alt = el.getAttribute('alt') || ''
    var text = captionOf(el)
    caption.textContent = text
    caption.hidden = !text
    var multi = group.length > 1
    prev.hidden = !multi
    next.hidden = !multi
  }

  function open(el) {
    group = candidates()
    var at = group.indexOf(el)
    if (at < 0) return
    show(at)
    document.documentElement.classList.add('lightbox-open')
    dialog.showModal()
    dialog.focus()
  }

  document.addEventListener('click', function (event) {
    if (!eligible(event.target)) return
    event.preventDefault()
    open(event.target)
  })

  prev.addEventListener('click', function () { show(index - 1) })
  next.addEventListener('click', function () { show(index + 1) })
  dialog.querySelector('.lb-close').addEventListener('click', function () { dialog.close() })

  // 点背景关闭（点图片/按钮不关）
  dialog.addEventListener('click', function (event) {
    if (event.target === dialog) dialog.close()
  })

  dialog.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowLeft') { show(index - 1); event.preventDefault() }
    else if (event.key === 'ArrowRight') { show(index + 1); event.preventDefault() }
  })

  dialog.addEventListener('close', function () {
    document.documentElement.classList.remove('lightbox-open')
    img.removeAttribute('src')
  })
})()
