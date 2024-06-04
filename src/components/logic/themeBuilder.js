const cssProps = [
  [display, 'flex', 'block', 'inline-block', 'inline', 'grid', 'none'],
  [flexDirection, 'row', 'row-reverse', 'column', 'column-reverse'],
  [flexWrap, 'nowrap', 'wrap', 'wrap-reverse'],
  [justifyContent, 'flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly'],
  [alignItems, 'stretch', 'flex-start', 'flex-end', 'center', 'baseline'],
  [color, 'custom'],
  [backgroundColor, 'custom'],
  [fontSize, 'custom'],
  [fontFamily, 'custom'],
  [fontWeight, '500', '600', '700', '800', '900'],
  [lineHeight, 'custom'],
  [textAlign, 'left', 'center', 'right'],
  [padding, 'custom', 'custom', 'custom', 'custom'],
  [margin, 'custom', 'custom', 'custom', 'custom'],
  [border, 'custom', 'custom', 'custom', 'custom'],
  [borderRadius, 'custom'],
  [width, 'custom'],
  [height, 'custom'],
]

function themeBuilder() {
  let theme = {}
  cssProps.forEach(([prop, ...values]) => {
    theme[prop] = {}
    values.forEach(value => {
      theme[prop][value] = {}
    })
  })
  return theme
}

export default themeBuilder