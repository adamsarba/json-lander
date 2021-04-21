/*!
 *
 * JSON Lander v0.2-alpha
 * Copyright © Mi-Home.pl
 * Date: 2021-04-21
 *
 */

 // Define Page Settings
 var lang           = document.documentElement.lang.replace('-', '_')
 var langShort      = lang.substring(0, 2)
 var contentUrl     = settings.contentUrl
 var pageUrl        = settings.pageUrl
 var pageId         = pageUrl.replace('-', '_')
 var utmTags        = settings.utmTags
 var redirect       = settings.redirect
 var pageMenu       = settings.menu

// Tem-dev App Settings
const appUrl         = '/json-lander/'
const appLocaleUrl   = appUrl + 'locale/' + lang + '/app.js'

const itemsGlobalUrl = appUrl + 'data/items.json'
const itemsLocalUrl  = appUrl + 'locale/' + lang + '/items.json'

// Get server time // Deprecated (?)
// function getServerTime() {
//   return $.ajax({async: false}).getResponseHeader( 'Date' );
// }

var develop = settings.develop
// if in Develop Mode
if (develop && develop == true) {
  console.log('\n🚧 You are now in Develop Mode. Have fun! 😉\n\nCurrent page language: ' + langShort + ' (' + lang + ')\n\n')
  // console.log('Server Time: ', getServerTime());
  // console.log('Locale Time: ', new Date(getServerTime()));
  console.log('Loading files:')
  console.log(contentUrl)
  console.log(appLocaleUrl)
  console.log(itemsGlobalUrl)
  console.log(itemsLocalUrl)
  console.log('\n')
} // end if Develop Mode

