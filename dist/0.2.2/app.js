/*!
 *
 * JSON Lander v0.2.2-alpha
 * Copyright © Mi-Home.pl
 * Date: 2021-09-15
 *
 */

 // Define Page Settings
 var lang           = document.documentElement.lang.replace('-', '_')
 var langShort      = lang.substring(0, 2)
 var contentUrl     = settings.contentUrl
 var pageUrl        = settings.pageUrl // var pageId = pageUrl.replace('-', '_')
 var utmTags        = settings.utmTags
 var redirect       = settings.redirect
 var pageMenu       = settings.menu

// Temp-dev App Settings
const appUrl         = '/event/libs/json-lander/'
const distUrl        = '/event/libs/json-lander/0.2.2/'
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
  console.warn('\nYou are now in Develop Mode. Have fun! ;)\n\nCurrent page language: ' + langShort + ' (' + lang + ')\n\n')
  // console.log('Server Time: ', getServerTime()); console.log('Locale Time: ', new Date(getServerTime()));
  console.groupCollapsed('Loading files...')
  console.log(contentUrl + '\n' + appLocaleUrl + '\n' + itemsGlobalUrl + '\n' + itemsLocalUrl); console.groupEnd()
  console.groupCollapsed('Loading window locations...');
  console.log(
    'Current URL:  ' + window.location.href + '\n' +
    'Protol:       ' + window.location.protocol + '\n' +
    'Host domain:  ' + window.location.hostname + '\n' +
    'Current path: ' + window.location.pathname + '\n'
  ); console.groupEnd();
} // end if Develop Mode

