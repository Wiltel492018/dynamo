import test from 'ava';
import { signature, Typed, guard } from '../src/';

const typed = new Typed();

class Fish {
  @guard()
  static isFish(a: any): a is Fish {
    return a instanceof Fish;
  }

  constructor(public name: string) {}
}

typed.add(Fish);

test('implicit type', t => {
  class Fn {
    @signature()
    num(a: number, b: boolean) {
      return `a is the number ${a}, b is ${b.toString().toUpperCase()}`;
    }
  
    @signature()
    str(a: string) {
      return `a is "${a}"`;
    }

    @signature()
    fish(a: Fish) {
      return `a is a fish named ${a.name}`;
    }
  }
  
  const fn = typed.function(Fn);

  t.is(typeof fn, 'function');
  t.is(fn(15, true), 'a is the number 15, b is TRUE');
  t.is(fn('hello'), 'a is "hello"');
  t.is(fn(new Fish('wanda')), 'a is a fish named wanda');

  try {
    (fn as any)(42, 'false');
  } catch (err) {
    t.is(
      err.toString(),
      'TypeError: Unexpected type of argument in function Fn (expected: boolean, actual: string, index: 1)'
    );
  }

  t.is(fn.name, 'Fn');
  t.is(fn.length, 2);
});

test('explicit type, string', t => {
  class Fn {
    @signature()
    num(a: number, b: boolean) {
      return `a is the number ${a}, b is ${b.toString().toUpperCase()}`;
    }
  
    @signature()
    str(a: string) {
      return `a is "${a}"`;
    }

    @signature(['Fish'])
    fish(a: Fish) {
      return `a is a fish named ${a.name}`;
    }
  }
  
  const fn = typed.function(Fn);

  t.is(typeof fn, 'function');
  t.is(fn(15, true), 'a is the number 15, b is TRUE');
  t.is(fn('hello'), 'a is "hello"');
  t.is(fn(new Fish('wanda')), 'a is a fish named wanda');

  try {
    (fn as any)(42, 'false');
  } catch (err) {
    t.is(
      err.toString(),
      'TypeError: Unexpected type of argument in function Fn (expected: boolean, actual: string, index: 1)'
    );
  }

  t.is(fn.name, 'Fn');
  t.is(fn.length, 2);
});

test('explicit type, class', t => {
  class Fn {
    @signature()
    num(a: number, b: boolean) {
      return `a is the number ${a}, b is ${b.toString().toUpperCase()}`;
    }
  
    @signature()
    str(a: string) {
      return `a is "${a}"`;
    }

    @signature([Fish])
    fish(a: Fish) {
      return `a is a fish named ${a.name}`;
    }
  }
  
  const fn = typed.function(Fn);

  t.is(typeof fn, 'function');
  t.is(fn(15, true), 'a is the number 15, b is TRUE');
  t.is(fn('hello'), 'a is "hello"');
  t.is(fn(new Fish('wanda')), 'a is a fish named wanda');

  try {
    (fn as any)(42, 'false');
  } catch (err) {
    t.is(
      err.toString(),
      'TypeError: Unexpected type of argument in function Fn (expected: boolean, actual: string, index: 1)'
    );
  }

  t.is(fn.name, 'Fn');
  t.is(fn.length, 2);
});

class Tests {
  @guard('zero')
  static isZero({a}) {
    return a === 0;
  }

  @guard('negative')
  static isNegative({a}) {
    return a < 0;
  }
}

typed.add(Tests);

test('strings', t => {
  class Fn {
    @signature(['zero'])
    zero({a}): string {
      return `a is zero`;
    }

    @signature(['negative'])
    negative({a}): string {
      return `a is negative`;
    }

    @signature()
    num({a}): string {
      return `a is a number`;
    }
  }
  
  const fn = typed.function(Fn);

  t.is(fn({a: 10}), 'a is a number');
  t.is(fn({a: 0}), 'a is zero');
  t.is(fn({a: -10}), 'a is negative');
});
