[GoTo Readme](../README.md)

[GoTo Overview](./overview.md)

# hasClaims Directive

The library provides you the ability to show/hide elements automatically if the user has certain claims or doesn't have them.

## ngModule implementation

**Note**: you need to import `IxxAuthHooksModule` in your `app.module.ts`

```ts
import { NgModule } from '@angular/core';
import { IxxAuthHooksModule } from 'angular-iXXX-authorization';

@NgModule({
  imports: [
    IxxAuthHooksModule,
    ...
  ],
  ...
})
export class AppModule { }
```

```html
<div [hasClaim]="'default:employee'">I am only visible if the user has the claim 'default:employee'</div>
```

## Single Component implementation

**Note**: you need to import `IxxAuthHooksModule` in your component file

```ts
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [..., IxxAuthHooksModule],
})
export class AppComponent {
...
}
```

The use of the directive is the same as ngModule implementation.

You can define the `[hasClaim]` directive on any html tag you want. It will use the `display: none/block` CSS attribute to hide/show your element dependent on your claim expression.

**Note**: To ensure proper functionality, you must use block-level elements. Inline elements, such as `<span>`, will not work effectively with the `[hasClaim]` directive. You can utilize block-level elements like `<div>`, or adjust the style of inline elements to display as block by setting `style="display: block"`.

## Supported Claim Expressions

The directive supports AND (`&`) OR (default behavior) and NEGATION (`!`) expressions. It is important that this expressions can be applied only to the whole expression! You cannot mix it within one expression.

- Check if a claim exists, no mather which value:

```ts
[hasClaim] = "'default:employee'";
```

- Require a specific claim with a specific value:

```ts
[hasClaim] = "'default:employee=True'";
```

- One claim of a list is required:

```ts
[hasClaim] = "'default:employee,hr:manager'"; /* the user needs to be a default:employe OR a hr:manager */
```

- All claims of a list are required:

```ts
[hasClaim] = "'&default:employee,hr:manager'"; /* the user needs to be a default:employe AND a hr:manager */
```

- The user must not have at least one claim:

```ts
[hasClaim] = "'!default:employee,hr:manager'"; /* the user does not have default:employe AND/OR hr:manager, i.e. one or both evaluate to false */
```

- The user must not have any of the listed claims:

```ts
[hasClaim] = "'!&default:employee,hr:manager'"; /* the user does not have default:employe AND hr:manager claim, i.e. both claims evaluate to false */
```

- you can also use the specific value check with AND/OR/NEGATION:

```ts
/* Random set of examples: */
[hasClaim] = "'!&default:employee=True,hr:manager'"[hasClaim] = "'!default:employee=True,hr:manager=1'"[hasClaim] = "'default:employee=False,hr:manager=SomeValue'";
```
