# json-lander
![version](https://img.shields.io/badge/version-0%2e2_alpha-green.svg)

Simple JavaScript application that mounts content written in JSON into static HTML file.

Easy way to distribute and magane light static sales webpages.

## Technologies
* JS + jQuery

## Features
* Easy setup
* Dynamic content
* Flexible configuration of sections and items
* Custom items
* Custom HTML items
* Custom HTML sections
* Custom CSS
* Multilingualism
* No SQL database needed

### To do
* Global CSS
* Combine only items required by the *content.json*

### In future updates
* Modules
* Dark Mode
* Drag & Drop Content Editor

## Directory Tree
```
json-lander
  |—- app.js
  |-- app.min.js
  |—- assets
  |  |—- style.css
  |  |-- style.scss
  |—- data
  |  |—- items.json
  |—- locale
  |  |—- en_US
  |  |  |—- app.json
  |  |  |—- items.json
  |—- sample-page
  |  |—- index.html
  |  |—- content.json
  |  |—- custom
  |  |  |—- style.css
  |  |  |—- style.scss
  |  |—- img
```

## Setup
Create a new directory for your page and attach link to the app in head element of *index.html*:
```html
<script src="https://cdn.mi-home.pl/apps/json-lander/1.0.0/app.min.js"></script>
```

## How to use it
Set the basic settings and information about the new page in *index.html* before creating its content which you can manage in *content.json*.

### Page Settings
Option | Type | Default | Description
---- | ---- | ---- | ----------
contentUrl | string | '' | Direct link to *content.json*. Cache cleaning recommended after updating those files
pageUrl | string | '' | Page directory name
utmTags | string | '' | SEO UTM tags attached to every item's link (can be turned off for selected items in *content.json*)
header.content | array | [] | Array of objects (texts) mounted in the header
header.contentAlign | string | center | Align of  content in the header
logo | string | orange | Color variant of the logo. Available parameters: `orange`,  `white`
menu | boolean | true | Toggles sections menu under the header

### Page Content Composer

#### Create section
Option | Type | Default | Description
---- | ---- | ---- | ----------
type | string | standard | Specifies section type. Available parameters: `standard`,  `featured`, `small`,  `img`, `embed`, `custom`, `disclaimer`
title | string | null | Section title
text | string | null | Text under the section title
menu | string | null | Short menu title. Only if [`menu` is enabled in page settings](#page-settings).
items | array | [] | Array of [objects containing information about items](#add-items)
img | field | {} | Field of objects with direct links to `desktop` and `mobile` version of the image. Possibility to add link using `url` key. Only if section type is `img`
url | string | null | URL attached to image. Only if section type is `img`
embed | field | {} | Single object field with choosen online video platform as a key and video ID as a value. Only if section type is `embed`
content | string | null | Section manual content. Only if section type is `custom`

Items Section Example:
```json
{
  "title":"Sample Section Title",
  "text":"Lorem ipsum dolor sit amet",
  "menu":"Short Title",
  "type":"standard",
  "items": [ ]
}
```

Image Section Example:
```json
{
  "title":"Sample Section Title",
  "type":"img",
  "img":{
    "desktop":"//yourpage.com/img-pc.jpg",
    "mobile":"//yourpage.com/img-m.jpg"
  },
  "url":"//samplepage.com"
}
```

Embed Section Example:
```json
{
  "title":"Sample Section Title",
  "type":"embed",
  "embed": { "youtube":"dQw4w9WgXcQ" }
}
```

Custom Section Example:
```json
{
  "title":"Sample Section Title",
  "type":"custom",
  "content":"<div class='eg'>Lorem ipsum dolor sit amet</div>"
}
```

#### Add items
Option | Type | Default/Params | Description
---- | ---- | ---- | ----------
id | string | '' | Item ID in order to get information from *items.json*. Can be [manual](#manual-item)
price | array | {} | Array of objects containing information about the item prices (required)
price.regular | int | '' | Regular price of the item
price.promo | int | null | Price of the item after discount
price.percent | boolean | false | Toggles percentage discount
price.from | boolean | false | Toggles word *from* before the item prices
price.discount | int | null | Enables custom discount with phrase *up to* before the amount
nameLabel | string | null | Optional text after item name
text | string | null | Optional text under the item description
labelName | string | null | Optional label text
labelIcon | string | null | Optional label icon (Font Awesome) (e.g.: `fire`) (only if `labelName` is set)
soon | boolean | false | Toggles *Soon* button
soldOut | boolean | false | Toggles *Sold out* button
gift | array | null | Optional array of strings containing information about additional gift to the item
gift.name | string | '' | Name of the item's gift
gift.img | string | '' | Image of the item's gift
gift.url | string | '' | URL to the item's gift page
customName | string | null | Edits the item name
customCategory | string | null | Edits the item category (not yet supported)
customImg | string | null | Edits the item image (not yet supported)
customUrl | string | null | Edits the item URL (Required if `utmTags` is set to `false`)
utmTags | boolean | true | Toggles page UTM tags attachment to the item URLs
type | string | null  | Specifies item type. Set to `custom` in order to enable Custom HTML Item
content | string | null | `custom` item content.

Really simple Item Example:
```json
{
  "id":"database-item-id",
  "price":{ "regular":99 }
}
```

Rich Item Example:
```json
{
  "id":"database-item-id",
  "price":{
    "regular":199,
    "promo":99,
    "from":true,
    "percent":true
  },
  "customName":"Edited Database Item Name",
  "nameLabel":"(Special Edition)",
  "text":"Lorem ipsum folie sit smet",
  "labelName":"Bestseller",
  "soldOut":true,
  "gift":{
    "name":"Sample Gift Name",
    "img":"//media.yourpage.com/eg/gift-72px@2x.png",
    "url":"//yourpage.com/gift-page-url"
  },
  "utmTags":false,
  "customUrl":"//examplepage.com/custom-item-url?my-own-utm"
}
```
#### Manual item
If you want to add the item manually - create unique `id` and add required strings: `name`, `category`, `desc`, `url` and `img`.

#### Item Name Labels
Parentheses `(*)` in values of `name` and `nameLabel` strings are replaced with HTML tag:
`<span class="name--label">*</span>`

### New data item
To add a new item to the existing database just add another array to *items.json* in *data* and your *locale* directory.

Variable | Type | Description
---- | ---- | ----------
id | string | Item ID used in localization files and in *content.json* (use dash as space)
name | string | Name of the item
img | string | Directory path for item image
url | string | Item page URL
category | string | Category of the item (in *locale* file)
desc | string | Short description about the item (in *locale* file)

Global Data Example:
```json
{
  "id":"database-item-id",
  "name":"Sample Item Name",
  "img":"//media.yourpage.com/eg/sample-item.png"
}
```

Locale Data Example:
```json
{
  "id":"database-item-id",
  "url":"//yourpage.com/sample-item-url",
  "category":"Sample Item Category",
  "desc":"Sample item description in your local language."
}
```
