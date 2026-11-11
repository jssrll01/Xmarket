import React from 'react';

export default class YtDebug extends React.Component {
  constructor(p) { super(p); this.state = { e: null, c: '' }; }
  static getDerivedStateFromError(e) { return { e }; }
  componentDidCatch(e, info) { this.setState({ c: (info && info.componentStack) || '' }); }
  render() {
    if (this.state.e) {
      const e = this.state.e;
      return (
        <pre style={{ whiteSpace: 'pre-wrap', padding: 16, fontSize: 11, color: '#b00', background: '#fff' }}>
          {String(e && (e.name + ': ' + e.message))}{'\n\n'}{String(this.state.c).slice(0, 900)}
        </pre>
      );
    }
    return this.props.children;
  }
}
