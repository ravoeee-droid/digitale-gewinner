(() => {
  const api = async (url) => {
    const response = await fetch(url, { headers: { Accept: 'application/json' }, credentials: 'same-origin' })
    if (!response.ok) throw new Error(`CMS request failed: ${response.status}`)
    return response.json()
  }

  const text = (value) => (value == null ? '' : String(value))
  const relationDocs = (value) => (Array.isArray(value) ? value.filter((item) => item && typeof item === 'object') : [])
  const mediaURL = (item, fallback = '') => {
    if (item?.image && typeof item.image === 'object' && item.image.url) return item.image.url
    return item?.imagePath || fallback
  }

  const setText = (selector, value, root = document) => {
    const element = root.querySelector(selector)
    if (element && value != null && text(value).trim()) element.textContent = text(value)
  }

  function applySettings(settings) {
    const proof = settings?.proof || {}
    const years = Number(proof.yearsExperience || 8)
    const budget = Number(proof.managedAdBudget || 200000)
    const rating = Number(proof.googleRating || 5).toFixed(1).replace('.', ',')
    const reviews = Number(proof.googleReviewCount || 9)

    setText('.f1 strong', `${years} Jahre`)
    setText('.f2 strong', `${budget.toLocaleString('de-DE')}€+`)
    setText('.f3 strong', `${rating} ★`)
    setText('.f3 span', `${reviews} Google-Rezensionen`)

    const authority = document.querySelectorAll('.authority-item')
    if (authority[0]) setText('b', `${years} Jahre`, authority[0])
    if (authority[1]) setText('b', `${budget.toLocaleString('de-DE')}€+`, authority[1])
    if (authority[2]) setText('b', `${rating} Sterne`, authority[2])

    if (settings?.defaultSeo?.metaTitle) document.title = settings.defaultSeo.metaTitle
    const description = document.querySelector('meta[name="description"]')
    if (description && settings?.defaultSeo?.metaDescription) {
      description.setAttribute('content', settings.defaultSeo.metaDescription)
    }
  }

  function applyHero(homepage) {
    const hero = homepage?.hero
    const section = document.querySelector('.hero')
    if (!hero || !section) return

    setText('.eyebrow', hero.eyebrow, section)
    const heading = section.querySelector('h1')
    if (heading) {
      heading.replaceChildren()
      const lead = document.createElement('span')
      lead.textContent = text(hero.headline)
      const highlight = document.createElement('em')
      highlight.textContent = text(hero.headlineHighlight)
      heading.append(lead, highlight)
    }
    setText('.lead', hero.subline, section)

    const buttons = section.querySelectorAll('.btns .btn')
    if (buttons[0] && hero.primaryCtaLabel) buttons[0].textContent = `${hero.primaryCtaLabel} →`
    if (buttons[1] && hero.secondaryCtaLabel) buttons[1].textContent = `${hero.secondaryCtaLabel} →`

    const image = section.querySelector('.hero-photo img')
    const source = hero.image && typeof hero.image === 'object' && hero.image.url
      ? hero.image.url
      : hero.heroImagePath
    if (image && source) image.src = source
  }

  function applyTrustProblems(homepage) {
    const grid = document.querySelector('#vertrauensproblem .trust-problem-grid')
    if (!grid || !Array.isArray(homepage?.trustProblems) || homepage.trustProblems.length === 0) return

    grid.replaceChildren(...homepage.trustProblems.map((problem, index) => {
      const article = document.createElement('article')
      article.className = 'trust-problem reveal visible'
      const number = document.createElement('span')
      number.className = 'trust-problem-icon'
      number.textContent = String(index + 1).padStart(2, '0')
      const copy = document.createElement('div')
      const heading = document.createElement('h3')
      heading.textContent = text(problem.title)
      const description = document.createElement('p')
      description.textContent = text(problem.description)
      copy.append(heading, description)
      article.append(number, copy)
      return article
    }))
  }

  function caseCard(item) {
    const anchor = document.createElement('a')
    anchor.className = 'case reveal visible'
    anchor.href = `case-studies.html#${encodeURIComponent(item.slug)}`

    const imageWrap = document.createElement('div')
    imageWrap.className = 'case-image'
    const image = document.createElement('img')
    image.src = mediaURL(item, '/assets/images/case-studies/case-study-jj-media.webp')
    image.alt = `${text(item.title)} Case Study`
    image.loading = 'lazy'
    image.decoding = 'async'
    imageWrap.append(image)

    const body = document.createElement('div')
    body.className = 'case-body'
    const copy = document.createElement('div')
    const heading = document.createElement('h3')
    heading.textContent = text(item.title)
    const description = document.createElement('p')
    description.textContent = `${text(item.sector)} · ${text(item.resultLabel)}`
    copy.append(heading, description)
    const arrow = document.createElement('span')
    arrow.className = 'case-arrow'
    arrow.textContent = '→'
    body.append(copy, arrow)
    anchor.append(imageWrap, body)
    return anchor
  }

  function applyFeaturedCases(homepage) {
    const grid = document.querySelector('#cases .cases')
    const items = relationDocs(homepage?.featuredCaseStudies)
    if (!grid || items.length === 0) return
    grid.replaceChildren(...items.slice(0, 3).map(caseCard))
  }

  function applyReviews(homepage, reviewResponse) {
    const grid = document.querySelector('#bewertungen .review-grid')
    if (!grid) return
    const featured = relationDocs(homepage?.featuredReviews)
    const items = featured.length ? featured : (reviewResponse?.docs || [])
    if (!items.length) return

    grid.replaceChildren(...items.filter((item) => item.published !== false).map((item) => {
      const article = document.createElement('article')
      article.className = 'review reveal visible'
      const head = document.createElement('div')
      head.className = 'review-head'
      const avatar = document.createElement('span')
      avatar.className = 'avatar'
      avatar.textContent = text(item.name).trim().charAt(0).toUpperCase() || 'G'
      const info = document.createElement('div')
      const name = document.createElement('b')
      name.textContent = text(item.name)
      const stars = document.createElement('div')
      stars.className = 'stars'
      stars.textContent = '★'.repeat(Math.max(1, Math.min(5, Number(item.rating || 5))))
      info.append(name, stars)
      head.append(avatar, info)
      const quote = document.createElement('p')
      quote.textContent = `„${text(item.text)}“`
      const foot = document.createElement('div')
      foot.className = 'review-foot'
      const source = document.createElement(item.sourceUrl ? 'a' : 'span')
      source.textContent = 'Google-Rezension'
      if (item.sourceUrl) {
        source.href = item.sourceUrl
        source.target = '_blank'
        source.rel = 'noopener'
      }
      const google = document.createElement('b')
      google.textContent = 'G'
      foot.append(source, google)
      article.append(head, quote, foot)
      return article
    }))
  }

  function applyFaqs(homepage, faqResponse) {
    const list = document.querySelector('#faq .geo-faq-list')
    if (!list) return
    const featured = relationDocs(homepage?.faqs)
    const items = featured.length ? featured : (faqResponse?.docs || [])
    if (!items.length) return

    list.replaceChildren(...items.filter((item) => item.published !== false).sort((a, b) => Number(a.order || 0) - Number(b.order || 0)).map((item) => {
      const details = document.createElement('details')
      details.className = 'reveal visible'
      const summary = document.createElement('summary')
      summary.textContent = text(item.question)
      const answer = document.createElement('p')
      answer.textContent = text(item.answer)
      details.append(summary, answer)
      return details
    }))
  }

  function applyCaseStudyPage(caseResponse) {
    const docs = caseResponse?.docs || []
    docs.forEach((item) => {
      const article = document.getElementById(item.slug)
      if (!article) return
      if (item.accentColor) article.style.setProperty('--accent', item.accentColor)
      setText('.case-copy h2', item.title, article)
      setText('.case-sector', item.sector, article)
      setText('.case-summary', item.summary, article)
      setText('.case-result', item.resultLabel, article)
      const logic = article.querySelectorAll('.case-logic p')
      if (logic[0]) logic[0].textContent = text(item.problem)
      if (logic[1]) logic[1].textContent = text(item.solution)
      if (logic[2]) logic[2].textContent = text(item.impact)
      const image = article.querySelector('.screen img')
      const source = mediaURL(item)
      if (image && source) image.src = source
      const note = article.querySelector('.visual-note')
      if (note) {
        const label = note.querySelector('b')
        note.textContent = text(item.resultLabel)
        if (label) note.prepend(label)
      }
    })
  }

  async function loadCMS() {
    try {
      const [homepage, settings, cases, reviews, faqs] = await Promise.all([
        api('/api/globals/homepage?depth=2'),
        api('/api/globals/site-settings?depth=1'),
        api('/api/case-studies?limit=20&sort=order&depth=1'),
        api('/api/reviews?limit=30&sort=-createdAt&depth=0'),
        api('/api/faqs?limit=30&sort=order&depth=0'),
      ])

      applySettings(settings)
      applyHero(homepage)
      applyTrustProblems(homepage)
      applyFeaturedCases(homepage)
      applyReviews(homepage, reviews)
      applyFaqs(homepage, faqs)
      applyCaseStudyPage(cases)
      document.documentElement.dataset.cms = 'connected'
    } catch (error) {
      console.warn('Die Website verwendet weiterhin die statischen Fallback-Inhalte.', error)
      document.documentElement.dataset.cms = 'fallback'
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadCMS, { once: true })
  } else {
    loadCMS()
  }
})()
