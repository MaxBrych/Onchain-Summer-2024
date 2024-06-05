const app = document.getElementById('app');

const cssProps = {
  display: ['flex', 'block', 'inline-block', 'inline', 'grid', 'none'],
  position: ['relative', 'absolute', 'fixed'],
  flexDirection: ['row', 'row-reverse', 'column', 'column-reverse'],
  flexWrap: ['nowrap', 'wrap', 'wrap-reverse'],
  justifyContent: ['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly'],
  alignItems: ['stretch', 'flex-start', 'flex-end', 'center', 'baseline'],
  color: null,
  backgroundColor: null,
  fontSize: null,
  fontFamily: ['Arial', 'Helvetica', 'sans-serif', 'Times New Roman', 'Times', 'serif', 'Courier New', 'Courier', 'monospace'],
  fontWeight: ['500', '600', '700', '800', '900'],
  lineHeight: null,
  textAlign: ['left', 'center', 'right', 'justify'],
  padding: null,
  margin: null,
  border: null,
  borderRadius: null,
  width: null,
  height: null,
}

let html = '';

let colorProps = ['color', 'backgroundColor', 'borderColor'];

for (let prop in cssProps) {
  html += `<p>${prop}</p>`;
  if (cssProps[prop] !== null) {
    html += `<select name="${prop}">`;
    cssProps[prop].forEach(value => {
      html += value !== null ? `<option>${value}</option>` : `<input type="number" name="${prop}">`;
    });
    html += `</select>`;
  } else {
    if (colorProps.includes(prop)) {
      html += `<input type="color" name="${prop}">`;
    } else {
      html += `<input type="number" name="${prop}">`;
    }
  }
}

app.innerHTML = html;

// Create a style element
let style = document.createElement('style');
document.head.appendChild(style);

// Object to keep track of set properties
let setProps = {};

function toCSSPropertyName(propertyName) {
  return propertyName.replace(/([A-Z])/g, "-$1").toLowerCase();
}

app.addEventListener('change', function(event) {
  let target = event.target;
  let propName = toCSSPropertyName(target.name); // Convert to kebab-case here
  let propValue = target.value;

  console.log('Changed property:', propName); // Log the property that was changed

  // List of properties that typically use pixel values
  let pixelProps = ['font-size', 'padding', 'margin', 'border-radius', 'width', 'height'];

  // List of properties that typically use color values
  let colorProps = ['color', 'background-color', 'border-color'];

  // If the target is an input element and the property is in the pixelProps list, append 'px' to the value
  if (target.tagName === 'INPUT' && pixelProps.includes(propName)) {
    propValue += 'px';
  }

  // If the target is an input element and the property is in the colorProps list, ensure the value is a valid hex color code
  if (target.tagName === 'INPUT' && colorProps.includes(propName)) {
    if (!/^#([0-9A-F]{3}){1,2}$/i.test(propValue)) {
      alert('Please enter a valid hex color code.');
      return;
    }
    console.log('Setting color property:', propName, 'to', propValue); // Log the color property that is being set
  }

  // Update the setProps object and the CSS
  setProps[propName] = propValue;
  style.textContent = '.current_object {\n';
  for (let prop in setProps) {
    style.textContent += `  ${prop}: ${setProps[prop]};\n`;
  }
  style.textContent += '}';
});