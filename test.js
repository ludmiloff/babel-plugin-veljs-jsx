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
  'self.part(1)`<div></div>`;'
)

test(
  "Transforms void element",
  '<br/>;',
  'self.part(2)`<br>`;'
)

test(
  "Discards content of void element",
  '<br>test</br>;',
  'self.part(3)`<br>`;'
)

test(
  "Transforms fragment",
  '<><div>foo</div></>;',
  'self.part(4)`<div>foo</div>`;'
)

console.log('### Custom (Virtual) Elements')

test(
  "Transforms custom (virtual) element class (fragmentId must be incremented twice)",
  '<div><MyComponent prop="test"/></div>;',
  'self.part(7)`<div>${MyComponent.for(self, "_f7_", {\n'
    + '  prop: "test"\n'
    + '})}</div>`;'
)

console.log('### Attributes')

test(
  "Transforms string attributes",
  `<input type="text" value='foo'/>;`,
  'self.part(8)`<input type="text" value=\'foo\'>`;'
)

test(
  "Transforms expression attributes",
  `<input value={val}/>;`,
  'self.part(9)`<input value=${val}>`;'
)

test(
  "Doesn't transform entities in string attributes",
  `<input value="&quot;"/>;`,
  'self.part(10)`<input value="&quot;">`;'
)

test(
  "Escapes string attributes",
  `<input value='\\\\' placeholder="\`"/>;`,
  `self.part(11)\`<input value='\\\\\\\\' placeholder="\\\`">\`;`
)

test(
  "Transforms boolean attributes (default true value)",
  `<input disabled/>;`,
  'self.part(12)`<input disabled>`;'
)

test(
  "Transforms boolean attributes (false)",
  `<input disabled="true"/>;`,
  'self.part(13)`<input disabled="true">`;'
)

test(
  "Transforms expression attributes",
  `<input value={val}/>;`,
  'self.part(14)`<input value=${val}>`;'
)

test(
  "Transforms expression attribute with JSX template value",
  `<Tag render={<Element value={my}/>}/>;`,
  'Tag.for(self, "_f18_", {\n'
  + '  render: Element.for(self, "_f20_", {\n'
  + '    value: my\n'
  + '  })\n'
  + '});',
)

console.log('### Event handlers')

test(
  "Transforms event handlers (dashed)",
  `<input on-input={console.log}/>;`,
  'self.part(21)`<input oninput=${console.log}>`;'
)

test(
  "Transforms event handlers (React style)",
  `<button onClick={console.log}/>;`,
  'self.part(22)`<button onclick=${console.log}></button>`;'
)

test(
  "Transforms event handlers for custom (virtual) element (React style)",
  `<Button onClick={console.log}/>;`,
  'Button.for(self, "_f24_", {\n  onClick: console.log\n});'
)

console.log('### Children')

test(
  "Transforms text children",
  `<p> foo bar </p>;`,
  'self.part(25)`<p> foo bar </p>`;'
)

test(
  "Escapes text children",
  '<p> `\\` </p>;',
  'self.part(26)`<p> \\`\\\\\\` </p>`;'
)

test(
  "Doesn't transform entities in text children",
  '<p> &quot; </p>;',
  'self.part(27)`<p> &quot; </p>`;'
)

test(
  "Transforms expression children",
  `<p> foo: {val} </p>;`,
  'self.part(28)`<p> foo: ${val} </p>`;'
)

test(
  "Skips empty expression children",
  `<p>{ } { /* comment */ }</p>;`,
  'self.part(29)`<p> </p>`;'
)

test(
  "Transforms element children",
  `<p> foo: <b> {val} </b> </p>;`,
  'self.part(30)`<p> foo: <b> ${val} </b> </p>`;'
)

test(
  "Transforms fragment children",
  `<p> foo: <>{val}</> </p>;`,
  'self.part(31)`<p> foo: ${val} </p>`;'
)

console.log('### Element extras (NO TESTS ATM)')


console.log('JSX conformance and tweaks')

test(
  "Transform JSX properties (React style)",
  '<div className="some-class" onClick={console.log}></div>',
  'self.part(32)`<div class="some-class" onclick=${console.log}></div>`;'
)

console.log("All tests passed successfully! 🎉")
