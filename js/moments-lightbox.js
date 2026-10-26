(function () {
  var photos = document.querySelectorAll('.moment-images .moment-photo')
  if (!photos.length) return

  var dialog = document.createElement('dialog')
  dialog.className = 'lightbox'
  dialog.setAttribute('aria-label', '查看大图')
  // 打开时把焦点放在 dialog 自己身上，避免默认聚焦到关闭按钮出现焦点框
  dialog.tabIndex = -1
  dialog.innerHTML = ''
    + '<button class="lb-btn lb-close" type="button" aria-label="关闭">×</button>'
    + '<button class="lb-btn lb-prev" type="button" aria-label="上一张">‹</button>'
    + '<img class="lb-img" alt="">'
    + '<button class="lb-btn lb-next" type="button" aria-label="下一张">›</button>'
  document.body.appendChild(dialog)

  var img = dialog.querySelector('.lb-img')
  var prev = dialog.querySelector('.lb-prev')
  var next = dialog.querySelector('.lb-next')

  var group = []
  var index = 0

  function show(i) {
    index = (i + group.length) % group.length
    var link = group[index]
    var thumb = link.querySelector('img')
    img.src = link.getAttribute('href')
    img.alt = (thumb && thumb.alt) || ''
    var multi = group.length > 1
    prev.hidden = !multi
    next.hidden = !multi
  }

  function open(link) {
    var box = link.closest('.moment-images')
    group = Array.prototype.slice.call(box.querySelectorAll('.moment-photo'))
    show(group.indexOf(link))
    document.documentElement.classList.add('lightbox-open')
    dialog.showModal()
    dialog.focus()
  }

  document.addEventListener('click', function (event) {
    var link = event.target.closest && event.target.closest('.moment-images .moment-photo')
    if (!link) return
    // 按住 cmd/ctrl/shift/alt 点时保留浏览器原生行为（新标签打开原图）
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    open(link)
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
