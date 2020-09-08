# Curvature.js

v.0.0.61

Curvature is a lightweight javascript framework with an emphasis on **straightforwardness**.

This document serves only as an overview. For more in-depth, interactive documentation, see http://curvature.unholysh.it/.

## Getting started

Install with npm:

```sh
$ npm install curvature
```

Or grab the file located at [`dist/curvature.js`](https://raw.githubusercontent.com/seanmorris/curvature-2/master/dist/curvature.js) and load it with a `<script>` tag. Please do not hotlink this file.


## Creating Views

Create a view class:

```javascript
import { View } from 'curvature/base/View';

class MyView extends View
{
    constructor()
    {
        super();

        this.template = `<b>Hello, world!</b>`;
    }
}
```
or an anonymous view:

```javascript
import { View } from 'curvature/base/View';

const view = View.from(`<b>Hello, world!</b>`);

```

Render a view directly into an existing tag:

```javascript
import { View } from 'curvature/base/View';

const view = View.from(`<b>Hello, world!</b>`);
const div  = document.querySelector('div.hello');

view.render(div);
```

Render a view to the `<body>` tag as soon as the DOM is ready:

```javascript
import { View } from 'curvature/base/View';

const view = View.from(`<b>Hello, world!</b>`);

document.addEventListener('DOMContentLoaded', () => {
	const body = new Tag(document.querySelector('body'));
	view.render(body.element);
});

```
## Separating Templates

Writing HTML into a javascript string can be annoying.

Use the `rawquire` babel macro to import templates directly from html files, and maintin your syntax highlighting.

```sh
$ npm install rawquire
```

**my-template.html**:
```html
<p>This is my template!</p>
```

**MyView.js**:
```javascript
import { rawquire } from 'rawquire/rawquire.macro';
import { View } from 'curvature/base/View';

class MyView extends View
{
    constructor()
    {
        super();

        this.template = rawquire('./my-template.html');
    }
}
```

## Variable Binding

Use the `cv-bind` attribute, or `[[squarebrackets]]`  to insert variables from the `view.args` property into your templates:

**my-template.html**
```html
<p><span cv-bind = "prefix"></span> [[time]]</p>
```

**MyView.js**
```javascript
import { rawquire } from 'rawquire/rawquire.macro';
import { View } from 'curvature/base/View';

class MyView extends View
{
    constructor()
    {
        super();

        this.args.prefix = 'The time is';

        this.onInterval(1, ()=>{
            this.args.time = Date.now();
        });

        this.template = rawquire('my-template.html');
    }
}
```

## Event Listeners

Use the `cv-on` attribute to listen for events on your view object:

**clickable.html**
```html
<button cv-on = "click:click(event)">click me!</button>
```

**Clickable.js**
```javascript
import { rawquire } from 'rawquire/rawquire.macro';
import { View } from 'curvature/base/View';

class Clickable extends View
{
    constructor()
    {
        super();

        this.template = rawquire('./clickable.html');
    }

    click(event)
    {
    	alert('button clicked!');
    }
}
```

Or, for anonymous views:

```javascript
import { View } from 'curvature/base/View';

const view = View.from(`<button cv-on = "click:click(event)">click me!</button>`);

view.click = (event) => {
	alert('button clicked!');
};

```

If the event & method names match, you can just use a ":".

```javascript
import { View } from 'curvature/base/View';

const view = View.from(`<button cv-on = ":click(event)">click me!</button>`);

view.click = (event) => {
	alert('button clicked!');
};

```

Multiple listeners may be provided in a ";" separated list:

```javascript
import { View } from 'curvature/base/View';

const view = View.from(`<button cv-on = ":click(event);:hover(event)">click me!</button>`);

view.click = (event) => {
	alert('button clicked!');
};

view.hover = (event) => {
	console.log('button hovered!');
};

```
