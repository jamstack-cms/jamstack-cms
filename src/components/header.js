import React from 'react'

class Header extends React.Component {
  render() {
    return (
      <div style={styles.container}>

        {/* <Img style={styles.logo} src={logo} /> */}
      </div>
    )
  }
}

export default Header

const styles = {
  container: {
    borderBottom: '1px solid rgba(0, 0, 0, .2)',
    backgroundColor: '#fafafa',
    padding: '8px 130px 0px'
  },
  logo: {
    margin: 0
  }
}