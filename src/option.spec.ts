import {expect} from 'chai';
import {Some, None, Option} from './option';
import {Ok, Err} from './result';

describe('Function "Some"', () => {
  it('should create Option with value', () => {
    expect((<any>Some('some string')).value).to.be.eq('some string');
  });
});

describe('Function "None"', () => {
  it('should create Option without value', () => {
    expect((<any>None()).value).to.be.null;
  });
});

describe('Class "Option"', () => {
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
    it('should get the value if the Option is Some', () => {
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

    it('should get received value if the Option is None', () => {
      expect(none.unwrapOr(10)).to.be.eq(10);
    });
  });

  describe('unwrapOrElse', () => {
    it('should get the value if the Option is Some', () => {
      expect(some.unwrapOrElse(() => 10)).to.be.eq(20);
    });

    it('should get calculated value if the Option is None', () => {
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

    it('should get received value if the Option is None', () => {
      expect(none.mapOr(1, v => v + 20)).to.be.eq(1);
    });
  });

  describe('mapOrElse', () => {
    it('should map value in accordance with callback if the Option is Some', () => {
      expect(some.mapOrElse(() => 1, v => v + 20)).to.be.eq(40);
    });

    it('should get calculated value if the Option is None', () => {
      expect(none.mapOrElse(() => 1, v => v + 20)).to.be.eq(1);
    });
  });

  describe('match', () => {
    it('should match Some expression by type', () => {
      expect(some.match({
        Some: v => v + 10,
        None: () => 12
      })).to.be.eq(30);
    });

    it('should match None expression by type', () => {
      expect(none.match({
        Some: v => v + 10,
        None: () => 10
      })).to.be.eq(10)
    });
  });

  describe('okOr', () => {
    it('should get Ok of Result with the value if the Option is Some', () => {
      expect(some.okOr('error')).to.be.deep.eq(Ok(20));
    });

    it('should get Err of Result with received value if the Option is None', () => {
      expect(none.okOr('error')).to.be.deep.eq(Err('error'));
    });
  });

  describe('okOrElse', () => {
    it('should get Ok of Result if the Option is Some', () => {
      expect(some.okOrElse(() => 'error')).to.be.deep.eq(Ok(20));
    });

    it('should get Err of Result with received value if the Option is None', () => {
      expect(none.okOrElse(() => 'error')).to.be.deep.eq(Err('error'));
    });
  });

  describe('and', () => {
    it('should get received Option if the Option is Some', () => {
      expect(some.and(Some('str'))).to.be.deep.eq(Some('str'));
    });

    it('should get a None if the Option is None', () => {
      expect(none.and(Some('str'))).to.be.deep.eq(None());
    });
  });

  describe('andThen', () => {
    it('should get wrapped result of the callback if the Option is Some', () => {
      expect(some.andThen(v => Some(v + 10))).to.be.deep.eq(Some(30));
    });

    it('should get None if the Option is None', () => {
      expect(none.andThen(v => Some(v + 10))).to.be.deep.eq(None());
    });
  });

  describe('or', () => {
    it('should get the Option itself if the Option is Some', () => {
      expect(some.or(Some(50))).to.be.eq(some);
    });

    it('should get received Option if the Option is None', () => {
      expect(none.or(Some(50))).to.be.deep.eq(Some(50));
    });
  });

  describe('orElse', () => {
    it('should get the Option itself if the Option is Some', () => {
      expect(some.orElse(() => Some(50))).to.be.eq(some);
    });

    it('should get calculated Option if the Option is None', () => {
      expect(none.orElse(() => Some(50))).to.be.deep.eq(Some(50));
    });
  });
});
