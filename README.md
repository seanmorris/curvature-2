# Curvature.js

v.0.0.12

## Getting started

### Brunch

Install with npm:

```sh
$ npm install curvature
```

Access classes like:

```javascript
import { View } from 'curvature/base/View';

export class View extends View
{
    ...
}
```

### Vanilla js

Grab curvature.js from the .dist/ directory.

```html
<script src = "curvature.js">
```

```javascript
const curvature = require('curvature');

class MyView extends curvature.base.View
{
    ...
}
```

### Initialization & Basic Views

Create a basic view:

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

Initialize like so:

```javascript
import { MyView } from './RootView';

document.addEventListener('DOMContentLoaded', () => {
	const view = new MyView();
	const body = new Tag(document.querySelector('body'));
	view.render(body.element);
});

```

### Variable Binding

Use [[square]] brackets to interpolate variables from the View.args property into your templates:

```javascript
import { View } from 'curvature/base/View';

class MyView extends View
{
    constructor()
    {  
        super();
        
        this.onInterval(1, ()=>{
            this.args.time = Date.now();
        });

        this.template = `<p>The time is [[time]]</p>`;
    }
}
```

### Template files \[Brunch only\]

```sh
$ npm install raw-brunch
```

```html
<p>This is my template!</p>
```

```javascript
import { View } from 'curvature/base/View';

class MyView extends View
{
    constructor()
    {  
        super();

        this.template = require('./MyTemplate.html');
    }
}
```















