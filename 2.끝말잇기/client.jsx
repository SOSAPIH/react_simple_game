const React = require('react');
const ReactDOM = require('react-dom/client');  // script로 안부르고 node의 module시스템으로 편리하게 불러옴
const WordRelay = require('./WordRelay'); 

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(<React.StrictMode>
    <WordRelay />
</React.StrictMode>)
// ReactDom.render(<WordRelay/>, document.querySelector('#root'));
