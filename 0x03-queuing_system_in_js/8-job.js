function createPushNotificationsJobs(jobs, queue) {
  if (!(jobs instanceof Array)) {
    throw new Error('Jobs is not an array');
  }
  for (const _job of jobs) {
    const job = queue.create('push_notifications_code_3', _job)
      .save((err) => {
        console.log('saving', job);
        if (!err) {
          console.log('Notification job created:', job.id);
        }
      });
    job.on('complete', () => {
      console.log(`Notification job #${job.id} completed`);
    })
      .on('failed', (err) => {
        console.log(`Notification job #${job.id} failed:`, err.toString());
      })
      .on('progress', (progress) => {
        console.log(`Notification job #${job.id} ${progress}% complete`);
      });
  }
}

module.exports = console;
module.exports = createPushNotificationsJobs;
