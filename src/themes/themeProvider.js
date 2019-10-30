import lightTheme from './lightTheme'
import darkTheme from './darkTheme'
import dankTheme from './dankTheme'
import reactiveTheme from './reactiveTheme'

function getThemeInfo(theme) {
  switch(theme) {
    case 'light':
      return lightTheme 
    case 'dark':
      return darkTheme 
    case 'dank':
      return dankTheme
    case 'reactive':
      return reactiveTheme
    default:
      return null
  }
}

export {
  getThemeInfo
}