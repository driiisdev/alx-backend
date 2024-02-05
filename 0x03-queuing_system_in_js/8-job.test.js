import createPushNotificationsJobs from './8-job';

const kue = require('kue');
const chai = require('chai');

const { expect } = chai;
const sinon = require('sinon');

const queue = kue.createQueue();

describe('createPushNotificationsJobs', () => {
  before(() => {
    queue.testMode.enter();
  });

  afterEach(() => {
    queue.testMode.clear();
  });

  after(() => {
    queue.testMode.exit();
  });

  it('display a error message if jobs is not an array', () => {
    const err = new Error('Jobs is not an array');
    try {
      createPushNotificationsJobs('string', queue);
    } catch (e) {
      expect(e).to.eql(err);
    }
  });

  it('created to new jobs to the queue', () => {
    queue.createJob('firstJob', { foo: 'abc' }).save();
    queue.createJob('secondJob', { bar: 'xyz' }).save();
    expect(queue.testMode.jobs.length).to.be.equal(2);
    expect(queue.testMode.jobs[0].type).to.be.equal('firstJob');
    expect(queue.testMode.jobs[1].type).to.be.equal('secondJob');
    expect(queue.testMode.jobs[0].data).to.be.eql({ foo: 'abc' });
    expect(queue.testMode.jobs[1].data).to.be.eql({ bar: 'xyz' });
  });
});
