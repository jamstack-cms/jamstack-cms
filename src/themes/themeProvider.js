import lightTheme from './lightTheme'
import darkTheme from './darkTheme'
import dankTheme from './dankTheme'

function getThemeInfo(theme) {
  switch(theme) {
    case 'light':
      return lightTheme 
    case 'dark':
      return darkTheme 
    case 'dank':
      return dankTheme
    default:
      return null
  }
}

export {
  getThemeInfo
}