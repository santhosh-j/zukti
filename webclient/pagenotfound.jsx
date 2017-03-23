import React from 'react';

export default class PageNotFound extends React.Component {
	render() {
    let boxStyle = {
      color: '#666',
      textAlign: 'center',
      fontFamily: `'Helvetica Neue', Helvetica, Arial, sans-serif`,
      margin: 'auto',
      fontSize: '14px'
    };

    let containerStyle = {
      margin: 'auto 20px'
    };

    let imgStyle = {
      maxWidth: '40vw'
    };

    let h1Style = {
      fontSize: '56px',
      lineHeight: '100px',
      fontWeight: 'normal',
      color: '#456'
    };

    let h3Style = {
      color: '#456',
      fontSize: '20px',
      fontWeight: 'normal',
      lineHeight: '28px'
    };

    let hrStyle = {
      maxWidth: '800px',
      margin: '18px auto',
      border: '0',
      borderTop: '1px solid #EEE',
      borderBottom: '1px solid white'
    };

		return (
      <div className='box' style={boxStyle}>
        <h1 style={h1Style}>
          <img style={imgStyle} src='./images/zukti404.PNG' /><br />
          404
        </h1>
        <div className='container' style={containerStyle}>
          <h3 style={h3Style}>The page you're looking for could not be found.</h3>
          <hr style={hrStyle}/>
          <p>Make sure the address is correct and that the page hasn't moved.</p>
          <p>Please contact the Zukti team if you think this is a mistake.</p>
        </div>
      </div>
    );
	}
}
