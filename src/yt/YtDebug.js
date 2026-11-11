import React from 'react';

export default class YtDebug extends React.Component {
  constructor(p) { super(p); this.state = { e: null }; }
  static getDerivedStateFromError(e) { return { e }; }
  render() {
    if (this.state.e) {
      return (
        <pre style={{ whiteSpace: 'pre-wrap', padding: 16, fontSize: 12, color: '#b00', background: '#fff' }}>
          {String(this.state.e && this.state.e.message)}{'\n\n'}{String(this.state.e && this.state.e.stack).slice(0, 700)}
        </pre>
      );
    }
    return this.props.children;
  }
}
