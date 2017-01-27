import {expect} from 'chai';
import {Some, None, Option} from './option';

describe('Function `Some`', () => {
  it('should create Option with value', () => {
    expect((<any>Some('some string')).value).to.be.eq('some string');
  });
});

describe('Function `None`', () => {
  it('should create Option without value', () => {
    expect((<any>None()).value).to.be.null;
  });
});

describe('Class `Option`', () => {
  let some: Option<number>;
  let none: Option<number>;

  beforeEach(() => {
    some = Some(20);
    none = None();
  });

  describe('notifiers', () => {
    it('should show when the Option is Some', () => {
      expect(some.isSome).to.be.true;
      expect(none.isSome).not.to.be.true;
    });

    it('should show when the Option is None', () => {
      expect(none.isNone).to.be.true;
      expect(some.isNone).not.to.be.true;
    });
  });

  describe('expect', () => {
    it('should get the value the Option is Some', () => {
      expect(some.expect('value should be set')).to.be.eq(20);
    });

    it('should throw an error if the Option is None', () => {
      expect(() => none.expect('value should be set')).to.throw('value should be set');
    });
  });

  describe('unwrap', () => {
    it('should get the value if the Option is Some', () => {
      expect(some.unwrap()).to.be.eq(20);
    });

    it('should throw an error if the Option is None', () => {
      expect(() => none.unwrap()).to.throw(Error);
    });
  });

  describe('unwrapOr', () => {
    it('should get the value if the Option is Some', () => {
      expect(some.unwrapOr(10)).to.be.eq(20);
    });

    it('should get `or` value if the Option is None', () => {
      expect(none.unwrapOr(10)).to.be.eq(10);
    });
  });

  describe('unwrapOrElse', () => {
    it('should get the value if the Option is Some', () => {
      expect(some.unwrapOrElse(() => 10)).to.be.eq(20);
    });

    it('should process and return value if the Option is None', () => {
      expect(none.unwrapOrElse(() => 10)).to.be.eq(10);
    });
  });

  describe('map', () => {
    it('should map value in accordance with callback if the Option is Some', () => {
      expect(some.map(v => v + 20)).to.be.deep.eq(Some(40));
    });

    it('should get None if the Option is None', () => {
      expect(none.map(v => v + 20)).to.be.deep.eq(None());
    });
  });

  describe('mapOr', () => {
    it('should map value in accordance with callback if the Option is Some', () => {
      expect(some.mapOr(1, v => v + 20)).to.be.eq(40);
    });

    it('should get default value if the Option is None', () => {
      expect(none.mapOr(1, v => v + 20)).to.be.eq(1);
    });
  });

  describe('mapOrElse', () => {
    it('should map value in accordance with callback if the Option is Some', () => {
      expect(some.mapOrElse(() => 1, v => v + 20)).to.be.eq(40);
    });

    it('should get default value if the Option is None', () => {
      expect(none.mapOrElse(() => 1, v => v + 20)).to.be.eq(1);
    });
  });
});
