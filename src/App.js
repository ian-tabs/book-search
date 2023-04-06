import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';

// Import all files in the pages directory
const pages = require.context('./pages', true, /\.jsx?$/);
// Get a list of all page components
const pageComponents = pages.keys().map((key) => pages(key).default);

function App() {
  return (
    <>
      <Menu>
        <Menu.Item as={Link} to="/">Home</Menu.Item>
        {pageComponents.map((PageComponent, index) => (
          <Menu.Item key={index} as={Link} to={`/${PageComponent.name}`}>
            {PageComponent.name}
          </Menu.Item>
        ))}
      </Menu>
      <Routes>
        {/* Set Home Page here */}
        <Route path="/" element={<h1>Home Page</h1>} />
        {pageComponents.map((PageComponent, index) => (
          <Route
            key={index}
            path={`/${PageComponent.name}`}
            element={<PageComponent />}
          />
        ))}
        {/* Catch-all route */}
        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
    </>
  );
}

export default App;
