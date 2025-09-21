import * as THREE from 'three';

export const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, value));
};

export const lerp = (a: number, b: number, t: number): number => {
  return a + (b - a) * clamp(t, 0, 1);
};

export const smoothDamp = (
  current: number,
  target: number,
  currentVelocity: { value: number },
  smoothTime: number,
  deltaTime: number,
  maxSpeed = Infinity
): number => {
  smoothTime = Math.max(0.0001, smoothTime);
  const omega = 2 / smoothTime;
  const x = omega * deltaTime;
  const exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
  let change = current - target;
  const originalTo = target;
  const maxChange = maxSpeed * smoothTime;
  change = clamp(change, -maxChange, maxChange);
  target = current - change;
  const temp = (currentVelocity.value + omega * change) * deltaTime;
  currentVelocity.value = (currentVelocity.value - omega * temp) * exp;
  let output = target + (change + temp) * exp;
  if ((originalTo - current > 0) === output > originalTo) {
    output = originalTo;
    currentVelocity.value = (output - originalTo) / deltaTime;
  }
  return output;
};

export const sphericalToCartesian = (radius: number, theta: number, phi: number): THREE.Vector3 => {
  const x = radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  return new THREE.Vector3(x, y, z);
};

export const degToRad = (degrees: number): number => degrees * (Math.PI / 180);

export const wrapAngle = (angle: number): number => {
  const pi = Math.PI;
  return angle - Math.floor((angle + pi) / (2 * pi)) * 2 * pi;
};