/* ==========
*  RUN APP when DOM is ready
* ==========*/
$(document).ready(function() {

  document.body.id = pageId

  // 🚧 BETTER SOULTION for jQuery getScript ?
  // jQuery.loadScript = function (url, callback) {
  //     jQuery.ajax({
  //         url: url,
  //         dataType: 'script',
  //         success: callback,
  //         async: true
  //     })
  // }
  // if (typeof someObject == 'undefined') $.loadScript('url_to_someScript.js', function(){
  //     //Stuff to do after someScript has loaded
  // })

  // Load App Localizations
  $.getScript(appLocaleUrl, function() {

    // Mount loading animation
    $('#content').append(`<div id="page_loader"></div>`)

    // Mount footer
    $('footer').html( `Copyright 2021 &copy; ${copyrights}` )

    // Mount header
    $('#header--links').append(`
      <a href="/" rel="nofollow" class="header--logo">&nbsp;</a>
      <a href="/" rel="nofollow" class="header--back_to_store">
        ${back_to_store} <i class="fad fa-store"></i>
      </a>
    `)
    $('.header--logo').addClass('logo__' + settings.logo)
    if (settings.header.content) {
      var headerAlign    = settings.header.contentAlign
      $('#header--content').addClass('__' + headerAlign).append(` <div class="header--wrapper"></div> `)
      $.each(settings.header.content, function () {
        if (this.headerTitle)    { $('.header--wrapper').append(` <h1 class="txt__heavy">${this.headerTitle}</h1> `) }
        if (this.headerSubtitle) { $('.header--wrapper').append(` <h2 class="txt__bold">${this.headerSubtitle}</h2> `) }
        if (this.headerText)     { $('.header--wrapper').append(` <p class="txt__regular">${this.headerText}</p> `) }
      })
    }

    // Mount side buttons
    $('#side_btns').html(` <a href="#${pageId}" target="_blank" rel="nofollow" class="btn--top">Top</a> `)
    if (instagramUrl !== null && instagramUrl !== '') {
      $('#side_btns').prepend(` <a href="${instagramUrl}" target="_blank" rel="nofollow" class="btn--ig">Instagram</a> `)
    }
    if (facebookUrl !== null && facebookUrl !== '') {
      $('#side_btns').prepend(` <a href="${facebookUrl}" target="_blank" rel="nofollow" class="btn--fb">Facebook</a> `)
    }

    // RUN CONTENT BUILDER ⚠️ if contentUrl exists
    if (contentUrl) {
    // Load items database
    $.getJSON(itemsGlobalUrl, function (itemsGlobal, status, xhr) {

      console.log( 'Database Request Success. Got this data:' ); console.log(itemsGlobal) // 🚧 Dev log

      $.getJSON(itemsLocalUrl, function (itemsLocal, status, xhr) {

        // Merging function
        function mergeItems(arrayOne, arrayTwo) {
          return [
            ...[arrayOne, arrayTwo].reduce((a, b) =>
              (b.forEach(obj => a.has(obj.id) && Object.assign(a.get(obj.id), obj) || a.set(obj.id, obj)), a),
              new Map
            ).values()
          ]
        }

        console.log( 'Database Request Success. Got this data:' ); console.log(itemsLocal) // 🚧 Dev log

        // Merge items
        const itemsMerged = mergeItems(itemsGlobal, itemsLocal)
        // console.log(itemsMerged) // 🚧 Dev log

        // Load dynamic content
        var getContent = $.getJSON(contentUrl, function(content, status, xhr ) {

          console.log( 'Content Request Success. Got this data:' ); console.log(content) // 🚧 Dev log

          // Remove loading animation
          $('#page_loader').remove()

          // Mount Page Menu
          if (pageMenu == true) { $('header').after('<nav><div class="nav--wrapper"><ul class="nav--items"></ul></div></nav>') }

          // Call Content Builder
          contentBuilder(content)

          // Content Builder function
          function contentBuilder(data) {

            const container = document.getElementById('content')

            let sectionMenuCounter = 0 // Set sections counter

            // SECTIONS LOOP
            $.each(content, function (sectionId) {

              const section      = this
              const items        = section.items

              // console.log(section) // 🚧 Dev log

              if (section.menu) { sectionMenuCounter++ } // Count sections

              // Mount section element
              var sectionEl = document.createElement( 'section' )
              container.appendChild( sectionEl )

              // Mount unique ID for every section from its index number
              sectionId = sectionId+1

              sectionEl.id = 'section_' + sectionId
              sectionElId  = '#section_' + sectionId

              // Sections basic info
              // Mount section Title attr
              if (section.title) {
                var sectionTitle = document.createElement( 'h3' )
                sectionTitle.innerHTML = section.title;
                sectionEl.appendChild( sectionTitle )
              }
              // Mount section Text attr
              if (section.text) {
                var sectionText = document.createElement( 'p' )
                sectionText.innerHTML = section.text;
                sectionEl.appendChild( sectionText )
              }
              // end Sections info

              // ITEMS LOOP
              // Check if items exists
              if (items) {
                mergeItems(items, itemsMerged)

                // Create items container and add suitable classes
                var itemsEl  = document.createElement( 'div' )
                sectionEl.appendChild( itemsEl )
                itemsEl.classList.add('content__items')

                if (section.type == 'featured') {
                  itemsEl.classList.add('__featured')
                } else if (section.type == 'small') {
                  itemsEl.classList.add('__small')
                }

                // LOOP
                $.each(items, function () {
                  const item = this

                  // console.log(item) // 🚧 Dev log

                  // Create and mount new element for each item
                  var singleItemEl  = document.createElement( 'div' )
                  singleItemEl.classList.add('section--item')
                  itemsEl.appendChild( singleItemEl )
                  $('.section--item').html ( `
                    <div class="item--head">
                      <a href="" target="_blank">
                        <img src="" />
                      </a>
                      <div class="item--benefits">
                        <div class="item--discount"></div>
                      </div>
                    </div>
                    <div class="item--info">
                      <h3 class="item--name"></h3>
                      <div class="item--desc"></div>
                      <div class="item--footer">
                        <div class="item--price"></div>
                        <a href="" class="item--btn" target="_blank">
                          ${check_it_out}
                        </a>
                      </div>
                    </div>
                  ` )

                  var itemId = item.id
                  singleItemEl.id = itemId // Adds itemId to singleItemEl
                  var itemElId = '.section--item' + '#' + itemId

                  // Mount item info
                  if ( item.type != 'custom' ) { // Mount REGULAR item
                    setTimeout(() => {

                      // Mount item URL, custom item URL or custom item URL without global utm tags
                      var itemElImgLink = $(itemElId + ' .item--head a')
                      var itemElBtnLink = $(itemElId + ' .item--footer a')
                      if (item.utmTags === false) {
                        itemElImgLink.attr('href', item.customUrl)
                        itemElBtnLink.attr('href', item.customUrl)
                      } else {
                        var itemUrl = item.url + utmTags
                        if (item.customUrl === undefined) {
                          itemElImgLink.attr('href', itemUrl)
                          itemElBtnLink.attr('href', itemUrl)
                        } else {
                          var itemUrl = item.customUrl + utmTags
                          itemElImgLink.attr('href', itemUrl)
                          itemElBtnLink.attr('href', itemUrl)
                        }
                      }

                      // Mount item img URL to img source
                      $(itemElId + ' .item--head img').attr('src', item.img)

                      // Mount item category & name
                      var itemName = item.name
                      itemName     = itemName.replaceAll('(', '<span class="name--label">')
                      itemName     = itemName.replaceAll(')', '</span>')
                      if (item.customName === undefined) {
                        $(itemElId + ' .item--name').html(`
                          <span class="item--category">${item.category}</span><br />${itemName}
                        `)
                      } else if (item.customName) {
                        itemName = item.customName
                        $(itemElId + ' .item--name').html(`
                          <span class="item--category">${item.category}</span><br />${itemName}
                        `)
                      }

                      // Mount additional nameLabel
                      if (item.nameLabel) {
                        var itemNameLabel = item.nameLabel
                        itemNameLabel     = itemNameLabel.replaceAll('(', '<span class="name--label">')
                        itemNameLabel     = itemNameLabel.replaceAll(')', '</span>')
                        $(itemElId + ' .item--name').append(`
                          ${itemNameLabel}
                        `)
                      }

                      // Mount item description
                      $(itemElId + ' .item--desc').html( `<p>${item.desc}</p>` )

                      // Mount additional text
                      if (item.text) {
                        $(itemElId + ' .item--desc').append( `<p class="item--text">${item.text}</p>` )
                      }

                      // Mount item label
                      if (item.labelName && !item.labelIcon) {
                        $(itemElId + ' .item--head').prepend(`
                          <div class="item--label">${item.labelName}</div>
                        `)
                      } else if (item.labelName && item.labelIcon) {
                        $(itemElId + ' .item--head').prepend(`
                          <div class="item--label"><i class="fas fa-${item.labelIcon}"></i> ${item.labelName}</div>
                        `)
                      }

                      // Item price & discount
                      if (item.price) {

                        var itemDiscount = item.price.regular - item.price.promo
                        var itemPercentDiscount = Math.round(((item.price.regular - item.price.promo) / item.price.regular) * 100)

                        // Mount item prices
                        if (item.price.regular && item.price.promo) {
                          item.discount = item.price.regular - item.price.promo
                          $(itemElId + ' .item--price').html(`
                            ${item.price.promo}<small> ${currency}</small>
                            <span class="__crossed">${item.price.regular} ${currency}</span>
                          `)
                          if (item.price.from) {
                            $(itemElId + ' .item--price').prepend(`<small>${price_from}</small>`)
                            $(itemElId + ' .item--price .__crossed').prepend(`${price_from} `)
                          }
                          // Mount discount
                          if (item.price.percent == false) {
                            $(itemElId + ' .item--discount').append(`
                              <span class="benefit--title">${discount_title}</span>
                              <strong>${itemDiscount}<small> ${currency}</small></strong>
                            `)
                            if (item.price.discount) {
                              $(itemElId + ' .item--discount strong').html(`<small>${up_to} </small>${item.price.discount}<small> ${currency}</small>`)
                            }
                          } else {
                            $(itemElId + ' .item--discount').append(`
                              <span class="benefit--title">${discount_title}</span>
                              <strong>${itemPercentDiscount}<small>%</small></strong>
                            `)
                            if (item.price.discount) {
                              $(itemElId + ' .item--discount strong').html(`<small>${up_to} </small>${item.price.discount}<small>%</small>`)
                            }
                          }
                        } else if (!item.price.promo) {
                          $(itemElId + ' .item--price').html(`${item.price.regular}<small> ${currency}</small>`)
                          if (item.price.from) {
                            $(itemElId + ' .item--price').prepend(`<small>${price_from} </small>`)
                          }
                        }

                      }

                      // Mount item gift
                      if (item.gift) {
                        $(itemElId + ' .item--benefits').addClass('benefit--gift')
                        $(itemElId + ' .item--benefits').append(`
                          <div class="item--gift">
                            <a href="${item.gift.url}" target="_blank" title="${item.gift.name}">
                              <img src="${item.gift.img}" />
                            </a>
                            <span class="benefit--title">${gift_included}</span>
                          </div>
                        `)
                      }

                    }, 0)
                  } else if (item.type == 'custom') { // Mount CUSTOM item
                    $(itemElId).addClass('item__custom')
                    setTimeout(() => {
                      $('.item__custom' + itemElId).html ( `${item.content}` )
                    }, 0)
                  }
                  // end item info

                  // Check if Sold Out
                  if (item.soldOut === true ) {
                    setTimeout(() => {
                      $(itemElId).addClass('item__sold_out')
                      $(itemElId + ' .item--footer a').html(sold_out)
                    }, 0)
                  }
                  // Check if Soon
                  if (item.soon === true ) {
                    setTimeout(() => {
                      $(itemElId).addClass('item__soon')
                      $(itemElId + ' .item--footer a').html(soon)
                    }, 0)
                  }

                }) // end LOOP
              } // end ITEMS

              // if Page Menu // Mount specified sections in menu
              if (pageMenu == true) {
                if (section.menu) {
                  $('nav .nav--items').append(`<li class="nav--item"><a href="${sectionElId}" rel="nofollow">${section.menu}</a></li>`)
                }
              }

              // Mount IMG type item if exists
              if (section.type == 'img') {
                var imgEl = document.createElement( 'div' )
                sectionEl.appendChild( imgEl )
                imgEl.classList.add('content__img')

                var sectionContent = sectionElId + ' .content__img'
                var imgDesktopEl = '<img src="' + section.img.desktop + '" class="img__desktop">'
                var imgMobileEl  = '<img src="' + section.img.mobile + '"  class="img__mobile">'

                if (section.url) {
                  $(sectionContent).html(` <a href="${section.url}" target="_blank" title="${find_out}"></a> `)
                  $(sectionContent + ' a').html( imgDesktopEl + imgMobileEl )
                  if(section.img.mobile === undefined) { $(sectionContent + ' a').html( imgMobileEl ) }
                } else {
                  $(sectionContent).html( imgDesktopEl + imgMobileEl )
                  if(section.img.mobile === undefined) { $(sectionContent).html( imgMobileEl ) }
                }
              }

              // Custom type section
              if (section.type == 'custom') {
                var customEl = document.createElement( 'div' )
                sectionEl.appendChild( customEl )
                customEl.classList.add('content__custom')

                $(sectionElId + ' .content__custom').html(section.content)
              }

              // embed type section
              if (section.type === 'embed') {
                var embedEl = document.createElement( 'div' )
                sectionEl.appendChild( embedEl )
                embedEl.classList.add('content__embed_iframe')

                // YouTube iframe
                if (section.embed.youtube) {
                  $(sectionElId + ' .content__embed_iframe').html(`
                    <iframe
                      src="https://www.youtube.com/embed/${section.embed.youtube}"
                      frameborder="1" autoplay="1" rel="0" controls="0"
                      allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                      allowfullscreen="">
                    </iframe>
                  `)
                }
              }

              // Disclaimer type section - The Last Stand :)
              if (section.type === 'disclaimer') {
                $(sectionElId).prop('id', 'page_disclaimer')
              }

            }) // end SECTIONS

            // if Page Menu // Mount number of columns in menu
            if (pageMenu == true) {
              $('nav .nav--items').addClass('col__' + sectionMenuCounter)
            }

          } // end Content Builder function

        })
        .fail(function( getContent, textStatus, error ) {
          console.log( 'Content Request Failed: ' + textStatus + ', ' + error ) // 🚧 Dev log

          if (develop && develop == true) {
            $('#page_loader').remove()
            $('#content').append(` &#10060; Error found while parsing JSON. Check console for more information. `)
          }

        })
        .always(function( getContent, status ) {
          console.log( 'Content Request Complete' ) // 🚧 Dev log
        })
        // end getContent

      })
      .fail(function( getContent, textStatus, error ) {
        console.log( 'Local Database Request Failed: ' + textStatus + ', ' + error ) // 🚧 Dev log
      })
      .always(function( getContent, status ) {
        console.log( 'LocalDatabase Request Complete' ) // 🚧 Dev log
      })
    }) /* end getJSON */
    .fail(function( getContent, textStatus, error ) {
      console.log( 'Global Database Request Failed: ' + textStatus + ', ' + error ) // 🚧 Dev log
    })
    .always(function( getContent, status ) {
      console.log( 'Global Database Request Complete' ) // 🚧 Dev log
    })
    } // end if contentUrl exists

  }) // end getScript (App Localizations)

}) // end APP

/* ==========
*  Additional Scripts
* ==========*/

// Smooth scrolling
$(document).on('click', 'a[href^="#"]', function(event) {
  event.preventDefault();
  var el = $(this).attr('href');
  if (el !== '#') {
    $('html, body').animate({
      scrollTop: $(el).offset().top
    }, 1000);
  }
})