/* ==========
*  RUN APP when DOM is ready
* ==========*/
$(document).ready(function() {

  document.body.id = pageUrl

  // Better solution for jQuery getScript ?
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
    $('#content').append(`<div id="page_loader"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>`)

    // Mount footer
    $('footer').html( `Copyright 2021 &copy; ${COPYRIGHTS}` )

    // Mount header
    $('#header--links').append(`
      <a href="/" rel="nofollow" class="header--logo" title="${BACK_TO_STORE}">&nbsp;</a>
      <a href="/" rel="nofollow" class="header--back_to_store">
        ${BACK_TO_STORE} <i class="fad fa-store"></i>
      </a>
    `)
    $('.header--logo').addClass('logo__' + settings.logo)
    if (settings.header) {
      var headerAlign    = settings.header.contentAlign
      $('#header--content').addClass('__' + headerAlign).append( `<div class="content--wrapper"></div>` )
      $.each(settings.header.content, function () {
        if (this.headerTitle)    { $('.content--wrapper').append( `<h1 class="header--title">${this.headerTitle}</h1>` ) }
        if (this.headerSubtitle) { $('.content--wrapper').append( `<h2 class="header--sub_title">${this.headerSubtitle}</h2>` ) }
        if (this.headerText)     { $('.content--wrapper').append( `<p class="header--text">${this.headerText}</p>` ) }
      })
    }

    // Mount side buttons
    $('#side_btns').html( `<a href="#${pageUrl}" target="_blank" rel="nofollow" class="btn--top">&nbsp;</a>` )
    if (instagramUrl !== null && instagramUrl !== '') {
      $('#side_btns').prepend( `<a href="${instagramUrl}" target="_blank" rel="nofollow" class="btn--ig">&nbsp;</a>` )
    }
    if (facebookUrl !== null && facebookUrl !== '') {
      $('#side_btns').prepend( `<a href="${facebookUrl}" target="_blank" rel="nofollow" class="btn--fb">&nbsp;</a>` )
    }

    // RUN CONTENT BUILDER if ! contentUrl exists
    if (contentUrl) {
    // Load items database
    $.getJSON(itemsGlobalUrl, function (itemsGlobal, status, xhr) {
      /* Dev log */ if (develop && develop == true) { console.log('Global Database Request Success') }
      $.getJSON(itemsLocalUrl, function (itemsLocal, status, xhr) {
        /* Dev log */ if (develop && develop == true) { console.log('Local Database Request Success'); console.log('Merging items...') }

        // Merging function
        function mergeItems(arrayOne, arrayTwo) {
          return [
            ...[arrayOne, arrayTwo].reduce((a, b) =>
              (b.forEach(obj => a.has(obj.id) && Object.assign(a.get(obj.id), obj) || a.set(obj.id, obj)), a),
              new Map
            ).values()
          ]
        }

        // Merge items
        const itemsMerged = mergeItems(itemsGlobal, itemsLocal)

        // Load dynamic content
        var getContent = $.getJSON(contentUrl, function(content, status, xhr ) {
          /* Dev log */ if (develop && develop == true) { console.log('Content Request Success. Got this data:'); console.log(content); console.log('Rendering Content...'); }

          // Remove loading animation
          $('#page_loader').remove()

          // Mount Page Menu
          if (pageMenu == true) { $('header').after('<nav><div class="nav--wrapper"><ul class="nav--items"></ul></div></nav>') }

          // Mount Content
          const container = document.getElementById('content')

          let sectionMenuCounter = 0 // Set sections counter

          // SECTIONS LOOP
          $.each(content, function (sectionId) {
            const section      = this
            const items        = section.items

            if (section.menu) { sectionMenuCounter++ } // Count sections

            // Mount section element
            var sectionEl = document.createElement( 'section' )
            container.appendChild( sectionEl )

            // Mount unique ID to every section element
            sectionId = sectionId+1
            sectionEl.id = 'section_' + sectionId
            sectionElId  = '#section_' + sectionId

            // Sections basic info
            if (section.title || section.text) {
              var sectionHeader = document.createElement( 'div' )
              sectionHeader.classList.add('section--header')
              sectionEl.appendChild( sectionHeader )
              // Mount section Title attr
              if (section.title) {
                var sectionTitle = document.createElement( 'h2' )
                sectionTitle.innerHTML = section.title
                $('.section--header h2').addClass('js-aos')
                sectionHeader.appendChild( sectionTitle )
              }
              // Mount section Text attr
              if (section.text) {
                var sectionText = document.createElement( 'p' )
                sectionText.innerHTML = section.text
                $('.section--header p').addClass('js-aos')
                sectionHeader.appendChild( sectionText )
              }
            }

            // end Sections info

            // ITEMS LOOP
            // Check if items exists
            if (items) {
              mergeItems(items, itemsMerged)

              // Create items container
              var itemsEl  = document.createElement( 'div' )
              sectionEl.appendChild( itemsEl )
              itemsEl.classList.add('section--content', 'content__items')
              // Mount into specified section
              if (section.mountIn) {
                $('#' + section.mountIn).append( itemsEl )
                itemsEl.id = 'section_' + sectionId
                $(sectionEl).remove()
              }
              // Add classes to the content
              if (section.type == 'featured') {
                itemsEl.classList.add('__featured')
              } else if (section.type == 'small') {
                itemsEl.classList.add('__small')
              }

              // LOOP
              $.each(items, function (itemIndx) {
                const item = this

                // Create and mount new element for each item
                var singleItemEl  = document.createElement( 'div' )
                singleItemEl.classList.add('section--item')
                itemsEl.appendChild( singleItemEl )
                $('.section--item').html ( `
                  <div class="item--head">
                    <a href="" target="_blank">
                      <img src="" />
                    </a>
                  </div>
                  <div class="item--info">
                    <h3 class="item--name"></h3>
                    <div class="item--desc"></div>
                    <div class="item--footer">
                      <div class="item--price"></div>
                      <a href="" class="item--btn" target="_blank">
                        ${CHECK_IT_OUT}
                      </a>
                    </div>
                  </div>
                ` ).addClass('js-aos')

                // Mount unique ID to item element
                itemIndx = itemIndx+1
                var itemId = 'item_' + sectionId + '-' + itemIndx + '-' + item.id
                singleItemEl.id = itemId // Adds itemId to singleItemEl
                var itemElId = '.section--item' + '#' + itemId

                // Mount item info
                if ( item.type != 'custom' ) { // Mount REGULAR item
                  setTimeout(() => {

                    // Mount item URL, custom item URL or custom item URL without global utm tags
                    var itemElImgLink = $(itemElId + ' .item--head a')
                    var itemElBtnLink = $(itemElId + ' .item--footer a')
                    if (item.utmTags === false) {
                      itemElImgLink.attr('href', item.editUrl)
                      itemElBtnLink.attr('href', item.editUrl)
                    } else {
                      var itemUrl = item.url + utmTags
                      if (item.editUrl === undefined) {
                        itemElImgLink.attr('href', itemUrl)
                        itemElBtnLink.attr('href', itemUrl)
                      } else {
                        var itemUrl = item.editUrl + utmTags
                        itemElImgLink.attr('href', itemUrl)
                        itemElBtnLink.attr('href', itemUrl)
                      }
                    }

                    // Mount item img URL to img source
                    $(itemElId + ' .item--head img').attr('src', item.img).addClass('item--img')

                    // Mount item category & name
                    var itemName = item.name
                    itemName     = itemName.replaceAll('(', '<span class="name--label">')
                    itemName     = itemName.replaceAll(')', '</span>')
                    if (item.editName === undefined) {
                      $(itemElId + ' .item--name').html(`<span class="item--category">${item.category}</span>${itemName}`)
                    } else if (item.editName) {
                      itemName = item.editName
                      $(itemElId + ' .item--name').html(`<span class="item--category">${item.category}</span>${itemName}`)
                    }

                    // Mount additional nameLabel
                    if (item.nameLabel) {
                      var itemNameLabel = item.nameLabel
                      itemNameLabel     = itemNameLabel.replaceAll('(', '<span class="name--label">')
                      itemNameLabel     = itemNameLabel.replaceAll(')', '</span>')
                      $(itemElId + ' .item--name').append( ` ${itemNameLabel}` )
                    }

                    // Mount item description
                    $(itemElId + ' .item--desc').html( `<p>${item.desc}</p>` )
                    // Mount additional text
                    if (item.text) {
                      setTimeout(() => { $(itemElId + ' .item--desc').append( `<p class="item--text">${item.text}</p>` ) }, 0)
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

                      var itemPriceRegular = item.price.regular.toString().replace('.', ',')
                      if (item.price.promo) {
                        var itemPricePromo
                        itemPricePromo = item.price.promo.toString().replace('.', ',')
                      }
                      if (item.price.discount) {
                        item.price.discount = item.price.discount.toString().replace('.', ',')
                      }

                      // Mount item prices
                      if (item.price.regular && item.price.promo) {

                        $(itemElId + ' .item--price').html(`
                          ${itemPricePromo}<small> ${CURRENCY}</small>
                          <span class="__crossed">${itemPriceRegular} ${CURRENCY}</span>
                        `)
                        if (item.price.from) {
                          $(itemElId + ' .item--price').prepend(`<small>${PRICE_FROM} </small>`)
                          $(itemElId + ' .item--price .__crossed').prepend(`${PRICE_FROM} `)
                        }

                        // Mount discount
                        var itemDiscount  = item.price.regular - item.price.promo

                        itemDiscount = itemDiscount.toFixed(2)
                        itemDiscount = itemDiscount.toString().replace('.', ',')
                        itemDiscountCheck = itemDiscount.slice(-2);
                        if(itemDiscountCheck == '00') {
                          itemDiscount = itemDiscount.slice(0, -3);
                        }

                        var itemPercentDiscount = Math.round(((item.price.regular - item.price.promo) / item.price.regular) * 100)

                        $(itemElId + ' .item--head').append(`<div class="item--benefits"></div>`)
                        var itemBenefits = $(itemElId + ' .item--benefits')

                        if (!item.price.percent || item.price.percent === false) {
                          itemBenefits.append(`<div class="item--discount"></div>`)
                          $(itemElId + ' .item--discount').append(`
                            <span class="benefit--title">${SAVE}</span>
                            <strong>${itemDiscount}<small> ${CURRENCY}</small></strong>
                          `)
                          if (item.price.discount) {
                            $(itemElId + ' .item--discount strong').html(`<small>${UP_TO} </small>${item.price.discount}<small> ${CURRENCY}</small>`)
                          }
                        } else {
                          itemBenefits.append(`<div class="item--discount"></div>`)
                          $(itemElId + ' .item--discount').append(`
                            <span class="benefit--title">${SAVE}</span>
                            <strong>${itemPercentDiscount}<small>%</small></strong>
                          `)
                          if (item.price.discount) {
                            $(itemElId + ' .item--discount strong').html(`<small>${UP_TO} </small>${item.price.discount}<small>%</small>`)
                          }
                        }

                      } else if (!item.price.promo) {
                        $(itemElId + ' .item--price').html(`${itemPriceRegular}<small> ${CURRENCY}</small>`)
                        if (item.price.from) {
                          $(itemElId + ' .item--price').prepend(`<small>${PRICE_FROM} </small>`)
                        }
                      }

                    } // end item price & discount

                    // Mount item gift
                    if (item.gift) {
                      var itemBenefits = $(itemElId + ' .item--benefits')
                      var itemGiftEl   = `<div class="item--gift">
                                            <a href="${item.gift.url}" target="_blank" title="${item.gift.name} ${INCLUDED}">
                                              <img src="${item.gift.img}" />
                                            </a>
                                            <span class="benefit--title">+ ${item.gift.name}</span>
                                          </div>`

                      if ( itemBenefits.length > 0 ) {
                        itemBenefits.append( itemGiftEl )
                      } else {
                        $(itemElId + ' .item--head').append(`<div class="item--benefits"></div>`)
                        $(itemElId + ' .item--benefits').append( itemGiftEl )
                      }
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
                    $(itemElId + ' .item--footer a').html(SOLD_OUT)
                  }, 0)
                }
                // Check if Soon
                if (item.soon === true ) {
                  setTimeout(() => {
                    $(itemElId).addClass('item__soon')
                    $(itemElId + ' .item--footer a').html(SOON)
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
              imgEl.classList.add('section--content', 'content__img')

              var sectionContent = sectionElId + ' .content__img'
              var imgDesktopEl = '<img src="' + section.img.desktop + '" class="img__desktop">'
              var imgMobileEl  = '<img src="' + section.img.mobile + '"  class="img__mobile">'

              if (section.url) {
                $(sectionContent).html( `<a href="${section.url}" target="_blank" title="${FIND_OUT}"></a>` )
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
              customEl.classList.add('section--content', 'content__custom')

              $(sectionElId + ' .content__custom').html(section.content)
            }

            // embed type section
            if (section.type === 'embed') {
              var embedEl = document.createElement( 'div' )
              sectionEl.appendChild( embedEl )
              embedEl.classList.add('section--content', 'content__embed_iframe')

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

              var contentEl = document.createElement( 'div' )
              sectionEl.appendChild( contentEl )
              contentEl.classList.add('section--content')

              $('#page_disclaimer .section--content').html( `<p>${section.content}</p>` )
            }

          }) // end SECTIONS

          // if Page Menu // Mount number of columns in menu
          if (pageMenu == true) {
            $('nav .nav--items').addClass('col__' + sectionMenuCounter)
          }

        })
        .fail(function( getContent, textStatus, error ) {
          if (develop && develop == true) {
            console.log( 'Content Request Failed: ' + textStatus + ', ' + error )
            $('#page_loader').remove(); $('#content').append( `<div class="app_error">&#10060; Error found while generating Content. Check console for more information.</div>` )
          }

        })
        .always(function( getContent, status ) {
          if (develop && develop == true) { console.log( 'Content Rendering Complete' ) }
        })
        // end getContent

      })
      .fail(function( getContent, textStatus, error ) {
        /* Dev log */ if (develop && develop == true) { console.log( 'Local Database Request Failed: ' + textStatus + ', ' + error ) }
      })
      .always(function( getContent, status ) {
        /* Dev log */ if (develop && develop == true) { console.log( 'Local Database Request Complete' ) }
      })
    }) /* end getJSON(itemsLocal) */

    .fail(function( getContent, textStatus, error ) {
      /* Dev log */ if (develop && develop == true) { console.log( 'Global Database Request Failed: ' + textStatus + ', ' + error ) }
    })
    .always(function( getContent, status ) {
      /* Dev log */ if (develop && develop == true) { console.log( 'Global Database Request Complete' ) }
    }) /* end getJSON(itemsGlobal) */

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

// Sticky menu
if (settings.menu) {
  $(document).scroll(function(){
    if($(this).scrollTop() >= $('nav').offset().top) {
      $('nav').addClass('__sticky')
    } else {
      $('nav').removeClass('__sticky')
    }
  })
}

// Animations
// function checkElementLocation() {
//   var $window = $(window);
//   var bottom_of_window = $window.scrollTop() + $window.height();
//
//   $('.js-aos').each(function(i) {
//     var $item = $(this);
//     var bottom_of_object = $item.position().top - $item.outerHeight();
//
//     //if element is in viewport, add the animate class
//     if (bottom_of_window > bottom_of_object) {
//       $(this).addClass('fade-up');
//     }
//   });
// }
// $(window).on('load scroll', function() {
//   checkElementLocation();
// });

// Images Error [Test]
// $('img').on('error', function() {
//   $(this).attr('src', '/json-lander/assets/placeholder.png')
// })

// Easer Egg
console.log('%c\nMMMMMMMMMMMMMMMMMm     IIII\nMMMMMMMMMMMMMMMMMMMm   IIII\nMMMM           mMMMM   IIII\nMMMM    MMMM    MMMM   IIII\nMMMM    MMMM    MMMM   IIII\nMMMM    MMMM    MMMM   IIII\nMMMM    MMMM    MMMM   IIII\nMMMM    MMMM    MMMM   IIII\nMMMM    MMMM    MMMM   IIII\n','color: #ff6900');
