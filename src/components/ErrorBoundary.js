import React from 'react';
import ServerError from '../pages/ServerError';

export default class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  componentDidCatch(error, info) {
    console.error('[XMARKET ErrorBoundary]', error, info);
  }
  render() {
    if (this.state.error) return <ServerError error={this.state.error.message} />;
    return this.props.children;
  }
}
