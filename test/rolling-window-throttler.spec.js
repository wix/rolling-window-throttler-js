'use strict';
const expect = require('chai').expect,
  factory = require('..'),
  sinon = require('sinon');

describe('rolling window throttler', () => {
  const key = '192.168.2.1';
  let throttler;

  beforeEach(() => throttler = aThrottler(1000));

  it('Should allow single request', () => {
    expect(throttler.tryAcquire(key)).to.be.true;
  });

  it('Should throttle second request', () => {
    throttler.tryAcquire(key);
    expect(throttler.tryAcquire(key)).to.be.false;
  });

  it('should allow second request but from different key', () => {
    const anotherKey = '200.200.200.1';
    expect(throttler.tryAcquire(key)).to.be.true;
    expect(throttler.tryAcquire(anotherKey)).to.be.true;
  });

  it('should re-allow request after the rolling window', sinon.test(function() {
    throttler.tryAcquire(key);
    this.clock.tick(2000);
    expect(throttler.tryAcquire(key)).to.be.true;
  }));

  it('should work with verbal durationWindow and not milliseconds', sinon.test(function() {
    throttler = aThrottler('1s');
    throttler.tryAcquire(key);
    this.clock.tick(2000);
    expect(throttler.tryAcquire(key)).to.be.true;
  }));

  function aThrottler(durationWindow) {
    return factory.get({max: 1, durationWindow: durationWindow || 1000});
  }

});