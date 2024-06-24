/* eslint-disable @typescript-eslint/no-explicit-any */
import Animated from 'react-native-reanimated';

const { Extrapolate, Value, createAnimatedComponent } = Animated;

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
    valueToBeUpdated: Animated.Value<AnimatedValue>,
    newValue: Animated.Adaptable<AnimatedValue>
  ): void => valueToBeUpdated.setValue(newValue);

  /**
   * Creates and returns an animated component.
   */
  public createAnimatedComponent = (component: any): any => createAnimatedComponent(component);

  /**
   * Interpolates the value based on inputRange.
   */
  public interpolateAnimation = (
    value: any,
    inputRange: number[],
    outputRange: Array<string | number>,
    extrapolate?: Animated.Extrapolate
  ): any =>
    value.interpolate({
      inputRange,
      outputRange,
      extrapolate: extrapolate || Extrapolate.CLAMP,
    });

  /**
   * Animates a color with passed rgb values.
   */
  public colorAnimation = (
    r: Animated.Adaptable<number>,
    g: Animated.Adaptable<number>,
    b: Animated.Adaptable<number>,
    opacity?: Animated.Node<number>
  ): Animated.Node<number> => Animated.color(r, g, b, opacity);
}

const animationService = new AnimationService();

export { animationService as AnimationService };

export default Animated;
