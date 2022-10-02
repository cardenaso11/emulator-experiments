import type { Component } from 'solid-js';

import { fromMaybe, decodeOpCode } from './Interpreter';

import logo from './logo.svg';
import styles from './App.module.css';

const App: Component = () => {
  return (
    <div class={styles.App}>
      <header class={styles.header}>
        <img src={logo} class={styles.logo} alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          class={styles.link}
          href="https://github.com/solidjs/solid"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn Solid
        </a>
        <p>decode: {decodeOpCode(0x00E0)?.toString()}</p>
      </header>
    </div>
  );
};

export default App;
