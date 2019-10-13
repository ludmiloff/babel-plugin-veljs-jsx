/* eslint no-console: off */

const babel = require('@babel/core')
const assert = require('assert')

const options = {plugins: ['module:./index.js']}

const test = (desc, input, output) => {
  console.log(`${desc}...`)
  const {code} = babel.transformSync(input, options)
  assert.equal(code, output)
}

console.log('### Html Elements')

test(
  "Transforms element",
  '<div/>;',
  'this.part(1)`<div></div>`;'
)

test(
  "Transforms void element",
  '<br/>;',
  'this.part(2)`<br>`;'
)

test(
  "Discards content of void element",
  '<br>test</br>;',
  'this.part(3)`<br>`;'
)

test(
  "Transforms fragment",
  '<><div>foo</div></>;',
  'this.part(4)`<div>foo</div>`;'
)

console.log('### Custom (Virtual) Elements')

test(
  "Transforms custom (virtual) element class (fragmentId must be incremented twice)",
  '<div><MyComponent/></div>;',
  'this.part(6)`<div>${MyComponent.for(this, 6, {})}</div>`;'
)

console.log('### Attributes')

test(
  "Transforms string attributes",
  `<input type="text" value='foo'/>;`,
  'this.part(7)`<input type="text" value=\'foo\'>`;'
)

test(
  "Transforms expression attributes",
  `<input value={val}/>;`,
  'this.part(8)`<input value=${val}>`;'
)

test(
  "Doesn't transform entities in string attributes",
  `<input value="&quot;"/>;`,
  'this.part(9)`<input value="&quot;">`;'
)

test(
  "Escapes string attributes",
  `<input value='\\\\' placeholder="\`"/>;`,
  `this.part(10)\`<input value='\\\\\\\\' placeholder="\\\`">\`;`
)

test(
  "Transforms boolean attributes (default true value)",
  `<input disabled/>;`,
  'this.part(11)`<input disabled>`;'
)

test(
  "Transforms boolean attributes (false)",
  `<input disabled="true"/>;`,
  'this.part(12)`<input disabled="true">`;'
)

test(
  "Transforms expression attributes",
  `<input value={val}/>;`,
  'this.part(13)`<input value=${val}>`;'
)

test(
  "Transforms expression attribute with JSX template value",
  `<Tag render={<div><Element value={my}/>test</div>}/>;`,
  'this.part(17)`${Tag.for(this, 17, {render:this.part(16)`<div>${Element.for(this, 16, {value:my})}test</div>`})}`;'
)

console.log('### Event handlers')

test(
  "Transforms event handlers (dashed)",
  `<input on-input={console.log}/>;`,
  'this.part(18)`<input oninput=${console.log}>`;'
)

test(
  "Transforms event handlers (React style)",
  `<button onClick={console.log}/>;`,
  'this.part(19)`<button onclick=${console.log}></button>`;'
)

test(
  "Transforms event handlers for custom (virtual) element (React style)",
  `<Button onClick={console.log}/>;`,
  'this.part(21)`${Button.for(this, 21, {onClick:console.log})}`;'
)

console.log('### Children')

test(
  "Transforms text children",
  `<p> foo bar </p>;`,
  'this.part(22)`<p> foo bar </p>`;'
)

test(
  "Escapes text children",
  '<p> `\\` </p>;',
  'this.part(23)`<p> \\`\\\\\\` </p>`;'
)

test(
  "Doesn't transform entities in text children",
  '<p> &quot; </p>;',
  'this.part(24)`<p> &quot; </p>`;'
)

test(
  "Transforms expression children",
  `<p> foo: {val} </p>;`,
  'this.part(25)`<p> foo: ${val} </p>`;'
)

test(
  "Skips empty expression children",
  `<p>{ } { /* comment */ }</p>;`,
  'this.part(26)`<p> </p>`;'
)

test(
  "Transforms element children",
  `<p> foo: <b> {val} </b> </p>;`,
  'this.part(27)`<p> foo: <b> ${val} </b> </p>`;'
)

test(
  "Transforms fragment children",
  `<p> foo: <>{val}</> </p>;`,
  'this.part(28)`<p> foo: ${val} </p>`;'
)

console.log('### Element extras')

test(
  "Transforms Element extras - (ForEach) with Template(function(props))",
  '<ul><ForEach items={list} render={TemplateFunction} /></ul>',
  'this.part(29)`<ul>${vLopp(list,TemplateFunction)}</ul>`;'
)

console.log("All tests passed successfully! 🎉")
