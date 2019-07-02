import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment';
import { debounce } from '../../utils';

class WindowScrollListener {
  constructor () {
    this._id = 0;
    this._listeners = {};
    this._initialized = false;
    this._publish = this._publish.bind(this);
    this._scrollValue = 0;
  }

  /**
   * @returns The latest scroll position of the window
   * @memberof WindowScrollListener
   */
  getCurrentScrollValue () {
    return this._scrollValue;
  }

  /**
   *
   * @param {Function} listener
   * @returns
   * @memberof WindowScrollListener
   */
  subscribe (listener) {
    if (typeof listener !== 'function') {
      console.trace && console.trace('WindowScrollListener:: listener should be a function');
      return;
    }
    this._init();
    this._listeners[this._id] = listener;
    return this._id++;
  }

  /**
   * @param {Number} id provide the return value of subscribe api
   * @returns
   * @memberof WindowScrollListener
   */
  unsubscribe (id) {
    if (typeof id === 'undefined') {
      return console.trace('WindowScrollListener:: Expects an id to unsubscribe a listener');
    }
    return delete this._listeners[id];
  }

  _publish () {
    this._scrollValue = typeof window.scrollY !== 'undefined' ? window.scrollY : window.pageYOffset;
    for (const listenerId in this._listeners) {
      if (this._listeners[listenerId]) {
        const listener = this._listeners[listenerId];
        listener();
      }
    }
  }

  _init () {
    if (this._initialized) {
      return;
    }
    if (!canUseDOM) {
      return;
    }
    window.addEventListener('scroll', this._publish, { passive: true });
    this._initialized = true;
  }
}

export default new WindowScrollListener();
