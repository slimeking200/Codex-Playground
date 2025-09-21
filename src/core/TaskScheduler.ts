export type ScheduledTask = {
  id: number;
  action: () => void;
  delay: number;
  interval: number;
  repeat: boolean;
};

export class TaskScheduler {
  private tasks: ScheduledTask[] = [];
  private nextId = 0;

  public schedule(action: () => void, delay: number, repeat = false): number {
    const task: ScheduledTask = {
      id: this.nextId++,
      action,
      delay,
      interval: delay,
      repeat
    };
    this.tasks.push(task);
    return task.id;
  }

  public cancel(id: number): void {
    this.tasks = this.tasks.filter((task) => task.id !== id);
  }

  public update(deltaTime: number): void {
    for (let i = this.tasks.length - 1; i >= 0; i--) {
      const task = this.tasks[i];
      task.delay -= deltaTime;
      if (task.delay <= 0) {
        task.action();
        if (task.repeat) {
          task.delay += task.interval;
        } else {
          this.tasks.splice(i, 1);
        }
      }
    }
  }
}
