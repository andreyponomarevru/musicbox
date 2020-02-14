# How to use

```pug
html(lang='en' class='page')
  //- ...
  body(class='page__body page__preload')
```

# Notes

Whenever you don’t have any `<script></script>` tags on the page, Google Chrome fires CSS-`transition` on page load. To fix this:

- add `&__preload` class to all descendants of `<body>`. After full page loading, we remove this class with the help of a small script `page.js`
- in \_page.scss uncomment `&__preload * { ...`
