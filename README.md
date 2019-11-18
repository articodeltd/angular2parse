# angular2parse
Parse util for angular expressions:  html string -> angular temaplte 

# install 
`npm install angular2parse`

```typescript 
// app.module.ts
@NgModule({
  imports: [Angular2ParseModule, ...],
  // ...
})
class AppModule {}
```
# usage 
```typescript
import { Parse } from 'angular2parse';

@Injectable()
class MyService {
  constructor(private parser: Parse) {}
  
  parseAngularString() {
    const expression = `{
	positions: track.positions,
	cornerType: getCornerType(),
	material: track.color,
	width : 200000.0 }`;

   const expressionEvalFn = this.parser.eval(expression)
  
   const context = {
      getCornerType: () => 'value',
      track: {
          positions: [1,2,3],
          color: 'red',
        }
      }
   };
    
   const result = expressionEvalFn(context);
   console.log(result);
   // {positions: [1,2,3], cornerType: 'value', material: 'red', width: 2000}
  
}

```

```
