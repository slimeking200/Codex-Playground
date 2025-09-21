export type PointerState = {
  x: number;
  y: number;
  dx: number;
  dy: number;
  wheel: number;
  pointerLocked: boolean;
};

export class InputManager {
  private keys = new Map<string, boolean>();
  private pointer: PointerState = {
    x: 0,
    y: 0,
    dx: 0,
    dy: 0,
    wheel: 0,
    pointerLocked: false
  };

  constructor(private readonly element: HTMLElement) {
    element.tabIndex = 0;
    element.addEventListener('keydown', (event) => this.onKey(event, true));
    element.addEventListener('keyup', (event) => this.onKey(event, false));
    element.addEventListener('mousemove', (event) => this.onPointerMove(event));
    element.addEventListener('wheel', (event) => this.onWheel(event));
    element.addEventListener('click', () => this.requestPointerLock());
    document.addEventListener('pointerlockchange', () => this.onPointerLockChange());
  }

  private onKey(event: KeyboardEvent, value: boolean): void {
    this.keys.set(event.code, value);
  }

  private onPointerMove(event: MouseEvent): void {
    this.pointer.dx += event.movementX;
    this.pointer.dy += event.movementY;
    this.pointer.x = event.clientX;
    this.pointer.y = event.clientY;
  }

  private onWheel(event: WheelEvent): void {
    this.pointer.wheel += event.deltaY;
  }

  private requestPointerLock(): void {
    if (!this.pointer.pointerLocked) {
      void this.element.requestPointerLock();
    }
  }

  private onPointerLockChange(): void {
    this.pointer.pointerLocked = document.pointerLockElement === this.element;
  }

  public isPressed(code: string): boolean {
    return this.keys.get(code) ?? false;
  }

  public consumePointerDelta(): { dx: number; dy: number } {
    const { dx, dy } = this.pointer;
    this.pointer.dx = 0;
    this.pointer.dy = 0;
    return { dx, dy };
  }

  public consumeWheelDelta(): number {
    const { wheel } = this.pointer;
    this.pointer.wheel = 0;
    return wheel;
  }

  public getPointerState(): PointerState {
    return { ...this.pointer };
  }
}
