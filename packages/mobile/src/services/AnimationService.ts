/* eslint-disable @typescript-eslint/no-explicit-any */
import Animated, { SharedValue } from 'react-native-reanimated';

import { Extrapolation } from 'react-native-reanimated';
import { interpolate } from 'react-native-reanimated';

const { createAnimatedComponent } = Animated;

export type AnimatedValue = string | number | boolean;
export type AnimatedAdaptable = Animated.Adaptable<AnimatedValue>;
export type AnimatedNode<T extends AnimatedValue> = Animated.Node<T>;

class AnimationService {
  /**
   * Sets an animated value.
   */
  public setAnimatedValue = (value: AnimatedValue): Animated.Value<string | number | boolean> => new Value(value);

  /**
   * Updates an animated value.
   */
  public updateAnimatedValue = (
    valueToBeUpdated: SharedValue<any>,
    newValue: Animated.Adaptable<AnimatedValue>
  ): void => (valueToBeUpdated.value += newValue);

  /**
   * Creates and returns an animated component.
   */
  public createAnimatedComponent = (component: any): any => createAnimatedComponent(component);

  /**
   * Interpolates the value based on inputRange.
   */
  public interpolateAnimation = (
    value: any,
    inputRange: readonly number[],
    outputRange: readonly number[],
    extrapolate?: Extrapolation
  ): any => interpolate(value, inputRange, outputRange, extrapolate || Extrapolation.CLAMP);

  /**
   * Animates a color with passed rgb values.
   */
  public colorAnimation = (r: any, g: any, b: any, opacity?: SharedValue<number>): AnimatedNode<number> => {
    const color = '';
    const result = color.concat(String(r), String(g), String(b), String(opacity));
    return result;
  };
}

const animationService = new AnimationService();

export { animationService as AnimationService };

export default Animated;
